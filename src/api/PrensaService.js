import { mapPublicacionPublica } from './formatters/PrensaFormatter.js';
import {
  ApiError,
  apiDownloadDocument,
  apiRequest,
  apiUploadFile,
  RequestAPI,
  resolveApiUrl,
} from './apiClient';

export const listarPublicacionesCompleto = () =>
  RequestAPI('/api/Prensa/ListarPublicacionesCompleto', 'GET');

export const listarPublicacionesActivas = () =>
  RequestAPI('/api/Prensa/ListarPublicacionesActivas', 'GET');

export function obtenerPublicacionPorId(id) {
  return RequestAPI(
    `/api/Prensa/ObtenerPublicacionXId/${encodeURIComponent(id)}`,
    'GET',
  );
}

export const crearPublicacion = (body) =>
  RequestAPI('/api/Prensa/CrearPublicacion', 'POST', body);

export function modificarPublicacion(id, body) {
  return RequestAPI(
    `/api/Prensa/ModificarPublicacion/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function eliminarPublicacion(id) {
  return RequestAPI(
    `/api/Prensa/EliminarPublicacion/${encodeURIComponent(id)}`,
    'DELETE',
  );
}

export function listarDocumentosPorPublicacion(idPublicacion) {
  return RequestAPI(
    `/api/Prensa/ListarDocumentoXPublicacion/${encodeURIComponent(idPublicacion)}`,
    'GET',
  );
}

export const listarDocumentosSinData = () =>
  RequestAPI('/api/Prensa/ListarDocumentosSinData', 'GET');

export function crearDocumentoPrensa(formData) {
  return apiUploadFile(
    '/api/Prensa/CrearDocumentoPrensaLibre',
    formData,
  );
}

export function crearVinculoDocPubli(idPublicacion, idDocumento) {
  return RequestAPI(
    `/api/Prensa/CrearVinculoDocPubli/${encodeURIComponent(idPublicacion)}/${encodeURIComponent(idDocumento)}`,
    'POST',
  );
}

export function descargarDocumentoPorId(idDocumento) {
  return apiDownloadDocument(
    `/api/Prensa/DescargarDocumentoXId/${encodeURIComponent(idDocumento)}`,
    { id: idDocumento },
  );
}

const PUBLIC_NEWS_ERRORS = {
  400: 'Se enviaron parámetros a una vista',
  401: 'El endpoint requiere autenticación',
  409: 'Conflicto en la base de datos',
  500: 'Error interno del servidor',
};

export async function ObtenerNoticiasPublicas() {
  try {
    const response = await apiRequest(
      '/api/Prensa/ListarPublicacionesActivas',
      { auth: false, includeHeaders: true },
    );

    if (response.status === 204 || !response.data?.length) {
      return {
        success: false,
        data: [],
        message: 'No hay publicaciones a listar',
      };
    }

    const publications = response.data
      .map(mapPublicacionPublica)
      .sort((a, b) => b.prioridad - a.prioridad);

    return { success: true, data: publications, message: '' };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error instanceof ApiError
          ? PUBLIC_NEWS_ERRORS[error.status] ?? error.message
          : 'Error no contemplado',
    };
  }
}

export function getDownloadUrl(id) {
  return resolveApiUrl(
    `/api/Prensa/DescargarDocumentoXId/${encodeURIComponent(id)}`,
  );
}
