import React, { createContext, useContext, useState, useEffect } from 'react';

interface Challenge {
  id: string;
  text: string;
  source: string; // e.g., 'story', 'nasheed', 'ai'
  acceptedAt: number;
  completedAt?: number;
}

interface ChallengeContextType {
  activeChallenge: Challenge | null;
  acceptChallenge: (text: string, source: string, id?: string) => void;
  completeChallenge: () => void;
  dismissChallenge: () => void;
  history: Challenge[];
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [history, setHistory] = useState<Challenge[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('activeChallenge');
    if (saved) {
      setActiveChallenge(JSON.parse(saved));
    }
    const savedHistory = localStorage.getItem('challengeHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (activeChallenge) {
      localStorage.setItem('activeChallenge', JSON.stringify(activeChallenge));
    } else {
      localStorage.removeItem('activeChallenge');
    }
  }, [activeChallenge]);

  useEffect(() => {
    localStorage.setItem('challengeHistory', JSON.stringify(history));
  }, [history]);

  const acceptChallenge = (text: string, source: string, id?: string) => {
    const newChallenge: Challenge = {
      id: id || `${Date.now()}`,
      text,
      source,
      acceptedAt: Date.now(),
    };
    setActiveChallenge(newChallenge);
  };

  const completeChallenge = () => {
    if (activeChallenge) {
      const completed = { ...activeChallenge, completedAt: Date.now() };
      setHistory(prev => [completed, ...prev]);
      setActiveChallenge(null);
    }
  };

  const dismissChallenge = () => {
    setActiveChallenge(null);
  };

  return (
    <ChallengeContext.Provider value={{
      activeChallenge,
      acceptChallenge,
      completeChallenge,
      dismissChallenge,
      history
    }}>
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenges() {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenges must be used within a ChallengeProvider');
  }
  return context;
}
