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
  Stack
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SendIcon from "@mui/icons-material/Send";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";

import {CONSULTATION_FAQS,QUICK_CONSULTATION_FAQS, SAE_EMAIL} from "../../../shared/pages/consultations/consultations.config";

import StudentHeaderPage from "../../components/studentHeaderPage/studentHeaderPage";
import TitleBox from "../../../shared/components/titleBox";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import { SAETypography } from "../../../shared/components/typography/SAETypography";

import { getLinkFrecuenteIconByIndex } from "../../../shared/pages/consultations/linkFrecuentesIcons";
import { ConsultationAlumnoProvider } from "../../../students/context/providers/consultationsProvider";
import { useConsultationContext } from "../../context/studentContext";
import SAEPage from "../../../shared/components/page/SAEPage";

export function StudentContent() {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.BASE_URL;

  const {
    loadingLinksFrecuentes,
    linksFrecuentes,
    form,
    sending,
    handleChange,
    handleSubmit,
    handleLinkFrecuenteClick
  } = useConsultationContext();

  return (
    <SAEPage>
        <StudentHeaderPage
          title="Consultas SAE"
          description="Encontrá respuestas rápidas o escribinos para recibir ayuda personalizada."
          backgroundImage="images/buildings/inchaurrondo/FrenteVidriado.jpg"
          icon={ContactSupportIcon}
        />
        <TitleBox
          title="Links frecuentes"
          description="Accesos rápidos a recursos útiles de SAE."
        />

        {loadingLinksFrecuentes ? (
          <Stack alignItems="center" sx={{ mt: 3, mb: 5 }}>
            <SAESpinner size="S" />
          </Stack>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1, mb: 4 }}>
            {linksFrecuentes.map((link) => {
              const iconOption = getLinkFrecuenteIconByIndex(link.id_index_ico);
              const Icon = iconOption.icon;

              return (
                <Grid key={link.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    component="a"
                    href={link.hipervinculo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => handleLinkFrecuenteClick(event, link)}
                    sx={{
                      alignItems: "center",
                      bgcolor: "white",
                      border: "1px solid",
                      borderColor: "rgba(17, 53, 101, 0.08)",
                      borderRadius: 3,
                      boxShadow: "0 8px 24px rgba(21, 61, 113, 0.08)",
                      color: "inherit",
                      display: "flex",
                      gap: 1.5,
                      height: "100%",
                      minHeight: 96,
                      p: 2,
                      textDecoration: "none",
                      transition:
                        "border-color 0.15s, box-shadow 0.15s, transform 0.15s",
                        "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: "0 14px 30px rgba(21, 61, 113, 0.14)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        alignItems: "center",
                        bgcolor: "var(--primary)",
                        borderRadius: 2,
                        color: "var(--textWhite)",
                        display: "flex",
                        flexShrink: 0,
                        height: 46,
                        justifyContent: "center",
                        width: 46,
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <SAETypography variant="subtitle1" fontWeight={600} noWrap>
                        {link.titulo}
                      </SAETypography>
                      <SAETypography
                        variant="body2"
                        color="var(--secondary)"
                        noWrap
                      >
                        {link.hipervinculo}
                      </SAETypography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
            {linksFrecuentes.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="info">
                  No hay links frecuentes disponibles.
                </Alert>
              </Grid>
            )}
          </Grid>
        )}

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
                  <Chip label={faq.category} size="small" color="var(--chipBackground)" />
                  <Accordion elevation={0} disableGutters sx={{ mt: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <SAETypography  variant="subtitle2" fontWeight={700}>{faq.question}</SAETypography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <SAETypography variant="body1" color="var(--textSecondary)">
                        {faq.answer}
                      </SAETypography>
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
                  <Chip label={faq.category} size="small" color="var(--chipBackground)" />
                  <SAETypography variant="subtitle2" fontWeight={700}>{faq.question}</SAETypography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <SAETypography color="text.secondary">{faq.answer}</SAETypography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Card sx={{ mt: 5, borderRadius: 4 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <SAETypography variant="h5" fontWeight={800}>
              Enviar una consulta
            </SAETypography>
            <SAETypography color="var(--textSecondary)" sx={{ mt: 1, mb: 3 }}>
              Tu consulta se enviará por correo a {SAE_EMAIL}.
            </SAETypography>
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
    </SAEPage>
  );
}

export default function StudentConsultations() {
  return (
    <ConsultationAlumnoProvider>
      <StudentContent />
    </ConsultationAlumnoProvider>
  );
}
