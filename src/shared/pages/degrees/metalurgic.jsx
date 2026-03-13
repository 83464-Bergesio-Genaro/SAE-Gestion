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

export default function SharedJPAMetalurgic() {
  const imageDirBanner = "/images/degrees/IngMetalurgicaBanner.png";

  const materias1Año = [
    "Informática I",
    "Álgebra y geometría analítica",
    "Análisis matemático I",
    "Ingeniería y sociedad",
    "Análisis matemático II",
    "Física I",
    "Sistemas de representación",
  ];
  const materias2Año = [
    "Informática II",
    "Análisis de señales y sistemas",
    "Química general",
    "Física II",
    "Probabilidad y estadística",
    "Física electrónica",
    "Inglés I",
  ];
  const materias3Año = [
    "Teoría de circuitos I",
    "Técnicas digitales I",
    "Dispositivos electrónicos",
    "Legislación",
    "Electrónica aplicada I",
    "Medios de enlace",
    "Inglés II",
  ];
  const materias4Año = [
    "Técnicas digitales II",
    "Medidas electrónicas I",
    "Teoría de circuitos II",
    "Máquinas e instalaciones eléctricas",
    "Sistemas de comunicaciones",
    "Electrónica aplicada II",
    "Seguridad, higiene y medio ambiente",
  ];
  const materias5Año = [
    "Técnicas digitales III",
    "Medidas Electrónicas II",
    "Sistemas de control",
    "Electrónica aplicada III",
    "Tecnología electrónica",
    "Organización industrial",
    "Práctica profesional supervisada",
    "Economía",
    "Proyecto final",
  ];
  const materiasElectivas = [
    "Software en tiempo real",
    "Equipos de microondas",
    "Control de procesos",
    "Sistema de comunicaciones II",
    "Sistema de comunicaciones III",
    "Sistemas de telecomunicaciones",
    "Técnicas digitales IV",
    "Sistemas de televisión",
    "Bioelectrónica",
    "Fundamentos de acústica y electroacústica",
    "Visión por computadora",
  ];
  const alcances = [
    "Laboratorios, plantas pilotos, institutos de diversa índole relacionados con la investigación, control y diseño en la industrial siderometalúrgica, de los metales no ferrosos y los no metálicos en general.",
    "Metalúrgica extractiva y materias primas.",
    "Transformación y acabado de los metales y no metales.",
    "Procesos metalúrgicos en sus diversos tipos y procesamientos de los no metales.",
    "Factibilidad de aprovechamiento en industrialización de los recursos naturales y materias primas metálicas y no metálicas.",
    "Diseño de materiales metálicos y no metálicos, su caracterización, su desempeño en servicios, su reciclado y su degradación.",
    "Comportamiento del material metálico y no metálico, evaluación de sus propiedades y análisis de fallas.",
    "Asuntos de ingeniería legal, económica y financiera.",
    "Arbitrajes, pericias y tasaciones.",
    "Higiene, seguridad industrial y contaminación ambiental.",
  ];
  const perfil = [
    "En el plano de los conocimientos metalúrgicos, el Ingeniero Metalúrgico posee claros conceptos sobre los materiales y procesos en general, de tal modo que le permitan crear y elaborar diseños ingeniosos que faciliten los procesos de obtención y de tratamientos de metales.",
    "Conocer las tendencias de diseño a los efectos de proyectar elementos que no queden rápidamente obsoletos.",
    "En este contexto, los conocimientos de tecnología de obtención de avanzada le permiten, junto con otros conceptos tales como automatización y mecánica de los fluidos, optimizar cualquier tipo de diseño.",
    "Es importante destacar que el avance de la informática y las técnicas computacionales relativizan cada vez más el papel del ingeniero como mero calculista, volcándose en consecuencia su formación hacia tareas más creativas e ingeniosas en el campo del proyecto metalúrgico.",
    "En este plano, el conocimiento estadístico de fallas de los elementos mecánicos y sus soluciones le permite dirigir más eficazmente el diseño a sistemas, no solo funcionales sino también durables.",
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
                Capacita en el estudio, selección, procesamiento, investigación
                y asesoramiento en general de metales y aleaciones, aceros
                comunes y especiales, aleaciones de aluminio, magnesio, cobre,
                como también en los no metales como cerámicos, plásticos
                reforzados, fibras de carbono, etc.
              </Typography>
              <ListEngineer
                degree={"Título - Ingeniero Metalúrgico"}
                duration={"Duración - 5 Años "}
                link={"https://www.institucional.frc.utn.edu.ar/metalurgica/"}
                intermedio={
                  "Título intermedio - Técnico Universitario Metalúrgico (3er año)"
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
              src="https://www.youtube.com/embed/3hYEvUbSnkk?si=5S3ZqeXJPBBR3RgY"
            ></CardMedia>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
}
