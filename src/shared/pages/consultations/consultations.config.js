export const SAE_EMAIL =
  import.meta.env.VITE_SAE_EMAIL || "sae@frc.utn.edu.ar";

export const CONSULTATION_FAQS = [
  {
    id: "becas",
    category: "Becas",
    question: "¿Cómo solicito una beca?",
    answer:
      "Completá todos los datos de tu perfil, cargá la documentación requerida y elegí el tipo de beca desde Mis Becas.",
    link: "/Mis-Becas",
    linkLabel: "Ir a Mis Becas",
    image: "images/infoSection/becasFRC.jpg",
  },
  {
    id: "deportes",
    category: "Deportes",
    question: "¿Dónde consulto deportes e inscripciones?",
    answer:
      "En Mis Deportes podés consultar las disciplinas disponibles, horarios e inscripciones activas.",
    link: "/Mis-Deportes",
    linkLabel: "Ir a Mis Deportes",
    image: "images/infoSection/deportesFRC.webp",
  },
  {
    id: "salud",
    category: "Salud",
    question: "¿Cómo solicito un turno médico?",
    answer:
      "Ingresá a Mi Salud para consultar especialidades, profesionales, horarios y gestionar tus turnos.",
    link: "/Mi-Salud",
    linkLabel: "Ir a Mi Salud",
    image: "images/infoSection/saludFRC.jpg",
  },
  {
    id: "perfil",
    category: "Perfil",
    question: "¿Por qué debo completar mi perfil?",
    answer:
      "Los datos completos y actualizados son necesarios para solicitar becas y utilizar otros servicios de SAE.",
    link: "/Mi-Perfil",
    linkLabel: "Completar mi perfil",
    image: "images/infoSection/tramitesFRC.jpg",
  },
];

export const QUICK_CONSULTATION_FAQS = [
  {
    id: "documentacion-formatos",
    category: "Documentación",
    question: "¿Qué formatos de archivo puedo subir?",
    answer:
      "Cada documento indica los formatos permitidos antes de cargarlo. Generalmente se aceptan PDF, JPG, JPEG y PNG.",
  },
  {
    id: "documentacion-reemplazar",
    category: "Documentación",
    question: "¿Puedo reemplazar un documento cargado?",
    answer:
      "Sí. Mientras el trámite lo permita, eliminá el archivo actual y cargá la versión corregida.",
  },
  {
    id: "beca-estado",
    category: "Becas",
    question: "¿Dónde consulto el estado de mi beca?",
    answer:
      "Ingresá a Mis Becas. Allí vas a encontrar las solicitudes realizadas y el estado actualizado de cada una.",
  },
  {
    id: "beca-varias",
    category: "Becas",
    question: "¿Puedo solicitar más de un tipo de beca?",
    answer:
      "Podés consultar y solicitar las opciones habilitadas. La aprobación depende de los requisitos y criterios definidos por SAE.",
  },
  {
    id: "salud-cancelar",
    category: "Salud",
    question: "¿Qué hago si no puedo asistir a un turno?",
    answer:
      "Ingresá a Mi Salud y revisá las opciones disponibles para cancelar o gestionar el turno con anticipación.",
  },
  {
    id: "perfil-actualizar",
    category: "Perfil",
    question: "¿Cómo actualizo mis datos personales?",
    answer:
      "Ingresá a Mi Perfil, modificá los datos necesarios y presioná Guardar Cambios. Todos los campos deben quedar completos.",
  },
  {
    id: "respuesta-consulta",
    category: "Contacto",
    question: "¿Cuánto demora la respuesta a una consulta?",
    answer:
      "El tiempo puede variar según el tema y la cantidad de solicitudes. Incluí todos los datos necesarios para agilizar la respuesta.",
  },
  {
    id: "problema-acceso",
    category: "Acceso",
    question: "¿Qué hago si no puedo acceder a una sección?",
    answer:
      "Verificá que tu sesión siga activa y recargá la página. Si el problema continúa, enviá una consulta detallando la sección y el error.",
  },
];
