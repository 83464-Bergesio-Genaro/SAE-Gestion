import { useAuth } from "../../../shared/auth/AuthContext";
import { useState, useEffect, useCallback } from "react";

import utnLogo from "../../../assets/utn.png";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";
import { SCHOLARSHIP_STRINGS } from "./scholarship.string";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAESwitch from "../../../shared/components/buttons/SAESwitch";

import {
  FileUpload,
  AddCircleOutline,
  ExpandMore,
  Close,
  AttachMoney,
  Diversity3,
  School,
} from "@mui/icons-material";

import {
  ObtenerProyectosInvestigacion,
  ObtenerServiciosInternos,
  CrearBecarioEconomica,
  CrearBecarioSAE,
  CrearBecarioInvestigacion,
  CrearBecarioServicio,
  ObtenerBecariosXLegajo,
  ObtenerBecariosEconomicaXLegajo,
  ObtenerBecariosServiciosXLegajo,
  ObtenerBecariosInvestigacionXLegajo,
} from "../../../api/BecasService";

const C = SCHOLARSHIP_STRINGS;

/*
  Componente Scholarships
  -----------------------
  Objetivo general:
  - Mostrar las becas que ya solicitó el usuario logueado.
  - Permitir solicitar una nueva beca.
  - Crear primero el Becario SAE si todavía no existe.
  - Crear después la beca específica: económica, servicio o investigación.
  - Recargar la pantalla para que el usuario vea inmediatamente la nueva solicitud.

*/

// Centralizo los nombres de los tipos de beca para evitar strings repetidos en todo el componente.
// Esto reduce errores por diferencias mínimas como mayúsculas, tildes o espacios.
const TIPO_BECA = {
  ECONOMICA: "Beca Economica",
  SERVICIO: "Beca de Servicio",
  INVESTIGACION: "Beca de Investigacion",
};

// Estados posibles que después se traducen a textos y colores de Chip.
const ESTADO_BECA = {
  SOLICITADO: "solicitado",
  RECHAZADO: "rechazado",
  ACEPTADO_INICIO: "aceptado_inicio",
  ACEPTADO_PAGADO: "aceptado_pagado",
  FIN_BECADO: "fin_becado",
};

// Devuelve cómo se debe mostrar visualmente el estado de una beca.
// MUI usa "color" para pintar el Chip: warning, error, success, etc.
const getEstadoBecaConfig = (estado) => {
  switch (estado) {
    case ESTADO_BECA.SOLICITADO:
      return { label: "Solicitado", color: "warning" };
    case ESTADO_BECA.RECHAZADO:
      return { label: "Rechazado", color: "error" };
    case ESTADO_BECA.ACEPTADO_INICIO:
      return { label: "Aceptado", color: "info" };
    case ESTADO_BECA.ACEPTADO_PAGADO:
      return { label: "Pagado", color: "success" };
    case ESTADO_BECA.FIN_BECADO:
      return { label: "Finalizado", color: "secondary" };
    default:
      return { label: estado || "Sin estado", color: "default" };
  }
};

// Devuelve el ícono correspondiente según el tipo de beca.
// Así evitamos guardar JSX mezclado dentro de la respuesta original de la API.
const getBecaIcon = (tipoBeca) => {
  switch (tipoBeca) {
    case TIPO_BECA.ECONOMICA:
      return <AttachMoney fontSize="large" />;
    case TIPO_BECA.SERVICIO:
      return <Diversity3 fontSize="large" />;
    case TIPO_BECA.INVESTIGACION:
      return <School fontSize="large" />;
    default:
      return null;
  }
};

// La API puede devolver {} cuando no hay beca.
// Esta función confirma que la respuesta sea un objeto real y que tenga id.
const isValidObjectResponse = (value) =>
  Boolean(value && typeof value === "object" && value.id);

