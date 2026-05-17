import { createContext, useContext, useMemo, useState } from 'react';
import { tracks } from '../data/albumData.js';
import { useAppState } from './AppContext.jsx';
import { useAudio } from '../hooks/useAudio.js';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const { unlockedTracks, allTracksUnlocked, updateTrackProgress, showNotice } = useAppState();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [mode, setModeState] = useState('order');
  const [volume, setVolume] = useState(0.35);

  const audio = useAudio({
    currentTrackIndex,
    mode,
    volume,
    unlockedTracks,
    allTracksUnlocked,
    updateTrackProgress,
    setCurrentTrackIndex,
  });

  const openTrack = (index) => {
    if (!unlockedTracks[index]) {
      showNotice('请先听完上一首音乐来解锁当前曲目');
      return false;
    }
    setCurrentTrackIndex(index);
    return true;
  };

  const setMode = (nextMode) => {
    if (nextMode === 'random' && !allTracksUnlocked) {
      showNotice('解锁全部8首曲目后才能开启随机播放');
      return;
    }
    setModeState(nextMode);
  };

  const guardedNextTrack = () => {
    if (!audio.nextTrack()) showNotice('请先听完上一首音乐来解锁当前曲目');
  };

  const guardedPreviousTrack = () => {
    if (!audio.previousTrack()) showNotice('已经是第一首或曲目未解锁');
  };

  const value = useMemo(
    () => ({
      tracks,
      currentTrackIndex,
      currentTrack: tracks[currentTrackIndex],
      setCurrentTrackIndex,
      openTrack,
      mode,
      setMode,
      volume,
      setVolume,
      ...audio,
      nextTrack: guardedNextTrack,
      previousTrack: guardedPreviousTrack,
    }),
    [audio, currentTrackIndex, mode, volume, unlockedTracks, allTracksUnlocked],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used inside PlayerProvider');
  return context;
}
