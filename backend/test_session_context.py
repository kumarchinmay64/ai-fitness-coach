import json
import unittest
from pathlib import Path

from session_context import Condition, build_prompt, parse_summary, retrieval_queries, render_session_block

FRONT = {
    "schema": "session-reliability/1", "exercise": "squat", "camera_view": "front", "camera_yaw_deg": 6,
    "attempts": 5, "reps_counted": 0, "possible_uncounted_attempts": 5,
    "cues": {
        "depth": {"label": "squat depth", "analyzer_flagged": 5, "analyzer_passed": 0, "flagged_reliable": 0, "passed_reliable": 0, "uncertain": 0, "not_observable": 5,
                  "main_reasons": ["camera_view"], "recommended_view": "side-on"},
        "torso_lean": {"label": "torso lean", "flagged_reliable": 0, "passed_reliable": 0, "uncertain": 0, "not_observable": 5,
                       "main_reasons": ["camera_view"], "recommended_view": "side-on"},
    },
}

SIDE_FLAGGED = {
    **FRONT, "camera_view": "side", "camera_yaw_deg": 85, "reps_counted": 3, "possible_uncounted_attempts": 0,
    "cues": {
        "depth": {"label": "squat depth", "flagged_reliable": 2, "passed_reliable": 3, "uncertain": 0, "not_observable": 0,
                  "main_reasons": [], "recommended_view": "side-on"},
        "torso_lean": {"label": "torso lean", "flagged_reliable": 0, "passed_reliable": 5, "uncertain": 0, "not_observable": 0,
                       "main_reasons": [], "recommended_view": "side-on"},
    },
}


class TestSessionContext(unittest.TestCase):
    def test_rejects_unknown_schema(self):
        with self.assertRaises(Exception):
            parse_summary({**FRONT, "schema": "other/9"})

    def test_unobservable_flags_add_no_retrieval_query(self):
        self.assertEqual(retrieval_queries(parse_summary(FRONT)), [])

    def test_reliable_flag_adds_retrieval_query(self):
        self.assertEqual(retrieval_queries(parse_summary(SIDE_FLAGGED)), ["squat depth range of motion technique"])

    def test_reliability_block_mentions_view_and_uncounted(self):
        txt = render_session_block(parse_summary(FRONT), Condition.RELIABILITY)
        self.assertIn("not observable in 5", txt)
        self.assertIn("side-on", txt)
        self.assertIn("count may be too low", txt)

    def test_verdict_only_block_hides_reliability(self):
        txt = render_session_block(parse_summary(FRONT), Condition.VERDICT_ONLY)
        self.assertNotIn("observable", txt)
        self.assertIn("flagged in 5", txt)

    def test_conditions_differ_only_in_session_block_and_policy(self):
        s = parse_summary(FRONT)
        a = build_prompt("Was my squat deep enough?", ["e1"], "goal: strength", s, Condition.VERDICT_ONLY, base_rules="RULES")
        c = build_prompt("Was my squat deep enough?", ["e1"], "goal: strength", s, Condition.RELIABILITY, base_rules="RULES")
        d = build_prompt("Was my squat deep enough?", ["e1"], "goal: strength", s, Condition.ABSTAIN_ONLY, base_rules="RULES")
        for p in (a, c, d):
            self.assertTrue(p.startswith("RULES"))
            self.assertTrue(p.endswith("QUESTION:\nWas my squat deep enough?"))
        self.assertIn("do not say whether the movement was right or wrong", c)
        self.assertIn("If you are unsure", d)
        self.assertNotIn("If you are unsure", a)

    def test_simulation_summaries_parse(self):
        p = Path(__file__).resolve().parent.parent / "research" / "reliability_sim" / "session_summaries_deep_seed0.json"
        if p.exists():
            for s in json.loads(p.read_text()).values():
                parse_summary(s)


if __name__ == "__main__":
    unittest.main()
