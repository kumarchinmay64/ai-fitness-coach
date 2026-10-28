import os
import json
import time
import random
from pathlib import Path

import faiss
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from google import genai
from google.genai import errors, types
from datetime import datetime, timezone


def _log_rag(stage: str, message: str, **kwargs):
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
    extra = (" | " + " ".join(f"{k}={v}" for k, v in kwargs.items())) if kwargs else ""
    print(f"[{now_str}] [Backend RAG] [{stage}] {message}{extra}", flush=True)


# ==================================================
# PATHS
# ==================================================

BASE = Path(__file__).resolve().parent

INDEX_PATH = BASE / "index" / "fitness.index"
DOCS_PATH = BASE / "index" / "documents.json"


# ==================================================
# ENVIRONMENT
# ==================================================

load_dotenv(BASE / ".env")

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY was not found in backend/.env"
    )


# ==================================================
# GEMINI
# ==================================================

client = genai.Client(
    api_key=api_key,
    http_options=types.HttpOptions(timeout=20000),
)


# ==================================================
# EMBEDDING MODEL
# ==================================================

print("Loading embedding model...")

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

EXPECTED_EMBEDDING_DIMENSION = 384


# ==================================================
# FAISS INDEX
# ==================================================

if not INDEX_PATH.exists():
    raise FileNotFoundError(
        "FAISS index not found. Run: python ingest.py"
    )

if not DOCS_PATH.exists():
    raise FileNotFoundError(
        "documents.json not found. Run: python ingest.py"
    )


index = faiss.read_index(str(INDEX_PATH))

with open(DOCS_PATH, "r", encoding="utf-8") as f:
    documents = json.load(f)


# ==================================================
# INDEX VALIDATION
# ==================================================

if index.ntotal != len(documents):
    raise ValueError(
        "FAISS/document mismatch: "
        f"{index.ntotal} vectors vs "
        f"{len(documents)} documents."
    )


if index.d != EXPECTED_EMBEDDING_DIMENSION:
    raise ValueError(
        "Unexpected embedding dimension: "
        f"{index.d}. Expected "
        f"{EXPECTED_EMBEDDING_DIMENSION} "
        "for all-MiniLM-L6-v2."
    )


print(
    f"Loaded {len(documents)} evidence chunks."
)

print(
    f"FAISS index contains {index.ntotal} vectors."
)

print(
    f"Embedding dimension: {index.d}"
)


# ==================================================
# RETRIEVAL
# ==================================================

