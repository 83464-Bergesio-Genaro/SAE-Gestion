import {
  Box,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  InputAdornment,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useMemo, useState } from "react";

import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import NuevaPublicacionDialog from "./NuevaPublicacionDialog";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { PRENSA_STRINGS } from "./prensa.strings";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import NewsPreviewDialog from "../../../shared/components/StudentNews/NewsPreviewDialog";
import SchoolIcon from "@mui/icons-material/School";

import { usePress } from "../../context/employedContext";
import { PressProvider } from "../../context/providers/pressProvider";
const C = PRENSA_STRINGS;

export default function AdministrarPrensa() {
  return (
    <PressProvider>
      <AdministrarPrensaContent />
    </PressProvider>
  );
}

function AdministrarPrensaContent() {
  const {
    busqueda,
    setBusqueda,
    publicationDialog,
    openCreatePublication,
    rowsFiltradas,
    columns,
    loading,
    deleteTarget,
    setDeleteTarget,
    handleDeleteConfirm,
    snackbar,
    setSnackbar,
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
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setBusqueda("");
  };

  const secciones = [{ key: "publicaciones", label: "Publicaciones" }];
  const [activeSection, setActiveSection] = useState("publicaciones");
  const sectionConfig = useMemo(
    () => ({
      publicaciones: {
        title: "Gestion Publicaciones",
        icon: SchoolIcon,
        rows: rowsFiltradas,
        columns,
        loading,
        dialog: openCreatePublication,
      },
    }),
    [columns, loading, openCreatePublication, rowsFiltradas],
  );
  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );
  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "90px", md: "100px" },
        pb: 4,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
        <HeaderPageEmployed
          header=" Módulo de Prensa"
          title="Gestión de Publicaciones"
          description="Permite gestionar las publicaciones en el módulo de prensa"
        />
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
            mb: 3,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                bgcolor: "rgba(255,255,255,0.72)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(1px)",
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <Box
            sx={{
              background: "var(--gradient)",
              color: "white",
              px: 3,
              pt: 0,
              pb: 0,
            }}
          >
            <Stack
              direction="row"
              overflow={{ xs: "scroll", md: "hidden" }}
              spacing={0}
            >
              {secciones.map((item) => (
                <Box
                  key={item.key}
                  onClick={() => handleSectionChange(item.key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2.5,
                    py: 1.5,
                    cursor: "pointer",
                    fontWeight: activeSection === item.key ? 700 : 500,
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color:
                      activeSection === item.key
                        ? "white"
                        : "rgba(255,255,255,0.6)",
                    borderBottom:
                      activeSection === item.key
                        ? "3px solid white"
                        : "3px solid transparent",
                    transition: "all 0.15s",
                    "&:hover": {
                      color: "white",
                      borderBottomColor: "rgba(255,255,255,0.4)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "inherit",
                      fontSize: "inherit",
                      letterSpacing: "inherit",
                      textTransform: "inherit",
                      color: "inherit",
                      lineHeight: 1,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ py: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <currentSection.icon sx={{ fontSize: 30 }} />
                <Typography variant="h6" fontWeight={700}>
                  {currentSection.title}
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ sm: "center" }}
              >
                <SAETextField
                  placeholder="Busqueda..."
                  size="small"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  sx={{
                    width: { xs: "100%", sm: 240, md: 220 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.12)",
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.6)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& input::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                      opacity: 1,
                    },
                    "& .MuiInputAdornment-root svg": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <SAEButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={currentSection.dialog}
                  sx={{
                    whiteSpace: "nowrap",
                    bgcolor: "rgba(255,255,255,0.18)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.4)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                  }}
                >
                  Crear Publicacion
                </SAEButton>
              </Stack>
            </Stack>
          </Box>
           <CardContent sx={{ p: 0 }}>
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={rowsFiltradas}
                columns={currentSection.columns}
                loading={currentSection.loading}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                localeText={{ noRowsLabel: "Sin Registros" }}
                sx={{ borderRadius: 0, border: "none" }}
              />
            </Box>
          </CardContent>
        </Card>


        <NuevaPublicacionDialog
          state={publicationDialog.state}
          actions={publicationDialog.actions}
        />

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

        {/* Delete confirm dialog */}
        <Dialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          maxWidth="xs"
          fullWidth
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
              {C.deleteTitle}
            </Typography>
            <IconButton onClick={() => setDeleteTarget(null)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography>
              {deleteTarget?.titulo_publicacion}
              <strong>{deleteTarget?.titulo_publicacion}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <SAEButton
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
            >
              {C.deleteButton}
            </SAEButton>
          </DialogActions>
        </Dialog>

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
