import {
  mapResponseCrearDocumento,
  mapResponseEliminarDocumento,
  mapResponseListarDocumentacionXLegajo,
} from "./formatters/EstudianteFormatters";

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

export const URLApiCotroller = `${appConfig.apiUrl}/api/Estudiante`;

//Esto use yo
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
export async function ObtenerPerfilXLegajo(legajo){
    return RequestAPI('/api/Estudiante/BuscarPerfilEstudiante/'+encodeURIComponent(legajo),"GET");
}
export async function ModificarPerfilEstudiante(legajo,body){
    return RequestAPI('/api/Estudiante/ModificarPerfilEstudiante/'+encodeURIComponent(legajo), "PUT", body);
}

import {
  apiDelete,
  apiGet,
  apiGetFile,
  apiPostFile,
  apiPut,
  apiPutFile,
} from "./apiClient";

export async function DescargarDocumentacionXId(id, token) {
  const response = await apiGetFile(
    `${URLApiCotroller}/DescargarDocumentacionXId/${id}`,
    {
      token,
      includeHeaders: true,
    },
  );
  const contentType = (
    response.headers.get("Content-Type") || ""
  ).toLowerCase();

  const disposition = response.headers.get("Content-Disposition") || "";
  const fileNameMatch = disposition.match(
    /filename\*?=(?:UTF-8''|"?)([^";]+)/i,
  );

  const fileName = fileNameMatch?.[1]
    ? decodeURIComponent(fileNameMatch[1].replace(/"/g, ""))
    : "documento";

  const extension = contentType.includes("application/pdf")
    ? "pdf"
    : contentType.split("/")[1] || "jpg";

  const blob = response.data;

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  return {
    id,
    nombre_documento: fileName,
    datos_documento: dataUrl,
    extension,
  };
}

export async function EliminarDocumentoEstudiante(id_archivo, token) {
  return apiDelete(
    `${URLApiCotroller}/EliminarDocumentoEstudiante/${id_archivo}`,
    {
      token,
      mapper: mapResponseEliminarDocumento,
    },
  );
}

export async function ListarDocumentacionXLegajo(legajo, token) {
  return apiGet(`${URLApiCotroller}/ListarDocumentacionXLegajo/${legajo}`, {
    token,
    mapper: mapResponseListarDocumentacionXLegajo,
  });
}

export async function ModificarDocumentoEstudiante(
  idDocumento,
  archivo,
  token,
) {
  const formData = new FormData();
  formData.append("archivo", archivo);

  return apiPutFile(`${URLApiCotroller}/ModificarDocumento/${idDocumento}`, {
    token,
    mapper: mapResponseCrearDocumento,
    warning: true,
    body: formData,
  });
}

export async function CrearDocumentoEstudiante(
  id_tipo_documento,
  archivo,
  token,
) {
  const formData = new FormData();
  formData.append("archivo", archivo);

  return apiPostFile(
    `${URLApiCotroller}/CrearDocumentoEstudiante/${id_tipo_documento}`,
    {
      token,
      mapper: mapResponseCrearDocumento,
      warning: true,
      body: formData,
    },
  );
}


