// Business-logic utilities for the Prensa feature.
// No React dependencies — pure functions only.

import { PRENSA_STRINGS as PS} from "./prensa.strings";

// ---------------------------------------------------------------------------
// Priority options (single source of truth)
// ---------------------------------------------------------------------------
export const PRIORIDAD_OPTIONS = [
  { value: 0, label: PS.priorityNormal, chipColor: "success" },
  { value: 1, label: PS.priorityMedium, chipColor: "warning" },
  { value: 2, label: PS.priorityHigh, chipColor: "error" },
];

export const DOCS_PER_PAGE = 5;

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/**
 * Extracts the YYYY-MM-DD portion from an ISO date string (for pre-loading
 * date inputs in edit forms).
 */
export function toDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

/**
 * Converts a YYYY-MM-DD string to an ISO 8601 string using local time.
 * start-of-day → 00:00:00, end-of-day → 23:59:00
 */
export function toIsoWithFixedTime(dateStr, isEndOfDay = false) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(
    year,
    month - 1,
    day,
    isEndOfDay ? 23 : 0,
    isEndOfDay ? 59 : 0,
    0,
    0
  );
  return date.toISOString();
}

// ---------------------------------------------------------------------------
// Document helpers
// ---------------------------------------------------------------------------
const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"];

/**
 * Returns "Imagen" or "Documento" for a document object.
 * Checks filename extension first, then the `extension` field as fallback.
 */
export function getTipoDocumento(doc = {}) {
  const nombre = (doc.nombre_documento || "").toLowerCase().trim();
  const nombreMatch = nombre.match(/\.([a-z0-9]+)$/);
  if (nombreMatch) {
    return IMAGE_EXTS.includes(nombreMatch[1])
      ? PS.tipoImagen
      : PS.tipoDocumento;
  }

  const extField = (doc.extension || "").toLowerCase();
  const hasImageExt = /(\.|\b)(png|jpg|jpeg|gif|webp|bmp|svg)(\b|\s|,|$)/.test(extField);
  return hasImageExt ? PS.tipoImagen : PS.tipoDocumento;
}

/**
 * Derives whether a downloaded document should be rendered as PDF.
 * Checks the `datos_documento` data-URL prefix first, then `extension`.
 */
export function isPdfDocument(data = {}) {
  if (data.datos_documento?.startsWith("data:application/pdf")) return true;
  return (data.extension || "").toLowerCase() === "pdf";
}

// ---------------------------------------------------------------------------
// Publication helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if the publication is still within its validity period.
 */
export function vigenciaActiva(fecha_vigencia) {
  if (!fecha_vigencia) return false;
  return new Date(fecha_vigencia) >= new Date();
}

/**
 * Returns an empty publication object for new-publication forms.
 */
export function emptyPublicacion() {
  return {
    titulo_publicacion: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_vigencia: "",
    prioridad: 0,
    no_dar_baja: false,
    visualizaciones: 0,
  };
}
