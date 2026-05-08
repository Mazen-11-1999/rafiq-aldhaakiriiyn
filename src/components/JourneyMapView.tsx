import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Star, ChevronLeft, Lock, CheckCircle2, ArrowRight, ShieldCheck, Heart, Map as MapIcon, ScrollText } from 'lucide-react';
import { cn } from '../lib/utils';

interface Station {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'current' | 'completed';
  lessons: string[];
  challenges: string[];
  icon: React.ReactNode;
  color: string;
  requirement?: {
    minutes?: number;
    sessions?: number;
    streak?: number;
  };
}

const STATION_TEMPLATE: Omit<Station, 'status'>[] = [
  {
    id: 'awakening',
    title: 'اليقظة',
    description: 'انتباه القلب من غفلته، وهي أولى خطوات السائر إلى الله.',
    color: '#10B981',
    icon: <Star size={24} />,
    lessons: [
      'التفكر في نعم الله الظاهرة والباطنة',
      'إدراك قيمة الوقت وقصر العمر',
      'الانتباه لآثار الذنوب على القلب'
    ],
    challenges: [
      'ترك رفقاء السوء وأصحاب الغفلة',
      'مجاهدة النفس على الاستيقاظ لصلاة الفجر',
      'التقليل من فضول المباحات (كلام، طعام، نوم)'
    ]
  },
  {
    id: 'repentance',
    title: 'التوبة',
    description: 'الرجوع إلى الله وفك عقدة الإصرار على المعاصي.',
    color: '#3B82F6',
    icon: <ShieldCheck size={24} />,
    requirement: { minutes: 50, sessions: 5 },
    lessons: [
      'شروط التوبة الصادقة',
      'كيفية رد المظالم إلى أهلها',
      'تجديد العهد مع الله يومياً'
    ],
    challenges: [
      'الثبات أمام الحنين للمعاصي القديمة',
      'الاعتذار لمن ظلمتهم وبدء صفحة جديدة',
      'الحفاظ على بيئة تعين على الطاعة'
    ]
  },
  {
    id: 'patience',
    title: 'الصبر',
    description: 'حبس النفس عن الجزع ومنع الجوارح من سخط الأقدار.',
    color: '#F59E0B',
    icon: <Lock size={24} />,
    requirement: { minutes: 200, sessions: 15, streak: 3 },
    lessons: [
      'الفرق بين الصبر والرضا',
      'الصبر على الطاعة والصبر عن المعصية',
      'ثواب الصابرين في الدنيا والآخرة'
    ],
    challenges: [
      'كظم الغيظ عند شدة الغضب',
      'الاستمرار في العبادة رغم الفتور',
      'عدم الشكوى للخلق إلا لله وحده'
    ]
  },
  {
    id: 'gratitude',
    title: 'الشكر',
    description: 'ظهور أثر النعمة على لسان العبد ثناءً، وعلى قلبه حباً، وعلى جوارحه طاعة.',
    color: '#8B5CF6',
    icon: <Heart size={24} />,
    requirement: { minutes: 500, sessions: 40, streak: 7 },
    lessons: [
      'مراتب الشكر الثلاثة (القلب، اللسان، الجوارح)',
      'سجود الشكر وأثره في حياة المسلم',
      'كيف تجعل حياتك كلها شكراً؟'
    ],
    challenges: [
      'البحث عن نعم الله وسط البلاء',
      'استخدام الجوارح فيما يرضي من أنعم بها',
      'نشر الإيجابية والأمل بين الناس'
    ]
  },
  {
    id: 'contentment',
    title: 'الرضا',
    description: 'سكون القلب تحت مجاري الأحكام، وهو جنة الدنيا المستعجلة.',
    color: '#EC4899',
    icon: <CheckCircle2 size={24} />,
    requirement: { minutes: 1000, sessions: 100, streak: 15 },
    lessons: [
      'الرضا بمكروه القضاء',
      'كيف تصل إلى طمأنينة القلب؟',
      'الثقة العميقة في حسن تدبير الله'
    ],
    challenges: [
      'ترك الاعتراض على تدبير الله في النفس والمال',
      'الاستغناء بالله عن كل ما سواه',
      'العيش في لحظتك الحاضرة بروح راضية'
    ]
  }
];

