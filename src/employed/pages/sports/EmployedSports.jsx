import { useMemo, useState } from "react";
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

import TorneoFormDialog from "./TorneoFormDialog";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import { SportsProvider } from "../../context/providers/sportsProvider";
import { useSports } from "../../context/employedContext";
import SAEPage from "../../../shared/components/page/SAEPage";

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

export default function EmployedSports() {
  return (
    <SportsProvider>
      <EmployedSportsContent />
    </SportsProvider>
  );
}

function EmployedSportsContent() {
  const [activeSection, setActiveSection] = useState("profesores");
  const [busquedaGestion, setBusquedaGestion] = useState("");
  const [busquedaDeportes, setBusquedaDeportes] = useState("");
  const {
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
    openCreateEspacio,
    openCreateDeportista,
    openCreateDeporte,
    handlePreviewDoc,
    handleDownloadDoc,
    handleDialogChange,
    handleDialogSave,
    profesoresColumns,
    espaciosColumns,
    deportistasColumns,
    deportesColumns,
    torneosColumns,
    crearTorneo,
  } = useSports();

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
    [
      profesoresRows,
      profesoresColumns,
      loadingProfesores,
      espaciosRows,
      espaciosColumns,
      loadingEspacios,
      deportistasRows,
      deportistasColumns,
      loadingDeportistas,
      deportesRows,
      deportesColumns,
      loadingDeportes,
    ],
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
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [currentSection.rows, busquedaGestion]);

  const rowsTorneosFiltradas = useMemo(() => {
    const term = busquedaDeportes.trim().toLowerCase();
    if (!term) return torneosRows;
    return torneosRows.filter((row) =>
      [row.nombre_torneo, row.nombre_deporte, row.docente_responsable].some(
        (v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(term),
      ),
    );
  }, [torneosRows, busquedaDeportes]);

  return (
    <SAEPage>
      {/* Welcome card */}

      <HeaderPageEmployed
        header="Módulo de Deportes"
        title="Gestión de Deportes"
        description="Administrá torneos, profesores, espacios y deportistas desde un solo lugar."
      />
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
          mb: 3,
          overflow: "hidden",
        }}
      >
        {/* Gradient header */}
        <Box
          sx={{
            background: "var(--gradient)",
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
                  color:
                    activeSection === key ? "white" : "rgba(255,255,255,0.6)",
                  borderBottom:
                    activeSection === key
                      ? "3px solid white"
                      : "3px solid transparent",
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ py: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <currentSection.icon sx={{ fontSize: 30 }} />
              <Typography variant="h6" fontWeight={700}>
                {currentSection.title}
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ sm: "center" }}
            >
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
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.6)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                  "& input::placeholder": {
                    color: "rgba(255,255,255,0.7)",
                    opacity: 1,
                  },
                  "& .MuiInputAdornment-root svg": {
                    color: "rgba(255,255,255,0.7)",
                  },
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
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              sx={{ borderRadius: 0, border: "none" }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
          overflow: "hidden",
        }}
      >
        {/* Card header */}
        <Box
          sx={{
            background: "var(--gradient)",
            color: "white",
            px: 3,
            py: 2.5,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <EmojiEventsIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Gestión de Torneos
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Administrá los torneos deportivos, inscribí alumnos y consultá
                  la información.
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ sm: "center" }}
            >
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
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.6)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                  "& input::placeholder": {
                    color: "rgba(255,255,255,0.7)",
                    opacity: 1,
                  },
                  "& .MuiInputAdornment-root svg": {
                    color: "rgba(255,255,255,0.7)",
                  },
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
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              localeText={{ noRowsLabel: "No hay torneos activos" }}
              sx={{ borderRadius: 0, border: "none" }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
          overflow: "hidden",
          mt: 3,
        }}
      >
        <Box
          sx={{
            background: "var(--gradient)",
            color: "white",
            px: 3,
            py: 2.5,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
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

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            {dialogType === "docente"
              ? dialogMode === "create"
                ? "Nuevo docente deportivo"
                : "Editar docente deportivo"
              : dialogType === "espacio"
                ? dialogMode === "create"
                  ? "Nuevo espacio deportivo"
                  : "Editar espacio deportivo"
                : dialogType === "deporte"
                  ? dialogMode === "create"
                    ? "Nuevo deporte"
                    : "Editar deporte"
                  : dialogMode === "create"
                    ? "Nuevo deportista"
                    : "Editar deportista"}
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
                  error={!!dialogFieldErrors.cuil}
                  helperText={dialogFieldErrors.cuil}
                />
                <SAETextField
                  label="Nombres"
                  value={dialogData.nombres}
                  onChange={(e) =>
                    handleDialogChange("nombres", e.target.value)
                  }
                  fullWidth
                  error={!!dialogFieldErrors.nombres}
                  helperText={dialogFieldErrors.nombres}
                />
                <SAETextField
                  label="Apellidos"
                  value={dialogData.apellidos}
                  onChange={(e) =>
                    handleDialogChange("apellidos", e.target.value)
                  }
                  fullWidth
                  error={!!dialogFieldErrors.apellidos}
                  helperText={dialogFieldErrors.apellidos}
                />
                <SAETextField
                  label="Fecha de nacimiento"
                  type="date"
                  value={dialogData.fecha_nacimiento}
                  onChange={(e) =>
                    handleDialogChange("fecha_nacimiento", e.target.value)
                  }
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!dialogFieldErrors.fecha_nacimiento}
                  helperText={dialogFieldErrors.fecha_nacimiento}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={dialogData.activo}
                      onChange={(e) =>
                        handleDialogChange("activo", e.target.checked)
                      }
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
                  error={!!dialogFieldErrors.nombre}
                  helperText={dialogFieldErrors.nombre}
                />
                <SAETextField
                  label="Domicilio"
                  value={dialogData.domicilio}
                  onChange={(e) =>
                    handleDialogChange("domicilio", e.target.value)
                  }
                  fullWidth
                  error={!!dialogFieldErrors.domicilio}
                  helperText={dialogFieldErrors.domicilio}
                />
                <SAETextField
                  label="URL Google Maps"
                  value={dialogData.url_maps}
                  onChange={(e) =>
                    handleDialogChange("url_maps", e.target.value)
                  }
                  fullWidth
                  error={!!dialogFieldErrors.url_maps}
                  helperText={dialogFieldErrors.url_maps}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={dialogData.activo}
                      onChange={(e) =>
                        handleDialogChange("activo", e.target.checked)
                      }
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
                  error={!!dialogFieldErrors.legajo}
                  helperText={dialogFieldErrors.legajo}
                />
                <SAETextField
                  label="Vencimiento ficha"
                  type="date"
                  value={dialogData.vencimiento_ficha}
                  onChange={(e) =>
                    handleDialogChange("vencimiento_ficha", e.target.value)
                  }
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!dialogFieldErrors.vencimiento_ficha}
                  helperText={dialogFieldErrors.vencimiento_ficha}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={dialogData.habilitado_deportado}
                      onChange={(e) =>
                        handleDialogChange(
                          "habilitado_deportado",
                          e.target.checked,
                        )
                      }
                      color="primary"
                    />
                  }
                  label="Habilitado"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={dialogData.habilitado_deporte}
                      onChange={(e) =>
                        handleDialogChange(
                          "habilitado_deporte",
                          e.target.checked,
                        )
                      }
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
                  error={!!dialogFieldErrors.nombre}
                  helperText={dialogFieldErrors.nombre}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={dialogData.activo}
                      onChange={(e) =>
                        handleDialogChange("activo", e.target.checked)
                      }
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
          <SAEButton
            variant="outlined"
            onClick={() => setDialogOpen(false)}
            disabled={dialogSaving}
          >
            Cancelar
          </SAEButton>
          <SAEButton
            variant="contained"
            onClick={handleDialogSave}
            disabled={dialogSaving}
            startIcon={
              dialogSaving ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
            }
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
        onDownload={() =>
          previewDocRef &&
          handleDownloadDoc(
            previewDocRef.id,
            previewDocRef.nombre_documento,
            previewDocRef.extension,
          )
        }
      />

      <Dialog
        open={docsDialogOpen}
        onClose={() => setDocsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
            <Typography
              color="text.secondary"
              sx={{ py: 2, textAlign: "center" }}
            >
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
                      onClick={() =>
                        handleDownloadDoc(
                          doc.id,
                          doc.nombre_documento,
                          doc.extension,
                        )
                      }
                      disabled={downloadingDocId === doc.id}
                    >
                      {downloadingDocId === doc.id ? (
                        <CircularProgress size={18} />
                      ) : (
                        <DownloadIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton
            variant="outlined"
            onClick={() => setDocsDialogOpen(false)}
          >
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
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
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
    </SAEPage>
  );
}
