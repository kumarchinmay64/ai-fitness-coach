import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateJointAngle, POSE_LANDMARKS } from './poseDetection.js';
import {
  SquatAnalyzer,
  PushupAnalyzer,
  CurlAnalyzer,
  DeadliftAnalyzer,
  LungeAnalyzer,
  PlankAnalyzer,
  ExerciseAnalyzer,
  SQUAT_STATES,
  DEADLIFT_STATES,
  LUNGE_STATES,
  PLANK_STATES,
} from './squatAnalyzer.js';

/**
 * Helper to generate a 33-landmark array with specific coordinates on the left/right side
 */
function createMockPose({
  kneeAngle = 170,
  hipAngle = 170,
  visibility = 0.95,
  side = 'left',
} = {}) {
  const landmarks = Array.from({ length: 33 }, () => ({
    x: 0.5,
    y: 0.5,
    z: 0,
    visibility: 0.1,
  }));

  const kneeX = 0.5;
  const kneeY = 0.6;
  const ankleX = 0.5;
  const ankleY = 0.9;

  const rad = ((180 - kneeAngle) * Math.PI) / 180;
  const femurLen = 0.3;
  const hipX = kneeX - femurLen * Math.sin(rad);
  const hipY = kneeY - femurLen * Math.cos(rad);

  const shoulderX = hipX;
  const shoulderY = hipY - 0.25;

  if (side === 'left') {
    landmarks[POSE_LANDMARKS.LEFT_SHOULDER] = { x: shoulderX, y: shoulderY, visibility };
    landmarks[POSE_LANDMARKS.LEFT_HIP] = { x: hipX, y: hipY, visibility };
    landmarks[POSE_LANDMARKS.LEFT_KNEE] = { x: kneeX, y: kneeY, visibility };
    landmarks[POSE_LANDMARKS.LEFT_ANKLE] = { x: ankleX, y: ankleY, visibility };
  } else {
    landmarks[POSE_LANDMARKS.RIGHT_SHOULDER] = { x: shoulderX, y: shoulderY, visibility };
    landmarks[POSE_LANDMARKS.RIGHT_HIP] = { x: hipX, y: hipY, visibility };
    landmarks[POSE_LANDMARKS.RIGHT_KNEE] = { x: kneeX, y: kneeY, visibility };
    landmarks[POSE_LANDMARKS.RIGHT_ANKLE] = { x: ankleX, y: ankleY, visibility };
  }

  return landmarks;
}

/**
 * Helper to feed realistic video frame streams to allow EMA filter convergence
 */
function feedFrames(analyzer, poseOptions, startTime, count = 4, intervalMs = 33) {
  let res;
  let t = startTime;
  for (let i = 0; i < count; i++) {
    res = analyzer.processFrame(createMockPose(poseOptions), t);
    t += intervalMs;
  }
  return { res, nextTime: t };
}

function createMockArmPose({ elbowAngle = 90, visibility = 0.95 } = {}) {
  const landmarks = Array.from({ length: 33 }, () => ({
    x: 0.5,
    y: 0.5,
    z: 0,
    visibility: 0.1,
  }));

  const shoulderX = 0.5, shoulderY = 0.3;
  const elbowX = 0.5, elbowY = 0.6;
  const rad = ((180 - elbowAngle) * Math.PI) / 180;
  const wristX = elbowX + 0.3 * Math.sin(rad);
  const wristY = elbowY + 0.3 * Math.cos(rad);

  landmarks[POSE_LANDMARKS.LEFT_SHOULDER] = { x: shoulderX, y: shoulderY, visibility };
  landmarks[POSE_LANDMARKS.LEFT_ELBOW] = { x: elbowX, y: elbowY, visibility };
  landmarks[POSE_LANDMARKS.LEFT_WRIST] = { x: wristX, y: wristY, visibility };

  landmarks[POSE_LANDMARKS.RIGHT_SHOULDER] = { x: shoulderX, y: shoulderY, visibility };
  landmarks[POSE_LANDMARKS.RIGHT_ELBOW] = { x: elbowX, y: elbowY, visibility };
  landmarks[POSE_LANDMARKS.RIGHT_WRIST] = { x: wristX, y: wristY, visibility };

  return landmarks;
}

