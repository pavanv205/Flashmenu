import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React UI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08080A] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0E0E14] border border-white/10 text-center space-y-6 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white">Dashboard Encountered an Issue</h2>
              <p className="text-xs text-gray-400">
                A temporary error occurred while rendering this page. Don't worry, your data is completely safe.
              </p>
              {this.state.error && (
                <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-left text-[11px] font-mono text-red-300 overflow-x-auto max-h-32">
                  <p className="font-bold text-red-400">Error Details:</p>
                  <p>{String(this.state.error.message || this.state.error)}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Dashboard</span>
              </button>

              <a
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/10 text-white font-extrabold text-xs transition-all flex items-center justify-center space-x-2 border border-white/10"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
