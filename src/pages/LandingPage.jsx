import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import {
  Camera,
  Activity,
  Dumbbell,
  Utensils,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  Play,
  ArrowRight,
  Target,
  Shield,
  Eye,
  Sliders,
  Lock,
  Cpu,
  Flame
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const workflowSteps = [
    {
      step: '01',
      title: 'Position Your Camera',
      desc: 'Set your webcam or phone 6–8 feet away at waist height with your full body clearly visible in the frame.',
      icon: Camera,
      accent: 'border-volt/40 text-volt bg-volt/10'
    },
    {
      step: '02',
      title: 'Real-Time Joint Tracking',
      desc: 'Our in-browser engine tracks 17 skeletal landmarks at 60 FPS without sending any video data to external servers.',
      icon: Eye,
      accent: 'border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10'
    },
    {
      step: '03',
      title: 'Biomechanical Angle Cues',
      desc: 'Receive immediate visual indicators and audio prompts when knee valgus or spinal curvature is detected.',
      icon: Activity,
      accent: 'border-flame/40 text-flame bg-flame/10'
    },
    {
      step: '04',
      title: 'Log Genuine Session Data',
      desc: 'Completed reps, session duration, and form accuracy scores automatically sync to your personal dashboard and history.',
      icon: CheckCircle2,
      accent: 'border-neon-purple/40 text-neon-purple bg-neon-purple/10'
    }
  ];

  const features = [
    {
      icon: Camera,
      title: 'Webcam Form Correction',
      desc: 'Monitors knee flexion, hip hinge depth, and spine alignment in real time with high-contrast glowing skeleton overlays.',
      badge: 'Vision AI',
      badgeVariant: 'volt',
      glow: 'hover:border-volt/60 hover:shadow-glow-volt'
    },
    {
      icon: Dumbbell,
      title: 'Structured Workout Splits',
      desc: 'Follow a clean 7-day training schedule with configurable exercise slots, set/rep targets, and rest timers.',
      badge: 'Periodization',
      badgeVariant: 'flame',
      glow: 'hover:border-flame/60 hover:shadow-glow-flame'
    },
    {
      icon: Utensils,
      title: 'Nutrition & Macro Hub',
      desc: 'Track daily protein, carbs, fats, and water intake with clean unlogged meal slots ready to be filled.',
      badge: 'Fuel Engine',
      badgeVariant: 'cyan',
      glow: 'hover:border-neon-cyan/60 hover:shadow-glow-cyan'
    },
    {
      icon: Sparkles,
      title: 'Sports Science AI Coach',
      desc: 'Ask questions regarding movement cues, progressive overload, recovery protocols, and post-workout nutrition.',
      badge: '24/7 AI Coach',
      badgeVariant: 'purple',
      glow: 'hover:border-neon-purple/60 hover:shadow-glow-purple'
    }
  ];

  return (
    <div className="space-y-28 py-10 overflow-hidden relative">
      {/* Dynamic Ambient Background Glow Orbs */}
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-volt/10 rounded-full blur-[140px] pointer-events-none animate-float-slow -z-10" />
      <div className="absolute top-48 right-10 w-[450px] h-[450px] bg-flame/10 rounded-full blur-[140px] pointer-events-none animate-float-reverse -z-10" />
      <div className="absolute top-[800px] left-10 w-[550px] h-[550px] bg-neon-cyan/8 rounded-full blur-[160px] pointer-events-none animate-float-slow -z-10" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 text-center">
        {/* Floating live status pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-dark-900/90 border border-volt/40 shadow-lg shadow-volt/15 text-xs font-bold text-slate-200 mb-8 animate-bounce-subtle">
          <span className="w-2.5 h-2.5 rounded-full bg-volt shadow-[0_0_10px_#00F59B] animate-ping" />
          <span className="text-volt font-black tracking-wider uppercase">IN-BROWSER VISION AI</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">100% Private Client-Side Telemetry</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Train Harder. Perfect Your Form.{' '}
          <span className="text-gradient-volt block mt-3">
            Real-Time Webcam Vision Coach.
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Transform your webcam into an intelligent biomechanics coach. Detect joint angles, count reps automatically, and receive instant cues to lift with championship technique.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            icon={Play}
            onClick={() => navigate('/workout/live')}
            className="shadow-xl shadow-volt/25 text-dark-950 font-black"
          >
            Launch Live Workout
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/signup')}
          >
            Get Started Free
          </Button>
          <Button
            variant="ghost"
            size="lg"
            icon={Shield}
            onClick={() => navigate('/admin/login')}
            className="text-slate-400 hover:text-white"
          >
            Staff & Trainer Portal
          </Button>
        </div>

        {/* Interactive Biomechanical Pose Teaser Card */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl bg-dark-900/90 border border-slate-700/80 p-4 sm:p-7 shadow-2xl shadow-black/80 relative backdrop-blur-2xl">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-volt shadow-[0_0_10px_#00F59B] animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider">Live Pose Telemetry Preview</span>
              <Badge variant="volt" size="sm">
                60 FPS
              </Badge>
            </div>
            <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span className="text-volt">Joints: 17/17</span>
              <span>•</span>
              <span className="text-neon-cyan">Inference: &lt;16ms</span>
            </div>
          </div>

          {/* Canvas Viewport Simulation */}
          <div className="relative aspect-video rounded-2xl bg-dark-950 overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Mesh grid backdrop */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Glowing Skeletal Overlay */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 360">
              {/* Laser skeleton bones */}
              <line x1="300" y1="75" x2="300" y2="165" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="300" y1="95" x2="245" y2="135" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="245" y1="135" x2="225" y2="175" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="300" y1="95" x2="355" y2="135" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="355" y1="135" x2="375" y2="175" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="300" y1="165" x2="255" y2="235" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="255" y1="235" x2="250" y2="305" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="300" y1="165" x2="345" y2="235" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="345" y1="235" x2="350" y2="305" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />

              {/* Parallel Depth Target Line */}
              <line x1="180" y1="235" x2="420" y2="235" stroke="#FF5E00" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />

              {/* Glowing Joint Nodes */}
              {[
                [300, 65], [300, 95], [245, 135], [225, 175], [355, 135], [375, 175],
                [300, 165], [255, 235], [250, 305], [345, 235], [350, 305]
              ].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="6" fill="#00F59B" stroke="#050811" strokeWidth="2" />
                  <circle cx={cx} cy={cy} r="10" fill="none" stroke="#00F59B" strokeWidth="1" opacity="0.5" className="animate-pulse" />
                </g>
              ))}
            </svg>

            {/* Top Left Angle Readout Pill */}
            <div className="absolute top-4 left-4 bg-dark-900/90 border border-volt/50 rounded-xl p-3 text-left space-y-1 backdrop-blur-xl shadow-lg shadow-volt/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Knee Flexion Angle</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-black text-volt">86°</span>
                <span className="text-[10px] font-bold text-emerald-400">✓ OPTIMAL</span>
              </div>
              <span className="text-[10px] text-slate-300 block">Below 90° parallel depth achieved</span>
            </div>

            {/* Bottom Right Feedback Pill */}
            <div className="absolute bottom-4 right-4 bg-dark-900/90 border border-slate-700/80 rounded-xl p-3 text-right space-y-1 backdrop-blur-xl shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Real-Time Correction</span>
              <span className="text-xs font-bold text-white block">Keep chest upright • Flare knees outward</span>
              <span className="text-[10px] text-volt font-semibold block">Form Accuracy: 96%</span>
            </div>

            {/* Interactive Center Button */}
            <div className="relative z-10 text-center">
              <Button
                variant="primary"
                size="md"
                icon={Play}
                onClick={() => navigate('/workout/live')}
                className="shadow-2xl shadow-volt/40"
              >
                Launch Live Camera Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Interactive Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="volt" size="sm">
            WORKFLOW
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            How Vision Pose Tracking Works
          </h2>
          <p className="text-sm text-slate-400">
            No expensive smart watches or motion capture suits. Everything runs directly through standard HTML5 web APIs in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((stepItem, idx) => {
            const StepIcon = stepItem.icon;
            return (
              <Card
                key={idx}
                variant="glass"
                interactive
                className="p-6 relative space-y-4 hover:border-volt/50 hover:shadow-glow-volt transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${stepItem.accent} shadow-md`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-sm font-black text-slate-500">
                    {stepItem.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-display">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {stepItem.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Core Capabilities Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="flame" size="sm">
            PLATFORM MODULES
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            Engineered for Strength & Longevity
          </h2>
          <p className="text-sm text-slate-400">
            A comprehensive training suite designed to eliminate guesswork, prevent injuries, and accelerate muscle growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                variant="glass"
                interactive
                className={`p-6 flex flex-col justify-between border border-slate-800 ${feat.glow} transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-dark-850 border border-slate-700 flex items-center justify-center text-white shadow-md">
                      <Icon className="w-5 h-5 text-volt" />
                    </div>
                    <Badge variant={feat.badgeVariant} size="sm">
                      {feat.badge}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-white font-display mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs font-bold text-volt">
                  <span>Explore module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-b from-dark-900 via-dark-850 to-dark-950 border border-volt/40 p-10 sm:p-14 relative overflow-hidden shadow-2xl shadow-volt/10">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-volt/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-flame/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <Badge variant="volt" size="sm">
              START YOUR FIRST SESSION
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white max-w-xl mx-auto leading-tight">
              Ready to Perfect Your Technique?
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Open your camera, track your joint angles in real time, and start recording your genuine consistency streak.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                onClick={() => navigate('/workout/live')}
              >
                Start Live Workout
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/onboarding')}
              >
                Set Up Fitness Profile
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
