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

export default function SharedJPAMecanic() {
  const imageDirBanner = "/images/degrees/IngMecanicaBanner.png";

  const materias1Año = [
    "Mecánica I",
    "Fundamentos de informática",
    "Análisis matemático I",
    "Álgebra y geometría analítica",
    "Física I",
    "Química General",
    "Ingeniería y sociedad",
    "Sistemas de representación",
  ];
  const materias2Año = [
    "Mecánica II",
    "Análisis Matemático II",
    "Química aplicada",
    "Física II",
    "Estabilidad I",
    "Ingeniería ambiental y seguridad industrial",
    "Materiales metálicos",
    "Inglés I",
  ];
  const materias3Año = [
    "Mecánica III",
    "Cálculo avanzado",
    "Estabilidad II",
    "Probabilidad y estadística",
    "Mecánica racional",
    "Diseño mecánico",
    "Termodinámica",
    "Mediciones y ensayos",
    "Inglés II",
  ];
  const materias4Año = [
    "Elementos de máquina",
    "Tecnología de calor",
    "Metrología e ingeniería de calidad",
    "Mecánica de los fluidos",
    "Electrotecnia y máquinas eléctricas",
    "Electrónica y sistemas de control",
    "Tecnología de fabricación",
  ];
  const materias5Año = [
    "Mantenimiento",
    "Máquinas alternativas y turbomáquinas",
    "Instalaciones industriales",
    "Organización industrial",
    "Legislación",
    "Proyecto final",
  ];
  const materiasElectivas = [
    "Introducción a la programación computacional en ingeniería",
    "Fundamentos de optimización en ingeniería",
    "Diseño de las instalaciones térmicas",
    "Introducción al método de elementos finitos",
    "Automotores I",
    "Automotores II",
    "Industria 4.0",
    "Sistemas neumáticos e hidráulicos",
    "World Class Manufacturing in situ",
    "Gestión emprendedora",
    "Gestión ambiental",
    "Logística",
    "Introducción a la investigación científica",
    "Gestión de proyectos",
  ];
  const alcances = [
    "Las actividades profesionales reservadas al título de Ingeniero Mecánico son:",
    "Estudio, factibilidad, proyecto, planificación, dirección, construcciones, instalación, puesta en marcha, operación, ensayos, mediciones, mantenimiento, reparación, modificación, transformación e inspección de:",
    "Sistemas mecánicos, térmicos y fluidos mecánicos o de partes con estas características incluidos en otros sistemas, destinados a la generación, transformación, regulación, conducción y aplicación de la energía mecánica.",
    "Laboratorios de todo tipo, relacionados con el inciso anterior. Excepto obras civiles e industriales.",
    "Sistemas de control, automatización y Robótica Industrial.",
    "Estudio de comportamiento, ensayos, análisis de estructuras y determinación de fallas de materiales metálicos y no metálicos, empleados en los Sistemas Mecánicos.",
    "Estudios, tareas y asesoramiento relacionados con:",
    "Asuntos de Ingeniería Legal, Económica y Financiera relacionados con los incisos anteriores.",
    "Arbitrajes, pericias y tasaciones relacionadas con los incisos anteriores.",
    "Higiene, Seguridad Industrial y contaminación ambiental relacionados con los incisos anteriores.",
  ];
  const perfil = [
    "La función del Ingeniero Mecánico Tecnológico consiste en encontrar soluciones a problemas que presentan una solución basada en un principio mecánico para su funcionamiento.",
    "Para esto, fundamenta su actividad en conocimientos de las ciencias naturales y las realiza de una manera óptima, tomando en cuenta las limitaciones establecidas por el material, la tecnología y la economía del momento.",
    "El egresado de nuestra carrera demuestra gran interés y capacidad para la interpretación de las matemáticas aplicadas a fenómenos físicos y razonamiento analítico para la comprensión de estos fenómenos.",
    "Su formación académica le permite diseñar, planificar y administrar los procesos industriales en los diferentes campos ocupacionales a los que tenga acceso. También, le permite planear los impactos económicos, sociales y ambientales en el desarrollo de proyectos, comunicarse y concertar con profesionales de otras disciplinas, formas de integración y dirección de equipos interdisciplinarios de trabajo; adoptando una actitud emprendedora y de liderazgo.",
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
                Esta formación académica permite diseñar, planificar y
                administrar procesos industriales en un extenso campo
                ocupacional. Planear impactos económicos, sociales y ambientales
                en el desarrollo de proyectos, integrar y dirigir equipos con
                actitud emprendedora y de liderazgo.
              </Typography>
              <ListEngineer
                degree={"Título - Ingeniero Mecánico"}
                duration={"Duración - 5 Años "}
                link={"https://www.institucional.frc.utn.edu.ar/mecanica/"}
                world={
                  "Programa de doble titulación con el Instituto Politécnico de Bragança (Portugal - Unión Europea) y con la Universidade Tecnológica Federal do Paraná - UTFPR (Brasil)"
                }
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
              src="https://www.youtube.com/embed/jmwD1Zl-KwA?si=KAOqCzfpp088Ty-K"
            ></CardMedia>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
}
