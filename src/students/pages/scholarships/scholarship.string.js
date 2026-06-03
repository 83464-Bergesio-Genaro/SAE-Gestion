import AttachMoney from "@mui/icons-material/AttachMoney";
import Science from "@mui/icons-material/Science";
import SettingsAccessibility from "@mui/icons-material/SettingsAccessibility";

export const SCHOLARSHIP_STRINGS = {
  bigTitle: "Becas",
  bigSubtitle: "Todas las becas en un solo lugar",
  title: "Administrar Becas",

  documentationTitle: "Mis Becas",
  documentationSubtitle:
    "Aquí podrás ver las becas a las que estás inscripto, el estado de cada una y la documentación requerida para cada una.",
  FAQTitle: "Preguntas Frecuentes",
  FAQSubtitle:
    "¿Tenés dudas sobre las becas? Acá te dejamos las preguntas más frecuentes y sus respuestas.",
  faqsBecas: [
    {
      pregunta: "¿Cómo solicito una beca?",
      respuesta:
        "Para solicitar una beca, ingresá a la sección de becas, completá la información requerida y adjuntá la documentación correspondiente.",
    },
    {
      pregunta: "¿Qué documentación debo presentar?",
      respuesta:
        "La documentación puede variar según el tipo de beca, pero normalmente se solicita DNI, certificado de alumno regular y documentación respaldatoria.",
    },
    {
      pregunta: "¿Puedo modificar la documentación después de subirla?",
      respuesta:
        "Si la documentación todavía no fue evaluada, podés eliminar el archivo cargado y volver a subir uno nuevo.",
    },
    {
      pregunta: "¿Cómo sé si mi beca fue aprobada?",
      respuesta:
        "El estado de la solicitud se mostrará dentro de la sección de becas. También podrías recibir una notificación cuando haya novedades.",
    },
  ],
  cardSolicitarTitle: "Solicitar Beca",
  cardSolicitarSubtitle: "Solicita una nueva beca",
  alquilarTitle: "Alquila?",
  DatosPersonales: "Datos Personales",
  TiposBecas: "Tipos de Becas",
  tipoBecaLabel: "Tipo Beca",
  proyectoInvestigacionLabel: "Proyecto Investigacion",
  areaLabel: "Area",
  descripcionSituacionLabel: "Describe tu situacion economica",
  requiredDocumentsTitle: "Documentos Requeridos",
  economicDocumentsTitle: "Documentos de Beca Economica",
  addOptionalEconomicDocumentLabel: "Agregar documento si corresponde",
  addButton: "Agregar",
  cancelButton: "Cancelar",
  saveButton: "Guardar",
  savingButton: "Guardando...",
  savingRequest: "Guardando solicitud...",
  validationSelectScholarshipType: "Selecciona un tipo de beca",
  validationSelectScholarshipOption: "Selecciona una opcion para la beca",
  validationAttachDocuments: (documents) => `Adjunta: ${documents}`,
  validationDescribeEconomicSituation: "Describi tu situacion economica",
  uploadAllowedExtensions: (extension) =>
    `Solo se permiten archivos: ${extension}`,
  uploadMaxSize: (maxSize) => `El archivo no puede superar los ${maxSize} MB.`,
  documentTypeNotFound: (documentName) =>
    `No se encontro el tipo de documento: ${documentName}`,
  uploadSuccess: "Archivo subido con exito",
  uploadError: "Error al subir el archivo",
  createEconomicScholarshipSuccess:
    "Se creo la beca economica correctamente",
  createInvestigationScholarshipSuccess:
    "Se creo la beca de investigacion correctamente",
  createServiceScholarshipSuccess: "Se creo la beca de servicio correctamente",
  invalidScholarshipType: "Tipo de beca invalido",
  createScholarshipError: "Hubo un error al crear la beca",
  listaTiposBecas: [
    { nombre: "Beca Economica", icon: "AttaachMoney" },
    { nombre: "Beca de Investigacion", icon: "Science" },
    { nombre: "Beca de Servicio", icon: "SettingsAccessibility" },
  ],

  listaProyectoInvestigacion: [
    "Proyecto de Investigación en Ciencias Sociales",
    "Proyecto de Investigación en Ciencias Naturales",
    "Proyecto de Investigación en Tecnología",
  ],
  listaProyectoServicio: [
    "Servicio Comunitario",
    "Servicio de Apoyo Académico",
  ],

  // Document State Label
  docStataUplodaded: "Subido",
  docStateNotUploaded: "No subido",
  docRequired: "Requerido",
  docOptional: "Opcional",
  docWithoutFile: "Sin archivo",
  docAllowedFormats: (extension) => `Formatos permitidos: ${extension}`,
  myDocumentsTitle: "Mis Documentos",
  economicScholarshipDocumentsTitle: "Documentos - Beca Economica",

  incompleteProfileTitle: "Advertencia",
  incompleteProfileMessage:
    "Para solicitar la beca debe completar los datos en la seccion de Perfil.",
  incompleteProfileButton: "Ir a Perfil",

  requestedDateLabel: "Fecha Solicitud:",
  assignedModulesLabel: "Modulos Asignados:",
  projectLabel: "Proyecto:",
  serviceLabel: "Servicio:",
  emptyValue: "-",

  cbuTitle: "CBU",
  cbuDescription: "Ingresa tu CBU para pagos.",
  cbuLabel: "CBU",
  cbuSaveButton: "Guardar CBU",
  cbuSavedSuccess: "CBU guardado con exito",
  cbuInvalid: "El CBU debe tener exactamente 22 digitos",

  utnLogoAlt: "UTN girando",
  loadScholarshipsError: "No se pudieron cargar tus becas",
  previewLoadError: "No se pudo cargar el documento",

  deleteDocTitle: "Eliminar Documento",
  deleteDocMessage: (nombreDoc) =>
    `¿Estás seguro de que deseas eliminar ${nombreDoc}?`,
  deleteDocButton: "Eliminar",
  docEliminado: "El documento ha sido eliminado con exito",
  docEliminadoError: "No se pudo eliminar el documento",
};
