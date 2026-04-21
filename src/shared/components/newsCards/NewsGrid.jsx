import { useMemo,useEffect, useState } from "react";
import SAEButton from "../buttons/SAEButton";
import { Box,Grid, Card,CardMedia,CardContent,  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton, Typography } from "@mui/material";
import DocumentPreviewDialog from "../../components/documents/DocumentPreviewDialog";
import { ObtenerNoticiasPublicas,descargarDocumentoPorId} from "../../../api/PrensaService";
import "./News.css";
import Masonry from "@mui/lab/Masonry";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from "@mui/icons-material/Visibility";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";
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
export default function NewsGrid() {

    const [newsList, setEventosJPA] = useState([]);
      useEffect(() => {
        const ObtenerEventosPublicosApi = async () => {
          try {
            const respuesta = await ObtenerNoticiasPublicas();
            if(respuesta?.success && respuesta?.data){
              setEventosJPA(respuesta?.data);
            }
          } catch (error) {
            console.error("Error al traer Eventos:", error);
          }
        };
        ObtenerEventosPublicosApi();
      }, []);

  return (
    <section className="news-section">
      <Typography variant="h2" textAlign="center" marginY={1} fontWeight={"bold"}>
        Novedades
      </Typography>
      <div className="mobile-main-container">
          <InfoSectionPhone information={newsList} />
      </div>
      <div className="desktop-main-container">
          <InfoSectionWithId information={newsList} />
      </div>
      
    </section>
  );
}

{/*
  id, --usado
  titulo,--usado
  descripcion, --usado
  fecha_inicio,--usado
  fecha_vigencia,--dsc
  prioridad,-dsc
  no_dar_baja,--dsc
  visualizaciones,--
  portada, --usado
  documentos, --ta
  ruta_publicacion
 */}
export function DocumentList(listadoDocumentos){
    const [documentos, setDocumentos] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewDoc, setPreviewDoc] = useState(null);
    const [previewDocName, setPreviewDocName] = useState("");
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState("");
    
      const handleOpenPreview = async (documento) => {
        setPreviewLoading(true);
        if(!documento || !documento.id || !documento.name || !documento.extension) {
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
        if(!documento || !documento.id || !documento.name || !documento.extension) {
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
          link.download = documento.nombre_documento || documento.nombreDocumento || documento.name || `documento_${documento.id}`;
          document.body.appendChild(link);
          console.log(link);
          link.click();
          link.remove();
          
        } catch (error) {
          setPreviewError("No se pudo descargar el documento.");
        }
      };
    return (
    <div>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2, mb: 1 }}>
            { listadoDocumentos.listadoDocumentos?.length > 0 && ( 
              <Box sx={{ display: "block", alignItems: "center", gap: 1, mt: 2, mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Documentos adjuntos
                </Typography>
                  <List dense>
                    {listadoDocumentos.listadoDocumentos.map((doc, i) => (
                      <ListItem key={doc.id}>
                        <ListItemIcon sx={{ minWidth:50,alignItems:"center",justifyContent:"center" }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <InsertDriveFileIcon />
                            
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={doc.name ||doc.nombre_documento || doc.titulo || `Documento ${i + 1}`}
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
                              onClick={
                                () => handleDownload(doc)}
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
    </div>)
}

export function InfoSectionPhone({information}){
    const [viewerMode, setViewerMode] = useState(null);
    return(
        <div className="info-container">     
            <Grid container spacing={5} size={12}>
            {information.map((item,index)=>(
                 <Card key={index} sx={{ minHeight: 300,width: '100%',borderRadius:5 }}>
                    <CardMedia
                        component="img"
                        height="150"
                        image={item.portada}
                        alt={item.titulo}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" textAlign="center"  component="div" fontWeight={"bold"}>
                            {item.titulo}
                        </Typography>
                        <Typography variant="body2">{item.fecha_inicio}</Typography>
                        <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={{ __html: item.descripcion }}></Typography>
                        <DocumentList listadoDocumentos={item.documentos} />
                    </CardContent>
                </Card>))}
            </Grid>
        </div>);
}

export function InfoSectionWithId({information}){
    const [viewerMode, setViewerMode] = useState(null);
    return(        
        <div className="info-container">
            
            {information.map((item,index)=>(
                index % 2 === 0 ? 
                    (<section key={item.id*-1} className="info-secciones">
                    <div className="info-content">
                        <Typography gutterBottom variant="h4" textAlign="center"  component="div" fontWeight={"bold"}>
                            {item.titulo}
                        </Typography>
                        <div className="info-hidden">
                            <div className="info-hidden-text">
                                <Typography variant="body">{item.fecha_inicio}</Typography>
                                <Typography variant="body" gutterBottom>
                                    <p dangerouslySetInnerHTML={{ __html: item.descripcion }}></p>
                                </Typography>
                                <DocumentList listadoDocumentos={item.documentos} />
                            </div>
                            <div className="info-image" alt={item.titulo} style={{ backgroundImage: `url(${item.portada})` }}></div>
                        </div>
                    </div>
                </section>) : 
                (
                    <section key={item.id*-1} className="info-secciones">
                        <div className="info-content">
                            <Typography gutterBottom variant="h4" textAlign="center"  component="div" fontWeight={"bold"}>
                                {item.titulo}
                            </Typography>
                            <div className="info-hidden-left">
                                <div className="info-image" alt={item.titulo} style={{ backgroundImage: `url(${item.portada})` }}></div>
                                <div className="info-hidden-text">
                                    <Typography variant="body">{item.fecha_inicio}</Typography>
                                    <Typography variant="body" gutterBottom>
                                        <p dangerouslySetInnerHTML={{ __html: item.descripcion }}></p>
                                    </Typography>
                                    <DocumentList listadoDocumentos={item.documentos} />
                                </div>
                            </div>
                        </div>
                    </section>
                )
                
            ))}
        </div>
    );
}