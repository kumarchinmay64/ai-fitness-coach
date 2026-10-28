"""ablation_harness.py — generate (and optionally run) the four prompt conditions for the
language-feedback experiment described in Section 11.6 of the paper.

Usage:
  python ablation_harness.py scenarios.json out_dir            # write prompts only
  python ablation_harness.py scenarios.json out_dir --call     # also call Gemini (needs GEMINI_API_KEY)

scenarios.json: a list of {"id", "question", "session": <session summary>, "evidence": [..],
"profile": "...", "raw_visibility": {cue: value}}. Evidence should come from the project's own
retrieve() so that all conditions see identical passages.
Outputs one JSON line per (scenario, condition) with the prompt, model name, date and answer,
ready for blind rating of unsupported or over-confident claims.
"""
import datetime as dt
import json
import os
import sys

from session_context import Condition, build_prompt, parse_summary

BASE_RULES_PATH = os.environ.get("BASE_RULES_PATH")  # optional: file holding rag.py's 16 rules verbatim


def main(scen_path, out_dir, call=False, model="gemini-3.5-flash-lite"):
    os.makedirs(out_dir, exist_ok=True)
    base = open(BASE_RULES_PATH).read() if BASE_RULES_PATH else ""
    scenarios = json.load(open(scen_path))
    client = None
    if call:
        from google import genai  # imported lazily so prompt generation needs no key
        client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    with open(os.path.join(out_dir, "runs.jsonl"), "w") as f:
        for sc in scenarios:
            s = parse_summary(sc["session"])
            for cond in Condition:
                prompt = build_prompt(sc["question"], sc.get("evidence", []), sc.get("profile", ""), s, cond, base, sc.get("raw_visibility"))
                rec = {"scenario": sc["id"], "condition": cond.value, "prompt": prompt, "model": model,
                       "date": dt.datetime.now(dt.timezone.utc).isoformat()}
                if client is not None:
                    resp = client.models.generate_content(model=model, contents=prompt, config={"temperature": 0})
                    rec["answer"] = resp.text
                f.write(json.dumps(rec) + "\n")
    print("wrote", os.path.join(out_dir, "runs.jsonl"))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], call="--call" in sys.argv)
