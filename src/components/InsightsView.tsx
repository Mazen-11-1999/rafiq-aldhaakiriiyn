import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { Clock, Calendar, Award, Check, Heart, ShieldCheck, Loader2 } from 'lucide-react';
import { getLatestAssessment, getEthicsCommitments, getHabitsForDate, AssessmentRecord, EthicsCommitment } from '../services/recordService';

const formatInsightsTime = (minutes: number): string => {
  if (!minutes || minutes <= 0) return "البداية بمجاهدة النفس";
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    if (mins === 15) return "ربع ساعة وعي";
    if (mins === 20) return "ثلث ساعة وعي";
    if (mins === 30) return "نصف ساعة وعي";
    if (mins === 45) return "ساعة إلا ربع وعي";
    if (mins === 1) return "دقيقة وعي واحدة";
    if (mins === 2) return "دقيقتا وعي";
    if (mins >= 3 && mins <= 10) return `${mins} دقائق وعي`;
    return `${mins} دقيقة وعي`;
  }

  let hoursPart = "";
  if (hours === 1) {
    hoursPart = "ساعة";
  } else if (hours === 2) {
    hoursPart = "ساعتان";
  } else if (hours >= 3 && hours <= 10) {
    hoursPart = `${hours} ساعات`;
  } else {
    hoursPart = `${hours} ساعة`;
  }

  if (mins === 0) {
    return `${hoursPart} من الوعي`;
  }

  if (mins === 15) return `${hoursPart} وربع من الوعي`;
  if (mins === 20) return `${hoursPart} وثلث من الوعي`;
  if (mins === 30) return `${hoursPart} ونصف من الوعي`;
  
  if (mins === 45) {
    const nextHour = hours + 1;
    let nextHourPart = "";
    if (nextHour === 1) nextHourPart = "ساعة";
    else if (nextHour === 2) nextHourPart = "ساعتان";
    else if (nextHour >= 3 && nextHour <= 10) nextHourPart = `${nextHour} ساعات`;
    else nextHourPart = `${nextHour} ساعة`;
    return `${nextHourPart} إلا ربع من الوعي`;
  }

  if (mins === 1) return `${hoursPart} ودقيقة وعي`;
  if (mins === 2) return `${hoursPart} ودقيقتان وعي`;
  if (mins >= 3 && mins <= 10) return `${hoursPart} و ${mins} دقائق وعي`;
  return `${hoursPart} و ${mins} دقيقة وعي`;
};

const formatFriendlyHabits = (count: number): string => {
  if (count === 0) return "لا عادات بعد اليوم";
  if (count === 1) return "عادة واحدة اليوم";
  if (count === 2) return "عادتان طيبتان اليوم";
  if (count >= 3 && count <= 10) return `${count} عادات طيبة اليوم`;
  return `${count} عادة طيبة اليوم`;
};

