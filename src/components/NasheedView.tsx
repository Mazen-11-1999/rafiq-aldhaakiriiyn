import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Search, Heart, Sparkles, Disc } from 'lucide-react';
import { NASHEEDS } from '../constants';
import { cn } from '../lib/utils';

export default function NasheedView() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [searchQuery, setSearchQuery] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = NASHEEDS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % NASHEEDS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + NASHEEDS.length) % NASHEEDS.length);
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
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32 relative">
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

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Player Container */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="relative group perspective-1000">
            <motion.div 
              animate={isPlaying ? { 
                scale: [1, 1.03, 1],
                boxShadow: [
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  "0 25px 50px -12px rgba(78, 99, 90, 0.4)",
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                ]
              } : { scale: 1 }}
              whileTap={{ scale: 0.98 }}
              transition={isPlaying ? { 
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              } : { duration: 0.3 }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50 preserve-3d cursor-pointer z-10"
            >
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="text-sm font-medium opacity-80 mb-1 flex items-center gap-1">
                    <Sparkles size={12} className="text-yellow-400" />
                    الآن تستمع إلى
                  </p>
                  <h2 className="text-3xl font-black font-serif leading-tight">{currentTrack.title}</h2>
                  <p className="text-lg opacity-90">{currentTrack.artist}</p>
                </div>
              </div>
            </motion.div>
            
            {/* Visual Pulse Rings behind the cover */}
            {isPlaying && (
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.3, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: i * 1,
                      ease: "easeOut" 
                    }}
                    className="absolute inset-0 border-2 border-[#4e635a]/20 rounded-[3rem]"
                  />
                ))}
              </div>
            )}
            
            {/* Ambient Record Visual */}
            <motion.div 
               animate={isPlaying ? { scale: [1, 1.05, 1], rotate: [0, 5, 0] } : { scale: 1, rotate: 0 }}
               className="absolute top-1/2 -translate-y-1/2 -right-4 w-[95%] h-[90%] bg-[#1b1c1a] rounded-full -z-20 shadow-xl flex items-center justify-center p-4 border-8 border-white/5"
            >
               <div className="w-full h-full rounded-full border-4 border-white/10 flex items-center justify-center">
                  <Disc size={60} className="text-white/20" />
               </div>
            </motion.div>
          </div>

          <div className="glass-3d p-8 rounded-[2rem] space-y-6">
            <audio 
              ref={audioRef}
              src={currentTrack.url}
              onTimeUpdate={onTimeUpdate}
              onEnded={handleNext}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
            />

            {/* Slider */}
            <div className="space-y-2">
              <input 
                type="range"
                min="0"
                max={duration || 0}
                value={progress}
                onChange={handleProgressChange}
                className="w-full accent-[#4e635a] h-1.5 rounded-full cursor-pointer bg-[#4e635a]/10"
              />
              <div className="flex justify-between text-xs font-bold text-[#4e635a]/60 font-mono">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="p-3 text-[#4e635a] hover:bg-[#4e635a]/10 rounded-full transition-all"
              >
                <SkipBack size={28} fill="currentColor" />
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-20 h-20 bg-[#4e635a] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#4e635a]/30"
              >
                {isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" className="ml-1" />}
              </motion.button>

              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="p-3 text-[#4e635a] hover:bg-[#4e635a]/10 rounded-full transition-all"
              >
                <SkipForward size={28} fill="currentColor" />
              </motion.button>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#4e635a]/10">
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

        {/* Right Side: Playlist */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black font-serif text-[#1b1c1a]">قائمة الأناشيد</h3>
            <div className="w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center text-[#4e635a]">
              <Music size={20} />
            </div>
          </div>

          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4e635a]/40" size={18} />
            <input 
              type="text"
              placeholder="ابحث عن نشيد أو منشد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#4e635a]/10 rounded-2xl py-4 pr-12 pl-4 text-sm font-bold focus:ring-2 focus:ring-[#4e635a]/50 outline-none shadow-sm"
            />
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredNasheeds.map((nasheed, index) => (
              <motion.button
                key={nasheed.id}
                whileHover={{ x: -4 }}
                onClick={() => {
                  setCurrentTrackIndex(NASHEEDS.indexOf(nasheed));
                  setIsPlaying(true);
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl transition-all border border-transparent text-right",
                  currentTrackIndex === NASHEEDS.indexOf(nasheed) 
                    ? "bg-[#4e635a] text-white shadow-lg translate-x-1" 
                    : "bg-white hover:bg-[#4e635a]/5 text-[#1b1c1a] shadow-sm hover:border-[#4e635a]/10"
                )}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md">
                   <img src={nasheed.cover} alt={nasheed.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-sm">{nasheed.title}</p>
                  <p className={cn("text-xs opacity-60", currentTrackIndex === NASHEEDS.indexOf(nasheed) ? "text-white/80" : "text-[#4e635a]")}>{nasheed.artist}</p>
                </div>
                {currentTrackIndex === NASHEEDS.indexOf(nasheed) && isPlaying && (
                  <div className="flex gap-0.5 h-4 items-end">
                    {[1, 2, 3, 4].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: ['40%', '100%', '60%', '80%', '40%'] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-white rounded-full"
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
