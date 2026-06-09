import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import StorageIcon from "@mui/icons-material/Storage";
import PublicIcon from "@mui/icons-material/Public";
import CodeIcon from "@mui/icons-material/Code";

import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import {
  CONSULTATION_FAQS,
  QUICK_CONSULTATION_FAQS,
  SAE_EMAIL,
} from "../../../shared/pages/consultations/consultations.config";

const options = [
  {
    icon: StorageIcon,
    title: "API y tabla de preguntas",
    description:
      "Opción recomendada. Permite alta, edición, baja, orden y publicación desde este panel para todos los estudiantes.",
  },
  {
    icon: PublicIcon,
    title: "CMS externo",
    description:
      "Útil si SAE necesita editar contenido sin desplegar la aplicación. Requiere integrar un proveedor de contenido.",
  },
  {
    icon: CodeIcon,
    title: "Configuración versionada",
    description:
      "La opción actual: las preguntas viven en un archivo compartido y se publican junto con cada despliegue.",
  },
];

export default function EmployedConsultations() {
  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "90px", md: "100px" },
        pb: 8,
        bgcolor: "#f4f8fc",
        minHeight: "calc(100vh - 90px)",
      }}
    >
      <Container maxWidth="xl">
        <HeaderPageEmployed
          header=" Módulo de Consultas"
          title="Gestión de Consultas"
          description="Revisá el contenido visible para estudiantes y planificá su administración."
        />
        <Alert severity="info" sx={{ mt: 2 }}>
          Actualmente las preguntas son contenido versionado. Sin una API o CMS,
          los cambios desde una interfaz no podrían publicarse para todos los
          estudiantes.
        </Alert>
        <Typography variant="h5" fontWeight={800} sx={{ mt: 4 }}>
          Preguntas publicadas
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {CONSULTATION_FAQS.map((faq) => (
            <Grid key={faq.id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                <CardContent>
                  <Chip label={faq.category} size="small" />
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                    {faq.question}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {faq.answer}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                    Enlace: {faq.link}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" fontWeight={800} sx={{ mt: 5 }}>
          Respuestas rápidas publicadas
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {QUICK_CONSULTATION_FAQS.map((faq) => (
            <Grid key={faq.id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                <CardContent>
                  <Chip label={faq.category} size="small" variant="outlined" />
                  <Typography fontWeight={700} sx={{ mt: 2 }}>
                    {faq.question}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {faq.answer}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/*<Typography variant="h5" fontWeight={800} sx={{ mt: 5 }}>
          Opciones para habilitar administración
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <Grid key={option.title} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: "100%", borderRadius: 4 }}>
                  <CardContent>
                    <Icon color="primary" sx={{ fontSize: 38 }} />
                    <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                      {option.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {option.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>*/}
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          Las consultas preparadas por estudiantes se dirigen actualmente a:{" "}
         <strong> {SAE_EMAIL}</strong>
        </Typography>
      </Container>
    </Box>
  );
}
