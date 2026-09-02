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
  KeyRound,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AppUserProfile } from '../types';
import { signInWithGoogle, logOut } from '../services/firestoreService';
import { AuthModal } from './AuthModal';

interface AuthButtonProps {
  currentUser: AppUserProfile | User | null;
  onAuthSuccess?: (user: AppUserProfile | User) => void;
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
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalError, setAuthModalError] = useState<string | null>(null);

  const handleQuickGoogleSignIn = async () => {
    setLoading(true);
    setAuthModalError(null);
    try {
      const user = await signInWithGoogle();
      if (onAuthSuccess) onAuthSuccess(user);
    } catch (err: any) {
      console.error('Google Sign-In caught in button:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setAuthModalError(err.message || 'Google Sign-In was rejected.');
        setIsAuthModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logOut();
      setIsDropdownOpen(false);
      if (onSignOutSuccess) onSignOutSuccess();
    } catch (err: any) {
      console.error('Sign-out failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Banner Variant (Dashboard Cloud Sync) ─────────────────────────────────
  if (variant === 'banner' && !currentUser) {
    return (
      <>
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
                Sign in to Save Your Resume Reports to the Cloud
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Access your saved ATS audits, match scores, and AI-enhanced resumes anytime across any device.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleQuickGoogleSignIn}
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

            <button
              onClick={() => {
                setAuthModalError(null);
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-2 bg-blue-700/60 hover:bg-blue-600/70 border border-blue-400/40 text-blue-100 font-semibold rounded-lg text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Instant Profile</span>
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={onAuthSuccess}
          initialError={authModalError}
        />
      </>
    );
  }

  // ─── Signed In State ────────────────────────────────────────────────────────
  if (currentUser) {
    const isDemo = (currentUser as any).isDemo || currentUser.uid.startsWith('demo-user-') || currentUser.uid.startsWith('profile-');

    return (
      <>
        <div className={`relative ${className}`}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-xs"
          >
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="w-6 h-6 rounded-full ring-1 ring-slate-200 object-cover"
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
            <span
              className={`w-2 h-2 rounded-full ${isDemo ? 'bg-amber-500' : 'bg-emerald-500'} ring-2 ring-white`}
              title={isDemo ? 'Instant Profile' : 'Google Authenticated'}
            />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-40 text-xs">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <div className="font-bold text-slate-900 truncate">
                    {currentUser.displayName || 'User Account'}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {isDemo ? (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Active Cloud Session
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Google Authenticated
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-2 py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setAuthModalError(null);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full px-3 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2 cursor-pointer font-medium transition-colors mb-1"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Switch Profile or Account</span>
                  </button>

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

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={onAuthSuccess}
          initialError={authModalError}
        />
      </>
    );
  }

  // ─── Logged Out State (Compact Navbar button) ──────────────────────────────
  return (
    <>
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button
          onClick={handleQuickGoogleSignIn}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          title="Sign in with Google"
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
          <span>Sign In</span>
        </button>

        <button
          onClick={() => {
            setAuthModalError(null);
            setIsAuthModalOpen(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition-colors cursor-pointer border border-blue-200"
          title="Sign in with custom name or instant profile"
        >
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span className="hidden sm:inline">Options</span>
        </button>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={onAuthSuccess}
        initialError={authModalError}
      />
    </>
  );
};
