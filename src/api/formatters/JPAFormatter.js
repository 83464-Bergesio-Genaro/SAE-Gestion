export const mapEventoPublico = (eventoJPA) => ({
  id: eventoJPA.id,
  encargado: eventoJPA.encargado,
  nombre_evento: eventoJPA.nombre_evento,
  fecha_evento: removerHoras(eventoJPA.fecha_evento),
  horario_inicio: mostrarHorasMinutos(eventoJPA.horario_inicio),
  horario_fin: mostrarHorasMinutos(eventoJPA.horario_fin),
  duracion: calcularHorasMinutos(
    eventoJPA.horario_inicio,
    eventoJPA.horario_fin,
  ),
  lugar:eventoJPA.ubicacion
});

export const mapStandPublico = (standJPA) => ({
  id: standJPA.id,
  nombre_stand: standJPA.nombre_stand,
  expositor: standJPA.expositor,
  ubicacion: standJPA.ubicacion,
  horario_inicio: mostrarHorasMinutos(standJPA.horario_inicio),
  horario_fin: mostrarHorasMinutos(standJPA.horario_fin)
});

const calcularHorasMinutos = (inicio, fin) => {
  const [h1, m1, s1] = inicio.split(":").map(Number);
  const [h2, m2, s2] = fin.split(":").map(Number);

  const inicioMin = h1 * 60 + m1;
  const finMin = h2 * 60 + m2;

  const diff = finMin - inicioMin;

  const horas = Math.floor(diff / 60);
  const minutos = diff % 60;

  if (minutos === 0) return `${horas}:00hs`;
  return `${horas}:${minutos}hs`;
};

const mostrarHorasMinutos = (horario) => {
  const [h1, m1, s1] = horario.split(":").map(Number);
  if (m1 === 0) return `${h1}:00hs`;
  return `${h1}:${m1}hs`;
};

function removerHoras(isoString) {
    if (!isoString) return "";  
    const [year, month, day] = (isoString.split("T")[0]).split("-");
    return year+'-'+month+'-'+day;
}

const formatearFecha = (fecha) => {
  const d = new Date(fecha);

  const dia = d.getDate();
  const mes = d.toLocaleDateString("es-AR", { month: "long" });

  return `${dia} de ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
};
