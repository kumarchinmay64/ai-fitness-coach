import json

import faiss
from sentence_transformers import SentenceTransformer


# Load the embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


# Load FAISS index
index = faiss.read_index("index/fitness.index")


# Load original documents
with open("index/documents.json", "r", encoding="utf-8") as f:
    documents = json.load(f)


def retrieve(query, k=3):
    # Convert the user's question into an embedding
    query_embedding = model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    # Search FAISS
    scores, indices = index.search(query_embedding, k)

    results = []

    for score, idx in zip(scores[0], indices[0]):
        if idx == -1:
            continue

        results.append({
            "score": float(score),
            "topic": documents[idx]["topic"],
            "source": documents[idx]["source"],
            "text": documents[idx]["text"]
        })

    return results


# Test question
query = input("Ask a fitness question: ")

results = retrieve(query)


print("\n===== RETRIEVED KNOWLEDGE =====\n")

for i, result in enumerate(results, 1):
    print(f"Result {i}")
    print(f"Similarity: {result['score']:.4f}")
    print(f"Topic: {result['topic']}")
    print(f"Source: {result['source']}")
    print(f"Text: {result['text']}")
    print("-" * 60)