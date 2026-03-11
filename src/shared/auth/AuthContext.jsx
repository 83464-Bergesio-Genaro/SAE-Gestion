import { createContext, useContext,useState } from "react";
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

  const login = async (legajo, dominio, password) => {
    
    const result = await ObtenerTokenJWT(legajo, dominio, password);
    console.log(result);
    if (result.success && result.data) {

          const session = {
              token: result.data.token??"",
              legajo: result.data.legajo_armado??"",
              nombre: result.data.nombre_usuario??"",
              id_perfil: result.data.id_perfil??0,
              expiration: Date.now() + 3600000
          };

          localStorage.setItem("session", JSON.stringify(session));
          return session;
      }
      return null;
    /*let fakeUser;
    if(password !== "1111"){
        if (username === "empleado") {
        fakeUser = {
            id: 1,
            nombre: "Empleado Demo",
            legajo: "EMP001",
            id_perfil: 1,
            token: "token-empleado",
            expiration:Date.now() + (30 * 60 * 1000)
        };
        } else {
        fakeUser = {
            id: 2,
            nombre: "Alumno Demo",
            legajo: "STU001",
            id_perfil: 2,
            token: "token-student",
            expiration:Date.now() + (30 * 60 * 1000)
        };
        }
        localStorage.setItem("session", JSON.stringify(fakeUser));
        setUser(fakeUser);

        return fakeUser;
    }
    else return null;*/
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("session");
    window.location.replace("/")
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}
export const useAuth = () => useContext(AuthContext);