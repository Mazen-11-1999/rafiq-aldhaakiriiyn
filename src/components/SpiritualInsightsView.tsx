import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, HelpCircle, Heart, ShieldQuestion, ChevronLeft, ChevronRight, MessageCircleCode } from 'lucide-react';
import { spiritualInsights } from '../data/spiritualInsights';

export const SpiritualInsightsView: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeInsight = spiritualInsights[activeIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <BookOpen className="text-emerald-600" />
          بصيرة الحق
        </h2>
        <p className="text-slate-600 mt-2 max-w-lg mx-auto">
          جرعات من الوعي لتصحيح النية، وتمييز الحق من الباطل، وتحويل الدين من "طقوس" إلى "واقع معيش".
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3 order-2 lg:order-1">
          {spiritualInsights.map((insight, index) => (
            <button
              key={insight.id}
              onClick={() => setActiveIndex(index)}
              className={`w-full text-right p-4 rounded-xl transition-all border flex flex-col gap-1 ${
                activeIndex === index 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105' 
                : 'bg-white text-slate-700 border-slate-100 hover:border-emerald-200'
              }`}
            >
              <span className="text-xs opacity-70 mb-1">
                {insight.category === 'sincerity' ? 'إخلاص النية' : insight.category === 'integrity' ? 'صدق واستقامة' : 'بصيرة القلب'}
              </span>
              <span className="font-bold line-clamp-1">{insight.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <motion.div
            key={activeInsight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[400px] flex flex-col"
          >
            <div className="flex items-center gap-2 text-emerald-600 mb-4">
               <Heart className="fill-emerald-600" size={20} />
               <span className="text-sm font-bold uppercase tracking-wider">جرعة وعي</span>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-6 leading-tight">
              {activeInsight.title}
            </h3>

            <div className="text-slate-700 leading-relaxed text-lg mb-10 whitespace-pre-wrap">
              {activeInsight.content}
            </div>

            <div className="mt-auto bg-slate-50 rounded-2xl p-6 border border-slate-100 italic relative">
              <div className="absolute -top-4 right-6 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <HelpCircle size={14} />
                سؤال المحاسبة
              </div>
              <p className="text-slate-800 font-medium pt-2">
                "{activeInsight.reflectionQuestion}"
              </p>
            </div>
          </motion.div>

          <div className="flex justify-between mt-6">
            <button 
              disabled={activeIndex === 0}
              onClick={() => setActiveIndex(prev => prev - 1)}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={20} />
              السابق
            </button>
            <button 
              disabled={activeIndex === spiritualInsights.length - 1}
              onClick={() => setActiveIndex(prev => prev + 1)}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 disabled:opacity-30 transition-colors font-medium"
            >
              التالي
              <ChevronLeft size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShieldQuestion className="text-emerald-400" />
            لماذا نركز على هذا؟
          </h4>
          <p className="text-slate-300 leading-relaxed mb-6">
            أكبر مشكلة تواجه التدين اليوم هي فصل "العبادة" عن "الأخلاق". أن نصلي بجوارحنا ولكن قلوبنا معلقة بمدح الناس أو مكاسب الدنيا الزائلة. نحن هنا لا لنسمع قصصاً، بل لنعيد بناء شخصيتنا على منهج "الصدق" مع الله ومع النفس.
          </p>
          <div className="flex flex-wrap gap-4">
             <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm">لا للنفاق العملي</span>
             </div>
             <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-sm">تغيير المنهج لا الشكل فقط</span>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
};
