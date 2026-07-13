export const MAIN_STRINGS = {
  headerTitle: "PANEL SAE EMPLEADOS",
  headerSubtitle: "Bienvenido ",
  headerDescription:
    "Accedé rápidamente a las áreas de gestión, reportes y seguimiento diario desde una sola pantalla.",
  headerNoName: "Empleado",
  panelTitle: "Gestión General",
  panelDescription:
    "Módulos operativos principales para el trabajo diario del equipo.",

  eventsTitle: "Tus horarios y proximos eventos",
  eventsDescription: "Permite visualizar tus horarios y los eventos proximos",
};

export const CONSULTATIONS_STRINGS = {
  headerTitle: "Módulo de Consultas",
  headerSubtitle: "Gestión de Consultas",
  headerDescription:
    "Revisá el contenido visible para estudiantes y planificá su administración.",
  headerNoName: "Empleado",

  aclarationFAQS:
    "El contenido a continuacion debe controlarse mediante la solicitud al equipo de sistemas. Esto se debe a que no esta implementado un componente que permita modificarlo por la misma SAE.",
  faqsTitle: "Preguntas publicadas",
  link: "Enlace: ",
  quickFaqsTitle: "Respuestas rápidas publicadas",
  emailDescription:
    "Las consultas preparadas por estudiantes se dirigen actualmente a: ",

  errorName: "Nombre vacio o no valido",
  errorLink: "Ingresa un hipervinculo valido con http:// o https://",
  errorSaving: "Revisa los campos marcados antes de guardar.",

  formID: "ID",
  formIcon: "Icono",
  formTitle: "Título",
  formLink: "Hipervínculo",

  cancel: "Cancelar",
  create: "Crear",
  save: "Guardar",

  //Provider
  errorNoLink: "No hay hipervinculo para copiar",
  copyLinkMsg: "Hipervinculo copiado",
  errorCopyLink: "No se pudo copiar el hipervinculo",
  errorNoUpdate: "La modificacion de links frecuentes no esta disponible.",

  creationMsg: "Link Frecuente creado!",
  updateMSg: "Link Frecuente modificado correctamente",
  deleteMsg: "Link Frecuente eliminado correctamente",
  errorMsg: "Ocurrió un error al guardar",
};

export const HEALTH_STRING = {
  headerMainTitle: "Módulo de Salud",
  headerMainSubtitle: "Gestión de las capacidades medicas de nuestra area",
  headerMainDescription:
    "Permite cargar especialidades, personal, cursos, horarios para el personal y gestionar los turnos de los estudiantes",

  healthTurnsTitle: "Gestión de Turnos",
  healthTurnsButton: "Ingresar al Turnero",

  ourScheduleTitle: "Horarios Empleados",
  ourScheduleDescription: "Nuestros Horarios",
  ourScheduleButton: "Gestionar Horarios",

  specialityCreate: "Nuevo Especialidad",
  specialityUpdate: "Editar Especialidad",
  formId: "ID",
  formCompleteName: "Nombre Completo",
  formDescription: "Descripción",
  formActiveSpecialist: "Especialidad Activa",
  formNoActiveSpecialist: "Especialidad NO activa",

  cancel: "Cancelar",
  create: "Crear",
  save: "Guardar",
  delete: "Eliminar",

  employCreate: "Nuevo Empleado",
  employEdit: "Editar Empleado",
  employFault: "Registrar Falta",
  employHistoryFault: "Faltas Previas",
  employCreateFault: "Registrar Nueva Falta",
  faultObservation: "Observacion de la Falta",
  faultDate: "Fecha de la Falta",

  employSubtitle: "¡ATENCIÓN!",
  employAclaration:
    "Al crear el personal medico se le solicitara el CUIL, el mismo NO podra ser modificado despues, es decir, que despues de la carga de esta persona solo el equipo de sistemas podra eliminar dicho registro.",
  employCUIL: "CUIL",
  employName: "Nombre",
  employLastName: "Apellido",
  employSpeciality: "Especialidad",
  employUpdateSubtitle: "¡IMPORTANTE!",
  employUpdateAclaration:
    "Si la especialidad no se encuentra activa aparecera como dato pero no sera seleccionable.",
  employActive: "Personal Activo",
  employNoActive: "Personal NO activo",

  courseCreate: "Nuevo Curso",
  courseEdit: "Editar Curso",
  courseId: "ID",
  courseCapacity: "Cupo Máximo",
  courseName: "Nombre del Curso",
  courseTeacher: "Nombre del Docente",
  courseStart: "Fecha de Inicio",
  courseEnd: "Fecha de Finalización",
  courseActive: "Curso Activo",
  courseNoActive: "Curso No Activo",
};

export const JPA_STRINGS = {};

export const PRENSA_STRINGS = {
  headerTitle: "Módulo de Prensa",
  headerSubtitle: "Gestión de Publicaciones",
  headerDescription:
    "Permite gestionar las publicaciones en el módulo de prensa",
  headerNoName: "Empleado",

  errorLoadPublicaciones: "Error al cargar las publicaciones",
  errorLoadDocumentos: "Error al cargar los documentos de la publicación",

  priorityNormal: "Normal",
  priorityMedium: "Media",
  priorityHigh: "Alta",

  documentTypeLabels: {
    image: "Imagen",
    document: "Documento",
  },

  documentPreview: {
    fallbackTitle: "Vista previa",
    fallbackName: "archivo",
    noId: "No se encontro el id del documento para previsualizar.",
    notSupported: "Solo se permite vista previa para imagenes o PDF.",
    loadError: "No se pudo cargar la imagen.",
  },
  snackCreated: "Publicación creada correctamente.",
  snackSaved: "Publicación modificada correctamente.",
  snackDeleted: "Publicación eliminada correctamente.",

  snackErrorDelete: "No se pudo eliminar la publicación.",
  snackWarnDocLink: "La publicación se guardó, pero no se pudo vincular el documento.",
  snackWarnDocUpload: "La publicación se guardó, pero no se pudo subir el documento.",
  snackErrorSave: "No se pudo modificar la publicación.",
  snackErrorCreate: "No se pudo crear la publicación.",

  nueva: {
    title: "Nueva publicación",
    editTitle: "Editar publicación",
    sectionDatos: "Datos de la publicación",
    fieldTitle: "Título",
    fieldDescription: "Descripción",
    sectionVigencia: "Vigencia",
    fieldStartDate: "Fecha de inicio",
    fieldEndDate: "Fecha de vigencia",
    fieldNoDarBaja: "No dar de baja automáticamente",
    sectionPrioridad: "Prioridad",
    sectionDocumentos: "Documentación",
    tabUpload: "Subir documento",
    tabExisting: "Documento existente",
    attachButton: "Seleccionar archivo",
    searchDocPlaceholder: "Buscar documento...",
    tableColName: "Nombre",
    tableColType: "Tipo",
    tableColView: "Vista previa",
    noDocuments: "No hay documentos disponibles.",
    docCount: (count) => `${count} documento${count === 1 ? "" : "s"}`,
    saving: "Guardando...",
    saveButton: "Guardar",
  },
};
