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
    if (user?.id_perfil !== 1) {
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
