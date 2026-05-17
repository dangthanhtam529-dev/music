export default function DesktopOnly({ children }) {
  return (
    <>
      <div className="desktop-shell">{children}</div>
      <div className="mobile-blocker">
        <div>
          <p className="eyebrow">Desktop Only</p>
          <h1>请使用桌面端打开这份礼物</h1>
          <p>这张音乐专辑为横向大画幅设计，桌面端会拥有完整的展开与播放体验。</p>
        </div>
      </div>
    </>
  );
}
