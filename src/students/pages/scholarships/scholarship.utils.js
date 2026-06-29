export {
  construirNombre,
  formatDate,
  INITIAL_PREVIEW,
  isFile as isSelectedFile,
  isPdfDocument,
  MAX_FILE_SIZE_BYTES as MAX_SIZE_BYTES,
  MAX_FILE_SIZE_MB as MAX_SIZE_MB,
} from "../../../shared/util";

export const ESTADO_BECA = {
  SOLICITADO: "solicitado",
  RECHAZADO: "rechazado",
  ACEPTADO_INICIO: "aceptado_inicio",
  ACEPTADO_PAGADO: "aceptado_pagado",
  FIN_BECADO: "fin_becado",
};

export function getEstadoBecaConfig(estado) {
  switch (estado) {
    case ESTADO_BECA.SOLICITADO:
      return { label: "Solicitado", color: "warning" };
    case ESTADO_BECA.RECHAZADO:
      return { label: "Rechazado", color: "error" };
    case ESTADO_BECA.ACEPTADO_INICIO:
      return { label: "Aceptado", color: "info" };
    case ESTADO_BECA.ACEPTADO_PAGADO:
      return { label: "Pagado", color: "success" };
    case ESTADO_BECA.FIN_BECADO:
      return { label: "Finalizado", color: "secondary" };
    default:
      return { label: estado || "Sin estado", color: "default" };
  }
}

// Normaliza textos para comparar nombres de documentos aunque la API y la
// configuracion local difieran en acentos, mayusculas o espacios.
export function normalizeText(value = "") {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getAnioBeca(becario = {}) {
  const anioBeca = Number(becario?.anio_beca);

  if (Number.isInteger(anioBeca)) return anioBeca;

  const fechaSolicitud = new Date(becario?.fecha_solicitud);
  if (!Number.isNaN(fechaSolicitud.getTime())) {
    return fechaSolicitud.getFullYear();
  }

  return null;
}

export function getEstadoBecaDesdeBecario(becario = {}) {
  const aceptadoInicio = Boolean(becario?.aceptado_inicio);
  const puedePagarle = Boolean(becario?.puede_pagarle);
  const estaActivo = becario?.activo !== false;
  const anioBeca = getAnioBeca(becario);
  const anioActual = new Date().getFullYear();

  if (!estaActivo) return ESTADO_BECA.RECHAZADO;
  if (anioBeca && anioActual > anioBeca) return ESTADO_BECA.FIN_BECADO;

  if (aceptadoInicio && puedePagarle) return ESTADO_BECA.ACEPTADO_PAGADO;
  if (aceptadoInicio) return ESTADO_BECA.ACEPTADO_INICIO;

  return ESTADO_BECA.SOLICITADO;
}

export const isValidObjectResponse = (value) =>
  Boolean(value && typeof value === "object" && value.id);

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

// Helpers compartidos por la card y el formulario de documentos.
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
