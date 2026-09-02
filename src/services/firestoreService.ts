import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { SavedCloudReport, ResumeAnalysisResult, AppUserProfile } from '../types';
import { getAnalysisHistory } from './storage';

const DEMO_USER_STORAGE_KEY = 'resumesense_demo_auth_user';

let authListeners: ((user: AppUserProfile | User | null) => void)[] = [];

function notifyAuthListeners(user: AppUserProfile | User | null) {
  authListeners.forEach((cb) => {
    try {
      cb(user);
    } catch (e) {
      console.error('Error in auth listener:', e);
    }
  });
}

/**
 * Check if a demo user is currently active in localStorage
 */
export function getStoredDemoUser(): AppUserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Sign in as a Demo User (works anywhere, even if Firebase domain is not configured)
 */
export function signInAsDemoUser(customName?: string): AppUserProfile {
  const name = customName || 'Alex Morgan (Demo)';
  const demoUser: AppUserProfile = {
    uid: 'demo-user-' + Math.random().toString(36).substring(2, 9),
    email: 'alex.morgan@resumesense.ai',
    displayName: name,
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isDemo: true,
  };

  try {
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
  } catch (e) {
    console.warn('Could not persist demo user to localStorage:', e);
  }

  notifyAuthListeners(demoUser);
  return demoUser;
}

/**
 * Sign in with a Custom Profile name and email
 */
