import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Plus, Clock, Play, CircleStop } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';

export default function DhikrView({ onSessionComplete }: { onSessionComplete?: (minutes: number) => void }) {
  const [count, setCount] = useState(0);
  const [duration, setDuration] = useState(5);
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleIncrement = () => {
    if (!sessionActive && timeLeft > 0) return;

    const nextCount = count + 1;
    setCount(nextCount);
    
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }

    if (nextCount % 33 === 0) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#4e635a', '#d1e8dd']
      });
    }
  };

  const startSession = () => {
    setCount(0);
    setTimeLeft(duration * 60);
    setSessionActive(true);
  };

  const stopSession = () => {
    setSessionActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
    }
  };

  const playSystemBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.error("System beep failed:", e);
    }
  };

  const playAlarm = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.play().catch(e => {
        console.error("Alarm sound playback failed, using system beep. Error:", e instanceof Error ? e.message : String(e));
        playSystemBeep();
      });
    } else {
      playSystemBeep();
    }
  };

  useEffect(() => {
    if (sessionActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setSessionActive(false);
            playAlarm();
            if (onSessionComplete) {
              onSessionComplete(duration);
            }
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.6 }
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    stopSession();
    setCount(0);
    setTimeLeft(0);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-between p-margin-page pb-20 perspective-1000">
      <audio 
        ref={alarmAudioRef} 
        src="https://www.soundjay.com/buttons/sounds/beep-07.mp3" 
        preload="auto" 
        onError={() => {
          console.warn("Dhikr alarm audio error: Switching to secondary source");
          if (alarmAudioRef.current) {
            const fallbackSrc = "https://raw.githubusercontent.com/rafaelreis-hotmart/Audio-Files/master/notification.mp3";
            if (alarmAudioRef.current.src !== fallbackSrc) {
              alarmAudioRef.current.src = fallbackSrc;
            }
          }
        }}
      />

      <div className="text-center space-y-4 mt-8">
         <h2 className="text-[#4e635a] font-bold text-xs uppercase tracking-[0.4em] opacity-60">مسبحة رفيق الذاكرين</h2>
         <p className="text-[#1b1c1a] text-2xl font-serif font-bold">
           {sessionActive ? 'ركز في تسبيحك حتى ينتهي الوقت' : 'حدد وقت وردك المبارك'}
         </p>
         <div className="w-12 h-1 bg-[#d1e8dd] mx-auto rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {!sessionActive && timeLeft === 0 ? (
          <motion.div 
            key="config"
            initial={{ opacity: 0, translateZ: -100, rotateX: 20 }}
            animate={{ opacity: 1, translateZ: 0, rotateX: 0 }}
            exit={{ opacity: 0, translateZ: 100, rotateX: -20 }}
            className="w-full max-w-sm space-y-8 glass-3d p-10 rounded-[3rem] shadow-2xl depth-card"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="bg-[#4e635a]/10 p-4 rounded-3xl text-[#4e635a]">
                <Clock size={32} />
              </div>
              <div className="grid grid-cols-3 gap-3 w-full">
                {[1, 3, 5, 10, 15, 30].map(m => (
                  <button
                    key={m}
                    onClick={() => setDuration(m)}
                    className={cn(
                      "py-3 rounded-2xl font-bold transition-all text-sm",
                      duration === m 
                        ? "bg-[#4e635a] text-white shadow-lg scale-105" 
                        : "bg-white text-[#4e635a] border border-[#d1e8dd] hover:border-[#4e635a]/30"
                    )}
                  >
                    {m} د
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={startSession}
              className="w-full bg-[#4e635a] text-white py-5 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 hover:bg-[#3d4d46] transition-all"
            >
              <Play size={20} fill="currentColor" />
              بدء جلسة الذكر
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="active"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            className="relative flex flex-col items-center space-y-8"
          >
            {/* Timer Display */}
            <div className={cn(
              "text-5xl font-black tabular-nums transition-colors",
              timeLeft < 10 && sessionActive ? "text-red-500 animate-pulse" : "text-[#4e635a]"
            )}>
              {formatTime(timeLeft)}
            </div>

            {/* Counter Circle */}
            <div className="relative">
               <svg className="w-80 h-80 transform -rotate-90">
                 <circle
                   cx="160"
                   cy="160"
                   r="145"
                   stroke="currentColor"
                   strokeWidth="2"
                   fill="transparent"
                   className="text-[#e4e2df]"
                 />
                 <motion.circle
                   cx="160"
                   cy="160"
                   r="145"
                   stroke="currentColor"
                   strokeWidth="8"
                   fill="transparent"
                   strokeDasharray={2 * Math.PI * 145}
                   animate={{ 
                     strokeDashoffset: (2 * Math.PI * 145) * (timeLeft / (duration * 60)) 
                   }}
                   strokeLinecap="round"
                   className="text-[#4e635a]"
                   transition={{ duration: 1, ease: "linear" }}
                 />
               </svg>
               
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={count}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-9xl font-black text-[#1b1c1a] font-serif"
                    >
                      {count}
                    </motion.span>
                  </AnimatePresence>
                  {timeLeft === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#4e635a] font-bold mt-2"
                    >
                      تقبل الله منك ✨
                    </motion.div>
                  )}
               </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleIncrement}
                disabled={timeLeft === 0}
                className={cn(
                  "w-32 h-32 bg-[#4e635a] rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl transition-all",
                  timeLeft === 0 && "opacity-20 grayscale"
                )}
              >
                <Plus size={54} strokeWidth={3} />
              </motion.button>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleReset}
                  className="p-4 bg-white rounded-2xl border border-[#d1e8dd] text-[#4e635a] hover:bg-red-50 hover:text-red-600 transition-all font-bold"
                >
                  <RotateCcw size={20} />
                </button>
                {sessionActive && (
                  <button 
                    onClick={stopSession}
                    className="p-4 bg-white rounded-2xl border border-[#d1e8dd] text-red-500 hover:bg-red-50 transition-all font-bold"
                  >
                    <CircleStop size={20} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#fbf9f6] p-8 rounded-[3rem] border border-[#d1e8dd] w-full max-w-xl mx-auto shadow-sm">
        <p className="text-[#655d51] text-sm text-center leading-relaxed italic">
          "يا أيها الذين آمنوا استعينوا بالصبر والصلاة إن الله مع الصابرين"<br/>
          كل ثانية تقضيها في الذكر هي رصيد مبارك في ميزانك.
        </p>
      </div>
    </div>
  );
}
