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
  ListItemIcon,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { useAuth } from "../../context/sharedContext";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import { sharedMenu, studentMenu, employedMenu ,adminMenu} from "../../../config/menuConfig"

function getInitials(nombre = "") {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Navbar() {
  const baseUrl = import.meta.env.BASE_URL;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);

  let menu = [];
  switch (user?.id_perfil) {
    case 1:
      menu = studentMenu;
      break;
    case 2:
      menu = employedMenu;
      break;
    case 5:
      menu = adminMenu;
      break;
    case null:
      menu = sharedMenu;
      break;
    default:
      menu = sharedMenu;
      break;
  }

  const handleNav = (path) => {
    navigate(path);
    setMobileAnchorEl(null);
  };

  const handleMobileOpen = (e) => setMobileAnchorEl(e.currentTarget);
  const handleMobileClose = () => setMobileAnchorEl(null);

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfile = () => {
    handleMenuClose();
    handleMobileClose();
    navigate("/Mi-Perfil");
  };

  return (
    <>
      <AppBar position="fixed" sx={{ boxShadow: 2, bgcolor:"var(--primary)", width: "100%" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            component={Link}
            to="/"
            sx={{
              backgroundImage: `url('${baseUrl}navbarSAE.svg')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left center",
              width: 240,
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
                  <Box
                    onClick={handleProfile}
                    sx={{
                      px: 2,
                      py: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        fontWeight: "bold",
                        width: 32,
                        height: 32,
                        fontSize: 14,
                      }}
                    >
                      {getInitials(user.nombre)}
                    </Avatar>
                    <Typography variant="subtitle2" color="text.secondary">
                      {user.nombre}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleProfile}>Perfil</MenuItem>
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
          <Box
            onClick={handleProfile}
            sx={{
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold", width: 32, height: 32, fontSize: 14 }}>
              {getInitials(user.nombre)}
            </Avatar>
            <Typography variant="subtitle2">{user.nombre}</Typography>
          </Box>
        )}
        {user && <Divider />}
        {menu.map((item) => {
          const ItemIcon = item.icon;
          return (
            <MenuItem
              key={item.path}
              onClick={() => handleNav(item.path)}
              sx={{ py: 1.25 }}
            >
              {ItemIcon && (
                <ListItemIcon sx={{ color: "primary.main" }}>
                  <ItemIcon fontSize="small" />
                </ListItemIcon>
              )}
              {item.label}
            </MenuItem>
          );
        })}
        {user && <Divider />}
        {user && (
          <MenuItem onClick={handleProfile} sx={{ py: 1.25 }}>
            <ListItemIcon>
              <AccountCircleOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Perfil
          </MenuItem>
        )}
        {user && (
          <MenuItem onClick={() => { handleMobileClose(); logout(); }} sx={{ py: 1.25 }}>
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
            Cerrar Sesión
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
