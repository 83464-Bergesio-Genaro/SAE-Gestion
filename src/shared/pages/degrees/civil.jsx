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

export default function SharedJPACivil() {
  const imageDirBanner = "/images/degrees/IngCivilBanner.png";
  const materias1Año = [
    "Análisis Matemático I",
    "Algebra y Geometría Analítica",
    "Ingeniería y Sociedad",
    "Ingeniería Civil I",
    "Sistemas de Representación",
    "Química General",
    "Física 1",
    "Fundamentos de la informática",
  ];
  const materias2Año = [
    "Análisis Matemático II",
    "Estabilidad",
    "Ingeniería Civil II",
    "Tecnología de los materiales",
    "Física II",
    "Probabilidad y Estadística",
    "Inglés I",
  ];
  const materias3Año = [
    "Resistencia de los materiales",
    "Tecnología del hormigón",
    "Tecnología de la construcción",
    "Geotopografía",
    "Hidráulica general y aplicada",
    "Cálculo Avanzado",
    "Instalaciones Eléctrica y Acústica",
    "Instalaciones TermoMecánicas",
    "Inglés II",
    "Economía",
  ];
  const materias4Año = [
    "Geotecnia",
    "Instalaciones sanitarias y de gas",
    "Diseño arquitectónico, planeamiento y urbanismo",
    "Análisis estructural I",
    "Estructura de hormigón",
    "Hidrología y obras hidráulicas",
    "Ingeniería Legal",
  ];
  const materias5Año = [
    "Construcciones metálicas y de madera",
    "Cimentaciones",
    "Ingeniería sanitaria",
    "Organización y conducción de obras",
    "Vías de comunicación I",
    "Análisis estructural II",
    "Vías de comunicación II",
    "Proyecto Final",
  ];
  const materiasElectivas = [
    "Aeropuertos",
    "Análisis estructural III",
    "Dinámica estructural",
    "Diseño Arquitectónico y planeamiento II",
    "Geología aplicada",
    "Hidrología urbana",
    "Introducción a los sistemas de información geográficos",
    "Obras fluviales y marítimas",
    "PreFabricación",
    "Puentes",
    "Saneamiento y medio ambiente",
    "Tránsito y transporte",
    "Uso de recursos hídricos",
    "Vialidad especial",
  ];
  const alcances = [
    "El egresado de Ingeniería Civil podrá diseñar, calcular y proyectar: estructuras, edificios, viviendas, puentes, obas viales, obas hidráulicas, obras de saneamiento, obras ferroviarias, obras portuarias, obas aeroportuarias, obas geotécnicas, estructuras, obras civiles, obras viales, instalaciones y obas complementarias.",
    "También estará capacitado para dirigir y controlar la construcción, rehabilitación, demolición y mantenimiento de estructuras, edificios, viviendas, puentes, obas viales, obras hidráulicas, obras de saneamiento, obas ferroviarias, obras portuarias, obas aeroportuarias, obas geotécnicas, estructuras, obas civiles, obras viales, instalaciones y obras complementarias.",
  ];
  const perfil = [
    "El ingeniero civil de hoy está encargado de resolver problemas de infraestructura para la producción de bienes y servicios del país en general: edificios, fabricas, viviendas, puentes, carreteras, vías ferroviarias y navegables, puertos y aeropuertos, aprovechamientos hidroeléctricos, sistemas de riego, defensa aluvionales, distribución de agua, desagües pluviales, cloacales e industriales.",
    "También entenderá en la seguridad, mantenimiento y operación, modernización, planificación, control ecológico y eficiente remplazo de la infraestructura, teniendo en cuenta los aspectos técnicos-económicos.",
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
                Está capacitado para proyectar, mensurar, planificar, dirigir,
                construir, auditar, etc, el desarrollo de todo tipo de obras de
                infraestructura y sus instalaciones tales como: viviendas,
                edificios, naves industriales, estaciones de servicio,
                carreteras, puentes, obras ferroviarias, canales, diques,
                puertos, aeropuertos, desarrollos urbanos, entre otras.
              </Typography>
              <ListEngineer
                degree={"Título - Ingeniero Civil"}
                duration={"Duracion - 5 Años y medio"}
                video={"https://www.youtube.com/watch?v=Y-CLFhciSwc"}
                link={"https://www.institucional.frc.utn.edu.ar/civil/"}
                world={
                  "Programa de doble titulación con el Instituto Politécnico de Bragança (Portugal - Unión Europea)"
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
              src="https://www.youtube.com/embed/Y-CLFhciSwc?si=WKpNEfpsLWXjtRav"
            ></CardMedia>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
}
