import React, { useState } from 'react';
import {
  LogIn,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Cloud,
  Check,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { signInWithGoogle, logOut } from '../services/firestoreService';

interface AuthButtonProps {
  currentUser: User | null;
  onAuthSuccess?: (user: User) => void;
  onSignOutSuccess?: () => void;
  className?: string;
  variant?: 'compact' | 'full' | 'banner';
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  currentUser,
  onAuthSuccess,
  onSignOutSuccess,
  className = '',
  variant = 'compact',
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (onAuthSuccess) onAuthSuccess(user);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      // Suppress popup-closed-by-user noise
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await logOut();
      setIsDropdownOpen(false);
      if (onSignOutSuccess) onSignOutSuccess();
    } catch (err: any) {
      console.error('Sign-out failed:', err);
      setError(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'banner' && !currentUser) {
    return (
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 border border-blue-500/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
            <Cloud className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/40 px-2 py-0.2 rounded">
                Cloud Sync & Authentication
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">
              Sign in with Google to Save Your Resume Reports to the Cloud
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Access your saved ATS audits, match scores, and AI-enhanced resumes anytime across any device.
            </p>
          </div>
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Sign in with Google</span>
        </button>
      </div>
    );
  }

  if (currentUser) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-xs"
        >
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'User'}
              className="w-6 h-6 rounded-full ring-1 ring-slate-200"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <span className="hidden sm:inline font-semibold text-slate-700 max-w-[120px] truncate">
            {currentUser.displayName || currentUser.email?.split('@')[0]}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-lg py-2 z-40 text-xs">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="font-bold text-slate-900 truncate">
                  {currentUser.displayName || 'Google Account'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Authenticated via Google</span>
                </div>
              </div>

              <div className="px-2 py-1">
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 cursor-pointer font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {error && (
        <span className="text-[11px] text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </span>
      )}
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};
