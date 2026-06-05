import { createContext, useContext, useState, useEffect, useCallback } from "react";
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

  const clearSession = useCallback(() => {
    setUser(null);
    setSessionExpired(false);
    localStorage.removeItem("session");
  }, []);

  const isSessionValid = useCallback(() => {
    const stored = localStorage.getItem("session");
    if (!stored) return false;

    try {
      const parsed = JSON.parse(stored);
      return Boolean(parsed.token) && Date.now() <= parsed.expiration;
    } catch {
      return false;
    }
  }, []);

  const expireSession = useCallback(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem("session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() > parsed.expiration) {
          clearSession();
        }
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [clearSession]);

  const login = async (legajo, dominio, password) => {
    const result = await ObtenerTokenJWT(legajo, dominio, password);
    if (result.success && result.data) {
      const session = {
        token: result.data.token ?? "",
        legajo: (result.data.legajo_armado ?? ""),
        email: result.data.legajo_armado ?? "",
        nombre: result.data.nombre_usuario ?? "",
        id_perfil: result.data.id_perfil ?? 0,
        expiration: Date.now() + appConfig.sessionTimeout,
      };

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

  const logout = () => {
    clearSession();
    globalThis.location.replace(`${import.meta.env.BASE_URL}login`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        extendSession,
        sessionExpired,
        setSessionExpired,
        isSessionValid,
        expireSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
