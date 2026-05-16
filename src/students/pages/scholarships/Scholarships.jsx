import { useAuth } from "../../../shared/auth/AuthContext";
import { useState, useEffect, useMemo } from "react";

import utnLogo from "../../../assets/utn.png";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Divider,
  FormControl,
  Input,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  CardHeader,
} from "@mui/material";
import { SCHOLARSHIP_STRINGS } from "./scholarship.string";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAESwitch from "../../../shared/components/buttons/SAESwitch";

import {
  FileUpload,
  Delete,
  AddCircleOutline,
  ExpandMore,
  Close,
  Science,
  SettingsAccessibility,
  AttachMoney,
} from "@mui/icons-material";
import { Form } from "react-router-dom";

const C = SCHOLARSHIP_STRINGS;

const getEstadoBecaConfig = (estado) => {
  switch (estado) {
    case "solicitado":
      return {
        label: "Solicitado",
        color: "warning",
      };

    case "rechazado":
      return {
        label: "Rechazado",
        color: "error",
      };

    case "aceptado_inicio":
      return {
        label: "Aceptado",
        color: "info",
      };

    case "aceptado_pagado":
      return {
        label: "Pagado",
        color: "success",
      };

    case "fin_becado":
      return {
        label: "Finalizado",
        color: "secondary",
      };

    default:
      return {
        label: estado,
        color: "default",
      };
  }
};

