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
