import { useLocation } from 'react-router-dom';

export default function RouteTransition({ children }) {
  const location = useLocation();
  return (
    <main key={location.pathname} className="route-transition">
      {children}
    </main>
  );
}