function feedArmFrames(analyzer, armOptions, startTime, count = 4, intervalMs = 33) {
  let res;
  let t = startTime;
  for (let i = 0; i < count; i++) {
    res = analyzer.processFrame(createMockArmPose(armOptions), t);
    t += intervalMs;
  }
  return { res, nextTime: t };
}

function createMockHingePose({
  hipAngle = 165,
  kneeAngle = 160,
  visibility = 0.95,
  side = 'left',
} = {}) {
  const landmarks = Array.from({ length: 33 }, () => ({
    x: 0.5,
    y: 0.5,
    z: 0,
    visibility: 0.1,
  }));

  const kneeX = 0.5;
  const kneeY = 0.6;
  const ankleX = 0.5;
  const ankleY = 0.9;
  const radKnee = ((180 - kneeAngle) * Math.PI) / 180;
  const femurLen = 0.3;
  const hipX = kneeX - femurLen * Math.sin(radKnee);
  const hipY = kneeY - femurLen * Math.cos(radKnee);

  const theta_hk = Math.atan2(kneeY - hipY, kneeX - hipX);
  const theta_hs = theta_hk + (hipAngle * Math.PI) / 180;
  const shoulderX = hipX + 0.3 * Math.cos(theta_hs);
  const shoulderY = hipY + 0.3 * Math.sin(theta_hs);

  if (side === 'left') {
    landmarks[POSE_LANDMARKS.LEFT_SHOULDER] = { x: shoulderX, y: shoulderY, visibility };
    landmarks[POSE_LANDMARKS.LEFT_HIP] = { x: hipX, y: hipY, visibility };
    landmarks[POSE_LANDMARKS.LEFT_KNEE] = { x: kneeX, y: kneeY, visibility };
    landmarks[POSE_LANDMARKS.LEFT_ANKLE] = { x: ankleX, y: ankleY, visibility };
  } else {
    landmarks[POSE_LANDMARKS.RIGHT_SHOULDER] = { x: shoulderX, y: shoulderY, visibility };
    landmarks[POSE_LANDMARKS.RIGHT_HIP] = { x: hipX, y: hipY, visibility };
    landmarks[POSE_LANDMARKS.RIGHT_KNEE] = { x: kneeX, y: kneeY, visibility };
    landmarks[POSE_LANDMARKS.RIGHT_ANKLE] = { x: ankleX, y: ankleY, visibility };
  }

  return landmarks;
}

function feedHingeFrames(analyzer, hingeOptions, startTime, count = 4, intervalMs = 33) {
  let res;
  let t = startTime;
  for (let i = 0; i < count; i++) {
    res = analyzer.processFrame(createMockHingePose(hingeOptions), t);
    t += intervalMs;
  }
  return { res, nextTime: t };
}

function createMockPlankPose({
  alignment = 'straight',
  visibility = 0.95,
  side = 'left',
} = {}) {
  const landmarks = Array.from({ length: 33 }, () => ({
    x: 0.5,
    y: 0.5,
    z: 0,
    visibility: 0.1,
  }));

  const shoulder = { x: 0.2, y: 0.5 };
  const ankle = { x: 0.8, y: 0.5 };
  let hip;
  if (alignment === 'straight') {
    hip = { x: 0.5, y: 0.5 };
  } else if (alignment === 'sagging') {
    hip = { x: 0.5, y: 0.62 };
  } else {
    hip = { x: 0.5, y: 0.38 };
  }

  if (side === 'left') {
    landmarks[POSE_LANDMARKS.LEFT_SHOULDER] = { ...shoulder, visibility };
    landmarks[POSE_LANDMARKS.LEFT_HIP] = { ...hip, visibility };
    landmarks[POSE_LANDMARKS.LEFT_ANKLE] = { ...ankle, visibility };
  } else {
    landmarks[POSE_LANDMARKS.RIGHT_SHOULDER] = { ...shoulder, visibility };
    landmarks[POSE_LANDMARKS.RIGHT_HIP] = { ...hip, visibility };
    landmarks[POSE_LANDMARKS.RIGHT_ANKLE] = { ...ankle, visibility };
  }

  return landmarks;
}

