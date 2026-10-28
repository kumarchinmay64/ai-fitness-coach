import { POSE_LANDMARKS, calculateJointAngle } from './poseDetection.js';

/**
 * ============================================================================
 * EXERCISE & BIOMECHANICAL FORM-VALIDATED REP ANALYZERS
 * Strictly enforces proper biomechanical form before incrementing reps:
 * 1. Multi-frame jitter suppression (Exponential Moving Average)
 * 2. Full range of motion & mandatory parallel depth achievement
 * 3. Spine / torso posture verification
 * 4. Full standing lockout completion
 * 5. Realistic human tempo / duration validation (rejects sensor spikes)
 * ============================================================================
 */

export const SQUAT_STATES = {
  UNTRACKED: 'untracked',
  STANDING: 'standing',
  DESCENDING: 'descending',
  BOTTOM: 'bottom',
  ASCENDING: 'ascending',
};

export const DEFAULT_SQUAT_CONFIG = {
  // Knee angle threshold to confirm standing lockout (degrees)
  standingKneeMin: 148,
  // Knee angle threshold to enter descending state (degrees)
  descendingKneeMax: 130,
  // Target knee angle to reach optimal bottom / parallel depth (degrees)
  targetDepthKneeMax: 100,
  // Knee angle threshold to confirm ascent has initiated after bottom (degrees)
  ascendingKneeMin: 115,
  // Minimum time for a complete valid repetition (ms) - real human squats take >= 900ms
  minRepDurationMs: 900,
  // Minimum time between two consecutive completed reps (ms)
  minTimeBetweenRepsMs: 800,
  // Minimum landmark visibility confidence score (0 to 1)
  minConfidence: 0.35,
  // Timeout in ms of lost tracking before resetting an in-progress rep
  trackingLossTimeoutMs: 2000,
  // Minimum hip flexion angle before flagging excessive forward torso lean (degrees)
  torsoLeanHipMin: 50,
  // Spoken audio feedback cooldown (ms)
  feedbackCooldownMs: 2800,
};

/**
 * Biomechanical Analyzer for Squats with Strict Form Gating
 */
export class SquatAnalyzer {
  constructor(customConfig = {}) {
    this.config = { ...DEFAULT_SQUAT_CONFIG, ...customConfig };
    this.reset();
  }

