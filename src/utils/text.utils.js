export function normalizeText(value = "") {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export const getInitials = (name = "") =>
  String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

export const firstNonEmptyText = (...values) =>
  values.find((value) => String(value ?? "").trim()) ?? "";

export const cleanField = (value) => {
  if (value === null || value === undefined) return null;

  const cleaned = String(value).trim();
  return cleaned === "" ? null : cleaned;
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

export const onlyDigits = (value = "", maxLength = Infinity) =>
  String(value).replace(/\D/g, "").slice(0, maxLength);

export const digitsOnly = (value = "", maxLength = Infinity) =>
  onlyDigits(value).slice(0, maxLength);

export const sanitizeAddressPart = (value = "") =>
  String(value)
    .replace(/\s*-\s*/g, " ")
    .replace(/\s{2,}/g, " ");

export const cleanNumericField = (value) => {
  const cleaned = cleanField(value);
  return cleaned ? onlyDigits(cleaned) : null;
};