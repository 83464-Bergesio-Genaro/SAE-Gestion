import {
  Box,
  Container,
  Divider,
  Stack,
  Card,
  CardContent,
  Chip,
  Grid,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  useAuth,
  useNotification,
} from "../../../shared/context/sharedContext";
import { useHealth } from "../../context/studentContext";
import { HealthUsersProvider } from "../../context/providers/healthProvider";

import SAEPage from "../../../assets/components/page/SAEPage";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAETimeField from "../../../assets/components/inputs/SAETimeField";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import TitleBox from "../../../assets/components/titleBox";
import HeaderPageStudent from "../../../assets/components/headerPage/headerPageStudent.jsx";
import { SAETypography } from "../../../assets/components/typography/SAETypography";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
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

import { calendarDays } from "../../../utils/common/constants";
import { formatDate, formatTime } from "../../../utils/date.utils";
import { HEALTH_STRINGS } from "../../../utils/strings/student.strings";
import { DataGrid } from "@mui/x-data-grid";

const C = HEALTH_STRINGS;

const PALETTE = [
  "#8A8A8A", //Pendiente
  "#576DDC", //Asignado
  "#E77575", //Cancelado
  "#B8CDFF", //En curso
  "#99F6B9", //Finalizado
  "#F1C6A3", //Reprogramado
];

const COURSE_PALETTE = ["#C8C1DF", "#BFEBA2", "#AB95EE", "#F6F399", "#F1C6A3"];

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
  slidesToShow: 1,
  slidesToScroll: 1,
  swipe: true,
  swipeToSlide: true,
  touchMove: true,
  draggable: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 1,
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

const sliderDotsSx = {
  "& .slick-dots": {
    position: "static",
    mt: 1.25,
    mb: 0.75,
    lineHeight: 1,
  },
  "& .slick-dots li": {
    width: 12,
    height: 12,
    mx: 0.25,
  },
  "& .slick-dots li button": {
    width: 12,
    height: 12,
    p: 0,
  },
  "& .slick-dots li button:before": {
    fontSize: 10,
    color: "rgba(255,255,255,0.72)",
    opacity: 1,
  },
  "& .slick-dots li.slick-active button:before": {
    color: "white",
    opacity: 1,
  },
  "& .slick-prev, & .slick-next": {
    zIndex: 2,
    width: 28,
    height: 28,
  },
  "& .slick-prev": {
    left: { xs: -2, sm: -18 },
  },
  "& .slick-next": {
    right: { xs: -2, sm: -18 },
  },
  "& .slick-prev:before, & .slick-next:before": {
    fontSize: { xs: 22, sm: 26 },
    color: "white",
    opacity: 0.9,
  },
};

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

const formatTurnDate = (value) => {
  if (!value) return "";

  const date =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)
      ? new Date(value.substring(0, 10).replace(/-/g, "/"))
      : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const month = date.toLocaleDateString("es-ES", { month: "long" });
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  return `${date.getDate()} de ${formattedMonth}`;
};

const formatTurnHour = (value) => {
  if (!value) return "";

  const normalized = String(value).replace(/hs/gi, "").trim().substring(0, 5);

  return normalized ? `${normalized} hs` : "";
};

const getCalendarDayLabel = (value) =>
  calendarDays.find((day) => day.value === Number(value))?.label ??
  C.servicesNoDay;

const formatAvailability = (availability) =>
  `${getCalendarDayLabel(availability.dia)} - ${formatTurnHour(
    availability.hora,
  )}`;

const formatSchedule = (schedule) =>
  `${getCalendarDayLabel(schedule.dia)}: ${formatTime(
    schedule.hora_inicio,
  )} a ${formatTime(schedule.hora_fin)}`;

