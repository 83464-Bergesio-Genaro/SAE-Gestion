import {
  Avatar,
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useAuth } from "../../../shared/context/sharedContext";
import { useHealth } from "../../context/studentContext"; 
import { HealthUsersProvider } from "../../context/providers/healthProvider";
import { useEffect } from "react";

import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HealingIcon from "@mui/icons-material/Healing";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import MedicationIcon from "@mui/icons-material/Medication";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ScienceIcon from "@mui/icons-material/Science";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";

import HeaderPage from "../../../shared/components/headerPage";
import { DataGrid } from "@mui/x-data-grid";

import TitleBox from "../../../shared/components/titleBox";
const PALETTE = [
  "#8A8A8A", //Pendiente
  "#576DDC", //Asignado
  "#E77575", //Cancelado
  "#B8CDFF", //En curso
  "#99F6B9", //Finalizado
  "#F1C6A3", //Reprogramado
];

const COURSE_PALLETE = [
  "#C8C1DF", //Pendiente
  "#BFEBA2", //Asignado
  "#AB95EE", //Cancelado
  "#AC829F", //En curso
  "#F6F399", //Finalizado
  "#B3A4A4", //Reprogramado
];

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3, // Cuántas tarjetas se ven en computadora
  slidesToScroll: 1,
  swipe: true,
  swipeToSlide: true,
  touchMove: true,
  draggable: true,
  responsive: [
    {
      breakpoint: 1024, // En pantallas medianas (tablets)
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const settingsSchedule = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 4, // Cuántas tarjetas se ven en computadora
  slidesToScroll: 1,
  swipe: true,
  swipeToSlide: true,
  touchMove: true,
  draggable: true,
  responsive: [
    {
      breakpoint: 1024, // En pantallas medianas (tablets)
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
const mostrarHorasMinutos = (horario) => {
  const [h1, m1] = horario.split(":").map(Number);
  if (m1 === 0) return `${h1}:00hs`;
  return `${h1}:${m1}hs`;
};
const formatearFecha = (fechaString) => {
  if (!fechaString) return "";

  // Convertimos el texto "2026-05-07" a un objeto de fecha real
  // Usamos el reemplazo de guiones por barras para evitar problemas de zona horaria
  const fecha = new Date(fechaString.replace(/-/g, "/"));

  // Le pedimos a JavaScript que solo nos devuelva el día y el mes en español
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit", // Fuerza a que el día tenga 2 dígitos (ej: "07")
    month: "long", // Muestra el nombre completo del mes (ej: "Mayo")
  });
};

const MEDICINE_ICONS = [
  LocalHospitalIcon, // Cruz de hospital / medicina general
  MedicalServicesIcon, // Maletín médico
  HealingIcon, // Curita / traumatología / kinesiología
  VaccinesIcon, // Jeringa / vacunas / pediatría
  MonitorHeartIcon, // Electrocardiograma / cardiología
  MedicationIcon, // Cápsula / farmacia / clínica médica
  PsychologyIcon, // Cerebro / psicología / psiquiatría
  ScienceIcon, // Tubo de ensayo / laboratorio / análisis
  ContentPasteSearchIcon, // Historial clínico / estudios / recetas
  BloodtypeIcon, // Gota de sangre / hematología / extracciones
];

const agruparPorEspecialidad = (horariosMapeados) => {
  const agrupado = horariosMapeados.reduce((acumulador, horario) => {
    const idEsp = horario.id_especialidad;

    // Si es la primera vez que vemos esta especialidad, creamos la estructura base
    if (!acumulador[idEsp]) {
      acumulador[idEsp] = {
        id_especialidad: idEsp,
        nombre_especialidad: horario.nombre_especialidad,
        descripcion_especialidad: horario.descripcion_especialidad,
        especialista: horario.especialista,
        // Creamos un array para guardar todos los días y horas de esta especialidad
        diasYHorarios: [],
      };
    }

    // Guardamos el día y las horas en la lista de esta especialidad
    acumulador[idEsp].diasYHorarios.push({
      dia: horario.dia,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
    });

    return acumulador;
  }, {});

  return Object.values(agrupado);
};

export function EmployedStudentContent() {
  function ScaleText({ text }) {
    if (!text) return;
    const baseSize = 26; // Tamaño máximo en px para textos cortos
    const minSize = 13.4; // Tamaño mínimo en px para que siga siendo legible

    // 2. Calculamos el tamaño según el largo del texto
    // Dividimos un factor (ej. 300) por el largo del texto
    let calculatedSize = text.length > 0 ? 400 / text.length : baseSize;

    // 3. Ajustamos el tamaño para que no pase de los límites
    const finalSize = Math.max(minSize, Math.min(baseSize, calculatedSize));

    return (
      <Typography sx={{ fontSize: `${finalSize}px`, lineHeight: 1.2 }}>
        {text}
      </Typography>
    );
  }
  const { user } = useAuth();

  const {
    allHorarios,
    loadingHorarios,
    DAYS,

    cursos,
    loadingCursos,

        fetchTurnosEstudiante,estudianteTurnos,loadingTurnos,
        turnsRows,turnsColumns,
        openCreateTurnos,openShowTurnos,openDeleteTurnos,handleTurnosSave,
        snackbarOpen, setSnackbarOpen,snackbarMsg,setDialogError,
        dialogOpen, setDialogOpen, dialogData, setDialogData, dialogType, dialogMode, dialogError, dialogSaving,

    } = useHealth();

  useEffect(() => {
    fetchTurnosEstudiante(user.email);
  }, [fetchTurnosEstudiante, user]);

    const handleDialogChange = (field, value) => {
        setDialogData((prev) => ({ ...prev, [field]: value }));
    };   
    
    const horariosAgrupados = agruparPorEspecialidad(allHorarios);
    
    return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "114px", md: "100px" },
        pb: 4,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
        <HeaderPage
          title={"Salud"}
          description={
            "Permite sacar turnos medicos y ver los cursos disponibles"
          }
          backgroundImage="images/carrousel/EntradaUTN.jpg"
          icon={<HealingIcon />}
        />

        <TitleBox
          title="Servicios para Alumnos"
          description="Especialidades médicas disponibles para solicitar turnos"
        />
        {/*Tarjeta de Medicos */}
        <Card
          sx={{
            position: "relative",
            background:
              "linear-gradient(135deg,#123666 0%,#2A548B 50%,#6CABDD 100%)",
            borderRadius: 6,
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              top: -150,
              right: -150,
            },
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={1.5}
            p={5}
          >
            {loadingHorarios && (
              <Stack alignItems="center" width={"100%"} gap={1}>
                <SAESpinner size="S" />
              </Stack>
            )}
            {!loadingHorarios && (
              <Box
                sx={{
                  px: { xs: 2, sm: 4 },
                  width: "100%",
                  boxSizing: "border-box",
                  overflow: "hidden",
                  "& .slick-slider": {
                    width: "100%",
                    touchAction: "pan-y",
                  },
                  "& .slick-list": {
                    margin: "0 -10px",
                  },
                  "& .slick-slide": {
                    padding: "0 10px",
                    boxSizing: "border-box",
                    height: "auto",
                    "& > div": {
                      width: "100%",
                    },
                  },
                }}
              >
                <Slider {...settingsSchedule}>
                  {horariosAgrupados.map((especialidad, index) => {
                    const IconoDinamico =
                      MEDICINE_ICONS[index % MEDICINE_ICONS.length];
                    return (
                      <Card
                        key={especialidad.id_especialidad}
                        variant="outlined"
                        sx={{
                          minWidth: 300,
                          maxWidth: 300,
                          minHeight: 400,
                          maxHeight: 400,
                          borderRadius: 4,
                          my: 3,
                          background:
                            "linear-gradient(180deg,#FFFFFF 0%,#F8FBFF 100%)",
                          border: "1px solid #DCE7F5",
                          boxShadow: "0 10px 25px rgba(18,54,102,0.12)",
                          transition: "all .3s ease",
                          "&:hover": {
                            transform: "translateY(-6px)",
                            boxShadow: "0 18px 40px rgba(18,54,102,0.20)",
                          },
                          // NUEVO: Hacemos que la tarjeta sea un contenedor Flex vertical
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {/* NUEVO: Forzamos a CardContent a ocupar el 100% del alto y usar Flexbox */}
                        <CardContent
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            p: 2,
                            "&:last-child": { pb: 2 },
                          }}
                        >
                          {/* SECCIÓN 1: CABECERA (Alto fijo implícito por el icono de 55px) */}
                          <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={2}
                          >
                            <Box
                              sx={{
                                width: 55,
                                height: 60,
                                borderRadius: "50%",
                                bgcolor: "#E7F1FF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <IconoDinamico
                                sx={{ fontSize: 30, color: "#2A548B" }}
                              />
                            </Box>
                            <Typography variant="h6" fontWeight="bold" noWrap>
                              {especialidad.nombre_especialidad}
                            </Typography>
                          </Stack>

                          <Divider sx={{ my: 1 }} />

                          {/* NUEVO: Stack intermedio que se estira para ocupar el espacio y empujar el botón */}
                          <Stack
                            sx={{
                              flexGrow: 1,
                              justifyContent: "space-between",
                            }}
                          >
                            {/* SECCIÓN 2: DESCRIPCIÓN (Le damos un alto fijo para que no mueva lo demás) */}
                            <Box sx={{ height: "80px", overflow: "hidden" }}>
                              <ScaleText
                                text={
                                  especialidad?.descripcion_especialidad ?? ""
                                }
                              />
                            </Box>

                            <Divider sx={{ my: 0.5, borderStyle: "dashed" }} />

                            {/* SECCIÓN 3: HORARIOS Y PROFESIONAL (Alto fijo y control de scroll por si hay muchos días) */}
                            <Box
                              sx={{
                                height: "90px",
                                overflowY: "auto",
                                pr: 0.5,
                              }}
                              my={2}
                            >
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="text.secondary"
                              >
                                Horarios de Atención:
                              </Typography>

                              {especialidad.diasYHorarios.map((item, index) => {
                                const diaEncontrado = DAYS.find(
                                  (d) => d.value === item.dia,
                                );
                                const nombreDia = diaEncontrado
                                  ? diaEncontrado.label
                                  : "Día no asignado";

                                return (
                                  <Stack
                                    key={index}
                                    direction="row"
                                    alignItems="center"
                                    gap={1}
                                    sx={{ mt: 0.5 }}
                                  >
                                    <AccessTimeIcon
                                      fontSize="small"
                                      color="action"
                                    />
                                    <Typography variant="body2">
                                      <strong>{nombreDia}:</strong>{" "}
                                      {mostrarHorasMinutos(item.hora_inicio)} a{" "}
                                      {mostrarHorasMinutos(item.hora_fin)}
                                    </Typography>
                                  </Stack>
                                );
                              })}
                            </Box>
                            <Typography variant="body2" sx={{ pt: 1.5 }}>
                              <strong>{"Profesional: "}</strong>
                              {especialidad.especialista}
                            </Typography>
                            {/* SECCIÓN EN EL FONDO: EL BOTÓN (Queda alineado abajo siempre igual) */}
                            <SAEButton
                              variant="contained"
                              onClick={() =>
                                openCreateTurnos(
                                  user.email,
                                  especialidad.id_especialidad,
                                  especialidad.diasYHorarios,
                                )
                              }
                              sx={{
                                whiteSpace: "nowrap",
                                color: "white",
                                border: "1px solid rgba(255,255,255,0.4)",
                                mt: 1, // Pequeño margen superior de seguridad
                              }}
                            >
                              Pedir Turno
                            </SAEButton>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Slider>
              </Box>
            )}
          </Stack>
        </Card>

        <TitleBox
          title="Turnos Activos"
          description="Podras ver aquellos turnos que tengas activos en estos dias."
        />

        <Card
          sx={{
            position: "relative",
            p: 2,
            background:
              "linear-gradient(135deg,#123666 0%,#2A548B 50%,#6CABDD 100%)",
            borderRadius: 6,
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              top: -150,
              right: -150,
            },
          }}
        >
          {loadingTurnos && (
            <Grid
              width={"100%"}
              container
              alignItems="center"
              justifyContent="center"
            >
              <SAESpinner></SAESpinner>
            </Grid>
          )}
          {!loadingTurnos && estudianteTurnos.length === 0 && (
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                color: "white",
                pt: { xs: 2, md: 4 },
                fontSize: { xs: "1.5em", md: "2.5em" },
                textAlign: { xs: "center" },
              }}
            >
              No hay turnos activos
            </Typography>
          )}
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            width={"100%"}
            spacing={1.5}
            p={2}
          >
            {!loadingTurnos &&
              estudianteTurnos.length > 0 &&
              //ESTAS SON LAS TARJETAS QUE VES ADENTRO DEL COMPONENTE
              estudianteTurnos.map((turno) => (
                <Card
                  key={turno.id}
                  variant="outlined"
                  sx={{
                    minWidth: 350,
                    maxWidth: 350,
                    color: "black",
                    my: 2,
                    borderRadius: 2,
                    p: 1.1,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "background-color 0.3s ease, width 0.3s ease",
                  }}
                >
                  <CardContent sx={{ "&:last-child": { paddingBottom: 2 } }}>
                    {/* Cabecera: Nombre y Estado */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1.5}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        noWrap
                        sx={{ maxWidth: "140px" }}
                      >
                        {turno.fecha_solicitud || "Fecha Solicitud"}
                      </Typography>
                      <Chip
                        label={turno.estado || "Sin Definir"}
                        size="small"
                        sx={{
                          bgcolor: PALETTE[turno.id_estado_turno],
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      />
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    {/* Datos Mínimos: Fecha y Hora */}
                    <Stack spacing={1} mt={1.5}>
                      <Typography variant="body2">
                        <strong>{"Solicitante: "}</strong>
                        <br />
                        {turno.paciente || "Error recuperando el nombre"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>{"Asunto: "}</strong>
                        <br />
                        {turno.asunto || "Turno sin Asunto"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>{"Atiende: "}</strong>
                        <br />
                        {turno.especialista || "Sin medico asignado"}
                      </Typography>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <CalendarMonthIcon fontSize="medium" />
                        <Typography variant="body2">
                          {turno.fecha_atencion || "Sin Fecha Asignada"}
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" gap={1}>
                        <AccessTimeIcon fontSize="medium" />
                        <Typography variant="body2">
                          {turno.hora_atencion || "Sin Horario Asignado"}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack spacing={2} mt={1.5} p={2}>
                      <SAEButton
                        variant="contained"
                        onClick={() => openShowTurnos(turno)}
                        sx={{
                          whiteSpace: "nowrap",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.4)",
                        }}
                      >
                        Ver datos turno
                      </SAEButton>
                      <SAEButton
                        variant="contained"
                        color="error"
                        onClick={() => openDeleteTurnos(turno)}
                        sx={{
                          whiteSpace: "nowrap",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.4)",
                        }}
                      >
                        Eliminar Turno
                      </SAEButton>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
          </Stack>
        </Card>

        <TitleBox
          title="Cursos y Capacitaciones"
          description=" Descubrí que lo primero es la salud"
        />

        <Card
          sx={{
            position: "relative",
            background:
              "linear-gradient(135deg,#5B84B8 0%,#4D7DBB 50%,#6CABDD 100%)",
            borderRadius: 6,
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              top: -150,
              right: -150,
            },
          }}
        >
          {loadingCursos && (
            <Stack alignItems="center" width={"100%"} gap={1}>
              <SAESpinner size="S" />
            </Stack>
          )}
          {!loadingCursos && cursos.length === 0 && (
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                pt: { xs: 2, md: 4 },
                fontSize: { xs: "0.5em", md: "1.5em" },
                textAlign: { xs: "center" },
              }}
            >
              No hay cursos actualmente activos
            </Typography>
          )}
          {!loadingTurnos && cursos.length > 0 && (
            <Box
              sx={{
                px: { xs: 2, sm: 4 },
                py: 3,
                width: "100%",
                boxSizing: "border-box",
                overflow: "hidden",
                "& .slick-slider": {
                  width: "100%",
                  touchAction: "pan-y",
                },
                "& .slick-list": {
                  margin: "0 -10px",
                },
                "& .slick-slide": {
                  padding: "0 10px",
                  boxSizing: "border-box",
                  height: "auto",
                  "& > div": {
                    width: "100%",
                  },
                },
              }}
            >
              <Slider {...settings}>
                {cursos.map((curso, index) => (
                  <div key={curso.id || index} style={{ width: "100%" }}>
                    <Card
                      sx={{
                        minWidth: "300px",
                        height: 220,
                        borderRadius: 4,
                        background:
                          "linear-gradient(180deg,#1D3557 0%,#2A548B 100%)",
                        color: "white",
                        cursor: "pointer",
                        transition: "all .3s ease",
                        overflow: "hidden",
                        display: "flex", // Añadido para asegurar consistencia interna
                        flexDirection: "column",
                        "&:hover": {
                          transform: "scale(1.01)",
                          boxShadow: "0 15px 35px rgba(0,0,0,.05)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <SchoolIcon
                          sx={{
                            fontSize: 45,
                            color: COURSE_PALLETE[index],
                          }}
                        />
                        <Typography variant="h6" fontWeight={400}>
                          {curso.nombre_curso}
                        </Typography>
                      </Box>
                      <Divider
                        sx={{
                          borderColor: COURSE_PALLETE[index],
                        }}
                      />
                      <CardContent>
                        <Stack spacing={2}>
                          <Chip
                            label={`${curso.cupo_maximo} Vacantes`}
                            sx={{
                              width: "fit-content",
                              bgcolor: "#FFD54F",
                              color: "#1D3557",
                              fontWeight: 700,
                            }}
                          />
                          <Typography variant="body2">
                            Docente:<strong> 👨‍🏫 {curso.nombre_docente}</strong>
                          </Typography>
                          <Typography variant="body2">
                            Desde el: 📅
                            <strong>
                              {" "}
                              {formatearFecha(curso.fecha_inicio)}
                            </strong>{" "}
                            hasta el:{" "}
                            <strong>{formatearFecha(curso.fecha_fin)}</strong>
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </Slider>
            </Box>
          )}
        </Card>

        <TitleBox
          title="Historico de Turnos"
          description="Turnos cancelados o finalizados"
        />
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
            my: 3,
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={turnsRows}
                columns={turnsColumns}
                loading={loadingTurnos}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                localeText={{ noRowsLabel: "Sin Registros" }}
                sx={{ borderRadius: 0, border: "none" }}
              />
            </Box>
          </CardContent>
        </Card>
        {dialogOpen && dialogType === "turnos" && (
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            maxWidth="x1"
            fullWidth
          >
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: "bold" }}
              >
                {dialogMode === "cancelados"
                  ? "Turnos Cancelados"
                  : "Turnos Finalizados"}
              </Typography>
              <IconButton onClick={() => setDialogOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2} sx={{ pt: 1 }}>
                {dialogError && (
                  <Alert severity="error" onClose={() => setDialogError("")}>
                    {dialogError}
                  </Alert>
                )}
                <>
                  <Grid container spacing={1}>
                    {dialogMode === "create" && (
                      <Grid container size={{ xs: 12 }} m={0} spacing={2}>
                        <Grid size={{ xs: 12 }} m={0}>
                          <Card
                            sx={{
                              bgcolor: "rgba(235, 235, 41, 0.7)",
                              border: "1px solid rgba(235, 41, 41, 0.1)",
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="textPrimary"
                                fontWeight={600}
                                gutterBottom
                              >
                                ¡ATENCION!
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Una vez generado el turno no podra ser
                                modificado. En caso de equivocacion debera
                                eliminarlo y despues volverlo a crear
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid size={{ xs: 12 }} m={0}>
                          <InputLabel>Sus datos</InputLabel>
                        </Grid>

                        <Grid size={{ xs: 12 }} m={0}>
                          <SAETextField
                            label="Tu legajo:"
                            fullWidth
                            value={dialogData.legajo}
                            onChange={(e) =>
                              handleDialogChange("legajo", e.target.value)
                            }
                            disabled={true}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }} m={0}>
                          <SAETextField
                            label="Fecha de Solicitud"
                            type="date"
                            value={dialogData.fecha_solicitud}
                            onChange={(e) =>
                              handleDialogChange(
                                "fecha_solicitud",
                                e.target.value,
                              )
                            }
                            fullWidth
                            disabled={true}
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }} m={0}>
                          <InputLabel>Disponibilidad</InputLabel>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} m={0}>
                          <Select
                            value={dialogData.dia_selecionado}
                            label="Dia"
                            fullWidth
                            onChange={(e) =>
                              handleDialogChange(
                                "dia_selecionado",
                                e.target.value,
                              )
                            }
                          >
                            {DAYS.map((d) => (
                              <MenuItem key={d.value} value={d.value}>
                                {d.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} m={0}>
                          <SAETextField
                            label="Hora Aproximada"
                            type="time"
                            fullWidth
                            value={dialogData.horario_disponible}
                            onChange={(e) =>
                              handleDialogChange(
                                "horario_disponible",
                                e.target.value,
                              )
                            }
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                          <Chip
                            label={
                              "Revisar los horarios de inicio y fin del especialista"
                            }
                            sx={{
                              bgcolor: "rgba(255,255,255,0.18)",
                              color: "white",
                              fontWeight: 700,
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }} m={0}>
                          <InputLabel>Asunto</InputLabel>
                        </Grid>

                        <Grid size={{ xs: 12 }} mt={-1}>
                          <SAETextField
                            label="Explique su dolencia"
                            value={dialogData.asunto}
                            onChange={(e) =>
                              handleDialogChange("asunto", e.target.value)
                            }
                            multiline
                            fullWidth
                            rows={4} // Número inicial de filas
                          />
                        </Grid>
                      </Grid>
                    )}
                    {dialogMode === "delete" && (
                      <>
                        <Grid size={{ xs: 12 }} m={0}>
                          <Card
                            sx={{
                              bgcolor: "rgba(193, 73, 55, 0.7)",
                              border: "1px solid rgba(235, 41, 41, 0.1)",
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Typography
                                variant="subtitle2"
                                color="textPrimary"
                                fontWeight={600}
                                gutterBottom
                                fontSize={"22px"}
                              >
                                ¡ATENCION!
                              </Typography>
                              <Typography
                                variant="body2"
                                fontSize={"18px"}
                                color="textSecondary"
                              >
                                Esta por cancelar el turno, toda la informacion
                                que se haya utilizado en este turno se perdera
                                como tambien la disponibilidad.
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </>
                    )}
                    {dialogMode === "show" && (
                      <>
                        <Grid size={{ xs: 12, md: 3 }} m={0}>
                          <SAETextField
                            label="ID Turno"
                            type="number"
                            fullWidth
                            value={dialogData.id}
                            onChange={(e) =>
                              handleDialogChange("id", e.target.value)
                            }
                            disabled={true}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 9 }} m={0}>
                          <SAETextField
                            label="Legajo Estudiante"
                            value={dialogData.legajo}
                            onChange={(e) =>
                              handleDialogChange("legajo", e.target.value)
                            }
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }} m={0}>
                          <SAETextField
                            label="Paciente"
                            value={dialogData.paciente}
                            onChange={(e) =>
                              handleDialogChange("paciente", e.target.value)
                            }
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <SAETextField
                            label="Fecha de Atencion"
                            type="date"
                            value={dialogData.fecha_atencion}
                            onChange={(e) =>
                              handleDialogChange(
                                "fecha_atencion",
                                e.target.value,
                              )
                            }
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <SAETextField
                            label="Horario de Atencion"
                            type="time"
                            value={
                              dialogData?.hora_atencion?.split?.("hs")?.[0] ||
                              ""
                            }
                            onChange={(e) =>
                              handleDialogChange(
                                "hora_atencion",
                                e.target.value,
                              )
                            }
                            slotProps={{ inputLabel: { shrink: true } }}
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <SAETextField
                            label="Asunto"
                            value={dialogData.asunto}
                            onChange={(e) =>
                              handleDialogChange("asunto", e.target.value)
                            }
                            multiline
                            fullWidth
                            rows={4} // Número inicial de filas
                            disabled={true}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <SAEButton
                variant="outlined"
                onClick={() => setDialogOpen(false)}
                disabled={dialogSaving}
              >
                {dialogMode === "show" ? "Cerrar" : "Cancelar"}
              </SAEButton>
              {dialogMode !== "show" && (
                <SAEButton
                  variant="contained"
                  onClick={handleTurnosSave}
                  disabled={dialogSaving}
                  startIcon={
                    dialogSaving ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : null
                  }
                >
                  {dialogMode === "create"
                    ? "Crear"
                    : dialogMode === "delete"
                      ? "Eliminar"
                      : "Cerrar"}
                </SAEButton>
              )}
            </DialogActions>
          </Dialog>
        )}

        {/* MENSAJE DE EXITO */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function StudentHealth() {
  return (
    <HealthUsersProvider>
      <EmployedStudentContent />
    </HealthUsersProvider>
  );
}
