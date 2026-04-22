import { useState, useEffect, useMemo } from "react";
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
import { obtenerDeportesActivos, obtenerHorariosXDeporte } from "../../../api/DeporteService";

const HOUR_HEIGHT = 32; // px per hour
const START_HOUR = 7;
const END_HOUR = 23;
const TOTAL_HOURS = END_HOUR - START_HOUR; // 16
const TOTAL_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT;
const TIME_COL_WIDTH = 40; // px

/* .NET DayOfWeek: 0=Sunday, 1=Monday, …, 6=Saturday */
const DAYS = [
    { label: "Lunes",     dia: 1 },
    { label: "Martes",    dia: 2 },
    { label: "Miércoles", dia: 3 },
    { label: "Jueves",    dia: 4 },
    { label: "Viernes",   dia: 5 },
    { label: "Sábado",    dia: 6 },
    { label: "Domingo",   dia: 0 },
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

async function fetchHorarios(deps) {
    const results = await Promise.all(
        deps.map((d) => obtenerHorariosXDeporte(d.id).catch(() => []))
    );
    return results.flat();
}

export default function SportsCalendar() {
    const [deportes, setDeportes]       = useState([]);
    const [allHorarios, setAllHorarios] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState("");
    const [selected, setSelected]       = useState(null); // null = todos

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError("");
            try {
                const deps = await obtenerDeportesActivos();
                if (cancelled) return;
                setDeportes(deps);
                const horarios = await fetchHorarios(deps);
                if (cancelled) return;
                setAllHorarios(horarios);
            } catch (err) {
                if (!cancelled) setError(err.message || "Error al cargar los horarios");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const colorOf = useMemo(() => {
        const map = {};
        deportes.forEach((d, i) => { map[d.id] = PALETTE[i % PALETTE.length]; });
        return map;
    }, [deportes]);

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
                            Filtrar por deporte
                        </Typography>
                        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                            <Chip
                                icon={<SportsSoccerIcon />}
                                label="Todos los deportes"
                                variant={selected === null ? "filled" : "outlined"}
                                color={selected === null ? "primary" : "default"}
                                onClick={() => setSelected(null)}
                                sx={{ fontWeight: selected === null ? 700 : 400 }}
                            />
                            {deportes.map((d, i) => {
                                const c = PALETTE[i % PALETTE.length];
                                const active = selected === d.id;
                                return (
                                    <Chip
                                        key={d.id}
                                        label={d.nombre}
                                        onClick={() => setSelected(active ? null : d.id)}
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
                        {deportes.length > 0 && selected === null && (
                            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 1.5, pt: 1.5, borderTop: "1px solid #e3eaf4" }}>
                                {deportes.map((d, i) => (
                                    <Stack key={d.id} direction="row" alignItems="center" spacing={0.6}>
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
                                            {d.nombre}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                </Card>

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loading && error && (
                    <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                )}

                {!loading && !error && (
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
                                                const c      = colorOf[ev.id_deporte] || PALETTE[0];

                                                return (
                                                    <Tooltip
                                                        key={ev.id}
                                                        placement="top"
                                                        arrow
                                                        title={
                                                            <Box sx={{ p: 0.5 }}>
                                                                <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", mb: 0.25 }}>
                                                                    {ev.nombre_deporte}
                                                                </Typography>
                                                                <Typography sx={{ fontSize: "0.75rem", mb: 0.25 }}>
                                                                    {fmtTime(ev.hora_inicio)} – {fmtTime(ev.hora_fin)}
                                                                </Typography>
                                                                {hasValidText(ev.espacio_deportivo) && (
                                                                    <Typography sx={{ fontSize: "0.75rem", mb: 0.25 }}>
                                                                        {ev.espacio_deportivo}
                                                                    </Typography>
                                                                )}
                                                                {hasValidText(ev.docente_responsable) && (
                                                                    <Typography sx={{ fontSize: "0.75rem" }}>
                                                                        {ev.docente_responsable}
                                                                    </Typography>
                                                                )}
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
                                                                {ev.nombre_deporte}
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
                                                            {height > 56 && hasValidText(ev.espacio_deportivo) && (
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{ display: "block", fontSize: "0.62rem", lineHeight: 1.2, opacity: 0.85 }}
                                                                    noWrap
                                                                >
                                                                    {ev.espacio_deportivo}
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
