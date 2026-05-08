
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const ringtone = RINGTONES.find(r => r.id === selectedRingtoneId) || DEFAULT_RINGTONE;
      const audio = new Audio(ringtone.url);
      audio.loop = true;
      audio.volume = 0.6;
      audioRef.current = audio;

      const attemptPlay = async () => {
        try {
          await audio.play();
        } catch (err) {
          console.error('Audio play failed, waiting for user interaction:', err);
          
          const playOnInteraction = async () => {
            try {
              if (audioRef.current && isOpen) {
                await audioRef.current.play();
                window.removeEventListener('click', playOnInteraction);
                window.removeEventListener('touchstart', playOnInteraction);
              }
            } catch (e) {
              console.error('Playback still blocked', e);
            }
          };
          
          window.addEventListener('click', playOnInteraction);
          window.addEventListener('touchstart', playOnInteraction);
        }
      };

      attemptPlay();

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
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
