import { Box } from "@mui/material";
import "./Layout.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SessionExpiredDialog from "../SessionExpiredDialog";
import ScrollToTop from "../ScrollToTop";

import { Outlet } from 'react-router-dom'; // 👈 Importas Outlet

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <ScrollToTop />
      <SessionExpiredDialog />
      <div className="main-content" style={{ paddingTop: 90, flex: 1 }}>
        <Outlet /> {/* 👈 Aquí es donde React Router inyectará tus páginas dinámicamente */}
      </div>
      <Footer/>
    </Box>
  );
}