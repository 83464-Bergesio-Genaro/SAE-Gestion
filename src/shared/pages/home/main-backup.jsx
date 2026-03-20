import { Link } from "react-router-dom";
import NewsGrid from "../../components/news/NewsGrid";
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
      <NewsGrid></NewsGrid>
    </div>
  );
}
