import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  TrendingUp,
  Award,
  Calendar,
  Activity,
  CheckCircle2,
  Flame,
  Dumbbell,
  Clock,
  ArrowUpRight,
  Plus,
  Play,
  Sliders,
  AlertCircle
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [benchmarks, setBenchmarks] = useState([]);
  const [activeBenchmarkModal, setActiveBenchmarkModal] = useState(null);
  const [benchmarkValue, setBenchmarkValue] = useState('');
  const [savingBenchmark, setSavingBenchmark] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [analData, benchData] = await Promise.all([
          api.analytics.getUserAnalytics(),
          api.analytics.getBenchmarks()
        ]);
        setAnalytics(analData);
        setBenchmarks(benchData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenBenchmarkModal = (bm) => {
    setActiveBenchmarkModal(bm);
    setBenchmarkValue(bm.value || '');
  };

  const handleSaveBenchmark = async (e) => {
    e.preventDefault();
    if (!benchmarkValue.trim() || !activeBenchmarkModal) return;

    try {
      setSavingBenchmark(true);
      const updated = await api.analytics.updateBenchmark(activeBenchmarkModal.id, benchmarkValue.trim());
      setBenchmarks(updated);
      setActiveBenchmarkModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingBenchmark(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Retrieving workout logs and biometric telemetry..." />
      </div>
    );
  }

  const hasData = analytics && analytics.hasData;

  // Chart 1: Form Accuracy Trend (only if sessions exist)
  const accuracyChartData = hasData
    ? {
        labels: analytics.formAccuracyTrend.map((d) => d.day),
        datasets: [
          {
            label: 'Form Accuracy (%)',
            data: analytics.formAccuracyTrend.map((d) => d.score),
            borderColor: '#00F59B',
            backgroundColor: 'rgba(0, 245, 155, 0.12)',
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#00F0FF',
            pointBorderColor: '#090D14',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }
        ]
      }
    : null;

  const accuracyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F1622',
        borderColor: 'rgba(0, 245, 155, 0.3)',
        borderWidth: 1,
        titleColor: '#F8FAFC',
        bodyColor: '#00F59B',
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { family: 'inherit', size: 11 } }
      },
      y: {
        min: 60,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8', font: { family: 'inherit', size: 11 }, stepSize: 10 }
      }
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn overflow-hidden">
      {/* Dynamic Ambient Background Glow Orbs */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-volt-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse" />
      <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-flame-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt-500/10 border border-volt-500/20 text-volt-400 text-xs font-black tracking-widest uppercase mb-1">
            <Activity className="w-3.5 h-3.5 text-volt-400 animate-pulse" />
            Biometrics & Telemetry
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-white tracking-tight">
            Performance <span className="text-gradient-volt">Analytics</span> & Benchmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real data generated from completed webcam workout sessions and verified benchmark logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={Play}
            onClick={() => navigate('/workout/live')}
          >
            Start Live Session
          </Button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card variant="glass" className="p-5 space-y-2 border border-slate-800/80 hover:border-volt-500/40 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-volt-400 transition-colors">
              Sessions Completed
            </span>
            <Calendar className="w-4 h-4 text-slate-500 group-hover:text-volt-400 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-black text-white group-hover:text-volt-300 transition-colors">
              {analytics?.totalWorkouts || 0}
            </span>
            <span className="text-xs text-slate-500 font-semibold">Total</span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            {hasData ? "Synced from local history" : "[Slot] Awaiting first session"}
          </span>
        </Card>

        <Card variant="glassVolt" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-volt-400">
              Average Form Score
            </span>
            <Activity className="w-4 h-4 text-volt-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-black text-volt-300">
              {analytics?.averageAccuracy ? `${analytics.averageAccuracy}%` : '-- %'}
            </span>
            <span className="text-xs text-volt-400/80 font-semibold">Accuracy</span>
          </div>
          <span className="text-[11px] text-slate-300 block">
            {hasData ? "Average across all live sets" : "[Slot] Live camera calculation"}
          </span>
        </Card>

        <Card variant="glassCyan" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Reps Counted
            </span>
            <Dumbbell className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-black text-cyan-200">
              {analytics?.totalRepsLogged || 0}
            </span>
            <span className="text-xs text-cyan-400/80 font-semibold">Reps</span>
          </div>
          <span className="text-[11px] text-slate-300 block">
            {hasData ? "Accumulated rep volume" : "[Slot] Tracks reps in live mode"}
          </span>
        </Card>

        <Card variant="glassFlame" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-flame-400">
              Estimated Calories
            </span>
            <Flame className="w-4 h-4 text-flame-400 animate-flame-flicker" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-black text-flame-300">
              {analytics?.caloriesBurnedWeek || 0}
            </span>
            <span className="text-xs text-flame-400/80 font-semibold">kcal</span>
          </div>
          <span className="text-[11px] text-slate-300 block">
            {hasData ? "Calculated from session intensity" : "[Slot] Calculated post-session"}
          </span>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Accuracy Progression */}
        <div className="lg:col-span-2">
          <Card variant="glass" className="p-6 sm:p-8 space-y-4 border border-slate-800/80 hover:border-slate-700/80 transition-all h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-volt-500/10 border border-volt-500/20 flex items-center justify-center text-volt-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-white font-display">
                    Form Accuracy Progression
                  </h3>
                </div>
                {hasData ? (
                  <Badge variant="success" size="sm">
                    {analytics.formAccuracyTrend.length} Recorded Sessions
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm">
                    Slot Ready
                  </Badge>
                )}
              </div>

              {hasData && accuracyChartData ? (
                <div className="h-64 sm:h-72 w-full pt-2">
                  <Line data={accuracyChartData} options={accuracyChartOptions} />
                </div>
              ) : (
                <div className="h-64 sm:h-72 w-full rounded-2xl bg-dark-900 border border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-dark-800 border border-slate-700 flex items-center justify-center text-slate-400">
                    <Activity className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h4 className="text-base font-bold text-white font-display">
                    No Session Data Recorded Yet
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Complete your first workout in Live Workout mode with your webcam. Your joint angles and accuracy scores will plot automatically here.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Play}
                    onClick={() => navigate('/workout/live')}
                  >
                    Start First Live Session
                  </Button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 pt-3 border-t border-slate-800">
              Accuracy is calculated from knee flexion, hip parallel depth, and lumbar spinal curvature during each repetition.
            </p>
          </Card>
        </div>

        {/* Right Col: Rep Distribution */}
        <div>
          <Card variant="glass" className="p-6 sm:p-8 space-y-4 border border-slate-800/80 hover:border-slate-700/80 transition-all h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-white font-display">
                    Rep Volume by Movement
                  </h3>
                </div>
              </div>

              {hasData && analytics.repDistribution.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {analytics.repDistribution.map((r, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-800 hover:border-cyan-500/30 flex items-center justify-between transition-all">
                      <span className="text-xs font-bold text-slate-200">{r.exercise}</span>
                      <span className="font-mono text-xs font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">{r.reps} reps</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 w-full rounded-2xl bg-dark-900/60 border border-dashed border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-dark-800 border border-slate-700/80 flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-cyan-400/60" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">
                    Volume Slot Open
                  </span>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Reps counted during live webcam workouts will appear here broken down by biomechanical pattern.
                  </p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 pt-3 border-t border-slate-800/80">
              Volume helps ensure balanced mechanical loading between push, pull, and squat patterns.
            </p>
          </Card>
        </div>
      </div>

      {/* Personal Records (PRs) / Benchmark Shelf */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-flame-500/10 border border-flame-500/20 flex items-center justify-center text-flame-400">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-white font-display">
              Personal Benchmark Shelf (PRs)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Log verified personal records or calibrate them during live workouts
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benchmarks.map((bm) => (
            <Card
              key={bm.id}
              variant={bm.value ? "glassVolt" : "glass"}
              className="p-5 space-y-3 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
                    {bm.metric}
                  </span>
                  <Badge variant={bm.value ? "success" : "neutral"} size="sm">
                    {bm.value ? "Verified PR" : "Slot Open"}
                  </Badge>
                </div>
                <h4 className="text-base font-black text-white font-display">
                  {bm.name}
                </h4>
                <div className="mt-3">
                  <span className="font-mono text-3xl font-black text-white group-hover:text-volt-300 transition-colors block">
                    {bm.value || '--'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {bm.updatedAt ? `Logged: ${bm.updatedAt}` : 'No benchmark recorded yet'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80">
                <Button
                  variant={bm.value ? "outline" : "secondary"}
                  size="sm"
                  icon={bm.value ? Sliders : Plus}
                  className="w-full"
                  onClick={() => handleOpenBenchmarkModal(bm)}
                >
                  {bm.value ? "Update Benchmark" : "Record Benchmark"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Record Benchmark Modal */}
      {activeBenchmarkModal && (
        <Modal
          isOpen={!!activeBenchmarkModal}
          onClose={() => setActiveBenchmarkModal(null)}
          title={`Record ${activeBenchmarkModal.name}`}
          description={`Enter your verified benchmark value for ${activeBenchmarkModal.metric}.`}
        >
          <form onSubmit={handleSaveBenchmark} className="space-y-4">
            <Input
              label={activeBenchmarkModal.metric}
              placeholder={activeBenchmarkModal.placeholder || 'e.g. 100 kg'}
              value={benchmarkValue}
              onChange={(e) => setBenchmarkValue(e.target.value)}
              required
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button variant="ghost" type="button" onClick={() => setActiveBenchmarkModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={savingBenchmark}>
                Save Benchmark
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
