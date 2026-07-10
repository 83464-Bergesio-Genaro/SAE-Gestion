const formatDocumentSize = (size) => {
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
// Normaliza textos para comparar nombres de documentos aunque la API y la
// configuracion local difieran en acentos, mayusculas o espacios.
export function normalizeText(value = "") {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function obtenerLegajoDesdeEmail(email = "") {
  return email.split("@")[0] ?? "";
}

export function getErrorMessage(error, fallback) {
  return (
    error?.data?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export const firstNonEmptyText = (...values) =>
  values.find((value) => String(value ?? "").trim()) ?? "";


export const hasDocumentFile = (documento) =>
  Boolean(
    documento.subido ||
      documento.archivo ||
      documento.archivoNombre ||
      documento.id_archivo,
  );

export const getDocumentPreviewId = (documento) =>
  documento.id_archivo ?? documento.id_documento ?? documento.id ?? null;

export const getDocumentDisplayName = (documento) =>
  firstNonEmptyText(
    documento.archivoNombre,
    documento.nombre_documento,
  );

export function asignarTiposADocumentos(documentosBase, tipos) {
  return documentosBase.map((doc) => {
    const match = tipos.find(
      (tipo) => normalizeText(tipo.nombre) === normalizeText(doc.nombre),
    );

    if (!match) return doc;

    return {
      ...doc,
      id_tipo_documento: match.id,
      extension: match.extension,
    };
  });
}

export function asignarArchivosADocumentos(documentosBase, documentosSubidos) {
  return documentosBase.map((doc) => {
    const documentFound = documentosSubidos.find(
      (item) =>
        Number(item.id_tipo_documento) === Number(doc.id_tipo_documento),
    );
    if (!documentFound) return doc;

    return {
      ...doc,
      archivo: documentFound.archivo,
      archivoNombre: documentFound.nombre_documento,
      subido: true,
      id_archivo: documentFound.id,
      extension: documentFound.extension,
    };
  });
}


export function formatSportsDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString("es-AR");
}

export function formatBoolean(value) {
  if (typeof value !== "boolean") return value;
  return value ? "Sí" : "No";
}

export function filterTournaments(tournaments, search) {
  const term = search.trim().toLowerCase();
  if (!term) return tournaments;

  return tournaments.filter((row) =>
    [row.nombre_torneo, row.nombre_deporte, row.docente_responsable].some(
      (value) => String(value ?? "").toLowerCase().includes(term),
    ),
  );
}