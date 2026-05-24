import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { propheticHabits, PropheticHabit } from '../data/propheticHabits';
import { 
  Wrench, Hammer, Sun, Heart, RefreshCw, Ship, 
  Target, MessageCircle, CheckCircle2, History, 
  Sparkles, Trophy, Calendar, Quote, Send, Loader2, X, EyeOff, Trash2, Music, Check, Compass, ShieldAlert, Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toggleHabitPersistence, getHabitsForDate } from '../services/recordService';
import confetti from 'canvas-confetti';

const iconMap: any = {
  Wrench, Hammer, Sun, Heart, RefreshCw, Ship, Target, MessageCircle
};

interface FalahHabit {
  id: string;
  title: string;
  category: string;
  description: string;
  practicalTip: string;
  iconName: string;
}

const falahHabitsData: FalahHabit[] = [
  {
    id: 'falah-prayers',
    title: 'المحافظة على الصلوات الخمس في وقتها',
    category: 'عمود الفلاح والبركة',
    description: 'تأدية كل صلاة فور سماع الأذان، بخشوع وتأهب كامل، مستشعراً الوقوف بين يدي ملك الملوك.',
    practicalTip: 'اضبط منبه الصلاة، عاهد نفسك ألا تؤجل الصلاة أبداً لأجل أي شاغل دنيوي أو كسل مؤقت.',
    iconName: 'Sun'
  },
  {
    id: 'falah-eyes',
    title: 'ورد غض البصر وحفظ الجوارح',
    category: 'عفة السر والوجدان',
    description: 'كف البصر بالكامل عن الحرام في الواقع وفي العالم الرقمي، ورفض صور النساء والصفحات الهابطة.',
    practicalTip: 'تذكر أن نظرة الحرام هي سهم مسموم يسلبك وقارك ونور ملامحك ولذة العبادة. كن رجلاً حراً غيوراً على دينه ونفسه.',
    iconName: 'EyeOff'
  },
  {
    id: 'falah-learn',
    title: 'عمارة الأرض وبناء الذات والعمل الشريف',
    category: 'علو الهمة وبناء المستقبل',
    description: 'تخصيص 3 ساعات يومياً لدراسة جادة، أو شغل وتطوير مهارة تبني بها مستقبلك، أو عمل شريف يملأ جيبك حلالاً.',
    practicalTip: 'الرجولة كد وتعب وطلب حلال لتكون مستقلاً مستغناءً عن الناس، جادًا في بناء بيتك ومجتمعك الصالح.',
    iconName: 'Wrench'
  },
  {
    id: 'falah-deleterot',
    title: 'تطهير القناعات وحذف برامج الفتن',
    category: 'تنقية العقل من الضوضاء',
    description: 'تطهير هاتفك تماماً من قنوات ومواقع السوشيال ميديا التي تسرق وقتك وعمرك، ومقاومة فخ التيك توك، وبرامج البثوث والدردشة الملهية، والبعد عن تضييع الوقت في التوافه.',
    practicalTip: 'احذف تطبيقات التيك توك والدردشات الصوتية والبثوث المفسدة فوراً أو تحكم بها بصرامة بالغة، مستشعراً نجاة عقلك وروحك.',
    iconName: 'Trash2'
  },
  {
    id: 'falah-listen',
    title: 'ورد الهمة السمعي',
    category: 'بناء العاطفة والشهامة',
    description: 'اسمع مادة طيبة تشحن نفسك وإيمانك وترفع همتك، وابعد تماماً عن الأغاني والمحتوى الهابط الذي فيه حب وحزن وعتاب وغيره من التفاهة التي تميت القلب والغيرة.',
    practicalTip: 'افتح قسم الأناشيد في التطبيق واستمع لنشيد إسلامي قوي يوقظ عزمك، كالمنوعات الإيمانية أو سدد يا قسام.',
    iconName: 'Music'
  },
  {
    id: 'falah-balance',
    title: 'حياتك وبيتك',
    category: 'الحياة الكريمة المتزنة',
    description: 'توازن وشهامة: إن كنت متزوجاً صُن قلب زوجتك وعاملها بحب وود وضحكة طيبة. وإن كنت عازباً فبر والديك واسعدهم، وخذ قسطاً معتدلاً من الترويح النظيف (مثل ألعاب الكمبيوتر بحدود ومن غير ما تشغلك. كافئ نفسك بعد تعب عملك).',
    practicalTip: 'لست معقداً، بل متزن. الشيطان يريدك غافلاً أو يائساً ضائعاً. قسّم وقتك برفق ووازن بين رعاية من حولك وبين ترويح نفسك النظيف.',
    iconName: 'Heart'
  }
];

