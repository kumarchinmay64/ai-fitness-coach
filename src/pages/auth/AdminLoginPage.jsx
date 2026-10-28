import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Shield, Lock, Mail, ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Staff credentials required.');
      return;
    }

    try {
      setLoading(true);
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Access Denied: Invalid staff credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@pulseai.com');
    setPassword('PulseAdmin2025!');
    setError('');
  };

  return (
    <div className="relative min-h-screen bg-dark-950 flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Dynamic Ambient Security Glow Orbs */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute -bottom-10 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fadeIn">
        {/* Top Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Athlete Portal</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/20">
            <Shield className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono font-bold tracking-widest uppercase">
            STAFF & COACHING OPERATIONS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            Platform Security <span className="text-gradient-cyan">Login</span>
          </h1>
          <p className="text-xs text-slate-400">
            Authorized console for gym trainers and platform administrative staff.
          </p>
        </div>

        {/* Login Box */}
        <Card variant="glassCyan" className="p-7 space-y-5 shadow-2xl">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <Input
              label="Staff Email"
              type="email"
              placeholder="admin@pulseai.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              icon={KeyRound}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="cyber"
              size="lg"
              className="w-full mt-2"
              loading={loading}
            >
              Access Operations Console &rarr;
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="pt-3 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="w-full py-2.5 px-3 rounded-xl bg-dark-800/80 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 text-xs text-cyan-300 hover:text-white flex items-center justify-center gap-2 transition-all font-semibold group"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>1-Click Demo Staff Credentials</span>
            </button>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-500 font-mono">
          PulseAI Biometrics Security Mesh • Local Verification
        </p>
      </div>
    </div>
  );
}