  reset() {
    this.state = SQUAT_STATES.UNTRACKED;
    this.repCount = 0;
    this.incompleteReps = 0;
    this.repScores = [];

    this.currentAngle = null;
    this.currentHipAngle = null;
    this.smoothedKneeAngle = null;
    this.smoothedHipAngle = null;
    this.activeSide = null;

    this.repStartTime = 0;
    this.minKneeAngleInRep = 180;
    this.minHipAngleInRep = 180;
    this.hasReachedDepth = false;
    this.formErrors = [];

    this.lastCompletedRepTime = 0;
    this.lastValidLandmarkTime = 0;

    this.lastFeedback = {
      status: 'info',
      message: 'Position your body so hips, knees, and feet are visible.',
      timestamp: 0,
    };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  getFormScore() {
    if (this.repScores.length === 0) {
      return null;
    }
    const sum = this.repScores.reduce((acc, score) => acc + score, 0);
    return Math.round(sum / this.repScores.length);
  }

  processFrame(landmarks, timestamp = performance.now()) {
    // 1. Missing landmarks check
    if (!landmarks || landmarks.length < 33) {
      this.currentAngle = null;
      this.currentHipAngle = null;
      if (
        this.state !== SQUAT_STATES.UNTRACKED &&
        this.state !== SQUAT_STATES.STANDING &&
        timestamp - this.lastValidLandmarkTime > this.config.trackingLossTimeoutMs
      ) {
        this.state = SQUAT_STATES.UNTRACKED;
        this.setFeedback('warning', 'Athlete obscured. Stand in frame to calibrate.', timestamp);
      }
      return this._buildResult(false);
    }

    // 2. Left side angles & visibility
    const leftKneeAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE],
      landmarks[POSE_LANDMARKS.LEFT_ANKLE],
      this.config.minConfidence
    );
    const leftHipAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE],
      this.config.minConfidence
    );
    const leftVis =
      (landmarks[POSE_LANDMARKS.LEFT_HIP]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.LEFT_KNEE]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.LEFT_ANKLE]?.visibility ?? 0);

    // 3. Right side angles & visibility
    const rightKneeAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.RIGHT_HIP],
      landmarks[POSE_LANDMARKS.RIGHT_KNEE],
      landmarks[POSE_LANDMARKS.RIGHT_ANKLE],
      this.config.minConfidence
    );
    const rightHipAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
      landmarks[POSE_LANDMARKS.RIGHT_HIP],
      landmarks[POSE_LANDMARKS.RIGHT_KNEE],
      this.config.minConfidence
    );
    const rightVis =
      (landmarks[POSE_LANDMARKS.RIGHT_HIP]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.RIGHT_KNEE]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.RIGHT_ANKLE]?.visibility ?? 0);

    // 4. Select most reliable body side with hysteresis
    let selectedSide = null;
    let rawKneeAngle = null;
    let rawHipAngle = null;

    if (leftKneeAngle !== null && rightKneeAngle !== null) {
      if (this.activeSide === 'left' && leftVis >= rightVis - 0.25) {
        selectedSide = 'left';
      } else if (this.activeSide === 'right' && rightVis >= leftVis - 0.25) {
        selectedSide = 'right';
      } else {
        selectedSide = leftVis >= rightVis ? 'left' : 'right';
      }
    } else if (leftKneeAngle !== null) {
      selectedSide = 'left';
    } else if (rightKneeAngle !== null) {
      selectedSide = 'right';
    }

    if (!selectedSide) {
      this.currentAngle = null;
      this.currentHipAngle = null;
      if (
        this.state !== SQUAT_STATES.UNTRACKED &&
        this.state !== SQUAT_STATES.STANDING &&
        timestamp - this.lastValidLandmarkTime > this.config.trackingLossTimeoutMs
      ) {
        this.state = SQUAT_STATES.UNTRACKED;
        this.setFeedback('warning', 'Step back so your hips, knees, and ankles are in frame.', timestamp);
      }
      return this._buildResult(false);
    }

    this.activeSide = selectedSide;
    rawKneeAngle = selectedSide === 'left' ? leftKneeAngle : rightKneeAngle;
    rawHipAngle = selectedSide === 'left' ? leftHipAngle : rightHipAngle;

    // Exponential Moving Average (EMA) to eliminate frame noise and jitter
    if (this.smoothedKneeAngle === null) {
      this.smoothedKneeAngle = rawKneeAngle;
    } else {
      this.smoothedKneeAngle = Math.round(0.65 * rawKneeAngle + 0.35 * this.smoothedKneeAngle);
    }

    if (this.smoothedHipAngle === null) {
      this.smoothedHipAngle = rawHipAngle;
    } else if (rawHipAngle !== null) {
      this.smoothedHipAngle = Math.round(0.65 * rawHipAngle + 0.35 * this.smoothedHipAngle);
    }

    const kneeAngle = this.smoothedKneeAngle;
    const hipAngle = this.smoothedHipAngle;

    this.currentAngle = kneeAngle;
    this.currentHipAngle = hipAngle;
    this.lastValidLandmarkTime = timestamp;

    // 5. State Machine Transition Logic with Strict Form Validation
    let shouldSpeak = false;

    switch (this.state) {
      case SQUAT_STATES.UNTRACKED: {
        if (kneeAngle >= this.config.standingKneeMin) {
          this.state = SQUAT_STATES.STANDING;
          shouldSpeak = this.setFeedback('optimal', 'Calibrated. Stand upright and begin your squat.', timestamp);
        } else {
          this.setFeedback('info', 'Stand upright with knees extended to calibrate.', timestamp);
        }
        break;
      }

      case SQUAT_STATES.STANDING: {
        // Trigger descent ONLY when knee clearly flexes past 130° (filters weight shifting)
        if (kneeAngle <= this.config.descendingKneeMax) {
          this.state = SQUAT_STATES.DESCENDING;
          this.repStartTime = timestamp;
          this.minKneeAngleInRep = kneeAngle;
          this.hasReachedDepth = false;
          this.formErrors = [];
          this.setFeedback('optimal', 'Descending. Keep chest tall and hips back.', timestamp);
        }
        break;
      }

      case SQUAT_STATES.DESCENDING: {
        this.minKneeAngleInRep = Math.min(this.minKneeAngleInRep, kneeAngle);
        if (hipAngle !== null) {
          this.minHipAngleInRep = Math.min(this.minHipAngleInRep, hipAngle);
        }

        // Posture cue: Forward torso lean check (hip angle should stay upright)
        if (hipAngle !== null && hipAngle < this.config.torsoLeanHipMin && kneeAngle > 105) {
          if (!this.formErrors.includes('torso_lean')) {
            this.formErrors.push('torso_lean');
            shouldSpeak = this.setFeedback(
              'warning',
              'Chest pitching forward. Keep torso tall as you descend.',
              timestamp
            );
          }
        }

        // Check if mandatory parallel depth has been achieved
        if (kneeAngle <= this.config.targetDepthKneeMax) {
          this.hasReachedDepth = true;
          this.state = SQUAT_STATES.BOTTOM;
          shouldSpeak = this.setFeedback(
            'optimal',
            'Optimal parallel depth reached! Drive upwards.',
            timestamp
          );
        } else if (kneeAngle >= this.config.standingKneeMin) {
          // Athlete returned to standing without reaching parallel depth -> DO NOT COUNT REP!
          this.state = SQUAT_STATES.STANDING;
          this.incompleteReps += 1;
          shouldSpeak = this.setFeedback(
            'warning',
            'Incomplete depth — squat lower until thighs are parallel to count.',
            timestamp
          );
        }
        break;
      }

      case SQUAT_STATES.BOTTOM: {
        this.minKneeAngleInRep = Math.min(this.minKneeAngleInRep, kneeAngle);
        if (hipAngle !== null) {
          this.minHipAngleInRep = Math.min(this.minHipAngleInRep, hipAngle);
        }

        // Ascent initiation confirmed by rising above ascending threshold (115°)
        if (kneeAngle >= this.config.ascendingKneeMin) {
          this.state = SQUAT_STATES.ASCENDING;
          this.setFeedback('optimal', 'Ascending. Drive through heels to full standing lockout.', timestamp);
        }
        break;
      }

      case SQUAT_STATES.ASCENDING: {
        this.minKneeAngleInRep = Math.min(this.minKneeAngleInRep, kneeAngle);

        // Rep complete when athlete returns to standing lockout (148°+)
        if (kneeAngle >= this.config.standingKneeMin) {
          const repDuration = timestamp - this.repStartTime;
          const timeSinceLastRep = timestamp - this.lastCompletedRepTime;

          // STRICT VALIDATION:
          // 1. Must have reached parallel depth
          // 2. Duration must be >= 900ms (real human squat, not camera jitter)
          // 3. Spacing between reps >= 800ms
          if (
            this.hasReachedDepth &&
            repDuration >= this.config.minRepDurationMs &&
            timeSinceLastRep >= this.config.minTimeBetweenRepsMs
          ) {
            // Rep confirmed with correct form!
            this.repCount += 1;
            this.lastCompletedRepTime = timestamp;

            const repScore = this._computeRepScore(this.minKneeAngleInRep, kneeAngle, this.formErrors);
            this.repScores.push(repScore);

            this.state = SQUAT_STATES.STANDING;
            shouldSpeak = this.setFeedback(
              'optimal',
              `Rep ${this.repCount} complete! Solid form and depth (${this.minKneeAngleInRep}°).`,
              timestamp
            );
          } else {
            // Form or timing criteria failed
            this.state = SQUAT_STATES.STANDING;
            if (!this.hasReachedDepth) {
              this.incompleteReps += 1;
              shouldSpeak = this.setFeedback(
                'warning',
                'Incomplete depth. Did not reach parallel.',
                timestamp
              );
            }
          }
        }
        break;
      }

      default:
        this.state = SQUAT_STATES.UNTRACKED;
    }

    return this._buildResult(shouldSpeak);
  }

  setFeedback(status, message, timestamp) {
    const elapsed = timestamp - this.lastFeedback.timestamp;
    const isNewMessage = message !== this.lastFeedback.message;
    const cooldownPassed = elapsed >= this.config.feedbackCooldownMs;

    this.lastFeedback = {
      status,
      message,
      timestamp,
    };

    return isNewMessage || cooldownPassed;
  }

  _computeRepScore(minKneeAngle, lockoutKneeAngle, formErrors) {
    let depthScore = 100;
    if (minKneeAngle > this.config.targetDepthKneeMax) {
      const shallowDeg = minKneeAngle - this.config.targetDepthKneeMax;
      depthScore = Math.max(50, Math.round(100 - shallowDeg * 2.5));
    }

    const lockoutScore = Math.min(
      100,
      Math.max(70, Math.round((lockoutKneeAngle / 160) * 100))
    );

    let baseScore = Math.round(depthScore * 0.7 + lockoutScore * 0.3);
    if (formErrors.includes('torso_lean')) {
      baseScore = Math.max(65, baseScore - 12);
    }

    return baseScore;
  }

  _buildResult(shouldSpeak) {
    return {
      repCount: this.repCount,
      incompleteReps: this.incompleteReps,
      state: this.state,
      currentAngle: this.currentAngle,
      currentHipAngle: this.currentHipAngle,
      targetAngle: this.config.targetDepthKneeMax,
      angleLabel: 'Knee Flexion',
      targetLabel: 'Parallel Target',
      activeSide: this.activeSide,
      formScore: this.getFormScore(),
      minKneeAngleInRep: this.minKneeAngleInRep,
      feedback: {
        status: this.lastFeedback.status,
        message: this.lastFeedback.message,
        shouldSpeak,
      },
    };
  }
}

