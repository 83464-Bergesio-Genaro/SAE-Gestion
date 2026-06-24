import {
  Avatar,
  Box,
  Card,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Paper,
  Grid
} from "@mui/material";
import SAEButton from "../../components/buttons/SAEButton";
import SAESpinner from "../../components/spinner/SAESpinner";

import { useRef,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJPA } from "../../context/sharedContext";
import { JPAProvider } from "../../context/providers/jpaProvider";
import { CalendarEvent } from "../../components/calendarEvent/calendarEvent";
import { HashLink as Link } from 'react-router-hash-link';

import Fab from "@mui/material/Fab";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import InteractiveGrid from "../../components/galleryZoomGrid/galleryZoomGrid";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GroupsIcon from "@mui/icons-material/Groups";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import BusinessIcon from "@mui/icons-material/Business";
import CampaignIcon from "@mui/icons-material/Campaign";
import WorkIcon from "@mui/icons-material/Work";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const baseUrl = import.meta.env.BASE_URL;
const settingsHero = {
  mobileFirst: true,
  dots: true,
  infinite: true,
  autoplay: true, 
  speed: 1400,
  autoplaySpeed: 5000,
  fade: true,
  slidesToShow: 1,     
  slidesToScroll: 1, 
  pauseOnHover: false,
  responsive: [
    {
      breakpoint: 1024, 
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,  
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
};
const settings = {
  mobileFirst: true,
  dots: false,
  infinite: true,
  swipe: true,
  speed: 600, 
  autoplay: true,
  autoplaySpeed: 1800,
  slidesToShow: 3,
  slidesToScroll: 1,
  swipeToSlide: true, 
  pauseOnHover: false,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        speed: 600, // Reduce slightly for tablet
        swipeToSlide: false,
      },
    },
    {
    breakpoint: 768, // Mobile
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            speed: 400,      
            swipeToSlide: false, 
            waitForAnimate: false,
            autoplay: false
      },
    },
  ],
};
const information =[
    {
        section: "info-deportes",
        title: "COMPLEMENTA TUS ESTUDIOS",
        text:  "Desde la secretaria de asuntos estudiantiles contamos con un area dedicada a la realización de deportes como actividad recreativa, en nuestra facultad contamos con deportes como:<strong> Futbol, Futbol sala, Voley, Basket, Natación, Arquería</strong> todos estos con sus respectivos entrenamientos para todos los generos. Ademas contamos con convenios con diferentes gimnasios para que puedas entrenar en tu dia a dia, ofreciendo descuentos especiales por ser alumno de nuestra Universidad. Si estas interesado en representar a la facultad dentro de las diferentes disciplinas deportivas podes acercarte a la <strong>S</strong>ecretaria de <strong>A</strong>suntos <strong>E</strong>studiantiles para mas información.",
        image: `${baseUrl}images/infoSection/deportesFRC.webp`,
        alt: "Deportes UTN FRC"
    },
    {
        section: "info-bienestar",
        title: "TU SALUD ES LO PRIMERO",
        text: "Dentro de la secretaría contamos con un area especialmente dedicada a la salud de los estudiantes, en donde vas a poder tener un seguimiento primario en diferestes aspectos de salud. En la facultad podrás encontrar consultorios para:<strong> Medico clinico, Nutricionista, Fisioterapeuta, Odontlogo, Psicopedagogo y Psicologo. </strong> No dejes de lado tu salud, es importante para poder rendir al 100% en tus estudios y tambien por tu bienestar personal, contamos con profesionales altamente capacitados para ayudarte en lo que necesites. Podés acercarte a la <strong>S</strong>ecretaria de <strong>A</strong>suntos <strong>E</strong>studiantiles para saber mas sobre el area de salud, no dudes en contactarnos.",
        image: `${baseUrl}images/infoSection/saludFRC.jpg`,
        alt: "Salud UTN FRC"
    },
    {
        section: "info-becas",
        title: "BECAS TECNOLOGICAS",
        text: "En el area de becas de la secretaría se realiza la gestión de becas propias de la universidad y te ayudamos aplicar a becas de caracter nacional. La secretaría ofrece las siguientes becas: <strong>Beca de servicio, beca de ayuda economica y beca de investigación. </strong> Que lo economico no sea un impedimento para que puedas estudiar, desde el area nos interesa que puedas acceder a las mejores oportunidades para finalizar tus estudios de grado. Si estas intersado en aplicar a alguna de nuestras becas o como pedir/mantener otras becas estatales podes acercarte a la <strong>S</strong>ecretaria de <strong>A</strong>suntos <strong>E</strong>studiantiles para obtener mas información.",
        image: `${baseUrl}images/infoSection/becasFRC.jpg`,
        alt: "Becas UTN FRC"
    }
    ,
    {
        section: "info-biblioteca",
        title: "NUESTRA BIBLOTECA",
        text: "Ubicada en el <strong>edificio Gallardo (aulas 500)</strong> nuestra biblioteca es un lugar importante para el estudio y la investigación, contando con una amplia colección de libros, revistas y recursos digitales. La instalacion es de<strong> libre acceso</strong> y es un buen lugar para estudiar, investigar o simplemente para pasar el rato leyendo un buen libro. No dudes en acercarte a la biblioteca para aprovechar todos los recursos que ofrece, es un espacio pensado para vos y tu desarrollo académico.",
        image: `${baseUrl}images/infoSection/bibliotecaFRC.jpg`,
        alt: "Biblioteca UTN FRC"
    },
    {
        section: "info-congresos",
        title: "CONGRESOS",
        text: "Nuestra facultad organiza y participa en diversos congresos y eventos académicos a lo largo del año, brindando a los estudiantes la oportunidad de <strong>presentar sus trabajos, aprender de expertos en el campo y establecer contactos con profesionales de la industria.</strong> Estos eventos son una excelente oportunidad para ampliar tus conocimientos, compartir tus investigaciones y conectarte con la comunidad académica.  Un ejemplo de esto es el <strong>CNEISI</strong> que se realiza anualmente e incluye otras regionales del pais con eje en la ingeniería en sistemas.",
        image: `${baseUrl}images/infoSection/congresoFRC.webp`,
        alt: "Congresos UTN FRC"
    },
    {
        section: "info-tramites",
        title: "TRAMITES Y CERTIFICADOS",
        text: "A lo largo de tu carrera universitaria, es posible que necesites realizar diversos trámites administrativos relacionados con tu<strong> inscripción, materias, libreta, certificados, entre otros.</strong> La secretaría de asuntos estudiantiles está aquí para ayudarte a navegar por estos procesos y asegurarte de que puedas completar tus trámites de manera eficiente. Ya sea que necesites ayuda para inscribirte en una materia, solicitar un certificado de alumno regular o resolver cualquier duda relacionada con los trámites académicos, nuestro equipo está disponible para brindarte el apoyo necesario. No dudes en acercarte a la secretaría para obtener asistencia personalizada y asegurarte de que tus trámites se realicen sin contratiempos.",
        image: `${baseUrl}images/infoSection/tramitesFRC.jpg`,
        alt: "Tramites UTN FRC"
    },
    {
        section: "info-visitas",
        title: "VISITAS EMPRESARIALES",
        text: "Las visitas a empresas son una excelente oportunidad para conocer la realidad del <strong>mundo laboral y establecer contactos con profesionales de la industria.</strong> Durante estas visitas, los estudiantes pueden aprender sobre las prácticas empresariales, las oportunidades de empleo y las tendencias del mercado. La secretaría en conjunto a diferentes catedras de la facultad organiza visitas a empresas de diversos sectores, brindando a los estudiantes la oportunidad de explorar diferentes industrias y <strong>conocer de primera mano las oportunidades laborales disponibles.</strong> Estas visitas son una parte importante de la experiencia universitaria, ya que permiten a los estudiantes conectar su formación académica con el mundo real y prepararse para su futura carrera profesional.",
        image: `${baseUrl}images/infoSection/visitasFRC.jpg`,
        alt: "Visitas Empresariales UTN FRC"
    },
        {
        section: "info-redes",
        title: "SEGUINOS EN NUESTRAS REDES",
        text: "Seguinos en todas nuestras redes sociales para estar siempre actualizado con novedades, eventos y mucho mas que organiza la secretaria.",
        image: `${baseUrl}images/navbar/inchaUTN.png`,
        alt: "Visitas Empresariales UTN FRC"
    }
]
const studentJourney = [
  {
    icon: <SchoolIcon />,
    title: "Conocenos",
    subtitle: "Primer paso",
    description:
    "Donde comienza tu vida universitaria, conociendo el campus, tus compañeros y la facultad.",
    text:"Tu etapa de ingreso es un momento emocionante y crucial en tu vida universitaria. Es el punto de partida donde comienzas a construir tu experiencia académica y social. Durante esta fase, tendrás la oportunidad de familiarizarte con el campus, conocer a tus compañeros de clase y establecer conexiones que pueden durar toda la vida. Además, es un momento para descubrir los recursos y servicios que la universidad ofrece para apoyarte en tu camino académico. Aprovechá al máximo esta etapa inicial, participando en actividades de bienvenida, explorando el campus y conectándote con otros estudiantes para comenzar tu aventura universitaria con el pie derecho.",
    image: `${baseUrl}images/infoSection/becasFRC.jpg`,
  },
  {
    icon: <GroupsIcon />,
    title: "Inscripción",
    subtitle: "Como empezas a ser parte",
    description:
      "Todo lo que debes saber",
      text:
      "Comenzas a ser parte de la comunidad universitaria cuando realizas nuestro ingreso, para completar este proceso tenes que cumplir con una serie de requisitos como haber  <strong>finalizado el secundario, rendir un examen de ingreso y presentar la documentacion necesaria. </strong> Es posible que te preinscribas para rendir aun sin finalizar tus estudios pero te sera requisito una vez hayas realizado los examenes de ingreso, en la instancia de evaluacion deberas rendir <strong> Matematica, Fisica e Introduccion a la vida universitaria. </strong> El centro de estudiantes y la SAE proveen de cursos intensivos para que finalices tu formacion academica en estas 3 disciplinas. Acercate a nuestras charlas de ingreso para mas informacion.",
    image: `${baseUrl}images/journeyJPA/aulaMagnaFRC.jpg`,
  },
  {
    icon: <DocumentScannerIcon />,
    title: "Tramites",
    subtitle: "Documentación y certificados",
    description:
      "Informacion importante para simplificarte la vida.",
      text:"Una vez que ingreses y hayas aprobado los examenes de ingreso deberas realizar una serie de tramites para completar tu inscripcion, entre los cuales se encuentran la presentacion de tu <strong>documentacion personal, la eleccion de tu carrera y la inscripcion a materias.</strong> Uno de los tramites mas importantes para ser estudiante hecho y derecho corresponde al departamento de Alumnos y es indispensable que lo hagas antes de finalizar tu primer año de carrera. La secretaría de asuntos estudiantiles esta disponible para ayudarte a completar estos tramites y resolver cualquier duda que puedas tener durante este proceso, no dudes en acercarte para obtener asistencia personalizada.",
    image:`${baseUrl}images/infoSection/congresoFRC.webp`,
  },
  {
    icon: <SportsSoccerIcon />,
    title: "Vida UTN",
    subtitle: "Más que estudiar",
    description:
      "Ir a la UTN es mas que estudiar.",
    text:"Desde la secretaria de asuntos estudiantiles contamos con un area dedicada a la realización de deportes como actividad recreativa, en nuestra facultad contamos con deportes como:<strong> Futbol, Futbol sala, Voley, Basket, Natación, Arquería</strong> todos estos con sus respectivos entrenamientos para todos los generos. Ademas contamos con convenios con diferentes gimnasios para que puedas entrenar en tu dia a dia, ofreciendo descuentos especiales por ser alumno de nuestra Universidad. Si estas interesado en representar a la facultad dentro de las diferentes disciplinas deportivas podes acercarte a la <strong>S</strong>ecretaria de <strong>A</strong>suntos <strong>E</strong>studiantiles para mas información.",
    image: `${baseUrl}images/infoSection/deportesFRC.webp`,
  },
  {
    icon: <BusinessIcon />,
    title: "Industria",
    subtitle: "Conocé empresas",
    description:
      "Te acercamos a la realidad laboral.",
      text:"Las visitas a empresas son una excelente oportunidad para conocer la realidad del <strong>mundo laboral y establecer contactos con profesionales de la industria.</strong> Durante estas visitas, los estudiantes pueden aprender sobre las prácticas empresariales, las oportunidades de empleo y las tendencias del mercado. La secretaría en conjunto a diferentes catedras de la facultad organiza visitas a empresas de diversos sectores, brindando a los estudiantes la oportunidad de explorar diferentes industrias y <strong>conocer de primera mano las oportunidades laborales disponibles.</strong> Estas visitas son una parte importante de la experiencia universitaria, ya que permiten a los estudiantes conectar su formación académica con el mundo real y prepararse para su futura carrera profesional.",
    image: `${baseUrl}images/infoSection/visitasFRC.jpg`,
  },
  {
    icon: <CampaignIcon />,
    title: "Eventos",
    subtitle: "Congresos y charlas",
    description:
      "Participás en congresos, competencias y actividades académicas.",
      text:"Nuestra facultad organiza y participa en diversos congresos y eventos académicos a lo largo del año, brindando a los estudiantes la oportunidad de <strong>presentar sus trabajos, aprender de expertos en el campo y establecer contactos con profesionales de la industria.</strong> Estos eventos son una excelente oportunidad para ampliar tus conocimientos, compartir tus investigaciones y conectarte con la comunidad académica.  Un ejemplo de esto es el <strong>CNEISI</strong> que se realiza anualmente e incluye otras regionales del pais con eje en la ingeniería en sistemas.",
    image:`${baseUrl}images/infoSection/congresoFRC.webp`,
  },
  {
    icon: <WorkIcon />,
    title: "Pasantías",
    subtitle: "Becas y prácticas",
    description:
      "Aplicás tus conocimientos en proyectos y prácticas profesionales.",
      text:"En el area de becas de la secretaría se realiza la gestión de becas propias de la universidad y te ayudamos aplicar a becas de caracter nacional. La secretaría ofrece las siguientes becas: <strong>Beca de servicio, beca de ayuda economica y beca de investigación. </strong> Que lo economico no sea un impedimento para que puedas estudiar, desde el area nos interesa que puedas acceder a las mejores oportunidades para finalizar tus estudios de grado. Si estas intersado en aplicar a alguna de nuestras becas o como pedir/mantener otras becas estatales podes acercarte a la <strong>S</strong>ecretaria de <strong>A</strong>suntos <strong>E</strong>studiantiles para obtener mas información.",
    image: `${baseUrl}images/navbar/inchaUTN.png`,
  },
  {
    icon: <EmojiEventsIcon />,
    title: "Graduación",
    subtitle: "Meta cumplida",
    description:
      "Obtenés tu título y celebrás el esfuerzo realizado.",
      text:"Después de años de dedicación y esfuerzo, llega el momento de la graduación, un hito significativo en tu vida universitaria. Es el momento en el que obtienes tu título y celebras todo lo que has logrado durante tu carrera. La graduación no solo marca el final de una etapa, sino también el comienzo de nuevas oportunidades y desafíos en tu vida profesional. Es un momento para reflexionar sobre tu viaje académico, agradecer a quienes te apoyaron y mirar hacia el futuro con entusiasmo y confianza.<br/><br/> <strong>¡Felicitamos a todos nuestros ingenieros formados en esta casa de altos estudios publica de calidad y gratuita!</strong>",
    image: `${baseUrl}images/journeyJPA/aulaMagnaFRC.jpg`,
  },
];
const carreras = [
  {
    title: "Ing. Sistemas de Información",
    img: `${baseUrl}images/degreesJPA/ingenieriaSistemas.jpeg`,
    route: "/JPA/sistemas",
    duracion: "5 años",
    intereses: ["Software", "IA", "Datos"],    
  },
  {
    title: "Ing. Electrica",
    img: `${baseUrl}images/degreesJPA/ingenieriaElectrica.jpg`,
    route: "/JPA/electrica",
    duracion: "6 años",
    intereses: ["Centrales", "Tecnologias Renovables", "Red Electrica"],
  },
  {
    title: "Ing. Quimica",
    img: `${baseUrl}images/degreesJPA/ingenieriaQuimica.jpg`,
    route: "/JPA/quimica",
    duracion: "5 años",
    intereses: ["Cerveza", "Centrales Electricas", "Seguridad"],    
  },

  {
    title: "Ing. Metalurgica",
    img: `${baseUrl}images/degreesJPA/ingenieriaMetalurgica.jpg`,
    route: "/JPA/metalurgica",
    duracion: "5 años",
    intereses: ["Materiales", "Construccion", "Espadas"],    
  },

  {
    title: "Ing. Electronica",
    img: `${baseUrl}images/degreesJPA/ingenieriaElectronica.jpg`,
    route: "/JPA/electronica",
    duracion: "6 años",
    intereses: ["Robotica", "IoT", "Automatizacion"],  
  },
  {
    title: "Ing. Civil",
    img: `${baseUrl}images/degreesJPA/ingenieriaCivil.jpg`,
    route: "/JPA/civil",
    duracion: "5 años",
    intereses: ["Construccion", "Reconocimiento", "Progreso Edilicio"],  
  },
  {
    title: "Ing. Industrial",
    img: `${baseUrl}images/degreesJPA/ingenieriaIndustrial.jpg`,
    route: "/JPA/industrial",
    duracion: "5 años",
    intereses: ["Mejoras de Proceso", "Plantas Automatizadas", "Gestion de Recursos"],      
  },
  {
    title: "Ing. Mecanica",
    img:  `${baseUrl}images/degreesJPA/ingenieriaMecanica.jpg`,
    route: "/JPA/mecanica",
    duracion: "5 años",
    intereses: ["Produccion", "Autopartes", "Nuevas Piezas"],      
  },
];
const heroCarrousel = [
  `${baseUrl}images/carrousel/AuditorioUTN.jpeg`,
  `${baseUrl}images/carrousel/EntradaUTN.jpg`,
  `${baseUrl}images/carrousel/estacionamientoUTN.jpg`,
  `${baseUrl}images/carrousel/FedeOlivos.jpeg`,
  `${baseUrl}images/degreesJPA/ingenieriaSistemas.jpeg`,
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
    return (
        <JPAProvider>
            <JPAContent />
        </JPAProvider>
    );
}
function JPAContent(){

    return(
    <Box
        sx={{
        mt: "-90px",
        pt: { xs: "75px" },
        pb: 4,
        minHeight: "calc(110vh - 90px)",
        bgcolor: "var(--background)",
        }}
    >
        <HeroSection/>
        <Container maxWidth="xl">
          <DegreesCarrousel />
          {/* <InterestSection/> */}
          <JourneySection/>
          <EventSection/>
          <ParticipeButton/>
        </Container>
    </Box>
    )
}

