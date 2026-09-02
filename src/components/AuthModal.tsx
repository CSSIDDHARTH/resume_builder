import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  User as UserIcon,
  ArrowRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { AppUserProfile } from '../types';
import {
  signInWithGoogle,
  signInWithCustomProfile,
  signInAsDemoUser,
} from '../services/firestoreService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: AppUserProfile | User) => void;
  initialError?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialError,
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'custom'>('google');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(initialError || null);
  const [copiedDomain, setCopiedDomain] = useState<boolean>(false);

  // Custom profile state
  const [name, setName] = useState<string>('Siddharth');
  const [email, setEmail] = useState<string>('siddharth@example.com');

  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your-domain.vercel.app';

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorDetails(null);
    try {
      const user = await signInWithGoogle();
      if (onAuthSuccess) onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In caught in modal:', err);
      let msg = err.message || 'Google Sign-In failed.';
      if (err?.code === 'auth/unauthorized-domain') {
        msg = `Domain "${currentHost}" is not authorized for OAuth in Firebase Project "nth-way-l07pf". You can either add this domain to Firebase Console, or sign in instantly below with your custom name/email.`;
      } else if (err?.code === 'auth/operation-not-allowed') {
        msg = 'Google Sign-In provider is not enabled in Firebase project nth-way-l07pf. Please use Instant Profile sign-in below.';
      } else if (err?.code === 'auth/popup-blocked') {
        msg = 'The Google sign-in popup was blocked by your browser. Please allow popups or use Instant Profile sign-in.';
      }
      setErrorDetails(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const user = signInWithCustomProfile(name, email);
    if (onAuthSuccess) onAuthSuccess(user);
    onClose();
  };

  const handleQuickPreset = (presetName: string, presetEmail: string) => {
    const user = signInWithCustomProfile(presetName, presetEmail);
    if (onAuthSuccess) onAuthSuccess(user);
    onClose();
  };

  const copyDomain = () => {
    navigator.clipboard.writeText(currentHost);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sign In to ResumeSense</h3>
              <p className="text-[11px] text-slate-500">Access saved resumes & cloud sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 flex border-b border-slate-100 bg-white">
          <button
            onClick={() => setActiveTab('google')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer mr-4 ${
              activeTab === 'google'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Google Sign-In
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Instant Profile (Recommended)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Error Banner */}
          {errorDetails && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold block text-red-950">Authentication Notice</span>
                  <p className="text-[11px] text-red-800 mt-0.5 leading-relaxed">{errorDetails}</p>
                </div>
              </div>

              {/* Instant profile button inside error banner */}
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className="w-full mt-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Switch to Instant Profile (Works Instantly)</span>
              </button>
            </div>
          )}

          {/* TAB 1: GOOGLE SIGN-IN */}
          {activeTab === 'google' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-500 text-left">
                Sign in with your Google account to sync resumes and audit history to Firestore.
              </p>

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
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

              {/* Vercel domain info note */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    <span>Domain Whitelist Info</span>
                  </span>
                  <button
                    onClick={copyDomain}
                    className="text-blue-600 hover:text-blue-700 text-[10px] font-bold cursor-pointer"
                  >
                    {copiedDomain ? 'Copied!' : 'Copy Hostname'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Google OAuth restricts popups to authorized domains. If you are on Vercel (<code>{currentHost}</code>), Google Sign-In requires your domain to be whitelisted in Firebase Console. You can also use <b>Instant Profile</b> to sign in right now with zero setup.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('custom')}
                  className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Use Instant Profile Instead</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INSTANT PROFILE (Zero Firebase OAuth Hassle) */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                <span className="font-bold flex items-center gap-1 mb-0.5 text-blue-950">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Instant Authentication
                </span>
                Enter your name and email to log in immediately. Full profile sync, saved resumes, and history will be enabled for your session.
              </div>

              <form onSubmit={handleCustomSignIn} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Siddharth"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. siddharth@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-blue-500 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In as {name || 'User'}</span>
                </button>
              </form>

              {/* Quick Presets */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Or Quick One-Click Sign In:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickPreset('Alex Morgan', 'alex.morgan@resumesense.ai')}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-slate-800 text-[11px]">Alex Morgan</div>
                    <div className="text-[10px] text-slate-400">Software Engineer</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPreset('Priya Sharma', 'priya.sharma@talentlead.com')}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    <div className="font-bold text-slate-800 text-[11px]">Priya Sharma</div>
                    <div className="text-[10px] text-slate-400">Senior Recruiter</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
