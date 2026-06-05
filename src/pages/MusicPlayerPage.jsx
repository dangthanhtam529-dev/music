import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '../context/AppContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import styles from './MusicPlayerPage.module.css';

function formatTime(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const minutes = Math.floor(safeValue / 60);
  const seconds = Math.floor(safeValue % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5.5h3v13H7z" />
      <path d="M14 5.5h3v13h-3z" />
    </svg>
  );
}

function PreviousIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6h2v12H6z" />
      <path d="M20 6 9 12l11 6Z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 6h2v12h-2z" />
      <path d="M4 6l11 6L4 18Z" />
    </svg>
  );
}

export default function MusicPlayerPage() {
  const navigate = useNavigate();
  const { trackId } = useParams();
  const { unlockedTracks, notice } = useAppState();
  const {
    tracks,
    currentTrackIndex,
    currentTrack,
    openTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    nextTrack,
    previousTrack,
  } = usePlayer();

  useEffect(() => {
    const nextIndex = Number(trackId) - 1;
    if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= tracks.length) {
      navigate('/playlist', { replace: true });
      return;
    }
    openTrack(nextIndex);
  }, [trackId, navigate, tracks.length, openTrack]);

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    navigate(`/player/${nextIndex + 1}`);
  };

  const handlePrevious = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    navigate(`/player/${prevIndex + 1}`);
  };

  const progress = duration ? currentTime / duration : 0;
  const displayDuration = duration || 180;

  return (
    <section className={`page ${styles.playerPage}`}>
      <button className={styles.backButton} onClick={() => navigate('/playlist')}>
        返回列表
      </button>

      <div className={styles.lyricsBook}>
        {currentTrack.imageSrc ? (
          <div className={styles.bookPage}>
            <img
              className={styles.lyricsImage}
              src={currentTrack.imageSrc}
              alt={currentTrack.title}
              draggable={false}
            />
            {currentTrack.illustrationSrc && (
              <div className={styles.illustrationBox}>
                <img
                  className={styles.illustrationImage}
                  src={currentTrack.illustrationSrc}
                  alt="插图"
                  draggable={false}
                />
              </div>
            )}
          </div>
        ) : (
          <div className={styles.placeholder}>暂无歌词本配图</div>
        )}
      </div>

      <div className={styles.bottomControls}>
        <div className={styles.progressShell}>
          <input
            className={styles.progress}
            style={{ '--progress': `${progress * 100}%` }}
            type="range"
            min="0"
            max="1000"
            value={Math.round(progress * 1000)}
            onChange={(event) => seek(Number(event.target.value) / 1000)}
            onInput={(event) => seek(Number(event.target.value) / 1000)}
          />
          <div className={styles.timeRow}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(displayDuration)}</span>
          </div>
        </div>

        <div className={styles.transportRow}>
          <button
            className={styles.secondaryButton}
            onClick={handlePrevious}
            aria-label="上一首"
          >
            <PreviousIcon />
          </button>

          <button
            className={styles.playButton}
            onClick={togglePlay}
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            className={styles.secondaryButton}
            onClick={handleNext}
            aria-label="下一首"
          >
            <NextIcon />
          </button>
        </div>
      </div>

      {notice && <div className="toast">{notice}</div>}
    </section>
  );
}
