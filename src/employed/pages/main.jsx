import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "../../shared/auth/AuthContext";
import { CalendarEvent } from "../../shared/components/calendarEvent/calendarEvent";
import { ObtenerEventosPublicos, ObtenerEventosSAE } from "../../api/JPAService";
import { EmployedCalendar } from "./users/EmployedCalendar";
import { AdminUsersProvider } from "./users/AdminUsersContext";
import DashboardMenu from "../../shared/components/dashboardMenu/DashboardMenu";


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
];

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
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "#14325c" }}>
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
    const baseUrl = import.meta.env.BASE_URL;
    const { user } = useAuth();
    const navigate = useNavigate();
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
                pb: 8,
                mt: "-90px",
                pt: "90px",
                minHeight: "100%",
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
                        backgroundImage:
                            `linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%), url('${baseUrl}images/carrousel/EntradaUTN.jpg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <Box sx={{ maxWidth: 700 }}>
                        <Typography
                            variant="overline"
                            sx={{ letterSpacing: 1.8, opacity: 0.85, fontWeight: 700 }}
                        >
                            Panel SAE Empleados
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{ mt: 1, fontWeight: 800, lineHeight: 1.1, fontSize: { xs: "2rem", md: "3rem" } }}
                        >
                            {`Bienvenido${user?.nombre ? `, ${user.nombre}` : ""}`}
                        </Typography>
                        <Typography sx={{ mt: 2, maxWidth: 560, fontSize: { xs: 16, md: 18 }, opacity: 0.92 }}>
                            Accedé rápidamente a las áreas de gestión, reportes y seguimiento diario desde una sola pantalla.
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                            <Chip
                                label={`Perfil ${user?.id_perfil ?? "-"}`}
                                sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", fontWeight: 700 }}
                            />
                            <Chip
                                label={user?.legajo ? `Legajo ${user.legajo}` : "Sesión activa"}
                                sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white", fontWeight: 700 }}
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
                {user.id_perfil ===5 && (
                <>
                    <Box sx={{ mt: 5 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
                            Gestión General
                        </Typography>
                        <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
                            Módulos operativos principales para el trabajo diario del equipo.
                        </Typography>
                        <DashboardMenu idPerfil={user?.id_perfil}></DashboardMenu>
                    </Box>
                    {/* 
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
                            Estadísticas y Reportes
                        </Typography>
                        <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
                            Accesos rápidos para consulta, seguimiento y publicación de información.
                        </Typography>

                        <Grid container spacing={2.5} sx={{ mt: 1 }}>
                            {reportOptions.map((item) => (
                                <Grid key={item.name} item xs={12} sm={6} lg={4}>
                                    <DashboardCard item={item} onClick={() => navigate(item.route)} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>*/}
                 </>
                )}
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
                        Tus horarios y proximos eventos
                    </Typography>
                    <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
                        Permite visualizar tus horarios y los eventos proximos
                    </Typography>
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
                            p: { xs: 1.5, md: 2.5 },
                            borderRadius: 6,
                            bgcolor: "white",
                            boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
                        }}
                    >
 
                         <CalendarEvent eventos={eventosJPA} />
                    </Box>

                </Box>
            </Container>
        </Box>
    );
}
