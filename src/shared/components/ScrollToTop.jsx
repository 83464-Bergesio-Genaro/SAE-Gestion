import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Esto mueve la ventana al inicio (X: 0, Y: 0) inmediatamente
    window.scrollTo(0, 0);
  }, [pathname]); // Se ejecuta cada vez que cambia la ruta (pathname)

  return null;
}