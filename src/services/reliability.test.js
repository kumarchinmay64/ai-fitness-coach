// Unit tests for the reliability layer. Run with: node --test src/services/reliability.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { angle2D, estimateYaw, viewSuitability, viewLabel, RepReliabilityTracker, AttemptDetector, LM } from './reliability.js';

const ASPECT = 1280 / 720;
const P = (x, y, visibility = 0.95) => ({ x: x / ASPECT, y, z: 0, visibility });  // x given on the aspect-corrected scale

/** A synthetic 33-landmark body. `widthScale` 1 = facing camera, 0 = side-on. `knee` = knee angle in the image plane. */
function body({ widthScale = 1, knee = 175, farVis = 0.95 } = {}) {
  const lm = Array.from({ length: 33 }, () => P(0.5, 0.5, 0.0));
  const torso = 0.25, sw = 0.66 * 2 * torso * 0.58 * widthScale, hw = 0.66 * 2 * torso * 0.42 * widthScale;
  const hipY = 0.55, cx = 0.9;
  lm[LM.L_SHOULDER] = P(cx + sw / 2, hipY - torso); lm[LM.R_SHOULDER] = P(cx - sw / 2, hipY - torso, farVis);
  lm[LM.L_HIP] = P(cx + hw / 2, hipY); lm[LM.R_HIP] = P(cx - hw / 2, hipY, farVis);
  // knee straight below hip, ankle placed to produce the requested knee angle in the image plane
  const th = (180 - knee) * Math.PI / 180, L = 0.2;
  for (const [h, k, a, s, v] of [[LM.L_HIP, LM.L_KNEE, LM.L_ANKLE, 1, 0.95], [LM.R_HIP, LM.R_KNEE, LM.R_ANKLE, -1, farVis]]) {
    const hx = lm[h].x * ASPECT;
    lm[k] = P(hx, hipY + L, v);
    lm[a] = P(hx + L * Math.sin(th), hipY + L + L * Math.cos(th), v);
  }
  return lm;
}

test('angle2D returns 90 for a right angle and null for coincident points', () => {
  assert.equal(Math.round(angle2D(P(0, 0), P(0, 1), P(1, 1), ASPECT)), 90);
  assert.equal(angle2D(P(0, 0), P(0, 0), P(1, 1), ASPECT), null);
});

test('estimateYaw distinguishes front, oblique and side views', () => {
  assert.ok(estimateYaw(body({ widthScale: 1 })) < 10);
  const oblique = estimateYaw(body({ widthScale: Math.cos(Math.PI / 4) }));
  assert.ok(oblique > 35 && oblique < 55, `oblique ${oblique}`);
  assert.ok(estimateYaw(body({ widthScale: 0.02 })) > 80);
  assert.equal(viewLabel(5), 'front'); assert.equal(viewLabel(45), 'oblique'); assert.equal(viewLabel(85), 'side');
});

test('viewSuitability favours side views for sagittal cues and front views for frontal cues', () => {
  assert.ok(viewSuitability('sagittal', 90) > 0.99 && viewSuitability('sagittal', 0) < 0.01);
  assert.ok(viewSuitability('frontal', 0) > 0.99 && viewSuitability('frontal', 90) < 0.01);
});

function runRep(tracker, opts, kneeMin, n = 40) {
  for (let i = 0; i <= n; i++) {
    const k = 175 - (175 - kneeMin) * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / n));
    tracker.addFrame(body({ ...opts, knee: k }), 'DESCENDING');
  }
}

test('side view with clear depth gives a HIGH-reliability depth verdict that may be stated', () => {
  const tr = new RepReliabilityTracker('squat');
  runRep(tr, { widthScale: 0.02 }, 80);
  const rec = tr.endRep({ counted: true, analyzerVerdicts: { depth: true } });
  assert.equal(rec.view, 'side');
  assert.equal(rec.cues.depth.level, 'HIGH');
  assert.equal(rec.cues.depth.action, 'state');
});

