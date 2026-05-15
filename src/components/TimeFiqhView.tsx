import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, TrendingUp, Sparkles, X, Info, Zap, Calendar, Heart, Shield } from 'lucide-react';
import { useTimeTracking } from '../context/TimeTrackingContext';

const TimeFiqhView: React.FC = () => {
  const { stats, activeCategory } = useTimeTracking();
  const [showInfo, setShowInfo] = useState(false);
  const [viewSeconds, setViewSeconds] = useState(0);
  const mountTime = React.useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - mountTime.current) / 1000);
      setViewSeconds(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeWisdoms = [
    "نعمتان مغبون فيهما كثير من الناس: الصحة والفراغ",
    "اغتنم وقتك قبل أن ينقضي، وعمرك في ما يبني لك أثراً خالداً",
    "الوقت كالسيف، إن لم تقطعه بأعمالٍ ثمينة ومفيدة تبني بها ذاتك، قطعك في الغفلة والتسويف",
    "أعظم طاعة لله هي أن تستثمر عمرك في كل ما هو نافع وجميل",
    "قيمة عمرك تكمن في ما تنجزه من خير ونفع للناس ولنفسك",
    "كل ثانية تقضيها في بناء ذاتك أو نفع غيرك هي تجارة رابحة مع الله",
    "أنت دقائق مجموعة، إذا ذهبت دقيقة ذهب جزء من كيانك، فكن شحيحاً بأنفاسك",
    "أجمل دقائق العمر هي التي ترحل وقد تركت خلفها قلباً مطمئناً وعقلاً مستنيراً"
  ];

  // Rotate wisdom every minute
  const currentWisdom = timeWisdoms[Math.floor(viewSeconds / 60) % timeWisdoms.length];

  const totalBeneficial = stats.beneficialMinutes;
  
  // Format total seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pb-32 px-6 pt-20 space-y-8 overflow-y-auto scrollbar-hide">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-[#4e635a] text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-[#4e635a]/20"
        >
          <Clock size={40} />
        </motion.div>
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-[#4e635a] font-serif tracking-tight">عمرك أغلى</h2>
          <p className="text-[#7a8c82] font-bold text-sm uppercase tracking-[0.3em]">فقه استثمار الزمن</p>
        </div>
      </div>

      {/* Real-time Session Tracker */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] p-8 border border-[#4e635a]/10 shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Zap size={120} />
        </div>

        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <span className="text-xs font-bold text-[#7a8c82] uppercase tracking-wider">الجلسة الحالية</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-bold text-[#4e635a]">نشط الآن</span>
              </div>
           </div>
           <div className="bg-[#4e635a]/5 px-4 py-2 rounded-full border border-[#4e635a]/10">
              <span className="text-xs font-bold text-[#4e635a]">
                {activeCategory === 'retreat' ? 'في خلوة' : 
                 activeCategory === 'dhikr' ? 'في ذكر' : 
                 activeCategory === 'nasheed' ? 'في استماع' : 
                 activeCategory === 'journal' ? 'في تأمل' : 'بناء الذات'}
              </span>
           </div>
        </div>

        <div className="text-center space-y-2">
           <div className="text-6xl font-black text-[#4e635a] font-mono tracking-tight tabular-nums">
             {formatTime(viewSeconds)}
           </div>
           <p className="text-xs font-bold text-[#7a8c82] uppercase tracking-[0.2em]">دقائق مستثمرة بصحبة الله</p>
        </div>

        <div className="bg-emerald-600 text-white p-5 rounded-3xl text-center shadow-lg shadow-emerald-600/20">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">أثرك الطيب الآن</p>
           <AnimatePresence mode="wait">
             <motion.p 
               key={currentWisdom}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="text-sm font-bold"
             >
               {currentWisdom}
             </motion.p>
           </AnimatePresence>
        </div>
      </motion.div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Heart size={24} className="text-red-500" />} 
          label="ذكرك لله" 
          value={stats.dhikrMinutes} 
          unit="دقيقة"
        />
        <StatCard 
          icon={<Music size={24} className="text-blue-500" />} 
          label="سكينة روحك" 
          value={stats.nasheedMinutes} 
          unit="دقيقة"
        />
        <StatCard 
          icon={<Shield size={24} className="text-indigo-500" />} 
          label="خلوتك الصادقة" 
          value={stats.retreatMinutes} 
          unit="دقيقة"
        />
        <StatCard 
          icon={<Sparkles size={24} className="text-amber-500" />} 
          label="تأملك وتفكرك" 
          value={stats.journalMinutes} 
          unit="دقيقة"
        />
        <div className="col-span-2">
          <StatCard 
            icon={<TrendingUp size={24} className="text-emerald-500" />} 
            label="بناء وعيك الذاتي" 
            value={stats.growthMinutes} 
            unit="دقيقة"
          />
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#4e635a] font-serif border-r-4 border-[#4e635a] pr-4">كيف تستثمر في نفسك؟</h3>
        <div className="bg-[#fbf9f6] p-6 rounded-[35px] border border-[#e4e2df] space-y-6">
          <p className="text-[#655d51] text-sm leading-relaxed font-bold">
            رأينا أن نغير الطريقة التي ننظر بها للوقت؛ بدلاً من أن نحزن على ما فات من "ضياع"، دعنا نفرح بما هو آتٍ من "استثمار بصحبة الله".
          </p>
          <div className="space-y-5">
             <PhilosophyPoint 
               title="فقه استثمار اللحظة" 
               text="نحن هنا لا نحسب لك مجرد دقائق، بل نعدّ لك لحظات القرب التي قضيتها في ذكره، أو خلوتك الصادقة مع نفسك، أو في استماع غذينا به روحك." 
             />
             <PhilosophyPoint 
               title="كن رفيقاً لعمرك" 
               text="الوقت هو أنت، وكل دقيقة تقضيها هنا هي خطوة واعية نحو طمأنينة أبدية، بعيداً عن صخب العالم وتشتت الأذهان." 
             />
          </div>
        </div>
      </section>

      {/* Quote / Wisdom */}
      <div className="bg-[#4e635a] p-8 rounded-[40px] text-white text-center space-y-4 relative overflow-hidden min-h-[160px] flex flex-col justify-center">
        <div className="absolute left-0 bottom-0 opacity-10">
          <Calendar size={120} />
        </div>
        <AnimatePresence mode="wait">
          <motion.p 
            key={currentWisdom}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-lg font-serif italic relative z-10 leading-relaxed"
          >
            "{currentWisdom}"
          </motion.p>
        </AnimatePresence>
        <div className="w-12 h-1 bg-white/30 mx-auto rounded-full" />
        <p className="text-xs font-bold opacity-60 tracking-wider">المنهج القويم في تقدير الزمن</p>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: number, unit: string }) => (
  <div className="bg-white p-6 rounded-[35px] border border-[#4e635a]/5 shadow-sm space-y-3">
    <div className="bg-[#fbf9f6] w-12 h-12 rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-[#7a8c82] uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-[#4e635a]">{value}</span>
        <span className="text-[10px] font-bold text-[#4e635a]/60">{unit}</span>
      </div>
    </div>
  </div>
);

const PhilosophyPoint = ({ title, text }: { title: string, text: string }) => (
  <div className="flex gap-4 items-start">
    <div className="w-2 h-2 rounded-full bg-[#4e635a] mt-2 shrink-0" />
    <div className="space-y-1">
      <p className="text-sm font-bold text-[#4e635a]">{title}</p>
      <p className="text-xs text-[#655d51] leading-relaxed">{text}</p>
    </div>
  </div>
);

const Music = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    referrerPolicy="no-referrer"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export default TimeFiqhView;
