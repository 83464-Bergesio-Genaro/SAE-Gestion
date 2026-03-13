import { appConfig } from "../config/appConfig";
import { mapEventoPublico } from "../api/formatters/JPAFormatter";

export const URLApiCotroller = `${appConfig.apiUrl}/api/JPA`;

export async function ObtenerEventosPublicos() {
  const response = await fetch(`${URLApiCotroller}/ObtenerEventosPublicos`);
  const data = await response.json();
  return data.map(mapEventoPublico);
}
