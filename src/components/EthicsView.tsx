
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, Heart, AlertTriangle, Quote, BookOpen, ChevronLeft, ChevronRight, Fingerprint, ShieldCheck, Sparkles, EyeOff, Moon, VenetianMask, Ghost, ShieldAlert, Zap, Loader2, CheckCircle } from 'lucide-react';
import { ETHICS_CHALLENGES, HYPOCRISY_TRAITS, HIDDEN_WORSHIP_LIST, REAL_STORIES, PROPHETIC_BOUNDARIES, SELF_CORRECTION_STEPS } from '../data/ethics';
import { cn } from '../lib/utils';
import { saveEthicsCommitment, getEthicsCommitments } from '../services/recordService';

export default function EthicsView() {
  const [activeSection, setActiveSection] = useState<'challenges' | 'compass' | 'tazkiyah' | 'stories' | 'digital' | 'boundaries' | 'training'>('challenges');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [commitments, setCommitments] = useState<string[]>([]);
  const [isCommiting, setIsCommiting] = useState<string | null>(null);

  useEffect(() => {
    async function loadCommitments() {
      const comms = await getEthicsCommitments();
      setCommitments(comms.map(c => c.ethicId));
    }
    loadCommitments();
  }, []);

  const handleCommit = async (id: string, title: string) => {
    if (commitments.includes(id)) return;
    setIsCommiting(id);
    try {
      await saveEthicsCommitment(id, title);
      setCommitments([...commitments, id]);
    } catch (error) {
      console.error("Error saving commitment:", error);
    } finally {
      setIsCommiting(null);
    }
  };

  const currentChallenge = ETHICS_CHALLENGES[currentChallengeIndex];

  return (
    <div className="max-w-4xl mx-auto px-6 py-4 space-y-8 pb-32">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex p-3 bg-[#4e635a]/10 rounded-2xl text-[#4e635a] mb-2"
        >
          <Scale size={32} />
        </motion.div>
        <h2 className="text-3xl font-black text-[#4e635a] font-serif">ميزان الأخلاق</h2>
        <p className="text-[#655d51] text-lg max-w-xl mx-auto">
          التركيز على جوهر الدين وهو الأخلاق، وليس فقط المظاهر والادعاءات.
        </p>
      </div>

      {/* Navigation Toggles */}
      <div className="flex p-1 bg-[#4e635a]/5 rounded-2xl max-w-lg mx-auto relative z-10 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSection('challenges')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap text-sm",
            activeSection === 'challenges' ? "bg-white text-[#4e635a] shadow-sm" : "text-[#7a8c82] hover:text-[#4e635a]"
          )}
        >
          <Heart size={16} />
          المبادرة
        </button>
        <button
          onClick={() => setActiveSection('digital')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap text-sm",
            activeSection === 'digital' ? "bg-white text-blue-600 shadow-sm" : "text-[#7a8c82] hover:text-blue-500"
          )}
        >
          <Fingerprint size={16} />
          أثر البصمة
        </button>
        <button
          onClick={() => setActiveSection('tazkiyah')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap text-sm",
            activeSection === 'tazkiyah' ? "bg-white text-amber-600 shadow-sm" : "text-[#7a8c82] hover:text-amber-600"
          )}
        >
          <Sparkles size={16} />
          التزكية
        </button>
        <button
          onClick={() => setActiveSection('stories')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap text-sm",
            activeSection === 'stories' ? "bg-white text-indigo-600 shadow-sm" : "text-[#7a8c82] hover:text-indigo-600"
          )}
        >
          <VenetianMask size={16} />
          الأقنعة
        </button>
        <button
          onClick={() => setActiveSection('compass')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap text-sm",
            activeSection === 'compass' ? "bg-white text-red-600 shadow-sm" : "text-[#7a8c82] hover:text-red-500"
          )}
        >
          <AlertTriangle size={16} />
          النفاق
        </button>
        <button
          onClick={() => setActiveSection('boundaries')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap text-sm",
            activeSection === 'boundaries' ? "bg-white text-emerald-600 shadow-sm" : "text-[#7a8c82] hover:text-emerald-500"
          )}
        >
          <ShieldAlert size={16} />
          أنا وأنت
        </button>
        <button
          onClick={() => setActiveSection('training')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap text-sm",
            activeSection === 'training' ? "bg-white text-orange-600 shadow-sm" : "text-[#7a8c82] hover:text-orange-500"
          )}
        >
          <Zap size={16} />
          عود نفسك
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'challenges' ? (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="glass-3d p-8 rounded-[40px] relative overflow-hidden group border border-[#4e635a]/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4e635a]/5 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <span className="text-[#4e635a] font-bold text-sm tracking-widest uppercase opacity-60">كن أنت المُبادر</span>
                  <h3 className="text-2xl font-black text-[#1b1c1a]">{currentChallenge.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentChallengeIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentChallengeIndex === 0}
                    className="p-2 rounded-full border border-[#4e635a]/10 hover:bg-[#4e635a]/5 disabled:opacity-30"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => setCurrentChallengeIndex(prev => Math.min(ETHICS_CHALLENGES.length - 1, prev + 1))}
                    disabled={currentChallengeIndex === ETHICS_CHALLENGES.length - 1}
                    className="p-2 rounded-full border border-[#4e635a]/10 hover:bg-[#4e635a]/5 disabled:opacity-30"
                  >
                    <ChevronLeft size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-[#4e635a]/5 p-6 rounded-3xl border-r-4 border-[#4e635a]">
                  <Quote className="text-[#4e635a] opacity-20 mb-2" size={24} />
                  <p className="text-xl font-serif text-[#4e635a] leading-relaxed italic">
                    {currentChallenge.reference}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#7a8c82]">
                    <BookOpen size={18} />
                    <span className="font-bold">قصة من الواقع:</span>
                  </div>
                  <p className="text-[#424845] text-lg leading-relaxed bg-white/50 p-6 rounded-3xl border border-white">
                    {currentChallenge.story}
                  </p>
                </div>
                <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <ShieldCheck className="text-emerald-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-emerald-900 mb-1">الفرق بين الحقيقة والتمثيل:</h4>
                    <p className="text-emerald-800/80 leading-relaxed font-medium">
                      {currentChallenge.lesson}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeSection === 'digital' ? (
          <motion.div
            key="digital"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-8"
          >
            <div className="bg-blue-500/5 p-8 rounded-[40px] border border-blue-500/10 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-600">
                <Fingerprint size={32} />
              </div>
              <h3 className="text-2xl font-black text-blue-900">أثر بصمتك الرقمية</h3>
              <p className="text-blue-800/70 max-w-2xl mx-auto italic">
                "مَا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ"
              </p>
              <p className="text-blue-800/60 leading-relaxed max-w-xl mx-auto text-sm">
                كل تعليق، أو إعجاب، أو إعادة نشر هي "أثر" تتركه في صحيفتك الرقمية. هل هي بصمة تمهد لك طريق الجنة، أم عبء ستُسأل عنه؟
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DigitalCard title="تثبّت قبل النشر" description="سهولة الإشاعات في هذا الزمن تجعلك شريكاً في الكذب إذا لم تتأكد." action="لا تنشر خبراً إلا إذا تيقنت منه 100%" color="blue" />
              <DigitalCard title="الكلمة الطيبة" description="التنمر الإلكتروني جرح لا يبرأ بسهولة. بصمتك يجب أن تجبر الخواطر." action="اجعل تعليقك بلسمًا لا سُمًا" color="indigo" />
              <DigitalCard title="الشهادة الرقمية" description="الإعجاب بالمحتوى الهابط أو الحرام هو تشجيع عليه، وأنت شريك في الأثر." action="فكّر قبل أن تضغط 'إعجاب'؛ فهي شهادة" color="amber" />
              <DigitalCard title="الستر الرقمي" description="تتبع عثرات الناس أو نشر صورهم بغير رضاهم خيانة للأمانة." action="استر على أخيك يبعث الله من يسترك" color="emerald" />
            </div>
          </motion.div>
        ) : activeSection === 'tazkiyah' ? (
          <motion.div
            key="tazkiyah"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-amber-500/5 p-8 rounded-[40px] border border-amber-500/10 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <Moon size={32} />
              </div>
              <h3 className="text-2xl font-black text-amber-900">عبادات الخفاء (التركيز على الباطن)</h3>
              <p className="text-amber-800/70 max-w-2xl mx-auto">لمواجهة زمن الزيف، نحتاج للعودة إلى "الإخلاص". أعمال لا يراها إلا الله، لتربية النفس على أن قيمتها في حقيقتها وليس في "صورتها" أمام الناس.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {HIDDEN_WORSHIP_LIST.map((worship) => (
                <div key={worship.id} className="glass-3d p-6 rounded-[35px] border border-amber-500/5 flex flex-col">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mb-4"><EyeOff size={24} /></div>
                  <h4 className="text-xl font-black text-amber-900 mb-2">{worship.title}</h4>
                  <p className="text-amber-800/60 text-sm mb-4 flex-grow">{worship.description}</p>
                  <div className="space-y-3 mt-4">
                    <div className="bg-white/40 p-4 rounded-2xl border border-amber-500/10">
                      <p className="text-xs font-bold text-amber-900/40 uppercase mb-1">أثرها على القلب</p>
                      <p className="text-amber-800/80 text-sm font-medium">{worship.benefit}</p>
                    </div>
                    <div className="bg-amber-600 p-4 rounded-2xl text-white shadow-lg"><p className="text-sm font-bold">{worship.action}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : activeSection === 'stories' ? (
          <motion.div
            key="stories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-indigo-500/5 p-8 rounded-[40px] border border-indigo-500/10 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-600"><VenetianMask size={32} /></div>
              <h3 className="text-2xl font-black text-indigo-900">قصص من الواقع (كشف الأقنعة)</h3>
              <p className="text-indigo-800/70 max-w-2xl mx-auto">مساحة لقصص توضح كيف يتم الخداع باسم الدين أو المكانة، لزيادة الوعي الفطري والحذر من تزييف الحقائق.</p>
            </div>
            <div className="space-y-6">
              {REAL_STORIES.map((story) => (
                <div key={story.id} className="glass-3d p-8 rounded-[40px] border border-indigo-500/10">
                  <h4 className="text-xl font-black text-indigo-900 mb-6">{story.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-2">القصة والواقع</span>
                      <p className="text-indigo-900/80 leading-relaxed bg-white/40 p-5 rounded-3xl border border-white">{story.scenario}</p>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-red-50 p-5 rounded-3xl border border-red-100">
                        <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-2">تزييف الشيطان</span>
                        <p className="text-red-900/70 text-sm">{story.trap}</p>
                      </div>
                      <div className="bg-indigo-600 p-5 rounded-3xl text-white">
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block mb-2">الوعي واليقطة</span>
                        <p className="font-medium">{story.awareness}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : activeSection === 'boundaries' ? (
          <motion.div
            key="boundaries"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-emerald-500/5 p-8 rounded-[40px] border border-emerald-500/10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600"><ShieldAlert size={32} /></div>
              <h3 className="text-2xl font-black text-emerald-900">لأجل حياة تليق بك</h3>
              <p className="text-emerald-800/70 max-w-2xl mx-auto">لأنك خُلقت لتكون مؤثراً ومعطاءً، هنا نتأمل في لذة الكدح الشريف الذي يرفع الرأس، وكيف نصون كرامتنا بالاستغناء عن الخلق والتعلق بالخالق وحده.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {PROPHETIC_BOUNDARIES.map((boundary) => (
                <div key={boundary.id} className="glass-3d p-8 rounded-[40px] border border-emerald-500/10 lg:flex gap-8">
                  <div className="lg:w-1/3 space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600"><Zap size={24} /></div>
                    <h4 className="text-xl font-black text-emerald-900">{boundary.title}</h4>
                    <p className="text-emerald-800 text-xs font-serif italic">{boundary.reference}</p>
                  </div>
                  <div className="lg:w-2/3 space-y-6">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-600/50 uppercase">الرسالة</span>
                      <p className="text-emerald-900/80 leading-relaxed font-medium">{boundary.description}</p>
                    </div>
                    <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-xl">
                      <p className="font-medium leading-relaxed">{boundary.practicalAction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : activeSection === 'training' ? (
          <motion.div
            key="training"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-orange-500/5 p-8 rounded-[40px] border border-orange-500/10 text-center space-y-4">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto text-orange-600">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-black text-orange-900">عود نفسك</h3>
              <p className="text-orange-800/70 max-w-2xl mx-auto font-medium">
                خطوات عملية محددة لمواجهة النفس وعلاج المشكلات الأخلاقية التي تم رصدها، لتحويل "المعرفة" إلى "تطبيق" حقيقي بنور النبوة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SELF_CORRECTION_STEPS.map((step, idx) => (
                <div key={step.id} className="glass-3d p-8 rounded-[40px] border border-orange-500/10 hover:border-orange-500/30 transition-all flex flex-col group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      الخطوة {idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-orange-100 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                      <Sparkles size={14} />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs font-bold text-orange-600/50 mb-1 uppercase tracking-tighter">المشكلة المستهدفة:</p>
                    <h4 className="text-lg font-black text-orange-900 leading-tight">{step.challenge}</h4>
                  </div>
                  
                  <div className="space-y-6 flex-grow">
                    <div className="bg-white/50 p-6 rounded-3xl border border-white group-hover:bg-white transition-colors shadow-sm">
                      <p className="text-orange-900 font-bold mb-2">🏷️ {step.stepName}</p>
                      <p className="text-orange-800/80 text-sm leading-relaxed">{step.instruction}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-orange-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      <span className="text-xs font-bold text-orange-900 text-opacity-40 uppercase tracking-wider">الأثر المطلوب على العقلية:</span>
                    </div>
                    <p className="text-orange-900/60 text-xs italic font-medium">
                      {step.targetMindset}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCommit(step.id, step.stepName)}
                    disabled={commitments.includes(step.id) || isCommiting === step.id}
                    className={cn(
                      "mt-6 w-full py-4 rounded-3xl font-black text-sm transition-all flex items-center justify-center gap-2",
                      commitments.includes(step.id) 
                        ? "bg-emerald-100 text-emerald-700 cursor-default" 
                        : "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/20 active:scale-95"
                    )}
                  >
                    {isCommiting === step.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : commitments.includes(step.id) ? (
                      <>
                        <CheckCircle size={16} />
                        امتثلتُ لهذا الخلق
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        أعاهد الله على الالتزام
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-[#1b1c1a] p-8 rounded-[40px] text-white overflow-hidden relative group border border-white/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-orange-500/20 transition-all" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-right">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <BookOpen className="text-orange-400" size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold">"إن الله لا يغير ما بقوم حتى يغيروا ما بأنفسهم"</h4>
                  <p className="text-white/60 text-sm leading-relaxed italic">
                    التغيير الحقيقي يبدأ بقرار شجاع، وهذه الخطوات هي مجرد بوابات، والعبور بيديك أنت.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="compass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-red-500/5 p-6 rounded-[30px] border border-red-500/10 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shrink-0"><AlertTriangle size={24} /></div>
              <p className="text-red-900 font-bold text-sm">"آية المنافق ثلاث: إذا حدث كذب، وإذا وعد أخلف، وإذا اؤتمن خان" متفق عليه.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {HYPOCRISY_TRAITS.map((trait) => (
                <div key={trait.id} className="glass-3d p-6 rounded-[35px] border border-red-500/5 group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600"><AlertTriangle size={20} /></div>
                    <h3 className="text-xl font-black text-red-900">{trait.trait}</h3>
                  </div>
                  <p className="text-red-800/60 font-medium mb-6">{trait.description}</p>
                  <div className="space-y-4 mb-6">
                    <div className="bg-white/40 p-4 rounded-2xl border border-red-500/10 text-sm"><p className="text-red-800/70 italic">{trait.story}</p></div>
                    <div className="bg-red-600 p-4 rounded-2xl text-white shadow-lg"><p className="font-medium">{trait.solution}</p></div>
                  </div>
                  <div className="bg-white/60 p-4 rounded-2xl border border-red-500/10 italic text-red-700/80 text-sm">{trait.warning}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DigitalCard({ title, description, action, color }: { title: string, description: string, action: string, color: string }) {
  const colorMap: Record<string, string> = { blue: 'bg-blue-600', indigo: 'bg-indigo-600', amber: 'bg-amber-600', emerald: 'bg-emerald-600' };
  return (
    <div className="glass-3d p-6 rounded-[35px] border border-white/50 flex flex-col">
      <h4 className="text-lg font-black text-[#1b1c1a] mb-2">{title}</h4>
      <p className="text-[#655d51] text-xs font-medium leading-relaxed mb-4 flex-grow">{description}</p>
      <div className={cn("p-4 rounded-2xl text-white text-xs font-bold shadow-lg", colorMap[color])}>{action}</div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="glass-3d p-6 rounded-3xl flex items-center gap-4 border border-[#4e635a]/5">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-[#7a8c82] uppercase tracking-wider">{label}</p>
        <p className="text-xl font-black text-[#1b1c1a]">{value}</p>
      </div>
    </div>
  );
}
