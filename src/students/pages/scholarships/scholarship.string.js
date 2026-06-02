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

  deleteDocTitle: "Eliminar Documento",
  deleteDocMessage: (nombreDoc) =>
    `¿Estás seguro de que deseas eliminar ${nombreDoc}?`,
  deleteDocButton: "Eliminar",
};
