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
    if (user?.id_perfil === 2) {
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
            style={{
              background: item.color,
              backgroundImage: "url(" + item.image + ")",
            }}
          >
            <h5> {item.label}</h5>
          </Link>
        ))}
      </div>
      {user && <SessionLog></SessionLog>}
    </nav>
  );
}
