import { useAuth } from "../../../shared/auth/AuthContext";
import {
  CardContent,
  Typography,
  Card,
  Container,
  IconButton,
  Box,
  Grid,
  Dialog,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  DialogContentText,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import utnLogo from "../../../assets/utn.png";

import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";

import { FileUpload, Delete } from "@mui/icons-material";

import DeportesMasonry from "../../components/deportesMasonery";
import JsonArrayDataGrid from "../../../shared/components/jsonArrayDataGrid/jsonArrayDataGrid";

import {
  ObtenerHorariosDeportista,
  ObtenerIdDeportista,
  ObtenerTorneosXDeporte,
  CrearInscripcionDeporte,
  DesinscribirDeporte,
} from "../../../api/DeportesServices";

import {
  CrearDocumentoEstudiante,
  DescargarDocumentacionXId,
  EliminarDocumentoEstudiante,
  ListarDocumentacionXLegajo,
} from "../../../api/EstudianteService";

import {
  isPdfDocument,
  construirNombre,
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
  INITIAL_PREVIEW,
} from "./sports.utils";

import { ObtenerTiposDocumento } from "../../../api/HerramientasService";

import { useState, useEffect } from "react";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import { SPORTS_STRINGS } from "./sports.strings";
const C = SPORTS_STRINGS;

export default function StudentSports() {
  function closePreview() {
    setPreview((prev) => ({ ...prev, open: false }));
  }

  const [documentos, setDocumentos] = useState([
    {
      id_tipo_documento: null,
      nombre: "Certificado de Alumno Regular",
      subido: false,
      archivo: null,
      archivoNombre: "",
      formatoNombre: "{legajo}_AlumnoRegular",
      id_archivo: null,
    },
    {
      id_tipo_documento: null,
      nombre: "Fotocopia Documento",
      subido: false,
      archivo: null,
      archivoNombre: "",
      formatoNombre: "{legajo}_DNI",
      id_archivo: null,
    },
    {
      id_tipo_documento: null,
      nombre: "Ficha Medica o E.M.M.A.C",
      subido: false,
      archivo: null,
      archivoNombre: "",
      formatoNombre: "{legajo}_FichaMedica",
      id_archivo: null,
    },
  ]);

  const { user } = useAuth();
  const [deportista, setIdDeportista] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);
  const [horariosDeportista, setHorariosDeportista] = useState([]);
  const [torneoDeportista, setTorneoDeportista] = useState([]);
  const [preview, setPreview] = useState(INITIAL_PREVIEW);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const ObtenerIdDeportistaApi = async () => {
    try {
      const data = await ObtenerIdDeportista(user.legajo, user.token);
      setIdDeportista(data);
      return data;
    } catch (error) {
      console.error("Error al traer Id Deportista:", error);
      setSnackbar({
        open: true,
        message: C.errorLoadSportman,
        severity: "error",
      });
      return null;
    }
  };

  const ObtenerHorariosDeportistaApi = async (deportista) => {
    try {
      const data = await ObtenerHorariosDeportista(deportista.id, user.token);
      setHorariosDeportista(data.horarios);
      return data.horarios;
    } catch (error) {
      console.error("Error al traer Horario Deportivos:", error);
      setSnackbar({
        open: true,
        message: C.errorLoadSportmanHorario,
        severity: "error",
      });
      return [];
    }
  };

  const ObtenerTorneosPorDeporte = async (deportesIds) => {
    try {
      const resultados = await Promise.all(
        deportesIds.map((id) => ObtenerTorneosXDeporte(id, user.token)),
      );

      const torneos = resultados.flat();

      setTorneoDeportista(torneos);
    } catch (error) {
      console.error("Error al traer torneos:", error);
      setSnackbar({
        open: true,
        message: C.erroLoadTournaments,
        severity: "error",
      });
    }
  };

  const ObtenerTipoDocuemntos = async () => {
    try {
      const data = await ObtenerTiposDocumento(user.token);

      if (!data || data.length === 0) return;

      const mapBackend = Object.fromEntries(
        data.map((d) => [d.nombre.toLowerCase().trim(), [d.id, d.extension]]),
      );

      setDocumentos((prev) =>
        prev.map((doc) => ({
          ...doc,
          id_tipo_documento: mapBackend[doc.nombre.toLowerCase().trim()]
            ? mapBackend[doc.nombre.toLowerCase().trim()][0]
            : null,
          extension: mapBackend[doc.nombre.toLowerCase().trim()]
            ? mapBackend[doc.nombre.toLowerCase().trim()][1]
            : null,
        })),
      );
    } catch (error) {
      console.error("Error al traer tipos de documentos:", error);
      setSnackbar({
        open: true,
        message: C.errotLoadDocumentsType,
        severity: "error",
      });
    }
  };

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
      const data = await DescargarDocumentacionXId(id, user.token);
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
        error: "No se pudo cargar el documento",
      }));
    }
  }

  const ObtenerDocumentosEstudiante = async () => {
    try {
      const data = await ListarDocumentacionXLegajo(user.email, user.token);
      if (!data || data.length === 0) return;
      setDocumentos((prev) =>
        prev.map((doc) => {
          const docBackend = data.find(
            (d) =>
              Number(d.documento?.id_tipo_documento) ===
              Number(doc.id_tipo_documento),
          );

          if (!docBackend) return doc;

          return {
            ...doc,
            subido: true,
            archivo: docBackend.documento,
            archivoNombre: docBackend.documento.nombre_documento,
            id_archivo: docBackend.documento.id,
          };
        }),
      );
    } catch (error) {
      console.error("Error al traer Id Deportista:", error);
    }
  };

  const handleArchivoChange = async (e, item) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extensionArchivo = `.${file.name.split(".").pop().toLowerCase()}`;

    const extensionesPermitidas = item.extension
      .split(",")
      .map((ext) => ext.trim().toLowerCase());

    if (!extensionesPermitidas.includes(extensionArchivo)) {
      alert(`Solo se permiten archivos: ${item.extension}`);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      alert(`El archivo no puede superar los ${MAX_SIZE_MB} MB.`);
      e.target.value = "";
      return;
    }

    const nuevoNombre = construirNombre(
      item.formatoNombre,
      {
        legajo: user.legajo,
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

      archivoGuardado = await CrearDocumentoEstudiante(
        item.id_tipo_documento,
        archivoRenombrado,
        user.token,
      );
      setSnackbar({
        open: true,
        message: "Archivo subido con éxito",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al subir el archivo",
        severity: "error",
      });
    } finally {
      setLoading(false);
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
    e.target.value = "";
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const inicializarPantalla = async () => {
      try {
        setLoading(true);

        // 1. Deportista
        const idDeportista = await ObtenerIdDeportistaApi();

        // 2. Tipos de documentos
        await ObtenerTipoDocuemntos();

        // 3. Documentos del estudiante
        await ObtenerDocumentosEstudiante();

        // 4. Horarios del deportista
        let horDepor = [];
        if (idDeportista) {
          horDepor = await ObtenerHorariosDeportistaApi(idDeportista);
        }

        // 5. Torneos por deporte
        const deportesIds = Array.from(
          new Set(
            (horDepor || [])
              .filter((h) => h.esta_inscripto)
              .map((h) => h.id_deporte),
          ),
        );

        if (deportesIds.length > 0) {
          await ObtenerTorneosPorDeporte(deportesIds);
        }
      } catch (error) {
        console.error("Error al inicializar la pantalla:", error);
      } finally {
        setLoading(false);
      }
    };

    inicializarPantalla();
  }, [user]);

  async function DeleteDocument(document) {
    setOpenPopup(true);
    setDocumentoAEliminar(document);
  }

  async function handleDelete(item) {
    try {
      setOpenPopup(false);

      setLoading(true);

      await EliminarDocumentoEstudiante(item.id_archivo, user.token);

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

  const handleInscribirClick = async (card) => {
    try {
      setLoading(true);

      if (card.esta_inscripto) {
        // DESINSCRIBIR
        await DesinscribirDeporte(card.id_inscripcion, user.token);
      } else {
        // INSCRIBIR
        await CrearInscripcionDeporte(
          card.id_deporte,
          deportista.id,
          user.token,
        );
      }
      setSnackbar({
        open: true,
        message: card.esta_inscripto
          ? C.successUnsuscription
          : C.successInsncription,
        severity: "success",
      });

      await ObtenerHorariosDeportistaApi(deportista);
    } catch (error) {
      console.error("Error al manejar la Inscripcion :", error);
      setSnackbar({
        open: true,
        message: C.errorHandleSucscription,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0, // top:0, left:0, right:0, bottom:0
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
            background:
              "linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%)",
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
        <Grid container spacing={2.5} sx={{ mt: 1 }}>
          {documentos.map((item) => (
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  minWidth: 357,
                  height: "100%",
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
                  }}
                >
                  <Stack sx={{ height: "100%" }}>
                    <Typography variant="h6">
                      <strong>{item.nombre}</strong>
                    </Typography>
                    <Box sx={{ flexGrow: 1, mt: 1 }} />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Chip
                        label={
                          !item.subido
                            ? C.docStateNotUploaded
                            : C.docStataUplodaded
                        }
                        color={!item.subido ? "grey" : "success"}
                      />
                    </Stack>

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
                      <SAEButton
                        onClick={() =>
                          handlePreview(item.id_archivo, item.archivoNombre)
                        }
                      >
                        {item.archivoNombre
                          ? item.archivoNombre.length > 23
                            ? item.archivoNombre.slice(0, 23) + "..."
                            : item.archivoNombre
                          : ""}
                      </SAEButton>
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
                          onChange={(e) => handleArchivoChange(e, item)}
                        />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        disabled={!item.subido}
                        onClick={() => DeleteDocument(item)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            {C.sportsTitle}
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            {C.sportsSubTitle}
          </Typography>
        </Box>

        {horariosDeportista.length > 0 && (
          <Card
            sx={{
              overflow: "hidden",
              borderRadius: 6,
              px: { xs: 2, md: 3 },
              py: { xs: 3, md: 1 },
            }}
          >
            <DeportesMasonry
              deportes={horariosDeportista}
              onInscribirClick={handleInscribirClick}
            />
          </Card>
        )}
        {torneoDeportista.length > 0 && (
          <>
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "#123666" }}
              >
                {C.tournamnetsTitle}
              </Typography>
              <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
                {C.tournamnetsSubTitle}
              </Typography>
            </Box>

            <JsonArrayDataGrid data={torneoDeportista} />
          </>
        )}

        {/*Dialog para Borrar Documento*/}
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
          <DialogTitle>{C.deleteDocTitle}</DialogTitle>

          <DialogContent>
            <DialogContentText>
              {C.deleteDocMessage(documentoAEliminar?.archivoNombre)}
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
