import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, CheckCircle2, Target, X, Loader2, Sparkles, AlertCircle, Quote } from 'lucide-react';
import { getTrackInsight, Insight } from '../services/insightService';
import { cn } from '../lib/utils';

interface InsightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  trackTitle: string;
  trackArtist: string;
}

export default function InsightPanel({ isOpen, onClose, trackTitle, trackArtist }: InsightPanelProps) {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen && trackTitle) {
      generateInsight();
    }
  }, [isOpen, trackTitle]);

  const generateInsight = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getTrackInsight(trackTitle, trackArtist);
      setInsight(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-[#fbf9f6] rounded-t-[40px] z-[70] shadow-2xl overflow-hidden border-t border-white/50"
            dir="rtl"
          >
            <div className="p-8 pb-12 max-h-[85vh] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4e635a] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#4e635a]/20">
                    <Heart size={24} fill="white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1b1c1a] font-serif tracking-tight">كلام من القلب</h2>
                    <p className="text-sm text-[#4e635a]/60 font-sm max-w-xs">أنا هنا لأعلمك مفاهيم الامور وأخذ العبره في كل شيء في حياتك قد تمر به .</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-black/5 rounded-2xl transition-colors text-[#4e635a]"
                >
                  <X size={24} />
                </button>
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 size={40} className="text-[#4e635a]" />
                  </motion.div>
                  <p className="text-[#4e635a] font-medium animate-pulse italic">جاري استخراج العبر والدروس من القصة...</p>
                </div>
              ) : error ? (
                <div className="py-12 text-center space-y-4">
                  <AlertCircle size={40} className="mx-auto text-red-400" />
                  <p className="text-[#655d51]">عذراً، حدث خطأ أثناء الاتصال بالمرشد الرقمي.</p>
                  <button 
                    onClick={generateInsight}
                    className="bg-[#4e635a] text-white px-6 py-2 rounded-xl"
                  >
                    حاول مرة أخرى
                  </button>
                </div>
              ) : insight && (
                <div className="space-y-8">
                  {/* Core Message */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/60 p-8 rounded-[30px] border border-white/50 shadow-sm relative"
                  >
                    <div className="absolute top-4 left-4 opacity-10">
                      <Quote size={40} />
                    </div>
                    <div className="flex items-center gap-3 mb-4 text-[#4e635a]">
                      <Heart size={20} fill="#4e635a" />
                      <span className="font-bold text-sm uppercase tracking-wider">حديث الروح</span>
                    </div>
                    <p className="text-xl font-serif text-[#1b1c1a] leading-relaxed italic">
                      {insight.coreMessage}
                    </p>
                  </motion.div>

                  {/* Modern Lessons */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#4e635a]">
                      <Sparkles size={20} />
                      <span className="font-bold text-sm uppercase tracking-wider">كيف نطبق هذا في يومنا؟</span>
                    </div>
                    <div className="grid gap-3">
                      {insight.modernLessons.map((lesson, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-[#4e635a]/5 p-4 rounded-2xl border border-[#4e635a]/10 flex items-start gap-4"
                        >
                          <span className="w-6 h-6 bg-[#4e635a] text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-[#1b1c1a] font-medium leading-relaxed">{lesson}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Practical Challenge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#4e635a] p-8 rounded-[35px] text-white shadow-xl shadow-[#4e635a]/20 relative overflow-hidden group"
                  >
                    <div className="flex items-center gap-3 mb-3 opacity-90">
                      <Target size={20} />
                      <span className="font-bold text-sm uppercase tracking-wider">تحدي العمل (اليوم)</span>
                    </div>
                    <p className="text-xl font-bold mb-6">
                      {insight.practicalChallenge}
                    </p>
                    <button 
                      onClick={onClose}
                      className="w-full bg-white text-[#4e635a] py-4 rounded-2xl font-black text-lg hover:bg-white/90 transition-colors shadow-lg"
                    >
                      سأقوم بذلك بإذن الله
                    </button>
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