// Curated authentic speaking dialetct checkins for male resolve
const shaytanReminders = [
  "الشيطان بيجيك خطوة بخطوة، بيبدأ بنظرة سهلة ويقول لك عادي تسلية، لغاية ما يهد عزمك ويضيع فرضك. اقطع عليه الحبل وكن سيد نفسك!",
  `الرجولة الحقيقية ليست مظهرًا مضللاً يجذب العيون، بل هي عينٌ تغض الطرف إجلالاً لربها وسيداً لنفسه. الرجولة أن تملك زمام قلبك وعقلك في زمن الفتن، فلا ترضى أن تكون أداة في يد الشيطان، أو ضحية لغسيل دماغ تصنعه الشاشات.

لقد أقنعوك زيفاً في المسلسلات والأفلام أن قيمتك تُقاس بعدد الفتيات من حولك، أو بمدى لهثك خلف سرابٍ يسمونه حباً وهو ليس إلا وهماً وتفاهة تستنزف عمرك وكرامتك. لا تقع في الفخ! الرجل الحقيقي لا يستمد قيمته من التفاهة، بل من ثباته.

اعتزل هذه الدراما الهابطة التي تسرق وعيك، واستثمر عقلك في ما يبنيك ويمنحك عبرة حقيقية. صلاتك في وقتها، عفتك، وسعيك الحلال.. هي هويتك الحقيقية`,
  "لو متزوج، عيش كريم مع زوجتك وتذكر إنها أمانة في رقبتك وفي بيتك. ولو عازب، اشتغل على نفسك ولا تخلي التفاهة والفتن تشتت حلمك الصادق.",
  "الحياة الحقيقية بتبدأ برضا ربك ثم استغنائك عن الخلق بالعمل الشريف. امسح كل اللي يفسدك، وعيش ناصعاً وقلبك مطمئن."
];

