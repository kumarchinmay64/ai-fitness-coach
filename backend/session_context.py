"""session_context.py — reliability-aware hand-off of workout measurements to the RAG assistant.

The browser sends the session summary produced by RepReliabilityTracker.summary()
(schema "session-reliability/1") together with the chat question. This module

  1. validates the summary (pydantic),
  2. derives extra retrieval queries for cues that were *reliably* flagged, so that the
     assistant retrieves evidence about the problem the camera actually observed,
  3. renders a prompt block that states each measurement with its reliability level, and
  4. builds the prompt under one of four experimental conditions, so that the effect of the
     reliability information can be separated from the effect of a generic abstention instruction.

It does not call the language model; rag.py keeps that responsibility and inserts the session block into its own prompt.
"""
from __future__ import annotations

from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field, field_validator


class CueSummary(BaseModel):
    label: str
    analyzer_flagged: int = Field(ge=0, default=0)
    analyzer_passed: int = Field(ge=0, default=0)
    flagged_reliable: int = Field(ge=0)
    passed_reliable: int = Field(ge=0)
    uncertain: int = Field(ge=0)
    not_observable: int = Field(ge=0)
    main_reasons: List[str] = []
    recommended_view: Optional[str] = None


class SessionSummary(BaseModel):
    schema_: str = Field(alias="schema")
    exercise: str
    camera_view: str
    camera_yaw_deg: Optional[float] = None
    attempts: int = Field(ge=0)
    reps_counted: int = Field(ge=0)
    possible_uncounted_attempts: int = Field(ge=0, default=0)
    cues: Dict[str, CueSummary]

    @field_validator("schema_")
    @classmethod
    def _known_schema(cls, v: str) -> str:
        if v != "session-reliability/1":
            raise ValueError(f"unsupported session schema {v!r}")
        return v


class Condition(str, Enum):
    """Prompt conditions for the planned ablation (Section 11.6 of the paper)."""
    VERDICT_ONLY = "A_verdict_only"            # what the system does today, plus the verdicts
    RAW_VISIBILITY = "B_verdict_raw_visibility"  # verdicts plus raw landmark visibility, no levels
    RELIABILITY = "C_reliability_aware"        # verdicts with reliability levels and reasons
    ABSTAIN_ONLY = "D_abstain_instruction_only"  # verdicts plus a generic 'say if unsure' rule


REASON_TEXT = {
    "camera_view": "the camera angle did not show this movement",
    "camera_view_partial": "the camera angle only partly showed this movement",
    "occlusion": "the joints involved were hidden",
    "low_visibility": "the joints involved were only partly visible",
    "unstable": "the measurement was jittery",
    "borderline": "the value was close to the threshold",
    "not_tracked": "the joints were not tracked",
}

# Retrieval queries for reliably observed problems (verdict False with HIGH reliability).
CUE_QUERIES = {
    ("squat", "depth"): "squat depth range of motion technique",
    ("squat", "torso_lean"): "squat trunk forward lean technique",
    ("pushup", "depth"): "push-up range of motion technique",
    ("deadlift", "hinge_depth"): "romanian deadlift hip hinge range of motion",
    ("deadlift", "knee_bend"): "romanian deadlift knee flexion hip hinge technique",
    ("curl", "peak"): "biceps curl full range of motion",
    ("lunge", "depth"): "lunge depth technique",
    ("lunge", "torso"): "lunge upright torso technique",
    ("plank", "body_line"): "plank body alignment hip position",
}


def parse_summary(data: dict) -> SessionSummary:
    return SessionSummary.model_validate(data)


def retrieval_queries(s: SessionSummary) -> List[str]:
    """Extra retrieval queries for problems the camera observed reliably. Unreliable flags add
    no query, so that evidence about a problem the system could not see is not pulled in."""
    out = []
    for name, c in s.cues.items():
        if c.flagged_reliable > 0 and (s.exercise, name) in CUE_QUERIES:
            out.append(CUE_QUERIES[(s.exercise, name)])
    return out


def _reasons(c: CueSummary) -> str:
    return "; ".join(REASON_TEXT.get(r, r) for r in c.main_reasons) or "no specific reason recorded"


def render_session_block(s: SessionSummary, condition: Condition, raw_visibility: Optional[Dict[str, float]] = None) -> str:
    """Text block describing the measured workout under the given experimental condition."""
    lines = [f"MEASURED WORKOUT (camera, {s.exercise}): {s.reps_counted} repetitions counted out of {s.attempts} attempts."]
    if condition == Condition.RELIABILITY:
        lines.append(f"Camera view: {s.camera_view}" + (f" (about {round(s.camera_yaw_deg)}° from facing the camera)." if s.camera_yaw_deg is not None else "."))
        if s.possible_uncounted_attempts:
            lines.append(f"{s.possible_uncounted_attempts} movement(s) looked like attempts but were not counted; the count may be too low.")
    for name, c in s.cues.items():
        if condition == Condition.RELIABILITY:
            lines.append(
                f"- {c.label}: reliably observed and flagged in {c.flagged_reliable}, reliably observed and fine in {c.passed_reliable}, "
                f"uncertain in {c.uncertain}, not observable in {c.not_observable} repetition(s)."
                + (f" Reason: {_reasons(c)}. Best camera position: {c.recommended_view}." if (c.uncertain or c.not_observable) else "")
            )
        else:
            # conditions A, B, D see only the analyzer's verdicts, as the current system would report them
            lines.append(f"- {c.label}: flagged in {c.analyzer_flagged} repetition(s), fine in {c.analyzer_passed}.")
            if condition == Condition.RAW_VISIBILITY and raw_visibility and name in raw_visibility:
                lines.append(f"  (mean landmark visibility for this measurement: {raw_visibility[name]:.2f} on a 0–1 scale)")
    return "\n".join(lines)


POLICY_RELIABILITY = """How to use the measured workout:
1. State findings marked 'reliably observed' plainly and explain them with the retrieved evidence.
2. For 'uncertain' findings, say the measurement was borderline or partly visible and phrase advice conditionally.
3. For 'not observable' findings, do not say whether the movement was right or wrong. Say why it could not be judged and how to position the camera to check it next time.
4. If attempts may not have been counted, say the count may be too low rather than telling the user they did too few repetitions.
5. Never present a camera measurement as a medical or injury judgement."""

POLICY_ABSTAIN_ONLY = """If you are unsure about something, say so instead of guessing."""


def build_prompt(question: str, evidence: List[str], profile_text: str, s: Optional[SessionSummary],
                 condition: Condition = Condition.RELIABILITY, base_rules: str = "",
                 raw_visibility: Optional[Dict[str, float]] = None) -> str:
    """Assemble the grounded prompt for the ablation harness. `base_rules` is the existing rule block from rag.py, kept
    identical across conditions so that only the session block and policy differ."""
    parts = [base_rules.strip()] if base_rules else []
    parts.append("RETRIEVED EVIDENCE:\n" + ("\n\n".join(f"[{i + 1}] {e}" for i, e in enumerate(evidence)) or "(none)"))
    if profile_text:
        parts.append("USER PROFILE:\n" + profile_text)
    if s is not None:
        parts.append(render_session_block(s, condition, raw_visibility))
        if condition == Condition.RELIABILITY:
            parts.append(POLICY_RELIABILITY)
        elif condition == Condition.ABSTAIN_ONLY:
            parts.append(POLICY_ABSTAIN_ONLY)
    parts.append("QUESTION:\n" + question)
    return "\n\n".join(parts)
