import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import SAEButton from "./buttons/SAEButton";
import { useState } from "react";

export default function SessionExpiredDialog() {
  const { sessionExpired, setSessionExpired, extendSession, logout } = useAuth();
  const [extending, setExtending] = useState(false);

  const handleExtendSession = async () => {
    setExtending(true);
    try {
      extendSession();
      // Pequeño delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSessionExpired(false);
    } catch (err) {
      console.error("Error al extender sesión:", err);
    } finally {
      setExtending(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Dialog
      open={sessionExpired}
      onClose={(_, reason) => {
        // Prevenir cerrar por ESC o click afuera
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          setSessionExpired(false);
        }
      }}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "#d32f2f" }}>
        Sesión Expirada
      </DialogTitle>
      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Por tu seguridad, tu sesión ha expirado.
        </Alert>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          Puedes extender tu sesión por una hora más o cerrar sesión y volver a iniciar.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <SAEButton
          variant="outlined"
          onClick={handleLogout}
          disabled={extending}
        >
          Cerrar Sesión
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleExtendSession}
          disabled={extending}
          startIcon={extending ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {extending ? "Extendiendo..." : "Extender Sesión"}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
