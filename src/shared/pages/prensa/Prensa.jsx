import { useState, useMemo, useEffect, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import SAEButton from "../../components/buttons/SAEButton";
import SAETextField from "../../components/inputs/SAETextField";
import DocumentPreviewDialog from "../../components/documents/DocumentPreviewDialog";
import {
  listarPublicacionesActivas,
  listarDocumentosPorPublicacion,
  descargarDocumentoPorId,
} from "../../../api/PrensaService";

const PREVIEW_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "pdf"]);

function getDocumentId(doc) {
  return doc?.id ?? doc?.id_documento ?? doc?.idDocumento ?? null;
}

function hasRealDocumentName(value) {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return false;

  const genericNames = new Set(["documento", "archivo", "file", "document"]);
  return !genericNames.has(normalized);
}

function getDocumentName(doc, fallback = "Archivo") {
  const candidate = doc?.nombre_documento || doc?.nombreDocumento || doc?.titulo;
  return hasRealDocumentName(candidate) ? candidate : fallback;
}

function normalizeExtension(value) {
  if (!value) return "";

  let normalized = String(value).trim().toLowerCase();
  if (normalized.includes("/")) {
    normalized = normalized.split("/").pop();
  }
  if (normalized.includes(";")) {
    normalized = normalized.split(";")[0];
  }

  return normalized.replace(/^\./, "");
}

function getDocumentExtension(doc) {
  const directExtension = normalizeExtension(doc?.extension);
  if (directExtension) return directExtension;

  const fileName = doc?.nombre_documento || doc?.nombreDocumento || doc?.titulo || "";
  const parts = fileName.split(".");
  if (parts.length < 2) return "";

  return normalizeExtension(parts.pop());
}

function isPreviewableDocument(doc) {
  const extension = getDocumentExtension(doc);
  return PREVIEW_EXTENSIONS.has(extension);
}

function getImageSource(doc) {
  if (!doc?.datos_documento) return "";

  if (doc.datos_documento.startsWith("data:")) {
    return doc.datos_documento;
  }

  const extension = getDocumentExtension(doc);
  const mimeByExtension = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
  };

  const mime = mimeByExtension[extension] || "image/jpeg";
  return `data:${mime};base64,${doc.datos_documento}`;
}

function prioridadLabel(prioridad) {
  switch (prioridad) {
    case 0: return { label: "Normal", color: "default" };
    case 1: return { label: "Media", color: "warning" };
    case 2: return { label: "Alta", color: "error" };
    default: return { label: "Normal", color: "default" };
  }
}

export default function Prensa() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [selectedPub, setSelectedPub] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewDocName, setPreviewDocName] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const fetchPublicaciones = useCallback(() => {
    setLoading(true);
    listarPublicacionesActivas()
      .then((data) => setPublicaciones(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar publicaciones:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPublicaciones();
  }, [fetchPublicaciones]);

  const publicacionesFiltradas = useMemo(() => {
    if (!busqueda.trim()) return publicaciones;
    const termino = busqueda.toLowerCase();
    return publicaciones.filter(
      (pub) =>
        (pub.titulo_publicacion &&
          pub.titulo_publicacion.toLowerCase().includes(termino)) ||
        (pub.descripcion && pub.descripcion.toLowerCase().includes(termino))
    );
  }, [publicaciones, busqueda]);

  const handleCardClick = async (pub) => {
    setSelectedPub(pub);
    setLoadingDocs(true);
    setDocumentos([]);
    try {
      const data = await listarDocumentosPorPublicacion(pub.id);
      setDocumentos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener documentos:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleClose = () => {
    setSelectedPub(null);
    setDocumentos([]);
  };

  const handleOpenPreview = async (doc) => {
    const documentId = getDocumentId(doc);
    setPreviewDocName(getDocumentName(doc, "Vista previa"));
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError("");
    setPreviewDoc(null);

    if (!documentId) {
      setPreviewError("No se encontró el id del documento para previsualizar.");
      setPreviewLoading(false);
      return;
    }

    try {
      const data = await descargarDocumentoPorId(documentId);

      if (!isPreviewableDocument(data) && !isPreviewableDocument(doc)) {
        setPreviewError("Solo se permite vista previa para imágenes o PDF.");
        return;
      }

      setPreviewDoc(data);
    } catch (error) {
      console.error("Error al descargar documento:", error);
      setPreviewError("No se pudo cargar la imagen.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewDoc(null);
    setPreviewDocName("");
    setPreviewError("");
    setPreviewLoading(false);
  };

  const handleDownloadPreview = () => {
    if (!previewDoc) return;

    const imageSource = getImageSource(previewDoc);
    if (!imageSource) return;

    const extension = getDocumentExtension(previewDoc);
    const fileName = getDocumentName(previewDoc, previewDocName || "archivo");
    const hasExtension = fileName.includes(".");
    const downloadName = hasExtension
      ? fileName
      : `${fileName}.${extension || "jpg"}`;

    const link = document.createElement("a");
    link.href = imageSource;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

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
            onClick={() => navigate("/Gestion-Prensa")}
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
