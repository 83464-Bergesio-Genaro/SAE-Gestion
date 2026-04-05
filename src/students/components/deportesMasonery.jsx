import {
  Box,
  CardContent,
  Typography,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  TextField,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import SAEButton from "../../shared/components/buttons/SAEButton";
import SAETextField from "../../shared/components/inputs/SAETextField";

const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

function horariosToTexto(horarios) {
  if (!Array.isArray(horarios) || horarios.length === 0) return "";

  // Agrupa por rango horario
  const grupos = {};
  horarios.forEach((h) => {
    const key = `${h.hora_inicio}-${h.hora_fin}`;
    if (!grupos[key]) grupos[key] = [];
    grupos[key].push(h.dia);
  });

  // Invierto el agrupamiento: para cada día, guardo su rango
  const diasPorRango = Object.entries(grupos).map(([rango, dias]) => ({
    rango,
    dias: dias.sort((a, b) => a - b),
  }));

  // Ahora agrupo por días que tengan el mismo rango
  // Pero para mostrar: Horario: Lunes y Miércoles de 10:00 a 12:00 / Viernes de 14:00 a 16:00
  const partes = diasPorRango.map(({ rango, dias }) => {
    const diasNombres = dias.map((d) => DIAS[d]);
    let diasTexto = "";
    if (diasNombres.length === 1) {
      diasTexto = diasNombres[0];
    } else if (diasNombres.length === 2) {
      diasTexto = diasNombres[0] + " y " + diasNombres[1];
    } else {
      diasTexto =
        diasNombres.slice(0, -1).join(", ") +
        " y " +
        diasNombres[diasNombres.length - 1];
    }
    const [hora_inicio, hora_fin] = rango.split("-");
    const horaInicioSinSegundos = hora_inicio.slice(0, 5);
    const horaFinSinSegundos = hora_fin.slice(0, 5);
    return (
      <span key={rango}>
        {diasTexto} de {horaInicioSinSegundos} a {horaFinSinSegundos}
      </span>
    );
  });

  // Une todos los textos con " / "
  return (
    <>
      <strong>Horario: </strong>
      {partes.reduce(
        (prev, curr, idx) => (idx === 0 ? [curr] : [prev, " / ", curr]),
        null,
      )}
    </>
  );
}

function profesoresToTexto(profesores) {
  if (!Array.isArray(profesores) || profesores.length === 0) return null;
  // Filtra profesores únicos por cuil_docente
  const unicos = [];
  const cuils = new Set();
  for (const p of profesores) {
    if (p.cuil_docente && !cuils.has(p.cuil_docente)) {
      unicos.push(p);
      cuils.add(p.cuil_docente);
    }
  }

  if (unicos.length === 1) {
    return (
      <>
        <strong>Profesor: </strong>
        {unicos[0].docente_responsable}
      </>
    );
  }

  return (
    <>
      <strong>Profesores: </strong>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {unicos.map((p, idx) => (
          <li key={p.cuil_docente || idx}>{p.docente_responsable}</li>
        ))}
      </ul>
    </>
  );
}

function ubicacionATexto(ubicaciones) {
  if (!Array.isArray(ubicaciones) || ubicaciones.length === 0) return null;

  // Filtra ubicaciones duplicadas por id_espacio_deportivo
  const unicas = [];
  const ids = new Set();
  for (const u of ubicaciones) {
    if (!ids.has(u.id_espacio_deportivo)) {
      unicas.push(u);
      ids.add(u.id_espacio_deportivo);
    }
  }

  return (
    <>
      {unicas.map((u, idx) => (
        <span key={u.id_espacio_deportivo || idx}>
          <Link
            underline="hover"
            color="inherit"
            href={u.url_map_espacio_deportivo}
            rel="noopener noreferrer"
            target="_blank"
          >
            {u.espacio_deportivo}
          </Link>
          {idx < unicas.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

function agruparHorariosPorDeporte(arr) {
  const map = new Map();
  arr.forEach((item) => {
    // Creamos una clave única con los campos que NO son horarios ni id

    const key = JSON.stringify({
      id_deporte: item.id_deporte,
      id_espacio_deportivo: item.id_espacio_deportivo,
      id_inscripcion: item.id_inscripcion,
    });

    if (!map.has(key)) {
      map.set(key, {
        id_deporte: item.id_deporte,
        deporte: item.deporte,
        esta_inscripto: item.esta_inscripto,
        id_inscripcion: item.id_inscripcion,
        horarios: [],
        ubicacion: [],
        profesores: [],
      });
    }
    map.get(key).horarios.push({
      dia: item.dia,
      hora_inicio: item.hora_inicio,
      hora_fin: item.hora_fin,
    });
    map.get(key).ubicacion.push({
      id_espacio_deportivo: item.id_espacio_deportivo,
      espacio_deportivo: item.espacio_deportivo,
      url_map_espacio_deportivo: item.url_map_espacio_deportivo,
    });
    map.get(key).profesores.push({
      cuil_docente: item.cuil_docente,
      docente_responsable: item.docente_responsable,
    });
  });
  return Array.from(map.values());
}

export default function DeportesMasonry({ deportes, onInscribirClick }) {
  const [agrupado, setAgrupado] = useState([]);
  const [filtro, setFiltro] = useState("todos");

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [openDialogIndex, setOpenDialogIndex] = useState(null); // Guardar el índice de la tarjeta seleccionada

  useEffect(() => {
    const data = agruparHorariosPorDeporte(deportes);
    setAgrupado(data);

    const hayInscriptos = data.some((d) => d.esta_inscripto === true);

    if (hayInscriptos) {
      setFiltro("inscriptos");
    } else {
      setFiltro("todos");
    }
  }, [deportes]);

  // Filtrado según el botón seleccionado
  const agrupadoFiltrado = agrupado.filter((card) => {
    const coincideFiltro =
      filtro === "todos" ||
      (filtro === "inscriptos" && card.esta_inscripto === true) ||
      (filtro === "noinscriptos" && card.esta_inscripto === false);

    const texto = textoBusqueda.trim().toLowerCase();

    const deporte = card.deporte?.toLowerCase() || "";
    const ubicacion = card.ubicacion[0].espacio_deportivo?.toLowerCase() || "";
    const profesores =
      card.profesores[0].docente_responsable?.toLowerCase() || "";

    const coincideTexto =
      texto.length < 3 ||
      deporte.includes(texto) ||
      ubicacion.includes(texto) ||
      profesores.includes(texto);

    return coincideFiltro && coincideTexto;
  });

  const handleOpen = (index) => {
    setOpenDialogIndex(index); // Almacenar el índice de la tarjeta que se abre
  };

  const handleClose = () => {
    setOpenDialogIndex(null); // Cerrar el diálogo (resetear el índice)
  };

  const handleInscripcion = async (id_deporte) => {
    const item = agrupado.find((e) => e.id_deporte === id_deporte);
    if (!item) return;

    try {
      handleClose();
      await onInscribirClick(item);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
        mt={2}
        flexWrap="wrap"
      >
        {/* IZQUIERDA */}
        <Box display="flex" gap={2}>
          <SAEButton
            variant={filtro === "todos" ? "contained" : "outlined"}
            onClick={() => setFiltro("todos")}
          >
            Todos
          </SAEButton>
          <SAEButton
            variant={filtro === "inscriptos" ? "contained" : "outlined"}
            onClick={() => setFiltro("inscriptos")}
          >
            Inscriptos
          </SAEButton>
          <SAEButton
            variant={filtro === "noinscriptos" ? "contained" : "outlined"}
            onClick={() => setFiltro("noinscriptos")}
          >
            No inscriptos
          </SAEButton>
        </Box>

        {/* DERECHA */}
        <SAETextField
          size="small"
          placeholder="Buscar..."
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          sx={{
            minWidth: 250,
            width: {
              xs: "100%",
              md: 300,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Masonry
        spacing={{ xs: 2, sm: 3, md: 3 }}
        columns={{ xs: 2, sm: 2, md: 4 }}
      >
        {agrupadoFiltrado.map((card, index) => (
          <Grid spacing={10} size={{ xs: 4, sm: 4, md: 4 }} key={index}>
            <Card
              sx={{
                borderRadius: 6,
                px: { xs: 1, md: 2 },
                py: { xs: 0.5, md: 1 },
                boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
                border: "1px solid rgba(17, 53, 101, 0.08)",
              }}
            >
              <CardContent>
                <Typography gutterBottom variant="body1">
                  {ubicacionATexto(card.ubicacion)}
                </Typography>

                <Typography
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                  variant="h5"
                >
                  {card.deporte}
                </Typography>
                <Chip
                  label={card.esta_inscripto ? "Inscripto" : "No Inscripto"}
                  color={card.esta_inscripto ? "success" : "error"}
                  sx={{ mt: -1 }}
                />
                <Typography gutterBottom variant="body2">
                  {horariosToTexto(card.horarios)}
                  <br />
                  {card.competencias}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profesoresToTexto(card.profesores)}
                </Typography>
              </CardContent>
              <CardActions>
                <SAEButton
                  size="medium"
                  variant="contained"
                  startIcon={
                    card.esta_inscripto === false ? <AddIcon /> : <CancelIcon />
                  }
                  onClick={() => handleOpen(index)} // Abrir el diálogo específico del card
                  color={card.esta_inscripto === false ? "success" : "error"}
                  fullWidth
                >
                  {card.esta_inscripto === false
                    ? "Inscribir"
                    : "Desinscribirte"}
                </SAEButton>
                <Dialog
                  open={openDialogIndex === index}
                  onClose={() => handleClose()}
                  sx={{ borderRadius: 6 }}
                >
                  <DialogTitle>{card.deporte}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Estas seguro que te vas a{" "}
                      {card.esta_inscripto === false
                        ? "Inscribir"
                        : "Desinscribirte"}{" "}
                      de {card.deporte}?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <SAEButton
                      fullWidth
                      onClick={() => handleInscripcion(card.id_deporte)}
                      variant="contained"
                      color={
                        card.esta_inscripto === false ? "success" : "error"
                      }
                      startIcon={
                        card.esta_inscripto === false ? (
                          <CheckIcon />
                        ) : (
                          <CancelIcon />
                        )
                      }
                      autoFocus
                    >
                      {card.esta_inscripto === false
                        ? "Inscribirse"
                        : "Desincribirse"}
                    </SAEButton>
                  </DialogActions>
                </Dialog>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Masonry>
    </>
  );
}
