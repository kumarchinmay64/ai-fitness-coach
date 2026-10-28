/**
 * reliability.js — reliability-aware feedback layer for the AI Fitness Coach.
 *
 * Purpose: an exercise analyzer turns joint angles into verdicts ("depth reached",
 * "torso leaning"). This module estimates, at inference time and for each verdict,
 * how far the camera could actually observe the quantity the verdict depends on.
 * It uses only information available while the app runs (no ground truth):
 *
 *   1. landmark visibility  – MediaPipe per-landmark visibility of the joints the cue needs
 *   2. view suitability     – whether the estimated camera yaw shows the plane the cue lives in
 *   3. measurement stability – frame-to-frame jitter of the raw angle in the decisive phase
 *   4. decision margin      – distance of the decisive angle from the rule threshold, in units
 *                             of jitter (reported separately: a large margin does NOT mean the
 *                             quantity was observable)
 *
 * Outputs per repetition and per cue: a reliability level (HIGH / MEDIUM / LOW), reason codes,
 * and a feedback action (state the verdict, soften it, or withhold it and ask for another view).
 * A session summary built from these records is sent to the chat assistant so that the language
 * model can calibrate how confidently it talks about the user's workout.
 *
 * Landmark indices follow the MediaPipe Pose 33-point topology. Thresholds in CUE_SPECS restate
 * DEFAULT_*_CONFIG and the inline constants in squatAnalyzer.js; keep the two in sync.
 */

export const LM = {
  L_SHOULDER: 11, R_SHOULDER: 12, L_ELBOW: 13, R_ELBOW: 14, L_WRIST: 15, R_WRIST: 16,
  L_HIP: 23, R_HIP: 24, L_KNEE: 25, R_KNEE: 26, L_ANKLE: 27, R_ANKLE: 28,
};

const side = (s) => (s === 'left'
  ? { shoulder: LM.L_SHOULDER, elbow: LM.L_ELBOW, wrist: LM.L_WRIST, hip: LM.L_HIP, knee: LM.L_KNEE, ankle: LM.L_ANKLE }
  : { shoulder: LM.R_SHOULDER, elbow: LM.R_ELBOW, wrist: LM.R_WRIST, hip: LM.R_HIP, knee: LM.R_KNEE, ankle: LM.R_ANKLE });

/**
 * Cue specifications. `plane` is the anatomical plane in which the measured angle lies:
 * sagittal-plane angles are best seen side-on, frontal-plane angles face-on.
 * `joints` names the three landmarks (A-B-C, angle at B). `op` and `threshold` restate the
 * analyzer rule so that the decision margin can be computed. Values mirror the analyzers.
 */
export const CUE_SPECS = {
  squat: {
    depth: { plane: 'sagittal', joints: ['hip', 'knee', 'ankle'], threshold: 100, op: '<=', extreme: 'min', label: 'squat depth', view_hint: 'side-on' },
    torso_lean: { plane: 'sagittal', joints: ['shoulder', 'hip', 'knee'], threshold: 50, op: '<', extreme: 'min', label: 'torso lean', view_hint: 'side-on' },
  },
  pushup: {
    depth: { plane: 'sagittal', joints: ['shoulder', 'elbow', 'wrist'], threshold: 90, op: '<=', extreme: 'min', label: 'push-up depth', view_hint: 'side-on' },
  },
  deadlift: {
    hinge_depth: { plane: 'sagittal', joints: ['shoulder', 'hip', 'knee'], threshold: 75, op: '<=', extreme: 'min', label: 'hinge depth', view_hint: 'side-on' },
    knee_bend: { plane: 'sagittal', joints: ['hip', 'knee', 'ankle'], threshold: 115, op: '<', extreme: 'min', label: 'knee bend during hinge', view_hint: 'side-on' },
  },
  curl: {
    peak: { plane: 'sagittal', joints: ['shoulder', 'elbow', 'wrist'], threshold: 65, op: '<=', extreme: 'min', label: 'curl range', view_hint: 'side-on' },
  },
  lunge: {
    depth: { plane: 'sagittal', joints: ['hip', 'knee', 'ankle'], threshold: 95, op: '<=', extreme: 'min', label: 'lunge depth', view_hint: 'side-on' },
    torso: { plane: 'sagittal', joints: ['shoulder', 'hip', 'knee'], threshold: 65, op: '<', extreme: 'min', label: 'torso position', view_hint: 'side-on' },
  },
  plank: {
    body_line: { plane: 'sagittal', joints: ['shoulder', 'hip', 'ankle'], threshold: 160, op: '<', extreme: 'min', label: 'body line', view_hint: 'side-on' },
  },
};

