import { onlyDigits } from "./text.utils";

export const isValidEmail = (value = "") =>
  /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(String(value).trim());


export const isValidPhone = (value = "") => onlyDigits(value).length === 12;

export const isValidMinLengthPhone = (value = "", minLength = 8) =>
  onlyDigits(value).length >= minLength;

export const isValidHyperlink = (value = "") => {
  try {
    const url = new URL(String(value).trim());
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export const isTimeAfter = (endTime = "", startTime = "") => {
  if (!startTime || !endTime) return true;

  const toMinutes = (time) => {
    const [hours, minutes] = String(time).slice(0, 5).split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return hours * 60 + minutes;
  };

  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);

  if (startMinutes === null || endMinutes === null) return true;

  return endMinutes > startMinutes;
};

export const isValidAddress = (value = "") => {
  const parts = String(value).split(/\s+-\s+/);

  return (
    parts.length === 4 &&
    parts.every((part) => part.trim() !== "") &&
    /^\d+$/.test(parts[3])
  );
};


export const isValidCbu = (value = "") => onlyDigits(value).length === 22;

export const isValidCuit = (value = "") => {
  const digits = onlyDigits(value, 11);
  if (digits.length !== 11) return false;

  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce(
    (total, weight, index) => total + Number(digits[index]) * weight,
    0,
  );
  const remainder = sum % 11;
  const checkDigit = remainder === 0 ? 0 : remainder === 1 ? 9 : 11 - remainder;

  return checkDigit === Number(digits[10]);
};

export const hasRealDocumentName = (value) => {
  if (!value) return false;

  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return false;

  return !new Set(["documento", "archivo", "file", "document"]).has(normalized);
};
