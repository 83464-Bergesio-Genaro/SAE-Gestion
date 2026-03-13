import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Tab,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { TabContext, TabList, TabPanel } from "@mui/lab";

import emailjs from "@emailjs/browser";
import { useState, useRef } from "react";
import checkImage from "../../../public/images/logos/comprobado.png";

export default function SharedJPAParticipar() {
  const colectivos = [
    {
      id: "13",
      line: "10",
      color: "orange",
      empresa: "Coniferal",
    },
    {
      id: "18",
      line: "10",
      color: "orange",
      empresa: "Coniferal",
    },
    {
      id: "19",
      line: "10",
      color: "orange",
      empresa: "Coniferal",
    },
    {
      id: "21",
      line: "20",
      color: "red",
      empresa: "ERSA",
    },
    {
      id: "22",
      line: "20",
      color: "red",
      empresa: "ERSA",
    },
    {
      id: "26",
      line: "20",
      color: "red",
      empresa: "ERSA",
    },
    {
      id: "32",
      line: "30",
      color: "green",
      empresa: "Aucor",
    },
    {
      id: "41",
      line: "40",
      color: "blue",
      empresa: "Tamse",
    },
    {
      id: "52",
      line: "50",
      color: "green",
      empresa: "Aucor",
    },
    {
      id: "53",
      line: "50",
      color: "green",
      empresa: "Aucor",
    },
    {
      id: "66",
      line: "60",
      color: "orange",
      empresa: "Coniferal",
    },
    {
      id: "67",
      line: "60",
      color: "orange",
      empresa: "Coniferal",
    },
    {
      id: "71",
      line: "70",
      color: "red",
      empresa: "ERSA",
    },
    {
      id: "73",
      line: "70",
      color: "red",
      empresa: "ERSA",
    },
    {
      id: "600",
      line: "600",
      color: "blue",
      empresa: "Tamse",
    },
    {
      id: "601",
      line: "600",
      color: "blue",
      empresa: "Tamse",
    },
  ];

  const [dialog, setDialog] = useState(false);

  const openDialog = () => {
    setDialog(true);
  };

  const closeDialog = () => {
    setDialog(false);
  };

  //Envio Mail
  const form = useRef();
  const [visitDate, setVisitDate] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    console.log("------------------------------");
    console.log(e.currentTarget);

    emailjs
      .sendForm("service_3pfadf8", "template_4lgixnl", e.currentTarget, {
        publicKey: "HPmcidnqVsJvSzXbn",
      })
      .then(() => {
        setDialog(true);
        console.log("Pass..");
      })
      .catch((error) => {
        console.log("FAILED...", error.text);
      });

    emailjs
      .sendForm("service_3pfadf8", "template_q5q7k6a", e.currentTarget, {
        publicKey: "HPmcidnqVsJvSzXbn",
      })
      .then(() => {
        setDialog(true);
        console.log("Pass..");
      })
      .catch((error) => {
        console.log("FAILED...", error.text);
      });
  };
  //fin mail

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [carrera, setCarrera] = useState(
    "Ingeniería en Sistemas de Información",
  );

  const handleChangeCombo = (event) => {
    setCarrera(event.target.value);
  };
  return (
    <>
      <Container>
        <Grid container spacing={0}>
          <Paper
            style={{
              width: "100%",
            }}
          >
            <Grid size={12}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1063.1657514756466!2d-64.19445682694611!3d-31.442516265642624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a2f66864ac1d%3A0x353cb4569b42a5bb!2sSecretar%C3%ADa%20de%20Asuntos%20Estudiantiles%20(S.A.E.)%20%7C%20U.T.N.%20%E2%80%93%20F.R.C.!5e0!3m2!1ses-419!2sar!4v1725738818372!5m2!1ses-419!2sar"
                loading="lazy"
                width="100%"
                height="175px"
              ></iframe>
            </Grid>
            <Grid
              sx={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                marginBottom: 1,
                marginTop: 1,
              }}
            >
              {colectivos.map((item, index) => (
                <Chip
                  size="small"
                  className={`colectivo-${item.empresa}`}
                  key={`colectivos${index}`}
                  label={item.id}
                  avatar={<Avatar>{item.line}</Avatar>}
                  variant="outlined"
                  style={{ margin: "2px" }}
                />
              ))}
            </Grid>
          </Paper>
        </Grid>

        <br></br>
        <Paper>
          {" "}
          <Box
            sx={{
              width: "100%",
              typography: "body1",
            }}
          >
            <Paper>
              <br />
              <Container>
                <Typography variant="h4">Participá de JPA</Typography>
              </Container>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    variant="scrollable"
                    scrollButtons={true}
                  >
                    <Tab label="Colegios / Municipios / ONG" value="1" />
                    <Tab label="Empresas" value="2" />
                    <Tab label="Estudiantes" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1" style={{ padding: 0 }}>
                  <form onSubmit={sendEmail}>
                    <input
                      type="hidden"
                      name="form_type"
                      value="Colegio / Municipio / ONG"
                    />
                    <Grid container spacing={2} p={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          required
                          id="outlined-required"
                          label="Nombre de la organización"
                          name="user_name"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          required
                          id="outlined-required"
                          label="Ingrese el email"
                          name="user_email"
                          type="email"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 4 }}>
                        <TextField
                          fullWidth
                          required
                          id="outlined-required"
                          label="Teléfono"
                          name="phone"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 4 }}>
                        <TextField
                          fullWidth
                          required
                          id="outlined-required"
                          label="Cantidad"
                          name="amount"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 4 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Fecha de visita"
                            value={visitDate}
                            onChange={setVisitDate}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </LocalizationProvider>
                        <input
                          type="hidden"
                          name="date"
                          value={
                            visitDate ? visitDate.format("DD/MM/YYYY") : ""
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button variant="contained" type="submit">
                          Enviar
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </TabPanel>
                <TabPanel value="2" style={{ padding: 0 }}>
                  <form ref={form} onSubmit={sendEmail}>
                    <input type="hidden" name="form_type" value="Empresas" />
                    <Grid container spacing={2} p={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          required
                          id="outlined-required"
                          label="Nombre de la empresa"
                          name="user_name"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <TextField
                          fullWidth
                          required
                          id="outlined-required"
                          label="Ingrese email"
                          name="user_email"
                          type="email"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <TextField
                          fullWidth
                          required
                          id="outlined-required"
                          label="Teléfono"
                          name="phone"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 12 }}>
                        <TextField
                          multiline
                          fullWidth
                          required
                          id="outlined-required"
                          label="Descripción stand"
                          name="desc"
                          rows={2}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button variant="contained" type="submit">
                          Enviar
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </TabPanel>
                <TabPanel value="3" style={{ padding: 0 }}>
                  <form ref={form} onSubmit={sendEmail}>
                    <input type="hidden" name="form_type" value="Estudiantes" />
                    <Grid container spacing={2} p={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          required
                          id="outlined-required"
                          label="Nombre y apellido"
                          name="user_name"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          required
                          id="outlined-required"
                          label="Ingrese su email"
                          name="user_email"
                          type="email"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <TextField
                          fullWidth
                          required
                          id="outlined-required"
                          label="Teléfono de contacto"
                          name="phone"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Carrera
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue=""
                            value={carrera}
                            label="Carrera"
                            onChange={handleChangeCombo}
                            name="carrera"
                          >
                            <MenuItem
                              value={"Ingeniería en Sistemas de Información"}
                            >
                              Ingeniería en Sistemas de Información
                            </MenuItem>
                            <MenuItem value={"Ingeniería Industrial"}>
                              Ingeniería Industrial
                            </MenuItem>
                            <MenuItem value={"Ingeniería Mecánica"}>
                              Ingeniería Mecánica
                            </MenuItem>
                            <MenuItem value={"Ingeniería Metalúrgica"}>
                              Ingeniería Metalúrgica
                            </MenuItem>
                            <MenuItem value={"Ingeniería Química"}>
                              Ingeniería Química
                            </MenuItem>
                            <MenuItem value={"Ingeniería Civil"}>
                              Ingeniería Civil
                            </MenuItem>
                            <MenuItem value={"Ingeniería Eléctrica"}>
                              Ingeniería Eléctrica
                            </MenuItem>
                            <MenuItem value={"Ingeniería Electrónica"}>
                              Ingeniería Electrónica
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button variant="contained" type="submit">
                          Enviar
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </TabPanel>
              </TabContext>
            </Paper>
          </Box>
        </Paper>
      </Container>
      <Dialog
        open={dialog}
        key="alert-dialog-inscripcion"
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title-1"
        aria-describedby="alert-dialog-description-1"
      >
        <DialogTitle id="alert-dialog-title">{`Mensaje envido.`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description-1">
            {`La SAE se pondrá en contacto al mail provisto.`}
          </DialogContentText>
          <br />
          <Box display="flex" justifyContent="center">
            <Box
              component="img"
              src={checkImage}
              alt=""
              sx={{ width: 50, height: 50 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={closeDialog}
            style={{ color: "white" }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
