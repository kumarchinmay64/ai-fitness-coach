import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {
  Activity,
  Dumbbell,
  Calendar,
  Utensils,
  TrendingUp,
  MessageSquare,
  Bell,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Flame,
  CheckCheck,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ onOpenChatDrawer }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Live Workout', path: '/workout/live', icon: Dumbbell, highlight: true },
    { name: 'Workout Plan', path: '/workout-plan', icon: Calendar },
    { name: 'Nutrition', path: '/nutrition', icon: Utensils },
    { name: 'Progress', path: '/analytics', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-electric-green flex items-center justify-center text-dark-950 shadow-lg shadow-electric-green/25 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 stroke-[2.5]" />
            <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse-glow pointer-events-none" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight font-display text-white">
              PULSE<span className="text-electric-green">AI</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
              Vision Fitness Coach
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1 bg-dark-900/60 border border-slate-800/80 rounded-2xl px-3 py-1.5 shadow-inner">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? item.highlight
                          ? 'bg-gradient-to-r from-volt-400 to-volt text-dark-950 font-black shadow-md shadow-volt/30 scale-105'
                          : 'bg-slate-800 text-white shadow-sm font-bold'
                        : item.highlight
                        ? 'text-volt hover:bg-volt/10'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* Streak Pill */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-flame/15 to-amber-500/10 border border-flame/40 text-xs font-bold text-flame shadow-sm shadow-flame/15">
                <Flame className="w-4 h-4 text-flame fill-flame animate-flame-flicker" />
                <span>{user?.streak || 0}-Day Streak</span>
              </div>

              {/* Chat Assistant Trigger */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenChatDrawer) onOpenChatDrawer();
                  else navigate('/chat');
                }}
                className="relative p-2.5 rounded-xl bg-gradient-to-r from-neon-purple/15 to-pink-500/15 border border-neon-purple/40 text-neon-purple hover:text-white hover:border-neon-purple transition-all shadow-sm shadow-neon-purple/15 hover:shadow-neon-purple/30 hover:scale-105 active:scale-95 focus:outline-none"
                title="Open AI Fitness Coach"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-purple animate-ping" />
              </button>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl bg-dark-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors focus:outline-none"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-electric-orange text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-dark-900 border border-slate-700 shadow-2xl shadow-black/80 z-50 overflow-hidden animate-scaleUp">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-display">Notifications</span>
                        {unreadCount > 0 && (
                          <Badge variant="orange" size="sm">
                            {unreadCount} new
                          </Badge>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] font-medium text-electric-green hover:underline flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No notifications at this time.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              if (notif.link) {
                                setShowNotifications(false);
                                navigate(notif.link);
                              }
                            }}
                            className={`p-4 transition-colors cursor-pointer hover:bg-slate-800/50 ${
                              notif.unread ? 'bg-emerald-500/5' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-xs font-bold text-slate-200">
                                {notif.title}
                              </h5>
                              <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-dark-900/80 border border-slate-800 hover:border-slate-700 transition-colors focus:outline-none"
                >
                  <span className="text-xs font-bold text-slate-200 hidden sm:inline">
                    {user?.name || 'Athlete'}
                  </span>
                  <img
                    src={
                      user?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
                    }
                    alt="User Avatar"
                    className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-dark-900 border border-slate-700 shadow-2xl shadow-black/80 z-50 overflow-hidden py-1.5">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-xs font-bold text-white">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/onboarding"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Retake Health Assessment</span>
                    </Link>

                    <Link
                      to="/admin/login"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                    >
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>Admin Control Portal</span>
                    </Link>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/admin/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 text-xs font-mono text-cyan-400 hover:bg-cyan-500/10 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Log In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="md:hidden border-t border-slate-800 bg-dark-950/95 px-4 py-4 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-electric-green text-dark-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center px-2">
            <Link
              to="/admin/login"
              className="text-xs font-mono text-cyan-400 flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4" /> Admin Portal
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-xs text-rose-400 font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
