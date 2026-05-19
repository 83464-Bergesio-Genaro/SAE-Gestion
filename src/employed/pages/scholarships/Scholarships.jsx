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
import { useMemo, useState, useEffect, useCallback } from "react";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { SectionGridCard } from "./becas.utils";
import { createSectionConfig, becasGridConfig } from "./becas.configs";

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
} from "../../../api/BecasService";

const getFirstRecord = (value) => {
  // Los endpoints pueden devolver un objeto, una lista o una respuesta vacía.
  // El editor necesita siempre un objeto para poder pintar correctamente los campos.
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};

async function handleBuscarBecario(legajo) {
  console.log("Buscar becas para el legajo: ", legajo);

  const [becasEconomicas, becasServicios, becasInvestigacion] =
    await Promise.all([
      ObtenerBecariosEconomicaXLegajo(legajo),
      ObtenerBecariosServiciosXLegajo(legajo),
      ObtenerBecariosInvestigacionXLegajo(legajo),
    ]);

  return [
    {
      tipo: "economica",
      nombre: "Beca económica",
      datos: getFirstRecord(becasEconomicas),
    },
    {
      tipo: "servicio",
      nombre: "Servicio interno",
      datos: getFirstRecord(becasServicios),
    },
    {
      tipo: "investigacion",
      nombre: "Investigación",
      datos: getFirstRecord(becasInvestigacion),
    },
  ].filter((beca) => Boolean(beca.datos));
}

async function handleBuscarBecarioPorLegajo(legajo) {
  const becario = await ObtenerUsuariosXLegajo(String(legajo).trim());
  return getFirstRecord(becario);
}

export default function EmployedScholarships() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchProyectosInvetigacion = useCallback(async () => {
    setLoadingProyectos(true);
    try {
      const data = await ObtenerProyectosInvestigacion();
      setProyectosRows(data);
    } catch (err) {
      setProyectosRows([]);
      console.error("Error al cargar proyectos de investigación:", err);
    } finally {
      setLoadingProyectos(false);
    }
  }, []);

  const fetchServiciosInternos = useCallback(async () => {
    setLoadingServicios(true);
    try {
      const data = await ObtenerServiciosInternos();
      setServiciosRows(data);
    } catch (err) {
      setServiciosRows([]);
      console.error("Error al cargar servicios internos:", err);
    } finally {
      setLoadingServicios(false);
    }
  }, []);

  const fetchBecariosCompleto = useCallback(async () => {
    setLoadingBecarios(true);
    try {
      const data = await ObtenerBecariosCompleto();
      setBecariosRows(data);
    } catch (err) {
      setBecariosRows([]);
      console.error("Error al cargar becarios completos:", err);
    } finally {
      setLoadingBecarios(false);
    }
  }, []);

  useEffect(() => {
    fetchProyectosInvetigacion();
    fetchServiciosInternos();
    fetchBecariosCompleto();
  }, [
    fetchProyectosInvetigacion,
    fetchServiciosInternos,
    fetchBecariosCompleto,
  ]);

  const [proyectosRows, setProyectosRows] = useState([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  const [serviciosRows, setServiciosRows] = useState([]);
  const [loadingServicios, setLoadingServicios] = useState(true);

  const [becariosRows, setBecariosRows] = useState([]);
  const [loadingBecarios, setLoadingBecarios] = useState(true);

  const [dialogSaving, setDialogSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");

  const [usuarioSelected, setUsuarioSelected] = useState(null);
  const [loadingUsuario, setLoadingUsuario] = useState(false);

  const fetchUsuariosXlegajo = async (legajo) => {
    try {
      setLoadingUsuario(true);

      const usuario = await ObtenerUsuarioXLegajo(legajo);

      if (!usuario) return;

      setUsuarioSelected(usuario);

      setDialogData((prev) => ({
        ...prev,
        legajo: usuario.legajo,
        nombre_becario: usuario.nombre_usuario,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUsuario(false);
    }
  };

  const handleDialogSave = async ({ cardKey, sectionKey, mode, data }) => {
    var mensajeSnackbar = "La acción se realizó exitosamente";
    try {
      setDialogSaving(true);
      setDialogError("");

      switch (sectionKey) {
        case "proyectos":
          if (mode === "create") {
            await CrearProyectoInvestigacion(data);
            await fetchProyectosInvetigacion();
            mensajeSnackbar = "Proyecto de investigación creado exitosamente";
          }
          if (mode === "edit") {
            // Aquí iría la lógica para editar un proyecto de investigación
            await EditarProyectoInvestigacion(data.id, data);
            await fetchProyectosInvetigacion();
            mensajeSnackbar = "Proyecto de investigación editado exitosamente";
          }
          break;
        case "servicios":
          if (mode === "create") {
            await CrearServicioInterno(data);
            await fetchServiciosInternos();
            mensajeSnackbar = "Servicio interno creado exitosamente";
          }
          if (mode === "edit") {
            await EditarServicioInterno(data.id, data);
            await fetchServiciosInternos();
            mensajeSnackbar = "Servicio interno editado exitosamente";
          }
          break;
        // Aquí podrías agregar casos para otras cards como "proyectos" o "becarios"
        default:
          console.warn(
            "No hay lógica de guardado definida para esta card:",
            cardKey,
          );
      }
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
      setSnackbar({
        open: true,
        message: mensajeSnackbar,
        severity: "error",
      });
    } finally {
      setDialogSaving(false);
      setSnackbar({
        open: true,
        message: mensajeSnackbar,
        severity: "success",
      });
    }
  };
  /*
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
