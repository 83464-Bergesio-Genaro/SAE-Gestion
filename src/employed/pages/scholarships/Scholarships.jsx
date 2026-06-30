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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { useMemo } from "react";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import { SectionGridCard } from "./becas.utils";
import { createSectionConfig, becasGridConfig } from "./becas.configs";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import EditIcon from "@mui/icons-material/Edit";
import {
  ObtenerProyectosInvestigacion,
  ObtenerBecariosCompleto,
  ObtenerServiciosInternos,
  CrearServicioInterno,
  CrearProyectoInvestigacion,
  EditarProyectoInvestigacion,
  EditarServicioInterno,
  ObtenerBecariosEconomicaXLegajo,
  ObtenerBecariosServiciosXLegajo,
  ObtenerBecariosInvestigacionXLegajo,
  ObtenerBecariosXLegajo,
  ObtenerUsuariosXLegajo,
  CrearBecarioSAE,
  CrearBecarioEconomica,
  CrearBecarioInvestigacion,
  CrearBecarioServicio,
  EditarBecarioSAE,
  EditarBecarioEconomica,
  EditarBecarioInvestigacion,
  EditarBecarioServicio,
} from "../../../api/BecasService";
import { ScholarshipProvider } from "../../context/providers/scholarshipProvider";
import { useScholarships } from "../../context/employedContext";
import SAEPage from "../../../shared/components/page/SAEPage";

export default function EmployedScholarships() {
  return (
    <ScholarshipProvider>
      <EmployedScholarshipsContent />
    </ScholarshipProvider>
  );
}

function EmployedScholarshipsContent() {
  const {
    handleDialogSave,
    handleBuscarBecario,
    handleBuscarBecarioPorLegajo,

    snackbar,
    setSnackbar,
    proyectosRows,
    loadingProyectos,
    serviciosRows,
    loadingServicios,
    becariosRows,
    loadingBecarios,
  } = useScholarships();
  // Configuracion de UI derivada de los datos cargados. Mantenerla memoizada
  // evita reconstruir columnas/secciones en cada render innecesariamente.
  const sectionConfig = useMemo(
    () =>
      createSectionConfig({
        proyectosRows,
        loadingProyectos,
        serviciosRows,
        loadingServicios,
        becariosRows,
        loadingBecarios,
      }),
    [
      proyectosRows,
      loadingProyectos,
      serviciosRows,
      loadingServicios,
      becariosRows,
      loadingBecarios,
    ],
  );

  return (
    <SAEPage>
      <HeaderPageEmployed
        header=" Módulo de Becas"
        title="Gestión de Becas"
        description="Administrá becas,proyectos de investigación y servicios Desde solo
              lugar."
      />
      {/* Cards de configuración y gestión de becarios */}
      {Object.entries(sectionConfig).map(([cardKey, card]) => (
        <SectionGridCard
          key={cardKey}
          cardKey={cardKey}
          card={card}
          onSave={handleDialogSave}
          onBecario={handleBuscarBecario}
          onBuscarBecario={handleBuscarBecarioPorLegajo}
          becasGridConfig={becasGridConfig(serviciosRows, proyectosRows)}
        />
      ))}
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
    </SAEPage>
  );
}
