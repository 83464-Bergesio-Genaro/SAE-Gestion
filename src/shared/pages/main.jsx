import { Link } from "react-router-dom";
import Carrousel from "../components/carrousel/Carrousel";
import News from "../components/news/New";
const images = [
  "/images/carrousel/AuditorioUTN.jpeg",
  "/images/carrousel/EntradaUTN.jpg",
  "/images/carrousel/FedeOlivos.jpeg",
];

export default function Main() {
  return (
    <div>
      <Carrousel
        images={images}
        isDark={true}
        title="SAE GESTION"
        subtitle="Estamos para servirte"
      />
      <News></News>
    </div>
  );
}
