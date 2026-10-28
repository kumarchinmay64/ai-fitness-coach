"""
Retrieval verification for the evidence corpus.

Run from the backend directory after dependencies are installed and ingest.py
has built the index.
"""

from __future__ import annotations

import json
from pathlib import Path

import faiss
from sentence_transformers import SentenceTransformer

BASE = Path(__file__).resolve().parent
INDEX_PATH = BASE / "index" / "fitness.index"
DOCS_PATH = BASE / "index" / "documents.json"

MODEL_NAME = "all-MiniLM-L6-v2"

QUERIES = [
    "protein intake for muscle growth",
    "sets and reps for hypertrophy",
    "home resistance training",
    "progressive overload",
    "healthy diet",
    "hydration",
    "weight loss",
    "exercise with an injury",
]


def main():
    model = SentenceTransformer(MODEL_NAME)
    index = faiss.read_index(str(INDEX_PATH))
    docs = json.loads(DOCS_PATH.read_text(encoding="utf-8"))

    for query in QUERIES:
        q = model.encode([query], normalize_embeddings=True, convert_to_numpy=True).astype("float32")
        scores, ids = index.search(q, 5)

        print("\n" + "=" * 80)
        print("QUERY:", query)
        for rank, (score, idx) in enumerate(zip(scores[0], ids[0]), 1):
            d = docs[int(idx)]
            s = d["source"]
            print(
                f"{rank}. score={score:.4f} | {d['id']} | {d['topic']} | "
                f"{s['organization']} ({s['publication_year']})"
            )
            print("   ", d["evidence_text"][:350].replace("\n", " "))
            print("   ", s["title"])
            if s.get("doi"):
                print("   DOI:", s["doi"])
            if s.get("pmid"):
                print("   PMID:", s["pmid"])


if __name__ == "__main__":
    main()
