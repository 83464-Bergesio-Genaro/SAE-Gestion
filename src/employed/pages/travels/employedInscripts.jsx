import {
  Autocomplete,
  Avatar,
  Box,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";

import { useState, useEffect, useMemo } from "react";
import { TravelProvider } from "../../context/providers/travelProvider";
import { useTravel } from "../../context/employedContext";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import HeaderPageEmployed from "../../../shared/components/HeaderPageEmployed";
import { useNotification } from "../../../shared/context/sharedContext";

import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FolderIcon from "@mui/icons-material/Folder";
import DownloadIcon from "@mui/icons-material/Download";
import { Diversity1 } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import SAEPage from "../../../shared/components/page/SAEPage";
import TitleBox from "../../../shared/components/titleBox";
import { formatDateForDisplay } from "../../../utils/util.jsx";
import { CAREERS } from "../../../utils/juan/constants";

export default function EmployedTravelInscripts() {
  return (
    <TravelProvider>
      <EmployedIncriptsContent />
    </TravelProvider>
  );
}

function EmployedIncriptsContent() {
  const {
    inscriptsTravel,
    loadingInscripts,

    travelData,
    setTravelData,
    fetchInscriptosXTravel,
  } = useTravel();
  const { dialogOpen, dialogType } = useNotification();

  useEffect(() => {
    const saved = localStorage.getItem("selectedTravel");

    if (saved) {
      const parsedData = JSON.parse(saved);
      setTravelData(parsedData);
      fetchInscriptosXTravel(parsedData.id);
    }
  }, [setTravelData, fetchInscriptosXTravel]);

  const headerChips = useMemo(() => {
    if (!travelData) return [];

    const inscriptos = inscriptsTravel?.length ?? 0;
    const cupo = Number(travelData.cantidad_personas) || 0;
    const cupoExcedido = cupo > 0 && inscriptos > cupo;

    return [
      {
        label: travelData.seguro ? "Tiene Seguro" : "Falta Seguro",
        bgcolor: travelData.seguro
          ? "rgba(76,175,80,0.28)"
          : "rgba(211,47,47,0.55)",
        border: "1px solid rgba(255,255,255,0.4)",
      },
      {
        label: `${inscriptos}/${travelData.cantidad_personas}`,
        bgcolor: cupoExcedido
          ? "rgba(207, 80, 61, 0.55)"
          : "rgba(75, 107, 188, 0.55)",
        border: "1px solid rgba(255,255,255,0.4)",
      },
    ];
  }, [inscriptsTravel?.length, travelData]);

  return (
    <SAEPage>
      {travelData && (
        <>
          <HeaderPageEmployed
            header="Gestion de Inscriptos"
            title={travelData.nombre}
            description={`Del ${formatDateForDisplay(travelData.fecha_inicio)} hasta ${formatDateForDisplay(travelData.fecha_fin)}`}
            backgroundImage="images/varias/campus.jpg"
            backTo="/Gestion-Viajes"
            chips={headerChips}
            showUserChips={false}
          />
          <Grid container spacing={1}>
            <Grid size={{ xs: 12 }} mt={2}>
              <StudentSearchCard />
              <TitleBox title="Planilla de Inscriptos" />

              <Card
                sx={{
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: "0 18px 45px rgba(188, 188, 188, 0.08)",
                  mb: 3,
                  overflow: "hidden",
                  p: 4,
                }}
              >
                {loadingInscripts && (
                  <Stack alignItems="center" width={"100%"} gap={1}>
                    <SAESpinner size="S" />
                  </Stack>
                )}
                <Box>
                  {!loadingInscripts &&
                    inscriptsTravel &&
                    inscriptsTravel.length === 0 && (
                      <Stack alignItems="center" width={"100%"} gap={1}>
                        <Typography variant="body2" noWrap>
                          Sin Inscriptos
                        </Typography>
                      </Stack>
                    )}
                  {!loadingInscripts && inscriptsTravel.length > 0 && (
                    <Stack direction={"column"} spacing={1}>
                      {inscriptsTravel.map((d, i) => (
                        <InscriptosCard datosEstudiante={d} key={i} />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
          {dialogOpen && dialogType === "inscript" && <InscriptDeleteDialog />}
        </>
      )}
      {dialogOpen && dialogType === "documents" && <DocumentsDialog />}
    </SAEPage>
  );
}

function StudentSearchCard() {
  const [legajoSearch, setLegajoSearch] = useState("");
  const [careerSearch, setCareerSearch] = useState("");
  const {
    usuarioSelected,
    setUsuarioSelected,
    loadingUsuario,
    fetchUsuariosXlegajo,
    handleAddIncriptos,
  } = useTravel();
  const { dialogError, setDialogError } = useNotification();

  const normalizedLegajo = legajoSearch.trim();
  const canSearch =
    normalizedLegajo.length > 0 && careerSearch.length > 0 && !loadingUsuario;

  const handleSearch = () => {
    if (!normalizedLegajo) {
      setDialogError("Ingresa un legajo para buscar.");
      return;
    }

    if (!careerSearch) {
      setDialogError("Selecciona una carrera para buscar.");
      return;
    }

    setDialogError("");
    fetchUsuariosXlegajo(`${normalizedLegajo}@${careerSearch}.frc.utn.edu.ar`);
  };

  const handleAddStudent = async () => {
    await handleAddIncriptos();
    setLegajoSearch("");
    setCareerSearch("");
    setDialogError("");
  };

  const handleClear = () => {
    setUsuarioSelected(null);
    setLegajoSearch("");
    setCareerSearch("");
    setDialogError("");
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
        mb: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ color: "black", py: 3, px: { xs: 2.5, md: 4 } }}>
        <Typography
          sx={{
            mb: 2,
            fontWeight: "bold",
            fontSize: { xs: 16, md: 18 },
            opacity: 0.98,
          }}
        >
          Buscar estudiante para agregar
        </Typography>

        {dialogError && !usuarioSelected && (
          <Alert
            severity="warning"
            onClose={() => setDialogError("")}
            sx={{ mb: 2 }}
          >
            {dialogError}
          </Alert>
        )}

        {!usuarioSelected ? (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ md: "flex-start" }}
          >
            <SAETextField
              label="Legajo"
              value={legajoSearch}
              onChange={(event) => {
                setLegajoSearch(event.target.value.replace(/\D/g, ""));
                if (dialogError) setDialogError("");
              }}
              fullWidth
              disabled={loadingUsuario}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearch();
              }}
              helperText="Sin @ ni dominio."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {loadingUsuario && (
                      <CircularProgress size={22} color="inherit" />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <Typography
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                lineHeight: { md: "56px" },
                display: { xs: "none", md: "block" },
              }}
            >
              @
            </Typography>
            <Autocomplete
              options={CAREERS}
              value={
                CAREERS.find((career) => career.value === careerSearch) ?? null
              }
              onChange={(_event, career) => {
                setCareerSearch(career?.value ?? "");
                if (dialogError) setDialogError("");
              }}
              getOptionLabel={(career) => career.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              disabled={loadingUsuario}
              fullWidth
              renderInput={(params) => (
                <SAETextField
                  {...params}
                  label="Carrera"
                  helperText="Selecciona el dominio de la carrera."
                />
              )}
            />
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ minHeight: { md: 56 } }}
            >
              <Typography
                color="text.secondary"
                fontWeight={700}
                whiteSpace="nowrap"
                sx={{ display: { xs: "none", md: "block" } }}
              >
                .frc.utn.edu.ar
              </Typography>
              <IconButton
                onClick={handleSearch}
                disabled={!canSearch}
                aria-label="Buscar estudiante"
              >
                <SearchIcon />
              </IconButton>
            </Stack>
          </Stack>
        ) : (
          <Box
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={700}
            >
              Usuario seleccionado
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              {usuarioSelected.nombre_usuario}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Legajo {usuarioSelected.legajo}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} mt={2} spacing={1.5}>
              <SAEButton
                variant="contained"
                size="small"
                onClick={handleAddStudent}
              >
                Agregar estudiante
              </SAEButton>
              <SAEButton
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleClear}
              >
                Volver a buscar
              </SAEButton>
            </Stack>
          </Box>
        )}
      </Box>
    </Card>
  );
}
function InscriptDeleteDialog() {
  const { handleDeleteInscript } = useTravel();
  const {
    dialogOpen,
    dialogMode,
    dialogSaving,
    dialogError,
    setDialogError,
    closeDialog,
  } = useNotification();

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {dialogMode === "documentacion"
            ? "Documentacion del Inscripto"
            : "Eliminar Inscripcion"}
        </Typography>
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
          {dialogMode === "delete" && (
            <>
              <Typography
                variant="subtitle2"
                color="textPrimary"
                fontWeight={600}
              >
                ATENCION
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Esta a punto de eliminar este inscripto de la lista del viaje.
                Si esta persona subio documentacion relacionada, se mantendra a
                menos que se elimine de manera particular.
              </Typography>
              <Typography
                mt={2}
                variant="body2"
                color="textSecondary"
                textAlign="center"
                fontWeight="bold"
              >
                ¿Quiere continuar?
              </Typography>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SAEButton
          variant="outlined"
          onClick={closeDialog}
          disabled={dialogSaving}
        >
          Cancelar
        </SAEButton>
        {dialogMode === "delete" && (
          <SAEButton
            variant="contained"
            color="error"
            onClick={handleDeleteInscript}
            disabled={dialogSaving}
            startIcon={
              dialogSaving ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
          >
            Eliminar
          </SAEButton>
        )}
      </DialogActions>
    </Dialog>
  );
}

function DocumentsDialog() {
  const {
    downloadingDocId,
    handlePreviewDoc,
    handleDownloadDoc,
    previewOpen,
    setPreviewOpen,
    previewTitle,
    previewSrc,
    previewIsPdf,
    loadingPreview,
    previewError,
    previewDocRef,
    openPopup,
    setOpenPopup,
    documentoAEliminar,
    requestDeleteDocument,
    handleDelete,
    docsInscript,
    loadingInscriptDocs,
    setSeletedInscripts,
  } = useTravel();
  const { dialogOpen, dialogError, closeDialog } = useNotification();

  const handleClose = () => {
    setSeletedInscripts(null);
    closeDialog();
  };

  return (
    <>
      <DocumentPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={previewTitle}
        imageSrc={previewSrc}
        isPdf={previewIsPdf}
        loading={loadingPreview}
        error={previewError}
        onDownload={() =>
          previewDocRef &&
          handleDownloadDoc(
            previewDocRef.id,
            previewDocRef.nombre_documento,
            previewDocRef.extension,
          )
        }
      />

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            Documentación — {/*seletedInscripts.nombre_estudiante*/}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && <Alert severity="error">{dialogError}</Alert>}
          {loadingInscriptDocs && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <SAESpinner size="S" />
            </Box>
          )}

          {!loadingInscriptDocs && docsInscript.length === 0 && (
            <Typography
              color="text.secondary"
              sx={{ py: 2, textAlign: "center" }}
            >
              No hay documentación disponible de este viaje.
            </Typography>
          )}
          {!loadingInscriptDocs && docsInscript.length > 0 && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              {docsInscript.map((doc, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {doc.nombre_documento.replace(/_/g, " ")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.extension?.toUpperCase()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Ver Documentos">
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewDoc(doc)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Descargar">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDownloadDoc(
                            doc.id,
                            doc.nombre_documento,
                            doc.extension,
                          )
                        }
                        disabled={downloadingDocId === doc.id}
                      >
                        {downloadingDocId === doc.id ? (
                          <CircularProgress size={18} />
                        ) : (
                          <DownloadIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => requestDeleteDocument(doc)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton variant="outlined" onClick={handleClose}>
            Cerrar
          </SAEButton>
        </DialogActions>
      </Dialog>
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, p: 4 }}>
          EliminarDocumento
        </Typography>

        <DialogContent>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            "Esta seguro que quiere eliminar el documento: "{" "}
            {documentoAEliminar?.nombre_documento}
          </Typography>
        </DialogContent>

        <DialogActions>
          <SAEButton
            onClick={() => setOpenPopup(false)}
            autoFocus
            color="outlined"
          >
            Cancelar
          </SAEButton>
          <SAEButton
            onClick={() => handleDelete(documentoAEliminar)}
            autoFocus
            color="error"
          >
            Eliminar
          </SAEButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
function InscriptosCard({ datosEstudiante }) {
  const [loadingCard, setLoadingCard] = useState(false);
  const [estudiante, SetDatosEstudiante] = useState(datosEstudiante);

  const { handleUpdateInscriptos, handleClickRemove, openSeeDocInscript } =
    useTravel();
  const handleInscriptosChange = async (field, value) => {
    const updatedStudent = { ...estudiante, [field]: value };
    SetDatosEstudiante(updatedStudent);
    setLoadingCard(true);
    await handleUpdateInscriptos(updatedStudent);
    setLoadingCard(false);
  };

  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        boxShadow: "none",
        transition: ".2s",
        "&:hover": {
          borderColor: "#1976d2",
          boxShadow: "0 4px 12px rgba(25,118,210,.15)",
        },
      }}
    >
      <CardContent>
        {loadingCard && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(255, 255, 255, 0.7)", // Fondo blanco semitransparente
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2, //
              borderRadius: 3,
              backdropFilter: "blur(2px)",
            }}
          >
            <SAESpinner size="S" />
          </Box>
        )}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "#E3F2FD",
                color: "#1976d2",
              }}
            >
              <Diversity1 />
            </Avatar>

            <Box>
              <Typography fontWeight={600}>
                {estudiante.nombre_estudiante}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Legajo {estudiante.legajo_estudiante}
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction={{ xs: "row", md: "row" }}
            spacing={{ xs: 0, md: 4 }}
            alignItems="center"
          >
            <Switch
              checked={estudiante.documentacion_presentada}
              onChange={(e) =>
                handleInscriptosChange(
                  "documentacion_presentada",
                  e.target.checked,
                )
              }
              color="primary"
            />
            <Chip
              color={estudiante.documentacion_presentada ? "success" : "error"}
              sx={{
                width: { xs: 80, md: 200 },
                fontWeight: "bold",
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "100%", // Asegura que el contenedor use todo el espacio
                  textAlign: "center", // Centra el texto dentro del chip
                },
              }}
              label={
                <>
                  <Box
                    component="span"
                    sx={{ display: { xs: "block", md: "none" } }}
                  >
                    {estudiante.documentacion_presentada
                      ? "Correcto"
                      : "A Revisar"}
                  </Box>
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", md: "block" } }}
                  >
                    {estudiante.documentacion_presentada
                      ? "Documentación Revisada"
                      : "Documentación no Revisada"}
                  </Box>
                </>
              }
            />
            <Tooltip title="Ver documentación">
              <IconButton onClick={() => openSeeDocInscript(estudiante)}>
                <FolderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar inscripción">
              <IconButton
                onClick={() => handleClickRemove(estudiante)}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
