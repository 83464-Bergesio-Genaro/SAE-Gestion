import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  CardMedia,
  CardContent,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Masonry from "@mui/lab/Masonry";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";

import { useEffect, useMemo, useState, useCallback } from "react";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import DocumentPreviewDialog from "../../components/documents/DocumentPreviewDialog";

import {
  ObtenerNoticiasPublicas,
  descargarDocumentoPorId,
} from "../../../api/PrensaService";
import TitleBox from "../titleBox";

const PREVIEW_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "pdf",
]);

function hasRealDocumentName(value) {
  if (!value) return false;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return false;

  const genericNames = new Set(["documento", "archivo", "file", "document"]);
  return !genericNames.has(normalized);
}

function getDocumentName(doc, fallback = "Archivo") {
  const candidate =
    doc?.nombre_documento || doc?.nombreDocumento || doc?.titulo;
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

  const fileName =
    doc?.nombre_documento || doc?.nombreDocumento || doc?.titulo || "";
  const parts = fileName.split(".");
  if (parts.length < 2) return "";

  return normalizeExtension(parts.pop());
}

function isPreviewableDocument(doc) {
  return PREVIEW_EXTENSIONS.has(doc.extension);
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

function ItemNovedad({
  titulo,
  descripcion,
  fecha_inicio,
  invertida,
  portada,
  documentos,
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
        border: "1px solid rgba(17, 53, 101, 0.08)",
        opacity: 1,
        marginBottom: 3,
        display: "flex",
        flexDirection: { xs: "column", md: invertida ? "row-reverse" : "row" },
      }}
    >
      {
        <CardMedia
          sx={{
            width: { xs: "100%", md: 300 },
            height: { xs: 200, md: "auto" },
            objectFit: "cover",
          }}
          component="img"
          image={portada ?? "/images/principal/newsGeneric.webp"}
        />
      }

      <Box sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#14325c" }}>
            {titulo}
          </Typography>
          <Typography variant="body2" sx={{ color: "#5a6f8f" }}>
            {fecha_inicio}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ mt: 1, color: "#5a6f8f", minHeight: 48 }}
          >
            {descripcion}
          </Typography>
          <DocumentList listadoDocumentos={documentos} />
        </CardContent>
      </Box>
    </Card>
  );
}

export default function NovedadesEstudiantiles() {
  const [isLoading, setLoadingNews] = useState(true);
  const [novedades, setNovedades] = useState([]);
  const fetchEventosPublicos = useCallback(async () => {
    setLoadingNews(true);
    try {
      const respuesta = await ObtenerNoticiasPublicas();
      if (respuesta?.success && respuesta?.data) {
        setNovedades(respuesta.data);
      }
    } catch {
      setNovedades([]);
    } finally {
      setLoadingNews(false);
    }
  }, []);

  useEffect(() => {
    fetchEventosPublicos();
  }, [fetchEventosPublicos]);

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 3;

  const totalPaginas = Math.ceil(novedades.length / itemsPorPagina);

  const novedadesPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    return novedades.slice(inicio, fin);
  }, [paginaActual, novedades]);

  const irPaginaAnterior = () => {
    setPaginaActual((prev) => Math.max(prev - 1, 1));
  };

  const irPaginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
  };

  return (
    <Box
      sx={{
        mt: "-20px",
        pt: "40px",
        pb: 4,
        minHeight: "100%",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
        <TitleBox
          title="Novedades Estudiantiles"
          description="Información actualizada sobre actividades, comunicados y novedades
            académicas."
        />
        <Box sx={{ mt: 1 }}>
          {isLoading && (
            <Stack alignItems="center" width={"100%"} gap={1}>
              <SAESpinner size="S" />
            </Stack>
          )}
          {!isLoading && (
            <>
              <Stack>
                {novedadesPaginadas.map((item, i) => (
                  <ItemNovedad
                    key={item.id}
                    titulo={item.titulo}
                    fecha_inicio={item.fecha_inicio}
                    descripcion={item.descripcion}
                    invertida={i % 2 === 0}
                    portada={item.imagen}
                    documentos={item.documentos}
                  />
                ))}
              </Stack>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Typography sx={{ fontSize: "0.95rem", color: "#333" }}>
                  {paginaActual} de {totalPaginas}
                </Typography>

                <IconButton
                  onClick={irPaginaAnterior}
                  disabled={paginaActual === 1}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <IconButton
                  onClick={irPaginaSiguiente}
                  disabled={paginaActual === totalPaginas}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export function DocumentList(listadoDocumentos) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewDocName, setPreviewDocName] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const handleOpenPreview = async (documento) => {
    setPreviewLoading(true);
    if (
      !documento ||
      !documento.id ||
      !documento.name ||
      !documento.extension
    ) {
      setPreviewError("No se encontró el documento para previsualizar.");
      setPreviewLoading(false);
      return;
    }

    setPreviewOpen(true);
    setPreviewError("");
    setPreviewDoc(null);

    try {
      const data = await descargarDocumentoPorId(documento.id);

      if (!isPreviewableDocument(data) && !isPreviewableDocument(documento)) {
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

  const handleDownload = async (documento) => {
    setPreviewLoading(true);
    if (
      !documento ||
      !documento.id ||
      !documento.name ||
      !documento.extension
    ) {
      setPreviewError("No se encontró el documento para previsualizar.");
      setPreviewLoading(false);
      return;
    }
    try {
      let data = await descargarDocumentoPorId(documento.id);
      const imageSource = getImageSource(data);

      if (!imageSource) return;
      const link = document.createElement("a");
      link.href = imageSource;
      link.download =
        documento.nombre_documento ||
        documento.nombreDocumento ||
        documento.name ||
        `documento_${documento.id}`;
      document.body.appendChild(link);
      console.log(link);
      link.click();
      link.remove();
    } catch (error) {
      setPreviewError(`No se pudo descargar el documento. ${error}`);
    }
  };
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, mb: 1 }}>
        {listadoDocumentos.listadoDocumentos?.length > 0 && (
          <Box
            sx={{
              display: "block",
              alignItems: "center",
              gap: 1,
              mt: 2,
              mb: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Documentos adjuntos
            </Typography>
            <List dense>
              {listadoDocumentos.listadoDocumentos.map((doc, i) => (
                <ListItem key={doc.id}>
                  <ListItemIcon
                    sx={{
                      minWidth: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <InsertDriveFileIcon />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      doc.name ||
                      doc.nombre_documento ||
                      doc.titulo ||
                      `Documento ${i + 1}`
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleOpenPreview(doc)}
                    aria-label="Visualizar documento"
                    title="Ver documento"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDownload(doc)}
                    aria-label="Descargar documento"
                    title="Descargar documento"
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
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
    </div>
  );
}