// Formatea fechas para mostrarlas en pantalla.
// Si la fecha viene vacía o inválida, muestra "-" para no romper el render.
const formatDate = (dateValue) => {
  if (!dateValue) return "-";

  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

// Arma el estado inicial del formulario.
// Si ya existe un becario, precarga sus datos; si no, usa los datos del usuario logueado.
// Además limpia tipoBeca y beca para que cada nueva solicitud arranque vacía.
const getInitialFormBeca = (user, becarioActual = null) => ({
  id: becarioActual?.id ?? 0,
  legajo: becarioActual?.legajo ?? user?.email ?? "",
  nombre_becario: becarioActual?.nombre_becario ?? user?.nombre ?? "",
  alquila: becarioActual?.alquila ?? true,
  fecha_solicitud: becarioActual?.fecha_solicitud ?? "",
  aceptado_inicio: becarioActual?.aceptado_inicio ?? false,
  puede_pagarle: becarioActual?.puede_pagarle ?? false,
  activo: becarioActual?.activo ?? true,
  anio_beca: becarioActual?.anio_beca ?? new Date().getFullYear(),
  id_becario_previo: becarioActual?.id_becario_previo ?? null,
  tipoBeca: "",
  beca: null,
});

export default function Scholarships() {
  const { user } = useAuth();

  // Mensaje flotante para informar éxito, advertencias o errores.
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Becario base del sistema SAE. Es distinto de la beca específica.
  // Primero se necesita este registro para después crear económica/servicio/investigación.
  const [becarioActual, setBecarioActual] = useState(null);
  // Loading general de pantalla: se usa durante la carga inicial.
  const [loading, setLoading] = useState(true);
  // Loading específico del formulario: se activa cuando el usuario toca Guardar.
  const [saving, setSaving] = useState(false);
  // Lista normalizada de becas para pintar las cards.
  const [misBecas, setMisBecas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [becaSeleccionada, setBecaSeleccionada] = useState(null);
  // Estado del formulario del Dialog.
  // Guarda datos del becario y también la beca/proyecto/servicio seleccionado.
  const [formBeca, setFormBeca] = useState(() => getInitialFormBeca(user));
  const [proyectosRows, setProyectosRows] = useState([]);
  const [serviciosRows, setServiciosRows] = useState([]);

  // Helper para no repetir setSnackbar en cada try/catch.
  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Carga los proyectos disponibles para la beca de investigación.
  const cargarProyectosInvestigacion = useCallback(async () => {
    try {
      const data = await ObtenerProyectosInvestigacion();
      setProyectosRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setProyectosRows([]);
      console.error("Error al cargar proyectos de investigación:", err);
    }
  }, []);

  // Carga los servicios disponibles para la beca de servicio.
  const cargarServiciosInternos = useCallback(async () => {
    try {
      const data = await ObtenerServiciosInternos();
      setServiciosRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setServiciosRows([]);
      console.error("Error al cargar servicios internos:", err);
    }
  }, []);

  // Normaliza las respuestas de la API porque vienen como objeto único o como {} cuando no existe beca.
  const normalizarBecas = useCallback((economica, servicio, investigacion) => {
    return [
      isValidObjectResponse(economica) && {
        ...economica,
        tipoBeca: TIPO_BECA.ECONOMICA,
        iconBeca: getBecaIcon(TIPO_BECA.ECONOMICA),
        fechaSolicitud: economica.becario?.fecha_solicitud,
        estado: ESTADO_BECA.SOLICITADO,
      },
      isValidObjectResponse(servicio) && {
        ...servicio,
        tipoBeca: TIPO_BECA.SERVICIO,
        iconBeca: getBecaIcon(TIPO_BECA.SERVICIO),
        fechaSolicitud: servicio.becario?.fecha_solicitud,
        estado: ESTADO_BECA.SOLICITADO,
        servicio: servicio.servicio?.nombre ?? servicio.servicio ?? "-",
      },
      isValidObjectResponse(investigacion) && {
        ...investigacion,
        tipoBeca: TIPO_BECA.INVESTIGACION,
        iconBeca: getBecaIcon(TIPO_BECA.INVESTIGACION),
        fechaSolicitud: investigacion.becario?.fecha_solicitud,
        estado: ESTADO_BECA.SOLICITADO,
        proyecto_investigacion:
          investigacion.proyecto_investigacion?.nombre_proyecto_investigacion ??
          investigacion.proyecto_investigacion?.centro_investigacion ??
          "-",
      },
    ].filter(Boolean);
  }, []);

  // Carga el becario base y las becas asociadas al usuario logueado.
  const cargarMisBecas = useCallback(async () => {
    if (!user?.email) return;

    try {
      const becario = await ObtenerBecariosXLegajo(user.email);

      if (!isValidObjectResponse(becario)) {
        setBecarioActual(null);
        setMisBecas([]);
        return;
      }

      setBecarioActual(becario);

      const [economica, servicio, investigacion] = await Promise.all([
        ObtenerBecariosEconomicaXLegajo(user.email),
        ObtenerBecariosServiciosXLegajo(user.email),
        ObtenerBecariosInvestigacionXLegajo(user.email),
      ]);

      setMisBecas(normalizarBecas(economica, servicio, investigacion));
    } catch (error) {
      console.error("Error al cargar becario y becas", error);
      setBecarioActual(null);
      setMisBecas([]);
      showSnackbar("No se pudieron cargar tus becas", "error");
    }
  }, [normalizarBecas, showSnackbar, user?.email]);

  // Abre el Dialog para solicitar una beca nueva.
  // Si ya existe Becario SAE, precarga sus datos; si no, usa datos del usuario logueado.
  const handleAgregarBeca = () => {
    setBecaSeleccionada(null);
    setFormBeca(getInitialFormBeca(user, becarioActual));
    setOpenDialog(true);
  };

  // Cierra el Dialog, salvo que esté guardando.
  // Esto evita que el usuario cierre el formulario en medio del POST.
  const handleCloseDialog = () => {
    if (saving) return;
    setOpenDialog(false);
  };

  // Maneja todos los cambios del formulario.
  // Sirve tanto para inputs normales como para switches/checkboxes.
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormBeca((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Si cambia el tipo de beca, limpio la selección asociada para evitar guardar un proyecto/servicio anterior.
      ...(name === "tipoBeca" ? { beca: null } : {}),
    }));
  };

  // Valida antes de pegarle a la API.
  // Evita crear una beca sin tipo, o una beca de servicio/investigación sin selección asociada.
  const validarFormulario = () => {
    if (!formBeca.tipoBeca) {
      showSnackbar("Seleccioná un tipo de beca", "warning");
      return false;
    }

    if (
      (formBeca.tipoBeca === TIPO_BECA.INVESTIGACION ||
        formBeca.tipoBeca === TIPO_BECA.SERVICIO) &&
      !formBeca.beca?.id
    ) {
      showSnackbar("Seleccioná una opción para la beca", "warning");
      return false;
    }

    return true;
  };

  // Crea el Becario SAE base solo si todavía no existe.
  // Devuelve siempre el becario que se debe usar para crear la beca específica.
  const crearBecarioSiNoExiste = async () => {
    if (becarioActual?.id) return becarioActual;

    const payloadBecario = {
      id: 0,
      legajo: user.email,
      nombre_becario: user.nombre,
      alquila: formBeca.alquila,
      fecha_solicitud: new Date().toISOString(),
      aceptado_inicio: false,
      puede_pagarle: false,
      activo: true,
      anio_beca: new Date().getFullYear(),
      id_becario_previo: null,
    };

    const nuevoBecario = await CrearBecarioSAE(payloadBecario);
    setBecarioActual(nuevoBecario);
    return nuevoBecario;
  };

  // Crea la beca específica usando el ID real del Becario SAE.
  // Importante: no usar formBeca.id porque puede estar en 0 si el becario se acaba de crear.
  const crearBecaSegunTipo = async (becarioId) => {
    switch (formBeca.tipoBeca) {
      case TIPO_BECA.ECONOMICA:
        await CrearBecarioEconomica(becarioId);
        return "Se creó la beca económica correctamente";

      case TIPO_BECA.INVESTIGACION:
        await CrearBecarioInvestigacion(becarioId, formBeca.beca.id);
        return "Se creó la beca de investigación correctamente";

      case TIPO_BECA.SERVICIO:
        await CrearBecarioServicio(becarioId, formBeca.beca.id);
        return "Se creó la beca de servicio correctamente";

      default:
        throw new Error("Tipo de beca inválido");
    }
  };

  // Acción principal del botón Guardar.
  // Activa el mini loading del formulario, ejecuta el alta y recarga las cards.
  const handleDialogSave = async () => {
    if (!validarFormulario()) return;

    try {
      setSaving(true);

      // Flujo de guardado:
      // 1. Si no existe becario SAE, se crea primero.
      // 2. Con el ID real del becario, se crea la beca específica seleccionada.
      // 3. Se recarga la grilla para reflejar el nuevo estado.
      const becario = await crearBecarioSiNoExiste();
      const mensaje = await crearBecaSegunTipo(becario.id);

      await cargarMisBecas();
      setOpenDialog(false);
      showSnackbar(mensaje, "success");
    } catch (err) {
      console.error("Error al crear la beca", err);
      showSnackbar("Hubo un error al crear la beca", "error");
    } finally {
      setSaving(false);
    }
  };

  // Carga inicial de pantalla.
  // Se ejecuta cuando aparece el usuario logueado y trae:
  // - Proyectos de investigación
  // - Servicios internos
  // - Becario y becas ya solicitadas
  useEffect(() => {
    if (!user?.email) return;

    const inicializarPantalla = async () => {
      try {
        setLoading(true);

        await Promise.all([
          cargarProyectosInvestigacion(),
          cargarServiciosInternos(),
          cargarMisBecas(),
        ]);
      } catch (error) {
        console.error("Error al cargar la pantalla de becas", error);
      } finally {
        setLoading(false);
      }
    };

    inicializarPantalla();
  }, [
    user?.email,
    cargarProyectosInvestigacion,
    cargarServiciosInternos,
    cargarMisBecas,
  ]);

  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "114px", md: "130px" },
        pb: 8,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      {/* Overlay de carga inicial de toda la pantalla. */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "all",
            backdropFilter: "blur(2px)",
          }}
          textAlign="center"
        >
          <Box
            sx={{
              position: "relative",
              width: 200,
              height: 200,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress size={200} thickness={2.8} />
            <Box
              component="img"
              src={utnLogo}
              alt="UTN girando"
              sx={{
                width: 125,
                height: 125,
                objectFit: "contain",
                position: "absolute",
                borderRadius: "50%",
                bgcolor: "white",
                p: 0.5,
                boxShadow: 1,
              }}
            />
          </Box>
        </Box>
      )}

      <Container maxWidth="xl">
        <Box
          sx={{
            overflow: "hidden",
            borderRadius: 6,
            px: { xs: 3, md: 3 },
            py: { xs: 2, md: 2 },
            minHeight: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            color: "white",
            backgroundImage:
              "linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%), url('/images/carrousel/EntradaUTN.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box sx={{ maxWidth: 700 }}>
            <Typography
              variant="h3"
              sx={{
                mt: 1,
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              {C.bigTitle}
            </Typography>
            <Typography
              sx={{
                mt: 2,
                maxWidth: 560,
                fontSize: { xs: 16, md: 18 },
                opacity: 0.92,
              }}
            >
              {C.bigSubtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: 80,
              height: 80,
              borderRadius: "20px",
              backgroundImage: "url('/images/principal/logoUTNrotado.png')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              transform: "rotate(8deg)",
              filter: "drop-shadow(0 18px 35px rgba(0,0,0,0.22))",
            }}
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            {C.documentationTitle}
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            {C.documentationSubtitle}
          </Typography>
        </Box>

        {/* Cards de becas ya solicitadas por el usuario. */}
        <Grid container spacing={2.5} sx={{ mt: 1 }}>
          {misBecas.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={`${item.tipoBeca}-${item.id}`}
            >
              <Card
                sx={{
                  minWidth: 350,
                  maxWidth: { xs: "100%", sm: 400 },
                  height: "100%",
                  borderRadius: 4,
                  flexDirection: "column",
                  boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
                  border: "1px solid rgba(17, 53, 101, 0.08)",
                  transition:
                    "background-color 0.25s ease, border-color 0.25s ease",
                  "&:hover": {
                    backgroundColor: "#f1f5fb",
                    borderColor: "rgba(17, 53, 101, 0.2)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    pt: 2,
                    pl: 3,
                    pr: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Stack sx={{ height: "100%" }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">
                        <strong>{item.tipoBeca}</strong>
                      </Typography>
                      {item.iconBeca}
                    </Stack>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        label={getEstadoBecaConfig(item.estado).label}
                        color={getEstadoBecaConfig(item.estado).color}
                        size="medium"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                        mt: 1,
                      }}
                    >
                      <Typography variant="body1" color="text.primary">
                        <strong>Fecha Solicitud:</strong>
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {formatDate(item.fechaSolicitud)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                        mt: 1,
                      }}
                    >
                      <Typography variant="body1" color="text.primary">
                        <strong>Módulos Asignados:</strong>
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {item.modulos_asignados ?? "-"}
                      </Typography>
                    </Box>

                    {item.tipoBeca === TIPO_BECA.INVESTIGACION && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "wrap",
                          mt: 1,
                        }}
                      >
                        <Typography variant="body1" color="text.primary">
                          <strong>Proyecto:</strong>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {item.proyecto_investigacion}
                        </Typography>
                      </Box>
                    )}

                    {item.tipoBeca === TIPO_BECA.SERVICIO && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "wrap",
                          mt: 1,
                        }}
                      >
                        <Typography variant="body1" color="text.primary">
                          <strong>Servicio:</strong>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {item.servicio}
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                        mt: 1,
                      }}
                    >
                      {/*
                      <SAEButton onClick={() => handlePreview(item.id_archivo, item.archivoNombre)}>
                        {item.archivoNombre
                          ? item.archivoNombre.length > 23
                            ? `${item.archivoNombre.slice(0, 23)}...`
                            : item.archivoNombre
                          : ""}
                      </SAEButton>
                      */}

                      <IconButton
                        component="label"
                        size="small"
                        color="primary"
                        disabled={item.subido}
                      >
                        <FileUpload />
                        <input
                          type="file"
                          hidden
                          accept={item.extension}
                          // onChange={(e) => handleArchivoChange(e, item)}
                        />
                      </IconButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Card especial para abrir el formulario de nueva solicitud. */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              onClick={handleAgregarBeca}
              sx={{
                minWidth: 350,
                maxWidth: { xs: "100%", sm: 400 },
                height: "100%",
                borderRadius: 4,
                cursor: "pointer",
                border: "2px dashed rgba(17, 53, 101, 0.25)",
                backgroundColor: "#f8fbff",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: "#eef5ff",
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  minHeight: 220,
                }}
              >
                <AddCircleOutline color="primary" sx={{ fontSize: 60 }} />
                <Typography variant="h6" textAlign="center">
                  {C.cardSolicitarTitle}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  {C.cardSolicitarSubtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sección de preguntas frecuentes. */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            {C.FAQTitle}
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            {C.FAQSubtitle}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {C.faqsBecas.map((faq, index) => (
              <Accordion
                key={index}
                disableGutters
                sx={{
                  mb: 1.5,
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(21, 61, 113, 0.08)",
                  border: "1px solid rgba(17, 53, 101, 0.08)",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight={600}>{faq.pregunta}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    {faq.respuesta}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Dialog de alta/edición de beca. Actualmente se usa para solicitar una nueva beca. */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
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
              {becaSeleccionada ? "Editar Beca" : "Solicitar Beca"}
            </Typography>
            <IconButton
              onClick={handleCloseDialog}
              size="small"
              disabled={saving}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: "16px !important",
            }}
          >
            {/* Mini loading dentro del formulario mientras se guarda.
                Bloquea visualmente el contenido y evita dobles clicks. */}
            {saving && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  bgcolor: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <CircularProgress size={36} />
                <Typography variant="body2" color="text.secondary">
                  Guardando solicitud...
                </Typography>
              </Box>
            )}

            <Divider variant="middle" sx={{ mt: 0.5 }}>
              <Chip
                label={C.DatosPersonales}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Divider>

            <SAETextField
              fullWidth
              label="Legajo"
              name="legajo"
              disabled
              value={formBeca.legajo}
              onChange={handleChange}
            />

            <FormControlLabel
              control={
                <SAESwitch
                  size="medium"
                  checked={Boolean(formBeca.alquila)}
                  name="alquila"
                  onChange={handleChange}
                  disabled={saving}
                />
              }
              label={C.alquilarTitle}
              sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.90rem" } }}
            />

            <Divider variant="middle" sx={{ mt: 0.5 }}>
              <Chip
                label={C.TiposBecas}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Divider>

            {/* Tipo de beca seleccionado. Al cambiarlo, se limpia formBeca.beca. */}
            <FormControl fullWidth disabled={saving}>
              <InputLabel>Tipo Beca</InputLabel>
              <Select
                value={formBeca.tipoBeca}
                onChange={handleChange}
                name="tipoBeca"
                input={<OutlinedInput label="Tipo Beca" />}
              >
                {C.listaTiposBecas.map((beca) => (
                  <MenuItem key={beca.nombre} value={beca.nombre}>
                    {beca.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Campo adicional obligatorio solo para beca de investigación. */}
            {formBeca.tipoBeca === TIPO_BECA.INVESTIGACION && (
              <FormControl fullWidth disabled={saving}>
                <InputLabel>Proyecto Investigación</InputLabel>
                <Select
                  value={formBeca.beca ?? ""}
                  onChange={handleChange}
                  name="beca"
                  input={<OutlinedInput label="Proyecto Investigación" />}
                >
                  {proyectosRows.map((proyecto) => (
                    <MenuItem key={proyecto.id} value={proyecto}>
                      {proyecto.nombre_proyecto_investigacion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Campo adicional obligatorio solo para beca de servicio. */}
            {formBeca.tipoBeca === TIPO_BECA.SERVICIO && (
              <FormControl fullWidth disabled={saving}>
                <InputLabel>Proyecto Servicio</InputLabel>
                <Select
                  value={formBeca.beca ?? ""}
                  onChange={handleChange}
                  name="beca"
                  input={<OutlinedInput label="Proyecto Servicio" />}
                >
                  {serviciosRows.map((servicio) => (
                    <MenuItem key={servicio.id} value={servicio}>
                      {servicio.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>

          <DialogActions>
            <SAEButton onClick={handleCloseDialog} disabled={saving}>
              Cancelar
            </SAEButton>
            <SAEButton
              variant="contained"
              onClick={handleDialogSave}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </SAEButton>
          </DialogActions>
        </Dialog>

        {/* Mensaje final de éxito/error/advertencia. */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
