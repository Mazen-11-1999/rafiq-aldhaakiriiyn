import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, X, Loader2, Bot, User, Sparkles } from 'lucide-react';
import { sendChatMessage, ChatMessage } from '../services/chatService';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setError(null);
    setIsLoading(true);

    const newHistory: ChatMessage[] = [...history, { role: 'user', parts: [{ text: userMessage }] }];
    setHistory(newHistory);

    try {
      const aiResponse = await sendChatMessage(userMessage, history);
      setHistory([...newHistory, { role: 'model', parts: [{ text: aiResponse }] }]);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chat-window"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-0 md:bottom-28 right-0 md:right-6 z-[60] w-full md:w-[450px] h-full md:h-[650px] md:max-h-[80vh] bg-white md:bg-white/95 backdrop-blur-xl md:rounded-t-3xl md:rounded-b-2xl shadow-2xl border-x border-t md:border border-emerald-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-emerald-900 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2 leading-tight">
                    أنا هنا معك لخطوة الإصلاح
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs text-emerald-100/80">متصل الآن - رفيقك الذكي</p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-white/10 rounded-full transition-all active:scale-95"
                aria-label="إغلاق"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-emerald-50/20 scroll-smooth pb-20"
            >
              {history.length === 0 && (
                <div className="text-center py-8 md:py-12 px-4 space-y-6">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <Bot className="w-12 h-12" />
                    </div>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-xl font-black text-emerald-900">مرحباً بك في جلسة المكاشفة</h4>
                    <p className="text-sm md:text-base text-emerald-700 leading-relaxed font-medium">
                      أنا رفيقك في رحلة الإصلاح، هنا لنناقش بصدق ما استقر في قلبك من دروس، وما تنوي تغييره في "نفسك" اليوم.
                    </p>
                  </div>

                  {/* Quick Chips */}
                  <div className="grid grid-cols-1 gap-2 pt-4">
                    {[
                      "ماذا تعلمت من قصة سيدنا يوسف عن العفو؟",
                      "كيف أبدأ برنامج 'عود نفسك'؟",
                      "أريد تقييم صبري ومجاهدتي لنفسي",
                      "ما هي خبيئة السر وكيف أحافظ عليها؟"
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          setMessage(chip);
                          // We use a timeout to let the state update before sending
                          setTimeout(handleSend, 0);
                        }}
                        className="text-right p-3 bg-white border border-emerald-100 rounded-xl text-xs md:text-sm text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm active:scale-[0.98]"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {history.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'} gap-3`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    msg.role === 'user' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed relative ${
                    msg.role === 'user' 
                      ? 'bg-emerald-700 text-white rounded-tr-none shadow-md' 
                      : 'bg-white text-emerald-950 shadow-sm border border-emerald-100 rounded-tl-none font-medium'
                  }`}>
                    {msg.parts[0].text}
                    {msg.role === 'model' && (
                      <div className="absolute top-0 right-[-6px] w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent md:hidden" />
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-emerald-100 shadow-sm">
                    <div className="flex gap-1.5">
                      <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
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
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">X</div>
                  {error}
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-5 bg-white border-t border-emerald-100 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
              <div className="relative flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="حدثني عما تعلمته اليوم..."
                  className="w-full pl-14 pr-5 py-4 bg-emerald-50/50 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all border border-emerald-100 focus:bg-white shadow-inner"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={isLoading || !message.trim()}
                  className="absolute left-2 w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-all disabled:bg-emerald-200 disabled:shadow-none shadow-lg shadow-emerald-700/20"
                >
                  <Send className="w-5 h-5 mr-0.5" />
                </motion.button>
              </div>
              <p className="text-[11px] text-center mt-4 text-emerald-500 font-medium tracking-wide">
                رحلة التغيير تبدأ بكلمة صادقة.. أنا هنا لأسمعك
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
