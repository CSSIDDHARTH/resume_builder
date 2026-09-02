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
import { SavedCloudReport, ResumeAnalysisResult } from '../types';

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

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

  return user;
}

/**
 * Sign out of current Firebase session
 */
export async function logOut(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Save a full resume analysis report to Firestore for the authenticated user
 */
export async function saveReportToFirestore(
  userId: string,
  analysis: ResumeAnalysisResult,
  customTitle?: string
): Promise<string> {
  if (!userId) throw new Error('User must be authenticated to save reports to cloud');

  const reportId = analysis.id && analysis.id.startsWith('rep_') 
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

  const reportRef = doc(db, 'reports', reportId);
  await setDoc(reportRef, reportData, { merge: true });

  return reportId;
}

/**
 * Fetch all reports saved by a specific user from Firestore
 */
export async function fetchUserReports(userId: string): Promise<SavedCloudReport[]> {
  if (!userId) return [];

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

    // Sort newest first
    reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return reports;
  } catch (err) {
    console.error('Error fetching user reports from Firestore:', err);
    throw err;
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
      console.error('Firestore real-time subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Delete a report from Firestore
 */
export async function deleteUserReport(reportId: string): Promise<void> {
  const reportRef = doc(db, 'reports', reportId);
  await deleteDoc(reportRef);
}