function feedPlankFrames(analyzer, plankOptions, startTime, count = 4, intervalMs = 33) {
  let res;
  let t = startTime;
  for (let i = 0; i < count; i++) {
    res = analyzer.processFrame(createMockPlankPose(plankOptions), t);
    t += intervalMs;
  }
  return { res, nextTime: t };
}

// ============================================================================
// 1. ANGLE CALCULATION TESTS
// ============================================================================

test('calculateJointAngle computes accurate angles for standard geometric vertices', () => {
  const pA = { x: 0, y: 1, visibility: 0.9 };
  const pB = { x: 0, y: 0, visibility: 0.9 };
  const pC = { x: 1, y: 0, visibility: 0.9 };
  assert.strictEqual(calculateJointAngle(pA, pB, pC), 90);

  const pStraight = { x: 0, y: -1, visibility: 0.9 };
  assert.strictEqual(calculateJointAngle(pA, pB, pStraight), 180);

  const p45 = { x: 1, y: 1, visibility: 0.9 };
  assert.strictEqual(calculateJointAngle(pA, pB, p45), 45);
});

test('calculateJointAngle rejects landmarks with visibility below confidence threshold', () => {
  const pA = { x: 0, y: 1, visibility: 0.9 };
  const pB = { x: 0, y: 0, visibility: 0.3 };
  const pC = { x: 1, y: 0, visibility: 0.9 };
  assert.strictEqual(calculateJointAngle(pA, pB, pC, 0.5), null);
});

test('calculateJointAngle safely handles null or undefined points', () => {
  assert.strictEqual(calculateJointAngle(null, { x: 0, y: 0 }, { x: 1, y: 0 }), null);
  assert.strictEqual(calculateJointAngle({ x: 0, y: 1 }, null, { x: 1, y: 0 }), null);
  assert.strictEqual(calculateJointAngle({ x: 0, y: 1 }, { x: 0, y: 0 }, null), null);
});

// ============================================================================
// 2. STATE MACHINE: VALID COMPLETE SQUAT REPETITION
// ============================================================================

test('SquatAnalyzer tracks full repetition lifecycle and counts exactly 1 repetition', () => {
  const analyzer = new SquatAnalyzer();
  let t = 1000;

  // 1. Initial State -> Standing calibration (170°)
  let { res, nextTime } = feedFrames(analyzer, { kneeAngle: 170 }, t, 4);
  t = nextTime;
  assert.strictEqual(res.state, SQUAT_STATES.STANDING);
  assert.strictEqual(res.repCount, 0);

  // 2. Descending (knee flexes past 130° down to 110°)
  t += 250;
  ({ res, nextTime } = feedFrames(analyzer, { kneeAngle: 110 }, t, 4));
  t = nextTime;
  assert.strictEqual(res.state, SQUAT_STATES.DESCENDING);
  assert.strictEqual(res.repCount, 0);

  // 3. Bottom Position (reaches 90° <= targetDepth 100°)
  t += 300;
  ({ res, nextTime } = feedFrames(analyzer, { kneeAngle: 90 }, t, 4));
  t = nextTime;
  assert.strictEqual(res.state, SQUAT_STATES.BOTTOM);
  assert.strictEqual(res.repCount, 0);

  // 4. Ascending (pushes up past 115°)
  t += 300;
  ({ res, nextTime } = feedFrames(analyzer, { kneeAngle: 125 }, t, 4));
  t = nextTime;
  assert.strictEqual(res.state, SQUAT_STATES.ASCENDING);
  assert.strictEqual(res.repCount, 0);

  // 5. Standing Lockout (reaches 165° >= standingKneeMin 148°)
  t += 300;
  ({ res, nextTime } = feedFrames(analyzer, { kneeAngle: 165 }, t, 4));
  assert.strictEqual(res.state, SQUAT_STATES.STANDING);
  assert.strictEqual(res.repCount, 1);
  assert.ok(res.formScore >= 90, `Expected high form score, got: ${res.formScore}`);
});

