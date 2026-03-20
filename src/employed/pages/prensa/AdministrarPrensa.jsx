import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Switch,
  FormControlLabel,
  Chip,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import {
  listarPublicacionesCompleto,
  crearPublicacion,
  modificarPublicacion,
  eliminarPublicacion,
  crearDocumentoPrensa,
  crearVinculoDocPubli,
} from "../../../api/PrensaService";

const PRIORIDAD_OPTIONS = [
  { value: 0, label: "Normal", chipColor: "default" },
  { value: 1, label: "Media", chipColor: "warning" },
  { value: 2, label: "Alta", chipColor: "error" },
];

function prioridadChip(prioridad) {
  switch (prioridad) {
    case 0: return <Chip label="Normal" size="small" />;
    case 1: return <Chip label="Media" color="warning" size="small" />;
    case 2: return <Chip label="Alta" color="error" size="small" />;
    default: return <Chip label="Normal" size="small" />;
  }
}

function vigenciaActiva(fecha_vigencia) {
  if (!fecha_vigencia) return false;
  return new Date(fecha_vigencia) >= new Date();
}

export default function AdministrarPrensa() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [openNueva, setOpenNueva] = useState(false);
  const [nuevaData, setNuevaData] = useState(null);
  const [savingNueva, setSavingNueva] = useState(false);
  const [archivoNueva, setArchivoNueva] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchPublicaciones = useCallback(() => {
    setLoading(true);
    listarPublicacionesCompleto()
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar publicaciones:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPublicaciones();
  }, [fetchPublicaciones, refreshKey]);

  const emptyPublicacion = () => ({
    titulo_publicacion: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_vigencia: "",
    prioridad: 0,
    no_dar_baja: false,
    visualizaciones: 0,
  });

  const handleOpenNueva = () => {
    setNuevaData(emptyPublicacion());
    setOpenNueva(true);
  };

  const handleCloseNueva = () => {
    setOpenNueva(false);
    setNuevaData(null);
    setArchivoNueva(null);
  };

  const handleNuevaChange = (field, value) => {
    setNuevaData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNueva = async () => {
    if (!nuevaData) return;
    setSavingNueva(true);
    try {
      const body = {
        ...nuevaData,
        id: 0,
        fecha_inicio: nuevaData.fecha_inicio
          ? new Date(nuevaData.fecha_inicio).toISOString()
          : null,
        fecha_vigencia: nuevaData.fecha_vigencia
          ? new Date(nuevaData.fecha_vigencia).toISOString()
          : null,
      };
      const created = await crearPublicacion(body);

      if (archivoNueva && created?.id) {
        const formData = new FormData();
        formData.append("archivo", archivoNueva);
        let doc;
        try {
          doc = await crearDocumentoPrensa(formData);
        } catch (err) {
          console.error("Error al subir documento:", err);
          setSnackbar({ open: true, message: "Publicación creada, pero falló la subida del documento", severity: "warning" });
          handleCloseNueva();
          setRefreshKey((k) => k + 1);
          return;
        }
        if (doc?.id) {
          try {
            await crearVinculoDocPubli(created.id, doc.id);
          } catch (err) {
            console.error("Error al vincular documento:", err);
            setSnackbar({ open: true, message: "Publicación creada, pero falló el vínculo con el documento", severity: "warning" });
            handleCloseNueva();
            setRefreshKey((k) => k + 1);
            return;
          }
        }
      }

      handleCloseNueva();
      setRefreshKey((k) => k + 1);
      setSnackbar({ open: true, message: "Publicación guardada", severity: "success" });
    } catch (err) {
      console.error("Error al crear publicación:", err);
      setSnackbar({ open: true, message: "Error al crear publicación", severity: "error" });
    } finally {
      setSavingNueva(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await eliminarPublicacion(deleteTarget.id);
    } catch (err) {
      console.warn("Respuesta del delete:", err);
    }
    setDeleteTarget(null);
    setRefreshKey((k) => k + 1);
    setSnackbar({ open: true, message: "Publicación eliminada", severity: "error" });
  };

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

  const handleEdit = (pub) => {
    setEditData({
      id: pub.id,
      titulo_publicacion: pub.titulo_publicacion || "",
      descripcion: pub.descripcion || "",
      fecha_inicio: pub.fecha_inicio ? pub.fecha_inicio.slice(0, 16) : "",
      fecha_vigencia: pub.fecha_vigencia ? pub.fecha_vigencia.slice(0, 16) : "",
      prioridad: pub.prioridad ?? 0,
      no_dar_baja: pub.no_dar_baja ?? false,
      visualizaciones: pub.visualizaciones ?? 0,
    });
    setArchivo(null);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setEditData(null);
    setArchivo(null);
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editData) return;
    setSaving(true);
    try {
      const body = {
        ...editData,
        fecha_inicio: editData.fecha_inicio
          ? new Date(editData.fecha_inicio).toISOString()
          : null,
        fecha_vigencia: editData.fecha_vigencia
          ? new Date(editData.fecha_vigencia).toISOString()
          : null,
      };

      const updated = await modificarPublicacion(editData.id, body);
      setRows((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );

      if (archivo) {
        const formData = new FormData();
        formData.append("archivo", archivo);
        await crearDocumentoPrensa(formData);
      }

      handleClose();
      setRefreshKey((k) => k + 1);
      setSnackbar({ open: true, message: "Publicación guardada", severity: "success" });
    } catch (err) {
      console.error("Error al guardar:", err);
      setSnackbar({ open: true, message: "Error al guardar", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "titulo_publicacion",
      headerName: "Título",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "descripcion",
      headerName: "Descripción",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "fecha_inicio",
      headerName: "Fecha Inicio",
      width: 160,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("es-AR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
    },
    {
      field: "fecha_vigencia",
      headerName: "Vigencia",
      width: 160,
      valueFormatter: (value) =>
        value
          ? new Date(value).toLocaleDateString("es-AR", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "",
    },
    {
      field: "prioridad",
      headerName: "Prioridad",
      width: 80,
      renderCell: (params) => prioridadChip(params.value),
    },
    {
      field: "no_dar_baja",
      headerName: "Fija",
      width: 80,
      renderCell: (params) => (params.value ? "Sí" : "No"),
    },
    {
      field: "visualizaciones",
      headerName: "Vistas",
      width: 80,
    },
    {
      field: "acciones",
      headerName: "Acciones",
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={() => navigate("/Prensa")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Administrar Publicaciones
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <SAEButton
            variant={filtroEstado === "todos" ? "contained" : "outlined"}
            onClick={() => setFiltroEstado("todos")}
            size="small"
          >
            Todas
          </SAEButton>
          <SAEButton
            variant={filtroEstado === "activas" ? "contained" : "outlined"}
            onClick={() => setFiltroEstado("activas")}
            size="small"
            color="success"
          >
            Activas
          </SAEButton>
          <SAEButton
            variant={filtroEstado === "vencidas" ? "contained" : "outlined"}
            onClick={() => setFiltroEstado("vencidas")}
            size="small"
            color="error"
          >
            Vencidas
          </SAEButton>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <SAETextField
            placeholder="Buscar..."
            size="small"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ width: 250, "& .MuiInputBase-input": { py: "4px" } }}
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
            onClick={handleOpenNueva}
            size="small"
          >
            Nueva
          </SAEButton>
        </Box>
      </Box>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rowsFiltradas}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          autoHeight
          sx={{ borderRadius: 2 }}
        />
      </Box>

      {/* Modal de edición */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
        {editData && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Editar Publicación</Typography>
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px !important" }}>
              <SAETextField
                label="Título"
                fullWidth
                value={editData.titulo_publicacion}
                onChange={(e) => handleChange("titulo_publicacion", e.target.value)}
              />
              <SAETextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={editData.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
              />
              <SAETextField
                label="Fecha Inicio"
                type="datetime-local"
                fullWidth
                value={editData.fecha_inicio}
                onChange={(e) => handleChange("fecha_inicio", e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <SAETextField
                label="Fecha Vigencia"
                type="datetime-local"
                fullWidth
                value={editData.fecha_vigencia}
                onChange={(e) => handleChange("fecha_vigencia", e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Prioridad</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {PRIORIDAD_OPTIONS.map((opt) => {
                    const isSelected =
                      opt.value === editData.prioridad ||
                      (opt.value === 0 && editData.prioridad !== 1 && editData.prioridad !== 2);
                    return (
                      <Chip
                        key={opt.value}
                        label={opt.label}
                        color={isSelected ? opt.chipColor : "default"}
                        variant={isSelected ? "filled" : "outlined"}
                        onClick={() => handleChange("prioridad", opt.value)}
                        sx={{ cursor: "pointer" }}
                      />
                    );
                  })}
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={editData.no_dar_baja}
                    onChange={(e) => handleChange("no_dar_baja", e.target.checked)}
                    color="secondary"
                  />
                }
                label="No dar de baja"
              />
              <SAEButton
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                {archivo ? archivo.name : "Adjuntar documento"}
                <input
                  type="file"
                  hidden
                  onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                />
              </SAEButton>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <SAEButton
                variant="contained"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar"}
              </SAEButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Modal nueva publicación */}
      <Dialog open={openNueva} onClose={handleCloseNueva} maxWidth="sm" fullWidth>
        {nuevaData && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>Nueva Publicación</Typography>
              <IconButton onClick={handleCloseNueva} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px !important" }}>
              <SAETextField
                label="Título"
                fullWidth
                value={nuevaData.titulo_publicacion}
                onChange={(e) => handleNuevaChange("titulo_publicacion", e.target.value)}
              />
              <SAETextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={nuevaData.descripcion}
                onChange={(e) => handleNuevaChange("descripcion", e.target.value)}
              />
              <SAETextField
                label="Fecha Inicio"
                type="datetime-local"
                fullWidth
                value={nuevaData.fecha_inicio}
                onChange={(e) => handleNuevaChange("fecha_inicio", e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <SAETextField
                label="Fecha Vigencia"
                type="datetime-local"
                fullWidth
                value={nuevaData.fecha_vigencia}
                onChange={(e) => handleNuevaChange("fecha_vigencia", e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Prioridad</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {PRIORIDAD_OPTIONS.map((opt) => {
                    const isSelected =
                      opt.value === nuevaData.prioridad ||
                      (opt.value === 0 && nuevaData.prioridad !== 1 && nuevaData.prioridad !== 2);
                    return (
                      <Chip
                        key={opt.value}
                        label={opt.label}
                        color={isSelected ? opt.chipColor : "default"}
                        variant={isSelected ? "filled" : "outlined"}
                        onClick={() => handleNuevaChange("prioridad", opt.value)}
                        sx={{ cursor: "pointer" }}
                      />
                    );
                  })}
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={nuevaData.no_dar_baja}
                    onChange={(e) => handleNuevaChange("no_dar_baja", e.target.checked)}
                    color="secondary"
                  />
                }
                label="No dar de baja"
              />
              <SAEButton
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                {archivoNueva ? archivoNueva.name : "Adjuntar documento"}
                <input
                  type="file"
                  hidden
                  onChange={(e) => setArchivoNueva(e.target.files?.[0] || null)}
                />
              </SAEButton>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <SAEButton
                variant="contained"
                onClick={handleSaveNueva}
                disabled={savingNueva}
              >
                {savingNueva ? "Guardando..." : "Guardar"}
              </SAEButton>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog confirmar eliminación */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Eliminar publicación</Typography>
          <IconButton onClick={() => setDeleteTarget(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar <strong>{deleteTarget?.titulo_publicacion}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <SAEButton variant="contained" color="error" onClick={handleDeleteConfirm}>
            Eliminar
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
