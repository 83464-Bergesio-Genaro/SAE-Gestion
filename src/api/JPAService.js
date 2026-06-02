import { appConfig } from "../config/appConfig";
import { mapEventoPublico, mapStandPublico } from "../api/formatters/JPAFormatter";
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
//-------------------  ABM EVENTOS -------------------//
export async function ObtenerEventosPublicos() {
  const data = await RequestAPI('/api/JPA/ObtenerEventosPublicos/',"GET");
  return data.map(mapEventoPublico);
}

export async function ObtenerEventosSAE() {
  const data = await RequestAPI('/api/JPA/ObtenerEventosSAE/',"GET");
  return data.map(mapEventoPublico);  
}
export async function crearEvento(body) {
  return RequestAPI('/api/JPA/CrearEvento/',"POST", body);
}
export async function modificarEvento(id, body) {
  return RequestAPI('/api/JPA/ModificarEvento/' + encodeURIComponent(id), "PUT", body);
}
export async function eliminarEvento(id){
  return RequestAPI('/api/JPA/EliminarEvento/' + encodeURIComponent(id), "DELETE");
}

//-------------------  ABM STANDS -------------------//
export async function ObtenerStands() {
  const data = await RequestAPI('/api/JPA/ObtenerStands', "GET");
  return data.map(mapStandPublico);
}
export async function crearStand(body) {
  return RequestAPI('/api/JPA/CrearStand/',"POST", body);
}
export async function modificarStand(id,body) {
  return RequestAPI('/api/JPA/ModificarStand/' + encodeURIComponent(id), "PUT", body);
}
export async function eliminarStand(id) {
  return RequestAPI('/api/JPA/EliminarStand/' + encodeURIComponent(id), "DELETE");
}
//-------------------  ABM INTERESADOS -------------------//
export async function ObtenerInteresados() {
  const data = await RequestAPI('/api/JPA/ObtenerInteresadosEventos', "GET");
  return data;
}
export async function crearInteresado(body) {
  return RequestAPI('/api/JPA/CrearInteresados/',"POST", body);
}
export async function modificarInteresado(id,body) {
  return RequestAPI('/api/JPA/ModificarInteresado/' + encodeURIComponent(id), "PUT", body);
}
export async function eliminarInteresado(id) {
  return RequestAPI('/api/JPA/EliminarInteresado/' + encodeURIComponent(id), "DELETE");
}