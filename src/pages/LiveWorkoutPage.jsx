import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import PoseCanvas from '../components/pose/PoseCanvas';
import FormFeedbackHUD from '../components/pose/FormFeedbackHUD';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { MOCK_EXERCISES } from '../data/mockWorkouts';
import { api } from '../services/api';
import {
  getPoseLandmarker
} from '../services/poseDetection';
import { ExerciseAnalyzer } from '../services/squatAnalyzer';
import {
  Camera,
  CameraOff,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  AlertCircle,
  Dumbbell,
  Award,
  Video
} from 'lucide-react';

export default function LiveWorkoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryExerciseId = searchParams.get('exercise');

  // Selected exercise
  const [selectedExerciseId, setSelectedExerciseId] = useState(queryExerciseId || 'ex-1');
  const selectedExercise =
    MOCK_EXERCISES.find((ex) => ex.id === selectedExerciseId) || MOCK_EXERCISES[0];

  // Session state
  const [isActive, setIsActive] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [currentReps, setCurrentReps] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const totalSets = selectedExercise.defaultSets || 4;
  const targetReps = selectedExercise.defaultReps || 10;
  const [formScore, setFormScore] = useState(94); // null in live camera mode until reps occur

  // Dynamic feedback state
  const [feedbackStatus, setFeedbackStatus] = useState('optimal'); // 'optimal', 'warning', 'error', 'info'
  const [feedbackMessage, setFeedbackMessage] = useState(
    'Optimal depth reached. Keep chest tall through lockout!'
  );
  const [hasPostureError, setHasPostureError] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(88);

  // Camera & MediaPipe Detection State
  const [cameraMode, setCameraMode] = useState('simulation'); // 'webcam' or 'simulation'
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelError, setModelError] = useState(null);
  const [liveLandmarks, setLiveLandmarks] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Dynamic exercise targets & metrics
  const [analysisTargetAngle, setAnalysisTargetAngle] = useState(100);
  const [analysisAngleLabel, setAnalysisAngleLabel] = useState('Knee Flexion');
  const [analysisTargetLabel, setAnalysisTargetLabel] = useState('Parallel Target');

  // Completion modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const movementAnalyzerRef = useRef(new ExerciseAnalyzer(queryExerciseId || 'ex-1'));
  const lastSpeechTimestampRef = useRef(0);
  const lastSpeechTextRef = useRef('');
  const animFrameRef = useRef(null);
  const hasLoggedFirstPoseFrameRef = useRef(false);

  // Diagnostic logging for component mount & unmount
  useEffect(() => {
    console.log('[LiveWorkout Diagnostics] Component mounted');
    console.log('[LiveWorkout Diagnostics] Fullscreen / style check: document.fullscreenElement is', document.fullscreenElement, 'body overflow:', document.body.style.overflow);
    return () => {
      console.log('[LiveWorkout Diagnostics] Component unmounted');
    };
  }, []);

  // Sync if query param changes dynamically
  useEffect(() => {
    console.log('[LiveWorkout Diagnostics] Query param sync effect start', { queryExerciseId, selectedExerciseId });
    if (queryExerciseId && queryExerciseId !== selectedExerciseId) {
      setSelectedExerciseId(queryExerciseId);
    }
    console.log('[LiveWorkout Diagnostics] Query param sync effect complete');
  }, [queryExerciseId]);

  // Sync movement analyzer mode whenever selectedExerciseId changes
  useEffect(() => {
    console.log('[LiveWorkout Diagnostics] Exercise switch effect start', { selectedExerciseId });
    if (movementAnalyzerRef.current) {
      movementAnalyzerRef.current.setExercise(selectedExerciseId);
      movementAnalyzerRef.current.reset();
      setCurrentReps(0);
      setCurrentAngle(null);
      setFormScore(cameraMode === 'webcam' ? null : 94);
    }
    console.log('[LiveWorkout Diagnostics] Exercise switch effect complete');
  }, [selectedExerciseId]);

  // Timer effect
  useEffect(() => {
    console.log('[LiveWorkout Diagnostics] Timer effect start', { isActive });
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      console.log('[LiveWorkout Diagnostics] Timer effect cleanup');
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Simulated rep & form alternation loop (ONLY ACTIVE in simulation mode)
  useEffect(() => {
    if (!isActive || cameraMode === 'webcam') return;

    const repInterval = setInterval(() => {
      setCurrentReps((prev) => {
        const next = prev + 1;
        if (next > targetReps) {
          return 1;
        }

        // Periodically alternate between good form and a dynamic posture correction cue
        if (next % 3 === 0) {
          setFeedbackStatus('warning');
          setFeedbackMessage('⚠️ Knees caving inwards! Flare knees out over 2nd toe.');
          setHasPostureError(true);
          setFormScore((s) => Math.max(85, s - 3));
          setCurrentAngle(96);
          if (audioEnabled && 'speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance('Check knees, push outward');
            utter.rate = 1.1;
            window.speechSynthesis.speak(utter);
          }
        } else {
          setFeedbackStatus('optimal');
          setFeedbackMessage('🟢 Perfect hip crease depth! Explosive drive up.');
          setHasPostureError(false);
          setFormScore((s) => Math.min(99, s + 1));
          setCurrentAngle(86);
        }

        return next;
      });
    }, 4200);

    return () => clearInterval(repInterval);
  }, [isActive, cameraMode, targetReps, audioEnabled]);

  // Real MediaPipe Pose Detection Loop for live webcam mode
  useEffect(() => {
    console.log('[LiveWorkout Diagnostics] MediaPipe detection loop effect start', {
      cameraMode,
      cameraPermissionGranted,
      isActive
    });
    let isCancelled = false;

    if (cameraMode !== 'webcam' || !cameraPermissionGranted || !isActive) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const initDetector = async () => {
      console.log('[LiveWorkout Diagnostics] MediaPipe Pose Landmarker initialization start');
      setIsModelLoading(true);
      setModelError(null);
      try {
        const landmarker = await getPoseLandmarker();
        if (isCancelled) return;
        landmarkerRef.current = landmarker;
        setIsModelLoading(false);
        console.log('[LiveWorkout Diagnostics] MediaPipe Pose Landmarker initialization success');
        startDetectionLoop();
      } catch (err) {
        console.error('[LiveWorkout Diagnostics] MediaPipe Pose Landmarker initialization failure:', err);
        if (!isCancelled) {
          setModelError('MediaPipe model initialization failed. Please ensure WebGL / WASM is supported.');
          setIsModelLoading(false);
        }
      }
    };

    let lastVideoTime = -1;

    const startDetectionLoop = () => {
      const detectFrame = () => {
        if (isCancelled) return;

        const video = videoRef.current;
        const landmarker = landmarkerRef.current;

        // Auto-resume camera video if browser paused it
        if (video && video.srcObject && video.paused && !video.ended) {
          video.play().catch(() => {});
        }

        if (
          video &&
          landmarker &&
          video.readyState >= 2 &&
          !video.paused &&
          !video.ended
        ) {
          if (video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;
            const timestamp = performance.now();

            try {
              const results = landmarker.detectForVideo(video, timestamp);

              if (results && results.landmarks && results.landmarks.length > 0) {
                const landmarks = results.landmarks[0];
                if (!hasLoggedFirstPoseFrameRef.current) {
                  hasLoggedFirstPoseFrameRef.current = true;
                  console.log('[LiveWorkout Diagnostics] First pose frame detected:', {
                    landmarkCount: landmarks.length
                  });
                }
                setLiveLandmarks(landmarks);

                const analysis = movementAnalyzerRef.current.processFrame(landmarks, timestamp);
                setCurrentReps(analysis.repCount);
                setCurrentAngle(analysis.currentAngle);
                if (analysis.targetAngle) setAnalysisTargetAngle(analysis.targetAngle);
                if (analysis.angleLabel) setAnalysisAngleLabel(analysis.angleLabel);
                if (analysis.targetLabel) setAnalysisTargetLabel(analysis.targetLabel);
                if (analysis.formScore !== null && analysis.formScore !== undefined) {
                  setFormScore(analysis.formScore);
                }
                setFeedbackStatus(analysis.feedback.status);
                setFeedbackMessage(analysis.feedback.message);
                setHasPostureError(
                  analysis.feedback.status === 'warning' || analysis.feedback.status === 'error'
                );

                // Spoken feedback with throttling and cooldown
                if (audioEnabled && analysis.feedback.shouldSpeak && 'speechSynthesis' in window) {
                  const now = performance.now();
                  if (
                    now - lastSpeechTimestampRef.current >= 2800 &&
                    analysis.feedback.message !== lastSpeechTextRef.current
                  ) {
                    lastSpeechTimestampRef.current = now;
                    lastSpeechTextRef.current = analysis.feedback.message;
                    window.speechSynthesis.cancel();
                    let spokenText = analysis.feedback.message;
                    if (spokenText.includes('complete') && analysis.repCount > 0) {
                      spokenText = `Rep ${analysis.repCount}`;
                    } else if (spokenText.includes('Parallel depth') || spokenText.includes('depth reached') || spokenText.includes('Great depth')) {
                      spokenText = 'Good depth, drive up';
                    } else if (spokenText.includes('Torso') || spokenText.includes('chest')) {
                      spokenText = 'Chest up';
                    }
                    const utter = new SpeechSynthesisUtterance(spokenText);
                    utter.rate = 1.15;
                    window.speechSynthesis.speak(utter);
                  }
                }
              } else {
                movementAnalyzerRef.current.processFrame(null, timestamp);
                setLiveLandmarks(null);
                setCurrentAngle(null);
                setFeedbackStatus('info');
                setFeedbackMessage('Searching for athlete: Stand in frame with hips and joints visible.');
              }
            } catch (frameErr) {
              console.warn('Frame detection error:', frameErr);
            }
          }
        }

        animFrameRef.current = requestAnimationFrame(detectFrame);
      };

      animFrameRef.current = requestAnimationFrame(detectFrame);
    };

    initDetector();

    return () => {
      console.log('[LiveWorkout Diagnostics] MediaPipe detection loop effect cleanup');
      isCancelled = true;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [cameraMode, cameraPermissionGranted, isActive, selectedExercise, selectedExerciseId, audioEnabled]);

  // Ensure video element receives the media stream whenever webcam mode is active
  useEffect(() => {
    console.log('[LiveWorkout Diagnostics] Video stream attachment effect start', {
      cameraMode,
      cameraPermissionGranted,
      hasStream: Boolean(mediaStreamRef.current)
    });
    const video = videoRef.current;
    if (!video) return;

    if (cameraMode === 'webcam' && cameraPermissionGranted && mediaStreamRef.current) {
      if (video.srcObject !== mediaStreamRef.current) {
        video.srcObject = mediaStreamRef.current;
        console.log('[LiveWorkout Diagnostics] Video srcObject assigned');
      }
      video.play().catch((err) => {
        console.warn('[LiveWorkout Diagnostics] Video play attempt on stream update:', err);
      });
    } else if (cameraMode === 'simulation') {
      video.srcObject = null;
    }
    console.log('[LiveWorkout Diagnostics] Video stream attachment effect complete');
  }, [cameraMode, cameraPermissionGranted]);

  // Request actual camera stream if user switches to webcam mode
  const startWebcam = async () => {
    console.log('[LiveWorkout Diagnostics] Camera request start (getUserMedia)');
    setCameraError(null);
    setModelError(null);
    setIsCameraStarting(true);
    setFeedbackStatus('info');
    setFeedbackMessage('Connecting camera feed. Please allow camera permissions in browser.');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported on this device/browser.');
      }

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false
        });
      } catch (idealErr) {
        console.warn('High-res camera constraint failed, falling back to basic video:', idealErr);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      console.log('[LiveWorkout Diagnostics] Camera request success, stream tracks:', stream.getTracks().length);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('[LiveWorkout Diagnostics] Video srcObject assigned');
        videoRef.current.onloadedmetadata = () => {
          console.log('[LiveWorkout Diagnostics] Video metadata ready, video size:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          videoRef.current?.play().catch((err) => console.warn('[LiveWorkout Diagnostics] Video play error on metadata:', err));
        };
        videoRef.current.play().then(() => {
          console.log('[LiveWorkout Diagnostics] Video playing successfully');
        }).catch((err) => console.warn('[LiveWorkout Diagnostics] Video play error on start:', err));
      }

      setCameraPermissionGranted(true);
      setCameraMode('webcam');
      movementAnalyzerRef.current.reset();
      setCurrentReps(0);
      setFormScore(null); // Clear fabricated score, await real rep completion
      setCurrentAngle(null); // Clear simulated angle, await live detection
      setFeedbackStatus('info');
      setFeedbackMessage('Searching for athlete: Stand in frame with hips and joints visible.');
    } catch (err) {
      console.warn('[LiveWorkout Diagnostics] Camera request failure:', err);
      let errorMsg = 'Camera permission was denied or no camera device found.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission was denied. Please allow camera access in your browser address bar.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera device found on this system.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Camera is already in use by another application or system process.';
      }
      setCameraError(`${errorMsg} Switched to Vision Simulation Feed.`);
      setCameraMode('simulation');
      setCameraPermissionGranted(false);
      setFeedbackStatus('optimal');
      setFeedbackMessage('Optimal depth reached. Keep chest tall through lockout!');
    } finally {
      setIsCameraStarting(false);
    }
  };

  const stopWebcam = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    movementAnalyzerRef.current.reset();
    setLiveLandmarks(null);
    setCameraPermissionGranted(false);
    setCameraMode('simulation');
    setCurrentReps(0);
    setFormScore(94);
    setCurrentAngle(88); // Reset to simulation default
    setFeedbackStatus('optimal');
    setFeedbackMessage('Optimal depth reached. Keep chest tall through lockout!');
  };

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Trigger workout completion
  const handleFinishWorkout = () => {
    setIsActive(false);
    const totalReps = Math.max(0, currentReps + (currentSet - 1) * targetReps);
    const duration = Math.max(1, sessionSeconds);
    const calories = Math.max(0, Math.round(totalReps * (selectedExercise.caloriesPerRep || 0.8)));
    const finalAccuracy = typeof formScore === 'number' ? formScore : 90;

    const summary = {
      exerciseName: selectedExercise.name,
      reps: totalReps,
      repsCompleted: totalReps,
      sets: currentSet,
      setsCompleted: currentSet,
      totalDurationSeconds: duration,
      accuracy: finalAccuracy,
      avgFormScore: finalAccuracy,
      calories: calories,
      caloriesEstimated: calories
    };
    setSessionSummary(summary);
    setShowCompletionModal(true);

    // Save session to local database
    api.workouts.recordCompletedSession(summary);

    // Blast celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00F59B', '#FF6B00', '#00E5FF', '#FFFFFF']
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Format seconds to string
  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header / Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                cameraMode === 'webcam'
                  ? isModelLoading
                    ? 'bg-amber-400'
                    : 'bg-electric-green'
                  : 'bg-cyan-400'
              } animate-ping`}
            />
            <span className="text-xs font-bold uppercase tracking-widest text-electric-green">
              {cameraMode === 'webcam'
                ? isCameraStarting
                  ? 'Requesting Camera Access...'
                  : isModelLoading
                  ? 'Loading MediaPipe Pose Model...'
                  : 'MediaPipe Vision Active (Wasm / GPU)'
                : 'AI Vision Simulation Active'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Live Biomechanical Posture Correction
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Exercise Selector */}
          <div className="relative">
            <select
              value={selectedExerciseId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedExerciseId(newId);
                setCurrentReps(0);
                movementAnalyzerRef.current.setExercise(newId);
                movementAnalyzerRef.current.reset();
                setFormScore(cameraMode === 'webcam' ? null : 94);
              }}
              className="bg-dark-900 border border-slate-700 text-slate-100 text-xs font-semibold rounded-xl pl-3.5 pr-8 py-2.5 appearance-none focus:outline-none focus:border-electric-green"
            >
              {MOCK_EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.category})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Webcam vs Simulation Mode Toggle */}
          {cameraMode === 'simulation' ? (
            <Button
              variant="outline"
              size="sm"
              icon={Camera}
              onClick={startWebcam}
              disabled={isCameraStarting}
            >
              {isCameraStarting ? 'Connecting Camera...' : 'Enable Live Webcam'}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              icon={CameraOff}
              onClick={stopWebcam}
            >
              Use Simulation Feed
            </Button>
          )}

          {/* Audio voice cues toggle with dancing equalizer bars */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-dark-900 border border-slate-700/80">
            <button
              type="button"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-1 rounded-lg transition-colors ${
                audioEnabled
                  ? 'text-volt hover:bg-volt/10'
                  : 'text-slate-500 hover:bg-slate-800'
              }`}
              title={audioEnabled ? 'Audio cues active' : 'Audio cues muted'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {audioEnabled && (
              <div className="flex items-end gap-0.5 h-4 pr-1">
                <span className="w-1 bg-volt rounded-full sound-bar-1" />
                <span className="w-1 bg-volt-400 rounded-full sound-bar-2" />
                <span className="w-1 bg-neon-cyan rounded-full sound-bar-3" />
                <span className="w-1 bg-volt rounded-full sound-bar-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {cameraError && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-wrap items-center justify-between gap-2">
          <span>{cameraError}</span>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={startWebcam}
              className="text-amber-300 hover:text-white font-bold underline cursor-pointer"
            >
              Retry Camera
            </button>
            <button
              type="button"
              onClick={() => setCameraError(null)}
              className="text-amber-400 hover:text-white font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {modelError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex flex-wrap items-center justify-between gap-2">
          <span>{modelError}</span>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={() => {
                setModelError(null);
                setCameraMode('webcam');
                setIsModelLoading(true);
                getPoseLandmarker()
                  .then((lm) => {
                    landmarkerRef.current = lm;
                    setIsModelLoading(false);
                    console.log('[LiveWorkout Diagnostics] MediaPipe Pose Landmarker re-initialized successfully');
                  })
                  .catch((err) => {
                    console.error('[LiveWorkout Diagnostics] MediaPipe Pose Landmarker retry failed:', err);
                    setModelError('MediaPipe model initialization failed. Please ensure WebGL / WASM is supported.');
                    setIsModelLoading(false);
                  });
              }}
              className="text-rose-300 hover:text-white font-bold underline cursor-pointer"
            >
              Retry Model
            </button>
            <button
              type="button"
              onClick={() => setModelError(null)}
              className="text-rose-400 hover:text-white font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Centerpiece Viewport Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Video Feed HUD Centerpiece */}
        <div className="lg:col-span-3">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-dark-950 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl shadow-black/80 hud-corner group">
            {/* Background Stream: Either Real Webcam OR Simulated Athlete Video Backdrop */}
            {/* The video element remains ALWAYS mounted in the DOM so videoRef is non-null when startWebcam binds stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                cameraMode === 'webcam' && cameraPermissionGranted ? 'block' : 'hidden'
              }`}
            />

            {!(cameraMode === 'webcam' && cameraPermissionGranted) && (
              /* Simulated Athlete Workout Canvas Backdrop */
              <div className="relative w-full h-full bg-gradient-to-b from-dark-900 via-dark-950 to-[#04060A] flex items-center justify-center overflow-hidden">
                {/* Tech Grid Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />

                {/* Subdued ambient glow */}
                <div className="absolute w-96 h-96 rounded-full bg-electric-green/5 blur-3xl" />

                {/* Simulation indicator badge */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-dark-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 z-10">
                  <Video className="w-3 h-3 text-cyan-400" />
                  <span>SIMULATED BIOMECHANICS FEED (Webcam optional)</span>
                </div>
              </div>
            )}

            {/* MediaPipe Real Landmark & Skeletal Overlay Canvas */}
            <PoseCanvas
              isTracking={isActive}
              exerciseType={
                selectedExercise.category.toLowerCase().includes('chest')
                  ? 'pushups'
                  : selectedExercise.category.toLowerCase().includes('arm')
                  ? 'curls'
                  : 'squats'
              }
              landmarks={liveLandmarks}
              videoRef={videoRef}
              isLiveMode={cameraMode === 'webcam' && cameraPermissionGranted}
              isModelLoading={isModelLoading}
              currentAngle={currentAngle}
              targetAngle={analysisTargetAngle || 100}
              hasError={hasPostureError}
              errorMessage={feedbackMessage}
            />

            {/* High-Tech HUD Layer with Reps, Timers, Angle metrics */}
            <FormFeedbackHUD
              currentReps={currentReps}
              targetReps={targetReps}
              currentSet={currentSet}
              totalSets={totalSets}
              sessionSeconds={sessionSeconds}
              formScore={formScore}
              feedbackStatus={feedbackStatus}
              feedbackMessage={feedbackMessage}
              currentAngle={currentAngle}
              targetAngle={analysisTargetAngle || 100}
              angleLabel={analysisAngleLabel || 'Knee Flexion'}
              targetLabel={analysisTargetLabel || 'Parallel Target'}
            />
          </div>

          {/* Centerpiece Control Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-dark-900/90 border border-slate-800">
            <div className="flex items-center gap-2">
              <Button
                variant={isActive ? 'secondary' : 'primary'}
                size="sm"
                icon={isActive ? Pause : Play}
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? 'Pause Session' : 'Resume Tracking'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={RotateCcw}
                onClick={() => {
                  setCurrentReps(0);
                  setSessionSeconds(0);
                  movementAnalyzerRef.current?.reset();
                  setFormScore(cameraMode === 'webcam' ? null : 95);
                }}
              >
                Reset Reps
              </Button>
            </div>

            {/* In simulation mode: demo testing helpers. In live webcam mode: MediaPipe Rep Engine status */}
            {cameraMode === 'simulation' ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 hidden sm:inline">Simulate Cue:</span>
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackStatus('warning');
                    setFeedbackMessage('⚠️ Lower your hips 2 inches to reach parallel!');
                    setHasPostureError(true);
                    setCurrentAngle(98);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/20"
                >
                  Trigger Warning
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackStatus('optimal');
                    setFeedbackMessage('🟢 Good form: Chest up, full depth locked.');
                    setHasPostureError(false);
                    setCurrentAngle(85);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/20"
                >
                  Trigger Optimal
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentReps((r) => r + 1)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold hover:bg-cyan-500/20"
                >
                  +1 Rep
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-dark-950/90 border border-slate-700/80 text-[11px] font-mono text-slate-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-volt animate-pulse" />
                <span className="font-semibold text-slate-200">Vision Rep Engine:</span>
                <span className="text-volt font-bold">
                  {selectedExercise.name?.toLowerCase().includes('squat') ? 'SQUAT TRACKING ACTIVE' : 'TELEMETRY ACTIVE'}
                </span>
              </div>
            )}

            <Button
              variant="energy"
              size="sm"
              icon={CheckCircle}
              onClick={handleFinishWorkout}
            >
              Finish Workout
            </Button>
          </div>
        </div>

        {/* Right 1 col: Exercise Blueprint & Real-Time Cues */}
        <div className="space-y-4">
          {/* Active Exercise Profile Card */}
          <Card variant="glass" className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="success" size="sm">
                  {selectedExercise.difficulty}
                </Badge>
                <h3 className="text-base font-bold text-white font-display mt-2">
                  {selectedExercise.name}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-electric-green/10 border border-electric-green/30 flex items-center justify-center text-electric-green">
                <Dumbbell className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
              <div className="p-2.5 rounded-xl bg-dark-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Equipment</span>
                <span className="font-semibold text-slate-200 truncate block">
                  {selectedExercise.equipment}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Rest Period</span>
                <span className="font-semibold text-slate-200">
                  {selectedExercise.restSeconds}s
                </span>
              </div>
            </div>

            {/* Target Muscles */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Target Muscles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedExercise.targetMuscles.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-2 py-0.5 rounded-md bg-dark-800 text-slate-300 text-[11px] border border-slate-700/60"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Form Cues Checklist */}
          <Card variant="glass" className="p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 font-display">
              <Sparkles className="w-4 h-4 text-electric-green" />
              <span>Biomechanical Checklist</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedExercise.formCues.map((cue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-electric-green flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{cue}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Common Mistakes Warning Card */}
          <Card variant="glass" className="p-5 space-y-3 border-amber-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Critical Faults to Avoid</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {selectedExercise.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 text-xs font-bold mt-0.5">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Workout Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Workout Session Complete!"
        subtitle="Outstanding effort! Your biomechanical data has been compiled."
      >
        {sessionSummary && (
          <div className="space-y-6">
            <div className="text-center py-4 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20">
              <div className="w-14 h-14 rounded-2xl bg-electric-green/20 text-electric-green flex items-center justify-center mx-auto mb-3 shadow-lg shadow-electric-green/20">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-white font-display">
                {sessionSummary.exerciseName}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Completed with {sessionSummary.avgFormScore}% Form Accuracy
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Reps</span>
                <span className="font-mono text-xl font-black text-white">
                  {sessionSummary.repsCompleted}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sets Finished</span>
                <span className="font-mono text-xl font-black text-white">
                  {sessionSummary.setsCompleted}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                <span className="font-mono text-xl font-black text-electric-green">
                  {formatDuration(sessionSummary.totalDurationSeconds)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Burn</span>
                <span className="font-mono text-xl font-black text-electric-orange">
                  {sessionSummary.caloriesEstimated} kcal
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Session Telemetry Saved
              </span>
              <p className="text-slate-400 leading-relaxed">
                Your reps, form accuracy, and active duration have been logged to your dashboard. Your performance analytics and streak have updated.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowCompletionModal(false);
                  navigate('/workout-plan');
                }}
              >
                View Weekly Plan
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setShowCompletionModal(false);
                  navigate('/dashboard');
                }}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
