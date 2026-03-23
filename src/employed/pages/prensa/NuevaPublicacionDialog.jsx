import {
  Box,
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
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAESwitch from "../../../shared/components/buttons/SAESwitch";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import { PRIORIDAD_OPTIONS, getTipoDocumento } from "./prensa.utils";
import { PRENSA_STRINGS } from "./prensa.strings";

const PSN = PRENSA_STRINGS.nueva;

export default function NuevaPublicacionDialog({ state, actions }) {
  const {
    open,
    nuevaData,
    saving,
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
  } = state;

  const {
    close,
    handleChange,
    handleDocModeChange,
    setArchivo,
    setDocSeleccionado,
    setBusquedaDoc,
    setPage,
    handlePreview,
    closePreview,
    handleSave,
  } = actions;

  return (
    <>
      <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
        {nuevaData && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                {state.isEdit ? PSN.editTitle : PSN.title}
              </Typography>
              <IconButton onClick={close} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px !important" }}>

              <Divider variant="middle">
                <Chip label={PSN.sectionDatos} size="small" sx={{ fontWeight: 700 }} />
              </Divider>
              <SAETextField
                label={PSN.fieldTitle}
                fullWidth
                value={nuevaData.titulo_publicacion}
                onChange={(e) => handleChange("titulo_publicacion", e.target.value)}
              />
              <SAETextField
                label={PSN.fieldDescription}
                fullWidth
                multiline
                rows={3}
                value={nuevaData.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
              />

              <Divider variant="middle" sx={{ mt: 0.5 }}>
                <Chip label={PSN.sectionVigencia} size="small" sx={{ fontWeight: 700 }} />
              </Divider>
              <Box sx={{ display: "flex", gap: 2 }}>
                <SAETextField
                  label={PSN.fieldStartDate}
                  type="date"
                  fullWidth
                  value={nuevaData.fecha_inicio}
                  onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <SAETextField
                  label={PSN.fieldEndDate}
                  type="date"
                  fullWidth
                  value={nuevaData.fecha_vigencia}
                  onChange={(e) => handleChange("fecha_vigencia", e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
              <FormControlLabel
                control={
                  <SAESwitch
                    size="small"
                    checked={nuevaData.no_dar_baja}
                    onChange={(e) => handleChange("no_dar_baja", e.target.checked)}
                  />
                }
                label={PSN.fieldNoDarBaja}
                sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.90rem" } }}
              />

              <Divider variant="middle" sx={{ mt: 0.5 }}>
                <Chip label={PSN.sectionPrioridad} size="small" sx={{ fontWeight: 700 }} />
              </Divider>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {PRIORIDAD_OPTIONS.map((opt) => {
                  const isSelected =
                    opt.value === nuevaData.prioridad ||
                    (opt.value === 0 && nuevaData.prioridad !== 1 && nuevaData.prioridad !== 2);
                  return (
                    <Chip
                      key={opt.value}
                      label={opt.label}
                      color={isSelected ? opt.chipColor : "default"}
                      variant={isSelected ? "filled" : "outlined"}
                      onClick={() => handleChange("prioridad", opt.value)}
                      sx={{ cursor: "pointer" }}
                    />
                  );
                })}
              </Box>

              <Divider variant="middle" sx={{ mt: 0.5 }}>
                <Chip label={PSN.sectionDocumentos} size="small" sx={{ fontWeight: 700 }} />
              </Divider>
              <Box>
                <Tabs
                  centered
                  value={docMode}
                  onChange={(_, v) => handleDocModeChange(v)}
                  sx={{
                    mb: 1.5,
                    borderBottom: "1px solid #c9dff0",
                    "& .MuiTabs-indicator": { bgcolor: "#5B96CC", height: 3, borderRadius: "3px 3px 0 0" },
                    "& .MuiTab-root": { fontWeight: 600, color: "#5B96CC", borderRadius: 1.5, transition: "color 0.2s" },
                    "& .Mui-selected": { color: "#5B96CC !important" },
                  }}
                >
                  <Tab value="subir" label={PSN.tabUpload} />
                  <Tab value="existente" label={PSN.tabExisting} />
                </Tabs>
                {docMode === "subir" ? (
                  <SAEButton variant="outlined" component="label" fullWidth startIcon={<CloudUploadIcon />}>
                    {archivo ? archivo.name : PSN.attachButton}
                    <input type="file" hidden onChange={(e) => setArchivo(e.target.files?.[0] || null)} />
                  </SAEButton>
                ) : (
                  <Box>
                    <SAETextField
                      placeholder={PSN.searchDocPlaceholder}
                      fullWidth
                      size="small"
                      value={busquedaDoc}
                      onChange={(e) => { setBusquedaDoc(e.target.value); setPage(1); }}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
                      sx={{ mb: 1 }}
                    />
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 245, overflowY: "auto" }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell padding="checkbox" />
                            <TableCell sx={{ fontWeight: 700 }}>{PSN.tableColName}</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>{PSN.tableColType}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>{PSN.tableColView}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loadingDocs ? (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                <CircularProgress size={20} sx={{ color: "#5B96CC", my: 1 }} />
                              </TableCell>
                            </TableRow>
                          ) : docsFiltrados.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} align="center">{PSN.noDocuments}</TableCell>
                            </TableRow>
                          ) : (
                            docsPaginados.map((doc) => (
                              <TableRow
                                key={doc.id}
                                hover
                                selected={docSeleccionado === doc.id}
                                onClick={() => setDocSeleccionado(doc.id)}
                                sx={{ cursor: "pointer" }}
                              >
                                <TableCell padding="checkbox">
                                  <Radio
                                    checked={docSeleccionado === doc.id}
                                    size="small"
                                    sx={{ "&.Mui-checked": { color: "#5B96CC" } }}
                                  />
                                </TableCell>
                                <TableCell>{doc.nombre_documento}</TableCell>
                                <TableCell>{getTipoDocumento(doc)}</TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => { e.stopPropagation(); handlePreview(doc.id, doc.nombre_documento); }}
                                  >
                                    <VisibilityIcon fontSize="small" sx={{ color: "#5B96CC" }} />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {docsFiltrados.length > 0 && (
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, px: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {PSN.docCount(docsFiltrados.length)}
                        </Typography>
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={(_, p) => setPage(p)}
                          size="small"
                          sx={{ "& .Mui-selected": { bgcolor: "#5B96CC !important", color: "white" } }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <SAEButton variant="contained" onClick={handleSave} disabled={saving}>
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

