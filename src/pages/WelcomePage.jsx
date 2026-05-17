import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext.jsx';
import styles from './WelcomePage.module.css';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { setHasVisitedWelcome } = useAppState();

  const handleStart = () => {
    setHasVisitedWelcome();
    navigate('/story');
  };

  return (
    <section className={`page ${styles.welcome}`}>
      <div className={styles.content}>
        <p className="eyebrow">A Gift For You</p>
        <h1 className={styles.title}>一会儿会有什么出现呢？</h1>
        <p className={styles.subtitle}>保持冷静 降低预期</p>
        <button
          className="primary-button"
          onClick={handleStart}
        >
          拆开看看吧
        </button>
      </div>
      <p className={styles.hint}>点击按钮，开启这段旅程</p>
    </section>
  );
}
