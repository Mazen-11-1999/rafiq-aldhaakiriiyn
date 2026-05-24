export enum SessionType {
  SILENCE = 'silence',
  DHIKR = 'dhikr',
  RETREAT = 'retreat'
}

export interface UserSettings {
  notifications: {
    enabled: boolean;
    dhikrReminders: boolean;
    retreatReminders: boolean;
    prayerTimes: boolean;
    ringtone: string;
  };
  privacy: {
    publicProfile: boolean;
    shareInsights: boolean;
  };
  appearance: {
    language: 'ar' | 'en';
    dateFormat: 'western' | 'arabic';
    darkMode: boolean;
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: any;
  totalMinutes: number;
  totalSessions: number;
  currentStreak: number;
  nasheedMinutes?: number;
  dhikrMinutes?: number;
  retreatMinutes?: number;
  journalMinutes?: number;
  growthMinutes?: number;
  lastSessionAt?: any;
  lastActiveDate?: any;
  coords?: { lat: number, lng: number };
  pushSubscription?: any;
  settings?: UserSettings;
  demographics?: {
    gender?: 'male' | 'female';
    maritalStatus?: 'single' | 'married';
    job?: 'student' | 'employed' | 'unemployed' | 'business';
  };
}

export interface Session {
  id?: string;
  userId: string;
  type: SessionType;
  duration: number;
  dhikrText?: string;
  dhikrCount?: number;
  moodBefore?: string;
  moodAfter?: string;
  createdAt: any;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  message: string;
  suggestedDhikr?: string;
  dhikrExplanation?: string;
  actionPlan?: string[];
  dailyChallenge?: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export interface SpiritualInsight {
  id: string;
  title: string;
  category: 'sincerity' | 'integrity' | 'heart-purity';
  content: string;
  reflectionQuestion: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  category: 'intent' | 'consistency' | 'ethics' | 'ego' | 'knowledge';
}
