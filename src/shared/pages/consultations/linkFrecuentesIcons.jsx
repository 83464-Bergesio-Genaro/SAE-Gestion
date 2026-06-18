import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LinkIcon from "@mui/icons-material/Link";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import WorkIcon from "@mui/icons-material/Work";

export const LINK_FRECUENTE_ICONS = [
  { id: 0, label: "Link", icon: LinkIcon },
  { id: 1, label: "Documento", icon: DescriptionIcon },
  { id: 2, label: "Articulo", icon: ArticleIcon },
  { id: 3, label: "Formulario", icon: AssignmentIcon },
  { id: 4, label: "Calendario", icon: CalendarMonthIcon },
  { id: 5, label: "Turno", icon: EventAvailableIcon },
  { id: 6, label: "Salud", icon: LocalHospitalIcon },
  { id: 7, label: "Becas", icon: SchoolIcon },
  { id: 8, label: "Deportes", icon: SportsSoccerIcon },
  { id: 9, label: "Trabajo", icon: WorkIcon },
  { id: 10, label: "Contacto", icon: EmailIcon },
  { id: 11, label: "Ayuda", icon: ContactSupportIcon },
  { id: 12, label: "Favorito", icon: FavoriteIcon },
  { id: 13, label: "Biblioteca", icon: MenuBookIcon },
];

export const getLinkFrecuenteIconByIndex = (index) => {
  const normalizedIndex = Number(index);
  return (
    LINK_FRECUENTE_ICONS.find((item) => item.id === normalizedIndex) ??
    LINK_FRECUENTE_ICONS[0]
  );
};
