import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, ChevronLeft, Star, Quote, History, Search, Users, Play, Lightbulb, Heart, Scale, Brain, MessageSquareQuote, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { prophetStories, type Story } from '../data/stories';
import InsightPanel from './InsightPanel';
import { useChallenges } from '../context/ChallengeContext';
import { cn } from '../lib/utils';

function PropheticRoleModels() {
  const [selectedModel, setSelectedModel] = useState<'yusuf' | 'ibrahim' | 'musa'>('yusuf');
  const { activeChallenge, acceptChallenge } = useChallenges();

  const models = {
    yusuf: {
      name: 'يوسف عليه السلام',
      title: '👑 قدوة العفة وصدمة الوعي',
      avatar: '🛡️',
      fitnah: 'فتنة الإغراء البصري والشهوات الرقمية المعاصرة (تيسير الحرام خلف الشاشات المغلقة والتلصص بالأعين).',
      story: 'واجه يوسف عليه السلام أعظم فتنة بشرية ممكنة: امرأة ذات منصب وجميل في مكان مغلق، وهي التي دعته وأغلقت الأبواب وقالت "هيت لك"، في زحمة الجاه والسلطان. لكنه انتصر ببشرية طاهرة عبر صدمة الوعي الفورية.',
      application: 'كلمة "مَعَاذَ اللَّهِ" ليست مجرد تلفظ باللسان، بل هي صدمة وعي يضرب بها المؤمن وسوسة غسيل الدماغ وخداع الشيطان. عندما تغلق باب غرفتك وتأتيك فتن الشاشات، صِح بقلبك "معاذ الله! إني أخاف الله رب العالمين"، وأغلق هاتفك لتربح عزة الأحرار.',
      color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-800'
    },
    ibrahim: {
      name: 'إبراهيم عليه السلام',
      title: '✨ قدوة التحرر من أصنام الوهم',
      avatar: '🪐',
      fitnah: 'التعلق المشتت بالأشياء والأوهام الرقمية: الشهرة الافتراضية، اللهث خلف الإعجابات وملاحقة حسابات الفتيات لملء الفراغ النفسي.',
      story: 'واجه إبراهيم عليه السلام بيئة تعبد أصناماً جامدة وأوهاماً عابرة لا تملك نفعاً ولا ضراً، ورغم طرد قومه له وتهديده بالحرق، وقف حراً مستغنياً بربه لا يعبد إلا الحي القيوم الذي بيده كل شيء.',
      application: 'الأصنام الرمزية اليوم هي حسابات الشهرة العابرة والافتتان الرقمي الذي يسلب عفتك ووقتك. تحرر من عبودية هذه الشاشات والتفت إلى رب الأحرار ومجدك الحقيقي؛ لا تجعل قلبك يعبد "تفاهة اليوم" واستغنِ بالله.',
      color: 'border-amber-500/20 bg-amber-500/5 text-amber-800'
    },
    musa: {
      name: 'موسى عليه السلام',
      title: '🌾 قدوة الشهامة والرجولة العفيفة',
      avatar: '👣',
      fitnah: 'سراب العلاقات الدرامية والهواتف المليئة بالمحادثات العبثية والجرأة الزائدة التي تنزع الحياء وتذهب وقار الشاب.',
      story: 'خرج موسى عليه السلام خائفاً جائعاً غريباً، وعند بئر مدين رأى فتاتين لا تستطيعان السقاية. سارع بشهامة ورجولة بالغة لسقي مواشيهما دون ممازحة، أو محاولة للفت انتباههما، ثم "تولى إلى الظل" مستغنياً غاية الاستغناء بربه.',
      application: 'الرجولة مواقف وشهامة صامتة. حين تقابل النساء في دراستك أو عملك أو الشارع، صُن عينك وعفتك وتأدّب، وسقِ لهنّ معروفاً ثم "تولَّ فوراً إلى ظل طاعتك" دون فضول أو تطلع لإعجاب. الرجولة شيم يطبعها الخجل والوقار.',
      color: 'border-blue-500/20 bg-blue-500/5 text-blue-800'
    }
  };

  const current = models[selectedModel];

  const challengeText = selectedModel === 'yusuf'
    ? 'تحدي اليوم: سأضع هاتفي خارج غرفتي قبل النوم بـ 30 دقيقة.. (معاذ الله).'
    : selectedModel === 'musa'
    ? 'تحدي اليوم: لن أكتب أي تعليق أو رسالة فيها جرأة إلكترونية أو ممازحة تذهب بوقاري وعفتي.'
    : 'تحدي اليوم: سأقوم بوقف الإشعارات بالكامل لجميع قنوات ومعرفات الأخبار والتيك توك لمدة يوم كامل لأستعيد تركيز باطني.';

  const isAccepted = activeChallenge?.text === challengeText;

  return (
    <div className="glass-3d p-8 rounded-[3.5rem] border border-[#4e635a]/10 space-y-6 text-right relative overflow-hidden bg-white/40 mb-8">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#4e635a]/5 rounded-bl-[100px] pointer-events-none" />
      
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4e635a]/10 text-[#4e635a] text-xs font-black rounded-full border border-[#4e635a]/20">
          🛡️ القدوة العملية في مواجهة الفتن
        </span>
        <h3 className="text-2xl font-black text-slate-900 font-serif leading-tight">
          خطى الأنبياء الأحرار: ليسوا تاريخاً فحسب!
        </h3>
        <p className="text-[#655d51] text-xs md:text-sm font-bold leading-relaxed max-w-3xl">
          الأنبياء عليهم السلام لم يكونوا شخصيات معزولة في طيات كتب التاريخ； بل كانوا بشراً واجهوا فتناً وضغوطاً حقيقية وهائلة مثل التي تمر بها اليوم، فانتصروا عليها بصدقهم. تعرّف كيف ترتبط فتنك بالأنبياء وكيف تسير على منهجهم:
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(models) as Array<keyof typeof models>).map((key) => {
          const m = models[key];
          const isSelected = selectedModel === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedModel(key)}
              className={cn(
                "p-4 rounded-3xl border text-center transition-all flex flex-col items-center justify-center gap-2",
                isSelected
                  ? "bg-[#4e635a] text-white border-transparent shadow-xl shadow-[#4e635a]/20 scale-102"
                  : "bg-white/80 border-[#4e635a]/10 text-[#4e635a] hover:bg-white"
              )}
            >
              <span className="text-2xl">{m.avatar}</span>
              <span className="text-xs md:text-sm font-black font-serif">{m.name}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedModel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn("p-6 rounded-[2.5rem] border space-y-4 text-right", current.color)}
        >
          <div className="space-y-1">
            <h4 className="text-lg font-black font-serif text-slate-900">{current.title}</h4>
            <div className="h-[2px] w-12 bg-current opacity-30 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-500 block">⚠️ فتنة العصر والشاب المعاصر:</span>
              <p className="text-sm font-bold text-slate-800 leading-relaxed bg-white/50 p-4 rounded-2xl border border-black/5">
                {current.fitnah}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black text-[#4e635a] block">🛡️ كيف واجهها النبي (كبشر)؟</span>
              <p className="text-sm font-bold text-slate-800 leading-relaxed bg-white/50 p-4 rounded-2xl border border-black/5">
                {current.story}
              </p>
            </div>
          </div>

          <div className="bg-white/80 p-5 rounded-2xl border border-black/5 mt-4">
            <span className="text-xs font-black text-rose-700 block mb-1">💡 منهج التطبيق العملي وصدمة الوعي اليوم:</span>
            <p className="text-sm font-bold text-slate-900 leading-relaxed font-serif">
              {current.application}
            </p>
          </div>

          {/* زر التحدي التفاعلي اللحظي بضغطة واحدة */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white/90 border border-slate-200/50 rounded-[2rem] shadow-sm text-right">
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">⚡</span>
              <div className="text-right">
                <span className="text-[10px] font-black text-[#4e635a] block uppercase tracking-wider">سلوك فوري لتطبيق العبرة</span>
                <p className="text-xs md:text-sm font-bold text-slate-800 leading-relaxed">
                  {challengeText}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => acceptChallenge(challengeText, 'story', `prophet-model-${selectedModel}`)}
              disabled={isAccepted}
              className={cn(
                "px-6 py-3 rounded-xl font-black text-xs transition-all flex items-center gap-2 shrink-0 shadow-md w-full sm:w-auto justify-center",
                isAccepted
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-none cursor-default"
                  : "bg-[#4e635a] hover:bg-[#3d4d46] text-white shadow-[#4e635a]/10 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              )}
            >
              {isAccepted ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>تم تفعيل التحدي اليومي</span>
                </>
              ) : (
                <>
                  <span>تفعيل التحدي بلمسة واحدة</span>
                  <Sparkles size={12} className="animate-pulse" />
                </>
              )}
            </button>
          </div>
        </motion.div>
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
            <p className="text-[#8da399] font-bold text-sm tracking-widest uppercase">المنهج الإلهي في هداية البشر</p>
          </div>
        </div>

        <div className="max-w-2xl space-y-4">
          <p className="text-[#655d51] font-bold leading-relaxed text-lg">
            نحن نؤمن أن الحياة أوسع من صخبها، وأن النهج الذي سار عليه الأنبياء هو البوصلة التي تعيدنا إلى فطرتنا. في 'موكب النبوة'، نسعى لنكون جسراً يصل بك إلى معاني العدل، الرحمة، والتوحيد، لتسير في هذه الحياة وأنت مستندٌ على حقيقة لا تزول. استفد من العبر لتمشي على هذا النهج.
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
        <PropheticRoleModels />
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
                    <h4 className="text-xl font-serif font-bold text-[#4e635a]">القانون الكوني: كيف تسير الأمور؟</h4>
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
                 <Quote className="text-white/40 rotate-180" size={24} />
                 <h4 className="text-xl font-serif font-bold">المنهج العملي: تعلم وامشِ على هذا النهج</h4>
               </div>
               <p className="text-white/80 font-medium leading-relaxed">
                 هذه القصة ليست مجرد حكاية من الماضي، بل هي أثر ملموس لمَن ساروا على النهج ووصلوا بالصدق. انظر كيف واجه {selectedStory.name} الصعاب، وكيف كان يقينه بالمنهج الإلهي. 
                 اجعل من صبره وشكره نموذجاً تطبقه اليوم في حياتك، فكل نبوة هي نبراس يضيء لك درب التزكية.
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
