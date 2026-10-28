import React from 'react';
import Button from './Button';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                Workout Session Interrupted
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                An unexpected interface issue occurred. Your overall workout history and account data remain safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-left font-mono text-xs text-rose-300 overflow-x-auto">
                <span className="font-bold text-slate-400 block mb-1">Diagnostic Details:</span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                variant="primary"
                icon={RotateCcw}
                className="w-full sm:w-auto flex-1"
                onClick={this.handleReset}
              >
                Reload Workout
              </Button>
              <Button
                variant="secondary"
                icon={Home}
                className="w-full sm:w-auto flex-1"
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
