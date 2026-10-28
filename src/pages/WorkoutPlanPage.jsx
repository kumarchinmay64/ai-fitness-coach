import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  Calendar,
  Sparkles,
  Play,
  RotateCw,
  Clock,
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Plus,
  Sliders
} from 'lucide-react';

export default function WorkoutPlanPage() {
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Exercise Detail Modal
  const [activeExercise, setActiveExercise] = useState(null);

  // Customize / Regenerate Modal
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [splitPreference, setSplitPreference] = useState('Push / Pull / Legs Split');

  // Add Custom Exercise Slot Modal
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [customSlot, setCustomSlot] = useState({
    name: '',
    sets: 3,
    reps: 10,
    note: ''
  });
  const [addingSlot, setAddingSlot] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [schedData, exData] = await Promise.all([
          api.workouts.getWeeklySchedule(),
          api.workouts.getExercises()
        ]);
        setSchedule(schedData);
        setExercises(exData);
        if (schedData.length > 0) {
          const currentDayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });
          const match = schedData.find((d) => d.day.toLowerCase() === currentDayName.toLowerCase());
          if (match) setSelectedDay(match.day);
          else setSelectedDay(schedData[0].day);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      const updated = await api.workouts.regeneratePlan({
        focus: splitPreference,
      });
      setSchedule(updated);
      setShowRegenModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlotSubmit = async (e) => {
    e.preventDefault();
    if (!customSlot.name.trim()) return;

    try {
      setAddingSlot(true);
      const updatedSchedule = await api.workouts.addExerciseSlotToDay(selectedDay, {
        exerciseId: 'custom-' + Date.now(),
        sets: Number(customSlot.sets) || 3,
        reps: Number(customSlot.reps) || 10,
        note: `${customSlot.name} — ${customSlot.note || 'Focus on strict form'}`
      });
      setSchedule([...updatedSchedule]);
      setShowAddSlotModal(false);
      setCustomSlot({ name: '', sets: 3, reps: 10, note: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setAddingSlot(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Loading your weekly training program..." />
      </div>
    );
  }

  const currentDayData = schedule.find((d) => d.day.toLowerCase() === selectedDay.toLowerCase()) || schedule[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="neutral" size="sm">
            TRAINING SCHEDULE
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Weekly Split & Exercise Slots
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Follow structured movement routines with real-time pose tracking or customize your slots.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={Sliders}
            onClick={() => setShowRegenModal(true)}
          >
            Adjust Split Protocol
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Play}
            onClick={() => navigate('/workout/live')}
          >
            Launch Live Camera
          </Button>
        </div>
      </div>

      {/* 7-Day Interactive Day Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {schedule.map((item) => {
          const isSelected = item.day.toLowerCase() === selectedDay.toLowerCase();
          return (
            <div
              key={item.day}
              onClick={() => setSelectedDay(item.day)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-b from-volt/20 to-emerald-500/10 border-volt shadow-lg shadow-volt/20 scale-[1.03] -translate-y-1'
                  : 'bg-dark-850/90 border-slate-800 hover:border-slate-600 hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold ${isSelected ? 'text-volt font-black' : 'text-slate-400'}`}>
                  {item.day.slice(0, 3)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.duration}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate font-display">
                {item.focus}
              </h4>
              <span className="text-[11px] text-slate-400 block mt-1">
                {item.isRest ? 'Rest Day' : `${item.exercises?.length || 0} Slots`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Day View */}
      <Card variant="glassVolt" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={currentDayData.isRest ? 'neutral' : 'volt'} size="sm">
                {currentDayData.day} • {currentDayData.focus}
              </Badge>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {currentDayData.duration}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white">
              {currentDayData.title}
            </h2>
          </div>

          {!currentDayData.isRest && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => setShowAddSlotModal(true)}
              >
                Add Exercise Slot
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Play}
                onClick={() => {
                  const firstEx = currentDayData.exercises?.[0]?.exerciseId || 'ex-1';
                  navigate(`/workout/live?exercise=${firstEx}`);
                }}
              >
                Start Camera Session
              </Button>
            </div>
          )}
        </div>

        {currentDayData.isRest ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-dark-800 text-slate-400 flex items-center justify-center mx-auto border border-slate-800">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold text-white font-display">
              Recovery & Mobility Focus
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              No heavy compound resistance prescribed today. Maintain hydration, hit your daily protein goal, and perform light stretching.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Scheduled Movement Slots ({currentDayData.exercises?.length || 0})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentDayData.exercises?.map((item, index) => {
                const exDetails = exercises.find((e) => e.id === item.exerciseId) || {
                  name: item.note?.split('—')[0] || `Movement ${index + 1}`,
                  equipment: 'Bodyweight / Dumbbells',
                  formCues: ['Keep core tight and maintain steady tempo.'],
                  commonMistakes: ['Rushing through the eccentric portion.']
                };

                return (
                  <div
                    key={index}
                    onClick={() => setActiveExercise({ ...exDetails, ...item })}
                    className="p-5 rounded-xl bg-dark-800/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-dark-800 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                          Slot {index + 1}
                        </span>
                        <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors font-display mt-0.5">
                          {exDetails.name}
                        </h4>
                      </div>
                      <Badge variant="neutral" size="sm">
                        {item.sets} × {item.reps}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {item.note || 'Focus on clean biomechanical technique and proper joint tracking.'}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                      <span>{exDetails.equipment || 'Standard Gear'}</span>
                      <span className="text-emerald-400 font-semibold group-hover:underline flex items-center gap-1">
                        View Form Cues &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Movement Detail Modal */}
      {activeExercise && (
        <Modal
          isOpen={!!activeExercise}
          onClose={() => setActiveExercise(null)}
          title={activeExercise.name}
          description={`Biomechanical form cues and technique checkpoints for ${activeExercise.name}.`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-dark-800 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Prescribed Volume</span>
              <span className="font-mono text-slate-300">
                {activeExercise.sets} sets × {activeExercise.reps} reps
              </span>
            </div>

            <div>
              <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                Technique Form Checkpoints
              </span>
              <ul className="space-y-2">
                {(activeExercise.formCues || ['Maintain neutral spine.']).map((cue, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-bold text-amber-400 uppercase tracking-wider block mb-2">
                Common Faults to Avoid
              </span>
              <ul className="space-y-2">
                {(activeExercise.commonMistakes || ['Incomplete range of motion.']).map((err, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-400">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/workout/live?exercise=${activeExercise.id || 'ex-1'}`)}
              >
                Test with Pose Camera
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Custom Exercise Slot Modal */}
      <Modal
        isOpen={showAddSlotModal}
        onClose={() => setShowAddSlotModal(false)}
        title={`Add Exercise Slot to ${selectedDay}`}
        description="Insert a custom movement into today's training split."
      >
        <form onSubmit={handleAddSlotSubmit} className="space-y-4">
          <Input
            label="Exercise Name"
            placeholder="e.g. Incline Dumbbell Press"
            value={customSlot.name}
            onChange={(e) => setCustomSlot({ ...customSlot, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Sets"
              type="number"
              value={customSlot.sets}
              onChange={(e) => setCustomSlot({ ...customSlot, sets: e.target.value })}
              required
            />
            <Input
              label="Target Reps"
              type="number"
              value={customSlot.reps}
              onChange={(e) => setCustomSlot({ ...customSlot, reps: e.target.value })}
              required
            />
          </div>
          <Input
            label="Form Notes & Focus"
            placeholder="e.g. Pause 1 second at chest, control eccentric"
            value={customSlot.note}
            onChange={(e) => setCustomSlot({ ...customSlot, note: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setShowAddSlotModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={addingSlot}>
              Add Slot
            </Button>
          </div>
        </form>
      </Modal>

      {/* Adjust Split Modal */}
      <Modal
        isOpen={showRegenModal}
        onClose={() => setShowRegenModal(false)}
        title="Adjust Weekly Split Protocol"
        description="Select your preferred weekly resistance distribution."
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Split Architecture</label>
            <div className="space-y-2">
              {['Push / Pull / Legs Split', 'Upper / Lower Body Hypertrophy', 'Full Body Athletic Conditioning'].map((s) => (
                <div
                  key={s}
                  onClick={() => setSplitPreference(s)}
                  className={`p-3 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                    splitPreference === s
                      ? 'bg-emerald-500/15 border-emerald-500 text-white'
                      : 'bg-dark-800 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setShowRegenModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRegenerate}>
              Update Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
