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

export default function SharedJPAQuimica() {
  const imageDirBanner = "/images/degrees/IngQuimicaBanner.png";
  const materias1Año = [
    "Integración I",
    "Álgebra y geometría analítica",
    "Análisis matemático I",
    "Ingeniería y sociedad",
    "Análisis matemático II",
    "Química General",
    "Sistemas de representación",
    "Inglés Técnico I",
  ];
  const materias2Año = [
    "Integración II",
    "Física II",
    "Química Inorgánica",
    "Física II",
    "Probabilidad y estadística",
    "Fundamentos de informática",
    "Química Orgánica",
    "Matemática Superior Aplicada",
  ];
  const materias3Año = [
    "Integración III",
    "Inglés Técnico II",
    "Termodinámica",
    "Mecánica-Eléctrica Industrial",
    "Química Analítica",
    "Economía",
    "Legislación",
    "Fisicoquímica",
    "Fenómenos de transporte",
  ];
  const materias4Año = [
    "Integración IV",
    "Operaciones Unitarias I",
    "Tecnología de la Energía Térmica",
    "Ingeniería de las Reacciones Químicas",
    "Organización Industrial",
    "Biotecnología",
    "Operaciones Unitarias II",
    "Control Estadístico de Proceso",
  ];
  const materias5Año = [
    "Control automático de procesos",
    "Prácticas Supervisadas",
    "Proyecto final",
  ];
  const materiasElectivas = [
    "Análisis Microbiológico",
    "Física de los materiales",
    "Investigación de operaciones",
    "Herramientas de dirección y gestión empresarial",
    "Materiales nanoestructurados y nanotecnologías",
    "Gestión del potencial humano",
    "Química analítica aplicada",
    "Ingeniería de las instalaciones",
    "Ingeniería ambiental",
    "Tecnología de los alimentos",
    "Propiedades, diseño y síntesis de materiales",
    "Catalizadores y procesos catalíticos",
    "Gestión integrada",
  ];
  const alcances = [
    "Estudio, cálculo, diseño, proyecto, construcción, instalación, puesta en marcha, inspección de: Industrias que involucren procesos físicos, químicos y de bioingeniería y sus instalaciones complementarias y de servicios, tales como agua, calor, gas y aire.",
    "Instalaciones donde intervengan operaciones unitarias y/o procesos unitarios.",
    "Equipos, maquinarias, aparatos o instrumentos para las industrias e instalaciones indicadas en los puntos anteriores.",
    "Debe excluirse el cálculo de obras civiles, no así el estudio del aspecto funcional de las construcciones industriales, de servicio y sus instalaciones complementarias.",
    "Operaciones de las industrias e instalaciones citadas, con planificación, programación de los procesos y la producción.",
    "Investigación y desarrollo de nuevos procesos, equipos o productos.",
    "Estudios de factibilidad de aprovechamiento e industrialización de recursos naturales y materias primas.",
    "Evaluación de riesgos de higiene, seguridad industrial y contaminación ambiental, relacionados con los incisos anteriores.",
    "Asuntos de ingeniería legal, económica y financiera relacionados a los puntos anteriores.",
    "Tareas dentro del sector público de: asesoramiento, promoción, control de evaluación y otras en temas de su competencia.",
    "Tareas relacionadas con la gestión empresarial de comercialización, administración y dirección de las empresas o instalaciones descriptas.",
    "Enseñanza de los conocimientos básicos, técnicos y científicos de los temas contenidos en la carrera en todos los niveles.",
  ];
  const perfil = [
    "La tarea fundamental de un Ingeniero Químico no se realiza en un laboratorio, con espumas de colores que salen de los tubos de ensayo o mezclas que explotan. La principal labor que se desarrolla en una planta química, entendiendo como tal a una empresa donde la materia prima que ingresa para convertirse en producto sufre una transformación esencial y no solo de forma, mediante una reacción química, por contraposición a una empresa de manufactura, tal como la automotriz.",
    "En este sentido, la tarea del Ingeniero Químico tiene que ver con cañerías, bombas de fluidos, molinos, secadores, filtros, destilaciones, reactores, seguridad de las plantas químicas, control de procesos, etc. Así, se vuelve tan importante la física y la matemática como la química.",
    "No se descuida la dimensión humana del profesional, que también es capaz de dirigir como gerente una planta, por lo que unos conjuntos de materias electivas están destinadas a la conducción de personal, dinámica de grupos humanos, administración de recursos humanos.",
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
                Esta rama de la Ingeniería se dedica al estudio, síntesis,
                desarrollo, diseño, operación y optimización de todos aquellos
                procesos industriales que producen cambios física, químicos y/o
                bioquímicos en los materiales.
              </Typography>
              <ListEngineer
                degree={"Título - Ingeniero Químico"}
                duration={"Duración - 5 Años "}
                link={"https://www.institucional.frc.utn.edu.ar/quimica/"}
                intermedio={
                  "Título intermedio - Técnico Universitario en Química (3er año)"
                }
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
              src="https://www.youtube.com/embed/D9wiPbJ4jhQ?si=WEqk314a0aRyEgBV"
            ></CardMedia>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
}
