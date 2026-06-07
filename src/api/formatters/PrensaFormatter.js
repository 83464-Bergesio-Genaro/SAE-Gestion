export const mapPublicacionPublica = (publicacion) => ({
  id: publicacion.id,
  titulo: publicacion.titulo_publicacion,
  descripcion: publicacion.descripcion ,
  fecha_inicio: removerHoras(publicacion.fecha_inicio),
  fecha_vigencia: removerHoras(publicacion.fecha_vigencia),
  prioridad:publicacion.prioridad,
  no_dar_baja: publicacion.no_dar_baja,
  visualizaciones: publicacion.visualizaciones,
  portada: getFirstImage(publicacion.documentos_asociados),
  documentos:getDownloadableFiles(publicacion.documentos_asociados),
  ruta_publicacion:"https://www.instagram.com/sae.utn.frc/"
});
function removerHoras(isoString) {
    if (!isoString) return "";  
    const [year, month, day] = (isoString.split("T")[0]).split("-");
    return year+'/'+month+'/'+day;
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
  
  return image;
}

export function getDownloadableFiles(filesString){
  const files = parseFiles(filesString);
  return files.filter(file => 
    !imageFormats.includes(file.extension)
  );

}
