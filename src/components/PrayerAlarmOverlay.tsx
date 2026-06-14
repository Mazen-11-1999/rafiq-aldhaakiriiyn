
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
  const synthRef = useRef<{ stop: () => void } | null>(null);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

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
        'https://audio.islamweb.net/audio/download.php?audioid=206930',
        'https://audio.islamweb.net/audio/download.php?audioid=434647',
        'https://audio.islamweb.net/audio/download.php?audioid=400474',
        'https://audio.islamweb.net/audio/download.php?audioid=319938',
        'https://audio.islamweb.net/audio/download.php?audioid=425434',
        'https://audio.islamweb.net/audio/download.php?audioid=428892',
        'https://audio.islamweb.net/audio/download.php?audioid=432210',
        'https://media.assabile.com/assabile/adhan_3435370/82e70e435a79.mp3',
        'https://media.assabile.com/assabile/adhan_3435370/495dea4f4ea5.mp3',
        'https://media.assabile.com/assabile/adhan_3435370/f30b7631d625.mp3'
      ];

      let fallbackIndex = 0;
      let synthContext: AudioContext | null = null;

      const startSynthesizer = () => {
        if (synthRef.current || !isOpen) return;
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContextClass) {
            console.error('Web Audio API not supported');
            return;
          }
          const ctx = new AudioContextClass();
          synthContext = ctx;
          let active = true;
          let intervalId: any = null;
          
          const playBeep = () => {
            if (!active) return;
            
            // If context is suspended (autoplay block), try to resume
            if (ctx.state === 'suspended') {
              ctx.resume().catch(() => {});
            }

            const now = ctx.currentTime;
            
            // Dual-tone peaceful chime
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(329.63, now); // E4
            
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(493.88, now); // B4 (Fifth)
            
            const currentVolume = isMutedRef.current ? 0 : 0.15;
            gainNode.gain.setValueAtTime(currentVolume, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
            
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 2.0);
            osc2.stop(now + 2.0);
            
            intervalId = setTimeout(playBeep, 2500);
          };
          
          playBeep();
          
          synthRef.current = {
            stop: () => {
              active = false;
              if (intervalId) clearTimeout(intervalId);
              ctx.close().catch(() => {});
            }
          };
          console.log('Spiritual synthesized chime started active fallback.');
          setAudioError("تم تفعيل المنبه الروحاني الاحتياطي (وضع عدم الاتصال)");
        } catch (err) {
          console.error('Failed to start synthesized chime:', err);
        }
      };

      const handleAudioError = () => {
        if (!isOpen) return;

        if (fallbackIndex < fallbacks.length) {
          const nextFallback = fallbacks[fallbackIndex];
          fallbackIndex++;
          
          console.log(`Trying fallback (${fallbackIndex}/${fallbacks.length}): ${nextFallback}`);
          if (audioRef.current) {
            audioRef.current.src = nextFallback;
            audioRef.current.load();
            
            if (!isBlocked) {
              audioRef.current.play().catch((err) => {
                 if (err.name === 'NotAllowedError') {
                   setIsBlocked(true);
                 } else {
                   console.warn('Fallback play failed, attempting next fallback.');
                   handleAudioError();
                 }
              });
            }
          }
        } else {
          setAudioError("تعذر الاتصال بملفات الأذان الخارجية. تشغيل المنبه المحلي الآمن..");
          console.error('All remote audio fallbacks failed, initiating synthesizer.');
          startSynthesizer();
        }
      };

      audio.addEventListener('error', handleAudioError);

      const attemptPlay = async () => {
        if (!audioRef.current || !isOpen) return;
        try {
          setIsBlocked(false);
          setAudioError(null);
          await audio.play();
        } catch (err: any) {
          if (err.name === 'NotAllowedError') {
            setIsBlocked(true);
          } else if (err.name === 'AbortError') {
             console.log('Playback aborted (likely due to track change or component close)');
          } else {
             console.warn('Initial play failed, trying fallback:', err.message);
             handleAudioError();
          }
          
          const playOnInteraction = async () => {
            try {
              if (isOpen) {
                if (synthContext && synthContext.state === 'suspended') {
                  synthContext.resume().catch(() => {});
                }
                if (audioRef.current) {
                  if (audioRef.current.error || !audioRef.current.src) {
                     handleAudioError();
                  } else {
                     await audioRef.current.play();
                     setIsBlocked(false);
                     setAudioError(null);
                     cleanupEvents();
                  }
                } else {
                  // If audioRef is null but modal is open, attempt synthesizer
                  startSynthesizer();
                  setIsBlocked(false);
                  cleanupEvents();
                }
              }
            } catch (e: any) {
              if (e.name !== 'NotAllowedError' && e.name !== 'AbortError') {
                console.error('Playback failed after interaction:', e.message);
                if (fallbackIndex < fallbacks.length) {
                  handleAudioError();
                } else {
                  startSynthesizer();
                  setIsBlocked(false);
                  cleanupEvents();
                }
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
        if (synthRef.current) {
          synthRef.current.stop();
          synthRef.current = null;
        }
      };
    }
  }, [isOpen, selectedRingtoneId]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.stop();
      synthRef.current = null;
    }
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
