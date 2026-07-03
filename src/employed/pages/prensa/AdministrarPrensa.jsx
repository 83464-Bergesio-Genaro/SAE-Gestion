import {
  Alert,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Chip,
  InputAdornment,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useMemo } from "react";

import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAESwitch from "../../../shared/components/buttons/SAESwitch";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { PRENSA_STRINGS } from "./prensa.strings";
import { PRIORIDAD_OPTIONS, getTipoDocumento } from "./prensa.utils";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import NewsPreviewDialog from "../../../shared/components/StudentNews/NewsPreviewDialog";
import SchoolIcon from "@mui/icons-material/School";
import SAEDataGrid from "../../../shared/components/datagrid/SAEDataGrid";
import { useNotification } from "../../../shared/context/sharedContext";
import { usePress } from "../../context/employedContext";
import { PressProvider } from "../../context/providers/pressProvider";
import SAEPage from "../../../shared/components/page/SAEPage";
import SAEDeleteDialog from "../../../shared/components/popUp/SAEDeleteDialog";

const PSN = PRENSA_STRINGS.nueva;

export default function AdministrarPrensa() {
  return (
    <PressProvider>
      <AdministrarPrensaContent />
    </PressProvider>
  );
}

function AdministrarPrensaContent() {
  const {
    openCreatePublication,
    rows,
    columns,
    loading,
    selectedPub,
    handleClose,
    loadingDocs,
    documentos,
    handleOpenPreview,
    previewOpen,
    handleClosePreview,
    previewDoc,
    previewDocName,
    previewLoading,
    previewError,
    getImageSource,
    getDocumentName,
    getDocumentExtension,
  } = usePress();

  const activeSection = "publicaciones";
  const sectionConfig = useMemo(
    () => ({
      publicaciones: {
        key: "publicaciones",
        title: "Publicaciones",
        addButton: "Nueva Publicacion",
        icon: SchoolIcon,
        rows,
        columns,
        loading,
        dialog: openCreatePublication,
      },
    }),
    [columns, loading, openCreatePublication, rows],
  );
  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );
  return (
    <SAEPage>
      <HeaderPageEmployed
        header=" Módulo de Prensa"
        title="Gestión de Publicaciones"
        description="Permite gestionar las publicaciones en el módulo de prensa"
      />
      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={currentSection}
      />

      <NuevaPublicacionDialog />

      <NewsPreviewDialog
        open={!!selectedPub}
        onClose={handleClose}
        title={selectedPub?.titulo_publicacion}
        date={
          selectedPub?.fecha_inicio
            ? new Date(selectedPub.fecha_inicio).toLocaleDateString("es-AR")
            : ""
        }
        description={selectedPub?.descripcion}
        documents={loadingDocs ? [] : documentos}
        onPreviewDocument={handleOpenPreview}
      />

      <DocumentPreviewDialog
        open={previewOpen}
        onClose={handleClosePreview}
        title={getDocumentName(previewDoc, previewDocName)}
        imageSrc={previewDoc ? getImageSource(previewDoc) : ""}
        isPdf={getDocumentExtension(previewDoc) === "pdf"}
        loading={previewLoading}
        error={previewError}
      />

      <DialogPress />
    </SAEPage>
  );
}

