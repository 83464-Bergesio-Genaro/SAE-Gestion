export const MAIN_STRINGS = {
  headerTitle:"PANEL SAE EMPLEADOS",
  headerSubtitle:"Bienvenido ",
  headerDescription:"Accedé rápidamente a las áreas de gestión, reportes y seguimiento diario desde una sola pantalla.",
  headerNoName:"Empleado",
  panelTitle:"Gestión General",
  panelDescription:"Módulos operativos principales para el trabajo diario del equipo.",

  eventsTitle:"Tus horarios y proximos eventos",
  eventsDescription:"Permite visualizar tus horarios y los eventos proximos"
}

export const CONSULTATIONS_STRINGS =
{
  headerTitle:"Módulo de Consultas",
  headerSubtitle:"Gestión de Consultas",
  headerDescription:"Revisá el contenido visible para estudiantes y planificá su administración.",
  headerNoName:"Empleado",
  
  aclarationFAQS:"El contenido a continuacion debe controlarse mediante la solicitud al equipo de sistemas. Esto se debe a que no esta implementado un componente que permita modificarlo por la misma SAE.",
  faqsTitle:"Preguntas publicadas",
  link:"Enlace: ",
  quickFaqsTitle:"Respuestas rápidas publicadas",
  emailDescription:"Las consultas preparadas por estudiantes se dirigen actualmente a: ",

  errorName:"Nombre vacio o no valido",
  errorLink:"Ingresa un hipervinculo valido con http:// o https://",
  errorSaving:"Revisa los campos marcados antes de guardar.",
  
  formID:"ID",
  formIcon:"Icono",
  formTitle:"Título",
  formLink:"Hipervínculo",

  cancel:"Cancelar",
  create:"Crear",
  save:"Guardar",

  //Provider
  errorNoLink:"No hay hipervinculo para copiar",
  copyLinkMsg:"Hipervinculo copiado",
  errorCopyLink:"No se pudo copiar el hipervinculo",
  errorNoUpdate:"La modificacion de links frecuentes no esta disponible.",

  creationMsg:"Link Frecuente creado!",
  updateMSg:"Link Frecuente modificado correctamente",
  deleteMsg:"Link Frecuente eliminado correctamente",
  errorMsg:"Ocurrió un error al guardar"
}

