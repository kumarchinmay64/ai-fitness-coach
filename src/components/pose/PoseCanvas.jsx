import React, { useEffect, useRef } from 'react';
import {
  POSE_LANDMARKS,
  POSE_CONNECTIONS,
  getLandmarkPixelCoordinates,
} from '../../services/poseDetection';

export default function PoseCanvas({
  isTracking = true,
  exerciseType = 'squats',
  landmarks = null,
  videoRef = null,
  isLiveMode = false,
  isModelLoading = false,
  currentAngle = null,
  targetAngle = 90,
  hasError = false,
  errorMessage = '',
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const videoElement = videoRef?.current;

    // Responsive canvas dimensions to match display client size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (canvas.width !== Math.round(rect.width) || canvas.height !== Math.round(rect.height)) {
          canvas.width = Math.round(rect.width);
          canvas.height = Math.round(rect.height);
        }
      }
    };
    updateCanvasSize();

    // ==========================================
    // RENDER PATH 1: REAL MEDIAPIPE LIVE DETECTION
    // ==========================================
    if (isLiveMode) {
      updateCanvasSize();
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (!isTracking) {
        return;
      }

      // State A: Model is loading
      if (isModelLoading) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 245, 155, 0.85)';
        ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('INITIALIZING VISION ENGINE (WASM / GPU)...', width / 2, height / 2);
        ctx.restore();
        return;
      }

      // State B: Live mode active, but no pose detected in frame
      if (!landmarks || landmarks.length === 0) {
        ctx.save();
        const cx = width / 2;
        const cy = height / 2;

        // Subtle target guide corners
        const boxW = Math.min(width * 0.45, 260);
        const boxH = Math.min(height * 0.7, 400);
        const cornerLen = 20;

        ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
        ctx.lineWidth = 2;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(cx - boxW / 2, cy - boxH / 2 + cornerLen);
        ctx.lineTo(cx - boxW / 2, cy - boxH / 2);
        ctx.lineTo(cx - boxW / 2 + cornerLen, cy - boxH / 2);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(cx + boxW / 2 - cornerLen, cy - boxH / 2);
        ctx.lineTo(cx + boxW / 2, cy - boxH / 2);
        ctx.lineTo(cx + boxW / 2, cy - boxH / 2 + cornerLen);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(cx - boxW / 2, cy + boxH / 2 - cornerLen);
        ctx.lineTo(cx - boxW / 2, cy + boxH / 2);
        ctx.lineTo(cx - boxW / 2 + cornerLen, cy + boxH / 2);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(cx + boxW / 2 - cornerLen, cy + boxH / 2);
        ctx.lineTo(cx + boxW / 2, cy + boxH / 2);
        ctx.lineTo(cx + boxW / 2, cy + boxH / 2 - cornerLen);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('POSITION YOUR FULL BODY IN FRAME', cx, cy + boxH / 2 + 30);

        ctx.restore();
        return;
      }

      // State C: Actual MediaPipe Pose Detected!
      // Map all 33 landmarks to canvas pixels
      const pixelPoints = landmarks.map((lm) =>
        getLandmarkPixelCoordinates(lm, width, height, videoElement, true)
      );

      const MIN_CONFIDENCE = 0.5;

      // 1. Draw Skeletal Connections (Bones)
      POSE_CONNECTIONS.forEach(([idxA, idxB]) => {
        const pA = pixelPoints[idxA];
        const pB = pixelPoints[idxB];
        if (!pA || !pB) return;
        if (pA.visibility < MIN_CONFIDENCE || pB.visibility < MIN_CONFIDENCE) return;

        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = hasError
          ? 'rgba(255, 107, 0, 0.85)'
          : 'rgba(0, 245, 155, 0.85)';
        ctx.shadowColor = hasError ? '#FF6B00' : '#00F59B';
        ctx.shadowBlur = 10;
        ctx.stroke();
      });

      // 2. Draw Joint Keypoints
      pixelPoints.forEach((pt, idx) => {
        if (!pt || pt.visibility < MIN_CONFIDENCE) return;

        // Determine node importance / radius
        const isCoreJoint =
          idx === POSE_LANDMARKS.LEFT_HIP ||
          idx === POSE_LANDMARKS.RIGHT_HIP ||
          idx === POSE_LANDMARKS.LEFT_KNEE ||
          idx === POSE_LANDMARKS.RIGHT_KNEE ||
          idx === POSE_LANDMARKS.LEFT_ANKLE ||
          idx === POSE_LANDMARKS.RIGHT_ANKLE ||
          idx === POSE_LANDMARKS.LEFT_SHOULDER ||
          idx === POSE_LANDMARKS.RIGHT_SHOULDER ||
          idx === POSE_LANDMARKS.LEFT_ELBOW ||
          idx === POSE_LANDMARKS.RIGHT_ELBOW;

        const radius = isCoreJoint ? 6 : 4;

        // Outer glow circle
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = hasError ? '#FF6B00' : '#00F59B';
        ctx.shadowColor = hasError ? '#FF6B00' : '#00F59B';
        ctx.shadowBlur = 12;
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 0;
        ctx.fill();
      });

      // 3. Draw Real Joint Angle Indicator Overlay if available
      if (currentAngle !== null && currentAngle !== undefined) {
        // Choose best joint node to attach the HUD arc
        let activeJoint = null;
        const exType = exerciseType.toLowerCase();

        if (exType.includes('squat') || exType.includes('lunge')) {
          // Knee: pick the more visible one
          const lKnee = pixelPoints[POSE_LANDMARKS.LEFT_KNEE];
          const rKnee = pixelPoints[POSE_LANDMARKS.RIGHT_KNEE];
          if (lKnee && lKnee.visibility >= MIN_CONFIDENCE) {
            activeJoint = lKnee;
          } else if (rKnee && rKnee.visibility >= MIN_CONFIDENCE) {
            activeJoint = rKnee;
          }
        } else if (exType.includes('push') || exType.includes('curl') || exType.includes('chest')) {
          // Elbow: pick the more visible one
          const lElbow = pixelPoints[POSE_LANDMARKS.LEFT_ELBOW];
          const rElbow = pixelPoints[POSE_LANDMARKS.RIGHT_ELBOW];
          if (lElbow && lElbow.visibility >= MIN_CONFIDENCE) {
            activeJoint = lElbow;
          } else if (rElbow && rElbow.visibility >= MIN_CONFIDENCE) {
            activeJoint = rElbow;
          }
        }

        if (activeJoint) {
          const arcRadius = 26;
          ctx.beginPath();
          ctx.arc(activeJoint.x, activeJoint.y, arcRadius, 0, Math.PI * 0.65);
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = currentAngle <= targetAngle ? '#00F59B' : '#FF6B00';
          ctx.stroke();

          // Angle tag box
          ctx.font = 'bold 12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(activeJoint.x - 52, activeJoint.y - 12, 46, 22);
          ctx.strokeStyle = currentAngle <= targetAngle ? '#00F59B' : '#FF6B00';
          ctx.lineWidth = 1;
          ctx.strokeRect(activeJoint.x - 52, activeJoint.y - 12, 46, 22);

          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(`${currentAngle}°`, activeJoint.x - 46, activeJoint.y + 4);
        }
      }

      return;
    }

    // ==========================================
    // RENDER PATH 2: FALLBACK SIMULATION PREVIEW
    // (Only executed when Live Webcam is disabled)
    // ==========================================
    let t = 0;
    const renderSimulation = () => {
      t += 0.04;
      updateCanvasSize();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      if (!isTracking) return;

      const cx = width / 2;
      const cy = height * 0.45;
      const squatFactor = Math.sin(t) * 0.5 + 0.5;
      const effectiveFactor =
        exerciseType === 'squats' ? squatFactor : Math.sin(t * 1.2) * 0.5 + 0.5;
      const scale = Math.min(width, height) / 460;

      const headY = cy - 130 * scale + effectiveFactor * 65 * scale;
      const neckY = headY + 35 * scale;
      const spineY = neckY + 80 * scale;

      const leftShoulder = { x: cx - 45 * scale, y: neckY + 10 * scale };
      const rightShoulder = { x: cx + 45 * scale, y: neckY + 10 * scale };
      const elbowY = neckY + 45 * scale;
      const handY = neckY + 75 * scale;
      const leftElbow = { x: leftShoulder.x - 25 * scale, y: elbowY };
      const rightElbow = { x: rightShoulder.x + 25 * scale, y: elbowY };
      const leftWrist = { x: leftElbow.x + 15 * scale, y: handY };
      const rightWrist = { x: rightElbow.x - 15 * scale, y: handY };

      const hipY = spineY + effectiveFactor * 75 * scale;
      const leftHip = { x: cx - 35 * scale, y: hipY };
      const rightHip = { x: cx + 35 * scale, y: hipY };

      const kneeSpread = hasError ? 30 * scale : 50 * scale + effectiveFactor * 15 * scale;
      const kneeY = cy + 70 * scale + effectiveFactor * 25 * scale;
      const leftKnee = { x: cx - kneeSpread, y: kneeY };
      const rightKnee = { x: cx + kneeSpread, y: kneeY };

      const ankleY = cy + 180 * scale;
      const leftAnkle = { x: cx - 45 * scale, y: ankleY };
      const rightAnkle = { x: cx + 45 * scale, y: ankleY };

      const bones = [
        [leftShoulder, rightShoulder],
        [{ x: cx, y: neckY }, { x: cx, y: spineY }],
        [leftShoulder, leftElbow],
        [leftElbow, leftWrist],
        [rightShoulder, rightElbow],
        [rightElbow, rightWrist],
        [{ x: cx, y: spineY }, leftHip],
        [{ x: cx, y: spineY }, rightHip],
        [leftHip, rightHip],
        [leftHip, leftKnee],
        [leftKnee, leftAnkle],
        [rightHip, rightKnee],
        [rightKnee, rightAnkle],
      ];

      bones.forEach(([p1, p2]) => {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = 4 * scale;
        ctx.strokeStyle = hasError ? 'rgba(255, 107, 0, 0.75)' : 'rgba(0, 245, 155, 0.75)';
        ctx.lineCap = 'round';
        ctx.shadowColor = hasError ? '#FF6B00' : '#00F59B';
        ctx.shadowBlur = 10;
        ctx.stroke();
      });

      const keypoints = [
        { x: cx, y: headY, r: 18 * scale },
        { x: cx, y: neckY, r: 7 * scale },
        { ...leftShoulder, r: 8 * scale },
        { ...rightShoulder, r: 8 * scale },
        { ...leftElbow, r: 7 * scale },
        { ...rightElbow, r: 7 * scale },
        { ...leftWrist, r: 6 * scale },
        { ...rightWrist, r: 6 * scale },
        { ...leftHip, r: 9 * scale },
        { ...rightHip, r: 9 * scale },
        { ...leftKnee, r: 9 * scale },
        { ...rightKnee, r: 9 * scale },
        { ...leftAnkle, r: 7 * scale },
        { ...rightAnkle, r: 7 * scale },
      ];

      keypoints.forEach((kp) => {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, kp.r, 0, Math.PI * 2);
        ctx.fillStyle = hasError ? '#FF6B00' : '#00F59B';
        ctx.shadowColor = hasError ? '#FF6B00' : '#00F59B';
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(kp.x, kp.y, kp.r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 0;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(renderSimulation);
    };

    renderSimulation();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    isTracking,
    isLiveMode,
    isModelLoading,
    landmarks,
    currentAngle,
    targetAngle,
    exerciseType,
    hasError,
    videoRef,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-20 ${className}`}
    />
  );
}
