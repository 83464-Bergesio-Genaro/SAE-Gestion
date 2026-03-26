import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SAEButton from "../../components/buttons/SAEButton";
import NewsGrid from "../../components/news/NewsGrid";
import "./main-backup.css";

export default function Main() {
  return (
    <Box>
      <Box className="main-container">
        <Box className="main-title-container">
          <Typography component="h1" sx={{ m: 0 }}>
            Secretaría de <br />
            Asuntos <br />
            Estudiantiles
          </Typography>

          <Typography component="h3" sx={{ m: 0 }}>
            Universidad Tecnologica Nacional - Facultad Regional Córdoba
          </Typography>

          <Box className="main-button-container">
            <SAEButton
              className="main-jpa-button"
              component={Link}
              to="/JPA"
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Conoce nuestra Universidad
            </SAEButton>

            <SAEButton
              className="main-login-button"
              component={Link}
              to="/login"
              variant="contained"
              sx={{ bgcolor: "#4f9916", textTransform: "none", "&:hover": { bgcolor: "#3d7a11" } }}
            >
              Soy parte de la UTN
            </SAEButton>
          </Box>
        </Box>

        <Box className="main-image-container" />
      </Box>

      <NewsGrid />
    </Box>
  );
}
