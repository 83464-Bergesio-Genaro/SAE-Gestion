import { useCallback, useEffect, useMemo, useState } from "react";
import { Chip, IconButton, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useNavigate } from "react-router-dom";
import * as api from "../../../api/DeporteService";
import {
  validateDeporte,
  validateDeportista,
  validateDocente,
  validateEspacio,
} from "../../pages/sports/sports.validations";
import { SportsContext } from "../employedContext";
import { formatDate, generateColumns } from "../../../utils/util.jsx";

const EMPTY = {
  docente: {
    cuil: "",
    nombres: "",
    apellidos: "",
    activo: true,
    fecha_nacimiento: "",
  },
  espacio: { id: 0, nombre: "", domicilio: "", activo: true, url_maps: "" },
  deportista: {
    id: 0,
    legajo: "",
    habilitado_deportado: true,
    vencimiento_ficha: "",
    habilitado_deporte: true,
  },
  deporte: { id: 0, nombre: "", activo: true },
};
const inputDate = (value) => (value ? value.split("T")[0] : "");

export function SportsProvider({ children, autoLoad = true }) {
  const navigate = useNavigate();
  const [torneosRows, setTorneosRows] = useState([]);
  const [profesoresRows, setProfesoresRows] = useState([]);
  const [espaciosRows, setEspaciosRows] = useState([]);
  const [deportistasRows, setDeportistasRows] = useState([]);
  const [deportesRows, setDeportesRows] = useState([]);
  const [loadingTorneos, setLoadingTorneos] = useState(false);
  const [loadingProfesores, setLoadingProfesores] = useState(false);
  const [loadingEspacios, setLoadingEspacios] = useState(false);
  const [loadingDeportistas, setLoadingDeportistas] = useState(false);
  const [loadingDeportes, setLoadingDeportes] = useState(false);
  const [torneoFormOpen, setTorneoFormOpen] = useState(false);
  const [horariosDialogOpen, setHorariosDialogOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("docente");
  const [dialogMode, setDialogMode] = useState("create");
  const [dialogData, setDialogData] = useState(EMPTY.docente);
  const [dialogSaving, setDialogSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [dialogFieldErrors, setDialogFieldErrors] = useState({});

  const [docsDialogOpen, setDocsDialogOpen] = useState(false);
  const [docsLegajo, setDocsLegajo] = useState("");
  const [docsList, setDocsList] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [docsError, setDocsError] = useState("");
  const [downloadingDocId, setDownloadingDocId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewSrc, setPreviewSrc] = useState(null);
  const [previewIsPdf, setPreviewIsPdf] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [previewDocRef, setPreviewDocRef] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const load = useCallback(async (setter, loading, request, map = (x) => x) => {
    loading(true);
    try {
      setter((await request()).map(map));
    } catch {
      setter([]);
    } finally {
      loading(false);
    }
  }, []);
  const fetchProfesores = useCallback(
    () =>
      load(
        setProfesoresRows,
        setLoadingProfesores,
        api.obtenerDocentesDeportivos,
        (x, i) => ({ ...x, id: x.cuil || i }),
      ),
    [load],
  );
  const fetchEspacios = useCallback(
    () =>
      load(setEspaciosRows, setLoadingEspacios, api.obtenerEspaciosDeportivos),
    [load],
  );
  const fetchTorneos = useCallback(
    () => load(setTorneosRows, setLoadingTorneos, api.obtenerTorneosDeportivos),
    [load],
  );
  const fetchDeportistas = useCallback(
    () =>
      load(setDeportistasRows, setLoadingDeportistas, api.obtenerDeportistas),
    [load],
  );
  const fetchDeportes = useCallback(
    () =>
      load(setDeportesRows, setLoadingDeportes, api.obtenerDeportesCompleto),
    [load],
  );

  useEffect(() => {
    if (!autoLoad) return;
    fetchProfesores();
    fetchEspacios();
    fetchTorneos();
    fetchDeportistas();
    fetchDeportes();
  }, [
    autoLoad,
    fetchDeportes,
    fetchDeportistas,
    fetchEspacios,
    fetchProfesores,
    fetchTorneos,
  ]);

  const open = useCallback((type, mode, data) => {
    setDialogType(type);
    setDialogMode(mode);
    setDialogData(data);
    setDialogError("");
    setDialogFieldErrors({});
    setDialogOpen(true);
  }, []);
  const openCreateDocente = useCallback(
    () => open("docente", "create", EMPTY.docente),
    [open],
  );
  const openCreateEspacio = useCallback(
    () => open("espacio", "create", EMPTY.espacio),
    [open],
  );
  const openCreateDeportista = useCallback(
    () => open("deportista", "create", EMPTY.deportista),
    [open],
  );
  const openCreateDeporte = useCallback(
    () => open("deporte", "create", EMPTY.deporte),
    [open],
  );
  const openEditDocente = useCallback(
    (x) =>
      open("docente", "edit", {
        cuil: x.cuil,
        nombres: x.nombres,
        apellidos: x.apellidos,
        activo: x.activo,
        fecha_nacimiento: inputDate(x.fecha_nacimiento),
      }),
    [open],
  );
  const openEditEspacio = useCallback(
    (x) =>
      open("espacio", "edit", {
        id: x.id,
        nombre: x.nombre,
        domicilio: x.domicilio,
        activo: x.activo,
        url_maps: x.url_maps,
      }),
    [open],
  );
  const openEditDeportista = useCallback(
    (x) =>
      open("deportista", "edit", {
        id: x.id,
        legajo: x.legajo,
        habilitado_deportado: x.habilitado_deportado,
        vencimiento_ficha: inputDate(x.vencimiento_ficha),
        habilitado_deporte: x.habilitado_deporte,
      }),
    [open],
  );
  const openEditDeporte = useCallback(
    (x) =>
      open("deporte", "edit", { id: x.id, nombre: x.nombre, activo: x.activo }),
    [open],
  );

  const openDocsDialog = useCallback(async (legajo) => {
    setDocsLegajo(legajo);
    setDocsList([]);
    setDocsError("");
    setLoadingDocs(true);
    setDocsDialogOpen(true);
    try {
      setDocsList(await api.listarDocumentacionXLegajo(legajo));
    } catch (e) {
      setDocsError(e.message || "Error al cargar documentación");
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  const handlePreviewDoc = useCallback(async (doc) => {
    setPreviewTitle(doc.nombre_documento);
    setPreviewSrc(null);
    setPreviewError("");
    setPreviewIsPdf(false);
    setPreviewDocRef(doc);
    setLoadingPreview(true);
    setPreviewOpen(true);
    try {
      const response = await api.descargarDocumentacionXId(doc.id);
      const data = Array.isArray(response) ? response[0] : response;
      const ext = (data.extension || doc.extension || "").toLowerCase();
      let src = data.datos_documento;
      if (!src.startsWith("data:")) {
        const mime =
          {
            pdf: "application/pdf",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            webp: "image/webp",
          }[ext] || "application/octet-stream";
        src = `data:${mime};base64,${src}`;
      }
      setPreviewSrc(src);
      setPreviewIsPdf(ext === "pdf");
    } catch (e) {
      setPreviewError(e.message || "Error al cargar el documento");
    } finally {
      setLoadingPreview(false);
    }
  }, []);

  const handleDownloadDoc = useCallback(async (id, name, extension) => {
    setDownloadingDocId(id);
    try {
      const response = await api.descargarDocumentacionXId(id);
      const data = Array.isArray(response) ? response[0] : response;
      let base64 = data.datos_documento;
      if (base64.startsWith("data:")) base64 = base64.split(",")[1];
      const chars = atob(base64);
      const bytes = Uint8Array.from(chars, (char) => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes]));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${data.nombre_documento || name}.${data.extension || extension}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingDocId(null);
    }
  }, []);

  const handleDialogChange = useCallback((field, value) => {
    setDialogData((x) => ({ ...x, [field]: value }));
    setDialogFieldErrors((x) => (x[field] ? { ...x, [field]: undefined } : x));
  }, []);

  const executeSave = useCallback(async () => {
    setDialogSaving(true);
    try {
      if (dialogType === "docente") {
        const body = {
          ...dialogData,
          fecha_nacimiento: dialogData.fecha_nacimiento
            ? `${dialogData.fecha_nacimiento}T00:00:00`
            : null,
        };
        await (dialogMode === "create"
          ? api.crearDocenteDeportivo(body)
          : api.modificarDocenteDeportivo(dialogData.cuil, body));
        await fetchProfesores();
      } else if (dialogType === "espacio") {
        await (dialogMode === "create"
          ? api.crearEspacioDeportivo(dialogData)
          : api.modificarEspacioDeportivo(dialogData.id, dialogData));
        await fetchEspacios();
      } else if (dialogType === "deportista") {
        const body = {
          ...dialogData,
          vencimiento_ficha: dialogData.vencimiento_ficha
            ? `${dialogData.vencimiento_ficha}T00:00:00`
            : null,
        };
        await (dialogMode === "create"
          ? api.crearDeportista(body)
          : api.modificarDeportista(dialogData.id, body));
        await fetchDeportistas();
      } else {
        await (dialogMode === "create"
          ? api.crearDeporte(dialogData)
          : api.modificarDeporte(dialogData.id, dialogData));
        if (dialogMode === "edit") {
          setSnackbarMsg("Deporte modificado correctamente");
          setSnackbarOpen(true);
        }
        await fetchDeportes();
      }
      setDialogOpen(false);
    } catch (e) {
      setDialogError(e.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  }, [
    dialogData,
    dialogMode,
    dialogType,
    fetchDeportes,
    fetchDeportistas,
    fetchEspacios,
    fetchProfesores,
  ]);

  const handleDialogSave = useCallback(() => {
    const validators = {
      docente: () => validateDocente(dialogData, dialogMode),
      espacio: () => validateEspacio(dialogData),
      deportista: () => validateDeportista(dialogData, dialogMode),
      deporte: () => validateDeporte(dialogData),
    };
    const errors = validators[dialogType]?.() || {};
    setDialogFieldErrors(errors);
    setDialogError("");
    if (!Object.keys(errors).length) executeSave();
  }, [dialogData, dialogMode, dialogType, executeSave]);

  const booleanColumn = (yes = "Activo", no = "Inactivo") => ({
    width: 120,
    flex: 0,
    renderCell: ({ value }) => (
      <Chip
        size="small"
        label={value ? yes : no}
        color={value ? "success" : "default"}
      />
    ),
  });
  const actionColumn = (renderCell, width = 70) => ({
    field: "acciones",
    headerName: "Acciones",
    width,
    sortable: false,
    filterable: false,
    headerAlign: "center",
    align: "center",
    renderCell,
  });

  const profesoresColumns = useMemo(
    () =>
      generateColumns(profesoresRows, {
        overrides: {
          cuil: { headerName: "CUIL", width: 150, flex: 0 },
          activo: booleanColumn(),
          fecha_nacimiento: {
            headerName: "Fecha de nacimiento",
            width: 170,
            flex: 0,
            valueFormatter: formatDate,
          },
        },
        actions: actionColumn(({ row }) => (
          <IconButton size="small" onClick={() => openEditDocente(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        )),
      }),
    [openEditDocente, profesoresRows],
  );
  const espaciosColumns = useMemo(
    () =>
      generateColumns(espaciosRows, {
        overrides: { activo: booleanColumn() },
        actions: actionColumn(({ row }) => (
          <IconButton size="small" onClick={() => openEditEspacio(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        )),
      }),
    [espaciosRows, openEditEspacio],
  );
  const deportistasColumns = useMemo(
    () =>
      generateColumns(deportistasRows, {
        overrides: {
          habilitado_deportado: booleanColumn("Sí", "No"),
          habilitado_deporte: booleanColumn("Sí", "No"),
          vencimiento_ficha: {
            headerName: "Venc. ficha",
            width: 140,
            flex: 0,
            valueFormatter: formatDate,
          },
        },
        actions: actionColumn(
          ({ row }) => (
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => openEditDeportista(row)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                title="Ver documentación"
                onClick={() => openDocsDialog(row.legajo)}
              >
                <FolderOpenIcon fontSize="small" />
              </IconButton>
            </Stack>
          ),
          110,
        ),
      }),
    [deportistasRows, openDocsDialog, openEditDeportista],
  );
  const deportesColumns = useMemo(
    () =>
      generateColumns(deportesRows, {
        overrides: { activo: booleanColumn() },
        actions: actionColumn(({ row }) => (
          <IconButton size="small" onClick={() => openEditDeporte(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        )),
      }),
    [deportesRows, openEditDeporte],
  );
  const torneosColumns = useMemo(
    () =>
      generateColumns(torneosRows, {
        overrides: {
          fecha_inicio: { width: 120, flex: 0, valueFormatter: formatDate },
          fecha_fin: { width: 120, flex: 0, valueFormatter: formatDate },
          cupo_jugadores: { headerName: "Cupo", width: 80, flex: 0 },
        },
        actions: actionColumn(({ row }) => (
          <IconButton
            size="small"
            onClick={() => navigate(`/Gestion-Torneos/${row.id}`)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )),
      }),
    [navigate, torneosRows],
  );

  const value = {
    torneosRows,
    loadingTorneos,
    torneoFormOpen,
    setTorneoFormOpen,
    fetchTorneos,
    profesoresRows,
    loadingProfesores,
    espaciosRows,
    loadingEspacios,
    deportistasRows,
    loadingDeportistas,
    deportesRows,
    loadingDeportes,
    dialogOpen,
    setDialogOpen,
    dialogType,
    dialogMode,
    dialogData,
    dialogSaving,
    dialogError,
    setDialogError,
    dialogFieldErrors,
    horariosDialogOpen,
    setHorariosDialogOpen,
    docsDialogOpen,
    setDocsDialogOpen,
    docsLegajo,
    docsList,
    loadingDocs,
    docsError,
    downloadingDocId,
    previewOpen,
    setPreviewOpen,
    previewTitle,
    previewSrc,
    previewIsPdf,
    loadingPreview,
    previewError,
    previewDocRef,
    snackbarOpen,
    setSnackbarOpen,
    snackbarMsg,
    openCreateDocente,
    openEditDocente,
    openCreateEspacio,
    openEditEspacio,
    openCreateDeportista,
    openEditDeportista,
    openCreateDeporte,
    openEditDeporte,
    openDocsDialog,
    handlePreviewDoc,
    handleDownloadDoc,
    handleDialogChange,
    handleDialogSave,
    profesoresColumns,
    espaciosColumns,
    deportistasColumns,
    deportesColumns,
    torneosColumns,
    obtenerTorneosDeportivos: api.obtenerTorneosDeportivos,
    crearTorneo: api.crearTorneo,
    obtenerTorneoXId: api.obtenerTorneoXId,
    modificarTorneo: api.modificarTorneo,
    obtenerDeportistasXTorneo: api.obtenerDeportistasXTorneo,
    crearInscripcionTorneo: api.crearInscripcionTorneo,
    eliminarInscripcionTorneo: api.eliminarInscripcionTorneo,
    obtenerDeportistas: api.obtenerDeportistas,
    obtenerDeportesActivos: api.obtenerDeportesActivos,
    obtenerHorariosXDeporte: api.obtenerHorariosXDeporte,
    crearHorarioDeportivo: api.crearHorarioDeportivo,
    modificarHorarioDeportivo: api.modificarHorarioDeportivo,
    eliminarHorarioDeportivo: api.eliminarHorarioDeportivo,
    obtenerDocentesDeportivos: api.obtenerDocentesDeportivos,
    obtenerEspaciosDeportivos: api.obtenerEspaciosDeportivos,
    obtenerDeportesCompleto: api.obtenerDeportesCompleto,
  };
  return (
    <SportsContext.Provider value={value}>{children}</SportsContext.Provider>
  );
}
