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


export const getFirstRecord = (value) => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

export const valuesAreEqual = (current, original) =>
  JSON.stringify(current ?? null) === JSON.stringify(original ?? null);

export const cleanObjectFields = (data) => {
  if (!data) return { isValid: false, cleanedData: {} };

  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

  return {
    isValid: Object.keys(cleanedData).length > 0,
    cleanedData,
  };
};

export function obtenerLegajoDesdeEmail(email = "") {
  return email.split("@")[0] ?? "";
}

export function getErrorMessage(error, fallback) {
  return (
    error?.data?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export function filterTournaments(tournaments, search) {
  const term = search.trim().toLowerCase();
  if (!term) return tournaments;

  return tournaments.filter((row) =>
    [row.nombre_torneo, row.nombre_deporte, row.docente_responsable].some(
      (value) => String(value ?? "").toLowerCase().includes(term),
    ),
  );
}

export const getDialogTitle = (entity, dialogMode) => {
  if (dialogMode === "create") return `Nuevo ${entity}`;
  if (dialogMode === "delete") return `Eliminar ${entity}`;
  return `Editar ${entity}`;
};