import { useState } from "react";
import "./login.css";
import { useAuth } from "../../auth/AuthContext";
//import { useNavigate } from "react-router-dom";
import { PopupError, PopUpWaiting } from "../../components/popUp/Popup";

const carreras = [
  { value: "sistemas", label: "Sistemas" },
  { value: "electrica", label: "Electrica" },
  { value: "electronica", label: "Electronica" },
  { value: "mecanica", label: "Mecanica" },
  { value: "metalurgica", label: "Metalurgica" },
  { value: "quimica", label: "Quimica" },
  { value: "industrial", label: "Industrial" },
  { value: "civil", label: "Civil" },
  { value: "frc", label: "Frc" },
];

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [error, setError] = useState("");
  const { logout, login, user } = useAuth();
  const [legajo, setLegajo] = useState("");
  const [dominio, setDominio] = useState("sistemas");
  const [password, setPassword] = useState("");
  //const navigate = useNavigate();
  const handleLogin = async () => {
    if (!validateForm()) {
      setPopupMessage(error);
      return;
    }
    setIsLoading(true);
    console.log(dominio);
    const session = await login(legajo, dominio, password);
    setIsLoading(false);
    if (session) {
      //Hago la recarga activa porque el navigate no estaba funcionando
      if (session.id_perfil !== 1) {
        // navigate("/Inicio")
        window.location.replace("/Inicio");
      } else {
        window.location.replace("/Principal");
        // navigate("/Principal")
      }
    } else {
      setPopupMessage("Credenciales no validas");
    }
  };
  function validateForm() {
    if (!legajo) {
      setError("Debe ingresar su legajo");
      return false;
    }
    if (!dominio) {
      setError("Debe seleccionar una carrera");
      return false;
    }
    if (!password) {
      setError("Debe ingresar la contraseña");
      return false;
    }

    return true;
  }
  return (
    <div>
      {!user && (
        <div>
          <div className="login-image"></div>
          <div className="login-container">
            <h2>SAE GESTION</h2>

            <div className="login-user">
              <input
                type="text"
                placeholder="Legajo"
                className="legajo-input"
                value={legajo}
                onChange={(e) => setLegajo(e.target.value)}
              />

              <span className="login-span">@</span>
              <select
                className="domain-select"
                value={dominio}
                onChange={(e) => setDominio(e.target.value)}
              >
                {carreras.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <span className="login-span">.frc.utn.edu.ar</span>
            </div>
            <div className="login-password">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />

              <button className="login-button" onClick={handleLogin}>
                Ingresar
              </button>
            </div>
          </div>
        </div>
      )}
      {user && (
        <div>
          <button className="login-button" onClick={logout}>
            Cerrar Sesion
          </button>
        </div>
      )}
      <PopupError message={popupMessage} onClose={() => setPopupMessage("")} />

      {isLoading && <PopUpWaiting />}
    </div>
  );
}
