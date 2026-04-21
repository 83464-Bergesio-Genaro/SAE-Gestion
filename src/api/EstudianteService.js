import {
  mapResponseCrearDocumento,
  mapResponseEliminarDocumento,
  mapResponseListarDocumentacionXLegajo,
} from "./formatters/EstudianteFormatters";

import { appConfig } from "../config/appConfig";

export const URLApiCotroller = `${appConfig.apiUrl}/api/Estudiante`;

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