export const HEALTH_STRING = {
    headerMainTitle:"Módulo de Salud",
    headerMainSubtitle:"Gestión de las capacidades medicas de nuestra area",
    headerMainDescription:"Permite cargar especialidades, personal, cursos, horarios para el personal y gestionar los turnos de los estudiantes",

    healthTurnsTitle:"Gestión de Turnos",
    healthTurnsButton:"Ingresar al Turnero",
    
    ourScheduleTitle:"Horarios Empleados",
    ourScheduleDescription:"Nuestros Horarios",
    ourScheduleButton:"Gestionar Horarios",

    specialityCreate:"Nuevo Especialidad" ,
    specialityUpdate:"Editar Especialidad",
    formId:"ID",
    formCompleteName:"Nombre Completo",
    formDescription:"Descripción",
    formActiveSpecialist:"Especialidad Activa",
    formNoActiveSpecialist:"Especialidad NO activa",

    cancel:"Cancelar",
    create:"Crear",
    save:"Guardar",
    delete:"Eliminar",

    employCreate:"Nuevo Empleado",
    employEdit:"Editar Empleado",
    employFault:"Registrar Falta",
    employHistoryFault:"Faltas Previas",
    employCreateFault:"Registrar Nueva Falta",
    faultObservation:"Observacion de la Falta",
    faultDate:"Fecha de la Falta",

    employSubtitle:"¡ATENCIÓN!",
    employAclaration:"Al crear el personal medico se le solicitara el CUIL, el mismo NO podra ser modificado despues, es decir, que despues de la carga de esta persona solo el equipo de sistemas podra eliminar dicho registro.",
    employCUIL:"CUIL",
    employName:"Nombre",
    employLastName:"Apellido",
    employSpeciality:"Especialidad",
    employUpdateSubtitle:"¡IMPORTANTE!",
    employUpdateAclaration:"Si la especialidad no se encuentra activa aparecera como dato pero no sera seleccionable.",
    employActive:"Personal Activo",
    employNoActive:"Personal NO activo",

    courseCreate: "Nuevo Curso",
    courseEdit:"Editar Curso",
    courseId:"ID",
    courseCapacity:"Cupo Máximo",
    courseName:"Nombre del Curso",
    courseTeacher:"Nombre del Docente",
    courseStart:"Fecha de Inicio",
    courseEnd:"Fecha de Finalización",
    courseActive:"Curso Activo",
    courseNoActive:"Curso No Activo",

    scheduleFilter:"Filtrar por empleado",
    scheduleAll:"Todos los empleados",

    turnsCancel:"Turnos Cancelados",
    turnsFinish:"Turnos Finalizadas",
    turnsMissingID:"Ingrese un legajo para continuar",
    turnsMissingDegree:"Ingrese una carrera para continuar",

    turnsHeader:"Modulo de Salud",
    turnsTitle:"Turnero",
    turnsCreation:"Creacion de Turnos",
    turnsCreationButton:"Crear Turno",

    turnsCreate:"Nuevo Turno",
    turnsEdit:"Editar Turno",
    turnsUserId:"Legajo",
    turnsUser:"Usuario Seleccionado:",
    turnsUserSearchAgain:"Volver a buscar",
    turnsId:"ID Turno",
    turnsPacientName:"Paciente",
    turnsMedic:"Especialista",
    turnsAppointment:"Fecha de Atención",
    turnsHour:"Hora de atención",
    turnsSubject:"Asunto",
    turnsState:"Estado",

    turnsNoDate:"Fecha Solicitud",
    turnsNoState:"Sin Definir",
    turnsNoName:"Error recuperando el nombre",
    turnsNoSubject: "Turno sin Asunto",
    turnsNoMedic:"Sin médico asignado",
    turnsNoAppointment:"Sin Fecha Asignada",
    turnsNoHour:"Sin Horario Asignado",

}

export const JPA_STRINGS = {
  headerMainTitle:"Módulo de Salud",
  headerMainSubtitle:"Gestión de las capacidades medicas de nuestra area",
  headerMainDescription:"Permite cargar especialidades, personal, cursos, horarios para el personal y gestionar los turnos de los estudiantes",

  eventDeleteConfirm: "Esta seguro que quiere eliminar el evento:",
  eventID:"ID",
  eventName:"Nombre del Evento",
  eventManager:"Encargado",
  eventURL:"URL Maps",
  eventeDate:"Fecha del Evento",
  eventStartTime:"Hora inicio",
  eventEndTime:"Hora fin",

  standDeleteConfirm: "Esta seguro que quiere eliminar el stand:",
  standName:"Nombre del Stand",
  standExpo:"Expositor",
  standUbi:"Ubicación en la facultad",

  interestDeleteConfirm: "Esta seguro que quiere eliminar el interesado:",
  interestName:"Nombre del Interesado",
  interestPhone:"Contacto Telefonico",
  interestEmail:"Contacto Electronico",
  interestEmailHelp:"Ingrese un correo electrónico válido",

  cancel:"Cancelar",
  create:"Crear",
  save:"Guardar",
  delete:"Eliminar",
  //Provider
  eventDeleteMsg:"Se elimino el evento correctamente",
  eventCreateMsg:"Evento creado!",
  eventEditMsg:"Evento modificado correctamente",
  eventError:"Ocurrió un error al guardar",

  standCreateMsg:"Puesto creado!",
  standEditMsg:"Puesto modificado correctamente",
  standDeleteMsg:"Se elimino el puesto correctamente",

  interestCreateMsg:"Interesado creado!",
  interestEditMsg:"Interesado modificado correctamente",
  interestDeleteMsg:"Se elimino el interesado correctamente"
}

