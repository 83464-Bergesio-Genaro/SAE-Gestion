import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import { useAuth } from "../../shared/auth/AuthContext";
import { Link } from "react-router-dom";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import DescriptionIcon from "@mui/icons-material/Description";
import HelpIcon from "@mui/icons-material/Help";
import ImagenUTN from "../../shared/components/imagenUTN";
export default function StudentMain() {
  const { user } = useAuth();

  const botones = [
    {
      label: "Deportes",
      path: "/Mis-Deportes",
      icon: <SportsSoccerIcon fontSize="40px" />,
    },
    { label: "Becas", path: "/Mis-Becas", icon: <HealthAndSafetyIcon /> },
    { label: "Salud", path: "/Mi-Salud", icon: <HealthAndSafetyIcon /> },
    { label: "Viajes", path: "/Mis-Viajes", icon: <LocationOnIcon /> },
    { label: "Cursos", path: "/Mis-Cursos", icon: <DescriptionIcon /> },
    { label: "Consultas", path: "/Consultas", icon: <HelpIcon /> },
  ];

  return (
    <Container>
      <Grid container spacing={2} columns={{ xs: 6, sm: 8, md: 12 }}>
        <Grid
          item
          xs={6}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ mt: 4 }}>
            <b>Bienvenid@, {user?.nombre}!</b>
          </Typography>
        </Grid>

        <Grid
          item
          xs={6}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImagenUTN
            width={250}
            height={250}
            style={{
              padding: "0px",
              transform: "rotate(7.5deg)",
            }}
          />
        </Grid>
      </Grid>
      <Divider />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        sx={{ mt: 4 }}
      >
        {botones.map((boton) => (
          <Button
            key={boton.path}
            fullWidth
            variant="contained"
            color="primary"
            component={Link}
            to={boton.path}
            size="large"
            startIcon={boton.icon}
          >
            {boton.label}
          </Button>
        ))}
      </Stack>

      <Grid
        container
        spacing={2}
        columns={{ xs: 6, sm: 8, md: 12 }}
        sx={{ mt: 4 }}
      >
        <Grid item xs={6} md={4}></Grid>
      </Grid>
    </Container>
  );
}