function HeroSection(){
    
    return(
    <Box >
        <Box
        sx={{
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
            "& .slick-slider": {
            touchAction: "pan-y",
            },
            "& .slick-list": {
            margin: "0 -10px",
            },
            "& .slick-slide": {
            padding: "0 10px",
            boxSizing: "border-box",
            height: "auto", 
            "& > div": {
                width: "100%",
            }
            },
        }}
        >
        <Slider {...settingsHero}>
            { heroCarrousel.map((image) => {

            return(
                <Box
                sx={{
                    position: 'relative', 
                    height: {xs:"55vh",lg:"75vh"},
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                >
                    <Box
                        sx={{
                        position: 'absolute',
                        px:{xs:1,md:6},
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.65)', 
                        }}
                    >
                        <Stack
                            justifyContent="center"
                            height="100%"
                            spacing={{xs:1,md:4}}
                        >
                        <Chip
                            icon={<SchoolIcon />}
                            label="Universidad Tecnológica Nacional - Córdoba"
                            sx={{
                                width: "fit-content",
                                bgcolor: "rgba(255,255,255,.15)",
                                color: "white",
                                backdropFilter: "blur(10px)",
                                fontWeight: 600,
                            }}
                            />

                            <Typography
                            sx={{
                                color: "white",
                                fontWeight: 700,
                                fontSize: {
                                xs: "3rem",
                                md: "5rem",
                                lg: "6rem",
                                },
                                lineHeight: 1,
                                maxWidth: "900px",
                            }}
                            >
                            Ingeniería es más
                            <br />
                            que una carrera
                            </Typography>

                            <Typography
                            sx={{
                                color: "rgba(255,255,255,.85)",
                                fontSize: {xs:"1rem", md:"1.4rem"},
                                maxWidth: "700px",
                            }}
                            >
                            Formate en una de las intituciones educativas mas importantes de la Argentina y descubrí una experiencia
                            universitaria que va mucho más allá del aula.

                            </Typography>
                            <Stack
                            direction="row"
                            spacing={{xs:1,md:2}}
                            >
                            <Link 
                            to={`/JPA#carreras`}
                            
                             sx={{ color: "white ", fontSize:"18px", textDecoration: "none !important" }}>
                                <SAEButton
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    bgcolor: "#FFD54F",
                                    color: "#123666",

                                    "&:hover": {
                                        bgcolor: "#FFCA28",
                                    },
                                    }}
                                >
                                    Explorar Carreras
                                </SAEButton>
                            </Link>
                            <Link 
                            to={`/JPA#eventos`}
                             sx={{ color: "white ", fontSize:"18px", textDecoration: "none !important" }}>
                                <SAEButton
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                    fontWeight: 700,
                                    color: "white",
                                    borderColor: "white",
                                    bgcolor:"none",
                                    "&:hover": {
                                        borderColor: "white",
                                        bgcolor: "rgba(255,255,255,.08)",
                                    },
                                    }}
                                >
                                    Próximos Eventos
                                </SAEButton>
                             </Link>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            )})}          
            </Slider>
            
        </Box>
        <Container
            maxWidth="lg"
            sx={{
            mt: -3,
            position: "relative",
            zIndex: 5,
            }}
        >
        <Paper
          elevation={5}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          <Grid container>
            <Grid item size={3}>
              <StatCard
                number="8"
                label="Carreras"
              />
            </Grid>

            <Grid item size={3}>
              <StatCard
                number="10K"
                label="Estudiantes"
              />
            </Grid>

            <Grid item size={3}>
              <StatCard
                number="+150"
                label="Convenios"
              />
            </Grid>

            <Grid item size={3}>
              <StatCard
                number="+50"
                label="Años"
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>        
    </Box>
    );
}