export const USER_STRINGS = {
  headerTitle:"Módulo de Empleados",
  headerMainSubtitle:"Gestión de Empleados y sus Horarios",
  headerMainDescription:"Permite cargar empleados, modificar sus permisos y sus horarios",

  scheduleTitle:"Horarios Empleados",
  scheduleSubtitle:"Nuestros Horarios",
  scheduleButton:"Gestionar Horarios",

  employCreate:"Nuevo Empleado" ,
  employUpdate:"Editar Empleado",
  employID:"ID",
  employCompleteName:"Nombre Completo",

  employWarningTitle:"¡ATENCIÓN!",
  employWarningBody1:"Al crear un nuevo empleado debe escribirse sin errores su legajo, ya que esta sera la unica forma que pueda acceder a la aplicacion. Debe contener @utn.frc.edu.ar al final.",
  employWarningEnd:"Desde esta pestaña solo se podran crear perfiles de empleados, comedor, salud y administrador.",

  userWarningBody2:"Al crear el usuario desde esta pestaña se crea como estudiante, con id_perfil = 1. El legajo debe estar completo e incluir @utn.frc.edu.ar al final.",

  employNames:"Nombres",
  employLastName:"Apellidos",
  employUserName:"Nombre de Usuario",

  studentID: "Legajo",
  employProfile:"Perfíl",
  employActive:"Usuario Activo",
  employNoActive:"Usuario NO Activo",

  cancel:"Cancelar",
  create:"Crear",
  save:"Guardar",
  delete:"Eliminar",

  userCreate:"Nuevo Usuario",
  userUpdate:"Editar Usuario",
  userDegree:"Carrera",

}

