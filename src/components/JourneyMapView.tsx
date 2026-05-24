import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Star, Lock, CheckCircle2, ArrowRight, ShieldCheck, Heart, Map as MapIcon, ScrollText } from 'lucide-react';
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
    title: 'اليقظة 🌟',
    description: 'أن يصحو قلبك من دوامة الغفلة وصخب الدنيا، وتلتفت للحظة لتسأل نفسك: إلى أين يمضي عمري؟ وهي أول وأهم خطوة في طريقك إلى الله.',
    color: '#10B981',
    icon: <Star size={24} />,
    lessons: [
      'رؤية النعم المستورة: أن تتأمل في نعم الله العظيمة التي غمرك بها في جسدك وحياتك دون أن تطلبها.',
      'قيمة عمرك: أن تدرك بصدق أن يومك الذي يمر هو جزء من عمرك الغالي، وأنه أثمن من أن يضيع في فراغ.',
      'صيانة القلب: أن تنتبه للخدوش الصغيرة والآثار التي تتركها العادات السيئة والذنوب على سلامك.'
    ],
    challenges: [
      'التحدي 1: ابعد عن رفقاء السوء والطلعات التي تضيع وقتك ودينك، وابحث عن صحبة تذكرك بالخير وتدعم طموحك.',
      'التحدي 2: جاهد نفسك بكل شجاعة هذا الأسبوع لكي تستيقظ لصلاة الفجر في وقتها، فهي مفتاح بركة يومك.',
      'التحدي 3: خفف قليلاً من المبالغة في الأمور العادية (ككثرة السهر، النوم الطويل، وتصفح الشاشات بلا فائدة) لتترك مساحة لروحك لتتنفس.'
    ]
  },
  {
    id: 'repentance',
    title: 'التوبة 🔄',
    description: 'الرجوع الصادق إلى الله وفك عقدة الإصرار على المعاصي والتقصير لتعود لربك خفيفًا طاهرًا.',
    color: '#3B82F6',
    icon: <ShieldCheck size={24} />,
    requirement: { minutes: 15, sessions: 2, streak: 1 },
    lessons: [
      'شروط التوبة الصادقة: الاعتراف بالخطأ والندم بصدق والعزم الأكيد على عدم العودة.',
      'رد الحقوق المعنوية والمادية: طلب السماح ممن ظلمته أو أسأت إليه وبدء صفحة نقية مع الله والناس.',
      'الاستغفار الدائم: جعل لسانك رطبًا بطلب المغفرة لكي تذوب ذنوبك وتطمئن روحك.'
    ],
    challenges: [
      'التحدي 1: الثبات التام والتحمل الصادق أمام حنين النفس للخطأ أو العادات القديمة السيئة.',
      'التحدي 2: الاعتذار والتصالح مع صديق أو قريب أسأت إليه أو قاطعته في السابق لإرجاع الود.',
      'التحدي 3: تنظيف حساباتك وتطبيقات شاشتك من أي أمور تخدش سلام وإيمان قلبك لتعيش خلوة طاهرة.'
    ]
  },
  {
    id: 'patience',
    title: 'الصبر 🛡️',
    description: 'حبس النفس عن الجزع وكظم الغيظ، والتمسك بالعمل والعبادة بهدوء وثقة كاملة بوعد الله عز وجل.',
    color: '#F59E0B',
    icon: <Lock size={24} />,
    requirement: { minutes: 50, sessions: 4, streak: 2 },
    lessons: [
      'الصبر على الطاعات: المواظبة الدائمة على السعي اليومي وجلسة الإصلاح اليومية رغم الفتور والكسل.',
      'الصبر عن المعاصي: بناء درع تقوى صلب يحميك من تشتت الشاشات والوقوع في شرك العادات السيئة.',
      'الصبر على الأقدار: استقبال تغيرات وهزات الحياة بقلب هادئ متيقن برحمة وتدبير الله الخبير.'
    ],
    challenges: [
      'التحدي 1: كظم غيظك هذا الأسبوع بالكامل عند المناقشة مع الأهل أو الأصدقاء والرد بكلمات طيبة.',
      'التحدي 2: الاستمرار في مسبحة السر والوعي الداخلي لـ 3 أيام متتالية دون انقطاع لتأكيد الانضباط.',
      'التحدي 3: التوقف الكامل التام عن الشكوى والتذمر للخلق، وحصر بث الهم والحزن لله وحده في السجود.'
    ]
  },
  {
    id: 'gratitude',
    title: 'الشكر 🌱',
    description: 'الشكر ليس مجرد كلمة ترددها باللسان؛ بل هو أن يرى الله أثر نعمته في طيب كلماتك، ونقاء قلبك، واستعمال عافيتك وصحتك في السعي والخير، بدلاً من الكسل والشكوى.',
    color: '#8B5CF6',
    icon: <Heart size={24} />,
    requirement: { minutes: 150, sessions: 10, streak: 3 },
    lessons: [
      'الحمد الصامت: أن تتعلم كيف تشكر الله على النعم المستورة التي لا يراها الناس فيك (كالعقل، الستر، الأمان، والصحة) قبل النعم الظاهرة.',
      'بركة الموجود: أن تركز على ما تملكه الآن وتستثمره بذكاء، بدلاً من تضييع عمرك في التذمر والنظر لما في أيدي الآخرين.',
      'عطاء بدون مقابل: أن تدرك أن قمة الشكر لنعمة الوعي والعلم هي أن تنفع بها من حولك وتدعمهم بكل لطف وبساطة.'
    ],
    challenges: [
      'التحدي 1: البحث عن النور وسط التعب - عاهد نفسك هذا الأسبوع، كلما واجهتك مشكلة في دراستك أو عملك أو ضيق في ميزانيتك، ألا تشتكي لأحد؛ بل توقف فوراً واذكر ثلاث نعم عظيمة في حياتك وقل "الحمد لله" بيقين.',
      'التحدي 2: طهارة الجوارح - صُن عينك ولسانك ويدك عن أي أمر نهى الله عنه هذا الأسبوع. اجعل شكرك لعافية جسدك هو أن تستعمل هذا الجسد في السعي الحلال وبناء مهاراتك لتكون يداً عليا مستغنية.',
      'التحدي 3: انشر الأمل والخير - كن خفيفاً ومبشراً بين أصحابك وأهلك؛ قل كلمة طيبة، ساعد من يحتاجك بصمت دون كبر أو منّ، واجعل حضورك في المجالس والرسائل يجلب الطمأنينة لا العبء والشكوى.'
    ]
  },
  {
    id: 'contentment',
    title: 'الرضا ☀️',
    description: 'سكون القلب واطمئنانه تحت مجاري الأقدار وتدابير الله العليم، وهي جنة الدنيا المستعجلة التي تطيب بها نفسك ويستريح بها وعيك.',
    color: '#EC4899',
    icon: <CheckCircle2 size={24} />,
    requirement: { minutes: 300, sessions: 20, streak: 5 },
    lessons: [
      'الرضا بمكروه القضاء: استقبال التحديات والأقدار الصعبة كأنها هدايا مغلفة من الله لتطهيرك واصطفائك.',
      'طمأنينة التفويض العميقة: تسليم مقاديرك كلها لرب العالمين بوعي تام وزوال القلق النفسي والفكري.',
      'جنة الاستغناء الصادقة: الشعور بالغنى الكامل بالله واليقين التام بما لديه أكثر مما تملكه يداك.'
    ],
    challenges: [
      'التحدي 1: الرضا التام وعدم الاعتراض على أقدار الله المالية أو الصحية، والتركيز على السعي بابتسامة راضية.',
      'التحدي 2: التخلص التام من قلق المستقبل والخوف منه، معيشاً يومك الحالي بتمام السلام والإيمان والتوكل.',
      'التحدي 3: البقاء في خلوة صامتة ونصف ساعة من الذكر الخالص لله للاستغناء بربك الكريم عن كل ما سواه.'
    ]
  }
];

