
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, Heart, AlertTriangle, Quote, BookOpen, ChevronLeft, ChevronRight, Fingerprint, ShieldCheck, Sparkles, EyeOff, Moon, VenetianMask, Ghost, ShieldAlert, Zap, Loader2, CheckCircle, Skull, Tv, Brain } from 'lucide-react';
import { ETHICS_CHALLENGES, HYPOCRISY_TRAITS, HIDDEN_WORSHIP_LIST, REAL_STORIES, PROPHETIC_BOUNDARIES, SELF_CORRECTION_STEPS } from '../data/ethics';
import { cn } from '../lib/utils';
import { saveEthicsCommitment, getEthicsCommitments } from '../services/recordService';

export default function EthicsView() {
  const [activeSection, setActiveSection] = useState<'challenges' | 'compass' | 'tazkiyah' | 'stories' | 'digital' | 'boundaries' | 'training'>('challenges');
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [commitments, setCommitments] = useState<string[]>([]);
  const [isCommiting, setIsCommiting] = useState<string | null>(null);
  const [tazkiyahSub, setTazkiyahSub] = useState<'pacts' | 'hidden'>('pacts');

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
              <h3 className="text-2xl font-black text-blue-900">📋 ميزان الأخلاق: أثر بصمتك</h3>
              <p className="text-blue-800/70 max-w-2xl mx-auto italic font-bold">
                قال تعالى: "مَا يَلْفِظُ مِن قَوْلٍ إِلَّا لَدَيْهِ رَقِيبٌ عَتِيدٌ"
              </p>
              <p className="text-blue-800/60 leading-relaxed max-w-xl mx-auto text-sm font-semibold">
                كل تعليق، أو إعجاب، أو إعادة نشر هو "أثر" تتركه في صحيفتك الرقمية. فهل بصمتك اليوم تمهد لك طريق الجنة، أم هي عبء ثقيل ستُسأل عنه؟
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DigitalCard 
                title="تثبّت قبل النشر" 
                description="سهولة الإشاعات في هذا الزمن تجعلك شريكاً في الكذب إذا لم تتأكد." 
                action="لا تنشر أو تشارك خبراً إلا إذا تيقنت منه 100%." 
                color="blue" 
              />
              <DigitalCard 
                title="الكلمة الطيبة (جبر الخواطر)" 
                description={`التنمر أو الاستهزاء الإلكتروني جرح لا يبرأ بسهولة في قلوب الناس. بصمتك يجب أن تجبر الخواطر؛ فاجعل تعليقك بلسمًا لا سُمًا.

احذر الفخ: مثل السخرية من شكل شخص بسيط، أو السخرية من شاب يسأل سؤالاً بسيطاً في مجموعة تعليمية، أو تتبع هفوات الناس للضحك عليها.

البصمة البديلة: كن أنت الشخص الذي يكتب: 'استمر يا بطل، خطوة ممتازة'، فكلمتك الطيبة قد تبني أمة.`}
                action="كن بلسمًا وجابرًا للخواطر؛ فكلمتك الطيبة صدقة."
                color="blue"
              />
            </div>

            {/* كشف كواليس وغسيل الدماغ الرقمي */}
            <div className="pt-8 border-t border-blue-500/10 space-y-8">
              <div className="text-right space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 text-xs font-black rounded-full border border-red-100">
                  ⚠️ احذر حيل ومكائد غسيل الدماغ!
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-serif leading-tight">
                  كيف يتلاعبون بوعيك؟ خلف الكواليس: الحقيقة العارية للشاشات
                </h3>
                <p className="text-sm text-slate-500 font-bold max-w-3xl leading-relaxed">
                  "خلف الشاشات التي نتابعها يومياً، هناك صناعة كاملة تهدف إلى سرقة انتباهك طوال الوقت. المشكلة ليست في الهاتف نفسه، بل في تلك الأفكار والمشاهد التي تتسلل إلى عقولنا بهدوء وتغير نظرتنا للحياة دون أن نشعر. تعرّف على هذه الحيل البسيطة، واستعد صفاء قلبك وسلامة روحك."
                </p>
              </div>

              {/* البطاقات الأربعة بتصميم شبكي متناسق */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* البطاقة الأولى: فخ وهم الإنجاز */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-3d p-6 rounded-[35px] border border-red-500/10 relative overflow-hidden group flex flex-col justify-between bg-white/70"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-[60px] pointer-events-none transition-transform group-hover:scale-110" />
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 shadow-md shadow-red-500/5 transition-transform group-hover:rotate-12">
                      <Skull size={24} className="animate-pulse" />
                    </div>
                    <h4 className="text-lg font-black text-rose-950 font-serif">🕸️ فخ "وهم الإنجاز"</h4>
                    <p className="text-rose-900/80 text-sm font-semibold leading-relaxed">
                      "يُقنعك الشيطان ووسائل الإعلام المضللة بأن ملاحقة العلاقات والتفاخر بها هو 'شطارة ونجاح'، بينما في الحقيقة هي مجرد استنزاف لطاقتك ونقاء قلبك، وتعطيل تام لبناء مستقبلك وعلمك وصلاتك. تجاوز هذا الفخ، وابنِ حياتك الحقيقية والواقعية."
                    </p>
                  </div>
                </motion.div>

                {/* البطاقة الثانية: فخ المقارنة وسرقة الرضا */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-3d p-6 rounded-[35px] border border-amber-500/10 relative overflow-hidden group flex flex-col justify-between bg-white/70"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[60px] pointer-events-none transition-transform group-hover:scale-110" />
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 shadow-md shadow-amber-500/5 transition-transform group-hover:rotate-12">
                      <Scale size={24} />
                    </div>
                    <h4 className="text-lg font-black text-amber-950 font-serif">⚖️ فخ المقارنة وسرقة الرضا</h4>
                    <p className="text-amber-900/80 text-sm font-semibold leading-relaxed">
                      "تصوّر لك الشاشات حياة الآخرين مليئة بالرفاهية والسعادة المطلقة، فتقارن واقعك المليء بالتحديات بصورة مجمّلة ومزيفة لغيرك، مما يسرق رضاك عن رزقك ويهدم سلامك النفسي. الوعي الحقيقي يقيك هذه المقارنة الظالمة."
                    </p>
                  </div>
                </motion.div>

                {/* البطاقة الثالثة: هندسة التشتيت وصناعة الغفلة */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-3d p-6 rounded-[35px] border border-blue-500/10 relative overflow-hidden group flex flex-col justify-between bg-white/70"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[60px] pointer-events-none transition-transform group-hover:scale-110" />
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 shadow-md shadow-blue-500/5 transition-transform group-hover:rotate-12">
                      <Brain size={24} />
                    </div>
                    <h4 className="text-lg font-black text-blue-950 font-serif">🧠 فخ الخطوة الأولى (كيف يسرقون وقتك؟)</h4>
                    <p className="text-blue-900/80 text-sm font-semibold leading-relaxed">
                      "المكيدة لا تأتيك دفعة واحدة، بل تبدأ بخطوة صغيرة: مقطع عابر، صورة تثير الفضول، وتمرير مستمر للشاشة. تظن أنك تمسك بالهاتف للتسلية، ولكن الحقيقة أن هذه الخوارزميات هي التي تمسك بعقلك وتجرك خطوة وراء خطوة.
                      <br /><br />
                      هذا هو الاستدراج الخفي الذي حذرنا الله منه في قوله: <span className="font-black text-blue-700">"وَلَا تَتَّبِعُوا خُطُوَاتِ الصَّيْطَانِ"</span>. الهدف هو إثقال روحك عن الصلاة، وإضعاف عفتك، وتحويلك من شخص صاحب طموح إلى أسير لغريزته، يقضي الساعات يتابع حياة غيره وينسى بناء حياته هو!"
                    </p>
                  </div>
                </motion.div>

                {/* البطاقة الرابعة: عزّة النفس وقيمة الذات */}
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-3d p-6 rounded-[35px] border border-emerald-500/10 relative overflow-hidden group flex flex-col justify-between bg-white/70"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[60px] pointer-events-none transition-transform group-hover:scale-110" />
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-500/5 transition-transform group-hover:rotate-12">
                      <ShieldCheck size={24} />
                    </div>
                    <h4 className="text-lg font-black text-emerald-950 font-serif">🪵 عِزّة النفس وقيمة الذات</h4>
                    <p className="text-emerald-900/80 text-sm font-semibold leading-relaxed">
                      "أنت كإنسان مكرم لست بحاجة إلى ملاحقة نظرة من هنا أو كلمة إعجاب من هناك لكي تشعر بوجودك. القيمة الحقيقية هي عينٌ تغض الطرف إجلالاً لربها، ونفسٌ تملك زمام أمرها. الوعي الحقيقي يستمد عزَّته من وقوفه طاهراً وعفيفاً بين يدي الله، بعيداً عن عبودية مواقع التواصل الاجتماعي. أنت حر مستغنٍ بنور ربك.. فلا ترضى بالتبعية الرقمية."
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* قسم حصن إيمانك.. كيف تكسر الفخ؟ */}
              <div className="bg-slate-900 text-slate-100 p-8 rounded-[40px] border border-slate-800 space-y-6 mt-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black font-serif text-white">🛡️ حصن إيمانك.. كيف تكسر الفخ؟</h4>
                    <p className="text-xs text-slate-400 font-bold">المواجهة هنا ليس معركة شاشات، بل هي معركة إرادة وإيمان، ولكي تنتصر:</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 space-y-2">
                    <div className="text-emerald-400 font-black text-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                      قوة الاستغناء بالله:
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      "عندما يمتلئ قلبك بتعظيم الله واليقين به، تصبح كل هذه المغريات الرقمية تافهة وصغيرة في عينك."
                    </p>
                  </div>

                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 space-y-2">
                    <div className="text-amber-400 font-black text-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-amber-400 rounded-full" />
                      صدمة الوعي:
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      "في المرة القادمة التي تجد فيها يدك تسترسل مع المشاهد, توقف فوراً واسأل نفسك بهدوء: 'هل أنا شخص حر يقود نفسه إلى النجاح والجنة؟ أو أنا ضحية يتم التلاعب بعقلي لأضيع صلاتي ومستقبلي؟'."
                    </p>
                  </div>

                  <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 space-y-2">
                    <div className="text-blue-400 font-black text-sm flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-400 rounded-full" />
                      امتلاك اللحظة:
                    </div>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      "القوة الحقيقية أن تملك القدرة على مواجهة الفتن. أن تغلق هاتفك وتلبي نداء الصلاة فوراً بوقار، أن تحفظ عينك طاهرة، وتوجه طاقتك وعقلك لبناء مهارة حقيقية ورزق حلال يرفع قدرك وقدر أمتك."
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-emerald-400 text-xs md:text-sm font-black text-center md:text-right leading-relaxed font-serif">
                    خلاصة الوعي: "أنت لست كائن عشوائي وُجد ليلهث خلف السراب.. أنت صاحب منهج صدق، وقيمتك تنبع من طهارتك وعفتك، فكن حر بنور ربك!"
                  </p>
                  <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/20 whitespace-nowrap">
                    وأسأل الله التوفيق
                  </span>
                </div>
              </div>
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
            {/* Header */}
            <div className="bg-amber-500/5 p-8 rounded-[40px] border border-amber-500/10 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <Sparkles size={32} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-amber-900">التبويب الثالث: تزكية النفس وبناء العزيمة</h3>
              <p className="text-amber-800/70 max-w-2xl mx-auto">
                مساحة مخصصة للتحرر من عبودية الشهوات الخفية والخداع الرقمي، لتبني في خلوتك همة ناصعة تليق بقلبك النقي.
              </p>
            </div>

            {/* Sub-tabs Selector */}
            <div className="flex justify-center gap-3 p-1 bg-[#4e635a]/5 rounded-2xl max-w-md mx-auto">
              <button
                onClick={() => {
                  const el = document.getElementById('sub-tazkiyah-pacts');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setTazkiyahSub('pacts');
                }}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-black text-xs transition-all cursor-pointer",
                  tazkiyahSub === 'pacts' ? "bg-amber-600 text-white shadow-md" : "text-amber-800 hover:text-amber-600"
                )}
              >
                مواثيق بطاقات التزكية 🛡️
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('sub-tazkiyah-hidden');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setTazkiyahSub('hidden');
                }}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl font-black text-xs transition-all cursor-pointer",
                  tazkiyahSub === 'hidden' ? "bg-amber-600 text-white shadow-md" : "text-amber-800 hover:text-amber-600"
                )}
              >
                عبادات الخفاء الخالصة 🌙
              </button>
            </div>

            {tazkiyahSub === 'pacts' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="sub-tazkiyah-pacts">
                {[
                  {
                    id: 'tazkiyah-gaze',
                    title: 'ميثاق طهارة العين وغض البصر',
                    focus: 'غض البصر وحفظ القلب',
                    quote: 'قُلْ لِلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ وَيَحْفَظُوا فُرُوجَهُمْ ذَلِكَ أَزْكَى لَهُمْ',
                    reference: 'سورة النور - الآية ٣٠',
                    challenge: 'عاهد نفسك اليوم على حظر أي حساب تافه أو قناة هابطة تنشر مفاتن النساء وتسرق عفة نظراتك.',
                    guidance: 'النظرة سهم مسموم يسلبك وقارك ونور ملامحك؛ اقلب هاتفك فوراً وسل الله الثبات والنقاء.'
                  },
                  {
                    id: 'tazkiyah-heart',
                    title: 'ميثاق طهارة السر والخلوات',
                    focus: 'صون السر والعلانية',
                    quote: 'إِنَّ اللَّهَ لَا يَخْفَىٰ عَلَيْهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ',
                    reference: 'سورة آل عمران - الآية ٥',
                    challenge: 'أن تجعل خلوتك عامرة بالنقاء والعمل الجاد، ولا تخن عفتك حين يغيب عنك نظر الناس البشري.',
                    guidance: 'يتسلل الشيطان من هوامش وقتك الضائع وفراغك ومحاولاته لا تنتهي؛ املأ خلوتك بورد أو مهارة تنتفع بها.'
                  },
                  {
                    id: 'tazkiyah-resolve',
                    title: 'ميثاق عزة ورجولة الشاب العفيف',
                    focus: 'الهمة الحقيقية ومقاطعة السفاسف',
                    quote: 'الرِّجَالُ قَوَّامُونَ عَلَى النِّسَاءِ بِمَا فَضَّلَ اللَّهُ بَعْضَهُمْ عَلَىٰ بَعْضٍ',
                    reference: 'سورة النساء - الآية ٣٤',
                    challenge: 'إن كنت عازبًا: كد واجتهد واشتغل ولا تفرط بالصلاة. وإن كنت متزوجاً: كرم زوجتك، وصن قلبها باللين والقدوة الصالحة.',
                    guidance: 'الرجولة الحقيقية عفة وقوة، وعين تغض الطرف إجلالاً لربها وسيداً لنفسه في زمن الفتن، فلا ترضى أن تكون أداة في يد الشيطان أو ضحية للشاشات.\n\nالرجل الحقيقي يستمد قيمته من ثباته وصيانة كرامته وعفته، فصلاتك في وقتها وسعيك الطيب هي هويتك الحقيقية.'
                  },
                  {
                    id: 'tazkiyah-media',
                    title: 'ميثاق التخلص من المفسدات الرقمية',
                    focus: 'حرية العقل وتطبيقات النور',
                    quote: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنْظُرْ نَفْسٌ مَا قَدَّمَتْ لِغَدٍ',
                    reference: 'سورة الحشر - الآية ١٨',
                    challenge: 'قم بمسح تطبيقات الضياع (كالتيك توك، وبرامج البثوث واللايفات، وتطبيقات التحدث الصوتي وغرف الدردشة الملهية والتوافه) التي تستعبد وقتك وتعرض الفتن وتقتل نباهتك وعفتك.',
                    guidance: 'التواصل الاجتماعي المفسد سلاحه تخدير وعيك لتكون مستهلكاً تافهاً. اقطع حيل الشيطان وعش حريتك الواقعية الحرة.'
                  }
                ].map((pact) => {
                  const isCommitted = commitments.includes(pact.id);
                  return (
                    <motion.div
                      key={pact.id}
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        "p-6 md:p-8 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden text-right flex flex-col justify-between",
                        isCommitted 
                          ? "bg-amber-900 text-amber-50 border-amber-900 shadow-xl" 
                          : "bg-white border-amber-500/10 hover:border-amber-500/30 shadow-xs"
                      )}
                    >
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <span className={cn(
                            "px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                            isCommitted ? "bg-white/10 text-amber-300" : "bg-amber-500/10 text-amber-800"
                          )}>
                            ✦ {pact.focus}
                          </span>
                          {isCommitted && (
                            <span className="text-emerald-400 font-black text-xs flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full">
                              مُلتزم ومبايع 🛡️
                            </span>
                          )}
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xl font-serif font-black">{pact.title}</h4>
                          <div className={cn(
                            "p-5 rounded-2xl border text-center font-serif text-sm leading-relaxed",
                            isCommitted ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-100 text-[#4e635a]"
                          )}>
                            "{pact.quote}"
                            <span className={cn(
                              "block text-[10px] font-bold mt-2",
                              isCommitted ? "text-amber-300" : "text-[#4e635a]/50"
                            )}>{pact.reference}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className={cn(
                            "text-xs font-black uppercase tracking-wider",
                            isCommitted ? "text-amber-200" : "text-amber-800"
                          )}>
                            التحدي التزكوي اليومي:
                          </p>
                          <p className={cn(
                            "text-sm font-semibold leading-relaxed",
                            isCommitted ? "text-amber-100/90" : "text-slate-700"
                          )}>
                            {pact.challenge}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-dashed border-amber-500/10">
                        <p className={cn(
                          "text-xs leading-relaxed italic mb-4 block whitespace-pre-line",
                          isCommitted ? "text-amber-200/70" : "text-slate-500"
                        )}>
                          💡 {pact.guidance}
                        </p>
                        <button
                          onClick={() => handleCommit(pact.id, pact.title)}
                          disabled={isCommitted || isCommiting === pact.id}
                          className={cn(
                            "w-full py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md",
                            isCommitted 
                              ? "bg-transparent text-amber-300 border border-white/20" 
                              : "bg-amber-600 hover:bg-amber-700 text-white"
                          )}
                        >
                          {isCommiting === pact.id ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : isCommitted ? (
                            "تم الالتزام بالميثاق سرياً ✅"
                          ) : (
                            "🤝 عاهدتُ الله والتزمتُ بالميثاق اليوم"
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="sub-tazkiyah-hidden">
                {HIDDEN_WORSHIP_LIST.map((worship) => (
                  <div key={worship.id} className="glass-3d p-6 rounded-[35px] border border-amber-500/5 flex flex-col justify-between">
                    <div>
                      <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                        <EyeOff size={24} />
                      </div>
                      <h4 className="text-xl font-black text-amber-900 mb-2">{worship.title}</h4>
                      <p className="text-amber-800/60 text-sm mb-4 leading-relaxed">{worship.description}</p>
                    </div>
                    <div className="space-y-3 mt-4">
                      <div className="bg-white/40 p-4 rounded-2xl border border-amber-500/10">
                        <p className="text-xs font-bold text-amber-900/40 uppercase mb-1">أثرها على القلب</p>
                        <p className="text-amber-800/80 text-sm font-medium">{worship.benefit}</p>
                      </div>
                      <div className="bg-amber-600 p-4 rounded-2xl text-white shadow-lg">
                        <p className="text-sm font-bold">{worship.action}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <h3 className="text-2xl font-black text-indigo-900">اشياء تحصل في واقعنا هذا الزمن .. كـشف الاقنعـة</h3>
              <p className="text-indigo-800/70 max-w-2xl mx-auto">مساحة واعية لقصص توضح كيف يتم الخداع باسم المكانة أو المظهر، لزيادة الوعي الفطري والحذر من تزييف الحقائق.</p>
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

            {/* رسالة من القلب */}
            <div className="mt-12 p-8 rounded-[40px] bg-gradient-to-br from-indigo-50 to-rose-50 border border-indigo-100/80 shadow-sm relative overflow-hidden text-right">
              <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-br-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-rose-500/5 rounded-tl-[100px] pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="inline-flex p-3 bg-rose-500/10 rounded-2xl text-rose-600 mb-2">
                  <Heart size={28} className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-serif leading-tight">رسالة من القلب 🤍</h3>
                <div className="text-slate-700 leading-relaxed font-semibold space-y-4 text-base">
                  <p>
                    أخي الغالي.. خلف كل قناع نرتديه لنداري به نقصاً أو نستجدي مديحاً، تكمن محاولة ضعيفة للهروب من أنفسنا. 
                    لكن الحقيقة التي لا يمكن تزييفها هي أن الله مطلع على خبايا الصدور، وأن القيمة الحقيقية لا تصنعها الأقنعة البراقة ولا تصفيق المنافقين العابر.
                  </p>
                  <p>
                    تجريد النفس من هذه الأوهام قد يكون مؤلماً وشاقاً في البداية، ولكنه يهديك أعظم كنز في الوجود: <strong className="text-indigo-900">سكينة الصدق مع النفس</strong> و<strong className="text-indigo-900">راحة الضمير الصافي أمام الله.</strong>
                  </p>
                  <p>
                    لا تخف من مواجهة عيوبك؛ فالأنبياء والعلماء علمونا أن الصلاح ليس عصمة من الخطأ، بل هو امتلاك الشجاعة والوعي للنهوض والتوبة المستمرة، وإعطاء الناس حقوقهم المادية والمعنوية غيباً وعلانية. 
                    ابدأ اليوم، تخلص من الأقنعة الزائفة، وعش بقلب سليم ووجه واحد صادق يخشى الله وحده.
                  </p>
                </div>
              </div>
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
              <h3 className="text-2xl font-black text-emerald-900">أنا وأنت (لأجل حياة تليق بك)</h3>
              <p className="text-emerald-800/70 max-w-2xl mx-auto leading-relaxed font-medium">مساحة إيمانية عملية نكشف فيها زيف الشيطان الذي يحاول تخدير همتك، لنرى كيف يثقل الاتكال دينك ونفسك، وكيف يحررك الكدح والتعلق بالخالق وحده.</p>
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
                      <p className="text-emerald-900/80 leading-relaxed font-medium whitespace-pre-line">{boundary.description}</p>
                    </div>
                    <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-xl">
                      <p className="font-medium leading-relaxed whitespace-pre-line">{boundary.practicalAction}</p>
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
              <h3 className="text-2xl font-black text-orange-900">عوّد نفسك (خطواتك العملية للتحرر)</h3>
              <p className="text-orange-800/70 max-w-2xl mx-auto font-medium leading-relaxed">
                هنا نبدأ معاً رحلة التغيير؛ خطوات محددة ومجربة لنواجه بها وساوس الشيطان الخفية، ونحول المعرفة إلى سلوك يومي يملأ حياتك بالبركة والنور.
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
                    <h4 className="text-lg font-black text-orange-950 leading-tight mb-2">
                      {step.challenge.split('\n')[0]}
                    </h4>
                    {step.challenge.split('\n').slice(1).map((subLine, sIdx) => (
                      <p key={sIdx} className="text-xs font-semibold text-orange-800/80 leading-relaxed bg-orange-50/50 p-3 rounded-2xl border border-orange-100/30">
                        {subLine}
                      </p>
                    ))}
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
                <div className="space-y-4">
                  <h4 className="text-xl font-bold font-serif">"إن الله لا يغير ما بقوم حتى يغيروا ما بأنفسهم"</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    التغيير الحقيقي لا يحدث بقراءة النصوص، بل بقرار قوي منك تأخذه الآن خلف شاشتك؛ هذه الخطوات بوابتك لراحة نفسك وطهارة دينك، والعبور يبدأ بالتوبة وقـــول : بسم الله.
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
            <div className="max-w-2xl mx-auto w-full space-y-10">
              {HYPOCRISY_TRAITS.map((trait) => (
                <div key={trait.id} className="glass-3d p-8 rounded-[40px] border border-red-500/10 group space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600"><AlertTriangle size={24} /></div>
                    <h3 className="text-2xl font-black text-red-900 font-serif leading-tight">{trait.trait}</h3>
                  </div>
                  <p className="text-red-900/80 text-base leading-relaxed font-semibold bg-red-500/5 p-6 rounded-3xl border border-red-500/10">{trait.description}</p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-red-600/50 uppercase">القصة والواقع:</span>
                      <div className="bg-white/60 p-6 rounded-3xl border border-red-500/10 text-base leading-relaxed"><p className="text-red-800/80 font-medium whitespace-pre-line">{trait.story}</p></div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-600/50 uppercase">الوعي واليقظة:</span>
                      <div className="bg-red-900 p-6 rounded-3xl text-white shadow-xl text-base leading-relaxed font-semibold"><p className="whitespace-pre-line">{trait.solution}</p></div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-amber-50 p-6 rounded-3xl border border-orange-200/50 italic text-amber-900 font-bold text-sm leading-relaxed whitespace-pre-line">
                    💡 {trait.warning}
                  </div>
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
    <div className="glass-3d p-6 rounded-[35px] border border-white/50 flex flex-col justify-between">
      <div>
        <h4 className="text-lg font-black text-[#1b1c1a] mb-2">{title}</h4>
        <p className="text-[#655d51] text-xs font-medium leading-relaxed mb-4 whitespace-pre-line">{description}</p>
      </div>
      <div className={cn("p-4 rounded-2xl text-white text-xs font-bold shadow-lg text-center mt-auto", colorMap[color])}>{action}</div>
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
