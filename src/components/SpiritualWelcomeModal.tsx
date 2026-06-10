import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

interface SpiritualWelcomeModalProps {
  onUnderstand: () => void;
}

export default function SpiritualWelcomeModal({ onUnderstand }: SpiritualWelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('isSpiritualIntroSeen_v2');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('isSpiritualIntroSeen_v2', 'true');
    setIsOpen(false);
    onUnderstand();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl" dir="rtl">
        {/* Ambient background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800/80 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-black/60 text-right overflow-hidden"
        >
          {/* Spiritual Corner Accents */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[80px]" />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                <Heart size={24} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase block">ميثاق التغيير الصادق</span>
                <h3 className="text-xl font-bold font-serif text-white">بيان الصدق والجهاد</h3>
              </div>
            </div>

            <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/50 space-y-4">
              <p className="text-sm font-bold text-emerald-300 leading-relaxed font-serif">
                أهلاً بك يا أخي الكريم..
              </p>
              <p className="text-[#a8b7b0] text-sm leading-relaxed font-medium">
                إن التغيير الحقيقي ليس مجرد <strong className="text-white">"عدادات"</strong> نضغط عليها أو مظاهر نتباهى بها، بل هو <strong className="text-[#fad796]">جهاد يومي صادق</strong> بين النفس وخالقها، مبني على الصدق التام، والوعي بالدين كمنهج حياة، والابتعاد عن الرياء والتشتت البصري والفكري.
              </p>
            </div>

            <div className="text-xs text-[#72857b] font-medium leading-relaxed bg-[#4e635a]/5 p-3.5 rounded-xl border border-[#4e635a]/10">
              💡 جعلنا هذا التنبيه أول بوابات دخولك حتى يبقى الهدف من مكوثك هنا خالصاً لوجه الله، بعيداً عن زيف الأرقام وبهرج المنافسة الفارغة.
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>عاهدت الله واستعنت به لكي أبدأ بصدق 🌅</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
