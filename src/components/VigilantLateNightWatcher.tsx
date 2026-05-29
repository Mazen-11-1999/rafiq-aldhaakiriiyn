import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Eye, ShieldAlert, Sparkles, Heart, Lock, X, BedDouble, HelpCircle } from 'lucide-react';

interface VigilantLateNightWatcherProps {
  noorDays: number;
  setNoorDays: React.Dispatch<React.SetStateAction<number>>;
}

export default function VigilantLateNightWatcher({ noorDays, setNoorDays }: VigilantLateNightWatcherProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentHour, setCurrentHour] = useState<number>(0);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');
  const [actionStage, setActionStage] = useState<'initial' | 'weakness' | 'victory' | 'dua'>('initial');

  useEffect(() => {
    const checkLateNight = () => {
      const now = new Date();
      const hour = now.getHours();
      setCurrentHour(hour);
      
      const timeStr = now.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setCurrentTimeStr(timeStr);

      // Late night is defined as 11:30 PM (23:30) to 4:30 AM (4:30)
      const isLate = hour >= 23 || hour < 5;
      
      // We only show it once per late-night session using session storage
      const hasShownTonight = sessionStorage.getItem('sanad_late_night_checked');
      
      if (isLate && !hasShownTonight) {
        setIsOpen(true);
        sessionStorage.setItem('sanad_late_night_checked', 'true');
      }
    };

    // Run check on mount
    checkLateNight();

    // Check periodically every minute
    const interval = setInterval(checkLateNight, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="w-full max-w-lg bg-slate-900 border border-indigo-500/20 rounded-[35px] shadow-2xl p-6 md:p-8 text-right relative overflow-hidden text-slate-100"
        >
          {/* Subtle cosmic background glowing circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-rose-500/5 blur-3xl rounded-full" />

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 left-6 w-9 h-9 bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition cursor-pointer"
          >
            <X size={18} />
          </button>

          {actionStage === 'initial' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center animate-pulse">
                  <Moon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black font-serif text-indigo-200">سند يطرق الباب في عتمة الليل</h3>
                  <p className="text-xs text-indigo-400/80 font-bold">حارس خلوة السحر والضمير المستيقظ</p>
                </div>
              </div>

              <div className="bg-indigo-950/40 p-5 rounded-2xl border border-indigo-500/20 text-center">
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full mb-2 inline-block">
                  الساعة الآن: {currentTimeStr}
                </span>
                <p className="text-sm font-semibold text-indigo-100 leading-relaxed font-serif mt-2">
                  "يا رفيقي الساهر.. لقد تركتَ عناء اليوم وخلوت بجوالك في سكون هذا الليل. الله تبارك وتعالى ينظر لصدق سريرتك ويرى خفايا حواسك. ماذا تفعل الآن غيباً؟ هل تفعل شيئاً غلطاً يحزن قلبك ويعكر عفتك؟"
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setActionStage('weakness')}
                  className="w-full p-4 bg-gradient-to-r from-rose-900/40 to-red-950/40 hover:from-rose-900/60 hover:to-red-950/60 border border-rose-500/30 text-rose-200 rounded-2xl font-black text-xs text-right transition cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert size={16} className="text-rose-400 animate-bounce" />
                    أشعر بضعف أو ميل للغلط والتشتت (أنقذني يا سند!)
                  </span>
                  <span className="text-red-400">⚓</span>
                </button>

                <button
                  onClick={() => setActionStage('victory')}
                  className="w-full p-4 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-200 rounded-2xl font-black text-xs text-right transition cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-400" />
                    لا يا سند! الحمد لله، بنيتي الخالصة أبني مستقبلي أو أسبح وأقرأ!
                  </span>
                  <span className="text-indigo-400">✨</span>
                </button>

                <button
                  onClick={() => setActionStage('dua')}
                  className="w-full p-4 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 text-slate-300 rounded-2xl font-black text-xs text-right transition cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Heart size={16} className="text-rose-400" />
                    ذكّرني بالله وأرشدني إلى سبل دعاء السحر المطهر قلبي.
                  </span>
                  <span>🕌</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 font-bold italic leading-relaxed">
                "إن الرجال الصادقين يحمون عيونهم غيباً من استعباد شاشات الضياع إرضاءً لرب العالمين."
              </p>
            </div>
          )}

          {actionStage === 'weakness' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-rose-950 pb-4">
                <div className="w-10 h-10 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="font-serif font-black text-rose-200">طوق طهارة يوسف بن الرد الجميل</h4>
                  <p className="text-[10px] text-rose-400 font-bold">لا تبرر لنفسك فخ الغفلة يا صاحبي</p>
                </div>
              </div>

              <div className="space-y-4 text-sm font-semibold text-slate-200 leading-relaxed">
                <p>
                  وقفتك هذه بصدق والاعتراف بضعفك هي أولى عتبات التوبة والانتصار على كيد الشيطان السائل غيباً! تذكر جيداً:
                </p>
                
                <div className="bg-rose-950/20 p-4 rounded-2xl border border-rose-500/10 space-y-3">
                  <div className="flex gap-2 text-xs">
                    <span className="text-rose-400">🛡️</span>
                    <p className="font-bold text-slate-300">
                      كل نظرة أو تتبع للتوافه والفتن في خلوتك تسرق سلام قلبك، وتطفئ نور بصيرتك وعزة نفسك، وتتركك مهزوماً مكسور الصدر غداً.
                    </p>
                  </div>

                  <div className="flex gap-2 text-xs">
                    <span className="text-emerald-400">💧</span>
                    <p className="font-bold text-slate-300">
                      قم فوراً، اترك هاتفك هذا خارج الغرفة، اغسله عنك بوضوء طهور هادئ، واكبر ركعتين في عتمة غرفتك لله وحده، واصنع لنفسك سند شرف.
                    </p>
                  </div>
                </div>

                <blockquote className="border-r-4 border-emerald-500 pr-4 text-emerald-400 font-serif font-black text-center my-4 py-1 text-sm bg-emerald-950/30 p-2 rounded-l-xl">
                  {`"قَالَ مَعَاذَ اللَّهِ ۖ إِنَّهُ رَبِّي أَحْسَنَ مَثْوَايَ ۖ إِنَّهُ لَا يُفْلِحُ الظَّالِمُونَ"`}
                </blockquote>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setActionStage('initial');
                  }}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl font-bold text-xs cursor-pointer transition"
                >
                  إغلاق وتجنب الشاشة
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setActionStage('initial');
                    // Increment patience constraint count to reward them
                  }}
                  className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-black text-xs cursor-pointer transition shadow-md"
                >
                  ✓ عاهدت ربي وسأغلق الجوال الآن طائعاً
                </button>
              </div>
            </div>
          )}

          {actionStage === 'victory' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-indigo-950 pb-4">
                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="animate-spin-slow" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-indigo-200">هنيئاً لنقاء سريرتك الغيبية</h4>
                  <p className="text-[10px] text-indigo-400 font-bold">بينك وبين الله صلة نور صادقة</p>
                </div>
              </div>

              <div className="space-y-4 text-sm font-semibold text-slate-200 leading-relaxed text-center">
                <p className="text-indigo-300 text-base font-black">
                  مباركٌ هذا الثبات والرزانة يا رجل اليوم الصادق! 👏
                </p>
                <p className="text-xs text-slate-300">
                  إن عمارة وقت السحر بالبناء النافع وبمقاومة استعباد الشاشات تعادل في ميزان الله الفتح والجهاد الشريف لنفسك ودينك.
                </p>

                <div className="p-4 bg-indigo-950/30 rounded-2xl border border-indigo-500/10 inline-block font-bold">
                  🌱 "تم تقييم صمودك بنجاح.. وتدعيم ميثاق طهارة بصيرتك لليلة جديدة!"
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setNoorDays(prev => prev + 1);
                    setIsOpen(false);
                    setActionStage('initial');
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs cursor-pointer transition shadow-lg text-center"
                >
                  +1 إضافة ليلة طهارة لعزيمتي وجرد حياتي
                </button>
              </div>
            </div>
          )}

          {actionStage === 'dua' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-emerald-950 pb-4">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                  <Heart size={20} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif font-black text-emerald-200">رَوْح وريحان ونظام السحر الطاهر</h4>
                  <p className="text-[10px] text-emerald-400 font-bold">دعاء يغسل القلب ويحصن خلوتك في السر</p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-200 leading-relaxed text-right">
                <p className="text-sm font-bold text-slate-300">دعاء يوسف عليه السلام والصالحين للتحصين والعفة:</p>
                
                <div className="bg-emerald-950/30 p-4 rounded-2xl border border-emerald-500/10 space-y-3 font-serif leading-loose text-center text-sm text-emerald-300">
                  <p className="italic">
                    "اللَّهُمَّ طَهِّرْ قَلْبِي، وَحَصِّنْ فَرْجِي، وَغُضَّ بَصَرِي، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ فِتْنَةِ النِّسَاءِ وَمِنْ شَرِّ سَمْعِي وَبَصَرِي وَقَلْبِي غَيْبَاً.. يَا حَيُّ يَا قَيُّومُ، سَلِّطْ عَلَى نَفْسِي عِفَّةَ الأَنْبِيَاءِ وَصَمْتَ الأَتْقِيَاءِ وَعِزَّةَ الأَشْرَافِ بِنُورِكَ."
                  </p>
                </div>

                <div className="bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700">
                  <h5 className="font-black text-indigo-300 mb-1">💡 نصيحة سند العملية لليل طاهر:</h5>
                  <p className="text-slate-300 leading-relaxed">
                    من نام طاهراً بوضوء وتخلى عن تطبيقات الضياع (سوشيال ميديا وتيك توك) قبل نومه بساعة، يستيقظ نشيطاً ذا نفس طيبة وبظهر مفرود غداً، بفضل من الله ومشيئته.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setActionStage('initial');
                  }}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-black text-xs cursor-pointer transition text-center"
                >
                  سأقول هذا الدعاء بقلبي وأذهب للنوم طاهراً، شكراً يا سند
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
