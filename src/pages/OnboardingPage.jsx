import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Target,
  Calendar,
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    age: 26,
    gender: 'Male',
    heightCm: 180,
    weightKg: 78,
    fitnessLevel: 'Intermediate',
    goal: 'Muscle Hypertrophy',
    workoutFrequency: 4,
    equipment: 'Dumbbells & Bodyweight',
    injuries: 'None',
  });

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    try {
      setSubmitting(true);
      await api.onboarding.saveHealthProfile(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Progress percentage
  const progressPercent = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-[85vh] max-w-3xl mx-auto px-4 py-12 flex flex-col justify-center">
      {/* Top Header & Stepper */}
      <div className="space-y-4 mb-8 text-center">
        <Badge variant="success" size="sm" dot>
          Step {step} of {totalSteps}: Health & Biometrics Assessment
        </Badge>
        <h1 className="text-3xl font-black font-display text-white">
          Calibrate Your AI Coach
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          We use your biomechanical measurements to calculate safe joint load thresholds and custom volume.
        </p>

        {/* Visual Progress Bar */}
        <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden border border-slate-800 relative mt-4">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-electric-green to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Dynamic Step Content Card */}
      <Card variant="glass" className="p-6 sm:p-10">
        {/* STEP 1: Basic Biometrics */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Biometric Baselines
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Accurate numbers ensure correct caloric expenditure and exercise leverage estimations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Age (Years)"
                type="number"
                min="14"
                max="90"
                value={formData.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-electric-green"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <Input
                label="Height (cm)"
                type="number"
                min="100"
                max="250"
                value={formData.heightCm}
                onChange={(e) => handleChange('heightCm', Number(e.target.value))}
                required
              />

              <Input
                label="Body Weight (kg)"
                type="number"
                min="30"
                max="250"
                value={formData.weightKg}
                onChange={(e) => handleChange('weightKg', Number(e.target.value))}
                required
              />
            </div>
          </div>
        )}

        {/* STEP 2: Fitness Level & Primary Goal */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Experience Level & Primary Objective
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjusts real-time posture tolerance and depth stringency.
              </p>
            </div>

            {/* Fitness Level Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Lifting Experience
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Beginner (< 1 yr)', 'Intermediate (1-3 yrs)', 'Advanced (3+ yrs)'].map((level) => {
                  const key = level.split(' ')[0];
                  const isSelected = formData.fitnessLevel === key;
                  return (
                    <div
                      key={key}
                      onClick={() => handleChange('fitnessLevel', key)}
                      className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-electric-green/10 border-electric-green text-electric-green font-bold shadow-md shadow-electric-green/10'
                          : 'bg-dark-900 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-sm block font-display">{key}</span>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        {key === 'Beginner' ? 'Learning cues' : key === 'Intermediate' ? 'Hypertrophy volume' : 'Elite mechanics'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Goal Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Primary Training Focus
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'Muscle Hypertrophy', label: 'Muscle Hypertrophy', desc: 'Maximize muscular size & symmetry' },
                  { id: 'Strength & Power', label: 'Strength & Power', desc: 'Olympic & barbell compound lifts' },
                  { id: 'Posture & Joint Rehab', label: 'Posture Correction', desc: 'Fix anterior pelvic tilt & rounded shoulders' },
                  { id: 'Fat Loss & Conditioning', label: 'Fat Loss & Stamina', desc: 'High metabolic density and stamina' },
                ].map((item) => {
                  const isSelected = formData.goal === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleChange('goal', item.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-electric-green/10 border-electric-green text-white font-bold shadow-md shadow-electric-green/10'
                          : 'bg-dark-900 border-slate-700/80 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold font-display">{item.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-electric-green" />}
                      </div>
                      <span className="text-xs text-slate-400 block mt-1">{item.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Frequency, Equipment, Restrictions */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                Weekly Schedule & Equipment
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                We'll generate a program tailored precisely to your gear and time commitments.
              </p>
            </div>

            {/* Frequency Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold uppercase tracking-wider text-slate-300">
                  Target Workouts Per Week:
                </span>
                <span className="font-mono font-bold text-electric-green text-base">
                  {formData.workoutFrequency} Days / Week
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                step="1"
                value={formData.workoutFrequency}
                onChange={(e) => handleChange('workoutFrequency', Number(e.target.value))}
                className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-electric-green"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>2 days (Minimum)</span>
                <span>4 days (Optimal)</span>
                <span>6 days (Advanced)</span>
              </div>
            </div>

            {/* Equipment Setup */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Available Equipment
              </label>
              <select
                value={formData.equipment}
                onChange={(e) => handleChange('equipment', e.target.value)}
                className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-electric-green"
              >
                <option value="Full Commercial Gym (Barbells, Cables, Machines)">Full Commercial Gym (Barbells, Cables, Machines)</option>
                <option value="Dumbbells & Bodyweight (Home Gym)">Dumbbells & Bodyweight (Home Gym)</option>
                <option value="Bodyweight & Resistance Bands Only">Bodyweight & Resistance Bands Only</option>
                <option value="Barbell & Squat Rack Only">Barbell & Squat Rack Only</option>
              </select>
            </div>

            {/* Injury Restrictions */}
            <Input
              label="Injury History or Restrictions (Optional)"
              placeholder="e.g., Lower back disc flare-up, right knee meniscus click"
              value={formData.injuries}
              onChange={(e) => handleChange('injuries', e.target.value)}
              helperText="The AI camera system will apply extra safety angle limits for these areas."
            />
          </div>
        )}

        {/* STEP 4: Review & Generate */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-electric-green/20 text-electric-green flex items-center justify-center mx-auto mb-3 shadow-lg shadow-electric-green/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white font-display">
                Profile Calibrated & Ready!
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Your custom 7-day biomechanical plan and macro targets have been generated.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Goal</span>
                <p className="font-bold text-white text-sm">{formData.goal}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Schedule</span>
                <p className="font-bold text-electric-green text-sm">{formData.workoutFrequency} Days / Week</p>
              </div>
              <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Body Stats</span>
                <p className="font-bold text-white text-sm">{formData.weightKg} kg • {formData.heightCm} cm</p>
              </div>
              <div className="p-3.5 rounded-xl bg-dark-800/80 border border-slate-700/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Vision Tolerance</span>
                <p className="font-bold text-cyan-400 text-sm">{formData.fitnessLevel} Precision</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-white block mb-1">Recommended Next Step:</span>
              Launch your first Live Workout session with your webcam to verify skeletal joint calibration on bodyweight squats.
            </div>
          </div>
        )}

        {/* Footer Stepper Controls */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800">
          {step > 1 ? (
            <Button
              variant="secondary"
              size="md"
              icon={ArrowLeft}
              onClick={handleBack}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleNext}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              icon={Zap}
              isLoading={submitting}
              onClick={handleFinish}
            >
              Launch Dashboard &rarr;
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
