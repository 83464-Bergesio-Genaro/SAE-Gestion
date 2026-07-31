import { formatDate } from "../../utils/date.utils";

export const mapEstudiante = (estudiante) => ({
  legajo: estudiante.legajo,
  nombres: estudiante.nombres,
  apellidos: estudiante.apellidos,
  email: estudiante.email,
  telefono: estudiante.telefono,
  fecha_nacimiento: formatDate(estudiante.fecha_nacimiento,"input"),
  cuil: estudiante.cuil,
  dni: estudiante.dni,
  direccion: estudiante.direccion
});

export const mapResponseCrearDocumento = (ResponseCrearDocumento) => ({
  id: ResponseCrearDocumento.id,
  legajo: ResponseCrearDocumento.legajo,
  id_tipo_documento: ResponseCrearDocumento.id_tipo_documento,
  nombre_documento: ResponseCrearDocumento.nombre_documento,
  datos_documento: ResponseCrearDocumento.datos_documento,
  extension: ResponseCrearDocumento.extension,
});

export const mapResponseEliminarDocumento = (ResponseEliminar) => ({
  texto: ResponseEliminar,
});

export const mapResponseListarDocumentacionXLegajo = (
  ListarDocumentacionXLegajo,
) => ({
  documento: mapResponseDocumento(ListarDocumentacionXLegajo),
});

export const mapResponseDocumento = (ResponseDocumento) => ({
  
  id: ResponseDocumento.id,
  legajo: ResponseDocumento.legajo,
  id_tipo_documento: ResponseDocumento.id_tipo_documento,
  nombre_documento: ResponseDocumento.nombre_documento,
  tamanio: ResponseDocumento.tamanio,
  extension: ResponseDocumento.extension.toUpperCase(),
  ruta: ResponseDocumento.ruta,
});