function NuevaPublicacionDialog() {
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

  const {
    docMode,
    archivo,
    busquedaDoc,
    page,
    loadingDocs,
    docSeleccionado,
    docsFiltrados,
    docsPaginados,
    totalPages,
    preview,
    handleDocModeChange,
    setArchivo,
    setDocSeleccionado,
    setBusquedaDoc,
    setPage,
    handlePreview,
    closePreview,
    handleSavePublication,
  } = usePress();
  const open = dialogOpen && dialogType === "pressPublication";
  const nuevaData = dialogData;
  const saving = dialogSaving;
  const isEdit = dialogMode === "edit";

  return (
    <>
      <Dialog open={open} onClose={closeDialog} maxWidth="xl" fullWidth>
        {nuevaData && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {isEdit ? PSN.editTitle : PSN.title}
              </Typography>
              <IconButton onClick={closeDialog} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: "16px !important",
              }}
            >
              {dialogError && (
                <Alert severity="error" onClose={() => setDialogError("")}>
                  {dialogError}
                </Alert>
              )}

              <Divider>
                <Chip label={PSN.sectionDatos} size="small" />
              </Divider>
              <SAETextField
                label={PSN.fieldTitle}
                value={nuevaData.titulo_publicacion}
                onChange={(event) =>
                  handleDataChange("titulo_publicacion", event.target.value)
                }
                fullWidth
              />
              <SAETextField
                label={PSN.fieldDescription}
                value={nuevaData.descripcion}
                onChange={(event) =>
                  handleDataChange("descripcion", event.target.value)
                }
                multiline
                rows={3}
                fullWidth
              />

              <Divider>
                <Chip label={PSN.sectionVigencia} size="small" />
              </Divider>
              <Box sx={{ display: "flex", gap: 2 }}>
                <SAETextField
                  label={PSN.fieldStartDate}
                  type="date"
                  value={nuevaData.fecha_inicio}
                  onChange={(event) =>
                    handleDataChange("fecha_inicio", event.target.value)
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
                <SAETextField
                  label={PSN.fieldEndDate}
                  type="date"
                  value={nuevaData.fecha_vigencia}
                  onChange={(event) =>
                    handleDataChange("fecha_vigencia", event.target.value)
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />
              </Box>
              <FormControlLabel
                control={
                  <SAESwitch
                    size="small"
                    checked={nuevaData.no_dar_baja}
                    onChange={(event) =>
                      handleDataChange("no_dar_baja", event.target.checked)
                    }
                  />
                }
                label={PSN.fieldNoDarBaja}
              />

              <Divider>
                <Chip label={PSN.sectionPrioridad} size="small" />
              </Divider>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {PRIORIDAD_OPTIONS.map((option) => {
                  const selected =
                    option.value === nuevaData.prioridad ||
                    (option.value === 0 &&
                      ![1, 2].includes(nuevaData.prioridad));
                  return (
                    <Chip
                      key={option.value}
                      label={option.label}
                      color={selected ? option.chipColor : "default"}
                      variant={selected ? "filled" : "outlined"}
                      onClick={() =>
                        handleDataChange("prioridad", option.value)
                      }
                      sx={{ cursor: "pointer" }}
                    />
                  );
                })}
              </Box>

              <Divider>
                <Chip label={PSN.sectionDocumentos} size="small" />
              </Divider>
              <Tabs
                centered
                value={docMode}
                onChange={(_event, value) => handleDocModeChange(value)}
              >
                <Tab value="subir" label={PSN.tabUpload} />
                <Tab value="existente" label={PSN.tabExisting} />
              </Tabs>

              {docMode === "subir" ? (
                <SAEButton
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  {archivo ? archivo.name : PSN.attachButton}
                  <input
                    type="file"
                    hidden
                    onChange={(event) =>
                      setArchivo(event.target.files?.[0] || null)
                    }
                  />
                </SAEButton>
              ) : (
                <Box>
                  <SAETextField
                    placeholder={PSN.searchDocPlaceholder}
                    value={busquedaDoc}
                    onChange={(event) => {
                      setBusquedaDoc(event.target.value);
                      setPage(1);
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TableContainer
                    component={Paper}
                    variant="outlined"
                    sx={{ maxHeight: 245 }}
                  >
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox" />
                          <TableCell>{PSN.tableColName}</TableCell>
                          <TableCell>{PSN.tableColType}</TableCell>
                          <TableCell align="center">
                            {PSN.tableColView}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loadingDocs ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <CircularProgress size={20} />
                            </TableCell>
                          </TableRow>
                        ) : docsPaginados.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              {PSN.noDocuments}
                            </TableCell>
                          </TableRow>
                        ) : (
                          docsPaginados.map((document) => (
                            <TableRow
                              key={document.id}
                              hover
                              selected={docSeleccionado === document.id}
                              onClick={() =>
                                setDocSeleccionado(document.id)
                              }
                              sx={{ cursor: "pointer" }}
                            >
                              <TableCell padding="checkbox">
                                <Radio
                                  checked={docSeleccionado === document.id}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                {document.nombre_documento}
                              </TableCell>
                              <TableCell>
                                {getTipoDocumento(document)}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handlePreview(
                                      document.id,
                                      document.nombre_documento,
                                    );
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {docsFiltrados.length > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption">
                        {PSN.docCount(docsFiltrados.length)}
                      </Typography>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_event, value) => setPage(value)}
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <SAEButton
                variant="outlined"
                onClick={closeDialog}
                disabled={saving}
              >
                Cancelar
              </SAEButton>
              <SAEButton
                variant="contained"
                onClick={handleSavePublication}
                disabled={saving}
              >
                {saving ? PSN.saving : PSN.saveButton}
              </SAEButton>
            </DialogActions>
          </>
        )}
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
    </>
  );
}

function DialogPress() {
  const { handleDeleteConfirm } = usePress();
  const {
    dialogOpen,
    dialogData,
    dialogType,
    dialogMode,
    dialogError,
    dialogSaving,
    setDialogError,
    closeDialog,
  } = useNotification();

  const deleteDialogConfig = {
    pressPublicationDelete: {
      entityLabel: "Publicación",
      itemName: dialogData?.titulo_publicacion,
      onConfirm: handleDeleteConfirm,
    },
  };

  if (dialogOpen && dialogMode === "delete") {
    const config = deleteDialogConfig[dialogType];

    return config ? (
    <SAEDeleteDialog
      open={dialogOpen}
      entityLabel={config.entityLabel}
      itemName={config.itemName}
      itemId={dialogData?.id}
      onConfirm={config.onConfirm}
      onClose={closeDialog}
      loading={dialogSaving}
      error={dialogError}
      onClearError={() => setDialogError("")}
    />
    ) : null;
  }

  return null;
}
