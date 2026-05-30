import { db, auth } from '../lib/firebase';
import { handleFirestoreError } from '../lib/firestore-errors';
import { OperationType } from '../types';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  serverTimestamp, 
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

export interface AssessmentRecord {
  id?: string;
  userId: string;
  scores: Record<string, number>;
  overallTitle: string;
  createdAt: any;
}

export interface HabitRecord {
  id?: string;
  userId: string;
  habitId: string;
  habitTitle: string;
  date: string; // YYYY-MM-DD
  completedAt: any;
}

export interface EthicsCommitment {
  id?: string;
  userId: string;
  ethicId: string;
  title: string;
  status: 'active' | 'completed' | 'struggling';
  createdAt: any;
  updatedAt: any;
}

// Assessments - STRICTLY LOCAL-ONLY (Local Storage) as requested by the user, to guarantee the youth's complete privacy
export async function saveAssessment(scores: Record<string, number>, overallTitle: string, totalScore?: number) {
  if (!auth.currentUser) return;
  const userId = auth.currentUser.uid;
  const storageKey = `sanad_assessment_${userId}`;
  const localRecord = {
    userId,
    scores,
    overallTitle,
    totalScore,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(storageKey, JSON.stringify(localRecord));
  return { id: 'local-id', ...localRecord };
}

export async function getLatestAssessment() {
  if (!auth.currentUser) return null;
  const userId = auth.currentUser.uid;
  const storageKey = `sanad_assessment_${userId}`;
  const encoded = localStorage.getItem(storageKey);
  if (!encoded) return null;
  try {
    const data = JSON.parse(encoded);
    return data as AssessmentRecord;
  } catch (err) {
    console.error("Failed to parse local assessment:", err);
    return null;
  }
}

// Habits
export async function toggleHabitPersistence(habitId: string, habitTitle: string, date: string, isCompleted: boolean) {
  if (!auth.currentUser) return;
  const userId = auth.currentUser.uid;
  const colRef = collection(db, 'users', userId, 'habits');
  
  const q = query(colRef, where('habitId', '==', habitId), where('date', '==', date));
  const snap = await getDocs(q);

  if (isCompleted) {
    if (snap.empty) {
      return addDoc(colRef, {
        userId,
        habitId,
        habitTitle,
        date,
        completedAt: serverTimestamp(),
      });
    }
  } else {
    if (!snap.empty) {
      return deleteDoc(doc(db, 'users', userId, 'habits', snap.docs[0].id));
    }
  }
}

export async function getHabitsForDate(date: string) {
  if (!auth.currentUser) return [];
  const userId = auth.currentUser.uid;
  const colRef = collection(db, 'users', userId, 'habits');
  const q = query(colRef, where('date', '==', date));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as HabitRecord);
}

// Ethics
export async function saveEthicsCommitment(ethicId: string, title: string) {
  if (!auth.currentUser) return;
  const userId = auth.currentUser.uid;
  const colRef = collection(db, 'users', userId, 'ethics_commitments');
  
  // Check if already exist
  const q = query(colRef, where('ethicId', '==', ethicId));
  const snap = await getDocs(q);
  
  if (snap.empty) {
    return addDoc(colRef, {
      userId,
      ethicId,
      title,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function getEthicsCommitments() {
  if (!auth.currentUser) return [];
  const userId = auth.currentUser.uid;
  const colRef = collection(db, 'users', userId, 'ethics_commitments');
  const snap = await getDocs(colRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as EthicsCommitment);
}

// Prophet / "سفينة النجاة" Commitments
export async function saveProphetCommitment(prophetId: string, prophetName: string, committed: boolean) {
  if (!auth.currentUser) return;
  const userId = auth.currentUser.uid;
  const docRef = doc(db, 'users', userId, 'prophet_commitments', prophetId);
  try {
    await setDoc(docRef, {
      userId,
      prophetId,
      prophetName,
      committed,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/prophet_commitments/${prophetId}`);
  }
}

export async function getProphetCommitments(): Promise<Record<string, boolean>> {
  if (!auth.currentUser) return {};
  const userId = auth.currentUser.uid;
  const colRef = collection(db, 'users', userId, 'prophet_commitments');
  try {
    const snap = await getDocs(colRef);
    const commitments: Record<string, boolean> = {};
    snap.docs.forEach(docSnap => {
      const data = docSnap.data();
      commitments[docSnap.id] = !!data.committed;
    });
    return commitments;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/prophet_commitments`);
    return {};
  }
}

export async function getUserContext() {
  if (!auth.currentUser) return null;
  const userId = auth.currentUser.uid;
  
  const today = new Date().toISOString().split('T')[0];
  
  // Use settled to handle partial failures
  const results = await Promise.allSettled([
    getLatestAssessment(),
    getHabitsForDate(today),
    getEthicsCommitments()
  ]);

  const assessment = results[0].status === 'fulfilled' ? (results[0].value as AssessmentRecord) : null;
  const habits = results[1].status === 'fulfilled' ? (results[1].value as HabitRecord[]) : [];
  const ethics = results[2].status === 'fulfilled' ? (results[2].value as EthicsCommitment[]) : [];

  if (results.some(r => r.status === 'rejected')) {
    console.error("Some context parts failed to load:", results.filter(r => r.status === 'rejected'));
  }

  let displayName = "ضيف";
  let demographics = { gender: 'male', maritalStatus: 'single', job: 'student' };
  try {
    const userDocSnap = await getDoc(doc(db, 'users', userId));
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      displayName = userData.displayName || "ضيف";
      if (userData.demographics) {
        demographics = userData.demographics;
      }
    }
  } catch (err) {
    console.error("Failed to load user profile in context:", err);
  }

  return {
    displayName,
    demographics,
    assessment: assessment ? {
      title: assessment.overallTitle,
      scores: assessment.scores,
      totalScore: (assessment as any).totalScore || 0
    } : null,
    todayHabits: habits.map(h => h.habitTitle),
    allCommitments: ethics.map(e => e.title)
  };
}