test('SquatAnalyzer counts consecutive repetitions accurately', () => {
  const analyzer = new SquatAnalyzer();
  let t = 1000;

  // Rep 1
  let step = feedFrames(analyzer, { kneeAngle: 170 }, t, 4);
  t = step.nextTime + 250;
  step = feedFrames(analyzer, { kneeAngle: 110 }, t, 4);
  t = step.nextTime + 300;
  step = feedFrames(analyzer, { kneeAngle: 88 }, t, 4);
  t = step.nextTime + 300;
  step = feedFrames(analyzer, { kneeAngle: 125 }, t, 4);
  t = step.nextTime + 300;
  step = feedFrames(analyzer, { kneeAngle: 165 }, t, 4);
  assert.strictEqual(step.res.repCount, 1);

  // Rep 2 (after minTimeBetweenReps)
  t = step.nextTime + 900;
  step = feedFrames(analyzer, { kneeAngle: 110 }, t, 4);
  t = step.nextTime + 300;
  step = feedFrames(analyzer, { kneeAngle: 90 }, t, 4);
  t = step.nextTime + 300;
  step = feedFrames(analyzer, { kneeAngle: 125 }, t, 4);
  t = step.nextTime + 300;
  step = feedFrames(analyzer, { kneeAngle: 165 }, t, 4);
  assert.strictEqual(step.res.repCount, 2);
  assert.strictEqual(analyzer.repScores.length, 2);
});

// ============================================================================
// 3. PARTIAL REPETITIONS & DEPTH REJECTION
// ============================================================================

test('SquatAnalyzer rejects incomplete partial reps (quarter squat) without counting', () => {
  const analyzer = new SquatAnalyzer();
  let t = 1000;

  let step = feedFrames(analyzer, { kneeAngle: 170 }, t, 4);
  t = step.nextTime + 250;

  // Descend only to 125° (shallow, above bottom target of <= 100°)
  step = feedFrames(analyzer, { kneeAngle: 125 }, t, 4);
  assert.strictEqual(analyzer.state, SQUAT_STATES.DESCENDING);

  // Immediately stand back up to 165° without hitting bottom
  t = step.nextTime + 300;
  step = feedFrames(analyzer, { kneeAngle: 165 }, t, 4);

  assert.strictEqual(step.res.repCount, 0, 'Partial rep must NOT be counted');
  assert.strictEqual(step.res.incompleteReps, 1, 'Incomplete rep counter must increment');
  assert.strictEqual(step.res.state, SQUAT_STATES.STANDING);
});

// ============================================================================
// 4. NOISE & THRESHOLD OSCILLATION (HYSTERESIS)
// ============================================================================

test('SquatAnalyzer does not trigger false state switches during noisy threshold jitter', () => {
  const analyzer = new SquatAnalyzer();
  let t = 1000;

  let step = feedFrames(analyzer, { kneeAngle: 170 }, t, 4);
  t = step.nextTime;

  for (let i = 0; i < 10; i++) {
    t += 33;
    const jitterAngle = 144 + (i % 2 === 0 ? 2 : -1);
    const res = analyzer.processFrame(createMockPose({ kneeAngle: jitterAngle }), t);
    assert.strictEqual(res.state, SQUAT_STATES.STANDING, 'Should stay in standing state during minor jitter');
    assert.strictEqual(res.repCount, 0);
  }
});

test('SquatAnalyzer rejects unrealistically fast glitch movements (anti-bounce velocity limit)', () => {
  const analyzer = new SquatAnalyzer({ minRepDurationMs: 800 });
  let t = 1000;

  let step = feedFrames(analyzer, { kneeAngle: 170 }, t, 4);
  t = step.nextTime;

  // Entire movement cycle completed in only 100ms
  t += 20; analyzer.processFrame(createMockPose({ kneeAngle: 110 }), t);
  t += 20; analyzer.processFrame(createMockPose({ kneeAngle: 85 }), t);
  t += 20; analyzer.processFrame(createMockPose({ kneeAngle: 125 }), t);
  t += 20; const res = analyzer.processFrame(createMockPose({ kneeAngle: 165 }), t);

  assert.strictEqual(res.repCount, 0, 'Glitch fast cycle under minRepDurationMs must be rejected');
});