def retrieve(
    query,
    k=5,
    min_score=0.40,
    return_timings=False
):
    """
    Retrieve the most relevant unique evidence records.

    The corpus contains three retrieval views for many
    evidence records:

        core
        scope
        boundary

    These views may have different IDs but share the
    same 'derived_from' identifier.

    We retrieve extra candidates and deduplicate them
    so the final context contains diverse evidence.
    """
    t_ret_start = time.time()
    _log_rag("RETRIEVE_START", f"Starting retrieval for query: '{query[:80]}'")

    t_emb_start = time.time()
    _log_rag("EMBED_START", "Generating query embedding with all-MiniLM-L6-v2")
    query_embedding = embedding_model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True
    ).astype("float32")
    t_emb_ms = (time.time() - t_emb_start) * 1000
    _log_rag("EMBED_COMPLETE", f"Embedding generated in {t_emb_ms:.2f}ms", dim=query_embedding.shape[1])


    # --------------------------------------------------
    # RETRIEVE EXTRA CANDIDATES
    # --------------------------------------------------

    candidate_k = min(
        max(k * 3, 12),
        index.ntotal
    )

    t_faiss_start = time.time()
    _log_rag("FAISS_START", f"Searching FAISS index (candidate_k={candidate_k}, ntotal={index.ntotal})")
    scores, indices = index.search(
        query_embedding,
        candidate_k
    )
    t_faiss_ms = (time.time() - t_faiss_start) * 1000
    _log_rag("FAISS_COMPLETE", f"FAISS search completed in {t_faiss_ms:.2f}ms")


    # --------------------------------------------------
    # BUILD UNIQUE RESULTS
    # --------------------------------------------------

    results = []

    seen_evidence = set()


    for score, idx in zip(
        scores[0],
        indices[0]
    ):

        if idx == -1:
            continue


        score = float(score)


        if score < min_score:
            continue


        document = documents[int(idx)]


        # --------------------------------------------------
        # DEDUPLICATION
        # --------------------------------------------------
        #
        # Example:
        #
        # rt_012_core
        # rt_012_scope
        # rt_012_boundary
        #
        # all originate from the same evidence record.
        #
        # Prefer 'derived_from' when available.
        #

        evidence_key = document.get(
            "derived_from",
            document["id"]
        )


        if evidence_key in seen_evidence:
            continue


        seen_evidence.add(evidence_key)


        results.append({
            "score": score,
            "id": document["id"],
            "derived_from": evidence_key,
            "topic": document["topic"],
            "population": document["population"],
            "evidence_text": document["evidence_text"],
            "tags": document.get(
                "tags",
                []
            ),
            "quantitative_claims_present": document.get(
                "quantitative_claims_present",
                False
            ),
            "safety_boundary": document.get(
                "safety_boundary"
            ),
            "source": document["source"]
        })


        if len(results) >= k:
            break

    total_ret_ms = (time.time() - t_ret_start) * 1000
    _log_rag(
        "RETRIEVAL_SUMMARY",
        f"Retrieved {len(results)} evidence chunks above threshold {min_score} in {total_ret_ms:.2f}ms",
        doc_count=len(results),
        duration_ms=f"{total_ret_ms:.2f}"
    )

    if return_timings:
        return results, {
            "embed_ms": round(t_emb_ms, 2),
            "faiss_ms": round(t_faiss_ms, 2),
            "retrieval_ms": round(total_ret_ms, 2),
        }

    return results


# ==================================================
# PROFILE FORMATTER
# ==================================================

def format_profile(profile):

    if not profile:
        return (
            "No user profile information is available."
        )


    field_labels = {
        "age": "Age",
        "gender": "Gender",
        "heightCm": "Height",
        "weightKg": "Weight",
        "fitnessLevel": "Fitness Level",
        "goal": "Primary Goal",
        "workoutFrequency": "Workout Frequency",
        "equipment": "Available Equipment",
        "injuries": (
            "Injuries / Physical Limitations"
        )
    }


    profile_lines = []


    for field, label in field_labels.items():

        value = profile.get(field)


        if value is not None and value != "":
            profile_lines.append(
                f"{label}: {value}"
            )


    if not profile_lines:
        return (
            "No user profile information is available."
        )


    return "\n".join(profile_lines)


# ==================================================
# SOURCE FORMATTER
# ==================================================

def format_source(source):

    organization = source.get(
        "organization",
        "Unknown organization"
    )

    title = source.get(
        "title",
        "Unknown publication"
    )

    year = source.get(
        "publication_year",
        ""
    )

    pmid = source.get("pmid")

    doi = source.get("doi")


    output = (
        f"{organization}. "
        f"{title} ({year})."
    )


    if pmid:
        output += f" PMID: {pmid}."


    if doi:
        output += f" DOI: {doi}."


    return output


# ==================================================
# SOURCE COLLECTION
# ==================================================

def collect_sources(results):

    sources = []

    seen_sources = set()


    for result in results:

        source = result["source"]

        source_text = format_source(
            source
        )


        if source_text not in seen_sources:

            seen_sources.add(
                source_text
            )

            sources.append(
                source_text
            )


    return sources


# ==================================================
# EVIDENCE CONTEXT FORMATTER
# ==================================================

def format_evidence_context(results):

    context_parts = []


    for result in results:

        source_text = format_source(
            result["source"]
        )


        evidence_block = (
            f"Topic: {result['topic']}\n"
            f"Population: {result['population']}\n"
            f"Evidence: {result['evidence_text']}\n"
            f"Safety boundary: "
            f"{result['safety_boundary']}\n"
            f"Quantitative claims present: "
            f"{result['quantitative_claims_present']}\n"
            f"Source: {source_text}"
        )


        context_parts.append(
            evidence_block
        )


    return "\n\n".join(
        context_parts
    )


# ==================================================
# RESILIENCY & RETRY HELPERS
# ==================================================

