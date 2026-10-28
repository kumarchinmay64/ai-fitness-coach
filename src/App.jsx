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
import ErrorBoundary from './components/ui/ErrorBoundary';

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
                <ErrorBoundary>
                  <LiveWorkoutPage />
                </ErrorBoundary>
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