// ============================================================================
// 5. TRACKING LOSS HANDLING
// ============================================================================

test('SquatAnalyzer resets state safely when tracking is lost mid-movement', () => {
  const analyzer = new SquatAnalyzer({ trackingLossTimeoutMs: 1000 });
  let t = 1000;

  let step = feedFrames(analyzer, { kneeAngle: 170 }, t, 4);
  t = step.nextTime + 200;
  step = feedFrames(analyzer, { kneeAngle: 110 }, t, 4);
  assert.strictEqual(analyzer.state, SQUAT_STATES.DESCENDING);

  // Tracking lost for 1500ms > timeout (1000ms)
  t = step.nextTime + 1500;
  const res = analyzer.processFrame(null, t);

  assert.strictEqual(res.state, SQUAT_STATES.UNTRACKED);
  assert.strictEqual(res.repCount, 0);
  assert.strictEqual(res.currentAngle, null);
});

// ============================================================================
// 6. FORM SCORE CALCULATION
// ============================================================================

test('SquatAnalyzer produces null form score before reps and objective score after reps', () => {
  const analyzer = new SquatAnalyzer({ targetDepthKneeMax: 100 });
  assert.strictEqual(analyzer.getFormScore(), null, 'Form score must be null before any reps completed');

  let t = 1000;
  let step = feedFrames(analyzer, { kneeAngle: 170 }, t, 4);
  t = step.nextTime + 250;
  step = feedFrames(analyzer, { kneeAngle: 110 }, t, 4);
  t = step.nextTime + 300;
  step = feedFrames(analyzer, { kneeAngle: 88 }, t, 4);
  t = step.nextTime + 300;
  step = feedFrames(analyzer, { kneeAngle: 125 }, t, 4);
  t = step.nextTime + 300;
  step = feedFrames(analyzer, { kneeAngle: 165 }, t, 4);

  assert.strictEqual(step.res.repCount, 1);
  assert.strictEqual(typeof step.res.formScore, 'number');
  assert.ok(step.res.formScore >= 90);
});

// ============================================================================
// 7. PUSHUP & BICEP CURL ANALYZER TESTS
// ============================================================================

test('PushupAnalyzer tracks chest depth and arm lockout to count repetitions', () => {
  const pushup = new PushupAnalyzer();
  let t = 1000;

  // 1. Initial extended arm lockout (155°)
  let step = feedArmFrames(pushup, { elbowAngle: 155 }, t, 4);
  assert.strictEqual(pushup.repCount, 0);

  // 2. Descending chest towards ground (<= 90°)
  t = step.nextTime + 250;
  step = feedArmFrames(pushup, { elbowAngle: 110 }, t, 4);
  t = step.nextTime + 300;
  step = feedArmFrames(pushup, { elbowAngle: 80 }, t, 4);
  assert.strictEqual(pushup.hasReachedDepth, true);

  // 3. Ascending back up to full arm lockout (>= 148°)
  t = step.nextTime + 350;
  step = feedArmFrames(pushup, { elbowAngle: 120 }, t, 4);
  t = step.nextTime + 350;
  step = feedArmFrames(pushup, { elbowAngle: 155 }, t, 4);

  assert.strictEqual(step.res.repCount, 1);
  assert.strictEqual(pushup.repCount, 1);
});

