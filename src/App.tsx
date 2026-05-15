import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle, db, getRedirectResult } from './lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { UserProfile, OperationType, ChatMessage } from './types';
import { handleFirestoreError } from './lib/firestore-errors';
import RetreatView from './components/RetreatView';
import DhikrView from './components/DhikrView';
import InsightsView from './components/InsightsView';
import JournalView from './components/JournalView';
import StoriesView from './components/StoriesView';
import QuizView from './components/QuizView';
import HistoryMapView from './components/HistoryMapView';
import JourneyMapView from './components/JourneyMapView';
import DailyInspiration from './components/DailyInspiration';
import ProfileView from './components/ProfileView';
import NasheedView from './components/NasheedView';
import HabitTracker from './components/HabitTracker';
import EthicsView from './components/EthicsView';
import NotificationManager from './components/NotificationManager';
import Background3D from './components/Background3D';
import ChallengeWidget from './components/ChallengeWidget';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Compass, ListChecks, PieChart, VolumeX, Settings, User, BookOpen, Book, Map, HelpCircle, Music, Scale } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [user, loading, error] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<'retreat' | 'dhikr' | 'stories' | 'habits' | 'ethics' | 'nasheeds' | 'history' | 'journey' | 'quiz' | 'journal' | 'insights' | 'profile'>('retreat');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sanad_chat');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sanad_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.warn("Geolocation denied or failed. Prayer times may be inaccurate.", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          if (!data.settings) {
            data.settings = {
              notifications: { 
                enabled: true, 
                dhikrReminders: true, 
                retreatReminders: true, 
                prayerTimes: true, 
                ringtone: 'official-prayer' 
              },
              privacy: { publicProfile: false, shareInsights: true },
              appearance: { language: 'ar', dateFormat: 'arabic' }
            };
          }
          setUserProfile(data);
        } else {
          const createInitialProfile = async () => {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'ضيف',
              photoURL: user.photoURL || '',
              createdAt: serverTimestamp(),
              totalMinutes: 0,
              totalSessions: 0,
              currentStreak: 0,
              settings: {
                notifications: {
                  enabled: true,
                  dhikrReminders: true,
                  retreatReminders: true,
                  prayerTimes: true,
                  ringtone: 'official-prayer',
                },
                privacy: {
                  publicProfile: false,
                  shareInsights: true,
                },
                appearance: {
                  language: 'ar',
                  dateFormat: 'arabic',
                }
              }
            };
            try {
              await setDoc(userRef, newProfile);
            } catch (e) {
              handleFirestoreError(e, OperationType.WRITE, 'users/' + user.uid);
            }
          };
          createInitialProfile();
        }
      }, (e) => {
        console.warn("Could not fetch profile from server, using local defaults if available.", e);
        setUserProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'ضيف',
          photoURL: user.photoURL || '',
          createdAt: new Date(),
          totalMinutes: 0,
          currentStreak: 0,
        });
      });

      return () => unsubscribe();
    }
  }, [user]);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Redirect sign-in successful', result.user);
        }
      } catch (e: any) {
        console.error('Redirect result error:', e);
        if (e.code === 'auth/unauthorized-domain') {
          setLoginError('هذا النطاق غير مصرح به في إعدادات Firebase. يرجى إضافة النطاق الحالي إلى القائمة المسموح بها في وحدة تحكم Firebase (Firebase Console).');
        } else {
          setLoginError('خطأ أثناء إكمال تسجيل الدخول: ' + (e.message || 'خطأ غير معروف'));
        }
      }
    };
    checkRedirect();
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      console.error('Login Error:', e);
      if (e.code === 'auth/popup-blocked') {
        setLoginError('تم حظر النافذة المنبثقة. يرجى تفعيل النوافذ المنبثقة أو فتح التطبيق في علامة تبويب جديدة من الزر في الأعلى.');
      } else if (e.code === 'auth/unauthorized-domain') {
        setLoginError('هذا النطاق غير مصرح به في إعدادات Firebase. يرجى إضافة النطاق الحالي إلى القائمة المسموح بها.');
      } else {
        setLoginError('فشل تسجيل الدخول: ' + (e.message || 'خطأ غير معروف'));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const updateProfileStats = async (minutesToAdd: number) => {
    if (!user || !userProfile) return;
    
    const userRef = doc(db, 'users', user.uid);
    const newTotalMinutes = userProfile.totalMinutes + minutesToAdd;
    const newTotalSessions = (userProfile.totalSessions || 0) + 1;
    
    // Streak logic
    const lastActiveDate = userProfile.lastActiveDate?.toDate ? userProfile.lastActiveDate.toDate() : new Date(userProfile.lastActiveDate || 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActive = new Date(lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let newStreak = userProfile.currentStreak;
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1; // Reset if missed a day
    } else if (userProfile.currentStreak === 0) {
      newStreak = 1;
    }

    try {
      await updateDoc(userRef, {
        totalMinutes: newTotalMinutes,
        totalSessions: newTotalSessions,
        currentStreak: newStreak,
        lastActiveDate: serverTimestamp()
      });
      
      // Update local state is handled by onSnapshot in useEffect
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users/' + user.uid);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf9f6]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-16 h-16 bg-[#4e635a] rounded-full blur-xl"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbf9f6] p-6 text-center perspective-1000 overflow-hidden relative selection:bg-[#4e635a]/20">
        {/* Responsive High-Fidelity 3D Archway Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#fbf9f6] flex items-center justify-center">
          {/* Floor / Platform - Adjusted for better contrast */}
          <div className="absolute bottom-0 w-full h-[30%] bg-white/60 border-t border-white/40 z-[1] shadow-[0_-10px_30px_rgba(0,0,0,0.02)]" />
          
          {/* Perspective Container */}
          <div className="relative w-full h-full flex items-center justify-center perspective-2000 preserve-3d">
            {/* 1. Deepest Background Light */}
            <div className="absolute w-[40vw] h-[40vh] bg-white rounded-t-full blur-[80px] opacity-100 translate-y-[-15%]" />

            {/* 2. Successive Arches - Adjusted for Mobile Scale (using % instead of vw/vh where appropriate) */}
            
            {/* Level 5: Pure White / Lightest (The End of the Tunnel) */}
            <div className="absolute w-[30%] h-[40%] border-[20px] md:border-[40px] border-[#fdfcfb] rounded-t-full translate-z-[-800px] translate-y-[-5%]" />
            
            {/* Level 4: Warm Off-White / Beige */}
            <div className="absolute w-[45%] h-[55%] border-[30px] md:border-[60px] border-[#f5f2eb] rounded-t-full translate-z-[-600px] translate-y-[-5%] shadow-inner" />

            {/* Level 3: Frosted Glass / Translucent Arches */}
            <div className="absolute w-[65%] h-[75%] border-[40px] md:border-[80px] border-white/40 backdrop-blur-sm rounded-t-full translate-z-[-400px] translate-y-[-5%] ring-1 ring-white/20" />

            {/* Level 2: Middle Greenish Arches */}
            <div className="absolute w-[85%] h-[95%] border-[50px] md:border-[100px] border-[#7a8c82]/30 rounded-t-full translate-z-[-200px] translate-y-[-5%]" />

            {/* Level 1: Deep Green Foreground Arches (Primary Frame) - Adjusted to be further out */}
            <div className="absolute w-[120%] h-[120%] border-[60px] md:border-[150px] border-[#4e635a] rounded-t-full shadow-[inset_0_0_100px_rgba(0,0,0,0.4)] translate-y-[-5%] z-0" />

            {/* Global Light Diffusion Layer */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#fbf9f6]/40 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Content Layer - Elevated and Z-indexed for visibility */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md space-y-10 z-20 relative pointer-events-auto"
        >
          <div className="space-y-6 flex flex-col items-center">
             <motion.div 
               whileHover={{ scale: 1.1, rotate: 5 }}
               initial={{ rotate: 12, opacity: 0, y: 20 }}
               animate={{ rotate: 12, opacity: 1, y: 0 }}
               className="w-20 h-20 md:w-24 md:h-24 bg-[#4e635a] rounded-[28px] flex items-center justify-center text-white shadow-2xl relative overflow-hidden group"
             >
               <Compass size={40} className="md:size-48" />
               <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             </motion.div>
             
             <div className="space-y-3">
               <motion.h1 
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="text-5xl md:text-6xl font-black text-[#4e635a] font-serif tracking-tight drop-shadow-md"
               >
                 رفيق الذاكرين
               </motion.h1>
               <motion.p 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="text-[#655d51] text-lg md:text-xl font-medium px-4 leading-relaxed line-clamp-2 md:line-clamp-none overflow-hidden"
               >
                 خلك قريب من ذكر الله.. وخلّ رفيق الذاكرين بيدك وين ما كنت.
               </motion.p>
             </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-3d p-8 md:p-12 rounded-[40px] md:rounded-[50px] shadow-[0_30px_60px_rgba(0,0,0,0.1)] space-y-8 border-t border-white/60 border-b-4 border-b-[#4e635a]/10 relative overflow-hidden"
          >
            <div className="space-y-3">
              <p className="text-2xl md:text-3xl font-serif font-black text-[#1b1c1a]">مرحباً بالرفيق</p>
              <p className="text-[#424845] font-medium opacity-80">ابدأ يومك بقلب مطمئن.. تفضل بالدخول</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 bg-[#4e635a] text-white py-5 rounded-[22px] font-black text-lg md:text-xl hover:bg-[#3d4d46] transition-all disabled:opacity-50 shadow-lg shadow-[#4e635a]/20 cursor-pointer"
            >
              <LogIn size={24} />
              {isLoggingIn ? 'جاري تسجيل الدخول...' : 'ابدأ رحلة السكون'}
            </motion.button>
            
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100"
              >
                {loginError}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a] flex flex-col font-sans relative overflow-hidden perspective-1000" dir="rtl">
      <Background3D />
      
      <NotificationManager 
        enabled={userProfile?.settings?.notifications.enabled ?? false} 
        prayerEnabled={userProfile?.settings?.notifications.prayerTimes ?? false}
        coords={coords}
        userProfile={userProfile}
      />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 glass-3d border-b-0 m-2 rounded-[25px] w-[calc(100%-1rem)] mx-auto top-2 shadow-2xl">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
            className="w-10 h-10 bg-[#4e635a] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4e635a]/20"
          >
            <Compass size={22} />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tighter text-[#4e635a] font-serif">رفيق الذاكرين</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "p-2 rounded-xl transition-all",
              activeTab === 'profile' ? "bg-[#4e635a] text-white shadow-lg" : "text-[#4e635a] hover:bg-white/50"
            )}
          >
            <Settings size={20} />
          </button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('profile')}
            className={cn(
              "w-10 h-10 rounded-xl overflow-hidden border-2 shadow-sm transition-all",
              activeTab === 'profile' ? "border-[#4e635a] shadow-[#4e635a]/30 scale-110" : "border-white"
            )}
          >
            <img 
              src={user.photoURL || ''} 
              alt={user.displayName || ''} 
              className="w-full h-full object-cover" 
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-28 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'retreat' && (
            <motion.div
              key="retreat"
              initial={{ opacity: 0, rotateY: 90, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, x: -100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="h-full"
            >
              <RetreatView 
                userProfile={userProfile} 
                chatMessages={chatMessages} 
                setChatMessages={setChatMessages} 
              />
            </motion.div>
          )}
          {activeTab === 'dhikr' && (
            <motion.div
              key="dhikr"
              initial={{ opacity: 0, rotateY: 90, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, x: -100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <DhikrView onSessionComplete={updateProfileStats} />
            </motion.div>
          )}
          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, rotateY: 90, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, x: -100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <JournalView userProfile={userProfile} />
            </motion.div>
          )}
          {activeTab === 'stories' && (
            <motion.div
              key="stories"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <StoriesView />
            </motion.div>
          )}
          {activeTab === 'habits' && (
            <motion.div
              key="habits"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <HabitTracker />
            </motion.div>
          )}
          {activeTab === 'ethics' && (
            <motion.div
              key="ethics"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <EthicsView />
            </motion.div>
          )}
          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <QuizView />
            </motion.div>
          )}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <HistoryMapView />
            </motion.div>
          )}
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, rotateY: 90, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, x: -100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <InsightsView userProfile={userProfile} />
            </motion.div>
          )}
          {activeTab === 'journey' && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <JourneyMapView userProfile={userProfile} />
            </motion.div>
          )}
          {activeTab === 'nasheeds' && (
            <motion.div
              key="nasheeds"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
            >
              <NasheedView />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <ProfileView userProfile={userProfile} onTabChange={setActiveTab} />
            </motion.div>
          )}
        </AnimatePresence>
        <DailyInspiration userProfile={userProfile} />
        <ChallengeWidget />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center h-20 glass-3d rounded-[2.5rem] px-2 w-[calc(100%-2rem)] max-w-[650px] overflow-x-auto scrollbar-hide preserve-3d shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-1 min-w-max px-2">
          <NavItem 
            active={activeTab === 'retreat'} 
            onClick={() => setActiveTab('retreat')} 
            icon={<Compass size={22} />} 
            label="الرئيسية" 
          />
          <NavItem 
            active={activeTab === 'dhikr'} 
            onClick={() => setActiveTab('dhikr')} 
            icon={<ListChecks size={22} />} 
            label="ذكر" 
          />
          <NavItem 
            active={activeTab === 'stories'} 
            onClick={() => setActiveTab('stories')} 
            icon={<BookOpen size={20} />} 
            label="قصص" 
          />
          <NavItem 
            active={activeTab === 'habits'} 
            onClick={() => setActiveTab('habits')} 
            icon={<ListChecks size={22} />} 
            label="المنهج" 
          />
          <NavItem 
            active={activeTab === 'ethics'} 
            onClick={() => setActiveTab('ethics')} 
            icon={<Scale size={22} />} 
            label="الميزان" 
          />
          <NavItem 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<Book size={20} />} 
            label="السيرة" 
          />
          <NavItem 
            active={activeTab === 'nasheeds'} 
            onClick={() => setActiveTab('nasheeds')} 
            icon={<Music size={22} />} 
            label="أناشيد" 
          />
          <NavItem 
            active={activeTab === 'insights'} 
            onClick={() => setActiveTab('insights')} 
            icon={<PieChart size={22} />} 
            label="إحصائيات" 
          />
          <NavItem 
            active={activeTab === 'journey'} 
            onClick={() => setActiveTab('journey')} 
            icon={<Map size={22} />} 
            label="رحلتك" 
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center transition-all duration-300 min-w-[3rem] md:min-w-[4rem] h-14 rounded-2xl group outline-none",
        active ? "text-[#4e635a]" : "text-[#727875] hover:text-[#4e635a]/70"
      )}
    >
      <AnimatePresence>
        {active && (
          <motion.div 
            layoutId="nav-pill"
            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
            className="absolute inset-0 bg-[#4e635a]/10 rounded-2xl -z-10"
          />
        )}
      </AnimatePresence>
      
      <motion.div
        animate={active ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
        className="relative"
      >
        {icon}
        {active && (
          <motion.div
            layoutId="active-dot"
            className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#4e635a] rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          />
        )}
      </motion.div>
      
      <span className={cn(
        "text-[9px] font-bold mt-1 transition-all",
        active ? "opacity-100 scale-100" : "opacity-60 scale-90"
      )}>
        {label}
      </span>

      {active && (
        <motion.div
          layoutId="bottom-indicator"
          className="absolute -bottom-1 w-1 h-1 bg-[#4e635a] rounded-full"
        />
      )}
    </button>
  );
}
