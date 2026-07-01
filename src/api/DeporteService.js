import { apiUploadFile, apiDownloadDocument, RequestAPI } from './apiClient';
import { mapHorarios } from './formatters/DeportesFormatters';

// DOCENTES DEPORTIVOS
export async function obtenerDocentesDeportivos() {
  return RequestAPI('/api/Deporte/ObtenerDocentesDeportivos', 'GET');
}

export async function crearDocenteDeportivo(body) {
  return RequestAPI('/api/Deporte/CrearDocenteDeportivo', 'POST', body);
}

export async function modificarDocenteDeportivo(cuil, body) {
  return RequestAPI(
    '/api/Deporte/ModificarDocenteDeportivo/' + encodeURIComponent(cuil),
    'PUT',
    body,
  );
}

// DEPORTISTAS
export async function obtenerDeportistas() {
  return RequestAPI('/api/Deporte/ObtenerDeportistasCompleto', 'GET');
}

export async function crearDeportista(body) {
  return RequestAPI('/api/Deporte/CrearDeportista', 'POST', body);
}

export async function modificarDeportista(id, body) {
  return RequestAPI(
    '/api/Deporte/ModificarDeportista/' + encodeURIComponent(id),
    'PUT',
    body,
  );
}

export async function obtenerIdDeportista(legajo) {
  return RequestAPI(
    '/api/Deporte/ObtenerDeportistasXLegajo/' + encodeURIComponent(legajo),
    'GET',
  );
}

export async function obtenerDeportistasXTorneo(idTorneo) {
  return RequestAPI(
    '/api/Deporte/ObtenerDeportistasXTorneo/' + encodeURIComponent(idTorneo),
    'GET',
  );
}

export async function obtenerDeportistasXTorneo2(idTorneo) {
  return obtenerDeportistasXTorneo(idTorneo);
}

// ESPACIOS DEPORTIVOS
export async function obtenerEspaciosDeportivos() {
  return RequestAPI('/api/Deporte/ObtenerEspDeportivoCompleto', 'GET');
}

export async function obtenerEspDeportivoActivos() {
  return RequestAPI('/api/Deporte/obtenerEspDeportivoActivos/', 'GET');
}

export async function crearEspacioDeportivo(body) {
  return RequestAPI('/api/Deporte/CrearEspacioDeportivo', 'POST', body);
}

export async function modificarEspacioDeportivo(id, body) {
  return RequestAPI(
    '/api/Deporte/ModificarEspacioDeportivo/' + encodeURIComponent(id),
    'PUT',
    body,
  );
}

// DEPORTES
export async function obtenerDeportesActivos() {
  return RequestAPI('/api/Deporte/ObtenerDeportesActivos/', 'GET');
}

export async function obtenerDeportesCompleto() {
  return RequestAPI('/api/Deporte/ObtenerDeportesCompleto/', 'GET');
}

export async function crearDeporte(body) {
  return RequestAPI('/api/Deporte/CrearDeporte', 'POST', body);
}

export async function modificarDeporte(id, body) {
  return RequestAPI(
    '/api/Deporte/ModificarDeporte/' + encodeURIComponent(id),
    'PUT',
    body,
  );
}

// HORARIOS
export async function obtenerHorariosActivos() {
  return RequestAPI('/api/Deporte/obtenerHorariosActivos/', 'GET');
}

export async function obtenerHorariosXDeporte(idDeporte) {
  return RequestAPI(
    '/api/Deporte/ObtenerHorariosXDeporte/' + encodeURIComponent(idDeporte),
    'GET',
  );
}

export async function crearHorarioDeportivo(body) {
  return RequestAPI('/api/Deporte/CrearHorarioDeportivo/', 'POST', body);
}

export async function modificarHorarioDeportivo(id, body) {
  return RequestAPI(
    '/api/Deporte/ModificarHorario/' + encodeURIComponent(id),
    'PUT',
    body,
  );
}

export async function eliminarHorarioDeportivo(id) {
  return RequestAPI(
    '/api/Deporte/EliminarHorarioDeportivo/' + encodeURIComponent(id),
    'DELETE',
  );
}