/**
 * Biomechanical Analyzer for Push-Ups with Strict Form Gating
 */
export class PushupAnalyzer {
  constructor() {
    this.reset();
  }

  reset() {
    this.repCount = 0;
    this.state = 'top'; // 'top', 'descending', 'bottom', 'ascending'
    this.currentAngle = null;
    this.smoothedAngle = null;
    this.minAngleInRep = 180;
    this.hasReachedDepth = false;
    this.repScores = [];
    this.lastFeedback = {
      status: 'info',
      message: 'Position body in plank with arms extended.',
      timestamp: 0,
    };
    this.repStartTime = 0;
    this.lastRepTime = 0;
  }

  getFormScore() {
    if (this.repScores.length === 0) return null;
    const sum = this.repScores.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.repScores.length);
  }

  processFrame(landmarks, timestamp = performance.now()) {
    if (!landmarks || landmarks.length < 33) {
      this.currentAngle = null;
      return this._buildResult(false);
    }

    const lAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_ELBOW],
      landmarks[POSE_LANDMARKS.LEFT_WRIST],
      0.35
    );
    const rAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
      landmarks[POSE_LANDMARKS.RIGHT_ELBOW],
      landmarks[POSE_LANDMARKS.RIGHT_WRIST],
      0.35
    );

    const rawAngle = lAngle !== null && rAngle !== null ? Math.min(lAngle, rAngle) : (lAngle || rAngle);

    if (rawAngle === null) {
      this.currentAngle = null;
      return this._buildResult(false);
    }

    if (this.smoothedAngle === null) {
      this.smoothedAngle = rawAngle;
    } else {
      this.smoothedAngle = Math.round(0.65 * rawAngle + 0.35 * this.smoothedAngle);
    }

    const angle = this.smoothedAngle;
    this.currentAngle = angle;
    let shouldSpeak = false;

    // Push-Up thresholds: Lockout >= 148°, Chest Depth <= 90°
    const LOCKOUT = 148;
    const TARGET_DEPTH = 90;

    switch (this.state) {
      case 'top': {
        if (angle <= 130) {
          this.state = 'descending';
          this.repStartTime = timestamp;
          this.minAngleInRep = angle;
          this.hasReachedDepth = false;
          this.lastFeedback = { status: 'optimal', message: 'Lowering chest. Keep core tight.', timestamp };
        }
        break;
      }
      case 'descending': {
        this.minAngleInRep = Math.min(this.minAngleInRep, angle);
        if (angle <= TARGET_DEPTH) {
          this.hasReachedDepth = true;
          this.state = 'bottom';
          shouldSpeak = true;
          this.lastFeedback = { status: 'optimal', message: 'Full chest depth reached! Press up.', timestamp };
        } else if (angle >= LOCKOUT) {
          this.state = 'top';
        }
        break;
      }
      case 'bottom': {
        this.minAngleInRep = Math.min(this.minAngleInRep, angle);
        if (angle >= 115) {
          this.state = 'ascending';
          this.lastFeedback = { status: 'optimal', message: 'Press upwards to full arm extension.', timestamp };
        }
        break;
      }
      case 'ascending': {
        this.minAngleInRep = Math.min(this.minAngleInRep, angle);
        if (angle >= LOCKOUT) {
          const duration = timestamp - this.repStartTime;
          const timeSinceLast = timestamp - this.lastRepTime;

          if (this.hasReachedDepth && duration >= 800 && timeSinceLast >= 700) {
            this.repCount += 1;
            this.lastRepTime = timestamp;
            this.repScores.push(95);
            this.state = 'top';
            shouldSpeak = true;
            this.lastFeedback = {
              status: 'optimal',
              message: `Rep ${this.repCount} complete! Solid chest lockout.`,
              timestamp,
            };
          } else {
            this.state = 'top';
          }
        }
        break;
      }
      default:
        this.state = 'top';
    }

    return this._buildResult(shouldSpeak);
  }

  _buildResult(shouldSpeak) {
    return {
      repCount: this.repCount,
      incompleteReps: 0,
      state: this.state,
      currentAngle: this.currentAngle,
      targetAngle: 90,
      angleLabel: 'Elbow Flexion',
      targetLabel: 'Chest Depth Target',
      activeSide: 'arms',
      formScore: this.getFormScore(),
      feedback: {
        status: this.lastFeedback.status,
        message: this.lastFeedback.message,
        shouldSpeak,
      },
    };
  }
}

/**
 * Biomechanical Analyzer for Bicep Curls with Strict Form Gating
 */
export class CurlAnalyzer {
  constructor() {
    this.reset();
  }

  reset() {
    this.repCount = 0;
    this.state = 'extended'; // 'extended', 'curling', 'peak', 'lowering'
    this.currentAngle = null;
    this.smoothedAngle = null;
    this.minAngleInRep = 180;
    this.hasReachedPeak = false;
    this.repScores = [];
    this.lastFeedback = {
      status: 'info',
      message: 'Extend arms at sides to begin curls.',
      timestamp: 0,
    };
    this.repStartTime = 0;
    this.lastRepTime = 0;
  }

