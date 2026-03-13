import { useAuth } from "../../auth/AuthContext";

export default function SessionLog() {
  const { logout } = useAuth();
  return (
    <button className="nav-logout" onClick={logout}>
      Cerrar Sesion
    </button>
  );
}
