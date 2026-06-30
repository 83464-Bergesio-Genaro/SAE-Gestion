import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
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
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  AddCircleOutline,
  AttachMoney,
  Diversity3,
  School,
} from "@mui/icons-material";
import SAEPage from "../../../shared/components/page/SAEPage";

import {
  INITIAL_PREVIEW,
  formatDate,
  getEstadoBecaConfig,
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
} from "./scholarship.utils";
import {
  TIPO_BECA,
  REQUERID_DOCUMENTS,
  ECONOMIC_DOCUMENTS,
  ECONOMIC_OPTIONAL_DOCUMENTS,
} from "./scholarship.configs";

import HeaderPage from "../../../shared/components/headerPage";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import DocumentCard from "../../../shared/components/documents/DocumentCard";
import TitleBox from "../../../shared/components/titleBox";

const C = SCHOLARSHIP_STRINGS;

import { useScholarships } from "../../context/studentContext";
import { ScholarshipsProvider } from "../../context/providers/scholarshipsProvider";
import { useAuth } from "../../../shared/context/sharedContext";
import ScholarshipsForm from "./scholarshipsForm";
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
export default function Scholarships() {
  return (
    <ScholarshipsProvider>
      <ScholarshipsContent />
    </ScholarshipsProvider>
  );
}

function ScholarshipsContent() {
  const user = useAuth();
  const {
    closePreview,
    perfilEstudiante,
    camposPerfilFaltantes,
    perfilIncompleto,
    snackbar,
    setSnackbar,
    becarioActual,
    loadingScholarships,
    loadingDocuments,
    misBecas,

    openDialog,
    documentos,
    documentosEconomica,
    preview,
    cbu,
    cbuGuardado,
    openPopup,
    documentoAEliminar,
    cargarTiposDocumento,
    subirDocumentoEstudiante,
    cargarMisBecas,
    handleArchivoChange,
    handleCbuChange,
    handleGuardarCbu,
    hasEconomica,
    handleAgregarBeca,
    handleDelete,
    handlePreview,
    DeleteDocument,
    ObtenerTipoDocumentos,
    ObtenerDocumentosEstudiante,

    setOpenDialog,
    setBecarioActual,
    showSnackbar,
    setOpenPopup,
  } = useScholarships();

  return (
    <SAEPage>
      <HeaderPage
        title={C.bigTitle}
        description={C.bigSubtitle}
        backgroundImage="images/carrousel/EntradaUTN.jpg"
        icon={<Diversity3Icon />}
      />

      <TitleBox
        title={C.documentationTitle}
        description={C.documentationSubtitle}
      />
      {!loadingScholarships && perfilIncompleto && (
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
          <Typography variant="body2" sx={{ mt: 1 }}>
            Campos faltantes: {camposPerfilFaltantes.join(", ")}.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <SAEButton
              variant="contained"
              onClick={() => (window.location.href = "/Mi-Perfil")}
            >
              {C.incompleteProfileButton}
            </SAEButton>
          </Box>
        </Box>
      )}

      {/* Cards de becas ya solicitadas por el usuario. */}
      <Box sx={{ position: "relative", mt: 1 }}>
        {loadingScholarships && (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <SAESpinner size="S" />
          </Stack>
        )}
        <Grid
          container
          spacing={2.5}
          sx={{ display: loadingScholarships ? "none" : "flex" }}
        >
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

        {!loadingScholarships && perfilIncompleto && (
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

      <TitleBox
        title={C.myDocumentsTitle}
        description={C.documentationSubtitle}
      />

      {!loadingDocuments && !loadingScholarships && perfilIncompleto && (
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
          <Typography variant="body2" sx={{ mt: 1 }}>
            Campos faltantes: {camposPerfilFaltantes.join(", ")}.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <SAEButton
              variant="contained"
              onClick={() => (window.location.href = "/Mi-Perfil")}
            >
              {C.incompleteProfileButton}
            </SAEButton>
          </Box>
        </Box>
      )}
      {/* Sección: Mis Documentos */}
      <Box sx={{ mt: 4, position: "relative" }}>
        {loadingDocuments && (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <SAESpinner size="S" />
          </Stack>
        )}
        {!loadingDocuments && !loadingScholarships && perfilIncompleto && (
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
        <Grid
          container
          spacing={2.5}
          sx={{ mt: 1, display: loadingDocuments ? "none" : "flex" }}
        >
          {documentos.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={item.id_tipo_documento ?? item.id ?? item.nombre}
            >
              <DocumentCard
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
        {!loadingDocuments && hasEconomica && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#123666" }}>
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
                    <DocumentCard
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

      {/* El form recibe documentos y callbacks; Scholarships conserva la fuente de verdad. */}
      <ScholarshipsForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        user={{ ...user, datosPerfil: perfilEstudiante }}
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
        perfilCompleto={!perfilIncompleto}
        camposPerfilFaltantes={camposPerfilFaltantes}
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
          <SAEButton onClick={() => handleDelete(documentoAEliminar)} autoFocus>
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
    </SAEPage>
  );
}
