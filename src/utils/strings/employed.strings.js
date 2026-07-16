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

export const COMPRAS_STRINGS = {
  headerTitle: "Módulo de Compras",
  headerSubtitle: "Gestion de las Compras",
  headerDescription:
    "En este módulo se registran todas las compras que hace la secretaria.",

  sectionTitle: "Compras",
  addButton: "Registrar Compra",

  filterDateFrom: "Fecha Desde",
  filterDateTo: "Fecha Hasta",

  deleteEntityLabel: "Compra",

  dialogDocumentsTitle: "Documentos de la compra",
  dialogCreateTitle: "Registrar Compra",

  sectionPurchaseData: "Datos de la compra",
  sectionTechnicalReport: "Informe técnico",
  sectionDocumentation: "Documentación",

  fieldEmployee: "Empleado que hizo la compra",
  fieldPurchaseName: "Nombre de la compra",
  fieldSuggestedPrice: "Precio sugerido",
  fieldReason: "Motivo",
  fieldPurchaseDate: "Fecha compra",
  fieldFileNumber: "Nro expediente",
  fieldRealPrice: "Precio real",
  fieldRequesterName: "Nombre solicitante",
  fieldWinnerName: "Nombre ganador",
  fieldTenderDate: "Fecha licitacion",
  fieldReportDate: "Fecha informe",

  currencyPlaceholder: "99.999,99",

  documentationInfo:
    "Completá primero los datos de la compra para adjuntar documentación. El informe técnico puede quedar vacío.",
  notUploadedLabel: "No adjunto",
  uploadedLabel: "Adjunto",
  documentValidation: {
    incompletePurchaseData:
      "Completá los datos de la compra antes de adjuntar documentación.",
    invalidType: (extensions) => `Solo se permiten archivos: ${extensions}`,
    maxSize: (maxSizeMb) => `El archivo no puede superar los ${maxSizeMb} MB.`,
    deleteInvoiceError: "No se pudo eliminar la factura",
  },

  cancel: "Cancelar",
  save: "Guardar",

  deleteSuccess: "Compra eliminada!",
  deleteError: "No se pudo eliminar la compra",
  deleteMissingId: "No se pudo identificar la compra a eliminar.",
  deleteDocumentError: "No se pudo eliminar el documento",
  saveSuccessCreate: "Compra creada!",
  saveSuccessDocs: "Documentos actualizados!",
  saveSuccessUpdate: "Cambios guardados!",
  saveError: "Ocurrió un error al guardar",
  saveMissingPurchaseId: "No se pudo obtener el id de la compra.",
  saveMissingInvoiceType: "No se encontró el tipo de documento Facturas.",
  saveMissingReportType: "No se encontró el tipo de documento Informe tecnico.",
  saveRequiredPurchaseData:
    "Completá empleado, nombre de la compra, precio sugerido, motivo y fecha de compra.",
  saveRequiredInvoice: "Adjuntá al menos una factura para crear la compra.",
  saveRequiredReport:
    "Completá todos los campos del informe: nro expediente, precio real, fecha licitación, fecha informe, solicitante y ganador.",
  loadDocumentTypesError: "No se pudieron cargar los tipos de documento.",
  attachedInvoices: (count) => `${count} facturas adjuntas`,
  actionViewDocuments: "Ver documentos",
  actionDeletePurchase: "Eliminar compra",

  incompleteReportTitle: "Informe técnico incompleto",
  incompleteReportMessage:
    "Estás por crear una compra sin informe técnico. ¿Querés continuar?",
  back: "Volver",
  createWithoutReport: "Crear sin informe",
};

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
  snackWarnDocLink:
    "La publicación se guardó, pero no se pudo vincular el documento.",
  snackWarnDocUpload:
    "La publicación se guardó, pero no se pudo subir el documento.",
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

