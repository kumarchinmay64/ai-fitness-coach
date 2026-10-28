import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Mail, Lock, Activity, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  // One-click demo login filler for quick testing
  const handleDemoFill = () => {
    setEmail('athlete@pulseai.com');
    setPassword('athlete123');
    setError('');
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-volt-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-flame-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse" />

      <div className="w-full max-w-md space-y-8 animate-fadeIn relative z-10">
        {/* Header Branding */}
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
            Welcome Back, <span className="text-gradient-volt">Athlete</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Log in to access your workout metrics and camera biomechanics.
          </p>
        </div>

        {/* Login Card */}
        <Card variant="glass" className="p-8 space-y-6 border border-slate-800/80 hover:border-volt-500/30 transition-all duration-300 shadow-2xl">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="athlete@domain.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-700 bg-dark-900 text-volt-400 focus:ring-volt-400"
                  defaultChecked
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="text-volt-400 hover:text-volt-300 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Credentials Pill */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full py-2.5 px-3 rounded-xl bg-dark-800/80 border border-slate-700/80 hover:border-volt-500/50 hover:bg-volt-500/5 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all group"
            >
              <span className="text-volt-400 group-hover:scale-110 transition-transform">⚡</span>
              <span>One-Click Demo Athlete Credentials</span>
            </button>
          </div>

          <div className="text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-volt-400 font-bold hover:text-volt-300 hover:underline">
              Create one here
            </Link>
          </div>
        </Card>

        {/* Distinct link to Admin Portal */}
        <div className="text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors p-2 rounded-xl hover:bg-cyan-950/20"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Platform Administrator Login &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
