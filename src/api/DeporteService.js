import { appConfig } from "../config/appConfig";
import { mapHorarios } from "./formatters/DeportesFormatters";

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

export async function obtenerDocentesDeportivos() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerDocentesDeportivos`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function crearDocenteDeportivo(body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/CrearDocenteDeportivo`,
    getHeaders("POST", body),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function obtenerDeportistas() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerDeportistasCompleto`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function crearDeportista(body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/CrearDeportista`,
    getHeaders("POST", body),
  );
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

export async function modificarDeportista(id, body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ModificarDeportista/${encodeURIComponent(id)}`,
    getHeaders("PUT", body),
  );
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

export async function obtenerEspaciosDeportivos() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerEspDeportivoCompleto`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function crearEspacioDeportivo(body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/CrearEspacioDeportivo`,
    getHeaders("POST", body),
  );
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

export async function modificarEspacioDeportivo(id, body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ModificarEspacioDeportivo/${encodeURIComponent(id)}`,
    getHeaders("PUT", body),
  );
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

export async function modificarDocenteDeportivo(cuil, body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ModificarDocenteDeportivo/${encodeURIComponent(cuil)}`,
    getHeaders("PUT", body),
  );
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

export async function crearHorarioDeportivo(body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/CrearHorarioDeportivo/`,
    getHeaders("POST", body),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function modificarHorarioDeportivo(id, body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ModificarHorario/${encodeURIComponent(id)}`,
    getHeaders("PUT", body),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function eliminarHorarioDeportivo(id) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/EliminarHorarioDeportivo/${encodeURIComponent(id)}`,
    getHeaders("DELETE"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function obtenerDeportesActivos() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerDeportesActivos/`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function obtenerDeportesCompleto() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerDeportesCompleto/`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function crearDeporte(body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/CrearDeporte`,
    getHeaders("POST", body),
  );
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

export async function modificarDeporte(id, body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ModificarDeporte/${encodeURIComponent(id)}`,
    getHeaders("PUT", body),
  );
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

export async function obtenerHorariosXDeporte(idDeporte) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerHorariosXDeporte/${encodeURIComponent(idDeporte)}`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const text = await res.text();
  if (!text || !text.trim()) return [];
  return JSON.parse(text);
}

export async function listarDocumentacionXLegajo(legajo) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Estudiante/ListarDocumentacionXLegajo/${legajo}`,
    getHeaders("GET"),
  );
  if (res.status === 204) return [];
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function descargarDocumentacionXId(id) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Estudiante/DescargarDocumentacionXId/${encodeURIComponent(id)}`,
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

  throw new Error("Formato de respuesta no soportado");
}

export async function obtenerTorneosDeportivos() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerTorneosDeportivos/`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function obtenerTorneoXId(id) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerTorneosXId/${encodeURIComponent(id)}`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function obtenerDeportistasXTorneo(idTorneo) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerDeportistasXTorneo/${encodeURIComponent(idTorneo)}`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function modificarTorneo(id, body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ModificarTorneo/${encodeURIComponent(id)}`,
    getHeaders("PUT", body),
  );
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

export async function crearTorneo(body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/CrearTorneo/`,
    getHeaders("POST", body),
  );
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

export async function eliminarInscripcionTorneo(idInscripcion) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/EliminarInscripcionTorneo/${encodeURIComponent(idInscripcion)}`,
    getHeaders("DELETE"),
  );
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
  if (!text?.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function crearInscripcionTorneo(idTorneo, idDeportista, body) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/CrearInscripcionTorneo/${encodeURIComponent(idTorneo)}/${encodeURIComponent(idDeportista)}`,
    getHeaders("POST", body),
  );
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

export async function obtenerIdDeportista(legajo) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerDeportistasXLegajo/${legajo}`,
    getHeaders("GET"),
  );

  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function obtenerDeportistasXTorneo2(idTorneo) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerDeportistasXTorneo/${encodeURIComponent(idTorneo)}`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function obtenerHorariosActivos() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/obtenerHorariosActivos/`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function obtenerEspDeportivoActivos() {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/obtenerEspDeportivoActivos/`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function obtenerInscripcionesXDeportista(id_deportista) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/obtenerInscripcionesXDeportista/${encodeURIComponent(id_deportista)}`,
    getHeaders("GET"),
  );
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
export async function obtenerTorneosXDeporte(id_deporte) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/ObtenerTorneosXDeporte/${encodeURIComponent(id_deporte)}`,
    getHeaders("GET"),
  );

  if (!res.ok) throw new Error(`Error ${res.status}`);

  if (res.status === 204) return [];

  return res.json();
}

export async function crearInscripcionDeporte(id_deporte, id_deportista) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/CrearInscripcionDeporte/${encodeURIComponent(id_deporte)}/${encodeURIComponent(id_deportista)}`,
    getHeaders("POST"),
  );
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

export async function eliminarInscripcionDeporte(idInscripcion) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Deporte/EliminarInscripcionDeporte/${encodeURIComponent(idInscripcion)}`,
    getHeaders("DELETE"),
  );
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
  if (!text?.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function crearDocumentoEstudiante(id_tipo_documento, archivo) {
  const body = new FormData();
  body.append("archivo", archivo);

  const res = await fetch(
    `${appConfig.apiUrl}/api/Estudiantes/CrearDocumentoEstudiante/${encodeURIComponent(id_tipo_documento)}`,
    getHeaders("POST", body),
  );
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

export async function eliminarDocumentoEstudiante(id_archivo) {
  const res = await fetch(
    `${appConfig.apiUrl}/api/Estudiantes/EliminarDocumentoEstudiante/${encodeURIComponent(id_archivo)}`,
    getHeaders("DELETE"),
  );
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
  if (!text?.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function obtenerHorariosDeportista(id_deportista) {
  const [
    deporte,
    horariosActivos,
    espaciosDeportivos,
    inscripcionesDeportista,
  ] = await Promise.all([
    obtenerDeportesActivos(),
    obtenerHorariosActivos(),
    obtenerEspDeportivoActivos(),
    obtenerInscripcionesXDeportista(id_deportista),
  ]);

  if (!deporte?.length) {
    throw new Error("No hay deportes activos");
  }

  if (!horariosActivos?.length) {
    throw new Error("No hay horarios activos");
  }

  if (!espaciosDeportivos?.length) {
    throw new Error("No hay espacios deportivos");
  }

  const inscripciones = inscripcionesDeportista ?? [];

  const horarios = mapHorarios(
    horariosActivos,
    deporte,
    espaciosDeportivos,
    inscripciones,
  );

  return horarios;
}