test('CurlAnalyzer tracks peak bicep contraction and full extension', () => {
  const curl = new CurlAnalyzer();
  let t = 1000;

  // 1. Extended arms at sides (>= 138°)
  let step = feedArmFrames(curl, { elbowAngle: 150 }, t, 4);
  assert.strictEqual(curl.repCount, 0);

  // 2. Curling up to peak contraction (<= 65°)
  t = step.nextTime + 300;
  step = feedArmFrames(curl, { elbowAngle: 100 }, t, 4);
  t = step.nextTime + 350;
  step = feedArmFrames(curl, { elbowAngle: 50 }, t, 4);
  assert.strictEqual(curl.hasReachedPeak, true);

  // 3. Lowering back to full extension (>= 138°)
  t = step.nextTime + 350;
  step = feedArmFrames(curl, { elbowAngle: 90 }, t, 4);
  t = step.nextTime + 400;
  step = feedArmFrames(curl, { elbowAngle: 150 }, t, 4);

  assert.strictEqual(step.res.repCount, 1);
  assert.strictEqual(curl.repCount, 1);
});

// ============================================================================
// 8. DEADLIFT ANALYZER TESTS (ex-3)
// ============================================================================

test('DeadliftAnalyzer tracks full repetition lifecycle and counts repetition', () => {
  const deadlift = new DeadliftAnalyzer();
  let t = 1000;

  // 1. Standing upright calibration (hip 165°, knee 160°)
  let step = feedHingeFrames(deadlift, { hipAngle: 165, kneeAngle: 160 }, t, 4);
  t = step.nextTime;
  assert.strictEqual(deadlift.state, DEADLIFT_STATES.STANDING);
  assert.strictEqual(deadlift.repCount, 0);

  // 2. Hinging descent (hip 125°, knee 155°)
  t += 250;
  step = feedHingeFrames(deadlift, { hipAngle: 125, kneeAngle: 155 }, t, 4);
  t = step.nextTime;
  assert.strictEqual(deadlift.state, DEADLIFT_STATES.HINGING);

  // 3. Bottom depth reached (hip 70° <= 75°, soft knee 150°)
  t += 300;
  step = feedHingeFrames(deadlift, { hipAngle: 70, kneeAngle: 150 }, t, 4);
  t = step.nextTime;
  assert.strictEqual(deadlift.state, DEADLIFT_STATES.BOTTOM);
  assert.strictEqual(deadlift.hasReachedDepth, true);

  // 4. Ascending initiation (hip 110°, knee 155°)
  t += 300;
  step = feedHingeFrames(deadlift, { hipAngle: 110, kneeAngle: 155 }, t, 4);
  t = step.nextTime;
  assert.strictEqual(deadlift.state, DEADLIFT_STATES.ASCENDING);

  // 5. Standing lockout completion (hip 165°, knee 160°)
  t += 350;
  step = feedHingeFrames(deadlift, { hipAngle: 165, kneeAngle: 160 }, t, 4);
  assert.strictEqual(step.res.repCount, 1);
  assert.strictEqual(deadlift.repCount, 1);
  assert.strictEqual(deadlift.state, DEADLIFT_STATES.STANDING);
  assert.ok(step.res.formScore >= 90);
});

test('DeadliftAnalyzer detects squatting error when knees excessively flex during hinge', () => {
  const deadlift = new DeadliftAnalyzer();
  let t = 1000;

  let step = feedHingeFrames(deadlift, { hipAngle: 165, kneeAngle: 160 }, t, 4);
  t = step.nextTime + 250;

  // Squatting down instead of hinging: knee flexes to 95° < minKneeAngleForHinge (115°)
  step = feedHingeFrames(deadlift, { hipAngle: 120, kneeAngle: 95 }, t, 4);
  assert.ok(deadlift.formErrors.includes('squatting_error'));
  assert.strictEqual(step.res.feedback.status, 'warning');
  assert.ok(step.res.feedback.message.includes('squat'));
});

test('DeadliftAnalyzer rejects incomplete shallow hinge without counting', () => {
  const deadlift = new DeadliftAnalyzer();
  let t = 1000;

  let step = feedHingeFrames(deadlift, { hipAngle: 165, kneeAngle: 160 }, t, 4);
  t = step.nextTime + 250;

  // Only hinges to 110° (above 75° target)
  step = feedHingeFrames(deadlift, { hipAngle: 110, kneeAngle: 155 }, t, 4);
  assert.strictEqual(deadlift.state, DEADLIFT_STATES.HINGING);

  // Stands back up immediately
  t = step.nextTime + 300;
  step = feedHingeFrames(deadlift, { hipAngle: 165, kneeAngle: 160 }, t, 4);

  assert.strictEqual(step.res.repCount, 0);
  assert.strictEqual(deadlift.incompleteReps, 1);
});

