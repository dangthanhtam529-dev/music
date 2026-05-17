import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext.jsx';
import styles from './MysteryBoxPage.module.css';

export default function MysteryBoxPage() {
  const navigate = useNavigate();
  const { setHasOpenedBox } = useAppState();
  const [opened, setOpened] = useState(false);

  const openBox = () => {
    if (opened) return;
    setOpened(true);
    window.setTimeout(() => {
      setHasOpenedBox();
      navigate('/cover');
    }, 1450);
  };

  return (
    <section className={`page ${styles.boxPage}`}>
      <p className="eyebrow">Mystery Box</p>
      <h1>No. 2</h1>
      <button className={`${styles.box} ${opened ? styles.opened : ''}`} onClick={openBox} aria-label="打开盲盒">
        <span className={styles.lid} />
        <span className={styles.body} />
        <span className={styles.ribbonVertical} />
        <span className={styles.ribbonHorizontal} />
        <span className={styles.glow} />
      </button>
      <p className={styles.prompt}>{opened ? '正在浮现……' : '所以，它就是...'}</p>
    </section>
  );
}
