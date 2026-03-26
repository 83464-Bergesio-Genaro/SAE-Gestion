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

export default function SharedJPASistemas() {
  const imageDirBanner = "/images/degrees/IngSistemasBanner.png";
  const materias1Año = [
    "Análisis Matemático I",
    "Algebra y Geometría Analítica",
    "Física I",
    "Ingeniería y Sociedad",
    "Algoritmos y estructura de datos",
    "Sistemas y organizaciones",
    "Matemática Discreta",
    "Arquitectura de computadoras",
    "Inglés I",
  ];
  const materias2Año = [
    "Análisis Matemático II",
    "Física II",
    "Análisis de Sistemas",
    "Paradigmas de Programación",
    "Sistemas Operativos",
    "Probabilidad y Estadística",
    "Sintaxis y Semántica de los lenguajes",
  ];
  const materias3Año = [
    "Diseño de Sistemas",
    "Comunicaciones",
    "Matemática Superior",
    "Gestión de datos",
    "Economía",
    "Inglés II",
    "Sistemas de Representación",
  ];
  const materias4Año = [
    "Redes de la información",
    "Administración de Recursos",
    "Investigación Operativa",
    "Simulación",
    "Ingeniería del Software",
    "Teoría de Control",
    "Legislación",
  ];
  const materias5Año = [
    "Proyecto Final",
    "Inteligencia Artificial",
    "Sistemas de Gestión",
    "Administración Gerencial",
  ];
  const materiasElectivas = [
    "Gestión de la Mejora de Procesos",
    "Gestión industrial de la producción",
    "Programación de aplicaciones visuales I",
    "Tecnologías educativas",
    "Tecnología de software base",
    "Diseño de lenguaje de consultas",
    "Análisis de datos: Aplicaciones con Minería de datos",
    "Auditorias de sistemas",
    "Big Data",
    "Creatividad e Innovación en Ingeniería",
    "Decisiones en escenarios complejos",
    "Desarrollo de software multi-pantalla",
    "Gerenciamiento estratégico",
    "Ingeniería de software de fuente abiertas/libres",
    "Testing de software",
    "Green software",
  ];
  const alcances = [
    "Participar en la toma de decisiones estratégicas de una organización u asesorar, en concordancia con las mismas, acerca de las políticas de desarrollo de Sistemas de Información.",
    "Evaluar, clasificar y seleccionar proyectos de Sistemas de Información y evaluar y seleccionar alternativas de asistencia externa.",
    "Planificar, efectuar y evaluar los estudios de factibilidad inherentes a todo proyecto de Diseño de Sistemas de información y de modificación o reemplazo de los mismos así como los Sistemas de computación asociados.",
    "Planificar, dirigir, ejecutar y controlar el relevamiento, análisis, diseño, desarrollo, implementación y prueba de sistemas de información.",
    "Evaluar y seleccionar los sistemas de programación disponibles con miras a sus utilizaciones en sistemas de información.",
    "Evaluar y seleccionar, desde el punto de vista de los sistemas de información, los equipos de procesamientos, comunicación y los sistemas de base de datos.",
    "Organizar y dirigir el área de sistemas: determinar el perfil de los recursos humanos necesarios y contribuir a su selección y formación.",
    "Participar en la elaboración de programas de capacitación para la utilización de sistemas de información.",
    "Determinar y controlar el cumplimiento de las pautas técnicas que rigen el funcionamiento y la utilización de recursos informáticos en cada organización.",
    "Elaborar métodos y normas a seguir en cuestiones de seguridad y privacidad de la información procesada y/o generada por los sistemas de la información; participar en la determinación de las acciones a seguir en estas materias y evaluar su aplicación.",
    "Elaborar métodos y normas a seguir en cuestión de salvaguardia y control, de los recursos, físicos y lógicos, de un sistema de computación; participar en la determinación de acciones a seguir en esta materia y evaluar su aplicación.",
    "Desarrollar modelos de simulación, sistemas expertos y otros sistemas informáticos destinados a la resolución de problemas y asesorar en su aplicación.",
    "Realizar auditorías en áreas de sistemas y centros de cómputos así como en los sistemas informáticos utilizados.",
  ];
  const perfil = [
    "El ingeniero en sistemas de la información es un profesional de sólida formación analítica que le permite la interpretación y resolución de problemas mediante el empleo de metodologías de sistemas y tecnologías de procesamiento de información.",
    "Por su preparación resulta especialmente apto para integrar la información proveniente de distintos campos disciplinarios concurrentes a un proyecto común.",
    "Posee conocimientos que le permiten administrar los recursos humanos, físicos y de aplicación que intervienen en el desarrollo de proyectos de sistemas de información.",
    "Adquiere capacidades que lo habilitan para el desempeño de funciones gerenciales acordes con su formación profesional.",
    "Está capacitado para abordar proyectos de investigación y desarrollo, integrando a tal efecto equipos interdisciplinarios en cooperación, o asumiendo el liderazgo efectivo en la coordinación técnica y metodológica de los mismos.",
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
                Formación analítica que permite al profesional interpretar y
                resolver problemas mediante el empleo de metodologías de sistema
                y tecnologías de procesamientos de información.
              </Typography>
              <ListEngineer
                degree={"Título - Ingeniero en Sistemas de la Informacion"}
                duration={"Duración - 5 Años"}
                link={"https://www.institucional.frc.utn.edu.ar/sistemas/"}
                intermedio={
                  "Título intermedio - Analista Universitario de sistemas (3er año)"
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
              src="https://www.youtube.com/embed/_P-PybOgYys?si=wj81Dd-sUG9mbpMd"
            ></CardMedia>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
}
