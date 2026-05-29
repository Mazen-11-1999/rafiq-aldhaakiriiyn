import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, ChevronLeft, Star, Quote, History, Search, Users, Play, Lightbulb, Heart, Scale, Brain, MessageSquareQuote, Target, Sparkles, CheckCircle2, Check, ClipboardList, EyeOff, ShieldAlert } from 'lucide-react';
import { prophetStories, type Story } from '../data/stories';
import InsightPanel from './InsightPanel';
import { useChallenges } from '../context/ChallengeContext';
import { cn } from '../lib/utils';

export interface RadarProphet {
  id: string;
  name: string;
  avatar: string;
  ibrah: string;
  risalah: string;
  wajib: string;
}

export const radarProphets: RadarProphet[] = [
  {
    id: 'adam',
    name: 'آدم عليه السلام',
    avatar: '🛡️',
    ibrah: 'ليس الشرف في هجر الخطأ، بل في مهارة العودة السريعة لله تعالى والاعتراف بالتقصير.',
    risalah: 'إذا سقطت في وحل الغفلة الشهوانية، لا تقنط؛ امسك حبل الاستغفار وابدأ صفحة جديدة رافعا رأسك مع ربك.',
    wajib: 'الاستغفار الفوري بدمعة ندم عند كل هفوة والانتقال فورا لعمل صالح يمحوها.'
  },
  {
    id: 'nuh',
    name: 'نوح عليه السلام',
    avatar: '⛵',
    ibrah: 'النتائج والقبول بيد ربك وحده، وواجبك هو ثبات السعي والعمل المتقن مهما كثر المستهزئون.',
    risalah: 'لا تهتم بكلام المحبطين وسخريتهم؛ ابق صادقا في سفينة طاعتك بظهر مفرود وعزم واثق.',
    wajib: 'الاستمرار في عملك الصالح حتى لو كنت فيه وحدك، وتجاهل مثبطي العزائم بالكامل.'
  },
  {
    id: 'ibrahim',
    name: 'إبراهيم عليه السلام',
    avatar: '🕋',
    ibrah: 'الابتلاء تصفية، واليقين الصادق يقلب نيران الشبهات والشهوات بردا وسلاما بقلبك.',
    risalah: 'حطم أصنام التعلق بغير الله في قلبك، ولا تقدم هوى نفسك على عزم دينك وقيمك الشامخة.',
    wajib: 'ترك عادة أو منفعة مادية فيها شبهة تغضب الله إيثارا لرضاه وحده بصدق.'
  },
  {
    id: 'yusuf',
    name: 'يوسف عليه السلام',
    avatar: '👑',
    ibrah: 'حماية العفة والبصيرة هي بيت عزك الأبدي ومفتاح التمكين والقبول الحق.',
    risalah: 'الشاشات المغلقة هي امتحان ليلك؛ حين تدعى للغلط هنا، فقل بصدق نية "معاذ الله" واغلق عينك ساعيا لربك.',
    wajib: 'إغلاق الهاتف فور هجوم فكرة الحرام، وتجنب خلوات الإنترنت تماما.'
  },
  {
    id: 'musa',
    name: 'موسى عليه السلام',
    avatar: '🌾',
    ibrah: 'الرجولة شهامة صامتة، والحياء درع عظيمة تحفظ الوقار والهيبة وتثمر البركة الوفيرة.',
    risalah: 'عندما تتعامل مع النساء في واقعك أو عبر الفضاء الرقمي، سق المعروف بأدب ثم "تولى إلى ظل طاعتك" دون فضول أو خداع.',
    wajib: 'كف البصر وغض الطرف، واختصار المحادثات مع الجنس الآخر فيما يفيد بالحد الأدنى وبأعلى وقار.'
  },
  {
    id: 'ayub',
    name: 'أيوب عليه السلام',
    avatar: '🩹',
    ibrah: 'الرضا الصامت والحمد المتواصل هما تاج القوة الحقيقي عند نزول البلاء وتغير الأحوال.',
    risalah: 'لا تشتك ربك وتدبيره لخلقه؛ بل اشك بثك وحزنك وضعفك للرحيم الودود سرا لتبرأ روحك وتسكن.',
    wajib: 'التوقف التام عن التسخط أو الشكوى للناس عند الألم، واللجوء للوضوء ومناجاة المحراب بأدب.'
  },
  {
    id: 'yunus',
    name: 'يونس عليه السلام',
    avatar: '🐋',
    ibrah: 'الاعتراف بالتقصير مع الاستعانة بالتسبيح هو مفكك الكربات العسيرة في أضيق البقاع والظلمات.',
    risalah: 'مهما بلغت ظلمة مشكلاتك وضيقت مجالك بظن الخناق، فلن تضيق على من يفزع للتسبيح الصادق والذكر الدائم.',
    wajib: 'إلزام النفس بورد استغفار وتسبيح يومي (لا إله إلا أنت سبحانك إني كنت من الظالمين) بخشوع حقيقي.'
  },
  {
    id: 'isa',
    name: 'عيسى عليه السلام',
    avatar: '✨',
    ibrah: 'نقاء الروح وزهد الجسد يحفظان صلتك بالسماء في عصر طغيان الميكانيكا والمادة غيابا وزخرفا.',
    risalah: 'لا تدع زخارف المظاهر الدنيوية تسرق سمو باطنك وطهارة قلبك عن حقيقة العبودية الصافية لله.',
    wajib: 'تخصيص ساعة صمت وتفكر يومية في نعم الله بعيدا عن صخب السوشيال ميديا وشبكات التواصل.'
  },
  {
    id: 'muhammad',
    name: 'محمد صلى الله عليه وسلم',
    avatar: '🕌',
    ibrah: 'الصدق التام والأمانة المطلقة هما أساس العهد ومربط الشرف والرجولة النبوية الحقة.',
    risalah: 'سيرة الحبيب سلك عملي متواصل؛ أحضر هيبة الوقار والأدب العالي في مأكلك، ومالك، ومعاملتك بظهر مفرود.',
    wajib: 'مراجعة كسب قروش مالك يوميا والتزام صفة الصدق المطلق في الحديث مع الخصوم والأصدقاء على حد سواء.'
  }
];

