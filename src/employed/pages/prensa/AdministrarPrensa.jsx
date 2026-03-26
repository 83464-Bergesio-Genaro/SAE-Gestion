import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  InputAdornment,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import NuevaPublicacionDialog from "./NuevaPublicacionDialog";
import {
  listarPublicacionesCompleto,
  eliminarPublicacion,
} from "../../../api/PrensaService";
import { vigenciaActiva } from "./prensa.utils";
import { PRENSA_STRINGS } from "./prensa.strings";
import { useNuevaPublicacion } from "./useNuevaPublicacion";

const C = PRENSA_STRINGS;

function prioridadChip(prioridad) {
  switch (prioridad) {
    case 1: return <Chip label={C.priorityMedium} color="warning" size="small" />;
    case 2: return <Chip label={C.priorityHigh} color="error" size="small" />;
    default: return <Chip label={C.priorityNormal} size="small" />;
  }
}

export default function AdministrarPrensa() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loadedKey, setLoadedKey] = useState(-1);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [refreshKey, setRefreshKey] = useState(0);
  const loading = loadedKey < refreshKey;

  const nueva = useNuevaPublicacion({
    onSuccess: (isEdit) => {
      setRefreshKey((k) => k + 1);
      setSnackbar({ open: true, message: isEdit ? C.snackSaved : C.snackCreated, severity: "success" });
    },
    onWarning: (msg) => setSnackbar({ open: true, message: msg, severity: "warning" }),
    onError: (msg) => setSnackbar({ open: true, message: msg, severity: "error" }),
  });

  useEffect(() => {
    listarPublicacionesCompleto()
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar publicaciones:", err))
      .finally(() => setLoadedKey(refreshKey));
  }, [refreshKey]);

  const rowsFiltradas = useMemo(() => {
    let filtradas = rows;
    if (filtroEstado === "activas")
      filtradas = filtradas.filter((r) => vigenciaActiva(r.fecha_vigencia));
    if (filtroEstado === "vencidas")
      filtradas = filtradas.filter((r) => !vigenciaActiva(r.fecha_vigencia));
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      filtradas = filtradas.filter(
        (r) =>
          (r.titulo_publicacion && r.titulo_publicacion.toLowerCase().includes(termino)) ||
          (r.descripcion && r.descripcion.toLowerCase().includes(termino))
      );
    }
    return filtradas;
  }, [rows, filtroEstado, busqueda]);

  const handleEdit = (pub) => nueva.actions.openEdit(pub);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await eliminarPublicacion(deleteTarget.id);
    } catch (err) {
      console.warn("Respuesta del delete:", err);
    }
    setDeleteTarget(null);
    setRefreshKey((k) => k + 1);
    setSnackbar({ open: true, message: C.snackDeleted, severity: "error" });
  };

  const columns = [
    { field: "id", headerName: C.colId, width: 70 },
    { field: "titulo_publicacion", headerName: C.colTitle, flex: 1, minWidth: 200 },
    { field: "descripcion", headerName: C.colDescription, flex: 1, minWidth: 200 },
    {
      field: "fecha_inicio",
      headerName: C.colStartDate,
      width: 140,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" })
          : "",
    },
    {
      field: "fecha_vigencia",
      headerName: C.colExpiry,
      width: 140,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" })
          : "",
    },
    {
      field: "prioridad",
      headerName: C.colPriority,
      width: 80,
      renderCell: (params) => prioridadChip(params.value),
    },
    {
      field: "no_dar_baja",
      headerName: C.colFixed,
      width: 80,
      renderCell: (params) => (params.value ? C.colFixed_yes : C.colFixed_no),
    },
    { field: "visualizaciones", headerName: C.colViews, width: 80 },
    {
      field: "acciones",
      headerName: C.colActions,
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => setDeleteTarget(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={() => navigate("/Prensa")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {C.adminTitle}
          </Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)", mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            sx={{
              mb: 2.5,
              width: "100%",
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
            }}
          >
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", flex: 1, minWidth: 0 }}>
              <SAEButton
                variant={filtroEstado === "todos" ? "contained" : "outlined"}
                onClick={() => setFiltroEstado("todos")}
                size="small"
              >
                {C.filterAll}
              </SAEButton>
              <SAEButton
                variant={filtroEstado === "activas" ? "contained" : "outlined"}
                onClick={() => setFiltroEstado("activas")}
                size="small"
                color="success"
              >
                {C.filterActive}
              </SAEButton>
              <SAEButton
                variant={filtroEstado === "vencidas" ? "contained" : "outlined"}
                onClick={() => setFiltroEstado("vencidas")}
                size="small"
                color="error"
              >
                {C.filterExpired}
              </SAEButton>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <SAETextField
                placeholder={C.searchPlaceholder}
                size="small"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                sx={{
                  width: { xs: "100%", sm: 250 },
                  "& .MuiOutlinedInput-root": { height: "30px" },
                  "& .MuiInputBase-input": { py: 0 },
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
                onClick={nueva.actions.open}
                size="small"
              >
                {C.newButtonLabel}
              </SAEButton>
            </Stack>
          </Stack>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={rowsFiltradas}
              columns={columns}
              loading={loading}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              autoHeight
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </CardContent>
      </Card>

      <NuevaPublicacionDialog state={nueva.state} actions={nueva.actions} />

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>{C.deleteTitle}</Typography>
          <IconButton onClick={() => setDeleteTarget(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {C.deleteConfirm(deleteTarget?.titulo_publicacion)}
            <strong>{C.deleteConfirmBold(deleteTarget?.titulo_publicacion)}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <SAEButton variant="contained" color="error" onClick={handleDeleteConfirm}>
            {C.deleteButton}
          </SAEButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
