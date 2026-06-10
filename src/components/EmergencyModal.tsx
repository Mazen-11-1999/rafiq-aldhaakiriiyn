import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Heart, RefreshCw, X, ShieldAlert, CheckCircle2, Flame, Eye, Lock, Brain } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSuccess?: () => void;
}

export default function EmergencyModal({ isOpen, onClose, onConfirmSuccess }: EmergencyModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathCount, setBreathCount] = useState(0);
  const [breathTimer, setBreathTimer] = useState(4);
  const [activeShockMsg, setActiveShockMsg] = useState(0);

  const [checkedActions, setCheckedActions] = useState({
    closePhone: false,
    wudu: false,
    repent: false
  });

  const shockMessages = [
    {
      title: "الحقيقة العارية",
      body: "ألهذا الحد هان الله جل جلاله عليك في خلوتك ليكون أهون الناظرين إليك؟! تفكر جيداً، اللذة ستموت في ثوانٍ، وتترك بؤساً ووحشة وظلاماً يُخيم على وجهك وصدرك لأيام."
    },
    {
      title: "فخ التشتيت وفتنة الهواتف",
      body: "خلف هذه الشاشة الباردة عباقرة وشركات تبذل مليارات الدولارات لشل عقلك وتغفيل عفتك وجعلك عبداً لشهوة عابرة لتسليب عزمك عن صلاة الفجر. أنت لست دمية بأيديهم، بل رجل حر ذو كرامة ورسالة!"
    },
    {
      title: "سؤال المصير",
      body: "لو دهمك الموت وقبض ملك الموت روحك في هذه اللحظىة، أيسرك أن يُختم لقلبك على تصفح ذنب رخيص أم ترجو أن يراك ربك بطلاً ثابتاً غض بصرة واعتصم لله؟"
    }
  ];

  const quranVerses = [
    { text: "أَلَمْ يَعْلَم بِأَنَّ اللَّهَ يَرَى", surah: "سورة العلق - الآية ١٤", meaning: "صفعة وعي تهز الوجدان وتذكر بمكانة الله العظيم الناظر إليك." },
    { text: "يَعْلَمُ خَائِنَةَ الْأَعْيُنِ وَمَا تُخْفِي الصُّدُورُ", surah: "سورة غافر - الآية ١٩", meaning: "يعلم النظرة العابرة المتململة التي تختلسها عينك وميل قلبك الخبيء." },
    { text: "إِنَّ السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ كُلُّ أُولَئِكَ كَانَ عَنْهُ مَسْئُولًا", surah: "سورة الإسراء - الآية ٣٦", meaning: "جوارحك أمانة وقطعة مستعارة، وستشهد عليك يوم السؤال." }
  ];

  const toggleAction = (key: 'closePhone' | 'wudu' | 'repent') => {
    setCheckedActions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Breathing loop logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 3 && breathPhase !== 'idle') {
      interval = setInterval(() => {
        setBreathTimer(prev => {
          if (prev <= 1) {
            // transition to next phase
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 4;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 4;
            } else if (breathPhase === 'exhale') {
              setBreathPhase('inhale');
              setBreathCount(c => c + 1);
              return 4;
            }
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, breathPhase]);

  if (!isOpen) return null;

  const handleStartBreathing = () => {
    setBreathPhase('inhale');
    setBreathTimer(4);
    setBreathCount(0);
  };

  const handleFinish = () => {
    if (onConfirmSuccess) {
      onConfirmSuccess();
    }
    // reset state
    setStep(1);
    setBreathPhase('idle');
    setBreathCount(0);
    setCheckedActions({ closePhone: false, wudu: false, repent: false });
    onClose();
  };

  const allChecked = checkedActions.closePhone && checkedActions.wudu && checkedActions.repent;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99] flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md overflow-y-auto" dir="rtl">
        {/* Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-red-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-emerald-500/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-sm md:max-w-md bg-slate-900 border border-slate-800 rounded-[2rem] p-5 md:p-6 shadow-2xl overflow-hidden text-right text-slate-100"
        >
          {/* Close Button - Compact */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
          >
            <X size={16} />
          </button>

          {/* Core Title */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500 shrink-0 animate-pulse">
              <ShieldAlert size={18} />
            </div>
            <div>
              <span className="text-[9px] font-black text-rose-400 uppercase tracking-wider block">المدد الطارئ وعصمة النفس</span>
              <h3 className="text-sm font-bold text-white">حصن العفة العاجل</h3>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-1.5 mb-6">
            <div className={cn("h-1 rounded-full transition-all duration-300 flex-1", step >= 1 ? "bg-red-500" : "bg-slate-800")} />
            <div className={cn("h-1 rounded-full transition-all duration-300 flex-1", step >= 2 ? "bg-red-500" : "bg-slate-800")} />
            <div className={cn("h-1 rounded-full transition-all duration-300 flex-1", step >= 3 ? "bg-emerald-500" : "bg-slate-800")} />
            <div className={cn("h-1 rounded-full transition-all duration-300 flex-1", step >= 4 ? "bg-emerald-500" : "bg-slate-800")} />
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Shock Messages */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-red-950/20 border border-red-500/10 p-4 rounded-2xl relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-red-500/20 text-red-400 font-black px-2 py-0.5 rounded-md">
                      صدمة الوعي {activeShockMsg + 1} من {shockMessages.length}
                    </span>
                    <span className="text-red-500 text-xs gap-1 flex items-center">
                      <Flame size={14} /> فتنة النفس والنساء
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-black text-white mb-1.5">
                    {shockMessages[activeShockMsg].title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {shockMessages[activeShockMsg].body}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <button
                    onClick={() => setActiveShockMsg((activeShockMsg + 1) % shockMessages.length)}
                    className="p-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded-xl text-xs font-bold text-slate-400 cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} />
                    <span>رسالة أخرى</span>
                  </button>

                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-600/10 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>التالي لقرآن العصمة</span>
                    <Eye size={12} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Divine Warnings */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="text-center text-[10px] text-slate-500 font-bold tracking-wider">
                    آيات قرآنية مهلكة ومذلة لشهوة النفس الأمارة بالسوء
                  </div>

                  {quranVerses.map((verse, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-1.5">
                      <p className="text-sm font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fad796] to-white text-center leading-relaxed">
                        " {verse.text} "
                      </p>
                      <div className="flex justify-between items-center text-[9px] text-slate-500">
                        <span>{verse.surah}</span>
                        <span className="font-medium text-emerald-500/80">{verse.meaning}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setStep(1)}
                    className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    ← العودة للوعي
                  </button>
                  <button
                    onClick={() => {
                      setStep(3);
                      handleStartBreathing();
                    }}
                    className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/10 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>البدء بتمرين تنفس العصمة</span>
                    <Brain size={12} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Interactive Chest/Mind Breathing Reset */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-[#8da399]">تمرين التنفس العصبي لتبريد الشهوة</h4>
                    <p className="text-[10px] text-slate-400">تنفس الأحرار يقتل الرغبة الهرمونية ويفصلك عن تشتتك</p>
                  </div>

                  {/* Circle Breathing Ring */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Ring Pulse Animation */}
                    <motion.div 
                      animate={{
                        scale: breathPhase === 'inhale' ? [1, 1.4] : breathPhase === 'hold' ? 1.4 : breathPhase === 'exhale' ? [1.4, 1] : 1,
                      }}
                      transition={{ duration: 4, ease: "linear" }}
                      className={cn(
                        "absolute inset-0 rounded-full border-4 opacity-50",
                        breathPhase === 'inhale' && "border-emerald-500",
                        breathPhase === 'hold' && "border-blue-500",
                        breathPhase === 'exhale' && "border-rose-500",
                        breathPhase === 'idle' && "border-slate-800"
                      )}
                    />
                    
                    <div className="text-center z-10 space-y-1">
                      <span className="text-xs font-black text-white uppercase tracking-widest block">
                        {breathPhase === 'inhale' && "🌬️ شَهيق ببطء"}
                        {breathPhase === 'hold' && "🛡️ اِحبس وتأمل ورع"}
                        {breathPhase === 'exhale' && "🕌 زَفير واستعذ"}
                        {breathPhase === 'idle' && "نائم"}
                      </span>
                      <span className="text-2xl font-black text-white block">{breathTimer}</span>
                      <span className="text-[8px] text-slate-400 font-bold">دورة: {breathCount} / ٣</span>
                    </div>
                  </div>

                  <div className="bg-[#4e635a]/5 border border-[#4e635a]/10 p-2.5 rounded-xl text-center w-full">
                    {breathPhase === 'inhale' && (
                      <p className="text-xs font-medium text-emerald-300">أدخل الأوكسجين النقي واشعر بنور عفة عينك وقلبك</p>
                    )}
                    {breathPhase === 'hold' && (
                      <p className="text-xs font-medium text-blue-300">استشعر نظر الجبار ورعايته وحصنك الدفين</p>
                    )}
                    {breathPhase === 'exhale' && (
                      <p className="text-xs font-medium text-rose-300">أخرج الهواء مع قول: "أعوذ بالله من الشيطان الرجيم"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setBreathPhase('idle');
                      setStep(2);
                    }}
                    className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    ← قرآن العصمة
                  </button>

                  <button
                    onClick={() => {
                      setBreathPhase('idle');
                      setStep(4);
                    }}
                    className={cn(
                      "px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1",
                      breathCount >= 3 
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-750"
                    )}
                  >
                    <span>ميثاق التعهد العملي</span>
                    <Lock size={12} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Pledge Actions Checklist */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 font-extrabold">الآن.. انهض كالعنقاء وطبق خطوات الفوز فوراً:</p>

                  <button
                    onClick={() => toggleAction('closePhone')}
                    className={cn(
                      "w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer",
                      checkedActions.closePhone
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/55"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📱</span>
                      <span className="text-xs font-bold">قفل شاشتك حالاً وضع الهاتف مقلوباً</span>
                    </div>
                    {checkedActions.closePhone ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> : <div className="w-3.5 h-3.5 border-2 border-slate-700 rounded-full shrink-0" />}
                  </button>

                  <button
                    onClick={() => toggleAction('wudu')}
                    className={cn(
                      "w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer",
                      checkedActions.wudu
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/55"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🧊</span>
                      <span className="text-xs font-bold">توضّأ بالماء البارد فوراً لتبريد الشهوات</span>
                    </div>
                    {checkedActions.wudu ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> : <div className="w-3.5 h-3.5 border-2 border-slate-700 rounded-full shrink-0" />}
                  </button>

                  <button
                    onClick={() => toggleAction('repent')}
                    className={cn(
                      "w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer",
                      checkedActions.repent
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/55"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🕌</span>
                      <span className="text-xs font-bold">صلّ ركعتين خاشعتين في خفاء لكسر الوساوس</span>
                    </div>
                    {checkedActions.repent ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" /> : <div className="w-3.5 h-3.5 border-2 border-slate-700 rounded-full shrink-0" />}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setStep(3)}
                    className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    ← تمرين التنفس
                  </button>

                  <button
                    onClick={handleFinish}
                    disabled={!allChecked}
                    className={cn(
                      "px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5",
                      allChecked
                        ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-600/20"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
                    )}
                  >
                    <span>عاهدت ربي وأقفلت هاتفي لله</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
