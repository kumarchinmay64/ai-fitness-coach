import React from 'react';
import Badge from '../ui/Badge';
import { Activity, AlertTriangle, CheckCircle2, Flame, Timer, Zap } from 'lucide-react';

export default function FormFeedbackHUD({
  currentReps = 0,
  targetReps = 10,
  currentSet = 1,
  totalSets = 4,
  sessionSeconds = 0,
  formScore = 95,
  feedbackStatus = 'optimal', // 'optimal', 'warning', 'error'
  feedbackMessage = 'Optimal depth achieved! Drive upwards through heels.',
  currentAngle = 88,
  targetAngle = 90,
  angleLabel = 'Knee Flexion',
  targetLabel = 'Parallel Target',
}) {
  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Circular rep counter progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.min(100, (currentReps / targetReps) * 100);
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between z-30 font-sans">
      {/* Top HUD Row */}
      <div className="flex items-start justify-between gap-4 pointer-events-auto">
        {/* Left: Set & Timer */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-dark-950/90 backdrop-blur-xl border border-slate-700/80 shadow-lg flex items-center gap-2">
            <Timer className="w-4 h-4 text-volt animate-pulse" />
            <span className="font-mono text-sm font-bold text-slate-100">
              {formatTime(sessionSeconds)}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-dark-950/90 backdrop-blur-xl border border-slate-700/80 shadow-lg flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-slate-400">Set</span>
            <span className="font-mono text-sm font-black text-volt">
              {currentSet} <span className="text-slate-500 font-normal">/ {totalSets}</span>
            </span>
          </div>
        </div>

        {/* Right: Real-time Form Accuracy Gauge */}
        <div className="px-4 py-2 rounded-xl bg-dark-950/90 backdrop-blur-xl border border-slate-700/80 shadow-lg flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Form Accuracy
            </span>
            <span className="font-mono text-base font-black text-volt">
              {typeof formScore === 'number' ? `${formScore}%` : '--'}
            </span>
          </div>
          <div className="w-2.5 h-7 rounded-full bg-dark-850 overflow-hidden flex flex-col justify-end p-0.5 border border-slate-700">
            <div
              className="w-full bg-gradient-to-t from-emerald-500 via-volt to-volt-300 rounded-full transition-all duration-300 shadow-[0_0_8px_#00F59B]"
              style={{ height: `${typeof formScore === 'number' ? formScore : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center Feedback Banner */}
      <div className="flex justify-center pointer-events-auto my-auto">
        <div
          className={`max-w-md w-full px-5 py-3 rounded-2xl backdrop-blur-2xl border shadow-2xl transition-all duration-300 transform animate-scaleUp flex items-center gap-3.5 ${
            feedbackStatus === 'optimal'
              ? 'bg-dark-950/90 border-volt/60 shadow-volt/20 text-slate-100'
              : feedbackStatus === 'warning'
              ? 'bg-dark-950/90 border-flame/60 shadow-flame/20 text-amber-100'
              : feedbackStatus === 'info'
              ? 'bg-dark-950/90 border-neon-cyan/50 shadow-neon-cyan/20 text-slate-100'
              : 'bg-dark-950/90 border-rose-500/60 shadow-rose-500/20 text-rose-200'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
              feedbackStatus === 'optimal'
                ? 'bg-volt/20 text-volt border border-volt/40'
                : feedbackStatus === 'warning'
                ? 'bg-flame/20 text-flame border border-flame/40'
                : feedbackStatus === 'info'
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            {feedbackStatus === 'optimal' ? (
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            ) : feedbackStatus === 'info' ? (
              <Activity className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                AI Vision Coach
              </span>
              <Badge
                variant={
                  feedbackStatus === 'optimal'
                    ? 'volt'
                    : feedbackStatus === 'warning'
                    ? 'flame'
                    : feedbackStatus === 'info'
                    ? 'info'
                    : 'danger'
                }
                size="sm"
                dot
              >
                {feedbackStatus === 'optimal'
                  ? 'Optimal Form'
                  : feedbackStatus === 'info'
                  ? 'Vision Active'
                  : 'Correction Needed'}
              </Badge>
            </div>
            <p className="text-xs font-semibold mt-0.5 leading-snug">
              {feedbackMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom HUD Row */}
      <div className="flex items-end justify-between gap-4 pointer-events-auto">
        {/* Left: Joint Angle Readout */}
        <div className="px-4 py-3 rounded-2xl bg-dark-950/90 backdrop-blur-xl border border-slate-700/80 shadow-lg space-y-1">
          <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400">
            <span>{angleLabel}:</span>
            <span className={`font-mono font-bold ${currentAngle !== null && currentAngle !== undefined ? (currentAngle <= targetAngle ? 'text-volt font-black' : 'text-flame') : 'text-slate-500'}`}>
              {currentAngle !== null && currentAngle !== undefined ? `${currentAngle}°` : '--°'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400">
            <span>{targetLabel}:</span>
            <span className="font-mono font-bold text-volt">&le; {targetAngle}°</span>
          </div>
        </div>

        {/* Right: Circular Rep Counter Centerpiece */}
        <div className="relative flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(0,245,155,0.3)]">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="rgba(30, 41, 59, 0.8)"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="url(#electricGreenGradient)"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="electricGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CCFF00" />
                <stop offset="50%" stopColor="#00F59B" />
                <stop offset="100%" stopColor="#00F0FF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Rep Count Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Reps
            </span>
            <span className="font-mono text-2xl font-black text-white leading-none">
              {currentReps}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              / {targetReps}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
