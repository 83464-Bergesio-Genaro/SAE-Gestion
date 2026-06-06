import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SendIcon from "@mui/icons-material/Send";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import { useAuth } from "../../../shared/auth/AuthContext";
import {
  CONSULTATION_FAQS,
  QUICK_CONSULTATION_FAQS,
  SAE_EMAIL,
} from "../../../shared/pages/consultations/consultations.config";

import HeaderPage from "../../components/headerPage";

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value.trim());

export default function StudentConsultations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.BASE_URL;
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({
    nombre: user?.nombre ?? "",
    email: user?.email ?? "",
    asunto: "",
    mensaje: "",
  });

  const invalidFields = useMemo(() => {
    const fields = [];
    if (!form.nombre.trim()) fields.push("nombre");
    if (!isValidEmail(form.email)) fields.push("email");
    if (!form.asunto.trim()) fields.push("asunto");
    if (!form.mensaje.trim()) fields.push("mensaje");
    return fields;
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (invalidFields.length > 0) {
      setToast("Completá todos los campos con un correo válido.");
      return;
    }

    const subject = encodeURIComponent(`[Consulta SAE] ${form.asunto.trim()}`);
    const body = encodeURIComponent(
      `Nombre: ${form.nombre.trim()}\nCorreo: ${form.email.trim()}\nLegajo: ${user?.legajo ?? "-"}\n\nConsulta:\n${form.mensaje.trim()}`,
    );
    globalThis.location.href = `mailto:${SAE_EMAIL}?subject=${subject}&body=${body}`;
  };

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
      <Container maxWidth="xl">
        {/* <Box
          sx={{
            borderRadius: 5,
            p: { xs: 3, md: 5 },
            color: "white",
            backgroundImage: `linear-gradient(120deg, rgba(18,54,102,.96), rgba(53,108,178,.78)), url('${baseUrl}images/carrousel/AuditorioUTN.jpeg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <ContactSupportIcon sx={{ fontSize: 48 }} />
          <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
            Consultas SAE
          </Typography>
          <Typography sx={{ mt: 1, maxWidth: 700 }}>
            Encontrá respuestas rápidas o escribinos para recibir ayuda personalizada.
          </Typography>
        </Box> */}

        <HeaderPage
          title="Consultas SAE"
          description="Encontrá respuestas rápidas o escribinos para recibir ayuda personalizada."
          backgroundImage="images/carrousel/AuditorioUTN.jpeg"
          icon={<ContactSupportIcon />}
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            Preguntas frecuentes
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            Las Preguntas frecuentes
          </Typography>
        </Box>

        <Grid container spacing={2.5} alignItems="flex-start" sx={{ mt: 1 }}>
          {CONSULTATION_FAQS.map((faq) => (
            <Grid key={faq.id} size={{ xs: 12, md: 6 }}>
              <Card
                sx={{ borderRadius: 4, overflow: "hidden" }}
              >
                <Box
                  sx={{
                    height: 150,
                    backgroundImage: `url('${baseUrl}${faq.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <CardContent>
                  <Chip label={faq.category} size="small" color="primary" />
                  <Accordion elevation={0} disableGutters sx={{ mt: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography fontWeight={700}>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary">
                        {faq.answer}
                      </Typography>
                      <SAEButton
                        endIcon={<OpenInNewIcon />}
                        onClick={() => navigate(faq.link)}
                        sx={{ mt: 2 }}
                      >
                        {faq.linkLabel}
                      </SAEButton>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="h4"
          fontWeight={800}
          color="#123666"
          sx={{ mt: 5 }}
        >
          Más respuestas rápidas
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          Revisá estas preguntas antes de enviar una consulta.
        </Typography>
        <Box>
          {QUICK_CONSULTATION_FAQS.map((faq) => (
            <Accordion
              key={faq.id}
              disableGutters
              sx={{
                mb: 1.5,
                borderRadius: "12px !important",
                border: "1px solid rgba(17, 53, 101, 0.08)",
                boxShadow: "0 8px 24px rgba(21, 61, 113, 0.08)",
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip label={faq.category} size="small" variant="outlined" />
                  <Typography fontWeight={700}>{faq.question}</Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Card sx={{ mt: 5, borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" fontWeight={800}>
              Enviar una consulta
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Se abrirá tu aplicación de correo con el mensaje preparado para{" "}
              {SAE_EMAIL}.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SAETextField
                    fullWidth
                    required
                    label="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SAETextField
                    fullWidth
                    required
                    type="email"
                    label="Correo"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <SAETextField
                    fullWidth
                    required
                    label="Asunto"
                    name="asunto"
                    value={form.asunto}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <SAETextField
                    fullWidth
                    required
                    multiline
                    minRows={5}
                    label="Consulta"
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <SAEButton
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  Preparar correo
                </SAEButton>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast("")}
      >
        <Alert severity="warning" variant="filled" onClose={() => setToast("")}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
