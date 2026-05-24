import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Loader2, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw, 
  Compass, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  UserCheck 
} from 'lucide-react';
import { sendChatMessage, ChatMessage } from '../services/chatService';
import { getUserContext } from '../services/recordService';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      async function loadContext() {
        try {
          const ctx = await getUserContext() as any;
          if (ctx && auth.currentUser) {
            const previousIssue = localStorage.getItem(`sanad_last_problem_${auth.currentUser.uid}`);
            ctx.previousIssue = previousIssue;
          }
          setUserContext(ctx);

          // Trigger proactive greeting if history is empty
          if (history.length === 0) {
            setIsLoading(true);
            try {
              const greetingResponse = await sendChatMessage("أطلق_النكش_المبادر", [], ctx);
              
              // Process memory tags to clean layout and store progress
              const match = greetingResponse.match(/\[MEMORY:\s*(.*?)\s*\]/);
              let cleanGreeting = greetingResponse;
              if (match && auth.currentUser) {
                localStorage.setItem(`sanad_last_problem_${auth.currentUser.uid}`, match[1]);
                cleanGreeting = greetingResponse.replace(/\[MEMORY:\s*(.*?)\s*\]/g, '').trim();
                ctx.previousIssue = match[1];
              } else {
                cleanGreeting = cleanGreeting.replace(/\[MEMORY:\s*(.*?)\s*\]/g, '').trim();
              }
              
              setHistory([{ role: 'model', parts: [{ text: cleanGreeting }] }]);
            } catch (err: any) {
              console.error("Proactive greeting issue:", err);
              setHistory([{
                role: 'model',
                parts: [{ text: 'أهلاً بك يا صاحبي يا رفيقي الغالي.. أنا سند، رفيقك في رحلة التغيير والإصلاح الصادق. كيف حال قلبك اليوم وأين وصلت في جهادك وعافيتك؟' }]
              }]);
            } finally {
              setIsLoading(false);
            }
          }
        } catch (err) {
          console.error("Error loading context for chatbot:", err);
        }
      }
      loadContext();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSend = async (directMessage?: string) => {
    const rawMsg = directMessage || message;
    if (!rawMsg.trim() || isLoading) return;

    const userMessage = rawMsg.trim();
    if (!directMessage) {
      setMessage('');
    }
    setError(null);
    setIsLoading(true);

    const newHistory: ChatMessage[] = [...history, { role: 'user', parts: [{ text: userMessage }] }];
    setHistory(newHistory);

    try {
      const aiResponse = await sendChatMessage(userMessage, history, userContext);
      
      const match = aiResponse.match(/\[MEMORY:\s*(.*?)\s*\]/);
      let cleanResponse = aiResponse;
      if (match && auth.currentUser) {
        localStorage.setItem(`sanad_last_problem_${auth.currentUser.uid}`, match[1]);
        cleanResponse = aiResponse.replace(/\[MEMORY:\s*(.*?)\s*\]/g, '').trim();
        if (userContext) {
          userContext.previousIssue = match[1];
        }
      } else {
        cleanResponse = cleanResponse.replace(/\[MEMORY:\s*(.*?)\s*\]/g, '').trim();
      }

      setHistory([...newHistory, { role: 'model', parts: [{ text: cleanResponse }] }]);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("هل ترغب في إعادة ضبط جلسة الإصلاح والبدء في مكاشفة جديدة مع سند؟")) {
      setHistory([]);
      setMessage('');
      setError(null);
      
      if (userContext) {
        setIsLoading(true);
        try {
          const greetingResponse = await sendChatMessage("أطلق_النكش_المبادر", [], userContext);
          const match = greetingResponse.match(/\[MEMORY:\s*(.*?)\s*\]/);
          let cleanGreeting = greetingResponse;
          if (match && auth.currentUser) {
            localStorage.setItem(`sanad_last_problem_${auth.currentUser.uid}`, match[1]);
            cleanGreeting = greetingResponse.replace(/\[MEMORY:\s*(.*?)\s*\]/g, '').trim();
            userContext.previousIssue = match[1];
          } else {
            cleanGreeting = cleanGreeting.replace(/\[MEMORY:\s*(.*?)\s*\]/g, '').trim();
          }
          setHistory([{ role: 'model', parts: [{ text: cleanGreeting }] }]);
        } catch (err: any) {
          setHistory([{
            role: 'model',
            parts: [{ text: 'أهلاً بك يا صاحبي يا رفيقي الغالي.. أنا سند، رفيقك في رحلة التغيير والإصلاح الصادق. كيف حال قلبك اليوم وأين وصلت في جهادك وعافيتك؟' }]
          }]);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  // Elegant text formatting parser for premium layout elements in Arabic
  const renderMessageText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-right" dir="rtl">
        {lines.map((line, idx) => {
          let cleanLine = line.trim();
          if (cleanLine === "") return <div key={idx} className="h-2" />;

          // Check if line is a bullet item
          const isBullet = cleanLine.startsWith('- ') || cleanLine.startsWith('* ') || cleanLine.startsWith('• ');
          if (isBullet) {
            cleanLine = cleanLine.substring(2);
          }

          // Parse double asterisk bold text (**text**)
          const boldRegex = /\*\*(.*?)\*\*/g;
          const lineParts = [];
          let lastIndex = 0;
          let match;

          while ((match = boldRegex.exec(cleanLine)) !== null) {
            if (match.index > lastIndex) {
              lineParts.push(cleanLine.substring(lastIndex, match.index));
            }
            lineParts.push(
              <strong key={match.index} className="font-extrabold text-[#4e635a] bg-[#4e635a]/5 px-1 py-0.5 rounded border border-[#4e635a]/10">
                {match[1]}
              </strong>
            );
            lastIndex = boldRegex.lastIndex;
          }

          if (lastIndex < cleanLine.length) {
            lineParts.push(cleanLine.substring(lastIndex));
          }

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 mr-1">
                <span className="text-[#bfa980] font-black mt-1.5">•</span>
                <span className="flex-1 text-[#1b1c1a]/95 font-medium leading-relaxed">
                  {lineParts.length > 0 ? lineParts : cleanLine}
                </span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-[#1b1c1a]/95 font-medium leading-relaxed">
              {lineParts.length > 0 ? lineParts : cleanLine}
            </p>
          );
        })}
      </div>
    );
  };

  // Safe destructuring of user parameters
  const demo = userContext?.demographics || { gender: 'male', maritalStatus: 'single', job: 'student' };
  const assessment = userContext?.assessment;
  const name = userContext?.displayName || "رفيق الكفاح";

  const genderLabel = demo.gender === 'female' ? "أخت مصونة" : "شاب رجُل شَهم";
  const maritalLabel = demo.maritalStatus === 'married' ? "متزوج ومسؤول" : "عازب يبني حياته بكرامة";
  const jobLabel = demo.job === 'student' ? "طالب علم ودراسة" : demo.job === 'employed' ? "موظف يعتمد على كسب يده" : demo.job === 'unemployed' ? "باحث عن عمل وعيش شريف" : "عمل خاص ومستقل";
  const totalScore = assessment?.totalScore || 0;

  // Custom chips based on gender selection
  const chipsList = demo.gender === 'female' ? [
    "كيف أصون حيائي وعفة قلبي في فضاء الميديا؟",
    "طريقة واقعية للتخلص من رفيقات السوء وضياع صلواتي",
    "كيف أصمد ولا أضعف في زمان الفتن والشاشات؟",
    "أريد مراجعة وتصفية ذنوب الخلوة"
  ] : [
    "كيف أغلق ثغرة تتبع النساء والفتيات نهائياً؟",
    "طريقة عملية لحذف تيك توك وتطبيقات الميديا الملهية",
    "كيف أصون سري وأبني خبيئة صالحة بيني وبين الله؟",
    "أريد مراجعة وتصفية ذنوب الخلوة والمجاهدة الصادقة"
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Immersive backdrop overlay blur for the Reform Session Room */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#1b1c1a]/50 z-[55] backdrop-blur-md"
            />

            <motion.div
              id="ai-chat-window"
              initial={{ opacity: 0, y: 150, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 150, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 md:bottom-12 md:left-1/2 md:-translate-x-1/2 z-[60] w-full md:w-[500px] h-full md:h-[750px] md:max-h-[85vh] bg-[#fbfbfa] md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-t md:border border-[#4e635a]/10"
            >
              {/* Premium Scholarly Earthy Header */}
              <div className="p-5 bg-gradient-to-br from-[#4e635a] to-[#2d3a33] text-white flex items-center justify-between shadow-lg relative border-b-2 border-[#d1c2a5]/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(209,194,165,0.1),transparent)] pointer-events-none" />
                
                <div className="flex items-center gap-3.5 z-10">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                      <Bot className="w-6.5 h-6.5 text-[#e5dcc5]" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#d1c2a5] border-2 border-[#4e635a] rounded-full animate-pulse" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-serif font-black text-lg flex items-center gap-2 leading-tight">
                      رَفِيقُكَ الذَّكِي سَنَدْ
                      <Sparkles className="w-4 h-4 text-[#d1c2a5]" />
                    </h3>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <p className="text-xs text-[#d1d5db]/90 font-medium">جلسة الإصلاح والمكاشفة</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 z-10">
                  {/* Clean reset session button */}
                  <button
                    onClick={handleReset}
                    className="p-2.5 hover:bg-white/10 rounded-full transition-all active:scale-95 text-[#e2dfd5] hover:text-white"
                    title="إعادة ضبط الجلسة والبدء من جديد"
                  >
                    <RotateCcw className="w-5.5 h-5.5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2.5 hover:bg-white/10 rounded-full transition-all active:scale-95 text-[#e2dfd5] hover:text-white"
                    aria-label="إغلاق"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Safe Haven Session Message Area */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#f7f6f2] scroll-smooth pb-20 relative"
              >
                {/* Subtle paper pattern backdrop */}
                <div className="absolute inset-0 bg-[radial-gradient(#4e635a_0.4px,transparent_0.4px)] [background-size:12px_12px] opacity-[0.03] pointer-events-none" />

                {history.length === 0 && (
                  <div className="relative text-center py-6 px-3 space-y-6 z-10">
                    <div className="relative inline-block mt-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#4e635a] to-[#3a4b41] text-white rounded-full flex items-center justify-center mx-auto shadow-xl border-4 border-[#e2dfd5]">
                        <Bot className="w-10 h-10 text-[#fbfbfa]" />
                      </div>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1 -right-1"
                      >
                        <Sparkles className="w-6 h-6 text-[#bfa980]" />
                      </motion.div>
                    </div>

                    {/* Integrated Personalized Context Card & Badge system */}
                    <div className="bg-white p-5 rounded-[2.2rem] border border-[#4e635a]/10 shadow-md space-y-4 max-w-sm mx-auto text-right" dir="rtl">
                      <div className="flex items-center gap-2 border-b border-[#4e635a]/5 pb-2.5">
                        <div className="w-2.5 h-2.5 bg-[#4e635a] rounded-full" />
                        <h4 className="text-xs font-black text-[#4e635a] uppercase tracking-wider">سند يعـي سـياقـك بالكامل:</h4>
                      </div>
                      
                      <p className="text-sm text-[#1b1c1a]/90 font-bold">
                        أهلاً يا <span className="text-[#4e635a] font-black underline decoration-[#bfa980] decoration-2">{name}</span>، لقد قمت بتحديث نبرتي وحيازة فقهي بالكامل لتلائم ظروفك الشخصية الصدوقة:
                      </p>

                      <div className="flex flex-wrap gap-1.5 justify-start mt-3">
                        <span className="text-[10px] font-black bg-[#4e635a]/5 text-[#4e635a] border border-[#4e635a]/12 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                          👤 {genderLabel}
                        </span>
                        <span className="text-[10px] font-black bg-[#4e635a]/5 text-[#4e635a] border border-[#4e635a]/12 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                          💍 {maritalLabel}
                        </span>
                        <span className="text-[10px] font-black bg-[#4e635a]/5 text-[#4e635a] border border-[#4e635a]/12 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                          🎓 {jobLabel}
                        </span>
                        {totalScore > 0 && (
                          <span className="text-[10px] font-black bg-[#bfa980]/10 text-[#7c6943] border border-[#bfa980]/20 px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                            👁️ {assessment?.title} ({totalScore} نقاط)
                          </span>
                        )}
                      </div>

                      <div className="text-[10.5px] text-zinc-500 font-bold leading-relaxed bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/40 mt-1">
                        🔒 نبرة الخطاب سرية ومشفرة تماماً لغرض سد ثغورك وجلب همتك بكرامة وعزة.
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xl font-serif font-black text-[#4e635a]">مرحباً بك في جلسة الشجاعة والمواجهة النفسية</h4>
                      <p className="text-xs md:text-sm text-[#5d645f] leading-relaxed max-w-sm mx-auto font-medium">
                        تكلم بصدق ولا تشيل هم.. أنا هنا كأخ ورفيق واعٍ وصادق يواجه ذنوبك وعثراتك بخطوات عملية بسيطة تغنيك عن مواعظ الإحباط والملل.
                      </p>
                    </div>

                    {/* Quick Customized Starting Chips */}
                    <div className="space-y-2 max-w-sm mx-auto text-right" dir="rtl">
                      <p className="text-xs font-black text-[#5d645f] mr-1 block">💡 مقترحات مكاشفة سريعة لمجاهدة ثغرك:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {chipsList.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => handleSend(chip)}
                            className="text-right p-3.5 bg-white border border-[#4e635a]/10 hover:border-[#4e635a]/30 rounded-2xl text-[12.5px] text-[#1b1c1a]/90 hover:text-[#4e635a] hover:bg-emerald-50/20 transition-all shadow-sm active:scale-[0.98] cursor-pointer font-bold leading-relaxed flex items-center gap-2 group"
                          >
                            <span className="text-[#bfa980] group-hover:scale-125 transition-transform">✦</span>
                            <span className="flex-1">{chip}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {history.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'} gap-3 w-full`}
                  >
                    {/* Glowing brand circular avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${
                      msg.role === 'user' 
                        ? 'bg-[#e2dfd5] text-[#4e635a] border-[#4e635a]/10' 
                        : 'bg-gradient-to-br from-[#4e635a] to-[#2d3a33] text-[#e0dac3] border-[#4e635a]/20'
                    }`}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>

                    {/* Beautiful speech bubble with specific border curves */}
                    <div className={`max-w-[80%] p-4 rounded-2xl text-[14.5px] leading-relaxed relative ${
                      msg.role === 'user' 
                        ? 'bg-[#4e635a] text-white rounded-tr-none shadow-md shadow-[#4e635a]/10 font-bold' 
                        : 'bg-white text-zinc-900 rounded-tl-none shadow-sm border border-[#4e635a]/8 font-medium'
                    }`}>
                      {msg.role === 'user' ? msg.parts[0].text : renderMessageText(msg.parts[0].text)}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex justify-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4e635a] to-[#2d3a33] text-white flex items-center justify-center shadow-sm">
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-[#d1c2a5]" />
                    </div>
                    <div className="bg-white px-4 py-3.5 rounded-2xl rounded-tl-none border border-[#4e635a]/10 shadow-sm">
                      <div className="flex gap-1.5 items-center justify-center py-1">
                        <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-[#4e635a] rounded-full" />
                        <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#4e635a] rounded-full" />
                        <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#4e635a] rounded-full" />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">!</div>
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Secure Chat input footer bar */}
              <div className="p-4 md:p-5 bg-white border-t border-[#4e635a]/8 pb-safe shadow-[0_-10px_35px_rgba(78,99,90,0.04)]">
                <div className="relative flex items-center justify-center gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="امسح ذنبك واكتب لسند ما يجول بخاطرك الآن..."
                    className="w-full pl-14 pr-5 py-4 bg-[#fbfbfa] rounded-2xl text-[14px] md:text-[15px] focus:outline-none focus:ring-2 focus:ring-[#4e635a] transition-all border border-[#4e635a]/15 focus:bg-white shadow-inner font-bold text-[#1b1c1a]"
                    dir="rtl"
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleSend()}
                    disabled={isLoading || !message.trim()}
                    className="absolute left-2.5 w-11 h-11 bg-[#4e635a] text-white rounded-xl flex items-center justify-center hover:bg-[#35483f] transition-all disabled:bg-zinc-200 disabled:shadow-none shadow-lg shadow-[#4e635a]/20 cursor-pointer"
                  >
                    <Send className="w-5 h-5 mr-0.5 transform rotate-180" />
                  </motion.button>
                </div>
                <p className="text-[10px] text-center mt-3 text-[#4e635a]/80 font-bold tracking-wide">
                  💡 رفيقك سند يعاهدك الله على كتمان سرك ومؤازرة فلاحك خطوة بخطوة.
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
