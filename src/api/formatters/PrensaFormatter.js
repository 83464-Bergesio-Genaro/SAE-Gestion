export const mapPublicacionPublica = (publicacion) => {
  // 1. Convertimos el texto en un array de objetos reales una sola vez+
  const todosLosArchivos = parseFiles(publicacion.documentos_asociados);

  // 2. Sacamos el primer archivo para la portada (si existe)
  const portada = todosLosArchivos.length > 0 ? todosLosArchivos[0] : null;

  // 3. El resto de los archivos van a la lista de documentos
  const documentos = todosLosArchivos.slice(1);
  return {
    id: publicacion.id,
    titulo_publicacion: publicacion.titulo_publicacion,
    descripcion: publicacion.descripcion,
    fecha_inicio: removerHoras(publicacion.fecha_inicio),
    fecha_vigencia: removerHoras(publicacion.fecha_vigencia),
    prioridad: publicacion.prioridad,
    no_dar_baja: publicacion.no_dar_baja,
    visualizaciones: publicacion.visualizaciones,
    portada: portada, // 👈 Primera imagen (ya no aparece en documentos)
    documentos: documentos, // 👈 Todo lo demás
    ruta_publicacion: "https://www.instagram.com/sae.utn.frc/",
  };
};

function removerHoras(isoString) {
  if (!isoString) return "";
  const [year, month, day] = isoString.split("T")[0].split("-");
  return year + "/" + month + "/" + day;
}

function parseFiles(filesString) {
  // Validamos que sea un texto útil
  if (!filesString || filesString.length <= 1) return [];
  // Quitamos el último carácter sobrante (como el guion final)
  const limpia = filesString.endsWith("-")
    ? filesString.slice(0, -1)
    : filesString;

  return limpia
    .split("-")
    .filter((item) => item.includes(",")) // 👈 Ignora textos vacíos o mal formados como "Documento2"
    .map((item) => {
      const [id, filename] = item.split(",");
      return {
        id: id,
        name: filename || "",
        nombre_documento: filename || "",
        extension: filename?.split(".").pop().toLowerCase() || "",
      };
    });
}