export function signInWithCustomProfile(
  name: string,
  email: string,
  photoURL?: string
): AppUserProfile {
  const cleanName = name.trim() || 'Candidate';
  const cleanEmail = email.trim() || 'user@resumesense.ai';
  const avatar =
    photoURL ||
    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`;

  const profileUser: AppUserProfile = {
    uid: 'profile-' + (cleanEmail ? btoa(cleanEmail.toLowerCase()).replace(/=/g, '') : Math.random().toString(36).substring(2, 9)),
    email: cleanEmail,
    displayName: cleanName,
    photoURL: avatar,
    isDemo: true,
  };

  try {
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(profileUser));
  } catch (e) {
    console.warn('Could not persist custom profile to localStorage:', e);
  }

  notifyAuthListeners(profileUser);
  return profileUser;
}

/**
 * Sign in with Google Popup with enriched error detection
 */
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Clear any previous demo user session
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);

    // Sync user profile in Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLoginAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not sync user profile to Firestore:', err);
    }

    notifyAuthListeners(user);
    return user;
  } catch (err: any) {
    console.error('Firebase signInWithPopup error:', err);

    // Provide friendly domain authorization guidance if unauthorized-domain
    if (err?.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'your-domain';
      const enrichedErr = new Error(
        `Domain "${currentHost}" is not authorized in Firebase Console. Add it under Firebase Console > Authentication > Settings > Authorized Domains, or continue with a Demo Account.`
      );
      (enrichedErr as any).code = 'auth/unauthorized-domain';
      (enrichedErr as any).host = currentHost;
      throw enrichedErr;
    }

    throw err;
  }
}

/**
 * Sign out of current Firebase session and clear demo user
 */
export async function logOut(): Promise<void> {
  localStorage.removeItem(DEMO_USER_STORAGE_KEY);
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Firebase signOut notice:', err);
  }
  notifyAuthListeners(null);
}

/**
 * Subscribe to auth state changes (supports both real Firebase Auth and Demo User)
 */
export function subscribeToAuth(callback: (user: AppUserProfile | User | null) => void) {
  authListeners.push(callback);

  // Check initial demo user
  const demoUser = getStoredDemoUser();

  // Listen to Firebase auth changes
  const unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(firebaseUser);
    } else if (demoUser) {
      callback(demoUser);
    } else {
      callback(null);
    }
  });

  // Initial trigger if demo user is active
  if (!auth.currentUser && demoUser) {
    callback(demoUser);
  }

  return () => {
    authListeners = authListeners.filter((cb) => cb !== callback);
    unsubscribeFirebase();
  };
}

/**
 * Save a full resume analysis report to Firestore (with localStorage fallback)
 */
export async function saveReportToFirestore(
  userId: string,
  analysis: ResumeAnalysisResult,
  customTitle?: string
): Promise<string> {
  if (!userId) throw new Error('User must be authenticated to save reports to cloud');

  const reportId =
    analysis.id && analysis.id.startsWith('rep_')
      ? analysis.id
      : 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  const title =
    customTitle ||
    `${analysis.targetRole || 'Resume Analysis'} - ${analysis.resumeName || 'Report'}`;

  const reportData = {
    userId,
    title,
    targetRole: analysis.targetRole || 'Target Role',
    targetCompany: analysis.targetCompany || '',
    overallScore: analysis.scores?.overall || 0,
    atsScore: analysis.scores?.atsCompatibility || 0,
    analysisResult: analysis,
    createdAt: analysis.timestamp || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // If demo user or offline, firestore operations are bypassed safely
  if (userId.startsWith('demo-user-')) {
    return reportId;
  }

  try {
    const reportRef = doc(db, 'reports', reportId);
    await setDoc(reportRef, reportData, { merge: true });
    return reportId;
  } catch (err) {
    console.warn('Firestore cloud save failed, report is stored in local history:', err);
    return reportId;
  }
}

/**
 * Fetch all reports saved by a specific user from Firestore
 */
export async function fetchUserReports(userId: string): Promise<SavedCloudReport[]> {
  if (!userId) return [];

  // For demo users, map local analysis history
  if (userId.startsWith('demo-user-')) {
    const localHistory = getAnalysisHistory();
    return localHistory.map((item) => ({
      id: item.id,
      userId,
      title: `${item.targetRole} - ${item.resumeName}`,
      targetRole: item.targetRole,
      targetCompany: item.targetCompany || '',
      overallScore: item.overallScore,
      atsScore: item.atsScore,
      analysisResult: item.result,
      createdAt: item.timestamp,
    }));
  }

  try {
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const reports: SavedCloudReport[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      reports.push({
        id: docSnap.id,
        userId: data.userId,
        title: data.title || 'Saved Report',
        targetRole: data.targetRole || '',
        targetCompany: data.targetCompany || '',
        overallScore: data.overallScore ?? 0,
        atsScore: data.atsScore ?? 0,
        analysisResult: data.analysisResult,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt,
      });
    });

    reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return reports;
  } catch (err) {
    console.warn('Firestore fetch failed, returning local history reports:', err);
    const localHistory = getAnalysisHistory();
    return localHistory.map((item) => ({
      id: item.id,
      userId,
      title: `${item.targetRole} - ${item.resumeName}`,
      targetRole: item.targetRole,
      targetCompany: item.targetCompany || '',
      overallScore: item.overallScore,
      atsScore: item.atsScore,
      analysisResult: item.result,
      createdAt: item.timestamp,
    }));
  }
}

/**
 * Real-time listener for user analysis reports in Firestore
 */
export function subscribeToUserReports(
  userId: string,
  onReportsUpdate: (reports: SavedCloudReport[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  if (!userId) {
    onReportsUpdate([]);
    return () => {};
  }

  if (userId.startsWith('demo-user-')) {
    const localHistory = getAnalysisHistory();
    onReportsUpdate(
      localHistory.map((item) => ({
        id: item.id,
        userId,
        title: `${item.targetRole} - ${item.resumeName}`,
        targetRole: item.targetRole,
        targetCompany: item.targetCompany || '',
        overallScore: item.overallScore,
        atsScore: item.atsScore,
        analysisResult: item.result,
        createdAt: item.timestamp,
      }))
    );
    return () => {};
  }

  const reportsRef = collection(db, 'reports');
  const q = query(reportsRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const reports: SavedCloudReport[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        reports.push({
          id: docSnap.id,
          userId: data.userId,
          title: data.title || 'Saved Report',
          targetRole: data.targetRole || '',
          targetCompany: data.targetCompany || '',
          overallScore: data.overallScore ?? 0,
          atsScore: data.atsScore ?? 0,
          analysisResult: data.analysisResult,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt,
        });
      });

      reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onReportsUpdate(reports);
    },
    (err) => {
      console.warn('Firestore subscription notice (using local data):', err);
      const localHistory = getAnalysisHistory();
      onReportsUpdate(
        localHistory.map((item) => ({
          id: item.id,
          userId,
          title: `${item.targetRole} - ${item.resumeName}`,
          targetRole: item.targetRole,
          targetCompany: item.targetCompany || '',
          overallScore: item.overallScore,
          atsScore: item.atsScore,
          analysisResult: item.result,
          createdAt: item.timestamp,
        }))
      );
      if (onError) onError(err);
    }
  );
}

/**
 * Delete a report from Firestore
 */
export async function deleteUserReport(reportId: string): Promise<void> {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await deleteDoc(reportRef);
  } catch (e) {
    console.warn('Could not delete from Firestore:', e);
  }
}
