import { Link } from "react-router-dom";
import Carrousel from "../../components/carrousel/Carrousel";
import NewsSection from "../../components/news/New";
/*const images = [
  "/images/carrousel/AuditorioUTN.jpeg",
  "/images/carrousel/EntradaUTN.jpg",
  "/images/carrousel/FedeOlivos.jpeg",
];*/
import "./main.css";

export default function Main() {
  return (
    <div>
      <div className="main-container">
        <div className="main-title-container">
          <h1>Secretaría de <br/>
              Asuntos <br/>
              Estudiantiles</h1>

              <h3>Universidad Tecnologica Nacional - Facultad Regional Córdoba</h3>
              <div className="main-button-container">
                <Link key="jpa" to="/JPA" >
                <button className="main-jpa-button">Conoce nuestra Universidad</button>
                </Link>

                <Link key="login" to="/login" >
                  <button className="main-login-button">Soy parte de la UTN</button>
                </Link>
              </div>
        </div>
        <div className="main-image-container">
        </div>
      </div>
      <NewsSection></NewsSection>
    </div>


  );
}