interface RadarOfImitationProps {
  commitments: Record<string, boolean>;
  onToggleCommitment: (id: string) => void;
}

function RadarOfImitation({ commitments, onToggleCommitment }: RadarOfImitationProps) {
  const [activeTab, setActiveTab] = useState<'slider' | 'table'>('slider');
  const [selectedRadarId, setSelectedRadarId] = useState<string>('yusuf');

  const completedCount = useMemo(() => {
    return radarProphets.filter(p => commitments[p.id]).length;
  }, [commitments]);

  const percentage = useMemo(() => {
    return Math.round((completedCount / radarProphets.length) * 100);
  }, [completedCount]);

  const invitationMessage = useMemo(() => {
    if (completedCount === 0) {
      return 'يا أخي، انقر على زر "أعاهد الله على التغيير" أسفل أحد الأنبياء لتبدأ عهداً صادقاً بين العلم والعمل اليوم!';
    } else if (completedCount <= 3) {
      return 'بداية طيبة ومباركة.. لقد بدأت تخطو أولى خطواتك العملية في الاقتداء الصادق بصفوة الخلق. استمر وثبّت قلبك!';
    } else if (completedCount <= 6) {
      return 'خطوات نيرة ومبشرة! لقد أصبحت بعض واجبات الأنبياء العملية سلوكاً حقيقياً يحمي عفتك ويزكي باطنك.';
    } else {
      return 'صلة عميقة ومباركة بسفينة النجاة وهدي الأنبياء! أنت تسير اليوم بعزم واثق، مستلهماً هدي الأنبياء الطاهرين في خطواتك اليومية.';
    }
  }, [completedCount]);

  const selectedProphet = useMemo(() => {
    return radarProphets.find(p => p.id === selectedRadarId) || radarProphets[3]; // Default to Yusuf
  }, [selectedRadarId]);

  return (
    <div className="glass-3d p-8 rounded-[3.5rem] border border-[#4e635a]/10 space-y-8 text-right relative overflow-hidden bg-white/50 mb-8">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#4e635a]/5 rounded-bl-[100px] pointer-events-none" />
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-6 pb-2 border-b border-[#4e635a]/10">
        <div className="space-y-2 flex-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4e635a]/10 text-[#4e635a] text-xs font-black rounded-full border border-[#4e635a]/20">
            ✨ طهارة الباطن بالاقتداء ومخالفة الهوى
          </span>
          <h3 className="text-2xl font-black text-slate-900 font-serif leading-tight">
            كيف نقتدي بالأنبياء في حياتنا اليومية؟
          </h3>
          <p className="text-[#655d51] text-xs md:text-sm font-bold leading-relaxed max-w-2xl font-serif">
            بدلاً من قراءة قصص الأنبياء كتاريخ مضى، جمعنا لك هنا العِبر والرسائل والخطوات العملية لكل نبي. اقرأ الدرس ثم انقر على زر العهد لتنوي بصادق نيتك الالتزام بالواجب ومجاهدة نفسك.
          </p>
        </div>

        {/* Dynamic Score Indicator */}
        <div className="flex items-center gap-4 bg-white/80 p-5 rounded-[2.5rem] border border-[#4e635a]/10 shadow-sm shrink-0 flex-row-reverse">
          <div className="relative flex items-center justify-center w-16 h-16">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                className="text-[#4e635a]/10"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                className="text-[#4e635a]"
                strokeWidth="5"
                strokeDasharray={175}
                strokeDashoffset={175 - (175 * percentage) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
            </svg>
            <span className="absolute text-sm font-black text-slate-800">{completedCount}/9</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-[#8da399] uppercase tracking-wider block">الواجبات التي نويت الالتزام بها</span>
            <span className="text-sm font-black text-[#4e635a]">{percentage}% عهود صادقة</span>
          </div>
        </div>
      </div>

      {/* Invitation & Encouragement Message */}
      <div className="bg-[#4e635a]/5 p-4 rounded-2xl border border-[#4e635a]/10 text-right">
        <p className="text-xs md:text-sm font-bold text-[#4e635a] flex items-center gap-2 flex-row-reverse leading-relaxed font-serif">
          <Sparkles size={16} className="shrink-0 text-amber-500 animate-pulse" />
          <span>{invitationMessage}</span>
        </p>
      </div>

      {/* Tab Selectors */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setActiveTab('table')}
          className={cn(
            "px-5 py-2.5 rounded-2xl text-xs font-black transition-all border flex items-center gap-2 flex-row-reverse",
            activeTab === 'table'
              ? "bg-[#4e635a] text-white border-transparent shadow-lg shadow-[#4e635a]/10"
              : "bg-white/80 text-[#4e635a] border-[#4e635a]/15 hover:bg-white"
          )}
        >
          <ClipboardList size={14} />
          <span>عرض جميع الأنبياء في جدول واحد</span>
        </button>
        <button
          onClick={() => setActiveTab('slider')}
          className={cn(
            "px-5 py-2.5 rounded-2xl text-xs font-black transition-all border flex items-center gap-2 flex-row-reverse",
            activeTab === 'slider'
              ? "bg-[#4e635a] text-white border-transparent shadow-lg shadow-[#4e635a]/10"
              : "bg-white/80 text-[#4e635a] border-[#4e635a]/15 hover:bg-white"
          )}
        >
          <Users size={14} />
          <span>تصفح الأنبياء واحداً تلو الآخر</span>
        </button>
      </div>

      {/* Tabs Manifestation */}
      <AnimatePresence mode="wait">
        {activeTab === 'slider' ? (
          <motion.div
            key="slider-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Horizontal Prophet Badges */}
            <div className="flex flex-wrap gap-2 justify-end">
              {radarProphets.map((p) => {
                const isSelected = selectedRadarId === p.id;
                const hasPledged = !!commitments[p.id];
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedRadarId(p.id)}
                    className={cn(
                      "px-4 py-3 rounded-2xl border transition-all text-sm font-bold flex items-center gap-2 flex-row-reverse",
                      isSelected
                        ? "bg-[#4e635a] text-white border-transparent shadow-md"
                        : "bg-white/90 text-slate-700 border-[#4e635a]/10 hover:bg-white"
                    )}
                  >
                    <span className="text-base">{p.avatar}</span>
                    <span>{p.name}</span>
                    {hasPledged && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 border border-white" title="تم عقد النية" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prophet Card details */}
            <div className="bg-white/90 p-6 md:p-8 rounded-[2.5rem] border border-[#d1e8dd] shadow-sm space-y-6 text-right relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#4e635a]/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center gap-3 flex-row-reverse justify-between">
                <div className="flex items-center gap-3 flex-row-reverse">
                  <span className="text-3xl">{selectedProphet.avatar}</span>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 font-serif">{selectedProphet.name}</h4>
                    <span className="text-[10px] font-bold text-[#8da399] uppercase tracking-wider block">خطوات الاقتداء والعمل المشترك</span>
                  </div>
                </div>
                {commitments[selectedProphet.id] && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-black rounded-full border border-amber-200 font-serif">
                    ✓ نويت التزام هذا السلوك
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {/* الدرس والعبرة */}
                <div className="bg-[#fbf9f6] p-5 rounded-2xl border border-[#4e635a]/5 space-y-2">
                  <span className="text-xs font-black text-[#4e635a] block pb-1 border-b border-black/5">💡 الدرس والعبرة من قصته:</span>
                  <p className="text-sm font-bold text-[#4e635a] leading-relaxed font-serif">
                    {selectedProphet.ibrah}
                  </p>
                </div>

                {/* كيف تفيدك */}
                <div className="bg-[#4e635a]/5 p-5 rounded-2xl border border-[#4e635a]/5 space-y-2">
                  <span className="text-xs font-black text-slate-500 block pb-1 border-b border-[#4e635a]/10">💌 كيف تفيدك قصته في حياتك اليوم؟</span>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed font-serif">
                    {selectedProphet.risalah}
                  </p>
                </div>

                {/* الواجب العملي */}
                <div className="bg-[#4e635a] text-white p-5 rounded-2xl space-y-2 shadow-inner">
                  <span className="text-xs font-black text-emerald-200 block pb-1 border-b border-white/10">🎯 الواجب العملي المطلوب منك الآن:</span>
                  <p className="text-sm font-bold leading-relaxed font-serif">
                    {selectedProphet.wajib}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onToggleCommitment(selectedProphet.id)}
                  className={cn(
                    "px-8 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center gap-3 justify-center shadow-md cursor-pointer",
                    commitments[selectedProphet.id]
                      ? "bg-amber-100/80 text-amber-800 border-2 border-amber-300 shadow-none hover:bg-amber-200/50"
                      : "bg-[#4e635a] text-white hover:bg-[#3d4d46] hover:-translate-y-0.5 active:scale-95"
                  )}
                >
                  {commitments[selectedProphet.id] ? (
                    <>
                      <CheckCircle2 size={16} className="text-amber-600 animate-pulse" />
                      <span>تراجع عن الالتزام (مراودة نفسي)</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>✓ أعاهد الله على التغيير والالتزام</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="table-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full overflow-x-auto rounded-3xl border border-[#4e635a]/10 shadow-sm bg-white"
          >
            <table className="w-full text-right border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#4e635a]/10 text-[#4e635a] font-black text-xs border-b border-[#4e635a]/20">
                  <th className="p-4 md:p-5">الأنبياء عليهم السلام</th>
                  <th className="p-4 md:p-5 w-[30%]">الدرس والعبرة لقوم يتفكرون</th>
                  <th className="p-4 md:p-5 w-[30%]">كيف يواجه هذا درس حياتك الواقعية؟</th>
                  <th className="p-4 md:p-5 w-[25%]">الواجب العملي الذي تبدأ به فوراً</th>
                  <th className="p-4 md:p-5 text-center">قرار الالتزام والوعد مع الله</th>
                </tr>
              </thead>
              <tbody>
                {radarProphets.map((p, index) => {
                  const hasPledged = !!commitments[p.id];
                  return (
                    <tr
                      key={p.id}
                      className={cn(
                        "text-xs md:text-sm border-b border-slate-100 last:border-0 font-medium hover:bg-slate-50/50 transition-colors",
                        hasPledged ? "bg-amber-500/5" : ""
                      )}
                    >
                      {/* Name / Avatar */}
                      <td className="p-4 md:p-5 font-bold align-top">
                        <div className="flex items-center gap-2 flex-row-reverse justify-end">
                          <span className="text-xl shrink-0">{p.avatar}</span>
                          <span className="text-slate-800 select-none">{p.name}</span>
                        </div>
                      </td>

                      {/* الدرس والعبرة */}
                      <td className="p-4 md:p-5 text-slate-800 line-clamp-none font-serif leading-relaxed text-[#4e635a] align-top">
                        {p.ibrah}
                      </td>

                      {/* كيف يواجه */}
                      <td className="p-4 md:p-5 text-slate-600 line-clamp-none font-serif leading-relaxed align-top">
                        {p.risalah}
                      </td>

                      {/* الواجب */}
                      <td className="p-4 md:p-5 text-xs font-semibold text-slate-900 border-r border-[#4e635a]/5 bg-[#fbf9f6]/40 align-top leading-relaxed">
                        {p.wajib}
                      </td>

                      {/* قرار الالتزام */}
                      <td className="p-4 md:p-5 text-center align-middle">
                        <button
                          onClick={() => onToggleCommitment(p.id)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 mx-auto min-w-[125px] cursor-pointer",
                            hasPledged
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-[#4e635a]/10 text-[#4e635a] hover:bg-[#4e635a]/20"
                          )}
                        >
                          {hasPledged ? (
                            <>
                              <CheckCircle2 size={12} className="text-amber-600 shrink-0" />
                              <span>نويت الالتزام</span>
                            </>
                          ) : (
                            <>
                              <span>أعاهد الله</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


const StoryCard = React.memo(({ story, onClick }: { story: Story; onClick: (s: Story) => void }) => (
  <motion.button
    layout
    whileHover={{ x: -10 }}
    onClick={() => onClick(story)}
    className="group relative bg-white/60 backdrop-blur-md p-8 rounded-[3rem] border border-white hover:border-[#4e635a] hover:shadow-2xl hover:shadow-[#4e635a]/5 transition-all duration-500 text-right w-full overflow-hidden"
  >
    <div className="flex flex-col md:flex-row-reverse justify-between items-start md:items-center gap-6 w-full">
       <div className="flex items-center gap-4 flex-row-reverse">
         <div className="w-14 h-14 rounded-2xl bg-[#fbf9f6] flex items-center justify-center text-[#4e635a]/40 group-hover:bg-[#4e635a] group-hover:text-white transition-all duration-500 shadow-sm">
           {story.youtubeUrl ? <Play size={24} fill="currentColor" /> : <ChevronLeft size={28} className="rotate-180" />}
         </div>
         <div className="space-y-1">
           <h3 className="text-2xl font-bold text-[#4e635a] font-serif group-hover:text-[#4e635a] transition-colors">{story.name}</h3>
           <p className="text-sm text-[#8da399] font-bold tracking-wide leading-relaxed">{story.title}</p>
         </div>
       </div>

       <div className="flex-1 text-[#655d51] text-sm md:text-base leading-relaxed max-w-xl opacity-80 group-hover:opacity-100 transition-opacity">
         {story.summary}
       </div>
    </div>
    
    <div className="mt-6 pt-6 border-t border-[#d1e8dd]/30 flex items-center justify-end gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
       <span className="text-[10px] font-bold text-[#4e635a] tracking-[0.2em] uppercase">تصفح القصة الكاملة</span>
       <div className="w-1.5 h-1.5 rounded-full bg-[#4e635a] animate-pulse" />
    </div>
  </motion.button>
));

StoryCard.displayName = 'StoryCard';

export default function StoriesView() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInsightOpen, setIsInsightOpen] = useState(false);
  const { acceptChallenge } = useChallenges();

  const [commitments, setCommitments] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('prophet_commitments');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleCommitment = useCallback((prophetId: string) => {
    setCommitments(prev => {
      const updated = { ...prev, [prophetId]: !prev[prophetId] };
      localStorage.setItem('prophet_commitments', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const filteredStories = useMemo(() => 
    prophetStories.filter(s => 
      s.name.includes(searchTerm) || s.summary.includes(searchTerm)
    ),
    [searchTerm]
  );

  const handleStoryClick = useCallback((story: Story) => {
    setSelectedStory(story);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);


  return (
    <div className="p-margin-page space-y-section-gap pb-24">
      <header className="space-y-6 relative overflow-hidden p-8 rounded-[3rem] bg-gradient-to-br from-[#4e635a]/5 to-transparent border border-[#4e635a]/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d1e8dd]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#4e635a] rounded-2xl text-white shadow-xl shadow-[#4e635a]/20">
            <History size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#4e635a] font-serif">تعرف كيف سار الأنبياء على الطريق</h2>
            <p className="text-[#8da399] font-bold text-sm tracking-widest uppercase">سنة الله وطريقه في هداية البشر</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-4">
          <p className="text-[#655d51] font-bold leading-relaxed text-lg">
            نحن نؤمن أن الحياة أوسع من صخبها، وأن النهج الذي سار عليه الأنبياء هو البوصلة التي تعيدنا إلى فطرتنا. في 'سفينة النجاة'، نسعى لنكون جسراً يصل بك إلى معاني العدل، الرحمة، والتوحيد، لتسير في هذه الحياة وأنت مستندٌ على حقيقة لا تزول. استفد من العبر لتمشي على هذا النهج.
          </p>
          <div className="flex flex-wrap gap-2">
            {['التوحيد', 'الصبر', 'العدل', 'الرحمة'].map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-white text-[#4e635a] font-bold text-xs border border-[#4e635a]/10 shadow-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* قسم القدوة العملية في مواجهة الفتن */}
      {!selectedStory && (
        <RadarOfImitation commitments={commitments} onToggleCommitment={toggleCommitment} />
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4e635a]/30" size={18} />
        <input 
          type="text"
          placeholder="ابحث عن نبي..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/60 backdrop-blur-sm border border-white rounded-2xl py-4 pr-12 pl-4 text-[#4e635a] placeholder:text-[#4e635a]/30 focus:outline-none focus:ring-2 focus:ring-[#4e635a]/10 transition-all font-medium"
        />
      </div>

      <AnimatePresence mode="wait">
        {!selectedStory ? (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative space-y-12 before:absolute before:inset-y-0 before:right-[23px] before:w-[3px] before:bg-gradient-to-b before:from-[#4e635a]/40 before:via-[#4e635a]/10 before:to-transparent before:rounded-full"
          >
            {filteredStories.map((story, idx) => (
              <div key={story.id} className="relative pr-16 group/item">
                {/* Timeline Dot with Year/Era hint if available */}
                <div className="absolute top-8 right-2.5 w-10 h-10 rounded-2xl bg-white border-2 border-[#d1e8dd] group-hover/item:border-[#4e635a] flex items-center justify-center transition-all duration-500 z-10 shadow-lg group-hover/item:scale-110">
                  <div className="w-3 h-3 rounded-full bg-[#4e635a]/20 group-hover/item:bg-[#4e635a] transition-colors" />
                </div>
                
                <StoryCard story={story} onClick={handleStoryClick} />
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 bg-white/40 backdrop-blur-3xl p-8 rounded-[48px] border border-white relative overflow-hidden"
          >
            {/* Background Pattern Accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#d1e8dd]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />

            <button 
              onClick={() => setSelectedStory(null)}
              className="group flex items-center gap-3 bg-white/80 backdrop-blur-md border border-white px-6 py-3.5 rounded-[1.5rem] text-[#4e635a] font-bold text-sm shadow-xl shadow-black/5 hover:bg-[#4e635a] hover:text-white transition-all transform hover:-translate-x-2"
            >
              <ChevronLeft size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span>العودة لقصص الأنبياء</span>
            </button>

            <div className="space-y-2">
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                 <h3 className="text-4xl font-serif font-bold text-[#4e635a]">{selectedStory.name}</h3>
                 <div className="flex flex-wrap gap-3">
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setIsInsightOpen(true)}
                     className="flex items-center gap-2 bg-[#4e635a] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:bg-[#3d4d46] transition-all"
                   >
                     <Heart size={18} className="text-red-400" fill="currentColor" />
                     <span>نـصيحة مـحب</span>
                   </motion.button>

                   {selectedStory.videoLinks && selectedStory.videoLinks.length > 0 ? (
                     selectedStory.videoLinks.map((link, idx) => (
                       <a 
                         key={idx}
                         href={link.url} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg hover:scale-105"
                       >
                         <Play size={18} fill="white" />
                         <span>{link.label}</span>
                       </a>
                     ))
                   ) : selectedStory.youtubeUrl && (
                     <a 
                       href={selectedStory.youtubeUrl} 
                       target="_blank" 
                       rel="noreferrer"
                       className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg hover:scale-105"
                     >
                       <Play size={18} fill="white" />
                       <span>شاهد القصة فيديو</span>
                     </a>
                   )}
                 </div>
               </div>
               <p className="text-[#8da399] font-bold tracking-widest uppercase text-xs">{selectedStory.title}</p>
            </div>

            {selectedStory.companion && (
              <div className="bg-[#fbf9f6] p-4 rounded-2xl border border-[#4e635a]/5 inline-flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#d1e8dd] flex items-center justify-center text-[#4e635a]">
                   <Users size={20} />
                 </div>
                 <div>
                   <p className="text-[10px] text-[#4e635a]/60 font-bold uppercase tracking-widest">المرافق والسند</p>
                   <p className="text-[#4e635a] font-bold">{selectedStory.companion}</p>
                 </div>
              </div>
            )}

            <div className="relative">
              <Quote className="absolute -top-4 -right-4 text-[#d1e8dd] -z-10" size={60} />
              <p className="text-xl text-[#1b1c1a] font-serif leading-relaxed text-justify indent-8">
                {selectedStory.content}
              </p>
            </div>

            {/* --- New Conceptual Sections --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              {selectedStory.divineWisdom && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#fbf9f6] p-8 rounded-[3rem] border border-[#4e635a]/10 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-24 h-24 bg-[#4e635a]/5 rounded-full -translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform" />
                  <div className="flex items-center gap-3 mb-4 flex-row-reverse">
                    <Brain className="text-[#4e635a]" size={24} />
                    <h4 className="text-xl font-serif font-bold text-[#4e635a]">مفاهيم الأمور: لماذا حدث هذا؟</h4>
                  </div>
                  <p className="text-[#655d51] leading-relaxed font-medium text-right">
                    {selectedStory.divineWisdom}
                  </p>
                </motion.div>
              )}

              {selectedStory.universalLaw && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#4e635a]/5 p-8 rounded-[3rem] border border-[#4e635a]/10 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-24 h-24 bg-white/40 rounded-full -translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform" />
                  <div className="flex items-center gap-3 mb-4 flex-row-reverse">
                    <Scale className="text-[#4e635a]" size={24} />
                    <h4 className="text-xl font-serif font-bold text-[#4e635a]">كيف تكون حياتك بتقدير الله وتدبيره؟</h4>
                  </div>
                  <p className="text-[#655d51] leading-relaxed font-medium text-right">
                    {selectedStory.universalLaw}
                  </p>
                </motion.div>
              )}

              {selectedStory.modernContext && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-[3rem] border border-[#d1e8dd] shadow-sm relative overflow-hidden group col-span-1 md:col-span-2"
                >
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[#8da399]/5 rounded-full -translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform" />
                  <div className="flex items-center gap-3 mb-4 flex-row-reverse">
                    <Lightbulb className="text-yellow-500" size={24} />
                    <h4 className="text-xl font-serif font-bold text-[#4e635a]">ماذا لو كنت مكانه؟ طبقها في حياتك اليومية</h4>
                  </div>
                  <p className="text-[#1b1c1a] text-lg leading-relaxed font-serif text-right border-r-4 border-[#8da399] pr-4">
                    {selectedStory.modernContext}
                  </p>
                </motion.div>
              )}

              {selectedStory.divineDialogue && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#fbf9f6] p-8 rounded-[3rem] border border-[#d1e8dd] relative overflow-hidden group col-span-1 md:col-span-2"
                >
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[#4e635a]/5 rounded-full -translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform" />
                  <div className="flex items-center gap-3 mb-4 flex-row-reverse">
                    <MessageSquareQuote className="text-[#4e635a]" size={24} />
                    <h4 className="text-xl font-serif font-bold text-[#4e635a]">أدب الحوار مع الله</h4>
                  </div>
                  <div className="bg-white p-6 rounded-2xl italic text-[#4e635a] font-serif text-center relative">
                    <Quote className="absolute top-1 right-1 opacity-10" size={40} />
                    <p className="text-xl leading-relaxed">
                      {selectedStory.divineDialogue}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
            {/* ----------------------------- */}

            {selectedStory.chapters && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#4e635a]/60">
                  <History size={18} />
                  <h4 className="font-bold uppercase tracking-widest text-xs">محطات الرحلة الإيمانية</h4>
                </div>
                <div className="grid gap-6">
                  {selectedStory.chapters.map((chapter, idx) => (
                    <div key={idx} className="relative pr-8 border-r-2 border-[#d1e8dd] last:border-r-0">
                      <div className="absolute top-0 -right-[9px] w-4 h-4 rounded-full bg-[#4e635a] border-4 border-white shadow-sm" />
                      <div className="space-y-2">
                        <h5 className="font-bold text-[#4e635a] text-lg">{chapter.title}</h5>
                        <p className="text-[#655d51] leading-relaxed italic">{chapter.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
               <div className="flex items-center gap-2 text-[#4e635a]/60">
                 <Star size={18} />
                 <h4 className="font-bold uppercase tracking-widest text-xs">ثمرات وحكم ومنهج نبوي</h4>
               </div>
               <div className="grid gap-3">
                 {selectedStory.lessons.map((lesson, i) => (
                   <div key={i} className="bg-white/80 p-5 rounded-[2rem] border border-white flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                     <div className="w-10 h-10 rounded-2xl bg-[#4e635a]/5 flex items-center justify-center text-[#4e635a] font-bold text-sm shrink-0 border border-[#4e635a]/10">{i+1}</div>
                     <p className="text-[#4e635a] font-bold leading-relaxed pt-2">{lesson}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Reflective Questions */}
            {selectedStory.reflectiveQuestions && selectedStory.reflectiveQuestions.length > 0 && (
              <div className="space-y-4 pt-6 mt-6 border-t border-[#4e635a]/10">
                <div className="flex items-center gap-2 text-[#4e635a]/60">
                  <Search size={18} />
                  <h4 className="font-bold uppercase tracking-widest text-xs">توقف وتأمل: أسئلة لقلبك</h4>
                </div>
                <div className="grid gap-4">
                  {selectedStory.reflectiveQuestions.map((q, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.01 }}
                      className="bg-[#fbf9f6] p-6 rounded-[2.5rem] border border-[#4e635a]/5 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-1 bg-[#4e635a] h-full" />
                      <p className="text-lg font-serif text-[#1b1c1a] leading-relaxed italic pr-4">
                        " {q} "
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 🤝 كيف أبدأ بالاقتداء والعمل فوراً؟ */}
            {(() => {
              const radarInfo = radarProphets.find(p => p.id === selectedStory.id);
              if (!radarInfo) return null;
              const hasPledged = !!commitments[selectedStory.id];
              return (
                <div className="space-y-4 pt-6 mt-6 border-t border-[#4e635a]/10">
                  <div className="flex items-center gap-2 text-[#4e635a]/60 flex-row-reverse">
                    <Heart size={18} className="text-[#4e635a] animate-pulse" />
                    <h4 className="font-bold uppercase tracking-widest text-xs">الخطوة العملية للعيش مع قصته: كيف نبدأ الآن؟</h4>
                  </div>
                  <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/95 p-8 rounded-[3rem] border-2 border-[#d1e8dd] shadow-xl relative overflow-hidden text-right"
                  >
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#4e635a]/5 rounded-br-full pointer-events-none" />
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs font-black text-[#4e635a] block font-serif">🎯 الواجب العملي الذي تبدأ به فوراً:</span>
                        <p className="text-xl font-black text-[#4e635a] font-serif leading-relaxed">
                          {radarInfo.wajib}
                        </p>
                      </div>

                      <div className="bg-[#fbf9f6] p-5 rounded-2xl border border-black/5">
                        <span className="text-xs font-black text-[#4e635a] block mb-1">💌 كيف تفيدك رسالة نبي الله {selectedStory.name} في واقعك؟</span>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed font-serif">
                          {radarInfo.risalah}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#4e635a]/10 flex-row-reverse">
                        <button
                          onClick={() => toggleCommitment(selectedStory.id)}
                          className={cn(
                            "px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-md w-full sm:w-auto justify-center cursor-pointer",
                            hasPledged
                              ? "bg-amber-100 text-amber-800 border-2 border-amber-300 shadow-none hover:bg-amber-200"
                              : "bg-[#4e635a] hover:bg-[#3d4d46] text-white hover:-translate-y-0.5"
                          )}
                        >
                          {hasPledged ? (
                            <>
                              <CheckCircle2 size={18} className="text-amber-600" />
                              <span>✓ نويت الالتزام بهذا العمل الطيب ({selectedStory.name})</span>
                            </>
                          ) : (
                            <>
                              <Check size={18} />
                              <span>أعاهد الله على التغيير والالتزام بهذا</span>
                            </>
                          )}
                        </button>
                        
                        <div className="text-right">
                          <span className="text-[10px] font-black text-slate-400 block">صدق النية والهمَّة</span>
                          <p className="text-xs font-bold text-slate-600">صدق الاقتداء يبدأ بنية صادقة وعمل خفي مخلص يراه الله وحده.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })()}

            {/* Daily Challenge Section */}
            {selectedStory.dailyChallenge && (
              <div className="space-y-4 pt-6 mt-6 border-t border-[#4e635a]/10">
                <div className="flex items-center gap-2 text-[#4e635a]/60">
                  <Target size={18} className="text-[#4e635a]" />
                  <h4 className="font-bold uppercase tracking-widest text-xs">التحدي العملي: لا تخرج إلا بعمل</h4>
                </div>
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-[#4e635a] to-[#3d4d46] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group"
                >
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="flex flex-col md:flex-row items-center gap-6 text-right relative z-10 font-serif">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center shrink-0 border border-white/20 shadow-inner">
                      <Sparkles size={32} className="text-yellow-300 animate-pulse" />
                    </div>
                    <div className="space-y-6 flex-1">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-white/60 tracking-widest uppercase">مهمتك اليوم:</span>
                        <p className="text-2xl font-bold leading-tight">
                          {selectedStory.dailyChallenge}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <button 
                          onClick={() => {
                            if (selectedStory.dailyChallenge) {
                              acceptChallenge(selectedStory.dailyChallenge, 'story', selectedStory.id);
                            }
                            setIsInsightOpen(true);
                          }}
                          className="bg-white text-[#4e635a] px-10 py-4 rounded-2xl font-black text-lg hover:bg-[#d1e8dd] transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                        >
                          <CheckCircle2 size={24} />
                          سأقوم بهذا التحدي
                        </button>
                        
                        <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                          <Brain size={16} />
                          <span>التطبيق العملي هو جوهر العبرة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            <div className="p-8 rounded-[2.5rem] bg-[#4e635a]/5 text-[#4e635a] space-y-4 border border-[#4e635a]/10 relative overflow-hidden text-right">
               <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
               <div className="flex items-center gap-3 flex-row-reverse">
                 <Quote className="text-[#4e635a]/40 rotate-180" size={24} />
                 <h4 className="text-xl font-serif font-bold">نهج الصالحين: تعلم وعِش وفق هذا السلوك</h4>
               </div>
               <p className="text-slate-800 font-medium leading-relaxed font-serif">
                 هذه القصة ليست مجرد حكاية من الماضي، بل هي أثر ملموس لمَن ساروا على النهج ووصلوا بالصدق. انظر كيف واجه {selectedStory.name} الصعاب، وكيف كان يقينه بوعد الله ونصره. 
                 اجعل من صبره وشكره نموذجاً تطبقه اليوم في حياتك، فكل نبوة هي نبراس يضيء لك درب التزكية وصيانة نفسك.
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <InsightPanel 
        isOpen={isInsightOpen} 
        onClose={() => setIsInsightOpen(false)} 
        trackTitle={selectedStory?.name || ''} 
        trackArtist="قصص الأنبياء"
      />
    </div>
  );
}
