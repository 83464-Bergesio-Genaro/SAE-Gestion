import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Stack,
} from "@mui/material";
import { useState } from "react";

const becaInicial = {
  nombre: "",
  descripcion: "",
  tipo: "",
  monto: "",
};

export default function scholarshipsForm() {
  const [openDialog, setOpenDialog] = useState(false);

  const [becaSeleccionada, setBecaSeleccionada] = useState(null);

  const [formBeca, setFormBeca] = useState(becaInicial);

  const handleAgregarBeca = () => {
    setBecaSeleccionada(null);
    setFormBeca(becaInicial);
    setOpenDialog(true);
  };

  const handleEditarBeca = (beca) => {
    setBecaSeleccionada(beca);
    setFormBeca(beca);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormBeca((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = () => {
    if (becaSeleccionada) {
      console.log("Editar beca", formBeca);
    } else {
      console.log("Crear beca", formBeca);
    }

    setOpenDialog(false);
  };

  return (
    <>
      <Button variant="contained" onClick={handleAgregarBeca}>
        Agregar Beca
      </Button>

      {/* EJEMPLO EDITAR */}
      <Button
        variant="outlined"
        onClick={() =>
          handleEditarBeca({
            nombre: "Beca Transporte",
            descripcion: "Ayuda para transporte",
            tipo: "Economica",
            monto: "25000",
          })
        }
      >
        Editar ejemplo
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {becaSeleccionada ? "Editar Beca" : "Agregar Beca"}
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formBeca.nombre}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                name="descripcion"
                value={formBeca.descripcion}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo"
                name="tipo"
                value={formBeca.tipo}
                onChange={handleChange}
              >
                <MenuItem value="Economica">Económica</MenuItem>

                <MenuItem value="Deportiva">Deportiva</MenuItem>

                <MenuItem value="Academica">Académica</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Monto"
                name="monto"
                value={formBeca.monto}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button onClick={handleCloseDialog}>Cancelar</Button>

            <Button variant="contained" onClick={handleGuardar}>
              {becaSeleccionada ? "Guardar cambios" : "Crear"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