  getFormScore() {
    if (this.repScores.length === 0) return null;
    const sum = this.repScores.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.repScores.length);
  }

  processFrame(landmarks, timestamp = performance.now()) {
    if (!landmarks || landmarks.length < 33) {
      this.currentAngle = null;
      return this._buildResult(false);
    }

    const lAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_ELBOW],
      landmarks[POSE_LANDMARKS.LEFT_WRIST],
      0.35
    );
    const rAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
      landmarks[POSE_LANDMARKS.RIGHT_ELBOW],
      landmarks[POSE_LANDMARKS.RIGHT_WRIST],
      0.35
    );

    const rawAngle = lAngle !== null && rAngle !== null ? Math.min(lAngle, rAngle) : (lAngle || rAngle);

    if (rawAngle === null) {
      this.currentAngle = null;
      return this._buildResult(false);
    }

    if (this.smoothedAngle === null) {
      this.smoothedAngle = rawAngle;
    } else {
      this.smoothedAngle = Math.round(0.65 * rawAngle + 0.35 * this.smoothedAngle);
    }

    const angle = this.smoothedAngle;
    this.currentAngle = angle;
    let shouldSpeak = false;

    // Curl thresholds: Extended >= 138°, Peak Contraction <= 65°
    const EXTENDED = 138;
    const PEAK = 65;

    switch (this.state) {
      case 'extended': {
        if (angle <= 122) {
          this.state = 'curling';
          this.repStartTime = timestamp;
          this.minAngleInRep = angle;
          this.hasReachedPeak = false;
          this.lastFeedback = { status: 'optimal', message: 'Curling upwards. Keep elbows steady.', timestamp };
        }
        break;
      }
      case 'curling': {
        this.minAngleInRep = Math.min(this.minAngleInRep, angle);
        if (angle <= PEAK) {
          this.hasReachedPeak = true;
          this.state = 'peak';
          shouldSpeak = true;
          this.lastFeedback = { status: 'optimal', message: 'Peak contraction! Squeeze biceps.', timestamp };
        }
        break;
      }
      case 'peak': {
        this.minAngleInRep = Math.min(this.minAngleInRep, angle);
        if (angle >= 85) {
          this.state = 'lowering';
          this.lastFeedback = { status: 'optimal', message: 'Lower with controlled eccentric tempo.', timestamp };
        }
        break;
      }
      case 'lowering': {
        if (angle >= EXTENDED) {
          const duration = timestamp - this.repStartTime;
          const timeSinceLast = timestamp - this.lastRepTime;

          if (this.hasReachedPeak && duration >= 900 && timeSinceLast >= 800) {
            this.repCount += 1;
            this.lastRepTime = timestamp;
            this.repScores.push(96);
            this.state = 'extended';
            shouldSpeak = true;
            this.lastFeedback = {
              status: 'optimal',
              message: `Rep ${this.repCount} complete! Full extension achieved.`,
              timestamp,
            };
          } else {
            this.state = 'extended';
          }
        }
        break;
      }
      default:
        this.state = 'extended';
    }

    return this._buildResult(shouldSpeak);
  }

  _buildResult(shouldSpeak) {
    return {
      repCount: this.repCount,
      incompleteReps: 0,
      state: this.state,
      currentAngle: this.currentAngle,
      targetAngle: 65,
      angleLabel: 'Elbow Flexion',
      targetLabel: 'Peak Curl Target',
      activeSide: 'arms',
      formScore: this.getFormScore(),
      feedback: {
        status: this.lastFeedback.status,
        message: this.lastFeedback.message,
        shouldSpeak,
      },
    };
  }
}

/**
 * ============================================================================
 * ROMANIAN DEADLIFT ANALYZER (ex-3)
 * Tracks hip hinge flexion and standing lockout while guarding against squatting
 * and lumbar hyperextension.
 * ============================================================================
 */

export const DEADLIFT_STATES = {
  UNTRACKED: 'untracked',
  STANDING: 'standing',
  HINGING: 'hinging',
  BOTTOM: 'bottom',
  ASCENDING: 'ascending',
};

export const DEFAULT_DEADLIFT_CONFIG = {
  standingHipMin: 150,
  hingingHipMax: 135,
  targetHingeHipMax: 75,
  ascendingHipMin: 95,
  minKneeAngleForHinge: 115,
  minRepDurationMs: 900,
  minTimeBetweenRepsMs: 800,
  minConfidence: 0.35,
  trackingLossTimeoutMs: 2000,
  feedbackCooldownMs: 2800,
};

export class DeadliftAnalyzer {
  constructor(customConfig = {}) {
    this.config = { ...DEFAULT_DEADLIFT_CONFIG, ...customConfig };
    this.reset();
  }

