export const PRENSA_STRINGS = {
  moduleOverline: "Módulo de Prensa",
  heroTitle: "Prensa",
  heroSubtitle: "Publicaciones, comunicados y novedades de la SAE.",
  backRoute: "/Inicio",

  chipLegajo: (legajo) => `Legajo ${legajo}`,
  chipPerfil: (id) => `Perfil ${id}`,

  searchPlaceholder: "Buscar publicación...",
  filterDateLabel: "Ordenar por fecha",
  filterNameLabel: "Ordenar por nombre",
  clearFiltersTitle: "Limpiar filtros",
  adminButtonLabel: "Administrar",
  adminRoute: "/Gestion-Prensa/Administrar",

  sortDateNone: "Sin orden",
  sortDateInicioAsc: "Publicado: más antiguo",
  sortDateInicioDesc: "Publicado: más reciente",
  sortVigenciaAsc: "Vigencia: más próxima",
  sortVigenciaDesc: "Vigencia: más lejana",

  sortNameNone: "Sin orden",
  sortNameAsc: "A → Z",
  sortNameDesc: "Z → A",

  noResults: "No se encontraron publicaciones.",
  chipFija: "Fija",

  priorityNormal: "Normal",
  priorityMedia: "Media",
  priorityAlta: "Alta",

  priorityMedium: "Media",
  priorityHigh: "Alta",

  filterAll: "Todos",
  filterActive: "Activos",
  filterExpired: "Vencidos",

  cardViews: (n) => n ?? 0,

  dialogDocsTitle: "Documentos adjuntos",
  dialogNoDocs: "No hay documentos adjuntos.",
  dialogDocTooltip: "Ver documento",
  dialogPublicado: "Publicado:",
  dialogVigencia: "Vigencia:",

  previewFallbackTitle: "Vista previa",
  previewFallbackName: "Archivo",
  previewErrorNoId: "No se encontró el id del documento para previsualizar.",
  previewErrorNotSupported: "Solo se permite vista previa para imágenes o PDF.",
  previewErrorLoad: "No se pudo cargar la imagen.",

  loadingAlt: "Cargando",

  colId: "ID",
  colTitle: "Título",
  colDescription: "Descripción",
  colStartDate: "Fecha de inicio",
  colExpiry: "Fecha de vigencia",
  colPriority: "Prioridad",
  colFixed: "Publicación fija",
  colFixed_yes: "Sí",
  colFixed_no: "No",
  colViews: "Visualizaciones",
  colActions: "Acciones",

  deleteTitle: "Eliminar publicación",
  deleteButton: "Eliminar",
  snackCreated: "Publicación creada correctamente.",
  snackSaved: "Publicación modificada correctamente.",
  snackDeleted: "Publicación eliminada correctamente.",

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

  snackWarnDocLink: "La publicación se guardó, pero no se pudo vincular el documento.",
  snackWarnDocUpload: "La publicación se guardó, pero no se pudo subir el documento.",
  snackErrorSave: "No se pudo modificar la publicación.",
  snackErrorCreate: "No se pudo crear la publicación.",
};

export const SORT_DATE_OPTIONS = [
  { value: "", label: "Sin orden" },
  { value: "fecha_inicio_asc", label: "Publicado: más antiguo" },
  { value: "fecha_inicio_desc", label: "Publicado: más reciente" },
  { value: "fecha_vigencia_asc", label: "Vigencia: más próxima" },
  { value: "fecha_vigencia_desc", label: "Vigencia: más lejana" },
];

export const SORT_NAME_OPTIONS = [
  { value: "", label: "Sin orden" },
  { value: "asc", label: "A → Z" },
  { value: "desc", label: "Z → A" },
];
