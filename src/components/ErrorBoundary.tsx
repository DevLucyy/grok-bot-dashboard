import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in dashboard:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070709] text-yellow-400 p-8 font-mono flex flex-col items-center justify-center">
          <div className="max-w-lg w-full bg-[#0d121f] border-2 border-yellow-400 p-6 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <h2 className="text-lg font-black tracking-wide uppercase mb-2 flex items-center gap-2">
              ⚠️ Dashboard Recovery
            </h2>
            <p className="text-xs text-slate-300 mb-4">
              An unexpected client error occurred while mounting.
            </p>
            <pre className="p-3 bg-black/80 rounded border border-rose-500/40 text-[11px] text-rose-300 overflow-x-auto mb-4 font-mono whitespace-pre-wrap">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2.5 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider transition-colors"
            >
              Reset Cache & Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
