import {
  apiDeleteFile,
  apiDownloadDocument,
  apiUploadFile,
  RequestAPI,
} from './apiClient';

export { RequestAPI };

export const ObtenerProyectosInvestigacion = () =>
  RequestAPI('/api/Beca/ObtenerProyectosInvestigacion', 'GET');

export const ObtenerServiciosInternos = () =>
  RequestAPI('/api/Beca/ObtenerServiciosInternos', 'GET');

export const ObtenerBecariosCompleto = () =>
  RequestAPI('/api/Beca/ObtenerBecariosCompleto', 'GET');

export const CrearServicioInterno = (body) =>
  RequestAPI('/api/Beca/CrearServicioInterno', 'POST', body);

export const CrearProyectoInvestigacion = (body) =>
  RequestAPI('/api/Beca/CrearProyectoInvestigacion', 'POST', body);

export function EditarProyectoInvestigacion(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarProyecto/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function EditarServicioInterno(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarServicio/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function ObtenerBecariosEconomicaXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosEconomicaXLegajo/${encodeURIComponent(legajo)}`,
    'GET',
  );
}

export function ObtenerBecariosServiciosXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosServiciosXLegajo/${encodeURIComponent(legajo)}`,
    'GET',
  );
}

export function ObtenerBecariosInvestigacionXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosInvestigacionXLegajo/${encodeURIComponent(legajo)}`,
    'GET',
  );
}

export function ObtenerBecariosXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosXLegajo/${encodeURIComponent(legajo)}`,
    'GET',
  );
}

export function ObtenerUsuariosXLegajo(legajo) {
  return RequestAPI(
    `/api/Usuarios/ObtenerUsuarioXlegajo/${encodeURIComponent(legajo)}`,
    'GET',
  );
}

export const CrearBecarioSAE = (body) =>
  RequestAPI('/api/Beca/CrearBecarioSAE', 'POST', body);

export function EditarBecarioSAE(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarBecarioSAE/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function CrearBecarioEconomica(idBecario) {
  return RequestAPI(
    `/api/Beca/CrearBecarioEconomica/${encodeURIComponent(idBecario)}`,
    'POST',
  );
}

export function EditarBecarioEconomica(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarBecarioEconomica/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function CrearBecarioInvestigacion(idBecario, idProyecto) {
  return RequestAPI(
    `/api/Beca/CrearBecarioInvestigacion/${encodeURIComponent(idBecario)}/${encodeURIComponent(idProyecto)}`,
    'POST',
  );
}

export function EditarBecarioInvestigacion(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarBecarioInvestigacion/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function CrearBecarioServicio(idBecario, idServicio) {
  return RequestAPI(
    `/api/Beca/CrearBecarioServicio/${encodeURIComponent(idBecario)}/${encodeURIComponent(idServicio)}`,
    'POST',
  );
}

export function EditarBecarioServicio(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarBecarioServicio/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function listarDocumentacionXLegajo(legajo) {
  return RequestAPI(
    `/api/Estudiante/ListarDocumentacionXLegajo/${encodeURIComponent(legajo)}`,
    'GET',
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
