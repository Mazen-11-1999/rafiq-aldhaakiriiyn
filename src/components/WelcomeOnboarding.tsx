import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, Volume2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WelcomeOnboardingProps {
  onComplete: () => void;
}

export default function WelcomeOnboarding({ onComplete }: WelcomeOnboardingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    // Check if user has already seen the onboarding
    const hasSeen = localStorage.getItem('hasSeenWelcomeOnline');
    if (!hasSeen) {
      setIsOpen(true);
    } else {
      onComplete();
    }
    
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, [onComplete]);

  const handleStartAndUnlock = async () => {
    setIsActivating(true);
    
    // 1. Play a quick silent/quiet audio to unlock autoplay on this device
    try {
      // Use the beautiful official adhan at a very minimal volume briefly, then pause
      const audio = new Audio('https://audio.islamweb.net/audio/download.php?audioid=206930');
      audio.volume = 0.05;
      await audio.play();
      setTimeout(() => {
        try {
          audio.pause();
        } catch (e) {}
      }, 500);
    } catch (err) {
      console.warn("Autoplay audio unlock failed:", err);
    }

    // 2. Request notification permissions
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPermissionState(res);
      } catch (err) {
        console.warn("Notification request failed:", err);
      }
    }

    setIsActivating(false);
    setStep(2);
  };

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcomeOnline', 'true');
    setIsOpen(false);
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-[#fcfbf9] to-[#f5f3ef] rounded-3xl p-6 md:p-8 shadow-2xl border border-[#4e635a]/10 overflow-hidden text-[#1b1c1a]"
        >
          {/* Visual ambience background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4e635a]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

          {step === 1 ? (
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Modern elegant icon container */}
              <div className="relative p-4 bg-[#4e635a]/10 rounded-2xl text-[#4e635a]">
                <Volume2 size={36} className="animate-pulse" />
                <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5 text-white">
                  <Sparkles size={10} />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#4e635a] tracking-tight">
                  أهلاً بك في تطبيق "سند" الروحاني ✨
                </h2>
                <p className="text-[#4e635a]/80 text-sm font-medium leading-relaxed max-w-sm mx-auto">
                  منهج إيماني متكامل ومساعد ذكي يرافقك خطوة بخطوة في رحلة الفلاح والتزكية والتقرب إلى الله بصدق ويقين.
                </p>
              </div>

              {/* Crucial Info Card */}
              <div className="w-full bg-[#4e635a]/5 border border-[#4e635a]/10 rounded-2xl p-4 text-right space-y-2">
                <h4 className="text-xs font-black text-[#4e635a] flex items-center justify-end gap-1.5 leading-none">
                  <span>تنشيط الأصوات ومنبهات الأذان</span>
                  <ShieldCheck size={14} />
                </h4>
                <p className="text-[11px] leading-relaxed text-[#4e635a]/80 font-bold">
                  لمنح المتصفح الإذن الكامل لتشغيل منبهات الأذان بصوتها الشجي فورا وتلقائيا في أوقاتها المحددة دون أن يتم حجبها، يُشترط تفاعل المستخدم مع الشاشة مرة واحدة. بالضغط على الزر أدناه سيتم تنشيط نظام الصوت ليعمل معك بدقة تامة وبلا عقبات.
                </p>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartAndUnlock}
                disabled={isActivating}
                className="w-full py-4 text-sm font-black text-white bg-[#4e635a] rounded-2xl shadow-xl shadow-[#4e635a]/20 flex items-center justify-center gap-2 hover:bg-[#3d4f47] transition-all cursor-pointer border border-white/10"
              >
                {isActivating ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    جاري تنشيط النظام الصوتي...
                  </span>
                ) : (
                  <>
                    <Volume2 size={16} />
                    <span>تفعيل التنبيهات والأصوات وجولتي الروحية</span>
                  </>
                )}
              </motion.button>
              
              <p className="text-[10px] text-[#4e635a]/60 font-medium">
                بضغطة واحدة ستحصل على تجربة تفاعلية وبصرية متكاملة وآمنة تماماً.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Completed Screen Icon */}
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-600">
                <CheckCircle2 size={42} className="scale-110" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-emerald-700 tracking-tight">
                  تم تنشيط طريقتك بنجاح! 🎉
                </h2>
                <p className="text-[#4e635a]/80 text-sm font-medium leading-relaxed max-w-sm mx-auto">
                  جهازك الآن جاهز لاستقبال منبهات الأذان وأوراد الذكر الشجية، وسوف يعمل تطبيقك بأعلى كفاءة روحية وعملية وجمال.
                </p>
              </div>

              {/* Short summary info */}
              <div className="w-full bg-[#4e635a]/5 border border-[#4e635a]/10 rounded-2xl p-4 text-right space-y-2.5">
                <div className="text-[11px] font-bold text-[#4e635a]/90 space-y-1.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <span>حالة منبهات الأذن: <strong>مفعلة وتلقائية</strong></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <span>أذونات المتصفح: <strong>تم تجاوز القيود بنجاح</strong></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Dismiss Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="w-full py-4 text-sm font-black text-white bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all cursor-pointer border border-white/10"
              >
                الدخول للرواق الإيماني والبدء الجميل ✨
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
