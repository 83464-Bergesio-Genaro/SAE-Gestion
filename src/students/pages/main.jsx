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
import HeaderPageEmployed from "../../shared/components/HeaderPageEmployed";
export default function StudentMain() {
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
        <HeaderPageEmployed
          hideBackButton={true}
          header="PANEL SAE ALUMNOS"
          title={`Bienvenido${user?.nombre ? `, ${user.nombre}` : ""}`}
          description="Tu vida estudiantil, organizada en una sola pantalla."
        />

        <TitleBox
          title=" Gestión Alumnos"
          description=" Módulos operativos principales para el trabajo diario del equipo."
        />

        <DashboardMenu idPerfil={user?.id_perfil}></DashboardMenu>
      </Container>
      <NovedadesEstudiantiles />
    </Box>
  );
}
