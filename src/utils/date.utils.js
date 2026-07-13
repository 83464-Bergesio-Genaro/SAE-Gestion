/**
 * ===========================================================
 * DATE UTILS
 * ===========================================================
 */
/**
 * Formatea el tiempo para poder enviarlo en el body
 * 08:00 -> T08:00:00
 */
export function toApiDateTime(value, fallback = null) {
  if (!value) return fallback;

  if (value instanceof Date) {
    return value.toISOString();
  }

  const text = String(value).trim();

  // Fecha sin hora
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return `${text}T00:00:00`;
  }

  const parsed = new Date(text);

  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toISOString();
}
/**
 * Formatea una fecha en diferentes formatos.
 *
 * display -> 15/08/2026
 * short   -> 15 agosto
 * input   -> 2026-08-15
 */
export function formatDate(value, format = "display") {
  if (!value) return "";

  let date;

  // Si ya viene yyyy-MM-dd evitamos problemas de zona horaria
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    date = new Date(value.replace(/-/g, "/"));
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return "";

  switch (format) {
    case "short":
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
      });

    case "input":
      return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

    case "display":
    default:
      return date.toLocaleDateString("es-AR");
  }
}

/**
 * Normaliza cualquier formato de fecha
 * y devuelve yyyy-MM-dd
 */
export function normalizeDateInput(value) {
  if (!value) return "";

  if (typeof value === "string") {
    // yyyy-MM-dd
    const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDate) return isoDate[0];

    // dd/MM/yyyy
    const localDate = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (localDate) {
      return `${localDate[3]}-${localDate[2]}-${localDate[1]}`;
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * Formatea una hora.
 *
 * 08:00     -> 08:00hs
 * 08:00:00  -> 08:00hs
 */
export function formatTime(time) {
  if (!time) return "";

  const normalized = String(time).substring(0, 5);

  return `${normalized}hs`;
}

/**
 * Convierte una hora del input HTML
 * al formato utilizado por la API.
 *
 * 08:00 -> 08:00:00
 */
export function toApiTime(time) {
  if (!time) return "";

  return time.length === 5 ? `${time}:00` : time;
}

/**
 * Convierte una hora proveniente de la API
 * al formato utilizado por los inputs HTML.
 *
 * 08:00:00 -> 08:00
 */
export function toTimeInput(time) {
  if (!time) return "";

  return String(time).substring(0, 5);
}