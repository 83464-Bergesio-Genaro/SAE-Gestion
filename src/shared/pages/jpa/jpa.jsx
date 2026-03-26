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
  Grid,
  Stack,
  CardActionArea,
  Link,
} from "@mui/material";
import "./jpa.css";
import InteractiveGrid from "../../components/galleryZoomGrid/galleryZoomGrid";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { CalendarEvent } from "../../components/calendarEvent/calendarEvent";
import Fab from "@mui/material/Fab";

import { ObtenerEventosPublicos } from "../../../api/JPAService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {InfoSection,InfoSectionWithId} from "../../components/infoSection/InfoSection";

const itemVertical = [
  {
    title: "Deportes",
    icon: SportsSoccerIcon,
    route: "JPA/deportes",
    section: "info-deportes"
  },
  {
    title: "Bienestar",
    icon: FavoriteIcon,
    route: "JPA/bienestar",
    section: "info-bienestar"
  },
  {
    title: "Becas",
    icon: SavingsIcon,
    route: "JPA/becas",
    section: "info-becas"
  },
];

const items = [
  {
    title: "Biblioteca",
    icon: MenuBookIcon,
    route: "JPA/biblioteca",
    section: "info-biblioteca"
  },
  {
    title: "Intercambios",
    icon: FlightIcon,
    route: "JPA/intercambios",
    section: "info-intercambios"
  },
  {
    title: "Tutorías",
    icon: SchoolIcon,
    route: "JPA/tutorias",
    section: "info-tutorias"
  },
  {
    title: "Visitas Tec.",
    icon: FactoryIcon,
    route: "JPA/visitas",
    section: "info-visitas"
  },
];

export default function JPA() {
  const [eventosJPA, setEventosJPA] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const ObtenerEventosPublicosApi = async () => {
      try {
        const data = await ObtenerEventosPublicos();
        setEventosJPA(data);
      } catch (error) {
        console.error("Error al traer Eventos:", error);
      }
    };
    ObtenerEventosPublicosApi();
  }, []);

  return (
    <div className="desktop-info">
      <Container>
        
        <Typography variant="h3" align="center" sx={{ mt: 4 }}>
          JORNADA DE PUERTAS ABIERTAS
        </Typography>
        
        <Box sx={{ ml: { xs: 2, md: 4 }, mr: { xs: 2, md: 4 } }}>
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
              <Box className="video-container" >
                <iframe
                  className="youtube-video"
                  src="https://www.youtube.com/embed/atGzunuzHIk?si=xgR3Ds0TcnPD66wg"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="autoplay"
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
                marginTop={2}
                spacing={3}
                sx={{
                  width: "100%",
                  alignItems: { xs: "stretch", md: "center" },
                }}
              >
                {itemVertical.map((item) => (
                  <Card key={item.title} className="card-jpa">
                    <Link  href={"#"+item.section}>
                      <CardActionArea>
                        <CardContent className="card-jpa-content">
                          <item.icon
                            sx={{ fontSize: 40, mb: { xs: 0, md: 1 } }}
                          />
                          <Typography className="typography-jpa">
                            {item.title}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Link>
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
                <Card key={item.title} className="card-jpa" href="#">
                  <Link href={"#"+item.section}>
                    <CardActionArea>
                      <CardContent className="card-jpa-content" >
                        <item.icon sx={{ fontSize: 40, mb: { xs: 0, md: 1 } }} />
                        <Typography className="typography-jpa">
                          {item.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Link>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
       

        <Typography variant="h3" align="center" sx={{ mt: 4 }}>
          ¡CONOCÉ NUESTRAS CARRERAS!
        </Typography>

        <InteractiveGrid />

        <InfoSectionWithId/>

        <Typography variant="h4" align="center" sx={{ mt: 3 }}>
          AGENDA DE EVENTOS
        </Typography>

        <CalendarEvent eventos={eventosJPA} />

        <br />
        <Fab
          color="primary"
          variant="extended"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          className="fab-participar"
          onClick={() => navigate("/JPA/participar")}
        >
          <HowToRegIcon />
          <span className="texto"> Quiero participar</span>
        </Fab>
      </Container>

    </div>
  );
}
