import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Download, Sparkles, Heart, Quote, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { toPng } from 'html-to-image';

interface Inspiration {
  text: string;
  source: string;
  type: 'آية' | 'حديث' | 'حكمة';
  gradient: string;
}

const inspirations: Inspiration[] = [
  {
    text: "وَاصْبِرْ لِحُكْمِ رَبِّكَ فَإِنَّكَ بِأَعْيُنِنَا",
    source: "سورة الطور - ٤٨",
    type: "آية",
    gradient: "from-[#4e635a] to-[#2d3a35]"
  },
  {
    text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    source: "سورة الشرح - ٦",
    type: "آية",
    gradient: "from-[#8B735B] to-[#5D4D3F]"
  },
  {
    text: "أنا عند ظن عبدي بي",
    source: "حديث قدسي",
    type: "حديث",
    gradient: "from-[#2C3E50] to-[#000000]"
  },
  {
    text: "ما أصابك ما كان ليخطئك، وما أخطأك ما كان ليصيبك",
    source: "وصية نبوية",
    type: "حكمة",
    gradient: "from-[#4A2D2D] to-[#2A1A1A]"
  },
  {
    text: "اصبر تنل، فمن صبر ظفر",
    source: "حكمة عربية",
    type: "حكمة",
    gradient: "from-[#1a3a3a] to-[#0d1d1d]"
  }
];

export default function DailyInspiration({ userProfile }: { userProfile: UserProfile | null }) {
  const [isVisible, setIsVisible] = useState(false);
  const [card, setCard] = useState<Inspiration | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const dateFormat = userProfile?.settings?.appearance.dateFormat ?? 'arabic';
  const today = new Date().toLocaleDateString(dateFormat === 'arabic' ? 'ar-SA-u-ca-islamic-uma' : 'ar-YE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    const hasSeenToday = sessionStorage.getItem('hasSeenInspiration');
    if (!hasSeenToday) {
      const randomCard = inspirations[Math.floor(Math.random() * inspirations.length)];
      setCard(randomCard);
      setIsVisible(true);
      sessionStorage.setItem('hasSeenInspiration', 'true');
    }
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#1b1c1a'
      });
      
      const link = document.createElement('a');
      link.download = `sanad-inspiration-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!card) return;
    try {
      await navigator.share({
        title: 'إلهام يومي من سند',
        text: `${card.text} - ${card.source}`,
        url: window.location.href,
      });
    } catch (err) {
      // Ignore if sharing is cancelled or not supported
    }
  };

  if (!isVisible || !card) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/10 backdrop-blur-2xl"
      >
        <div className="relative w-full max-w-lg">
          <motion.div 
            ref={cardRef}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className={`relative w-full aspect-[3/4] rounded-[50px] overflow-hidden shadow-2xl bg-gradient-to-br ${card.gradient} flex flex-col items-center justify-center p-12 text-center text-white border border-white/20`}
          >
            {/* Background Patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 border-[30px] border-white rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 border-[1px] border-white/50 rounded-full -ml-24 -mb-24" />
            </div>

            <div className="mb-10 p-4 rounded-3xl bg-white/10 backdrop-blur-xl">
              <Sparkles className="text-yellow-400" size={32} />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <p className="text-white/40 text-[10px] font-bold tracking-[0.2em]">{today}</p>
                <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                  {card.type} اليوم
                </span>
                <Quote className="mx-auto opacity-20 rotate-180" size={40} />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight font-serif">
                {card.text}
              </h2>

              <div className="w-12 h-0.5 bg-yellow-400/50 mx-auto" />

              <p className="text-lg opacity-60 font-medium italic">
                {card.source}
              </p>
            </motion.div>

            <div className="absolute bottom-8 flex items-center gap-2 opacity-30 text-[10px] font-bold uppercase tracking-widest">
              <Heart size={12} fill="currentColor" />
              <span>سند - رفيقك الروحي</span>
            </div>
          </motion.div>

          <div className="absolute -bottom-24 left-0 right-0 flex justify-center gap-4">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#1b1c1a] font-bold hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-xl"
            >
              {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
              <span>حفظ كخلفية</span>
            </button>
            <button 
              onClick={handleShare}
              className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-md border border-white/10 text-white"
            >
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="w-14 h-14 rounded-2xl bg-red-400/20 hover:bg-red-400/30 text-red-200 transition-all flex items-center justify-center backdrop-blur-md border border-red-400/10"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
