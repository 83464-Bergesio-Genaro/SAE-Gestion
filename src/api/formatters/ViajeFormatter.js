export const mapViajes = (viaje) => ({
    id: viaje.id,
    nombre: viaje.nombre,
    fecha_inicio: removerHoras(viaje.fecha_inicio),
    fecha_fin: removerHoras(viaje.fecha_fin),
    seguro: viaje.seguro_confirmado,
    origen: viaje.origen,
    destino: viaje.destino,
    cantidad_personas: viaje.cantidad_personas,
    motivo: viaje.motivo,
    id_empresa_viaje: viaje.id_empresa_viaje,
    nombre_empresa: viaje.nombre_empresa,
    costo_aproximado: viaje.costo_aproximado,
});

function removerHoras(isoString) {
    if (!isoString) return "";  
    const [year, month, day] = (isoString.split("T")[0]).split("-");
    return year+'-'+month+'-'+day;
}