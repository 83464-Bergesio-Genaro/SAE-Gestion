import { appConfig } from "../config/appConfig";

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
  const headers = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  return options;
}

export async function obtenerTiposDocumento() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Herramientas/ObtenerTiposDocumento`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