function DegreesCarrousel() {
    const dragRef = useRef(false);
    const navigate = useNavigate();
    return(
        <section key={"carreras"} id={"carreras"}
         style={{ scrollMarginTop: '120px' }}>
        <Box
        sx={{
            mt:10,
            textAlign: "center",
            mb: 6,                       
        }}
        >
        <Typography
            variant="h2"
            fontWeight={900}
        >
            Conocé nuestras carreras
        </Typography>

        <Typography
            variant="h6"
            color="text.secondary"
        >
            Elegí el camino para transformar el mundo.
        </Typography>
        </Box>        
            <Box
            sx={{
                width: "100%",
                boxSizing: "border-box",
                overflow: "hidden",
                "& .slick-slider": {
                width: "100%",
                touchAction: "pan-y",
                },
                "& .slick-list": {
                margin: "0 -10px",
                },
                "& .slick-slide": {
                padding: "0 10px",
                boxSizing: "border-box",
                height: "auto", 
                "& > div": {
                    width: "100%",
                    margin: "0 -10px"
                }
                },
            }}
            >
                 <Slider {...settings}
                 swipe
                    draggable
                    beforeChange={() => {
                        dragRef.current = true;
                    }}
                    afterChange={() => {
                        setTimeout(() => {
                        dragRef.current = false;
                        }, 100);
                    }}
                 >
                   { carreras.map((carrera) => {
                    return(  
                    <Card
                    //onClick={() => navigate(carrera.route)}
                    sx={{
                        width: "100%",
                          objectFit: "cover",
                          display: "block",
                        height: 400,
                        borderRadius: 5,
                        overflow: "hidden",
                        cursor: "pointer",
                        position: "relative",
                        transition: "all .35s ease",
                        my:2,
                        mx:1,
                        "&:hover": {
                        transform: "scale(1.01)",
                        boxShadow: "0 15px 25px rgba(0,0,0,.15)",
                        },    "&:hover .hover-overlay": {
                        opacity: 1,
                        },
                    }}
                    >
                        <Box
                        component="img"
                        src={carrera.img}
                        alt={carrera.title}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                        />
                        <Box
                        sx={{
                            position: "absolute",
                            inset: 0,

                            background:
                            "linear-gradient(to top, rgba(0,0,0,.95), rgba(0,0,0,.15))",
                        }}
                        />
                        <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 3,
                            color: "white",
                        }}
                        >
                            <Typography
                            sx={{
                                my: 0,
                                opacity: .85,
                            }}
                            >
                            📚 {carrera.duracion}
                            </Typography>                            
                            <Typography
                            mt={0.5}
                                variant="h5"
                                fontWeight={800}
                                >
                                {carrera.title}
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={1}
                                mt={1}
                                pb={1}
                                flexWrap="wrap"
                                >
                                    {carrera.intereses.map((item) => (
                                    <Chip
                                        key={item}
                                        label={item}
                                        size="small"
                                        sx={{
                                        bgcolor: "rgba(255,255,255,.15)",
                                        color: "white",
                                        backdropFilter: "blur(10px)",
                                        }}
                                    />
                                    ))}
                                                           
                            </Stack>

                        </Box> 
                        <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0,0,0,.55)",
                            opacity: 0,
                            transition: "all .3s ease",
                        }}
                        onClick={() => {
                        if (dragRef.current) return;
                            navigate(carrera.route);
                        }}
                        className="hover-overlay"
                        >
                            <Typography
                            sx={{
                                color: "white",
                                fontWeight: 700,
                                fontSize: "1.2rem",
                                letterSpacing: 1,
                            }}
                            >
                            Empeza tu aventura hoy →
                            </Typography>
                        </Box>                  
                    </Card>
                    )})}
                 </Slider>
                
            </Box>        
        </section>
    )
}

