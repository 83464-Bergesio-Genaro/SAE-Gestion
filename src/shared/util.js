/**
 * Utilidades candidatas para centralizar lógica repetida entre providers.
 *
 * Este archivo todavía no es consumido por los providers. Cada comentario
 * indica dónde existe actualmente una implementación equivalente para poder
 * evaluar la migración de forma gradual.
 */

/**
 * Repetida en:
 * - employed/context/providers/consultationsProvider.jsx
 * - employed/context/providers/travelProvider.jsx
 * - employed/context/providers/purchaseProvider.jsx
 * - employed/context/providers/employProvider.jsx
 * - students/context/providers/healthProvider.jsx
 */
export const formatHeader = (key = "") =>
  String(key)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

/**
 * Repetida sin transformaciones adicionales en:
 * - employed/context/providers/consultationsProvider.jsx
 * - employed/context/providers/travelProvider.jsx
 * - employed/context/providers/employProvider.jsx
 * - students/context/providers/consultationsProvider.jsx
 *
 * purchaseProvider y healthProvider agregan datos propios, por eso deberían
 * seguir usando sus implementaciones o pasar una función `mapRow`.
 */
export const generateRows = (data = [], mapRow = (item) => item) =>
  [...data]
    .sort((a, b) => Number(a?.id ?? 0) - Number(b?.id ?? 0))
    .map((item, index) => ({
      id: item?.id ?? index,
      ...mapRow(item, index),
    }));

/**
 * Repetida en:
 * - employed/context/providers/purchaseProvider.jsx
 * - students/context/providers/travelProvider.jsx
 * - students/pages/sports/sports.utils.js
 * - students/pages/scholarships/scholarship.utils.js
 */
export const createInitialPreview = () => ({
  open: false,
  loading: false,
  title: "",
  imageSrc: null,
  isPdf: false,
  error: null,
});

export const INITIAL_PREVIEW = createInitialPreview();

/**
 * Repetida en los mismos módulos de documentos que createInitialPreview.
 */
export const isPdfDocument = (data = {}) => {
  if (data.datos_documento?.startsWith("data:application/pdf")) return true;

  return (
    String(data.extension || "")
      .replace(/^\./, "")
      .toLowerCase() === "pdf"
  );
};

/**
 * Repetida como `buildDocumentName` o `construirNombre` en:
 * - employed/context/providers/purchaseProvider.jsx
 * - students/context/providers/travelProvider.jsx
 * - students/pages/sports/sports.utils.js
 * - students/pages/scholarships/scholarship.utils.js
 */
export const buildDocumentName = (format = "", data = {}, extension = "") => {
  const name = Object.entries(data).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`\\{${key}\\}`, "gi"), value ?? ""),
    format,
  );

  return `${name}${extension}`;
};

export const construirNombre = buildDocumentName;

/**
 * Repetida en los handlers de archivos de purchase, travel, sports y
 * scholarships.
 */
export const getFileExtension = (file) => {
  const extension = file?.name?.split(".").pop();
  return extension ? `.${extension.toLowerCase()}` : "";
};

/**
 * Repetida en los handlers de archivos de purchase, travel, sports y
 * scholarships.
 */
export const renameFile = (file, fileName) =>
  new File([file], fileName, {
    type: file.type,
    lastModified: file.lastModified,
  });

/**
 * Repetida con distintas variantes de propiedades en:
 * - employed/context/providers/purchaseProvider.jsx
 * - employed/context/providers/pressProvider.jsx
 */
export const getDocumentId = (document = {}) =>
  document?.id_documento ??
  document?.idDocumento ??
  document?.id_archivo ??
  document?.id ??
  null;

/**
 * Nombre canónico de un documento persistido.
 * El contrato del backend devuelve siempre `nombre_documento`.
 */
export const getDocumentName = (document = {}, fallback = "") =>
  document?.nombre_documento ?? fallback;

/**
 * El mismo setState está repetido en:
 * - students/context/providers/consultationsProvider.jsx
 * - students/context/providers/travelProvider.jsx
 * - students/context/providers/sportsProvider.jsx
 * - students/context/providers/scholarshipsProvider.jsx
 */
export const showSnackbar = (setSnackbar, message, severity = "success") => {
  setSnackbar({ open: true, message, severity });
};

/**
 * Repetida en los providers estudiantiles de consultations, travel y sports.
 */
export const closeSnackbar = (setSnackbar) => {
  setSnackbar((previous) => ({ ...previous, open: false }));
};

/**
 * Repetida en providers que previsualizan documentación:
 * - employed/context/providers/purchaseProvider.jsx
 * - students/context/providers/travelProvider.jsx
 * - students/context/providers/sportsProvider.jsx
 * - students/context/providers/scholarshipsProvider.jsx
 */
export const closePreview = (setPreview) => {
  setPreview((previous) => ({ ...previous, open: false }));
};

/**
 * Utilidades puras de texto, máscaras y validación.
 * Extraídas inicialmente de shared/context/providers/profileProvider.jsx.
 */
export const getInitials = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

export const onlyDigits = (value = "", maxLength = Infinity) =>
  String(value).replace(/\D/g, "").slice(0, maxLength);

export const formatDni = (value = "") =>
  onlyDigits(value, 8).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const formatCuil = (value = "") => {
  const digits = onlyDigits(value, 11);
  const parts = [digits.slice(0, 2), digits.slice(2, 10), digits.slice(10, 11)];

  return parts.filter(Boolean).join("-");
};

export const formatPhone = (value = "") => {
  const digits = onlyDigits(value, 12);
  if (!digits) return "";

  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 8),
    digits.slice(8, 12),
  ];

  return `+${parts.filter(Boolean).join(" ")}`.replace(
    /(\+\d{2} \d{3} \d{3}) (\d{1,4})$/,
    "$1-$2",
  );
};

