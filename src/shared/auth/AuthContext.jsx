import { createContext, useContext, useState, useEffect } from "react";
import ObtenerTokenJWT from "../../api/AuthService";
import { appConfig } from "../../config/appConfig";
const AuthContext = createContext();

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("session");

    if (!stored) return null;
    const parsed = JSON.parse(stored);

    if (Date.now() > parsed.expiration) {
      localStorage.removeItem("session");
      return null;
    }
    return parsed;
  });

  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() > parsed.expiration) {
          setSessionExpired(true);
        }
      }
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const login = async (legajo, dominio, password) => {
    const result = await ObtenerTokenJWT(legajo, dominio, password);
    if (result.success && result.data) {
      const session = {
        token: result.data.token ?? "",
        id: result.data.id ?? 0,
        legajo: (result.data.legajo_armado ?? ""),
        email: result.data.legajo_armado ?? "",
        nombre: result.data.nombre_usuario ?? "",
        id_perfil: result.data.id_perfil ?? 0,
        expiration: Date.now() + appConfig.sessionTimeout,
      };
      console.log("La sesion es:",session);
      localStorage.setItem("session", JSON.stringify(session));
      setUser(session);
      setSessionExpired(false);
      return session;
    }
    return null;
  };

  const extendSession = () => {
    const stored = localStorage.getItem("session");
    if (stored) {
      const parsed = JSON.parse(stored);
      const extended = {
        ...parsed,
        expiration: Date.now() + appConfig.sessionTimeout,
      };
      localStorage.setItem("session", JSON.stringify(extended));
      setUser(extended);
      setSessionExpired(false);
    }
  };

  const updateUser = (updates) => {
    const stored = localStorage.getItem("session");
    if (stored) {
      const parsed = JSON.parse(stored);
      const updated = { ...parsed, ...updates };
      localStorage.setItem("session", JSON.stringify(updated));
      setUser(updated);
    }
  };

  const logout = () => {
    setUser(null);
    setSessionExpired(false);
    localStorage.removeItem("session");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        extendSession,
        updateUser,
        sessionExpired,
        setSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
