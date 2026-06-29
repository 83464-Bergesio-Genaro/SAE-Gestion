import {
  apiDeleteFile,
  apiDownloadDocument,
  apiUploadFile,
  RequestAPI,
} from "./apiClient";

// Se reexporta para conservar el contrato que ya utilizan otros servicios.
export { RequestAPI };

export function ObtenerComprasXFecha(fechaInicio, fechaFin) {
  return RequestAPI(
    `/api/Compra/ObtenerComprasXFecha/${encodeURIComponent(fechaInicio)}/${encodeURIComponent(fechaFin)}`,
    "GET",
  );
}

export function CrearCompra(body) {
  return RequestAPI("/api/Compra/CrearCompra/", "POST", body);
}

export function ModificarCompra(idCompra, body) {
  return RequestAPI(
    `/api/Compra/ModificarCompra/${encodeURIComponent(idCompra)}`,
    "PUT",
    body,
  );
}

export function EliminarCompra(idCompra) {
  return RequestAPI(
    `/api/Compra/EliminarCompra/${encodeURIComponent(idCompra)}`,
    "DELETE",
  );
}

export function ObtenerInformeXExpediente(nroExpediente) {
  return RequestAPI(
    `/api/Compra/ObtenerInformeXExpediente/${encodeURIComponent(nroExpediente)}`,
    "GET",
  );
}

export function ModificarInforme(nroExpediente, body) {
  return RequestAPI(
    `/api/Compra/ModificarInforme/${encodeURIComponent(nroExpediente)}`,
    "PUT",
    body,
  );
}

export function ObtenerInformeXCompra(idCompra) {
  return RequestAPI(
    `/api/Compra/ObtenerInformeXCompra/${encodeURIComponent(idCompra)}`,
    "GET",
  );
}

export function CrearInforme(body) {
  return RequestAPI("/api/Compra/CrearInforme/", "POST", body);
}

export function ListarDocumentacionXCompra(idCompra) {
  return RequestAPI(
    `/api/Compra/ListarDocumentacionXCompra/${encodeURIComponent(idCompra)}`,
    "GET",
  );
}

// Los documentos se manejan fuera de RequestAPI porque no son respuestas JSON
// convencionales y pueden transportar imágenes, PDF o multipart/form-data.
export function DescargarDocumentacionXId(id) {
  return apiDownloadDocument(
    `/api/Compra/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
    { id },
  );
}

export function CrearDocumentoCompra(idCompra, idTipoDocumento, file) {
  return apiUploadFile(
    `/api/Compra/CrearDocumentoCompra/${encodeURIComponent(idCompra)}/${encodeURIComponent(idTipoDocumento)}`,
    file,
  );
}

export function EliminarDocumentoCompra(idDocumento) {
  return apiDeleteFile(
    `/api/Compra/EliminarDocumentoCompra/${encodeURIComponent(idDocumento)}`,
  );
}

export const EliminarDocumentoViaje = EliminarDocumentoCompra;
