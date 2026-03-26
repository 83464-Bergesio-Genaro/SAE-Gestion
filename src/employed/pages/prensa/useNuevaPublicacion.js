// Feature hook: encapsulates all state and business-logic for the
// "Nueva Publicación" dialog, keeping NuevaPublicacionDialog purely presentational.

import { useState, useMemo, useEffect } from "react";
import {
  crearPublicacion,
  modificarPublicacion,
  crearDocumentoPrensa,
  crearVinculoDocPubli,
  descargarDocumentoPorId,
  listarDocumentosSinData,
} from "../../../api/PrensaService";
import {
  toIsoWithFixedTime,
  toDateInputValue,
  isPdfDocument,
  emptyPublicacion,
  DOCS_PER_PAGE,
} from "./prensa.utils";
import { PRENSA_STRINGS as PS } from "./prensa.strings";

const INITIAL_PREVIEW = {
  open: false,
  loading: false,
  title: "",
  imageSrc: null,
  isPdf: false,
  error: null,
};

/**
 * @param {object} opts
 * @param {function} opts.onSuccess   Called after a publication is successfully created.
 * @param {function} opts.onWarning   Called with a message when creation partially failed.
 * @param {function} opts.onError     Called with a message on hard failure.
 */
export function useNuevaPublicacion({ onSuccess, onWarning, onError }) {
  // Dialog open/close
  const [open, setOpen] = useState(false);

  // null = create mode, number = edit mode
  const [editId, setEditId] = useState(null);

  // Form data
  const [nuevaData, setNuevaData] = useState(null);

  // Saving
  const [saving, setSaving] = useState(false);

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
      .catch((err) => console.error("Error al cargar documentos existentes:", err))
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
        d.extension?.toLowerCase().includes(t)
    );
  }, [documentosExistentes, busquedaDoc]);

  const totalPages = Math.max(1, Math.ceil(docsFiltrados.length / DOCS_PER_PAGE));

  const docsPaginados = useMemo(
    () =>
      docsFiltrados.slice(
        (page - 1) * DOCS_PER_PAGE,
        page * DOCS_PER_PAGE
      ),
    [docsFiltrados, page]
  );

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  function openDialog() {
    setNuevaData(emptyPublicacion());
    setOpen(true);
  }

  function openEdit(pub) {
    setEditId(pub.id);
    setNuevaData({
      titulo_publicacion: pub.titulo_publicacion || "",
      descripcion: pub.descripcion || "",
      fecha_inicio: toDateInputValue(pub.fecha_inicio),
      fecha_vigencia: toDateInputValue(pub.fecha_vigencia),
      prioridad: pub.prioridad ?? 0,
      no_dar_baja: pub.no_dar_baja ?? false,
      visualizaciones: pub.visualizaciones ?? 0,
    });
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
    setEditId(null);
    setNuevaData(null);
    setArchivo(null);
    setDocMode("subir");
    setDocSeleccionado("");
    setBusquedaDoc("");
    setPage(1);
    setDocumentosExistentes([]);
  }

  function handleChange(field, value) {
    setNuevaData((prev) => ({ ...prev, [field]: value }));
  }

  function handleDocModeChange(mode) {
    setDocMode(mode);
    setArchivo(null);
    setDocSeleccionado("");
  }

  async function handlePreview(id, nombre) {
    setPreview({ open: true, loading: true, title: nombre, imageSrc: null, isPdf: false, error: null });
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
      setPreview((prev) => ({ ...prev, loading: false, error: "No se pudo cargar el documento" }));
    }
  }

  function closePreview() {
    setPreview((prev) => ({ ...prev, open: false }));
  }

  async function handleSave() {
    if (!nuevaData) return;
    setSaving(true);
    const isEdit = editId !== null;
    try {
      const body = {
        ...nuevaData,
        fecha_inicio: toIsoWithFixedTime(nuevaData.fecha_inicio, false),
        fecha_vigencia: toIsoWithFixedTime(nuevaData.fecha_vigencia, true),
      };

      let pubId;
      if (isEdit) {
        await modificarPublicacion(editId, body);
        pubId = editId;
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
      console.error(isEdit ? "Error al guardar:" : "Error al crear publicación:", err);
      onError?.(isEdit ? PS.snackErrorSave : PS.snackErrorCreate);
    } finally {
      setSaving(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Exposed interface — grouped to minimise prop drilling
  // ---------------------------------------------------------------------------

  /** All state values the dialog needs to render. */
  const state = {
    open,
    nuevaData,
    saving,
    isEdit: editId !== null,
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
  };

  /** All action callbacks the dialog needs to interact. */
  const actions = {
    open: openDialog,
    openEdit,
    close: closeDialog,
    handleChange,
    handleDocModeChange,
    setArchivo,
    setDocSeleccionado,
    setBusquedaDoc,
    setPage,
    handlePreview,
    closePreview,
    handleSave,
  };

  return { state, actions };
}
