import { useEffect, useState } from "react";
import "./Carrousel.css";

export default function Carrousel({ images, isDark = false, title = "SAE GESTION", subtitle = "Resolviendo tus problemas desde el ingreso hasta el egreso" }) {

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images && images.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      className="hero-carousel"
      style={{ backgroundImage: `url(${images[index]})` }}
    >
      <div className={`hero-overlay ${isDark ? 'dark' : 'light'}`}>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}