export default function Scholarships() {
  const { user } = useAuth();

  const INITIAL_PREVIEW = {
    open: false,
    loading: false,
    title: "",
    imageSrc: null,
    isPdf: false,
    error: null,
  };

  var becarioSAE = {
    legajo: user.legajo,
    alquila: false,
    fechaSolicitud: "",
    activo: null,
    anioBeca: 2026,
    idBecarioPrevio: null,
    tipoBeca: "",
    proyecto_investigacion: "",
    servicio: "",
    modulos_asignados: 0,
    entrevista_realizada: false,
    aceptado_inicio: null,
    puedo_pagarle: null,
  };

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(INITIAL_PREVIEW);
  const [misBecas, setMisBecas] = useState([
    {
      tipoBeca: C.listaTiposBecas[0].nombre,
      iconTipoBeca: C.listaTiposBecas[0].icon,
      estado: "solicitado",
      fechaSolicitud: "2026-05-12",
      anioBeca: 2026,
      proyecto_investigacion: "",
      servicio: "",
      modulos_asignados: 0,
    },
    {
      tipoBeca: C.listaTiposBecas[2].nombre,
      iconTipoBeca: C.listaTiposBecas[2].icon,
      estado: "aceptado_inicio",
      fechaSolicitud: "2026-05-12",
      anioBeca: 2026,
      proyecto_investigacion: "",
      servicio: "SAE",
      modulos_asignados: 2,
    },
    {
      tipoBeca: C.listaTiposBecas[1].nombre,
      iconTipoBeca: C.listaTiposBecas[1].icon,
      estado: "aceptado_pagado",
      fechaSolicitud: "2026-05-12",
      anioBeca: 2026,
      proyecto_investigacion: "Inteligencia Artificial",
      servicio: "",
      modulos_asignados: 3,
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);

  const [becaSeleccionada, setBecaSeleccionada] = useState(null);

  const [formBeca, setFormBeca] = useState(becarioSAE);

  const handleAgregarBeca = () => {
    setBecaSeleccionada(null);

    setFormBeca(becarioSAE);

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormBeca((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGuardar = () => {
    console.log(formBeca);

    setOpenDialog(false);
  };

  useEffect(() => {
    if (!user) return;
    const inicializarPantalla = async () => {
      try {
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar la pantalla de becas", error);
      }
    };
    inicializarPantalla();
  }, [user]);

  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "114px", md: "130px" },
        pb: 8,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0, // top:0, left:0, right:0, bottom:0
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "all",
            backdropFilter: "blur(2px)",
          }}
          textAlign="center"
        >
          <Box
            sx={{
              position: "relative",
              width: 200,
              height: 200,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress size={200} thickness={2.8} />
            <Box
              component="img"
              src={utnLogo}
              alt="UTN girando"
              sx={{
                width: 125,
                height: 125,
                objectFit: "contain",
                position: "absolute",
                borderRadius: "50%",
                bgcolor: "white",
                p: 0.5,
                boxShadow: 1,
              }}
            />
          </Box>
        </Box>
      )}

      <Container maxWidth="xl">
        <Box
          sx={{
            overflow: "hidden",
            borderRadius: 6,
            px: { xs: 3, md: 3 },
            py: { xs: 2, md: 2 },
            minHeight: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            background:
              "linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%)",
            color: "white",
            backgroundImage:
              "linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%), url('/images/carrousel/EntradaUTN.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box sx={{ maxWidth: 700 }}>
            <Typography
              variant="h3"
              sx={{
                mt: 1,
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              {C.bigTitle}
            </Typography>
            <Typography
              sx={{
                mt: 2,
                maxWidth: 560,
                fontSize: { xs: 16, md: 18 },
                opacity: 0.92,
              }}
            >
              {C.bigSubtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: 80,
              height: 80,
              borderRadius: "20px",
              backgroundImage: "url('/images/principal/logoUTNrotado.png')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              transform: "rotate(8deg)",
              filter: "drop-shadow(0 18px 35px rgba(0,0,0,0.22))",
            }}
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            {C.documentationTitle}
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            {C.documentationSubtitle}
          </Typography>
        </Box>
        <Grid container spacing={2.5} sx={{ mt: 1 }}>
          {misBecas.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  minWidth: 357,
                  height: "100%",
                  borderRadius: 4,
                  flexDirection: "column",
                  boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
                  border: "1px solid rgba(17, 53, 101, 0.08)",
                  transition:
                    "background-color 0.25s ease, border-color 0.25s ease",

                  "&:hover": {
                    backgroundColor: "#f1f5fb",
                    borderColor: "rgba(17, 53, 101, 0.2)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    pt: 2,
                    pl: 3,
                    pr: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Stack sx={{ height: "100%" }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">
                        <strong>{item.tipoBeca}</strong>
                      </Typography>
                      <Chip
                        label={getEstadoBecaConfig(item.estado).label}
                        color={getEstadoBecaConfig(item.estado).color}
                        size="small"
                      />
                      {item.tipoBeca?.icon && <IconComponent color="primary" />}
                    </Stack>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex",
                        gap: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                        mt: 1,
                      }}
                    >
                      <Typography variant="body1" color="text.prim">
                        <strong>Fecha Solicitud :</strong>
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {new Date(item.fechaSolicitud).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex",
                        gap: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                        mt: 1,
                      }}
                    >
                      <Typography variant="body1" color="text.prim">
                        <strong>Modulos Asignados :</strong>
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {item.modulos_asignados}
                      </Typography>
                    </Box>

                    {item.tipoBeca === "Beca de Investigacion" && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "wrap",
                          mt: 1,
                        }}
                      >
                        <Typography variant="body1" color="text.prim">
                          <strong>Proyecto :</strong>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {item.proyecto_investigacion}
                        </Typography>
                      </Box>
                    )}

                    {item.tipoBeca === "Beca de Servicio" && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "wrap",
                          mt: 1,
                        }}
                      >
                        <Typography variant="body1" color="text.prim">
                          <strong>Servicio :</strong>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {item.servicio}
                        </Typography>
                      </Box>
                    )}

                    {item.tipoBeca === "Beca Economica" && (
                      <Box
                        sx={{
                          mt: 1,
                          minHeight: 22,
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        alignItems: "center",
                        flexWrap: "wrap",
                        mt: 1,
                      }}
                    >
                      <SAEButton
                        onClick={() =>
                          handlePreview(item.id_archivo, item.archivoNombre)
                        }
                      >
                        {item.archivoNombre
                          ? item.archivoNombre.length > 23
                            ? item.archivoNombre.slice(0, 23) + "..."
                            : item.archivoNombre
                          : ""}
                      </SAEButton>

                      <IconButton
                        component="label"
                        size="small"
                        color="primary"
                        disabled={item.subido}
                      >
                        <FileUpload />
                        <input
                          type="file"
                          hidden
                          accept={item.extension}
                          onChange={(e) => handleArchivoChange(e, item)}
                        />
                      </IconButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* CARD AGREGAR */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              onClick={() => handleAgregarBeca(null)}
              sx={{
                minWidth: 357,
                height: "100%",
                borderRadius: 4,
                cursor: "pointer",
                border: "2px dashed rgba(17, 53, 101, 0.25)",
                backgroundColor: "#f8fbff",
                transition: "all 0.25s ease",

                "&:hover": {
                  backgroundColor: "#eef5ff",
                  borderColor: "primary.main",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  minHeight: 220,
                }}
              >
                <AddCircleOutline color="primary" sx={{ fontSize: 60 }} />

                <Typography variant="h6" textAlign="center">
                  {C.cardSolicitarTitle}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  {C.cardSolicitarSubtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            {C.FAQTitle}
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            {C.FAQSubtitle}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {C.faqsBecas.map((faq, index) => (
              <Accordion
                key={index}
                disableGutters
                sx={{
                  mb: 1.5,
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(21, 61, 113, 0.08)",
                  border: "1px solid rgba(17, 53, 101, 0.08)",
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight={600}>{faq.pregunta}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography color="text.secondary">
                    {faq.respuesta}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
        {/* Dialog de Agregar Beca  */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {becaSeleccionada ? "Editar Beca" : "Solicitar Beca"}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: "16px !important",
            }}
          >
            <Divider variant="middle" sx={{ mt: 0.5 }}>
              <Chip
                label={C.DatosPersonales}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Divider>
            <SAETextField
              fullWidth
              label="Legajo"
              name="legajo"
              disabled
              value={formBeca.legajo}
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <SAESwitch
                  size="small"
                  checked={formBeca.alquila}
                  name="alquila"
                  onChange={handleChange}
                />
              }
              label={C.alquilarTitle}
              sx={{
                "& .MuiFormControlLabel-label": { fontSize: "0.90rem" },
              }}
            />
            <Divider variant="middle" sx={{ mt: 0.5 }}>
              <Chip
                label={C.TiposBecas}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Divider>

            <FormControl fullWidth>
              <InputLabel>Tipo Beca</InputLabel>
              <Select
                value={formBeca.tipoBeca}
                onChange={handleChange}
                name="tipoBeca"
                input={<OutlinedInput label="Tipo Beca" />}
              >
                {C.listaTiposBecas.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {formBeca.tipoBeca === "Beca de Investigacion" && (
              <FormControl fullWidth>
                <InputLabel>Proyecto Investigacion</InputLabel>
                <Select
                  value={formBeca.proyecto_investigacion}
                  onChange={handleChange}
                  name="proyecto_investigacion"
                  input={<OutlinedInput label="Proyecto Investigacion" />}
                >
                  {C.listaProyectoInvestigacion.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {formBeca.tipoBeca === "Beca de Servicio" && (
              <FormControl fullWidth>
                <InputLabel>Proyecto Servicio</InputLabel>
                <Select
                  value={formBeca.proyecto}
                  onChange={handleChange}
                  name="servicio"
                  input={<OutlinedInput label="Proyecto Servicio" />}
                >
                  {C.listaProyectoServicio.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>

          <DialogActions>
            <SAEButton onClick={handleCloseDialog}>Cancelar</SAEButton>

            <SAEButton variant="contained" onClick={handleGuardar}>
              Guardar
            </SAEButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
