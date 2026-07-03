import { useState, useEffect, useCallback, useMemo } from "react";
import { Chip, Box, IconButton } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNuevaPublicacion } from "../../pages/prensa/useNuevaPublicacion";
import { useNotification } from "../../../shared/context/sharedContext";

import { PressContext } from "../employedContext";
import { PRENSA_STRINGS } from "../../pages/prensa/prensa.strings";
import {
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
  formatDateForDisplay,
} from "../../../utils/util.jsx";
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

const EMPTY_PUBLICATION = {
  id: "",
  titulo_publicacion: "",
  descripcion: "",
  fecha_inicio: "",
  fecha_vigencia: "",
  prioridad: 0,
  no_dar_baja: false,
  visualizaciones: 0,
};

const COLUMN_LABELS = {
  id: C.colId,
  titulo_publicacion: C.colTitle,
  descripcion: C.colDescription,
  fecha_inicio: C.colStartDate,
  fecha_vigencia: C.colExpiry,
  prioridad: C.colPriority,
  no_dar_baja: C.colFixed,
  visualizaciones: C.colViews,
};

const generateColumns = (data, viewAction, editAction, deleteAction) => {
  if (!data || Object.keys(data).length === 0) return [];

  const columns = Object.keys(data).map((key) => {
    const normalizedKey = key.toLowerCase();
    const isId = normalizedKey === "id" || normalizedKey.startsWith("id_");
    const isDate = normalizedKey.includes("fecha");
    const isShort = ["prioridad", "no_dar_baja", "visualizaciones"].includes(
      key,
    );

    const column = {
      field: key,
      headerName: COLUMN_LABELS[key] || key,
      flex: isId || isDate || isShort ? 0 : 1,
      width: isId ? 70 : isDate ? 120 : isShort ? 80 : undefined,
      minWidth: isId || isDate || isShort ? undefined : 200,
    };

    if (isDate) {
      column.valueFormatter = (value) => formatDateForDisplay(value);
    }
    if (key === "prioridad") {
      column.renderCell = (params) => prioridadChip(params.value);
    }
    if (key === "no_dar_baja") {
      column.renderCell = (params) =>
        params.value ? C.colFixed_yes : C.colFixed_no;
    }

    return column;
  });

  columns.push({
    field: "actions",
    headerName: C.colActions,
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box>
        <IconButton
          size="small"
          sx={{ color: "var(--primary)" }}
          title="Ver publicación"
          onClick={() => viewAction(params.row)}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: "var(--primary)" }}
          title="Editar publicación"
          onClick={() => editAction(params.row)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: "var(--primary)" }}
          title="Eliminar publicación"
          onClick={() => deleteAction(params.row)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  });

  return columns;
};

export function PressProvider({ children }) {
  const {
    showNotification,
    dialogData,
    setDialogError,
    setDialogSaving,
    openDialog,
    closeDialog,
  } = useNotification();
  const [selectedPub, setSelectedPub] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewDocName, setPreviewDocName] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const handleCardClick = useCallback(async (pub) => {
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
  }, []);

  const handleClose = () => {
    setSelectedPub(null);
    setDocumentos([]);
  };

  const handleOpenPreview = async (doc) => {
    const documentId = getDocumentId(doc);
    console.log(doc);
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const publication = useNuevaPublicacion({
    onSuccess: (isEdit) => {
      setRefreshKey((k) => k + 1);
      showNotification(isEdit ? C.snackSaved : C.snackCreated);
    },
    onWarning: (message) => showNotification(message, "warning"),
    onError: (message) => showNotification(message, "error"),
  });
  useEffect(() => {
    setLoading(true);
    listarPublicacionesCompleto()
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar publicaciones:", err))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const handleEdit = useCallback(
    (pub) => publication.openEditPublication(pub),
    [publication],
  );
  const openDeletePublication = useCallback(
    (pub) => openDialog("pressPublicationDelete", "delete", pub),
    [openDialog],
  );

  const handleDeleteConfirm = async () => {
    if (!dialogData?.id) return;
    setDialogSaving(true);
    setDialogError("");
    try {
      await eliminarPublicacion(dialogData.id);
      closeDialog();
      setRefreshKey((k) => k + 1);
      showNotification(C.snackDeleted);
    } catch (err) {
      console.warn("Respuesta del delete:", err);
      setDialogError(err.message || "No se pudo eliminar la publicación");
      showNotification(
        err.message || "No se pudo eliminar la publicación",
        "error",
      );
    } finally {
      setDialogSaving(false);
    }
  };

  const columns = useMemo(
    () =>
      generateColumns(
        EMPTY_PUBLICATION,
        handleCardClick,
        handleEdit,
        openDeletePublication,
      ),
    [handleCardClick, handleEdit, openDeletePublication],
  );

  return (
    <PressContext.Provider
      value={{
        loading,
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
        getImageSource,
        getDocumentName,
        getDocumentExtension,
        ...publication,
        rows,
        columns,
        handleDeleteConfirm,
      }}
    >
      {children}
    </PressContext.Provider>
  );
}
