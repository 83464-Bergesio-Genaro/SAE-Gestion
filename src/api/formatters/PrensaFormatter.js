export const mapPublicacionPublica = (publicacion) => ({
  id: publicacion.id,
  titulo: publicacion.titulo_publicacion,
  descripcion: publicacion.descripcion,
  fecha_inicio: formatearFecha(publicacion.fecha_inicio),
  fecha_vigencia: formatearFecha(publicacion.fecha_vigencia),
  prioridad:publicacion.prioridad,
  no_dar_baja: publicacion.no_dar_baja,
  visualizaciones: publicacion.visualizaciones,
  portada: getFirstImage(publicacion.documentos_asociados),
  documentos:getDownloadableFiles(publicacion.documentos_asociados)
});
const formatearFecha =(fecha) =>{
    const dateObject = new Date(fecha); // Or your parsed date object
    // Format the date for display in DD/MM/YYYY format
    return dateObject.toLocaleDateString('en-GB'); 
}
function parseFiles(filesString){
  
  if(filesString != null && filesString.length > 1 ){
    filesString = filesString.slice(0, -1);
    return filesString.split("-").map(item => {
        const [id, filename] = item.split(",");
        return {
        id: id,
        name: filename,
        extension: filename.split(".").pop().toLowerCase()
        };
    });
  }
  else return [];
}
const imageFormats = ["jpg","jpeg","png","svg"];

export function getFirstImage(filesString){
  const files = parseFiles(filesString);
  const image = files.find(file => 
    
    imageFormats.includes(file.extension)
  );
  if(!image) return null;
  return image;
}

export function getDownloadableFiles(filesString){
  const files = parseFiles(filesString);
  return files.filter(file => 
    !imageFormats.includes(file.extension)
  );

}
