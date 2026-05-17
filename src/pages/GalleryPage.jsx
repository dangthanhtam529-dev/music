import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryItems } from '../data/albumData.js';
import styles from './GalleryPage.module.css';

export default function GalleryPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (activeIndex === null) return;
      if (event.key === 'Escape') setActiveIndex(null);
      if (event.key === 'ArrowRight') setActiveIndex((activeIndex + 1) % galleryItems.length);
      if (event.key === 'ArrowLeft') setActiveIndex((activeIndex - 1 + galleryItems.length) % galleryItems.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const active = activeIndex === null ? null : galleryItems[activeIndex];

  return (
    <section className={`page ${styles.galleryPage}`}>
      <header className={styles.header}>
        <div>
          <p className="eyebrow">Secret Gallery</p>
          <h1>艺术长廊</h1>
        </div>
        <button className="ghost-button" onClick={() => navigate('/playlist')}>回到播放列表</button>
      </header>
      <div className={styles.grid}>
        {galleryItems.map((item, index) => (
          <button
            key={item.id}
            className={styles.tile}
            style={{ '--tile-color': item.tint, '--tile-height': `${170 + (index % 5) * 34}px` }}
            onClick={() => setActiveIndex(index)}
          >
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      {active && (
        <div className={styles.lightbox} onClick={() => setActiveIndex(null)}>
          <button onClick={(event) => { event.stopPropagation(); setActiveIndex((activeIndex - 1 + galleryItems.length) % galleryItems.length); }}>‹</button>
          <div className={styles.lightboxImage} style={{ '--tile-color': active.tint }} onClick={(event) => event.stopPropagation()}>
            <span>{active.title}</span>
          </div>
          <button onClick={(event) => { event.stopPropagation(); setActiveIndex((activeIndex + 1) % galleryItems.length); }}>›</button>
        </div>
      )}
    </section>
  );
}