export const DEFAULTS = {
  aspect: 1280 / 720,          // image width / height, to undo normalised coordinates (view estimate)
  angleAspect: null,           // aspect used for cue angles; 1 reproduces the analysers, which work in normalised coordinates
  frontalWidthRatio: 0.66,     // (shoulder width + hip width) / (2 * torso length) when facing the camera
  visLow: 0.5, visHigh: 0.9,   // visibility mapped linearly to [0, 1] between these values
  highLevel: 0.7, lowLevel: 0.4,
  minJitterDeg: 3.0,           // floor on jitter used for the margin (single-camera angles are not more precise)
  borderlineMargin: 2.0,       // margin below this (in jitter units) marks a verdict as borderline
  hipTravelForAttempt: 0.25,   // hip vertical travel / torso length that indicates a repetition attempt
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const px = (p, aspect) => ({ x: p.x * aspect, y: p.y });   // put x and y on the same scale
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** 2D angle at b (degrees), using aspect-corrected coordinates. */
export function angle2D(a, b, c, aspect = DEFAULTS.aspect) {
  const A = px(a, aspect), B = px(b, aspect), C = px(c, aspect);
  const v1 = { x: A.x - B.x, y: A.y - B.y }, v2 = { x: C.x - B.x, y: C.y - B.y };
  const n = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
  if (n === 0) return null;
  return (Math.acos(clamp((v1.x * v2.x + v1.y * v2.y) / n, -1, 1)) * 180) / Math.PI;
}

/**
 * Estimate camera yaw relative to the body from 2D landmarks.
 * Facing the camera, shoulders and hips appear at full width; side-on they overlap.
 * cos(yaw) ≈ observed width ratio / frontal width ratio. Returns degrees in [0, 90].
 */
export function estimateYaw(landmarks, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const ls = px(landmarks[LM.L_SHOULDER], o.aspect), rs = px(landmarks[LM.R_SHOULDER], o.aspect);
  const lh = px(landmarks[LM.L_HIP], o.aspect), rh = px(landmarks[LM.R_HIP], o.aspect);
  const midS = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2 }, midH = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2 };
  const torso = dist(midS, midH);
  if (!(torso > 0)) return null;
  const ratio = (Math.abs(ls.x - rs.x) + Math.abs(lh.x - rh.x)) / (2 * torso);
  return (Math.acos(clamp(ratio / o.frontalWidthRatio, 0, 1)) * 180) / Math.PI;
}

/** How well a camera at `yawDeg` shows an angle lying in `plane` (0 = not at all, 1 = fully). */
export function viewSuitability(plane, yawDeg) {
  if (yawDeg == null) return 0;
  const r = (yawDeg * Math.PI) / 180;
  return plane === 'frontal' ? Math.abs(Math.cos(r)) : Math.abs(Math.sin(r));
}

export const viewLabel = (yaw) => (yaw == null ? 'unknown' : yaw < 25 ? 'front' : yaw < 65 ? 'oblique' : 'side');

function visibilityScore(v, o) { return clamp((v - o.visLow) / (o.visHigh - o.visLow), 0, 1); }

function median(xs) { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : null; }

/**
 * Tracks frames of one exercise set and produces a reliability record for each repetition
 * attempt. Feed it every frame with the landmarks and the analyzer's state; call `endRep`
 * when the analyzer counts a repetition or rejects an attempt.
 */
export class RepReliabilityTracker {
  constructor(exercise, opts = {}) {
    if (!CUE_SPECS[exercise]) throw new Error(`unknown exercise ${exercise}`);
    this.exercise = exercise; this.o = { ...DEFAULTS, ...opts };
    this.cues = CUE_SPECS[exercise];
    this.records = []; this.yawHistory = [];
    this.alpha = opts.emaAlpha ?? 0.65;   // weight on the new raw angle, as in the analysers
    this._resetRep();
    this._standingHipY = null; this._torsoLen = null;
  }

  _resetRep() {
    this.frames = []; this.prevSmoothed = {};
  }

  /** Choose the body side whose cue landmarks are more visible. */
  _side(landmarks, joints) {
    const vis = (s) => Math.min(...joints.map((j) => landmarks[side(s)[j]]?.visibility ?? 0));
    return vis('left') >= vis('right') ? 'left' : 'right';
  }