function StatCard({ number, label }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 4,
        bgcolor: "white",
      }}
    >
      <Typography
      fontSize={{xs:"1.3rem",md:"2.5rem"}}
        variant="h4"
        fontWeight={{xs:700,md:900}}
        color="#123666"
      >
        {number}
      </Typography>

      <Typography
        color="text.secondary"
        fontWeight={{xs:500,md:800}}
      >
        {label}
      </Typography>
    </Box>
  );
}
function InterestSection(){
  return(
      <Box
          sx={{
          py: {xs:4,md:12},
      }}
      >
      <Typography
      variant="h3"
      fontSize={{xs:"1.5rem",md:'2.3rem'}}
      fontWeight={800}
      textAlign={{xs:"left",md:"center"}}
      >
      Una carrera te forma.
      <br />
      La experiencia universitaria te transforma.
      </Typography>
      <Typography
      variant="h6"
      fontSize={{xs:"1rem",md:"1.5rem"}}
        textAlign={{xs:"left",md:"center"}}
      color="text.secondary"
      sx={{ my: 3 }}
      >
      En la UTN no solamente asistís a clases.
      Participás de deportes, congresos,
      becas, visitas empresariales y actividades
      que complementan tu formación profesional.
      </Typography>
          <InteractiveGrid items={information}/>
      </Box>
  );
}
function EventSection(){
    const {
    eventosJPA,loadingEventos
  } = useJPA();
  return(
   <section key={"eventos"} id={"eventos"}
         style={{ scrollMarginTop: '20px' }}>  
      <Box
      sx={{
      mt: {xs:4,md:12},
      }}
      >
        <Typography
        variant="h3"
        fontSize={{xs:"1.5rem",md:'2.3rem'}}
        fontWeight={800}
        textAlign={{xs:"left",md:"center"}}
        >
        Eventos en nuestra Universidad.
        </Typography>
        <Typography
        variant="h6"
        fontSize={{xs:"1rem",md:"1.5rem"}}
        textAlign={{xs:"left",md:"center"}}
        color="text.secondary"
        sx={{ my: 3 }}
        >
        La Universidad no es solo para los que ya estan sino para vos tambien, el futuro llego hoy preparate para una experiencia unica!
        </Typography>

        {loadingEventos && (
          <Stack alignItems="center" width={"100%"} gap={1}>
            <SAESpinner size="S" />
          </Stack>
        )}
        {!loadingEventos && eventosJPA && (
          <CalendarEvent eventos={eventosJPA} />
        )}
        
      </Box>
    </section>
  );
}
function JourneySection(){
  const [selectedStep, setSelectedStep] = useState(0);
    return(
      <Box textAlign="center" mb={8} sx={{position:"relative",zIndex:1,mt: {xs:4,md:12},p:{xs:2,md:4}}}>
        <Typography
          variant="h2"
          fontWeight={900}
        >
          Tu camino en la UTN
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
        >
          Descubrí todo lo que podés vivir durante tu formación.
        </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              mb: 8,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "35px",
                left: 0,
                right: 0,
                height: 4,
                bgcolor: "#DCE3EC",
                zIndex: 0,
              }}
            />
 
            </Box>

            <Box sx={{
              display: "block",
              mb: 8}}>
              <Grid container direction="row" spacing={4}>
              {studentJourney.map((step, index) => (
                <Box
                  key={index}
                  onMouseEnter={() => setSelectedStep(index)}
                  onClick={() => setSelectedStep(index)}
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  <Avatar
                  sx={{
                    mx: "auto",
                    width: 70,
                    height: 70,
                    bgcolor:
                      selectedStep === index
                        ? "#123666"
                        : "#E8EEF5",
                    color:
                      selectedStep === index
                        ? "white"
                        : "#123666",

                    transition: ".3s",
                    transform:
                      selectedStep === index
                        ? "scale(1.15)"
                        : "scale(1)",
                  }}
                  >
                  {step.icon}
                  </Avatar>
                  <Typography
                    mt={2}
                    fontWeight={700}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    display={{xs:"none",md:"block"}}
                    variant="caption"
                    color="text.secondary"
                  >
                    {step.subtitle}
                  </Typography>
                </Box>
                ))}
                </Grid>
                <Box
                sx={{
                  height: 6,
                  width: `${
                    ((selectedStep + 1) /
                      studentJourney.length) *
                    100
                  }%`,
                  bgcolor: "#123666",
                  transition: ".4s",
                }}
              />
              </Box>
              <Card
                sx={{
                  borderRadius: 5,
                  overflow: "hidden",
                  mt: 2,
                }}
              >
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 5 }} m={0}>
                  <Box
                    component="img"
                    src={studentJourney[selectedStep].image}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: ".4s",
                    }}
                  />                    
                </Grid>
                <Grid size={{ xs: 12, md: 7 }} m={0}>
                  <Box p={5}>
                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      {studentJourney[selectedStep].title}
                    </Typography>
                    <Typography variant="body1" 
                    sx={{ 
                      whiteSpace: "pre-line",
                      color:"black",
                      mt:2,
                      fontSize: '1.25rem',
                      textAlign: "left"}}
                    dangerouslySetInnerHTML={{ __html: studentJourney[selectedStep].text }} >

                    </Typography>                   
                  </Box>
                </Grid>
              </Grid> 
          </Card>     
      </Box>
    );
  }
/* LO DEJO GUARDADO ACA DESPUES LO IMPLEMENTAMOS
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    
    h1: {
      fontWeight: 700,
      fontSize: '2rem', // 32px
      '@media (min-width:960px)': { fontSize: '3.5rem' }, // 56px
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.625rem', // 26px
      '@media (min-width:960px)': { fontSize: '2.5rem' }, // 40px
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.375rem', // 22px
      '@media (min-width:960px)': { fontSize: '2rem' }, // 32px
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem', // 20px
      '@media (min-width:960px)': { fontSize: '1.5rem' }, // 24px
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem', // 18px
      '@media (min-width:960px)': { fontSize: '1.25rem' }, // 20px
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem', // 16px (Se queda igual en ambos porque ya es un tamaño base)
    },
  },
});

export default theme;*/