// ============================================================================
// 9. LUNGE ANALYZER TESTS (ex-5)
// ============================================================================

test('LungeAnalyzer tracks full repetition lifecycle and counts repetition', () => {
  const lunge = new LungeAnalyzer();
  let t = 1000;

  // 1. Standing upright calibration (knee 165°, hip 165°)
  let step = feedHingeFrames(lunge, { hipAngle: 165, kneeAngle: 165 }, t, 4);
  t = step.nextTime;
  assert.strictEqual(lunge.state, LUNGE_STATES.STANDING);
  assert.strictEqual(lunge.repCount, 0);

  // 2. Descending into lunge (knee 125°, hip 110°)
  t += 250;
  step = feedHingeFrames(lunge, { hipAngle: 110, kneeAngle: 125 }, t, 4);
  t = step.nextTime;
  assert.strictEqual(lunge.state, LUNGE_STATES.DESCENDING);

  // 3. Bottom depth reached (front knee 90° <= 95°)
  t += 300;
  step = feedHingeFrames(lunge, { hipAngle: 90, kneeAngle: 90 }, t, 4);
  t = step.nextTime;
  assert.strictEqual(lunge.state, LUNGE_STATES.BOTTOM);
  assert.strictEqual(lunge.hasReachedDepth, true);

  // 4. Ascending initiation (knee 125°)
  t += 300;
  step = feedHingeFrames(lunge, { hipAngle: 110, kneeAngle: 125 }, t, 4);
  t = step.nextTime;
  assert.strictEqual(lunge.state, LUNGE_STATES.ASCENDING);

  // 5. Standing lockout return (knee 165°)
  t += 350;
  step = feedHingeFrames(lunge, { hipAngle: 165, kneeAngle: 165 }, t, 4);
  assert.strictEqual(step.res.repCount, 1);
  assert.strictEqual(lunge.repCount, 1);
  assert.strictEqual(lunge.state, LUNGE_STATES.STANDING);
});

test('LungeAnalyzer detects forward torso collapse error during lunge descent', () => {
  const lunge = new LungeAnalyzer();
  let t = 1000;

  let step = feedHingeFrames(lunge, { hipAngle: 165, kneeAngle: 165 }, t, 4);
  t = step.nextTime + 250;

  // Knee descending to 110°, but torso collapses (hip angle 55° < 65°)
  step = feedHingeFrames(lunge, { hipAngle: 55, kneeAngle: 110 }, t, 4);
  assert.ok(lunge.formErrors.includes('torso_forward'));
  assert.strictEqual(step.res.feedback.status, 'warning');
  assert.ok(step.res.feedback.message.includes('torso'));
});

test('LungeAnalyzer rejects incomplete partial lunge without counting', () => {
  const lunge = new LungeAnalyzer();
  let t = 1000;

  let step = feedHingeFrames(lunge, { hipAngle: 165, kneeAngle: 165 }, t, 4);
  t = step.nextTime + 250;

  // Only reaches 120° (above 95° target)
  step = feedHingeFrames(lunge, { hipAngle: 110, kneeAngle: 120 }, t, 4);
  assert.strictEqual(lunge.state, LUNGE_STATES.DESCENDING);

  // Returns to standing immediately
  t = step.nextTime + 300;
  step = feedHingeFrames(lunge, { hipAngle: 165, kneeAngle: 165 }, t, 4);

  assert.strictEqual(step.res.repCount, 0);
  assert.strictEqual(lunge.incompleteReps, 1);
});

// ============================================================================
// 10. PLANK ANALYZER TESTS (ex-6)
// ============================================================================

