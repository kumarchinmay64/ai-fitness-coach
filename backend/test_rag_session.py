"""Offline test that ask_rag inserts the reliability session block into the prompt and adds
retrieval only for reliably observed problems. Heavy dependencies and the Gemini call are stubbed."""
import json
import sys
import types
import unittest
from pathlib import Path
from unittest import mock


def _stub_modules():
    faiss = types.ModuleType("faiss")
    faiss.read_index = lambda path: types.SimpleNamespace(ntotal=123, d=384, search=None)
    st = types.ModuleType("sentence_transformers")
    st.SentenceTransformer = lambda *a, **k: types.SimpleNamespace(encode=None)
    dotenv = types.ModuleType("dotenv"); dotenv.load_dotenv = lambda *a, **k: None
    google = types.ModuleType("google"); genai = types.ModuleType("google.genai")
    genai.Client = lambda *a, **k: object()
    gtypes = types.ModuleType("google.genai.types"); gtypes.HttpOptions = lambda **k: None
    gtypes.GenerateContentConfig = lambda **k: None
    errors = types.ModuleType("google.genai.errors")
    genai.types = gtypes; genai.errors = errors; google.genai = genai
    sys.modules.update({"faiss": faiss, "sentence_transformers": st, "dotenv": dotenv, "google": google,
                        "google.genai": genai, "google.genai.types": gtypes, "google.genai.errors": errors})


_stub_modules()
import os  # noqa: E402
os.environ.setdefault("GEMINI_API_KEY", "test-key-not-used")
import rag  # noqa: E402

SESSION = json.loads((Path(__file__).parent / "test_data_session_side.json").read_text()) \
    if (Path(__file__).parent / "test_data_session_side.json").exists() else {
    "schema": "session-reliability/1", "exercise": "squat", "camera_view": "oblique", "camera_yaw_deg": 32,
    "attempts": 5, "reps_counted": 0, "possible_uncounted_attempts": 5,
    "cues": {"depth": {"label": "squat depth", "analyzer_flagged": 5, "analyzer_passed": 0, "flagged_reliable": 0,
                       "passed_reliable": 0, "uncertain": 5, "not_observable": 0,
                       "main_reasons": ["camera_view_partial"], "recommended_view": "side-on"}},
}

FAKE_RESULT = {"derived_from": "rt_001", "evidence_text": "Squat depth evidence.", "score": 0.6,
               "source": {"organization": "ACSM", "year": 2026, "title": "t"}}


class TestRagSession(unittest.TestCase):
    def _run(self, session):
        captured = {}

        def fake_generate(**kwargs):
            captured["prompt"] = kwargs.get("prompt") or kwargs.get("contents")
            return types.SimpleNamespace(text="answer"), 10.0

        retrieve_calls = []

        def fake_retrieve(query, k=5, min_score=0.40, return_timings=False):
            retrieve_calls.append(query)
            res = [dict(FAKE_RESULT)]
            return (res, {"embed_ms": 1, "faiss_ms": 1}) if return_timings else res

        with mock.patch.object(rag, "retrieve", side_effect=fake_retrieve), \
                mock.patch.object(rag, "generate_with_retry", side_effect=fake_generate), \
                mock.patch.object(rag, "format_evidence_context", return_value="EVIDENCE"), \
                mock.patch.object(rag, "collect_sources", return_value=[]):
            try:
                rag.ask_rag("Why did the app tell me to go deeper?", profile=None, session=session)
            except Exception:
                pass  # formatting of the answer after generation is outside this test
        return captured.get("prompt", ""), retrieve_calls

    def test_session_block_and_policy_in_prompt(self):
        prompt, calls = self._run(SESSION)
        self.assertIn("MEASURED WORKOUT (FROM THE CAMERA)", prompt)
        self.assertIn("uncertain in 5", prompt)
        self.assertIn("count may be too low", prompt)
        self.assertIn("do not say whether the movement was right or wrong", prompt)
        self.assertEqual(len(calls), 1, "no extra retrieval for problems that were not reliably observed")

    def test_without_session_prompt_unchanged(self):
        prompt, calls = self._run(None)
        self.assertNotIn("MEASURED WORKOUT", prompt)
        self.assertEqual(len(calls), 1)

    def test_invalid_session_is_ignored(self):
        prompt, _ = self._run({"schema": "something-else"})
        self.assertNotIn("MEASURED WORKOUT", prompt)

    def test_reliable_flag_adds_retrieval(self):
        s = json.loads(json.dumps(SESSION))
        s["cues"]["depth"].update({"flagged_reliable": 3, "uncertain": 2})
        _, calls = self._run(s)
        self.assertEqual(calls[1], "squat depth range of motion technique")


if __name__ == "__main__":
    unittest.main()
