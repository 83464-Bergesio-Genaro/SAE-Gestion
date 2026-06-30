import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SchoolIcon from "@mui/icons-material/School";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupsIcon from "@mui/icons-material/Groups";
import ExploreIcon from "@mui/icons-material/Explore";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import DashboardMenu from "../../shared/components/dashboardMenu/DashboardMenu";
import TitleBox from "../../shared/components/titleBox";
import HeaderPageEmployed from "../../shared/components/headerPageEmployed";
import SAESpinner from "../../shared/components/spinner/SAESpinner";

import { useAuth } from "../../shared/context/sharedContext";
import { CalendarEvent } from "../../shared/components/calendarEvent/calendarEvent";
import { EmployedCalendar } from "./users/EmployedCalendar";
import { AdminUsersProvider } from "../context/providers/employProvider";

import { JPAProvider } from "../context/providers/jpaProvider";
import { useJPA } from "../context/employedContext";
import SAEPage from "../../shared/components/page/SAEPage";

function DashboardCard({ item, onClick }) {
  const Icon = item.icon;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
        border: "1px solid rgba(17, 53, 101, 0.08)",
        opacity: item.disabled ? 0.75 : 1,
      }}
    >
      <CardActionArea
        onClick={item.disabled ? undefined : onClick}
        disabled={item.disabled}
        sx={{ height: "100%" }}
      >
        <CardContent sx={{ p: 3, minHeight: 170 }}>
          <Stack spacing={2} sx={{ height: "100%" }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(76, 127, 188, 0.12)",
                color: "#244c87",
              }}
            >
              <Icon sx={{ fontSize: 30 }} />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#14325c" }}
              >
                {item.name}
              </Typography>
              <Typography sx={{ mt: 1, color: "#5a6f8f", minHeight: 48 }}>
                {item.disabled
                  ? "Disponible próximamente en futuras versiones de SAE.                            "
                  : "Acceso directo al módulo desde la home de empleados."}
              </Typography>
            </Box>

            <Box sx={{ mt: "auto" }}>
              <Chip
                label={item.disabled ? "Próximamente" : "Disponible"}
                size="small"
                sx={{
                  bgcolor: item.disabled ? "#e5edf8" : "#d8ebd1",
                  color: item.disabled ? "#48617e" : "#2d6a18",
                  fontWeight: 700,
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
export default function EmployedMain() {
  return (
    <JPAProvider>
      <EmployedContent />
    </JPAProvider>
  );
}
function EmployedContent() {
  const { user } = useAuth();
  const { eventosSAE, loadingEventosSAE } = useJPA();

  return (
    <SAEPage>
      <HeaderPageEmployed
        hideBackButton={true}
        header="PANEL SAE EMPLEADOS"
        title={`Bienvenido${user?.nombre ? `, ${user.nombre}` : ""}`}
        description=" Accedé rápidamente a las áreas de gestión, reportes y seguimiento
              diario desde una sola pantalla."
      />
      <TitleBox
        title="Gestión General"
        description="Módulos operativos principales para el trabajo diario del
            equipo."
      />
      <DashboardMenu idPerfil={user?.id_perfil}></DashboardMenu>
      <TitleBox
        title="Tus horarios y proximos eventos"
        description="Permite visualizar tus horarios y los eventos proximos"
      />
      <AdminUsersProvider>
        <EmployedCalendar legajoEmpleado={user.email} />
      </AdminUsersProvider>
        {loadingEventosSAE && (
          <Stack alignItems="center" width={"100%"} gap={1}>
            <SAESpinner size="S" />
          </Stack>
        )}
        {!loadingEventosSAE && eventosSAE && (
          <CalendarEvent eventos={eventosSAE} />
        )}
    </SAEPage>
  );
}