test('PlankAnalyzer tracks isometric hold time in seconds with straight alignment', () => {
  const plank = new PlankAnalyzer();
  let t = 1000;

  // Feed frames spaced over 3000ms in straight alignment (180°)
  let res = plank.processFrame(createMockPlankPose({ alignment: 'straight' }), t);
  for (let i = 0; i < 10; i++) {
    t += 300;
    res = plank.processFrame(createMockPlankPose({ alignment: 'straight' }), t);
  }

  assert.strictEqual(res.state, PLANK_STATES.HOLDING);
  assert.strictEqual(res.currentAngle, 180);
  assert.strictEqual(res.repCount, 3, 'Rep count should reflect 3 seconds held');
  assert.ok(res.formScore >= 95);
});

test('PlankAnalyzer detects sagging hips and pauses hold accumulation', () => {
  const plank = new PlankAnalyzer();
  let t = 1000;

  // Hold 1 second straight
  plank.processFrame(createMockPlankPose({ alignment: 'straight' }), t);
  t += 1000;
  plank.processFrame(createMockPlankPose({ alignment: 'straight' }), t);
  assert.strictEqual(plank.repCount, 1);

  // Sags for next 1500ms
  t += 500;
  let res = plank.processFrame(createMockPlankPose({ alignment: 'sagging' }), t);
  t += 1000;
  res = plank.processFrame(createMockPlankPose({ alignment: 'sagging' }), t);

  assert.strictEqual(res.state, PLANK_STATES.SAGGING);
  assert.strictEqual(res.feedback.status, 'warning');
  assert.ok(res.feedback.message.includes('sagging'));
  // repCount should not have increased while sagging
  assert.strictEqual(res.repCount, 1);
});

test('PlankAnalyzer detects piking hips and pauses hold accumulation', () => {
  const plank = new PlankAnalyzer();
  let t = 1000;

  plank.processFrame(createMockPlankPose({ alignment: 'straight' }), t);
  t += 500;
  const res = plank.processFrame(createMockPlankPose({ alignment: 'piking' }), t);

  assert.strictEqual(res.state, PLANK_STATES.PIKING);
  assert.strictEqual(res.feedback.status, 'warning');
  assert.ok(res.feedback.message.includes('too high'));
});

// ============================================================================
// 11. UNIVERSAL EXERCISE ANALYZER ROUTING TESTS (ex-1 through ex-6)
// ============================================================================

test('ExerciseAnalyzer dynamically switches and processes all 6 exercises', () => {
  const multi = new ExerciseAnalyzer('ex-1');
  assert.strictEqual(multi.currentMode, 'squat');
  let res = multi.processFrame(createMockPose({ kneeAngle: 170 }));
  assert.strictEqual(res.angleLabel, 'Knee Flexion');

  multi.setExercise('ex-2');
  assert.strictEqual(multi.currentMode, 'pushup');
  res = multi.processFrame(createMockArmPose({ elbowAngle: 150 }));
  assert.strictEqual(res.angleLabel, 'Elbow Flexion');

  multi.setExercise('ex-3');
  assert.strictEqual(multi.currentMode, 'deadlift');
  res = multi.processFrame(createMockHingePose({ hipAngle: 165, kneeAngle: 160 }));
  assert.strictEqual(res.angleLabel, 'Hip Hinge Flexion');
  assert.strictEqual(res.targetAngle, 75);

  multi.setExercise('ex-4');
  assert.strictEqual(multi.currentMode, 'curl');
  res = multi.processFrame(createMockArmPose({ elbowAngle: 150 }));
  assert.strictEqual(res.angleLabel, 'Elbow Flexion');

  multi.setExercise('ex-5');
  assert.strictEqual(multi.currentMode, 'lunge');
  res = multi.processFrame(createMockHingePose({ hipAngle: 165, kneeAngle: 165 }));
  assert.strictEqual(res.angleLabel, 'Front Knee Flexion');
  assert.strictEqual(res.targetAngle, 95);

  multi.setExercise('ex-6');
  assert.strictEqual(multi.currentMode, 'plank');
  res = multi.processFrame(createMockPlankPose({ alignment: 'straight' }));
  assert.strictEqual(res.angleLabel, 'Spine Alignment');
  assert.strictEqual(res.targetAngle, 180);
});

