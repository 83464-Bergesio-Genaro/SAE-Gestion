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
import SAEPage from "../../shared/components/page/SAEPage";
export default function StudentMain() {
  const { user } = useAuth();

  return (
    <SAEPage>
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
      <NovedadesEstudiantiles />
    </SAEPage>
  );
}
