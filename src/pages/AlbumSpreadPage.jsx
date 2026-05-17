import { useNavigate } from 'react-router-dom';
import styles from './AlbumSpreadPage.module.css';

export default function AlbumSpreadPage() {
  const navigate = useNavigate();

  return (
    <section className={`page ${styles.spreadPage}`}>
      <div className={styles.albumFrame}>
        <img className={styles.spreadImage} src="/image/zhankaiye.png" alt="专辑展开页" />
        <button className={styles.cdHotspot} onClick={() => navigate('/playlist')} aria-label="点击 CD 进入播放列表" />
      </div>
      <p className={styles.prompt}>点击展开图右侧的 CD，进入播放列表</p>
    </section>
  );
}
