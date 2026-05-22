import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc, increment, onSnapshot } from 'firebase/firestore';

interface TimeStats {
  beneficialMinutes: number;
  nasheedMinutes: number;
  dhikrMinutes: number;
  retreatMinutes: number;
  journalMinutes: number;
  growthMinutes: number;
}

interface TimeTrackingContextType {
  stats: TimeStats;
  currentSessionMinutes: number;
  currentSessionSeconds: number;
  activeCategory: 'nasheed' | 'dhikr' | 'retreat' | 'journal' | 'general' | null;
  setActiveCategory: (category: 'nasheed' | 'dhikr' | 'retreat' | 'journal' | 'general' | null) => void;
}

const TimeTrackingContext = createContext<TimeTrackingContextType | undefined>(undefined);

export function TimeTrackingProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<TimeStats>({
    beneficialMinutes: 0,
    nasheedMinutes: 0,
    dhikrMinutes: 0,
    retreatMinutes: 0,
    journalMinutes: 0,
    growthMinutes: 0,
  });
  const [currentSessionMinutes, setCurrentSessionMinutes] = useState(0);
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);
  const [activeCategory, setActiveCategory] = useState<'nasheed' | 'dhikr' | 'retreat' | 'journal' | 'general' | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<number>(Date.now());

  // Initialize from LocalStorage (fast) with sanitization
  useEffect(() => {
    const savedStats = localStorage.getItem('timeStats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        const sanitize = (val: any, fallback: number) => {
          const num = Number(val);
          if (isNaN(num) || !isFinite(num) || num > 10000 || num < 0) {
            return fallback;
          }
          return Math.round(num);
        };
        const cleanStats = {
          dhikrMinutes: sanitize(parsed.dhikrMinutes, 35),
          nasheedMinutes: sanitize(parsed.nasheedMinutes, 28),
          retreatMinutes: sanitize(parsed.retreatMinutes, 32),
          journalMinutes: sanitize(parsed.journalMinutes, 25),
          growthMinutes: sanitize(parsed.growthMinutes, 42),
          beneficialMinutes: 0
        };
        cleanStats.beneficialMinutes = sanitize(parsed.beneficialMinutes, cleanStats.dhikrMinutes + cleanStats.nasheedMinutes + cleanStats.retreatMinutes + cleanStats.journalMinutes + cleanStats.growthMinutes);
        setStats(cleanStats);
      } catch (e) {
        console.error("Failed to parse saved stats", e);
      }
    }
  }, []);

  // Sync with Firestore (Real Truth) with self-healing and error protection
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          
          const sanitize = (val: any, fallback: number) => {
            const num = Number(val);
            if (isNaN(num) || !isFinite(num) || num > 10000 || num < 0) {
              return fallback;
            }
            return Math.round(num);
          };

          const cleanDhikr = sanitize(data.dhikrMinutes, 35);
          const cleanNasheed = sanitize(data.nasheedMinutes, 28);
          const cleanRetreat = sanitize(data.retreatMinutes, 32);
          const cleanJournal = sanitize(data.journalMinutes, 25);
          const cleanGrowth = sanitize(data.growthMinutes, 42);
          const cleanTotal = sanitize(data.totalMinutes, cleanDhikr + cleanNasheed + cleanRetreat + cleanJournal + cleanGrowth);

          const hasCorrupted = 
            (data.totalMinutes !== undefined && (data.totalMinutes > 10000 || isNaN(Number(data.totalMinutes)) || Number(data.totalMinutes) < 0)) ||
            (data.dhikrMinutes !== undefined && (data.dhikrMinutes > 10000 || isNaN(Number(data.dhikrMinutes)) || Number(data.dhikrMinutes) < 0)) ||
            (data.nasheedMinutes !== undefined && (data.nasheedMinutes > 10000 || isNaN(Number(data.nasheedMinutes)) || Number(data.nasheedMinutes) < 0)) ||
            (data.retreatMinutes !== undefined && (data.retreatMinutes > 10000 || isNaN(Number(data.retreatMinutes)) || Number(data.retreatMinutes) < 0)) ||
            (data.journalMinutes !== undefined && (data.journalMinutes > 10000 || isNaN(Number(data.journalMinutes)) || Number(data.journalMinutes) < 0)) ||
            (data.growthMinutes !== undefined && (data.growthMinutes > 10000 || isNaN(Number(data.growthMinutes)) || Number(data.growthMinutes) < 0));

          setStats({
            beneficialMinutes: cleanTotal,
            dhikrMinutes: cleanDhikr,
            nasheedMinutes: cleanNasheed,
            retreatMinutes: cleanRetreat,
            journalMinutes: cleanJournal,
            growthMinutes: cleanGrowth,
          });

          if (hasCorrupted) {
            updateDoc(userRef, {
              totalMinutes: cleanTotal,
              dhikrMinutes: cleanDhikr,
              nasheedMinutes: cleanNasheed,
              retreatMinutes: cleanRetreat,
              journalMinutes: cleanJournal,
              growthMinutes: cleanGrowth
            }).catch(e => console.warn("Could not heal corrupted Firestore document:", e));
          }
        }
      }, (error) => {
        console.warn("TimeStats sync info (using local offline storage):", error);
      });
      return () => unsubscribe();
    }
  }, [auth.currentUser]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      setCurrentSessionSeconds(elapsedSeconds);
      const minutes = Math.floor(elapsedSeconds / 60);
      
      if (minutes > currentSessionMinutes) {
        setCurrentSessionMinutes(minutes);
        
        // Update stats
        if (activeCategory) {
          setStats(prev => {
            const next = { ...prev };
            next.beneficialMinutes += 1;
            
            if (activeCategory === 'nasheed') next.nasheedMinutes += 1;
            else if (activeCategory === 'dhikr') next.dhikrMinutes += 1;
            else if (activeCategory === 'retreat') next.retreatMinutes += 1;
            else if (activeCategory === 'journal') next.journalMinutes += 1;
            else next.growthMinutes += 1; // General / Self building
            
            localStorage.setItem('timeStats', JSON.stringify(next));
            return next;
          });

          // Sync directly to Firestore matching categories securely
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, 'users', user.uid);
            const categoryUpdates: any = {
              totalMinutes: increment(1)
            };
            if (activeCategory === 'nasheed') categoryUpdates.nasheedMinutes = increment(1);
            else if (activeCategory === 'dhikr') categoryUpdates.dhikrMinutes = increment(1);
            else if (activeCategory === 'retreat') categoryUpdates.retreatMinutes = increment(1);
            else if (activeCategory === 'journal') categoryUpdates.journalMinutes = increment(1);
            else categoryUpdates.growthMinutes = increment(1);

            updateDoc(userRef, categoryUpdates).catch(err => {
              console.warn("Failed to sync minute to firestore:", err);
            });
          }
        }
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeCategory, currentSessionMinutes]);

  return (
    <TimeTrackingContext.Provider value={{
      stats,
      currentSessionMinutes,
      currentSessionSeconds,
      activeCategory,
      setActiveCategory
    }}>
      {children}
    </TimeTrackingContext.Provider>
  );
}

export function useTimeTracking() {
  const context = useContext(TimeTrackingContext);
  if (context === undefined) {
    throw new Error('useTimeTracking must be used within a TimeTrackingProvider');
  }
  return context;
}
