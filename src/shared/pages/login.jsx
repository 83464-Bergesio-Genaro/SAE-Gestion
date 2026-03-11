import { useState } from "react";
import "./login.css";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const carreras = [
    {value:"sistemas",label:"Sistemas"},
    {value:"electrica",label:"Electrica"},
    {value:"electronica",label:"Electronica"},
    {value:"mecanica",label:"Mecanica"},
    {value:"metalurgica",label:"Metalurgica"},
    {value:"quimica",label:"Quimica"},
    {value:"industrial",label:"Industrial"},
    {value:"civil",label:"Civil"}
];

export default function Login() {
    const { login } = useAuth();
    const [legajo, setLegajo] = useState("");
    const [dominio, setDominio] = useState("sistemas");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = () => {

        const session = login(legajo, dominio, password);

        if(session){
            console.log(session);
            if (session.id_perfil !== 1) {
                navigate("/Inicio");
            } else {
                navigate("/Principal");
            }
        }
        else{
            alert("ERROR, NO NO NO");
        }
    };

  return (
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
  );

}