def is_transient_error(err: Exception) -> bool:
    """
    Checks if an error is a transient rate limit (HTTP 429) or server error (HTTP 5xx).
    Fails fast for non-transient client/auth/not-found errors.
    """
    if isinstance(err, errors.APIError):
        code = getattr(err, "code", None)
        if code == 429:
            return True
        if code and 500 <= code < 600:
            return True
        return False

    err_str = str(err).lower()
    if any(k in err_str for k in ["429", "resource_exhausted", "503", "unavailable", "timeout", "connection reset"]):
        return True

    return False


def is_auth_or_permission_error(err: Exception) -> bool:
    """
    Checks if an error is due to invalid credentials, missing API key, or permission denial (401/403).
    """
    if isinstance(err, errors.APIError):
        code = getattr(err, "code", None)
        if code in (401, 403):
            return True

    err_str = str(err).lower()
    if any(k in err_str for k in ["401", "403", "unauthenticated", "forbidden", "permission_denied", "api_key_invalid"]):
        return True

    return False


def is_invalid_model_error(err: Exception) -> bool:
    """
    Checks if an error is HTTP 404 NOT_FOUND (unsupported, invalid, or retired model ID).
    """
    if isinstance(err, errors.APIError):
        code = getattr(err, "code", None)
        if code == 404:
            return True

    err_str = str(err).lower()
    if any(k in err_str for k in ["404", "not_found", "is not found", "no longer available"]):
        return True

    return False


def generate_with_retry(
    gemini_client,
    model_name: str,
    contents: str,
    max_retries: int = 1,
    base_delay: float = 0.5,
    max_delay: float = 2.0,
    timeout_ms: int = 18000,
):
    """
    Executes model generation with bounded timeout and retry policy.
    Fails fast without retry on non-transient, invalid-model, or deadline-exceeded errors.
    """
    for attempt in range(max_retries + 1):
        t_call_start = time.time()
        _log_rag(
            "GEMINI_REQUEST_START",
            f"Calling model '{model_name}' (attempt {attempt + 1}/{max_retries + 1}, timeout={timeout_ms}ms)"
        )
        try:
            response = gemini_client.models.generate_content(
                model=model_name,
                contents=contents,
                config=types.GenerateContentConfig(
                    http_options=types.HttpOptions(timeout=timeout_ms)
                ),
            )
            call_ms = (time.time() - t_call_start) * 1000
            _log_rag(
                "GEMINI_REQUEST_COMPLETE",
                f"Model '{model_name}' responded successfully in {call_ms:.2f}ms",
                model=model_name,
                duration_ms=f"{call_ms:.2f}"
            )
            return response, call_ms
        except Exception as err:
            call_ms = (time.time() - t_call_start) * 1000

            # 1. Fatal auth/permission or invalid model: fail fast to next fallback
            if is_auth_or_permission_error(err) or is_invalid_model_error(err):
                _log_rag(
                    "RETRY_OR_FALLBACK",
                    f"Permanent error on model '{model_name}': {err}. Halting retries on this model.",
                    model=model_name
                )
                raise err

            # 2. Timeout or 504 Deadline Exceeded: fail fast immediately to next fallback
            err_str = str(err).lower()
            if "504" in err_str or "deadline" in err_str or "timeout" in err_str:
                _log_rag(
                    "RETRY_OR_FALLBACK",
                    f"Model '{model_name}' timed out after {call_ms:.2f}ms ({err}). Failing fast to next fallback model.",
                    model=model_name
                )
                raise err

            # 3. Transient rate-limit (429) or 503: bounded retry
            if is_transient_error(err) and attempt < max_retries:
                jitter = random.uniform(0.1, 0.3)
                delay = min(max_delay, base_delay * (2 ** attempt)) + jitter
                _log_rag(
                    "RETRY_OR_FALLBACK",
                    f"Transient error on '{model_name}': {err}. Retrying in {delay:.2f}s...",
                    attempt=attempt + 1,
                    delay_s=f"{delay:.2f}"
                )
                time.sleep(delay)
                continue

            _log_rag(
                "GEMINI_REQUEST_FAIL",
                f"Model '{model_name}' call failed after {call_ms:.2f}ms: {err}",
                model=model_name
            )
            raise err


