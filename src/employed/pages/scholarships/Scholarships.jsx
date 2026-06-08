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
import { useAuth } from "../../../shared/context/sharedContext"; 
import { useMemo } from "react";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
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

export default function EmployedScholarships() {
    return (
        <ScholarshipProvider>
            <EmployedScholarshipsContent />
        </ScholarshipProvider>
    );
}

function EmployedScholarshipsContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    handleDialogSave,
    handleBuscarBecario,
    handleBuscarBecarioPorLegajo,

    snackbar,setSnackbar,
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
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "90px", md: "100px" },
        pb: 4,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
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
      </Container>
    </Box>
  );
}