  /** Add one frame. `phase` is the analyzer's state label (e.g. 'STANDING'). */
  addFrame(landmarks, phase = null) {
    const yaw = estimateYaw(landmarks, this.o);
    const f = { yaw, phase, cues: {} };
    for (const [name, spec] of Object.entries(this.cues)) {
      const s = this._side(landmarks, spec.joints);
      const ids = spec.joints.map((j) => side(s)[j]);
      const raw = angle2D(landmarks[ids[0]], landmarks[ids[1]], landmarks[ids[2]], this.o.angleAspect ?? this.o.aspect);
      const prev = this.prevSmoothed[name];
      const sm = raw == null ? prev : prev == null ? raw : this.alpha * raw + (1 - this.alpha) * prev;
      this.prevSmoothed[name] = sm;
      f.cues[name] = { raw, smoothed: sm, vis: Math.min(...ids.map((i) => landmarks[i]?.visibility ?? 0)) };
    }
    // hip height relative to torso length: an analyzer-independent sign of movement
    const midHipY = (landmarks[LM.L_HIP].y + landmarks[LM.R_HIP].y) / 2;
    const midShY = (landmarks[LM.L_SHOULDER].y + landmarks[LM.R_SHOULDER].y) / 2;
    const torso = dist(px({ x: (landmarks[LM.L_SHOULDER].x + landmarks[LM.R_SHOULDER].x) / 2, y: midShY }, this.o.aspect),
      px({ x: (landmarks[LM.L_HIP].x + landmarks[LM.R_HIP].x) / 2, y: midHipY }, this.o.aspect));
    if (phase === 'STANDING' || this._standingHipY == null) {
      this._standingHipY = this._standingHipY == null ? midHipY : Math.min(this._standingHipY, midHipY);
      this._torsoLen = this._torsoLen == null ? torso : 0.9 * this._torsoLen + 0.1 * torso;
    }
    f.hipDrop = this._torsoLen ? (midHipY - this._standingHipY) / this._torsoLen : 0;
    if (yaw != null && (phase === 'STANDING' || phase == null)) this.yawHistory.push(yaw);
    this.frames.push(f);
    return f;
  }

  /**
   * Close the current repetition attempt and return its reliability record.
   * `analyzerVerdicts` maps cue name -> boolean verdict the analyzer reached
   * (e.g. { depth: true } when depth was reached). `counted` says whether the rep was counted.
   */
  endRep({ counted, analyzerVerdicts = {} } = {}) {
    const o = this.o;
    const yaw = median(this.frames.map((f) => f.yaw).filter((y) => y != null));
    const rec = { index: this.records.length + 1, counted: !!counted, view: viewLabel(yaw), yaw_deg: yaw == null ? null : Math.round(yaw), cues: {} };
    for (const [name, spec] of Object.entries(this.cues)) {
      const series = this.frames.map((f) => f.cues[name]).filter((c) => c && c.raw != null);
      if (!series.length) { rec.cues[name] = { level: 'LOW', reasons: ['not_tracked'], action: 'withhold' }; continue; }
      // decisive frame: where the smoothed angle reaches its extreme
      let k = 0; series.forEach((c, i) => { if (c.smoothed < series[k].smoothed) k = i; });
      const lo = Math.max(0, k - 5), hi = Math.min(series.length, k + 6);
      const win = series.slice(lo, hi);
      const vis = Math.min(...win.map((c) => c.vis));
      // jitter: noise level of the raw angle, estimated from second differences so that smooth
      // movement (and the lag of the smoothing filter) is not mistaken for noise; for white noise
      // with s.d. s, the second difference has s.d. s * sqrt(6)
      const d2 = [];
      for (let i = Math.max(lo, 2); i < hi; i++) d2.push(series[i].raw - 2 * series[i - 1].raw + series[i - 2].raw);
      const jitter = d2.length ? Math.sqrt(d2.reduce((a, b) => a + b * b, 0) / d2.length) / Math.sqrt(6) : 0;
      const extreme = series[k].smoothed;
      const margin = Math.abs(extreme - spec.threshold) / Math.max(jitter, o.minJitterDeg);
      const sVis = visibilityScore(vis, o), sView = viewSuitability(spec.plane, yaw);
      const observability = Math.min(sVis, sView);
      const reasons = [];
      if (sView < o.lowLevel) reasons.push('camera_view'); else if (sView < o.highLevel) reasons.push('camera_view_partial');
      if (sVis < o.lowLevel) reasons.push('occlusion'); else if (sVis < o.highLevel) reasons.push('low_visibility');
      if (jitter > 2 * o.minJitterDeg) reasons.push('unstable');
      const borderline = margin < o.borderlineMargin;
      if (borderline) reasons.push('borderline');
      let level = observability >= o.highLevel ? 'HIGH' : observability >= o.lowLevel ? 'MEDIUM' : 'LOW';
      if (level === 'HIGH' && (borderline || jitter > 2 * o.minJitterDeg)) level = 'MEDIUM';
      rec.cues[name] = {
        label: spec.label, verdict: analyzerVerdicts[name] ?? null, level, reasons,
        observability: +observability.toFixed(2), view_suitability: +sView.toFixed(2), visibility: +vis.toFixed(2),
        decisive_angle_deg: +extreme.toFixed(1), threshold_deg: spec.threshold, margin: +margin.toFixed(1), jitter_deg: +jitter.toFixed(1),
        action: level === 'HIGH' ? 'state' : level === 'MEDIUM' ? 'soften' : 'withhold',
        view_hint: spec.view_hint,
      };
    }
    // movement the analyzer did not register (e.g. a squat filmed face-on never crosses the descent threshold)
    const maxDrop = Math.max(0, ...this.frames.map((f) => f.hipDrop));
    rec.hip_drop = +maxDrop.toFixed(2);
    rec.possible_uncounted_attempt = !counted && maxDrop >= o.hipTravelForAttempt;
    this.records.push(rec); this._resetRep();
    return rec;
  }

