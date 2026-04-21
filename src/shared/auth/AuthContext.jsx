import { createContext, useContext, useState, useEffect } from "react";
import ObtenerTokenJWT from "../../api/AuthService";

const AuthContext = createContext();

async function hashPassword(password) {

  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hash = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
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
    console.log(result);
    if (result.success && result.data) {

          const session = {
              token: result.data.token??"",
              legajo: result.data.legajo_armado??"",
              nombre: result.data.nombre_usuario??"",
              id_perfil: result.data.id_perfil??0,
              expiration: Date.now() + 300000
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
        expiration: Date.now() + 300000
      };
      localStorage.setItem("session", JSON.stringify(extended));
      setUser(extended);
      setSessionExpired(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSessionExpired(false);
    localStorage.removeItem("session");
    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, extendSession, sessionExpired, setSessionExpired }}>
      {children}
    </AuthContext.Provider>
  );

}
export const useAuth = () => useContext(AuthContext);