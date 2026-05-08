import React from 'react';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { TrendingUp, Clock, Calendar, Award, Check, Settings, Book, Map } from 'lucide-react';

function ActivityBadge({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#4e635a]/5 text-[#4e635a] font-bold text-xs shadow-sm">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default function InsightsView({ userProfile }: { userProfile: UserProfile | null }) {
  if (!userProfile) return null;

  return (
    <div className="p-margin-page space-y-section-gap perspective-1000">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-[#4e635a] font-serif">إحصائيات السكون</h2>
        <p className="text-[#424845] font-medium opacity-60">تتبع رحلتك في رحاب الهدوء والتأمل</p>
      </header>

      <div className="grid grid-cols-2 gap-gutter">
        <StatCard 
          label="إجمالي الدقائق"
          value={userProfile.totalMinutes.toString()}
          icon={<Clock size={20} />}
          color="bg-[#d1e8dd]"
          textColor="text-[#0b1f18]"
        />
        <StatCard 
          label="أطول سلسلة"
          value={userProfile.currentStreak.toString()}
          icon={<TrendingUp size={20} />}
          color="bg-[#f4dfcb]"
          textColor="text-[#241a0e]"
        />
      </div>

      <section className="space-y-stack-md bg-[#4e635a]/5 p-8 rounded-[40px] border border-[#4e635a]/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#4e635a]">إعدادات الالتزام</h3>
          <Settings size={20} className="text-[#4e635a]/40" />
        </div>
        
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-white shadow-sm space-y-4">
             <div className="flex justify-between items-center">
               <span className="text-sm font-bold text-[#4e635a]">مدة الخلوة اليومية</span>
               <span className="text-xs font-bold text-[#8da399]">كل يوم</span>
             </div>
             <p className="text-lg font-serif text-[#1b1c1a]">خصص وقت لنفسك مع ربك</p>
             <div className="h-1 bg-[#fbf9f6] rounded-full overflow-hidden">
                <div className="h-full bg-[#4e635a] w-1/3" />
             </div>
          </div>

          <div className="grid gap-3">
             <p className="text-xs font-bold text-[#4e635a]/60 uppercase tracking-widest mr-2">أنشطة مقترحة للالتزام</p>
             <div className="flex flex-wrap gap-2">
                <ActivityBadge icon={<Book size={14} />} label="قراءة قصص الأنبياء" />
                <ActivityBadge icon={<Map size={14} />} label="تتبع المسيرة والمنهج" />
                <ActivityBadge icon={<Clock size={14} />} label="الذكر المستمر" />
             </div>
          </div>
        </div>
      </section>

      <section className="space-y-stack-md">
        <h3 className="text-xl font-bold text-[#4e635a]">محطات الإنجاز</h3>
        <div className="space-y-stack-sm">
           <AchievementItem 
             title="نور الإقبال"
             description="إتمام أول جلسة وجلائك للقلب"
             achieved={userProfile.totalMinutes > 0}
           />
           <AchievementItem 
             title="غيث السكينة"
             description="تجاوز 100 دقيقة من الاتصال الروحي"
             achieved={userProfile.totalMinutes >= 100}
           />
           <AchievementItem 
             title="الذاكر الثابت"
             description="الموافقة على ورد يومي لمدة 7 أيام متتالية"
             achieved={userProfile.currentStreak >= 7}
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
