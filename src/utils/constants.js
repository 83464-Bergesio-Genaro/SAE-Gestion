export const calendarDays = [
        { label: "Lunes",     value: 1 },
        { label: "Martes",    value: 2 },
        { label: "Miércoles", value: 3 },
        { label: "Jueves",    value: 4 },
        { label: "Viernes",   value: 5 }
    ];

// --------------------------- SALUD --------------------------- //
export const EMPTY_TURNO =
{
    id: 0,
    cuil_medico: "",
    especialista: "",
    legajo: "",
    paciente: "",
    fecha_solicitud: "",
    fecha_atencion: "",
    hora_atencion: "",
    asunto: "",
    id_estado_turno: 0,
    estado: ""
}
//DEBE SER IGUAL LAS COLUMNAS QUE LAS FILAS
export const EMPTY_TURNO_PACIENTE =
{
    id: 0,
    especialista: "",
    fecha_solicitud: "",
    fecha_atencion: "",
    hora_atencion: "",
    asunto: "",
    estado: ""
}
