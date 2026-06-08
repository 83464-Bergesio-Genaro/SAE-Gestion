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
import { useAuth } from "../../../shared/context/sharedContext"; 
import {
  CONSULTATION_FAQS,
  QUICK_CONSULTATION_FAQS,
  SAE_EMAIL,
} from "../../../shared/pages/consultations/consultations.config";
import { sendConsultationEmail } from "../../../shared/services/EmailService";
import HeaderPage from "../../../shared/components/headerPage";
import TitleBox from "../../../shared/components/titleBox";
const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value.trim());

export default function StudentConsultations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.BASE_URL;
  const [toast, setToast] = useState({
    message: "",
    severity: "warning",
  });
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    user_name: user?.nombre ?? "",
    user_email: user?.email ?? "",
    subject: "",
    message: "",
  });

  const invalidFields = useMemo(() => {
    const fields = [];
    if (!form.user_name.trim()) fields.push("user_name");
    if (!isValidEmail(form.user_email)) fields.push("user_email");
    if (!form.subject.trim()) fields.push("subject");
    if (!form.message.trim()) fields.push("message");
    return fields;
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (message, severity = "warning") => {
    setToast({ message, severity });
  };

  const closeToast = () =>
    setToast((previous) => ({ ...previous, message: "" }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (invalidFields.length > 0) {
      showToast("Completá todos los campos con un correo válido.");
      return;
    }

    try {
      setSending(true);
      await sendConsultationEmail({
        user_name: form.user_name,
        user_email: form.user_email,
        subject: `[Consulta SAE] ${form.subject.trim()}`,
        message: form.message.trim(),
        legajo: user?.legajo,
      });
      showToast("Consulta enviada con éxito.", "success");
      setForm((prev) => ({ ...prev, subject: "", message: "" }));
    } catch (error) {
      console.error("Error al enviar consulta:", error);
      showToast("No se pudo enviar la consulta. Intentá nuevamente.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "114px", md: "100px" },
        pb: 8,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
        <HeaderPage
          title="Consultas SAE"
          description="Encontrá respuestas rápidas o escribinos para recibir ayuda personalizada."
          backgroundImage="images/carrousel/AuditorioUTN.jpeg"
          icon={<ContactSupportIcon />}
        />
        <TitleBox
          title="Preguntas frecuentes"
          description="Las Preguntas frecuentes"
        />

        <Grid container spacing={2.5} alignItems="flex-start" sx={{ mt: 1 }}>
          {CONSULTATION_FAQS.map((faq) => (
            <Grid key={faq.id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 4, overflow: "hidden" }}>
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

        <Box>
          <TitleBox
            title="Más respuestas rápidas"
            description="Revisá estas preguntas antes de enviar una consulta."
          />

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
              Tu consulta se enviará por correo a {SAE_EMAIL}.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SAETextField
                    fullWidth
                    required
                    label="Nombre"
                    name="user_name"
                    value={form.user_name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <SAETextField
                    fullWidth
                    required
                    type="email"
                    label="Correo"
                    name="user_email"
                    value={form.user_email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <SAETextField
                    fullWidth
                    required
                    label="Asunto"
                    name="subject"
                    value={form.subject}
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
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                <SAEButton
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  disabled={sending}
                >
                  {sending ? "Enviando..." : "Enviar consulta"}
                </SAEButton>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={Boolean(toast.message)}
        autoHideDuration={4000}
        onClose={closeToast}
      >
        <Alert severity={toast.severity} variant="filled" onClose={closeToast}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
