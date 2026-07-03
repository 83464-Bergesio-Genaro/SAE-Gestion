import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  CardMedia,
  CardContent,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { PressProvider } from "../../context/providers/pressProvider";
import { usePress } from "../../context/sharedContext";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Masonry from "@mui/lab/Masonry";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import DocumentPreviewDialog from "../../components/documents/DocumentPreviewDialog";
import NewsPreviewDialog from "./NewsPreviewDialog";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import TitleBox from "../titleBox";

import { descargarDocumentoPorId } from "../../../api/PrensaService";
import { SAETypography } from "../typography/SAETypography";

const baseUrl = import.meta.env.BASE_URL;
const MAX_DESCRIPTION_PREVIEW_LENGTH = 440;

function ItemNovedad({
  item,
  invertida,
}) {
  const { handleCardClick } = usePress();
  const {
    titulo,
    descripcion,
    fecha_inicio,
    portada,
    documentos,
  } = item;
  const fullDescription = String(descripcion ?? "").trim();
  const isDescriptionTruncated =
    fullDescription.length > MAX_DESCRIPTION_PREVIEW_LENGTH;
  const descriptionPreview = isDescriptionTruncated
    ? fullDescription.slice(0, MAX_DESCRIPTION_PREVIEW_LENGTH).trimEnd()
    : fullDescription;
  // Estado para la imagen. Empieza con la foto genérica por defecto
  const [imagenUrl, setImagenUrl] = useState(
    `${baseUrl}images/principal/newsGeneric.webp`,
  );

  useEffect(() => {
    // Si no hay portada o no tiene ID, dejamos la imagen genérica
    if (!portada || !portada.id) {
      return;
    }

    const cargarImagen = async () => {
      try {
        // Llamamos a tu función del provider
        const resultado = await descargarDocumentoPorId(portada.id);

        // Tu función devuelve un objeto con 'datos_documento' (que es el DataURL)
        if (resultado && resultado.datos_documento) {
          setImagenUrl(resultado.datos_documento);
        }
      } catch (error) {
        console.error("No se pudo cargar la imagen de portada:", error);
        // Si hay un error en la API, se mantiene la imagen por defecto
        setImagenUrl(`${baseUrl}images/principal/newsGeneric.webp`);
      }
    };

    cargarImagen();
  }, [portada]);

  return (
    <>
      <Card
        onClick={() => handleCardClick({ ...item, imageSrc: imagenUrl })}
        sx={{
          position: "relative",
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
          border: "1px solid rgba(17, 53, 101, 0.08)",
          cursor: { xs: "default", md: "pointer" },
          opacity: 1,
          marginBottom: 3,
          display: "flex",
          flexDirection: {
            xs: "column",
            md: invertida ? "row-reverse" : "row",
          },
          "&:hover": {
            transform: "scale(1.01)",
            boxShadow: "0 15px 25px rgba(0,0,0,.15)",
          },
          "&:hover .hover-overlay": {
            opacity: 1,
          },
        }}
      >
        <CardMedia
          sx={{
            width: { xs: "100%", md: 300 },
            height: { xs: 200, md: "auto" },
            objectFit: "cover",
          }}
          component="img"
          image={
            imagenUrl ?? `url('${baseUrl}/images/principal/newsGeneric.webp')`
          }
          alt={portada?.name ?? "UTN"}
        />

        <Box
          sx={{
            flex: 1,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,.55)",
              opacity: 0,
              transition: "all .3s ease",
              cursor: "pointer",
            }}
            className="hover-overlay"
          >
            <SAETypography
              variant="overline"
              sx={{
                color: "white",
                letterSpacing: 1,
                width: "100px",
                textAlign: "center",
              }}
            >
              Ver mas
            </SAETypography>
          </Box>
          <CardContent>
            <SAETypography variant="h6" sx={{ color: "var(--secondary)" }}>
              {titulo}
            </SAETypography>
            <SAETypography variant="body2">{fecha_inicio}</SAETypography>
            <SAETypography
              variant="body1"
              sx={{
                mt: 1,
                color: "#5a6f8f",
                minHeight: 48,
              }}
            >
              {descriptionPreview}
              {isDescriptionTruncated && <Box component="span"> ...</Box>}
            </SAETypography>

            <Box
              onClick={(event) => event.stopPropagation()}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <DocumentList listadoDocumentos={documentos} />
            </Box>
          </CardContent>
        </Box>
      </Card>
    </>
  );
}

export function NovedadesContent() {
  const {
    isLoading,
    novedades,
    selectedPub,
    loadingSelectedDocuments,
    handleClose,
    handleOpenPreview,
  } = usePress();
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
    <>
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
                  item={item}
                  invertida={i % 2 === 0}
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

      <NewsPreviewDialog
        open={!!selectedPub}
        onClose={handleClose}
        title={selectedPub?.titulo}
        date={selectedPub?.fecha_inicio}
        description={selectedPub?.descripcion}
        imageSrc={selectedPub?.imageSrc}
        documents={selectedPub?.documentos || []}
        documentsLoading={loadingSelectedDocuments}
        onPreviewDocument={handleOpenPreview}
      />
    </>
  );
}

export function DocumentList(listadoDocumentos) {
  const {
    previewOpen,
    previewDoc,
    previewDocName,
    previewLoading,
    previewError,
    handleOpenPreview,
    handleClosePreview,
    handleDownloadPreview,
    handleDownload,
    getDocumentName,
    getImageSource,
    getDocumentExtension,
  } = usePress();
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
// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function NovedadesEstudiantiles() {
  return (
    <PressProvider>
      <NovedadesContent />
    </PressProvider>
  );
}
