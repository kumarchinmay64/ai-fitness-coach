// Runs the project's real ExerciseAnalyzer (squat mode) and the reliability layer over the
// simulated sequences, and writes one row per performed repetition.
// Usage: node run_eval.mjs <data_dir> <out.csv> [--corrected]
//   --corrected  feeds the analyser aspect-corrected landmarks (x scaled to the pixel aspect),
//                to measure the effect of computing angles in normalised coordinates.
import fs from 'node:fs';
import path from 'node:path';
import { ExerciseAnalyzer } from '../../src/services/squatAnalyzer.js';
import { RepReliabilityTracker, AttemptDetector } from '../../src/services/reliability.js';

const [dir = 'data', outCsv = 'results_reps.csv'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const corrected = process.argv.includes('--corrected');
const ASPECT = 1280 / 720;
const fix = (lms) => lms.map((p) => ({ ...p, x: p.x * ASPECT / 2 + 0.05, y: p.y / 2 + 0.25 }));   // isotropic coordinates (same scale on x and y)

const rows = ['yaw,depth_label,seed,rep,true_min_knee,true_deep,record_type,analyzer_counted,analyzer_depth,measured_min_knee,est_yaw,depth_level,depth_action,depth_vis,depth_view_suit,depth_margin,uncounted_flag'];
const summaries = {};

for (const fn of fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(dir, fn)));
  const ex = new ExerciseAnalyzer('ex-1');
  const sq = ex.getActiveAnalyzer();
  // the tracker reproduces the analyser's geometry for cue angles (angleAspect 1 = normalised coordinates)
  const tr = new RepReliabilityTracker('squat', { angleAspect: 1, aspect: corrected ? 1 : ASPECT });
  const det = new AttemptDetector();
  const recs = [];
  let prevReps = 0, prevInc = 0, eventSinceAttempt = false;
  for (const fr of d.frames) {
    const lms = corrected ? fix(fr.landmarks) : fr.landmarks;
    const state = (sq.state || '').toUpperCase();
    const f = tr.addFrame(lms, state);
    const res = ex.processFrame(lms, fr.t);
    const attemptEnded = det.update(f.hipDrop);
    let ev = null;
    if (res.repCount > prevReps) ev = { type: 'rep', counted: true, depth: true };
    else if (res.incompleteReps > prevInc) ev = { type: 'incomplete', counted: false, depth: false };
    if (ev) ev.lean_ok = !(sq.formErrors || []).includes('torso_lean');
    prevReps = res.repCount; prevInc = res.incompleteReps;
    if (ev) {
      const rec = tr.endRep({ counted: ev.counted, analyzerVerdicts: { depth: ev.depth, torso_lean: ev.lean_ok } });
      recs.push({ t: fr.t, type: ev.type, ev, rec, minK: res.minKneeAngleInRep }); eventSinceAttempt = true;
    } else if (attemptEnded && !eventSinceAttempt && (sq.state === 'standing' || sq.state === 'untracked')) {
      const rec = tr.endRep({ counted: false });
      recs.push({ t: fr.t, type: 'unregistered', ev: null, rec, minK: null });
    }
    if (attemptEnded) eventSinceAttempt = false;
  }
  d.true_min_knee.forEach((tmin, i) => {
    const [s, e] = d.rep_windows_ms[i];
    const r = recs.find((x) => x.t >= s && x.t <= e + 1500);
    const base = [d.yaw, d.depth_label, d.seed, i + 1, tmin.toFixed(1), tmin <= 100 ? 1 : 0];
    if (!r) { rows.push([...base, 'none', 0, '', '', '', '', '', '', '', '', ''].join(',')); return; }
    const c = r.rec.cues.depth;
    rows.push([...base, r.type, r.ev ? +r.ev.counted : 0, r.ev ? +r.ev.depth : '', r.minK ?? '', r.rec.yaw_deg ?? '',
      c.level, c.action, c.visibility, c.view_suitability, c.margin, +r.rec.possible_uncounted_attempt].join(','));
  });
  if (d.seed === 0 && d.depth_label === 'deep') summaries[`yaw${d.yaw}`] = tr.summary();
}
fs.writeFileSync(outCsv, rows.join('\n'));
fs.writeFileSync(corrected ? 'session_summaries_deep_seed0_corrected.json' : 'session_summaries_deep_seed0.json', JSON.stringify(summaries, null, 2));
console.log('rows', rows.length - 1, corrected ? '(aspect-corrected input)' : '');