export const TRAVEL_STRINGS = {
  headerTitle:"Módulo de Viajes",
  headerMainSubtitle:"Gestión de los viajes",
  headerMainDescription:"En este módulo podrás gestionar los viajes de la empresa, incluyendo la creación, edición de las empresa como la gestión de los inscriptos y la documentación relacionada.",

  errorPhone: "El contacto solo puede contener numeros.",
  errorEmail: "Ingresá un email válido.",
  errorCUIT: "Ingresá un CUIT válido de 11 dígitos.",
  errorCBU : "El CBU debe tener 22 dígitos.",
  errorForm: "Revisá los campos marcados antes de guardar.",

  travelID: "ID",
  businessName:"Nombre de la Empresa",
  businessPhone:"Telefono",
  businessEmail:"Email",
  businessCUIT:"CUIT",
  businessCBU: "CBU",
  businessActive:"Empresa Activa",
  businessNoActive:"Empresa No Activa",

  cancel:"Cancelar",
  create:"Crear",
  save:"Guardar",
  delete:"Eliminar",

  travelCreate:"Nuevo Viaje",
  travelUpdate:"Editar Viaje",
  travelName:"Nombre del Viaje",
  travelCapacity:"Cupo",
  travelStartDate:"Fecha de Inicio",
  travelEndDate:"Fecha Vuelta",
  travelProvince:"Pais / Provincia",
  travelCity:"Ciudad / Localidad",
  travelPlace: "Complejo / Ubicacion",

  travelOrigin:"Origen",
  travelDestiny:"Destino",

  travelData:"Datos del Viaje",
  travelBusiness:"Empresa",
  travelBudget:"Presupuesto",
  travelInsurence:"Tiene Seguro",
  travelNoInsurence:"NO tiene seguro",
  travelMotive:"Motivo",

  travelDocs:"Documentación —",
  travelRequiredDocs:"Documento a Cargar",
  travelChangeDocs:"Cambiar archivo",
  travelAddDocs:"Agregar Archivo",
  travelNoDocs:"No hay documentación disponible de este viaje.",
  travelShowDocs:"Ver Documentos",
  travelDownloadDocs:"Descargar",
  travelDeleteDocs:"Eliminar Documento",
  travelClose:"Cerrar",
  travelWarningMsg:"Esta seguro que quiere eliminar el documento: ",

  travelLoadDocs:"✅Cargado:",
  travelDrop:"Arrastra tu archivo aquí 📄",
  travelSearch:"Buscar Archivo",

  inscriptsManagement:"Gestión de Inscriptos",
  inscriptsList:"Planilla de Inscriptos", 
  inscriptsNoData:"Sin Inscriptos",

  errorNoID:"Ingresa un legajo para buscar.",
  errorNoDegree:"Selecciona una carrera para buscar.",

  inscriptsSearch:"Buscar estudiante para agregar",
  studentID:"Legajo",
  studentDegree:"Carrera",
  studentSearch:"Buscar estudiante",
  studentSelected:"Usuario Seleccionado",
  studentAdd:"Agregar estudiante",
  studentSearchAgain:"Volver a buscar",
  studentDocs:"Documentacion del Inscripto",
  studentsDelete:"Eliminar Inscripcion",
  inscriptsWarningTitle:"¡ATENCIÓN!",
  inscriptsWarningBody:"Esta a punto de eliminar este inscripto de la lista del viaje. Si esta persona subio documentacion relacionada, se mantendra a menos que se elimine de manera particular.",
  inscriptsWarningConfirm:"¿Quiere continuar?",

  helperID:"Sin @ ni dominio.",
  helperDegree:"Selecciona el dominio de la carrera.",

  inscriptsReviewed: "Documentacion Revisada",
  inscriptsNoReviewed:"Documentacion No Validada",

  // Provider
  errorNoInscFound:"Inscriptos no encontrados",
  errorSavingBuss:"Ocurrió un error al guardar la empresa",

  businessCreated:"Empresa creada!",
  businessEdited:"Empresa Modificada!",

  errorSavingDocs:"Error al cargar documentación",
  errorSavingTravel:"Ocurrió un error al guardar",

  travelCreated:"Viaje creado!",
  travelEdited:"Viaje modificado!",

  errorUserNF:"Usuario no Encontrado",

  inscriptsCreated:"Se inscribio esta persona al viaje",
  inscriptsDeleted:"Se elimino el estudiante del viaje",

  errorInscDelete:"Ocurrio un error al intentar eliminar este inscripto",

  inscriptsUpdated:"Actualizado!",

  errorInscriptsDoc:"Ocurrio un error al tratar de descargar el documento",

  inscriptsDocsDeleted:"Documento Eliminado",
  errorInscDocDelete:"Error al eliminar el documento",

  onlyExtensions:"Solo se permiten archivos:",
  
  inscriptsDocsUpload:"subido con exito",
  errorInscUpload:"Error subiendo el archivo"

}

