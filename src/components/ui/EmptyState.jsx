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
