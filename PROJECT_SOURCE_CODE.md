# AI Fitness Coach (PulseAI) - Full Source Code

> Complete source code export for ChatGPT / AI analysis.

## Project Overview
- **Stack**: React (Vite) + Tailwind CSS + Lucide Icons
- **Theme**: Hyper-Volt & Cybernetic Athletics (Dark Mode, Neon Accents, Smooth CSS Animations)
- **Live Features**: Real-time webcam HUD, honest telemetry slots, dynamic AI Chat assistant, nutrition/workout planners, and Admin portal.

## Table of Files Included
- `package.json`
- `vite.config.js`
- `tailwind.config.js`
- `index.html`
- `src/App.css`
- `src/App.jsx`
- `src/components/layout/AdminLayout.jsx`
- `src/components/layout/AdminRoute.jsx`
- `src/components/layout/Footer.jsx`
- `src/components/layout/Navbar.jsx`
- `src/components/layout/ProtectedRoute.jsx`
- `src/components/pose/FormFeedbackHUD.jsx`
- `src/components/pose/PoseCanvas.jsx`
- `src/components/ui/Badge.jsx`
- `src/components/ui/Button.jsx`
- `src/components/ui/Card.jsx`
- `src/components/ui/EmptyState.jsx`
- `src/components/ui/Input.jsx`
- `src/components/ui/LoadingSpinner.jsx`
- `src/components/ui/Modal.jsx`
- `src/context/AuthContext.jsx`
- `src/context/NotificationContext.jsx`
- `src/data/mockAdminData.js`
- `src/data/mockNutrition.js`
- `src/data/mockWorkouts.js`
- `src/index.css`
- `src/main.jsx`
- `src/pages/admin/AdminActivityLogsPage.jsx`
- `src/pages/admin/AdminContentPage.jsx`
- `src/pages/admin/AdminOverviewPage.jsx`
- `src/pages/admin/AdminUsersPage.jsx`
- `src/pages/AnalyticsPage.jsx`
- `src/pages/auth/AdminLoginPage.jsx`
- `src/pages/auth/LoginPage.jsx`
- `src/pages/auth/SignupPage.jsx`
- `src/pages/ChatAssistantPage.jsx`
- `src/pages/DashboardPage.jsx`
- `src/pages/LandingPage.jsx`
- `src/pages/LiveWorkoutPage.jsx`
- `src/pages/NutritionPage.jsx`
- `src/pages/OnboardingPage.jsx`
- `src/pages/WorkoutPlanPage.jsx`
- `src/services/aiService.js`
- `src/services/api.js`

---

## File: `package.json`

```json
{
  "name": "ai-fitness-coach",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "chart.js": "^4.4.8",
    "lucide-react": "^1.16.0",
    "react": "^18.3.1",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "vite": "^6.2.0"
  }
}

```

---

## File: `vite.config.js`

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
})

```

---

## File: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050811',
          900: '#0A0F1E',
          850: '#10182E',
          800: '#15213F',
          750: '#1D2D54',
          700: '#25396A',
          600: '#344F94',
        },
        volt: {
          300: '#D9FF66',
          400: '#CCFF00',
          500: '#00F59B',
          600: '#10B981',
          DEFAULT: '#00F59B',
        },
        flame: {
          400: '#FF7A00',
          500: '#FF5E00',
          600: '#E04E00',
          DEFAULT: '#FF5E00',
        },
        neon: {
          cyan: '#00F0FF',
          blue: '#38BDF8',
          purple: '#A855F7',
          pink: '#EC4899',
          amber: '#F59E0B',
        },
        electric: {
          green: '#00F59B',
          lime: '#10B981',
          emerald: '#059669',
          orange: '#FF5E00',
          amber: '#F59E0B',
          cyan: '#00F0FF',
          blue: '#38BDF8',
          purple: '#8B5CF6',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-volt': '0 0 30px -5px rgba(0, 245, 155, 0.5)',
        'glow-flame': '0 0 30px -5px rgba(255, 94, 0, 0.5)',
        'glow-cyan': '0 0 30px -5px rgba(0, 240, 255, 0.45)',
        'glow-purple': '0 0 30px -5px rgba(168, 85, 247, 0.45)',
        'glow-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'radar-ping': 'radarPing 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'flame-flicker': 'flameFlicker 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(0, 245, 155, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 5px rgba(0, 245, 155, 0.2))' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(14px) rotate(-2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        radarPing: {
          '75%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        flameFlicker: {
          '0%': { transform: 'scale(1) rotate(-1deg)', filter: 'drop-shadow(0 0 10px rgba(255, 94, 0, 0.7))' },
          '100%': { transform: 'scale(1.08) rotate(1deg)', filter: 'drop-shadow(0 0 18px rgba(255, 122, 0, 0.9))' },
        }
      }
    },
  },
  plugins: [],
}

```

---

## File: `index.html`

```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300F59B'><path d='M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43 1.43 1.43 2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43 1.43-1.43-1.43-1.43z'/></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AI Fitness Coach - Real-time posture correction during workouts via webcam, smart personalized workout and nutrition plans, and 24/7 AI coaching." />
    <meta name="keywords" content="AI fitness, posture correction, workout tracker, nutrition planner, computer vision gym, AI coach" />
    <title>AI Fitness Coach | Real-Time Posture Correction & Smart Coaching</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  </head>
  <body class="bg-dark-950 text-slate-100 font-sans antialiased selection:bg-electric-green selection:text-dark-950 overflow-x-hidden min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

---

## File: `src/App.css`

```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}

```

---

## File: `src/App.jsx`

```javascript
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';

// User & Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import LiveWorkoutPage from './pages/LiveWorkoutPage';
import WorkoutPlanPage from './pages/WorkoutPlanPage';
import NutritionPage from './pages/NutritionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ChatAssistantPage from './pages/ChatAssistantPage';

