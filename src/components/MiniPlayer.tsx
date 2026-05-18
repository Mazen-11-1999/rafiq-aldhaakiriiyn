
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, X, Music, Volume2 } from 'lucide-react';
import { useMedia } from '../context/MediaContext';
import { cn } from '../lib/utils';

export const MiniPlayer: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay, progress, duration, isLoading } = useMedia();

  if (!currentTrack) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[500px]"
      >
        <div className="glass-3d p-3 rounded-[2rem] border border-[#4e635a]/20 shadow-2xl flex items-center justify-between group overflow-hidden">
          {/* Progress Bar Background */}
          <div className="absolute bottom-0 left-0 h-1 bg-[#4e635a]/10 w-full" />
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-[#4e635a]"
            style={{ width: `${(progress / duration) * 100 || 0}%` }}
          />

          <div className="flex items-center gap-3 overflow-hidden pr-2">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg shrink-0">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title} 
                className={cn("w-full h-full object-cover", isPlaying && "animate-[pulse_4s_infinite]")} 
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Music size={14} className="text-white" />
                  </motion.div>
                </div>
              )}
            </div>
            
            <div className="overflow-hidden">
               <p className="font-black text-sm text-[#1b1c1a] truncate leading-none mb-1">
                 {currentTrack.title}
               </p>
               <p className="text-[10px] text-[#4e635a] font-bold opacity-60 truncate">
                 {currentTrack.artist}
               </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pl-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-12 h-12 bg-[#4e635a] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#4e635a]/20"
            >
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Music size={20} />
                </motion.div>
              ) : isPlaying ? (
                <Pause size={20} fill="white" />
              ) : (
                <Play size={20} className="ml-1" fill="white" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
