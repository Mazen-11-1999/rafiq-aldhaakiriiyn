import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, CheckCircle2, X, Sparkles, Brain, Heart } from 'lucide-react';
import { useChallenges } from '../context/ChallengeContext';
import { cn } from '../lib/utils';

export default function ChallengeWidget() {
  const { activeChallenge, completeChallenge, dismissChallenge } = useChallenges();

  return (
    <AnimatePresence>
      {activeChallenge && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-28 left-6 right-6 md:left-auto md:right-8 md:w-96 z-[100]"
        >
          <div className="bg-[#4e635a] border-2 border-white/20 rounded-[2.5rem] shadow-2xl shadow-black/30 overflow-hidden relative group">
            {/* Background elements */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-8 -translate-y-8 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="p-6 relative z-10 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-yellow-300">
                    <Target size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-white font-black text-sm uppercase tracking-widest">تحدي المنهج</h5>
                    <p className="text-white/60 text-[10px] font-bold">مهمة عملية لتطبيق العبرة</p>
                  </div>
                </div>
                <button 
                  onClick={dismissChallenge}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                <p className="text-white text-lg font-serif font-bold leading-relaxed text-right">
                  {activeChallenge.text}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    completeChallenge();
                    // Optional: maybe fire some fireworks?
                  }}
                  className="flex-1 bg-white text-[#4e635a] py-3.5 rounded-xl font-black text-sm hover:bg-emerald-50 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  تم بحمد الله
                </button>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40">
                   {activeChallenge.source === 'story' ? <Brain size={20} /> : <Heart size={20} />}
                </div>
              </div>
            </div>
            
            {/* Progress hint */}
            <div className="h-1 bg-white/20 w-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '100%' }}
                 transition={{ duration: 10, repeat: Infinity }}
                 className="h-full bg-yellow-400/50"
               />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