// Slide Drawer for quick chat assistance
import { X, MessageSquare } from 'lucide-react';

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-electric-green selection:text-dark-950">
      {/* Public / User Navbar */}
      {!isAdminRoute && (
        <Navbar onOpenChatDrawer={() => setChatDrawerOpen(true)} />
      )}

      {/* Main Routing Body */}
      <div className="flex-1 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* User Protected Feature Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout/live"
            element={
              <ProtectedRoute>
                <LiveWorkoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-plan"
            element={
              <ProtectedRoute>
                <WorkoutPlanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <NutritionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatAssistantPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Platform Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<DashboardRedirect />} />
            <Route path="users" element={<AdminUsersRedirect />} />
            <Route path="content" element={<AdminContentRedirect />} />
            <Route path="activity" element={<AdminActivityRedirect />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Public / User Footer */}
      {!isAdminRoute && location.pathname !== '/workout/live' && <Footer />}

      {/* Slide-out AI Coach Drawer */}
      {chatDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setChatDrawerOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-dark-900 border-l border-slate-700/80 h-full shadow-2xl z-10 flex flex-col animate-slideLeft">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-dark-950/90">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-electric-green" />
                <span className="font-bold text-white font-display text-sm">
                  PulseAI Live Coaching Drawer
                </span>
              </div>
              <button
                type="button"
                onClick={() => setChatDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <ChatAssistantPage isDrawer={true} onClose={() => setChatDrawerOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Lazy/direct admin imports to avoid cyclic dependencies
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminContentPage from './pages/admin/AdminContentPage';
import AdminActivityLogsPage from './pages/admin/AdminActivityLogsPage';

function DashboardRedirect() {
  return <AdminOverviewPage />;
}
function AdminUsersRedirect() {
  return <AdminUsersPage />;
}
function AdminContentRedirect() {
  return <AdminContentPage />;
}
function AdminActivityRedirect() {
  return <AdminActivityLogsPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppShell />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

```

---

## File: `src/components/layout/AdminLayout.jsx`

```javascript
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  Users,
  Database,
  ScrollText,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'System Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Athlete Roster', path: '/admin/users', icon: Users },
    { name: 'Movement Catalog', path: '/admin/content', icon: Database },
    { name: 'Activity Log', path: '/admin/activity', icon: ScrollText },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-dark-900/90 backdrop-blur-md px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-dark-800 border border-slate-700 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wide text-white uppercase block">
                Staff & Operations Console
              </span>
              <span className="block text-[10px] text-slate-400">
                PulseAI Platform Administration
              </span>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Vision Engine: Ready</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors text-xs"
          >
            <span>Athlete Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <img
              src={admin?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80'}
              alt="Staff"
              className="w-7 h-7 rounded-lg object-cover border border-slate-700"
            />
            <span className="hidden lg:inline text-xs font-semibold text-slate-300">
              {admin?.name}
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Admin Sidebar */}
        <aside
          className={`${
            collapsed ? 'w-20' : 'w-64'
          } transition-all duration-300 border-r border-slate-800 bg-dark-900/60 flex flex-col justify-between py-6 px-3 z-20`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between px-3">
              {!collapsed && (
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Platform Modules
                </span>
              )}
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 ml-auto focus:outline-none"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-dark-800/60'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bottom Controls */}
          <div className="pt-4 border-t border-slate-800/80 px-2 space-y-2">
            {!collapsed && (
              <div className="p-3 rounded-xl bg-dark-800/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-semibold text-slate-200 block">PulseAI Storage</span>
                <span>Client-Side Local Storage Adapter</span>
              </div>
            )}

            <button
              type="button"
              onClick={async () => {
                await adminLogout();
                navigate('/admin/login');
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Staff Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 bg-dark-950 p-6 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

```

---

## File: `src/components/layout/AdminRoute.jsx`

```javascript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminRoute({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 font-mono">
        <LoadingSpinner message="Verifying security credentials..." />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

```

---

## File: `src/components/layout/Footer.jsx`

```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Heart, Sparkles, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-dark-950/90 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-electric-green flex items-center justify-center text-dark-950 shadow-md shadow-electric-green/20">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black tracking-tight font-display text-white">
                PULSE<span className="text-electric-green">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time biomechanical posture correction powered by computer vision. Elevate your lifts, eliminate injury risks, and achieve your peak physique.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Vision Engine v2.4 Active</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-display">
              Core Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/workout/live" className="hover:text-electric-green transition-colors">
                  Webcam Pose Correction
                </Link>
              </li>
              <li>
                <Link to="/workout-plan" className="hover:text-electric-green transition-colors">
                  Adaptive Weekly Plan
                </Link>
              </li>
              <li>
                <Link to="/nutrition" className="hover:text-electric-green transition-colors">
                  Target Macro & Meal Hub
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-electric-green transition-colors">
                  Biometrics & Progress
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-electric-green transition-colors">
                  24/7 AI Coach Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic / Tech Highlights */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-display">
              Engineering Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                React 18 + Vite 6 Modern SPA
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-green" />
                Tailwind CSS v3 Design System
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Webcam MediaStream API
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Chart.js Visual Analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Protected Role Guard Routing
              </li>
            </ul>
          </div>

          {/* Col 4: Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-display">
              Portals & Administration
            </h4>
            <div className="space-y-3">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono hover:bg-cyan-500/10 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Control Dashboard</span>
              </Link>
              <p className="text-[11px] text-slate-500 leading-normal">
                College Software Engineering Capstone Project. Designed for elite athletic tracking and injury prevention.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PulseAI Biomechanics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Software Engineering
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

```

---

## File: `src/components/layout/Navbar.jsx`

```javascript
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

```

---

## File: `src/components/layout/ProtectedRoute.jsx`

```javascript
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <LoadingSpinner message="Authenticating session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

```

---

## File: `src/components/pose/FormFeedbackHUD.jsx`

```javascript
import React from 'react';
import Badge from '../ui/Badge';
import { Activity, AlertTriangle, CheckCircle2, Flame, Timer, Zap } from 'lucide-react';

export default function FormFeedbackHUD({
  currentReps = 0,
  targetReps = 10,
  currentSet = 1,
  totalSets = 4,
  sessionSeconds = 0,
  formScore = 95,
  feedbackStatus = 'optimal', // 'optimal', 'warning', 'error'
  feedbackMessage = 'Optimal depth achieved! Drive upwards through heels.',
  currentAngle = 88,
  targetAngle = 90
}) {
  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // Circular rep counter progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.min(100, (currentReps / targetReps) * 100);
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between z-30 font-sans">
      {/* Top HUD Row */}
      <div className="flex items-start justify-between gap-4 pointer-events-auto">
        {/* Left: Set & Timer */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-dark-950/90 backdrop-blur-xl border border-slate-700/80 shadow-lg flex items-center gap-2">
            <Timer className="w-4 h-4 text-volt animate-pulse" />
            <span className="font-mono text-sm font-bold text-slate-100">
              {formatTime(sessionSeconds)}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-dark-950/90 backdrop-blur-xl border border-slate-700/80 shadow-lg flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-slate-400">Set</span>
            <span className="font-mono text-sm font-black text-volt">
              {currentSet} <span className="text-slate-500 font-normal">/ {totalSets}</span>
            </span>
          </div>
        </div>

        {/* Right: Real-time Form Accuracy Gauge */}
        <div className="px-4 py-2 rounded-xl bg-dark-950/90 backdrop-blur-xl border border-slate-700/80 shadow-lg flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Form Accuracy
            </span>
            <span className="font-mono text-base font-black text-volt">
              {formScore}%
            </span>
          </div>
          <div className="w-2.5 h-7 rounded-full bg-dark-850 overflow-hidden flex flex-col justify-end p-0.5 border border-slate-700">
            <div
              className="w-full bg-gradient-to-t from-emerald-500 via-volt to-volt-300 rounded-full transition-all duration-300 shadow-[0_0_8px_#00F59B]"
              style={{ height: `${formScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center Feedback Banner */}
      <div className="flex justify-center pointer-events-auto my-auto">
        <div
          className={`max-w-md w-full px-5 py-3 rounded-2xl backdrop-blur-2xl border shadow-2xl transition-all duration-300 transform animate-scaleUp flex items-center gap-3.5 ${
            feedbackStatus === 'optimal'
              ? 'bg-dark-950/90 border-volt/60 shadow-volt/20 text-slate-100'
              : feedbackStatus === 'warning'
              ? 'bg-dark-950/90 border-flame/60 shadow-flame/20 text-amber-100'
              : 'bg-dark-950/90 border-rose-500/60 shadow-rose-500/20 text-rose-200'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
              feedbackStatus === 'optimal'
                ? 'bg-volt/20 text-volt border border-volt/40'
                : feedbackStatus === 'warning'
                ? 'bg-flame/20 text-flame border border-flame/40'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}
          >
            {feedbackStatus === 'optimal' ? (
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                AI Vision Coach
              </span>
              <Badge
                variant={feedbackStatus === 'optimal' ? 'volt' : feedbackStatus === 'warning' ? 'flame' : 'danger'}
                size="sm"
                dot
              >
                {feedbackStatus === 'optimal' ? 'Optimal Form' : 'Correction Needed'}
              </Badge>
            </div>
            <p className="text-xs font-semibold mt-0.5 leading-snug">
              {feedbackMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom HUD Row */}
      <div className="flex items-end justify-between gap-4 pointer-events-auto">
        {/* Left: Joint Angle Readout */}
        <div className="px-4 py-3 rounded-2xl bg-dark-950/90 backdrop-blur-xl border border-slate-700/80 shadow-lg space-y-1">
          <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400">
            <span>Knee Flexion:</span>
            <span className={`font-mono font-bold ${currentAngle <= targetAngle ? 'text-volt font-black' : 'text-flame'}`}>
              {currentAngle}°
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400">
            <span>Parallel Target:</span>
            <span className="font-mono font-bold text-volt">&le; {targetAngle}°</span>
          </div>
        </div>

        {/* Right: Circular Rep Counter Centerpiece */}
        <div className="relative flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(0,245,155,0.3)]">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="rgba(30, 41, 59, 0.8)"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="url(#electricGreenGradient)"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="electricGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CCFF00" />
                <stop offset="50%" stopColor="#00F59B" />
                <stop offset="100%" stopColor="#00F0FF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Rep Count Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Reps
            </span>
            <span className="font-mono text-2xl font-black text-white leading-none">
              {currentReps}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              / {targetReps}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

## File: `src/components/pose/PoseCanvas.jsx`

```javascript
import React, { useEffect, useRef } from 'react';

export default function PoseCanvas({
  isTracking = true,
  exerciseType = 'squats',
  currentPhase = 'down', // 'down', 'up', 'hold'
  progress = 0.5, // 0 to 1
  hasError = false,
  errorMessage = '',
  className = ''
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let t = 0;

    const render = () => {
      t += 0.04;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (!isTracking) return;

      // Center reference
      const cx = width / 2;
      const cy = height * 0.45;

      // Dynamic squat oscillation if tracking is active
      const squatFactor = Math.sin(t) * 0.5 + 0.5; // 0 to 1
      const effectiveFactor = exerciseType === 'squats' ? squatFactor : Math.sin(t * 1.2) * 0.5 + 0.5;

      // Base proportions scaled to canvas
      const scale = Math.min(width, height) / 460;

      // Head and spine
      const headY = cy - 130 * scale + (effectiveFactor * 65 * scale);
      const neckY = headY + 35 * scale;
      const spineY = neckY + 80 * scale;

      // Shoulders
      const leftShoulder = { x: cx - 45 * scale, y: neckY + 10 * scale };
      const rightShoulder = { x: cx + 45 * scale, y: neckY + 10 * scale };

      // Elbows and hands
      const elbowY = neckY + 45 * scale;
      const handY = neckY + 75 * scale;
      const leftElbow = { x: leftShoulder.x - 25 * scale, y: elbowY };
      const rightElbow = { x: rightShoulder.x + 25 * scale, y: elbowY };
      const leftWrist = { x: leftElbow.x + 15 * scale, y: handY };
      const rightWrist = { x: rightElbow.x - 15 * scale, y: handY };

      // Hips
      const hipY = spineY + (effectiveFactor * 75 * scale);
      const leftHip = { x: cx - 35 * scale, y: hipY };
      const rightHip = { x: cx + 35 * scale, y: hipY };

      // Knees (spread wider on squat descent)
      const kneeSpread = hasError ? (30 * scale) : (50 * scale + effectiveFactor * 15 * scale);
      const kneeY = cy + 70 * scale + (effectiveFactor * 25 * scale);
      const leftKnee = { x: cx - kneeSpread, y: kneeY };
      const rightKnee = { x: cx + kneeSpread, y: kneeY };

      // Ankles (anchored on floor)
      const ankleY = cy + 180 * scale;
      const leftAnkle = { x: cx - 45 * scale, y: ankleY };
      const rightAnkle = { x: cx + 45 * scale, y: ankleY };

      // Biomechanical nodes
      const keypoints = [
        { name: 'head', x: cx, y: headY, r: 18 * scale },
        { name: 'neck', x: cx, y: neckY, r: 7 * scale },
        { name: 'l_shoulder', ...leftShoulder, r: 8 * scale },
        { name: 'r_shoulder', ...rightShoulder, r: 8 * scale },
        { name: 'l_elbow', ...leftElbow, r: 7 * scale },
        { name: 'r_elbow', ...rightElbow, r: 7 * scale },
        { name: 'l_wrist', ...leftWrist, r: 6 * scale },
        { name: 'r_wrist', ...rightWrist, r: 6 * scale },
        { name: 'l_hip', ...leftHip, r: 9 * scale },
        { name: 'r_hip', ...rightHip, r: 9 * scale },
        { name: 'l_knee', ...leftKnee, r: 9 * scale, warning: hasError },
        { name: 'r_knee', ...rightKnee, r: 9 * scale, warning: hasError },
        { name: 'l_ankle', ...leftAnkle, r: 7 * scale },
        { name: 'r_ankle', ...rightAnkle, r: 7 * scale },
      ];

      // Bones (Connections)
      const bones = [
        [leftShoulder, rightShoulder],
        [{ x: cx, y: neckY }, { x: cx, y: spineY }],
        [leftShoulder, leftElbow],
        [leftElbow, leftWrist],
        [rightShoulder, rightElbow],
        [rightElbow, rightWrist],
        [{ x: cx, y: spineY }, leftHip],
        [{ x: cx, y: spineY }, rightHip],
        [leftHip, rightHip],
        [leftHip, leftKnee],
        [leftKnee, leftAnkle],
        [rightHip, rightKnee],
        [rightKnee, rightAnkle],
      ];

      // Draw futuristic skeleton glow bones
      bones.forEach(([p1, p2]) => {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineWidth = 4 * scale;
        ctx.strokeStyle = hasError ? 'rgba(255, 107, 0, 0.75)' : 'rgba(0, 245, 155, 0.75)';
        ctx.lineCap = 'round';
        ctx.shadowColor = hasError ? '#FF6B00' : '#00F59B';
        ctx.shadowBlur = 10;
        ctx.stroke();
      });

      // Draw Keypoint Joint Nodes
      keypoints.forEach((kp) => {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, kp.r, 0, Math.PI * 2);
        ctx.fillStyle = kp.warning ? '#FF6B00' : '#00F59B';
        ctx.shadowColor = kp.warning ? '#FF6B00' : '#00F59B';
        ctx.shadowBlur = 15;
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, kp.r * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 0;
        ctx.fill();
      });

      // Draw Knee Angle Indicator HUD
      const calculatedAngle = Math.round(175 - (effectiveFactor * 88));
      ctx.beginPath();
      ctx.arc(leftKnee.x, leftKnee.y, 24 * scale, 0, Math.PI * 0.6);
      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = calculatedAngle <= 95 ? '#00F59B' : '#FF6B00';
      ctx.stroke();

      // Knee Angle text tag
      ctx.font = `bold ${Math.max(10, Math.round(12 * scale))}px "JetBrains Mono", monospace`;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`${calculatedAngle}°`, leftKnee.x - 45 * scale, leftKnee.y + 4 * scale);

      // Depth Target line
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.moveTo(cx - 160 * scale, cy + 85 * scale);
      ctx.lineTo(cx + 160 * scale, cy + 85 * scale);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Target Label
      ctx.font = `600 ${Math.max(9, Math.round(10 * scale))}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = '#00E5FF';
      ctx.fillText('TARGET PARALLEL DEPTH (90°)', cx - 150 * scale, cy + 80 * scale);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTracking, exerciseType, currentPhase, progress, hasError]);

  return (
    <canvas
      ref={canvasRef}
      width={720}
      height={540}
      className={`absolute inset-0 w-full h-full pointer-events-none z-20 ${className}`}
    />
  );
}

```

---

## File: `src/components/ui/Badge.jsx`

```javascript
import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = ''
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-2.5 py-0.5 font-bold',
    md: 'text-xs px-3 py-1 font-bold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  const variantStyles = {
    volt: 'bg-volt/15 text-volt border border-volt/40 shadow-sm shadow-volt/10',
    success: 'bg-volt/15 text-volt border border-volt/40 shadow-sm shadow-volt/10',
    flame: 'bg-flame/15 text-flame border border-flame/40 shadow-sm shadow-flame/10',
    orange: 'bg-flame/15 text-flame border border-flame/40 shadow-sm shadow-flame/10',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/35',
    danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/35',
    cyan: 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 shadow-sm shadow-neon-cyan/10',
    info: 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/40 shadow-sm shadow-neon-cyan/10',
    purple: 'bg-neon-purple/15 text-neon-purple border border-neon-purple/40 shadow-sm shadow-neon-purple/10',
    neutral: 'bg-dark-850 text-slate-300 border border-slate-700/80',
  };

  const dotColors = {
    volt: 'bg-volt shadow-[0_0_8px_#00F59B]',
    success: 'bg-volt shadow-[0_0_8px_#00F59B]',
    flame: 'bg-flame shadow-[0_0_8px_#FF5E00]',
    orange: 'bg-flame shadow-[0_0_8px_#FF5E00]',
    warning: 'bg-amber-400 shadow-[0_0_8px_#FBBF24]',
    danger: 'bg-rose-500 shadow-[0_0_8px_#F43F5E]',
    cyan: 'bg-neon-cyan shadow-[0_0_8px_#00F0FF]',
    info: 'bg-neon-cyan shadow-[0_0_8px_#00F0FF]',
    purple: 'bg-neon-purple shadow-[0_0_8px_#A855F7]',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase tracking-wider font-display ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.neutral} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.neutral} animate-pulse`}
        />
      )}
      {children}
    </span>
  );
}

```

---

## File: `src/components/ui/Button.jsx`

```javascript
import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed select-none overflow-hidden cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
    xl: 'text-lg px-8 py-4 gap-3',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-volt-400 via-volt to-emerald-400 text-dark-950 hover:brightness-110 shadow-lg shadow-volt/25 hover:shadow-volt/50 hover:-translate-y-0.5 font-bold focus:ring-volt',
    energy:
      'bg-gradient-to-r from-flame-400 via-flame-500 to-rose-500 text-white hover:brightness-110 shadow-lg shadow-flame/30 hover:shadow-flame/55 hover:-translate-y-0.5 font-bold focus:ring-flame',
    cyber:
      'bg-gradient-to-r from-neon-cyan via-sky-400 to-blue-500 text-dark-950 hover:brightness-110 shadow-lg shadow-neon-cyan/30 hover:shadow-neon-cyan/55 hover:-translate-y-0.5 font-bold focus:ring-neon-cyan',
    purple:
      'bg-gradient-to-r from-neon-purple to-pink-500 text-white hover:brightness-110 shadow-lg shadow-neon-purple/30 hover:shadow-neon-purple/50 hover:-translate-y-0.5 font-bold focus:ring-neon-purple',
    secondary:
      'bg-dark-850/90 text-slate-100 border border-slate-700/80 hover:bg-dark-800 hover:border-slate-500 hover:text-white focus:ring-slate-500 hover:-translate-y-0.5',
    outline:
      'bg-transparent border border-volt/50 text-volt hover:bg-volt/10 hover:border-volt focus:ring-volt hover:-translate-y-0.5',
    outlineFlame:
      'bg-transparent border border-flame/50 text-flame hover:bg-flame/10 hover:border-flame focus:ring-flame hover:-translate-y-0.5',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/60 focus:ring-slate-600',
    danger:
      'bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30 focus:ring-rose-500',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
      )}
    </button>
  );
}

```

---

## File: `src/components/ui/Card.jsx`

```javascript
import React from 'react';

export default function Card({
  children,
  variant = 'glass',
  interactive = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'rounded-2xl transition-all duration-300 relative';

  const variantStyles = {
    glass:
      'bg-dark-900/85 backdrop-blur-xl border border-slate-800/90 shadow-xl shadow-black/50',
    glassVolt:
      'bg-dark-900/90 backdrop-blur-xl border border-volt/35 shadow-xl shadow-volt/10',
    glassFlame:
      'bg-dark-900/90 backdrop-blur-xl border border-flame/35 shadow-xl shadow-flame/10',
    glassCyan:
      'bg-dark-900/90 backdrop-blur-xl border border-neon-cyan/35 shadow-xl shadow-neon-cyan/10',
    glassPurple:
      'bg-dark-900/90 backdrop-blur-xl border border-neon-purple/35 shadow-xl shadow-neon-purple/10',
    dark:
      'bg-dark-850 border border-slate-800 shadow-lg',
  };

  const interactiveStyles = interactive
    ? 'hover:-translate-y-1.5 hover:border-volt/60 hover:shadow-2xl hover:shadow-volt/15 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.glass} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

```

---

## File: `src/components/ui/EmptyState.jsx`

```javascript
import React from 'react';
import Button from './Button';
import { Dumbbell } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Dumbbell,
  title = 'No records found',
  description = 'There is currently no data to display for this view.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-12 bg-dark-900/40 border border-dashed border-slate-800 rounded-2xl ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-dark-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8 text-electric-green/80" />
      </div>

      <h4 className="text-base font-bold text-slate-200 font-display">
        {title}
      </h4>

      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

```

---

## File: `src/components/ui/Input.jsx`

```javascript
import React from 'react';

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-xl overflow-hidden">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          className={`w-full bg-dark-900/90 border ${
            error
              ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
              : 'border-slate-700/80 focus:ring-electric-green focus:border-electric-green'
          } rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
            Icon ? 'pl-10' : ''
          } ${RightIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />

        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
          >
            <RightIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}

```

---

## File: `src/components/ui/LoadingSpinner.jsx`

```javascript
import React from 'react';

export default function LoadingSpinner({
  size = 'md',
  message = 'Loading biometrics...',
  className = ''
}) {
  const sizeMap = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}>
      <div className="relative">
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-full bg-electric-green/20 blur-xl animate-pulse"></div>

        {/* Outer Ring */}
        <div
          className={`${sizeMap[size] || sizeMap.md} rounded-full border-slate-800 border-t-electric-green border-r-emerald-400 animate-spin`}
        />
      </div>

      {message && (
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

```

---

## File: `src/components/ui/Modal.jsx`

```javascript
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showClose = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-950/85 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      {/* Dialog box */}
      <div
        className={`relative w-full ${maxWidth} bg-dark-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 transition-all transform animate-scaleUp`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
            <div>
              {title && (
                <h3 className="text-lg font-bold text-slate-100 font-display">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

```

---

## File: `src/context/AuthContext.jsx`

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const storedUser = await api.auth.getCurrentUser();
        const storedAdmin = await api.auth.getCurrentAdmin();
        setUser(storedUser);
        setAdmin(storedAdmin);
      } catch (err) {
        console.error('Failed to initialize auth:', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const loggedUser = await api.auth.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const adminLogin = async (email, password) => {
    const loggedAdmin = await api.auth.adminLogin(email, password);
    setAdmin(loggedAdmin);
    return loggedAdmin;
  };

  const signup = async (userData) => {
    const newUser = await api.auth.signup(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const adminLogout = async () => {
    await api.auth.logout();
    setAdmin(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('ai_fitness_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        login,
        adminLogin,
        signup,
        logout,
        adminLogout,
        updateUser,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

```

---

## File: `src/context/NotificationContext.jsx`

```javascript
import React, { createContext, useContext, useState } from 'react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'workout',
    title: 'Workout Reminder: Leg Day in 30 Mins',
    message: 'Your Thursday Squat Mastery & Posterior Chain session is scheduled for today.',
    time: '25m ago',
    unread: true,
    link: '/workout/live'
  },
  {
    id: 'notif-2',
    type: 'milestone',
    title: '🏆 New Milestone Unlocked!',
    message: 'You hit 96% form accuracy on barbell squats yesterday! Keep it up.',
    time: '3h ago',
    unread: true,
    link: '/analytics'
  },
  {
    id: 'notif-3',
    type: 'alert',
    title: 'Missed Cardio Makeup Ready',
    message: 'You missed Wednesday active recovery. Add a quick 20-min brisk walk today.',
    time: '1d ago',
    unread: false,
    link: '/workout-plan'
  },
  {
    id: 'notif-4',
    type: 'nutrition',
    title: 'Macro Check: 50g Protein Remaining',
    message: 'Reach your 185g daily target with tonight’s Wild Salmon & Casein pudding.',
    time: '2d ago',
    unread: false,
    link: '/nutrition'
  }
];

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const addNotification = (notif) => {
    const newEntry = {
      ...notif,
      id: 'notif-' + Date.now(),
      time: 'Just now',
      unread: true
    };
    setNotifications((prev) => [newEntry, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

```

---

## File: `src/data/mockAdminData.js`

```javascript
export const MOCK_ADMIN_USERS = [
  {
    id: 'usr-101',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'user',
    status: 'Active',
    joinedDate: '2025-01-15',
    workoutsCompleted: 3,
    avgAccuracy: 92.5,
    goal: 'Muscle Hypertrophy',
    tier: 'Athlete Free'
  },
  {
    id: 'usr-102',
    name: 'Sarah Chen',
    email: 'sarah.c@fitmail.com',
    role: 'user',
    status: 'Active',
    joinedDate: '2025-02-01',
    workoutsCompleted: 5,
    avgAccuracy: 94.0,
    goal: 'Endurance & Mobility',
    tier: 'Athlete Free'
  },
  {
    id: 'usr-103',
    name: 'Marcus Vance',
    email: 'marcus.v@fitness.io',
    role: 'user',
    status: 'Pending',
    joinedDate: '2025-02-20',
    workoutsCompleted: 0,
    avgAccuracy: null,
    goal: 'Fat Loss',
    tier: 'Athlete Free'
  }
];

export const MOCK_ADMIN_ANALYTICS = {
  activeAthletes: 3,
  platformVersion: 'v1.2.0-preview',
  databaseEngine: 'Client-Side Storage (LocalStorage / IndexedDB)',
  hardwareDiagnostics: [
    { component: 'Webcam Stream Engine', status: 'Operational', detail: 'HTML5 MediaDevices / getUserMedia API' },
    { component: 'Joint Skeleton Renderer', status: 'Operational', detail: 'HTML5 60 FPS Canvas Vector Pipeline' },
    { component: 'Voice & Sound Cues', status: 'Operational', detail: 'Web Audio API Synthesis Engine' },
    { component: 'Data Persistence Layer', status: 'Operational', detail: 'Local browser storage with REST endpoint proxy' }
  ],
  movementCatalogStats: [
    { category: 'Legs', exerciseCount: 2, keyMovements: 'Barbell Deep Squat, Walking Lunges' },
    { category: 'Chest & Arms', exerciseCount: 2, keyMovements: 'Push-Ups, Dumbbell Bicep Curls' },
    { category: 'Back & Core', exerciseCount: 2, keyMovements: 'Romanian Deadlifts, Isometric Plank' }
  ]
};

export const MOCK_ACTIVITY_LOGS = [
  {
    id: 'act-1',
    type: 'SESSION_INITIALIZED',
    title: 'Trainer Console Accessed',
    detail: 'Administrative dashboard initialized in browser session',
    time: 'Just now',
    severity: 'info'
  },
  {
    id: 'act-2',
    type: 'CONTENT_UPDATE',
    title: 'Movement Thresholds Calibrated',
    detail: 'Squat depth angle threshold confirmed at 85° flexion',
    time: '12 mins ago',
    severity: 'success'
  },
  {
    id: 'act-3',
    type: 'USER_REGISTERED',
    title: 'New Athlete Profile Slot Initialized',
    detail: 'Target goal set to Muscle Hypertrophy & Posture',
    time: '1 hour ago',
    severity: 'info'
  }
];

```

---

## File: `src/data/mockNutrition.js`

```javascript
export const DEFAULT_NUTRITION_TARGETS = {
  calories: 2200,
  proteinGrams: 160,
  carbsGrams: 220,
  fatGrams: 65,
  waterLiters: 2.5,
  targetGlasses: 10,
};

// Clean unlogged meal slots ready to be filled by the user
export const INITIAL_MEAL_SLOTS = [
  {
    id: 'slot-breakfast',
    category: 'Breakfast',
    slotTime: '08:00 AM',
    name: 'Breakfast Slot',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    prepTime: '--',
    completed: false,
    isSlotOpen: true,
    imageNote: 'Slot available: Log whole eggs, oatmeal, fruit, or protein shake',
    instructions: 'Tap "Log Meal" to add your morning fuel.'
  },
  {
    id: 'slot-lunch',
    category: 'Lunch',
    slotTime: '01:00 PM',
    name: 'Lunch Slot',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    prepTime: '--',
    completed: false,
    isSlotOpen: true,
    imageNote: 'Slot available: Log lean poultry, grains, greens, and healthy fats',
    instructions: 'Tap "Log Meal" to record your midday meal.'
  },
  {
    id: 'slot-snack',
    category: 'Afternoon Fuel',
    slotTime: '04:30 PM',
    name: 'Afternoon Snack Slot',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    prepTime: '--',
    completed: false,
    isSlotOpen: true,
    imageNote: 'Slot available: Greek yogurt, raw almonds, protein bar, or fruit',
    instructions: 'Tap "Log Meal" to add pre-workout fuel.'
  },
  {
    id: 'slot-dinner',
    category: 'Dinner',
    slotTime: '08:00 PM',
    name: 'Dinner Slot',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    prepTime: '--',
    completed: false,
    isSlotOpen: true,
    imageNote: 'Slot available: Fish, lean beef, roasted vegetables, and complex carbs',
    instructions: 'Tap "Log Meal" to record your evening dinner.'
  }
];

// Sample template that users can optionally load
export const SAMPLE_MEAL_PLAN = [
  {
    id: 'sample-1',
    category: 'Breakfast',
    slotTime: '08:00 AM',
    name: 'Power Oats with Whey & Blueberries',
    calories: 480,
    protein: 38,
    carbs: 58,
    fat: 10,
    prepTime: '10 mins',
    completed: true,
    isSlotOpen: false,
    imageNote: 'Rolled oats, 1 scoop whey protein isolate, fresh blueberries, chia seeds',
    instructions: 'Cook oats with water or almond milk. Stir in whey off heat, top with fresh berries.'
  },
  {
    id: 'sample-2',
    category: 'Lunch',
    slotTime: '01:00 PM',
    name: 'Grilled Chicken & Quinoa Bowl',
    calories: 620,
    protein: 52,
    carbs: 55,
    fat: 16,
    prepTime: '20 mins',
    completed: true,
    isSlotOpen: false,
    imageNote: '180g grilled chicken breast, fluffy tricolor quinoa, steamed broccoli, olive oil drizzle',
    instructions: 'Season chicken breast with paprika and black pepper. Serve over cooked quinoa and broccoli.'
  },
  {
    id: 'sample-3',
    category: 'Afternoon Fuel',
    slotTime: '04:30 PM',
    name: 'Greek Yogurt & Raw Almonds',
    calories: 280,
    protein: 24,
    carbs: 18,
    fat: 12,
    prepTime: '3 mins',
    completed: true,
    isSlotOpen: false,
    imageNote: 'Non-fat strained Greek yogurt, 15g raw almonds, dash of cinnamon',
    instructions: 'Stir Greek yogurt with cinnamon and top with raw almonds.'
  },
  {
    id: 'sample-4',
    category: 'Dinner',
    slotTime: '08:00 PM',
    name: 'Pan-Seared Salmon & Roasted Sweet Potato',
    calories: 580,
    protein: 44,
    carbs: 45,
    fat: 22,
    prepTime: '25 mins',
    completed: false,
    isSlotOpen: false,
    imageNote: '170g wild salmon fillet, baked sweet potato wedges, sautéed spinach with garlic',
    instructions: 'Pan sear salmon for 4 minutes per side. Bake sweet potato wedges at 200°C until tender.'
  }
];

export const MOCK_NUTRITION_PROFILE = {
  dailyTargets: DEFAULT_NUTRITION_TARGETS,
  currentConsumed: {
    calories: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    fatGrams: 0,
    waterGlasses: 0,
    targetGlasses: 10,
  },
  dietPreference: 'High Protein',
  activeDietOptions: ['High Protein', 'Balanced', 'Keto', 'Plant-Based / Vegan', 'Paleo'],
  meals: INITIAL_MEAL_SLOTS,
};

```

---

## File: `src/data/mockWorkouts.js`

```javascript
export const MOCK_EXERCISES = [
  {
    id: 'ex-1',
    name: 'Barbell Deep Squats',
    category: 'Legs',
    difficulty: 'Intermediate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Core', 'Hamstrings'],
    defaultSets: 4,
    defaultReps: 10,
    restSeconds: 90,
    equipment: 'Barbell / Bodyweight',
    caloriesPerRep: 0.8,
    formCues: [
      'Keep feet shoulder-width apart, toes flared slightly outwards (15-30°)',
      'Break at the hips and knees simultaneously; aim for hip crease below knee cap',
      'Maintain an upright chest and neutral spine throughout the descent',
      'Drive through mid-foot and squeeze glutes at the lockout'
    ],
    commonMistakes: [
      'Knees caving inwards (valgus collapse)',
      'Excessive forward torso lean / rounding lumbar spine',
      'Heels lifting off the ground'
    ],
    idealAngles: {
      hipDepthDeg: 85, // below 90 is parallel/deep
      backAngleMinDeg: 45
    }
  },
  {
    id: 'ex-2',
    name: 'Chest Push-Ups',
    category: 'Chest',
    difficulty: 'Beginner',
    targetMuscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoid', 'Core'],
    defaultSets: 3,
    defaultReps: 15,
    restSeconds: 60,
    equipment: 'Bodyweight',
    caloriesPerRep: 0.5,
    formCues: [
      'Place hands slightly wider than shoulder-width, fingers spread',
      'Keep rigid plank position with glutes and core braced',
      'Lower until chest is 2 inches above the floor (elbows at 45-60° angle)',
      'Push the ground away without shrugging shoulders toward ears'
    ],
    commonMistakes: [
      'Sagging hips or hyperextended lumbar spine',
      'Flaring elbows out at 90 degrees',
      'Head dropping down before chest descends'
    ],
    idealAngles: {
      elbowDepthDeg: 90,
      spineAlignment: 'Straight'
    }
  },
  {
    id: 'ex-3',
    name: 'Romanian Deadlifts',
    category: 'Back & Hamstrings',
    difficulty: 'Intermediate',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae', 'Lats'],
    defaultSets: 4,
    defaultReps: 8,
    restSeconds: 120,
    equipment: 'Dumbbells / Barbell',
    caloriesPerRep: 1.1,
    formCues: [
      'Hinge backward at hips with slight soft bend in the knees',
      'Keep weights close to shins and engage lats to keep back locked flat',
      'Lower until feeling deep hamstring stretch around mid-shin level',
      'Drive hips forward to return to standing lockout'
    ],
    commonMistakes: [
      'Rounding upper or lower back',
      'Squatting the weight rather than hinging hips backwards',
      'Over-extending spine at top lockout'
    ],
    idealAngles: {
      hipHingeDeg: 70
    }
  },
  {
    id: 'ex-4',
    name: 'Dumbbell Bicep Curls',
    category: 'Arms',
    difficulty: 'Beginner',
    targetMuscles: ['Biceps Brachii', 'Brachialis', 'Forearms'],
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 45,
    equipment: 'Dumbbells',
    caloriesPerRep: 0.4,
    formCues: [
      'Stand upright with shoulders pinned back and down',
      'Pin elbows firmly at sides without swinging momentum',
      'Curl dumbbells toward anterior delts with full squeeze at peak contraction',
      'Lower under controlled 3-second eccentric tempo'
    ],
    commonMistakes: [
      'Swinging torso to launch weights',
      'Elbows drifting forward during the curl',
      'Dropping weights too fast without eccentric tension'
    ],
    idealAngles: {
      curlFlexionDeg: 45
    }
  },
  {
    id: 'ex-5',
    name: 'Forward Walking Lunges',
    category: 'Legs',
    difficulty: 'Intermediate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Calves', 'Core Balance'],
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 60,
    equipment: 'Bodyweight / Dumbbells',
    caloriesPerRep: 0.7,
    formCues: [
      'Take a large controlled stride forward',
      'Lower back knee until hovering 1 inch from ground (90° on both knees)',
      'Keep front knee tracked directly over second toe',
      'Press through front heel to step through cleanly'
    ],
    commonMistakes: [
      'Front knee drifting excessively past toes',
      'Torso collapsing forward onto front thigh',
      'Narrow stance causing balance loss'
    ],
    idealAngles: {
      frontKneeDeg: 90,
      backKneeDeg: 90
    }
  },
  {
    id: 'ex-6',
    name: 'Isometric Core Plank',
    category: 'Core',
    difficulty: 'Beginner',
    targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Shoulders'],
    defaultSets: 3,
    defaultReps: 45, // seconds
    restSeconds: 45,
    equipment: 'Bodyweight',
    caloriesPerRep: 0.2, // per sec
    formCues: [
      'Elbows directly under shoulders, forearms parallel',
      'Create straight line from crown of head through heels',
      'Tuck pelvis slightly (posterior tilt) and squeeze quads and glutes',
      'Breathe steadily into diaphragm without holding breath'
    ],
    commonMistakes: [
      'Hips sagging down or piking high toward ceiling',
      'Arching neck to look up at the screen',
      'Holding breath'
    ],
    idealAngles: {
      bodyLineDeg: 180
    }
  }
];

export const MOCK_WEEKLY_SCHEDULE = [
  {
    day: 'Monday',
    title: 'Lower Body Power & Squat Mastery',
    duration: '45 mins',
    intensity: 'High',
    focus: 'Legs & Core',
    completed: false,
    exercises: [
      { exerciseId: 'ex-1', sets: 4, reps: 10, completedSets: 0, note: 'Focus on hitting parallel depth and keeping chest tall' },
      { exerciseId: 'ex-5', sets: 3, reps: 12, completedSets: 0, note: 'Watch balance during descent, drive through mid-foot' },
      { exerciseId: 'ex-6', sets: 3, reps: 45, completedSets: 0, note: 'Brace core with posterior pelvic tilt' },
    ]
  },
  {
    day: 'Tuesday',
    title: 'Upper Body Hypertrophy & Posture',
    duration: '50 mins',
    intensity: 'Medium',
    focus: 'Chest, Arms & Back',
    completed: false,
    exercises: [
      { exerciseId: 'ex-2', sets: 3, reps: 15, completedSets: 0, note: 'Maintain full depth 90° elbow bend, no hip sag' },
      { exerciseId: 'ex-4', sets: 3, reps: 12, completedSets: 0, note: 'Strict tempo, 3s eccentric with zero torso swing' },
      { exerciseId: 'ex-6', sets: 3, reps: 45, completedSets: 0, note: 'Maintain full tension throughout' },
    ]
  },
  {
    day: 'Wednesday',
    title: 'Active Recovery & Mobility Flow',
    duration: '30 mins',
    intensity: 'Low',
    focus: 'Joint Mobility & Stretching',
    completed: false,
    isRest: true,
    exercises: []
  },
  {
    day: 'Thursday',
    title: 'Posterior Chain & Core Stability',
    duration: '45 mins',
    intensity: 'High',
    focus: 'Hamstrings & Back',
    completed: false,
    isToday: true,
    exercises: [
      { exerciseId: 'ex-3', sets: 4, reps: 8, completedSets: 0, note: 'Primary focus: neutral spine and hip hinge' },
      { exerciseId: 'ex-1', sets: 3, reps: 10, completedSets: 0, note: 'Moderate load, focus on depth cues' },
      { exerciseId: 'ex-6', sets: 4, reps: 45, completedSets: 0, note: 'Hold solid tension throughout' },
    ]
  },
  {
    day: 'Friday',
    title: 'Full Body Athletic Conditioning',
    duration: '40 mins',
    intensity: 'High',
    focus: 'Total Body',
    completed: false,
    exercises: [
      { exerciseId: 'ex-2', sets: 4, reps: 12, completedSets: 0, note: 'Fast concentric, slow eccentric' },
      { exerciseId: 'ex-5', sets: 3, reps: 12, completedSets: 0, note: 'Keep chest upright' },
      { exerciseId: 'ex-4', sets: 3, reps: 10, completedSets: 0, note: 'Peak contraction 1s pause' },
    ]
  },
  {
    day: 'Saturday',
    title: 'Functional Endurance & Core Circuit',
    duration: '35 mins',
    intensity: 'Medium',
    focus: 'Cardio & Abs',
    completed: false,
    exercises: [
      { exerciseId: 'ex-1', sets: 3, reps: 15, completedSets: 0, note: 'Bodyweight rapid reps' },
      { exerciseId: 'ex-2', sets: 3, reps: 15, completedSets: 0, note: 'Chest floor taps' },
      { exerciseId: 'ex-6', sets: 3, reps: 60, completedSets: 0, note: 'Extended endurance plank' },
    ]
  },
  {
    day: 'Sunday',
    title: 'Rest & Strategic Nutrition Reload',
    duration: '0 mins',
    intensity: 'Rest',
    focus: 'Recovery & Protein Intake',
    completed: false,
    isRest: true,
    exercises: []
  }
];

```

---

## File: `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-dark-950 text-slate-100 min-h-screen font-sans antialiased selection:bg-volt selection:text-dark-950;
    background-image: 
      radial-gradient(at 10% 10%, rgba(0, 245, 155, 0.08) 0px, transparent 55%),
      radial-gradient(at 90% 15%, rgba(255, 94, 0, 0.07) 0px, transparent 55%),
      radial-gradient(at 50% 85%, rgba(0, 240, 255, 0.06) 0px, transparent 60%),
      radial-gradient(at 80% 80%, rgba(168, 85, 247, 0.05) 0px, transparent 50%);
    background-attachment: fixed;
  }
}

/* Custom vibrant scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #070A14;
}

::-webkit-scrollbar-thumb {
  background: #1C2B4D;
  border-radius: 9999px;
  border: 2px solid #070A14;
}

::-webkit-scrollbar-thumb:hover {
  background: #00F59B;
}

/* Glassmorphism Classes */
.glass-panel {
  background: rgba(16, 24, 46, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-volt {
  background: rgba(16, 24, 46, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 245, 155, 0.3);
  box-shadow: 0 0 35px -8px rgba(0, 245, 155, 0.22);
}

.glass-flame {
  background: rgba(16, 24, 46, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 94, 0, 0.3);
  box-shadow: 0 0 35px -8px rgba(255, 94, 0, 0.22);
}

.glass-cyan {
  background: rgba(16, 24, 46, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 35px -8px rgba(0, 240, 255, 0.22);
}

.glass-purple {
  background: rgba(16, 24, 46, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(168, 85, 247, 0.3);
  box-shadow: 0 0 35px -8px rgba(168, 85, 247, 0.22);
}

/* Radiant Text Gradients */
.text-gradient-volt {
  background: linear-gradient(135deg, #CCFF00 0%, #00F59B 60%, #00F0FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-flame {
  background: linear-gradient(135deg, #FF9E00 0%, #FF5E00 55%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-cyan {
  background: linear-gradient(135deg, #00F0FF 0%, #38BDF8 60%, #818CF8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-purple {
  background: linear-gradient(135deg, #C084FC 0%, #A855F7 60%, #F43F5E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Background animated mesh and particles */
.bg-mesh-glow {
  background-size: 40px 40px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
}

/* Shimmer Light Sweep on active elements */
.shimmer-active {
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 3s infinite linear;
}

/* Animated sound wave bars */
@keyframes soundWave {
  0%, 100% { height: 4px; }
  50% { height: 18px; }
}

.sound-bar-1 { animation: soundWave 0.8s ease-in-out infinite 0.1s; }
.sound-bar-2 { animation: soundWave 0.6s ease-in-out infinite 0.25s; }
.sound-bar-3 { animation: soundWave 0.9s ease-in-out infinite 0.05s; }
.sound-bar-4 { animation: soundWave 0.7s ease-in-out infinite 0.35s; }

```

---

## File: `src/main.jsx`

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

---

## File: `src/pages/admin/AdminActivityLogsPage.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  ScrollText,
  AlertTriangle,
  CheckCircle2,
  Info,
  Ban,
  Filter,
  RefreshCw
} from 'lucide-react';

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getActivityLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (filterSeverity === 'all') return true;
    return log.severity === filterSeverity;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono">
        <LoadingSpinner message="Streaming telemetry audit trail..." />
      </div>
    );
  }

  const getSeverityIcon = (sev) => {
    switch (sev) {
      case 'danger':
        return <Ban className="w-4 h-4 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="neutral" size="sm">
            PLATFORM AUDIT
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Activity & Event Log
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time event trail of workout completions, movement updates, and profile actions.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs overflow-x-auto pb-1">
        {['all', 'warning', 'success', 'danger', 'info'].map((sev) => (
          <button
            key={sev}
            type="button"
            onClick={() => setFilterSeverity(sev)}
            className={`px-3 py-1.5 rounded-lg border capitalize transition-all ${
              filterSeverity === sev
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold'
                : 'bg-dark-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Audit Log Stream */}
      <Card variant="dark" className="p-0 overflow-hidden border-slate-800 divide-y divide-slate-800/70">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="p-5 flex items-start gap-4 hover:bg-slate-800/30 transition-colors"
          >
            <div className="p-2 rounded-xl bg-dark-900 border border-slate-800 mt-0.5 flex-shrink-0">
              {getSeverityIcon(log.severity)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-slate-200">
                  {log.title}
                </h4>
                <span className="font-mono text-[11px] text-slate-500">
                  {log.time}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {log.detail}
              </p>
              <span className="inline-block mt-2 font-mono text-[10px] text-slate-500 bg-dark-900 px-2 py-0.5 rounded border border-slate-800">
                EVENT ID: {log.id} • TYPE: {log.type}
              </span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

```

---

## File: `src/pages/admin/AdminContentPage.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  Dumbbell,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminContentPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Legs / Lower Body',
    difficulty: 'Intermediate',
    equipment: 'Barbell & Squat Rack',
    defaultSets: 4,
    defaultReps: 10,
    restSeconds: 90,
    formCues: 'Drive through heels, maintain neutral spine',
    commonMistakes: 'Knee valgus collapse'
  });

  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true);
        const data = await api.workouts.getExercises();
        setExercises(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadExercises();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        difficulty: formData.difficulty,
        equipment: formData.equipment,
        defaultSets: Number(formData.defaultSets),
        defaultReps: Number(formData.defaultReps),
        restSeconds: Number(formData.restSeconds),
        formCues: typeof formData.formCues === 'string' ? formData.formCues.split(',').map((s) => s.trim()) : formData.formCues,
        commonMistakes: typeof formData.commonMistakes === 'string' ? formData.commonMistakes.split(',').map((s) => s.trim()) : formData.commonMistakes,
        targetMuscles: ['Quadriceps', 'Glutes', 'Core']
      };

      if (editingExercise) {
        const updated = await api.admin.updateExercise(editingExercise.id, payload);
        setExercises((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const created = await api.admin.addExercise(payload);
        setExercises((prev) => [created, ...prev]);
      }

      setShowAddModal(false);
      setEditingExercise(null);
      setFormData({
        name: '',
        category: 'Legs / Lower Body',
        difficulty: 'Intermediate',
        equipment: 'Barbell & Squat Rack',
        defaultSets: 4,
        defaultReps: 10,
        restSeconds: 90,
        formCues: 'Drive through heels, maintain neutral spine',
        commonMistakes: 'Knee valgus collapse'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exercise from system library?')) return;
    try {
      const remaining = await api.admin.deleteExercise(id);
      setExercises([...remaining]);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (ex) => {
    setEditingExercise(ex);
    setFormData({
      name: ex.name,
      category: ex.category,
      difficulty: ex.difficulty,
      equipment: ex.equipment,
      defaultSets: ex.defaultSets,
      defaultReps: ex.defaultReps,
      restSeconds: ex.restSeconds,
      formCues: Array.isArray(ex.formCues) ? ex.formCues.join(', ') : ex.formCues,
      commonMistakes: Array.isArray(ex.commonMistakes) ? ex.commonMistakes.join(', ') : ex.commonMistakes
    });
    setShowAddModal(true);
  };

  const filteredExercises = exercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono">
        <LoadingSpinner message="Accessing biomechanical repository..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="neutral" size="sm">
            EXERCISE DATABASE
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Movement Catalog Slots
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage kinematic angle thresholds, sets, reps, and form correction cues.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setEditingExercise(null);
            setShowAddModal(true);
          }}
        >
          Add Movement Slot
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter movements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-dark-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Exercises Table */}
      <Card variant="dark" className="p-0 overflow-hidden border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="px-5 py-4">Exercise Name</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Difficulty</th>
                <th className="px-5 py-4">Prescribed Volume</th>
                <th className="px-5 py-4">Equipment</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredExercises.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-200">
                    {ex.name}
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {ex.category}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="success" size="sm">
                      {ex.difficulty}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-300">
                    {ex.defaultSets} sets &bull; {ex.defaultReps} reps
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {ex.equipment}
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(ex)}
                      className="p-1.5 rounded-lg bg-dark-800 text-slate-300 hover:text-cyan-400 hover:bg-dark-750 transition-colors"
                      title="Edit Exercise"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ex.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                      title="Delete Exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Exercise Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingExercise ? 'Edit Exercise Movement' : 'Register New Exercise Movement'}
        subtitle="Define biomechanical criteria and training volume defaults."
      >
        <form onSubmit={handleCreateOrUpdate} className="space-y-4 text-xs font-sans">
          <Input
            label="Movement Title"
            placeholder="e.g. Bulgarian Split Squat"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Movement Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="Legs / Lower Body">Legs / Lower Body</option>
                <option value="Chest / Upper Body">Chest / Upper Body</option>
                <option value="Posterior Chain / Back">Posterior Chain / Back</option>
                <option value="Core / Stabilization">Core / Stabilization</option>
                <option value="Arms / Shoulders">Arms / Shoulders</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full bg-dark-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Sets"
              type="number"
              value={formData.defaultSets}
              onChange={(e) => setFormData({ ...formData, defaultSets: e.target.value })}
            />
            <Input
              label="Reps"
              type="number"
              value={formData.defaultReps}
              onChange={(e) => setFormData({ ...formData, defaultReps: e.target.value })}
            />
            <Input
              label="Rest (Secs)"
              type="number"
              value={formData.restSeconds}
              onChange={(e) => setFormData({ ...formData, restSeconds: e.target.value })}
            />
          </div>

          <Input
            label="Equipment Requirements"
            placeholder="e.g. Dumbbells or Kettlebells"
            value={formData.equipment}
            onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
          />

          <Input
            label="Biomechanical Form Cues (Comma separated)"
            placeholder="e.g. Flare knees out, Keep chin tucked, Squeeze glutes at top"
            value={formData.formCues}
            onChange={(e) => setFormData({ ...formData, formCues: e.target.value })}
          />

          <div className="flex gap-3 pt-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="cyber"
              className="flex-1"
            >
              {editingExercise ? 'Save Updates' : 'Publish Movement'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

```

---

## File: `src/pages/admin/AdminOverviewPage.jsx`

```javascript
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

```

---

## File: `src/pages/admin/AdminUsersPage.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  Users,
  Search,
  Filter,
  Shield,
  CheckCircle2,
  Ban,
  Eye,
  Activity,
  Plus
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  // Add Athlete Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAthlete, setNewAthlete] = useState({ name: '', email: '', goal: 'Muscle Hypertrophy & Posture' });
  const [addingAthlete, setAddingAthlete] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await api.admin.getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      const updated = await api.admin.toggleUserStatus(userId);
      setUsers([...updated]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAthleteSubmit = async (e) => {
    e.preventDefault();
    if (!newAthlete.name.trim() || !newAthlete.email.trim()) return;

    try {
      setAddingAthlete(true);
      const created = await api.admin.addAthleteSlot(newAthlete);
      setUsers([created, ...users]);
      setShowAddModal(false);
      setNewAthlete({ name: '', email: '', goal: 'Muscle Hypertrophy & Posture' });
    } catch (err) {
      console.error(err);
    } finally {
      setAddingAthlete(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <LoadingSpinner message="Retrieving athlete roster..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="neutral" size="sm">
            ATHLETE ROSTER
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
            Athlete Management & Status
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage registered members, active training slots, and account standings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
          >
            Add Athlete Slot
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          {['All', 'Active', 'Suspended', 'Pending'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                statusFilter === status
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-bold'
                  : 'bg-dark-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card variant="glass" className="p-0 overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900 border-b border-slate-800 text-slate-400 text-[11px] uppercase">
              <tr>
                <th className="px-5 py-4">Athlete</th>
                <th className="px-5 py-4">Fitness Focus</th>
                <th className="px-5 py-4">Workouts</th>
                <th className="px-5 py-4">Avg Accuracy</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-200">{user.name}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {user.goal}
                  </td>
                  <td className="px-5 py-4 text-slate-300 font-mono">
                    {user.workoutsCompleted} sessions
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-emerald-400">
                    {user.avgAccuracy ? `${user.avgAccuracy}%` : '-- %'}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'neutral' : 'danger'}
                      size="sm"
                      dot
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      title="View Profile Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(user.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        user.status === 'Active'
                          ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                      title={user.status === 'Active' ? 'Suspend Access' : 'Reactivate User'}
                    >
                      {user.status === 'Active' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Detail Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={selectedUser.name}
          description={`Athlete ID: ${selectedUser.id} • Registered: ${selectedUser.joinedDate}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Workouts</span>
                <span className="font-mono text-base font-bold text-white">
                  {selectedUser.workoutsCompleted}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Form Accuracy</span>
                <span className="font-mono text-base font-bold text-emerald-400">
                  {selectedUser.avgAccuracy ? `${selectedUser.avgAccuracy}%` : '--'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className={`font-bold ${selectedUser.status === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-800 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Training Goal</span>
              <p className="text-slate-300">{selectedUser.goal}</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Athlete Slot Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Athlete Slot"
        description="Create a new athlete record in the local coaching directory."
      >
        <form onSubmit={handleAddAthleteSubmit} className="space-y-4">
          <Input
            label="Athlete Full Name"
            placeholder="e.g. Jordan Miller"
            value={newAthlete.name}
            onChange={(e) => setNewAthlete({ ...newAthlete, name: e.target.value })}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. jordan.m@example.com"
            value={newAthlete.email}
            onChange={(e) => setNewAthlete({ ...newAthlete, email: e.target.value })}
            required
          />
          <Input
            label="Training Focus Goal"
            placeholder="e.g. Muscle Hypertrophy & Posture"
            value={newAthlete.goal}
            onChange={(e) => setNewAthlete({ ...newAthlete, goal: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={addingAthlete}>
              Create Athlete Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

```

---

## File: `src/pages/AnalyticsPage.jsx`

```javascript
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

```

---

## File: `src/pages/auth/AdminLoginPage.jsx`

```javascript
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

```

---

## File: `src/pages/auth/LoginPage.jsx`

```javascript
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

```

---

## File: `src/pages/auth/SignupPage.jsx`

```javascript
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

```

---

## File: `src/pages/ChatAssistantPage.jsx`

```javascript
import React, { useState, useRef, useEffect } from 'react';
import { askAICoach } from '../services/aiService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  Volume2,
  VolumeX,
  HelpCircle,
  Flame,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

const SUGGESTED_PROMPT_CHIPS = [
  'How do I fix knee collapse during squats?',
  'What are high-protein post-workout snacks?',
  'How should I position my elbows in pushups?',
  'Optimal recovery time between leg workouts?',
  'How do I hinge properly during deadlifts?'
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: `Hello! I am your AI Biomechanics & Sports Science Coach.

I analyze your webcam posture angles, optimize your weekly volume progression, and calibrate macro targets.

What training or nutrition question would you like to master today?`,
    timestamp: 'Just now'
  }
];

export default function ChatAssistantPage({ isDrawer = false, onClose }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isThinking) return;

    const userMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const aiResponse = await askAICoach(query);
      const aiMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMessage]);

      if (speechEnabled && 'speechSynthesis' in window) {
        const plainText = aiResponse.replace(/[*_#]/g, '');
        const utter = new SpeechSynthesisUtterance(plainText);
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-' + Date.now(),
        sender: 'ai',
        text: 'Chat history cleared. How can I help you elevate your lifts today?',
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div
      className={`${
        isDrawer ? 'h-full flex flex-col' : 'max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-electric-green flex items-center justify-center text-dark-950 shadow-md shadow-electric-green/20">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-display">
                AI Fitness Coach Assistant
              </h2>
              <Badge variant="success" size="sm" dot>
                Online
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400">
              Sports Biomechanics & Macro Synthesis Model
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              speechEnabled
                ? 'bg-electric-green/10 border-electric-green text-electric-green'
                : 'bg-dark-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={speechEnabled ? 'Mute AI voice' : 'Enable voice narration'}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={clearChat}
            className="p-2 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-display">
          Suggested Biomechanical Queries
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SUGGESTED_PROMPT_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 rounded-xl bg-dark-900/90 border border-slate-800 hover:border-electric-green/50 text-slate-300 hover:text-white text-xs whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-electric-green" />
              <span>{chip}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Message Stream Area */}
      <Card
        variant="glass"
        className={`flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 ${
          isDrawer ? 'max-h-[calc(100vh-280px)]' : 'min-h-[440px] max-h-[580px]'
        }`}
      >
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-electric-green/20 text-electric-green border border-electric-green/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                  isAI
                    ? 'bg-dark-850/90 border border-slate-800 text-slate-200'
                    : 'bg-gradient-to-r from-emerald-600 to-electric-green text-dark-950 font-medium shadow-md shadow-electric-green/10'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <span
                  className={`block text-[9px] pt-1 text-right ${
                    isAI ? 'text-slate-500' : 'text-dark-900/70'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-300 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-electric-green/20 text-electric-green border border-electric-green/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-dark-850 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-electric-green animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-electric-green animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-electric-green animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] font-mono">Analyzing biomechanical kinematics...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          placeholder="Ask about squat depth, pushup elbow angles, post-workout protein..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={isThinking}
          className="flex-1 bg-dark-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-green focus:border-electric-green transition-all"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={Send}
          disabled={!inputQuery.trim() || isThinking}
        >
          Send
        </Button>
      </form>
    </div>
  );
}

```

---

## File: `src/pages/DashboardPage.jsx`

```javascript
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

```

---

## File: `src/pages/LandingPage.jsx`

```javascript
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import {
  Camera,
  Activity,
  Dumbbell,
  Utensils,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  Play,
  ArrowRight,
  Target,
  Shield,
  Eye,
  Sliders,
  Lock,
  Cpu,
  Flame
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const workflowSteps = [
    {
      step: '01',
      title: 'Position Your Camera',
      desc: 'Set your webcam or phone 6–8 feet away at waist height with your full body clearly visible in the frame.',
      icon: Camera,
      accent: 'border-volt/40 text-volt bg-volt/10'
    },
    {
      step: '02',
      title: 'Real-Time Joint Tracking',
      desc: 'Our in-browser engine tracks 17 skeletal landmarks at 60 FPS without sending any video data to external servers.',
      icon: Eye,
      accent: 'border-neon-cyan/40 text-neon-cyan bg-neon-cyan/10'
    },
    {
      step: '03',
      title: 'Biomechanical Angle Cues',
      desc: 'Receive immediate visual indicators and audio prompts when knee valgus or spinal curvature is detected.',
      icon: Activity,
      accent: 'border-flame/40 text-flame bg-flame/10'
    },
    {
      step: '04',
      title: 'Log Genuine Session Data',
      desc: 'Completed reps, session duration, and form accuracy scores automatically sync to your personal dashboard and history.',
      icon: CheckCircle2,
      accent: 'border-neon-purple/40 text-neon-purple bg-neon-purple/10'
    }
  ];

  const features = [
    {
      icon: Camera,
      title: 'Webcam Form Correction',
      desc: 'Monitors knee flexion, hip hinge depth, and spine alignment in real time with high-contrast glowing skeleton overlays.',
      badge: 'Vision AI',
      badgeVariant: 'volt',
      glow: 'hover:border-volt/60 hover:shadow-glow-volt'
    },
    {
      icon: Dumbbell,
      title: 'Structured Workout Splits',
      desc: 'Follow a clean 7-day training schedule with configurable exercise slots, set/rep targets, and rest timers.',
      badge: 'Periodization',
      badgeVariant: 'flame',
      glow: 'hover:border-flame/60 hover:shadow-glow-flame'
    },
    {
      icon: Utensils,
      title: 'Nutrition & Macro Hub',
      desc: 'Track daily protein, carbs, fats, and water intake with clean unlogged meal slots ready to be filled.',
      badge: 'Fuel Engine',
      badgeVariant: 'cyan',
      glow: 'hover:border-neon-cyan/60 hover:shadow-glow-cyan'
    },
    {
      icon: Sparkles,
      title: 'Sports Science AI Coach',
      desc: 'Ask questions regarding movement cues, progressive overload, recovery protocols, and post-workout nutrition.',
      badge: '24/7 AI Coach',
      badgeVariant: 'purple',
      glow: 'hover:border-neon-purple/60 hover:shadow-glow-purple'
    }
  ];

  return (
    <div className="space-y-28 py-10 overflow-hidden relative">
      {/* Dynamic Ambient Background Glow Orbs */}
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-volt/10 rounded-full blur-[140px] pointer-events-none animate-float-slow -z-10" />
      <div className="absolute top-48 right-10 w-[450px] h-[450px] bg-flame/10 rounded-full blur-[140px] pointer-events-none animate-float-reverse -z-10" />
      <div className="absolute top-[800px] left-10 w-[550px] h-[550px] bg-neon-cyan/8 rounded-full blur-[160px] pointer-events-none animate-float-slow -z-10" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 text-center">
        {/* Floating live status pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-dark-900/90 border border-volt/40 shadow-lg shadow-volt/15 text-xs font-bold text-slate-200 mb-8 animate-bounce-subtle">
          <span className="w-2.5 h-2.5 rounded-full bg-volt shadow-[0_0_10px_#00F59B] animate-ping" />
          <span className="text-volt font-black tracking-wider uppercase">IN-BROWSER VISION AI</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">100% Private Client-Side Telemetry</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Train Harder. Perfect Your Form.{' '}
          <span className="text-gradient-volt block mt-3">
            Real-Time Webcam Vision Coach.
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Transform your webcam into an intelligent biomechanics coach. Detect joint angles, count reps automatically, and receive instant cues to lift with championship technique.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            icon={Play}
            onClick={() => navigate('/workout/live')}
            className="shadow-xl shadow-volt/25 text-dark-950 font-black"
          >
            Launch Live Workout
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate('/signup')}
          >
            Get Started Free
          </Button>
          <Button
            variant="ghost"
            size="lg"
            icon={Shield}
            onClick={() => navigate('/admin/login')}
            className="text-slate-400 hover:text-white"
          >
            Staff & Trainer Portal
          </Button>
        </div>

        {/* Interactive Biomechanical Pose Teaser Card */}
        <div className="mt-16 max-w-4xl mx-auto rounded-3xl bg-dark-900/90 border border-slate-700/80 p-4 sm:p-7 shadow-2xl shadow-black/80 relative backdrop-blur-2xl">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-volt shadow-[0_0_10px_#00F59B] animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider">Live Pose Telemetry Preview</span>
              <Badge variant="volt" size="sm">
                60 FPS
              </Badge>
            </div>
            <div className="hidden sm:flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span className="text-volt">Joints: 17/17</span>
              <span>•</span>
              <span className="text-neon-cyan">Inference: &lt;16ms</span>
            </div>
          </div>

          {/* Canvas Viewport Simulation */}
          <div className="relative aspect-video rounded-2xl bg-dark-950 overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Mesh grid backdrop */}
            <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Glowing Skeletal Overlay */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 360">
              {/* Laser skeleton bones */}
              <line x1="300" y1="75" x2="300" y2="165" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="300" y1="95" x2="245" y2="135" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="245" y1="135" x2="225" y2="175" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="300" y1="95" x2="355" y2="135" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="355" y1="135" x2="375" y2="175" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="300" y1="165" x2="255" y2="235" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="255" y1="235" x2="250" y2="305" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="300" y1="165" x2="345" y2="235" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
              <line x1="345" y1="235" x2="350" y2="305" stroke="#00F59B" strokeWidth="4" strokeLinecap="round" opacity="0.9" />

              {/* Parallel Depth Target Line */}
              <line x1="180" y1="235" x2="420" y2="235" stroke="#FF5E00" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />

              {/* Glowing Joint Nodes */}
              {[
                [300, 65], [300, 95], [245, 135], [225, 175], [355, 135], [375, 175],
                [300, 165], [255, 235], [250, 305], [345, 235], [350, 305]
              ].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="6" fill="#00F59B" stroke="#050811" strokeWidth="2" />
                  <circle cx={cx} cy={cy} r="10" fill="none" stroke="#00F59B" strokeWidth="1" opacity="0.5" className="animate-pulse" />
                </g>
              ))}
            </svg>

            {/* Top Left Angle Readout Pill */}
            <div className="absolute top-4 left-4 bg-dark-900/90 border border-volt/50 rounded-xl p-3 text-left space-y-1 backdrop-blur-xl shadow-lg shadow-volt/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Knee Flexion Angle</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-3xl font-black text-volt">86°</span>
                <span className="text-[10px] font-bold text-emerald-400">✓ OPTIMAL</span>
              </div>
              <span className="text-[10px] text-slate-300 block">Below 90° parallel depth achieved</span>
            </div>

            {/* Bottom Right Feedback Pill */}
            <div className="absolute bottom-4 right-4 bg-dark-900/90 border border-slate-700/80 rounded-xl p-3 text-right space-y-1 backdrop-blur-xl shadow-lg">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Real-Time Correction</span>
              <span className="text-xs font-bold text-white block">Keep chest upright • Flare knees outward</span>
              <span className="text-[10px] text-volt font-semibold block">Form Accuracy: 96%</span>
            </div>

            {/* Interactive Center Button */}
            <div className="relative z-10 text-center">
              <Button
                variant="primary"
                size="md"
                icon={Play}
                onClick={() => navigate('/workout/live')}
                className="shadow-2xl shadow-volt/40"
              >
                Launch Live Camera Session
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Interactive Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="volt" size="sm">
            WORKFLOW
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            How Vision Pose Tracking Works
          </h2>
          <p className="text-sm text-slate-400">
            No expensive smart watches or motion capture suits. Everything runs directly through standard HTML5 web APIs in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((stepItem, idx) => {
            const StepIcon = stepItem.icon;
            return (
              <Card
                key={idx}
                variant="glass"
                interactive
                className="p-6 relative space-y-4 hover:border-volt/50 hover:shadow-glow-volt transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${stepItem.accent} shadow-md`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-sm font-black text-slate-500">
                    {stepItem.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white font-display">
                  {stepItem.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {stepItem.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Core Capabilities Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="flame" size="sm">
            PLATFORM MODULES
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
            Engineered for Strength & Longevity
          </h2>
          <p className="text-sm text-slate-400">
            A comprehensive training suite designed to eliminate guesswork, prevent injuries, and accelerate muscle growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                variant="glass"
                interactive
                className={`p-6 flex flex-col justify-between border border-slate-800 ${feat.glow} transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-dark-850 border border-slate-700 flex items-center justify-center text-white shadow-md">
                      <Icon className="w-5 h-5 text-volt" />
                    </div>
                    <Badge variant={feat.badgeVariant} size="sm">
                      {feat.badge}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-white font-display mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs font-bold text-volt">
                  <span>Explore module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-b from-dark-900 via-dark-850 to-dark-950 border border-volt/40 p-10 sm:p-14 relative overflow-hidden shadow-2xl shadow-volt/10">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-volt/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-flame/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <Badge variant="volt" size="sm">
              START YOUR FIRST SESSION
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white max-w-xl mx-auto leading-tight">
              Ready to Perfect Your Technique?
            </h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Open your camera, track your joint angles in real time, and start recording your genuine consistency streak.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                onClick={() => navigate('/workout/live')}
              >
                Start Live Workout
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/onboarding')}
              >
                Set Up Fitness Profile
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

```

---

## File: `src/pages/LiveWorkoutPage.jsx`

```javascript
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import PoseCanvas from '../components/pose/PoseCanvas';
import FormFeedbackHUD from '../components/pose/FormFeedbackHUD';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { MOCK_EXERCISES } from '../data/mockWorkouts';
import { api } from '../services/api';
import {
  Camera,
  CameraOff,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  ChevronDown,
  AlertCircle,
  Dumbbell,
  Flame,
  Award,
  Video
} from 'lucide-react';

export default function LiveWorkoutPage() {
  const navigate = useNavigate();

  // Selected exercise
  const [selectedExerciseId, setSelectedExerciseId] = useState('ex-1');
  const selectedExercise =
    MOCK_EXERCISES.find((ex) => ex.id === selectedExerciseId) || MOCK_EXERCISES[0];

  // Session state
  const [isActive, setIsActive] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [currentReps, setCurrentReps] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const totalSets = selectedExercise.defaultSets || 4;
  const targetReps = selectedExercise.defaultReps || 10;
  const [formScore, setFormScore] = useState(94);

  // Dynamic feedback state
  const [feedbackStatus, setFeedbackStatus] = useState('optimal'); // 'optimal', 'warning', 'error'
  const [feedbackMessage, setFeedbackMessage] = useState(
    'Optimal depth reached. Keep chest tall through lockout!'
  );
  const [hasPostureError, setHasPostureError] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(88);

  // Camera & Mode State
  const [cameraMode, setCameraMode] = useState('simulation'); // 'webcam' or 'simulation'
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Completion modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Simulated rep & form alternation loop in simulation mode
  useEffect(() => {
    if (!isActive) return;

    const repInterval = setInterval(() => {
      setCurrentReps((prev) => {
        const next = prev + 1;
        if (next > targetReps) {
          return 1;
        }

        // Periodically alternate between good form and a dynamic posture correction cue
        if (next % 3 === 0) {
          setFeedbackStatus('warning');
          setFeedbackMessage('⚠️ Knees caving inwards! Flare knees out over 2nd toe.');
          setHasPostureError(true);
          setFormScore((s) => Math.max(85, s - 3));
          setCurrentAngle(96);
          if (audioEnabled && 'speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance('Check knees, push outward');
            utter.rate = 1.1;
            window.speechSynthesis.speak(utter);
          }
        } else {
          setFeedbackStatus('optimal');
          setFeedbackMessage('🟢 Perfect hip crease depth! Explosive drive up.');
          setHasPostureError(false);
          setFormScore((s) => Math.min(99, s + 1));
          setCurrentAngle(86);
        }

        return next;
      });
    }, 4200);

    return () => clearInterval(repInterval);
  }, [isActive, targetReps, audioEnabled]);

  // Request actual camera stream if user switches to webcam mode
  const startWebcam = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraPermissionGranted(true);
        setCameraMode('webcam');
      } else {
        throw new Error('Webcam API is not supported on this device/browser.');
      }
    } catch (err) {
      console.warn('Camera request error:', err);
      setCameraError(
        'Camera permission was denied or no camera device found. Switched to Vision Simulation Feed.'
      );
      setCameraMode('simulation');
    }
  };

  const stopWebcam = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraPermissionGranted(false);
    setCameraMode('simulation');
  };

  // Trigger workout completion
  const handleFinishWorkout = () => {
    setIsActive(false);
    const totalReps = Math.max(1, currentReps + (currentSet - 1) * targetReps);
    const duration = Math.max(15, sessionSeconds);
    const calories = Math.max(5, Math.round(totalReps * (selectedExercise.caloriesPerRep || 0.8)));

    const summary = {
      exerciseName: selectedExercise.name,
      reps: totalReps,
      repsCompleted: totalReps,
      sets: currentSet,
      setsCompleted: currentSet,
      totalDurationSeconds: duration,
      accuracy: formScore,
      avgFormScore: formScore,
      calories: calories,
      caloriesEstimated: calories
    };
    setSessionSummary(summary);
    setShowCompletionModal(true);

    // Save session to local database
    api.workouts.recordCompletedSession(summary);

    // Blast celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00F59B', '#FF6B00', '#00E5FF', '#FFFFFF']
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Format seconds to string
  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header / Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-electric-green animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-electric-green">
              AI Vision Engine Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Live Biomechanical Posture Correction
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Exercise Selector */}
          <div className="relative">
            <select
              value={selectedExerciseId}
              onChange={(e) => {
                setSelectedExerciseId(e.target.value);
                setCurrentReps(0);
              }}
              className="bg-dark-900 border border-slate-700 text-slate-100 text-xs font-semibold rounded-xl pl-3.5 pr-8 py-2.5 appearance-none focus:outline-none focus:border-electric-green"
            >
              {MOCK_EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.category})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Webcam vs Simulation Mode Toggle */}
          {cameraMode === 'simulation' ? (
            <Button
              variant="outline"
              size="sm"
              icon={Camera}
              onClick={startWebcam}
            >
              Enable Live Webcam
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              icon={CameraOff}
              onClick={stopWebcam}
            >
              Use Simulation Feed
            </Button>
          )}

          {/* Audio voice cues toggle with dancing equalizer bars */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-dark-900 border border-slate-700/80">
            <button
              type="button"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-1 rounded-lg transition-colors ${
                audioEnabled
                  ? 'text-volt hover:bg-volt/10'
                  : 'text-slate-500 hover:bg-slate-800'
              }`}
              title={audioEnabled ? 'Audio cues active' : 'Audio cues muted'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {audioEnabled && (
              <div className="flex items-end gap-0.5 h-4 pr-1">
                <span className="w-1 bg-volt rounded-full sound-bar-1" />
                <span className="w-1 bg-volt-400 rounded-full sound-bar-2" />
                <span className="w-1 bg-neon-cyan rounded-full sound-bar-3" />
                <span className="w-1 bg-volt rounded-full sound-bar-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {cameraError && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <span>{cameraError}</span>
          <button
            onClick={() => setCameraError(null)}
            className="text-amber-400 hover:text-white font-bold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Centerpiece Viewport Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Video Feed HUD Centerpiece */}
        <div className="lg:col-span-3">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-dark-950 rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl shadow-black/80 hud-corner group">
            {/* Background Stream: Either Real Webcam OR Simulated Athlete Video Backdrop */}
            {cameraMode === 'webcam' && cameraPermissionGranted ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              /* Simulated Athlete Workout Canvas Backdrop */
              <div className="relative w-full h-full bg-gradient-to-b from-dark-900 via-dark-950 to-[#04060A] flex items-center justify-center overflow-hidden">
                {/* Tech Grid Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />

                {/* Subdued ambient glow */}
                <div className="absolute w-96 h-96 rounded-full bg-electric-green/5 blur-3xl" />

                {/* Simulation indicator badge */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-dark-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 z-10">
                  <Video className="w-3 h-3 text-cyan-400" />
                  <span>SIMULATED BIOMECHANICS FEED (Webcam optional)</span>
                </div>
              </div>
            )}

            {/* Futuristic Skeleton Overlay Canvas */}
            <PoseCanvas
              isTracking={isActive}
              exerciseType={selectedExercise.category.toLowerCase().includes('chest') ? 'pushups' : 'squats'}
              hasError={hasPostureError}
              errorMessage={feedbackMessage}
            />

            {/* High-Tech HUD Layer with Reps, Timers, Angle metrics */}
            <FormFeedbackHUD
              currentReps={currentReps}
              targetReps={targetReps}
              currentSet={currentSet}
              totalSets={totalSets}
              sessionSeconds={sessionSeconds}
              formScore={formScore}
              feedbackStatus={feedbackStatus}
              feedbackMessage={feedbackMessage}
              currentAngle={currentAngle}
              targetAngle={selectedExercise.idealAngles?.hipDepthDeg || 90}
            />
          </div>

          {/* Centerpiece Control Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-dark-900/90 border border-slate-800">
            <div className="flex items-center gap-2">
              <Button
                variant={isActive ? 'secondary' : 'primary'}
                size="sm"
                icon={isActive ? Pause : Play}
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? 'Pause Session' : 'Resume Tracking'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={RotateCcw}
                onClick={() => {
                  setCurrentReps(0);
                  setSessionSeconds(0);
                  setFormScore(95);
                }}
              >
                Reset Reps
              </Button>
            </div>

            {/* Quick interactive testing helpers for demonstration */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 hidden sm:inline">Simulate Cue:</span>
              <button
                type="button"
                onClick={() => {
                  setFeedbackStatus('warning');
                  setFeedbackMessage('⚠️ Lower your hips 2 inches to reach parallel!');
                  setHasPostureError(true);
                  setCurrentAngle(98);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold hover:bg-amber-500/20"
              >
                Trigger Warning
              </button>
              <button
                type="button"
                onClick={() => {
                  setFeedbackStatus('optimal');
                  setFeedbackMessage('🟢 Good form: Chest up, full depth locked.');
                  setHasPostureError(false);
                  setCurrentAngle(85);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/20"
              >
                Trigger Optimal
              </button>
              <button
                type="button"
                onClick={() => setCurrentReps((r) => r + 1)}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold hover:bg-cyan-500/20"
              >
                +1 Rep
              </button>
            </div>

            <Button
              variant="energy"
              size="sm"
              icon={CheckCircle}
              onClick={handleFinishWorkout}
            >
              Finish Workout
            </Button>
          </div>
        </div>

        {/* Right 1 col: Exercise Blueprint & Real-Time Cues */}
        <div className="space-y-4">
          {/* Active Exercise Profile Card */}
          <Card variant="glass" className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="success" size="sm">
                  {selectedExercise.difficulty}
                </Badge>
                <h3 className="text-base font-bold text-white font-display mt-2">
                  {selectedExercise.name}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-electric-green/10 border border-electric-green/30 flex items-center justify-center text-electric-green">
                <Dumbbell className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
              <div className="p-2.5 rounded-xl bg-dark-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Equipment</span>
                <span className="font-semibold text-slate-200 truncate block">
                  {selectedExercise.equipment}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-dark-800/60">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Rest Period</span>
                <span className="font-semibold text-slate-200">
                  {selectedExercise.restSeconds}s
                </span>
              </div>
            </div>

            {/* Target Muscles */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Target Muscles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedExercise.targetMuscles.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-2 py-0.5 rounded-md bg-dark-800 text-slate-300 text-[11px] border border-slate-700/60"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Form Cues Checklist */}
          <Card variant="glass" className="p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5 font-display">
              <Sparkles className="w-4 h-4 text-electric-green" />
              <span>Biomechanical Checklist</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedExercise.formCues.map((cue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-electric-green flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{cue}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Common Mistakes Warning Card */}
          <Card variant="glass" className="p-5 space-y-3 border-amber-500/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Critical Faults to Avoid</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {selectedExercise.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 text-xs font-bold mt-0.5">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Workout Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Workout Session Complete!"
        subtitle="Outstanding effort! Your biomechanical data has been compiled."
      >
        {sessionSummary && (
          <div className="space-y-6">
            <div className="text-center py-4 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20">
              <div className="w-14 h-14 rounded-2xl bg-electric-green/20 text-electric-green flex items-center justify-center mx-auto mb-3 shadow-lg shadow-electric-green/20">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-white font-display">
                {sessionSummary.exerciseName}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Completed with {sessionSummary.avgFormScore}% Form Accuracy
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Reps</span>
                <span className="font-mono text-xl font-black text-white">
                  {sessionSummary.repsCompleted}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sets Finished</span>
                <span className="font-mono text-xl font-black text-white">
                  {sessionSummary.setsCompleted}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                <span className="font-mono text-xl font-black text-electric-green">
                  {formatDuration(sessionSummary.totalDurationSeconds)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-dark-800 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Burn</span>
                <span className="font-mono text-xl font-black text-electric-orange">
                  {sessionSummary.caloriesEstimated} kcal
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-850 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Session Telemetry Saved
              </span>
              <p className="text-slate-400 leading-relaxed">
                Your reps, form accuracy, and active duration have been logged to your dashboard. Your performance analytics and streak have updated.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowCompletionModal(false);
                  navigate('/workout-plan');
                }}
              >
                View Weekly Plan
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setShowCompletionModal(false);
                  navigate('/dashboard');
                }}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

```

---

## File: `src/pages/NutritionPage.jsx`

```javascript
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
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  BookOpen,
  Filter,
  Sliders,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export default function NutritionPage() {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    async function loadNutrition() {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    loadNutrition();
  }, []);

  const handleWaterDelta = async (delta) => {
    if (!nutrition) return;
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
  };

  const handleDietChange = async (diet) => {
    setActiveDiet(diet);
    await api.nutrition.updateDietPreference(diet);
  };

  const handleOpenSlotLog = (slot) => {
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadSampleTemplate = async () => {
    try {
      setLoading(true);
      const updated = await api.nutrition.loadSamplePlan();
      setNutrition(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSlots = async () => {
    try {
      setLoading(true);
      const reset = await api.nutrition.resetMealSlots();
      setNutrition(reset);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTargets = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
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

```

---

## File: `src/pages/OnboardingPage.jsx`

```javascript
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

```

---

## File: `src/pages/WorkoutPlanPage.jsx`

```javascript
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
                onClick={() => navigate('/workout/live')}
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
              <Button variant="primary" size="sm" onClick={() => navigate('/workout/live')}>
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

```

---

## File: `src/services/aiService.js`

```javascript
// Simulated AI Fitness Assistant knowledge base and response generator

const AI_KNOWLEDGE_BASE = [
  {
    triggers: ['squat', 'knee', 'valgus', 'depth', 'hips'],
    response: `When executing squats, knee cave (valgus collapse) usually stems from weak gluteus medius or tight ankle dorsiflexion.

Here are 3 corrective cues:
1. **Spread the floor**: Imagine tearing a piece of paper beneath your feet outward.
2. **Cue knees tracking over 2nd & 3rd toes**: Never let them buckle past the big toe.
3. **Ankle mobility prep**: Do 2 sets of banded ankle mobilizations before loading weight.

Aim to achieve parallel depth where the hip crease is aligned with the top of your knee joint!`
  },
  {
    triggers: ['protein', 'snack', 'post-workout', 'meal', 'shake'],
    response: `For optimal muscle protein synthesis post-workout:
- **Target**: 25–40g of rapid-digesting protein paired with 30–50g of complex carbs.
- **Top Snack Ideas**:
  1. Greek yogurt (0% fat) with blueberries and a drizzle of organic raw honey (32g protein).
  2. Whey isolate shake blended with 1 banana and 1 tbsp almond butter (35g protein).
  3. 3 hard-boiled eggs + 2 slices of sprouted Ezekiel toast with hummus (26g protein).

Eat within 45 to 90 minutes post-training to replenish glycogen and accelerate muscle repair!`
  },
  {
    triggers: ['rest', 'recovery', 'split', 'frequency', 'soreness', 'doms'],
    response: `Rest and strategic recovery are where muscle hypertrophy actually occurs!
- **Rule of Thumb**: Give high-intensity muscle groups (e.g. Legs or Chest) **48 to 72 hours** of recovery before hitting them hard again.
- **Active Recovery**: On rest days, do 20–30 minutes of low-intensity walking (Zone 2) or yoga/foam rolling to flush metabolic byproducts.
- **Sleep Requirement**: Aim for 7.5 to 9 hours of restorative sleep; growth hormone peaks during deep NREM sleep cycles.`
  },
  {
    triggers: ['pushup', 'elbow', 'chest', 'flaring'],
    response: `For shoulder-safe and chest-dominant pushups:
- **Elbow Angle**: Tuck your elbows to approximately **45° to 60°** from your torso (arrow shape, never a 'T' shape).
- **Core Tightness**: Squeeze your glutes and pull your belly button to your spine to avoid lumbar hyperextension.
- **Scapular Motion**: Let your shoulder blades retract together on the way down, then actively protract (push through) at the top lockout!`
  },
  {
    triggers: ['deadlift', 'back', 'spine', 'hinge'],
    response: `Deadlifts are a pure posterior hinge, not a squat!
1. **Engage Lats**: Think of squeezing oranges in your armpits to protect the thoracic spine.
2. **Bar Path**: Keep the barbell scraping your shins throughout the pull.
3. **Hip Hinge**: Push your hips backward into the wall behind you rather than dropping your hips low like a squat.`
  }
];

export async function askAICoach(userQuestion) {
  // Simulate network latency for intelligent thinking
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lower = userQuestion.toLowerCase();
  for (const item of AI_KNOWLEDGE_BASE) {
    if (item.triggers.some((trigger) => lower.includes(trigger))) {
      return item.response;
    }
  }

  // Fallback dynamic coaching answer
  return `Great question! Based on biomechanical principles:

1. **Prioritize Control**: Always maintain a 2-second eccentric (lowering) phase to maximize time under tension and reduce connective tissue strain.
2. **Breathing Mechanics**: Inhale on the eccentric phase to brace your intra-abdominal cavity; exhale forcefully on the concentric push/pull.
3. **Consistency**: Stick to your weekly progression scheme. Micro-loading by 2.5% each week yields sustainable results without risking injury.

Feel free to ask me to analyze specific exercise form cues, macro splits, or pre-workout timing!`;
}

```

---

## File: `src/services/api.js`

```javascript
import { MOCK_EXERCISES, MOCK_WEEKLY_SCHEDULE } from '../data/mockWorkouts';
import { MOCK_NUTRITION_PROFILE, INITIAL_MEAL_SLOTS, SAMPLE_MEAL_PLAN, DEFAULT_NUTRITION_TARGETS } from '../data/mockNutrition';
import { MOCK_ADMIN_USERS, MOCK_ADMIN_ANALYTICS, MOCK_ACTIVITY_LOGS } from '../data/mockAdminData';

// Simulated latency helper to mimic real network requests
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// LocalStorage helpers for realistic client persistence
const getStorage = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
};

export const api = {
  // -------------------------------------------------------------
  // AUTHENTICATION ENDPOINTS
  // -------------------------------------------------------------
  auth: {
    async login(email, password) {
      await delay(350);
      if (!email || !password) {
        throw new Error('Please provide both email and password.');
      }
      const existingUser = getStorage('ai_fitness_user', null);
      const history = getStorage('ai_fitness_workout_history', []);
      const totalWorkouts = history.length;
      const totalReps = history.reduce((sum, h) => sum + (Number(h.reps) || 0), 0);
      const avgAcc = totalWorkouts > 0 
        ? Math.round(history.reduce((sum, h) => sum + (Number(h.accuracy) || 0), 0) / totalWorkouts) 
        : null;

      const user = existingUser || {
        id: 'usr-101',
        name: 'Alex Rivera',
        email: email.toLowerCase(),
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        streak: totalWorkouts > 0 ? 1 : 0,
        totalWorkouts: totalWorkouts,
        totalReps: totalReps,
        formAccuracyAvg: avgAcc,
        isNewUser: totalWorkouts === 0
      };
      setStorage('ai_fitness_user', user);
      return user;
    },

    async adminLogin(email, password) {
      await delay(350);
      if (!email || !password) {
        throw new Error('Staff credentials required.');
      }
      if (!email.toLowerCase().includes('admin')) {
        throw new Error('Access denied: Unauthorized staff email address.');
      }
      const admin = {
        id: 'adm-001',
        name: 'Platform Operations Admin',
        email: email.toLowerCase(),
        role: 'admin',
        accessLevel: 'Lead Trainer & Platform Ops',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      };
      setStorage('ai_fitness_admin', admin);
      return admin;
    },

    async signup(userData) {
      await delay(400);
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required.');
      }
      const newUser = {
        id: 'usr-' + Date.now(),
        name: userData.name || 'Athlete',
        email: userData.email.toLowerCase(),
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        streak: 0,
        totalWorkouts: 0,
        totalReps: 0,
        formAccuracyAvg: null,
        isNewUser: true
      };
      setStorage('ai_fitness_user', newUser);
      return newUser;
    },

    async getCurrentUser() {
      await delay(80);
      return getStorage('ai_fitness_user', null);
    },

    async getCurrentAdmin() {
      await delay(80);
      return getStorage('ai_fitness_admin', null);
    },

    async logout() {
      await delay(100);
      localStorage.removeItem('ai_fitness_user');
      localStorage.removeItem('ai_fitness_admin');
      return true;
    }
  },

  // -------------------------------------------------------------
  // ONBOARDING & HEALTH PROFILE
  // -------------------------------------------------------------
  onboarding: {
    async saveHealthProfile(profile) {
      await delay(400);
      setStorage('ai_fitness_health_profile', profile);
      const user = getStorage('ai_fitness_user', {});
      if (user) {
        user.isNewUser = false;
        user.healthProfile = profile;
        setStorage('ai_fitness_user', user);
      }
      return profile;
    },

    async getHealthProfile() {
      await delay(100);
      return getStorage('ai_fitness_health_profile', {
        age: 25,
        gender: 'Male',
        heightCm: 178,
        weightKg: 75,
        fitnessLevel: 'Beginner',
        goal: 'Hypertrophy & Posture Correction',
        workoutFrequency: 4,
        equipment: 'Dumbbells & Bodyweight',
        injuries: 'None',
      });
    }
  },

  // -------------------------------------------------------------
  // WORKOUT PLANS & EXERCISES
  // -------------------------------------------------------------
  workouts: {
    async getWeeklySchedule() {
      await delay(200);
      return getStorage('ai_fitness_weekly_schedule', MOCK_WEEKLY_SCHEDULE);
    },

    async getExercises() {
      await delay(200);
      return getStorage('ai_fitness_exercises', MOCK_EXERCISES);
    },

    async getExerciseById(id) {
      await delay(100);
      const exercises = getStorage('ai_fitness_exercises', MOCK_EXERCISES);
      return exercises.find((ex) => ex.id === id) || exercises[0];
    },

    async recordCompletedSession(sessionResult) {
      await delay(300);
      const history = getStorage('ai_fitness_workout_history', []);
      const entry = {
        ...sessionResult,
        id: 'sess-' + Date.now(),
        date: new Date().toISOString()
      };
      history.unshift(entry);
      setStorage('ai_fitness_workout_history', history);

      // Update user streak & totals
      const user = getStorage('ai_fitness_user', null);
      if (user) {
        user.totalWorkouts = (user.totalWorkouts || 0) + 1;
        user.streak = (user.streak || 0) + 1;
        user.totalReps = (user.totalReps || 0) + (Number(sessionResult.reps) || 0);
        user.formAccuracyAvg = Math.round(
          history.reduce((sum, h) => sum + (Number(h.accuracy) || 0), 0) / history.length
        );
        setStorage('ai_fitness_user', user);
      }

      // Mark today's schedule slot as completed if matching
      const schedule = getStorage('ai_fitness_weekly_schedule', MOCK_WEEKLY_SCHEDULE);
      const currentDayName = new Date().toLocaleDateString(undefined, { weekday: 'long' });
      const daySlot = schedule.find((d) => d.day.toLowerCase() === currentDayName.toLowerCase());
      if (daySlot) {
        daySlot.completed = true;
        setStorage('ai_fitness_weekly_schedule', schedule);
      }

      // Also log activity to admin audit
      const logs = getStorage('ai_fitness_activity_logs', MOCK_ACTIVITY_LOGS);
      logs.unshift({
        id: 'act-' + Date.now(),
        type: 'WORKOUT_COMPLETED',
        title: `${sessionResult.exerciseName || 'Workout'} session completed`,
        detail: `${sessionResult.reps || 0} reps tracked with ${sessionResult.accuracy || 0}% form accuracy score`,
        time: 'Just now',
        severity: 'success'
      });
      setStorage('ai_fitness_activity_logs', logs);

      return entry;
    },

    async addExerciseSlotToDay(dayName, exerciseData) {
      await delay(250);
      const schedule = getStorage('ai_fitness_weekly_schedule', MOCK_WEEKLY_SCHEDULE);
      const dayObj = schedule.find((d) => d.day.toLowerCase() === dayName.toLowerCase());
      if (dayObj) {
        dayObj.exercises.push({
          exerciseId: exerciseData.exerciseId || 'ex-1',
          sets: exerciseData.sets || 3,
          reps: exerciseData.reps || 10,
          completedSets: 0,
          note: exerciseData.note || 'User-added custom exercise slot',
          isCustom: true
        });
        setStorage('ai_fitness_weekly_schedule', schedule);
      }
      return schedule;
    },

    async regeneratePlan(preferences) {
      await delay(500);
      const updated = MOCK_WEEKLY_SCHEDULE.map((day) => ({
        ...day,
        duration: preferences.duration || day.duration,
        focus: preferences.focus || day.focus,
        completed: false
      }));
      setStorage('ai_fitness_weekly_schedule', updated);
      return updated;
    }
  },

  // -------------------------------------------------------------
  // NUTRITION & MEAL TRACKING
  // -------------------------------------------------------------
  nutrition: {
    async getProfile() {
      await delay(200);
      return getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
    },

    async updateWater(newGlassCount) {
      await delay(100);
      const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
      current.currentConsumed.waterGlasses = Math.max(0, newGlassCount);
      setStorage('ai_fitness_nutrition', current);
      return current.currentConsumed.waterGlasses;
    },

    async fillMealSlot(slotId, mealData) {
      await delay(250);
      const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
      const targetSlot = current.meals.find((m) => m.id === slotId);
      if (targetSlot) {
        targetSlot.name = mealData.name || targetSlot.category;
        targetSlot.calories = Number(mealData.calories) || 0;
        targetSlot.protein = Number(mealData.protein) || 0;
        targetSlot.carbs = Number(mealData.carbs) || 0;
        targetSlot.fat = Number(mealData.fat) || 0;
        targetSlot.prepTime = mealData.prepTime || '10 mins';
        targetSlot.completed = true;
        targetSlot.isSlotOpen = false;
        targetSlot.instructions = mealData.instructions || 'Custom logged meal.';
        targetSlot.imageNote = mealData.imageNote || 'Logged by user.';
      } else {
        // Append as custom meal
        current.meals.push({
          id: 'meal-' + Date.now(),
          category: mealData.category || 'Custom Meal',
          slotTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          name: mealData.name,
          calories: Number(mealData.calories) || 0,
          protein: Number(mealData.protein) || 0,
          carbs: Number(mealData.carbs) || 0,
          fat: Number(mealData.fat) || 0,
          prepTime: '5 mins',
          completed: true,
          isSlotOpen: false,
          instructions: 'Custom logged meal.'
        });
      }

      // Recalculate totals
      current.currentConsumed.calories = current.meals.reduce((sum, m) => sum + (m.completed ? m.calories : 0), 0);
      current.currentConsumed.proteinGrams = current.meals.reduce((sum, m) => sum + (m.completed ? m.protein : 0), 0);
      current.currentConsumed.carbsGrams = current.meals.reduce((sum, m) => sum + (m.completed ? m.carbs : 0), 0);
      current.currentConsumed.fatGrams = current.meals.reduce((sum, m) => sum + (m.completed ? m.fat : 0), 0);

      setStorage('ai_fitness_nutrition', current);
      return current;
    },

    async loadSamplePlan() {
      await delay(300);
      const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
      current.meals = JSON.parse(JSON.stringify(SAMPLE_MEAL_PLAN));
      current.currentConsumed = {
        calories: current.meals.reduce((sum, m) => sum + m.calories, 0),
        proteinGrams: current.meals.reduce((sum, m) => sum + m.protein, 0),
        carbsGrams: current.meals.reduce((sum, m) => sum + m.carbs, 0),
        fatGrams: current.meals.reduce((sum, m) => sum + m.fat, 0),
        waterGlasses: 4,
        targetGlasses: 10
      };
      setStorage('ai_fitness_nutrition', current);
      return current;
    },

    async resetMealSlots() {
      await delay(200);
      const resetProfile = {
        dailyTargets: DEFAULT_NUTRITION_TARGETS,
        currentConsumed: {
          calories: 0,
          proteinGrams: 0,
          carbsGrams: 0,
          fatGrams: 0,
          waterGlasses: 0,
          targetGlasses: 10,
        },
        dietPreference: 'High Protein',
        activeDietOptions: ['High Protein', 'Balanced', 'Keto', 'Plant-Based / Vegan', 'Paleo'],
        meals: JSON.parse(JSON.stringify(INITIAL_MEAL_SLOTS)),
      };
      setStorage('ai_fitness_nutrition', resetProfile);
      return resetProfile;
    },

    async updateDailyTargets(newTargets) {
      await delay(200);
      const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
      current.dailyTargets = { ...current.dailyTargets, ...newTargets };
      setStorage('ai_fitness_nutrition', current);
      return current.dailyTargets;
    },

    async updateDietPreference(diet) {
      await delay(150);
      const current = getStorage('ai_fitness_nutrition', MOCK_NUTRITION_PROFILE);
      current.dietPreference = diet;
      setStorage('ai_fitness_nutrition', current);
      return diet;
    }
  },

  // -------------------------------------------------------------
  // PROGRESS & ANALYTICS
  // -------------------------------------------------------------
  analytics: {
    async getUserAnalytics() {
      await delay(250);
      const history = getStorage('ai_fitness_workout_history', []);
      const totalWorkouts = history.length;
      const totalRepsLogged = history.reduce((sum, h) => sum + (Number(h.reps) || 0), 0);
      const averageAccuracy = totalWorkouts > 0 
        ? Math.round(history.reduce((sum, h) => sum + (Number(h.accuracy) || 0), 0) / totalWorkouts) 
        : null;
      const caloriesBurnedWeek = history.reduce((sum, h) => sum + (Number(h.calories) || 0), 0);
      const streakDays = totalWorkouts > 0 ? Math.min(totalWorkouts, 7) : 0;

      // Real trend from actual recorded sessions
      const formAccuracyTrend = history.slice(0, 7).reverse().map((h, i) => ({
        day: `Session ${i + 1}`,
        score: h.accuracy || 90
      }));

      // Rep distribution from real sessions
      const repMap = {};
      history.forEach((h) => {
        const name = h.exerciseName || 'Squats';
        repMap[name] = (repMap[name] || 0) + (Number(h.reps) || 0);
      });
      const repDistribution = Object.keys(repMap).map((k) => ({
        exercise: k,
        reps: repMap[k]
      }));

      return {
        streakDays,
        totalWorkouts,
        totalRepsLogged,
        averageAccuracy,
        caloriesBurnedWeek,
        hasData: totalWorkouts > 0,
        weeklyFrequency: [
          { week: 'Wk 1', sessions: Math.min(totalWorkouts, 3), target: 4 },
          { week: 'Wk 2', sessions: 0, target: 4 },
          { week: 'Wk 3', sessions: 0, target: 4 },
          { week: 'Wk 4', sessions: 0, target: 4 },
        ],
        repDistribution,
        formAccuracyTrend,
        weightTrend: [
          { week: 'Start', weight: 75.0 },
          { week: 'Current', weight: 75.0 }
        ]
      };
    },

    async getBenchmarks() {
      await delay(150);
      const defaultBenchmarks = [
        { id: 'bm-squat', name: 'Barbell Deep Squat', metric: '1 Rep Max (kg)', value: null, isSlotOpen: true, placeholder: 'e.g. 100 kg' },
        { id: 'bm-pushup', name: 'Standard Push-Ups', metric: 'Max Consecutive Reps', value: null, isSlotOpen: true, placeholder: 'e.g. 25 reps' },
        { id: 'bm-deadlift', name: 'Romanian Deadlift', metric: '1 Rep Max (kg)', value: null, isSlotOpen: true, placeholder: 'e.g. 120 kg' },
        { id: 'bm-plank', name: 'Isometric Plank', metric: 'Max Hold Time (seconds)', value: null, isSlotOpen: true, placeholder: 'e.g. 90 sec' }
      ];
      return getStorage('ai_fitness_benchmarks', defaultBenchmarks);
    },

    async updateBenchmark(id, value) {
      await delay(200);
      const defaultBenchmarks = [
        { id: 'bm-squat', name: 'Barbell Deep Squat', metric: '1 Rep Max (kg)', value: null, isSlotOpen: true, placeholder: 'e.g. 100 kg' },
        { id: 'bm-pushup', name: 'Standard Push-Ups', metric: 'Max Consecutive Reps', value: null, isSlotOpen: true, placeholder: 'e.g. 25 reps' },
        { id: 'bm-deadlift', name: 'Romanian Deadlift', metric: '1 Rep Max (kg)', value: null, isSlotOpen: true, placeholder: 'e.g. 120 kg' },
        { id: 'bm-plank', name: 'Isometric Plank', metric: 'Max Hold Time (seconds)', value: null, isSlotOpen: true, placeholder: 'e.g. 90 sec' }
      ];
      const benchmarks = getStorage('ai_fitness_benchmarks', defaultBenchmarks);
      const target = benchmarks.find((b) => b.id === id);
      if (target) {
        target.value = value;
        target.isSlotOpen = false;
        target.updatedAt = new Date().toLocaleDateString();
        setStorage('ai_fitness_benchmarks', benchmarks);
      }
      return benchmarks;
    }
  },

  // -------------------------------------------------------------
  // ADMIN PLATFORM MANAGEMENT
  // -------------------------------------------------------------
  admin: {
    async getUsers() {
      await delay(250);
      const adminUsers = getStorage('ai_fitness_admin_users', MOCK_ADMIN_USERS);
      const currentUser = getStorage('ai_fitness_user', null);
      if (currentUser && !adminUsers.some((u) => u.email === currentUser.email)) {
        return [
          {
            id: currentUser.id || 'usr-local',
            name: currentUser.name || 'Current User',
            email: currentUser.email || 'user@example.com',
            role: 'user',
            status: 'Active',
            joinedDate: new Date().toISOString().split('T')[0],
            workoutsCompleted: currentUser.totalWorkouts || 0,
            avgAccuracy: currentUser.formAccuracyAvg || null,
            goal: currentUser.healthProfile?.goal || 'General Fitness',
            tier: 'Athlete Free'
          },
          ...adminUsers
        ];
      }
      return adminUsers;
    },

    async addAthleteSlot(athleteData) {
      await delay(300);
      const users = getStorage('ai_fitness_admin_users', MOCK_ADMIN_USERS);
      const newAthlete = {
        id: 'usr-' + Date.now(),
        name: athleteData.name || 'New Athlete Slot',
        email: athleteData.email || `athlete-${Date.now()}@pulseai.com`,
        role: 'user',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        workoutsCompleted: 0,
        avgAccuracy: null,
        goal: athleteData.goal || 'Hypertrophy & Posture',
        tier: 'Athlete Free'
      };
      users.unshift(newAthlete);
      setStorage('ai_fitness_admin_users', users);
      return newAthlete;
    },

    async toggleUserStatus(userId) {
      await delay(200);
      const users = getStorage('ai_fitness_admin_users', MOCK_ADMIN_USERS);
      const target = users.find((u) => u.id === userId);
      if (target) {
        target.status = target.status === 'Active' ? 'Suspended' : 'Active';
        setStorage('ai_fitness_admin_users', users);
      }
      return users;
    },

    async getSystemAnalytics() {
      await delay(250);
      return MOCK_ADMIN_ANALYTICS;
    },

    async getActivityLogs() {
      await delay(200);
      return getStorage('ai_fitness_activity_logs', MOCK_ACTIVITY_LOGS);
    },

    async addExercise(exerciseData) {
      await delay(300);
      const exercises = getStorage('ai_fitness_exercises', MOCK_EXERCISES);
      const newEx = {
        ...exerciseData,
        id: 'ex-' + Date.now(),
        defaultSets: Number(exerciseData.defaultSets) || 3,
        defaultReps: Number(exerciseData.defaultReps) || 10,
        formCues: exerciseData.formCues || ['Maintain neutral spine and controlled descent.'],
        commonMistakes: exerciseData.commonMistakes || ['Moving too quickly through eccentric phase.']
      };
      exercises.unshift(newEx);
      setStorage('ai_fitness_exercises', exercises);
      return newEx;
    },

    async updateExercise(id, exerciseData) {
      await delay(250);
      const exercises = getStorage('ai_fitness_exercises', MOCK_EXERCISES);
      const index = exercises.findIndex((ex) => ex.id === id);
      if (index !== -1) {
        exercises[index] = { ...exercises[index], ...exerciseData };
        setStorage('ai_fitness_exercises', exercises);
        return exercises[index];
      }
      throw new Error('Exercise not found');
    },

    async deleteExercise(id) {
      await delay(200);
      const exercises = getStorage('ai_fitness_exercises', MOCK_EXERCISES);
      const filtered = exercises.filter((ex) => ex.id !== id);
      setStorage('ai_fitness_exercises', filtered);
      return filtered;
    }
  }
};

```

---

