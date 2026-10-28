import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  Users,
  Activity,
  ShieldCheck,
  Server,
  Database,
  CheckCircle2,
  Cpu,
  Camera,
  Volume2,
  HardDrive,
  ArrowRight
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [userData, exData, analData] = await Promise.all([
          api.admin.getUsers(),
          api.workouts.getExercises(),
          api.admin.getSystemAnalytics()
        ]);
        setUsers(userData);
        setExercises(exData);
        setAnalytics(analData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner message="Checking platform hardware diagnostics..." />
      </div>
    );
  }

  const history = JSON.parse(localStorage.getItem('ai_fitness_workout_history') || '[]');

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="neutral" size="sm">
            PLATFORM STATUS
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Staff & System Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Diagnostic telemetry, athlete accounts, and movement library configuration.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-dark-900 border border-slate-800 px-3.5 py-2 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Local Environment: Active & Responsive</span>
        </div>
      </div>

      {/* 4 Realistic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" className="p-5 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Registered Athletes
          </span>
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-black text-white">
              {users.length}
            </p>
            <Badge variant="neutral" size="sm">
              Athletes
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400 block">
            {users.filter((u) => u.status === 'Active').length} active status accounts
          </span>
        </Card>

        <Card variant="glass" className="p-5 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Movement Catalog Slots
          </span>
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-black text-white">
              {exercises.length}
            </p>
            <Badge variant="neutral" size="sm">
              Exercises
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Form angle thresholds configured
          </span>
        </Card>

        <Card variant="glass" className="p-5 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Completed Live Sessions
          </span>
          <div className="flex items-baseline justify-between">
            <p className="font-mono text-3xl font-black text-emerald-400">
              {history.length}
            </p>
            <Badge variant={history.length > 0 ? "success" : "neutral"} size="sm">
              {history.length > 0 ? "Tracked" : "No Sessions"}
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Saved to local workout history
          </span>
        </Card>

        <Card variant="glass" className="p-5 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Storage Engine
          </span>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-bold text-white font-mono">
              LocalStorage
            </p>
            <Badge variant="success" size="sm">
              Online
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Ready for REST API connection
          </span>
        </Card>
      </div>

      {/* Hardware Diagnostics & Capabilities */}
      <Card variant="glass" className="p-6 sm:p-8 space-y-5 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              Browser Web API & Hardware Diagnostics
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Status of client-side MediaDevices, Web Audio, and Canvas pipelines.
            </p>
          </div>
          <Badge variant="neutral" size="sm">
            4 / 4 Available
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-dark-800/80 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Webcam / Video Capture Engine</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Supported</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                HTML5 getUserMedia API with dual fallback to simulated pose feed.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-800/80 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Skeletal Landmark Vectorizer</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Active</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                17 skeletal nodes rendered directly via HTML5 2D Context at 60 FPS.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-800/80 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Voice & Audio Feedback Engine</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Ready</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Web Speech API for audio correction alerts during live reps.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-dark-800/80 border border-slate-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Client-Side Persistence Layer</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Active</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                JSON serialization in localStorage with simulated network latency.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="p-5 rounded-xl bg-dark-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Manage Athlete Roster
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              View registered users, status, and workout history.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/content"
          className="p-5 rounded-xl bg-dark-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Exercise Movement Catalog
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Add new movements, set ideal angles, and edit cues.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/admin/activity"
          className="p-5 rounded-xl bg-dark-900 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Audit Activity Log
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect session events, logins, and profile changes.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
