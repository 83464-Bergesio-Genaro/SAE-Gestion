import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  Divider,
  Snackbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Badge,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SelectAllIcon from "@mui/icons-material/DoneAll";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import TorneoFormDialog from "./TorneoFormDialog";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import {
  obtenerTorneoXId,
  obtenerDeportistasXTorneo,
  modificarTorneo,
  crearInscripcionTorneo,
  eliminarInscripcionTorneo,
  obtenerDeportistas,
} from "../../../api/DeporteService";

function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString("es-AR");
}

function isoToInputDate(isoString) {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

function buildFormData(t) {
  return {
    id: t.id,
    nombre_torneo: t.nombre_torneo ?? "",
    fecha_inicio: isoToInputDate(t.fecha_inicio),
    fecha_fin: isoToInputDate(t.fecha_fin),
    fecha_limite_inscripcion: isoToInputDate(t.fecha_limite_inscripcion),
    activo: t.activo ?? true,
    id_deporte: t.id_deporte ?? 0,
    nombre_deporte: t.nombre_deporte ?? "",
    cuil_responsable: t.cuil_responsable ?? "",
    docente_responsable: t.docente_responsable ?? "",
    cupo_jugadores: t.cupo_jugadores ?? 0,
  };
}

export default function TorneoDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [torneo, setTorneo] = useState(null);
  const [loadingTorneo, setLoadingTorneo] = useState(true);
  const [torneoError, setTorneoError] = useState("");



  // Athletes
  const [deportistas, setDeportistas] = useState([]);
  const [loadingDeportistas, setLoadingDeportistas] = useState(false);

  // Inscribir
  const [allDeportistas, setAllDeportistas] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [selectedDeportista, setSelectedDeportista] = useState(null);
  const [inscribirSaving, setInscribirSaving] = useState(false);
  const [inscribirError, setInscribirError] = useState("");
  const [inscribirSuccess, setInscribirSuccess] = useState("");

  // Transfer panel
  const [selectedAvailable, setSelectedAvailable] = useState(new Set());
  const [busquedaDisponibles, setBusquedaDisponibles] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [inscribirMasivo, setInscribirMasivo] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const [deletingId, setDeletingId] = useState(null);
  const [busquedaInscriptos, setBusquedaInscriptos] = useState("");
  const [selectedInscriptos, setSelectedInscriptos] = useState(new Set());
  const [deletingMultiple, setDeletingMultiple] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfSrc, setPdfSrc] = useState("");

  useEffect(() => {
    setLoadingTorneo(true);
    obtenerTorneoXId(id)
      .then((data) => {
        setTorneo(data);
      })
      .catch(() => setTorneoError("Error al cargar el torneo."))
      .finally(() => setLoadingTorneo(false));
  }, [id]);

  const fetchDeportistas = useCallback(async (torneoId) => {
    setLoadingDeportistas(true);
    try {
      const data = await obtenerDeportistasXTorneo(torneoId);
      setDeportistas(data);
    } catch {
      setDeportistas([]);
    } finally {
      setLoadingDeportistas(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchDeportistas(id);
  }, [id, fetchDeportistas]);

  useEffect(() => {
    setLoadingAll(true);
    obtenerDeportistas()
      .then(setAllDeportistas)
      .catch(() => setAllDeportistas([]))
      .finally(() => setLoadingAll(false));
  }, []);

  const handleGenerarPdf = useCallback(async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const margin = 14;
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFillColor(27, 84, 158);
    doc.rect(0, 0, pageW, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(torneo.nombre_torneo ?? "Torneo", margin, 12);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${torneo.nombre_deporte ?? ""} · Responsable: ${torneo.docente_responsable ?? ""} · Generado: ${new Date().toLocaleDateString("es-AR")}`,
      margin, 22
    );

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const inicio = torneo.fecha_inicio ? formatDate(torneo.fecha_inicio) : "—";
    const fin = torneo.fecha_fin ? formatDate(torneo.fecha_fin) : "—";
    const limite = torneo.fecha_limite_inscripcion ? formatDate(torneo.fecha_limite_inscripcion) : "—";
    doc.setFont("helvetica", "bold");
    doc.text("Inicio:", margin, 35);
    doc.setFont("helvetica", "normal");
    doc.text(inicio, margin + 13, 35);
    doc.setFont("helvetica", "bold");
    doc.text("Fin:", margin + 42, 35);
    doc.setFont("helvetica", "normal");
    doc.text(fin, margin + 50, 35);
    doc.setFont("helvetica", "bold");
    doc.text("Límite inscripción:", margin + 79, 35);
    doc.setFont("helvetica", "normal");
    doc.text(limite, margin + 110, 35);

    // Cupos
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 50, 92);
    doc.text(`Inscriptos: ${deportistas.length} / ${torneo.cupo_jugadores} cupos`, margin, 43);

    // colX: Legajo(14) | Nombre(72) | Habilitado(152) | Venc.Ficha(172)
    const colX = [margin, 72, 152, 172];
    const headers = ["Legajo", "Nombre", "Hab. Dep.", "Venc. Ficha"];
    let y = 52;

    doc.setFillColor(240, 244, 248);
    doc.rect(margin, y - 4, pageW - margin * 2, 8, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 50, 92);
    headers.forEach((h, i) => doc.text(h, colX[i], y));
    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    deportistas.forEach((d, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      if (idx % 2 === 0) {
        doc.setFillColor(250, 252, 255);
        doc.rect(margin, y - 3.5, pageW - margin * 2, 7, "F");
      }
      doc.setTextColor(40, 40, 40);
      doc.text(String(d.legajo ?? ""), colX[0], y);
      doc.text(String(d.nombre_deportista ?? "").substring(0, 32), colX[1], y);
      doc.setTextColor(d.habilitado_deporte ? 30 : 180, d.habilitado_deporte ? 130 : 30, 30);
      doc.text(d.habilitado_deporte ? "Sí" : "No", colX[2], y);
      doc.setTextColor(80, 80, 80);
      doc.text(d.vencimiento_ficha ? new Date(d.vencimiento_ficha).toLocaleDateString("es-AR") : "-", colX[3], y);
      y += 7;
    });

    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${p} / ${totalPages}`,
        pageW / 2,
        doc.internal.pageSize.getHeight() - 6,
        { align: "center" }
      );
    }

    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    setPdfSrc(url);
    setPdfOpen(true);
  }, [torneo, deportistas]);

  const handleInscribir = async () => {
    if (!selectedDeportista) return;
    setInscribirSaving(true);
    setInscribirError("");
    setInscribirSuccess("");
    try {
      const body = {
        id: 0,
        nombre_torneo: torneo.nombre_torneo,
        fecha_inscripcion: new Date().toISOString(),
        nombre_deporte: torneo.nombre_deporte,
      };
      await crearInscripcionTorneo(torneo.id, selectedDeportista.id, body);
      setInscribirSuccess(
        `${selectedDeportista.nombre_deportista || selectedDeportista.legajo} inscripto correctamente.`
      );
      setSelectedDeportista(null);
      fetchDeportistas(id);
    } catch (err) {
      setInscribirError(err.message || "Error al inscribir deportista.");
    } finally {
      setInscribirSaving(false);
    }
  };

  const disponibles = useMemo(() => {
    const inscriptosLegajos = new Set(deportistas.map((d) => d.legajo));
    return allDeportistas.filter((d) => !inscriptosLegajos.has(d.legajo));
  }, [allDeportistas, deportistas]);

  const filteredDisponibles = useMemo(() => {
    if (!busquedaDisponibles.trim()) return disponibles;
    const lower = busquedaDisponibles.toLowerCase();
    return disponibles.filter(
      (d) =>
        d.legajo?.toLowerCase().includes(lower) ||
        d.nombre_deportista?.toLowerCase().includes(lower)
    );
  }, [disponibles, busquedaDisponibles]);

  const filteredInscriptos = useMemo(() => {
    if (!busquedaInscriptos.trim()) return deportistas;
    const lower = busquedaInscriptos.toLowerCase();
    return deportistas.filter(
      (d) =>
        d.legajo?.toLowerCase().includes(lower) ||
        d.nombre_deportista?.toLowerCase().includes(lower)
    );
  }, [deportistas, busquedaInscriptos]);

  const toggleSelect = (depId) => {
    setSelectedAvailable((prev) => {
      const next = new Set(prev);
      if (next.has(depId)) {
        next.delete(depId);
      } else {
        next.add(depId);
      }
      return next;
    });
  };

  const inscribirMultiple = useCallback(
    async (lista) => {
      if (!torneo) return;
      setInscribirMasivo(true);
      let ok = 0;
      for (const dep of lista) {
        try {
          const body = {
            id: 0,
            nombre_torneo: torneo.nombre_torneo,
            fecha_inscripcion: new Date().toISOString(),
            nombre_deporte: torneo.nombre_deporte,
          };
          await crearInscripcionTorneo(torneo.id, dep.id, body);
          ok += 1;
        } catch {
          // continue
        }
      }
      await fetchDeportistas(id);
      if (ok > 0) {
        const first = lista[0];
        const msg =
          ok === 1
            ? `${first.nombre_deportista || first.legajo} (${first.legajo}) inscripto correctamente`
            : `${ok} deportistas inscriptos correctamente`;
        setSnackMsg(msg);
        setSnackSeverity("success");
        setSnackOpen(true);
      }
      setInscribirMasivo(false);
    },
    [torneo, id, fetchDeportistas]
  );

  const handleMoveSelected = async () => {
    const toInscribe = disponibles.filter((d) => selectedAvailable.has(d.id));
    setSelectedAvailable(new Set());
    await inscribirMultiple(toInscribe);
  };

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      setIsDragOver(false);
      if (!draggingId) return;
      const draggedDep = disponibles.find((d) => d.id === draggingId);
      setDraggingId(null);
      if (!draggedDep) return;
      if (selectedAvailable.has(draggedDep.id) && selectedAvailable.size > 0) {
        const toInscribe = disponibles.filter((d) => selectedAvailable.has(d.id));
        setSelectedAvailable(new Set());
        await inscribirMultiple(toInscribe);
      } else {
        await inscribirMultiple([draggedDep]);
      }
    },
    [draggingId, disponibles, selectedAvailable, inscribirMultiple]
  );

  const handleEliminar = useCallback(
    async (dep) => {
      setDeletingId(dep.id);
      try {
        await eliminarInscripcionTorneo(dep.id);
        await fetchDeportistas(id);
        setSnackMsg(`${dep.nombre_deportista || dep.legajo} eliminado de la inscripción`);
        setSnackSeverity("success");
        setSnackOpen(true);
      } catch (err) {
        setSnackMsg(err?.message || "Error al eliminar la inscripción.");
        setSnackSeverity("error");
        setSnackOpen(true);
      } finally {
        setDeletingId(null);
      }
    },
    [id, fetchDeportistas]
  );

  const handleSelectAll = () =>
    setSelectedAvailable(new Set(filteredDisponibles.map((d) => d.id)));

  const handleDeselectAll = () => setSelectedAvailable(new Set());

  const toggleSelectInscripto = (depId) => {
    setSelectedInscriptos((prev) => {
      const next = new Set(prev);
      if (next.has(depId)) next.delete(depId);
      else next.add(depId);
      return next;
    });
  };

  const handleSelectAllInscriptos = () =>
    setSelectedInscriptos(new Set(filteredInscriptos.map((d) => d.id)));

  const handleDeselectAllInscriptos = () => setSelectedInscriptos(new Set());

  const handleEliminarSeleccionados = useCallback(async () => {
    const toDelete = deportistas.filter((d) => selectedInscriptos.has(d.id));
    if (toDelete.length === 0) return;
    setDeletingMultiple(true);
    let ok = 0;
    for (const dep of toDelete) {
      try {
        await eliminarInscripcionTorneo(dep.id);
        ok += 1;
      } catch { /* continue */ }
    }
    setSelectedInscriptos(new Set());
    await fetchDeportistas(id);
    if (ok > 0) {
      const first = toDelete[0];
      const msg =
        ok === 1
          ? `${first.nombre_deportista || first.legajo} eliminado de la inscripción`
          : `${ok} deportistas eliminados de la inscripción`;
      setSnackMsg(msg);
      setSnackSeverity("success");
      setSnackOpen(true);
    }
    setDeletingMultiple(false);
  }, [deportistas, selectedInscriptos, id, fetchDeportistas]);

  let disponiblesContent;
  if (loadingAll) {
    disponiblesContent = (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  } else if (filteredDisponibles.length === 0) {
    disponiblesContent = (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No hay deportistas disponibles
        </Typography>
      </Box>
    );
  } else {
    disponiblesContent = (
      <List dense disablePadding>
        {filteredDisponibles.map((d) => (
          <ListItem
            key={d.id}
            disablePadding
            draggable
            onDragStart={() => setDraggingId(d.id)}
            onDragEnd={() => setDraggingId(null)}
            sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
          >
            <ListItemButton
              selected={selectedAvailable.has(d.id)}
              onClick={() => toggleSelect(d.id)}
              sx={{ py: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 28 }}>
                <DragIndicatorIcon fontSize="small" sx={{ color: "#bdbdbd", pointerEvents: "none" }} />
              </ListItemIcon>
              <Checkbox
                size="small"
                checked={selectedAvailable.has(d.id)}
                tabIndex={-1}
                disableRipple
                sx={{ p: 0.5 }}
              />
              <ListItemText
                primary={<Typography variant="body2" noWrap>{d.nombre_deportista || d.legajo}</Typography>}
                secondary={
                  d.nombre_deportista
                    ? <Typography variant="caption" color="text.secondary">{d.legajo}</Typography>
                    : undefined
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }

  let inscriptosContent;
  if (loadingDeportistas) {
    inscriptosContent = (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  } else if (filteredInscriptos.length === 0) {
    inscriptosContent = (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {deportistas.length === 0 ? "Ningún deportista inscripto" : "Sin resultados"}
        </Typography>
      </Box>
    );
  } else {
    inscriptosContent = (
      <List dense disablePadding>
        {filteredInscriptos.map((d) => (
          <ListItem
            key={d.id}
            sx={{ py: 0.5 }}
            secondaryAction={
              <IconButton
                edge="end"
                size="small"
                color="error"
                title="Eliminar inscripción"
                disabled={deletingId === d.id || deletingMultiple}
                onClick={() => handleEliminar(d)}
              >
                {deletingId === d.id ? (
                  <CircularProgress size={16} color="error" />
                ) : (
                  <DeleteIcon fontSize="small" />
                )}
              </IconButton>
            }
          >
            <Checkbox
              size="small"
              checked={selectedInscriptos.has(d.id)}
              onChange={() => toggleSelectInscripto(d.id)}
              sx={{ p: 0.5, mr: 0.5 }}
            />
            <ListItemText
              primary={<Typography variant="body2" noWrap>{d.nombre_deportista || d.legajo}</Typography>}
              secondary={
                d.nombre_deportista
                  ? <Typography variant="caption" color="text.secondary">{d.legajo}</Typography>
                  : undefined
              }
            />
            <Chip
              size="small"
              label={d.habilitado_deporte ? "Hab." : "No hab."}
              color={d.habilitado_deporte ? "success" : "error"}
              sx={{ ml: 1, mr: 4, flexShrink: 0 }}
            />
          </ListItem>
        ))}
      </List>
    );
  }

  // ── Render ──
  if (loadingTorneo) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100%", bgcolor: "#f4f8fc", mt: "-90px", pt: "90px" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (torneoError) {
    return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Alert severity="error">{torneoError}</Alert>
        <SAEButton
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
          onClick={() => navigate("/Gestion-Deportes")}
        >
          Volver
        </SAEButton>
      </Container>
    );
  }

  if (!torneo) return null;

  return (
    <Box sx={{ pb: 8, mt: "-90px", pt: "90px", minHeight: "100%", bgcolor: "#f4f8fc" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            overflow: "hidden",
            borderRadius: 6,
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 5 },
            minHeight: 260,
            backgroundImage: torneo.activo
              ? "linear-gradient(125deg, rgba(18,54,102,0.97) 0%, rgba(53,108,178,0.93) 58%, rgba(108,171,221,0.88) 100%), url('/images/varias/campus.jpg')"
              : "linear-gradient(125deg, rgba(60,60,60,0.97) 0%, rgba(100,100,100,0.93) 58%, rgba(150,150,150,0.88) 100%), url('/images/varias/campus.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
          }}
        >
          {/* Top row: back arrow + overline + edit pencil */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                size="small"
                onClick={() => navigate("/Gestion-Deportes")}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.15)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 1.8, opacity: 0.85, fontWeight: 700 }}
              >
                Torneo Deportivo
              </Typography>
            </Stack>
            <IconButton
              size="small"
              onClick={() => setEditOpen(true)}
              title="Editar torneo"
              sx={{
                color: "white",
                bgcolor: "rgba(255,255,255,0.15)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box sx={{ mt: 1.5 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: { xs: "2rem", md: "3rem" } }}
            >
              {torneo.nombre_torneo}
            </Typography>
            <Typography sx={{ mt: 1.5, fontSize: { xs: 15, md: 17 }, opacity: 0.92 }}>
              {torneo.nombre_deporte} · Responsable: {torneo.docente_responsable || "—"}{torneo.cuil_responsable ? ` — ${torneo.cuil_responsable}` : ""}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2.5 }}>
              <Chip
                label={torneo.activo ? "Activo" : "Inactivo"}
                size="small"
                sx={{
                  bgcolor: torneo.activo ? "rgba(76,175,80,0.28)" : "rgba(211,47,47,0.55)",
                  color: "white",
                  fontWeight: 700,
                  border: "1px solid rgba(255,255,255,0.4)",
                }}
              />
              <Chip
                label={`${deportistas.length} / ${torneo.cupo_jugadores} cupos`}
                size="small"
                sx={{
                  bgcolor:
                    deportistas.length >= torneo.cupo_jugadores
                      ? "rgba(244,67,54,0.35)"
                      : "rgba(255,255,255,0.18)",
                  color: "white",
                  fontWeight: 700,
                  border: "1px solid rgba(255,255,255,0.4)",
                }}
              />
              {torneo.fecha_inicio && (
                <Chip
                  label={`Inicio: ${formatDate(torneo.fecha_inicio)}`}
                  size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", fontWeight: 700, border: "1px solid rgba(255,255,255,0.4)" }}
                />
              )}
              {torneo.fecha_fin && (
                <Chip
                  label={`Fin: ${formatDate(torneo.fecha_fin)}`}
                  size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", fontWeight: 700, border: "1px solid rgba(255,255,255,0.4)" }}
                />
              )}
            </Stack>
          </Box>
        </Box>

        <Stack spacing={4} sx={{ mt: 5 }}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <PersonAddIcon color="success" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={700}>
                Inscribir Alumno
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="stretch">
              {loadingAll ? (
                <CircularProgress size={24} />
              ) : (
                <Autocomplete
                  sx={{ flex: 1 }}
                  size="small"
                  options={allDeportistas}
                  getOptionLabel={(opt) =>
                    opt.nombre_deportista
                      ? `${opt.legajo} — ${opt.nombre_deportista}`
                      : String(opt.legajo ?? "")
                  }
                  value={selectedDeportista}
                  onChange={(_, val) => setSelectedDeportista(val)}
                  renderInput={(params) => (
                    <SAETextField {...params} size="small" label="Buscar deportista por legajo o nombre" fullWidth />
                  )}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                />
              )}
              <SAEButton
                variant="contained"
                color="success"
                size="small"
                startIcon={
                  inscribirSaving ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <PersonAddIcon fontSize="small" />
                  )
                }
                onClick={handleInscribir}
                disabled={!selectedDeportista || inscribirSaving}
                sx={{ px: 2.5, whiteSpace: "nowrap", flexShrink: 0 }}
              >
                Inscribir
              </SAEButton>
            </Stack>

            {inscribirError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {inscribirError}
              </Alert>
            )}
            {inscribirSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {inscribirSuccess}
              </Alert>
            )}
          </Paper>

          <Divider />

          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
              <GroupsIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Gestionar Inscripciones
              </Typography>
              <Chip
                size="small"
                label={`${deportistas.length} / ${torneo.cupo_jugadores} cupos`}
                color={deportistas.length >= torneo.cupo_jugadores ? "error" : "success"}
                sx={{ ml: 1 }}
              />
            </Stack>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: { md: "stretch" },
              }}
            >
              {/* Left: disponibles */}
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Disponibles
                  </Typography>
                  <Chip size="small" label={disponibles.length} />
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <SAETextField
                    size="small"
                    placeholder="Buscar..."
                    value={busquedaDisponibles}
                    onChange={(e) => setBusquedaDisponibles(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Tooltip title="Seleccionar todos">
                    <span>
                      <IconButton
                        size="small"
                        onClick={handleSelectAll}
                        disabled={filteredDisponibles.length === 0}
                      >
                        <SelectAllIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Limpiar selección">
                    <span>
                      <IconButton
                        size="small"
                        onClick={handleDeselectAll}
                        disabled={selectedAvailable.size === 0}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
                <Box
                  sx={{
                    height: 360,
                    overflow: "auto",
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    bgcolor: "#fafafa",
                  }}
                >
                  {disponiblesContent}
                </Box>
              </Box>

              {/* Center: action */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  py: { md: 2 },
                }}
              >
                <Badge badgeContent={selectedAvailable.size || undefined} color="primary">
                  <IconButton
                    color="primary"
                    onClick={handleMoveSelected}
                    disabled={selectedAvailable.size === 0 || inscribirMasivo}
                    sx={{
                      bgcolor: "#5B96CC",
                      color: "white",
                      "&:hover": { bgcolor: "#477EAF" },
                      "&.Mui-disabled": { bgcolor: "#e0e0e0", color: "#9e9e9e" },
                    }}
                  >
                    {inscribirMasivo ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      <ArrowForwardIcon />
                    )}
                  </IconButton>
                </Badge>
                <Typography variant="caption" color="text.secondary" textAlign="center">
                  o arrastrá
                </Typography>
              </Box>

              <Box
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Inscriptos
                  </Typography>
                  <Chip size="small" label={deportistas.length} color="primary" />
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <SAETextField
                    size="small"
                    placeholder="Buscar..."
                    value={busquedaInscriptos}
                    onChange={(e) => setBusquedaInscriptos(e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <Tooltip title="Seleccionar todos">
                    <span>
                      <IconButton
                        size="small"
                        onClick={handleSelectAllInscriptos}
                        disabled={filteredInscriptos.length === 0}
                      >
                        <SelectAllIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Limpiar selección">
                    <span>
                      <IconButton
                        size="small"
                        onClick={handleDeselectAllInscriptos}
                        disabled={selectedInscriptos.size === 0}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Eliminar seleccionados">
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={handleEliminarSeleccionados}
                        disabled={selectedInscriptos.size === 0 || deletingMultiple}
                      >
                        {deletingMultiple
                          ? <CircularProgress size={16} color="error" />
                          : <DeleteSweepIcon fontSize="small" />}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
                <Box
                  sx={{
                    height: 360,
                    overflow: "auto",
                    border: isDragOver ? "2px dashed #2d6da3" : "1px solid #e0e0e0",
                    borderRadius: 1,
                    bgcolor: isDragOver ? "#e8f4fd" : "#fafafa",
                    transition: "border 0.15s, background 0.15s",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {isDragOver && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 2,
                        color: "#2d6da3",
                        borderBottom: "1px dashed #90caf9",
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Soltar para inscribir
                      </Typography>
                    </Box>
                  )}
                  {inscriptosContent}
                </Box>
              </Box>
            </Box>
          </Paper>

          <Divider />

          {/* ── Athletes detail table ── */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <GroupsIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Deportistas Inscriptos
              </Typography>
              {!loadingDeportistas && (
                <Chip size="small" label={deportistas.length} color="primary" />
              )}
              <Box sx={{ flex: 1 }} />
              <Tooltip title="Generar PDF">
                <span>
                  <IconButton
                    size="small"
                    disabled={deportistas.length === 0}
                    onClick={handleGenerarPdf}
                    sx={{ color: "text.secondary" }}
                  >
                    <PictureAsPdfIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Notificar inscriptos">
                <span>
                  <IconButton
                    size="small"
                    disabled={deportistas.length === 0}
                    onClick={() => {}}
                    sx={{ color: "text.secondary" }}
                  >
                    <NotificationsActiveIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Descargar documentación">
                <span>
                  <IconButton
                    size="small"
                    disabled={deportistas.length === 0}
                    onClick={() => {}}
                    sx={{ color: "text.secondary" }}
                  >
                    <FolderZipIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>

            {loadingDeportistas && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {!loadingDeportistas && deportistas.length === 0 && (
              <Alert severity="info">
                No hay deportistas inscriptos en este torneo todavía.
              </Alert>
            )}

            {!loadingDeportistas && deportistas.length > 0 && (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#f0f4f8" }}>
                    <TableRow>
                      <TableCell><b>Legajo</b></TableCell>
                      <TableCell><b>Nombre</b></TableCell>
                      <TableCell align="center"><b>Habilitado</b></TableCell>
                      <TableCell><b>Venc. Ficha</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deportistas.map((d) => (
                      <TableRow key={d.id} hover>
                        <TableCell>{d.legajo}</TableCell>
                        <TableCell>{d.nombre_deportista}</TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={d.habilitado_deporte ? "Sí" : "No"}
                            color={d.habilitado_deporte ? "success" : "error"}
                          />
                        </TableCell>
                        <TableCell>{formatDate(d.vencimiento_ficha)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Stack>
      </Container>
      <DocumentPreviewDialog
        open={pdfOpen}
        onClose={() => { setPdfOpen(false); URL.revokeObjectURL(pdfSrc); setPdfSrc(""); }}
        title={`Inscriptos — ${torneo?.nombre_torneo ?? ""}`}
        imageSrc={pdfSrc}
        isPdf
        onDownload={() => {
          const a = document.createElement("a");
          a.href = pdfSrc;
          a.download = `inscriptos_${torneo?.nombre_torneo ?? "torneo"}.pdf`;
          a.click();
        }}
      />

      <TorneoFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={async (body) => {
          await modificarTorneo(body.id, body);
          const refreshed = await obtenerTorneoXId(id);
          setTorneo(refreshed);
          setEditOpen(false);
          setSnackMsg("Torneo guardado correctamente.");
          setSnackSeverity("success");
          setSnackOpen(true);
        }}
        initialData={torneo ? buildFormData(torneo) : null}
        mode="edit"
      />

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
