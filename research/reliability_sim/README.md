# Reliability-aware coaching hand-off (Gap 3 proof of concept)

Simulation used to evaluate the reliability layer (src/services/reliability.js) together with
the project's real ExerciseAnalyzer. The layer is already wired into LiveWorkoutPage.jsx,
aiService.js, backend/main.py and backend/rag.py on the branch feature/reliability-layer.

## Contents

| Path | What it is |
|---|---|
| `src/services/reliability.js` | View estimation, per-cue observability, gating of feedback, attempt detector, session summary |
| `src/services/reliability.test.js` | 11 unit tests (run with `npm test`) |
| `backend/session_context.py` | Validates the session summary, adds retrieval queries, renders the prompt block, builds the four ablation conditions |
| `backend/test_session_context.py` | 7 unit tests (`python -m unittest`) |
| `backend/ablation_harness.py` | Generates (and optionally runs) the four prompt conditions for the language experiment |
| `backend/test_rag_session.py` | 4 offline tests of the prompt integration in rag.py |
| `research/reliability_sim/` | Synthetic squat generator, evaluation runner, analysis and figures |

## Reproducing the simulation

```bash
cd research/reliability_sim
python3 squat_sim.py data                                   # 150 sequences, 750 repetitions
node run_eval.mjs data results_reps.csv                     # analyser as implemented (normalised coordinates)
node run_eval.mjs data results_reps_corrected.csv --corrected   # with the aspect-ratio correction
python3 analyze.py results_reps_corrected.csv corr_ && python3 figures.py corr_results_reps_enriched.csv
python3 fig_angle.py && python3 aspect_effect.py
```