export function EmployedStudentContent() {
  const { user } = useAuth();
  const isDesktopSchedule = useMediaQuery("(min-width:1200px)", {
    noSsr: true,
  });
  const isDesktopTurns = useMediaQuery("(min-width:1200px)", {
    noSsr: true,
  });
  const isTabletTurns = useMediaQuery("(min-width:900px)", {
    noSsr: true,
  });
  const isDesktopCourses = useMediaQuery("(min-width:1200px)", {
    noSsr: true,
  });
  const isTabletCourses = useMediaQuery("(min-width:900px)", {
    noSsr: true,
  });

  const {
    allHorarios,
    loadingHorarios,

    cursos,
    loadingCursos,

    fetchTurnosEstudiante,
    estudianteTurnos,
    loadingTurnos,
    turnsRows,
    turnsColumns,
    openCreateTurnos,
    openShowTurnos,
    openDeleteTurnos,
  } = useHealth();

  useEffect(() => {
    fetchTurnosEstudiante(user.legajo);
  }, [fetchTurnosEstudiante, user]);

  const horariosAgrupados = agruparPorEspecialidad(allHorarios);
  const scheduleSliderSettings = {
    ...settingsSchedule,
    slidesToShow: isDesktopSchedule ? 4 : 1,
    responsive: [],
  };
  const activeTurnsSliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: isDesktopTurns ? 4 : isTabletTurns ? 2 : 1,
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    draggable: true,
    responsive: [],
  };
  const coursesSlidesToShow = Math.min(
    cursos.length || 1,
    isDesktopCourses ? 3 : isTabletCourses ? 2 : 1,
  );
  const coursesSliderSettings = {
    ...settings,
    slidesToShow: coursesSlidesToShow,
    responsive: [],
  };

  return (
    <SAEPage>
      <HeaderPageStudent
        title={C.headerTitle}
        description={C.headerDescription}
        backgroundImage="images/varias/campus.jpg"
        icon={HealingIcon}
      />

      <TitleBox title={C.servicesTitle} description={C.servicesDescription} />

      <Card
        sx={{
          position: "relative",
          background: "var(--gradient)",
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
          p={{ xs: 2, sm: 3, md: 5 }}
        >
          {loadingHorarios && (
            <Stack alignItems="center" width={"100%"} gap={1}>
              <SAESpinner size="S" />
            </Stack>
          )}
          {!loadingHorarios && (
            <Box
              sx={{
                px: { xs: 0, sm: 4 },
                width: "100%",
                boxSizing: "border-box",
                overflow: "visible",
                ...sliderDotsSx,
                "& .slick-slider": {
                  width: "100%",
                  touchAction: "pan-y",
                },
                "& .slick-list": {
                  margin: { xs: 0, sm: "0 -10px" },
                },
                "& .slick-slide": {
                  padding: { xs: "0 4px", sm: "0 10px" },
                  boxSizing: "border-box",
                  height: "auto",
                  "& > div": {
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  },
                },
              }}
            >
              <Slider {...scheduleSliderSettings}>
                {horariosAgrupados.map((especialidad, index) => {
                  const IconoDinamico =
                    MEDICINE_ICONS[index % MEDICINE_ICONS.length];
                  return (
                    <Card
                      key={especialidad.id_especialidad}
                      variant="outlined"
                      sx={{
                        width: { xs: "calc(100% - 34px)", sm: 300 },
                        minWidth: 0,
                        maxWidth: { xs: 300, sm: 300 },
                        minHeight: 0,
                        height: "auto",
                        borderRadius: { xs: 3, sm: 4 },
                        my: { xs: 2, sm: 3 },
                        mx: "auto",
                        background:
                          "linear-gradient(180deg,#FFFFFF 0%,#F8FBFF 100%)", //GRADIENTE??
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
                          p: { xs: 1.75, sm: 2 },
                          "&:last-child": { pb: 2 },
                        }}
                      >
                        {/* SECCIÓN 1: CABECERA (Alto fijo implícito por el icono de 55px) */}
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Box
                            sx={{
                              width: { xs: 48, sm: 55 },
                              height: { xs: 48, sm: 60 },
                              flexShrink: 0,
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
                          <SAETypography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                              fontSize: { xs: "1rem", sm: "1.25rem" },
                              lineHeight: 1.2,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {especialidad.nombre_especialidad}
                          </SAETypography>
                        </Stack>

                        <Divider sx={{ my: 1 }} />

                        {/* NUEVO: Stack intermedio que se estira para ocupar el espacio y empujar el botón */}
                        <Stack
                          sx={{
                            gap: 1.1,
                          }}
                        >
                          {/* SECCIÓN 2: DESCRIPCIÓN (Le damos un alto fijo para que no mueva lo demás) */}
                          <Box
                            sx={{
                              p: { xs: 1, sm: 1.1 },
                              borderRadius: 2,
                              bgcolor: "#F3F7FC",
                              border: "1px solid #E0EAF6",
                              maxHeight: { xs: 150, sm: 130 },
                              overflowY: "auto",
                            }}
                          >
                            <SAETypography
                              variant="body2"
                              sx={{
                                lineHeight: 1.3,
                                overflowWrap: "anywhere",
                              }}
                            >
                              {especialidad?.descripcion_especialidad ?? ""}
                            </SAETypography>
                          </Box>

                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              bgcolor: "#EEF5FF",
                            }}
                          >
                            <SAETypography
                              variant="caption"
                              sx={{ color: "text.secondary", fontWeight: 700 }}
                            >
                              Profesional
                            </SAETypography>
                            <SAETypography
                              variant="body2"
                              sx={{
                                lineHeight: 1.3,
                                overflowWrap: "anywhere",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                overflow: "hidden",
                              }}
                            >
                              {especialidad.especialista}
                            </SAETypography>
                          </Box>

                          <Box
                            sx={{
                              maxHeight: { xs: 170, sm: 135 },
                              overflowY: "auto",
                              pr: 0.25,
                            }}
                          >
                            <SAETypography
                              variant="body2"
                              fontWeight="bold"
                              color="var(--secondary)"
                            >
                              {C.servicesCardSche}
                            </SAETypography>

                            {especialidad.diasYHorarios.map((item, index) => {
                              const diaEncontrado = calendarDays.find(
                                (d) => d.value === item.dia,
                              );
                              const nombreDia = diaEncontrado
                                ? diaEncontrado.label
                                : C.servicesNoDay;

                              return (
                                <Stack
                                  key={index}
                                  direction="row"
                                  alignItems="center"
                                  gap={1}
                                  sx={{
                                    mt: 0.5,
                                    bgcolor: "#F3F7FC",
                                    borderRadius: 2,
                                    p: 0.75,
                                  }}
                                >
                                  <AccessTimeIcon
                                    fontSize="small"
                                    color="action"
                                  />
                                  <SAETypography
                                    variant="body2"
                                    sx={{ overflowWrap: "anywhere" }}
                                  >
                                    <strong>{nombreDia}:</strong>{" "}
                                    {formatTime(item.hora_inicio)} a{" "}
                                    {formatTime(item.hora_fin)}
                                  </SAETypography>
                                </Stack>
                              );
                            })}
                          </Box>
                          {/* SECCIÓN EN EL FONDO: EL BOTÓN (Queda alineado abajo siempre igual) */}
                          <SAEButton
                            variant="contained"
                            onClick={() =>
                              openCreateTurnos(user.legajo, especialidad)
                            }
                            sx={{
                              width: "100%",
                              whiteSpace: { xs: "normal", sm: "nowrap" },
                              justifyContent: "center",
                              color: "white",
                              border: "1px solid rgba(255,255,255,0.4)",
                              mt: 0.25,
                            }}
                          >
                            {C.servicesButton}
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
        title={C.activeTurnsTitle}
        description={C.activeTurnsDescription}
      />

      <Alert
        severity="info"
        sx={{
          mb: 2,
          borderRadius: 3,
          fontWeight: 700,
        }}
      >
        {C.activeTurnsReminder}
      </Alert>

      <Card
        sx={{
          position: "relative",
          p: 2,
          background: "var(--gradient)",
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
            <SAESpinner />
          </Grid>
        )}
        {!loadingTurnos && estudianteTurnos.length === 0 && (
          <SAETypography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "white",
              pt: { xs: 2, md: 4 },
              fontSize: { xs: "1.5em", md: "2.5em" },
              textAlign: { xs: "center" },
            }}
          >
            {C.noActiveTurns}
          </SAETypography>
        )}
        <Box
          sx={{
            width: "100%",
            px: { xs: 0, sm: 2 },
            py: { xs: 0.5, sm: 1 },
            boxSizing: "border-box",
            overflow: "visible",
            ...sliderDotsSx,
            "& .slick-slider": {
              width: "100%",
              touchAction: "pan-y",
            },
            "& .slick-list": {
              margin: { xs: 0, sm: "0 -10px" },
            },
            "& .slick-track": {
              display: "flex",
            },
            "& .slick-slide": {
              height: "auto",
              padding: { xs: "0 4px", sm: "0 10px" },
              boxSizing: "border-box",
              "& > div": {
                height: "auto",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              },
            },
          }}
        >
          {!loadingTurnos && estudianteTurnos.length > 0 && (
            <Slider {...activeTurnsSliderSettings}>
              {estudianteTurnos.map((turno) => (
                <Card
                  key={turno.id}
                  variant="outlined"
                  sx={{
                    width: {
                      xs: "calc(100% - 104px)",
                      sm: "min(100%, 320px)",
                      lg: "min(100%, 300px)",
                    },
                    height: "auto",
                    minWidth: 0,
                    maxWidth: { xs: 300, sm: 320, lg: 300 },
                    color: "var(--textBlack)",
                    my: { xs: 1, sm: 1.25 },
                    borderRadius: { xs: 3, sm: 4 },
                    border: "1px solid #DCE7F5",
                    boxShadow: "0 10px 25px rgba(18,54,102,0.12)",
                    background:
                      "linear-gradient(180deg,#FFFFFF 0%,#F8FBFF 100%)",
                    transition: "background-color 0.3s ease, width 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 1.25, sm: 1.75 },
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      "&:last-child": { pb: { xs: 1.25, sm: 1.75 } },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={1}
                      mb={1.1}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ minWidth: 0, flex: 1 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            minWidth: 0,
                          }}
                        >
                          <CalendarMonthIcon fontSize="small" color="primary" />
                          <Box sx={{ minWidth: 0 }}>
                            <SAETypography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                display: "block",
                                fontWeight: 800,
                                lineHeight: 1,
                              }}
                            >
                              Fecha
                            </SAETypography>
                            <SAETypography
                              variant="body2"
                              fontWeight="bold"
                              sx={{ overflowWrap: "anywhere", minWidth: 0 }}
                            >
                              {formatTurnDate(turno.fecha_atencion) || C.noDate}
                            </SAETypography>
                          </Box>
                        </Box>

                        <SAETypography
                          component="div"
                          variant="body2"
                          fontWeight="bold"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            minWidth: 0,
                            overflowWrap: "anywhere",
                          }}
                        >
                          <AccessTimeIcon fontSize="small" color="primary" />
                          <Box sx={{ minWidth: 0 }}>
                            <SAETypography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                display: "block",
                                fontWeight: 800,
                                lineHeight: 1,
                              }}
                            >
                              Hora
                            </SAETypography>
                            {formatTurnHour(turno.hora_atencion) ||
                              C.noSchedule}
                          </Box>
                        </SAETypography>
                      </Stack>
                      <Chip
                        label={turno.estado || "-"}
                        size="small"
                        sx={{
                          bgcolor:
                            PALETTE[turno.id_estado_turno] ||
                            "var(--secondary)",
                          color: "var(--textWhite)",
                          height: 30,
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          flexShrink: 0,
                          ml: "auto",
                          "& .MuiChip-label": {
                            px: 1.25,
                          },
                        }}
                      />
                    </Stack>
                    <Box
                      sx={{
                        p: { xs: 0.9, sm: 1.1 },
                        borderRadius: 2,
                        bgcolor: "#F3F7FC",
                        border: "1px solid #E0EAF6",
                      }}
                    >
                      <SAETypography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          display: "block",
                          fontWeight: 700,
                        }}
                      >
                        {C.turnsCardSuject}
                      </SAETypography>
                      <SAETypography
                        variant="body2"
                        sx={{
                          mt: 0.25,
                          fontWeight: 700,
                          lineHeight: 1.3,
                          overflowWrap: "anywhere",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 3,
                          overflow: "hidden",
                        }}
                      >
                        {turno.asunto || C.noSubject}
                      </SAETypography>
                    </Box>

                    <Stack spacing={0.5} mb={0.5}>
                      <Box sx={{ minWidth: 0 }}>
                        <SAETypography
                          variant="caption"
                          sx={{ color: "text.secondary", fontWeight: 700 }}
                        >
                          {C.turnsCardPacient}
                        </SAETypography>
                        <SAETypography
                          variant="body2"
                          sx={{
                            overflowWrap: "anywhere",
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                        >
                          {turno.paciente || C.noNameTurn}
                        </SAETypography>
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <SAETypography
                          variant="caption"
                          sx={{ color: "text.secondary", fontWeight: 700 }}
                        >
                          {C.turnsCardMedic}
                        </SAETypography>
                        <SAETypography
                          variant="body2"
                          sx={{
                            overflowWrap: "anywhere",
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                        >
                          {turno.especialista || C.noMedic}
                        </SAETypography>
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <SAETypography
                          variant="caption"
                          sx={{ color: "text.secondary", fontWeight: 700 }}
                        >
                          Solicitud:{" "}
                        </SAETypography>
                        <SAETypography
                          variant="body2"
                          sx={{
                            overflowWrap: "anywhere",
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                        >
                          {formatTurnDate(turno.fecha_solicitud) || "-"}
                        </SAETypography>
                      </Box>
                    </Stack>

                    {/* Datos Mínimos: Fecha y Hora */}

                    <Stack direction="row" spacing={1} mt="auto" pt={1.25}>
                      <SAEButton
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={() => openShowTurnos(turno)}
                        sx={{
                          flex: 1,
                          minHeight: 32,
                          py: 0.35,
                          px: 1,
                          justifyContent: "center",
                          color: "var(--textWhite)",
                          border: "1px solid rgba(255,255,255,0.4)",
                        }}
                      >
                        Ver
                      </SAEButton>
                      <SAEButton
                        variant="contained"
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => openDeleteTurnos(turno)}
                        sx={{
                          flex: 1,
                          minHeight: 32,
                          py: 0.35,
                          px: 1,
                          justifyContent: "center",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.4)",
                        }}
                      >
                        Cancelar
                      </SAEButton>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Slider>
          )}
        </Box>
      </Card>

      <TitleBox title={C.courseTitle} description={C.courseDescription} />

      <Card
        sx={{
          position: "relative",
          background: "var(--gradient)",
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
        <Stack>
          {loadingCursos && (
            <Stack alignItems="center" width={"100%"} gap={1}>
              <SAESpinner size="S" />
            </Stack>
          )}
          {!loadingCursos && cursos.length === 0 && (
            <SAETypography
              variant="h3"
              fontWeight="bold"
              sx={{
                pt: { xs: 2, md: 4 },
                fontSize: { xs: "0.5em", md: "1.5em" },
                textAlign: { xs: "center" },
              }}
            >
              {C.noCourses}
            </SAETypography>
          )}
          {!loadingCursos && cursos.length > 0 && (
            <Box
              sx={{
                px: { xs: 0, sm: 4 },
                pt: { xs: 1.5, sm: 0 },
                pb: { xs: 1, sm: 0 },
                width: "100%",
                boxSizing: "border-box",
                overflow: "visible",
                ...sliderDotsSx,
                "& .slick-slider": {
                  width: "100%",
                  touchAction: "pan-y",
                },
                "& .slick-list": {
                  margin: { xs: 0, sm: "0 -10px" },
                },
                "& .slick-slide": {
                  padding: { xs: "0 5px", sm: "0 10px" },
                  boxSizing: "border-box",
                  height: "auto",
                  "& > div": {
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    justifyContent: "center",
                  },
                },
              }}
            >
              <Slider {...coursesSliderSettings}>
                {cursos.map((curso, index) => {
                  return (
                    <Card
                      key={curso.id || index}
                      variant="outlined"
                      sx={{
                        width: { xs: "calc(100% - 40px)", sm: "100%" },
                        minWidth: 0,
                        maxWidth: { xs: 300, sm: 340 },
                        minHeight: { xs: 0, sm: 210 },
                        height: "auto",
                        borderRadius: { xs: 3, sm: 4 },
                        my: { xs: 1.25, sm: 1.75 },
                        mx: "auto",
                        background:
                          "linear-gradient(180deg,#1D3557 0%,#2A548B 100%)", // GRADIENT
                        color: "white",
                        cursor: "pointer",
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
                      <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ px: { xs: 1.25, sm: 1.5 }, pt: 1.25, pb: 1 }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 42,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <SchoolIcon
                            sx={{
                              fontSize: 28,
                              color:
                                COURSE_PALETTE[index % COURSE_PALETTE.length],
                            }}
                          />
                        </Box>
                        <SAETypography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                            lineHeight: 1.2,
                            overflowWrap: "anywhere",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                        >
                          {curso.nombre_curso}
                        </SAETypography>
                      </Stack>

                      <Divider
                        sx={{
                          borderColor:
                            COURSE_PALETTE[index % COURSE_PALETTE.length],
                        }}
                      />

                      {/* NUEVO: Stack intermedio que se estira para ocupar el espacio y empujar el botón */}
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          px: { xs: 1.25, sm: 1.5 },
                          pt: 1,
                          pb: 1.25,
                          "&:last-child": { pb: 1.25 },
                        }}
                      >
                        <Stack spacing={1}>
                          <Chip
                            label={`${curso.cupo_maximo} ${C.available}`}
                            sx={{
                              width: "fit-content",
                              height: 28,
                              bgcolor: "#FFD54F",
                              color: "#1D3557",
                              fontWeight: 700,
                            }}
                          />
                          <Box
                            sx={{
                              bgcolor: "rgba(255,255,255,0.1)",
                              borderRadius: 2,
                              p: 0.8,
                            }}
                          >
                            <SAETypography
                              variant="caption"
                              sx={{
                                color: "rgba(255,255,255,0.72)",
                                fontWeight: 700,
                              }}
                            >
                              {C.courseTeacher}
                            </SAETypography>
                            <SAETypography
                              variant="body2"
                              sx={{
                                lineHeight: 1.3,
                                overflowWrap: "anywhere",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                overflow: "hidden",
                              }}
                            >
                              {curso.nombre_docente}
                            </SAETypography>
                          </Box>
                          <Box
                            sx={{
                              bgcolor: "rgba(255,255,255,0.1)",
                              borderRadius: 2,
                              p: 0.8,
                            }}
                          >
                            <SAETypography
                              variant="caption"
                              sx={{
                                color: "rgba(255,255,255,0.72)",
                                fontWeight: 700,
                              }}
                            >
                              Duracion
                            </SAETypography>
                            <SAETypography
                              variant="body2"
                              fontWeight="bold"
                              sx={{ lineHeight: 1.3 }}
                            >
                              {formatDate(curso.fecha_inicio, "short")} -{" "}
                              {formatDate(curso.fecha_fin, "short")}
                            </SAETypography>
                          </Box>
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
        title={C.turnsHistoryTitle}
        description={C.turnsHistoryDescription}
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
            <DataGrid //Este data grid no lo uso con el componente porque es para tener varias secciones
              rows={turnsRows}
              columns={turnsColumns}
              loading={loadingTurnos}
              autoHeight
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
                sorting: {
                  sortModel: [{ field: "fecha_solicitud", sort: "desc" }],
                },
              }}
              localeText={{ noRowsLabel: C.noRegisters }}
              sx={{ borderRadius: 0, border: "none" }}
            />
          </Box>
        </CardContent>
      </Card>
      <DialogHealth />
    </SAEPage>
  );
}

function DialogHealth() {
  const {
    dialogOpen,
    dialogData,
    dialogType,
    dialogMode,
    dialogError,
    dialogSaving,
    setDialogError,
    handleDataChange,
    closeDialog,
  } = useNotification();
  const { handleTurnosSave } = useHealth();
  const disponibilidades = dialogData.disponibilidades ?? [];
  const horariosDisponibles = dialogData.horarios_disponibles ?? [];

  const handleAddAvailability = () => {
    if (!dialogData.dia_selecionado || !dialogData.horario_disponible) {
      setDialogError(C.availabilityRequired);
      return;
    }

    const nuevaDisponibilidad = {
      dia: Number(dialogData.dia_selecionado),
      hora: dialogData.horario_disponible,
    };
    const alreadyExists = disponibilidades.some(
      (item) =>
        Number(item.dia) === nuevaDisponibilidad.dia &&
        item.hora === nuevaDisponibilidad.hora,
    );

    if (alreadyExists) return;

    setDialogError("");
    handleDataChange("disponibilidades", [
      ...disponibilidades,
      nuevaDisponibilidad,
    ]);
  };

  const handleRemoveAvailability = (indexToRemove) => {
    handleDataChange(
      "disponibilidades",
      disponibilidades.filter((_item, index) => index !== indexToRemove),
    );
  };

  return (
    <>
      {dialogOpen && dialogType === "turnos" && (
        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <SAETypography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {dialogMode === "create"
                ? C.requestTurnTitle
                : dialogMode === "delete"
                  ? C.cancelTurnTitle
                  : C.realizedTurnsTitle}
            </SAETypography>
            <IconButton onClick={closeDialog} size="small">
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
                            <SAETypography
                              variant="subtitle1"
                              color="var(--textBlack)"
                              gutterBottom
                              fontWeight={600}
                            >
                              {C.dialogSubtitle}
                            </SAETypography>
                            <SAETypography
                              variant="body2"
                              color="var(--textBlack)"
                            >
                              {C.turnCancellationDisclaimer}
                            </SAETypography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <InputLabel>{C.yourData}</InputLabel>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }} m={0}>
                        <SAETextField
                          label={C.youtID}
                          fullWidth
                          value={dialogData.legajo}
                          onChange={(e) =>
                            handleDataChange("legajo", e.target.value)
                          }
                          disabled={true}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }} m={0}>
                        <SAETextField
                          label={C.solicitudDate}
                          type="date"
                          value={dialogData.fecha_solicitud}
                          onChange={(e) =>
                            handleDataChange("fecha_solicitud", e.target.value)
                          }
                          fullWidth
                          disabled={true}
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 3,
                            borderColor: "#DCE7F5",
                            bgcolor: "#F8FBFF",
                          }}
                        >
                          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <Stack spacing={1.25}>
                              <Box>
                                <SAETypography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {C.selectedSpecialty}
                                </SAETypography>
                                <SAETypography
                                  variant="h6"
                                  sx={{
                                    color: "var(--secondary)",
                                    fontWeight: 800,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {dialogData.nombre_especialidad}
                                </SAETypography>
                              </Box>
                              <Box>
                                <SAETypography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 800,
                                  }}
                                >
                                  {C.specialtySchedules}
                                </SAETypography>
                                <Stack
                                  direction="row"
                                  flexWrap="wrap"
                                  gap={1}
                                  sx={{ mt: 0.75 }}
                                >
                                  {horariosDisponibles.map((horario, index) => (
                                    <Chip
                                      key={`${horario.dia}-${horario.hora_inicio}-${index}`}
                                      icon={<AccessTimeIcon />}
                                      label={formatSchedule(horario)}
                                      sx={{
                                        bgcolor: "#E7F1FF",
                                        color: "#153b6f",
                                        fontWeight: 700,
                                        height: "auto",
                                        minHeight: 32,
                                        "& .MuiChip-label": {
                                          whiteSpace: "normal",
                                          py: 0.5,
                                        },
                                      }}
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <InputLabel>{C.availability}</InputLabel>
                        <SAETypography variant="body2" color="text.secondary">
                          {C.availabilityHint}
                        </SAETypography>
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          spacing={1.5}
                          alignItems={{ md: "center" }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Select
                              value={dialogData.dia_selecionado}
                              label={C.day}
                              fullWidth
                              onChange={(e) =>
                                handleDataChange(
                                  "dia_selecionado",
                                  e.target.value,
                                )
                              }
                            >
                              {calendarDays.map((d) => (
                                <MenuItem key={d.value} value={d.value}>
                                  {d.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <SAETimeField
                              label={C.estimateSchedule}
                              value={dialogData.horario_disponible}
                              onChange={(value) =>
                                handleDataChange("horario_disponible", value)
                              }
                              minTime="00:00"
                              maxTime="23:59"
                              timeStepsMinutes={15}
                              size="big"
                              fullWidth
                            />
                          </Box>
                          <SAEButton
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddAvailability}
                            sx={{
                              color: "white",
                              minHeight: 40,
                              width: { xs: "100%", md: "auto" },
                              whiteSpace: "nowrap",
                            }}
                          >
                            {C.addAvailability}
                          </SAEButton>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <Stack
                          spacing={1}
                          sx={{
                            p: 1.25,
                            borderRadius: 2,
                            bgcolor: "#F3F7FC",
                            border: "1px solid #E0EAF6",
                          }}
                        >
                          <SAETypography
                            variant="subtitle2"
                            sx={{ color: "#153b6f", fontWeight: 800 }}
                          >
                            {C.selectedAvailability}
                          </SAETypography>
                          <Stack direction="row" flexWrap="wrap" gap={1}>
                            {disponibilidades.length > 0 ? (
                              disponibilidades.map((disponibilidad, index) => (
                                <Chip
                                  key={`${disponibilidad.dia}-${disponibilidad.hora}-${index}`}
                                  label={formatAvailability(disponibilidad)}
                                  onDelete={() =>
                                    handleRemoveAvailability(index)
                                  }
                                  deleteIcon={<DeleteOutlineIcon />}
                                  sx={{
                                    bgcolor: "#FFFFFF",
                                    border: "1px solid #B7CBE5",
                                    color: "#153b6f",
                                    fontWeight: 700,
                                    minHeight: 34,
                                    "& .MuiChip-label": {
                                      whiteSpace: "normal",
                                      py: 0.5,
                                    },
                                    "& .MuiChip-deleteIcon": {
                                      color: "#d85656",
                                      "&:hover": { color: "#b93636" },
                                    },
                                  }}
                                />
                              ))
                            ) : (
                              <SAETypography
                                variant="body2"
                                color="text.secondary"
                              >
                                {C.noAvailability}
                              </SAETypography>
                            )}
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <InputLabel>{C.turnsCardSuject}</InputLabel>
                      </Grid>

                      <Grid size={{ xs: 12 }} mt={-1}>
                        <SAETextField
                          label={C.yourSympthoms}
                          value={dialogData.asunto}
                          onChange={(e) =>
                            handleDataChange("asunto", e.target.value)
                          }
                          multiline
                          fullWidth
                          rows={4}
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
                            borderRadius: 3,
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <SAETypography
                              variant="h6"
                              sx={{
                                color: "black",
                                fontWeight: 800,
                                mb: 1,
                              }}
                            >
                              {C.dialogSubtitle}
                            </SAETypography>
                            <SAETypography
                              variant="body2"
                              sx={{
                                color: "black",
                                fontWeight: 500,
                                lineHeight: 1.35,
                                overflowWrap: "anywhere",
                              }}
                            >
                              {C.deleteAclaration}
                            </SAETypography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 3,
                            borderColor: "#DCE7F5",
                            bgcolor: "#F8FBFF",
                          }}
                        >
                          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <SAETypography
                              variant="subtitle1"
                              sx={{
                                color: "var(--primary)",
                                fontWeight: 800,
                                mb: 1.25,
                              }}
                            >
                              {C.cancelTurnSummary}
                            </SAETypography>
                            <Stack spacing={1.1}>
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                              >
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <SAETypography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: 800,
                                    }}
                                  >
                                    {C.dialogDate}
                                  </SAETypography>
                                  <SAETypography
                                    variant="body2"
                                    fontWeight={700}
                                  >
                                    {formatTurnDate(
                                      dialogData.fecha_atencion,
                                    ) || C.noDate}
                                  </SAETypography>
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <SAETypography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      fontWeight: 800,
                                    }}
                                  >
                                    {C.dialogSchedule}
                                  </SAETypography>
                                  <SAETypography
                                    variant="body2"
                                    fontWeight={700}
                                  >
                                    {formatTurnHour(dialogData.hora_atencion) ||
                                      C.noSchedule}
                                  </SAETypography>
                                </Box>
                              </Stack>
                              <Box sx={{ minWidth: 0 }}>
                                <SAETypography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 800,
                                  }}
                                >
                                  {C.turnsCardPacient}
                                </SAETypography>
                                <SAETypography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 700,
                                    overflowWrap: "anywhere",
                                  }}
                                >
                                  {dialogData.paciente || C.noNameTurn}
                                </SAETypography>
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <SAETypography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    fontWeight: 800,
                                  }}
                                >
                                  {C.turnsCardMedic}
                                </SAETypography>
                                <SAETypography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 700,
                                    overflowWrap: "anywhere",
                                  }}
                                >
                                  {dialogData.especialista || C.noMedic}
                                </SAETypography>
                              </Box>
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 2,
                                  bgcolor: "#F3F7FC",
                                  border: "1px solid #E0EAF6",
                                }}
                              >
                                <SAETypography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    display: "block",
                                    fontWeight: 800,
                                  }}
                                >
                                  {C.turnsCardSuject}
                                </SAETypography>
                                <SAETypography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 700,
                                    overflowWrap: "anywhere",
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 3,
                                    overflow: "hidden",
                                  }}
                                >
                                  {dialogData.asunto || C.noSubject}
                                </SAETypography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    </>
                  )}
                  {dialogMode === "show" && (
                    <>
                      <Grid size={{ xs: 12, md: 3 }} m={0}>
                        <SAETextField
                          label={C.dialogIdTurn}
                          type="number"
                          fullWidth
                          value={dialogData.id}
                          onChange={(e) =>
                            handleDataChange("id", e.target.value)
                          }
                          disabled={true}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 9 }} m={0}>
                        <SAETextField
                          label={C.dialogStudentId}
                          value={dialogData.legajo}
                          onChange={(e) =>
                            handleDataChange("legajo", e.target.value)
                          }
                          fullWidth
                          disabled={true}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label={C.turnsCardPacient}
                          value={dialogData.paciente}
                          onChange={(e) =>
                            handleDataChange("paciente", e.target.value)
                          }
                          fullWidth
                          disabled={true}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <SAETextField
                          label={C.dialogDate}
                          type="date"
                          value={dialogData?.fecha_atencion || ""}
                          onChange={(e) =>
                            handleDataChange("fecha_atencion", e.target.value)
                          }
                          fullWidth
                          disabled={true}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <SAETextField
                          label={C.dialogSchedule}
                          type="time"
                          value={
                            dialogData?.hora_atencion?.split?.("hs")?.[0] || ""
                          }
                          onChange={(e) =>
                            handleDataChange("hora_atencion", e.target.value)
                          }
                          slotProps={{ inputLabel: { shrink: true } }}
                          fullWidth
                          disabled={true}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <SAETextField
                          label={C.subject}
                          value={dialogData.asunto}
                          onChange={(e) =>
                            handleDataChange("asunto", e.target.value)
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
          <DialogActions
            sx={{
              px: 3,
              pb: 2,
              gap: 1,
              flexDirection: { xs: "column-reverse", sm: "row" },
              "& > :not(style) ~ :not(style)": { ml: { xs: 0, sm: 1 } },
            }}
          >
            <SAEButton
              variant="outlined"
              onClick={closeDialog}
              disabled={dialogSaving}
              sx={{
                minWidth: { sm: 140 },
                width: { xs: "100%", sm: "auto" },
                whiteSpace: "nowrap",
              }}
            >
              {C.close}
            </SAEButton>
            {dialogMode !== "show" && (
              <SAEButton
                variant="contained"
                color={dialogMode === "delete" ? "error" : undefined}
                onClick={handleTurnosSave}
                disabled={dialogSaving}
                sx={{
                  minWidth: { sm: 190 },
                  width: { xs: "100%", sm: "auto" },
                  whiteSpace: "nowrap",
                  ...(dialogMode === "delete" && {
                    bgcolor: "#d85656",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#b93636",
                    },
                  }),
                }}
                startIcon={
                  dialogSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                {dialogMode === "create"
                  ? C.create
                  : dialogMode === "delete"
                    ? C.confirmCancelTurn
                    : C.close}
              </SAEButton>
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
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
