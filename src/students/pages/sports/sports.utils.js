export function isPdfDocument(data = {}) {
  if (data.datos_documento?.startsWith("data:application/pdf")) return true;
  return (data.extension || "").toLowerCase() === "pdf";
}

export function construirNombre(formato, data, extension) {
  let nombre = formato;

  Object.keys(data).forEach((key) => {
    nombre = nombre.replace(`{${key}}`, data[key]);
  });

  return `${nombre}${extension}`;
}

export const MAX_SIZE_MB = 5;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
export const tiposPermitidos = ["application/pdf", "image/jpeg", "image/png"];

export const INITIAL_PREVIEW = {
  open: false,
  loading: false,
  title: "",
  imageSrc: null,
  isPdf: false,
  error: null,
};
