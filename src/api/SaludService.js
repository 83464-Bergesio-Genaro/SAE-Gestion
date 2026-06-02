import { appConfig } from "../config/appConfig";
import { Await } from "react-router-dom";
export const URLApiCotroller = `${appConfig.apiUrl}/api/JPA`;

function getToken() {
  const stored = localStorage.getItem("session");
  if (!stored) return null;
  const parsed = JSON.parse(stored);
  if (Date.now() > parsed.expiration) {
    localStorage.removeItem("session");
    return null;
  }
  return parsed.token;
}

function getHeaders(method, body) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  return options;
}

export async function RequestAPI(endpoint,action, body=null) {
  const res = await fetch(
    appConfig.apiUrl+ endpoint,
    getHeaders(action, body),
  ); 
  if(res.ok && action === "DELETE") return res; // Para DELETE no esperamos un body, por lo que no intentamos parsear la respuesta
  if(res.status === 204 && action === "GET") return []; // Para GET, si el status es 204 (No Content) devolvemos un array vacío para evitar errores al mapear la respuesta
  if (!res.ok) {
    let detail = `Error ${res.status}`;
    try {
      const json = await res.json();
      if (json.title) detail = `${json.title} (${res.status})`;
      else if (json.message) detail = json.message;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json();
}
// ESPECIALIDADES
export async function ObtenerEspecialidadesActivas(){
    return RequestAPI('/api/Salud/ObtenerEspecialidadesActivas/',"GET");
}
export async function ObtenerEspecialidades(){
    return RequestAPI('/api/Salud/ObtenerEspecialidadesCompleto/',"GET");
}
export async function CrearEspecialidad(body){
    return RequestAPI("/api/Salud/CrearEspecialidad/", "POST", body);
}
export async function ModificaEspecialidad(id,body){
    return RequestAPI("/api/Salud/ModificarEspecialidad/"+encodeURIComponent(id), "PUT", body);
}
// PERSONAL MEDICO
export async function ObtenerPersonalMedico(){
    return RequestAPI('/api/Salud/ObtenerListadoEspecialistas/',"GET");
}
export async function CrearPersonal(body){
    return RequestAPI("/api/Salud/CrearEspecialista/", "POST", body);
}
export async function ModificarPersonal(cuil,body){
    return RequestAPI("/api/Salud/ModificarEspecialista/"+encodeURIComponent(cuil), "PUT", body);
}
// CURSOS MEDICOS
export async function ObtenerCursosMedicos(){
    return RequestAPI('/api/Salud/ObtenerCursosMedicos/',"GET");
}
export async function CrearCurso(body){
  return RequestAPI("/api/Salud/CrearCursoMedico/", "POST", body);
}
export async function ModificarCurso(id,body){
    return RequestAPI('/api/Salud/ModificarCursoMedicos/'+encodeURIComponent(id), "PUT", body);
}
export async function EliminarCursoMedico(id){
  return RequestAPI('/api/Salud/EliminarCursoMedico/' + encodeURIComponent(id), "DELETE");
}
// HORARIOS
export async function ObtenerHorariosCompleto(){
    return RequestAPI('/api/Salud/ObtenerHorarioMedicos/',"GET");
}
export async function ObtenerHorariosXCUIL(cuil){
    return RequestAPI('/api/Salud/ObtenerHorariosXCuil/'+encodeURIComponent(cuil),"GET");
}
export async function CrearHorario(body){
    return RequestAPI("/api/Salud/CrearHorarioMedico/", "POST", body);
}
export async function ModificarHorario(id,body){
    return RequestAPI('/api/Salud/ModificarHorarioMedicos/'+encodeURIComponent(id), "PUT", body);
}
export async function EliminarHorario(id){
  return RequestAPI('/api/Salud/EliminarHorario/' + encodeURIComponent(id), "DELETE");
}
// REGISTRO DE FALTAS
export async function ObtenerFaltasXCUIL(cuil){
    return RequestAPI('/api/Salud/ObtenerFaltasEspecialista/'+encodeURIComponent(cuil),"GET");
}

export async function RegistrarFalta(body){
  return RequestAPI("/api/Salud/RegistrarFaltaMedica/", "POST", body);
}

// ESTADOS
export async function ObtenerEstadosTurno(){
    return RequestAPI('/api/Salud/ObtenerEstadosTurno/',"GET");
}
// TURNO MEDICOS

export async function ObtenerTurnosEstudiante(legajo){
    return RequestAPI('/api/Salud/ObtenerTurnosXLegajo/'+encodeURIComponent(legajo),"GET");
}
//ALL
export async function ObtenerTurnos(){
    return RequestAPI('/api/Salud/ObtenerTurnosMedicos/',"GET");
}
//Estados 0,1,3,5
export async function ObtenerTurnosActivos(){
    return RequestAPI('/api/Salud/ObtenerTurnosMedicosActivos/',"GET");
}

//Estado 4
export async function ObtenerTurnosFinalizados(){
    return RequestAPI('/api/Salud/ObtenerTurnosMedicosFinalizados/',"GET");
}
//Estado 2
export async function ObtenerTurnosCancelados(){
    return RequestAPI('/api/Salud/ObtenerTurnosMedicosCancelado/',"GET");
}
export async function CrearTurnos(body){
    return RequestAPI('/api/Salud/CrearTurnoMedico/', "POST", body);
}
export async function ModificarTurno(id,body){
    return RequestAPI('/api/Salud/ModificarTurnoMedico/'+encodeURIComponent(id), "PUT", body);
}