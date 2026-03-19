import { Link } from "react-router-dom";
import "./Layout.css";
import { useAuth } from "../../auth/AuthContext";
import { sharedMenu, studentMenu, employedMenu } from "../../menus/MenuConfig";
import SessionLog from "./Session";

export default function Navbar() {
  const { user } = useAuth();

  let menu = [];
  if (!user) {
    menu = sharedMenu;
  } else {
<<<<<<< HEAD
    if (user?.id_perfil !== 1) {
=======
    if (user?.id_perfil === 2 || user?.id_perfil === 5) {
>>>>>>> c77dceb (feat: Se Agrega modulo de Prensa)
      menu = employedMenu;
    } else if (user?.id_perfil === 1) {
      menu = studentMenu;
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-logo"></div>
      <div className="nav-links">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
          >
            <h4> {item.label}</h4>
          </Link>
        ))}
      </div>
      {user && <SessionLog></SessionLog>}
    </nav>
  );
}