export const SPORTS_STRINGS = {
  headerTitle:"Módulo de Deportes",
  headerMainSubtitle:"Gestion de Deportes",
  headerMainDescription:"Administra torneos, profesores, espacios y deportistas desde un solo lugar.",

  scheduleTitle:"Horarios deportivos",
  scheduleSubtitle:"Calendario de actividades y horarios de cada deporte.",
  scheduleManageButton:"Gestionar Horarios",

  scheduleStartTime:"Hora de Inicio",
  scheduleEndTime:"Hora de Fin",

  active:"Activo",
  inactive:"Desactivado",
  noAssigned:"Sin Asignar",
  schedulePlace:"Espacio Deportivo",
  scheduleTeacher:"Docente Encargado",

  scheduleDelete: "Eliminar Horario",
  scheduleDeleteWarning:"¿Estás seguro que querés eliminar este horario? Esta acción no se puede deshacer.",

  cancel:"Cancelar",
  delete:"Eliminar",
  create:"Crear",
  close:"Cerrar",
  save:"Guardar",

  noResults:"Sin resultados",
  saveChanges:"Guardar Cambios",
  scheduleEditing:"Editando Horario",
  scheduleCreating:"Crear Horario",

  errorScheduleLoad:"Error Cargando Horario",

  scheduleManager:"Gestionar Horarios Deportivos",
  scheduleSportSelection:"Seleccionar deporte",
  scheduleSportPH:"Escribí para filtrar...",
  scheduleSportsSelect:"Seleccioná un deporte para ver y gestionar sus horarios.",
  scheduleAlreadyOn:"Horarios registrados —",
  noSchedule:"Sin horarios para este deporte",

  //Calendar
  scheduleFilter:"Filtrar por Deporte",
  scheduleAll:"Todos los Deportes",
  scheduleStudent:"Mis horarios",

  documentation:"Documentación - ",
  errorNoDocs:"No hay documentación disponible para este alumno.",

  download:"Descargar",
  cuil:"CUIL",
  name:"Nombre",
  names:"Nombres",
  lastNames:"Apellidos",
  birthDay:"Fecha de Nacimiento",

  sportPlaceName:"Nombre del Lugar",
  sportPlaceAddress:"Domicilio",
  sportsMaps:"URL de Maps",

  studentID:"Legajo",
  studentExpireLicence:"Vencimiento Ficha",
  studentExpireLicenceShort:"Venc. Ficha",
  studentAuthorized:"Autorizado",
  studentSportAuth:"Autorizado para Deporte",

  errorSaveTournament: "Error al guardar el torneo.",

  tournamentEdit:"Editar Torneo",
  tournamentCreate:"Nuevo Torneo",
  tournamentName:"Nombre del Torneo",
  tournamentCapacity:"Cupo de Jugadores",

  sport:"Deporte",
  tournamentTeacher:"Docente Responsable",
  tournamentStartDate:"Fecha de Inicio",
  tournamentEndDate:"Fecha de Fin",
  tournamentDateLimit:"Límite Inscripción",
  tournamenteCreate:"Crear Torneo",
  errorTournamentLoad:"Error cargando los torneos",
  inscriptsCorrect:"inscripto correctamente.",
  multipleInscriptsCorrect:"deportistas inscriptos correctamente",

  errorInscriptsSaving:"Error al inscribir deportista.",

  inscriptsDelete:" eliminado de la inscripción",
  multipleInscriptsDelete:"deportistas eliminados de la inscripción",
  errorInscriptsDelete:"Error al eliminar la inscripción.",
  noSportsman:"No hay deportistas disponibles",
  noSportsmanInscript:"Ningún deportista inscripto",

  deleteInscription:"Eliminar inscripción",
  deleteSelection:"Eliminar Selección",
  goBack:"Volver",
  inscriptTournament:"Torneo Deportivo",
  inscriptStudent:"Inscribir Estudiante",
  inscriptSearchMsg:"Buscar deportista por legajo o nombre",
  inscriptManager:"Gestionar Inscripciones",
  availables:"Disponibles",
  searchPH:"Buscar...",
  cleanSelection:"Limpiar Selección",
  selectAll:"Seleccionar Todos",
  dragMsg:"o arrastrá",
  dropMsg:"Soltar para inscribir",
  inscriptsTitle:"Inscriptos",
  inscriptsAlready:"Deportistas Inscriptos",
  generatePDF:"Generar PDF",
  inscriptsNotify:"Notificar Inscriptos",
  tournamentNoInscripts:"No hay deportistas inscriptos en este torneo todavía.",
  tournamentUpdated:"Torneo guardado correctamente",
  //providers

  teacherCreated:"Docente creado correctamente",
  teacherUpdated:"Docente modificado!",
  placeCreated:"Espacio creado correctamente",
  placeUpdated:"Espacio modificado",
  sportsmanCreated:"Deportista creado",
  sportsmanUpdated:"Deportista modificado",
  sportsCreated:"Deporte creado",
  sportsUpdated:"Deporte modificado",
  errorSave:"Ocurrió un error al guardar",
}