export const BECAS_STRINGS = {
  headerTitle: "Módulo de Becas",
  headerSubtitle: "Gestion de Becas",
  headerDescription:
    "EAdministra becas, proyectos de investigacion y servicios desde un solo lugar.",

  scholarshipTypeEconomica: "Beca económica",
  scholarshipTypeServicio: "Servicio interno",
  scholarshipTypeInvestigacion: "Investigación",

  loadResearchProjectsError: "Error al cargar proyectos de investigación:",
  loadInternalServicesError: "Error al cargar servicios internos:",
  loadScholarshipHoldersError: "Error al cargar becarios completos:",

  saveDefaultSuccess: "La accion se realizo exitosamente",
  saveGenericSuccess: "Se guardó con éxito",
  saveResearchProjectCreated: "Proyecto de investigación creado exitosamente",
  saveResearchProjectUpdated: "Proyecto de investigación editado exitosamente",
  saveInternalServiceCreated: "Servicio interno creado exitosamente",
  saveInternalServiceUpdated: "Servicio interno editado exitosamente",
  saveScholarshipHolderCreated: "Becario creado exitosamente",
  saveScholarshipHolderUpdated: "Becario editado exitosamente",
  saveNoChanges: "No se detectaron cambios para guardar",
  saveMissingCardLogic: "No hay logica de guardado definida para esta card:",
  saveError: "Ocurrio un error al guardar",
  missingScholarshipId: (name) => `No se encontro el id de la beca ${name}`,

  becarioDialog: {
    entityTitle: "Becarios",
    loadScholarshipsError: "No se pudieron recuperar las becas del alumno",

    validationYear: "Ingresá un año válido",
    validationFutureDate: "La fecha no puede ser mayor a hoy",
    validationScholarshipType: "Seleccioná un tipo de beca",
    validationDuplicateScholarship: "El becario ya tiene ese tipo de beca",
    validationModules: "Los módulos deben ser un número de 0 a 3",
    validationResearchProject: "Seleccioná un proyecto de investigación",
    validationInternalService: "Seleccioná un servicio",

    fieldId: "ID",
    fieldPreviousScholarshipHolderId: "ID Becario Previo",
    fieldStudentId: "Legajo",
    fieldScholarshipHolderName: "Nombre Becario",
    fieldRent: "Alquila",
    fieldActive: "Activo",
    fieldAcceptedStart: "Aceptado Inicio",
    fieldCanPay: "Puede Pagarle",
    fieldScholarshipYear: "Año Beca",
    fieldRequestDate: "Fecha Solicitud",
    fieldProjectName: "Nombre del proyecto",
    fieldServiceName: "Nombre del servicio",
    fieldModules: "Módulos",
    fieldAssignedModules: "Módulos asignados",
    fieldScholarshipType: "Tipo de beca",

    clear: "Limpiar",
    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando",
    scholarshipData: "Datos de becas",
    searchingScholarships: "Buscando becas...",
    noScholarships: "No tiene becas registradas.",
    addScholarship: "Agregar nueva beca",
    requiredDocumentation: "Documentación requerida",
    loadingDocumentation: "Controlando documentación...",
    commonDocumentation: "Documentación general",
    economicDocumentation: "Documentación económica",
    uploadedDocument: "Subido",
    missingDocument: "Falta",
    viewDocument: "Ver documento",
    documentationLoadError: "No se pudo controlar la documentación del alumno",
    previewLoadError: "No se pudo cargar el documento",
  },

  serviceDialog: {
    entityTitle: "Servicio",
    fieldId: "ID",
    fieldName: "Nombre",
    fieldPhone: "Nro Teléfono",
    fieldInternalPhone: "Nro Teléfono Interno",
    fieldInstitutionalEmail: "Email Institucional",
    fieldOpeningTime: "Horario Atención",
    fieldClosingTime: "Horario Atención Final",

    validationName: "Ingresá el nombre del servicio",
    validationPhoneRequired: "Ingresá el teléfono",
    validationPhoneFormat: "Ingresá un teléfono válido de 12 dígitos",
    validationInternalPhone: "Ingresá un interno válido",
    validationEmailRequired: "Ingresá el email institucional",
    validationEmailFormat:
      "Ingresá un email válido. Ejemplo: servicio@frc.utn.edu.ar",
    validationOpeningTime: "Ingresá el horario de atención",
    validationClosingTime: "Ingresá el horario de cierre",
    validationClosingTimeAfterOpening:
      "El horario final no puede ser anterior al inicial",

    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando",
  },

  projectDialog: {
    entityTitle: "Proyecto",
    sectionTitle: "Proyectos",
    addButton: "Nuevo proyecto",
    editAction: "Editar Proyecto",
    fieldId: "ID",
    fieldActive: "Activo",
    fieldName: "Nombre Proyecto Investigación",
    fieldResearchCenter: "Centro de Investigación",

    validationName: "Ingresá el nombre del proyecto",
    validationResearchCenter: "Ingresá el centro de investigación",

    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando",
  },
};