export default function InsightsView({ userProfile }: { userProfile: UserProfile | null }) {
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [commitments, setCommitments] = useState<EthicsCommitment[]>([]);
  const [todayHabitsCount, setTodayHabitsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [covenantMessage, setCovenantMessage] = useState<{
    type: 'success' | 'warn' | 'inactive';
    title: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const [latestAss, allComm, todayHab] = await Promise.all([
          getLatestAssessment(),
          getEthicsCommitments(),
          getHabitsForDate(today)
        ]);
        setAssessment(latestAss);
        setCommitments(allComm);
        setTodayHabitsCount(todayHab.length);

        if (allComm.length === 0) {
          setCovenantMessage({
            type: 'inactive',
            title: '🛡️ ابدأ بتوثيق عهودك',
            text: 'يا رفيقي، لم تقطع عهداً مباركاً على نفسك بعد لتجاهد به... انتقل إلى قسم (عود نفسك) في تبويب (ميزان الأخلاق) واختر التحدي الذي تقدر عليه واضغط على (أعاهد الله على الالتزام) ليظهر عهدك هنا ويسند خطواتك.'
          });
        } else {
          const completedAnythingToday = todayHab.length > 0;
          let checkedAssessmentToday = false;
          if (latestAss && latestAss.createdAt) {
            const assDate = latestAss.createdAt.split('T')[0];
            if (assDate === today) {
              checkedAssessmentToday = true;
            }
          }

          if (!completedAnythingToday && !checkedAssessmentToday) {
            setCovenantMessage({
              type: 'warn',
              title: '🚨 يا رفيقي.. عهد وميثاق!',
              text: 'أخشى أنك نسيت اليوم عهداً أو ميثاقاً قطعته على نفسك في (عود نفسك)... لا تجعل ملهيات اليوم تسرق طهر قلبك وعزمك. خذ دقيقة لتسجيل طاعتك وتزكية نفسك الآن.'
            });
          } else {
            setCovenantMessage({
              type: 'success',
              title: '💚 همة ووفاء بالعهد',
              text: 'بوركت خطاك يا رفيقي! عهودك التي التزمت بها تضيء مسارك اليوم بصدق العمل وجهاد النفس الفعلي.'
            });
          }
        }
      } catch (error) {
        console.error("Error loading insights data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [userProfile]);

  if (!userProfile) return null;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#4e635a] animate-spin" />
        <p className="text-slate-500 font-medium font-serif text-lg">جاري وزن الأعمال وتجهيز الميزان...</p>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    intent: 'صدق النية',
    ethics: 'الخلق',
    consistency: 'الاستقامة',
    ego: 'تزكية النفس',
    knowledge: 'العلم والعمل'
  };

  return (
    <div className="p-margin-page space-y-section-gap perspective-1000" dir="rtl">
      <header className="space-y-3 pb-4">
        <h2 className="text-4xl font-bold text-[#4e635a] font-serif">ميزان الهداية</h2>
        <p className="text-[#424845] font-semibold text-base opacity-75">تتبع أثر المجاهدة والعمل في قلبك</p>
      </header>

      {/* Dynamic Covenant Companion Guard / Alert */}
      {covenantMessage && (
        <motion.div 
           initial={{ opacity: 0, y: -20, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           className={cn(
             "w-full p-5 rounded-[28px] border flex gap-4 text-right shadow-xl relative overflow-hidden",
             covenantMessage.type === 'warn' && "bg-amber-50 border-amber-200/40 text-amber-950",
             covenantMessage.type === 'success' && "bg-emerald-50 border-emerald-200/40 text-emerald-950",
             covenantMessage.type === 'inactive' && "bg-slate-50 border-slate-200/30 text-slate-800"
           )}
        >
          {covenantMessage.type === 'warn' && <div className="absolute top-0 right-0 h-1 bg-amber-500 w-full" />}
          {covenantMessage.type === 'success' && <div className="absolute top-0 right-0 h-1 bg-emerald-500 w-full" />}
          {covenantMessage.type === 'inactive' && <div className="absolute top-0 right-0 h-1 bg-slate-400 w-full" />}
          
          <div className="flex-grow space-y-1">
            <h4 className="font-bold font-serif text-base">{covenantMessage.title}</h4>
            <p className="text-xs leading-relaxed opacity-90">{covenantMessage.text}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <StatCard 
          label="إجمالي دقائق الوعي"
          value={formatInsightsTime(userProfile.totalMinutes)}
          icon={<Clock size={20} />}
          color="bg-[#d1e8dd]"
          textColor="text-[#0b1f18]"
        />
        <StatCard 
          label="عادات طيبة اليوم"
          value={formatFriendlyHabits(todayHabitsCount)}
          icon={<Heart size={20} />}
          color="bg-[#f4dfcb]"
          textColor="text-[#241a0e]"
        />
      </div>

      {/* Spiritual Mirror Section */}
      <section className="bg-white rounded-[45px] p-8 md:p-10 border border-slate-100 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Heart className="text-emerald-600 animate-pulse" size={24} />
            <h3 className="text-2xl font-bold text-slate-800 font-serif">💚 نتائج مراجعة النفس</h3>
          </div>
          {assessment && (
            <div className="text-sm font-bold text-emerald-700 bg-emerald-50/80 px-4 py-2 rounded-2xl border border-emerald-100/50">
              بصيرة خلوتك الحالية: <span>[{assessment.overallTitle}]</span>
            </div>
          )}
        </div>

        {assessment ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              {Object.entries(assessment.scores).map(([cat, score]) => (
                <div key={cat} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold text-slate-600">
                    <span>{categoryLabels[cat] || cat}</span>
                    <span>{Math.round(score as number)}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      className="h-full bg-[#10b981] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50/80 rounded-[30px] p-8 flex flex-col justify-center border border-slate-100/50">
              <p className="text-slate-600 text-base md:text-lg leading-relaxed text-right font-medium">
                هذه المرآة تعكس حال قلبك في هذه اللحظة. تذكر أن الإصلاح يبدأ من الاعتراف بالقصور والمواجهة بصدق في حضرة الله.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-[35px] border border-dashed border-slate-200 px-6">
            <p className="text-slate-600 font-bold text-base md:text-lg leading-relaxed">
              لم تقم بمراجعة نفسك اليوم بعد.. خذ دقيقة من وقتك الآن، واجه فخاخ يومك بصدق لتظهر نتيجتك هنا.
            </p>
          </div>
        )}
      </section>

      {/* Ethics Commitments */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-orange-600" size={24} />
          <h3 className="text-2xl font-bold text-slate-800 font-serif">🛡️ عهودك التي التزمت بها</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {commitments.length > 0 ? commitments.map((comm) => (
            <motion.div 
              key={comm.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-white border border-slate-100 rounded-[30px] shadow-sm flex items-center gap-5 transition-all text-right"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Check size={22} className="stroke-[3px]" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">{comm.title}</p>
                <p className="text-xs font-bold text-slate-400 mt-0.5">عهد الإصلاح والالتزام</p>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-[35px] border border-dashed border-slate-200 px-6">
               <p className="text-slate-600 font-bold text-base md:text-lg leading-relaxed">
                 لا توجد عهود مسجلة حالياً.. اذهب إلى تبويب (عوّد نفسك)، واختر التحدي الذي تقدر عليه واضغط على (أعاهد الله على الالتزام) ليظهر عهدك هنا.
               </p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6 bg-[#4e635a]/5 p-8 md:p-10 rounded-[45px] border border-[#4e635a]/10">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-[#4e635a] font-serif">محطات الإنجاز</h3>
          <Award size={24} className="text-[#4e635a]/40" />
        </div>
        <div className="space-y-4">
           <AchievementItem 
             title="نور البداية"
             description="إتمام أول جلسة وعي وبناء نفسك ."
             achieved={userProfile.totalMinutes > 0}
           />
           <AchievementItem 
             title="صادق الوعد"
             description="الالتزام بـ 3 تحديات أخلاقية في (عوّد نفسك) دون تراجع."
             achieved={commitments.length >= 3}
           />
           <AchievementItem 
             title="المثابر المستمر"
             description="المحافظة على عاداتك وسننك اليومية لـ 5 أيام متتالية."
             achieved={(userProfile.currentStreak ?? 0) >= 5}
           />
        </div>
      </section>

      <div className="rounded-[40px] overflow-hidden shadow-2xl border border-[#4e635a]/10 relative group">
        <img 
          src="https://images.pexels.com/photos/10079452/pexels-photo-10079452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Inspiration" 
          className="w-full h-[300px] object-cover filter brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-end p-8 md:p-12">
           <p className="text-white font-medium text-lg md:text-2xl text-right leading-relaxed drop-shadow-2xl font-serif">
             "في السكون، نجد ما ضاع منا في ضجيج العالم."
           </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, textColor }: any) {
  const isValueLong = value.length > 10;
  return (
    <motion.div 
      whileHover={{ y: -5, translateZ: 20, rotateX: 2, rotateY: -2 }}
      className={cn("p-8 rounded-[40px] space-y-6 glass-3d depth-card preserve-3d shadow-2xl overflow-hidden relative text-right", color.replace('bg-', 'bg-'))}
    >
      <div className={cn("absolute inset-0 opacity-10 pointer-events-none", color)} />
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-xl transform translateZ(20px)", textColor)}>
        {icon}
      </div>
      <div className="transform translateZ(10px) space-y-2">
        <p className={cn(
          isValueLong ? "text-xl md:text-2xl font-bold" : "text-4xl md:text-5xl font-black",
          "font-serif tracking-tight leading-normal",
          textColor
        )}>
          {value}
        </p>
        <p className={cn("text-xs font-black uppercase tracking-[0.1em] opacity-60 mt-1", textColor)}>{label}</p>
      </div>
    </motion.div>
  );
}

function AchievementItem({ title, description, achieved }: { title: string, description: string, achieved: boolean }) {
  return (
    <div className={cn(
      "p-6 rounded-[32px] flex items-center gap-6 transition-all preserve-3d group text-right",
      achieved ? "glass-3d shadow-xl" : "bg-[#efeeeb]/50 opacity-40 grayscale"
    )}>
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transform group-hover:scale-110 transition-transform",
        achieved ? "bg-[#d1e8dd] text-[#4e635a]" : "bg-[#e4e2df] text-[#727875]"
      )}>
        {achieved ? <Award size={28} /> : <Calendar size={28} />}
      </div>
      <div className="flex-grow">
        <h4 className="font-bold text-xl text-[#1b1c1a] font-serif">{title}</h4>
        <p className="text-sm text-[#727875] font-medium">{description}</p>
      </div>
      {achieved && <div className="p-2 bg-[#d1e8dd]/50 rounded-full"><Check className="text-[#4e635a]" size={20} /></div>}
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
