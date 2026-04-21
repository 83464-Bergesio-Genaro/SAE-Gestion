import { appConfig } from "../config/appConfig";
import { mapEventoPublico } from "../api/formatters/JPAFormatter";

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

export async function ObtenerEventosPublicos() {
  const response = await fetch(`${URLApiCotroller}/ObtenerEventosPublicos`, 
    { headers: { "ngrok-skip-browser-warning": "true" } });
  const data = await response.json();
  return data.map(mapEventoPublico);
}

export async function ObtenerEventosSAE() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/JPA/ObtenerEventosSAE`,
    getHeaders("GET")
  );
  const response = await fetch(`${URLApiCotroller}/ObtenerEventosSAE`, 
     getHeaders("GET"));
  const data = await response.json();
  return data.map(mapEventoPublico);  
}

export async function ObtenerStands() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/JPA/ObtenerStands`,
    getHeaders("GET")
  );
  return res.json();
}

export async function ObtenerInteresados() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/JPA/ObtenerInteresadosEventos`,
    getHeaders("GET")
  );
  if(res.status != 200) return [];
  return res.json();
}