import {
  apiDeleteFile,
  apiDownloadDocument,
  apiUploadFile,
  RequestAPI,
} from "./apiClient";
import {
  mapBecario,
  mapServicioInterno,
  mapServicioInternoPayload,
} from "./formatters/BecasFormatter";

export { RequestAPI };

export const ObtenerProyectosInvestigacion = () =>
  RequestAPI("/api/Beca/ObtenerProyectosInvestigacion", "GET");

export async function ObtenerServiciosInternos() {
  const data = await RequestAPI("/api/Beca/ObtenerServiciosInternos", "GET");
  return data.map(mapServicioInterno);
}

export async function ObtenerBecariosCompleto() {
  const data = await RequestAPI("/api/Beca/ObtenerBecariosCompleto", "GET");
  return data.map(mapBecario);
}

export const CrearServicioInterno = (body) =>
  RequestAPI(
    "/api/Beca/CrearServicioInterno",
    "POST",
    mapServicioInternoPayload(body),
  );

export const CrearProyectoInvestigacion = (body) =>
  RequestAPI("/api/Beca/CrearProyectoInvestigacion", "POST", body);

export function EditarProyectoInvestigacion(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarProyecto/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function EditarServicioInterno(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarServicio/${encodeURIComponent(id)}`,
    "PUT",
    mapServicioInternoPayload(body),
  );
}

export function ObtenerBecariosEconomicaXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosEconomicaXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function ObtenerBecariosServiciosXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosServiciosXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function ObtenerBecariosInvestigacionXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosInvestigacionXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function ObtenerBecariosXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function ObtenerUsuariosXLegajo(legajo) {
  return RequestAPI(
    `/api/Usuarios/ObtenerUsuarioXlegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export const CrearBecarioSAE = (body) =>
  RequestAPI("/api/Beca/CrearBecarioSAE", "POST", body);

export function EditarBecarioSAE(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarBecarioSAE/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function CrearBecarioEconomica(idBecario, body) {
  return RequestAPI(
    `/api/Beca/CrearBecarioEconomica/${encodeURIComponent(idBecario)}`,
    "POST",
    body,
  );
}

export function EditarBecarioEconomica(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarBecarioEconomica/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function CrearBecarioInvestigacion(idBecario, idProyecto, body) {
  return RequestAPI(
    `/api/Beca/CrearBecarioInvestigacion/${encodeURIComponent(idBecario)}/${encodeURIComponent(idProyecto)}`,
    "POST",
    body,
  );
}

export function EditarBecarioInvestigacion(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarBecarioInvestigacion/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function CrearBecarioServicio(idBecario, idServicio, body) {
  return RequestAPI(
    `/api/Beca/CrearBecarioServicio/${encodeURIComponent(idBecario)}/${encodeURIComponent(idServicio)}`,
    "POST",
    body,
  );
}

export function EditarBecarioServicio(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarBecarioServicio/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function listarDocumentacionXLegajo(legajo) {
  return RequestAPI(
    `/api/Estudiante/ListarDocumentacionXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export function descargarDocumentacionXId(id) {
  return apiDownloadDocument(
    `/api/Estudiante/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
    { id },
  );
}

export function crearDocumentoEstudiante(idTipoDocumento, archivo) {
  return apiUploadFile(
    `/api/Estudiante/CrearDocumentoEstudiante/${encodeURIComponent(idTipoDocumento)}`,
    archivo,
  );
}

export function eliminarDocumentoEstudiante(idDocumento) {
  return apiDeleteFile(
    `/api/Estudiante/EliminarDocumentoEstudiante/${encodeURIComponent(idDocumento)}`,
  );
}
