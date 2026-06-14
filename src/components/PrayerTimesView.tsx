import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, MapPin, Sparkles, Navigation, Bell, BellOff, Volume2, Moon, Sun, Info } from 'lucide-react';
import { PrayerService, PrayerTimeData } from '../services/prayerService';
import { LocationService, LocationCoords } from '../services/locationService';
import { cn } from '../lib/utils';

export default function PrayerTimesView({ coords: initialCoords, calculationMethod }: { coords: LocationCoords | null, calculationMethod?: string }) {
  const [coords, setCoords] = useState<LocationCoords | null>(initialCoords);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string, time: Date, key: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  useEffect(() => {
    if (coords) {
      const times = PrayerService.getPrayerTimes(coords.lat, coords.lng, calculationMethod);
      setPrayerTimes(times);
    }
  }, [coords, calculationMethod]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer();
    }
  }, [prayerTimes, currentTime]);

  const calculateNextPrayer = () => {
    if (!prayerTimes) return;
    const now = currentTime;
    const entries = [
      { key: 'fajr', time: prayerTimes.fajr, name: 'الفجر' },
      { key: 'dhuhr', time: prayerTimes.dhuhr, name: 'الظهر' },
      { key: 'asr', time: prayerTimes.asr, name: 'العصر' },
      { key: 'maghrib', time: prayerTimes.maghrib, name: 'المغرب' },
      { key: 'isha', time: prayerTimes.isha, name: 'العشاء' },
    ];

    let next = entries.find(e => e.time > now);
    if (!next) {
      // If all passed today, next is tomorrow's Fajr
      // For simplicity, we just show tomorrow's Fajr would be first
      next = entries[0];
    }
    setNextPrayer(next);
  };

  const updateLocation = async () => {
    setIsUpdatingLocation(true);
    try {
      const newCoords = await LocationService.getCurrentLocation();
      setCoords(newCoords);
      // Also notify App to update Firestore
      window.dispatchEvent(new CustomEvent('request-location-update'));
    } catch (err) {
      console.error("Failed to update location:", err);
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  const formatTimeSnippet = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const getRemainingTime = (target: Date) => {
    const diff = target.getTime() - currentTime.getTime();
    if (diff < 0) return "حان الوقت";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!coords || !prayerTimes) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 space-y-6 text-center">
        <div className="w-24 h-24 bg-[#4e635a]/10 rounded-full flex items-center justify-center text-[#4e635a] animate-pulse">
          <MapPin size={48} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black font-serif text-[#4e635a]">تحديد موقعك</h3>
          <p className="text-[#8da399] font-medium max-w-xs">نحتاج لتحديد موقعك الجغرافي لنقدم لك مواقيت صلاة دقيقة جداً حسب مدينتك.</p>
        </div>
        <button 
          onClick={updateLocation}
          disabled={isUpdatingLocation}
          className="bg-[#4e635a] text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-[#3d4d46] transition-all flex items-center gap-2"
        >
          {isUpdatingLocation ? <RefreshCcw className="animate-spin" /> : <Navigation size={20} />}
          {isUpdatingLocation ? 'جاري التحديد...' : 'تحديد الموقع الآن'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32 space-y-10" dir="rtl">
      {/* City Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#4e635a] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#4e635a]/20">
            <MapPin size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black font-serif text-[#1b1c1a]">مواقيت الصلاة</h2>
            <p className="text-[#8da399] font-bold text-xs uppercase tracking-widest">الموقع: {coords.lat.toFixed(2)}, {coords.lng.toFixed(2)}</p>
          </div>
        </div>
        <button 
          onClick={updateLocation}
          disabled={isUpdatingLocation}
          className="p-3 bg-white border border-[#4e635a]/10 rounded-2xl text-[#4e635a] hover:bg-[#4e635a]/5 transition-all"
          title="تحديث الموقع"
        >
          <Navigation size={20} className={cn(isUpdatingLocation && "animate-spin")} />
        </button>
      </div>

      {/* Next Prayer Countdown Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#4e635a] rounded-[3rem] p-8 md:p-12 text-white shadow-[0_32px_64px_-16px_rgba(78,99,90,0.4)] overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-x-1/4 translate-y-1/4" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-right space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase">
              <Sparkles size={14} className="text-yellow-300" />
              الصلاة القادمة
            </span>
            <h3 className="text-5xl md:text-7xl font-black font-serif">{nextPrayer?.name}</h3>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Clock size={24} className="opacity-60" />
              <p className="text-3xl font-mono tracking-tighter opacity-90">{nextPrayer ? formatTimeSnippet(nextPrayer.time) : '--:--'}</p>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-bold opacity-60 uppercase tracking-[0.2em]">متبقي على النداء</p>
            <div className="text-5xl md:text-6xl font-black font-mono tracking-tighter tabular-nums drop-shadow-xl">
              {nextPrayer ? getRemainingTime(nextPrayer.time) : '00:00:00'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { key: 'fajr', name: 'الفجر', icon: <Moon size={20} /> },
          { key: 'dhuhr', name: 'الظهر', icon: <Sun size={20} /> },
          { key: 'asr', name: 'العصر', icon: <Sun size={20} className="scale-75" /> },
          { key: 'maghrib', name: 'المغرب', icon: <Moon size={20} className="opacity-50" /> },
          { key: 'isha', name: 'العشاء', icon: <Moon size={20} className="opacity-80" /> },
        ].map((p) => {
          const isActive = nextPrayer?.key === p.key;
          const time = (prayerTimes as any)[p.key];
          return (
            <motion.div 
              key={p.key}
              whileHover={{ y: -5 }}
              className={cn(
                "p-6 rounded-[2.5rem] border transition-all text-center space-y-4",
                isActive 
                  ? "bg-white border-[#4e635a] shadow-xl ring-4 ring-[#4e635a]/5" 
                  : "bg-white/40 border-white/60 hover:bg-white"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto",
                isActive ? "bg-[#4e635a] text-white" : "bg-[#4e635a]/10 text-[#4e635a]"
              )}>
                {p.icon}
              </div>
              <div className="space-y-1">
                <p className={cn("text-xs font-bold uppercase tracking-widest", isActive ? "text-[#4e635a]" : "text-[#8da399]")}>{p.name}</p>
                <p className={cn("text-xl font-black font-mono tracking-tighter", isActive ? "text-[#1b1c1a]" : "text-[#4e635a]/60")}>
                  {time ? formatTimeSnippet(time).replace('ص', '').replace('م', '') : '--:--'}
                </p>
                <p className="text-[10px] font-bold opacity-40">{formatTimeSnippet(time).includes('ص') ? 'صباحاً' : 'مساءً'}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="bg-[#fbf9f6] p-8 rounded-[3rem] border border-[#4e635a]/5 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#4e635a] shadow-sm shrink-0">
          <Info size={32} />
        </div>
        <p className="text-[#655d51] text-sm leading-relaxed font-bold text-center md:text-right">
          هذه المواقيت هي نبض يومك ومواعيد لقائك مع الخالق.. اجعل من كل نداء فرصة لسكينة قلبك، واستعادة هدوء روحك وسط ضجيج الحياة.
        </p>
      </div>
    </div>
  );
}

const RefreshCcw = ({ className }: { className?: string }) => (
  <svg 
    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} referrerPolicy="no-referrer"
  >
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);
