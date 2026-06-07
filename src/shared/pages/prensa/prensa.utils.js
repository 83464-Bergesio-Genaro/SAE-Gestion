// ---------------------------------------------------------------------------
// Document preview
// ---------------------------------------------------------------------------

export const PREVIEW_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "pdf",
]);

export function getDocumentId(doc) {
  return doc?.id ?? doc?.id_documento ?? doc?.idDocumento ?? null;
}

function hasRealDocumentName(value) {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return false;
  const genericNames = new Set(["documento", "archivo", "file", "document"]);
  return !genericNames.has(normalized);
}

export function getDocumentName(doc, fallback = "Archivo") {
  const candidate = doc?.nombre_documento || doc?.nombreDocumento || doc?.titulo;
  return hasRealDocumentName(candidate) ? candidate : fallback;
}

function normalizeExtension(value) {
  if (!value) return "";
  let normalized = String(value).trim().toLowerCase();
  if (normalized.includes("/")) normalized = normalized.split("/").pop();
  if (normalized.includes(";")) normalized = normalized.split(";")[0];
  return normalized.replace(/^\./, "");
}

export function getDocumentExtension(doc) {
  const directExtension = normalizeExtension(doc?.extension);
  if (directExtension) return directExtension;
  const fileName = doc?.nombre_documento || doc?.nombreDocumento || doc?.titulo || "";
  const parts = fileName.split(".");
  if (parts.length < 2) return "";
  return normalizeExtension(parts.pop());
}

export function isPreviewableDocument(doc) {
  return PREVIEW_EXTENSIONS.has(getDocumentExtension(doc));
}

export function getImageSource(doc) {
  if (!doc?.datos_documento) return "";
  if (doc.datos_documento.startsWith("data:")) return doc.datos_documento;

  const mimeByExtension = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
  };
  const mime = mimeByExtension[getDocumentExtension(doc)] || "image/jpeg";
  return `data:${mime};base64,${doc.datos_documento}`;
}

// ---------------------------------------------------------------------------
// Priority
// ---------------------------------------------------------------------------

export const ACCENT_COLORS = {
  2: "#d32f2f",
  1: "#ed6c02",
  0: "#1565c0",
};

export function prioridadLabel(prioridad) {
  const map = {
    0: { label: "Normal", color: "default" },
    1: { label: "Media",  color: "warning" },
    2: { label: "Alta",   color: "error" },
  };
  return map[prioridad] ?? map[0];
}

export function getAccentColor(prioridad) {
  return ACCENT_COLORS[prioridad] ?? ACCENT_COLORS[0];
}

// ---------------------------------------------------------------------------
// Filter & sort
// ---------------------------------------------------------------------------

/**
 * Filters by search term and sorts by date or name.
 * @param {Array} publicaciones
 * @param {string} busqueda
 * @param {string} ordenFecha  — one of: ""|"fecha_inicio_asc"|"fecha_inicio_desc"|"fecha_vigencia_asc"|"fecha_vigencia_desc"
 * @param {string} ordenNombre — one of: ""|"asc"|"desc"
 * @returns {Array}
 */
export function filterAndSort(publicaciones, busqueda, ordenFecha, ordenNombre) {
  let result = [...publicaciones];

  if (busqueda.trim()) {
    const termino = busqueda.toLowerCase();
    result = result.filter(
      (pub) =>
        pub.titulo_publicacion?.toLowerCase().includes(termino) ||
        pub.descripcion?.toLowerCase().includes(termino)
    );
  }

  if (ordenNombre === "asc") {
    result.sort((a, b) =>
      (a.titulo_publicacion ?? "").localeCompare(b.titulo_publicacion ?? "")
    );
  } else if (ordenNombre === "desc") {
    result.sort((a, b) =>
      (b.titulo_publicacion ?? "").localeCompare(a.titulo_publicacion ?? "")
    );
  }

  if (ordenFecha === "fecha_inicio_asc") {
    result.sort((a, b) => new Date(a.fecha_inicio ?? 0) - new Date(b.fecha_inicio ?? 0));
  } else if (ordenFecha === "fecha_inicio_desc") {
    result.sort((a, b) => new Date(b.fecha_inicio ?? 0) - new Date(a.fecha_inicio ?? 0));
  } else if (ordenFecha === "fecha_vigencia_asc") {
    result.sort((a, b) => new Date(a.fecha_vigencia ?? 0) - new Date(b.fecha_vigencia ?? 0));
  } else if (ordenFecha === "fecha_vigencia_desc") {
    result.sort((a, b) => new Date(b.fecha_vigencia ?? 0) - new Date(a.fecha_vigencia ?? 0));
  }

  return result;
}

// ---------------------------------------------------------------------------
// Date formatting
// ---------------------------------------------------------------------------

const DATE_FORMAT_SHORT = { year: "numeric", month: "short", day: "numeric" };
const DATE_FORMAT_LONG  = { year: "numeric", month: "long",  day: "numeric" };

export function formatDateShort(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("es-AR", DATE_FORMAT_SHORT);
}

export function formatDateLong(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("es-AR", DATE_FORMAT_LONG);
}

// ---------------------------------------------------------------------------
// Download helper
// ---------------------------------------------------------------------------

export function downloadDocument(doc, fallbackName = "archivo") {
  const imageSource = getImageSource(doc);
  if (!imageSource) return;

  const extension = getDocumentExtension(doc);
  const fileName = getDocumentName(doc, fallbackName);
  const downloadName = fileName.includes(".")
    ? fileName
    : `${fileName}.${extension || "jpg"}`;

  const link = document.createElement("a");
  link.href = imageSource;
  link.download = downloadName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
