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
import { useAuth } from "../../../shared/auth/AuthContext";
import { useMemo, useState, useEffect } from "react";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { SectionGridCard } from "./becas.utils";
import { createSectionConfig, becasGridConfig } from "./becas.configs";
import {
  datosProyectoData,
  serviciosData,
  becariosData,
  becasPorLegajo,
} from "./becas.data";
import EditIcon from "@mui/icons-material/Edit";

async function handleBuscarBecario(legajo) {
  console.log("Buscando becas para legajo", legajo);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return becasPorLegajo[legajo] ?? [];
}

export default function EmployedScholarships() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const datosProyecto = datosProyectoData; // Importar los datos del proyecto desde el archivo de datos

  const datosServicios = serviciosData;

  const datosBecarios = becariosData;

  const [proyectosRows, setProyectosRows] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  const [serviciosRows, setServiciosRows] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);

  const [becariosRows, setBecariosRows] = useState([]);
  const [loadingBecarios, setLoadingBecarios] = useState(true);

  const [dialogSaving, setDialogSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");

  const handleDialogSave = () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      // Aquí iría la lógica para guardar los datos (crear o editar según dialogMode)
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  };

  /*
  Debo crear una seccion donde recupero todos los becarios

  Otra seccion donde estan los becarios nacionales 
    Con su situacion academica
  */
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

  useEffect(() => {
    // Simular carga de datos para proyectos
    setTimeout(() => {
      setProyectosRows(datosProyecto);
      setLoadingProyectos(false);
      setServiciosRows(datosServicios);
      setLoadingServicios(false);
      setBecariosRows(datosBecarios);
      setLoadingBecarios(false);
    }, 1000);
  }, []);

  return (
    <Box
      sx={{
        mt: "-90px",
        pt: "90px",
        pb: 4,
        minHeight: "100%",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            overflow: "hidden",
            borderRadius: 6,
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 5 },
            mb: 4,
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            backgroundImage:
              "linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%), url('/images/carrousel/EntradaUTN.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
          }}
        >
          <Box sx={{ maxWidth: 700 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 0.5 }}
            >
              <IconButton
                size="small"
                onClick={() => navigate("/Inicio")}
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": {
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 1.8, opacity: 0.85, fontWeight: 700 }}
              >
                Módulo de Becas
              </Typography>
            </Stack>
            <Typography
              variant="h3"
              sx={{
                mt: 1,
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: "2rem", md: "2.6rem" },
              }}
            >
              Gestión de Becas
            </Typography>
            <Typography
              sx={{
                mt: 2,
                maxWidth: 520,
                fontSize: { xs: 15, md: 17 },
                opacity: 0.92,
              }}
            >
              Administrá becas,proyectos de investigación y servicios Desde solo
              lugar.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 3 }}
            >
              <Chip
                label={`Perfil ${user?.id_perfil ?? "-"}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  fontWeight: 700,
                }}
              />
              <Chip
                label={user?.legajo ? `Legajo ${user.legajo}` : "Sesión activa"}
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  fontWeight: 700,
                }}
              />
            </Stack>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: 180,
              height: 180,
              borderRadius: "28px",
              backgroundImage: "url('/images/principal/logoUTNrotado.png')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              transform: "rotate(8deg)",
              filter: "drop-shadow(0 18px 35px rgba(0,0,0,0.22))",
            }}
          />
        </Box>

        {/*Card de Configuracion*/}

        {Object.entries(sectionConfig).map(([cardKey, card]) => (
          <SectionGridCard
            key={cardKey}
            cardKey={cardKey}
            card={card}
            onSave={handleDialogSave}
            onBecario={handleBuscarBecario}
            becasGridConfig={becasGridConfig}
          />
        ))}
      </Container>
    </Box>
  );
}