  reset() {
    this.state = DEADLIFT_STATES.UNTRACKED;
    this.repCount = 0;
    this.incompleteReps = 0;
    this.repScores = [];

    this.currentAngle = null;
    this.currentKneeAngle = null;
    this.smoothedHipAngle = null;
    this.smoothedKneeAngle = null;
    this.activeSide = null;

    this.repStartTime = 0;
    this.minHipAngleInRep = 180;
    this.minKneeAngleInRep = 180;
    this.hasReachedDepth = false;
    this.formErrors = [];

    this.lastCompletedRepTime = 0;
    this.lastValidLandmarkTime = 0;

    this.lastFeedback = {
      status: 'info',
      message: 'Stand upright facing side camera to track deadlift hinge.',
      timestamp: 0,
    };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  getFormScore() {
    if (this.repScores.length === 0) return null;
    const sum = this.repScores.reduce((acc, score) => acc + score, 0);
    return Math.round(sum / this.repScores.length);
  }

  setFeedback(status, message, timestamp) {
    const elapsed = timestamp - this.lastFeedback.timestamp;
    const isNewMessage = message !== this.lastFeedback.message;
    const cooldownPassed = elapsed >= this.config.feedbackCooldownMs;

    this.lastFeedback = {
      status,
      message,
      timestamp,
    };

    return isNewMessage || cooldownPassed;
  }

  processFrame(landmarks, timestamp = performance.now()) {
    if (!landmarks || landmarks.length < 33) {
      this.currentAngle = null;
      this.currentKneeAngle = null;
      if (
        this.state !== DEADLIFT_STATES.UNTRACKED &&
        this.state !== DEADLIFT_STATES.STANDING &&
        timestamp - this.lastValidLandmarkTime > this.config.trackingLossTimeoutMs
      ) {
        this.state = DEADLIFT_STATES.UNTRACKED;
        this.setFeedback('warning', 'Athlete obscured. Stand in frame to calibrate.', timestamp);
      }
      return this._buildResult(false);
    }

    const leftHipAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE],
      this.config.minConfidence
    );
    const leftKneeAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE],
      landmarks[POSE_LANDMARKS.LEFT_ANKLE],
      this.config.minConfidence
    );
    const leftVis =
      (landmarks[POSE_LANDMARKS.LEFT_SHOULDER]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.LEFT_HIP]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.LEFT_KNEE]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.LEFT_ANKLE]?.visibility ?? 0);

    const rightHipAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
      landmarks[POSE_LANDMARKS.RIGHT_HIP],
      landmarks[POSE_LANDMARKS.RIGHT_KNEE],
      this.config.minConfidence
    );
    const rightKneeAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.RIGHT_HIP],
      landmarks[POSE_LANDMARKS.RIGHT_KNEE],
      landmarks[POSE_LANDMARKS.RIGHT_ANKLE],
      this.config.minConfidence
    );
    const rightVis =
      (landmarks[POSE_LANDMARKS.RIGHT_SHOULDER]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.RIGHT_HIP]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.RIGHT_KNEE]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.RIGHT_ANKLE]?.visibility ?? 0);

    let selectedSide = null;
    let rawHipAngle = null;
    let rawKneeAngle = null;

    if (leftHipAngle !== null && rightHipAngle !== null) {
      if (this.activeSide === 'left' && leftVis >= rightVis - 0.25) {
        selectedSide = 'left';
      } else if (this.activeSide === 'right' && rightVis >= leftVis - 0.25) {
        selectedSide = 'right';
      } else {
        selectedSide = leftVis >= rightVis ? 'left' : 'right';
      }
    } else if (leftHipAngle !== null) {
      selectedSide = 'left';
    } else if (rightHipAngle !== null) {
      selectedSide = 'right';
    }

    if (!selectedSide) {
      this.currentAngle = null;
      this.currentKneeAngle = null;
      if (
        this.state !== DEADLIFT_STATES.UNTRACKED &&
        this.state !== DEADLIFT_STATES.STANDING &&
        timestamp - this.lastValidLandmarkTime > this.config.trackingLossTimeoutMs
      ) {
        this.state = DEADLIFT_STATES.UNTRACKED;
        this.setFeedback('warning', 'Step back so your full body is visible for deadlifts.', timestamp);
      }
      return this._buildResult(false);
    }

    this.activeSide = selectedSide;
    rawHipAngle = selectedSide === 'left' ? leftHipAngle : rightHipAngle;
    rawKneeAngle = selectedSide === 'left' ? leftKneeAngle : rightKneeAngle;

    if (this.smoothedHipAngle === null) {
      this.smoothedHipAngle = rawHipAngle;
    } else {
      this.smoothedHipAngle = Math.round(0.65 * rawHipAngle + 0.35 * this.smoothedHipAngle);
    }

    if (this.smoothedKneeAngle === null) {
      this.smoothedKneeAngle = rawKneeAngle;
    } else if (rawKneeAngle !== null) {
      this.smoothedKneeAngle = Math.round(0.65 * rawKneeAngle + 0.35 * this.smoothedKneeAngle);
    }

    const hipAngle = this.smoothedHipAngle;
    const kneeAngle = this.smoothedKneeAngle;

    this.currentAngle = hipAngle;
    this.currentKneeAngle = kneeAngle;
    this.lastValidLandmarkTime = timestamp;

    let shouldSpeak = false;

    switch (this.state) {
      case DEADLIFT_STATES.UNTRACKED: {
        if (hipAngle >= this.config.standingHipMin) {
          this.state = DEADLIFT_STATES.STANDING;
          shouldSpeak = this.setFeedback('optimal', 'Calibrated. Stand tall with neutral spine and begin hinge.', timestamp);
        } else {
          this.setFeedback('info', 'Stand upright with hips extended to calibrate deadlift.', timestamp);
        }
        break;
      }

      case DEADLIFT_STATES.STANDING: {
        if (hipAngle <= this.config.hingingHipMax) {
          this.state = DEADLIFT_STATES.HINGING;
          this.repStartTime = timestamp;
          this.minHipAngleInRep = hipAngle;
          this.minKneeAngleInRep = kneeAngle !== null ? kneeAngle : 180;
          this.hasReachedDepth = false;
          this.formErrors = [];
          this.setFeedback('optimal', 'Hinging at hips. Keep back flat and lats tight.', timestamp);
        }
        break;
      }

      case DEADLIFT_STATES.HINGING: {
        this.minHipAngleInRep = Math.min(this.minHipAngleInRep, hipAngle);
        if (kneeAngle !== null) {
          this.minKneeAngleInRep = Math.min(this.minKneeAngleInRep, kneeAngle);
          if (kneeAngle < this.config.minKneeAngleForHinge && !this.formErrors.includes('squatting_error')) {
            this.formErrors.push('squatting_error');
            shouldSpeak = this.setFeedback(
              'warning',
              'Hinge back at the hips — do not squat the deadlift.',
              timestamp
            );
          }
        }

        if (hipAngle <= this.config.targetHingeHipMax) {
          this.hasReachedDepth = true;
          this.state = DEADLIFT_STATES.BOTTOM;
          shouldSpeak = this.setFeedback('optimal', 'Optimal hinge depth reached! Drive hips forward.', timestamp);
        } else if (hipAngle >= this.config.standingHipMin) {
          this.state = DEADLIFT_STATES.STANDING;
          this.incompleteReps += 1;
          shouldSpeak = this.setFeedback(
            'warning',
            'Incomplete hinge — push hips back until torso is near parallel.',
            timestamp
          );
        }
        break;
      }

      case DEADLIFT_STATES.BOTTOM: {
        this.minHipAngleInRep = Math.min(this.minHipAngleInRep, hipAngle);
        if (kneeAngle !== null) {
          this.minKneeAngleInRep = Math.min(this.minKneeAngleInRep, kneeAngle);
        }

        if (hipAngle >= this.config.ascendingHipMin) {
          this.state = DEADLIFT_STATES.ASCENDING;
          this.setFeedback('optimal', 'Ascending. Squeeze glutes and extend hips.', timestamp);
        }
        break;
      }

      case DEADLIFT_STATES.ASCENDING: {
        this.minHipAngleInRep = Math.min(this.minHipAngleInRep, hipAngle);

        if (hipAngle >= this.config.standingHipMin) {
          const repDuration = timestamp - this.repStartTime;
          const timeSinceLastRep = timestamp - this.lastCompletedRepTime;

          if (
            this.hasReachedDepth &&
            repDuration >= this.config.minRepDurationMs &&
            timeSinceLastRep >= this.config.minTimeBetweenRepsMs
          ) {
            this.repCount += 1;
            this.lastCompletedRepTime = timestamp;

            let score = 96;
            if (this.formErrors.includes('squatting_error')) score -= 15;
            this.repScores.push(Math.max(70, score));

            this.state = DEADLIFT_STATES.STANDING;
            shouldSpeak = this.setFeedback(
              'optimal',
              `Rep ${this.repCount} complete! Solid hip lockout.`,
              timestamp
            );
          } else {
            this.state = DEADLIFT_STATES.STANDING;
            if (!this.hasReachedDepth) {
              this.incompleteReps += 1;
              shouldSpeak = this.setFeedback('warning', 'Incomplete hinge depth.', timestamp);
            }
          }
        }
        break;
      }

      default:
        this.state = DEADLIFT_STATES.UNTRACKED;
    }

    return this._buildResult(shouldSpeak);
  }

  _buildResult(shouldSpeak) {
    return {
      repCount: this.repCount,
      incompleteReps: this.incompleteReps,
      state: this.state,
      currentAngle: this.currentAngle,
      currentKneeAngle: this.currentKneeAngle,
      targetAngle: this.config.targetHingeHipMax,
      angleLabel: 'Hip Hinge Flexion',
      targetLabel: 'Hinge Target (75°)',
      activeSide: this.activeSide,
      formScore: this.getFormScore(),
      feedback: {
        status: this.lastFeedback.status,
        message: this.lastFeedback.message,
        shouldSpeak,
      },
    };
  }
}

/**
 * ============================================================================
 * FORWARD WALKING LUNGE ANALYZER (ex-5)
 * Tracks front knee flexion (target <= 95°) and full return to standing lockout
 * (>= 155°) while monitoring torso alignment.
 * ============================================================================
 */

