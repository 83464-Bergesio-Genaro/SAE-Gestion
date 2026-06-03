import { useMemo,useEffect, useState } from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
    Card,
    CardContent,
    Chip,
    InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import { ObtenerEventosPublicos,ObtenerEventosSAE,ObtenerStands,ObtenerInteresados } from "../../../api/JPAService";
import { data } from "react-router-dom";

const formatHeader = (key) =>
  key
    .replaceAll("_", " ")
    .replace(/\b\w/g, l => l.toUpperCase());
    
const generateColumns = (data) => {

  if (!data || data.length === 0) return [];

  return Object.keys(data[0]).map((key) => ({

    field: key,
    
    headerName: formatHeader(key), 

    flex: 1,
    minWidth: 80,
    maxWidth: 200

  }));

};
const generateRows = (data) => {

  return data.map((item, index) => ({
    id: item.id || index,
    ...item
  }));

};
export default function JpaAdmin(){
    
    const [eventosJPA, setEventosJPA] = useState([]);
    const [eventosSAE, setEventosSAE] = useState([]);
    const [standsSAE, setStands] = useState([]);
    const [interesadosJPA, setInteresados] = useState([]);
    
    useEffect(() => {
    
        const ObtenerEventosPublicosApi = async () => {
            try {
            const data = await ObtenerEventosPublicos();
            setEventosJPA(data);
            } catch (error) {
            console.error("Error al traer Eventos:", error);
            }
        };
        ObtenerEventosPublicosApi();
    }, []);

    useEffect(() => {
    
        const ObtenerEventosSaeApi = async () => {
            try {
            const data = await ObtenerEventosSAE();
            setEventosSAE(data)
            } catch (error) {
            console.error("Error al traer Eventos:", error);
            }
        };
        ObtenerEventosSaeApi();
    }, []);

    useEffect(() => {
    
        const ObtenerStandsApi = async () => {
            try {
            const data = await ObtenerStands();
            setStands(data);
            } catch (error) {
            console.error("Error al traer Stands:", error);
            }
        };
        ObtenerStandsApi();
    }, []);

    useEffect(() => {
    
        const ObtenerInteresadosApi = async () => {
            try {
            const data = await ObtenerInteresados();
            setInteresados(data);
            } catch (error) {
            console.error("Error al traer Interesados:", error);
            }
        };
        ObtenerInteresadosApi();
    }, []);


    const sectionConfig = {
        eventosPublicos: {
        title: "Gestión Eventos Públicos",
        icon: CalendarTodayIcon,
        data: eventosJPA,
        rows: generateRows(eventosJPA),
        columns: generateColumns(eventosJPA)
    },
    eventosInternos: {
        title: "Gestión Eventos Internos",
        icon: EmojiEventsIcon,
        data: eventosSAE,
        rows: generateRows(eventosSAE),
        columns: generateColumns(eventosSAE)
    },
    stands: {
        title: "Gestión de Puestos",
        icon: GroupsIcon,
        data: standsSAE,
        rows: generateRows(standsSAE),
        columns: generateColumns(standsSAE)
    },
    interesados: {
        title: "Gestión de Interesados",
        icon: GroupsIcon,
        data: interesadosJPA,
        rows: generateRows(interesadosJPA),
        columns: generateColumns(interesadosJPA)
    }
};
    const [activeSection, setActiveSection] = useState("eventosPublicos");
    const [busquedaGestion, setBusquedaGestion] = useState("");
    const [busquedaDeportes, setBusquedaDeportes] = useState("");
    
    const handleSectionChange = (section) => {
        setActiveSection(section);
        setBusquedaGestion("");
    };

    const currentSection = useMemo(
        () => sectionConfig[activeSection],
        [activeSection],
    );
    
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
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666", mb: 1 }}>
                    Gestión de la Jornada de Puertas Abiertas
                </Typography>
                <Typography sx={{ color: "#5a6f8f", mb: 3 }}>
                    Se permite gestionar, eventos, stands y los interesados.
                </Typography>

                <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)", mb: 3 }}>
                    <CardContent>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={1.5}
                            sx={{
                                mb: 2.5,
                                width: "100%",
                                justifyContent: "space-between",
                                alignItems: { xs: "stretch", md: "center" },
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1.2}
                                sx={{
                                    flexWrap: "wrap",
                                    flex: 1,
                                    minWidth: 0,
                                }}
                            >
                                <SAEButton
                                    variant={activeSection === "eventosPublicos" ? "contained" : "outlined"}
                                    startIcon={<SchoolIcon />}
                                    onClick={() => handleSectionChange("eventosPublicos")}
                                >
                                    Gestión Eventos Públicos
                                </SAEButton>
                                <SAEButton
                                    variant={activeSection === "eventosInternos" ? "contained" : "outlined"}
                                    startIcon={<EmojiEventsIcon />}
                                    onClick={() => handleSectionChange("eventosInternos")}
                                >
                                    Gestión Eventos Internos
                                </SAEButton>
                                <SAEButton
                                    variant={activeSection === "stands" ? "contained" : "outlined"}
                                    startIcon={<PeopleIcon />}
                                    onClick={() => handleSectionChange("stands")}
                                >
                                    Gestión Puestos
                                </SAEButton>
                                <SAEButton
                                    variant={activeSection === "interesados" ? "contained" : "outlined"}
                                    startIcon={<PersonIcon />}
                                    onClick={() => handleSectionChange("interesados")}
                                >
                                    Gestión Interesados
                                </SAEButton>
                            </Stack>

                            <SAETextField
                                placeholder="Busqueda..."
                                size="small"
                                value={busquedaGestion}
                                onChange={(e) => setBusquedaGestion(e.target.value)}
                                sx={{
                                    alignSelf: { md: "flex-end" },
                                    mt: { xs: 0.5, md: 0 },
                                    width: { xs: "100%", sm: 280, md: 250 },
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Stack>

                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#153b6f", mb: 1.5 }}>
                            <currentSection.icon sx={{ mr: 1, verticalAlign: "middle" }} />
                            {currentSection.title}
                        </Typography>

                        <Box sx={{ width: "100%" }}>
                            <DataGrid
                                rows={generateRows(currentSection.data).filter((row) =>
                                    Object.values(row).some((value) =>
                                        String(value).toLowerCase().includes(busquedaGestion.toLowerCase())
                                    )
                                )}
                                columns={generateColumns(currentSection.data)}
                                autoHeight
                                disableRowSelectionOnClick
                                pageSizeOptions={[5, 10, 25]}
                                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                                sx={{ borderRadius: 2 }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    )
}