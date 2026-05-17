import { Navigate, Route, Routes } from 'react-router-dom';
import DesktopOnly from './components/DesktopOnly.jsx';
import RouteTransition from './components/RouteTransition.jsx';
import { useAppState } from './context/AppContext.jsx';
import AlbumCoverPage from './pages/AlbumCoverPage.jsx';
import AlbumSpreadPage from './pages/AlbumSpreadPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import MusicPlayerPage from './pages/MusicPlayerPage.jsx';
import MysteryBoxPage from './pages/MysteryBoxPage.jsx';
import PlaylistPage from './pages/PlaylistPage.jsx';
import StoryPage from './pages/StoryPage.jsx';
import WelcomePage from './pages/WelcomePage.jsx';

function StartRedirect() {
  const { hasOpenedBox, hasVisitedWelcome } = useAppState();
  if (!hasVisitedWelcome) return <Navigate to="/welcome" replace />;
  return <Navigate to={hasOpenedBox ? '/cover' : '/story'} replace />;
}

export default function App() {
  return (
    <DesktopOnly>
      <RouteTransition>
        <Routes>
          <Route path="/" element={<StartRedirect />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/box" element={<MysteryBoxPage />} />
          <Route path="/cover" element={<AlbumCoverPage />} />
          <Route path="/spread" element={<AlbumSpreadPage />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/player/:trackId" element={<MusicPlayerPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RouteTransition>
    </DesktopOnly>
  );
}
