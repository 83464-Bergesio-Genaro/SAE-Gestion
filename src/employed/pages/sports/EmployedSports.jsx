import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    Stack,
    Typography,
    Card,
    CardContent,
    Chip,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    FormControlLabel,
    Switch,
    CircularProgress,
    Alert,
    Snackbar,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import SportsCalendar from "./SportsCalendar";
import GestionarHorariosDialog from "./GestionarHorariosDialog";
import { DataGrid } from "@mui/x-data-grid";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import { useAuth } from "../../../shared/auth/AuthContext";
import TorneoFormDialog from "./TorneoFormDialog";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import {
    obtenerDocentesDeportivos,
    crearDocenteDeportivo,
    modificarDocenteDeportivo,
    obtenerEspaciosDeportivos,
    crearEspacioDeportivo,
    modificarEspacioDeportivo,
    obtenerDeportistas,
    crearDeportista,
    modificarDeportista,
    listarDocumentacionXLegajo,
    descargarDocumentacionXId,
    obtenerTorneosDeportivos,
    crearTorneo,
    obtenerDeportesCompleto,
    crearDeporte,
    modificarDeporte,
} from "../../../api/DeporteService";

const EMPTY_DOCENTE = {
    cuil: "",
    nombres: "",
    apellidos: "",
    activo: true,
    fecha_nacimiento: "",
};

const EMPTY_ESPACIO = {
    id: 0,
    nombre: "",
    domicilio: "",
    activo: true,
    url_maps: "",
};

const EMPTY_DEPORTISTA = {
    id: 0,
    legajo: "",
    habilitado_deportado: true,
    vencimiento_ficha: "",
    habilitado_deporte: true,
};

const EMPTY_DEPORTE = {
    id: 0,
    nombre: "",
    activo: true,
};

function formatDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (isNaN(d)) return isoString;
    return d.toLocaleDateString("es-AR");
}

function isoToInputDate(isoString) {
    if (!isoString) return "";
    return isoString.split("T")[0];
}

