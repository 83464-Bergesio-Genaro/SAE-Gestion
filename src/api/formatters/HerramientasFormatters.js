export const mapTiposDocumento = (ResponseTiposDocumento) => ({
  id: ResponseTiposDocumento.id,
  nombre: ResponseTiposDocumento.nombre,
  extension: ResponseTiposDocumento.extension,
});