test('front view makes the depth cue LOW and withholds it even with a large decision margin', () => {
  const tr = new RepReliabilityTracker('squat');
  runRep(tr, { widthScale: 1 }, 80);
  const rec = tr.endRep({ counted: false, analyzerVerdicts: { depth: false } });
  assert.equal(rec.cues.depth.level, 'LOW');
  assert.equal(rec.cues.depth.action, 'withhold');
  assert.ok(rec.cues.depth.margin > 2, 'margin is large, so margin alone would not have caught this');
  assert.ok(rec.cues.depth.reasons.includes('camera_view'));
});

test('verdicts close to the threshold are downgraded to MEDIUM (borderline)', () => {
  const tr = new RepReliabilityTracker('squat');
  runRep(tr, { widthScale: 0.02 }, 99);
  const rec = tr.endRep({ counted: true, analyzerVerdicts: { depth: true } });
  assert.equal(rec.cues.depth.level, 'MEDIUM');
  assert.ok(rec.cues.depth.reasons.includes('borderline'));
});

test('occluded cue landmarks lower reliability', () => {
  const tr = new RepReliabilityTracker('squat');
  const lmSeq = [175, 140, 80, 140, 175].map((k) => { const b = body({ widthScale: 0.02, knee: k }); for (const i of [LM.L_HIP, LM.L_KNEE, LM.L_ANKLE, LM.R_HIP, LM.R_KNEE, LM.R_ANKLE]) b[i].visibility = 0.55; return b; });
  lmSeq.forEach((b) => tr.addFrame(b, 'DESCENDING'));
  const rec = tr.endRep({ counted: true, analyzerVerdicts: { depth: true } });
  assert.equal(rec.cues.depth.level, 'LOW');
  assert.ok(rec.cues.depth.reasons.includes('occlusion'));
});

test('feedbackFor withholds and asks for a better view when reliability is LOW', () => {
  const msg = RepReliabilityTracker.feedbackFor({ action: 'withhold', label: 'squat depth', view_hint: 'side-on' }, { verdict: 'Descend deeper!' });
  assert.match(msg, /turn side-on/);
  assert.equal(RepReliabilityTracker.feedbackFor({ action: 'state' }, { verdict: 'Good depth!' }), 'Good depth!');
});

test('AttemptDetector reports one attempt per drop-and-return of the hips', () => {
  const det = new AttemptDetector();
  const seq = [0, 0.1, 0.3, 0.4, 0.3, 0.1, 0.05, 0, 0.3, 0.05];
  assert.equal(seq.filter((v) => det.update(v)).length, 2);
});

test('summary separates reliable flags from uncertain and unobservable verdicts', () => {
  const tr = new RepReliabilityTracker('squat');
  runRep(tr, { widthScale: 0.02 }, 80); tr.endRep({ counted: true, analyzerVerdicts: { depth: true } });
  runRep(tr, { widthScale: 0.02 }, 120); tr.endRep({ counted: false, analyzerVerdicts: { depth: false } });
  runRep(tr, { widthScale: 1 }, 80); tr.endRep({ counted: false, analyzerVerdicts: { depth: false } });
  const s = tr.summary();
  assert.equal(s.schema, 'session-reliability/1');
  assert.equal(s.attempts, 3); assert.equal(s.reps_counted, 1);
  assert.equal(s.cues.depth.passed_reliable, 1);
  assert.equal(s.cues.depth.flagged_reliable, 1);
  assert.equal(s.cues.depth.not_observable, 1);
});

test('toIsotropic removes the aspect-ratio distortion of angles in normalised coordinates', async () => {
  const { toIsotropic, calculateJointAngle } = await import('./poseDetection.js');
  const a = 16 / 9;
  // pixel points: A(0,0) B(0,100) C(100,200) -> true image angle at B is 135 degrees
  const px = [[0, 0], [0, 100], [100, 200]].map(([x, y]) => ({ x: x / 1280, y: y / 720, visibility: 1 }));
  const distorted = calculateJointAngle(px[0], px[1], px[2]);
  const [A, B, C] = toIsotropic(px, a);
  const fixed = calculateJointAngle(A, B, C);
  assert.equal(fixed, 135);
  assert.notEqual(distorted, 135);
});
