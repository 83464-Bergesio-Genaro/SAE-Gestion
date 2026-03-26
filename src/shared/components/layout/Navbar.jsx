import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../auth/AuthContext";
import SAEButton from "../buttons/SAEButton";
import { sharedMenu, studentMenu, employedMenu } from "../../menus/MenuConfig";

function getInitials(nombre = "") {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);

  let menu = [];
  if (!user) {
    menu = sharedMenu;
  } else if (user?.id_perfil !== 1) {
    menu = employedMenu;
  } else {
    menu = studentMenu;
  }

  const handleNav = (path) => {
    navigate(path);
    setMobileAnchorEl(null);
  };

  const handleMobileOpen = (e) => setMobileAnchorEl(e.currentTarget);
  const handleMobileClose = () => setMobileAnchorEl(null);

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <AppBar position="fixed" sx={{ boxShadow: 2, bgcolor: "#5B96CC", width: "100%" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            component={Link}
            to="/"
            sx={{
              backgroundImage: "url('/saeLogo.svg')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left center",
              width: 160,
              height: 60,
              display: "block",
              flexShrink: 0,
              my: 1,
            }}
          />

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, flexGrow: 1, justifyContent: "flex-end", alignItems: "center" }}>
            {menu.map((item) => (
              <SAEButton
                key={item.path}
                component={Link}
                to={item.path}
                sx={{ color: "white", fontWeight: "bold", fontSize: 15 }}
              >
                {item.label}
              </SAEButton>
            ))}

            {user && (
              <>
                <IconButton onClick={handleAvatarClick} sx={{ ml: 1 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "white", color: "primary.main", fontWeight: "bold", fontSize: 15 }}>
                    {getInitials(user.nombre)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {user.nombre}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); logout(); }}>Cerrar Sesión</MenuItem>
                </Menu>
              </>
            )}
          </Box>

          <IconButton
            color="inherit"
            edge="end"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={handleMobileOpen}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile floating Menu */}
      <Menu
        anchorEl={mobileAnchorEl}
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {user && (
          <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold", width: 32, height: 32, fontSize: 14 }}>
              {getInitials(user.nombre)}
            </Avatar>
            <Typography variant="subtitle2">{user.nombre}</Typography>
          </Box>
        )}
        {user && <Divider />}
        {menu.map((item) => (
          <MenuItem key={item.path} onClick={() => handleNav(item.path)}>
            {item.label}
          </MenuItem>
        ))}
        {user && <Divider />}
        {user && <MenuItem onClick={handleMobileClose}>Perfil</MenuItem>}
        {user && (
          <MenuItem onClick={() => { handleMobileClose(); logout(); }}>
            Cerrar Sesión
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
