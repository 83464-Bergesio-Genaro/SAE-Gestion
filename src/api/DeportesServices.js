import {
  mapHorarioAlumno,
  mapEspDeportivoActivos,
  mapDeportesActivos,
  mapInscripcionesXDeportista,
  mapHorarios,
  mapDeportistaLegajo,
  mapTorneo,
  mapResponseInscripcionDeporte,
} from "./formatters/DeportesFormatters";

import { apiDelete, apiPost, apiRequest } from "./apiClient";
export async function ObtenerHorariosActivos(token) {
  return apiRequest(`/Deporte/ObtenerHorariosActivos`, {
    token,
    mapper: mapHorarioAlumno,
  });
}

export async function ObtenerDeportesActivos(token) {
  return apiRequest(`/Deporte/ObtenerDeportesActivos`, {
    token,
    mapper: mapDeportesActivos,
  });
}

export async function ObtenerEspDeportivoActivos(token) {
  return apiRequest(`/Deporte/ObtenerEspDeportivoActivos`, {
    token,
    mapper: mapEspDeportivoActivos,
  });
}

export async function ObtenerInscripcionesXDeportista(id_deportista, token) {
  return apiRequest(
    `/Deporte/ObtenerInscripcionesXDeportista/${id_deportista}`,
    {
      token,
      mapper: mapInscripcionesXDeportista,
      allowEmpty: true,
      emptyMessage: "No se encontró ningún Deporte para ese id",
    },
  );
}

export async function ObtenerIdDeportista(legajo, token) {
  return apiRequest(`/Deporte/ObtenerDeportistasXLegajo/${legajo}`, {
    token,
    mapper: mapDeportistaLegajo,
    allowEmpty: true,
    emptyMessage: "No se encontró ningún deportista para ese legajo",
  });
}

export async function ObtenerTorneosXDeporte(id_deporte, token) {
  return apiRequest(`/Deporte/ObtenerTorneosXDeporte/${id_deporte}`, {
    token,
    mapper: mapTorneo,
    allowEmpty: true,
    emptyMessage: "No se encontró ningún Torneo para el deporte",
  });
}

export async function ObtenerHorariosDeportista(id_deportista, token) {
  const [
    deporte,
    horariosActivos,
    espaciosDeportivos,
    inscripcionesDeportista,
  ] = await Promise.all([
    ObtenerDeportesActivos(token),
    ObtenerHorariosActivos(token),
    ObtenerEspDeportivoActivos(token),
    ObtenerInscripcionesXDeportista(id_deportista, token),
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

  return {
    horarios,
  };
}

export async function DesinscribirDeporte(id_inscripcion,token){
  return apiDelete(
    `/Deporte/EliminarInscripcionDeporte/${id_inscripcion}`,
    {
      token,
      mapper: mapResponseInscripcionDeporte,
      allowEmpty:false,
      emptyMessage: "",
    },
  );
}

// CREAR DesinscribirDeporte con DELETE para manejar esto 
export async function CrearInscripcionDeporte(id_deporte, id_deportista, token) {
  return apiPost(
    `/Deporte/CrearInscripcionDeporte/${id_deporte}/${id_deportista}`,
    {
      token,
      mapper: mapResponseInscripcionDeporte,
      allowEmpty:false,
      emptyMessage: "",
    },
  );
}
