import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, ChevronLeft, Star, Quote, History, Search, Users, Play, Lightbulb, Heart } from 'lucide-react';
import { prophetStories, type Story } from '../data/stories';
import InsightPanel from './InsightPanel';

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
                  <Play size={18} className="text-[#4e635a]" />
                  <h4 className="font-bold uppercase tracking-widest text-xs">تحدي اليوم: لا تخرج إلا بعمل</h4>
                </div>
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-[#4e635a] to-[#3d4d46] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                  <div className="flex items-start gap-4 flex-row-reverse text-right">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Star size={24} className="text-yellow-400" />
                    </div>
                    <div className="space-y-4">
                      <p className="text-2xl font-bold font-serif leading-tight">
                        {selectedStory.dailyChallenge}
                      </p>
                      <button 
                        onClick={() => setIsInsightOpen(true)}
                        className="bg-white text-[#4e635a] px-8 py-3 rounded-2xl font-black text-sm hover:bg-[#d1e8dd] transition-colors shadow-lg"
                      >
                        سأحاول الهداية بهذا العمل
                      </button>
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
                 هذه القصة ليست مجرد سرد تاريخي، بل هي محطة في طريقك إلى الله. انظر كيف واجه {selectedStory.name} الصعاب، وكيف كان يقينه بالمنهج الإلهي. 
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
