import { db, auth } from '../lib/firebase';
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

// Assessments
export async function saveAssessment(scores: Record<string, number>, overallTitle: string) {
  if (!auth.currentUser) return;
  const userId = auth.currentUser.uid;
  const colRef = collection(db, 'users', userId, 'assessments');
  return addDoc(colRef, {
    userId,
    scores,
    overallTitle,
    createdAt: serverTimestamp(),
  });
}

export async function getLatestAssessment() {
  if (!auth.currentUser) return null;
  const userId = auth.currentUser.uid;
  const colRef = collection(db, 'users', userId, 'assessments');
  const q = query(colRef, orderBy('createdAt', 'desc'), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as AssessmentRecord;
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

  return {
    assessment: assessment ? {
      title: assessment.overallTitle,
      scores: assessment.scores
    } : null,
    todayHabits: habits.map(h => h.habitTitle),
    allCommitments: ethics.map(e => e.title)
  };
}
