import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Heart, Sparkles, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-dark-950/90 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-electric-green flex items-center justify-center text-dark-950 shadow-md shadow-electric-green/20">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black tracking-tight font-display text-white">
                PULSE<span className="text-electric-green">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time biomechanical posture correction powered by computer vision. Elevate your lifts, eliminate injury risks, and achieve your peak physique.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Vision Engine v2.4 Active</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-display">
              Core Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/workout/live" className="hover:text-electric-green transition-colors">
                  Webcam Pose Correction
                </Link>
              </li>
              <li>
                <Link to="/workout-plan" className="hover:text-electric-green transition-colors">
                  Adaptive Weekly Plan
                </Link>
              </li>
              <li>
                <Link to="/nutrition" className="hover:text-electric-green transition-colors">
                  Target Macro & Meal Hub
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-electric-green transition-colors">
                  Biometrics & Progress
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-electric-green transition-colors">
                  24/7 AI Coach Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic / Tech Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-display">
              Engineering Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                React 18 + Vite 6 Modern SPA
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-green" />
                Tailwind CSS v3 Design System
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Webcam MediaStream API
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Chart.js Visual Analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Protected Role Guard Routing
              </li>
            </ul>
          </div>

          {/* Col 4: Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-display">
              Portals & Administration
            </h4>
            <div className="space-y-3">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono hover:bg-cyan-500/10 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Control Dashboard</span>
              </Link>
              <p className="text-[11px] text-slate-500 leading-normal">
                College Software Engineering Capstone Project. Designed for elite athletic tracking and injury prevention.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PulseAI Biomechanics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Software Engineering
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
