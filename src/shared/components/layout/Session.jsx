import { useAuth } from "../../auth/AuthContext";
import SAEButton from "../buttons/SAEButton";

export default function SessionLog() {
  const { user, logout } = useAuth();
  return (
    <SAEButton
      variant="outlined"
      onClick={logout}
      sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
    >
      Cerrar Sesión {user.nombre}
    </SAEButton>
  );
}
