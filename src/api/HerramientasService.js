import { RequestAPI } from "./apiClient";

export function obtenerTiposDocumento() {
  return RequestAPI("/api/Herramientas/ObtenerTiposDocumento", "GET");
}

export function obtenerPerfiles() {
  return RequestAPI("/api/Herramientas/ObtenerPerfiles", "GET");
}

export function obtenerCarreras() {
  return RequestAPI("/api/Herramientas/ObtenerCarreras", "GET");
}
