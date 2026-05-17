import { useNavigate } from 'react-router-dom';
import { storyText } from '../data/albumData.js';
import styles from './StoryPage.module.css';

export default function StoryPage() {
  const navigate = useNavigate();

  return (
    <section className={`page ${styles.story}`}>
      <div className={styles.paper}>
        <p className="eyebrow">A little album for you</p>
        <h1>No. 1</h1>
        <p className={styles.text}>{storyText}</p>
        <button className="primary-button" onClick={() => navigate('/box')}>接着拆吧</button>
      </div>
      <p className={styles.hint}>点击按钮</p>
    </section>
  );
}
