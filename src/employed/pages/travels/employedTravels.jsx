import {
  Autocomplete,
  Box,
  Grid,
  Stack,
  Typography,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  InputAdornment,
  Switch,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";

import { useState, useMemo } from "react";
import { TravelProvider } from "../../context/providers/travelProvider";
import { useTravel } from "../../context/employedContext";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import HeaderPageEmployed from "../../../shared/components/HeaderPageEmployed";
import SAEDataGrid from "../../../shared/components/datagrid/SAEDataGrid";
import { useNotification } from "../../../shared/context/sharedContext";

import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";

import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import SAEPage from "../../../shared/components/page/SAEPage";
import { isValidEmail } from "../../../utils/util.jsx";
import {
  formatCbu,
  formatCuit,
  isValidCbu,
  isValidCuit,
} from "../../../utils/juan/util";

const TRAVELS_REQUIRED_DOCUMENTS = [
  {
    id: 3,
    nombre: "Listado de Estudiantes Viajantes",
    extension: ".xlsx",
  },
  {
    id: 4,
    nombre: "Nota de Viaje Plantilla",
    extension: ".docx",
  },
  {
    id: 5,
    nombre: "Nota de Viaje Cargada",
    extension: ".pdf",
  },
  {
    id: 6,
    nombre: "Informe Tecnico Viaje",
    extension: ".pdf",
  },
];

export default function EmployedTravels() {
  return (
    <TravelProvider>
      <EmployedTravelsContent />
    </TravelProvider>
  );
}

function EmployedTravelsContent() {
  const {
    bussinessRows,
    loadingBussiness,
    bussinessColumns,
    openCreateBussiness,

    travelsRows,
    loadingTravels,
    travelsColumns,
    openCreateTravels,
  } = useTravel();
  const { dialogOpen, dialogType } = useNotification();

  const sectionConfig = useMemo(
    () => ({
      empresas: {
        title: "Empresas",
        dialog: openCreateBussiness,
        addButton: "Nueva Empresa",
        icon: BusinessIcon,
        rows: bussinessRows,
        columns: bussinessColumns,
        loading: loadingBussiness,
      },
      viajes: {
        title: "Viajes Activos",
        dialog: openCreateTravels,
        addButton: "Nuevo Viaje",
        icon: LocalAirportIcon,
        rows: travelsRows,
        columns: travelsColumns,
        loading: loadingTravels,
      },
    }),
    [
      bussinessRows,
      bussinessColumns,
      loadingBussiness,
      travelsRows,
      travelsColumns,
      loadingTravels,
      openCreateBussiness,
      openCreateTravels,
    ],
  );
  const [activeSection, setActiveSection] = useState("viajes");
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <SAEPage>
      <HeaderPageEmployed
        header=" Módulo de Viajes"
        title="Gestión de los viajes"
        description="En este módulo podrás gestionar los viajes de la empresa, incluyendo la creación, edición de las empresa como la gestión de los inscriptos y la documentación relacionada."
      />
      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      {dialogOpen && dialogType === "bussiness" && <BussinessDialog />}
      {dialogOpen && dialogType === "travels" && <TravelsDialog />}
      {dialogOpen && dialogType === "documents" && <DocumentsDialog />}
    </SAEPage>
  );
}

