import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Search, Heart, Sparkles, Disc, AlertCircle, WifiOff, CloudCheck, Plus, FolderPlus, Trash2, ListMusic, X, CheckCircle2 } from 'lucide-react';
import { NASHEEDS } from '../constants';
import { cn } from '../lib/utils';
import InsightPanel from './InsightPanel';
import { useMedia } from '../context/MediaContext';

export default function NasheedView() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    progress, 
    duration, 
    seek, 
    volume, 
    setVolume,
    isLoading,
    playTrack,
    favorites,
    toggleFavorite,
    playlists,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist
  } = useMedia();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [isInsightOpen, setIsInsightOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [offlineReadyIds, setOfflineReadyIds] = useState<Set<string>>(new Set());
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  
  // Set default track if none playing
  useEffect(() => {
    if (!currentTrack && NASHEEDS.length > 0) {
      playTrack(NASHEEDS[0]);
    }
  }, []);

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
          if (response) readyIds.add(track.id);
        }
      }
      setOfflineReadyIds(readyIds);
    } catch (err) {
      console.warn("Cache check failed:", err);
    }
  };

  useEffect(() => {
    checkCachedTracks();
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  const saveForOffline = async (track: typeof NASHEEDS[0]) => {
    if (downloadingIds.has(track.id) || offlineReadyIds.has(track.id)) return;
    setDownloadingIds(prev => new Set(prev).add(track.id));
    try {
      await fetch(track.url, { mode: 'no-cors', cache: 'force-cache' });
      setTimeout(async () => {
        await checkCachedTracks();
        setDownloadingIds(prev => {
          const next = new Set(prev);
          next.delete(track.id);
          return next;
        });
      }, 1000);
    } catch (err) {
      console.warn("Save for offline failed:", err);
      setDownloadingIds(prev => {
        const next = new Set(prev);
        next.delete(track.id);
        return next;
      });
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredNasheeds = NASHEEDS.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = showOnlyFavorites ? favorites.includes(n.id) : true;
    const matchesPlaylist = selectedPlaylist ? (playlists[selectedPlaylist]?.includes(n.id)) : true;
    return matchesSearch && matchesFavorite && matchesPlaylist;
  });

  const displayTrack = currentTrack || NASHEEDS[0];

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsPlaylistModalOpen(false);
    }
  };

  const [nasheedMenuId, setNasheedMenuId] = useState<string | null>(null);

  const toggleNasheedMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNasheedMenuId(nasheedMenuId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-32 relative" onClick={() => setNasheedMenuId(null)}>
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{ backgroundImage: 'url("https://images.pexels.com/photos/36704278/pexels-photo-36704278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")' }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#fbf9f6]/90 via-transparent to-[#fbf9f6]/90" />
      </div>

      <div className="relative group/studio">
        <div className={cn(
          "absolute -inset-1 blur-2xl opacity-40 transition-all duration-1000",
          isPlaying ? "opacity-70 scale-[1.03]" : "opacity-30 scale-100"
        )}>
          <div className="absolute inset-0 bg-linear-to-r from-[#4e635a] via-[#8da399] via-[#6d8a7d] via-[#4e635a] via-[#94b1a4] to-[#4e635a] animate-border-flow rounded-[4rem]" />
        </div>
        
        <div className="absolute -inset-[2px] rounded-[3.7rem] bg-linear-to-r from-[#4e635a] via-[#8da399] via-emerald-400 via-[#4e635a] via-teal-400 to-[#4e635a] animate-border-flow z-0 opacity-80" />
        
        <div className="relative z-10 bg-white/70 backdrop-blur-3xl rounded-[3.5rem] p-6 md:p-10 border border-white/80 shadow-[0_32px_64px_-16px_rgba(78,99,90,0.2)] overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-linear-to-tr from-[#4e635a]/5 via-transparent to-[#4e635a]/5 opacity-50" />
          
          <div className="flex flex-col lg:flex-row gap-12 relative z-20">
            <div className="w-full lg:w-2/5 space-y-6">
              <div className="relative group perspective-1000">
                <motion.div 
                  animate={isPlaying ? { 
                    scale: [1, 1.02, 1],
                    boxShadow: ["0 25px 50px -12px rgba(0,0,0,0.25)", "0 25px 50px -12px rgba(78, 99, 90, 0.3)", "0 25px 50px -12px rgba(0,0,0,0.25)"]
                  } : { scale: 1 }}
                  className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white preserve-3d cursor-pointer z-10"
                >
                  <img src={displayTrack.cover} alt={displayTrack.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end p-8 text-white">
                    <div className="w-full">
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} key={displayTrack.id}>
                        <p className="text-xs font-bold tracking-widest opacity-80 mb-2 flex items-center gap-2 uppercase">
                          <Sparkles size={14} className="text-yellow-400" />
                          الآن تستمع إلى
                        </p>
                        <h2 className="text-3xl font-black font-serif leading-tight drop-shadow-lg">{displayTrack.title}</h2>
                        <p className="text-lg opacity-90 font-medium">{displayTrack.artist}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
                <div className="absolute top-1/2 -translate-y-1/2 -right-6 w-[95%] h-[95%] bg-[#1b1c1a] rounded-full -z-20 shadow-2xl flex items-center justify-center p-8 border-12 border-white/5 opacity-40 lg:opacity-100">
                  <motion.div animate={isPlaying ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="w-full h-full rounded-full border-2 border-white/10 flex items-center justify-center relative">
                    <div className="absolute inset-2 border border-white/5 rounded-full" />
                    <div className="absolute inset-4 border border-white/5 rounded-full" />
                    <Disc size={40} className="text-white/20" />
                  </motion.div>
                </div>
              </div>

              <div className="glass-3d p-8 rounded-[2.5rem] space-y-6">
                <div className="space-y-3">
                  <input type="range" min="0" max={duration || 0} value={progress} onChange={(e) => seek(Number(e.target.value))} className="w-full accent-[#4e635a] h-1.5 rounded-full cursor-pointer bg-[#4e635a]/10" />
                  <div className="flex justify-between text-xs font-bold text-[#4e635a]/60 font-mono tracking-tighter">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <motion.button 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => saveForOffline(displayTrack)}
                    className={cn("p-3 rounded-2xl transition-all relative overflow-hidden", offlineReadyIds.has(displayTrack.id) ? "bg-emerald-500/10 text-emerald-600" : "text-[#4e635a] bg-[#4e635a]/5 hover:bg-[#4e635a]/10")}
                  >
                    {downloadingIds.has(displayTrack.id) ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Disc size={24} /></motion.div>
                    ) : offlineReadyIds.has(displayTrack.id) ? (
                      <CloudCheck size={24} />
                    ) : (
                      <CloudCheck size={24} className="opacity-40" />
                    )}
                  </motion.button>

                  <motion.button 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => toggleFavorite(displayTrack.id)} 
                    className={cn("p-3 rounded-2xl transition-all", favorites.includes(displayTrack.id) ? "bg-red-500/10 text-red-500" : "text-[#4e635a] bg-[#4e635a]/5 hover:bg-[#4e635a]/10")}
                  >
                    <Heart size={24} fill={favorites.includes(displayTrack.id) ? "currentColor" : "none"} />
                  </motion.button>

                  <motion.button whileTap={{ scale: 0.9 }} onClick={prevTrack} className="p-3 text-[#4e635a] hover:bg-[#4e635a]/10 rounded-full transition-all">
                    <SkipBack size={32} fill="currentColor" />
                  </motion.button>

                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={togglePlay}
                    className="w-20 h-20 bg-[#4e635a] text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-[#4e635a]/40 group overflow-hidden relative"
                  >
                    {isLoading ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Disc size={36} fill="white" className="opacity-50" /></motion.div>
                    ) : (
                      isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />
                    )}
                  </motion.button>

                  <motion.button whileTap={{ scale: 0.9 }} onClick={nextTrack} className="p-3 text-[#4e635a] hover:bg-[#4e635a]/10 rounded-full transition-all">
                    <SkipForward size={32} fill="currentColor" />
                  </motion.button>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-[#4e635a]/5">
                  <Volume2 size={18} className="text-[#4e635a]/60" />
                  <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="flex-grow accent-[#4e635a] h-1 rounded-full bg-[#4e635a]/10" />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/5 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-black font-serif text-[#1b1c1a] flex items-center gap-3 text-right" dir="rtl">
                    مكتبة الأناشيد
                    {!isOnline && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 text-xs font-bold rounded-full border border-amber-500/20">
                        <WifiOff size={12} /> وضع الأوفلاين
                      </span>
                    )}
                  </h3>
                  <div className="flex gap-2 mt-2" dir="rtl">
                    <button 
                      onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                      className={cn("px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2", showOnlyFavorites ? "bg-red-500 text-white border-red-500" : "bg-white text-[#4e635a] border-[#4e635a]/10 hover:border-[#4e635a]")}
                    >
                      <Heart size={12} fill={showOnlyFavorites ? "white" : "none"} />
                      مفضلاتي ({favorites.length})
                    </button>
                    {isOnline && (
                      <button onClick={downloadAll} disabled={isBatchDownloading} className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-2">
                        {isBatchDownloading ? <><Disc size={12} className="animate-spin" /> {batchProgress}%</> : <><CloudCheck size={12} /> تحميل الكل</>}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-[#4e635a]/10 shadow-sm">
                  <button onClick={() => setViewMode('grid')} className={cn("px-4 py-2 rounded-xl transition-all text-sm font-bold flex items-center gap-2", viewMode === 'grid' ? "bg-[#4e635a] text-white shadow-lg" : "text-[#4e635a] hover:bg-[#4e635a]/5")}><Sparkles size={16} /> وضع الشبكة</button>
                  <button onClick={() => setViewMode('list')} className={cn("px-4 py-2 rounded-xl transition-all text-sm font-bold flex items-center gap-2", viewMode === 'list' ? "bg-[#4e635a] text-white shadow-lg" : "text-[#4e635a] hover:bg-[#4e635a]/5")}><Music size={16} /> وضع القائمة</button>
                </div>
              </div>

              <div className="relative group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4e635a]/40 group-focus-within:text-[#4e635a] transition-colors" size={20} />
                <input type="text" placeholder="ابحث عن الانشودة" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border-2 border-transparent rounded-[1.5rem] py-5 pr-14 pl-6 text-base font-bold focus:border-[#4e635a]/20 focus:ring-8 focus:ring-[#4e635a]/5 outline-none shadow-xl shadow-[#4e635a]/5 transition-all text-right" />
              </div>

              {/* Playlists Horizontal List */}
              <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth" dir="rtl">
                <button 
                  onClick={() => setSelectedPlaylist(null)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap",
                    selectedPlaylist === null ? "bg-[#4e635a] text-white shadow-lg" : "bg-white/50 text-[#4e635a] hover:bg-white"
                  )}
                >
                  <ListMusic size={18} />
                  كل الأناشيد
                </button>

                {Object.keys(playlists).map(name => (
                  <div key={name} className="flex items-center gap-1 group/playlist">
                    <button 
                      onClick={() => setSelectedPlaylist(name)}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap",
                        selectedPlaylist === name ? "bg-[#4e635a] text-white shadow-lg" : "bg-white/50 text-[#4e635a] hover:bg-white"
                      )}
                    >
                      <Music size={16} />
                      {name}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deletePlaylist(name); }}
                      className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                <button 
                  onClick={() => setIsPlaylistModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all whitespace-nowrap border border-emerald-500/20"
                >
                  <Plus size={18} />
                  قائمة جديدة
                </button>
              </div>

              <div className="custom-scrollbar pr-2 max-h-[600px] overflow-y-auto">
                {filteredNasheeds.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
                      {filteredNasheeds.map((nasheed) => (
                        <motion.button
                          key={nasheed.id} layout whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => playTrack(nasheed)}
                          className={cn("group relative flex flex-col items-start gap-3 p-4 rounded-[2.5rem] transition-all border-2", currentTrack?.id === nasheed.id ? "bg-[#4e635a] border-[#4e635a] shadow-2xl z-10" : "bg-white border-transparent shadow-sm hover:shadow-2xl")}
                        >
                          <div className="relative aspect-square w-full rounded-[1.8rem] overflow-hidden shadow-lg mb-1">
                            <img src={nasheed.cover} alt={nasheed.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            {offlineReadyIds.has(nasheed.id) && <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg z-20"><CloudCheck size={12} /></div>}
                            {currentTrack?.id === nasheed.id && isPlaying && (
                              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                <div className="flex gap-1.5 h-8 items-end">
                                  {[1, 2, 3].map(i => <motion.div key={i} animate={{ height: ['40%', '100%', '60%'] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} className="w-1.5 bg-white rounded-full shadow-sm" />)}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="px-1 w-full text-right overflow-hidden relative">
                            <div className="flex items-center justify-between gap-1">
                              <button 
                                onClick={(e) => toggleNasheedMenu(e, nasheed.id)}
                                className={cn(
                                  "p-1.5 rounded-xl transition-all",
                                  currentTrack?.id === nasheed.id ? "text-white hover:bg-white/10" : "text-[#4e635a]/40 hover:bg-[#4e635a]/5 hover:text-[#4e635a]"
                                )}
                              >
                                <Plus size={16} />
                              </button>
                              <p className={cn("font-black text-sm truncate flex-1", currentTrack?.id === nasheed.id ? "text-white" : "text-[#1b1c1a]")}>{nasheed.title}</p>
                            </div>
                            <p className={cn("text-xs font-bold opacity-60 truncate mt-0.5", currentTrack?.id === nasheed.id ? "text-white/80" : "text-[#4e635a]")}>{nasheed.artist}</p>
                            
                            {/* Playlist Dropdown */}
                            <AnimatePresence>
                              {nasheedMenuId === nasheed.id && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                  className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[100] text-right"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest p-2 border-b border-slate-50 mb-1">إضافة إلى قائمة</p>
                                  <div className="max-h-40 overflow-y-auto no-scrollbar">
                                    {Object.keys(playlists).length > 0 ? (
                                      Object.keys(playlists).map(name => (
                                        <button 
                                          key={name}
                                          onClick={() => { addToPlaylist(name, nasheed.id); setNasheedMenuId(null); }}
                                          className="w-full text-right px-4 py-2 text-sm font-bold text-slate-700 hover:bg-[#4e635a]/5 hover:text-[#4e635a] rounded-xl transition-all flex items-center justify-between"
                                        >
                                          {playlists[name].includes(nasheed.id) && <CheckCircle2 size={14} className="text-emerald-500" />}
                                          {name}
                                        </button>
                                      ))
                                    ) : (
                                      <p className="text-xs text-slate-400 p-4 text-center">لا يوجد قوائم حالياً</p>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      {filteredNasheeds.map((nasheed) => (
                        <motion.button
                          key={nasheed.id} layout whileHover={{ x: -4 }} onClick={() => playTrack(nasheed)}
                          className={cn("w-full flex items-center gap-4 p-4 rounded-[1.8rem] transition-all border-2 text-right", currentTrack?.id === nasheed.id ? "bg-[#4e635a] border-[#4e635a] text-white shadow-xl" : "bg-white border-transparent text-[#1b1c1a] shadow-sm")}
                        >
                          <div className="w-16 h-16 rounded-[1.2rem] overflow-hidden shrink-0 shadow-md relative">
                             <img src={nasheed.cover} alt={nasheed.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow relative">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-black text-base">{nasheed.title}</p>
                                <p className={cn("text-sm font-bold opacity-60", currentTrack?.id === nasheed.id ? "text-white/80" : "text-[#4e635a]")}>{nasheed.artist}</p>
                              </div>
                              <button 
                                onClick={(e) => toggleNasheedMenu(e, nasheed.id)}
                                className={cn(
                                  "p-2 rounded-xl transition-all",
                                  currentTrack?.id === nasheed.id ? "text-white hover:bg-white/10" : "text-[#4e635a]/40 hover:bg-[#4e635a]/5 hover:text-[#4e635a]"
                                )}
                              >
                                <Plus size={18} />
                              </button>
                            </div>

                            {/* Playlist Dropdown */}
                            <AnimatePresence>
                              {nasheedMenuId === nasheed.id && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9, x: 10 }}
                                  animate={{ opacity: 1, scale: 1, x: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, x: 10 }}
                                  className="absolute top-0 right-full mr-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-[100] text-right"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest p-2 border-b border-slate-50 mb-1">إضافة إلى قائمة</p>
                                  <div className="max-h-40 overflow-y-auto no-scrollbar">
                                    {Object.keys(playlists).length > 0 ? (
                                      Object.keys(playlists).map(name => (
                                        <button 
                                          key={name}
                                          onClick={() => { addToPlaylist(name, nasheed.id); setNasheedMenuId(null); }}
                                          className="w-full text-right px-4 py-2 text-sm font-bold text-slate-700 hover:bg-[#4e635a]/5 hover:text-[#4e635a] rounded-xl transition-all flex items-center justify-between"
                                        >
                                          {playlists[name].includes(nasheed.id) && <CheckCircle2 size={14} className="text-emerald-500" />}
                                          {name}
                                        </button>
                                      ))
                                    ) : (
                                      <p className="text-xs text-slate-400 p-4 text-center">لا يوجد قوائم حالياً</p>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          {currentTrack?.id === nasheed.id && isPlaying && (
                            <div className="flex gap-1 h-5 items-end px-2">
                              {[1, 2, 3, 4].map(i => <motion.div key={i} animate={{ height: ['40%', '100%', '60%', '80%', '40%'] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }} className="w-1.5 bg-white rounded-full" />)}
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
        </div>
      </div>
      
      <InsightPanel 
        isOpen={isInsightOpen} 
        onClose={() => setIsInsightOpen(false)} 
        trackTitle={displayTrack.title}
        trackArtist={displayTrack.artist}
      />

      {/* New Playlist Modal */}
      <AnimatePresence>
        {isPlaylistModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#4e635a]/20 backdrop-blur-md"
              onClick={() => setIsPlaylistModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl w-full max-w-md border border-white"
            >
              <h3 className="text-2xl font-black font-serif text-[#4e635a] mb-6 text-right">إنشاء قائمة جديدة</h3>
              <form onSubmit={handleCreatePlaylist} className="space-y-4">
                <input 
                  autoFocus
                  type="text" 
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="اسم القائمة (مثلاً: أذكار الصباح)"
                  className="w-full bg-[#fbf9f6] border-2 border-transparent rounded-2xl py-4 px-6 font-bold text-[#4e635a] outline-none focus:border-[#4e635a]/20 transition-all text-right"
                />
                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit"
                    className="flex-1 bg-[#4e635a] text-white font-bold py-4 rounded-2xl hover:bg-[#3d4d46] transition-all shadow-lg"
                  >
                    إنشاء
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsPlaylistModalOpen(false)}
                    className="flex-1 bg-[#fbf9f6] text-[#4e635a] font-bold py-4 rounded-2xl hover:bg-[#f3f1ee] transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
