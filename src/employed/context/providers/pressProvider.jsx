import { useState, useMemo, useEffect, useCallback } from "react";
import { Chip, Box, IconButton } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";

import { vigenciaActiva } from "../../pages/prensa/prensa.utils";
import { useNuevaPublicacion } from "../../pages/prensa/useNuevaPublicacion";

import { PressContext } from "../employedContext";
import { PRENSA_STRINGS } from "../../pages/prensa/prensa.strings";
import {
  listarPublicacionesActivas,
  listarDocumentosPorPublicacion,
  listarPublicacionesCompleto,
  eliminarPublicacion,
  descargarDocumentoPorId,
} from "../../../api/PrensaService";
import {
  getDocumentExtension,
  getDocumentId,
  getDisplayDocumentName as getDocumentName,
  getImageSource,
  isPreviewableDocument,
} from "../../../utils/util.jsx";;
const C = PRENSA_STRINGS;

function prioridadChip(prioridad) {
  switch (prioridad) {
    case 1:
      return <Chip label={C.priorityMedium} color="warning" size="small" />;
    case 2:
      return <Chip label={C.priorityHigh} color="error" size="small" />;
    default:
      return <Chip label={C.priorityNormal} size="small" />;
  }
}

export function PressProvider({ children }) {
  const [publicaciones, setPublicaciones] = useState([]);

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
        (pub.descripcion && pub.descripcion.toLowerCase().includes(termino)),
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
    console.log(doc)
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

  /*ADMINISTRAR PRENSA */
  const [rows, setRows] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const nueva = useNuevaPublicacion({
    onSuccess: (isEdit) => {
      setRefreshKey((k) => k + 1);
      setSnackbar({
        open: true,
        message: isEdit ? C.snackSaved : C.snackCreated,
        severity: "success",
      });
    },
    onWarning: (msg) =>
      setSnackbar({ open: true, message: msg, severity: "warning" }),
    onError: (msg) =>
      setSnackbar({ open: true, message: msg, severity: "error" }),
  });
  const publicationDialog = {
    state: nueva.state,
    actions: nueva.actions,
  };
  const openCreatePublication = nueva.actions.open;

  useEffect(() => {
    setLoading(true);
    listarPublicacionesCompleto()
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar publicaciones:", err))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const rowsFiltradas = useMemo(() => {
    let filtradas = rows;
    if (filtroEstado === "activas")
      filtradas = filtradas.filter((r) => vigenciaActiva(r.fecha_vigencia));
    if (filtroEstado === "vencidas")
      filtradas = filtradas.filter((r) => !vigenciaActiva(r.fecha_vigencia));
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      filtradas = filtradas.filter(
        (r) =>
          (r.titulo_publicacion &&
            r.titulo_publicacion.toLowerCase().includes(termino)) ||
          (r.descripcion && r.descripcion.toLowerCase().includes(termino)),
      );
    }
    return filtradas;
  }, [rows, filtroEstado, busqueda]);

  const handleEdit = (pub) => nueva.actions.openEdit(pub);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await eliminarPublicacion(deleteTarget.id);
    } catch (err) {
      console.warn("Respuesta del delete:", err);
    }
    setDeleteTarget(null);
    setRefreshKey((k) => k + 1);
    setSnackbar({ open: true, message: C.snackDeleted, severity: "error" });
  };

  const columns = [
    { field: "id", headerName: C.colId, width: 70 },
    {
      field: "titulo_publicacion",
      headerName: C.colTitle,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "descripcion",
      headerName: C.colDescription,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "fecha_inicio",
      headerName: C.colStartDate,
      width: 140,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("es-AR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
    },
    {
      field: "fecha_vigencia",
      headerName: C.colExpiry,
      width: 140,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("es-AR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
    },
    {
      field: "prioridad",
      headerName: C.colPriority,
      width: 80,
      renderCell: (params) => prioridadChip(params.value),
    },
    {
      field: "no_dar_baja",
      headerName: C.colFixed,
      width: 80,
      renderCell: (params) => (params.value ? C.colFixed_yes : C.colFixed_no),
    },
    { field: "visualizaciones", headerName: C.colViews, width: 80 },
    {
      field: "acciones",
      headerName: C.colActions,
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            color="info"
            title="Ver publicación"
            onClick={() => handleCardClick(params.row)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => setDeleteTarget(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <PressContext.Provider
      value={{
        busqueda,
        setBusqueda,
        loading,
        publicacionesFiltradas,
        handleCardClick,
        selectedPub,
        handleClose,
        loadingDocs,
        documentos,
        getDocumentId,
        handleOpenPreview,
        previewOpen,
        handleClosePreview,
        previewDoc,
        previewDocName,
        previewLoading,
        previewError,
        handleDownloadPreview,
        descargarDocumentoPorId,
        getImageSource,
        getDocumentName,
        getDocumentExtension,
        filtroEstado,
        setFiltroEstado,
        nueva,
        publicationDialog,
        openCreatePublication,
        rowsFiltradas,
        columns,
        deleteTarget,
        setDeleteTarget,
        handleDeleteConfirm,
        snackbar,
        setSnackbar,
      }}
    >
      {children}
    </PressContext.Provider>
  );
}