function BussinessDialog() {
  const { handleBussinessSave } = useTravel();
  const {
    dialogOpen,
    dialogMode,
    dialogData,
    dialogSaving,
    dialogError,
    setDialogError,
    handleDataChange,
    closeDialog,
  } = useNotification();

  const handleDialogChange = (field, value) => {
    handleDataChange(field, value);
  };

  const fieldErrors = {
    email:
      Boolean(dialogData.email) && !isValidEmail(dialogData.email)
        ? "Ingresá un email válido."
        : "",
    cuit:
      Boolean(dialogData.cuit) && !isValidCuit(dialogData.cuit)
        ? "Ingresá un CUIT válido de 11 dígitos."
        : "",
    cbu:
      Boolean(dialogData.cbu) && !isValidCbu(dialogData.cbu)
        ? "El CBU debe tener 22 dígitos."
        : "",
  };
  const hasFieldErrors = Object.values(fieldErrors).some(Boolean);

  const handleSave = () => {
    if (hasFieldErrors) {
      setDialogError("Revisá los campos marcados antes de guardar.");
      return;
    }

    handleBussinessSave();
  };

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
          {dialogMode === "create" ? "Nueva Empresa" : "Editar Empresa"}
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
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 3 }} m={0}>
              <SAETextField
                label="ID"
                type="number"
                fullWidth
                value={dialogData.id}
                onChange={(e) => handleDialogChange("id", e.target.value)}
                disabled={true}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 9 }} m={0}>
              <SAETextField
                label="Nombre Empresa"
                value={dialogData.nombre}
                onChange={(e) => handleDialogChange("nombre", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <SAETextField
                label="Telefono"
                value={dialogData.contacto}
                onChange={(e) => handleDialogChange("contacto", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <SAETextField
                label="Email"
                value={dialogData.email}
                onChange={(e) => handleDialogChange("email", e.target.value)}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <SAETextField
                label="Cuit"
                value={dialogData.cuit}
                onChange={(e) =>
                  handleDialogChange("cuit", formatCuit(e.target.value))
                }
                error={Boolean(fieldErrors.cuit)}
                helperText={fieldErrors.cuit}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <SAETextField
                label="CBU"
                value={dialogData.cbu}
                onChange={(e) =>
                  handleDialogChange("cbu", formatCbu(e.target.value))
                }
                error={Boolean(fieldErrors.cbu)}
                helperText={fieldErrors.cbu}
                fullWidth
              />
            </Grid>
            {dialogMode === "edit" && (
              <FormControlLabel
                control={
                  <Switch
                    checked={dialogData.activo}
                    onChange={(e) =>
                      handleDialogChange("activo", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={
                  dialogData.activo ? "Empresa Activa" : "Empresa NO activa"
                }
              />
            )}
          </Grid>
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
        <SAEButton
          variant="contained"
          onClick={handleSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {dialogMode === "create"
            ? "Crear"
            : dialogMode === "delete"
              ? "Eliminar"
              : "Guardar"}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}

function TravelsDialog() {
  const { bussiness, handleTravelSave } = useTravel();
  const {
    dialogOpen,
    dialogMode,
    dialogData,
    dialogSaving,
    dialogError,
    setDialogError,
    handleDataChange,
    closeDialog,
  } = useNotification();

  const handleDialogChange = (field, value) => {
    handleDataChange(field, value);
  };

  const sanitizeAddressPart = (value = "") =>
    value.replace(/\s*-\s*/g, " ").replace(/\s{2,}/g, " ");

  const parseAddress = (value = "") => {
    const parts = String(value)
      .split("-")
      .map((part) => part.trim());
    return [parts[0] || "", parts[1] || "", parts[2] || ""];
  };

  const handleAddressChange = (index, value, dataName) => {
    const parts = parseAddress(dialogData[dataName]);
    parts[index] = sanitizeAddressPart(value);
    const hasAddressData = parts.some((part) => part.trim() !== "");
    handleDialogChange(dataName, hasAddressData ? parts.join(" - ") : "");
  };

  const addressPartsOrigin = parseAddress(dialogData.origen);
  const addressPartsDestiny = parseAddress(dialogData.destino);

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {dialogMode === "create" ? "Nuevo Viaje" : "Editar Viaje"}
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
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 2 }} m={0}>
              <SAETextField
                label="ID"
                type="number"
                fullWidth
                value={dialogData.id}
                onChange={(e) => handleDialogChange("id", e.target.value)}
                disabled={true}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }} m={0}>
              <SAETextField
                label="Nombre del Viaje"
                value={dialogData.nombre}
                onChange={(e) => handleDialogChange("nombre", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }} m={0}>
              <SAETextField
                label="Cupo"
                type="number"
                fullWidth
                value={dialogData.cantidad_personas}
                onChange={(e) =>
                  handleDialogChange("cantidad_personas", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} my={1}>
              <SAETextField
                label="Fecha de Inicio"
                type="date"
                value={dialogData.fecha_inicio}
                onChange={(e) =>
                  handleDialogChange("fecha_inicio", e.target.value)
                }
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} my={1}>
              <SAETextField
                label="Fecha Vuelta"
                type="date"
                value={dialogData.fecha_fin}
                onChange={(e) =>
                  handleDialogChange("fecha_fin", e.target.value)
                }
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider variant="middle" sx={{ my: 2 }}>
                <Chip label="Origen" size="small" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label="Pais/Provincia"
                fullWidth
                value={addressPartsOrigin[0]}
                onChange={(e) =>
                  handleAddressChange(0, e.target.value, "origen")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 50 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label="Ciudad / Localidad"
                fullWidth
                value={addressPartsOrigin[1]}
                onChange={(e) =>
                  handleAddressChange(1, e.target.value, "origen")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 60 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label="Complejo / Ubicacion"
                fullWidth
                value={addressPartsOrigin[2]}
                onChange={(e) =>
                  handleAddressChange(2, e.target.value, "origen")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider variant="middle" sx={{ my: 2 }}>
                <Chip label="Destino" size="small" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label="Pais/Provincia"
                fullWidth
                value={addressPartsDestiny[0]}
                onChange={(e) =>
                  handleAddressChange(0, e.target.value, "destino")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 50 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label="Ciudad / Localidad"
                fullWidth
                value={addressPartsDestiny[1]}
                onChange={(e) =>
                  handleAddressChange(1, e.target.value, "destino")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 60 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label="Complejo / Ubicacion"
                fullWidth
                value={addressPartsDestiny[2]}
                onChange={(e) =>
                  handleAddressChange(2, e.target.value, "destino")
                }
                InputLabelProps={{ shrink: true }}
                slotProps={{ htmlInput: { maxLength: 80 } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider variant="middle" sx={{ my: 2 }}>
                <Chip
                  label="Datos del Viaje"
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} m={0}>
              <Autocomplete
                disablePortal
                options={bussiness}
                getOptionLabel={(option) => option.nombre}
                onChange={(event, newValue) => {
                  handleDialogChange(
                    "id_empresa_viaje",
                    newValue ? newValue.id : null,
                  );
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={
                  bussiness.find(
                    (buss) => buss.id === dialogData.id_empresa_viaje,
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Empresa"
                    inputProps={{
                      ...params.inputProps,
                      readOnly: true,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} m={0}>
              <SAETextField
                label="Presupuesto"
                type="number"
                fullWidth
                value={dialogData.costo_aproximado}
                onChange={(e) =>
                  handleDialogChange("costo_aproximado", e.target.value)
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                  htmlInput: {
                    inputMode: "decimal",
                    placeholder: "99.999,99",
                  },
                }}
              />
            </Grid>
            <Grid sx={{ display: "flex" }} size={{ xs: 12, md: 3 }} m={0}>
              <FormControlLabel
                control={
                  <Switch
                    checked={dialogData.seguro || false}
                    onChange={(e) =>
                      handleDialogChange("seguro", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={dialogData.seguro ? "Tiene Seguro" : "Sin Seguro"}
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label="Motivo"
                value={dialogData.motivo}
                onChange={(e) => handleDialogChange("motivo", e.target.value)}
                fullWidth
                rows={2}
                multiline
              />
            </Grid>
          </Grid>
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
        <SAEButton
          variant="contained"
          onClick={handleTravelSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {dialogMode === "create"
            ? "Crear"
            : dialogMode === "delete"
              ? "Eliminar"
              : "Guardar"}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}

//Lo separe para que me sea mas coherente de programar
function DocumentsDialog() {
  const {
    docsViaje,
    docsViajeList,
    loadingViajeDocs,
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
    travelNewFile,
    handleArchivoChange,
    fileInputRef,
    selectedTypeDoc,
    setTypeDoc,
  } = useTravel();
  const { dialogOpen, dialogError, closeDialog } = useNotification();

  const handleComboChange = (field, value) => {
    setTypeDoc((prev) => ({ ...prev, [field]: value }));
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
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

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            Documentación — {docsViaje.nombre}
          </Typography>
          <IconButton onClick={closeDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1} sx={{ pt: 1 }}>
            <Autocomplete
              disablePortal
              options={TRAVELS_REQUIRED_DOCUMENTS}
              getOptionLabel={(option) => option.nombre}
              onChange={(event, newValue) => {
                // 'newValue' es el objeto completo del perfil seleccionado (o null)
                if (newValue) {
                  handleComboChange("id", newValue.id);
                } else {
                  // Maneja el caso de que se borre la selección
                  handleComboChange("id", null);
                }
              }}
              // Asegura que la comparación se haga por id
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={
                TRAVELS_REQUIRED_DOCUMENTS.find(
                  (doc) => doc.id === selectedTypeDoc?.id,
                ) || null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Documento a Cargar"
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true, // Esto evita la escritura
                  }}
                />
              )}
            />
            {selectedTypeDoc && <FileDropZone />}

            {selectedTypeDoc && travelNewFile && (
              <Grid
                container
                direction={{ xs: "column", md: "row" }}
                spacing={1}
              >
                <Grid size={{ xs: 12, md: 6 }}>
                  <SAEButton
                    fullWidth
                    color="secondary"
                    variant="contained"
                    onClick={handleButtonClick}
                  >
                    Cambiar archivo
                  </SAEButton>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SAEButton
                    fullWidth
                    type="button"
                    variant="contained"
                    onClick={() => handleArchivoChange(selectedTypeDoc)}
                  >
                    Agregar Archivo
                  </SAEButton>
                </Grid>
              </Grid>
            )}
          </Stack>
        </DialogContent>
        <DialogContent dividers>
          {dialogError && <Alert severity="error">{dialogError}</Alert>}
          {loadingViajeDocs && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <SAESpinner size="S" />
            </Box>
          )}

          {!loadingViajeDocs && docsViajeList.length === 0 && (
            <Typography
              color="text.secondary"
              sx={{ py: 2, textAlign: "center" }}
            >
              No hay documentación disponible de este viaje.
            </Typography>
          )}
          {!loadingViajeDocs && docsViajeList.length > 0 && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              {docsViajeList.map((doc, index) => (
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
          <SAEButton variant="outlined" onClick={closeDialog}>
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
function FileDropZone() {
  const [isOver, setIsOver] = useState(false);
  const { travelNewFile, setTravelNewFile, fileInputRef } = useTravel();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setTravelNewFile(droppedFiles[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      setTravelNewFile(selectedFiles[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: isOver ? "2px dashed #4CAF50" : "2px dashed #ccc",
        backgroundColor: isOver ? "#e8f5e9" : "#fafafa",
        padding: "14px 0px",
        textAlign: "center",
        borderRadius: "8px",
        transition: "all 0.2s ease",
      }}
    >
      {/* INPUT OCULTO: Hace el trabajo duro por detrás */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {travelNewFile ? (
        <div>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            ✅Cargado: <strong>{travelNewFile.name}</strong>
          </Typography>
        </div>
      ) : (
        <div>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, paddingBottom: "2px" }}
          >
            Arrastra tu archivo aquí 📄
            <br />o
          </Typography>
          <SAEButton
            type="button"
            variant="contained"
            onClick={handleButtonClick}
            sx={{
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Buscar Archivo
          </SAEButton>
        </div>
      )}
    </div>
  );
}
