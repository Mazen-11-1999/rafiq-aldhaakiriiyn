import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { TrendingUp, Clock, Calendar, Award, Check, Settings, Book, Map, Heart, ShieldCheck, Loader2 } from 'lucide-react';
import { getLatestAssessment, getEthicsCommitments, getHabitsForDate, AssessmentRecord, EthicsCommitment } from '../services/recordService';

function ActivityBadge({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#4e635a]/5 text-[#4e635a] font-bold text-xs shadow-sm">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default function InsightsView({ userProfile }: { userProfile: UserProfile | null }) {
  const [assessment, setAssessment] = useState<AssessmentRecord | null>(null);
  const [commitments, setCommitments] = useState<EthicsCommitment[]>([]);
  const [todayHabitsCount, setTodayHabitsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error("Error loading insights data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (!userProfile) return null;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-slate-500 font-medium">جاري وزن الأعمال وتجهيز الميزان...</p>
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
    <div className="p-margin-page space-y-section-gap perspective-1000">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-[#4e635a] font-serif">ميزان الهداية</h2>
        <p className="text-[#424845] font-medium opacity-60">تتبع أثر المجاهدة والعمل في قلبك</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <StatCard 
          label="إجمالي الدقائق"
          value={userProfile.totalMinutes.toString()}
          icon={<Clock size={20} />}
          color="bg-[#d1e8dd]"
          textColor="text-[#0b1f18]"
        />
        <StatCard 
          label="سنن طبقت اليوم"
          value={todayHabitsCount.toString()}
          icon={<Heart size={20} />}
          color="bg-[#f4dfcb]"
          textColor="text-[#241a0e]"
        />
      </div>

      {/* Spiritual Mirror Section */}
      <section className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="text-emerald-600" />
            <h3 className="text-xl font-bold text-slate-800">نتائج مرآة الروح</h3>
          </div>
          {assessment && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {assessment.overallTitle}
            </span>
          )}
        </div>

        {assessment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {Object.entries(assessment.scores).map(([cat, score]) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>{categoryLabels[cat] || cat}</span>
                    <span>{Math.round(score as number)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      className="h-full bg-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center">
              <p className="text-slate-600 text-sm leading-relaxed text-center">
                هذه المرآة تعكس حال قلبك في هذه اللحظة. تذكر أن الإصلاح يبدأ من الاعتراف بالقصور في حضرة الله.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium italic">لم تقم بتقييم مرآة الروح بعد</p>
          </div>
        )}
      </section>

      {/* Ethics Commitments */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-orange-600" />
          <h3 className="text-xl font-bold text-slate-800">مواثيق الأخلاق</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {commitments.length > 0 ? commitments.map((comm) => (
            <motion.div 
              key={comm.id}
              whileHover={{ scale: 1.02 }}
              className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Check size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{comm.title}</p>
                <p className="text-xs text-slate-500">عهد الإصلاح والالتزام</p>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               <p className="text-slate-400 text-sm italic">لا توجد عهود أخلاقية مسجلة بعد</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-stack-md bg-[#4e635a]/5 p-8 rounded-[40px] border border-[#4e635a]/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#4e635a]">محطات الإنجاز</h3>
          <Award size={20} className="text-[#4e635a]/40" />
        </div>
        <div className="space-y-stack-sm">
           <AchievementItem 
             title="نور الإقبال"
             description="إتمام أول جلسة وجلائك للقلب"
             achieved={userProfile.totalMinutes > 0}
           />
           <AchievementItem 
             title="صادق العهد"
             description="الالتزام بـ 3 عهود أخلاقية"
             achieved={commitments.length >= 3}
           />
           <AchievementItem 
             title="المثابر المستمر"
             description="تطبيق 5 سنن نبوية في يوم واحد"
             achieved={todayHabitsCount >= 5}
           />
        </div>
      </section>

      <div className="rounded-3xl overflow-hidden shadow-xl border border-white/20 relative group">
        <img 
          src="https://images.pexels.com/photos/10079452/pexels-photo-10079452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Inspiration" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-end p-8">
           <p className="text-white italic font-bold text-xl text-right drop-shadow-2xl">
             "في السكون، نجد ما ضاع منا في ضجيج العالم."
           </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, textColor }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5, translateZ: 20, rotateX: 2, rotateY: -2 }}
      className={cn("p-8 rounded-[40px] space-y-6 glass-3d depth-card preserve-3d shadow-2xl overflow-hidden relative", color.replace('bg-', 'bg-'))}
    >
      <div className={cn("absolute inset-0 opacity-10 pointer-events-none", color)} />
      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-xl transform translateZ(20px)", textColor)}>
        {icon}
      </div>
      <div className="transform translateZ(10px)">
        <p className={cn("text-5xl font-black font-serif", textColor)}>{value}</p>
        <p className={cn("text-xs font-black uppercase tracking-[0.2em] opacity-50 mt-1", textColor)}>{label}</p>
      </div>
    </motion.div>
  );
}

function AchievementItem({ title, description, achieved }: { title: string, description: string, achieved: boolean }) {
  return (
    <div className={cn(
      "p-6 rounded-[32px] flex items-center gap-6 transition-all preserve-3d group",
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
