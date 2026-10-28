import urllib.request
import json
import time

questions = [
    "What is progressive overload, and how can I apply it to my strength training?",
    "How much daily protein is recommended for muscle hypertrophy in healthy adults?",
    "What is the recommended hydration strategy during prolonged exercise?"
]

for i, q in enumerate(questions, 1):
    print(f"\n{'='*70}")
    print(f"TEST QUESTION {i}: {q}")
    print(f"{'='*70}")
    t0 = time.time()
    req = urllib.request.Request(
        "http://127.0.0.1:8000/chat",
        data=json.dumps({"message": q}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    t_total = time.time() - t0
    print(f"HTTP Client Roundtrip Duration: {t_total:.2f}s ({t_total*1000:.1f}ms)")
    timings = data.get("timings", {})
    print(f"Stage Breakdown:")
    print(f"  - Embedding: {timings.get('embed_ms', 0)} ms")
    print(f"  - FAISS search: {timings.get('faiss_ms', 0)} ms")
    print(f"  - Total retrieval: {timings.get('retrieval_ms', 0)} ms")
    print(f"  - Gemini model: {timings.get('gemini_ms', 0)} ms")
    print(f"  - Backend total: {timings.get('total_ms', 0)} ms")
    print(f"Retrieved Sources ({len(data.get('sources', []))}):")
    for s in data.get("sources", []):
        print(f"  * {s}")
    print("\nActual Answer:")
    print(data.get("answer"))
