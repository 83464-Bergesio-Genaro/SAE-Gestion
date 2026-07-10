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

const onlyDigits = (value = "", maxLength = Infinity) =>
  String(value).replace(/\D/g, "").slice(0, maxLength);

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
