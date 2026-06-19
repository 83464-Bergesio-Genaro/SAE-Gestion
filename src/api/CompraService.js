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
  const isFormData = body instanceof FormData;
  const headers = {
    "ngrok-skip-browser-warning": "true",
  };
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const options = { method, headers };
  if (body) options.body = isFormData ? body : JSON.stringify(body);
  return options;
}

export async function RequestAPI(endpoint, action, body = null) {
  const res = await fetch(
    appConfig.apiUrl + endpoint,
    getHeaders(action, body),
  );

  if (res.ok && action === "DELETE") return res; // Para DELETE no esperamos un body, por lo que no intentamos parsear la respuesta
  if (res.status === 204 && action === "GET") return []; // Para GET, si el status es 204 (No Content) devolvemos un array vacío para evitar errores al mapear la respuesta
  if (res.status === 204) return {};
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
  const text = await res.text();
  if (!text?.trim()) return action === "GET" ? [] : {};

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function ObtenerComprasXFecha(fechaInicio, fechaFin) {
  return RequestAPI(
    `/api/Compra/ObtenerComprasXFecha/${encodeURIComponent(fechaInicio)}/${encodeURIComponent(fechaFin)}`,
    "GET",
  );
}

export async function CrearCompra(body) {
  return RequestAPI("/api/Compra/CrearCompra/", "POST", body);
}

export async function EliminarCompra(id_compra) {
  return RequestAPI(
    `/api/Compra/EliminarCompra/${encodeURIComponent(id_compra)}`,
    "DELETE",
  );
}

export async function ObtenerInformeXExpediente(nro_expediente) {
  return RequestAPI(
    `/api/Compra/ObtenerInformeXExpediente/${encodeURIComponent(nro_expediente)}`,
    "GET",
  );
}

export async function ModificarInforme(nro_expediente, body) {
  console.log(body);
  return RequestAPI(
    `/api/Compra/ModificarInforme/${encodeURIComponent(nro_expediente)}`,
    "PUT",
    body,
  );
}

export async function ObtenerInformeXCompra(idCompra) {
  return RequestAPI(
    `/api/Compra/ObtenerInformeXCompra/${encodeURIComponent(idCompra)}`,
    "GET",
  );
}

export async function CrearInforme(body) {
  return RequestAPI("/api/Compra/CrearInforme/", "POST", body);
}

export async function DescargarDocumentacionXId(id) {
  //   return RequestAPI(
  //     `/api/Compra/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
  //     "GET",
  //   );

  const res = await fetch(
    `${appConfig.apiUrl}/api/Compra/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);

  const contentType = (res.headers.get("Content-Type") || "").toLowerCase();

  if (contentType.includes("application/json")) {
    return res.json();
  }

  if (
    contentType.startsWith("image/") ||
    contentType.includes("application/pdf")
  ) {
    const blob = await res.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const disposition = res.headers.get("Content-Disposition") || "";
    const fileNameMatch = disposition.match(
      /filename\*?=(?:UTF-8''|"?)([^";]+)/i,
    );
    const fileName = fileNameMatch?.[1]
      ? decodeURIComponent(fileNameMatch[1].replace(/"/g, ""))
      : "documento";
    const extension = contentType.includes("application/pdf")
      ? "pdf"
      : contentType.split("/")[1] || "jpg";

    return {
      id,
      nombre_documento: fileName,
      datos_documento: dataUrl,
      extension,
    };
  }
}

export async function ListarDocumentacionXCompra(idCompra) {
  return RequestAPI(
    `/api/Compra/ListarDocumentacionXCompra/${encodeURIComponent(idCompra)}`,
    "GET",
  );
}

export async function CrearDocumentoCompra(idCompra, idTipoDocumento, body) {
  const formData = new FormData();
  formData.append("archivo", body);

  return RequestAPI(
    `/api/Compra/CrearDocumentoCompra/${encodeURIComponent(idCompra)}/${encodeURIComponent(idTipoDocumento)}`,
    "POST",
    formData,
  );
}

export async function EliminarDocumentoCompra(id_documento) {
  return RequestAPI(
    `/api/Compra/EliminarDocumentoCompra/${encodeURIComponent(id_documento)}`,
    "DELETE",
  );
}

export const EliminarDocumentoViaje = EliminarDocumentoCompra;
