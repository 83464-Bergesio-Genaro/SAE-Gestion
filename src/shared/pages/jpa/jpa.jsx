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
import {InfoSectionPhone,InfoSectionWithId} from "./jpaInfoSection";

const information =[
    {
        section: "info-deportes",
        title: "COMPLEMENTA TUS ESTUDIOS",
        text:  "Desde la secretaria de asuntos estudiantiles contamos con un area dedicada a la realización de deportes como actividad recreativa, en nuestra facultad contamos con deportes como:<strong> Futbol, Futbol sala, Voley, Basket, Natación, Arquería</strong> todos estos con sus respectivos entrenamientos para todos los generos. Ademas contamos con convenios con diferentes gimnasios para que puedas entrenar en tu dia a dia, ofreciendo descuentos especiales por ser alumno de nuestra Universidad. Si estas interesado en representar a la facultad dentro de las diferentes disciplinas deportivas podes acercarte a la <strong>S</strong>ecretaria de <strong>A</strong>suntos <strong>E</strong>studiantiles para mas información.",
        image: "../../../../public/images/infoSection/deportesFRC.webp",
        alt: "Deportes UTN FRC"
    },
    {
        section: "info-bienestar",
        title: "TU SALUD ES LO PRIMERO",
        text: "Dentro de la secretaría contamos con un area especialmente dedicada a la salud de los estudiantes, en donde vas a poder tener un seguimiento primario en diferestes aspectos de salud. En la facultad podrás encontrar consultorios para:<strong> Medico clinico, Nutricionista, Fisioterapeuta, Odontlogo, Psicopedagogo y Psicologo. </strong> No dejes de lado tu salud, es importante para poder rendir al 100% en tus estudios y tambien por tu bienestar personal, contamos con profesionales altamente capacitados para ayudarte en lo que necesites. Podés acercarte a la <strong>S</strong>ecretaria de <strong>A</strong>suntos <strong>E</strong>studiantiles para saber mas sobre el area de salud, no dudes en contactarnos.",
        image: "../../../../public/images/infoSection/saludFRC.jpg",
        alt: "Salud UTN FRC"
    },
    {
        section: "info-becas",
        title: "BECAS TECNOLOGICAS",
        text: "En el area de becas de la secretaría se realiza la gestión de becas propias de la universidad y te ayudamos aplicar a becas de caracter nacional. La secretaría ofrece las siguientes becas: <strong>Beca de servicio, beca de ayuda economica y beca de investigación. </strong> Que lo economico no sea un impedimento para que puedas estudiar, desde el area nos interesa que puedas acceder a las mejores oportunidades para finalizar tus estudios de grado. Si estas intersado en aplicar a alguna de nuestras becas o como pedir/mantener otras becas estatales podes acercarte a la <strong>S</strong>ecretaria de <strong>A</strong>suntos <strong>E</strong>studiantiles para obtener mas información.",
        image: "../../../../public/images/infoSection/becasFRC.jpg",
        alt: "Becas UTN FRC"
    }
    ,
    {
        section: "info-biblioteca",
        title: "NUESTRA BIBLOTECA",
        text: "Ubicada en el edificio Gallardo (aulas 500) nuestra biblioteca es un lugar importante para el estudio y la investigación, contando con una amplia colección de libros, revistas y recursos digitales. La instalacion es de libre acceso y es un buen lugar para estudiar, investigar o simplemente para pasar el rato leyendo un buen libro. No dudes en acercarte a la biblioteca para aprovechar todos los recursos que ofrece, es un espacio pensado para vos y tu desarrollo académico.",
        image: "../../../../public/images/infoSection/bibliotecaFRC.jpg",
        alt: "Biblioteca UTN FRC"
    },
    {
        section: "info-congresos",
        title: "CONGRESOS",
        text: "Nuestra facultad organiza y participa en diversos congresos y eventos académicos a lo largo del año, brindando a los estudiantes la oportunidad de presentar sus trabajos, aprender de expertos en el campo y establecer contactos con profesionales de la industria. Estos eventos son una excelente oportunidad para ampliar tus conocimientos, compartir tus investigaciones y conectarte con la comunidad académica.  Un ejemplo de esto es el CNEISI que se realiza anualmente e incluye otras regionales del pais con eje en la ingeniería en sistemas.",
        image: "../../../../public/images/infoSection/congresoFRC.webp",
        alt: "Congresos UTN FRC"
    },
    {
        section: "info-tramites",
        title: "TRAMITES Y CERTIFICADOS",
        text: "A lo largo de tu carrera universitaria, es posible que necesites realizar diversos trámites administrativos relacionados con tu inscripción, materias, certificados, entre otros. La secretaría de asuntos estudiantiles está aquí para ayudarte a navegar por estos procesos y asegurarte de que puedas completar tus trámites de manera eficiente. Ya sea que necesites ayuda para inscribirte en una materia, solicitar un certificado de alumno regular o resolver cualquier duda relacionada con los trámites académicos, nuestro equipo está disponible para brindarte el apoyo necesario. No dudes en acercarte a la secretaría para obtener asistencia personalizada y asegurarte de que tus trámites se realicen sin contratiempos.",
        image: "../../../../public/images/infoSection/tramitesFRC.jpg",
        alt: "Tramites UTN FRC"
    },
    {
        section: "info-visitas",
        title: "VISITAS EMPRESARIALES",
        text: "Las visitas a empresas son una excelente oportunidad para conocer la realidad del mundo laboral y establecer contactos con profesionales de la industria. Durante estas visitas, los estudiantes pueden aprender sobre las prácticas empresariales, las oportunidades de empleo y las tendencias del mercado. La secretaría en conjunto a diferentes catedras de la facultad organiza visitas a empresas de diversos sectores, brindando a los estudiantes la oportunidad de explorar diferentes industrias y conocer de primera mano las oportunidades laborales disponibles.",
        image: "../../../../public/images/infoSection/visitasFRC.jpg",
        alt: "Visitas Empresariales UTN FRC"
    }
]

const carrers = [
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
      fontSize="3em"
      fontWeight="bold"
      marginTop="140px">
        ¡BIENVENID@ A NUESTRA UNIVERSIDAD!
      </Typography>
      <JPAIntro></JPAIntro>

      <div className="mobile-container">
        <InfoSectionPhone information={information} />
      </div>
      
      <Typography variant="h3" align="center"
        fontWeight="bold"
        sx={{
          fontSize:{xs:20,sm:24,md:46},
          marginTop:{xs:4,sm:3,md:2},
        }}>
          CONOCÉ NUESTRAS CARRERAS
      </Typography>
      <div className="interactive-container">
        <InteractiveGrid items={carrers} />
      </div>

      <div className="desktop-container">
        <Typography variant="h3" align="center"
          fontWeight="bold"
        sx={{
          fontSize:{xs:20,sm:24,md:46},
          marginTop:{xs:4,sm:3,md:2},
        }}>
            MAS INFORMACION
        </Typography>        
        <InfoSectionWithId information={information} />
      </div>
      

        <Typography  
        variant="h3" 
        align="center"
        sx={{
          fontSize:{xs:20,sm:24,md:46},
          marginTop:{xs:4,sm:3,md:2},
        }}
        fontWeight="bold">
          CHARLAS Y EVENTOS
        </Typography>
        <div className="events-container">
              <CalendarEvent eventos={eventosJPA} />
        </div>


      <br />
      <ParticipeButton/>
    </div>
  );
}
