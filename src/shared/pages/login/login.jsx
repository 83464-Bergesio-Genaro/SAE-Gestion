import { useState } from "react";
import "./login.css";
import { useAuth } from "../../auth/AuthContext";
import {
  Box,
  Backdrop,
  Container,
  Dialog,
  DialogContent,
  Paper,
  Stack,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";
import SAEButton from "../../components/buttons/SAEButton";
import SAETextField from "../../components/inputs/SAETextField";
import SAESpinner from "../../components/spinner/SAESpinner";

const carreras = [
  { value: "sistemas", label: "Sistemas" },
  { value: "electrica", label: "Eléctrica" },
  { value: "electronica", label: "Electrónica" },
  { value: "mecanica", label: "Mecánica" },
  { value: "metalurgica", label: "Metalúrgica" },
  { value: "quimica", label: "Química" },
  { value: "industrial", label: "Industrial" },
  { value: "civil", label: "Civil" },
];

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ legajo: false, password: false });
  const { logout, login, user } = useAuth();
  const [legajo, setLegajo] = useState("");
  const [dominio, setDominio] = useState("sistemas");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    const session = await login(legajo, dominio, password);
    if (session) {
      if (session.id_perfil !== 1) {
        window.location.replace("/Inicio");
      } else {
        window.location.replace("/Principal");
      }
    } else {
      setIsLoading(false);
      setError("Credenciales no válidas");
    }
  };

  function validateForm() {
    setError("");
    setFieldErrors({ legajo: false, password: false });
    if (!legajo && !password) {
      setError("Debe ingresar su legajo y contraseña");
      setFieldErrors({ legajo: true, password: true });
      return false;
    }
    if (!legajo) {
      setError("Debe ingresar su legajo");
      setFieldErrors((f) => ({ ...f, legajo: true }));
      return false;
    }
    if (!password) {
      setError("Debe ingresar la contraseña");
      setFieldErrors((f) => ({ ...f, password: true }));
      return false;
    }
    return true;
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  if (user && !isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f4f8fc",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#153b6f" }}>
            Ya hay una sesión activa
          </Typography>
          <SAEButton variant="contained" onClick={logout} sx={{ minWidth: 150 }}>
            Cerrar Sesión
          </SAEButton>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
        height: "100%",
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center",
        pb: { xs: 4, md: 3 },
    }}>
      {/* Logo Header animado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: { xs: 130, md: 180 },
          mt: { xs: 2, md: 3 },
          mb: { xs: 1, md: 2 },
          position: "relative",
        }}
      >
        {/* Fondo utnBackLogo.svg - fade in */}
        <Box
          component="img"
          src="/images/principal/utnBackLogo.svg"
          alt=""
          sx={{
            position: "absolute",
            width: { xs: 130, md: 180 },
            height: { xs: 130, md: 180 },
            opacity: 0,
            animation: "fadeInBack 0.8s ease-out 0.1s forwards",
            "@keyframes fadeInBack": {
              from: { opacity: 0, transform: "scale(0.8)" },
              to: { opacity: 1, transform: "scale(1)" },
            },
          }}
        />
        {/* Logo UTN rotado - gira hasta posición */}
        <Box
          component="img"
          src="/images/principal/logoUTNrotado.png"
          alt="UTN Logo"
          sx={{
            position: "absolute",
            width: { xs: 85, md: 115 },
            height: { xs: 85, md: 115 },
            opacity: 0,
            animation: "spinIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s forwards",
            "@keyframes spinIn": {
              from: { opacity: 0, transform: "rotate(-360deg) scale(0.4)" },
              to: { opacity: 1, transform: "rotate(0deg) scale(1)" },
            },
          }}
        />
      </Box>

      {/* Login Form */}
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#153b6f",
              textAlign: "center",
              mb: 1,
            }}
          >
            SAE GESTIÓN
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "#5a6f8f",
              mb: 3,
            }}
          >
            Inicia sesión para continuar
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Stack spacing={2.5}>
            {/* Email Field */}
            <Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                <SAETextField
                  placeholder="Legajo"
                  value={legajo}
                  onChange={(e) => { setLegajo(e.target.value); setFieldErrors((f) => ({ ...f, legajo: false })); setError(""); }}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  size="small"
                  fullWidth
                  error={fieldErrors.legajo}
                  sx={{ flex: 1 }}
                />
                <Typography sx={{ fontWeight: 600, color: "#5a6f8f", px: 1 }}>@</Typography>
                <SAETextField
                  select
                  value={dominio}
                  onChange={(e) => setDominio(e.target.value)}
                  disabled={isLoading}
                  size="small"
                  fullWidth
                  sx={{ flex: 1 }}
                >
                  {carreras.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </SAETextField>
                <Typography sx={{ fontWeight: 600, color: "#5a6f8f", px: 1 }}>
                  .frc.utn.edu.ar
                </Typography>
              </Stack>
            </Box>

            {/* Password Field */}
            <SAETextField
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: false })); setError(""); }}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              size="small"
              fullWidth
              error={fieldErrors.password}
            />

            {/* Login Button */}
            <SAEButton
              variant="contained"
              fullWidth
              onClick={handleLogin}
              disabled={isLoading}
              sx={{ fontWeight: 600 }}
            >
              Ingresar
            </SAEButton>
          </Stack>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              mt: 3,
              color: "#5a6f8f",
            }}
          >
            © 2024 SAE Gestión - UTN FRC
          </Typography>
        </Paper>
      </Container>

      <Dialog open={isLoading} slotProps={{ paper: { sx: { borderRadius: 3, p: 2 } } }}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, px: 5, py: 3 }}>
          <SAESpinner size="M" />
          <Typography sx={{ color: "#5a6f8f", fontWeight: 500 }}>Ingresando...</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}