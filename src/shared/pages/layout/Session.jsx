import { useAuth } from "../../context/sharedContext";
import SAEButton from "../../../assets/components/buttons/SAEButton";

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
