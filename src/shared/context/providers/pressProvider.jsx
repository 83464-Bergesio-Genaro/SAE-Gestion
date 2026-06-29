
import {useEffect, useState ,useCallback} from "react";
import { PressContext } from "../sharedContext";
import { ObtenerNoticiasPublicas,descargarDocumentoPorId } from "../../../api/PrensaService";

const PREVIEW_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "pdf"]);

export function PressProvider({ children }) {

    function hasRealDocumentName(value) {
    if (!value) return false;
    const normalized = String(value).trim().toLowerCase();
    if (!normalized) return false;

    const genericNames = new Set(["documento", "archivo", "file", "document"]);
    return !genericNames.has(normalized);
    }

    function getDocumentName(doc, fallback = "Archivo") {
    const candidate = doc?.nombre_documento;
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

        const fileName = doc?.nombre_documento || "";
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

        const [isLoading, setLoadingNews] = useState(true);
        const [novedades, setNovedades] = useState([]);
        const fetchEventosPublicos = useCallback(async () => {
            setLoadingNews(true);
            try {
                const respuesta = await ObtenerNoticiasPublicas();      
                if(respuesta?.success && respuesta?.data){
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
          link.download =
            documento.nombre_documento || `documento_${documento.id}`;
          document.body.appendChild(link);
          console.log(link);
          link.click();
          link.remove();
          
        } catch (error) {
          setPreviewError(`No se pudo descargar el documento. ${error}`);
        }
      };
    return (
        <PressContext.Provider
        value={{
                isLoading,
                novedades, previewOpen,previewDoc,previewDocName,previewLoading,previewError,
                handleOpenPreview,handleClosePreview,handleDownloadPreview,handleDownload,

                getDocumentName,getImageSource,getDocumentExtension
        }}
        >
        {children}
        </PressContext.Provider>
    );
}
