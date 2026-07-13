export const calendarDays = [
  { label: "Lunes", value: 1 },
  { label: "Martes", value: 2 },
  { label: "Miércoles", value: 3 },
  { label: "Jueves", value: 4 },
  { label: "Viernes", value: 5 },
];
export const completeWeekDays = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
export const SCHOLARSHIPS_STATES = {
  SOLICITADO: "solicitado",
  RECHAZADO: "rechazado",
  ACEPTADO_INICIO: "aceptado_inicio",
  ACEPTADO_PAGADO: "aceptado_pagado",
  FIN_BECADO: "fin_becado",
};

export const SCHOLARSHIP_TYPE = {
  ECONOMICA: "Beca Economica",
  SERVICIO: "Beca de Servicio",
  INVESTIGACION: "Beca de Investigacion",
};

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const DEFAULT_ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";
export const PRESS_DOCS_PER_PAGE = 5;
export const PREVIEW_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "pdf",
]);

export const DOCUMENT_PREVIEW_DEFAULT_MESSAGES = {
  fallbackTitle: "Vista previa",
  fallbackName: "archivo",
  noId: "No se encontro el id del documento para previsualizar.",
  notSupported: "Solo se permite vista previa para imagenes o PDF.",
  loadError: "No se pudo cargar la imagen.",
};

export const CAREERS = [
  { value: "sistemas", label: "Sistemas" },
  { value: "electrica", label: "Electrica" },
  { value: "electronica", label: "Electronica" },
  { value: "mecanica", label: "Mecanica" },
  { value: "metalurgica", label: "Metalurgica" },
  { value: "quimica", label: "Quimica" },
  { value: "industrial", label: "Industrial" },
  { value: "civil", label: "Civil" },
  { value: "frc", label: "FRC" },
];

export const carreras = CAREERS;

export const PLACEHOLDER_IMAGE = "images/principal/newsGeneric.webp";

export const DOCS_PER_PAGE = 5;

