import { useMemo,useEffect, useState, useCallback  } from "react";
import {
    Box,
    Typography,
    Chip,
    Stack,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Tooltip,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import {ObtenerHorarios, BuscarHorariosXEmpleado } from "../../../api/EmpleadoService";
import { ObtenerEmpleados } from "../../../api/EmpleadoService";


const HOUR_HEIGHT = 48; // px per hour
const START_HOUR = 8;//AM
const END_HOUR = 22;//PM
const TOTAL_HOURS = END_HOUR - START_HOUR; // 16
const TOTAL_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT;
const TIME_COL_WIDTH = 40; // px

const DAYS = [
    { label: "Lunes",     dia: 1 },
    { label: "Martes",    dia: 2 },
    { label: "Miércoles", dia: 3 },
    { label: "Jueves",    dia: 4 },
    { label: "Viernes",   dia: 5 }
];

const PALETTE = [
    "#1565C0",
    "#2E7D32",
    "#B71C1C",
    "#E65100",
    "#6A1B9A",
    "#00838F",
    "#AD1457",
    "#558B2F",
    "#4527A0",
    "#00695C",
];

const EMPTY_FORM = {
    dia: 1,
    hora_inicio: "",
    hora_fin: "",
    id_espacio_deportivo: "",
    cuil_docente: "",
    activo: true,
};

function parseMinutes(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(":");
    return Number.parseInt(parts[0], 10) * 60 + (Number.parseInt(parts[1], 10) || 0);
}

function fmtHour(h) {
    return `${String(h).padStart(2, "0")}:00`;
}


function fmtTime(timeStr) {
    if (!timeStr) return "";
    return timeStr.slice(0, 5);
}

function hasValidText(value) {
    if (value === null || value === undefined) return false;
    const text = String(value).trim();
    return text !== "" && text !== "0";
}

/** Assigns col and numCols to each event so overlapping ones render side by side */
function layoutEvents(events) {
    if (events.length === 0) return [];
    const sorted = events
        .map((ev) => ({ ...ev, _start: parseMinutes(ev.hora_inicio), _end: parseMinutes(ev.hora_fin) }))
        .sort((a, b) => a._start - b._start || b._end - a._end);
    const colEnds = [];
    const withCol = sorted.map((ev) => {
        let col = colEnds.findIndex((end) => end <= ev._start);
        if (col === -1) { col = colEnds.length; colEnds.push(ev._end); }
        else { colEnds[col] = ev._end; }
        return { ...ev, col };
    });
    return withCol.map((ev) => {
        const numCols = withCol
            .filter((o) => o._start < ev._end && o._end > ev._start)
            .reduce((max, o) => Math.max(max, o.col), 0) + 1;
        return { ...ev, numCols };
    });
}

const WEEKEND = new Set([0, 6]); // dia values for Sat/Sun

function HorarioFormFields({ form, onChange, espacios, empleados }) {
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
                    <InputLabel>Empleado</InputLabel>
                    <Select
                        value={form.id_empleado}
                        label="Empleado"
                        onChange={(e) => onChange("id_empleado", e.target.value)}
                    >
                        <MenuItem value=""><em>Sin asignar</em></MenuItem>
                        {empleados.map((e) => (
                            <MenuItem key={e.id} value={e.id}>{e.nombre}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
               
            </Stack>
        </Stack>
    );
}

export default function EmployCalendar(){
    const [empleados, setEmpleados] = useState([]);
    const [loadingEmpleados, setLoadingEmpleados] = useState(false);

    const [allHorarios, setAllHorarios] = useState([]);
    const [loadingHorarios, setLoadingHorarios]= useState(true);

    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null); // null = todos

   const fetchEmpleados = useCallback(async () => {
        setLoadingEmpleados(true);
        try {
            const data = await ObtenerEmpleados();
            setEmpleados(data);
        } catch {
            setEmpleados([]);
        } finally {
            setLoadingEmpleados(false);
        }
    }, []);


    {/*Esto produce dos cosas, uno que se pueda realizar efectivamente de manera asincronica y segundo que lo exporte para su uso cuando inicializa la pagina */}
    useEffect(() => {
        fetchEmpleados();
    }, [fetchEmpleados]);

       const fetchHorarios = useCallback(async () => {
        setLoadingHorarios(true);
        try {
            const data = await ObtenerHorarios();
            console.log(data);
            
        } catch {
            setAllHorarios([]);
        } finally {
            setLoadingHorarios(false);
        }
    }, []);

    useEffect(() => {
        fetchHorarios();
    }, [fetchHorarios]); 


    const colorOf = useMemo(() => {
        const map = {};
        empleados.forEach((d, i) => { map[d.id] = PALETTE[i % PALETTE.length]; });
        return map;
    }, [empleados]);

    const visibleHorarios = useMemo(
        () => (selected === null ? allHorarios : allHorarios.filter((h) => h.id_deporte === selected)),
        [allHorarios, selected]
    );

    const byDay = useMemo(() => {
            const map = Object.fromEntries(DAYS.map((d) => [d.dia, []]));
            visibleHorarios.forEach((h) => {
                if (map[h.dia] !== undefined) map[h.dia].push(h);
            });
            return Object.fromEntries(
                Object.entries(map).map(([dia, evs]) => [dia, layoutEvents(evs)])
            );
        }, [visibleHorarios]);

    const hourLabels = useMemo(
            () => Array.from({ length: TOTAL_HOURS }, (_, i) => START_HOUR + 1 + i),
            []
        );
    
        // hour grid line positions (i = 1 … TOTAL_HOURS-1, skip top/bottom edges)
        const hourLineOffsets = useMemo(
            () => Array.from({ length: TOTAL_HOURS - 1 }, (_, i) => (i + 1) * HOUR_HEIGHT),
            []
        );
    return (
        <Box>
                {/* Filter chips */}
                <Card sx={{ borderRadius: 3, boxShadow: "0 18px 45px rgba(21,61,113,0.08)", mb: 2 }}>
                    <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: "#5a6f8f", fontWeight: 600, fontSize: "0.75rem" }}>
                            Filtrar por empleado
                        </Typography>
                        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                            <Chip
                                icon={<SportsSoccerIcon />}
                                label="Todos los empleados"
                                variant={selected === null ? "filled" : "outlined"}
                                color={selected === null ? "primary" : "default"}
                                onClick={() => setSelected(null)}
                                sx={{ fontWeight: selected === null ? 700 : 400 }}
                            />
                            {empleados.map((e, i) => {
                                const c = PALETTE[i % PALETTE.length];
                                const active = selected === e.id;
                                return (
                                    <Chip
                                        key={e.id}
                                        label={e.nombre_empleado}
                                        onClick={() => setSelected(active ? null : e.id)}
                                        sx={{
                                            fontWeight: active ? 700 : 400,
                                            bgcolor: active ? c : "transparent",
                                            color: active ? "#fff" : c,
                                            border: "1px solid",
                                            borderColor: c,
                                            "&:hover": { bgcolor: active ? c : `${c}22` },
                                            transition: "background-color 0.15s",
                                        }}
                                    />
                                );
                            })}
                        </Stack>

                        {/* Color legend */}
                        {empleados.length > 0 && selected === null && (
                            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 1.5, pt: 1.5, borderTop: "1px solid #e3eaf4" }}>
                                {empleados.map((e, i) => (
                                    <Stack key={e.id} direction="row" alignItems="center" spacing={0.6}>
                                        <Box
                                            sx={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: "3px",
                                                bgcolor: PALETTE[i % PALETTE.length],
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ color: "#5a6f8f", fontSize: "0.72rem" }}>
                                            {e.nombre_empleado}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                </Card>

                {loadingHorarios && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loadingHorarios && error && (
                    <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                )}

                {!loadingHorarios&& !loadingEmpleados && !error && (
                    <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21,61,113,0.08)", overflowX: "auto" }}>
                        <Box sx={{ minWidth: TIME_COL_WIDTH + DAYS.length * 90 }}>

                                {/* Header row */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${DAYS.length}, 1fr)`,
                                        borderBottom: "2px solid #dde6f5",
                                        bgcolor: "#fff",
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 10,
                                    }}
                                >
                                    <Box />
                                    {DAYS.map((day) => (
                                        <Box
                                            key={day.dia}
                                            sx={{
                                                py: 1,
                                                textAlign: "center",
                                                borderLeft: "1px solid #dde6f5",
                                                bgcolor: WEEKEND.has(day.dia) ? "#b2c7e71c" : "transparent",
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#153b6f", fontSize: "0.8rem" }}>
                                                {day.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Body grid */}
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${DAYS.length}, 1fr)`,
                                    }}
                                >
                                    {/* Time labels column */}
                                    <Box sx={{ position: "relative", height: TOTAL_HEIGHT, bgcolor: "#fff", borderRight: "1px solid #dde6f5" }}>
                                        {hourLabels.map((h, i) => (
                                            <Box
                                                key={h}
                                                sx={{
                                                    position: "absolute",
                                                    top: (i + 1) * HOUR_HEIGHT - 9,
                                                    right: 6,
                                                    left: 0,
                                                    textAlign: "right",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: "#8fa3c0", fontWeight: 600, fontSize: "0.68rem" }}
                                                >
                                                    {fmtHour(h)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Day columns */}
                                    {DAYS.map((day) => (
                                        <Box
                                            key={day.dia}
                                            sx={{
                                                position: "relative",
                                                height: TOTAL_HEIGHT,
                                                borderLeft: "1px solid #dde6f5",
                                                bgcolor: WEEKEND.has(day.dia) ? "#b2c7e71c" : "#fafcff",
                                            }}
                                        >
                                            {/* Hour grid lines */}
                                            {hourLineOffsets.map((offset) => (
                                                <Box
                                                    key={offset}
                                                    sx={{
                                                        position: "absolute",
                                                        top: offset,
                                                        left: 0,
                                                        right: 0,
                                                        borderTop: "1px solid #e8eef8",
                                                        pointerEvents: "none",
                                                    }}
                                                />
                                            ))}

                                            {/* Events */}
                                            {byDay[day.dia].map((ev) => {
                                                const startMin = parseMinutes(ev.hora_inicio);
                                                const endMin   = parseMinutes(ev.hora_fin);
                                                const top    = (startMin - START_HOUR * 60) * (HOUR_HEIGHT / 60);
                                                const height = Math.max((endMin - startMin) * (HOUR_HEIGHT / 60), 28);
                                                const c      = colorOf[ev.id_empleado] || PALETTE[0];

                                                return (
                                                    <Tooltip
                                                        key={ev.id}
                                                        placement="top"
                                                        arrow
                                                        title={
                                                            <Box sx={{ p: 0.5 }}>
                                                                <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 0.25 }}>
                                                                    {ev.nombre_empleado_atencion}
                                                                </Typography>
                                                                <Typography sx={{ fontSize: "0.75rem", mb: 0.25 }}>
                                                                    {fmtTime(ev.hora_inicio)} – {fmtTime(ev.hora_fin)}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    >
                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                top: top + 1,
                                                                left: `calc(${(ev.col / ev.numCols) * 100}% + 2px)`,
                                                                width: `calc(${(1 / ev.numCols) * 100}% - 4px)`,
                                                                height: height - 2,
                                                                bgcolor: c,
                                                                color: "#fff",
                                                                borderRadius: 1.5,
                                                                px: 0.8,
                                                                py: 0.3,
                                                                overflow: "hidden",
                                                                cursor: "default",
                                                                zIndex: 2,
                                                                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                                                                transition: "opacity 0.15s, box-shadow 0.15s",
                                                                "&:hover": {
                                                                    opacity: 0.88,
                                                                    boxShadow: "0 4px 14px rgba(0,0,0,0.26)",
                                                                    zIndex: 3,
                                                                },
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                sx={{ fontWeight: 700, display: "block", lineHeight: 1.3, fontSize: "0.7rem" }}
                                                                noWrap
                                                            >
                                                                {ev.nombre_empleado_atencion}
                                                            </Typography>
                                                            {height > 38 && (
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{ display: "block", fontSize: "0.62rem", lineHeight: 1.2, opacity: 0.92 }}
                                                                    noWrap
                                                                >
                                                                    {fmtTime(ev.hora_inicio)} – {fmtTime(ev.hora_fin)}
                                                                </Typography>
                                                            )}

                                                        </Box>
                                                    </Tooltip>
                                                );
                                            })}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                    </Card>
                )}
        </Box>
    );
}