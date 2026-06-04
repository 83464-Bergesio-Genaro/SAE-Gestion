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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
} from "@mui/material";
import { SCHOLARSHIP_STRINGS } from "./scholarship.string";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  AddCircleOutline,
  ExpandMore,
  AttachMoney,
  Diversity3,
  School,
} from "@mui/icons-material";

import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import ScholarshipsForm from "./scholarshipsForm";
import ScholarshipDocumentCard from "./ScholarshipDocumentCard";

import {
  ObtenerBecariosXLegajo,
  ObtenerBecariosEconomicaXLegajo,
  ObtenerBecariosServiciosXLegajo,
  ObtenerBecariosInvestigacionXLegajo,
  listarDocumentacionXLegajo,
  descargarDocumentacionXId,
  eliminarDocumentoEstudiante,
  crearDocumentoEstudiante,
} from "../../../api/BecasService";

import { obtenerTiposDocumento } from "../../../api/HerramientasService";

import {
  INITIAL_PREVIEW,
  asignarArchivosADocumentos,
  asignarTiposADocumentos,
  formatDate,
  getEstadoBecaConfig,
  getEstadoBecaDesdeBecario,
  getErrorMessage,
  isValidObjectResponse,
  isPdfDocument,
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
  construirNombre,
  obtenerLegajoDesdeEmail,
} from "./scholarship.utils";
import {
  TIPO_BECA,
  REQUERID_DOCUMENTS,
  ECONOMIC_DOCUMENTS,
  ECONOMIC_OPTIONAL_DOCUMENTS,
} from "./scholarship.configs";

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

// Devuelve el icono visual para cada tipo de beca sin mezclar JSX dentro de la
// respuesta normalizada de la API.
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

