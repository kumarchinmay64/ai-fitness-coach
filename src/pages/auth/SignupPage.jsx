import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Mail, Lock, User, Target, Activity, Eye, EyeOff, Shield } from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('Muscle Hypertrophy');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await signup({ name, email, password, goal });
      // Direct new user to health onboarding assessment
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      {/* Dynamic Ambient Background Glow Orbs */}
      <div className="absolute top-1/4 -right-10 w-96 h-96 bg-volt-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-1/4 -left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse" />

      <div className="w-full max-w-md space-y-8 animate-fadeIn relative z-10">
        {/* Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-volt-500 to-volt-300 flex items-center justify-center text-dark-950 shadow-xl shadow-volt-500/25 group-hover:scale-105 transition-transform">
              <Activity className="w-7 h-7 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black tracking-tight font-display text-white">
              PULSE<span className="text-gradient-volt">AI</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
            Create Your <span className="text-gradient-volt">Athlete Profile</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Get personalized workout splits and real-time computer vision guidance.
          </p>
        </div>

        {/* Signup Card */}
        <Card variant="glass" className="p-8 space-y-6 border border-slate-800/80 hover:border-volt-500/30 transition-all duration-300 shadow-2xl">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Jordan Miller"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="jordan@domain.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Goal Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Primary Goal
              </label>
              <div className="relative">
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-volt-400 focus:border-volt-400 transition-all"
                >
                  <option value="Muscle Hypertrophy">Muscle Hypertrophy (Build Size)</option>
                  <option value="Strength & Power">Strength & Power Lifting</option>
                  <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                  <option value="Posture & Joint Health">Posture & Joint Correction</option>
                  <option value="Athletic Performance">Athletic Performance</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
            >
              Continue to Health Assessment &rarr;
            </Button>
          </form>

          <div className="text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-volt-400 font-bold hover:text-volt-300 hover:underline">
              Sign in to your account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