# ==================================================
# RAG + GEMINI
# ==================================================

def ask_rag(
    question,
    profile=None,
    return_metadata=False,
):
    t_ask_start = time.time()
    _log_rag("ASK_RAG_START", f"Processing question: '{question[:80]}'")

    # --------------------------------------------------
    # RETRIEVE
    # --------------------------------------------------

    results, ret_timings = retrieve(
        question,
        k=5,
        min_score=0.40,
        return_timings=True,
    )


    # --------------------------------------------------
    # NO EVIDENCE
    # --------------------------------------------------

    if not results:
        no_evidence_msg = (
            "I don't have enough evidence in my current "
            "fitness guidance to answer that confidently. "
            "I don't want to guess."
        )
        _log_rag("NO_EVIDENCE", "No relevant evidence chunks found above threshold")
        if return_metadata:
            return no_evidence_msg, {
                "timings": ret_timings,
                "sources": [],
            }
        return no_evidence_msg


    # --------------------------------------------------
    # BUILD CONTEXT
    # --------------------------------------------------

    context = format_evidence_context(
        results
    )


    # --------------------------------------------------
    # USER PROFILE
    # --------------------------------------------------

    user_profile = format_profile(
        profile
    )


    # --------------------------------------------------
    # GROUNDED PROMPT
    # --------------------------------------------------

    prompt = f"""
You are an evidence-grounded AI fitness coach.

Your job is to provide practical fitness, workout,
nutrition, diet, recovery, and safety guidance using
ONLY the retrieved published evidence provided below.

You may personalize recommendations using the user's
profile, but personalization must remain within the
population and safety boundaries of the retrieved
evidence.

==================================================
USER PROFILE
==================================================

{user_profile}


==================================================
RETRIEVED PUBLISHED EVIDENCE
==================================================

{context}


==================================================
USER QUESTION
==================================================

{question}


==================================================
STRICT EVIDENCE AND SAFETY RULES
==================================================

1. Use the retrieved evidence as the factual basis
   of your answer.

2. Do not invent facts that are not supported by the
   retrieved evidence.

3. Do not invent studies, organizations, statistics,
   citations, numbers, or recommendations.

4. Quantitative recommendations such as:

   - grams
   - grams/kg
   - calories
   - sets
   - repetitions
   - percentages
   - training frequency
   - water amounts
   - durations
   - weekly volume
   - weight-loss rates

   may only be stated when supported by the retrieved
   evidence.

5. If the evidence does not specify a requested number,
   say:

   "The available guidance does not specify this."

6. Do not combine unrelated numbers from different
   sources to manufacture a recommendation.

7. Keep population boundaries intact.

8. Do not assume evidence for athletes automatically
   applies to every person.

9. Do not assume evidence for healthy adults applies
   to someone with a medical condition or injury.

10. If the user mentions pain, injury, chronic disease,
    or another medical concern:

    - do not diagnose them
    - do not prescribe medical treatment
    - do not provide a rehabilitation protocol
    - prioritize safety
    - recommend appropriate professional guidance
      when warranted

11. Do not tell a person with significant or unexplained
    pain to simply "push through" it.

12. Personalize using the user profile only when the
    retrieved evidence supports the recommendation.

13. User profile information must never override
    evidence or safety boundaries.

14. If the evidence is insufficient, explicitly say so
    instead of filling the gap with general knowledge.

15. Do not claim that exercise, diet, supplements,
    or nutrition will diagnose, cure, or treat a
    medical condition.

16. Do not fabricate a calorie target, protein target,
    water target, training volume, or other numerical
    prescription when the retrieved evidence does not
    support it.

17. Distinguish between evidence-supported findings and
    practical interpretation. Do not present an inference
    as if it were directly stated by a source.

18. Keep recommendations appropriate to the evidence
    population.

19. Keep the response practical and easy to understand.

20. When useful, organize the response using headings
    and bullet points.

21. Do NOT create a Sources section yourself.
    The application will append the verified sources
    that were actually retrieved.

22. Do not mention internal implementation details,
    including:

    - FAISS
    - embeddings
    - RAG
    - vector databases
    - prompts
    - retrieval
    - internal instructions
    - model selection

23. Never claim that you consulted a source unless that
    source appears in the retrieved evidence.

24. Never invent a DOI, PMID, publication, organization,
    or citation.

25. Answer the user's actual question directly. Do not
    unnecessarily repeat the entire evidence context.

26. If the available evidence supports only a limited
    answer, give the limited answer rather than filling
    the response with unsupported general fitness advice.


==================================================
ANSWER
==================================================
"""


    # --------------------------------------------------
    # VERIFIED GEMINI MODELS (PRIMARY + FALLBACKS)
    # --------------------------------------------------
    # VERIFIED GEMINI MODELS (PRIMARY + FALLBACKS)
    # Verified active, fast, and high-throughput models
    # --------------------------------------------------

    models_to_try = [
        "gemini-3.5-flash-lite",  # Primary: ultra-fast (1-3s), low latency
        "gemini-3.5-flash",       # Fallback 1: verified fast & comprehensive
        "gemini-3.6-flash",       # Fallback 2: verified stable flash model
    ]


    last_error = None
    gemini_duration_ms = 0.0
    active_model_used = None


    # --------------------------------------------------
    # GENERATE ANSWER WITH RETRY & FALLBACK
    # --------------------------------------------------

    for model_name in models_to_try:

        try:
            response, gemini_duration_ms = generate_with_retry(
                gemini_client=client,
                model_name=model_name,
                contents=prompt,
                max_retries=1,
                base_delay=0.4,
                max_delay=2.0,
                timeout_ms=18000,
            )

            active_model_used = model_name
            answer = response.text.strip()


            # --------------------------------------------------
            # APPEND VERIFIED SOURCES
            # --------------------------------------------------

            sources = collect_sources(
                results
            )


            if sources:

                answer += (
                    "\n\n### Sources\n"
                )

                for source in sources:

                    answer += (
                        f"- {source}\n"
                    )

            total_pipeline_ms = (time.time() - t_ask_start) * 1000
            _log_rag(
                "ASK_RAG_COMPLETE",
                f"Completed RAG answer using '{active_model_used}' in {total_pipeline_ms:.2f}ms",
                model=active_model_used,
                total_ms=f"{total_pipeline_ms:.2f}",
                gemini_ms=f"{gemini_duration_ms:.2f}",
                retrieval_ms=f"{ret_timings['retrieval_ms']:.2f}"
            )

            if return_metadata:
                metadata = {
                    "model": active_model_used,
                    "sources": sources,
                    "timings": {
                        "embed_ms": ret_timings["embed_ms"],
                        "faiss_ms": ret_timings["faiss_ms"],
                        "retrieval_ms": ret_timings["retrieval_ms"],
                        "gemini_ms": round(gemini_duration_ms, 2),
                        "total_ms": round(total_pipeline_ms, 2),
                    }
                }
                return answer, metadata

            return answer


        except Exception as error:

            last_error = error

            # 1. Fatal Auth/Permission Error: halt cascade immediately
            if is_auth_or_permission_error(error):
                code = getattr(error, "code", "Auth")
                _log_rag(
                    "AUTH_ERROR_HALT",
                    f"Authentication/permission error ({code}) on {model_name}. Halting fallback chain."
                )
                raise RuntimeError(
                    f"Gemini API authentication/permission failure ({code}). "
                    "Please check your GEMINI_API_KEY and Google AI Studio project status."
                ) from error

            # 2. Invalid Model ID or Timeout: log and switch immediately
            _log_rag(
                "MODEL_FALLBACK",
                f"Model '{model_name}' failed: {error}. Falling back to next available model..."
            )
            continue


    # --------------------------------------------------
    # ALL MODELS FAILED
    # --------------------------------------------------

    if last_error:
        raise last_error

    raise RuntimeError(
        "No Gemini model was available."
    )


# ==================================================
# COMMAND LINE TEST
# ==================================================

if __name__ == "__main__":

    question = input(
        "Ask your AI fitness coach: "
    )


    answer = ask_rag(
        question
    )


    print(
        "\n===== AI FITNESS COACH =====\n"
    )


    print(answer)