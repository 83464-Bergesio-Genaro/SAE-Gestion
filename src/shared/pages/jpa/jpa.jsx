import {
  Typography
} from "@mui/material";
import "./jpa.css";
import InteractiveGrid from "../../components/galleryZoomGrid/galleryZoomGrid";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { CalendarEvent } from "../../components/calendarEvent/calendarEvent";
import Fab from "@mui/material/Fab";

import { ObtenerEventosPublicos } from "../../../api/JPAService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import JPAIntro from "./jpaTopInfo";
import {InfoSectionWithId,InfoSection} from "./jpaInfoSection";

const items = [
  {
    title: "Ing. Sistemas de Información",
    img: "../../../../public/images/degreesJPA/ingenieriaSistemas.jpeg",
    route: "/JPA/sistemas",
  },
  {
    title: "Ing. Electrica",
    img: "../../../../public/images/degreesJPA/ingenieriaElectrica.jpg",
    route: "/JPA/electrica",
  },
  {
    title: "Ing. Quimica",
    img: "../../../../public/images/degreesJPA/ingenieriaQuimica.jpg",
    route: "/JPA/quimica",
  },

  {
    title: "Ing. Metalurgica",
    img: "../../../../public/images/degreesJPA/ingenieriaMetalurgica.jpg",
    route: "/JPA/metalurgica",
  },

  {
    title: "Ing. Electronica",
    img: "../../../../public/images/degreesJPA/ingenieriaElectronica.jpg",
    route: "/JPA/electronica",
  },
  {
    title: "Ing. Civil",
    img: "../../../../public/images/degreesJPA/ingenieriaCivil.jpg",
    route: "/JPA/civil",
  },
  {
    title: "Ing. Industrial",
    img: "../../../../public/images/degreesJPA/ingenieriaIndustrial.jpg",
    route: "/JPA/industrial",
  },
  {
    title: "Ing. Mecanica",
    img:  "../../../../public/images/degreesJPA/ingenieriaMecanica.jpg",
    route: "/JPA/mecanica",
  },
];

function ParticipeButton(){
  const navigate = useNavigate();
  return(<Fab
          color="primary"
          variant="extended"
          sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          }}
          className="fab-participar"
          onClick={() => navigate("/JPA/participar")}
          >
    <HowToRegIcon />
    <span className="texto"> Quiero participar</span>
    </Fab>)
}

export default function JPA() {
  const [eventosJPA, setEventosJPA] = useState([]);


  useEffect(() => {
    const ObtenerEventosPublicosApi = async () => {
      try {
        const data = await ObtenerEventosPublicos();
        setEventosJPA(data);
      } catch (error) {
        console.error("Error al traer Eventos:", error);
      }
    };
    ObtenerEventosPublicosApi();
  }, []);

  return (
    <div>
      <Typography variant="h2" 
      align="center" 
      fontSize="50px"
      fontWeight="bold"
      marginTop="140px">
        ¡BIENVENID@ A NUESTRA UNIVERSIDAD!
      </Typography>
      <JPAIntro></JPAIntro>

      <div className="mobile-container">
        <InfoSection></InfoSection>
      </div>
      

      <Typography variant="h3" align="center"  fontSize="45px"
        fontWeight="bold">
          CONOCÉ NUESTRAS CARRERAS
      </Typography>
      <div className="interactive-container">
        <InteractiveGrid items={items} />
      </div>

      <div className="desktop-container">
        <Typography variant="h3" align="center" fontSize="40px"
          fontWeight="bold">
            MAS INFORMACION
        </Typography>        
        <InfoSectionWithId/>
      </div>
      

        <Typography variant="h3" align="center" fontSize="40px"
          fontWeight="bold">
          AGENDA DE EVENTOS
        </Typography>
        <div className="events-container">
              <CalendarEvent eventos={eventosJPA} />
        </div>


      <br />
      <ParticipeButton/>
    </div>
  );
}
