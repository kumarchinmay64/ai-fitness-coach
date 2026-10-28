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
