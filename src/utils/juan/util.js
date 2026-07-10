export const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDialogTitle = (entity, dialogMode) => {
  if (dialogMode === "create") return `Nuevo ${entity}`;
  if (dialogMode === "delete") return `Eliminar ${entity}`;
  return `Editar ${entity}`;
};

export const onlyDigits = (value = "", maxLength = Infinity) =>
  String(value).replace(/\D/g, "").slice(0, maxLength);

export const digitsOnly = (value = "", maxLength = Infinity) =>
  onlyDigits(value).slice(0, maxLength);

export const formatCuit = (value = "") => {
  const digits = onlyDigits(value, 11);
  const parts = [digits.slice(0, 2), digits.slice(2, 10), digits.slice(10, 11)];

  return parts.filter(Boolean).join("-");
};

export const formatCbu = (value = "") => {
  return onlyDigits(value, 22);
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

export const isValidEmail = (value = "") =>
  /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(String(value).trim());

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

export const formatCurrencyInputFromText = (value) =>
  formatCurrencyInput(parseCurrencyInput(value));

export const normalizeCurrencyValue = (value) =>
  typeof value === "string" ? parseCurrencyInput(value) : value;

export const sanitizeCurrencyInput = (value) => {
  const cleanValue = String(value).replace(/[^\d,.]/g, "");
  const [integerPart, ...decimalParts] = cleanValue.split(",");

  return decimalParts.length === 0
    ? integerPart
    : `${integerPart},${decimalParts.join("").replace(/,/g, "")}`;
};

export const formatTime = (time) => {
  if (!time) return time;

  const normalizedTime = String(time).slice(0, 5);
  return normalizedTime.endsWith("hs") ? normalizedTime : `${normalizedTime}hs`;
};
