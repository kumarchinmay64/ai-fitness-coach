import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  Activity,
  Flame,
  Dumbbell,
  Play,
  CheckCircle2,
  Utensils,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  Target,
  ChevronRight,
  Plus,
  AlertCircle,
  Video
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [nutrition, setNutrition] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [logMealOpen, setLogMealOpen] = useState(false);
  const [mealForm, setMealForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [submittingMeal, setSubmittingMeal] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [schedData, nutrData, analData] = await Promise.all([
          api.workouts.getWeeklySchedule(),
          api.nutrition.getProfile(),
          api.analytics.getUserAnalytics()
        ]);
        setSchedule(schedData);
        setNutrition(nutrData);
        setAnalytics(analData);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleQuickMealLog = async (e) => {
    e.preventDefault();
    if (!mealForm.name.trim()) return;
    try {
      setSubmittingMeal(true);
      const updated = await api.nutrition.fillMealSlot('custom', {
        name: mealForm.name,
        calories: Number(mealForm.calories) || 0,
        protein: Number(mealForm.protein) || 0,
        carbs: Number(mealForm.carbs) || 0,
        fat: Number(mealForm.fat) || 0,
      });
      setNutrition(updated);
      setLogMealOpen(false);
      setMealForm({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingMeal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Assembling your high-energy training dashboard..." />
      </div>
    );
  }

  // Today's scheduled routine
  const currentDayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });
  const todaysWorkout = schedule.find((d) => d.day.toLowerCase() === currentDayName.toLowerCase()) || schedule[0];

  // Nutrition totals
  const consumed = nutrition?.currentConsumed || { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 };
  const targets = nutrition?.dailyTargets || { calories: 2200, proteinGrams: 160, carbsGrams: 220, fatGrams: 65 };
  const caloriePercent = Math.min(100, Math.round((consumed.calories / targets.calories) * 100)) || 0;
  const proteinPercent = Math.min(100, Math.round((consumed.proteinGrams / targets.proteinGrams) * 100)) || 0;

  const hasRecordedWorkouts = analytics && analytics.totalWorkouts > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn relative">
      {/* Ambient background glow orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-volt/8 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-80 left-10 w-96 h-96 bg-flame/8 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse" />

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant={hasRecordedWorkouts ? "volt" : "flame"} size="sm" dot>
              {hasRecordedWorkouts ? "AI Biometrics Synced" : "New Training Cycle"}
            </Badge>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {currentDayName} Program
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white">
            Welcome back, <span className="text-gradient-volt">{user?.name || 'Athlete'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {hasRecordedWorkouts ? (
              <span>You have completed <strong className="text-volt font-bold">{analytics.totalWorkouts} sessions</strong> so far with <strong className="text-volt font-bold">{analytics.averageAccuracy || 94}% avg accuracy</strong>. Let's conquer today's set!</span>
            ) : (
              <span>Your training profile is primed. Launch your live workout to calibrate your joint angles, count reps automatically, and ignite your consistency streak.</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Button
            variant="primary"
            size="lg"
            icon={Play}
            onClick={() => navigate('/workout/live')}
            className="shadow-xl shadow-volt/25 text-dark-950 font-black"
          >
            Launch Live Workout
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards (Vibrant Data Slots) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Streak */}
        <Card variant="glass" interactive className="p-5 space-y-2 border-flame/30 hover:border-flame hover:shadow-glow-flame">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Streak
            </span>
            <div className="w-9 h-9 rounded-xl bg-flame/15 text-flame flex items-center justify-center shadow-md shadow-flame/20">
              <Flame className="w-5 h-5 text-flame fill-flame animate-flame-flicker" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-black text-white">
              {analytics?.streakDays || 0}
            </span>
            <span className="text-xs text-flame font-bold">Days Active</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            {analytics?.streakDays > 0 ? "Daily streak blazing" : "[Slot] Log workout to ignite streak"}
          </span>
        </Card>

        {/* Biomechanical Accuracy */}
        <Card variant="glass" interactive className="p-5 space-y-2 border-volt/30 hover:border-volt hover:shadow-glow-volt">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Form Accuracy
            </span>
            <div className="w-9 h-9 rounded-xl bg-volt/15 text-volt flex items-center justify-center shadow-md shadow-volt/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-black text-volt">
              {analytics?.averageAccuracy ? `${analytics.averageAccuracy}%` : '-- %'}
            </span>
            <span className="text-xs text-slate-400 font-bold">Avg Score</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            {analytics?.averageAccuracy ? "Calculated across completed sets" : "[Slot] Calculated via live webcam"}
          </span>
        </Card>

        {/* Reps Counted */}
        <Card variant="glass" interactive className="p-5 space-y-2 border-neon-cyan/30 hover:border-neon-cyan hover:shadow-glow-cyan">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Reps Counted
            </span>
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/15 text-neon-cyan flex items-center justify-center shadow-md shadow-neon-cyan/20">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-black text-white">
              {analytics?.totalRepsLogged || 0}
            </span>
            <span className="text-xs text-neon-cyan font-bold">Total Reps</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            {analytics?.totalRepsLogged > 0 ? "Tracked via pose vision" : "[Slot] Live counter tracks automatically"}
          </span>
        </Card>

        {/* Active Calorie Burn */}
        <Card variant="glass" interactive className="p-5 space-y-2 border-amber-500/30 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Burn
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-black text-white">
              {analytics?.caloriesBurnedWeek ? `${analytics.caloriesBurnedWeek}` : '--'}
            </span>
            <span className="text-xs text-amber-400 font-bold">kcal</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            {analytics?.caloriesBurnedWeek > 0 ? "Calculated from session volume" : "[Slot] Estimated post-workout"}
          </span>
        </Card>
      </div>

      {/* Main Rows: Today's Workout + Daily Nutrition Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Today's Recommended Routine */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-volt" />
              <h3 className="text-lg font-bold text-white font-display">
                Today's Prescribed Routine
              </h3>
            </div>
            <Link
              to="/workout-plan"
              className="text-xs font-bold text-volt hover:underline flex items-center gap-1"
            >
              <span>View Full Weekly Split</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card variant="glassVolt" className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="volt" size="sm">
                    {todaysWorkout.day} • {todaysWorkout.focus}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-volt" />
                    {todaysWorkout.duration}
                  </span>
                </div>
                <h4 className="text-2xl font-black font-display text-white">
                  {todaysWorkout.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Focus: Maintain strict movement control, full range of motion, and neutral spine.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                icon={Video}
                onClick={() => navigate('/workout/live')}
              >
                Launch Pose Camera
              </Button>
            </div>

            {/* Exercise Movement Slots */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Exercise Movement Slots ({todaysWorkout.exercises.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {todaysWorkout.exercises.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-dark-850/90 border border-slate-700/80 hover:border-volt/50 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        Movement {idx + 1}
                      </span>
                      <span className="text-[11px] text-volt font-mono font-bold">
                        {item.sets} × {item.reps}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                      {item.note || 'Focus on controlled eccentric form.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Daily Nutrition Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-flame" />
              <h3 className="text-lg font-bold text-white font-display">
                Daily Fuel Intake
              </h3>
            </div>
            <Link
              to="/nutrition"
              className="text-xs font-bold text-flame hover:underline flex items-center gap-1"
            >
              <span>Manage Meals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card variant="glassFlame" className="p-6 space-y-5">
            {/* Calories Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Daily Calorie Target</span>
                <span className="font-mono text-white font-bold">
                  {consumed.calories} / {targets.calories} kcal
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-dark-850 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-flame to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_12px_#FF5E00]"
                  style={{ width: `${caloriePercent}%` }}
                />
              </div>
            </div>

            {/* Protein Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Protein Target</span>
                <span className="font-mono text-volt font-bold">
                  {consumed.proteinGrams}g / {targets.proteinGrams}g
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-dark-850 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-volt to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_10px_#00F59B]"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
            </div>

            {/* Status Notice */}
            <div className="p-3.5 rounded-xl bg-dark-850/90 border border-slate-800 text-xs text-slate-300 space-y-1">
              {consumed.calories === 0 ? (
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-flame mt-0.5 shrink-0" />
                  <span>No meals logged yet today. Tap below to record breakfast or lunch.</span>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-volt mt-0.5 shrink-0" />
                  <span>{consumed.calories} kcal recorded for today.</span>
                </div>
              )}
            </div>

            <Button
              variant="energy"
              size="md"
              icon={Plus}
              className="w-full text-white font-bold"
              onClick={() => setLogMealOpen(true)}
            >
              Log Today's Meal
            </Button>
          </Card>
        </div>
      </div>

      {/* Quick Meal Log Modal */}
      <Modal
        isOpen={logMealOpen}
        onClose={() => setLogMealOpen(false)}
        title="Log Meal Entry"
        description="Enter the nutritional values for your meal to update your daily intake."
      >
        <form onSubmit={handleQuickMealLog} className="space-y-4">
          <Input
            label="Meal / Food Name"
            placeholder="e.g. Scrambled Eggs & Whole Wheat Toast"
            value={mealForm.name}
            onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Calories (kcal)"
              type="number"
              placeholder="e.g. 450"
              value={mealForm.calories}
              onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
              required
            />
            <Input
              label="Protein (g)"
              type="number"
              placeholder="e.g. 32"
              value={mealForm.protein}
              onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
              required
            />
            <Input
              label="Carbs (g)"
              type="number"
              placeholder="e.g. 40"
              value={mealForm.carbs}
              onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
            />
            <Input
              label="Fat (g)"
              type="number"
              placeholder="e.g. 14"
              value={mealForm.fat}
              onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setLogMealOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submittingMeal}>
              Save to Daily Log
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
