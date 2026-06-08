import { Navigate } from "react-router-dom";
import { useAuth } from "../context/sharedContext"; 
import { useEffect } from "react";

function ExpiredSessionRedirect() {
  const { expireSession } = useAuth();

  useEffect(() => {
    expireSession();
  }, [expireSession]);

  return <Navigate to="/login" replace />;
}

export default function ProtectedRoute({ children, role }) {
  const { user, isSessionValid } = useAuth();
  const sessionIsValid = Boolean(user?.token) && isSessionValid();

  if (!sessionIsValid) {
    return <ExpiredSessionRedirect />;
  }

  const hasRole = Array.isArray(role)
    ? role.includes(user.id_perfil)
    : user.id_perfil === role;

  if (role && !hasRole) {
    return <Navigate to="/" />;
  }

  return children;
}
