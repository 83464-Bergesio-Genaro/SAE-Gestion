const formatearFecha = (fecha) => {
  if (!fecha) return null;

  const date = new Date(fecha);

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
export const mapHorarioAlumno = (HorarioAlumno) => ({
  id: HorarioAlumno.id,
  id_espacio_deportivo: HorarioAlumno.id_espacio_deportivo,
  id_deporte: HorarioAlumno.id_deporte,
  hora_inicio: HorarioAlumno.hora_inicio,
  hora_fin: HorarioAlumno.hora_fin,
  activo: HorarioAlumno.activo,
  cuil_docente: HorarioAlumno.cuil_docente,
  dia: HorarioAlumno.dia,
  espacio_deportivo: HorarioAlumno.espacio_deportivo,
  nombre_deporte: HorarioAlumno.nombre_deporte,
  docente_responsable: HorarioAlumno.docente_responsable,
  esta_incripto: HorarioAlumno.esta_incripto,
});

export const mapDeportesActivos = (DeportesActivos) => ({
  id: DeportesActivos.id,
  nombre: DeportesActivos.nombre,
  activo: DeportesActivos.activo,
});

export const mapEspDeportivoActivos = (EspDeportivoActivos) => ({
  id: EspDeportivoActivos.id,
  nombre: EspDeportivoActivos.nombre,
  domicilio: EspDeportivoActivos.domicilio,
  activo: EspDeportivoActivos.activo,
  url_maps: EspDeportivoActivos.url_maps,
});

export const mapInscripcionesXDeportista = (InscripcionesXDeportista) => ({
  id: InscripcionesXDeportista.id,
  id_deporte: InscripcionesXDeportista.id_deporte,
  nombre_deporte: InscripcionesXDeportista.nombre_deporte,
  fecha_inscripcion: InscripcionesXDeportista.fecha_inscripcion,
});

export const mapTorneo = (Torneo) => ({
  id: Torneo.id,
  nombre: Torneo.nombre_torneo,
  fecha_inicio: formatearFecha(Torneo.fecha_inicio),
  fecha_fin: formatearFecha(Torneo.fecha_fin),
  fecha_limite_inscripcion: formatearFecha(Torneo.fecha_limite_inscripcion),
  activo: Torneo.activo ? "Sí" : "No",
  id_deporte: Torneo.id_deporte,
  deporte: Torneo.nombre_deporte,
  cuil_responsable: Torneo.cuil_responsable,
  docente_responsable: Torneo.docente_responsable,
  cupo_jugadores: Torneo.cupo_jugadores,
});

export function mapHorarios(
  horariosActivos,
  deportes,
  espaciosDeportivos,
  inscripcionesDeportista = [],
) {
  return horariosActivos.map((horario) => {
    const deporte = deportes.find((d) => d.id === horario.id_deporte);
    const espacio = espaciosDeportivos.find(
      (e) => e.id === horario.id_espacio_deportivo,
    );

    if (!deporte) {
      console.warn("No se encontró deporte para horario:", horario);
      console.warn(deportes);
    }

    if (!espacio) {
      console.warn("No se encontró espacio para horario:", horario);
    }

    const inscripcion = inscripcionesDeportista.find(
      (i) => i.id_deporte === horario.id_deporte,
    );

    return {
      id: horario.id,
      id_inscripcion: inscripcion ? inscripcion.id : null,
      id_horario: horario.id,
      id_deporte: horario.id_deporte,
      id_espacio_deportivo: espacio?.id ?? null,
      espacio_deportivo: espacio?.nombre ?? "Espacio no encontrado",
      url_map_espacio_deportivo: espacio?.url_maps ?? "",
      deporte: deporte?.nombre ?? "Deporte no encontrado",
      dia: horario.dia,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
      cuil_docente: horario.cuil_docente,
      docente_responsable: horario.docente_responsable,
      esta_inscripto: !!inscripcion,
    };
  });
}

export const mapDeportistaLegajo = (DeportistaLegajo) => ({
  id: DeportistaLegajo.id,
  legajo: DeportistaLegajo.legajo,
  nombre_deportista: DeportistaLegajo.nombre_deportista,
  vencimiento_ficha: DeportistaLegajo.vencimiento_ficha,
  habilitado_deporte: DeportistaLegajo.habilitado_deporte,
});

export const mapResponseInscripcionDeporte = (ResponseInscripcionDeporte) => ({
  id: ResponseInscripcionDeporte.id,
  nombre_deporte: ResponseInscripcionDeporte.nombre_deporte,
  fecha_inscripcion: ResponseInscripcionDeporte.fecha_inscripcion,
});

export const mapResponseEliminar = (ResponseEliminar) => ({
  texto: ResponseEliminar,
});

