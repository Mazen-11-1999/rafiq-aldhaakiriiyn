import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Search, Heart, Sparkles, Disc, Lightbulb, AlertCircle, WifiOff, CloudCheck } from 'lucide-react';
import { NASHEEDS } from '../constants';
import { cn } from '../lib/utils';
import InsightPanel from './InsightPanel';

export default function NasheedView() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [isInsightOpen, setIsInsightOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeUrlIndex, setActiveUrlIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [failedTrackIds, setFailedTrackIds] = useState<Set<string>>(new Set());
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [offlineReadyIds, setOfflineReadyIds] = useState<Set<string>>(new Set());
  
  // Check which tracks are already cached
  const checkCachedTracks = async () => {
    try {
      const cacheNames = await caches.keys();
      const audioCacheNames = cacheNames.filter(name => 
        name.includes('nasheed-audio-archive') || name.includes('nasheed-audio-albumaty')
      );
      
      const readyIds = new Set<string>();
      
      for (const cacheName of audioCacheNames) {
        const cache = await caches.open(cacheName);
        for (const track of NASHEEDS) {
          const response = await cache.match(track.url);
          if (response) {
            readyIds.add(track.id);
          }
        }
      }
      setOfflineReadyIds(readyIds);
    } catch (err) {
      console.warn("Cache check failed:", err);
    }
  };

  useEffect(() => {
    checkCachedTracks();
  }, []);
  
  // Update online status

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  const downloadAll = async () => {
    if (isBatchDownloading) return;
    setIsBatchDownloading(true);
    setBatchProgress(0);
    
    let successCount = 0;
    const total = NASHEEDS.length;

    for (let i = 0; i < total; i++) {
      const track = NASHEEDS[i];
      if (!offlineReadyIds.has(track.id)) {
        try {
          await fetch(track.url, { mode: 'no-cors', cache: 'force-cache' });
        } catch (e) {
          console.warn(`Failed to download ${track.title}`, e);
        }
      }
      successCount++;
      setBatchProgress(Math.round((successCount / total) * 100));
    }
    
    await checkCachedTracks();
    setIsBatchDownloading(false);
    setBatchProgress(0);
  };

  const currentTrack = NASHEEDS[currentTrackIndex];

  const saveForOffline = async (track: typeof currentTrack) => {
    if (downloadingIds.has(track.id) || offlineReadyIds.has(track.id)) return;
    
    setDownloadingIds(prev => new Set(prev).add(track.id));
    try {
      // Fetching initiates the Service Worker caching (CacheFirst)
      await fetch(track.url, { mode: 'no-cors', cache: 'force-cache' });
      
      // Update the ready status
      setTimeout(async () => {
        await checkCachedTracks();
        setDownloadingIds(prev => {
          const next = new Set(prev);
          next.delete(track.id);
          return next;
        });
      }, 1000);
    } catch (err) {
      console.warn("Save for offline feedback:", err);
      setDownloadingIds(prev => {
        const next = new Set(prev);
        next.delete(track.id);
        return next;
      });
    }
  };

  // Handle track changes
  useEffect(() => {
    setActiveUrlIndex(0);
    if (audioRef.current) {
      audioRef.current.load();
      setLoadError(null);
      setRetryCount(0);
      if (isPlaying) {
        audioRef.current.play().catch(err => console.warn("Auto-play failed:", err));
      }
    }
  }, [currentTrackIndex]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes without reloading
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (loadError) {
      // Clear error and try again
      setLoadError(null);
      if (audioRef.current) {
        audioRef.current.load();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setLoadError(null);
    setRetryCount(0);
    // Find next non-failed track
    let nextIndex = (currentTrackIndex + 1) % NASHEEDS.length;
    let attempts = 0;
    while (failedTrackIds.has(NASHEEDS[nextIndex].id) && attempts < NASHEEDS.length) {
      nextIndex = (nextIndex + 1) % NASHEEDS.length;
      attempts++;
    }
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setLoadError(null);
    setRetryCount(0);
    // Find previous non-failed track
    let prevIndex = (currentTrackIndex - 1 + NASHEEDS.length) % NASHEEDS.length;
    let attempts = 0;
    while (failedTrackIds.has(NASHEEDS[prevIndex].id) && attempts < NASHEEDS.length) {
      prevIndex = (prevIndex - 1 + NASHEEDS.length) % NASHEEDS.length;
      attempts++;
    }
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setProgress(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredNasheeds = NASHEEDS.filter(n => 
    n.title.includes(searchQuery) || n.artist.includes(searchQuery)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-32 relative">
      {/* Tab Specific Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: 'url("https://images.pexels.com/photos/36704278/pexels-photo-36704278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#fbf9f6]/90 via-transparent to-[#fbf9f6]/90" />
      </div>

      {/* Studio Frame with Glow Effect */}
      <div className="relative group/studio">
        {/* Animated Glow Border */}
        <div className={cn(
          "absolute -inset-1 blur-2xl opacity-40 transition-all duration-1000",
          isPlaying ? "opacity-70 scale-[1.03]" : "opacity-30 scale-100"
        )}>
          <div className="absolute inset-0 bg-linear-to-r from-[#4e635a] via-[#8da399] via-[#6d8a7d] via-[#4e635a] via-[#94b1a4] to-[#4e635a] animate-border-flow rounded-[4rem]" />
        </div>
        
        {/* The Frame Itself - Colored Border */}
        <div className="absolute -inset-[2px] rounded-[3.7rem] bg-linear-to-r from-[#4e635a] via-[#8da399] via-emerald-400 via-[#4e635a] via-teal-400 to-[#4e635a] animate-border-flow z-0 opacity-80" />
        
        <div className="relative z-10 bg-white/70 backdrop-blur-3xl rounded-[3.5rem] p-6 md:p-10 border border-white/80 shadow-[0_32px_64px_-16px_rgba(78,99,90,0.2)] overflow-hidden">
          {/* Subtle flowing light inside the frame */}
          <div className="absolute inset-0 -z-10 bg-linear-to-tr from-[#4e635a]/5 via-transparent to-[#4e635a]/5 opacity-50" />
          
          <div className="flex flex-col lg:flex-row gap-12 relative z-20">
            {/* Left Side: Player Container */}
            <div className="w-full lg:w-2/5 space-y-6">
          <div className="relative group perspective-1000">
            <motion.div 
              animate={isPlaying ? { 
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  "0 25px 50px -12px rgba(78, 99, 90, 0.3)",
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                ]
              } : { scale: 1 }}
              whileTap={{ scale: 0.98 }}
              transition={isPlaying ? { 
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              } : { duration: 0.3 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white preserve-3d cursor-pointer z-10"
            >
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end p-8">
                <div className="text-white w-full">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    key={currentTrack.id}
                  >
                    <p className="text-xs font-bold tracking-widest opacity-80 mb-2 flex items-center gap-2 uppercase">
                      <Sparkles size={14} className="text-yellow-400" />
                      الآن تستمع إلى
                    </p>
                    <h2 className="text-3xl font-black font-serif leading-tight drop-shadow-lg">{currentTrack.title}</h2>
                    <p className="text-lg opacity-90 font-medium">{currentTrack.artist}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
            
            {/* Ambient Record Visual */}
            <motion.div 
               animate={isPlaying ? { rotate: [0, 360] } : { rotate: 0 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute top-1/2 -translate-y-1/2 -right-6 w-[95%] h-[95%] bg-[#1b1c1a] rounded-full -z-20 shadow-2xl flex items-center justify-center p-8 border-12 border-white/5 opacity-40 lg:opacity-100"
            >
               <div className="w-full h-full rounded-full border-2 border-white/10 flex items-center justify-center relative">
                  <div className="absolute inset-2 border border-white/5 rounded-full" />
                  <div className="absolute inset-4 border border-white/5 rounded-full" />
                  <div className="absolute inset-6 border border-white/5 rounded-full" />
                  <Disc size={40} className="text-white/20" />
               </div>
            </motion.div>
          </div>

          <div className="glass-3d p-8 rounded-[2.5rem] space-y-6">
            <audio 
              ref={audioRef}
              src={(currentTrack.urls ? [currentTrack.url, ...currentTrack.urls] : [currentTrack.url])[activeUrlIndex]}
              preload="auto"
              onTimeUpdate={onTimeUpdate}
              onEnded={handleNext}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => {
                setIsBuffering(false);
                setConsecutiveFailures(0);
                const trackId = currentTrack.id;
                setFailedTrackIds(prev => {
                  const next = new Set(prev);
                  next.delete(trackId);
                  return next;
                });
              }}
              onCanPlay={() => {
                setIsBuffering(false);
                setConsecutiveFailures(0);
              }}
              onLoadedMetadata={() => {
                setDuration(audioRef.current?.duration || 0);
                setIsBuffering(false);
                setConsecutiveFailures(0);
                setLoadError(null);
              }}
              onError={(e) => {
                const availableUrls = currentTrack.urls ? [currentTrack.url, ...currentTrack.urls] : [currentTrack.url];
                
                if (activeUrlIndex < availableUrls.length - 1) {
                  // Try next fallback URL
                  console.warn(`URL failed for ${currentTrack.title}, trying mirror ${activeUrlIndex + 1}`);
                  setActiveUrlIndex(prev => prev + 1);
                  setRetryCount(prev => prev + 1);
                  return;
                }

                console.error("All Audio URLs failed for:", currentTrack.title, availableUrls);
                
                const trackId = currentTrack.id;
                setFailedTrackIds(prev => new Set(prev).add(trackId));
                setConsecutiveFailures(prev => prev + 1);

                // Only show error if we've exhausted all options
                setLoadError(`معذرةً، لم نتمكن من تحميل "${currentTrack.title}" من جميع المصادر المتاحة حالياً.`);
                
                if (consecutiveFailures < 3) {
                  setTimeout(handleNext, 3000);
                } else {
                  setIsPlaying(false);
                }
              }}
            />

            {loadError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
                dir="rtl"
              >
                <AlertCircle size={18} />
                <p className="flex-1">{loadError}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setLoadError(null);
                      audioRef.current?.load();
                      setIsPlaying(true);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    إعادة محاولة
                  </button>
                  <button 
                    onClick={handleNext}
                    className="bg-white/20 text-red-700 px-3 py-1 rounded-lg text-xs border border-red-200"
                  >
                    تخطي
                  </button>
                </div>
              </motion.div>
            )}

            {/* Slider */}
            <div className="space-y-3">
              <input 
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleProgressChange}
                className="w-full accent-[#4e635a] h-1.5 rounded-full cursor-pointer bg-[#4e635a]/10"
              />
              <div className="flex justify-between text-xs font-bold text-[#4e635a]/60 font-mono tracking-tighter">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => saveForOffline(currentTrack)}
                className={cn(
                  "p-3 rounded-2xl transition-all group relative overflow-hidden",
                  offlineReadyIds.has(currentTrack.id)
                    ? "bg-emerald-500/10 text-emerald-600"
                    : downloadingIds.has(currentTrack.id) 
                      ? "bg-amber-500/20 text-amber-600" 
                      : "text-[#4e635a] bg-[#4e635a]/5 hover:bg-[#4e635a]/10"
                )}
                title={offlineReadyIds.has(currentTrack.id) ? "محفوظ أوفلاين" : "حفظ للاستماع بدون انترنت"}
              >
                {downloadingIds.has(currentTrack.id) ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Disc size={24} />
                  </motion.div>
                ) : offlineReadyIds.has(currentTrack.id) ? (
                  <CloudCheck size={24} className="text-emerald-600" />
                ) : (
                  <CloudCheck size={24} className="group-hover:scale-110 transition-transform opacity-40" />
                )}
                {downloadingIds.has(currentTrack.id) && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    className="absolute bottom-0 left-0 w-1 bg-amber-500 transition-all"
                  />
                )}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsInsightOpen(true)}
                className="p-3 text-[#4e635a] bg-[#4e635a]/5 hover:bg-[#4e635a]/10 rounded-2xl transition-all group"
                title="نـصيحة مـحب"
              >
                <Heart size={24} className="group-hover:text-red-500 transition-colors" />
              </motion.button>

              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="p-3 text-[#4e635a] hover:bg-[#4e635a]/10 rounded-full transition-all"
              >
                <SkipBack size={32} fill="currentColor" />
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="w-20 h-20 bg-[#4e635a] text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-[#4e635a]/40 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isBuffering ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Disc size={36} fill="white" className="opacity-50" />
                  </motion.div>
                ) : (
                  isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />
                )}
              </motion.button>

              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="p-3 text-[#4e635a] hover:bg-[#4e635a]/10 rounded-full transition-all"
              >
                <SkipForward size={32} fill="currentColor" />
              </motion.button>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#4e635a]/5">
              <Volume2 size={18} className="text-[#4e635a]/60" />
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (audioRef.current) audioRef.current.volume = Number(e.target.value);
                }}
                className="flex-grow accent-[#4e635a] h-1 rounded-full bg-[#4e635a]/10"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Playlist / Grid */}
        <div className="w-full lg:w-3/5 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black font-serif text-[#1b1c1a] flex items-center gap-3">
            مكتبة الأناشيد
            {!isOnline && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 text-xs font-bold rounded-full border border-amber-500/20"
              >
                <WifiOff size={12} />
                وضع الأوفلاين
              </motion.span>
            )}
            {isOnline && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadAll}
                disabled={isBatchDownloading}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border transition-all",
                  isBatchDownloading 
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20" 
                    : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                )}
              >
                {isBatchDownloading ? (
                  <>
                    <Disc size={12} className="animate-spin" />
                    جاري التحميل {batchProgress}%
                  </>
                ) : (
                  <>
                    <CloudCheck size={12} />
                    تحميل الكل للأوفلاين
                  </>
                )}
              </motion.button>
            )}
          </h3>
          <p className="text-[#4e635a]/60 text-sm font-medium mt-1">لحن يـخاطب القلوب وينير البصيرة</p>
        </div>
            
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-[#4e635a]/10 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "px-4 py-2 rounded-xl transition-all text-sm font-bold flex items-center gap-2",
                  viewMode === 'grid' ? "bg-[#4e635a] text-white shadow-lg" : "text-[#4e635a] hover:bg-[#4e635a]/5"
                )}
              >
                <Sparkles size={16} />
                وضع الشبكة
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-4 py-2 rounded-xl transition-all text-sm font-bold flex items-center gap-2",
                  viewMode === 'list' ? "bg-[#4e635a] text-white shadow-lg" : "text-[#4e635a] hover:bg-[#4e635a]/5"
                )}
              >
                <Music size={16} />
                وضع القائمة
              </button>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4e635a]/40 group-focus-within:text-[#4e635a] transition-colors" size={20} />
            <input 
              type="text"
              placeholder="ابحث عن الانشودة"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-transparent rounded-[1.5rem] py-5 pr-14 pl-6 text-base font-bold focus:border-[#4e635a]/20 focus:ring-8 focus:ring-[#4e635a]/5 outline-none shadow-xl shadow-[#4e635a]/5 transition-all text-right"
            />
          </div>

          <div className="custom-scrollbar pr-2 max-h-[750px] overflow-y-auto">
            {filteredNasheeds.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-6 pt-2">
                  {filteredNasheeds.map((nasheed) => (
                    <motion.button
                      key={nasheed.id}
                      layoutId={nasheed.id}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setCurrentTrackIndex(NASHEEDS.indexOf(nasheed));
                        setIsPlaying(true);
                      }}
                      className={cn(
                        "group relative flex flex-col items-start gap-3 p-4 rounded-[2.5rem] transition-all border-2",
                        currentTrackIndex === NASHEEDS.indexOf(nasheed)
                          ? "bg-[#4e635a] border-[#4e635a] shadow-2xl z-10"
                          : "bg-white border-transparent shadow-sm hover:shadow-2xl"
                      )}
                    >
                      {failedTrackIds.has(nasheed.id) && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg z-20">
                          <AlertCircle size={14} />
                        </div>
                      )}
                      <div className="relative aspect-square w-full rounded-[1.8rem] overflow-hidden shadow-lg mb-1">
                        <img 
                          src={nasheed.cover} 
                          alt={nasheed.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        
                        {offlineReadyIds.has(nasheed.id) && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg z-20">
                            <CloudCheck size={12} />
                          </div>
                        )}
                        
                        {currentTrackIndex === NASHEEDS.indexOf(nasheed) && isPlaying && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="flex gap-1.5 h-8 items-end">
                              {[1, 2, 3].map(i => (
                                <motion.div 
                                  key={i}
                                  animate={{ height: ['40%', '100%', '60%'] }}
                                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                  className="w-1.5 bg-white rounded-full shadow-sm"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="px-1 w-full text-right overflow-hidden">
                        <p className={cn(
                          "font-black text-sm truncate",
                          currentTrackIndex === NASHEEDS.indexOf(nasheed) ? "text-white" : "text-[#1b1c1a]"
                        )}>
                          {nasheed.title}
                        </p>
                        <p className={cn(
                          "text-xs font-bold opacity-60 truncate mt-0.5",
                          currentTrackIndex === NASHEEDS.indexOf(nasheed) ? "text-white/80" : "text-[#4e635a]"
                        )}>
                          {nasheed.artist}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {filteredNasheeds.map((nasheed) => (
                    <motion.button
                      key={nasheed.id}
                      layoutId={`list-${nasheed.id}`}
                      whileHover={{ x: -4, backgroundColor: currentTrackIndex === NASHEEDS.indexOf(nasheed) ? '' : 'rgba(78, 99, 90, 0.08)' }}
                      onClick={() => {
                        setCurrentTrackIndex(NASHEEDS.indexOf(nasheed));
                        setIsPlaying(true);
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-[1.8rem] transition-all border-2 text-right",
                        currentTrackIndex === NASHEEDS.indexOf(nasheed) 
                          ? "bg-[#4e635a] border-[#4e635a] text-white shadow-xl translate-x-1" 
                          : "bg-white border-transparent text-[#1b1c1a] shadow-sm"
                      )}
                    >
                      <div className="w-16 h-16 rounded-[1.2rem] overflow-hidden shrink-0 shadow-md relative">
                         <img src={nasheed.cover} alt={nasheed.title} className="w-full h-full object-cover" />
                         {failedTrackIds.has(nasheed.id) && (
                           <div className="absolute inset-0 bg-red-500/40 backdrop-blur-[1px] flex items-center justify-center">
                             <AlertCircle size={20} className="text-white" />
                           </div>
                         )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-black text-base">{nasheed.title}</p>
                        <p className={cn("text-sm font-bold opacity-60", currentTrackIndex === NASHEEDS.indexOf(nasheed) ? "text-white/80" : "text-[#4e635a]")}>{nasheed.artist}</p>
                      </div>
                      {currentTrackIndex === NASHEEDS.indexOf(nasheed) && isPlaying && (
                        <div className="flex gap-1 h-5 items-end px-2">
                          {[1, 2, 3, 4].map(i => (
                            <motion.div 
                              key={i}
                              animate={{ height: ['40%', '100%', '60%', '80%', '40%'] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                              className="w-1.5 bg-white rounded-full"
                            />
                          ))}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-20 px-8 bg-white/30 rounded-[3rem] border-2 border-dashed border-[#4e635a]/20">
                <Music size={48} className="mx-auto text-[#4e635a]/20 mb-4" />
                <p className="text-[#4e635a] font-black text-xl mb-2">لم نجد أي نشيد يطابق بحثك</p>
                <p className="text-[#4e635a]/60 font-medium">حاول البحث بكلمات أخرى أو تصفح الكل</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <InsightPanel 
        isOpen={isInsightOpen} 
        onClose={() => setIsInsightOpen(false)} 
        trackTitle={currentTrack.title}
        trackArtist={currentTrack.artist}
      />
    </div>
  </div>
</div>
);
}