export default function JourneyMapView({ 
  userProfile, 
  onTabChange 
}: { 
  userProfile: UserProfile | null;
  onTabChange?: (tab: 'retreat' | 'dhikr' | 'stories' | 'habits' | 'ethics' | 'nasheeds' | 'history' | 'journey' | 'quiz' | 'journal' | 'insights' | 'profile' | 'time' | 'spiritual-mirror' | 'spiritual-insights' | 'prayer-times') => void;
}) {
  const stations = useMemo(() => {
    if (!userProfile) return STATION_TEMPLATE.map(s => ({ ...s, status: 'locked' as const }));

    return STATION_TEMPLATE.map((station, index) => {
      let status: 'locked' | 'current' | 'completed' = 'locked';
      
      const userMins = userProfile.totalMinutes ?? 0;
      const userStreak = userProfile.currentStreak ?? 0;
      const userSessions = userProfile.totalSessions ?? 0;

      const isMet = !station.requirement || (
        (userMins >= (station.requirement.minutes || 0)) &&
        (userSessions >= (station.requirement.sessions || 0)) &&
        (userStreak >= (station.requirement.streak || 0))
      );

      // Station 0 (Awakening) is unlocked by default
      if (index === 0) {
        // Safe check for repentance requirements to determine if completed
        const next = STATION_TEMPLATE[1];
        const nextMet = next && next.requirement && (
          userMins >= (next.requirement.minutes || 0) &&
          userSessions >= (next.requirement.sessions || 0) &&
          userStreak >= (next.requirement.streak || 0)
        );
        status = nextMet ? 'completed' : 'current';
      } else {
        // Unlocked only if previous one is met
        const prev = STATION_TEMPLATE[index - 1];
        const prevMet = !prev.requirement || (
          userMins >= (prev.requirement.minutes || 0) &&
          userSessions >= (prev.requirement.sessions || 0) &&
          userStreak >= (prev.requirement.streak || 0)
        );

        if (prevMet) {
          if (isMet) {
            // Check if next is also met to mark as completed
            const next = STATION_TEMPLATE[index + 1];
            const nextMet = next && next.requirement && (
              userMins >= (next.requirement.minutes || 0) &&
              userSessions >= (next.requirement.sessions || 0) &&
              userStreak >= (next.requirement.streak || 0)
            );
            status = nextMet ? 'completed' : 'current';
          } else {
            status = 'current';
          }
        } else {
          status = 'locked';
        }
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
          <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">طريق السلوك والترقية</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold text-[#1b1c1a] font-serif mb-6 leading-tight">رحلة المسافر إلى الله</h1>
        <p className="text-lg md:text-xl text-[#4e635a]/80 max-w-2xl mx-auto leading-relaxed">
          خريطة قلبك.. خطوات محددة نمشيها معاً خطوة بخطوة، لتكتشف أين يقف قلبك الآن، وما هو التحدي القادم لترتاح نفسك وتطمئن.
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" dir="rtl">
        {/* The Map / Timeline */}
        <div className="lg:col-span-4 space-y-4 relative">
          {/* Connecting Line */}
          <div className="absolute top-0 bottom-0 right-[43px] w-1 bg-gradient-to-b from-[#4e635a]/5 via-[#4e635a]/20 to-transparent rounded-full" />
          
          {stations.map((station, index) => (
            <motion.button
              key={station.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedStationId(station.id)}
              className={cn(
                "w-full flex items-center gap-6 p-6 rounded-[35px] transition-all relative group text-right",
                selectedStationId === station.id 
                  ? "bg-white shadow-2xl scale-[1.02] border-r-8 border-[#4e635a]" 
                  : "hover:bg-white/40 opacity-75"
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
                {station.status === 'locked' ? <Lock size={20} className="text-gray-500" /> : station.icon}
              </div>
              <div className="text-right flex-grow">
                <h3 className="font-bold text-xl font-serif text-[#1b1c1a]">{station.title}</h3>
                <span className="text-xs font-bold text-[#4e635a]/60 uppercase tracking-widest">المحطة {index + 1}</span>
              </div>
              
              {station.status === 'completed' && (
                <div className="text-green-500">
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
                className="bg-white rounded-[60px] p-10 md:p-16 shadow-2xl border border-[#4e635a]/5 relative overflow-hidden h-full text-right"
              >
                {/* Decorative Background Icon */}
                <div 
                  className="absolute -top-20 -left-20 opacity-[0.03] scale-[4]"
                  style={{ color: selectedStation.color }}
                >
                  {selectedStation.icon}
                </div>

                <div className="relative z-10 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div 
                        className="w-20 h-20 rounded-[30px] flex items-center justify-center text-white shadow-xl"
                        style={{ backgroundColor: selectedStation.color }}
                      >
                        {selectedStation.icon}
                      </div>
                      <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#1b1c1a] font-serif mb-2">{selectedStation.title}</h2>
                        <div className="flex items-center gap-2 justify-start">
                           <div className="w-2 h-2 rounded-full bg-green-500" />
                           <span className="text-sm font-bold text-[#4e635a]/60 uppercase tracking-widest">مقام القلب</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xl md:text-2xl text-[#4e635a] leading-relaxed font-medium">
                    {selectedStation.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <section className="bg-[#fbf9f6] rounded-[40px] p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-6 text-[#4e635a]">
                        <ScrollText size={24} />
                        <h3 className="text-xl font-bold font-serif">دروس المحطة</h3>
                      </div>
                      <ul className="space-y-6">
                        {selectedStation.lessons.map((lesson, i) => (
                          <li key={i} className="flex gap-4 group items-start">
                             <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-[#4e635a] shrink-0 border border-[#4e635a]/10">
                               {i + 1}
                             </div>
                             <p className="text-base md:text-lg text-[#1b1c1a]/80 font-medium leading-normal">{lesson}</p>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section className="bg-red-50/50 rounded-[40px] p-8 md:p-10 border border-red-100/30">
                      <div className="flex items-center gap-3 mb-6 text-red-700">
                        <MapIcon size={24} />
                        <h3 className="text-xl font-bold font-serif">تحديات الطريق</h3>
                      </div>
                      <div className="space-y-4">
                        {selectedStation.challenges.map((challenge, i) => (
                          <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-red-100/50 hover:border-red-200 transition-all group">
                             <ArrowRight className="text-red-300 group-hover:translate-x-[-4px] transition-transform shrink-0 mt-1" size={18} />
                             <p className="text-base md:text-lg text-red-950 font-bold leading-normal">{challenge}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {selectedStation.status === 'locked' ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-12 p-8 rounded-[40px] bg-[#1e2321] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-950/10 border border-white/5"
                    >
                      <div className="flex items-start gap-6 leading-relaxed max-w-xl text-right">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-amber-500">
                          <Lock size={24} />
                        </div>
                        <div className="space-y-4 w-full">
                          <div>
                            <p className="font-bold text-2xl mb-1 text-amber-500 font-serif">المحطة مقفلة حالياً</p>
                            <p className="text-sm text-[#c0cfc6] font-medium leading-relaxed">
                              الارتقاء لا يأتي بالقراءة فقط؛ التحديات تفتح تلقائياً عندما يسجل النظام دقائق استثمارك الحقيقية في خلوتك الصادقة، وبناء وعيك الذاتي، والمحافظة على استمرارك اليومي.
                            </p>
                          </div>
                          
                          {/* Live requirements stats if present */}
                          {selectedStation.requirement && (
                            <div className="bg-[#141816]/80 p-5 rounded-2xl border border-white/5 space-y-4">
                              <p className="text-xs font-black text-amber-500/80 border-b border-white/10 pb-2">سعي السلوك المطلوب لفتح المحطة:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-white/90">
                                    <span>مجموع وقت الاستثمار:</span>
                                    <span>{userProfile?.totalMinutes ?? 0} / {selectedStation.requirement.minutes ?? 0} دقيقة</span>
                                  </div>
                                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                      style={{ width: `${Math.min(100, (((userProfile?.totalMinutes ?? 0) / (selectedStation.requirement.minutes || 1)) * 100))}%` }}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-white/90">
                                    <span>أيام الانضباط المتتالية:</span>
                                    <span>{userProfile?.currentStreak ?? 0} / {selectedStation.requirement.streak ?? 0} يوم</span>
                                  </div>
                                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                                      style={{ width: `${Math.min(100, (((userProfile?.currentStreak ?? 0) / (selectedStation.requirement.streak || 1)) * 100))}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => onTabChange && onTabChange('retreat')}
                        className="px-8 py-5 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base transition-all duration-200 shadow-lg shadow-emerald-950/40 shrink-0 w-full md:w-auto hover:scale-[1.03] active:scale-95"
                      >
                        🚀 ابدأ السعي الآن
                      </button>
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center bg-[#4e635a]/5 rounded-[60px] border-2 border-dashed border-[#4e635a]/10 py-20">
                <p className="text-[#4e635a]/40 font-bold text-xl uppercase tracking-widest text-center">اختر محطة من الخريطة</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
