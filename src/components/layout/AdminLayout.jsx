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
