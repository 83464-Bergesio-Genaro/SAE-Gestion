import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import {
  obtenerDeportesCompleto,
  obtenerDocentesDeportivos,
} from "../../../api/DeporteService";

const EMPTY_FORM = {
  id: 0,
  nombre_torneo: "",
  fecha_inicio: "",
  fecha_fin: "",
  fecha_limite_inscripcion: "",
  activo: true,
  id_deporte: 0,
  nombre_deporte: "",
  cuil_responsable: "",
  docente_responsable: "",
  cupo_jugadores: 0,
};

export default function TorneoFormDialog({
  open,
  onClose,
  onSave,
  initialData = null,
  mode = "create",
}) {
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deportesList, setDeportesList] = useState([]);
  const [docentesList, setDocentesList] = useState([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);

  // Reset form and load catalogs every time dialog opens
  useEffect(() => {
    if (!open) return;
    setFormData(initialData ?? EMPTY_FORM);
    setError("");

    let cancelled = false;
    setLoadingCatalogos(true);
    Promise.all([obtenerDeportesCompleto(), obtenerDocentesDeportivos()])
      .then(([deps, docs]) => {
        if (cancelled) return;
        setDeportesList(deps);
        setDocentesList(docs);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingCatalogos(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const body = {
        ...formData,
        fecha_inicio: formData.fecha_inicio
          ? `${formData.fecha_inicio}T00:00:00`
          : null,
        fecha_fin: formData.fecha_fin
          ? `${formData.fecha_fin}T00:00:00`
          : null,
        fecha_limite_inscripcion: formData.fecha_limite_inscripcion
          ? `${formData.fecha_limite_inscripcion}T00:00:00`
          : null,
        cupo_jugadores: Number(formData.cupo_jugadores) || 0,
        id_deporte: Number(formData.id_deporte) || 0,
      };
      await onSave(body);
      onClose();
    } catch (err) {
      setError(err.message || "Error al guardar el torneo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isEdit ? (
          <EditIcon color="primary" />
        ) : (
          <AddIcon color="primary" />
        )}
        {isEdit ? "Editar Torneo" : "Nuevo Torneo"}
        <IconButton size="small" onClick={onClose} sx={{ ml: "auto" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          {/* Row: nombre + cupo */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <SAETextField
              label="Nombre del Torneo"
              fullWidth
              value={formData.nombre_torneo}
              onChange={(e) => handleChange("nombre_torneo", e.target.value)}
            />
            <SAETextField
              label="Cupo de Jugadores"
              type="number"
              sx={{ minWidth: 160 }}
              value={formData.cupo_jugadores}
              onChange={(e) => handleChange("cupo_jugadores", e.target.value)}
            />
          </Stack>

          {/* Deporte autocomplete */}
          <Autocomplete
            options={deportesList}
            loading={loadingCatalogos}
            getOptionLabel={(opt) =>
              typeof opt === "string" ? opt : opt.nombre ?? ""
            }
            value={
              deportesList.find(
                (d) => String(d.id) === String(formData.id_deporte)
              ) ??
              deportesList.find(
                (d) =>
                  d.nombre?.toLowerCase() ===
                  formData.nombre_deporte?.toLowerCase()
              ) ??
              (formData.id_deporte
                ? { id: formData.id_deporte, nombre: formData.nombre_deporte }
                : null)
            }
            onChange={(_, val) => {
              if (val) {
                handleChange("id_deporte", val.id);
                handleChange("nombre_deporte", val.nombre);
              } else {
                handleChange("id_deporte", 0);
                handleChange("nombre_deporte", "");
              }
            }}
            isOptionEqualToValue={(opt, val) =>
              String(opt.id) === String(val?.id)
            }
            renderInput={(params) => (
              <SAETextField {...params} label="Deporte" fullWidth />
            )}
          />

          {/* Docente autocomplete */}
          <Autocomplete
            options={docentesList}
            loading={loadingCatalogos}
            getOptionLabel={(opt) =>
              typeof opt === "string"
                ? opt
                : `${opt.nombres ?? ""} ${opt.apellidos ?? ""}`.trim()
            }
            value={
              docentesList.find(
                (d) => d.cuil === formData.cuil_responsable
              ) ??
              (formData.cuil_responsable
                ? {
                    cuil: formData.cuil_responsable,
                    nombres: formData.docente_responsable,
                    apellidos: "",
                  }
                : null)
            }
            onChange={(_, val) => {
              if (val) {
                handleChange("cuil_responsable", val.cuil);
                handleChange(
                  "docente_responsable",
                  `${val.nombres ?? ""} ${val.apellidos ?? ""}`.trim()
                );
              } else {
                handleChange("cuil_responsable", "");
                handleChange("docente_responsable", "");
              }
            }}
            isOptionEqualToValue={(opt, val) => opt.cuil === val?.cuil}
            filterOptions={(opts, { inputValue }) => {
              const lower = inputValue.toLowerCase();
              return opts.filter(
                (d) =>
                  d.cuil?.toLowerCase().includes(lower) ||
                  `${d.nombres} ${d.apellidos}`.toLowerCase().includes(lower)
              );
            }}
            renderOption={(props, opt) => (
              <li {...props} key={opt.cuil}>
                <Box>
                  <Typography variant="body2">
                    {opt.nombres} {opt.apellidos}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {opt.cuil}
                  </Typography>
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <SAETextField {...params} label="Docente Responsable" fullWidth />
            )}
          />

          {/* Dates row */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <SAETextField
              label="Fecha Inicio"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.fecha_inicio}
              onChange={(e) => handleChange("fecha_inicio", e.target.value)}
            />
            <SAETextField
              label="Fecha Fin"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.fecha_fin}
              onChange={(e) => handleChange("fecha_fin", e.target.value)}
            />
            <SAETextField
              label="Límite Inscripción"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.fecha_limite_inscripcion}
              onChange={(e) =>
                handleChange("fecha_limite_inscripcion", e.target.value)
              }
            />
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={formData.activo}
                onChange={(e) => handleChange("activo", e.target.checked)}
              />
            }
            label="Activo"
          />

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <SAEButton variant="outlined" onClick={onClose} disabled={saving}>
          Cancelar
        </SAEButton>
        <SAEButton
          variant="contained"
          startIcon={
            saving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          onClick={handleSave}
          disabled={saving}
        >
          {isEdit ? "Guardar Cambios" : "Crear Torneo"}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