export default function Scholarships() {
  function closePreview() {
    setPreview((prev) => ({ ...prev, open: false }));
  }
  const { user } = useAuth();
  const perfilIncompleto = user?.datosCompletos === false;
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
  // Lista normalizada de becas para pintar las cards.
  const [misBecas, setMisBecas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [documentos, setDocumentos] = useState(REQUERID_DOCUMENTS); // lista general de documentos cargados
  const [documentosEconomica, setDocumentosEconomica] = useState(
    ECONOMIC_DOCUMENTS.concat(ECONOMIC_OPTIONAL_DOCUMENTS),
  ); // documentos específicos para beca económica

  const [preview, setPreview] = useState(INITIAL_PREVIEW);

  const [cbu, setCbu] = useState("");
  const [cbuGuardado, setCbuGuardado] = useState(false);

  const [openPopup, setOpenPopup] = useState(false);
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);

  // Helper para no repetir setSnackbar en cada try/catch.
  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Carga los proyectos disponibles para la beca de investigación.

  // Normaliza las respuestas de la API porque vienen como objeto único o como {} cuando no existe beca.
  // Trae tipos de documento para completar id_tipo_documento y extension en las
  // configuraciones locales.
  const cargarTiposDocumento = useCallback(async () => {
    try {
      const data = await obtenerTiposDocumento();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error al obtener tipos de documento", error);
      return [];
    }
  }, []);

  // Metodo compartido con ScholarshipsForm. Guarda en base y sincroniza las dos
  // listas locales porque un tipo de documento puede verse en mas de una seccion.
  const subirDocumentoEstudiante = useCallback(
    async (idTipoDocumento, archivo) => {
      const documentoGuardado = await crearDocumentoEstudiante(
        idTipoDocumento,
        archivo,
      );

      setDocumentos((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(idTipoDocumento)
            ? {
                ...doc,
                archivo: documentoGuardado.archivo,
                archivoNombre:
                  documentoGuardado.nombre_completo_documento ??
                  documentoGuardado.nombre_documento,
                subido: true,
                id_archivo: documentoGuardado.id,
                extension: documentoGuardado.extension ?? doc.extension,
              }
            : doc,
        ),
      );

      setDocumentosEconomica((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(idTipoDocumento)
            ? {
                ...doc,
                archivo: documentoGuardado.archivo,
                archivoNombre:
                  documentoGuardado.nombre_completo_documento ??
                  documentoGuardado.nombre_documento,
                subido: true,
                id_archivo: documentoGuardado.id,
                extension: documentoGuardado.extension ?? doc.extension,
              }
            : doc,
        ),
      );

      return documentoGuardado;
    },
    [],
  );

  // Cada endpoint devuelve una forma distinta. Aca se arma una lista unica para
  // renderizar las cards de "Mis Becas".
  const normalizarBecas = useCallback((economica, servicio, investigacion) => {
    return [
      isValidObjectResponse(economica) && {
        ...economica,
        tipoBeca: TIPO_BECA.ECONOMICA,
        iconBeca: getBecaIcon(TIPO_BECA.ECONOMICA),
        fechaSolicitud: economica.becario?.fecha_solicitud,
        estado: getEstadoBecaDesdeBecario(economica.becario),
      },
      isValidObjectResponse(servicio) && {
        ...servicio,
        tipoBeca: TIPO_BECA.SERVICIO,
        iconBeca: getBecaIcon(TIPO_BECA.SERVICIO),
        fechaSolicitud: servicio.becario?.fecha_solicitud,
        estado: getEstadoBecaDesdeBecario(servicio.becario),
        servicio:
          servicio.servicio?.nombre ?? servicio.servicio ?? C.emptyValue,
      },
      isValidObjectResponse(investigacion) && {
        ...investigacion,
        tipoBeca: TIPO_BECA.INVESTIGACION,
        iconBeca: getBecaIcon(TIPO_BECA.INVESTIGACION),
        fechaSolicitud: investigacion.becario?.fecha_solicitud,
        estado: getEstadoBecaDesdeBecario(investigacion.becario),
        proyecto_investigacion:
          investigacion.proyecto_investigacion?.nombre_proyecto_investigacion ??
          investigacion.proyecto_investigacion?.centro_investigacion ??
          C.emptyValue,
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
      showSnackbar(C.loadScholarshipsError, "error");
    }
  }, [normalizarBecas, showSnackbar, user?.email]);

  // Carga directa desde "Mis Documentos". El formulario usa el mismo servicio,
  // pero maneja su propio estado local mientras el dialog esta abierto.
  const handleArchivoChange = async (e, item) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extensionArchivo = `.${file.name.split(".").pop().toLowerCase()}`;

    const extensionesPermitidas = item.extension
      .split(",")
      .map((ext) => ext.trim().toLowerCase());

    if (!extensionesPermitidas.includes(extensionArchivo)) {
      alert(C.uploadAllowedExtensions(item.extension));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      alert(C.uploadMaxSize(MAX_SIZE_MB));
      e.target.value = "";
      return;
    }

    const nuevoNombre = construirNombre(
      item.formatoNombre,
      {
        legajo: obtenerLegajoDesdeEmail(user.legajo ?? user.email),
      },
      extensionArchivo,
    );

    const archivoRenombrado = new File([file], nuevoNombre, {
      type: file.type,
      lastModified: file.lastModified,
    });

    let archivoGuardado;

    try {
      setLoading(true);
      archivoGuardado = await crearDocumentoEstudiante(
        item.id_tipo_documento,
        archivoRenombrado,
      );
      setSnackbar({
        open: true,
        message: C.uploadSuccess,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: getErrorMessage(error, C.uploadError),
        severity: "error",
      });
      console.error("Error al subir el archivo:", error);
    } finally {
      setLoading(false);
    }

    if (!archivoGuardado) {
      e.target.value = "";
      return;
    }

    setDocumentos((prev) =>
      prev.map((doc) =>
        Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
          ? {
              ...doc,
              archivo: archivoGuardado,
              archivoNombre: archivoGuardado.nombre_documento,
              subido: true,
              id_archivo: archivoGuardado.id,
            }
          : doc,
      ),
    );

    setDocumentosEconomica((prev) =>
      prev.map((doc) =>
        Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
          ? {
              ...doc,
              archivo: archivoGuardado,
              archivoNombre: archivoGuardado.nombre_documento,
              subido: true,
              id_archivo: archivoGuardado.id,
            }
          : doc,
      ),
    );
    e.target.value = "";
  };

  const handleCbuChange = (e) => {
    setCbu(e.target.value.replace(/\D/g, "").slice(0, 22));
  };

  const handleGuardarCbu = () => {
    if (cbu.length !== 22) {
      showSnackbar(C.cbuInvalid, "warning");
      return;
    }

    setCbuGuardado(true);
    showSnackbar(C.cbuSavedSuccess, "success");
  };

  const hasEconomica = misBecas.some((b) => b.tipoBeca === TIPO_BECA.ECONOMICA);

  // Abre el Dialog para solicitar una beca nueva.
  // Si ya existe Becario SAE, precarga sus datos; si no, usa datos del usuario logueado.
  const handleAgregarBeca = () => {
    setOpenDialog(true);
  };

  // Borra despues de confirmar en el dialog. Si la API responde bien, limpia el
  // documento en ambas listas para mantener la pantalla sincronizada.
  async function handleDelete(item) {
    try {
      setOpenPopup(false);

      setLoading(true);

      await eliminarDocumentoEstudiante(item.id_archivo);

      setSnackbar({
        open: true,
        message: C.docEliminado,
        severity: "success",
      });

      setDocumentos((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
            ? {
                ...doc,
                archivo: null,
                archivoNombre: "",
                subido: false,
                id_archivo: null,
              }
            : doc,
        ),
      );

      setDocumentosEconomica((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
            ? {
                ...doc,
                archivo: null,
                archivoNombre: "",
                subido: false,
                id_archivo: null,
              }
            : doc,
        ),
      );
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      setSnackbar({
        open: true,
        message: C.docEliminadoError,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  // Descarga el archivo por id y delega la visualizacion al dialog compartido.
  async function handlePreview(id, nombre) {
    setPreview({
      open: true,
      loading: true,
      title: nombre,
      imageSrc: null,
      isPdf: false,
      error: null,
    });
    try {
      const data = await descargarDocumentacionXId(id);
      setPreview({
        open: true,
        loading: false,
        title: nombre,
        imageSrc: data.datos_documento,
        isPdf: isPdfDocument(data),
        error: null,
      });
    } catch {
      setPreview((prev) => ({
        ...prev,
        loading: false,
        error: C.previewLoadError,
      }));
    }
  }

  // Solo abre la confirmacion; la eliminacion real ocurre en handleDelete.
  async function DeleteDocument(document) {
    setOpenPopup(true);
    setDocumentoAEliminar(document);
  }

  // Primer paso de documentos: cruzar configuracion local con tipos reales.
  const ObtenerTipoDocumentos = useCallback(async () => {
    try {
      const data = await cargarTiposDocumento();
      if (!data || data.length === 0) return;

      let docsConId = [];

      setDocumentos((prev) => {
        docsConId = asignarTiposADocumentos(prev, data);

        return docsConId;
      });

      setDocumentosEconomica((prev) => asignarTiposADocumentos(prev, data));

      return docsConId;
    } catch (error) {
      console.error("Error al obtener tipos de documento", error);
      return [];
    }
  }, [cargarTiposDocumento]);

  // Segundo paso de documentos: marcar como subidos los archivos que ya existen
  // para el legajo del estudiante.
  const ObtenerDocumentosEstudiante = useCallback(
    async (documentosBase) => {
      try {
        const data = await listarDocumentacionXLegajo(user?.email);
        if (!data || data.length === 0) return;

        setDocumentos((prev) =>
          asignarArchivosADocumentos(
            documentosBase.length > 0 ? documentosBase : prev,
            data,
          ),
        );

        setDocumentosEconomica((prev) =>
          asignarArchivosADocumentos(prev, data),
        );
      } catch (error) {
        console.error("Error al obtener documentos del estudiante", error);
      }
    },
    [user?.email],
  );

  // Carga inicial: becario/becas, tipos de documento y archivos del estudiante.
  // El orden importa porque los archivos se asignan usando id_tipo_documento.
  useEffect(() => {
    if (!user?.email) return;

    const inicializarPantalla = async () => {
      try {
        setLoading(true);

        await cargarMisBecas();

        const documentosConTipo = await ObtenerTipoDocumentos();

        await ObtenerDocumentosEstudiante(documentosConTipo);
      } catch (error) {
        console.error("Error al cargar la pantalla de becas", error);
      } finally {
        setLoading(false);
      }
    };

    inicializarPantalla();
  }, [
    user?.email,
    cargarMisBecas,
    ObtenerTipoDocumentos,
    ObtenerDocumentosEstudiante,
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
              alt={C.utnLogoAlt}
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

        {perfilIncompleto && (
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              borderRadius: 3,
              bgcolor: "#fff8e1",
              border: "1px solid",
              borderColor: "#ffecb3",
              color: "#665c00",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <WarningAmberIcon sx={{ color: "#f9a825" }} />
              <Typography variant="h6" fontWeight={700}>
                {C.incompleteProfileTitle}
              </Typography>
            </Box>
            <Typography sx={{ mt: 1 }}>{C.incompleteProfileMessage}</Typography>
            <Box sx={{ mt: 1 }}>
              <SAEButton
                variant="contained"
                onClick={() => (window.location.href = "/perfil")}
              >
                {C.incompleteProfileButton}
              </SAEButton>
            </Box>
          </Box>
        )}

        {/* Cards de becas ya solicitadas por el usuario. */}
        <Box sx={{ position: "relative", mt: 1 }}>
          <Grid container spacing={2.5}>
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
                          <strong>{C.requestedDateLabel}</strong>
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
                          <strong>{C.assignedModulesLabel}</strong>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {item.modulos_asignados ?? C.emptyValue}
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
                            <strong>{C.projectLabel}</strong>
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
                            <strong>{C.serviceLabel}</strong>
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {item.servicio}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Card especial para abrir el formulario de nueva solicitud. */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                onClick={!perfilIncompleto ? handleAgregarBeca : undefined}
                sx={{
                  minWidth: 350,
                  maxWidth: { xs: "100%", sm: 400 },
                  height: "100%",
                  borderRadius: 4,
                  cursor: perfilIncompleto ? "not-allowed" : "pointer",
                  pointerEvents: perfilIncompleto ? "none" : "auto",
                  border: "2px dashed rgba(17, 53, 101, 0.25)",
                  backgroundColor: "#f8fbff",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor: perfilIncompleto ? "#f8fbff" : "#eef5ff",
                    borderColor: perfilIncompleto
                      ? "rgba(17, 53, 101, 0.25)"
                      : "primary.main",
                  },
                }}
              >
                <CardContent
                  sx={{
                    pt: 2,
                    pl: 3,
                    pr: 3,
                    gap: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
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

          {perfilIncompleto && (
            <Box
              role="alert"
              aria-live="polite"
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                pointerEvents: "auto",
              }}
            >
              <Typography textAlign="center" sx={{ color: "text.disabled" }}>
                {C.incompleteProfileMessage}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            {C.myDocumentsTitle}
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            {C.documentationSubtitle}
          </Typography>
        </Box>
        {perfilIncompleto && (
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              borderRadius: 3,
              bgcolor: "#fff8e1",
              border: "1px solid",
              borderColor: "#ffecb3",
              color: "#665c00",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <WarningAmberIcon sx={{ color: "#f9a825" }} />
              <Typography variant="h6" fontWeight={700}>
                {C.incompleteProfileTitle}
              </Typography>
            </Box>
            <Typography sx={{ mt: 1 }}>{C.incompleteProfileMessage}</Typography>
            <Box sx={{ mt: 1 }}>
              <SAEButton
                variant="contained"
                onClick={() => (window.location.href = "/perfil")}
              >
                {C.incompleteProfileButton}
              </SAEButton>
            </Box>
          </Box>
        )}
        {/* Sección: Mis Documentos */}
        <Box sx={{ mt: 4, position: "relative" }}>
          {perfilIncompleto && (
            <Box
              role="alert"
              aria-live="polite"
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                pointerEvents: "auto",
              }}
            >
              <Typography textAlign="center" sx={{ color: "text.disabled" }}>
                {C.incompleteProfileMessage}
              </Typography>
            </Box>
          )}
          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            {documentos.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={item.id_tipo_documento ?? item.id ?? item.nombre}
              >
                <ScholarshipDocumentCard
                  documento={item}
                  notUploadedLabel={C.docStateNotUploaded}
                  uploadedLabel={C.docStataUplodaded}
                  onPreview={handlePreview}
                  onFileChange={(event, documento) =>
                    handleArchivoChange(event, documento)
                  }
                  onDelete={DeleteDocument}
                  uploadDisabled={item.subido}
                  deleteDisabled={!item.subido}
                  showRequirement
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Card
                sx={{
                  width: "100%",
                  minWidth: 0,
                  height: "100%",
                  display: "flex",
                  borderRadius: 4,
                  flexDirection: "column",
                  boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
                  border: "1px solid rgba(17, 53, 101, 0.08)",
                  transition:
                    "background-color 0.25s ease, border-color 0.25s ease",

                  "&:hover": {
                    backgroundColor: "#f1f5fb", // un tono más oscuro que el fondo actual
                    borderColor: "rgba(17, 53, 101, 0.2)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  <Stack sx={{ minHeight: 180, flexGrow: 1 }}>
                    <Typography variant="h6">
                      <strong>{C.cbuTitle}</strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {C.cbuDescription}
                    </Typography>

                    <SAETextField
                      fullWidth
                      label={C.cbuLabel}
                      value={cbu}
                      onChange={handleCbuChange}
                      disabled={cbuGuardado}
                      inputProps={{
                        inputMode: "numeric",
                        maxLength: 22,
                        pattern: "[0-9]*",
                      }}
                    />
                    <Box sx={{ flexGrow: 1, mt: 1 }} />
                    {!perfilIncompleto && (
                      <Stack spacing={1.25} sx={{ mt: 1, width: "100%" }}>
                        <SAEButton
                          variant="contained"
                          onClick={handleGuardarCbu}
                          disabled={cbu.length !== 22 || cbuGuardado}
                          sx={{ mt: "auto", width: "100%" }}
                        >
                          {C.cbuSaveButton}
                        </SAEButton>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Mini-sección: documentos de beca económica */}
          {hasEconomica && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#123666" }}
              >
                {C.economicScholarshipDocumentsTitle}
              </Typography>
              <Box sx={{ mt: 4, position: "relative" }}>
                <Grid container spacing={2.5} sx={{ mt: 1 }}>
                  {documentosEconomica.map((item) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={item.id_tipo_documento ?? item.id ?? item.nombre}
                    >
                      <ScholarshipDocumentCard
                        documento={item}
                        notUploadedLabel={C.docStateNotUploaded}
                        uploadedLabel={C.docStataUplodaded}
                        onPreview={handlePreview}
                        onFileChange={(event, documento) =>
                          handleArchivoChange(event, documento)
                        }
                        onDelete={DeleteDocument}
                        uploadDisabled={item.subido}
                        deleteDisabled={!item.subido}
                        showRequirement
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          )}
        </Box>

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

        {/* El form recibe documentos y callbacks; Scholarships conserva la fuente de verdad. */}
        <ScholarshipsForm
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          user={user}
          becarioActual={becarioActual}
          setBecarioActual={setBecarioActual}
          cargarMisBecas={cargarMisBecas}
          cargarTiposDocumento={cargarTiposDocumento}
          subirDocumentoEstudiante={subirDocumentoEstudiante}
          documentos={documentos}
          documentosEconomica={documentosEconomica}
          handlePreview={handlePreview}
          handleDeleteDocument={DeleteDocument}
          showSnackbar={showSnackbar}
        />

        <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
          <DialogTitle>{C.deleteDocTitle}</DialogTitle>

          <DialogContent>
            <DialogContentText>
              {C.deleteDocMessage(
                documentoAEliminar?.nombre_documento ??
                  documentoAEliminar?.archivoNombre,
              )}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <SAEButton
              onClick={() => handleDelete(documentoAEliminar)}
              autoFocus
            >
              {C.deleteDocButton}
            </SAEButton>
          </DialogActions>
        </Dialog>

        <DocumentPreviewDialog
          open={preview.open}
          onClose={closePreview}
          title={preview.title}
          imageSrc={preview.imageSrc}
          isPdf={preview.isPdf}
          loading={preview.loading}
          error={preview.error}
        />

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
