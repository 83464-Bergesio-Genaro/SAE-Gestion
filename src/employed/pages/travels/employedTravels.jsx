import { useState, useMemo } from "react";
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

import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import LocalAirportIcon from "@mui/icons-material/LocalAirport";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";

import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed"; 
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";
import DocumentPreviewDialog from "../../../assets/components/documents/DocumentPreviewDialog";
import SAEPage from "../../../assets/components/page/SAEPage";

import { digitsOnly } from "../../../utils/text.utils";
import { formatCbu,formatCuit,formatCurrencyInputFromText,parseCurrencyInput,sanitizeCurrencyInput} from "../../../utils/formatters.utils";
import { isValidCbu,isValidCuit, isValidEmail,} from "../../../utils/validation.utils";

import { TravelProvider } from "../../context/providers/travelProvider";
import { useTravel } from "../../context/employedContext";
import { useNotification } from "../../../shared/context/sharedContext";

import { TRAVEL_REQUIRED_DOCUMENTS } from "../../../utils/common/common.config";
import { TRAVEL_STRINGS } from "../../../utils/strings/employed.strings";

const C = TRAVEL_STRINGS;
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

      viajes: {
        title: "Viajes Activos",
        dialog: openCreateTravels,
        addButton: "Nuevo Viaje",
        icon: LocalAirportIcon,
        rows: travelsRows,
        columns: travelsColumns,
        loading: loadingTravels,
      },
       empresas: {
        title: "Empresas",
        dialog: openCreateBussiness,
        addButton: "Nueva Empresa",
        icon: BusinessIcon,
        rows: bussinessRows,
        columns: bussinessColumns,
        loading: loadingBussiness,
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
        header={C.headerTitle}
        title={C.headerMainSubtitle}
        description={C.headerMainDescription}
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
function TravelsHistory(){
  return(
    <Box>
      
    </Box>
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
    contacto:
      Boolean(dialogData.contacto) && !/^\d+$/.test(String(dialogData.contacto))
        ? C.errorPhone
        : "",
    email:
      Boolean(dialogData.email) && !isValidEmail(dialogData.email)
        ? C.errorEmail
        : "",
    cuit:
      Boolean(dialogData.cuit) && !isValidCuit(dialogData.cuit)
        ? C.errorCUIT
        : "",
    cbu:
      Boolean(dialogData.cbu) && !isValidCbu(dialogData.cbu)
        ? C.errorCBU
        : "",
  };
  const hasFieldErrors = Object.values(fieldErrors).some(Boolean);

  const handleSave = () => {
    if (hasFieldErrors) {
      setDialogError(C.errorForm);
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
                label={C.travelID}
                type="number"
                fullWidth
                value={dialogData.id}
                onChange={(e) => handleDialogChange("id", e.target.value)}
                disabled={true}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 9 }} m={0}>
              <SAETextField
                label={C.businessName}
                value={dialogData.nombre}
                onChange={(e) => handleDialogChange("nombre", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12}} m={0}>
              <SAETextField
                label={C.businessPhone}
                value={dialogData.contacto}
                onChange={(e) =>
                  handleDialogChange("contacto", digitsOnly(e.target.value))
                }
                error={Boolean(fieldErrors.contacto)}
                helperText={fieldErrors.contacto}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={C.businessEmail}
                value={dialogData.email}
                onChange={(e) => handleDialogChange("email", e.target.value)}
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={C.businessCUIT}
                value={dialogData.cuit}
                onChange={(e) =>
                  handleDialogChange("cuit", formatCuit(e.target.value))
                }
                error={Boolean(fieldErrors.cuit)}
                helperText={fieldErrors.cuit}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={C.businessCBU}
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
                  dialogData.activo ? C.businessActive: C.businessNoActive
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
          {C.cancel}
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
            ? C.create
            : dialogMode === "delete"
              ? C.delete
              : C.save}
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
          {dialogMode === "create" ? C.travelCreate : C.travelUpdate}
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
                label={C.travelID}
                type="number"
                fullWidth
                value={dialogData.id}
                onChange={(e) => handleDialogChange("id", e.target.value)}
                disabled={true}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }} m={0}>
              <SAETextField
                label={C.travelName}
                value={dialogData.nombre}
                onChange={(e) => handleDialogChange("nombre", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }} m={0}>
              <SAETextField
                label={C.travelCapacity}
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
                label={C.travelStartDate}
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
                label={C.travelEndDate}
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
                <Chip label={C.travelOrigin} size="small" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label={C.travelProvince}
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
                label={C.travelCity}
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
                label={C.travelPlace}
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
                <Chip label={C.travelDestiny} size="small" sx={{ fontWeight: 700 }} />
              </Divider>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }} sx={{ my: 1 }}>
              <SAETextField
                label={C.travelProvince}
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
                label={C.travelCity}
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
                label={C.travelPlace}
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
                  label={C.travelData}
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
                    label={C.travelBusiness}
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
                label={C.travelBudget}
                fullWidth
                value={
                  typeof dialogData.costo_aproximado === "number"
                    ? formatCurrencyInputFromText(dialogData.costo_aproximado)
                    : (dialogData.costo_aproximado ?? "")
                }
                onChange={(e) =>
                  handleDialogChange(
                    "costo_aproximado",
                    sanitizeCurrencyInput(e.target.value),
                  )
                }
                onBlur={(e) =>
                  handleDialogChange(
                    "costo_aproximado",
                    parseCurrencyInput(e.target.value),
                  )
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                  htmlInput: {
                    inputMode: "decimal",
                    placeholder: "9.999.999,99",
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
                label={dialogData.seguro ? C.travelInsurence : C.travelNoInsurence}
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={C.travelMotive}
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
          {C.cancel}
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
            ? C.create
            : dialogMode === "delete"
              ? C.delete
              : C.save}
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
           {C.travelDocs} {docsViaje.nombre}
          </Typography>
          <IconButton onClick={closeDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1} sx={{ pt: 1 }}>
            <Autocomplete
              disablePortal
              options={TRAVEL_REQUIRED_DOCUMENTS}
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
                TRAVEL_REQUIRED_DOCUMENTS.find(
                  (doc) => doc.id === selectedTypeDoc?.id,
                ) || null
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={C.travelRequiredDocs}
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
                    {C.travelChangeDocs}
                  </SAEButton>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SAEButton
                    fullWidth
                    type="button"
                    variant="contained"
                    onClick={() => handleArchivoChange(selectedTypeDoc)}
                  >
                    {C.travelAddDocs}
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
              {C.travelNoDocs}
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
                    <Tooltip title={C.travelShowDocs}>
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewDoc(doc)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={C.travelDownloadDocs}>
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

                    <Tooltip title={C.travelDeleteDocs}>
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
            {C.travelClose}
          </SAEButton>
        </DialogActions>
      </Dialog>
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, p: 4 }}>
          {C.travelDeleteDocs}
        </Typography>

        <DialogContent>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {C.travelWarningMsg}
            {documentoAEliminar?.nombre_documento}
          </Typography>
        </DialogContent>

        <DialogActions>
          <SAEButton
            onClick={() => setOpenPopup(false)}
            autoFocus
            color="outlined"
          >
            {C.cancel}
          </SAEButton>
          <SAEButton
            onClick={() => handleDelete(documentoAEliminar)}
            autoFocus
            color="error"
          >
            {C.delete}
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
            {C.travelLoadDocs} <strong>{travelNewFile.name}</strong>
          </Typography>
        </div>
      ) : (
        <div>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, paddingBottom: "2px" }}
          >
            {C.travelDrop}
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
            {C.travelSearch}
          </SAEButton>
        </div>
      )}
    </div>
  );
}
