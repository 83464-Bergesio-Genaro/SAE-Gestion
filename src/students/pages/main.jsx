import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  Stack,
  Button,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { useAuth } from "../../shared/auth/AuthContext";
import { Link } from "react-router-dom";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import DescriptionIcon from "@mui/icons-material/Description";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import HelpIcon from "@mui/icons-material/Help";
import ImagenUTN from "../../shared/components/imagenUTN";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { useNavigate } from "react-router-dom";
import NovedadesEstudiantiles from "../../shared/components/StudentNews/studentNews";

export default function StudentMain() {
  const { user } = useAuth();

  const novedades = [
    {
      id: 1,
      titulo: "Novedad nro 1. FORMATO TIPO TRAMITE",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero libero, eleifend a odio tincidunt, malesuada gravida urna. Maecenas rhoncus felis sed ultricies vestibulum. Aenean porta justo in nibh venenatis, non ullamcorper massa laoreet. Aliquam id pulvinar odio, vel placerat mauris. Quisque tristique, ipsum vitae tristique malesuada, lacus elit ullamcorper nibh, ac tristique arcu nibh ut turpis. Sed felis erat, ... VER MAS",
      invertida: false,
      imagen: "https://picsum.photos/800/600?8",
    },
    {
      id: 2,
      titulo: "Novedad nro 2. FORMATO AVISO",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero libero, eleifend a odio tincidunt, malesuada gravida urna. Maecenas rhoncus felis sed ultricies vestibulum. Aenean porta justo in nibh venenatis, non ullamcorper massa laoreet. Aliquam id pulvinar odio, vel placerat mauris. Quisque tristique, ipsum vitae tristique malesuada, lacus elit ullamcorper nibh, ac tristique arcu nibh ut turpis.",
      invertida: true,
      imagen: "https://picsum.photos/800/600?6",
    },
    {
      id: 3,
      titulo: "Novedad nro 3.",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero libero, eleifend a odio tincidunt, malesuada gravida urna. Maecenas rhoncus felis sed ultricies vestibulum. Aenean porta justo in nibh venenatis, non ullamcorper massa laoreet. Aliquam id pulvinar odio, vel placerat mauris. Quisque tristique, ipsum vitae tristique malesuada, lacus elit ullamcorper nibh, ac tristique arcu nibh ut turpis.",
      invertida: false,
      imagen: "https://picsum.photos/800/600?4",
    },
    {
      id: 4,
      titulo: "Novedad nro 4.",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero libero, eleifend a odio tincidunt, malesuada gravida urna. Maecenas rhoncus felis sed ultricies vestibulum. Aenean porta justo in nibh venenatis, non ullamcorper massa laoreet. Aliquam id pulvinar odio, vel placerat mauris. Quisque tristique, ipsum vitae tristique malesuada, lacus elit ullamcorper nibh, ac tristique arcu nibh ut turpis.",
      invertida: true,
      imagen: "https://picsum.photos/800/600?1",
    },
    {
      id: 5,
      titulo: "Novedad nro 5.",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero libero, eleifend a odio tincidunt, malesuada gravida urna. Maecenas rhoncus felis sed ultricies vestibulum. Aenean porta justo in nibh venenatis, non ullamcorper massa laoreet. Aliquam id pulvinar odio, vel placerat mauris. Quisque tristique, ipsum vitae tristique malesuada, lacus elit ullamcorper nibh, ac tristique arcu nibh ut turpis.",
      invertida: false,
      imagen: "https://picsum.photos/800/600?3",
    },
  ];

  const navigate = useNavigate();
  const botones = [
    {
      label: "Deportes",
      path: "/Mis-Deportes",
      icon: SportsHandballIcon,
    },
    { label: "Becas", path: "/Mis-Becas", icon: Diversity3Icon },
    { label: "Salud", path: "/Mi-Salud", icon: HealthAndSafetyIcon },
    { label: "Viajes", path: "/Mis-Viajes", icon: DirectionsBusIcon },
    { label: "Cursos", path: "/Mis-Cursos", icon: LocalLibraryIcon },
    { label: "Consultas", path: "/Consultas", icon: HelpIcon },
  ];

  return (
    <Container>
      <Grid
        container
        spacing={2}
        columns={{ xs: 6, sm: 8, md: 12 }}
        sx={{ mt: 4, mb: 4 }}
      >
        {/* TEXTO */}
        <Grid
          item
          xs={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              maxWidth: { xs: "100%", md: 500 },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                lineHeight: 1.05,
                fontSize: {
                  xs: "2.2rem",
                  sm: "2.8rem",
                  md: "3.2rem",
                },
              }}
            >
              Secretaría de Asuntos Estudiantiles
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                mt: 2,
                fontSize: {
                  xs: "1rem",
                  sm: "1.1rem",
                  md: "1.15rem",
                },
                lineHeight: 1.4,
              }}
            >
              Universidad Tecnológica Nacional - Facultad Regional Córdoba
            </Typography>

            <Button
              variant="contained"
              sx={{
                mt: 2,
                display: "inline-flex",
              }}
            >
              ¡Tengo una Duda!
            </Button>
          </Box>
        </Grid>

        {/* ESPACIO SOLO EN DESKTOP */}
        <Grid
          item
          xs={0}
          md={3}
          sx={{
            display: { xs: "none", md: "block" },
            pr: { md: 30 },
          }}
        />

        {/* IMAGEN */}
        <Grid
          item
          xs={6}
          md={5}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "center" },
            alignItems: { xs: "center", md: "center" },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Box
            sx={{
              width: { xs: 140, sm: 180, md: 260, lg: 320 },
              margin: "0 auto",
              display: "block",
              justifyContent: "center",
              transform: "rotate(7.5deg)",
            }}
          >
            <ImagenUTN
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                margin: "0 auto",
              }}
            />{" "}
          </Box>
        </Grid>
      </Grid>
      <Grid
        size={{ xs: 6, md: 3 }}
        sx={{
          justifyContent: { xs: "stretch", md: "center" },
        }}
      >
        <Card
          sx={{
            backgroundColor: "white",
            pl: 3,
            pt: 3,
            pb: 3,
            pr: 3,
            m: 1,
            mb: 4,
          }}
        >
          <Typography variant="h4">
            <b>SAE Gestion</b>
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{
              alignItems: { xs: "stretch", md: "center" },
              mt: 2,
            }}
          >
            {botones.map((boton) => (
              <Card
                key={boton.label}
                sx={{
                  flex: 1,
                  width: { xs: "100%", sm: "auto" },
                  backgroundColor: "#62a1e9",
                }}
              >
                <CardActionArea onClick={() => navigate(boton.path)}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "row", md: "column" },
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      textAlign: "center",
                      py: 2, // controla altura 🔥
                    }}
                  >
                    <boton.icon sx={{ fontSize: 50 }} />

                    <Typography sx={{ fontSize: { xs: 16, md: 22 } }}>
                      {boton.label}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        </Card>
      </Grid>
      <NovedadesEstudiantiles novedades={novedades}></NovedadesEstudiantiles>
    </Container>
  );
}