  /** Spoken/visual feedback text for one cue result, respecting its reliability. */
  static feedbackFor(cueResult, messages) {
    if (!cueResult) return null;
    if (cueResult.action === 'state') return messages.verdict;
    if (cueResult.action === 'soften') return messages.soft ?? messages.verdict;
    return `I can't see your ${cueResult.label} well from this angle — turn ${cueResult.view_hint} to the camera.`;
  }

  /** Compact, model-readable summary of the set, for the chat assistant. */
  summary() {
    const yaw = median(this.yawHistory);
    const out = {
      schema: 'session-reliability/1', exercise: this.exercise,
      camera_view: viewLabel(yaw), camera_yaw_deg: yaw == null ? null : Math.round(yaw),
      attempts: this.records.length, reps_counted: this.records.filter((r) => r.counted).length,
      possible_uncounted_attempts: this.records.filter((r) => r.possible_uncounted_attempt).length,
      cues: {},
    };
    for (const name of Object.keys(this.cues)) {
      const rs = this.records.map((r) => r.cues[name]).filter(Boolean);
      const by = (lvl) => rs.filter((c) => c.level === lvl);
      const reasons = {}; rs.forEach((c) => c.reasons.forEach((x) => { reasons[x] = (reasons[x] || 0) + 1; }));
      out.cues[name] = {
        label: this.cues[name].label,
        analyzer_flagged: rs.filter((c) => c.verdict === false).length,   // what the analyzer said, ignoring reliability
        analyzer_passed: rs.filter((c) => c.verdict === true).length,
        flagged_reliable: by('HIGH').filter((c) => c.verdict === false).length,
        passed_reliable: by('HIGH').filter((c) => c.verdict === true).length,
        uncertain: by('MEDIUM').length,
        not_observable: by('LOW').length,
        main_reasons: Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k),
        recommended_view: this.cues[name].view_hint,
      };
    }
    return out;
  }
}

/**
 * Analyzer-independent attempt detector: a repetition attempt is a drop of the mid-hip by more
 * than `enter` torso lengths followed by a return above `exit`. It lets the app notice movement
 * that the angle-based analyzer failed to register (for example a squat filmed face-on).
 */
export class AttemptDetector {
  constructor({ enter = DEFAULTS.hipTravelForAttempt, exit = 0.08 } = {}) { Object.assign(this, { enter, exit }); this.active = false; }
  /** Feed the `hipDrop` value returned by RepReliabilityTracker.addFrame; returns true when an attempt ends. */
  update(hipDrop) {
    if (!this.active && hipDrop >= this.enter) { this.active = true; return false; }
    if (this.active && hipDrop <= this.exit) { this.active = false; return true; }
    return false;
  }
}