// TORNEOS
export async function obtenerTorneosDeportivos() {
  return RequestAPI('/api/Deporte/ObtenerTorneosDeportivos/', 'GET');
}

export async function obtenerTorneoXId(id) {
  return RequestAPI(
    '/api/Deporte/ObtenerTorneosXId/' + encodeURIComponent(id),
    'GET',
  );
}

export async function obtenerTorneosXDeporte(id_deporte) {
  return RequestAPI(
    '/api/Deporte/ObtenerTorneosXDeporte/' + encodeURIComponent(id_deporte),
    'GET',
  );
}

export async function crearTorneo(body) {
  return RequestAPI('/api/Deporte/CrearTorneo/', 'POST', body);
}

export async function modificarTorneo(id, body) {
  return RequestAPI(
    '/api/Deporte/ModificarTorneo/' + encodeURIComponent(id),
    'PUT',
    body,
  );
}

export async function crearInscripcionTorneo(idTorneo, idDeportista, body) {
  return RequestAPI(
    '/api/Deporte/CrearInscripcionTorneo/' +
      encodeURIComponent(idTorneo) +
      '/' +
      encodeURIComponent(idDeportista),
    'POST',
    body,
  );
}

export async function eliminarInscripcionTorneo(idInscripcion) {
  return RequestAPI(
    '/api/Deporte/EliminarInscripcionTorneo/' +
      encodeURIComponent(idInscripcion),
    'DELETE',
  );
}

// INSCRIPCIONES
export async function obtenerInscripcionesXDeportista(id_deportista) {
  return RequestAPI(
    '/api/Deporte/obtenerInscripcionesXDeportista/' +
      encodeURIComponent(id_deportista),
    'GET',
  );
}

export async function crearInscripcionDeporte(id_deporte, id_deportista) {
  return RequestAPI(
    '/api/Deporte/CrearInscripcionDeporte/' +
      encodeURIComponent(id_deporte) +
      '/' +
      encodeURIComponent(id_deportista),
    'POST',
  );
}

export async function eliminarInscripcionDeporte(idInscripcion) {
  return RequestAPI(
    '/api/Deporte/EliminarInscripcionDeporte/' +
      encodeURIComponent(idInscripcion),
    'DELETE',
  );
}

// DOCUMENTACION
export async function listarDocumentacionXLegajo(legajo) {
  return RequestAPI(
    '/api/Estudiante/ListarDocumentacionXLegajo/' + encodeURIComponent(legajo),
    'GET',
  );
}

export function descargarDocumentacionXId(id) {
  return apiDownloadDocument(
    `/api/Estudiante/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
    { id },
  );
}

export async function crearDocumentoEstudiante(id_tipo_documento, archivo) {
  return apiUploadFile(
    `/api/Estudiante/CrearDocumentoEstudiante/${encodeURIComponent(id_tipo_documento)}`,
    archivo,
  );
}

export async function eliminarDocumentoEstudiante(id_archivo) {
  return RequestAPI(
    '/api/Estudiante/EliminarDocumentoEstudiante/' +
      encodeURIComponent(id_archivo),
    'DELETE',
  );
}

export async function obtenerHorariosDeportista(id_deportista) {
  const [
    deporte,
    horariosActivos,
    espaciosDeportivos,
    inscripcionesDeportista,
  ] = await Promise.all([
    obtenerDeportesActivos(),
    obtenerHorariosActivos(),
    obtenerEspDeportivoActivos(),
    id_deportista
      ? obtenerInscripcionesXDeportista(id_deportista)
      : Promise.resolve([]),
  ]);

  if (!deporte?.length) {
    throw new Error('No hay deportes activos');
  }

  if (!horariosActivos?.length) {
    throw new Error('No hay horarios activos');
  }

  if (!espaciosDeportivos?.length) {
    throw new Error('No hay espacios deportivos');
  }

  const inscripciones = inscripcionesDeportista ?? [];

  return mapHorarios(
    horariosActivos,
    deporte,
    espaciosDeportivos,
    inscripciones,
  );
}
