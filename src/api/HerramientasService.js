import { appConfig } from "../config/appConfig";
import { mapTiposDocumento } from "../api/formatters/HerramientasFormatters";
import { apiRequest } from "./apiClient";

export const URLApiCotroller = `${appConfig.apiUrl}/api/Herramientas`;

export async function ObtenerTiposDocumento() {
  return apiRequest(`${URLApiCotroller}/ObtenerTiposDocumento`, {
    mapper: mapTiposDocumento,
    allowEmpty: true,
    emptyMessage: "No se encontró ningún deportista para ese legajo",
  });
}
