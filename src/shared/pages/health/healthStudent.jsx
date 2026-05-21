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
import { useAuth } from "../../../shared/auth/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";

import { DataGrid } from "@mui/x-data-grid";

export function EmployedStudentContent(){
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
 
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
                Módulo Salud
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
              Horarios y Turnos medicos
            </Typography>
            <Typography
              sx={{
                mt: 2,
                maxWidth: 520,
                fontSize: { xs: 15, md: 17 },
                opacity: 0.92,
              }}
            >
              Informate de los horarios de nuestros especialistas y consulta por un turno desde la aplicacion.
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
        {/*Tarjeta de Medicos */}
        <Card
        sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)", overflow: "hidden", mt: 3, border: "2px solid lightGray",  }}>
            
        </Card>



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
// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function StudentHealth() {
    return (
        <HealthUsersProvider>
            <EmployedStudentContent />
        </HealthUsersProvider>
    );
}