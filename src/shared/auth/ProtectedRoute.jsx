import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const hasRole = Array.isArray(role)
    ? role.includes(user.id_perfil)
    : user.id_perfil === role;

  if (role && !hasRole) {
    return <Navigate to="/" />;
  }

  return children;
}
