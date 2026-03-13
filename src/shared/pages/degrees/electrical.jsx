import ListEngineer from "../../components/lists/listEngineer";
import MateriasXAnoList from "../../components/lists/listMaterias";
import CircleIcon from "@mui/icons-material/Circle";
import {
  Container,
  Typography,
  List,
  ListItem,
  Paper,
  Box,
  Card,
  CardContent,
  CardMedia,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import "./degrees.css";

export default function SharedJPAElectrical() {
  const imageDirBanner = "/images/degrees/IngElectronicaBanner.png";

  const materias1Año = [
    "Fundamentos de Informática",
    "Álgebra y geometría analítica",
    "Análisis matemático I",
    "Ingeniería y sociedad",
    "Química General",
    "Integración Eléctrica I",
    "Física I",
    "Sistemas de representación",
  ];
  const materias2Año = [
    "Análisis Matemático II",
    "Estabilidad",
    "Integración Eléctrica II",
    "Física II",
    "Mecánica Térmica",
    "Probabilidad y estadística",
    "Electrotecnia I",
    "Cálculo numérico",
    "Inglés Técnico I",
  ];
  const materias3Año = [
    "Tecnología y ensayos de materiales eléctricos",
    "Instrumentos y mediciones eléctricas",
    "Teoría de los campos",
    "Física III",
    "Electrotecnia II",
    "Termodinámica",
    "Máquinas eléctricas I",
    "Fundamentos para el análisis de señales",
  ];
  const materias4Año = [
    "Electrónica I",
    "Máquinas eléctricas II",
    "Seguridad, riesgo eléctrico y medio ambiente",
    "Instalaciones eléctricas y luminotecnia",
    "Control automático",
    "Máquinas térmicas, hidráulicas y de fluidos",
    "Economía",
    "Inglés Técnico II",
    "Legislación",
  ];
  const materias5Año = [
    "Generación, transmisión y distribución de energía eléctrica",
    "Sistemas de potencia",
    "Accionamientos y controles eléctricos",
    "Electrónica II",
    "Organización y administración de empresas",
    "Prácticas supervisadas",
    "Proyecto final",
  ];
  const materiasElectivas = [
    "Impacto ambiental de líneas y centrales eléctricas",
    "Fuentes no convencionales de energía",
    "Centrales y protecciones eléctricas",
    "Transmisión de datos en sistemas eléctricos",
    "Legislación laboral",
    "Elementos de máquinas y tecnología mecánica",
  ];
  const alcances = [
    "Diseño, cálculo y proyecto",
    "Dirección ejecutiva de obra",
    "Dirección de instalaciones y montaje",
    "Explotación de sistemas eléctricos en sus aspectos técnicos y de organización",
    "Mantenimiento",
    "Comercialización de la energía eléctrica",
    "Pericias y asesoramiento técnico",
    "Consultorías",
    "Dirección de equipo de trabajo en proyectos relevantes de ingeniería",
    "Investigación, desarrollo e innovación tecnológica",
    "Docencia universitaria",
    "Multiplicador de fuentes de producción y desarrollo",
  ];
  const perfil = [
    "La carrera de grado de Ingeniería Eléctrica responde a la necesidad de formar profesionales aptos para cumplir funciones, técnicas o de gestión en el área de Generación, Transmisión, Distribución y Utilización de Energía Eléctrica.",
    "La carrera, dividida en orientaciones, permite al futuro ingeniero una elección en base a los aspectos tradicionales de la gestión organizativa y productiva, transformación, transporte y utilización de la energía eléctrica, del análisis técnico-económico de la confiabilidad y seguridad de los sistemas eléctricos, y, por otra parte, los desarrollos consolidados en el campo de la electrónica industrial, la robótica y, en general, el control de los dispositivos electromecánicos.",
    "En base a su formación, se valdrá de técnicas informáticas de tipo aplicativo para el proyecto de máquinas, dispositivos e instalaciones y los controles automáticos de los mismos.",
    // OJO con este Texto https://sites.google.com/view/sae-frc/oferta-acad%C3%A9mica/ing-el%C3%A9ctrica?authuser=5#h.wafj0gphve6c
  ];

  return (
    <Container style={{ padding: "3%" }}>
      <Paper className="paper-container">
        <Box
          sx={{
            backgroundImage: `url(${imageDirBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "black",
            height: 400,
          }}
          className="banner-image"
        ></Box>
      </Paper>
      <Paper className="paper-container">
        <Card>
          <CardContent>
            <div style={{ alignContent: "center", padding: "10px" }}>
              <Typography
                variant="h4"
                className="typography-title"
                gutterBottom
              >
                Descripción
              </Typography>

              <Typography
                variant="body1"
                className="typography-text"
                gutterBottom
              >
                La carrera de Ingeniería Eléctrica responde a la necesidad de
                formar profesionales aptos para cumplir funciones técnicas o de
                gestión en el área de generación, transmisión, distribución y
                utilización de la energía eléctrica.
              </Typography>
              <ListEngineer
                degree={"Título - Ingeniero Electricista"}
                duration={"Duración - 5 Años"}
                link={"https://www.institucional.frc.utn.edu.ar/electrica/"}
              ></ListEngineer>
            </div>
          </CardContent>
        </Card>
      </Paper>
      <Paper className="paper-container">
        <Box pt={2} pb={2}>
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                className="typography-title"
                gutterBottom
              >
                Materias de la Carrera
              </Typography>
              <List>
                <MateriasXAnoList
                  listaMaterias={materias1Año}
                  ano="Primer Año"
                />
                <MateriasXAnoList
                  listaMaterias={materias2Año}
                  ano="Segundo Año"
                />
                <MateriasXAnoList
                  listaMaterias={materias3Año}
                  ano="Tercer Año"
                />
                <MateriasXAnoList
                  listaMaterias={materias4Año}
                  ano="Cuarto Año"
                />
                <MateriasXAnoList
                  listaMaterias={materias5Año}
                  ano="Quinto Año"
                />
                <MateriasXAnoList
                  listaMaterias={materiasElectivas}
                  ano="Electivas"
                />
              </List>
            </CardContent>
          </Card>
        </Box>
      </Paper>

      <Paper className="paper-container">
        <Box pt={2} pb={2}>
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                className="typography-title"
                gutterBottom
              >
                Incumbencias/ Alcance
              </Typography>

              <List component="div" disablePadding>
                {alcances.map((row) => {
                  return (
                    <ListItem disablePadding alignItems="flex-start">
                      <ListItemIcon sx={{ ml: 2 }}>
                        <CircleIcon sx={{ width: 18, height: 18 }} />
                      </ListItemIcon>
                      <ListItemText primary={row} />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Paper>
      <Paper className="paper-container">
        <Box pt={2} pb={2}>
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                className="typography-title"
                gutterBottom
              >
                Perfil del Egresado
              </Typography>

              <List component="div" disablePadding>
                {perfil.map((row) => {
                  return (
                    <ListItem>
                      <ListItemText primary={row} />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Paper>
      <Paper className="paper-container">
        <Box pt={2} pb={2}>
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                className="typography-title"
                gutterBottom
              >
                Charla Departamental 2021
              </Typography>
            </CardContent>
            <CardMedia
              component="iframe"
              width="560"
              height="610"
              title="YouTube video player"
              src="https://www.youtube.com/embed/NWkrj-F6I34?si=24XQ9ecdSBk_CTJg"
            ></CardMedia>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
}
