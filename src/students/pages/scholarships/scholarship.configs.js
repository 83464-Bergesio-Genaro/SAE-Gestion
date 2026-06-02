export const TIPO_BECA = {
  ECONOMICA: "Beca Economica",
  SERVICIO: "Beca de Servicio",
  INVESTIGACION: "Beca de Investigacion",
};

export const PERSONAL_FIELDS = [
  { name: "nombre", label: "Nombre", type: "text" },
  { name: "apellido", label: "Apellido", type: "text" },
  { name: "dni", label: "DNI", type: "text" },
  {
    name: "fechaNacimiento",
    label: "Fecha de nacimiento",
    type: "date",
    InputLabelProps: { shrink: true },
  },
  { name: "telefono", label: "Telefono", type: "text" },
  { name: "email", label: "Mail", type: "email" },
  { name: "domicilio", label: "Domicilio", type: "text", fullWidth: true },
  { name: "legajo", label: "Legajo", type: "text" },
];

export const GENERIC_DOCUMENTS = [
  {
    id: "cbu",
    nombre: "Comprobante de CBU",
    required: true,
  },
  {
    id: "ddjj",
    nombre: "Declaracion Jurada",
    required: true,
  },
];

export const REQUERID_DOCUMENTS = [
  {
    id_tipo_documento: null,
    nombre: "Comprobante de CBU",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_CBU",
    id_archivo: null,
    extension: null,
    required: true,
  },
  {
    id_tipo_documento: null,
    nombre: "Declaracion Jurada",
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_DDJJ",
    id_archivo: null,
    extension: null,
    required: true,
  },
];

export const ECONOMIC_DOCUMENTS = [
  {
    nombre: "DNI Grupo Familiar",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_DNI_FAMILIAR",
    id_archivo: null,
  },
  {
    nombre: "Comprobante Ingresos Mensuales",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_INGRESOS_MENSUALES",
    id_archivo: null,
  },
  {
    nombre: "Factura Servicio",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_FACTURAS_SERVICIOS",
    id_archivo: null,
  },
  {
    nombre: "Impuesto Inmobiliario",
    required: true,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_IMPUESTO_INMOBILIARIO",
    id_archivo: null,
  },
];

export const ECONOMIC_OPTIONAL_DOCUMENTS = [
  {
    nombre: "Constancia de Desocupado",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_CONSTANCIA_DESOCUPADO",
    id_archivo: null,
  },
  {
    nombre: "Libreta Casamiento o Partida Hermanos",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_HERMANOS_MENORES",
    id_archivo: null,
  },
  {
    nombre: "Libreta Casamiento y Partida Hijos",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_FAMILIA_CASADO_HIJOS",
    id_archivo: null,
  },
  {
    nombre: "Contrato Alquiler y Pago",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_CONTRATO_ALQUILER",
    id_archivo: null,
  },
  {
    nombre: "Pago Credito Hipotecario",
    required: false,
    extension: null,
    id_tipo_documento: null,
    subido: false,
    archivo: null,
    archivoNombre: "",
    formatoNombre: "{Apellido}_{legajo}_{carrera}_CREDITO_HIPOTECARIO",
    id_archivo: null,
  },
];

export const DOCUMENTS_BY_TIPO_BECA = {
  [TIPO_BECA.ECONOMICA]: REQUERID_DOCUMENTS,
  [TIPO_BECA.SERVICIO]: REQUERID_DOCUMENTS,
  [TIPO_BECA.INVESTIGACION]: REQUERID_DOCUMENTS,
};

export const TIPO_BECA_FIELDS = {
  [TIPO_BECA.INVESTIGACION]: {
    type: "select",
    label: "Proyecto Investigacion",
    field: "beca",
    optionsSource: "proyectosRows",
    valueProp: "id",
    labelProp: "nombre_proyecto_investigacion",
    fullRow: true,
  },
  [TIPO_BECA.SERVICIO]: {
    type: "select",
    label: "Area",
    field: "beca",
    optionsSource: "serviciosRows",
    valueProp: "id",
    labelProp: "nombre",
    fullRow: true,
  },
  [TIPO_BECA.ECONOMICA]: {
    type: "textarea",
    label: "Describe tu situacion economica",
    field: "descripcionSituacion",
    minRows: 4,
  },
};
