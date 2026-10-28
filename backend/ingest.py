"""
Evidence-corpus ingestion for the AI Fitness Coach RAG.

Usage:
    python ingest.py

Reads:
    backend/data/knowledge.json

Writes:
    backend/index/fitness.index
    backend/index/documents.json

The documents.json file preserves the full source metadata for every indexed chunk.
The FAISS index uses normalized embeddings with IndexFlatIP, so similarity is cosine
similarity when the same normalization is applied at query time.
"""

from __future__ import annotations

import json
from pathlib import Path

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

BASE = Path(__file__).resolve().parent
DATA_PATH = BASE / "data" / "knowledge.json"
INDEX_DIR = BASE / "index"
INDEX_PATH = INDEX_DIR / "fitness.index"
DOCS_PATH = INDEX_DIR / "documents.json"

MODEL_NAME = "all-MiniLM-L6-v2"


def build_search_text(chunk: dict) -> str:
    source = chunk["source"]
    tags = ", ".join(chunk.get("tags", []))
    population = chunk.get("population", "general")
    return (
        f"Topic: {chunk['topic']}\n"
        f"Population: {population}\n"
        f"Tags: {tags}\n"
        f"Evidence: {chunk['evidence_text']}\n"
        f"Source: {source['organization']}. {source['title']} ({source['publication_year']}).\n"
    )


def main() -> None:
    corpus = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    chunks = corpus["chunks"]

    model = SentenceTransformer(MODEL_NAME)
    texts = [build_search_text(c) for c in chunks]

    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
        convert_to_numpy=True,
        show_progress_bar=True,
    ).astype("float32")

    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)

    INDEX_DIR.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(INDEX_PATH))

    # Keep every field needed for grounded generation/citations.
    documents = []
    for i, chunk in enumerate(chunks):
        documents.append({
            "index": i,
            "id": chunk["id"],
            "topic": chunk["topic"],
            "population": chunk["population"],
            "evidence_text": chunk["evidence_text"],
            "tags": chunk.get("tags", []),
            "quantitative_claims_present": chunk.get("quantitative_claims_present", False),
            "safety_boundary": chunk.get("safety_boundary"),
            "source": chunk["source"],
            "search_text": texts[i],
        })

    DOCS_PATH.write_text(
        json.dumps(documents, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print(f"Indexed {len(documents)} evidence chunks.")
    print(f"FAISS index: {INDEX_PATH}")
    print(f"Metadata:    {DOCS_PATH}")


if __name__ == "__main__":
    main()
