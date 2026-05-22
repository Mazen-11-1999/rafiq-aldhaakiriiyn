import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Heart, RefreshCw, X, ShieldAlert, CheckCircle2, PhoneOff } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSuccess?: () => void;
}

export default function EmergencyModal({ isOpen, onClose, onConfirmSuccess }: EmergencyModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({
    closePhone: false,
    wudu: false,
    repent: false
  });

  if (!isOpen) return null;

  const toggleAction = (key: string) => {
    setCheckedActions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleConfirm = () => {
    if (onConfirmSuccess) {
      onConfirmSuccess();
    }
    // Reset state
    setStep(1);
    setCheckedActions({ closePhone: false, wudu: false, repent: false });
    onClose();
  };

  const allChecked = checkedActions.closePhone && checkedActions.wudu && checkedActions.repent;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl" dir="rtl">
        {/* Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-black/80 overflow-hidden text-right text-slate-100"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 left-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
          >
            <X size={20} />
          </button>

          {/* Step Indicator */}
          <div className="flex items-center gap-1 mb-8">
            <div className={cn("h-1.5 rounded-full transition-all duration-300", step >= 1 ? "w-8 bg-rose-500" : "w-2 bg-slate-700")} />
            <div className={cn("h-1.5 rounded-full transition-all duration-300", step >= 2 ? "w-8 bg-rose-500" : "w-2 bg-slate-700")} />
            <div className={cn("h-1.5 rounded-full transition-all duration-300", step >= 3 ? "w-8 bg-rose-500" : "w-2 bg-slate-700")} />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/5">
                    <ShieldAlert size={24} className="animate-bounce" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-rose-400 block tracking-widest">صدمة الوعي اللحظية</span>
                    <h3 className="text-xl md:text-2xl font-black font-serif text-white">قف مكانك يا رفيقي ولنلتقط أنفاسنا</h3>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-8 rounded-[2.5rem] border border-slate-800/80 text-center space-y-4">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-wider">سِر الآية التي تهز الجبال</p>
                  <blockquote className="text-2xl md:text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-amber-200 to-rose-300 select-none py-2 tracking-wide leading-relaxed">
                    " أَلَمْ يَعْلَم بِأَنَّ اللَّهَ يَرَى "
                  </blockquote>
                  <div className="h-[1px] w-12 bg-rose-500/30 mx-auto" />
                  <p className="text-sm font-bold text-slate-300 leading-relaxed">
                    إن الله تبارك وتعالى ينظر بعين الرحمة والحنان إلى قلبك الضعيف الآن، وينتظر منك توبة ووقفة بطولة تكسر بها كيد الشيطان في هذه العتمة.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-6">
                  <span className="text-slate-500 text-xs font-bold">تذكر: لست وحدك، وسندك معك دائمًا</span>
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-600/20 transition-all flex items-center gap-2"
                  >
                    <span>أنا معك.. حدّثني من القلب</span>
                    <Sparkles size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                    <Heart size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-400 block tracking-widest">رسالة سرّية من أخٍ مخلص</span>
                    <h3 className="text-xl md:text-2xl font-black font-serif text-white">أنت لست مجرد مُستهلك عابر!</h3>
                  </div>
                </div>

                <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed p-6 bg-slate-950/40 rounded-3xl border border-slate-800 font-medium">
                  <p className="font-bold text-amber-300">
                    يا صاحبي، اسمعني بقلبك..
                  </p>
                  <p>
                    خلف هذه الشاشة الباردة، هناك شركات ضخمة تدفع مليارات الدولارات لسبب واحد بس: يسرقوا عينك ووقتك وطاقتك ويشغلوك عن صلاتك. هم لا تهمهم عفتك، ولا مستقبلك، ولا تهمهم صلاة الفجر التي تفرح بها قلب والديك ونبيك!
                  </p>
                  <p>
                    أنت لست سلعة رخيصة في أيدي صناع التفاهة، أنت رجل حر كريم... متعة الذنب تتبخر في ثواني وتترك وراءها ضيق وخنقة وبؤس، لكن متعة الانتصار على النفس بتعطيك هيبة ونور يدوم.
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors"
                  >
                    ← العودة لآية الوعي
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2"
                  >
                    <span>أرشدني لخطوات النجاة الآن</span>
                    <Shield size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Shield size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-400 block tracking-widest">ميثاق الأحرار وعوض الله</span>
                    <h3 className="text-xl md:text-2xl font-black font-serif text-white">الرجولــة شيم وعفــة عيـن</h3>
                  </div>
                </div>

                <div className="p-6 bg-emerald-950/30 border border-emerald-500/10 rounded-3xl text-emerald-200">
                  <p className="font-black text-center text-lg md:text-xl font-serif">
                    " اترك الهاتف الآن لله، وسيُعوضك الله نوراً في قلبك ويقينًا تسعد به في الدنيا والآخرة! "
                  </p>
                </div>

                {/* Checklist Actions */}
                <div className="space-y-3">
                  <div className="text-xs font-black text-slate-500 block">قم بالخطوات الـ 3 العملية فوراً:</div>

                  <button
                    onClick={() => toggleAction('closePhone')}
                    className={cn(
                      "w-full text-right p-4 rounded-2xl border transition-all flex items-center justify-between gap-3",
                      checkedActions.closePhone
                        ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-inner"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50"
                    )}
                  >
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-xl">📱</span>
                      <span className="text-sm font-bold">قفل الشاشة فوراً واقلب التلفون على وجهه.</span>
                    </div>
                    {checkedActions.closePhone ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> : <div className="w-[18px] h-[18px] border-2 border-slate-700 rounded-full shrink-0" />}
                  </button>

                  <button
                    onClick={() => toggleAction('wudu')}
                    className={cn(
                      "w-full text-right p-4 rounded-2xl border transition-all flex items-center justify-between gap-3",
                      checkedActions.wudu
                        ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-inner"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50"
                    )}
                  >
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-xl">🧊</span>
                      <span className="text-sm font-bold">تقوم الآن تتوضأ وتغسل وجهك بماء بارد (عشان تطفئ نار الشهوة).</span>
                    </div>
                    {checkedActions.wudu ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> : <div className="w-[18px] h-[18px] border-2 border-slate-700 rounded-full shrink-0" />}
                  </button>

                  <button
                    onClick={() => toggleAction('repent')}
                    className={cn(
                      "w-full text-right p-4 rounded-2xl border transition-all flex items-center justify-between gap-3",
                      checkedActions.repent
                        ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-inner"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50"
                    )}
                  >
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-xl">🕌</span>
                      <span className="text-sm font-bold">اذكر ربك أو صلي ركعتين خاشعتين تكسر بها وسوسة الشيطان تماماً.</span>
                    </div>
                    {checkedActions.repent ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> : <div className="w-[18px] h-[18px] border-2 border-slate-700 rounded-full shrink-0" />}
                  </button>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="text-slate-500 hover:text-slate-300 text-xs font-bold transition-colors"
                  >
                    ← العودة للحديث المخلص
                  </button>

                  <button
                    onClick={handleConfirm}
                    disabled={!allChecked}
                    className={cn(
                      "px-8 py-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center gap-2",
                      allChecked
                        ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-emerald-600/30"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none"
                    )}
                  >
                    <PhoneOff size={16} />
                    <span>عاهدت ربي وأغلقت هاتفي لله</span>
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
