import { Box } from "@mui/material";
import "./Layout.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SessionExpiredDialog from "../SessionExpiredDialog";


export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <SessionExpiredDialog />
      <main className="main-content" style={{ paddingTop: 90, flex: 1 }}>
        {children}
      </main>
      <Footer/>
    </Box>
  );
}