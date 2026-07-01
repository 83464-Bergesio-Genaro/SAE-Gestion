import { Box } from "@mui/material";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SessionExpiredDialog from "../SessionExpiredDialog";
import ScrollToTop from "../ScrollToTop";

import { Outlet } from 'react-router-dom'; // 👈 Importas Outlet
import { NotificationProvider } from "../../context/providers/notificationProvider";

export default function MainLayout() {
  return (
    <NotificationProvider>
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <ScrollToTop />
        <SessionExpiredDialog />
        <div style={{ paddingTop: 90, flex: 1 }}>
          <Outlet /> 
        </div>
        <Footer/>
      </Box>
    </NotificationProvider>
    
  );
}