import { RequestAPI } from "./apiClient";

export { RequestAPI };

export function ObtenerEmpleados() {
  return RequestAPI("/api/Empleados/ObtenerEmpleados/", "GET");
}

export function ObtenerUsuarios() {
  return RequestAPI("/api/Usuarios/ObtenerUsuarios/", "GET");
}
