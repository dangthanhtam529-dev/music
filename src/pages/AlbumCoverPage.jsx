import { useNavigate } from 'react-router-dom';
import styles from './AlbumCoverPage.module.css';

export default function AlbumCoverPage() {
  const navigate = useNavigate();

  return (
    <section className={`page ${styles.coverPage}`}>
      <div className={styles.coverWrap}>
        <button className={styles.cover} onClick={() => navigate('/spread')} aria-label="展开专辑">
          <img src="/image/fengmian.png" alt="专辑封面" />
        </button>
        <p>点击专辑封面，展开这张唱片</p>
      </div>
    </section>
  );
}
