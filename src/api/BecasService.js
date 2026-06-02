import { appConfig } from "../config/appConfig";

export const URLApiCotroller = `${appConfig.apiUrl}/api/Becas`;

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

export async function RequestAPI(endpoint, action, body = null) {
  const res = await fetch(
    appConfig.apiUrl + endpoint,
    getHeaders(action, body),
  );
  if (res.ok && action === "DELETE") return res; // Para DELETE no esperamos un body, por lo que no intentamos parsear la respuesta
  if (res.status === 204 && action === "GET") return []; // Para GET, si el status es 204 (No Content) devolvemos un array vacío para evitar errores al mapear la respuesta
  if (!res.ok) {
    let detail = `Error ${res.status}`;
    try {
      const json = await res.json();
      console.error("Error API completo:", json);
      if (json.errors) {
        detail = Object.entries(json.errors)
          .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
          .join(" | ");
      } else if (json.title) {
        detail = `${json.title} (${res.status})`;
      } else if (json.message) {
        detail = json.message;
      }
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json();
}

export async function ObtenerProyectosInvestigacion() {
  return RequestAPI("/api/Beca/ObtenerProyectosInvestigacion", "GET");
}

export async function ObtenerServiciosInternos() {
  return RequestAPI("/api/Beca/ObtenerServiciosInternos", "GET");
}

export async function ObtenerBecariosCompleto() {
  return RequestAPI("/api/Beca/ObtenerBecariosCompleto", "GET");
}

export async function CrearServicioInterno(body) {
  return RequestAPI("/api/Beca/CrearServicioInterno", "POST", body);
}
export async function CrearProyectoInvestigacion(body) {
  return RequestAPI("/api/Beca/CrearProyectoInvestigacion", "POST", body);
}

export async function EditarProyectoInvestigacion(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarProyecto/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export async function EditarServicioInterno(id, body) {
  return RequestAPI(
    `/api/Beca/ModificarServicio/${encodeURIComponent(id)}`,
    "PUT",
    body,
  );
}

export async function ObtenerBecariosEconomicaXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosEconomicaXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export async function ObtenerBecariosServiciosXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosServiciosXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export async function ObtenerBecariosInvestigacionXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosInvestigacionXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}
export async function ObtenerBecariosXLegajo(legajo) {
  return RequestAPI(
    `/api/Beca/ObtenerBecariosXLegajo/${encodeURIComponent(legajo)}`,
    "GET",
  );
}

export async function ObtenerUsuariosXLegajo(legajo) {
  return RequestAPI(
    "/api/Usuarios/ObtenerUsuarioXlegajo/" + encodeURIComponent(legajo),
    "GET",
  );
}
export async function CrearBecarioSAE(body) {
  console.log(body);
  return RequestAPI(`/api/Beca/CrearBecarioSAE`, "POST", body);
}

export async function CrearBecarioEconomica(id_becario) {
  return RequestAPI(
    `/api/Beca/CrearBecarioEconomica/${encodeURIComponent(id_becario)}`,
    "POST",
  );
}
export async function CrearBecarioInvestigacion(id_becario, id_proyecto) {
  return RequestAPI(
    `/api/Beca/CrearBecarioInvestigacion/${encodeURIComponent(id_becario)}/${encodeURIComponent(id_proyecto)}`,
    "POST",
  );
}
export async function CrearBecarioServicio(id_becario, id_servicio) {
  return RequestAPI(
    `/api/Beca/CrearBecarioServicio/${encodeURIComponent(id_becario)}/${encodeURIComponent(id_servicio)}`,
    "POST",
  );
}
