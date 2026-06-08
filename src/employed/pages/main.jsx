import { useEffect, useState } from "react";
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
import { useAuth } from "../../shared/context/sharedContext"; 
import { CalendarEvent } from "../../shared/components/calendarEvent/calendarEvent";
import { ObtenerEventosPublicos, ObtenerEventosSAE } from "../../api/JPAService";
import { EmployedCalendar } from "./users/EmployedCalendar";  
import { AdminUsersProvider } from "../context/providers/employProvider"; 
import DashboardMenu from "../../shared/components/dashboardMenu/DashboardMenu";
import TitleBox from "../../shared/components/titleBox";
import HeaderPageEmployed from "../../shared/components/headerPageEmployed";
/*
const reportOptions = [
    {
        name: "Reporte Deportes",
        icon: SportsBasketballIcon,
        disabled: true,
        roles: [2, 5],
    },
    {
        name: "Reporte Becas",
        icon: SchoolIcon,
        disabled: true,
        roles: [2, 5],
    },
    {
        name: "Reporte Prensa",
        icon: AssessmentIcon,
        disabled: true,
        roles: [2, 5],
    },
    {
        name: "Reporte JPA",
        icon: GroupsIcon,
        disabled: true,
        roles: [2, 5],
    },
    {
        name: "Reporte Viajes",
        icon: ExploreIcon,
        disabled: true,
        roles: [2, 5],
    },
    {
        name: "Reporte Trámites",
        icon: ListAltIcon,
        disabled: true,
        roles: [2, 5],
    },
];*/

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
  const { user } = useAuth();
  const [eventosJPA, setEventosJPA] = useState([]);
  useEffect(() => {
    const ObtenerEventosPublicosApi = async () => {
      try {
        const data = await ObtenerEventosSAE();
        setEventosJPA(data);
      } catch (error) {
        console.error("Error al traer Eventos:", error);
      }
    };
    ObtenerEventosPublicosApi();
  }, []);
  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "90px", md: "100px" },
        pb: 4,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
        <HeaderPageEmployed
          hideBackButton={true}
          header="PANEL SAE EMPLEADOS"
          title={`Bienvenido${user?.nombre ? `, ${user.nombre}` : ""}`}
          description=" Accedé rápidamente a las áreas de gestión, reportes y seguimiento
              diario desde una sola pantalla."
        />

        {user.id_perfil === 5 && (
          <>
            <TitleBox
              title="Gestión General"
              description="Módulos operativos principales para el trabajo diario del
                equipo."
            />
            <DashboardMenu idPerfil={user?.id_perfil}></DashboardMenu>
          </>
        )}
        <Box sx={{ mt: 6 }}>
          <TitleBox
            title="Tus horarios y proximos eventos"
            description="Permite visualizar tus horarios y los eventos proximos"
          />
          <Box
            sx={{
              mt: 3,
              p: { xs: 1.5, md: 2.5 },
              borderRadius: 6,
              bgcolor: "white",
              boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
            }}
          >
            <AdminUsersProvider>
              <EmployedCalendar legajoEmpleado={user.email} />
            </AdminUsersProvider>
          </Box>
          <Box
            sx={{
              mt: 3,
              bgcolor:"lightgray",
               borderRadius: 6,
            }}
          >
            <CalendarEvent eventos={eventosJPA} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