export const LUNGE_STATES = {
  UNTRACKED: 'untracked',
  STANDING: 'standing',
  DESCENDING: 'descending',
  BOTTOM: 'bottom',
  ASCENDING: 'ascending',
};

export const DEFAULT_LUNGE_CONFIG = {
  standingKneeMin: 155,
  descendingKneeMax: 135,
  targetDepthKneeMax: 95,
  ascendingKneeMin: 115,
  torsoHipMin: 65,
  minRepDurationMs: 900,
  minTimeBetweenRepsMs: 800,
  minConfidence: 0.35,
  trackingLossTimeoutMs: 2000,
  feedbackCooldownMs: 2800,
};

export class LungeAnalyzer {
  constructor(customConfig = {}) {
    this.config = { ...DEFAULT_LUNGE_CONFIG, ...customConfig };
    this.reset();
  }

  reset() {
    this.state = LUNGE_STATES.UNTRACKED;
    this.repCount = 0;
    this.incompleteReps = 0;
    this.repScores = [];

    this.currentAngle = null;
    this.smoothedKneeAngle = null;
    this.smoothedHipAngle = null;
    this.activeSide = null;

    this.repStartTime = 0;
    this.minKneeAngleInRep = 180;
    this.hasReachedDepth = false;
    this.formErrors = [];

    this.lastCompletedRepTime = 0;
    this.lastValidLandmarkTime = 0;

    this.lastFeedback = {
      status: 'info',
      message: 'Stand upright with feet together to calibrate lunges.',
      timestamp: 0,
    };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  getFormScore() {
    if (this.repScores.length === 0) return null;
    const sum = this.repScores.reduce((acc, score) => acc + score, 0);
    return Math.round(sum / this.repScores.length);
  }

  setFeedback(status, message, timestamp) {
    const elapsed = timestamp - this.lastFeedback.timestamp;
    const isNewMessage = message !== this.lastFeedback.message;
    const cooldownPassed = elapsed >= this.config.feedbackCooldownMs;

    this.lastFeedback = {
      status,
      message,
      timestamp,
    };

    return isNewMessage || cooldownPassed;
  }

  processFrame(landmarks, timestamp = performance.now()) {
    if (!landmarks || landmarks.length < 33) {
      this.currentAngle = null;
      if (
        this.state !== LUNGE_STATES.UNTRACKED &&
        this.state !== LUNGE_STATES.STANDING &&
        timestamp - this.lastValidLandmarkTime > this.config.trackingLossTimeoutMs
      ) {
        this.state = LUNGE_STATES.UNTRACKED;
        this.setFeedback('warning', 'Athlete obscured. Stand in frame to calibrate.', timestamp);
      }
      return this._buildResult(false);
    }

    const leftKneeAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE],
      landmarks[POSE_LANDMARKS.LEFT_ANKLE],
      this.config.minConfidence
    );
    const leftHipAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_KNEE],
      this.config.minConfidence
    );

    const rightKneeAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.RIGHT_HIP],
      landmarks[POSE_LANDMARKS.RIGHT_KNEE],
      landmarks[POSE_LANDMARKS.RIGHT_ANKLE],
      this.config.minConfidence
    );
    const rightHipAngle = calculateJointAngle(
      landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
      landmarks[POSE_LANDMARKS.RIGHT_HIP],
      landmarks[POSE_LANDMARKS.RIGHT_KNEE],
      this.config.minConfidence
    );

    let rawKneeAngle = null;
    let rawHipAngle = null;
    let activeSide = null;

    if (leftKneeAngle !== null && rightKneeAngle !== null) {
      if (leftKneeAngle <= rightKneeAngle) {
        rawKneeAngle = leftKneeAngle;
        rawHipAngle = leftHipAngle;
        activeSide = 'left';
      } else {
        rawKneeAngle = rightKneeAngle;
        rawHipAngle = rightHipAngle;
        activeSide = 'right';
      }
    } else if (leftKneeAngle !== null) {
      rawKneeAngle = leftKneeAngle;
      rawHipAngle = leftHipAngle;
      activeSide = 'left';
    } else if (rightKneeAngle !== null) {
      rawKneeAngle = rightKneeAngle;
      rawHipAngle = rightHipAngle;
      activeSide = 'right';
    }

    if (rawKneeAngle === null) {
      this.currentAngle = null;
      if (
        this.state !== LUNGE_STATES.UNTRACKED &&
        this.state !== LUNGE_STATES.STANDING &&
        timestamp - this.lastValidLandmarkTime > this.config.trackingLossTimeoutMs
      ) {
        this.state = LUNGE_STATES.UNTRACKED;
        this.setFeedback('warning', 'Step back so legs are visible for lunges.', timestamp);
      }
      return this._buildResult(false);
    }

    this.activeSide = activeSide;

    if (this.smoothedKneeAngle === null) {
      this.smoothedKneeAngle = rawKneeAngle;
    } else {
      this.smoothedKneeAngle = Math.round(0.65 * rawKneeAngle + 0.35 * this.smoothedKneeAngle);
    }

    if (this.smoothedHipAngle === null) {
      this.smoothedHipAngle = rawHipAngle;
    } else if (rawHipAngle !== null) {
      this.smoothedHipAngle = Math.round(0.65 * rawHipAngle + 0.35 * this.smoothedHipAngle);
    }

    const kneeAngle = this.smoothedKneeAngle;
    const hipAngle = this.smoothedHipAngle;

    this.currentAngle = kneeAngle;
    this.lastValidLandmarkTime = timestamp;

    let shouldSpeak = false;

    switch (this.state) {
      case LUNGE_STATES.UNTRACKED: {
        if (kneeAngle >= this.config.standingKneeMin) {
          this.state = LUNGE_STATES.STANDING;
          shouldSpeak = this.setFeedback('optimal', 'Calibrated. Stand upright and step into your lunge.', timestamp);
        } else {
          this.setFeedback('info', 'Stand upright with knees extended to calibrate lunges.', timestamp);
        }
        break;
      }

      case LUNGE_STATES.STANDING: {
        if (kneeAngle <= this.config.descendingKneeMax) {
          this.state = LUNGE_STATES.DESCENDING;
          this.repStartTime = timestamp;
          this.minKneeAngleInRep = kneeAngle;
          this.hasReachedDepth = false;
          this.formErrors = [];
          this.setFeedback('optimal', 'Stepping into lunge. Keep torso upright.', timestamp);
        }
        break;
      }

      case LUNGE_STATES.DESCENDING: {
        this.minKneeAngleInRep = Math.min(this.minKneeAngleInRep, kneeAngle);

        if (hipAngle !== null && hipAngle < this.config.torsoHipMin) {
          if (!this.formErrors.includes('torso_forward')) {
            this.formErrors.push('torso_forward');
            shouldSpeak = this.setFeedback(
              'warning',
              'Keep torso upright — avoid collapsing forward onto front thigh.',
              timestamp
            );
          }
        }

        if (kneeAngle <= this.config.targetDepthKneeMax) {
          this.hasReachedDepth = true;
          this.state = LUNGE_STATES.BOTTOM;
          shouldSpeak = this.setFeedback('optimal', 'Optimal 90° lunge depth! Drive up through front heel.', timestamp);
        } else if (kneeAngle >= this.config.standingKneeMin) {
          this.state = LUNGE_STATES.STANDING;
          this.incompleteReps += 1;
          shouldSpeak = this.setFeedback(
            'warning',
            'Incomplete depth — drop back knee lower until front thigh is parallel.',
            timestamp
          );
        }
        break;
      }

      case LUNGE_STATES.BOTTOM: {
        this.minKneeAngleInRep = Math.min(this.minKneeAngleInRep, kneeAngle);

        if (kneeAngle >= this.config.ascendingKneeMin) {
          this.state = LUNGE_STATES.ASCENDING;
          this.setFeedback('optimal', 'Ascending. Drive through front heel to standing.', timestamp);
        }
        break;
      }

      case LUNGE_STATES.ASCENDING: {
        this.minKneeAngleInRep = Math.min(this.minKneeAngleInRep, kneeAngle);

        if (kneeAngle >= this.config.standingKneeMin) {
          const repDuration = timestamp - this.repStartTime;
          const timeSinceLastRep = timestamp - this.lastCompletedRepTime;

          if (
            this.hasReachedDepth &&
            repDuration >= this.config.minRepDurationMs &&
            timeSinceLastRep >= this.config.minTimeBetweenRepsMs
          ) {
            this.repCount += 1;
            this.lastCompletedRepTime = timestamp;

            let score = 95;
            if (this.formErrors.includes('torso_forward')) score -= 12;
            this.repScores.push(Math.max(70, score));

            this.state = LUNGE_STATES.STANDING;
            shouldSpeak = this.setFeedback(
              'optimal',
              `Rep ${this.repCount} complete! Solid lunge depth & balance.`,
              timestamp
            );
          } else {
            this.state = LUNGE_STATES.STANDING;
            if (!this.hasReachedDepth) {
              this.incompleteReps += 1;
              shouldSpeak = this.setFeedback('warning', 'Incomplete lunge depth.', timestamp);
            }
          }
        }
        break;
      }

      default:
        this.state = LUNGE_STATES.UNTRACKED;
    }

    return this._buildResult(shouldSpeak);
  }

  _buildResult(shouldSpeak) {
    return {
      repCount: this.repCount,
      incompleteReps: this.incompleteReps,
      state: this.state,
      currentAngle: this.currentAngle,
      targetAngle: this.config.targetDepthKneeMax,
      angleLabel: 'Front Knee Flexion',
      targetLabel: 'Lunge Target (90°)',
      activeSide: this.activeSide,
      formScore: this.getFormScore(),
      feedback: {
        status: this.lastFeedback.status,
        message: this.lastFeedback.message,
        shouldSpeak,
      },
    };
  }
}

