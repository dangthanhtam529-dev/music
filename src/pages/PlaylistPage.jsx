import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext.jsx';
import { usePlayer } from '../context/PlayerContext.jsx';
import styles from './PlaylistPage.module.css';

export default function PlaylistPage() {
  const navigate = useNavigate();
  const { unlockedTracks, notice } = useAppState();
  const { tracks, openTrack } = usePlayer();

  const handleOpen = (index) => {
    if (openTrack(index)) navigate(`/player/${index + 1}`);
  };

  return (
    <section className={`page ${styles.playlistPage}`}>
      <div className={styles.header}>
        <p className="eyebrow">Playlist</p>
        <h1></h1>
        <button className="ghost-button" onClick={() => navigate('/spread')}>返回专辑</button>
      </div>
      <div className={styles.list}>
        {tracks.map((track, index) => (
          <button
            key={track.id}
            className={`${styles.track} ${unlockedTracks[index] ? styles.unlocked : styles.locked}`}
            onClick={() => handleOpen(index)}
          >
            <span>{String(track.id).padStart(2, '0')}</span>
            <strong>{track.title}</strong>
            <em>{track.durationLabel}</em>
            <i>{unlockedTracks[index] ? 'PLAY' : 'LOCK'}</i>
          </button>
        ))}
      </div>
      {notice && <div className="toast">{notice}</div>}
    </section>
  );
}
