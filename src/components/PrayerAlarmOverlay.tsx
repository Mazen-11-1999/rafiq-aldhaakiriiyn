
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Volume2, VolumeX, X, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { RINGTONES, DEFAULT_RINGTONE } from '../constants';

interface PrayerAlarmProps {
  prayerName: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  selectedRingtoneId?: string;
}

export default function PrayerAlarmOverlay({ prayerName, message, isOpen, onClose, selectedRingtoneId }: PrayerAlarmProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAudioError(null);
      setIsBlocked(false);
      const ringtone = RINGTONES.find(r => r.id === selectedRingtoneId) || DEFAULT_RINGTONE;
      
      const audio = new Audio(ringtone.url);
      audio.loop = true;
      audio.volume = 0.6;
      audioRef.current = audio;

      const fallbacks = [
        'https://ia800100.us.archive.org/30/items/nasheed_adel/Salawat.mp3',
        'https://ia800904.us.archive.org/30/items/IslamicRingtones_201306/Spirit.mp3',
        'https://ia801308.us.archive.org/19/items/Takbeerat_201708/Takbeerat.mp3', // تكبيرات العيد الهادئة والمستقرة
        'https://ia800100.us.archive.org/30/items/nasheed_adel/Beep.mp3', // جرس هادئ احتياطي
        'https://ia804703.us.archive.org/4/items/BeautifulAdhan/Beautiful%20Adhan%20-Mukhtar%20Al-Shareef.mp3' // أذان عذب عالي الأمان والاستقرار
      ];

      let fallbackIndex = 0;

      const handleAudioError = () => {
        if (!audioRef.current || !isOpen) return;

        if (fallbackIndex < fallbacks.length) {
          const nextFallback = fallbacks[fallbackIndex];
          fallbackIndex++;
          
          console.log(`Trying fallback (${fallbackIndex}/${fallbacks.length}): ${nextFallback}`);
          audioRef.current.src = nextFallback;
          audioRef.current.load();
          
          // Only attempt play if not blocked, otherwise wait for interaction
          if (!isBlocked) {
            audioRef.current.play().catch((err) => {
               if (err.name === 'NotAllowedError') {
                 setIsBlocked(true);
               }
            });
          }
        } else {
          setAudioError("عذراً، تعذر تحميل صوت التنبيه حالياً");
          console.error('All audio fallbacks failed');
        }
      };

      audio.addEventListener('error', handleAudioError);

      const attemptPlay = async () => {
        if (!audioRef.current || !isOpen) return;
        try {
          // Reset state before play
          setIsBlocked(false);
          setAudioError(null);
          await audio.play();
        } catch (err: any) {
          if (err.name === 'NotAllowedError') {
            setIsBlocked(true);
          } else if (err.name === 'AbortError') {
             console.log('Playback aborted (likely due to track change or component close)');
          } else {
             // If it failed because of source error, handleAudioError will trigger via listener
             console.warn('Initial play failed:', err.message);
             // handleAudioError() is already attached to 'error' event
          }
          
          const playOnInteraction = async () => {
            try {
              if (audioRef.current && isOpen) {
                // If it was in error state, try to reload first
                if (audioRef.current.error || !audioRef.current.src) {
                   handleAudioError();
                }
                await audioRef.current.play();
                setIsBlocked(false);
                setAudioError(null);
                cleanupEvents();
              }
            } catch (e: any) {
              if (e.name !== 'NotAllowedError' && e.name !== 'AbortError') {
                console.error('Playback failed after interaction:', e.message);
                handleAudioError();
              }
            }
          };
          
          const cleanupEvents = () => {
            window.removeEventListener('click', playOnInteraction);
            window.removeEventListener('touchstart', playOnInteraction);
            window.removeEventListener('keydown', playOnInteraction);
          };

          window.addEventListener('click', playOnInteraction);
          window.addEventListener('touchstart', playOnInteraction);
          window.addEventListener('keydown', playOnInteraction);
        }
      };

      attemptPlay();

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleAudioError);
          audioRef.current.pause();
          audioRef.current = null;
        }
        window.removeEventListener('click', () => {}); // Just in case
      };
    }
  }, [isOpen, selectedRingtoneId]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleStop = () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const savedFalah = localStorage.getItem(`falah_completed_${todayStr}`);
      let falahCompleted: Record<string, boolean> = {};
      if (savedFalah) {
        falahCompleted = JSON.parse(savedFalah);
      }

      if (!falahCompleted['falah-prayers']) {
        falahCompleted['falah-prayers'] = true;
        localStorage.setItem(`falah_completed_${todayStr}`, JSON.stringify(falahCompleted));

        const savedFalahStats = localStorage.getItem('falah_habits_stats');
        let falahStats = { streak: 0, total: 0 };
        if (savedFalahStats) {
          falahStats = JSON.parse(savedFalahStats);
        }
        const newFalahStats = {
          total: falahStats.total + 1,
          streak: falahStats.streak + 1
        };
        localStorage.setItem('falah_habits_stats', JSON.stringify(newFalahStats));

        // Dispatch custom event to notify components to reload Falah data
        window.dispatchEvent(new Event('falah-updated'));
      }
    } catch (e) {
      console.error("Error setting falah-prayers on stop alarm:", e);
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#1b1c1a]/95 backdrop-blur-3xl"
        >
          <div className="relative w-full max-w-lg">
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-gradient-to-br from-[#4e635a] to-[#2a3631] p-12 rounded-[60px] text-center text-white shadow-2xl border border-white/10 overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-400/20 blur-[100px] rounded-full pointer-events-none" />

              <div className="mb-12 relative inline-block">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [-5, 5, -5] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20"
                >
                  <Bell size={40} className="text-yellow-400" />
                </motion.div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles size={24} className="text-yellow-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-6 mb-12">
                <h2 className="text-5xl font-serif font-bold tracking-tight">صلاة {prayerName}</h2>
                <p className="text-xl text-white/70 leading-relaxed font-medium">
                  {message}
                </p>
                {audioError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 py-2 px-4 rounded-xl text-red-200 text-sm flex items-center justify-center gap-2"
                  >
                    <VolumeX size={16} />
                    <span>{audioError}</span>
                  </motion.div>
                )}
                {isBlocked && !audioError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-yellow-500/20 border border-yellow-500/30 py-2 px-4 rounded-xl text-yellow-100 text-sm flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Volume2 size={16} />
                    <span>انقر في أي مكان لتشغيل الصوت</span>
                  </motion.div>
                )}
                <div className="flex items-center justify-center gap-2 pt-4">
                    <div className="h-px w-8 bg-white/20" />
                    <Heart size={14} className="text-red-400 fill-red-400/20" />
                    <div className="h-px w-8 bg-white/20" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleStop}
                  className="w-full py-6 rounded-[30px] bg-white text-[#1b1c1a] text-2xl font-black shadow-xl hover:bg-yellow-400 transition-all transform active:scale-95"
                >
                  توقف - سأقوم للصلاة الآن
                </button>
                
                <div className="flex items-center justify-center gap-6">
                    <button 
                      onClick={toggleMute}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-white/50 hover:text-white"
                    >
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                    <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                        <ShieldCheck size={14} />
                        <span>حافظ على صلواتك</span>
                    </div>
                </div>
              </div>

              {/* Islamic Quote Decor */}
              <div className="mt-12 opacity-20 text-[10px] font-serif italic max-w-xs mx-auto">
                "أقم الصلاة لذكري"
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
