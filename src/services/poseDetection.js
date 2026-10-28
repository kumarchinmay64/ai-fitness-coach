import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';

/**
 * 33 Standard MediaPipe Pose Landmarks
 */
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

/**
 * Skeletal Connections (pairs of landmark indices)
 */
export const POSE_CONNECTIONS = [
  // Face & Head
  [0, 1], [1, 2], [2, 3], [3, 7],
  [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10],
  // Shoulders & Torso
  [11, 12],
  [11, 23],
  [12, 24],
  [23, 24],
  // Left Upper Body
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  // Right Upper Body
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  // Left Lower Body
  [23, 25], [25, 27], [27, 29], [27, 31], [29, 31],
  // Right Lower Body
  [24, 26], [26, 28], [28, 30], [28, 32], [30, 32],
];

let landmarkerInstance = null;
let initPromise = null;

const WASM_LOCAL_PATH = '/wasm';
const WASM_CDN_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm';

const MODEL_LOCAL_PATH = '/models/pose_landmarker_lite.task';
const MODEL_CDN_PATH =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

/**
 * Initializes and returns a singleton PoseLandmarker instance.
 * Automatically tries local static assets first, falling back to Google Cloud / jsDelivr CDN.
 * Tries GPU delegate first, falling back to CPU delegate if unsupported.
 */
export async function getPoseLandmarker() {
  if (landmarkerInstance) {
    return landmarkerInstance;
  }
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    // 1. Resolve Wasm Fileset
    let vision = null;
    try {
      vision = await FilesetResolver.forVisionTasks(WASM_LOCAL_PATH);
    } catch (localWasmErr) {
      console.warn('Local MediaPipe Wasm fileset load failed, falling back to CDN:', localWasmErr);
      vision = await FilesetResolver.forVisionTasks(WASM_CDN_PATH);
    }

    // 2. Instantiate PoseLandmarker
    const createWithOptions = async (modelPath, delegate) => {
      return await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: modelPath,
          delegate: delegate,
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
    };

    let landmarker = null;
    const modelCandidates = [MODEL_LOCAL_PATH, MODEL_CDN_PATH];
    const delegates = ['GPU', 'CPU'];
    let lastError = null;

    for (const modelPath of modelCandidates) {
      for (const delegate of delegates) {
        try {
          landmarker = await createWithOptions(modelPath, delegate);
          if (landmarker) {
            console.log(`MediaPipe PoseLandmarker initialized (${delegate} delegate, model: ${modelPath})`);
            break;
          }
        } catch (err) {
          lastError = err;
          console.warn(`Failed to initialize PoseLandmarker (${delegate}, ${modelPath}):`, err);
        }
      }
      if (landmarker) break;
    }

    if (!landmarker) {
      initPromise = null;
      throw new Error(`Failed to initialize MediaPipe PoseLandmarker: ${lastError?.message || 'Unknown error'}`);
    }

    landmarkerInstance = landmarker;
    return landmarkerInstance;
  })();

  return initPromise;
}

/**
 * Closes the active landmarker instance and releases WebGL/Wasm memory.
 */
export function closePoseLandmarker() {
  if (landmarkerInstance) {
    try {
      landmarkerInstance.close();
    } catch (e) {
      console.warn('Error during PoseLandmarker close:', e);
    }
    landmarkerInstance = null;
  }
  initPromise = null;
}

/**
 * Calculates 2D angle in degrees formed by (pointA, pointB, pointC) with pointB as the vertex.
 * Returns null if any point is missing or below minimum confidence threshold.
 */
export function calculateJointAngle(pointA, pointB, pointC, minConfidence = 0.25) {
  if (!pointA || !pointB || !pointC) return null;

  if (
    (pointA.visibility !== undefined && pointA.visibility < minConfidence) ||
    (pointB.visibility !== undefined && pointB.visibility < minConfidence) ||
    (pointC.visibility !== undefined && pointC.visibility < minConfidence)
  ) {
    return null;
  }

  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);

  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }

  return Math.round(angle);
}

/**
 * Translates normalized [0, 1] landmark coordinates to pixel coordinates on the overlay canvas.
 * Perfectly aligns with video elements that have CSS object-cover and horizontal mirroring (-scale-x-100).
 */
export function getLandmarkPixelCoordinates(
  landmark,
  canvasWidth,
  canvasHeight,
  videoElement,
  isMirrored = true
) {
  if (!landmark) return null;

  if (!videoElement || !videoElement.videoWidth || !videoElement.videoHeight) {
    const normX = isMirrored ? 1 - landmark.x : landmark.x;
    return {
      x: normX * canvasWidth,
      y: landmark.y * canvasHeight,
      visibility: landmark.visibility ?? 1,
    };
  }

  const videoW = videoElement.videoWidth;
  const videoH = videoElement.videoHeight;
  const videoAspect = videoW / videoH;
  const canvasAspect = canvasWidth / canvasHeight;

  let scale;
  let offsetX;
  let offsetY;

  if (canvasAspect > videoAspect) {
    // Canvas is wider than video: video is scaled to canvasWidth and cropped top/bottom
    scale = canvasWidth / videoW;
    offsetX = 0;
    offsetY = (canvasHeight - videoH * scale) / 2;
  } else {
    // Canvas is taller than video: video is scaled to canvasHeight and cropped left/right
    scale = canvasHeight / videoH;
    offsetX = (canvasWidth - videoW * scale) / 2;
    offsetY = 0;
  }

  const normX = isMirrored ? 1 - landmark.x : landmark.x;
  return {
    x: offsetX + normX * videoW * scale,
    y: offsetY + landmark.y * videoH * scale,
    visibility: landmark.visibility ?? 1,
  };
}
