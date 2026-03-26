import { Box } from "@mui/material";
import "./Layout.css";
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function MainLayout({ children }) {
  return (
    <Box>
      <Navbar />
      <main className="main-content" style={{ marginTop: 90 }}>
        {children}
      </main>
      <Footer/>
    </Box>
  );
}