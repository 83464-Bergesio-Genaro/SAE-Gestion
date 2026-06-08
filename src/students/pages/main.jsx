import {
  Container,
  Grid,
  Typography,
  Box,
  Stack,
  Card,
  CardActionArea,
  CardContent,
  Chip,
} from "@mui/material";
import { useAuth } from "../../shared/context/sharedContext"; 
import DashboardMenu from "../../shared/components/dashboardMenu/DashboardMenu";
import NovedadesEstudiantiles from "../../shared/components/StudentNews/studentNews";
import TitleBox from "../../shared/components/titleBox";
export default function StudentMain() {
  const baseUrl = import.meta.env.BASE_URL;
  const { user } = useAuth();

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
        <Box
          sx={{
            overflow: "hidden",
            borderRadius: 6,
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 5 },
            minHeight: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            background:
              "linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%)",
            color: "white",
            backgroundImage: `linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%), url('${baseUrl}images/carrousel/EntradaUTN.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box sx={{ maxWidth: 700 }}>
            <Typography
              variant="overline"
              sx={{ letterSpacing: 1.8, opacity: 0.85, fontWeight: 700 }}
            >
              Panel SAE Alumnos
            </Typography>
            <Typography
              variant="h3"
              sx={{
                mt: 1,
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              {`Bienvenido${user?.nombre ? `, ${user.nombre}` : ""}`}
            </Typography>
            <Typography
              sx={{
                mt: 2,
                maxWidth: 560,
                fontSize: { xs: 16, md: 18 },
                opacity: 0.92,
              }}
            >
              Tu vida estudiantil, organizada en una sola pantalla.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 3 }}
            >
              <Chip
                label={user?.legajo ? `Legajo ${user.legajo}` : "Sesión activa"}
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  fontWeight: 700,
                }}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: 220,
              height: 220,
              borderRadius: "32px",
              backgroundImage: `url('${baseUrl}images/principal/logoUTNrotado.png')`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              transform: "rotate(8deg)",
              filter: "drop-shadow(0 18px 35px rgba(0,0,0,0.22))",
            }}
          />
        </Box>
        <Box sx={{ mt: 5 }}>
          <TitleBox
            title=" Gestión Alumnos"
            description=" Módulos operativos principales para el trabajo diario del equipo."
          />

          <DashboardMenu idPerfil={user?.id_perfil}></DashboardMenu>
        </Box>
      </Container>
      <NovedadesEstudiantiles />
    </Box>
  );
}
