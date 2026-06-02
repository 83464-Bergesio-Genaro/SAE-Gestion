export const INITIAL_PREVIEW = {
  open: false,
  loading: false,
  title: "",
  imageSrc: null,
  isPdf: false,
  error: null,
};

export const MAX_SIZE_MB = 5;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
export const tiposPermitidos = ["application/pdf", "image/jpeg", "image/png"];
export function isPdfDocument(data = {}) {
  if (data.datos_documento?.startsWith("data:application/pdf")) return true;
  return (data.extension || "").toLowerCase() === "pdf";
}

export function construirNombre(formato, data, extension) {
  let nombre = formato;

  Object.keys(data).forEach((key) => {
    nombre = nombre.replace(
      new RegExp(`\\{${key}\\}`, "gi"),
      data[key] ?? "",
    );
  });

  return `${nombre}${extension}`;
}

export function obtenerApellidoDesdeNombre(nombre = "") {
  const partesNombre = nombre.trim().split(/\s+/).filter(Boolean);
  return partesNombre.at(-1) ?? "";
}

export function obtenerCarreraDesdeEmail(email = "") {
  const dominio = email.split("@")[1] ?? "";
  return dominio.split(".")[0] ?? "";
}
