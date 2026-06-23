const baseUrl = import.meta.env.BASE_URL;

import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import HelpIcon from "@mui/icons-material/Help";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import HubIcon from '@mui/icons-material/Hub';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

export const sharedMenu = [
  {
    label: "Inicio",
    path: "/",
    color: "#FFFFFF",
    image: `${baseUrl}images/navbar/estacionamientoUTN.jpg`,
  },
  {
    label: "Estudiar en la UTN",
    path: "/JPA",
    color: "#BAE6FF",
    image: `${baseUrl}images/navbar/IngresoUTN.png`,
  },
  {
    label: "Iniciar Sesion",
    path: "/login",
    color: "#E5EAFF",
    image: `${baseUrl}images/navbar/inchaUTN.png`,
  },
];

export const studentMenu = [
  {
    label: "Inicio",
    path: "/Principal",
    color: "#8FABD4",
    icon: Diversity3Icon,
    descripcion: "No deberia mostrar esta descripcion.",
  },
  {
    label: "Deportes",
    path: "/Mis-Deportes",
    color: "#3062AC",
    icon: SportsHandballIcon,
    descripcion: "Gestiona tus inscripciones a los deportes y consulta torneos."
  },
  {
    label: "Becas",
    path: "/Mis-Becas",
    color: "#184B97",
    icon: Diversity3Icon,
    descripcion: "Gestiona tus inscripciones a las becas, consulta requisitos.",    
  },
  {
    label: "Salud",
    path: "/Mi-Salud",
    color: "#814773",
    icon: HealthAndSafetyIcon,
    descripcion: "Consulta servicios de salud y gestiona tus turnos médicos.",
  },
  {
    label: "Viajes",
    path: "/Mis-Viajes",
    color: "#E5CCB1",
    icon: HealthAndSafetyIcon,
    descripcion: "Consulta servicios de salud y gestiona tus turnos médicos.",
  },
  {
    label: "Consultas",
    path: "/Consultas",
    color: "#6B76A8",
    icon: HelpIcon,
    descripcion: "Encontrá respuestas frecuentes o comunicate con la SAE.",
  }
];

export const employedMenu = [
  {
    label: "Inicio",
    path: "/Inicio",
    color: "#8FABD4",
    icon: Diversity3Icon,
    descripcion: "No deberia mostrar esta descripcion.",
  },
  {
    label: "Deportes",
    path: "/Gestion-Deportes",
    color:"#56719a",
    icon: SportsHandballIcon,
    descripcion: "Gestiona los deportes, los docentes, horarios y torneos."
  },
  {
    label: "Becas",
    path: "/Gestion-Becas",
    color:"#3F76C8",
    icon: Diversity3Icon,
    descripcion: "Permite administrar todas las becas de las secretaria.",       
  },
  {
    label: "Prensa",
    path: "/Gestion-Prensa",
    color:"#5E8ACC",
    icon: NewspaperIcon,
    descripcion: "Gestiona las noticias y documentacion que veran los alumnos.",   
  },
    {
    label: "Compras",
    path: "/Gestion-Compras",
    color:"#5E8ACC",
    icon: ShoppingCartIcon,
    descripcion: "Registra las compras que va realizando el area.",   
  },
    {
    label: "Viajes",
    path: "/Gestion-Viajes",
    color:"#5E8ACC",
    icon: LocalAirportIcon,
    descripcion: "Administra los viajes organizados por la institución.",   
  },
  {
    label: "JPA",
    path: "/Gestion-JPA",
    color:"#e4f7d8",
    icon: HubIcon,
    descripcion: "Gestiona las oportunidades a los nuevos ingresantes!",        
  },
  {
    label: "Salud",
    path: "/Gestion-Salud",
    color:"#E4F7D8",
    icon: HealthAndSafetyIcon,
    descripcion: "Consulta servicios de salud y gestiona tus turnos médicos.",
  },
    {
    label: "Consultas",
    path: "/Gestion-Consultas",
    color: "#6B76A8",
    icon: HelpIcon,
    descripcion: "Revisá el contenido visible para estudiantes y planificá su administración.",
  }
];

export const adminMenu = [
  {
    label: "Inicio",
    path: "/Inicio",
    color: "#8FABD4",
    icon: Diversity3Icon,
    descripcion: "No deberia mostrar esta descripcion.",
  },
  {
    label: "Deportes",
    path: "/Gestion-Deportes",
    color:"#56719a",
    icon: SportsHandballIcon,
    descripcion: "Gestiona los deportes, los docentes, horarios y torneos."
  },
  {
    label: "Becas",
    path: "/Gestion-Becas",
    color:"#3F76C8",
    icon: Diversity3Icon,
    descripcion: "Permite administrar todas las becas de las secretaria.",       
  },
  {
    label: "Prensa",
    path: "/Gestion-Prensa",
    color:"#5E8ACC",
    icon: NewspaperIcon,
    descripcion: "Gestiona las noticias y documentacion que veran los alumnos.",   
  },
      {
    label: "Compras",
    path: "/Gestion-Compras",
    color:"#5E8ACC",
    icon: ShoppingCartIcon,
    descripcion: "Registra las compras que va realizando el area.",   
  },
    {
    label: "Viajes",
    path: "/Gestion-Viajes",
    color:"#5E8ACC",
    icon: LocalAirportIcon,
    descripcion: "Administra los viajes organizados por la institución.",   
  },
  {
    label: "JPA",
    path: "/Gestion-JPA",
    color:"#e4f7d8",
    icon: HubIcon,
    descripcion: "Gestiona las oportunidades a los nuevos ingresantes!",       
  },
  {
    label: "Salud",
    path: "/Gestion-Salud",
    color:"#E4F7D8",
    icon: HealthAndSafetyIcon,
    descripcion: "Consulta servicios de salud y gestiona tus turnos médicos.",
  },
  {
    label: "Consultas",
    path: "/Gestion-Consultas",
    color: "#6B76A8",
    icon: HelpIcon,
    descripcion: "Revisá el contenido visible para estudiantes y planificá su administración.",
  },
  {
    label: "Empleados",
    path: "/Gestion-Usuarios",
    color:"#e4f7d8",
    icon: BadgeIcon,
    descripcion: "Gestiona los empleados y usuarios que pueden acceder a la aplicacion.",    
  },
  {
    label: "Reportes",
    path: "/Reportes-Estadisticas",
    color:"#e4f7d8",
    icon: QueryStatsIcon,
    descripcion: "Analiza el funcionamiento de cada Area.",    
  }

];
