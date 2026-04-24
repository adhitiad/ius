'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  title?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundaryCard extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="relative group overflow-hidden rounded-xl border border-red-900/30 bg-[#0f172a] p-6 text-center animate-in fade-in duration-500">
          {/* Aksen Aurora Merah untuk Error */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-900/20 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">
                {this.props.title || 'Modul Gagal Memuat'}
              </h3>
              <p className="text-sm text-slate-400 max-w-[250px] mx-auto">
                Terjadi kesalahan teknis saat memuat komponen ini.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={this.handleReset}
              className="bg-transparent border-slate-800 hover:bg-slate-800 hover:text-white transition-all gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Modul
            </Button>
            
            {process.env.NODE_ENV === 'development' && (
              <p className="text-[10px] text-red-400 font-mono mt-4 opacity-50 break-words line-clamp-1">
                {this.state.error?.message}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryCard;
