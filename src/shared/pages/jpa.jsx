import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SavingsIcon from "@mui/icons-material/Savings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FlightIcon from "@mui/icons-material/Flight";
import SchoolIcon from "@mui/icons-material/School";
import FactoryIcon from "@mui/icons-material/Factory";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  IconButton,
  Grid,
  Stack,
} from "@mui/material";
import "./jpa.css";
import InteractiveGrid from "../components/galleryZoomGrid/galleryZoomGrid";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { CalendarEvent } from "../components/calendarEvent/calendarEvent";

const itemVertical = [
  {
    title: "Deportes",
    icon: SportsSoccerIcon,
    route: "/deportes",
  },
  {
    title: "Bienestar",
    icon: FavoriteIcon,
    route: "/bienestar",
  },
  {
    title: "Becas",
    icon: SavingsIcon,
    route: "/becas",
  },
];

const items = [
  {
    title: "Biblioteca",
    icon: MenuBookIcon,
    route: "/biblioteca",
  },
  {
    title: "Intercambios",
    icon: FlightIcon,
    route: "/intercambios",
  },
  {
    title: "Tutorías",
    icon: SchoolIcon,
    route: "/tutorias",
  },
  {
    title: "Visitas Tec.",
    icon: FactoryIcon,
    route: "/visitas",
  },
];

const eventos = [
  {
    fecha: "09 de julio",
    hora: "12:00 hs",
    titulo: "El arte de llegar tarde",
    encargado: "Juan Cruz Bosetti",
    duracion: "2hs",
    lugar: "Auditorio Ing. Hecoter Aisassa",
  },
  {
    fecha: "06 de junio",
    hora: "15:30 hs",
    titulo: "Charla Eléctrica",
    encargado: "Thayra Eggman",
    duracion: "1hs",
    lugar: "Auditorio Ing. Hecoter Aisassa",
  },
  {
    fecha: "07 de junio",
    hora: "14:00 hs",
    titulo: "Charla Sistemas",
    encargado: "Exequiel Carranza",
    duracion: "1hs",
    lugar: "Auditorio Ing. Hecoter Aisassa",
  },
  {
    fecha: "08 de junio",
    hora: "08:00 hs",
    titulo: "Cómo quejarse de todo",
    encargado: "Genaro Bergesio",
    duracion: "4hs",
    lugar: "Auditorio Ing. Hecoter Aisassa",
  },
  {
    fecha: "10 de junio",
    hora: "18:00 hs",
    titulo: "Introducción a IA",
    encargado: "María López",
    duracion: "2hs",
    lugar: "Aula Magna",
  },
  {
    fecha: "12 de junio",
    hora: "10:30 hs",
    titulo: "Visita Tecnológica",
    encargado: "Carlos Pérez",
    duracion: "3hs",
    lugar: "Laboratorio Central",
  },
];

export default function JPA() {
  return (
    <div>
      <Container>
        <Box sx={{ ml: { md: 20 }, mr: { md: 20 } }}>
          {/*  Grid de video y grid vertical*/}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="stretch"
            columns={{ xs: 6, sm: 8, md: 12 }}
            sx={{ mt: 2 }}
          >
            <Grid
              size={{ xs: 6, md: 9 }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <Box className="video-container">
                <iframe
                  className="youtube-video"
                  src="https://www.youtube.com/embed/atGzunuzHIk?si=xgR3Ds0TcnPD66wg"
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                />
              </Box>
            </Grid>

            <Grid
              size={{ xs: 6, md: 3 }}
              sx={{
                display: "flex",
                justifyContent: { xs: "stretch", md: "center" },
              }}
            >
              <Stack
                spacing={2}
                sx={{
                  width: "100%",
                  alignItems: { xs: "stretch", md: "center" },
                }}
              >
                {itemVertical.map((item) => (
                  <Card key={item.title} className="card-jpa">
                    <item.icon sx={{ fontSize: 40, mb: { xs: 0, md: 1 } }} />
                    <Typography>{item.title}</Typography>
                  </Card>
                ))}
              </Stack>
            </Grid>
          </Grid>
          {/*  Grid Horizontal*/}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="stretch"
            columns={{ xs: 6, sm: 8, md: 12 }}
            sx={{ mt: 2 }}
          >
            {items.map((item) => (
              <Grid
                key={item.title}
                size={{ xs: 6, md: 3 }}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card key={item.title} className="card-jpa">
                  <item.icon sx={{ fontSize: 40, mb: { xs: 0, md: 1 } }} />
                  <Typography>{item.title}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Typography variant="h3" align="center" sx={{ mt: 4 }}>
          ¡CONOCÉ NUESTRAS CARRERAS!
        </Typography>
        <InteractiveGrid />
        <Typography variant="h4" align="center" sx={{ mt: 3 }}>
          AGENDA DE EVENTOS
        </Typography>

        <CalendarEvent eventos={eventos} />

        <br />
      </Container>
    </div>
  );
}
