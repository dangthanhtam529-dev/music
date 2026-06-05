import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { tracks } from '../data/albumData.js';

export function useAudio({ currentTrackIndex, mode, volume, unlockedTracks, allTracksUnlocked, updateTrackProgress, setCurrentTrackIndex }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const track = tracks[currentTrackIndex];
    audio.pause();
    audio.src = track.audioSrc || '';
    audio.volume = volume;
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    // 自动播放
    if (track.audioSrc) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  const goToTrack = useCallback(
    (index) => {
      if (index < 0 || index >= tracks.length) return false;
      setCurrentTrackIndex(index);
      return true;
    },
    [setCurrentTrackIndex],
  );

  const nextTrack = useCallback(() => {
    if (mode === 'random') {
      const choices = tracks.map((_, index) => index).filter((index) => index !== currentTrackIndex);
      const next = choices[Math.floor(Math.random() * choices.length)] ?? currentTrackIndex;
      setCurrentTrackIndex(next);
      return true;
    }
    return goToTrack(currentTrackIndex + 1);
  }, [currentTrackIndex, goToTrack, mode, setCurrentTrackIndex]);

  const previousTrack = useCallback(() => goToTrack(currentTrackIndex - 1), [currentTrackIndex, goToTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      const nextDuration = audio.duration || 0;
      if (nextDuration) updateTrackProgress(currentTrackIndex, audio.currentTime / nextDuration);
    };
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      updateTrackProgress(currentTrackIndex, 1);
      if (mode === 'loop') {
        audio.currentTime = 0;
        setCurrentTime(0);
        return;
      }
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, mode, nextTrack, updateTrackProgress]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src || audio.src === window.location.href) {
      setIsPlaying(false);
      return;
    }
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const seek = useCallback(
    (progress) => {
      const audio = audioRef.current;
      const safeProgress = Math.max(0, Math.min(1, progress));
      if (audio?.duration) {
        audio.currentTime = audio.duration * safeProgress;
        setCurrentTime(audio.currentTime);
      } else {
        setCurrentTime(safeProgress * 180);
      }
      updateTrackProgress(currentTrackIndex, safeProgress);
    },
    [currentTrackIndex, updateTrackProgress],
  );

  return useMemo(
    () => ({ isPlaying, currentTime, duration, togglePlay, seek, nextTrack, previousTrack, goToTrack }),
    [currentTime, duration, goToTrack, isPlaying, nextTrack, previousTrack, seek, togglePlay],
  );
}
