// Feature hook: encapsulates all state and business-logic for the
// "Nueva Publicación" dialog, keeping NuevaPublicacionDialog purely presentational.

import { useState, useMemo, useEffect } from "react";
import { useNotification } from "../../../shared/context/sharedContext";
import {
  crearPublicacion,
  modificarPublicacion,
  crearDocumentoPrensa,
  crearVinculoDocPubli,
  descargarDocumentoPorId,
  listarDocumentosSinData,
} from "../../../api/PrensaService";
import {
  normalizeDateInput,
  toApiDateTimeWithFixedTime,
} from "../../../utils/date.utils";
import { isPdfDocument } from "../../../utils/documents.utils";
import {
  EMPTY_PUBLICACION,
  INITIAL_PREVIEW,
} from "../../../utils/common/common.config";
import { DOCS_PER_PAGE } from "../../../utils/common/constants";
import { PRENSA_STRINGS as PS } from "../../../utils/strings/employed.strings";

/**
 * @param {object} opts
 * @param {function} opts.onSuccess   Called after a publication is successfully created.
 * @param {function} opts.onWarning   Called with a message when creation partially failed.
 * @param {function} opts.onError     Called with a message on hard failure.
 */
export function useNuevaPublicacion({ onSuccess, onWarning, onError }) {
  const {
    dialogOpen,
    dialogData,
    dialogType,
    dialogMode,
    setDialogSaving,
    setDialogError,
    openDialog: openGlobalDialog,
    closeDialog: closeGlobalDialog,
  } = useNotification();

  const open = dialogOpen && dialogType === "pressPublication";
  const nuevaData = dialogData;
  const isEdit = dialogMode === "edit";

  // Document mode: "subir" | "existente"
  const [docMode, setDocMode] = useState("subir");
  const [archivo, setArchivo] = useState(null);
  const [docSeleccionado, setDocSeleccionado] = useState("");

  // Existing-document selector
  const [documentosExistentes, setDocumentosExistentes] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [busquedaDoc, setBusquedaDoc] = useState("");
  const [page, setPage] = useState(1);

  // Preview dialog
  const [preview, setPreview] = useState(INITIAL_PREVIEW);

  // Load existing documents whenever the dialog opens
  useEffect(() => {
    if (!open) return;
    setLoadingDocs(true);
    listarDocumentosSinData()
      .then((data) => setDocumentosExistentes(Array.isArray(data) ? data : []))
      .catch((err) =>
        console.error("Error al cargar documentos existentes:", err),
      )
      .finally(() => setLoadingDocs(false));
  }, [open]);

  // ---------------------------------------------------------------------------
  // Derived / computed
  // ---------------------------------------------------------------------------
  const docsFiltrados = useMemo(() => {
    if (!busquedaDoc.trim()) return documentosExistentes;
    const t = busquedaDoc.toLowerCase();
    return documentosExistentes.filter(
      (d) =>
        d.nombre_documento?.toLowerCase().includes(t) ||
        d.extension?.toLowerCase().includes(t),
    );
  }, [documentosExistentes, busquedaDoc]);

  const totalPages = Math.max(
    1,
    Math.ceil(docsFiltrados.length / DOCS_PER_PAGE),
  );

  const docsPaginados = useMemo(
    () => docsFiltrados.slice((page - 1) * DOCS_PER_PAGE, page * DOCS_PER_PAGE),
    [docsFiltrados, page],
  );

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  function openDialog() {
    openGlobalDialog("pressPublication", "create", { ...EMPTY_PUBLICACION });
  }

  function openEdit(pub) {
    openGlobalDialog("pressPublication", "edit", {
      id: pub.id,
      titulo_publicacion: pub.titulo_publicacion || "",
      descripcion: pub.descripcion || "",
      fecha_inicio: normalizeDateInput(pub.fecha_inicio),
      fecha_vigencia: normalizeDateInput(pub.fecha_vigencia),
      prioridad: pub.prioridad ?? 0,
      no_dar_baja: pub.no_dar_baja ?? false,
      visualizaciones: pub.visualizaciones ?? 0,
    });
  }

  function closeDialog() {
    closeGlobalDialog();
    setArchivo(null);
    setDocMode("subir");
    setDocSeleccionado("");
    setBusquedaDoc("");
    setPage(1);
    setDocumentosExistentes([]);
  }

  function handleDocModeChange(mode) {
    setDocMode(mode);
    setArchivo(null);
    setDocSeleccionado("");
  }

  async function handlePreview(id, nombre) {
    setPreview({
      open: true,
      loading: true,
      title: nombre,
      imageSrc: null,
      isPdf: false,
      error: null,
    });
    try {
      const data = await descargarDocumentoPorId(id);
      setPreview({
        open: true,
        loading: false,
        title: nombre,
        imageSrc: data.datos_documento,
        isPdf: isPdfDocument(data),
        error: null,
      });
    } catch {
      setPreview((prev) => ({
        ...prev,
        loading: false,
        error: "No se pudo cargar el documento",
      }));
    }
  }

  function closePreview() {
    setPreview((prev) => ({ ...prev, open: false }));
  }

  async function handleSave() {
    if (!nuevaData) return;
    setDialogSaving(true);
    setDialogError("");
    try {
      const body = {
        ...nuevaData,
        fecha_inicio: toApiDateTimeWithFixedTime(nuevaData.fecha_inicio),
        fecha_vigencia: toApiDateTimeWithFixedTime(
          nuevaData.fecha_vigencia,
          true,
        ),
      };

      let pubId;
      if (isEdit) {
        await modificarPublicacion(nuevaData.id, body);
        pubId = nuevaData.id;
      } else {
        body.id = 0;
        const created = await crearPublicacion(body);
        pubId = created?.id;
      }

      if (pubId) {
        if (docMode === "subir" && archivo) {
          const formData = new FormData();
          formData.append("archivo", archivo);
          let doc;
          try {
            doc = await crearDocumentoPrensa(formData);
          } catch (err) {
            console.error("Error al subir documento:", err);
            onWarning?.(PS.snackWarnDocUpload);
            closeDialog();
            onSuccess?.(isEdit);
            return;
          }
          if (doc?.id) {
            try {
              await crearVinculoDocPubli(pubId, doc.id);
            } catch (err) {
              console.error("Error al vincular documento:", err);
              onWarning?.(PS.snackWarnDocLink);
              closeDialog();
              onSuccess?.(isEdit);
              return;
            }
          }
        } else if (docMode === "existente" && docSeleccionado) {
          try {
            await crearVinculoDocPubli(pubId, docSeleccionado);
          } catch (err) {
            console.error("Error al vincular documento existente:", err);
            onWarning?.(PS.snackWarnDocLink);
            closeDialog();
            onSuccess?.(isEdit);
            return;
          }
        }
      }

      closeDialog();
      onSuccess?.(isEdit);
    } catch (err) {
      console.error(
        isEdit ? "Error al guardar:" : "Error al crear publicación:",
        err,
      );
      const fallbackMessage = isEdit ? PS.snackErrorSave : PS.snackErrorCreate;
      const errorMessage = err?.message || fallbackMessage;
      setDialogError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setDialogSaving(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Exposed interface — grouped to minimise prop drilling
  // ---------------------------------------------------------------------------

  /** All state values the dialog needs to render. */
  return {
    docMode,
    archivo,
    docSeleccionado,
    loadingDocs,
    busquedaDoc,
    page,
    docsFiltrados,
    docsPaginados,
    totalPages,
    preview,
    openCreatePublication: openDialog,
    openEditPublication: openEdit,
    handleDocModeChange,
    setArchivo,
    setDocSeleccionado,
    setBusquedaDoc,
    setPage,
    handlePreview,
    closePreview,
    handleSavePublication: handleSave,
  };
}