export const parseAddress = (value = "") => {
  let parts = String(value).split(" - ");

  if (parts.length < 4) {
    parts = String(value).split(/\s+-\s+/);
  }

  if (parts.length < 4) return [...parts, "", "", ""].slice(0, 4);

  return [parts[0], parts[1], parts.slice(2, -1).join(" "), parts.at(-1)];
};

export const sanitizeAddressPart = (value = "") =>
  String(value)
    .replace(/\s*-\s*/g, " ")
    .replace(/\s{2,}/g, " ");

export const isValidEmail = (value = "") =>
  /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(String(value).trim());

export const isValidPhone = (value = "") => onlyDigits(value).length === 12;

export const isValidAddress = (value = "") => {
  const parts = String(value).split(/\s+-\s+/);

  return (
    parts.length === 4 &&
    parts.every((part) => part.trim() !== "") &&
    /^\d+$/.test(parts[3])
  );
};

export const cleanField = (value) => {
  if (value === null || value === undefined) return null;

  const cleaned = String(value).trim();
  return cleaned === "" ? null : cleaned;
};

export const cleanNumericField = (value) => {
  const cleaned = cleanField(value);
  return cleaned ? onlyDigits(cleaned) : null;
};

export const isEmpty = (value) =>
  value === null || value === undefined || String(value).trim() === "";

/**
 * Formateo de moneda y fechas.
 * Extraído inicialmente de employed/context/providers/purchaseProvider.jsx.
 */
const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? "" : currencyFormatter.format(numberValue);
};

export const formatCurrencyInput = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return "";

  return numberValue.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseCurrencyInput = (value) => {
  const normalized = String(value)
    .replace(/[^\d,.]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  if (!normalized) return "";

  const numberValue = Number(normalized);
  return Number.isNaN(numberValue) ? "" : numberValue;
};

export const normalizeCurrencyValue = (value) =>
  typeof value === "string" ? parseCurrencyInput(value) : value;

export const sanitizeCurrencyInput = (value) => {
  const cleanValue = String(value).replace(/[^\d,.]/g, "");
  const [integerPart, ...decimalParts] = cleanValue.split(",");

  return decimalParts.length === 0
    ? integerPart
    : `${integerPart},${decimalParts.join("").replace(/,/g, "")}`;
};

export function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d)) return isoString;
  return d.toLocaleDateString("es-AR");
}

export function isoToInputDate(isoString) {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

export function toTimeInput(str) {
  if (!str) return "";
  return str.slice(0, 5);
}

export function toApiTime(str) {
  if (!str) return "";
  return str.length === 5 ? `${str}:00` : str;
}

export const formatDateForInput = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDate) return isoDate[0];

    const localDate = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (localDate) return `${localDate[3]}-${localDate[2]}-${localDate[1]}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDateForDisplay = (value) => {
  const inputDate = formatDateForInput(value);
  if (!inputDate) return "";

  const [year, month, day] = inputDate.split("-");
  return `${day}/${month}/${year}`;
};

/**
 * Helpers genéricos para archivos locales y documentos persistidos.
 */
export const sanitizeFileNamePart = (value, fallback = "archivo") =>
  String(value || fallback)
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "") || fallback;

export const getFileName = (file, fallback = "Ningún archivo seleccionado") => {
  if (typeof file === "string") return file;

  return file?.name || getDocumentName(file, fallback);
};

export const isFile = (value) =>
  typeof File !== "undefined" && value instanceof File;

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const formatTime = (time) => {
  return time
    ? time.endsWith("hs")
      ? time.replace("hs", ":00")
      : `${time}:00`
    : time;
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

export const normalizeExtension = (value) => {
  if (!value) return "";

  let normalized = String(value).trim().toLowerCase();
  if (normalized.includes("/")) normalized = normalized.split("/").pop();
  if (normalized.includes(";")) normalized = normalized.split(";")[0];

  return normalized.replace(/^\./, "");
};

export const getDocumentExtension = (document = {}) => {
  const directExtension = normalizeExtension(document?.extension);
  if (directExtension) return directExtension;

  const parts = String(document?.nombre_documento || "").split(".");
  if (parts.length < 2) return "";

  return normalizeExtension(parts.pop());
};

export const getImageSource = (document = {}) => {
  if (!document?.datos_documento) return "";
  if (document.datos_documento.startsWith("data:")) {
    return document.datos_documento;
  }

  const mimeByExtension = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
  };
  const mime = mimeByExtension[getDocumentExtension(document)] || "image/jpeg";

  return `data:${mime};base64,${document.datos_documento}`;
};

export const isPreviewableDocument = (document = {}) =>
  PREVIEW_EXTENSIONS.has(getDocumentExtension(document));

export const hasRealDocumentName = (value) => {
  if (!value) return false;

  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return false;

  return !new Set(["documento", "archivo", "file", "document"]).has(normalized);
};

export const getDisplayDocumentName = (document = {}, fallback = "Archivo") =>
  hasRealDocumentName(document?.nombre_documento)
    ? document.nombre_documento
    : fallback;

export const generateColumns = (
  data,
  { exclude = ["id"], overrides = {}, actions = null } = {},
) => {
  const sample = Array.isArray(data) ? data[0] : data;
  if (!sample) return actions ? [actions] : [];

  const columns = Object.keys(sample)
    .filter((field) => !exclude.includes(field))
    .map((field) => ({
      field,
      headerName: formatHeader(field),
      flex: 1,
      minWidth: 130,
      ...(overrides[field] || {}),
    }));

  return actions ? [...columns, actions] : columns;
};
