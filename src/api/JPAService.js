import { mapEventoPublico, mapStandPublico } from "./formatters/JPAFormatter";
import { RequestAPI } from "./apiClient";

export { RequestAPI };

export async function ObtenerEventosPublicos() {
  const data = await RequestAPI("/api/JPA/ObtenerEventosPublicos/", "GET");
  return data.map(mapEventoPublico);
}

export async function ObtenerEventosSAE() {
  const data = await RequestAPI("/api/JPA/ObtenerEventosSAE/", "GET");
  return data.map(mapEventoPublico);
}

export function crearEvento(body) {
  return RequestAPI("/api/JPA/CrearEvento/", "POST", body);
}

export function modificarEvento(id, body) {
  return RequestAPI(
    `/api/JPA/ModificarEvento/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function eliminarEvento(id) {
  return RequestAPI(
    `/api/JPA/EliminarEvento/${encodeURIComponent(id)}`,
    "DELETE",
  );
}

export async function ObtenerStands() {
  const data = await RequestAPI("/api/JPA/ObtenerStands", "GET");
  return data.map(mapStandPublico);
}

export function crearStand(body) {
  return RequestAPI("/api/JPA/CrearStand/", "POST", body);
}

export function modificarStand(id, body) {
  return RequestAPI(
    `/api/JPA/ModificarStand/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function eliminarStand(id) {
  return RequestAPI(
    `/api/JPA/EliminarStand/${encodeURIComponent(id)}`,
    "DELETE",
  );
}

export function ObtenerInteresados() {
  return RequestAPI("/api/JPA/ObtenerInteresadosEventos", "GET");
}

export function crearInteresado(body) {
  return RequestAPI("/api/JPA/CrearInteresados/", "POST", body);
}

export function modificarInteresado(id, body) {
  return RequestAPI(
    `/api/JPA/ModificarInteresado/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export function eliminarInteresado(id) {
  return RequestAPI(
    `/api/JPA/EliminarInteresado/${encodeURIComponent(id)}`,
    "DELETE",
  );
}
