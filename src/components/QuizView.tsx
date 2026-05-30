
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, Star, ListChecks, Ghost, Quote } from 'lucide-react';
import { quizQuestions, type Question } from '../data/questions';

export default function QuizView() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Shuffle questions on initial load or reset
  const shuffledQuestions = useMemo(() => {
    return [...quizQuestions].sort(() => Math.random() - 0.5);
  }, [isFinished === false && currentQuestionIndex === 0]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswer = (answer: string | boolean) => {
    if (userAnswer !== null) return;
    
    setUserAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < shuffledQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswer(null);
    setIsFinished(false);
    setShowExplanation(false);
  };

  if (isFinished) {
    const percentage = (score / shuffledQuestions.length) * 100;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-margin-page py-10 text-center space-y-12"
      >
        <div className="relative inline-block">
          <motion.div 
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-24 h-24 bg-[#4e635a] rounded-full flex items-center justify-center text-white shadow-2xl mx-auto"
          >
            <Award size={48} />
          </motion.div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2 border border-dashed border-[#4e635a]/20 rounded-full"
          />
        </div>

        {/* Score & Reward Message */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4e635a]">نور العلم يُضيء بالعمل</h2>
          <div className="flex items-center justify-center gap-4 text-[#655d51] mb-2">
             <div className="flex items-center gap-1">
               <Star size={16} className="text-amber-500 fill-amber-500" />
               <span className="font-bold">{score} مهارة معرفية</span>
             </div>
             <div className="w-1 h-1 rounded-full bg-gray-300" />
             <span className="font-medium text-sm">من أصل {shuffledQuestions.length} تدبر نبوي</span>
          </div>
          
          <div className="w-full max-w-xs mx-auto h-2 bg-[#d1e8dd] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              className="h-full bg-[#4e635a]"
            />
          </div>
        </div>

        {/* The Actionable Card - "Bousala of Light" */}
        <div className="relative bg-[#fbf9f6] p-10 rounded-[4rem] border-2 border-[#4e635a]/5 max-w-xl mx-auto shadow-2xl shadow-black/5 group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Quote size={120} />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-3">
              <span className="bg-[#4e635a] text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">ميثاق العمل الصالح</span>
              <h3 className="text-2xl font-serif font-bold text-[#4e635a] leading-tight">
                "مَن تعلمَ حجةً، فعليـهِ أن يقيمَهـا بالعمـل"
              </h3>
            </div>

            <p className="text-[#655d51] leading-relaxed text-right md:text-center text-lg italic bg-white/50 p-6 rounded-3xl border border-white/80">
              {percentage >= 80 ? 
                'لقد أنعم الله عليك بالعلم، والآن حان وقت "الاقتداء". اختر خلقاً واحداً من الأنبياء الذين عرفت قصصهم ليكون شعارك لهذا الأسبوع.' : 
                'كل معلومة عرفتها اليوم هي "بذرة" في ميزان حسناتك، لن تكتمل إلا إذا سقيتهـا بالعمل بها في واقعك ومع الناس.'
              }
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#d1e8dd] flex items-center gap-3">
                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                <span className="text-sm font-bold text-[#4e635a]">سأصبر كما صبر أيوب</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#d1e8dd] flex items-center gap-3">
                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                <span className="text-sm font-bold text-[#4e635a]">سأصدق كما صدق محمد ﷺ</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#d1e8dd] flex items-center gap-3">
                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                <span className="text-sm font-bold text-[#4e635a]">سأعفو كما عفا يوسف</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#d1e8dd] flex items-center gap-3">
                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                <span className="text-sm font-bold text-[#4e635a]">سأشكر كما شكر سليمان</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={resetQuiz}
            className="inline-flex items-center gap-3 bg-[#4e635a] text-white px-12 py-5 rounded-3xl font-bold hover:bg-[#3d4d46] transition-all transform hover:scale-105 shadow-2xl shadow-[#4e635a]/20"
          >
            <RotateCcw size={20} />
            <span>تجديد النية والاختبار</span>
          </button>
          <p className="text-[#8da399] text-xs font-bold tracking-widest uppercase">
            هذا التطبيق هو وسيلتـك للذكر والعمـل.. نفع الله بك
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-margin-page pb-24 space-y-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#4e635a] rounded-xl text-white">
            <ListChecks size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#4e635a] font-serif">اختبر معلوماتك</h2>
            <p className="text-xs text-[#8da399] font-bold">ماذا تعلمنا من الأنبياء؟</p>
          </div>
        </div>
        <div className="bg-[#d1e8dd] px-4 py-2 rounded-full text-[#4e635a] font-bold text-sm">
          {currentQuestionIndex + 1} / {shuffledQuestions.length}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[4rem] border border-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#d1e8dd]/10 rounded-full blur-3xl -z-10" />
            
            <div className="flex items-center gap-3 mb-6">
              <span className="p-1.5 bg-[#d1e8dd] rounded-lg text-[#4e635a]">
                <HelpCircle size={16} />
              </span>
              <span className="text-xs font-bold text-[#8da399] tracking-widest uppercase">{currentQuestion.prophetName}</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#4e635a] leading-relaxed mb-10 text-right">
              {currentQuestion.text}
            </h3>

            <div className="grid gap-4">
              {currentQuestion.type === 'multiple' ? (
                currentQuestion.options?.map((option, i) => {
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const isSelected = userAnswer === option;
                  
                  return (
                    <button
                      key={i}
                      disabled={userAnswer !== null}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-6 rounded-[2rem] border-2 text-right transition-all duration-300 flex items-center justify-between group
                        ${userAnswer === null ? 'border-transparent bg-white hover:border-[#4e635a]/30 hover:bg-[#fbf9f6]' : 
                          isCorrect ? 'border-green-500 bg-green-50' : 
                          isSelected ? 'border-red-500 bg-red-50' : 'border-transparent bg-white/50 opacity-60'}
                      `}
                    >
                      <div className="flex items-center gap-4 flex-row-reverse">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                          ${userAnswer === null ? 'bg-[#d1e8dd] text-[#4e635a] group-hover:bg-[#4e635a] group-hover:text-white' : 
                            isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}
                        `}>
                          {i + 1}
                        </div>
                        <span className="text-lg font-bold text-[#4e635a]">{option}</span>
                      </div>
                      
                      {userAnswer !== null && isCorrect && <CheckCircle2 className="text-green-500" />}
                      {userAnswer !== null && !isCorrect && isSelected && <XCircle className="text-red-500" />}
                    </button>
                  );
                })
              ) : (
                <div className="flex gap-4">
                  {[true, false].map((val) => {
                    const isCorrect = val === currentQuestion.correctAnswer;
                    const isSelected = userAnswer === val;
                    return (
                      <button
                        key={val.toString()}
                        disabled={userAnswer !== null}
                        onClick={() => handleAnswer(val)}
                        className={`flex-1 p-8 rounded-[2rem] border-2 font-bold text-xl transition-all duration-300
                          ${userAnswer === null ? 'border-transparent bg-white hover:border-[#4e635a]/30 hover:bg-[#fbf9f6]' : 
                            isCorrect ? 'border-green-500 bg-green-50' : 
                            isSelected ? 'border-red-500 bg-red-50' : 'border-transparent bg-white/50 opacity-60'}
                        `}
                      >
                        {val ? 'صح ✔️' : 'خطأ ✖️'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-[#fbf9f6] p-8 rounded-[2.5rem] border border-[#d1e8dd] relative">
                  <div className="absolute -top-4 right-8 bg-[#4e635a] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    {userAnswer === currentQuestion.correctAnswer ? 'نعم.. أحسنت!' : 'تذكرة للقلب'}
                  </div>
                  <p className="text-[#655d51] text-lg leading-relaxed text-right italic font-medium">
                    {currentQuestion.explanation}
                  </p>
                </div>

                <button 
                  onClick={nextQuestion}
                  className="w-full bg-[#4e635a] text-white p-6 rounded-[2rem] font-bold text-lg hover:bg-[#3d4d46] transition-all shadow-xl shadow-[#4e635a]/10 flex items-center justify-center gap-3"
                >
                  <span>{currentQuestionIndex + 1 === shuffledQuestions.length ? 'إنهاء الاختبار' : 'السؤال التالي'}</span>
                  <Star fill="currentColor" size={20} className="animate-spin-slow" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
