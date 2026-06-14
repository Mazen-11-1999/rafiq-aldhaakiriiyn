
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { NASHEEDS, Nasheed } from '../constants';

interface MediaContextType {
  currentTrack: Nasheed | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  playTrack: (track: Nasheed) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  favorites: string[];
  toggleFavorite: (trackId: string) => void;
  playlists: Record<string, string[]>;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistName: string, trackId: string) => void;
  removeFromPlaylist: (playlistName: string, trackId: string) => void;
  deletePlaylist: (playlistName: string) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Nasheed | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('rafeeq_volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('rafeeq_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [playlists, setPlaylists] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('rafeeq_playlists');
    return saved ? JSON.parse(saved) : {};
  });

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const currentTrackRef = useRef<Nasheed | null>(null);
  const trackUrlIndexRef = useRef(0);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
  }, [currentTrack]);

  const playTrack = (track: Nasheed) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }
    trackUrlIndexRef.current = 0;
    setCurrentTrack(track);
    setIsLoading(true);
    const audio = audioRef.current;
    audio.src = track.url;
    audio.load();
    
    audio.play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch(e => {
        console.warn("Playback blocked or failed initially:", e);
        if (e.name === 'NotAllowedError') {
          setIsPlaying(true); // show play state and wait for click
        } else {
          // If playing initial fails, trigger our error/fallback handler
          handleTrackPlayError();
        }
        setIsLoading(false);
      });
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    const track = currentTrackRef.current;
    if (!track) return;
    const currentIndex = NASHEEDS.findIndex(n => n.id === track.id);
    const nextIndex = (currentIndex + 1) % NASHEEDS.length;
    playTrack(NASHEEDS[nextIndex]);
  };

  const prevTrack = () => {
    const track = currentTrackRef.current;
    if (!track) return;
    const currentIndex = NASHEEDS.findIndex(n => n.id === track.id);
    const prevIndex = (currentIndex - 1 + NASHEEDS.length) % NASHEEDS.length;
    playTrack(NASHEEDS[prevIndex]);
  };

  const handleTrackPlayError = () => {
    const track = currentTrackRef.current;
    if (!track) return;
    const audio = audioRef.current;

    if (track.urls && trackUrlIndexRef.current < track.urls.length) {
       const nextUrl = track.urls[trackUrlIndexRef.current];
       trackUrlIndexRef.current += 1;
       console.warn(`Track url failed, trying fallback (${trackUrlIndexRef.current}/${track.urls.length}): ${nextUrl}`);
       setIsLoading(true);
       audio.src = nextUrl;
       audio.load();
       audio.play()
         .then(() => {
           setIsPlaying(true);
           setIsLoading(false);
         })
         .catch(e => {
           console.warn("Fallback track play failed, continuing sequence:", e);
           handleTrackPlayError();
         });
    } else {
       console.error("All URLs/fallbacks for this track failed to play. Navigating to next song.");
       setIsLoading(false);
       // Navigate to next track automatically after a short delay
       setTimeout(() => {
         nextTrack();
       }, 2000);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      handleTrackPlayError();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
    localStorage.setItem('rafeeq_volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('rafeeq_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('rafeeq_playlists', JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = (name: string) => {
    if (playlists[name]) return;
    setPlaylists(prev => ({ ...prev, [name]: [] }));
  };

  const addToPlaylist = (name: string, trackId: string) => {
    if (!playlists[name]) return;
    if (playlists[name].includes(trackId)) return;
    setPlaylists(prev => ({
      ...prev,
      [name]: [...prev[name], trackId]
    }));
  };

  const removeFromPlaylist = (name: string, trackId: string) => {
    if (!playlists[name]) return;
    setPlaylists(prev => ({
      ...prev,
      [name]: prev[name].filter(id => id !== trackId)
    }));
  };

  const deletePlaylist = (name: string) => {
    setPlaylists(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  // Media Session API for background control
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: 'سندك',
        artwork: [
          { src: currentTrack.cover, sizes: '96x96', type: 'image/jpeg' },
          { src: currentTrack.cover, sizes: '128x128', type: 'image/jpeg' },
          { src: currentTrack.cover, sizes: '192x192', type: 'image/jpeg' },
          { src: currentTrack.cover, sizes: '256x256', type: 'image/jpeg' },
          { src: currentTrack.cover, sizes: '384x384', type: 'image/jpeg' },
          { src: currentTrack.cover, sizes: '512x512', type: 'image/jpeg' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        setIsPlaying(true);
        audioRef.current.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        setIsPlaying(false);
        audioRef.current.pause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          audioRef.current.currentTime = details.seekTime;
        }
      });
    }
  }, [currentTrack]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => {
        console.warn("Playback blocked or failed:", e);
        // Do not force false instantly if blocked, so user can click to play
        if (e.name !== 'NotAllowedError') {
          setIsPlaying(false);
        }
      });
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
    } else {
      audioRef.current.pause();
      if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
    }
  }, [isPlaying]);

  const seek = (time: number) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId) 
        : [...prev, trackId]
    );
  };

  return (
    <MediaContext.Provider value={{
      currentTrack, isPlaying, progress, duration, volume, isLoading,
      playTrack, togglePlay, nextTrack, prevTrack, seek, setVolume: setVolumeState,
      favorites, toggleFavorite,
      playlists, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist
    }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
};
