import { createContext, useContext, useMemo, useState } from 'react';
import { tracks } from '../data/albumData.js';

const AppContext = createContext(null);
const boxKey = 'music-album:box-opened';
const welcomeKey = 'music-album:welcome-visited';
const unlockedKey = 'music-album:unlocked-tracks';
const progressKey = 'music-album:track-progress';
const storageVersion = 'v2-all-unlocked';
const versionKey = 'music-album:storage-version';

function migrateStorage() {
  // 版本不匹配时清掉旧的解锁/进度状态，强制用新的默认（全解锁）
  if (localStorage.getItem(versionKey) !== storageVersion) {
    localStorage.removeItem(unlockedKey);
    localStorage.removeItem(progressKey);
    localStorage.setItem(versionKey, storageVersion);
  }
}

function readJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function initialUnlocked() {
  const stored = readJson(unlockedKey, null);
  if (Array.isArray(stored) && stored.length === tracks.length) return stored;
  return tracks.map(() => true);
}

export function AppProvider({ children }) {
  migrateStorage();
  const [hasOpenedBox, setHasOpenedBoxState] = useState(() => localStorage.getItem(boxKey) === 'true');
  const [hasVisitedWelcome, setHasVisitedWelcomeState] = useState(() => localStorage.getItem(welcomeKey) === 'true');
  const [unlockedTracks, setUnlockedTracks] = useState(initialUnlocked);
  const [trackProgress, setTrackProgress] = useState(() => readJson(progressKey, {}));
  const [notice, setNotice] = useState('');

  const setHasOpenedBox = () => {
    localStorage.setItem(boxKey, 'true');
    setHasOpenedBoxState(true);
  };

  const setHasVisitedWelcome = () => {
    localStorage.setItem(welcomeKey, 'true');
    setHasVisitedWelcomeState(true);
  };

  const unlockTrack = (index) => {
    if (index < 0 || index >= tracks.length) return;
    setUnlockedTracks((current) => {
      if (current[index]) return current;
      const next = [...current];
      next[index] = true;
      writeJson(unlockedKey, next);
      return next;
    });
  };

  const updateTrackProgress = (index, progress) => {
    const safeProgress = Math.max(0, Math.min(1, progress || 0));
    setTrackProgress((current) => {
      const next = { ...current, [index]: Math.max(current[index] || 0, safeProgress) };
      writeJson(progressKey, next);
      return next;
    });
    if (safeProgress >= 0.95) unlockTrack(index + 1);
  };

  const showNotice = (message) => {
    setNotice(message);
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => setNotice(''), 2200);
  };

  const value = useMemo(
    () => ({
      hasOpenedBox,
      setHasOpenedBox,
      hasVisitedWelcome,
      setHasVisitedWelcome,
      unlockedTracks,
      unlockTrack,
      trackProgress,
      updateTrackProgress,
      allTracksUnlocked: unlockedTracks.every(Boolean),
      notice,
      showNotice,
    }),
    [hasOpenedBox, hasVisitedWelcome, unlockedTracks, trackProgress, notice],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used inside AppProvider');
  return context;
}
