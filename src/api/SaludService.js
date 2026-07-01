import { RequestAPI } from './apiClient';

export { RequestAPI };

export function ObtenerEspecialidadesActivas() {
  return RequestAPI('/api/Salud/ObtenerEspecialidadesActivas/', 'GET');
}

export function ObtenerEspecialidades() {
  return RequestAPI('/api/Salud/ObtenerEspecialidadesCompleto/', 'GET');
}

export function CrearEspecialidad(body) {
  return RequestAPI('/api/Salud/CrearEspecialidad/', 'POST', body);
}

export function ModificaEspecialidad(id, body) {
  return RequestAPI(
    `/api/Salud/ModificarEspecialidad/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function ObtenerPersonalMedico() {
  return RequestAPI('/api/Salud/ObtenerListadoEspecialistas/', 'GET');
}

export function CrearPersonal(body) {
  return RequestAPI('/api/Salud/CrearEspecialista/', 'POST', body);
}

export function ModificarPersonal(cuil, body) {
  return RequestAPI(
    `/api/Salud/ModificarEspecialista/${encodeURIComponent(cuil)}`,
    'PUT',
    body,
  );
}

export function ObtenerCursosMedicos() {
  return RequestAPI('/api/Salud/ObtenerCursosMedicos/', 'GET');
}

export function CrearCurso(body) {
  return RequestAPI('/api/Salud/CrearCursoMedico/', 'POST', body);
}

export function ModificarCurso(id, body) {
  return RequestAPI(
    `/api/Salud/ModificarCursoMedicos/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function EliminarCursoMedico(id) {
  return RequestAPI(
    `/api/Salud/EliminarCursoMedico/${encodeURIComponent(id)}`,
    'DELETE',
  );
}

export function ObtenerHorariosCompleto() {
  return RequestAPI('/api/Salud/ObtenerHorarioMedicos/', 'GET');
}

export function ObtenerHorariosXCUIL(cuil) {
  return RequestAPI(
    `/api/Salud/ObtenerHorariosXCuil/${encodeURIComponent(cuil)}`,
    'GET',
  );
}

export function CrearHorario(body) {
  return RequestAPI('/api/Salud/CrearHorarioMedico/', 'POST', body);
}

export function ModificarHorario(id, body) {
  return RequestAPI(
    `/api/Salud/ModificarHorarioMedicos/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function EliminarHorario(id) {
  return RequestAPI(
    `/api/Salud/EliminarHorario/${encodeURIComponent(id)}`,
    'DELETE',
  );
}

export function ObtenerFaltasXCUIL(cuil) {
  return RequestAPI(
    `/api/Salud/ObtenerFaltasEspecialista/${encodeURIComponent(cuil)}`,
    'GET',
  );
}

export function RegistrarFalta(body) {
  return RequestAPI('/api/Salud/RegistrarFaltaMedica/', 'POST', body);
}

export function ObtenerEstadosTurno() {
  return RequestAPI('/api/Salud/ObtenerEstadosTurno/', 'GET');
}

export function ObtenerTurnosEstudiante(legajo) {
  return RequestAPI(
    `/api/Salud/ObtenerTurnosXLegajo/${encodeURIComponent(legajo)}`,
    'GET',
  );
}

export function ObtenerTurnos() {
  return RequestAPI('/api/Salud/ObtenerTurnosMedicos/', 'GET');
}

export function ObtenerTurnosActivos() {
  return RequestAPI('/api/Salud/ObtenerTurnosMedicosActivos/', 'GET');
}

export function ObtenerTurnosFinalizados() {
  return RequestAPI('/api/Salud/ObtenerTurnosMedicosFinalizados/', 'GET');
}

export function ObtenerTurnosCancelados() {
  return RequestAPI('/api/Salud/ObtenerTurnosMedicosCancelado/', 'GET');
}

export function CrearTurnos(body) {
  return RequestAPI('/api/Salud/CrearTurnoMedico/', 'POST', body);
}

export function ModificarTurno(id, body) {
  return RequestAPI(
    `/api/Salud/ModificarTurnoMedico/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}