export default function EmployedSports() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("profesores");
    const [busquedaGestion, setBusquedaGestion] = useState("");
    const [busquedaDeportes, setBusquedaDeportes] = useState("");

    const [torneosRows, setTorneosRows] = useState([]);
    const [loadingTorneos, setLoadingTorneos] = useState(false);
    const [torneoFormOpen, setTorneoFormOpen] = useState(false);

    const [profesoresRows, setProfesoresRows] = useState([]);
    const [loadingProfesores, setLoadingProfesores] = useState(false);

    const [espaciosRows, setEspaciosRows] = useState([]);
    const [loadingEspacios, setLoadingEspacios] = useState(false);

    const [deportistasRows, setDeportistasRows] = useState([]);
    const [loadingDeportistas, setLoadingDeportistas] = useState(false);

    const [deportesRows, setDeportesRows] = useState([]);
    const [loadingDeportes, setLoadingDeportes] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("docente"); // "docente" | "espacio" | "deportista" | "deporte"
    const [horariosDialogOpen, setHorariosDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("create");
    const [dialogData, setDialogData] = useState(EMPTY_DOCENTE);
    const [dialogSaving, setDialogSaving] = useState(false);
    const [dialogError, setDialogError] = useState("");

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

    const fetchProfesores = useCallback(async () => {
        setLoadingProfesores(true);
        try {
            const data = await obtenerDocentesDeportivos();
            setProfesoresRows(data.map((d, i) => ({ ...d, id: d.cuil || i })));
        } catch {
            setProfesoresRows([]);
        } finally {
            setLoadingProfesores(false);
        }
    }, []);

    useEffect(() => {
        fetchProfesores();
    }, [fetchProfesores]);

    const fetchEspacios = useCallback(async () => {
        setLoadingEspacios(true);
        try {
            const data = await obtenerEspaciosDeportivos();
            setEspaciosRows(data.map((e) => ({ ...e, id: e.id })));
        } catch {
            setEspaciosRows([]);
        } finally {
            setLoadingEspacios(false);
        }
    }, []);

    useEffect(() => {
        fetchEspacios();
    }, [fetchEspacios]);

    const fetchTorneos = useCallback(async () => {
        setLoadingTorneos(true);
        try {
            const data = await obtenerTorneosDeportivos();
            setTorneosRows(data.map((t) => ({ ...t, id: t.id })));
        } catch {
            setTorneosRows([]);
        } finally {
            setLoadingTorneos(false);
        }
    }, []);

    useEffect(() => {
        fetchTorneos();
    }, [fetchTorneos]);

    const fetchDeportistas = useCallback(async () => {        setLoadingDeportistas(true);
        try {
            const data = await obtenerDeportistas();
            setDeportistasRows(data.map((d) => ({ ...d, id: d.id })));
        } catch {
            setDeportistasRows([]);
        } finally {
            setLoadingDeportistas(false);
        }
    }, []);

    useEffect(() => {
        fetchDeportistas();
    }, [fetchDeportistas]);

    const fetchDeportes = useCallback(async () => {
        setLoadingDeportes(true);
        try {
            const data = await obtenerDeportesCompleto();
            setDeportesRows(data.map((d) => ({ ...d, id: d.id })));
        } catch {
            setDeportesRows([]);
        } finally {
            setLoadingDeportes(false);
        }
    }, []);

    useEffect(() => {
        fetchDeportes();
    }, [fetchDeportes]);

    const openCreateDocente = () => {
        setDialogData(EMPTY_DOCENTE);
        setDialogType("docente");
        setDialogMode("create");
        setDialogError("");
        setDialogOpen(true);
    };

    const openEditDocente = useCallback((row) => {
        setDialogData({
            cuil: row.cuil,
            nombres: row.nombres,
            apellidos: row.apellidos,
            activo: row.activo,
            fecha_nacimiento: isoToInputDate(row.fecha_nacimiento),
        });
        setDialogType("docente");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);

    const openCreateEspacio = () => {
        setDialogData(EMPTY_ESPACIO);
        setDialogType("espacio");
        setDialogMode("create");
        setDialogError("");
        setDialogOpen(true);
    };

    const openEditEspacio = useCallback((row) => {
        setDialogData({
            id: row.id,
            nombre: row.nombre,
            domicilio: row.domicilio,
            activo: row.activo,
            url_maps: row.url_maps,
        });
        setDialogType("espacio");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);

    const openDocsDialog = useCallback(async (legajo) => {
        setDocsLegajo(legajo);
        setDocsList([]);
        setDocsError("");
        setLoadingDocs(true);
        setDocsDialogOpen(true);
        try {
            const data = await listarDocumentacionXLegajo(legajo);
            setDocsList(data);
        } catch (err) {
            setDocsError(err.message || "Error al cargar documentación");
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
            const data = await descargarDocumentacionXId(doc.id);
            const fetched = Array.isArray(data) ? data[0] : data;
            const ext = (fetched.extension || doc.extension || "").toLowerCase();
            // Si datos_documento ya es un dataURL (comienza con data:), usarlo como está
            // Si no, es base64, convertirlo a dataURL
            let src = fetched.datos_documento;
            if (!src.startsWith("data:")) {
                const mimeMap = { pdf: "application/pdf", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp" };
                const mime = mimeMap[ext] || "application/octet-stream";
                src = `data:${mime};base64,${src}`;
            }
            setPreviewSrc(src);
            setPreviewIsPdf(ext === "pdf");
        } catch (err) {
            setPreviewError(err.message || "Error al cargar el documento");
        } finally {
            setLoadingPreview(false);
        }
    }, []);

    const handleDownloadDoc = useCallback(async (id, nombreDocumento, extension) => {
        setDownloadingDocId(id);
        try {
            const data = await descargarDocumentacionXId(id);
            const doc = Array.isArray(data) ? data[0] : data;
            let base64 = doc.datos_documento;
            
            // Si es un dataURL (comienza con data:), extraer la parte base64
            if (base64.startsWith("data:")) {
                base64 = base64.split(",")[1];
            }
            
            const byteChars = atob(base64);
            const byteArray = new Uint8Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) {
                byteArray[i] = byteChars.charCodeAt(i);
            }
            const blob = new Blob([byteArray]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${doc.nombre_documento || nombreDocumento}.${doc.extension || extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error al descargar documento:", err);
        } finally {
            setDownloadingDocId(null);
        }
    }, []);

    const openCreateDeportista = () => {
        setDialogData(EMPTY_DEPORTISTA);
        setDialogType("deportista");
        setDialogMode("create");
        setDialogError("");
        setDialogOpen(true);
    };

    const openEditDeportista = useCallback((row) => {
        setDialogData({
            id: row.id,
            legajo: row.legajo,
            habilitado_deportado: row.habilitado_deportado,
            vencimiento_ficha: isoToInputDate(row.vencimiento_ficha),
            habilitado_deporte: row.habilitado_deporte,
        });
        setDialogType("deportista");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);

    const openCreateDeporte = () => {
        setDialogData(EMPTY_DEPORTE);
        setDialogType("deporte");
        setDialogMode("create");
        setDialogError("");
        setDialogOpen(true);
    };

    const openEditDeporte = useCallback((row) => {
        setDialogData({
            id: row.id,
            nombre: row.nombre,
            activo: row.activo,
        });
        setDialogType("deporte");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);

    const handleDialogChange = (field, value) => {
        setDialogData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDialogSave = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
            if (dialogType === "docente") {
                const body = {
                    ...dialogData,
                    fecha_nacimiento: dialogData.fecha_nacimiento
                        ? `${dialogData.fecha_nacimiento}T00:00:00`
                        : null,
                };
                if (dialogMode === "create") {
                    await crearDocenteDeportivo(body);
                } else {
                    await modificarDocenteDeportivo(dialogData.cuil, body);
                }
                setDialogOpen(false);
                fetchProfesores();
            } else if (dialogType === "espacio") {
                const body = { ...dialogData };
                if (dialogMode === "create") {
                    await crearEspacioDeportivo(body);
                } else {
                    await modificarEspacioDeportivo(dialogData.id, body);
                }
                setDialogOpen(false);
                fetchEspacios();
            } else if (dialogType === "deportista") {
                const body = {
                    ...dialogData,
                    vencimiento_ficha: dialogData.vencimiento_ficha
                        ? `${dialogData.vencimiento_ficha}T00:00:00`
                        : null,
                };
                if (dialogMode === "create") {
                    await crearDeportista(body);
                } else {
                    await modificarDeportista(dialogData.id, body);
                }
                setDialogOpen(false);
                fetchDeportistas();
            } else if (dialogType === "deporte") {
                const body = { ...dialogData };
                if (dialogMode === "create") {
                    await crearDeporte(body);
                } else {
                    await modificarDeporte(dialogData.id, body);
                    setSnackbarMsg("Deporte modificado correctamente");
                    setSnackbarOpen(true);
                }
                setDialogOpen(false);
                fetchDeportes();
            }
        } catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };

    const profesoresColumns = useMemo(
        () => [
            { field: "cuil", headerName: "CUIL", width: 150 },
            { field: "nombres", headerName: "Nombres", flex: 1, minWidth: 150 },
            { field: "apellidos", headerName: "Apellidos", flex: 1, minWidth: 150 },
            {
                field: "activo",
                headerName: "Estado",
                width: 110,
                renderCell: (params) => (
                    <Chip
                        size="small"
                        label={params.value ? "Activo" : "Inactivo"}
                        color={params.value ? "success" : "default"}
                    />
                ),
            },
            {
                field: "fecha_nacimiento",
                headerName: "Fecha de nacimiento",
                width: 170,
                renderCell: (params) => formatDate(params.value),
            },
            {
                field: "acciones",
                headerName: "Acciones",
                width: 70,
                sortable: false,
                filterable: false,
                alignItem: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                        <IconButton size="small" onClick={() => openEditDocente(params.row)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ),
            },
        ],
        [openEditDocente]
    );

    const espaciosColumns = useMemo(
        () => [
            { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 160 },
            { field: "domicilio", headerName: "Domicilio", flex: 1, minWidth: 180 },
            {
                field: "activo",
                headerName: "Estado",
                width: 110,
                renderCell: (params) => (
                    <Chip
                        size="small"
                        label={params.value ? "Activo" : "Inactivo"}
                        color={params.value ? "success" : "default"}
                    />
                ),
            },
            { field: "url_maps", headerName: "URL Maps", flex: 1, minWidth: 180 },
            {
                field: "acciones",
                headerName: "Acciones",
                width: 70,
                sortable: false,
                filterable: false,
                alignItem: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                        <IconButton size="small" onClick={() => openEditEspacio(params.row)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ),
            },
        ],
        [openEditEspacio]
    );

    const deportistasColumns = useMemo(
        () => [
            { field: "legajo", headerName: "Legajo", width: 130 },
            { field: "nombre_deportista", headerName: "Nombre", flex: 1, minWidth: 160 },
            {
                field: "habilitado_deportado",
                headerName: "Habilitado",
                width: 120,
                renderCell: (params) => (
                    <Chip
                        size="small"
                        label={params.value ? "Sí" : "No"}
                        color={params.value ? "success" : "default"}
                    />
                ),
            },
            {
                field: "habilitado_deporte",
                headerName: "Hab. deporte",
                width: 130,
                renderCell: (params) => (
                    <Chip
                        size="small"
                        label={params.value ? "Sí" : "No"}
                        color={params.value ? "success" : "default"}
                    />
                ),
            },
            {
                field: "vencimiento_ficha",
                headerName: "Venc. ficha",
                width: 140,
                renderCell: (params) => formatDate(params.value),
            },
            {
                field: "acciones",
                headerName: "Acciones",
                width: 110,
                sortable: false,
                filterable: false,
                alignItem: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                        <Stack direction="row" spacing={0.5}>
                            <IconButton size="small" onClick={() => openEditDeportista(params.row)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" title="Ver documentación" onClick={() => openDocsDialog(params.row.legajo)}>
                                <FolderOpenIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Box>
                ),
            },
        ],
        [openEditDeportista, openDocsDialog]
    );

    const deportesColumns = useMemo(
        () => [
            { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 200 },
            {
                field: "activo",
                headerName: "Estado",
                width: 110,
                renderCell: (params) => (
                    <Chip
                        size="small"
                        label={params.value ? "Activo" : "Inactivo"}
                        color={params.value ? "success" : "default"}
                    />
                ),
            },
            {
                field: "acciones",
                headerName: "Acciones",
                width: 70,
                sortable: false,
                filterable: false,
                alignItem: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                        <IconButton size="small" onClick={() => openEditDeporte(params.row)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ),
            },
        ],
        [openEditDeporte]
    );

    const sectionConfig = useMemo(
        () => ({
            profesores: {
                title: "Gestión Profesores",
                icon: SchoolIcon,
                rows: profesoresRows,
                columns: profesoresColumns,
                loading: loadingProfesores,
            },
            espacios: {
                title: "Gestión Espacios Deportivos",
                icon: FitnessCenterIcon,
                rows: espaciosRows,
                columns: espaciosColumns,
                loading: loadingEspacios,
            },
            deportistas: {
                title: "Gestión Deportistas",
                icon: GroupsIcon,
                rows: deportistasRows,
                columns: deportistasColumns,
                loading: loadingDeportistas,
            },
            deportes: {
                title: "Gestión Deportes",
                icon: SportsSoccerIcon,
                rows: deportesRows,
                columns: deportesColumns,
                loading: loadingDeportes,
            },
        }),
        [profesoresRows, profesoresColumns, loadingProfesores, espaciosRows, espaciosColumns, loadingEspacios, deportistasRows, deportistasColumns, loadingDeportistas, deportesRows, deportesColumns, loadingDeportes]
    );

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setBusquedaGestion("");
    };

    const currentSection = useMemo(
        () => sectionConfig[activeSection],
        [activeSection, sectionConfig],
    );

    const rowsGestionFiltradas = useMemo(() => {
        const term = busquedaGestion.trim().toLowerCase();
        if (!term) return currentSection.rows;

        return currentSection.rows.filter((row) =>
            Object.values(row).some((value) =>
                String(value ?? "").toLowerCase().includes(term),
            ),
        );
    }, [currentSection.rows, busquedaGestion]);

    const rowsTorneosFiltradas = useMemo(() => {
        const term = busquedaDeportes.trim().toLowerCase();
        if (!term) return torneosRows;
        return torneosRows.filter((row) =>
            [row.nombre_torneo, row.nombre_deporte, row.docente_responsable].some((v) =>
                String(v ?? "").toLowerCase().includes(term)
            )
        );
    }, [torneosRows, busquedaDeportes]);

    const torneosColumns = useMemo(
        () => [
            { field: "nombre_torneo", headerName: "Torneo", flex: 1, minWidth: 200 },
            { field: "nombre_deporte", headerName: "Deporte", width: 150 },
            {
                field: "fecha_inicio",
                headerName: "Inicio",
                width: 120,
                valueFormatter: (v) => formatDate(v),
            },
            {
                field: "fecha_fin",
                headerName: "Fin",
                width: 120,
                valueFormatter: (v) => formatDate(v),
            },
            { field: "docente_responsable", headerName: "Responsable", flex: 1, minWidth: 160 },
            { field: "cupo_jugadores", headerName: "Cupo", width: 80 },
            {
                field: "acciones",
                headerName: "Acciones",
                width: 80,
                sortable: false,
                filterable: false,
                headerAlign: "center",
                renderCell: (params) => (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                        <IconButton
                            size="small"
                            color="primary"
                            title="Ver / Editar torneo"
                            onClick={() => navigate(`/Gestion-Torneos/${params.row.id}`)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ),
            },
        ],
        [navigate]
    );

    return (
        <Box
            sx={{
                mt: "-90px",
                pt: "90px",
                pb: 4,
                minHeight: "100%",
                bgcolor: "#f4f8fc",
            }}
        >
            <Container maxWidth="xl">
                {/* Welcome card */}
                <Box
                    sx={{
                        overflow: "hidden",
                        borderRadius: 6,
                        px: { xs: 3, md: 6 },
                        py: { xs: 4, md: 5 },
                        mb: 4,
                        minHeight: 220,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 3,
                        backgroundImage:
                            "linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%), url('/images/carrousel/EntradaUTN.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "white",
                    }}
                >
                    <Box sx={{ maxWidth: 700 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                            <IconButton
                                size="small"
                                onClick={() => navigate("/Inicio")}
                                sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.12)" } }}
                            >
                                <ArrowBackIcon fontSize="small" />
                            </IconButton>
                            <Typography
                                variant="overline"
                                sx={{ letterSpacing: 1.8, opacity: 0.85, fontWeight: 700 }}
                            >
                                Módulo de Deportes
                            </Typography>
                        </Stack>
                        <Typography
                            variant="h3"
                            sx={{ mt: 1, fontWeight: 800, lineHeight: 1.1, fontSize: { xs: "2rem", md: "2.6rem" } }}
                        >
                            Gestión de Deportes
                        </Typography>
                        <Typography sx={{ mt: 2, maxWidth: 520, fontSize: { xs: 15, md: 17 }, opacity: 0.92 }}>
                            Administrá torneos, profesores, espacios y deportistas desde un solo lugar.
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                            <Chip
                                label={`Perfil ${user?.id_perfil ?? "-"}`}
                                sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", fontWeight: 700 }}
                            />
                            <Chip
                                label={user?.legajo ? `Legajo ${user.legajo}` : "Sesión activa"}
                                sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", fontWeight: 700 }}
                            />
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            display: { xs: "none", md: "block" },
                            width: 180,
                            height: 180,
                            borderRadius: "28px",
                            backgroundImage: "url('/images/principal/logoUTNrotado.png')",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "contain",
                            transform: "rotate(8deg)",
                            filter: "drop-shadow(0 18px 35px rgba(0,0,0,0.22))",
                        }}
                    />
                </Box>

                <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)", mb: 3, overflow: "hidden" }}>
                    {/* Gradient header */}
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #1a3a5c 0%, #2d6da3 100%)",
                            color: "white",
                            px: 3,
                            pt: 0,
                            pb: 0,
                        }}
                    >
                        {/* Tab row */}
                        <Stack direction="row" spacing={0}>
                            {[
                                { key: "profesores", label: "Profesores" },
                                { key: "espacios", label: "Espacios Deportivos" },
                                { key: "deportistas", label: "Deportistas" },
                                { key: "deportes", label: "Deportes" },
                            ].map(({ key, label }) => (
                                <Box
                                    key={key}
                                    onClick={() => handleSectionChange(key)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        px: 2.5,
                                        py: 1.5,
                                        cursor: "pointer",
                                        fontWeight: activeSection === key ? 700 : 500,
                                        fontSize: "0.85rem",
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        color: activeSection === key ? "white" : "rgba(255,255,255,0.6)",
                                        borderBottom: activeSection === key ? "3px solid white" : "3px solid transparent",
                                        transition: "all 0.15s",
                                        "&:hover": {
                                            color: "white",
                                            borderBottomColor: "rgba(255,255,255,0.4)",
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: "inherit",
                                            fontSize: "inherit",
                                            letterSpacing: "inherit",
                                            textTransform: "inherit",
                                            color: "inherit",
                                            lineHeight: 1,
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>

                        {/* Title + search + add button */}
                        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" spacing={2} sx={{ py: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <currentSection.icon sx={{ fontSize: 30 }} />
                                <Typography variant="h6" fontWeight={700}>
                                    {currentSection.title}
                                </Typography>
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                                <SAETextField
                                    placeholder="Buscar en esta gestión..."
                                    size="small"
                                    value={busquedaGestion}
                                    onChange={(e) => setBusquedaGestion(e.target.value)}
                                    sx={{
                                        width: { xs: "100%", sm: 240, md: 220 },
                                        "& .MuiOutlinedInput-root": {
                                            bgcolor: "rgba(255,255,255,0.12)",
                                            color: "white",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                                            "&.Mui-focused fieldset": { borderColor: "white" },
                                        },
                                        "& input::placeholder": { color: "rgba(255,255,255,0.7)", opacity: 1 },
                                        "& .MuiInputAdornment-root svg": { color: "rgba(255,255,255,0.7)" },
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                {activeSection === "profesores" && (
                                    <SAEButton
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={openCreateDocente}
                                        sx={{
                                            whiteSpace: "nowrap",
                                            bgcolor: "rgba(255,255,255,0.18)",
                                            color: "white",
                                            border: "1px solid rgba(255,255,255,0.4)",
                                            "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                                        }}
                                    >
                                        Nuevo docente
                                    </SAEButton>
                                )}
                                {activeSection === "espacios" && (
                                    <SAEButton
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={openCreateEspacio}
                                        sx={{
                                            whiteSpace: "nowrap",
                                            bgcolor: "rgba(255,255,255,0.18)",
                                            color: "white",
                                            border: "1px solid rgba(255,255,255,0.4)",
                                            "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                                        }}
                                    >
                                        Nuevo espacio
                                    </SAEButton>
                                )}
                                {activeSection === "deportistas" && (
                                    <SAEButton
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={openCreateDeportista}
                                        sx={{
                                            whiteSpace: "nowrap",
                                            bgcolor: "rgba(255,255,255,0.18)",
                                            color: "white",
                                            border: "1px solid rgba(255,255,255,0.4)",
                                            "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                                        }}
                                    >
                                        Nuevo deportista
                                    </SAEButton>
                                )}
                                {activeSection === "deportes" && (
                                    <SAEButton
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={openCreateDeporte}
                                        sx={{
                                            whiteSpace: "nowrap",
                                            bgcolor: "rgba(255,255,255,0.18)",
                                            color: "white",
                                            border: "1px solid rgba(255,255,255,0.4)",
                                            "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                                        }}
                                    >
                                        Nuevo deporte
                                    </SAEButton>
                                )}
                            </Stack>
                        </Stack>
                    </Box>

                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ width: "100%" }}>
                            <DataGrid
                                rows={rowsGestionFiltradas}
                                columns={currentSection.columns}
                                loading={currentSection.loading}
                                autoHeight
                                disableRowSelectionOnClick
                                pageSizeOptions={[5, 10, 25]}
                                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                                sx={{ borderRadius: 0, border: "none" }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)", overflow: "hidden" }}>
                    {/* Card header */}
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #1a3a5c 0%, #2d6da3 100%)",
                            color: "white",
                            px: 3,
                            py: 2.5,
                        }}
                    >
                        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <EmojiEventsIcon sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        Gestión de Torneos
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                        Administrá los torneos deportivos, inscribí alumnos y consultá la información.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                                <SAETextField
                                    placeholder="Buscar torneo, deporte o responsable..."
                                    size="small"
                                    value={busquedaDeportes}
                                    onChange={(e) => setBusquedaDeportes(e.target.value)}
                                    sx={{
                                        width: { xs: "100%", sm: 260, md: 240 },
                                        "& .MuiOutlinedInput-root": {
                                            bgcolor: "rgba(255,255,255,0.12)",
                                            color: "white",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                                            "&.Mui-focused fieldset": { borderColor: "white" },
                                        },
                                        "& input::placeholder": { color: "rgba(255,255,255,0.7)", opacity: 1 },
                                        "& .MuiInputAdornment-root svg": { color: "rgba(255,255,255,0.7)" },
                                    }}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                                <SAEButton
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setTorneoFormOpen(true)}
                                    sx={{
                                        whiteSpace: "nowrap",
                                        bgcolor: "rgba(255,255,255,0.18)",
                                        color: "white",
                                        border: "1px solid rgba(255,255,255,0.4)",
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                                    }}
                                >
                                    Nuevo Torneo
                                </SAEButton>
                            </Stack>
                        </Stack>
                    </Box>

                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ width: "100%" }}>
                            <DataGrid
                                rows={rowsTorneosFiltradas}
                                columns={torneosColumns}
                                loading={loadingTorneos}
                                autoHeight
                                disableRowSelectionOnClick
                                pageSizeOptions={[5, 10, 25]}
                                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                                localeText={{ noRowsLabel: "No hay torneos activos" }}
                                sx={{ borderRadius: 0, border: "none" }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)", overflow: "hidden", mt: 3 }}>
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #1a3a5c 0%, #2d6da3 100%)",
                            color: "white",
                            px: 3,
                            py: 2.5,
                        }}
                    >
                        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <ScheduleIcon sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        Horarios deportivos
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                        Calendario de actividades y horarios de cada deporte.
                                    </Typography>
                                </Box>
                            </Stack>
                            <SAEButton
                                variant="contained"
                                startIcon={<ScheduleIcon />}
                                onClick={() => setHorariosDialogOpen(true)}
                                sx={{
                                    whiteSpace: "nowrap",
                                    bgcolor: "rgba(255,255,255,0.18)",
                                    color: "white",
                                    border: "1px solid rgba(255,255,255,0.4)",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                                }}
                            >
                                Gestionar Horarios
                            </SAEButton>
                        </Stack>
                    </Box>
                </Card>

                <Box sx={{ mt: 3 }}>
                    <SportsCalendar />
                </Box>
            </Container>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                        {dialogType === "docente"
                            ? dialogMode === "create" ? "Nuevo docente deportivo" : "Editar docente deportivo"
                            : dialogType === "espacio"
                            ? dialogMode === "create" ? "Nuevo espacio deportivo" : "Editar espacio deportivo"
                            : dialogType === "deporte"
                            ? dialogMode === "create" ? "Nuevo deporte" : "Editar deporte"
                            : dialogMode === "create" ? "Nuevo deportista" : "Editar deportista"}
                    </Typography>
                    <IconButton onClick={() => setDialogOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {dialogError && (
                            <Alert severity="error" onClose={() => setDialogError("")}>
                                {dialogError}
                            </Alert>
                        )}
                        {dialogType === "docente" ? (
                            <>
                                <SAETextField
                                    label="CUIL"
                                    value={dialogData.cuil}
                                    onChange={(e) => handleDialogChange("cuil", e.target.value)}
                                    disabled={dialogMode === "edit"}
                                    fullWidth
                                />
                                <SAETextField
                                    label="Nombres"
                                    value={dialogData.nombres}
                                    onChange={(e) => handleDialogChange("nombres", e.target.value)}
                                    fullWidth
                                />
                                <SAETextField
                                    label="Apellidos"
                                    value={dialogData.apellidos}
                                    onChange={(e) => handleDialogChange("apellidos", e.target.value)}
                                    fullWidth
                                />
                                <SAETextField
                                    label="Fecha de nacimiento"
                                    type="date"
                                    value={dialogData.fecha_nacimiento}
                                    onChange={(e) => handleDialogChange("fecha_nacimiento", e.target.value)}
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={dialogData.activo}
                                            onChange={(e) => handleDialogChange("activo", e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Activo"
                                />
                            </>
                        ) : dialogType === "espacio" ? (
                            <>
                                <SAETextField
                                    label="Nombre"
                                    value={dialogData.nombre}
                                    onChange={(e) => handleDialogChange("nombre", e.target.value)}
                                    fullWidth
                                />
                                <SAETextField
                                    label="Domicilio"
                                    value={dialogData.domicilio}
                                    onChange={(e) => handleDialogChange("domicilio", e.target.value)}
                                    fullWidth
                                />
                                <SAETextField
                                    label="URL Google Maps"
                                    value={dialogData.url_maps}
                                    onChange={(e) => handleDialogChange("url_maps", e.target.value)}
                                    fullWidth
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={dialogData.activo}
                                            onChange={(e) => handleDialogChange("activo", e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Activo"
                                />
                            </>
                        ) : dialogType === "deportista" ? (
                            <>
                                <SAETextField
                                    label="Legajo"
                                    value={dialogData.legajo}
                                    onChange={(e) => handleDialogChange("legajo", e.target.value)}
                                    disabled={dialogMode === "edit"}
                                    fullWidth
                                />
                                <SAETextField
                                    label="Vencimiento ficha"
                                    type="date"
                                    value={dialogData.vencimiento_ficha}
                                    onChange={(e) => handleDialogChange("vencimiento_ficha", e.target.value)}
                                    fullWidth
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={dialogData.habilitado_deportado}
                                            onChange={(e) => handleDialogChange("habilitado_deportado", e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Habilitado"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={dialogData.habilitado_deporte}
                                            onChange={(e) => handleDialogChange("habilitado_deporte", e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Habilitado deporte"
                                />
                            </>
                        ) : (
                            <>
                                <SAETextField
                                    label="Nombre"
                                    value={dialogData.nombre}
                                    onChange={(e) => handleDialogChange("nombre", e.target.value)}
                                    fullWidth
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={dialogData.activo}
                                            onChange={(e) => handleDialogChange("activo", e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Activo"
                                />
                            </>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <SAEButton variant="outlined" onClick={() => setDialogOpen(false)} disabled={dialogSaving}>
                        Cancelar
                    </SAEButton>
                    <SAEButton
                        variant="contained"
                        onClick={handleDialogSave}
                        disabled={dialogSaving}
                        startIcon={dialogSaving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {dialogMode === "create" ? "Crear" : "Guardar"}
                    </SAEButton>
                </DialogActions>
            </Dialog>

            <DocumentPreviewDialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title={previewTitle}
                imageSrc={previewSrc}
                isPdf={previewIsPdf}
                loading={loadingPreview}
                error={previewError}
                onDownload={() => previewDocRef && handleDownloadDoc(previewDocRef.id, previewDocRef.nombre_documento, previewDocRef.extension)}
            />

            <Dialog open={docsDialogOpen} onClose={() => setDocsDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                        Documentación — legajo {docsLegajo}
                    </Typography>
                    <IconButton onClick={() => setDocsDialogOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {loadingDocs && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {!loadingDocs && docsError && (
                        <Alert severity="error">{docsError}</Alert>
                    )}
                    {!loadingDocs && !docsError && docsList.length === 0 && (
                        <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                            No hay documentación disponible para este alumno.
                        </Typography>
                    )}
                    {!loadingDocs && !docsError && docsList.length > 0 && (
                        <Stack spacing={1} sx={{ pt: 1 }}>
                            {docsList.map((doc) => (
                                <Box
                                    key={doc.id}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        p: 1.5,
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: "divider",
                                        bgcolor: "background.paper",
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {doc.nombre_documento}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {doc.extension?.toUpperCase()}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={0.5}>
                                        <IconButton
                                            size="small"
                                            title="Visualizar"
                                            onClick={() => handlePreviewDoc(doc)}
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            title="Descargar"
                                            onClick={() => handleDownloadDoc(doc.id, doc.nombre_documento, doc.extension)}
                                            disabled={downloadingDocId === doc.id}
                                        >
                                            {downloadingDocId === doc.id
                                                ? <CircularProgress size={18} />
                                                : <DownloadIcon fontSize="small" />}
                                        </IconButton>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <SAEButton variant="outlined" onClick={() => setDocsDialogOpen(false)}>
                        Cerrar
                    </SAEButton>
                </DialogActions>
            </Dialog>

            <GestionarHorariosDialog
                open={horariosDialogOpen}
                onClose={() => setHorariosDialogOpen(false)}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>

            <TorneoFormDialog
                open={torneoFormOpen}
                onClose={() => setTorneoFormOpen(false)}
                onSave={async (body) => {
                    await crearTorneo(body);
                    fetchTorneos();
                }}
                mode="create"
            />
        </Box>
    );
}