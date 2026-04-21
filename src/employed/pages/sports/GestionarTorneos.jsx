import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import TorneoFormDialog from "./TorneoFormDialog";
import {
  obtenerTorneosDeportivos,
  crearTorneo,
} from "../../../api/DeporteService";

function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString("es-AR");
}



export default function GestionarTorneos() {
  const navigate = useNavigate();
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Create dialog
  const [formOpen, setFormOpen] = useState(false);

  const fetchTorneos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerTorneosDeportivos();
      setTorneos(data.map((t) => ({ ...t, id: t.id })));
    } catch {
      setTorneos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTorneos();
  }, [fetchTorneos]);

  const torneosActivos = useMemo(
    () => torneos.filter((t) => t.activo),
    [torneos]
  );

  const filteredTorneos = useMemo(() => {
    if (!busqueda.trim()) return torneosActivos;
    const lower = busqueda.toLowerCase();
    return torneosActivos.filter(
      (t) =>
        t.nombre_torneo?.toLowerCase().includes(lower) ||
        t.nombre_deporte?.toLowerCase().includes(lower) ||
        t.docente_responsable?.toLowerCase().includes(lower)
    );
  }, [torneosActivos, busqueda]);

  const openCreate = () => setFormOpen(true);

  const handleCreate = async (body) => {
    await crearTorneo(body);
    fetchTorneos();
  };

  // ── Columns ──
  const columns = useMemo(
    () => [
      { field: "nombre_torneo", headerName: "Torneo", flex: 1, minWidth: 200 },
      { field: "nombre_deporte", headerName: "Deporte", width: 150 },
      {
        field: "fecha_inicio",
        headerName: "Inicio",
        width: 120,
        valueFormatter: (params) => formatDate(params),
      },
      {
        field: "fecha_fin",
        headerName: "Fin",
        width: 120,
        valueFormatter: (params) => formatDate(params),
      },
      {
        field: "fecha_limite_inscripcion",
        headerName: "Límite Inscripción",
        width: 150,
        valueFormatter: (params) => formatDate(params),
      },
      { field: "docente_responsable", headerName: "Responsable", flex: 1, minWidth: 160 },
      { field: "cupo_jugadores", headerName: "Cupo", width: 80 },
      {
        field: "acciones",
        headerName: "Acciones",
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Stack direction="row" alignItems="center" sx={{ height: "100%" }}>
            <IconButton
              size="small"
              color="primary"
              title="Ver / Editar torneo"
              onClick={() =>
                navigate(`/Gestion-Torneos/${params.row.id}`, { state: { torneo: params.row } })
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Stack>
        ),
      },
    ],
    [navigate]
  );

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", pb: 6 }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1a3a5c 0%, #2d6da3 100%)",
          color: "white",
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={2}>
            <EmojiEventsIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Gestión de Torneos
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>
                Administrá los torneos deportivos, inscribí alumnos y consultá la información.
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Actions bar */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <SAETextField
            size="small"
            placeholder="Buscar torneo, deporte o responsable..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <SAEButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
          >
            Nuevo Torneo
          </SAEButton>
        </Stack>

        {/* Table */}
        <Box sx={{ bgcolor: "white", borderRadius: 2, overflow: "hidden" }}>
          <DataGrid
            rows={filteredTorneos}
            columns={columns}
            loading={loading}
            autoHeight
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            localeText={{
              noRowsLabel: "No hay torneos activos",
              MuiTablePagination: { labelRowsPerPage: "Filas por página:" },
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": { bgcolor: "#f0f4f8" },
            }}
          />
        </Box>
      </Container>

      <TorneoFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleCreate}
        mode="create"
      />
    </Box>
  );
}
