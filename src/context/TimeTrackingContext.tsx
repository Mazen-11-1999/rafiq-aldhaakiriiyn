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

  // Initialize from LocalStorage (fast)
  useEffect(() => {
    const savedStats = localStorage.getItem('timeStats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(prev => ({
          ...prev,
          ...parsed,
          growthMinutes: parsed.growthMinutes || 0
        }));
      } catch (e) {
        console.error("Failed to parse saved stats", e);
      }
    }
  }, []);

  // Sync with Firestore (Real Truth)
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setStats(prev => ({
            ...prev,
            beneficialMinutes: data.totalMinutes || prev.beneficialMinutes,
            dhikrMinutes: data.dhikrMinutes || prev.dhikrMinutes,
            nasheedMinutes: data.nasheedMinutes || prev.nasheedMinutes,
            retreatMinutes: data.retreatMinutes || prev.retreatMinutes,
            journalMinutes: data.journalMinutes || prev.journalMinutes,
            growthMinutes: data.growthMinutes || prev.growthMinutes,
          }));
        }
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
