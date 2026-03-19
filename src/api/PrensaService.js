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
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  return options;
}

export async function listarPublicacionesCompleto() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Prensa/ListarPublicacionesCompleto`,
    getHeaders("GET")
  );
  return res.json();
}

export async function listarPublicacionesActivas() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Prensa/ListarPublicacionesActivas`,
    getHeaders("GET")
  );
  return res.json();
}

export async function obtenerPublicacionPorId(id) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Prensa/ObtenerPublicacionXId/${id}`,
    getHeaders("GET")
  );
  return res.json();
}

export async function crearPublicacion(body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Prensa/CrearPublicacion`,
    getHeaders("POST", body)
  );
  return res.json();
}

export async function modificarPublicacion(id, body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Prensa/ModificarPublicacion/${id}`,
    getHeaders("PUT", body)
  );
  return res.json();
}

export async function eliminarPublicacion(id) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Prensa/EliminarPublicacion/${id}`,
    getHeaders("DELETE")
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function listarDocumentosPorPublicacion(idPublicacion) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Prensa/ListarDocumentoXPublicacion/${idPublicacion}`,
    getHeaders("GET")
  );
  return res.json();
}

export async function crearDocumentoPrensa(formData) {
  const token = getToken();
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(
    `${appConfig.apiUrl}/api/Prensa/CrearDocumentoPrensaLibre`,
    { method: "POST", headers, body: formData }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`CrearDocumentoPrensa ${res.status}: ${err}`);
  }
  return res.json();
}

export async function crearVinculoDocPubli(idPublicacion, idDocumento) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Prensa/CrearVinculoDocPubli/${idPublicacion}/${idDocumento}`,
    getHeaders("POST")
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`CrearVinculoDocPubli ${res.status}: ${err}`);
  }
  return res.json();
}

export async function descargarDocumentoPorId(idDocumento) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Prensa/DescargarDocumentoXId/${idDocumento}`,
    getHeaders("GET")
  );

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  const contentType = (res.headers.get("Content-Type") || "").toLowerCase();

  if (contentType.includes("application/json")) {
    return res.json();
  }

  if (contentType.startsWith("image/")) {
    const blob = await res.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const disposition = res.headers.get("Content-Disposition") || "";
    const fileNameMatch = disposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
    const fileName = fileNameMatch?.[1] ? decodeURIComponent(fileNameMatch[1].replace(/"/g, "")) : "documento";
    const extension = contentType.split("/")[1] || "jpg";

    return {
      id: idDocumento,
      nombre_documento: fileName,
      datos_documento: dataUrl,
      extension,
    };
  }

  throw new Error("Formato de respuesta no soportado");
}
