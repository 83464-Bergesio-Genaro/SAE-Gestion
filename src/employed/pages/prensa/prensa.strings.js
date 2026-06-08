
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
  adminRoute: "/Gestion-Prensa",

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
};

export const SORT_DATE_OPTIONS = [
  { value: "", label: "Sin orden" },
  { value: "fecha_inicio_asc",  label: "Publicado: más antiguo" },
  { value: "fecha_inicio_desc", label: "Publicado: más reciente" },
  { value: "fecha_vigencia_asc",  label: "Vigencia: más próxima" },
  { value: "fecha_vigencia_desc", label: "Vigencia: más lejana" },
];

export const SORT_NAME_OPTIONS = [
  { value: "",     label: "Sin orden" },
  { value: "asc",  label: "A → Z" },
  { value: "desc", label: "Z → A" },
];