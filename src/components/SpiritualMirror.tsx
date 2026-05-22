import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, RefreshCcw, ShieldQuestion, Loader2 } from 'lucide-react';
import { assessmentQuestions, AssessmentQuestion } from '../data/spiritualAssessmentQuestions';
import { saveAssessment } from '../services/recordService';
import { analyzeSpiritualState } from '../services/geminiService';
import { DataExportService } from '../services/dataExportService';
import { Download } from 'lucide-react';

export const SpiritualMirror: React.FC<{ recentMoods?: string[], recentReflections?: string[] }> = ({ recentMoods = [], recentReflections = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentQuestion = assessmentQuestions[currentIndex];

  const handleAnswer = async (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    
    if (currentIndex < assessmentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsSaving(true);
      const results = calculateResults(newAnswers);
      const evaluation = getOverallEvaluation(results);
      
      const scoresMap: Record<string, number> = {};
      results.forEach(r => scoresMap[r.category] = r.score);
      
      try {
        await saveAssessment(scoresMap, evaluation.title);
      } catch (error) {
        console.error("Error saving assessment:", error);
      } finally {
        setIsSaving(false);
        setIsFinished(true);
      }
    }
  };

  const calculateResults = (currentAnswers: Record<string, number> = answers) => {
    const categories: Record<string, number> = {
      intent: 0,
      ethics: 0,
      consistency: 0,
      ego: 0,
      knowledge: 0,
    };
    
    const counts: Record<string, number> = { 
      intent: 0, 
      ethics: 0, 
      consistency: 0,
      ego: 0,
      knowledge: 0,
    };

    Object.entries(currentAnswers).forEach(([id, val]) => {
      const q = assessmentQuestions.find(q => q.id === id);
      if (q) {
        const cat = q.category as string;
        if (categories[cat] !== undefined) {
          categories[cat] += val as number;
          counts[cat] += 1;
        }
      }
    });

    return Object.entries(categories).map(([cat, score]) => ({
      category: cat,
      score: counts[cat] > 0 ? (score / (counts[cat] * 4)) * 100 : 100,
    }));
  };

  const getInterpretation = (score: number, category: string) => {
    const interpretations: Record<string, { low: string, mid: string, high: string }> = {
      intent: {
        low: "النية مشتتة جداً بين الله والناس. ابحث عن عبادة السر.",
        mid: "بدايات الإخلاص موجودة ولكن رغبة الثناء تزاحمها. جاهد نفسك.",
        high: "نرجو أن تكون من المخلصين. استمر في إخفاء حسناتك."
      },
      ethics: {
        low: "هناك انفصال خطير بين العبادة والمعاملة. الدين هو المعاملة.",
        mid: "تحتاج لمراقبة الله في البيع والشراء والتعامل مع الخصوم.",
        high: "خلقك يعاونه دينك. هذا هو جوهر طريق الأنبياء."
      },
      consistency: {
        low: "القصص عندك للتسلية لا للمنهج. حول المعرفة إلى حركة.",
        mid: "تتأثر بالوعظ ولكن الأثر يزول سريعاً. اربط العلم بالعمل.",
        high: "أنت ممن يستمعون القول فيتبعون أحسنه."
      },
      ego: {
        low: "الكبر وشهوة الظهور تحجب عنك نور الإيمان الصادق.",
        mid: "احذر من رؤية نفسك أفضل من الآخرين، فالخواتيم بيد الله.",
        high: "هضم النفس والاعتراف بالتقصير هو باب القبول."
      },
      knowledge: {
        low: "المعلومات كثيرة والعمل قليل. العلم بلا عمل حجة عليك لا لك.",
        mid: "تحتاج لنقل ما تعرفه من لسانك إلى جوارحك.",
        high: "وفقك الله لليقين الذي يتبعه صدق الامتثال."
      }
    };
    
    const data = interpretations[category] || interpretations['intent'];
    if (score < 30) return data.low;
    if (score < 70) return data.mid;
    return data.high;
  };

  const categoryNames: Record<string, string> = {
    intent: 'إخلاص النية',
    ethics: 'صدق المعاملة',
    consistency: 'المنهج والواقع',
    ego: 'سلامة النفس',
    knowledge: 'ثمرة العلم',
  };

  const getOverallEvaluation = (results: { category: string, score: number }[]) => {
    const avg = results.reduce((acc, curr) => acc + curr.score, 0) / results.length;
    if (avg < 40) return {
      title: "مرحلة اليقظة",
      desc: "أنت في مرحلة حرجة من الصراع بين الزيف والحقيقة. الصدق المرّ مع النفس هو طوق نجاتك الوحيد الآن. ابدأ بتطهير معاملتك للناس قبل زيادة أذكارك.",
      color: "text-rose-600 bg-rose-50"
    };
    if (avg < 75) return {
      title: "مرحلة المجاهدة",
      desc: "أنت تعرف الحق وتجاهد نفسك لاتباعه، لكن الهوى وعادات المجتمع تشدك للخلف. استمر في المجاهدة فالله يحب التوابين الذين يسعون لإصلاح بواطنهم.",
      color: "text-amber-600 bg-amber-50"
    };
    return {
      title: "مرحلة الثبات والاستقامة",
      desc: "نحسبك على خير والله حسيبك. المهمة الآن هي الحفاظ على هذا النور من الرياء والعجب. تذكر أن القلوب بين إصبعين من أصابع الرحمن يقلبها كيف يشاء.",
      color: "text-emerald-600 bg-emerald-50"
    };
  };

  const reset = () => {
    setCurrentIndex(0);
    setAnswers({});
    setIsFinished(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Heart className="text-emerald-600 fill-emerald-100" />
          بصيرة (خلف الشاشات)
        </h2>
        <p className="text-slate-600 mt-2">وقفة صدق مع نفسك.. بعيداً عن أعين الناس</p>
      </div>

      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm"
          >
            {/* تنبيه أخوي صادق يمهد للجلسة وبساطتها */}
            {currentIndex === 0 && (
              <div className="bg-emerald-50/70 border border-emerald-100/80 rounded-2xl p-5 mb-8 text-emerald-900 text-sm leading-relaxed text-right relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />
                <p className="font-bold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                  <span>💡</span>
                  یا غالي، اقرأ بوجدانك:
                </p>
                <p className="text-emerald-950/90 font-medium leading-relaxed">
                  "يا غالي، هذه الجلسة سرية تماماً بينك وبين ربك، ولا أحد في الكون سيطلع على إجاباتك. تذكر أن <span className="text-emerald-700 font-bold">'الصدق المرّ'</span> مع النفس أول خطوة في طريق إصلاحك وهدايتك، فلا تجمل الإجابات واجه نفسك بصدق."
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                السؤال {currentIndex + 1} من {assessmentQuestions.length}
              </span>
              <div className="flex gap-1">
                {assessmentQuestions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 w-4 rounded-full transition-colors ${i <= currentIndex ? 'bg-emerald-500' : 'bg-slate-100'}`} 
                  />
                ))}
              </div>
            </div>

            <h3 className="text-xl text-slate-800 font-medium leading-relaxed mb-10 text-center">
              "{currentQuestion.text}"
            </h3>

            {isSaving ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                <p className="text-slate-500 font-medium">جاري تحليل إجاباتك بنور البصيرة...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'دائماً.. هذا يصفني بدقة', value: 0 },
                  { label: 'غالباً أقع في هذا', value: 1 },
                  { label: 'أحياناً أصارع هذا الشعور', value: 2 },
                  { label: 'نادراً ما يحدث هذا', value: 3 },
                  { label: 'أجاهد نفسي لكي لا يحدث أبداً', value: 4 },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="w-full text-right p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-slate-700 hover:text-emerald-900 group flex items-center justify-between"
                  >
                    <span>{opt.label}</span>
                    <div className="h-2 w-2 rounded-full border border-slate-300 group-hover:border-emerald-500" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            id="spiritual-report"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg text-right"
          >
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">تقرير البصيرة الروحية</h3>
              <p className="text-slate-600">صدقك هو الخطوة الأولى للتغيير</p>
            </div>

            {(() => {
              const results = calculateResults();
              const evaluation = getOverallEvaluation(results);
              return (
                <>
                  <div className={`p-6 rounded-2xl mb-8 border border-current/20 ${evaluation.color}`}>
                    <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                       <ShieldQuestion size={22} />
                       {evaluation.title}
                    </h4>
                    <p className="leading-relaxed opacity-90">{evaluation.desc}</p>
                  </div>

                  <div className="space-y-6 mb-8">
                    {results.map((res) => (
                      <div key={res.category} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-slate-500">{Math.round(res.score)}%</span>
                          <span className="text-slate-800">{categoryNames[res.category]}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${res.score}%` }}
                            className={`h-full ${res.score > 70 ? 'bg-emerald-500' : res.score > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          />
                        </div>
                        <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                          {getInterpretation(res.score, res.category)}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

              <AnimatePresence>
                {aiInsight ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 space-y-6 border-t pt-8"
                  >
                    <div className="bg-[#4e635a]/5 p-6 rounded-[32px] border border-[#4e635a]/10 space-y-4">
                       <h4 className="font-bold text-[#4e635a] flex items-center gap-2">
                         <Sparkles size={18} />
                         تحليل البصيرة العميقة
                       </h4>
                       <p className="text-sm leading-relaxed text-[#1b1c1a]/80 italic">
                         {aiInsight.analysis}
                       </p>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 space-y-3">
                       <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">آية لقلبك</p>
                       <p className="text-xl font-serif text-emerald-900 leading-loose">
                         {aiInsight.quranVerse}
                       </p>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 space-y-3">
                       <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">دعاء مخصص</p>
                       <p className="font-serif text-[#1b1c1a]">
                         {aiInsight.specialDua}
                       </p>
                    </div>

                    <div className="bg-[#1b1c1a] p-6 rounded-[32px] text-white space-y-2">
                       <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">بصيرة "سندك"</p>
                       <p className="text-sm font-medium leading-relaxed italic">
                         {aiInsight.insightNote}
                       </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={async () => {
                      setIsAnalyzing(true);
                      const res = calculateResults();
                      const eval_res = getOverallEvaluation(res);
                      const insight = await analyzeSpiritualState(res, eval_res.title, recentMoods, recentReflections);
                      setAiInsight(insight);
                      setIsAnalyzing(false);
                    }}
                    disabled={isAnalyzing}
                    className="w-full mt-6 py-4 bg-[#4e635a] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-[#4e635a]/20 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Sparkles size={20} />
                    )}
                    <span>{isAnalyzing ? 'جاري كشف البصيرة...' : 'كشف البصيرة بالذكاء الاصطناعي'}</span>
                  </motion.button>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-4 mt-8">
                <button
                  onClick={async () => {
                    await DataExportService.exportToPDF('spiritual-report', `spiritual-report-${Date.now()}`);
                  }}
                  className="w-full py-4 bg-[#1b1c1a] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-black/20"
                >
                  <Download size={20} />
                  <span>تحميل تقرير البصيرة PDF</span>
                </button>
                <button
                  onClick={reset}
                  className="flex-1 flex items-center justify-center gap-2 text-[#4e635a] hover:text-[#4e635a] font-medium bg-[#4e635a]/5 py-4 rounded-2xl transition-colors"
                >
                  <RefreshCcw size={18} />
                  إعادة التحقق
                </button>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-amber-50 rounded-xl p-4 flex gap-4 text-amber-800 text-sm border border-amber-100">
        <AlertCircle className="shrink-0 text-amber-500" size={20} />
        <p>
          تذكر قوله تعالى: "بَلِ الْإِنسَانُ عَلَىٰ نَفْسِهِ بَصِيرَةٌ". الصدق مع النفس هو أول خطوات النجاة من النفاق الخفي.
        </p>
      </div>
    </div>
  );
};