export default function HabitTracker({ onActivity }: { onActivity?: () => void }) {
  const [activeTab, setActiveTab] = useState<'falah' | 'prophetic'>('falah');
  const [completedToday, setCompletedToday] = useState<Record<string, boolean>>({});
  const [gratitudeEntries, setGratitudeEntries] = useState<string[]>(['', '', '']);
  const [reflection, setReflection] = useState('');
  const [activeHabit, setActiveHabit] = useState<PropheticHabit | null>(null);
  const [stats, setStats] = useState({ streak: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Falah Tracker local storage state
  const [falahCompleted, setFalahCompleted] = useState<Record<string, boolean>>({});
  const [activeFalahDetail, setActiveFalahDetail] = useState<FalahHabit | null>(null);
  const [falahStats, setFalahStats] = useState({ streak: 0, total: 0 });
  
  // Random reminder index
  const [reminderIndex, setReminderIndex] = useState(0);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function loadTodayHabits() {
      setIsLoading(true);
      try {
        // Load prophetic habits
        const habits = await getHabitsForDate(todayStr);
        const map: Record<string, boolean> = {};
        habits.forEach(h => map[h.habitId] = true);
        setCompletedToday(map);
      } catch (error) {
        console.error("Error loading habits:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTodayHabits();

    const savedStats = localStorage.getItem('prophetic_habits_stats');
    if (savedStats) setStats(JSON.parse(savedStats));

    // Load Falah habits state
    const savedFalah = localStorage.getItem(`falah_completed_${todayStr}`);
    if (savedFalah) {
      setFalahCompleted(JSON.parse(savedFalah));
    } else {
      setFalahCompleted({});
    }

    const savedFalahStats = localStorage.getItem('falah_habits_stats');
    if (savedFalahStats) {
      setFalahStats(JSON.parse(savedFalahStats));
    } else {
      setFalahStats({ streak: 0, total: 0 });
    }

    // Set a deterministic reminder based on day
    setReminderIndex(new Date().getDate() % shaytanReminders.length);
  }, [todayStr]);

  useEffect(() => {
    const handleFalahUpdated = () => {
      const savedFalah = localStorage.getItem(`falah_completed_${todayStr}`);
      if (savedFalah) {
        setFalahCompleted(JSON.parse(savedFalah));
      } else {
        setFalahCompleted({});
      }

      const savedFalahStats = localStorage.getItem('falah_habits_stats');
      if (savedFalahStats) {
        setFalahStats(JSON.parse(savedFalahStats));
      } else {
        setFalahStats({ streak: 0, total: 0 });
      }
    };

    window.addEventListener('falah-updated', handleFalahUpdated);
    return () => window.removeEventListener('falah-updated', handleFalahUpdated);
  }, [todayStr]);

  const toggleHabit = async (id: string, title: string) => {
    const isNowCompleted = !completedToday[id];
    const newState = { ...completedToday, [id]: isNowCompleted };
    setCompletedToday(newState);
    
    try {
      await toggleHabitPersistence(id, title, todayStr, isNowCompleted);
    } catch (error) {
      console.error("Error toggling habit:", error);
    }

    if (isNowCompleted) {
      const newStats = { ...stats, total: stats.total + 1, streak: stats.streak + 1 };
      setStats(newStats);
      localStorage.setItem('prophetic_habits_stats', JSON.stringify(newStats));
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
    }
    if (onActivity) onActivity();
  };

  const toggleFalahHabit = (id: string) => {
    const isNowCompleted = !falahCompleted[id];
    const newState = { ...falahCompleted, [id]: isNowCompleted };
    setFalahCompleted(newState);
    localStorage.setItem(`falah_completed_${todayStr}`, JSON.stringify(newState));

    if (isNowCompleted) {
      const newFalahStats = { 
        total: falahStats.total + 1, 
        streak: falahStats.streak + 1 
      };
      setFalahStats(newFalahStats);
      localStorage.setItem('falah_habits_stats', JSON.stringify(newFalahStats));
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      const newFalahStats = {
        total: Math.max(0, falahStats.total - 1),
        streak: Math.max(0, falahStats.streak - 1)
      };
      setFalahStats(newFalahStats);
      localStorage.setItem('falah_habits_stats', JSON.stringify(newFalahStats));
    }

    if (onActivity) onActivity();
  };

  const getFalahIcon = (iconName: string, active: boolean) => {
    const cls = active ? "text-white" : "text-[#4e635a]";
    switch (iconName) {
      case 'Sun': return <Sun className={cls} size={24} />;
      case 'EyeOff': return <EyeOff className={active ? "text-white animate-pulse" : "text-rose-600 animate-pulse"} size={24} />;
      case 'Wrench': return <Wrench className={cls} size={24} />;
      case 'Trash2': return <Trash2 className={active ? "text-white" : "text-amber-600"} size={24} />;
      case 'Music': return <Music className={cls} size={24} />;
      case 'Heart': return <Heart className={active ? "text-white" : "text-pink-600"} size={24} />;
      default: return <Target className={cls} size={24} />;
    }
  };

  const completedFalahCount = Object.values(falahCompleted).filter(Boolean).length;
  const isAllFalahDone = completedFalahCount === falahHabitsData.length;

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 max-w-4xl mx-auto space-y-12">
      {/* Header Section */}
      <section className="text-center space-y-4">
        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="inline-flex items-center gap-2 bg-[#4e635a]/10 px-4 py-2 rounded-full text-[#4e635a] font-bold text-xs uppercase tracking-widest"
        >
          <Trophy size={14} />
          <span>مَرجِلة وعزيمة</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-serif font-black text-[#1b1c1a] leading-tight">
          لوحة <span className="text-[#4e635a]">الفلاح وبناء الذات</span>
        </h1>
        <p className="text-[#655d51] text-lg max-w-xl mx-auto font-medium">
          الرجولة مواقف وثبات، تُبنى بالصبر، والعفة، وحفظ كرامتك يا صاحبي. تتبع إنجازك اليومي بكل سرية وأمان، وابدأ برحلة بناء نفسك.
        </p>
      </section>

      {/* Tabs Switcher */}
      <div className="flex p-1.5 bg-[#4e635a]/5 rounded-[2rem] max-w-md mx-auto relative z-10 border border-[#4e635a]/10 shadow-inner">
        <button
          onClick={() => setActiveTab('falah')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black transition-all text-sm cursor-pointer",
            activeTab === 'falah' ? "bg-[#4e635a] text-white shadow-xl" : "text-[#7a8c82] hover:text-[#4e635a]"
          )}
        >
          <Trophy size={16} />
          متتبع الفلاح والعزيمة
        </button>
        <button
          onClick={() => setActiveTab('prophetic')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black transition-all text-sm cursor-pointer",
            activeTab === 'prophetic' ? "bg-[#4e635a] text-white shadow-xl" : "text-[#7a8c82] hover:text-[#4e635a]"
          )}
        >
          <History size={16} />
          النهج النبوي اليومي
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'falah' ? (
          <motion.div
            key="falah-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10"
          >
            {/* Falah Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[2.5rem] border border-[#4e635a]/10 shadow-sm flex flex-col items-center justify-center space-y-1">
                <Calendar className="text-[#4e635a]/40" size={20} />
                <span className="text-2xl font-black text-[#4e635a]">{falahStats.streak}</span>
                <span className="text-[10px] font-bold text-[#655d51] uppercase">أيام العهد الكامل</span>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-[#4e635a]/10 shadow-sm flex flex-col items-center justify-center space-y-1">
                <CheckCircle2 className="text-[#4e635a]/40" size={20} />
                <span className="text-2xl font-black text-[#4e635a]">
                  {completedFalahCount} / {falahHabitsData.length}
                </span>
                <span className="text-[10px] font-bold text-[#655d51] uppercase">إنجاز اليوم المنجز</span>
              </div>
              <div className="hidden md:flex bg-gradient-to-br from-[#4e635a] to-[#202724] p-6 rounded-[2.5rem] text-white flex-col items-center justify-center space-y-1 shadow-lg border border-[#4e635a]/10">
                <Sparkles className="text-yellow-400" size={20} />
                <span className="text-lg font-bold text-center">أنت سيد قرارك</span>
                <span className="text-[10px] font-medium opacity-70 text-center">عفة وحصانة ضد الفتن</span>
              </div>
            </div>

            {/* Falah Habits Checklist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {falahHabitsData.map((habit) => {
                const isCompleted = !!falahCompleted[habit.id];

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className={cn(
                      "group relative p-6 md:p-8 rounded-[2.5rem] border-2 transition-all duration-300 overflow-hidden cursor-pointer",
                      isCompleted 
                        ? "bg-[#4e635a] border-[#4e635a] text-white shadow-lg" 
                        : "bg-white border-[#4e635a]/5 hover:border-[#4e635a]/20 shadow-xs"
                    )}
                    onClick={() => setActiveFalahDetail(habit)}
                  >
                    <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className={cn(
                          "p-3.5 rounded-2xl transition-all duration-300",
                          isCompleted ? "bg-white/10" : "bg-[#fbf9f6]"
                        )}>
                          {getFalahIcon(habit.iconName, isCompleted)}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFalahHabit(habit.id);
                          }}
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer",
                            isCompleted 
                              ? "bg-white text-[#4e635a] scale-110 shadow-md" 
                              : "bg-[#4e635a]/5 text-[#4e635a]/30 hover:bg-[#4e635a]/10 hover:text-[#4e635a]"
                          )}
                        >
                          {isCompleted ? <Check size={20} className="font-bold stroke-[3px]" /> : <CheckCircle2 size={24} />}
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          isCompleted ? "text-white/60" : "text-[#4e635a]/70"
                        )}>
                          {habit.category}
                        </span>
                        <h2 className="text-xl font-serif font-black leading-tight text-right">
                          {habit.title}
                        </h2>
                      </div>

                      <p className={cn(
                        "text-sm leading-relaxed line-clamp-2 text-right font-medium",
                        isCompleted ? "text-white/80" : "text-[#655d51]"
                      )}>
                        {habit.description}
                      </p>

                      <div className={cn(
                        "flex items-center gap-2 text-xs font-black pt-2 justify-end",
                        isCompleted ? "text-white" : "text-[#4e635a]"
                      )}>
                        <span>التطبيق والنصيحة اليومية</span>
                        <Zap size={14} className="animate-bounce" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* الشيطان وتنبيه الصدق - Spoken Street Dialogue Warning */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-50 border border-thin border-rose-200 p-8 rounded-[3rem] space-y-4 shadow-xs relative overflow-hidden text-right"
              dir="rtl"
            >
              <div className="absolute top-0 left-0 bg-rose-200/20 w-32 h-32 rounded-br-[100px]" />
              <div className="flex items-center gap-3 mb-2 justify-start">
                <div className="p-3 bg-rose-200/30 text-rose-700 rounded-2xl">
                  <ShieldAlert size={24} />
                </div>
                <h4 className="text-xl font-black text-rose-900 font-serif">احذر حيل ومكائد غسيل الدماغ!</h4>
              </div>
              <p className="text-rose-800 text-base md:text-lg font-bold leading-relaxed pr-2 whitespace-pre-line">
                "{shaytanReminders[reminderIndex]}"
              </p>
              <span className="text-[10px] font-black text-rose-500/60 block pr-2">
                * سندك رفيقك الأخوي
              </span>
            </motion.div>

            {/* Falah Finished Reward card */}
            {isAllFalahDone && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-tr from-yellow-500 via-amber-600 to-[#121614] text-white p-8 md:p-12 rounded-[4rem] text-center space-y-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_30%,transparent_70%)] pointer-events-none" />
                <Sparkles className="text-yellow-300 mx-auto animate-spin" size={48} />
                <h3 className="text-3xl md:text-4xl font-serif font-black text-yellow-100">
                  كفو عليك! فلاح اليوم اكتمل بنجاح 🏅
                </h3>
                <p className="text-slate-100 text-lg md:text-xl font-bold max-w-xl mx-auto leading-relaxed">
                  لقد واجهت الفتن والملهيات، غضضت بصرك، صليت فرضك، وكسبت عزة ذاتك وكرامة الرجولة الحقيقية. استمر وغداً أجمل بإذن الله!
                </p>
                <button 
                  onClick={() => {
                    confetti({ particleCount: 100, spread: 70 });
                  }}
                  className="px-8 py-4 bg-white text-[#121614] hover:bg-yellow-400 font-black text-sm rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  فجّر الأفراح والتحفيز 🎉
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="prophetic-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-10"
          >
            {/* Prophetic Stats Board */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[2.5rem] border border-[#4e635a]/10 shadow-sm flex flex-col items-center justify-center space-y-1">
                <Calendar className="text-[#4e635a]/40" size={20} />
                <span className="text-2xl font-black text-[#4e635a]">{stats.streak}</span>
                <span className="text-[10px] font-bold text-[#655d51] uppercase">أيام الالتزام</span>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border border-[#4e635a]/10 shadow-sm flex flex-col items-center justify-center space-y-1">
                <CheckCircle2 className="text-[#4e635a]/40" size={20} />
                <span className="text-2xl font-black text-[#4e635a]">{stats.total}</span>
                <span className="text-[10px] font-bold text-[#655d51] uppercase">إجمالي التطبيق</span>
              </div>
              <div className="hidden md:flex bg-gradient-to-br from-[#4e635a] to-[#2d3a35] p-6 rounded-[2.5rem] text-white flex-col items-center justify-center space-y-1 shadow-lg">
                <Sparkles className="text-yellow-400" size={20} />
                <span className="text-xl font-bold">رسوخ الخلق</span>
                <span className="text-[10px] font-medium opacity-70">يُبنى بالاستمرار</span>
              </div>
            </div>

            {/* Prophetic Habits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {propheticHabits.map((habit) => {
                const Icon = iconMap[habit.iconName] || Hammer;
                const isCompleted = !!completedToday[habit.id];

                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={cn(
                      "group relative p-8 rounded-[3.5rem] border-2 transition-all duration-300 overflow-hidden cursor-pointer",
                      isCompleted 
                        ? "bg-[#4e635a] border-[#4e635a] text-white" 
                        : "bg-white border-[#4e635a]/5 hover:border-[#4e635a]/20 shadow-sm"
                    )}
                    onClick={() => setActiveHabit(habit)}
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <Icon size={120} />
                    </div>

                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className={cn(
                          "p-4 rounded-3xl transition-colors duration-300",
                          isCompleted ? "bg-white/10" : "bg-[#fbf9f6]"
                        )}>
                          <Icon className={isCompleted ? "text-white" : "text-[#4e635a]"} size={28} />
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHabit(habit.id, habit.title);
                          }}
                          className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer",
                            isCompleted 
                              ? "bg-white text-[#4e635a] scale-110 shadow-lg" 
                              : "bg-[#4e635a]/5 text-[#4e635a]/30 hover:bg-[#4e635a]/10"
                          )}
                        >
                          <CheckCircle2 size={24} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <h3 className={cn(
                          "text-xs font-bold uppercase tracking-widest",
                          isCompleted ? "text-white/60" : "text-[#4e635a]/60"
                        )}>
                          {habit.prophet}
                        </h3>
                        <h2 className="text-2xl font-serif font-black leading-tight">
                          {habit.title}
                        </h2>
                      </div>

                      <p className={cn(
                        "text-sm font-medium leading-relaxed line-clamp-2",
                        isCompleted ? "text-white/80" : "text-[#655d51]"
                      )}>
                        {habit.description}
                      </p>

                      <div className={cn(
                        "flex items-center gap-2 text-xs font-bold uppercase tracking-tighter pt-4",
                        isCompleted ? "text-white" : "text-[#4e635a]"
                      )}>
                        <span>افتح لمعرفة التطبيق اليومي</span>
                        <History size={14} className="animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prophetic Habit Detail Modal */}
      <AnimatePresence>
        {activeHabit && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setActiveHabit(null)}
               className="absolute inset-0 bg-black/40 backdrop-blur-md"
             />
             <motion.div
               layoutId={activeHabit.id}
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="bg-white w-full max-w-2xl rounded-[4rem] border-4 border-[#4e635a]/10 shadow-2xl overflow-hidden relative z-10 text-right"
               dir="rtl"
             >
                <div className="p-8 md:p-12 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 text-right">
                       <span className="bg-[#4e635a]/10 text-[#4e635a] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                         منهج {activeHabit.prophet}
                       </span>
                       <h2 className="text-3xl font-serif font-black text-[#1b1c1a]">{activeHabit.title}</h2>
                    </div>
                    <button onClick={() => setActiveHabit(null)} className="p-4 bg-[#fbf9f6] text-[#4e635a]/40 hover:text-red-500 transition-colors rounded-full cursor-pointer">
                       <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-[#4e635a] font-bold">
                         <Quote size={20} />
                         <span>القدوة من حياتهم</span>
                       </div>
                       <p className="text-[#655d51] text-base md:text-lg leading-relaxed font-semibold bg-[#fbf9f6] p-6 rounded-[2.5rem]">
                         {activeHabit.description}
                       </p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-[#4e635a] font-bold font-serif">
                         <Target size={20} className="text-red-500" />
                         <span>التطبيق المعاصر لحياتك</span>
                       </div>
                       <p className="text-[#1b1c1a] text-lg leading-relaxed font-bold border-r-4 border-[#4e635a] pr-4">
                         {activeHabit.modernApplication}
                       </p>
                    </div>
                  </div>

                  {/* Interactive Elements for specific habits */}
                  {activeHabit.type === 'gratitude' && (
                    <div className="space-y-4 pt-6 mt-6 border-t border-[#4e635a]/10">
                       <h4 className="flex items-center gap-2 text-[#4e635a] font-black italic">
                         <Sun size={20} /> "هذا من فضل ربي" - سجل ٣ نعم
                       </h4>
                       <div className="grid gap-3">
                         {gratitudeEntries.map((val, idx) => (
                           <input 
                             key={idx}
                             type="text"
                             placeholder={`النعمة السليمانية رقم ${idx+1}...`}
                             className="w-full bg-[#fbf9f6] border-2 border-transparent focus:border-[#4e635a]/20 px-6 py-4 rounded-2xl outline-hidden font-semibold text-right transition-all"
                             value={val}
                             onChange={(e) => {
                               const next = [...gratitudeEntries];
                               next[idx] = e.target.value;
                               setGratitudeEntries(next);
                             }}
                           />
                         ))}
                       </div>
                    </div>
                  )}

                  {activeHabit.type === 'reflection' && (
                    <div className="space-y-4 pt-6 mt-6 border-t border-[#4e635a]/10">
                       <h4 className="flex items-center gap-2 text-[#4e635a] font-black italic">
                         <Heart size={20} /> كيف فوضت أمرك لله اليوم؟
                       </h4>
                       <textarea 
                         placeholder="أفرغ ما في قلبك هنا.. حول ألمك إلى أحرف تناجي بها ربك كما فعل أيوب.."
                         rows={4}
                         className="w-full bg-[#fbf9f6] border-2 border-transparent focus:border-[#4e635a]/20 px-8 py-6 rounded-[2.5rem] outline-hidden font-semibold text-right transition-all resize-none italic"
                         value={reflection}
                         onChange={(e) => setReflection(e.target.value)}
                       />
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        toggleHabit(activeHabit.id, activeHabit.title);
                        setActiveHabit(null);
                      }}
                      className={cn(
                        "flex-1 py-6 rounded-3xl font-black text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 cursor-pointer",
                        completedToday[activeHabit.id]
                           ? "bg-[#fbf9f6] text-[#4e635a] border-2 border-[#4e635a]/10"
                           : "bg-[#4e635a] text-white hover:bg-[#3d4d46]"
                      )}
                    >
                      <CheckCircle2 size={24} />
                      {completedToday[activeHabit.id] ? "لقد طبقت هذا اليوم ✅" : "حققت هذا الخلق اليوم بمشيئة الله"}
                    </button>
                  </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Falah Habit Detail Modal */}
      <AnimatePresence>
        {activeFalahDetail && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-[3.5rem] border border-[#ece9e2] shadow-2xl overflow-hidden relative z-10 text-right"
              dir="rtl"
            >
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {activeFalahDetail.category}
                    </span>
                    <h3 className="text-3xl font-serif font-black text-slate-900 leading-tight">
                      {activeFalahDetail.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveFalahDetail(null)}
                    className="p-3 bg-slate-100 text-slate-500 hover:text-red-500 transition-all rounded-full cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-700 bg-slate-50 p-6 rounded-3xl leading-relaxed text-base font-bold">
                    {activeFalahDetail.description}
                  </p>
                  
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-3xl space-y-2">
                    <div className="flex items-center gap-1.5 text-yellow-700 font-bold">
                      <Zap size={16} />
                      <span className="text-sm">كيف تطبق هذا الخلق الفارق لحمايتك؟</span>
                    </div>
                    <p className="text-yellow-900 text-sm font-semibold leading-relaxed">
                      {activeFalahDetail.practicalTip}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    toggleFalahHabit(activeFalahDetail.id);
                    setActiveFalahDetail(null);
                  }}
                  className={cn(
                    "w-full py-5 rounded-2xl font-black text-lg transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer",
                    falahCompleted[activeFalahDetail.id]
                      ? "bg-emerald-100 border border-emerald-200 text-emerald-800"
                      : "bg-[#4e635a] text-white hover:bg-[#3d4d46]"
                  )}
                >
                  {falahCompleted[activeFalahDetail.id] ? (
                    <>
                      <Check size={20} fill="currentColor" />
                      منجزة لهذا اليوم!
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      أعاهد الله وأقول حققتها اليوم
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
