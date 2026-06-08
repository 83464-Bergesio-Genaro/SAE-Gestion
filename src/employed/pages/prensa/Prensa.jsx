import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Container,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import { useAuth } from "../../../shared/context/sharedContext"; 
import { useNavigate } from "react-router-dom";
import { usePress } from "../../context/employedContext";
import { PressProvider } from "../../context/providers/pressProvider";

function prioridadLabel(prioridad) {
  switch (prioridad) {
    case 0: return { label: "Normal", color: "default" };
    case 1: return { label: "Media", color: "warning" };
    case 2: return { label: "Alta", color: "error" };
    default: return { label: "Normal", color: "default" };
  }
}
export default function Prensa() {
    return (
        <PressProvider>
            <PrensaContent />
        </PressProvider>
    );
}
function PrensaContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    busqueda,setBusqueda,loading,publicacionesFiltradas,
    handleCardClick,
    selectedPub,handleClose,loadingDocs,documentos,getDocumentId,handleOpenPreview,
    previewOpen,handleClosePreview,previewDoc,previewDocName,previewLoading,previewError,handleDownloadPreview,

    getImageSource,getDocumentName,getDocumentExtension
  } = usePress();
  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Prensa
        </Typography>
        {user?.id_perfil === 5 && (
          <SAEButton
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={() => navigate("/Gestion-Prensa/Administrar")}
          >
            Administrar
          </SAEButton>
        )}
      </Box>

      <SAETextField
        fullWidth
        placeholder="Buscar publicación..."
        size="small"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        sx={{ mb: 3 }}
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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : publicacionesFiltradas.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
          No se encontraron publicaciones.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Masonry
            columns={{ xs: 1, sm: 2, md: 3 }}
            spacing={{ xs: 2, sm: 3, md: 3 }}
            sx={{ width: "100%", maxWidth: 1200 }}
          >
            {publicacionesFiltradas.map((pub, index) => {
              const prio = prioridadLabel(pub.prioridad);
              return (
                <Card key={pub.id ?? index} sx={{ borderRadius: 2 }}>
                  <CardActionArea onClick={() => handleCardClick(pub)}>
                    <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={prio.label}
                        color={prio.color}
                        size="small"
                        icon={pub.prioridad > 0 ? <PriorityHighIcon /> : undefined}
                      />
                      {pub.no_dar_baja && (
                        <Chip label="Fija" size="small" variant="outlined" />
                      )}
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold" }}
                      gutterBottom
                    >
                      {pub.titulo_publicacion}
                    </Typography>

                    {pub.descripcion && (
                      <Typography variant="body2" color="text.secondary">
                        {pub.descripcion}
                      </Typography>
                    )}

                    <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {pub.fecha_inicio && (
                        <Typography variant="caption" color="text.secondary">
                          Publicado:{" "}
                          {new Date(pub.fecha_inicio).toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Typography>
                      )}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <VisibilityIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {pub.visualizaciones ?? 0}
                        </Typography>
                      </Box>
                    </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Masonry>
        </Box>
      )}

      {/* Dialog de detalle */}
      <Dialog
        open={!!selectedPub}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedPub && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {selectedPub.titulo_publicacion}
              </Typography>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip
                  label={prioridadLabel(selectedPub.prioridad).label}
                  color={prioridadLabel(selectedPub.prioridad).color}
                  size="small"
                />
                {selectedPub.no_dar_baja && (
                  <Chip label="Fija" size="small" variant="outlined" />
                )}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
                  <VisibilityIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    {selectedPub.visualizaciones ?? 0}
                  </Typography>
                </Box>
              </Box>

              {selectedPub.descripcion && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedPub.descripcion}
                </Typography>
              )}

              <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                {selectedPub.fecha_inicio && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Publicado:</strong>{" "}
                    {new Date(selectedPub.fecha_inicio).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                )}
                {selectedPub.fecha_vigencia && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Vigencia:</strong>{" "}
                    {new Date(selectedPub.fecha_vigencia).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Documentos adjuntos
                </Typography>
              </Box>
              {loadingDocs && <CircularProgress size={18} color="success" />}
              {!loadingDocs && documentos.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay documentos adjuntos.
                </Typography>
              ) : (
                <List dense>
                  {documentos.map((doc, i) => (
                    <ListItem key={getDocumentId(doc) ?? i}>
                      <ListItemIcon sx={{ minWidth: 72 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <InsertDriveFileIcon />
                          <IconButton
                            size="small"
                            onClick={() => handleOpenPreview(doc)}
                            aria-label="Visualizar documento"
                            title="Ver documento"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={doc.nombre_documento || doc.titulo || `Documento ${i + 1}`}
                        secondary={doc.tipo_documento || null}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      <DocumentPreviewDialog
        open={previewOpen}
        onClose={handleClosePreview}
        title={getDocumentName(previewDoc, previewDocName || "Vista previa")}
        imageSrc={previewDoc ? getImageSource(previewDoc) : ""}
        isPdf={getDocumentExtension(previewDoc) === "pdf"}
        loading={previewLoading}
        error={previewError}
        onDownload={handleDownloadPreview}
      />
    </Container>
  );
}
