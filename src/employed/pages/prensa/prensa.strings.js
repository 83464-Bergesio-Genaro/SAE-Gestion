// Static display texts for the Prensa feature.
// Update copy here without touching component logic or layout.

export const PRENSA_STRINGS = {
  adminTitle: "Administrar Publicaciones",

  // Filtros
  filterAll: "Todas",
  filterActive: "Activas",
  filterExpired: "Vencidas",
  searchPlaceholder: "Buscar...",
  newButtonLabel: "Nueva",

  // DataGrid columns
  colId: "ID",
  colTitle: "Título",
  colDescription: "Descripción",
  colStartDate: "Fecha Inicio",
  colExpiry: "Vigencia",
  colPriority: "Prioridad",
  colFixed: "Fija",
  colViews: "Vistas",
  colActions: "Acciones",
  colFixed_yes: "Sí",
  colFixed_no: "No",

  // Edit modal
  editTitle: "Editar Publicación",
  fieldTitle: "Título",
  fieldDescription: "Descripción",
  fieldStartDate: "Fecha Inicio",
  fieldEndDate: "Fecha Fin",
  fieldPriority: "Prioridad",
  fieldNoDarBaja: "No dar de baja",
  attachDocument: "Adjuntar documento",
  saveButton: "Guardar",
  saving: "Guardando...",

  // Delete modal
  deleteTitle: "Eliminar publicación",
  deleteConfirm: () => `¿Estás seguro de que deseas eliminar `,
  deleteConfirmBold: (titulo) => titulo,
  deleteButton: "Eliminar",

  // Snackbar messages
  snackSaved: "Publicación guardada",
  snackCreated: "Publicación guardada",
  snackDeleted: "Publicación eliminada",
  snackErrorSave: "Error al guardar",
  snackErrorCreate: "Error al crear publicación",
  snackWarnDocUpload: "Publicación creada, pero falló la subida del documento",
  snackWarnDocLink: "Publicación creada, pero falló el vínculo con el documento",

  // Nueva publicación dialog (also used for edit)
  nueva: {
    title: "Nueva Publicación De Prensa",
    editTitle: "Editar Publicación",
    sectionDatos: "Datos",
    sectionVigencia: "Vigencia",
    sectionPrioridad: "Prioridad",
    sectionDocumentos: "Documentos",
    fieldTitle: "Título",
    fieldDescription: "Descripción",
    fieldStartDate: "Fecha Inicio",
    fieldEndDate: "Fecha Vigencia",
    fieldNoDarBaja: "No dar de baja",
    tabUpload: "Subir nuevo",
    tabExisting: "Existente",
    attachButton: "Adjuntar documento",
    searchDocPlaceholder: "Buscar documento...",
    tableColName: "Nombre",
    tableColType: "Tipo",
    tableColView: "Vista",
    noDocuments: "Sin documentos disponibles",
    docCount: (n) => `${n} documento${n !== 1 ? "s" : ""}`,
    saveButton: "Guardar",
    saving: "Guardando...",
  },

  // Document type labels
  tipoImagen: "Imagen",
  tipoDocumento: "Documento",

  // Priority labels
  priorityNormal: "Normal",
  priorityMedium: "Media",
  priorityHigh: "Alta",
};
