const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const EMPTY_TOURNAMENT = {
  nombre_torneo: "",
  fecha_inicio: "",
  fecha_fin: "",
  fecha_limite_inscripcion:"",
  activo:"",
  nombre_deporte:"",
  docente_responsable:"",
  cupo_jugadores:""
}

export const PROFILE_REQUIRED_FIELDS = [
  ["legajo", "Legajo"],
  ["nombres", "Nombres"],
  ["apellidos", "Apellidos"],
  ["dni", "DNI"],
  ["cuil", "CUIL"],
  ["fecha_nacimiento", "Fecha de nacimiento"],
  ["email", "Correo electrónico"],
  ["telefono", "Teléfono"],
  ["direccion", "Dirección"],
];


export const PERSONAL_FIELDS = [
  { name: "nombres", label: "Nombres", type: "text", md: 6 },
  { name: "apellidos", label: "Apellidos", type: "text", md: 6 },
  { name: "dni", label: "DNI", type: "text", md: 3 },
  { name: "cuil", label: "CUIL", type: "text", md: 3 },
  {
    name: "fecha_nacimiento",
    label: "Fecha de nacimiento",
    type: "date",
    md: 3,
    InputLabelProps: { shrink: true },
  },
  { name: "telefono", label: "Telefono", type: "text", md: 3 },
  { name: "email", label: "Mail", type: "email", md: 6 },
  { name: "legajo", label: "Legajo", type: "text", md: 6 },
  { name: "direccion", label: "Domicilio", type: "text", md: 12 },
];

export const SPORTS_REQUIRED_DOCUMENTS = [
  { 
    id_tipo_documento: null,
    nombre: "Certificado de Alumno Regular",
    descripcion:
      "Certificado vigente que acredita tu condición de estudiante regular.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_AlumnoRegular",
    id_archivo: null,
    extension: null,
    required: true,
  },
  {
    id_tipo_documento: null,
    nombre: "Fotocopia Documento",
    descripcion:
      "Copia legible del frente y dorso de tu DNI en un único archivo.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_DNI",
    id_archivo: null,
    extension: null,
    required: true,
  },
  {
    id_tipo_documento: null,
    nombre: "Ficha Medica o E.M.M.A.C",
    descripcion:
      "Certificado médico vigente que indica que estás apto para realizar actividad física.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_FichaMedica",
    id_archivo: null,
    extension: null,
    required: true,
  },
];


// Documentos comunes a cualquier solicitud de beca.
export const SCHOLARSHIPS_REQUERID_DOCUMENTS = [
  {
    id_tipo_documento: null,
    nombre: "Comprobante de CBU",
    descripcion: "Constancia bancaria donde figure tu CBU para pagos.",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_CBU",
    id_archivo: null,
    extension: null,
    required: true,
  },
  {
    id_tipo_documento: null,
    nombre: "Declaracion Jurada",
    descripcion: "Descarga, completa, firma y adjunta la declaracion jurada.",
    externalUrl:
      "https://docs.google.com/document/d/1wbuUbySrYoNTnyOcojTkkMGHOleb0Afq/edit?usp=drivesdk&ouid=116947469098280320832&rtpof=true&sd=true",
    externalUrlLabel: "Ejemplo",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_DDJJ",
    id_archivo: null,
    extension: null,
    required: true,
  },
];

// Documentos especificos para la beca economica. Los opcionales se muestran
// solo cuando el usuario los agrega o cuando ya tienen un archivo cargado.
export const ECONOMIC_DOCUMENTS = [
  {
    nombre: "DNI Grupo Familiar",
    descripcion: "DNI de las personas que integran tu grupo familiar.",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_DNI_FAMILIAR",
    id_archivo: null,
  },
  {
    nombre: "Comprobante Ingresos Mensuales",
    descripcion:
      "Recibos de sueldo, monotributo, jubilacion u otros ingresos del hogar.",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_INGRESOS_MENSUALES",
    id_archivo: null,
  },
  {
    nombre: "Factura Servicio",
    descripcion:
      "Factura reciente de luz, gas, agua, internet u otro servicio del domicilio.",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_FACTURAS_SERVICIOS",
    id_archivo: null,
  },
  {
    nombre: "Impuesto Inmobiliario",
    descripcion:
      "Comprobante del impuesto inmobiliario de la vivienda familiar.",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_IMPUESTO_INMOBILIARIO",
    id_archivo: null,
  },
];

export const ECONOMIC_OPTIONAL_DOCUMENTS = [
  {
    nombre: "Constancia de Desocupado",
    descripcion:
      "Constancia emitida por ANSES si algun integrante no tiene empleo.",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_CONSTANCIA_DESOCUPADO",
    id_archivo: null,
  },
  {
    nombre: "Libreta Casamiento o Partida Hermanos",
    descripcion:
      "Documentacion que acredite hermanos menores a cargo del grupo familiar.",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_HERMANOS_MENORES",
    id_archivo: null,
  },
  {
    nombre: "Libreta Casamiento y Partida Hijos",
    descripcion: "Documentacion que acredite conyuge o hijos a cargo.",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_FAMILIA_CASADO_HIJOS",
    id_archivo: null,
  },
  {
    nombre: "Contrato Alquiler y Pago",
    descripcion:
      "Contrato de alquiler y comprobante del ultimo pago realizado.",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_CONTRATO_ALQUILER",
    id_archivo: null,
  },
  {
    nombre: "Pago Credito Hipotecario",
    descripcion: "Comprobante del pago mensual del credito hipotecario.",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{legajo}_CREDITO_HIPOTECARIO",
    id_archivo: null,
  },
];
export const TRAVEL_REQUIRED_DOCUMENTS = [
    {
        id_tipo_documento: null,
        nombre: "Certificado de Alumno Regular",
        descripcion:
        "Certificado vigente que acredita tu condición de estudiante regular.",
        subido: false,
        archivo: null,
        archivoNombre: "",
        formatoNombre: "{legajo}_AlumnoRegular",
        id_archivo: null,
        extension: null,
        required: true,
    },
    {
        id_tipo_documento: null,
        nombre: "Fotocopia Documento",
        descripcion:
        "Copia legible del frente y dorso de tu DNI en un único archivo.",
        subido: false,
        archivo: null,
        archivoNombre: "",
        formatoNombre: "{legajo}_DNI",
        id_archivo: null,
        extension: null,
        required: true,
    },
    {
        id_tipo_documento: null,
        nombre: "Declaracion Jurada",
        descripcion:
        "Certificadofirmado en el cual establece un heredero a tu fortuna.",
        subido: false,
        archivo: null,
        archivoNombre: "",
        formatoNombre: "{idViaje}_{legajo}_DDJJ",
        id_archivo: null,
        extension: null,
        required: true,
    },
    ];