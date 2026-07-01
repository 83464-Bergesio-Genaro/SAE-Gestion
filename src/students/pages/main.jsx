import { Container, Box, Card} from "@mui/material";
import { useAuth } from "../../shared/context/sharedContext";
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import DashboardMenu from "../../shared/components/dashboardMenu/DashboardMenu";
import NovedadesEstudiantiles from "../../shared/components/StudentNews/studentNews";
import TitleBox from "../../shared/components/titleBox";
import SAEPage from "../../shared/components/page/SAEPage"
import StudentHeaderPage from "../components/studentHeaderPage/studentHeaderPage";

export default function StudentMain() {
  const { user } = useAuth();
  
  return (
    <SAEPage>
        <StudentHeaderPage
          title={"Pantalla Principal"}
          description={"Bienvenido "+user.nombre+"!"}
          backgroundImage="images/carrousel/EntradaUTN.jpg"
          icon={LightbulbIcon}
        />
        <TitleBox 
          title=" Tú Gestión"
          description=" Administra tu vida estudiantil desde un solo lugar"
        />

        <DashboardMenu idPerfil={user?.id_perfil}></DashboardMenu>
        <NovedadesEstudiantiles />
    </SAEPage>
  );
}
