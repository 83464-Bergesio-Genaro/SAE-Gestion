import { useState, useEffect, useCallback, useMemo } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNuevaPublicacion } from "../../pages/prensa/useNuevaPublicacion";
import { useNotification } from "../../../shared/context/sharedContext";

import { booleanChip, prioridadChip } from "../../../utils/datagrid.utils.jsx";
import { PressContext } from "../employedContext";
import { PRENSA_STRINGS } from "../../../utils/strings/employed.strings";
import {
  listarDocumentosPorPublicacion,
  listarPublicacionesCompleto,
  eliminarPublicacion,
  descargarDocumentoPorId,
} from "../../../api/PrensaService";

import {
  getDocumentExtension,
  getDocumentId,
  getDocumentName,
  getImageSource,
  isPreviewableDocument,
} from "../../../utils/documents.utils.js";
import { EMPTY_PUBLICACION } from "../../../utils/common/common.config";
import {
  generateRows,
  generateColumns,
} from "../../../utils/datagrid.utils.jsx";

const C = PRENSA_STRINGS;


export function PressProvider({ children }) {
  const {
    showNotification,
    dialogData,
    setDialogError,
    setDialogSaving,
    closeDialog,
    openDialog,
  } = useNotification();

  const [publicacionesRows, setPublicacionesRows] = useState([]);
  const [publicacionesLoading, setLoadingpublicaciones] = useState(true);

  const fetchPublicaciones = useCallback(async () => {
    setLoadingpublicaciones(true);
    try {
      const data = await listarPublicacionesCompleto();
      setPublicacionesRows(generateRows(data));
    } catch (err) {
      console.error(C.errorLoadPublicaciones, err);
      showNotification(C.errorLoadPublicaciones, "error");
      setPublicacionesRows([]);
    } finally {
      setLoadingpublicaciones(false);
    }
  }, [showNotification]);

  const publication = useNuevaPublicacion({
    onSuccess: (isEdit) => {
      fetchPublicaciones();
      showNotification(isEdit ? C.snackSaved : C.snackCreated, "success");
    },
    onWarning: (message) => showNotification(message, "warning"),
    onError: (message) => showNotification(message, "error"),
  });

  const openCreatePublicacion = publication.openCreatePublication;

  const openEditPublicacion = useCallback(
    (row) => {
      publication.openEditPublication(row);
    },
    [publication],
  );
  const openDeletePublicacion = useCallback(
    (row) => {
      openDialog("pressPublicationDelete", "delete", row);
    },
    [openDialog],
  );

  useEffect(() => {
    fetchPublicaciones();
  }, [fetchPublicaciones]);

  const handleEditPublicacion = useCallback(
    (pub) => {
      openEditPublicacion(pub);
    },
    [openEditPublicacion],
  );

  const handleDeletePublicacion = useCallback(
    (pub) => {
      openDeletePublicacion(pub);
    },
    [openDeletePublicacion],
  );

  const handlePreviewPublicacion = useCallback(async (pub) => {
    setSelectedPub(pub);
    setLoadingDocs(true);
    setDocumentos([]);
    try {
      const data = await listarDocumentosPorPublicacion(pub.id);
      setDocumentos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(C.errorLoadDocumentos, err);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  const publicacionesActions = useMemo(
    () => [
      {
        icon: VisibilityIcon,
        color: "primary",
        title: "Vista previa",
        onClick: handlePreviewPublicacion,
      },
      {
        icon: EditIcon,
        color: "primary",
        title: "Editar publicación",
        onClick: handleEditPublicacion,
      },
      {
        icon: DeleteIcon,
        color: "error",
        title: "Eliminar publicación",
        onClick: handleDeletePublicacion,
      },
    ],
    [handleEditPublicacion, handleDeletePublicacion, handlePreviewPublicacion],
  );

  const publicacionesColumns = useMemo(() => {
    return generateColumns(EMPTY_PUBLICACION, publicacionesActions, {
      prioridad: {
        headerName: "Prioridad",
        align: "center",
        headerAlign: "center",
        minWidth: 120,
        flex: 0,
        renderCell: (params) => prioridadChip(params.value),
      },
      no_dar_baja: {
        headerName: "No dar de baja",
        align: "center",
        headerAlign: "center",
        minWidth: 150,
        flex: 0,
        renderCell: (params) => booleanChip(params.value),
      },
    });
  }, [publicacionesActions]);

  const [selectedPub, setSelectedPub] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewDocName, setPreviewDocName] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const handleCardClick = useCallback(
    async (pub) => {
      setSelectedPub(pub);
      setLoadingDocs(true);
      setDocumentos([]);
      try {
        const data = await listarDocumentosPorPublicacion(pub.id);
        setDocumentos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(C.errorLoadDocumentos, err);
        showNotification(C.errorLoadDocumentos, "error");
      } finally {
        setLoadingDocs(false);
      }
    },
    [showNotification],
  );

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

  const handleDeleteConfirm = async () => {
    if (!dialogData?.id) return;
    setDialogSaving(true);
    setDialogError("");
    try {
      await eliminarPublicacion(dialogData.id);
      closeDialog();
      await fetchPublicaciones();
      showNotification(C.snackDeleted, "success");
    } catch (err) {
      console.warn("Respuesta del delete:", err);
      setDialogError(err.message || C.snackErrorDelete);
      showNotification(err.message || C.snackErrorDelete, "error");
    } finally {
      setDialogSaving(false);
    }
  };

  return (
    <PressContext.Provider
      value={{
        publicacionesRows,
        publicacionesColumns,
        publicacionesLoading,
        fetchPublicaciones,
        openCreatePublicacion,
        openEditPublicacion,
        openDeletePublicacion,

        loading: publicacionesLoading,
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
        rows: publicacionesRows,

        handleDeleteConfirm,
      }}
    >
      {children}
    </PressContext.Provider>
  );
}
