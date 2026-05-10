import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getSpiritualGuidance } from '../services/geminiService';
import { Leaf, Mic, Plus, CheckCircle, Rocket, Target } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile, ChatMessage } from '../types';

interface RetreatViewProps {
  userProfile: UserProfile | null;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function RetreatView({ userProfile, chatMessages, setChatMessages }: RetreatViewProps) {
  const [mood, setMood] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [question, setQuestion] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, loadingAi]);

  const moods = [
    { label: 'قلق', value: 'anxious' },
    { label: 'سعيد', value: 'happy' },
    { label: 'متعب', value: 'tired' },
    { label: 'متلهف', value: 'excited' },
  ];

  const speakMessage = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => (v.lang.includes('ar') && v.name.toLowerCase().includes('male')) || v.name.includes('Maged') || v.name.includes('Google') || v.lang === 'ar-SA');
    if (arabicVoice) utterance.voice = arabicVoice;
    utterance.rate = 0.85;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const processResponse = (userInput: string, guidance: any) => {
    const newMessage: ChatMessage = { 
        role: 'ai', 
        message: guidance.message, 
        suggestedDhikr: guidance.suggestedDhikr, 
        dhikrExplanation: guidance.dhikrExplanation,
        actionPlan: guidance.actionPlan,
        dailyChallenge: guidance.dailyChallenge
    };
    setChatMessages(prev => [...prev, { role: 'user', message: userInput }, newMessage]);
    if (guidance.message) speakMessage(guidance.message);
  };

  const buildContext = () => {
    return chatMessages.map(m => {
      let content = `${m.role === 'user' ? 'المستخدم' : 'سند'}: ${m.message}`;
      if (m.suggestedDhikr) content += ` | الذكر: ${m.suggestedDhikr}`;
      if (m.dailyChallenge) content += ` | التحدي: ${m.dailyChallenge}`;
      if (m.actionPlan) content += ` | الخطة: ${m.actionPlan.join(', ')}`;
      return content;
    }).slice(-10).join("\n");
  };

  const handleMoodSelect = async (moodLabel: string) => {
    setMood(moodLabel);
    setLoadingAi(true);
    const context = buildContext();
    const guidance = await getSpiritualGuidance(`أشعر بـ ${moodLabel}`, context, userProfile?.displayName || "رفيقي");
    processResponse(`أشعر بـ ${moodLabel}`, guidance);
    setLoadingAi(false);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const currentQuestion = question;
    setQuestion('');
    setLoadingAi(true);
    const context = buildContext();
    const guidance = await getSpiritualGuidance(currentQuestion, context, userProfile?.displayName || "رفيقي");
    processResponse(currentQuestion, guidance);
    setLoadingAi(false);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("متصفحك لا يدعم التعرف على الصوت. يرجى استخدام متصفح حديث.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLoadingAi(true);
        const context = buildContext();
        const guidance = await getSpiritualGuidance(transcript, context, userProfile?.displayName || "رفيقي");
        processResponse(transcript, guidance);
        setLoadingAi(false);
      };

    recognition.start();
  };

  return (
    <div className="relative min-h-full flex flex-col items-center justify-center p-6 space-y-12 overflow-hidden perspective-1000">
      {/* 3D Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 preserve-3d">
        <motion.div 
          animate={{ 
            rotateX: [0, 10, 0],
            rotateY: [0, 10, 0],
            rotateZ: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#d1e8dd]/60 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            rotateX: [0, -10, 0],
            rotateY: [0, -10, 0],
            rotateZ: [360, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[#f4dfcb]/50 rounded-full blur-[100px]"
        />
      </div>

      {/* Greeting */}
      <div className="z-10 text-center space-y-2">
        <p className="text-[#4e635a]/70 font-bold tracking-[0.3em] uppercase text-xs">الآن هو وقت الهدوء</p>
        <h2 className="text-4xl font-bold text-[#1b1c1a] font-serif">معك وين ما كنت</h2>
      </div>

      {/* AI Assistant Sanad Conversation Area */}
      <div 
        ref={scrollRef}
        className="z-10 w-full max-w-lg flex-1 overflow-y-auto px-4 scrollbar-hide py-4 space-y-6"
      >
        <AnimatePresence mode="popLayout">
          {chatMessages.length === 0 && !loadingAi && (
            <motion.div 
               key="intro"
               initial={{ opacity: 0, translateZ: -100, rotateX: 20 }}
               animate={{ opacity: 1, translateZ: 0, rotateX: 0 }}
               className="text-center py-10 glass-3d rounded-[48px] p-8 depth-card preserve-3d"
            >
               <div className="w-24 h-24 bg-[#4e635a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_20px_40px_rgba(78,99,90,0.3)] transform translateZ(30px)">
                 <Leaf className="text-white" size={40} />
               </div>
               <h3 className="text-3xl font-serif font-bold text-[#4e635a] transform translateZ(20px)">أهلاً بك يا {userProfile?.displayName ? userProfile.displayName.split(' ')[0] : 'رفيق'}</h3>
               <p className="text-[#655d51] mt-4 leading-relaxed font-medium transform translateZ(10px)">أنا "سند"، رفيقك في لحظات الصدق والسكون. تكلم معي عما تشعر به، أو اسألني عما يدور في خاطرك، وسأكون لك مسانداً بإذن الله.</p>
               
               <div className="grid grid-cols-2 gap-4 mt-8 transform translateZ(5px)">
                  {moods.map((m) => (
                    <motion.button
                      key={m.value}
                      whileHover={{ scale: 1.05, translateZ: 10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoodSelect(m.label)}
                      className="px-6 py-4 rounded-3xl bg-white/90 border border-white text-[#4e635a] font-bold shadow-xl border-b-4 border-b-[#4e635a]/10"
                    >
                      {m.label}
                    </motion.button>
                  ))}
                </div>
            </motion.div>
          )}

          {chatMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, rotateY: msg.role === 'user' ? -15 : 15, translateZ: -50 }}
              animate={{ opacity: 1, x: 0, rotateY: 0, translateZ: 0 }}
              className={cn(
                "flex flex-col group preserve-3d",
                msg.role === 'user' ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] p-6 rounded-[32px] shadow-2xl depth-card",
                msg.role === 'user' 
                  ? "bg-[#4e635a] text-white rounded-tr-none shadow-[#4e635a]/20" 
                  : "glass-3d rounded-tl-none ring-1 ring-white"
              )}>
                <p className="text-lg font-serif leading-relaxed transform translateZ(10px)">{msg.message}</p>
                {msg.suggestedDhikr && (
                   <div className="mt-4 pt-4 border-t border-white/10 space-y-3 transform translateZ(20px)">
                      <div className="flex items-center gap-2 text-inherit opacity-70">
                        <div className="w-1 h-3 bg-current rounded-full" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">مواساة بالذكر</span>
                      </div>
                      <p className="font-bold text-2xl font-serif text-yellow-400 drop-shadow-md">{msg.suggestedDhikr}</p>
                      <p className="text-xs opacity-80 italic font-medium leading-relaxed">{msg.dhikrExplanation}</p>
                   </div>
                )}

                {msg.actionPlan && msg.actionPlan.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3 transform translateZ(15px)">
                    <div className="flex items-center gap-2 text-[#4e635a] font-bold text-xs uppercase tracking-wider">
                      <Target size={14} />
                      <span>خطة التغيير</span>
                    </div>
                    <ul className="space-y-2">
                      {msg.actionPlan.map((step, idx) => (
                        <li key={idx} className="flex gap-2 text-sm leading-relaxed text-[#5a4d3a]">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-[#4e635a] text-white flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {msg.dailyChallenge && (
                  <div className="mt-4 p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 space-y-2 transform translateZ(25px)">
                    <div className="flex items-center gap-2 text-yellow-700 font-bold text-xs uppercase tracking-wider">
                      <Rocket size={14} />
                      <span>تحدي اليوم</span>
                    </div>
                    <p className="text-sm font-bold text-yellow-900">{msg.dailyChallenge}</p>
                  </div>
                )}
              </div>
              <span className="text-[10px] mt-2 font-bold text-[#4e635a]/20 uppercase tracking-widest px-2">
                {msg.role === 'user' ? "حديثك" : "سند"}
              </span>
            </motion.div>
          ))}

          {loadingAi && (
            <motion.div 
               key="loading"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex items-start gap-4"
            >
               <div className="bg-white/60 p-5 rounded-[24px] rounded-tl-none border border-white shadow-sm">
                  <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2.5 h-2.5 bg-[#4e635a] rounded-full" 
                      />
                    ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="z-10 w-full max-w-lg mb-6 px-4">
        <form onSubmit={handleQuestionSubmit} className="relative group ring-offset-background">
          <input 
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="بماذا تريد ان تصلح نفسك..."
            className="w-full px-8 py-5 rounded-[40px] bg-white/70 backdrop-blur-xl border border-white focus:outline-none focus:ring-2 focus:ring-[#4e635a]/20 shadow-2xl text-[#1b1c1a] placeholder:text-[#4e635a]/20 font-medium transition-all text-lg"
          />
          <button 
            type="submit"
            disabled={!question.trim() || loadingAi}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#4e635a] text-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-all disabled:opacity-20"
          >
            <Plus className={cn("rotate-45 transition-transform", loadingAi && "animate-spin")} size={28} />
          </button>
        </form>
      </div>
      {/* Real-time Voice Interaction */}
      <div className="z-10 flex flex-col items-center gap-4">
         <div className="relative">
           <AnimatePresence>
             {isListening && (
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 1.5, repeat: Infinity }}
                 className="absolute inset-0 bg-[#8da399] rounded-full blur-xl"
               />
             )}
           </AnimatePresence>
           <motion.button
             whileHover={{ scale: 1.1 }}
             whileTap={{ scale: 0.9 }}
             onClick={toggleListening}
             className={cn(
               "relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group",
               isListening 
                 ? "bg-[#ba1a1a] shadow-[#ba1a1a]/40" 
                 : "bg-[#6b5c4c] shadow-[#6b5c4c]/40"
             )}
           >
             <Mic size={40} className={cn(
               "transition-transform",
               isListening ? "scale-110 animate-pulse" : "group-hover:scale-110"
             )} />
           </motion.button>
         </div>
         <span className="text-xs font-bold text-[#4e635a] uppercase tracking-[0.3em] font-serif">
           {isListening ? "جاري الاستماع إليك..." : "سندك هنا ، تحدث معي"}
         </span>
      </div>
    </div>
  );
}
