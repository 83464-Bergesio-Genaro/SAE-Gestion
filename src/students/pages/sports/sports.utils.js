export function isPdfDocument(data = {}) {
  if (data.datos_documento?.startsWith("data:application/pdf")) return true;
  return (data.extension || "").toLowerCase() === "pdf";
}

export function construirNombre(formato, data, extension) {
  let nombre = formato;

  Object.keys(data).forEach((key) => {
    nombre = nombre.replace(`{${key}}`, data[key]);
  });

  return `${nombre}${extension}`;
}

export const MAX_SIZE_MB = 5;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
export const tiposPermitidos = ["application/pdf", "image/jpeg", "image/png"];

export const INITIAL_PREVIEW = {
  open: false,
  loading: false,
  title: "",
  imageSrc: null,
  isPdf: false,
  error: null,
};

export const SPORTS_REQUIRED_DOCUMENTS = [
  {
    id_tipo_documento: null,
    nombre: "Certificado de Alumno Regular",
    descripcion:
      "Certificado vigente que acredita tu condición de estudiante regular.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_AlumnoRegular",
    id_archivo: null,
    extension: null,
    required: true,
  },
  {
    id_tipo_documento: null,
    nombre: "Fotocopia Documento",
    descripcion:
      "Copia legible del frente y dorso de tu DNI en un único archivo.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_DNI",
    id_archivo: null,
    extension: null,
    required: true,
  },
  {
    id_tipo_documento: null,
    nombre: "Ficha Medica o E.M.M.A.C",
    descripcion:
      "Certificado médico vigente que indica que estás apto para realizar actividad física.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_FichaMedica",
    id_archivo: null,
    extension: null,
    required: true,
  },
];

export function formatSportsDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString("es-AR");
}

export function formatBoolean(value) {
  if (typeof value !== "boolean") return value;
  return value ? "Sí" : "No";
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

export const SPORTS_TOURNAMENT_COLUMNS = [
  { field: "nombre_torneo", headerName: "Nombre", flex: 1, minWidth: 300 },
  {
    field: "fecha_inicio",
    headerName: "Fecha Inicio",
    flex: 1,
    minWidth: 100,
    valueFormatter: (value) => formatSportsDate(value),
  },
  {
    field: "fecha_fin",
    headerName: "Fecha Fin",
    flex: 1,
    width: 100,
    valueFormatter: (value) => formatSportsDate(value),
  },
  {
    field: "fecha_limite_inscripcion",
    headerName: "Fecha Límite Inscripción",
    flex: 1,
    width: 100,
    valueFormatter: (value) => formatSportsDate(value),
  },
  {
    field: "activo",
    headerName: "Activo",
    flex: 1,
    maxWidth: 80,
    valueFormatter: (value) => formatBoolean(value),
  },
  {
    field: "nombre_deporte",
    headerName: "Deporte",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "docente_responsable",
    headerName: "Docente Responsable",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "cupo_jugadores",
    headerName: "Cupo",
    flex: 1,
    maxWidth: 80,
  },
];
