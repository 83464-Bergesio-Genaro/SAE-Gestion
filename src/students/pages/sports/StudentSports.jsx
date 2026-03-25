import { useAuth } from "../../../shared/auth/AuthContext";
import {
  CardContent,
  Typography,
  Card,
  Container,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItem,
  Avatar,
  IconButton,
  Divider,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
} from "@mui/material";
import {
  Edit,
  QuestionMark,
  CheckCircleOutline,
  HighlightOff,
  UploadFile,
  CheckCircle,
  FileUpload,
  Cancel,
  EmojiEvents
} from "@mui/icons-material";

import DeportesMasonry from "../../components/deportesMasonery";
import JsonArrayDataGrid from "../../../shared/components/jsonArrayDataGrid/jsonArrayDataGrid";

import {
  ObtenerHorariosDeportista,
  ObtenerIdDeportista,
  ObtenerTorneosXDeporte,
  CrearInscripcionDeporte,
  DesinscribirDeporte,
} from "../../../api/DeportesServices";

import { useState, useEffect } from "react";

export default function StudentSports() {
  const documentos = [
    { id: 1, nombre: "Alumno Regular", completo: true },
    { id: 2, nombre: "Certificado de Alumno Regular", completo: null },
    { id: 3, nombre: "DNI", completo: true },
    { id: 4, nombre: "Ficha Medica Vigente", completo: false },
  ];

  const { user } = useAuth();
  const [deportista, setIdDeportista] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSuccess, setPopupSuccess] = useState(true);
  const [horariosDeportista, setHorariosDeportista] = useState([]);
  const [torneoDeportista, setTorneoDeportista] = useState([]);

  const ObtenerIdDeportistaApi = async () => {
    try {
      const data = await ObtenerIdDeportista(user.legajo, user.token);
      setIdDeportista(data);
    } catch (error) {
      console.error("Error al traer Id Deportista:", error);
    }
  };

  const ObtenerHorariosDeportistaApi = async () => {
    try {
      const data = await ObtenerHorariosDeportista(deportista.id, user.token);
      setHorariosDeportista(data.horarios);
    } catch (error) {
      console.error("Error al traer Horario Deportivos:", error);
    }
  };

  const ObtenerTorneosPorDeporte = async (deportesIds) => {
    try {
      const resultados = await Promise.all(
        deportesIds.map((id) => ObtenerTorneosXDeporte(id, user.token)),
      );
      const torneos = resultados.flat();

      setTorneoDeportista(torneos);
    } catch (error) {
      console.error("Error al traer torneos:", error);
    }
  };

  useEffect(() => {
    ObtenerIdDeportistaApi();
  }, [user]);

  useEffect(() => {
    if (!deportista) return;

    ObtenerHorariosDeportistaApi();
  }, [deportista, user]);

  useEffect(() => {
    const deportesIds = horariosDeportista
      .filter((h) => h.esta_inscripto === true)
      .map((h) => h.id_deporte);
    if (deportesIds.length === 0) return;

    ObtenerTorneosPorDeporte(deportesIds);
  }, [horariosDeportista, user]);

  const handleUpload = (doc) => {
    console.log("Subir archivo para:", doc);
  };

  const handleEdit = (doc) => {
    console.log("Editar archivo para:", doc);
  };

  const handleInscribirClick = async (card) => {
    try {
      var texto = "";
      if (card.esta_inscripto) {
        // DESINSCRIBIR
        await DesinscribirDeporte(card.id_inscripcion, user.token);
        texto = "Desinscripción realizada con éxito";
      } else {
        // INSCRIBIR
        await CrearInscripcionDeporte(
          card.id_deporte,
          deportista.id,
          user.token,
        );
        texto = "Inscripción realizada con éxito";
      }

      setPopupMessage(texto);
      setPopupSuccess(true);
      setOpenPopup(true);

      // 🔄 refrescar datos
      await ObtenerHorariosDeportistaApi();
    } catch (error) {
      setPopupMessage("Error al realizar la accion");
      setPopupSuccess(false);
      setOpenPopup(true);

      console.error(error);
    }
  };
  return (
    <Container>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ justifyContent: "flex-end" }}
          >
            <Grid sx={{ xs: 1, sm: 1, md: 1, marginLeft: "auto" }}></Grid>
          </Grid>
          <Grid
            container
            spacing={{ xs: 4, md: 6 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{ justifyContent: "flex-start" }}
          >
            <Grid sx={{ xs: 1, sm: 3, md: 4 }}>
              <Avatar sx={{ height: 300, width: 300 }} />
            </Grid>
            <Grid sx={{ xs: 1, sm: 5, md: 6 }}>
              <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                {user.nombre}
              </Typography>
              <List>
                {documentos.map((doc) => (
                  <ListItem
                    secondaryAction={
                      <Box display="flex" gap={1}>
                        <IconButton
                          onClick={() => handleUpload(doc)}
                          edge="end"
                        >
                          <FileUpload />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(doc)} edge="end">
                          <Edit />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText>{doc.nombre}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <br />
      {horariosDeportista.length > 0 && (
        <DeportesMasonry
          deportes={horariosDeportista}
          onInscribirClick={handleInscribirClick}
        />
      )}
      {torneoDeportista.length > 0 && (
        <JsonArrayDataGrid title="Torneos" data={torneoDeportista} />
      )}
      <br />
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>{popupSuccess ? "Éxito" : "Error"}</DialogTitle>

        <DialogContent >
          <DialogContentText>{popupMessage}</DialogContentText>
          <Box display="flex" justifyContent="center" mt="0">
            {popupSuccess ? (
              <CheckCircle sx={{ fontSize: 60 }} color="success" />
            ) : (
              <Cancel sx={{ fontSize: 60 }} color="error" />
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenPopup(false)} autoFocus>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
