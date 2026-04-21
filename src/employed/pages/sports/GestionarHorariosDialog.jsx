import { useState, useEffect, useCallback } from "react";
import {
    Autocomplete,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import {
    obtenerDeportesActivos,
    obtenerHorariosXDeporte,
    crearHorarioDeportivo,
    modificarHorarioDeportivo,
    eliminarHorarioDeportivo,
    obtenerDocentesDeportivos,
    obtenerEspaciosDeportivos,
} from "../../../api/DeporteService";

const DIAS_LABEL = {
    0: "Domingo", 1: "Lunes", 2: "Martes", 3: "Miércoles",
    4: "Jueves", 5: "Viernes", 6: "Sábado",
};

const DIAS_OPTIONS = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
    { value: 6, label: "Sábado" },
    { value: 0, label: "Domingo" },
];

const EMPTY_FORM = {
    dia: 1,
    hora_inicio: "",
    hora_fin: "",
    id_espacio_deportivo: "",
    cuil_docente: "",
    activo: true,
};

function toTimeInput(str) {
    if (!str) return "";
    return str.slice(0, 5);
}

function toApiTime(str) {
    if (!str) return "";
    return str.length === 5 ? `${str}:00` : str;
}

function HorarioFormFields({ form, onChange, espacios, docentes }) {
    return (
        <Stack spacing={1}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Día</InputLabel>
                    <Select
                        value={form.dia}
                        label="Día"
                        onChange={(e) => onChange("dia", e.target.value)}
                    >
                        {DIAS_OPTIONS.map((d) => (
                            <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <SAETextField
                    label="Hora inicio"
                    type="time"
                    size="small"
                    value={form.hora_inicio}
                    onChange={(e) => onChange("hora_inicio", e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ width: 130 }}
                />
                <SAETextField
                    label="Hora fin"
                    type="time"
                    size="small"
                    value={form.hora_fin}
                    onChange={(e) => onChange("hora_fin", e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ width: 130 }}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={form.activo}
                            onChange={(e) => onChange("activo", e.target.checked)}
                            size="small"
                            color="primary"
                        />
                    }
                    label="Activo"
                    sx={{ ml: 0.5 }}
                />
            </Stack>
            <Stack direction="row" spacing={1}>
                <FormControl size="small" fullWidth>
                    <InputLabel>Espacio deportivo</InputLabel>
                    <Select
                        value={form.id_espacio_deportivo}
                        label="Espacio deportivo"
                        onChange={(e) => onChange("id_espacio_deportivo", e.target.value)}
                    >
                        <MenuItem value=""><em>Sin asignar</em></MenuItem>
                        {espacios.map((e) => (
                            <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" fullWidth>
                    <InputLabel>Docente</InputLabel>
                    <Select
                        value={form.cuil_docente}
                        label="Docente"
                        onChange={(e) => onChange("cuil_docente", e.target.value)}
                    >
                        <MenuItem value=""><em>Sin asignar</em></MenuItem>
                        {docentes.map((d) => (
                            <MenuItem key={d.cuil} value={d.cuil}>{d.nombres} {d.apellidos}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
        </Stack>
    );
}

function HorarioCard({ horario, espacios, docentes, onSaved, onDeleted }) {
    const [editing, setEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [form, setForm] = useState({
        dia: horario.dia,
        hora_inicio: toTimeInput(horario.hora_inicio),
        hora_fin: toTimeInput(horario.hora_fin),
        id_espacio_deportivo: horario.id_espacio_deportivo ?? "",
        cuil_docente: horario.cuil_docente ?? "",
        activo: horario.activo,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await eliminarHorarioDeportivo(horario.id);
            setConfirmDelete(false);
            onDeleted();
        } catch (err) {
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            const espacioObj = espacios.find((e) => String(e.id) === String(form.id_espacio_deportivo));
            const docenteObj = docentes.find((d) => String(d.cuil) === String(form.cuil_docente));
            const body = {
                ...horario,
                ...form,
                hora_inicio: toApiTime(form.hora_inicio),
                hora_fin: toApiTime(form.hora_fin),
                id_espacio_deportivo: Number(form.id_espacio_deportivo) || 0,
                espacio_deportivo: espacioObj?.nombre ?? horario.espacio_deportivo ?? "",
                docente_responsable: docenteObj ? `${docenteObj.nombres} ${docenteObj.apellidos}` : (horario.docente_responsable ?? ""),
            };
            await modificarHorarioDeportivo(horario.id, body);
            setEditing(false);
            onSaved();
        } catch (err) {
            setError(err.message || "Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm({
            dia: horario.dia,
            hora_inicio: toTimeInput(horario.hora_inicio),
            hora_fin: toTimeInput(horario.hora_fin),
            id_espacio_deportivo: horario.id_espacio_deportivo ?? "",
            cuil_docente: horario.cuil_docente ?? "",
            activo: horario.activo,
        });
        setEditing(false);
        setError("");
    };

    if (!editing) {
        if (confirmDelete) {
            return (
                <Card sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 20px rgba(211,47,47,0.18)", border: "1.5px solid #c62828" }}>
                    <Box
                        sx={{
                            background: "linear-gradient(90deg, #c62828 0%, #ef5350 100%)",
                            px: 2,
                            py: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <DeleteIcon sx={{ color: "white", fontSize: 16 }} />
                        <Typography variant="subtitle2" sx={{ color: "white", fontWeight: 700, flex: 1 }}>
                            Eliminar horario
                        </Typography>
                        <Chip
                            size="small"
                            label={DIAS_LABEL[horario.dia]}
                            sx={{ bgcolor: "rgba(255,255,255,0.22)", color: "white", fontWeight: 700, fontSize: "0.7rem" }}
                        />
                        <Chip
                            size="small"
                            label={`${toTimeInput(horario.hora_inicio)} – ${toTimeInput(horario.hora_fin)}`}
                            sx={{ bgcolor: "rgba(255,255,255,0.22)", color: "white", fontWeight: 700, fontSize: "0.7rem" }}
                        />
                    </Box>
                    <CardContent sx={{ py: 1.5, bgcolor: "#fff5f5", "&:last-child": { pb: 1.5 } }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            ¿Estás seguro que querés eliminar este horario? Esta acción no se puede deshacer.
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <SAEButton variant="outlined" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                                Cancelar
                            </SAEButton>
                            <SAEButton
                                variant="contained"
                                color="error"
                                onClick={handleDelete}
                                disabled={deleting}
                                startIcon={deleting ? <CircularProgress size={14} color="inherit" /> : <DeleteIcon />}
                            >
                                Eliminar
                            </SAEButton>
                        </Stack>
                    </CardContent>
                </Card>
            );
        }

        return (
            <Card variant="outlined" sx={{ borderRadius: 2, overflow: "hidden", borderColor: "#d6e4f7" }}>
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Stack spacing={0.2} sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: "wrap" }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#153b6f" }}>
                                    {DIAS_LABEL[horario.dia]}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#5a6f8f" }}>
                                    {toTimeInput(horario.hora_inicio)} – {toTimeInput(horario.hora_fin)}
                                </Typography>
                                <Chip
                                    size="small"
                                    label={horario.activo ? "Activo" : "Inactivo"}
                                    color={horario.activo ? "success" : "default"}
                                />
                            </Stack>
                            {horario.espacio_deportivo && (
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {horario.espacio_deportivo}
                                </Typography>
                            )}
                            {horario.docente_responsable && (
                                <Typography variant="caption" color="text.secondary" noWrap>
                                    {horario.docente_responsable}
                                </Typography>
                            )}
                        </Stack>
                        <Stack direction="row" spacing={0.5}>
                            <IconButton
                                size="small"
                                onClick={() => setEditing(true)}
                                sx={{
                                    color: "primary.main",
                                    "&:hover": { bgcolor: "rgba(91,150,204,0.12)" },
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={() => setConfirmDelete(true)}
                                sx={{
                                    color: "error.main",
                                    "&:hover": { bgcolor: "rgba(211,47,47,0.08)" },
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    const editHeader = (
        <Box
            sx={{
                background: "linear-gradient(90deg, #1565C0 0%, #5B96CC 100%)",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <EditIcon sx={{ color: "white", fontSize: 16 }} />
            <Typography variant="subtitle2" sx={{ color: "white", fontWeight: 700, flex: 1 }}>
                Editando horario
            </Typography>
            <Chip
                size="small"
                label={DIAS_LABEL[horario.dia]}
                sx={{ bgcolor: "rgba(255,255,255,0.22)", color: "white", fontWeight: 700, fontSize: "0.7rem" }}
            />
            <Chip
                size="small"
                label={`${toTimeInput(horario.hora_inicio)} – ${toTimeInput(horario.hora_fin)}`}
                sx={{ bgcolor: "rgba(255,255,255,0.22)", color: "white", fontWeight: 700, fontSize: "0.7rem" }}
            />
        </Box>
    );

    return (
        <Card sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 20px rgba(21,101,192,0.18)", border: "1.5px solid #1565C0" }}>
            {editHeader}
            <CardContent sx={{ py: 1.5, bgcolor: "#f0f6ff", "&:last-child": { pb: 1.5 } }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}
                <HorarioFormFields form={form} onChange={handleChange} espacios={espacios} docentes={docentes} />
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                    <SAEButton variant="outlined" onClick={handleCancel} disabled={saving}>
                        Cancelar
                    </SAEButton>
                    <SAEButton
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <CheckIcon />}
                    >
                        Guardar cambios
                    </SAEButton>
                </Stack>
            </CardContent>
        </Card>
    );
}

function NuevoHorarioCard({ idDeporte, nombreDeporte, espacios, docentes, onCreated, onCancel }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

    const handleCreate = async () => {
        setSaving(true);
        setError("");
        try {
            const espacioObj = espacios.find((e) => String(e.id) === String(form.id_espacio_deportivo));
            const docenteObj = docentes.find((d) => String(d.cuil) === String(form.cuil_docente));
            await crearHorarioDeportivo({
                id: 0,
                id_deporte: idDeporte,
                nombre_deporte: nombreDeporte,
                id_espacio_deportivo: Number(form.id_espacio_deportivo) || 0,
                espacio_deportivo: espacioObj?.nombre ?? "",
                hora_inicio: toApiTime(form.hora_inicio),
                hora_fin: toApiTime(form.hora_fin),
                activo: form.activo,
                cuil_docente: form.cuil_docente,
                docente_responsable: docenteObj ? `${docenteObj.nombres} ${docenteObj.apellidos}` : "",
                dia: form.dia,
            });
            onCreated();
        } catch (err) {
            setError(err.message || "Error al crear");
        } finally {
            setSaving(false);
        }
    };

    const createHeader = (
        <Box
            sx={{
                background: "linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <AccessTimeIcon sx={{ color: "white", fontSize: 16 }} />
            <Typography variant="subtitle2" sx={{ color: "white", fontWeight: 700 }}>
                Nuevo horario
            </Typography>
        </Box>
    );

    return (
        <Card sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 4px 20px rgba(46,125,50,0.18)", border: "1.5px solid #2E7D32" }}>
            {createHeader}
            <CardContent sx={{ py: 1.5, bgcolor: "#f1faf2", "&:last-child": { pb: 1.5 } }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}
                <HorarioFormFields form={form} onChange={handleChange} espacios={espacios} docentes={docentes} />
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
                    <SAEButton variant="outlined" onClick={onCancel} disabled={saving}>
                        Cancelar
                    </SAEButton>
                    <SAEButton
                        variant="contained"
                        onClick={handleCreate}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <AddIcon />}
                    >
                        Crear
                    </SAEButton>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function GestionarHorariosDialog({ open, onClose }) {
    const [deportes, setDeportes] = useState([]);
    const [espacios, setEspacios] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [loadingCatalogos, setLoadingCatalogos] = useState(false);

    const [selectedDeporte, setSelectedDeporte] = useState(null);
    const [horarios, setHorarios] = useState([]);
    const [loadingHorarios, setLoadingHorarios] = useState(false);
    const [horariosError, setHorariosError] = useState("");
    const [showNuevoForm, setShowNuevoForm] = useState(false);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        setLoadingCatalogos(true);
        Promise.all([
            obtenerDeportesActivos(),
            obtenerEspaciosDeportivos(),
            obtenerDocentesDeportivos(),
        ])
            .then(([deps, esps, docs]) => {
                if (cancelled) return;
                setDeportes(deps);
                setEspacios(esps);
                setDocentes(docs);
            })
            .catch(() => {})
            .finally(() => { if (!cancelled) setLoadingCatalogos(false); });
        return () => { cancelled = true; };
    }, [open]);

    const fetchHorarios = useCallback(async (idDeporte) => {
        setLoadingHorarios(true);
        setHorariosError("");
        try {
            const data = await obtenerHorariosXDeporte(idDeporte);
            setHorarios(data);
        } catch (err) {
            setHorariosError(err.message || "Error al cargar horarios");
        } finally {
            setLoadingHorarios(false);
        }
    }, []);

    const handleDeporteChange = useCallback((_e, value) => {
        setSelectedDeporte(value);
        setHorarios([]);
        setShowNuevoForm(false);
        if (value) fetchHorarios(value.id);
    }, [fetchHorarios]);

    const handleSaved = useCallback(() => {
        if (selectedDeporte) fetchHorarios(selectedDeporte.id);
    }, [selectedDeporte, fetchHorarios]);

    const handleCreated = useCallback(() => {
        setShowNuevoForm(false);
        if (selectedDeporte) fetchHorarios(selectedDeporte.id);
    }, [selectedDeporte, fetchHorarios]);

    const handleClose = () => {
        setSelectedDeporte(null);
        setHorarios([]);
        setShowNuevoForm(false);
        onClose();
    };

    const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
    const sortedHorarios = [...horarios].sort(
        (a, b) =>
            DAY_ORDER.indexOf(a.dia) - DAY_ORDER.indexOf(b.dia) ||
            a.hora_inicio.localeCompare(b.hora_inicio)
    );

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                    Gestionar Horarios Deportivos
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {loadingCatalogos ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack spacing={2} sx={{ pt: 0.5 }}>
                        <Autocomplete
                            options={deportes}
                            getOptionLabel={(opt) => opt.nombre}
                            value={selectedDeporte}
                            onChange={handleDeporteChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Seleccionar deporte"
                                    size="small"
                                    placeholder="Escribí para filtrar..."
                                />
                            )}
                            isOptionEqualToValue={(opt, val) => opt.id === val.id}
                            noOptionsText="Sin resultados"
                        />

                        {!selectedDeporte && (
                            <Typography color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
                                Seleccioná un deporte para ver y gestionar sus horarios.
                            </Typography>
                        )}

                        {selectedDeporte && (
                            <Stack spacing={1.5}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                    <Typography variant="subtitle2" sx={{ color: "#5a6f8f", fontWeight: 600 }}>
                                        Horarios registrados — {selectedDeporte.nombre}
                                    </Typography>
                                    <IconButton
                                        onClick={() => setShowNuevoForm(true)}
                                        disabled={showNuevoForm}
                                        sx={{
                                            bgcolor: "primary.main",
                                            color: "white",
                                            width: 36,
                                            height: 36,
                                            "&:hover": { bgcolor: "primary.dark" },
                                            "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
                                        }}
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Stack>

                                {showNuevoForm && (
                                    <NuevoHorarioCard
                                        idDeporte={selectedDeporte.id}
                                        nombreDeporte={selectedDeporte.nombre}
                                        espacios={espacios}
                                        docentes={docentes}
                                        onCreated={handleCreated}
                                        onCancel={() => setShowNuevoForm(false)}
                                    />
                                )}

                                {loadingHorarios && (
                                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                                        <CircularProgress />
                                    </Box>
                                )}

                                {!loadingHorarios && horariosError && (
                                    <Alert severity="error">{horariosError}</Alert>
                                )}

                                {!loadingHorarios && !horariosError && sortedHorarios.length === 0 && !showNuevoForm && (
                                    <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
                                        No hay horarios registrados para este deporte.
                                    </Typography>
                                )}

                                {!loadingHorarios && !horariosError && sortedHorarios.map((h) => (
                                    <HorarioCard
                                        key={h.id}
                                        horario={h}
                                        espacios={espacios}
                                        docentes={docentes}
                                        onSaved={handleSaved}
                                        onDeleted={handleSaved}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <SAEButton variant="outlined" onClick={handleClose}>
                    Cerrar
                </SAEButton>
            </DialogActions>
        </Dialog>
    );
}
