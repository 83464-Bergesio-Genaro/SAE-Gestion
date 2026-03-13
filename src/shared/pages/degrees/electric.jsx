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

export default function SharedJPAElectric() {
  const imageDirBanner = "/images/degrees/IngElectricaBanner.png";

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
    "Sistemas o partes de sistemas de generación, transmisión, distribución, conversión, control, automatización, recepción, procesamiento, utilización de señales de naturaleza electromagnética en todas las frecuencias y potencias.",
    "Instalaciones que utilicen energía eléctrica como accesorio de lo detallado en el inciso anterior.",
    "Laboratorios de todo tipo relacionados con los incisos anteriores, excepto obras civiles e industriales.",
    "Sistemas de Control.",
    "Asuntos de ingeniería legal, económica y financiera relacionados con los incisos anteriores.",
    "Arbitrajes, pericias y tasaciones relacionados con los incisos anteriores.",
    "Higiene, seguridad industrial, contaminación ambiental relacionados con los incisos anteriores.",
    //Ojo con el texto de aca Hablar con JC https://sites.google.com/view/sae-frc/oferta-acad%C3%A9mica/ing-electr%C3%B3nica?authuser=5#h.wj7xjaj30il2
  ];
  const perfil = [
    "Es un profesional capacitado para desarrollar sistemas de ingeniería y paralelamente aplicar la tecnología existente, comprometido con el medio, lo que le permite ser promotor de cambio, con capacidad de innovación, al servicio de un conocimiento productivo, generando empleos y desarrollo social.",
    "Es un profesional formado y capacitado para afrontar con solvencia el planeamiento, desarrollo, dirección y control de sistemas electrónicos. Por su preparación, resulta especialmente apto para integrar la información proveniente de distintos campos disciplinarios concurrentes a un proyecto común.",
    "Está capacitado para abordar proyectos de investigación y desarrollo, integrando a tal efecto equipos interdisciplinarios, en cooperación o asumiendo el liderazgo efectivo en la coordinación técnica y metodológica de los mismos. Por su sólida formación físico-matemática, está preparado para generar tecnología, resolviendo problemas inéditos en la industria.",
    "Su formación integral le permite administrar recursos humanos, físicos y de aplicación que intervienen en el desarrollo de proyectos, lo que lo habilita para el desempeño de funciones gerenciales acordes con su especialidad.",
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
                La carrera tiene como objetivo formar profesionales capacitados
                para afrontar con solvencia el planeamiento, desarrollo,
                dirección y control de sistemas electrónicos; abordar proyectos
                de investigación y desarrollo, administrando los recursos
                humanos y físicos necesarios.
              </Typography>
              <ListEngineer
                degree={"Título - Ingeniero Electrónico"}
                duration={"Duración - 5 Años y medio"}
                intermedio={
                  "Título intermedio - Técnico Universitario en Electrónica (4to año)"
                }
                link={"https://www.institucional.frc.utn.edu.ar/electronica/"}
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
              src="https://www.youtube.com/embed/HncSWXqAH08?si=Ymti9cGO302QzVdS"
            ></CardMedia>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
}