export default function JourneyMapView({ userProfile }: { userProfile: UserProfile | null }) {
  const stations = useMemo(() => {
    if (!userProfile) return STATION_TEMPLATE.map(s => ({ ...s, status: 'locked' as const }));

    return STATION_TEMPLATE.map((station, index) => {
      let status: 'locked' | 'current' | 'completed' = 'locked';
      
      const isMet = !station.requirement || (
        (userProfile.totalMinutes >= (station.requirement.minutes || 0)) &&
        ((userProfile.totalSessions || 0) >= (station.requirement.sessions || 0)) &&
        (userProfile.currentStreak >= (station.requirement.streak || 0))
      );

      // Simple logic: if requirements met, and next one isn't, it's current.
      const prevMet = index === 0 || STATION_TEMPLATE.slice(0, index).every(s => 
        !s.requirement || (
          userProfile.totalMinutes >= (s.requirement.minutes || 0) && 
          (userProfile.totalSessions || 0) >= (s.requirement.sessions || 0) &&
          userProfile.currentStreak >= (s.requirement.streak || 0)
        )
      );

      if (isMet) {
        // Check if next one is met, if so this one is completed
        const next = STATION_TEMPLATE[index + 1];
        const nextMet = next && next.requirement && (
          userProfile.totalMinutes >= (next.requirement.minutes || 0) &&
          (userProfile.totalSessions || 0) >= (next.requirement.sessions || 0) &&
          userProfile.currentStreak >= (next.requirement.streak || 0)
        );
        status = nextMet ? 'completed' : 'current';
      } else if (prevMet) {
        status = 'current';
      } else {
        status = 'locked';
      }

      return { ...station, status };
    });
  }, [userProfile]);

  const [selectedStationId, setSelectedStationId] = useState<string>(STATION_TEMPLATE[0].id);
  const selectedStation = stations.find(s => s.id === selectedStationId) || stations[0];

  return (
    <div className="min-h-full py-12 px-6">
      <header className="max-w-7xl mx-auto mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4e635a]/10 text-[#4e635a] mb-6 border border-[#4e635a]/20"
        >
          <Compass size={18} className="animate-spin-slow" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">طريق السلوك والترقية</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-bold text-[#1b1c1a] font-serif mb-6 leading-tight">رحلة المسافر إلى الله</h1>
        <p className="text-xl text-[#4e635a]/60 max-w-2xl mx-auto leading-relaxed">
          خريطة معنوية تعرض لك محطات التزكية ومقامات السير، لتعرف أين أنت وما هو التحدي القادم في رحلتك.
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* The Map / Timeline */}
        <div className="lg:col-span-4 space-y-4 relative">
          {/* Connecting Line */}
          <div className="absolute top-0 bottom-0 right-[43px] w-1 bg-gradient-to-b from-[#4e635a]/5 via-[#4e635a]/20 to-transparent rounded-full" />
          
          {stations.map((station, index) => (
            <motion.button
              key={station.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedStationId(station.id)}
              className={cn(
                "w-full flex items-center gap-6 p-6 rounded-[35px] transition-all relative group text-right",
                selectedStationId === station.id 
                  ? "bg-white shadow-2xl scale-[1.02] border-r-8" 
                  : "hover:bg-white/40 grayscale opacity-60"
              )}
              style={{ 
                borderRightColor: selectedStationId === station.id ? station.color : 'transparent' 
              }}
            >
              <div 
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg transition-transform group-hover:scale-110",
                  station.status === 'locked' ? 'bg-gray-300' : ''
                )}
                style={{ backgroundColor: station.status !== 'locked' ? station.color : undefined }}
              >
                {station.status === 'locked' ? <Lock size={20} /> : station.icon}
              </div>
              <div className="text-right">
                <h3 className="font-bold text-xl font-serif text-[#1b1c1a]">{station.title}</h3>
                <span className="text-xs font-bold text-[#4e635a]/40 uppercase tracking-widest">المحطة {index + 1}</span>
              </div>
              
              {station.status === 'completed' && (
                <div className="absolute left-6 text-green-500">
                  <CheckCircle2 size={24} />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Station Details */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedStation ? (
              <motion.div
                key={selectedStation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[60px] p-10 md:p-16 shadow-2xl border border-[#4e635a]/5 relative overflow-hidden h-full"
              >
                {/* Decorative Background Icon */}
                <div 
                  className="absolute -top-20 -left-20 opacity-[0.03] scale-[4]"
                  style={{ color: selectedStation.color }}
                >
                  {selectedStation.icon}
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6">
                      <div 
                        className="w-20 h-20 rounded-[30px] flex items-center justify-center text-white shadow-xl"
                        style={{ backgroundColor: selectedStation.color }}
                      >
                        {selectedStation.icon}
                      </div>
                      <div>
                        <h2 className="text-5xl font-bold text-[#1b1c1a] font-serif mb-2">{selectedStation.title}</h2>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500" />
                           <span className="text-sm font-bold text-[#4e635a]/60 uppercase tracking-widest">مقام القلب</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-2xl text-[#4e635a] leading-relaxed mb-16 font-medium">
                    {selectedStation.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <section className="bg-gray-50 rounded-[40px] p-10">
                      <div className="flex items-center gap-3 mb-8 text-[#4e635a]">
                        <ScrollText size={24} />
                        <h3 className="text-xl font-bold font-serif">دروس المحطة</h3>
                      </div>
                      <ul className="space-y-6">
                        {selectedStation.lessons.map((lesson, i) => (
                          <li key={i} className="flex gap-4 group">
                             <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-[#4e635a] group-hover:bg-[#4e635a] group-hover:text-white transition-colors border border-[#4e635a]/10">
                               {i + 1}
                             </div>
                             <p className="text-lg text-[#1b1c1a]/80 font-medium leading-normal">{lesson}</p>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="bg-red-50/50 rounded-[40px] p-10 border border-red-100/50">
                      <div className="flex items-center gap-3 mb-8 text-red-700">
                        <MapIcon size={24} />
                        <h3 className="text-xl font-bold font-serif">تحديات الطريق</h3>
                      </div>
                      <div className="space-y-4">
                        {selectedStation.challenges.map((challenge, i) => (
                          <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/60 border border-red-100 hover:border-red-200 transition-all group">
                             <ArrowRight className="text-red-300 group-hover:translate-x-[-4px] transition-transform" size={18} />
                             <p className="text-lg text-red-900/80 font-bold">{challenge}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {selectedStation.status === 'locked' && (
                    <div className="mt-12 p-8 rounded-[40px] bg-gray-900 text-white flex items-center justify-between shadow-xl shadow-gray-900/20">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                          <Lock size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-xl mb-1">المحطة مقفلة حالياً</p>
                          <p className="text-sm opacity-60">أكمل التحديات في المحطة السابقة للفتح</p>
                        </div>
                      </div>
                      <button className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-black text-sm uppercase tracking-widest hover:bg-yellow-400 transition-all">
                        ابدأ السلوك
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center bg-[#4e635a]/5 rounded-[60px] border-2 border-dashed border-[#4e635a]/10">
                <p className="text-[#4e635a]/40 font-bold text-xl uppercase tracking-widest">اختر محطة من الخريطة</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