/**
 * ============================================================================
 * ISOMETRIC CORE PLANK ANALYZER (ex-6)
 * Evaluates straight-line spine-to-hip alignment (160° to 195°), detects
 * sagging vs piking, and increments hold time in seconds.
 * ============================================================================
 */

export const PLANK_STATES = {
  UNTRACKED: 'untracked',
  HOLDING: 'holding',
  SAGGING: 'sagging',
  PIKING: 'piking',
};

export const DEFAULT_PLANK_CONFIG = {
  minHoldingAlignment: 160,
  maxHoldingAlignment: 195,
  minConfidence: 0.35,
  trackingLossTimeoutMs: 2000,
  feedbackCooldownMs: 2800,
};

export class PlankAnalyzer {
  constructor(customConfig = {}) {
    this.config = { ...DEFAULT_PLANK_CONFIG, ...customConfig };
    this.reset();
  }

  reset() {
    this.state = PLANK_STATES.UNTRACKED;
    this.repCount = 0; // Cumulative seconds held in good form
    this.holdTimeSeconds = 0;
    this.accumulatedGoodTimeMs = 0;
    this.lastFrameTimestamp = 0;

    this.currentAngle = null;
    this.smoothedAlignmentAngle = null;
    this.activeSide = null;

    this.goodPostureFrames = 0;
    this.totalTrackingFrames = 0;
    this.lastSpokenMilestone = 0;

    this.lastFeedback = {
      status: 'info',
      message: 'Position body in forearm or high plank with straight spine.',
      timestamp: 0,
    };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  getFormScore() {
    if (this.totalTrackingFrames === 0) return null;
    const ratio = this.goodPostureFrames / this.totalTrackingFrames;
    return Math.min(100, Math.max(60, Math.round(ratio * 95 + 5)));
  }

  setFeedback(status, message, timestamp) {
    const elapsed = timestamp - this.lastFeedback.timestamp;
    const isNewMessage = message !== this.lastFeedback.message;
    const cooldownPassed = elapsed >= this.config.feedbackCooldownMs;

    this.lastFeedback = {
      status,
      message,
      timestamp,
    };

    return isNewMessage || cooldownPassed;
  }

  processFrame(landmarks, timestamp = performance.now()) {
    if (!landmarks || landmarks.length < 33) {
      this.currentAngle = null;
      if (
        this.state !== PLANK_STATES.UNTRACKED &&
        timestamp - this.lastFrameTimestamp > this.config.trackingLossTimeoutMs
      ) {
        this.state = PLANK_STATES.UNTRACKED;
        this.setFeedback('warning', 'Athlete obscured. Position body in side view for plank.', timestamp);
      }
      this.lastFrameTimestamp = timestamp;
      return this._buildResult(false);
    }

    const leftAlignment = calculateJointAngle(
      landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
      landmarks[POSE_LANDMARKS.LEFT_HIP],
      landmarks[POSE_LANDMARKS.LEFT_ANKLE],
      this.config.minConfidence
    );
    const leftVis =
      (landmarks[POSE_LANDMARKS.LEFT_SHOULDER]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.LEFT_HIP]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.LEFT_ANKLE]?.visibility ?? 0);

