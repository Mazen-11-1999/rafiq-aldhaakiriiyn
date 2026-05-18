import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { propheticHabits, PropheticHabit } from '../data/propheticHabits';
import { 
  Wrench, Hammer, Sun, Heart, RefreshCw, Ship, 
  Target, MessageCircle, CheckCircle2, History, 
  Sparkles, Trophy, Calendar, Quote, Send, Loader2, X 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toggleHabitPersistence, getHabitsForDate } from '../services/recordService';

const iconMap: any = {
  Wrench, Hammer, Sun, Heart, RefreshCw, Ship, Target, MessageCircle
};

export default function HabitTracker({ onActivity }: { onActivity?: () => void }) {
  const [completedToday, setCompletedToday] = useState<Record<string, boolean>>({});
  const [gratitudeEntries, setGratitudeEntries] = useState<string[]>(['', '', '']);
  const [reflection, setReflection] = useState('');
  const [activeHabit, setActiveHabit] = useState<PropheticHabit | null>(null);
  const [stats, setStats] = useState({ streak: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTodayHabits() {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      try {
        const habits = await getHabitsForDate(today);
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
  }, []);

  const toggleHabit = async (id: string, title: string) => {
    const isNowCompleted = !completedToday[id];
    const newState = { ...completedToday, [id]: isNowCompleted };
    setCompletedToday(newState);
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      await toggleHabitPersistence(id, title, today, isNowCompleted);
    } catch (error) {
      console.error("Error toggling habit:", error);
    }

    if (isNowCompleted) {
      const newStats = { ...stats, total: stats.total + 1, streak: stats.streak + 1 };
      setStats(newStats);
      localStorage.setItem('prophetic_habits_stats', JSON.stringify(newStats));
      
      if (onActivity) onActivity();
    }
  };

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
          <span>منهج الأنبياء اليومي</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-serif font-black text-[#1b1c1a] leading-tight">
          كن <span className="text-[#4e635a]">وارثاً لنهجِ الأنبياء</span> في يومك
        </h1>
        <p className="text-[#655d51] text-lg max-w-xl mx-auto font-medium">
          الأنبياء لم يتركوا ذهباً بل تركوا "أثراً" ومنهجاً.. اختر خلقاً واحداً اليوم ليكون جزءاً من "شخصيتك" وتصرفاتك، وليس مجرد معلومة قرأتها.
        </p>
      </section>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {propheticHabits.map((habit) => {
          const Icon = iconMap[habit.iconName] || Hammer;
          const isCompleted = completedToday[habit.id];

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "group relative p-8 rounded-[3.5rem] border-2 transition-all duration-500 overflow-hidden cursor-pointer",
                isCompleted 
                  ? "bg-[#4e635a] border-[#4e635a] text-white" 
                  : "bg-white border-[#4e635a]/5 hover:border-[#4e635a]/20 shadow-sm"
              )}
              onClick={() => setActiveHabit(habit)}
            >
              {/* Pattern Background */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Icon size={120} />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "p-4 rounded-3xl transition-colors duration-500",
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
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
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

      {/* Habit Detail Modal */}
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
               className="bg-white w-full max-w-2xl rounded-[4rem] border-4 border-[#4e635a]/10 shadow-2xl overflow-hidden relative z-10"
             >
                <div className="p-8 md:p-12 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 text-right">
                       <span className="bg-[#4e635a]/10 text-[#4e635a] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                         منهج {activeHabit.prophet}
                       </span>
                       <h2 className="text-4xl font-serif font-black text-[#1b1c1a]">{activeHabit.title}</h2>
                    </div>
                    <button onClick={() => setActiveHabit(null)} className="p-4 bg-[#fbf9f6] text-[#4e635a]/40 hover:text-red-500 transition-colors rounded-full">
                       <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="flex items-center gap-2 text-[#4e635a] font-bold">
                         <Quote size={20} />
                         <span>القدوة من حياتهم</span>
                       </div>
                       <p className="text-[#655d51] text-lg leading-relaxed font-medium bg-[#fbf9f6] p-6 rounded-[2.5rem]">
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
                             className="w-full bg-[#fbf9f6] border-2 border-transparent focus:border-[#4e635a]/20 px-6 py-4 rounded-2xl outline-hidden font-medium text-right transition-all"
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
                         className="w-full bg-[#fbf9f6] border-2 border-transparent focus:border-[#4e635a]/20 px-8 py-6 rounded-[2.5rem] outline-hidden font-medium text-right transition-all resize-none italic"
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
                        "flex-1 py-6 rounded-3xl font-black text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3",
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
    </div>
  );
}
