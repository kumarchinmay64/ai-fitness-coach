import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  Utensils,
  Droplets,
  Plus,
  Minus,
  Clock,
  BookOpen,
  Filter,
  Sliders,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export default function NutritionPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [activeDiet, setActiveDiet] = useState('High Protein');
  const [selectedSlotForLog, setSelectedSlotForLog] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Meal Log Form
  const [mealForm, setMealForm] = useState({
    name: '',
    category: 'Breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    prepTime: '10 mins'
  });

  // Target Edit Form
  const [targetForm, setTargetForm] = useState({
    calories: 2200,
    proteinGrams: 160,
    carbsGrams: 220,
    fatGrams: 65,
    targetGlasses: 10
  });

  const loadNutrition = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.nutrition.getProfile();
      setNutrition(data);
      if (data.dietPreference) setActiveDiet(data.dietPreference);
      if (data.dailyTargets) {
        setTargetForm({
          calories: data.dailyTargets.calories,
          proteinGrams: data.dailyTargets.proteinGrams,
          carbsGrams: data.dailyTargets.carbsGrams,
          fatGrams: data.dailyTargets.fatGrams,
          targetGlasses: data.dailyTargets.targetGlasses || 10
        });
      }
    } catch (err) {
      console.error(err);
      setError('Unable to reach nutrition server. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNutrition();
  }, []);

  const handleWaterDelta = async (delta) => {
    if (!nutrition) return;
    setActionError(null);
    try {
      const current = nutrition.currentConsumed.waterGlasses || 0;
      const updatedGlasses = Math.max(0, current + delta);
      await api.nutrition.updateWater(updatedGlasses);
      setNutrition((prev) => ({
        ...prev,
        currentConsumed: {
          ...prev.currentConsumed,
          waterGlasses: updatedGlasses
        }
      }));
    } catch (err) {
      console.error(err);
      setActionError('Failed to sync hydration update with server.');
    }
  };

  const handleDietChange = async (diet) => {
    setActionError(null);
    try {
      setActiveDiet(diet);
      await api.nutrition.updateDietPreference(diet);
    } catch (err) {
      console.error(err);
      setActionError('Failed to update diet preference on server.');
    }
  };

  const handleOpenSlotLog = (slot) => {
    setActionError(null);
    setSelectedSlotForLog(slot.id);
    setMealForm({
      name: '',
      category: slot.category,
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      prepTime: '10 mins'
    });
    setShowLogModal(true);
  };

  const handleLogMealSubmit = async (e) => {
    e.preventDefault();
    if (!mealForm.name.trim() || !mealForm.calories) return;

    try {
      setSubmitting(true);
      setActionError(null);
      const updatedProfile = await api.nutrition.fillMealSlot(selectedSlotForLog, {
        name: mealForm.name,
        category: mealForm.category,
        calories: Number(mealForm.calories) || 0,
        protein: Number(mealForm.protein) || 0,
        carbs: Number(mealForm.carbs) || 0,
        fat: Number(mealForm.fat) || 0,
        prepTime: mealForm.prepTime
      });
      setNutrition(updatedProfile);
      setShowLogModal(false);
    } catch (err) {
      console.error(err);
      setActionError('Failed to record meal. Please check server connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadSampleTemplate = async () => {
    try {
      setLoading(true);
      setActionError(null);
      const updated = await api.nutrition.loadSamplePlan();
      setNutrition(updated);
    } catch (err) {
      console.error(err);
      setActionError('Failed to load sample plan from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSlots = async () => {
    try {
      setLoading(true);
      setActionError(null);
      const reset = await api.nutrition.resetMealSlots();
      setNutrition(reset);
    } catch (err) {
      console.error(err);
      setActionError('Failed to clear slots on server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTargets = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setActionError(null);
      await api.nutrition.updateDailyTargets({
        calories: Number(targetForm.calories),
        proteinGrams: Number(targetForm.proteinGrams),
        carbsGrams: Number(targetForm.carbsGrams),
        fatGrams: Number(targetForm.fatGrams),
        targetGlasses: Number(targetForm.targetGlasses)
      });
      setNutrition((prev) => ({
        ...prev,
        dailyTargets: {
          ...prev.dailyTargets,
          calories: Number(targetForm.calories),
          proteinGrams: Number(targetForm.proteinGrams),
          carbsGrams: Number(targetForm.carbsGrams),
          fatGrams: Number(targetForm.fatGrams),
          targetGlasses: Number(targetForm.targetGlasses)
        }
      }));
      setShowTargetModal(false);
    } catch (err) {
      console.error(err);
      setActionError('Failed to save targets on server.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading nutrition logs and target slots..." />
      </div>
    );
  }

  if (error && !nutrition) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white font-display">Nutrition Server Unavailable</h2>
        <p className="text-xs text-slate-400 max-w-sm">{error}</p>
        <Button variant="primary" size="sm" onClick={() => loadNutrition()}>
          Retry Connection
        </Button>
      </div>
    );
  }

  const { dailyTargets, currentConsumed, meals } = nutrition;
  const calPercent = Math.min(100, Math.round((currentConsumed.calories / dailyTargets.calories) * 100)) || 0;
  const proteinPercent = Math.min(100, Math.round((currentConsumed.proteinGrams / dailyTargets.proteinGrams) * 100)) || 0;
  const carbsPercent = Math.min(100, Math.round((currentConsumed.carbsGrams / dailyTargets.carbsGrams) * 100)) || 0;
  const fatPercent = Math.min(100, Math.round((currentConsumed.fatGrams / dailyTargets.fatGrams) * 100)) || 0;

  const waterGlasses = currentConsumed.waterGlasses || 0;
  const targetGlasses = dailyTargets.targetGlasses || 10;

  const dietOptions = ['High Protein', 'Balanced', 'Keto', 'Plant-Based / Vegan', 'Paleo'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Action Error Banner */}
      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="neutral" size="sm">
            NUTRITION & MACROS
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Daily Targets & Meal Slots
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Log your actual meals throughout the day or load a sample balanced template.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={Sliders}
            onClick={() => setShowTargetModal(true)}
          >
            Configure Targets
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={handleResetSlots}
          >
            Clear Slots
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={BookOpen}
            onClick={handleLoadSampleTemplate}
          >
            Load Sample Plan
          </Button>
        </div>
      </div>

      {/* Diet Preference Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-emerald-400" /> Goal Preference:
        </span>
        {dietOptions.map((diet) => (
          <button
            key={diet}
            type="button"
            onClick={() => handleDietChange(diet)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeDiet === diet
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'bg-dark-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {diet}
          </button>
        ))}
      </div>

      {/* Main Row: Macro Summary & Water Intake */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 1 & 2: Macro Breakdown Cards */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glassFlame" className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Daily Caloric Intake
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-3xl font-black text-white">
                    {currentConsumed.calories}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    / {dailyTargets.calories} kcal target
                  </span>
                </div>
              </div>

              <Badge variant="flame" size="md">
                {calPercent}% of target
              </Badge>
            </div>

            {/* Overall Calorie Bar */}
            <div className="w-full h-3.5 rounded-full bg-dark-850 overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-flame via-flame-400 to-amber-400 transition-all duration-500 shadow-[0_0_12px_#FF5E00]"
                style={{ width: `${calPercent}%` }}
              />
            </div>

            {/* Macro Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              {/* Protein */}
              <div className="p-4 rounded-xl bg-dark-850/90 border border-volt/30 space-y-2 hover:border-volt/60 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Protein</span>
                  <span className="font-mono text-volt font-black">
                    {currentConsumed.proteinGrams} / {dailyTargets.proteinGrams}g
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-volt to-emerald-400 transition-all duration-500 shadow-[0_0_10px_#00F59B]"
                    style={{ width: `${proteinPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {Math.max(0, dailyTargets.proteinGrams - currentConsumed.proteinGrams)}g remaining
                </span>
              </div>

              {/* Carbs */}
              <div className="p-4 rounded-xl bg-dark-850/90 border border-neon-cyan/30 space-y-2 hover:border-neon-cyan/60 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Carbs</span>
                  <span className="font-mono text-neon-cyan font-black">
                    {currentConsumed.carbsGrams} / {dailyTargets.carbsGrams}g
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-blue-400 transition-all duration-500 shadow-[0_0_10px_#00F0FF]"
                    style={{ width: `${carbsPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {Math.max(0, dailyTargets.carbsGrams - currentConsumed.carbsGrams)}g remaining
                </span>
              </div>

              {/* Fats */}
              <div className="p-4 rounded-xl bg-dark-850/90 border border-amber-500/30 space-y-2 hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Fats</span>
                  <span className="font-mono text-amber-400 font-black">
                    {currentConsumed.fatGrams} / {dailyTargets.fatGrams}g
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-500 shadow-[0_0_10px_#F59E0B]"
                    style={{ width: `${fatPercent}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {Math.max(0, dailyTargets.fatGrams - currentConsumed.fatGrams)}g remaining
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Col 3: Interactive Water Tracker */}
        <div>
          <Card variant="glassCyan" className="p-6 sm:p-8 space-y-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan shadow-md shadow-neon-cyan/20">
                    <Droplets className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Hydration Log
                  </span>
                </div>
                <Badge variant="cyan" size="sm">
                  {waterGlasses >= targetGlasses ? 'Goal Met' : `${waterGlasses}/${targetGlasses} Glasses`}
                </Badge>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-mono text-3xl font-black text-white">
                  {(waterGlasses * 0.25).toFixed(1)}L
                </span>
                <span className="text-xs text-neon-cyan font-bold">
                  / {(targetGlasses * 0.25).toFixed(1)}L daily goal
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                250ml per glass. Click any glass to record hydration intake with instant feedback.
              </p>

              {/* Water Glass Icons Grid */}
              <div className="grid grid-cols-5 gap-2 mt-5">
                {Array.from({ length: targetGlasses }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleWaterDelta(idx < waterGlasses ? -1 : 1)}
                    className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      idx < waterGlasses
                        ? 'bg-neon-cyan/25 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,240,255,0.4)] scale-105 active:scale-95'
                        : 'bg-dark-850 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300 active:scale-95'
                    }`}
                  >
                    <Droplets className="w-4 h-4" />
                    <span className="text-[9px] font-mono font-bold mt-0.5">{idx + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                icon={Minus}
                className="flex-1"
                onClick={() => handleWaterDelta(-1)}
                disabled={waterGlasses <= 0}
              >
                Minus Glass
              </Button>
              <Button
                variant="cyber"
                size="sm"
                icon={Plus}
                className="flex-1"
                onClick={() => handleWaterDelta(1)}
              >
                Add Glass
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Meal Slots Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-display">
              Daily Meal Slots
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {meals.filter((m) => m.completed).length} of {meals.length} slots logged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {meals.map((meal) => (
            <Card
              key={meal.id}
              variant="glass"
              className={`p-5 sm:p-6 space-y-4 border ${
                meal.completed ? 'border-slate-800' : 'border-dashed border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={meal.completed ? "success" : "neutral"} size="sm">
                    {meal.category}
                  </Badge>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {meal.slotTime}
                  </span>
                </div>
                {meal.completed ? (
                  <Badge variant="success" size="sm">
                    Logged
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm">
                    Slot Open
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {meal.completed ? meal.name : `Open Slot: ${meal.category}`}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {meal.imageNote}
                </p>
              </div>

              {/* Macro pills */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="p-2 rounded-lg bg-dark-800/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Calories</span>
                  <span className="font-mono text-xs font-bold text-white">
                    {meal.calories > 0 ? `${meal.calories}` : '--'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-dark-800/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Protein</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {meal.protein > 0 ? `${meal.protein}g` : '--'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-dark-800/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Carbs</span>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {meal.carbs > 0 ? `${meal.carbs}g` : '--'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-dark-800/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Fat</span>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {meal.fat > 0 ? `${meal.fat}g` : '--'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant={meal.completed ? "outline" : "primary"}
                  size="sm"
                  icon={meal.completed ? Sliders : Plus}
                  onClick={() => handleOpenSlotLog(meal)}
                >
                  {meal.completed ? "Update Entry" : "Log Meal"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Log / Update Meal Modal */}
      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title={`Record ${mealForm.category}`}
        description="Enter the food items and macronutrients for this meal slot."
      >
        <form onSubmit={handleLogMealSubmit} className="space-y-4">
          <Input
            label="Meal / Food Name"
            placeholder="e.g. Grilled Chicken, Brown Rice & Broccoli"
            value={mealForm.name}
            onChange={(e) => setMealForm({ ...mealForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Calories (kcal)"
              type="number"
              placeholder="e.g. 550"
              value={mealForm.calories}
              onChange={(e) => setMealForm({ ...mealForm, calories: e.target.value })}
              required
            />
            <Input
              label="Protein (g)"
              type="number"
              placeholder="e.g. 45"
              value={mealForm.protein}
              onChange={(e) => setMealForm({ ...mealForm, protein: e.target.value })}
              required
            />
            <Input
              label="Carbs (g)"
              type="number"
              placeholder="e.g. 50"
              value={mealForm.carbs}
              onChange={(e) => setMealForm({ ...mealForm, carbs: e.target.value })}
            />
            <Input
              label="Fat (g)"
              type="number"
              placeholder="e.g. 15"
              value={mealForm.fat}
              onChange={(e) => setMealForm({ ...mealForm, fat: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setShowLogModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Save to Slot
            </Button>
          </div>
        </form>
      </Modal>

      {/* Configure Targets Modal */}
      <Modal
        isOpen={showTargetModal}
        onClose={() => setShowTargetModal(false)}
        title="Configure Daily Targets"
        description="Customize your daily caloric and macronutrient goals based on your body weight and training focus."
      >
        <form onSubmit={handleSaveTargets} className="space-y-4">
          <Input
            label="Daily Calories (kcal)"
            type="number"
            value={targetForm.calories}
            onChange={(e) => setTargetForm({ ...targetForm, calories: e.target.value })}
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Protein (g)"
              type="number"
              value={targetForm.proteinGrams}
              onChange={(e) => setTargetForm({ ...targetForm, proteinGrams: e.target.value })}
              required
            />
            <Input
              label="Carbs (g)"
              type="number"
              value={targetForm.carbsGrams}
              onChange={(e) => setTargetForm({ ...targetForm, carbsGrams: e.target.value })}
              required
            />
            <Input
              label="Fat (g)"
              type="number"
              value={targetForm.fatGrams}
              onChange={(e) => setTargetForm({ ...targetForm, fatGrams: e.target.value })}
              required
            />
          </div>
          <Input
            label="Water Target (Glasses - 250ml each)"
            type="number"
            value={targetForm.targetGlasses}
            onChange={(e) => setTargetForm({ ...targetForm, targetGlasses: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setShowTargetModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Update Targets
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