    const rightAlignment = calculateJointAngle(
      landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
      landmarks[POSE_LANDMARKS.RIGHT_HIP],
      landmarks[POSE_LANDMARKS.RIGHT_ANKLE],
      this.config.minConfidence
    );
    const rightVis =
      (landmarks[POSE_LANDMARKS.RIGHT_SHOULDER]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.RIGHT_HIP]?.visibility ?? 0) +
      (landmarks[POSE_LANDMARKS.RIGHT_ANKLE]?.visibility ?? 0);

    let rawAlignment = null;
    let selectedSide = null;
    let shoulderPt = null;
    let hipPt = null;
    let anklePt = null;

    if (leftAlignment !== null && rightAlignment !== null) {
      if (leftVis >= rightVis) {
        rawAlignment = leftAlignment;
        selectedSide = 'left';
        shoulderPt = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
        hipPt = landmarks[POSE_LANDMARKS.LEFT_HIP];
        anklePt = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
      } else {
        rawAlignment = rightAlignment;
        selectedSide = 'right';
        shoulderPt = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
        hipPt = landmarks[POSE_LANDMARKS.RIGHT_HIP];
        anklePt = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];
      }
    } else if (leftAlignment !== null) {
      rawAlignment = leftAlignment;
      selectedSide = 'left';
      shoulderPt = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      hipPt = landmarks[POSE_LANDMARKS.LEFT_HIP];
      anklePt = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    } else if (rightAlignment !== null) {
      rawAlignment = rightAlignment;
      selectedSide = 'right';
      shoulderPt = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
      hipPt = landmarks[POSE_LANDMARKS.RIGHT_HIP];
      anklePt = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];
    }

    if (rawAlignment === null) {
      this.currentAngle = null;
      if (
        this.state !== PLANK_STATES.UNTRACKED &&
        timestamp - this.lastFrameTimestamp > this.config.trackingLossTimeoutMs
      ) {
        this.state = PLANK_STATES.UNTRACKED;
        this.setFeedback('warning', 'Step back so shoulder, hips, and ankles are in frame.', timestamp);
      }
      this.lastFrameTimestamp = timestamp;
      return this._buildResult(false);
    }

    this.activeSide = selectedSide;

    if (this.smoothedAlignmentAngle === null) {
      this.smoothedAlignmentAngle = rawAlignment;
    } else {
      this.smoothedAlignmentAngle = Math.round(0.65 * rawAlignment + 0.35 * this.smoothedAlignmentAngle);
    }

    const alignmentAngle = this.smoothedAlignmentAngle;
    this.currentAngle = alignmentAngle;
    this.totalTrackingFrames++;

    const deltaMs = this.lastFrameTimestamp > 0 ? Math.min(1000, Math.max(0, timestamp - this.lastFrameTimestamp)) : 0;
    this.lastFrameTimestamp = timestamp;

    let shouldSpeak = false;

    // Check if alignment is within solid holding range (160° - 195°)
    if (alignmentAngle >= this.config.minHoldingAlignment && alignmentAngle <= this.config.maxHoldingAlignment) {
      this.state = PLANK_STATES.HOLDING;
      this.goodPostureFrames++;
      this.accumulatedGoodTimeMs += deltaMs;
      this.repCount = Math.floor(this.accumulatedGoodTimeMs / 1000);
      this.holdTimeSeconds = Math.round(this.accumulatedGoodTimeMs / 100) / 10;

      // Milestone audio cues at 15s intervals
      if (this.repCount >= 15 && this.repCount % 15 === 0 && this.repCount !== this.lastSpokenMilestone) {
        this.lastSpokenMilestone = this.repCount;
        shouldSpeak = this.setFeedback(
          'optimal',
          `${this.repCount} seconds held! Solid core stability.`,
          timestamp
        );
      } else {
        this.setFeedback('optimal', `Holding solid plank (${this.repCount}s). Core braced.`, timestamp);
      }
    } else {
      // Form error: determine sagging vs piking
      const midY = (shoulderPt.y + anklePt.y) / 2;
      const isSagging = hipPt.y > midY; // Hip dipped toward floor

      if (isSagging) {
        this.state = PLANK_STATES.SAGGING;
        shouldSpeak = this.setFeedback(
          'warning',
          'Hips sagging! Engage core and squeeze glutes to straighten spine.',
          timestamp
        );
      } else {
        this.state = PLANK_STATES.PIKING;
        shouldSpeak = this.setFeedback(
          'warning',
          'Hips too high! Lower hips into a straight line with shoulders.',
          timestamp
        );
      }
    }

    return this._buildResult(shouldSpeak);
  }

  _buildResult(shouldSpeak) {
    return {
      repCount: this.repCount,
      holdTimeSeconds: this.holdTimeSeconds,
      incompleteReps: 0,
      state: this.state,
      currentAngle: this.currentAngle,
      targetAngle: 180,
      angleLabel: 'Spine Alignment',
      targetLabel: 'Straight Plank (180°)',
      activeSide: this.activeSide,
      formScore: this.getFormScore(),
      feedback: {
        status: this.lastFeedback.status,
        message: this.lastFeedback.message,
        shouldSpeak,
      },
    };
  }
}

/**
 * Universal Multi-Exercise Movement Analyzer
 * Supports all 6 exercises (ex-1 through ex-6)
 */
export class ExerciseAnalyzer {
  constructor(exerciseId = 'ex-1') {
    this.squatAnalyzer = new SquatAnalyzer();
    this.pushupAnalyzer = new PushupAnalyzer();
    this.deadliftAnalyzer = new DeadliftAnalyzer();
    this.curlAnalyzer = new CurlAnalyzer();
    this.lungeAnalyzer = new LungeAnalyzer();
    this.plankAnalyzer = new PlankAnalyzer();
    this.setExercise(exerciseId);
  }

  setExercise(exerciseId = 'ex-1') {
    this.exerciseId = exerciseId;
    const id = (exerciseId || '').toLowerCase();
    if (id.includes('push') || id === 'ex-2') {
      this.currentMode = 'pushup';
    } else if (id.includes('deadlift') || id.includes('rdl') || id === 'ex-3') {
      this.currentMode = 'deadlift';
    } else if (id.includes('curl') || id === 'ex-4') {
      this.currentMode = 'curl';
    } else if (id.includes('lunge') || id === 'ex-5') {
      this.currentMode = 'lunge';
    } else if (id.includes('plank') || id === 'ex-6') {
      this.currentMode = 'plank';
    } else {
      this.currentMode = 'squat';
    }
    this.reset();
  }

  getActiveAnalyzer() {
    switch (this.currentMode) {
      case 'pushup':
        return this.pushupAnalyzer;
      case 'deadlift':
        return this.deadliftAnalyzer;
      case 'curl':
        return this.curlAnalyzer;
      case 'lunge':
        return this.lungeAnalyzer;
      case 'plank':
        return this.plankAnalyzer;
      case 'squat':
      default:
        return this.squatAnalyzer;
    }
  }

  get config() {
    const active = this.getActiveAnalyzer();
    return active.config || this.squatAnalyzer.config;
  }

  updateConfig(cfg) {
    const active = this.getActiveAnalyzer();
    if (active && typeof active.updateConfig === 'function') {
      active.updateConfig(cfg);
    }
  }

  reset() {
    this.getActiveAnalyzer().reset();
  }

  processFrame(landmarks, timestamp = performance.now()) {
    return this.getActiveAnalyzer().processFrame(landmarks, timestamp);
  }
}

