import { RequestAPI } from './apiClient';

export { RequestAPI };

export function ObtenerEmpleados() {
  return RequestAPI('/api/Empleados/ObtenerEmpleados/', 'GET');
}

export function ObtenerUsuariosXLegajo(legajo) {
  return RequestAPI(
    `/api/Usuarios/ObtenerUsuarioXlegajo/${encodeURIComponent(legajo)}`,
    'GET',
  );
}

export function ObtenerUsuarios() {
  return RequestAPI('/api/Usuarios/ObtenerUsuarios/', 'GET');
}

export function CrearEmpleado(body, nombres, apellidos) {
  return RequestAPI(
    `/api/Empleados/CrearEmpleado?nombres=${encodeURIComponent(nombres)}&apellidos=${encodeURIComponent(apellidos)}`,
    'POST',
    body,
  );
}

export function ModificarUsuario(id, body) {
  return RequestAPI(
    `/api/Usuarios/ModificarUsuario/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function CrearRegistroUsuario(
  body,
  nombres,
  apellidos,
  idEspecialidad,
) {
  return RequestAPI(
    `/api/Usuarios/CrearRegistroUsuario?nombres=${encodeURIComponent(nombres)}&apellidos=${encodeURIComponent(apellidos)}&id_especialidad=${encodeURIComponent(idEspecialidad)}`,
    'POST',
    body,
  );
}

export function ObtenerHorarios() {
  return RequestAPI('/api/Empleados/ObtenerHorarios/', 'GET');
}

export function BuscarHorariosXEmpleado(idEmpleado) {
  return RequestAPI(
    `/api/Empleados/ObtenerHorariosXEmpleado/${encodeURIComponent(idEmpleado)}`,
    'GET',
  );
}

export function CrearHorarioEmpleado(body) {
  return RequestAPI('/api/Empleados/CrearHorario/', 'POST', body);
}

export function ModificarHorario(id, body) {
  return RequestAPI(
    `/api/Empleados/ModificarHorario/${encodeURIComponent(id)}`,
    'PUT',
    body,
  );
}

export function EliminarHorario(idHorario) {
  return RequestAPI(
    `/api/Empleados/EliminarHorario/${encodeURIComponent(idHorario)}`,
    'DELETE',
  );
}

export function BuscarLinkFrecuentes() {
  return RequestAPI('/api/Empleados/ObtenerLinktree/', 'GET');
}

export function CrearLinkFrecuentes(body) {
  return RequestAPI('/api/Empleados/CrearItemLinkTree/', 'POST', body);
}

export function EliminarLinkFrecuentes(idLink) {
  return RequestAPI(
    `/api/Empleados/EliminarItem/${encodeURIComponent(idLink)}`,
    'DELETE',
  );
}

export function ContarVisualizacionLinkFrecuente(idLink) {
  return RequestAPI(
    `/api/Empleados/ContarVisualizacionItem/${encodeURIComponent(idLink)}`,
    'PUT',
  );
}
