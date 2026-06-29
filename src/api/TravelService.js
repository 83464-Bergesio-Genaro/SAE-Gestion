import {
  apiDeleteFile,
  apiDownloadDocument,
  apiUploadFile,
  RequestAPI,
} from "./apiClient";

export { RequestAPI };

export function ObtenerViajesXLegajo(legajo) {
  return RequestAPI(
    `/api/Viaje/ObtenerViajesXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function ObtenerViajesActivos() {
  return RequestAPI("/api/Viaje/ObtenerViajesActivo/", "GET");
}

export function ModificarViaje(id, body) {
  return RequestAPI(
    `/api/Viaje/ModificarViaje/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function CrearViaje(body) {
  return RequestAPI("/api/Viaje/CrearViaje", "POST", body);
}

export function ObtenerDocumentacionViaje(id) {
  return RequestAPI(
    `/api/Viaje/ListarDocumentacionXViaje/${encodeURIComponent(id)}`,
    "GET",
  );
}

export function listarDocumentacionXLegajo(legajo) {
  return RequestAPI(
    `/api/Estudiante/ListarDocumentacionXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function DescargarDocumentacionXId(id) {
  return apiDownloadDocument(
    `/api/Viaje/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
    { id },
  );
}

export function CrearDocumentoViaje(idViaje, idTipoDocumento, archivo) {
  return apiUploadFile(
    `/api/Viaje/CrearDocumentoViaje/${encodeURIComponent(idViaje)}/${encodeURIComponent(idTipoDocumento)}`,
    archivo,
  );
}

export function EliminarDocumentoViaje(idArchivo) {
  return apiDeleteFile(
    `/api/Viaje/EliminarDocumentoViaje/${encodeURIComponent(idArchivo)}`,
  );
}

export function ObtenerEmpresas() {
  return RequestAPI("/api/Viaje/ObtenerEmpresasViaje/", "GET");
}

export function ModificarEmpresa(id, body) {
  return RequestAPI(
    `/api/Viaje/ModificarEmpresa/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function CrearEmpresa(body) {
  return RequestAPI("/api/Viaje/CrearEmpresa", "POST", body);
}

export function ObtenerInscriptosViaje(idViaje) {
  return RequestAPI(
    `/api/Viaje/ObtenerInscriptosViaje/${encodeURIComponent(idViaje)}`,
    "GET",
  );
}

export function EliminarInscriptosViaje(idInscripto) {
  return RequestAPI(
    `/api/Viaje/EliminarInscriptos/${encodeURIComponent(idInscripto)}`,
    "DELETE",
  );
}

export function CrearInscriptoViaje(body) {
  return RequestAPI("/api/Viaje/CrearInscriptoViaje", "POST", body);
}

export function ModificarInscripto(id, body) {
  return RequestAPI(
    `/api/Viaje/ModificarInscripto/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}
