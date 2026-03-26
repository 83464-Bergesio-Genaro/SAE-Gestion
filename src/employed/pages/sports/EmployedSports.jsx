import { useMemo, useState } from "react";
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
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";

const deportesRows = [
    { id: 1, deporte: "Fútbol", espacio: "Cancha Norte", docente: "Prof. G. Varela", cupo: 40, estado: "Activo" },
    { id: 2, deporte: "Básquet", espacio: "Gimnasio Central", docente: "Prof. M. Ceballos", cupo: 30, estado: "Activo" },
    { id: 3, deporte: "Vóley", espacio: "SUM Deportivo", docente: "Prof. L. Funes", cupo: 28, estado: "Activo" },
    { id: 4, deporte: "Handball", espacio: "Cancha Sur", docente: "Prof. S. Giménez", cupo: 25, estado: "Pausado" },
];

const deportistasRows = [
    { id: 1, nombre: "Ana Torres", legajo: "70551", deporte: "Vóley", condicion: "Regular" },
    { id: 2, nombre: "Luciano Díaz", legajo: "70322", deporte: "Fútbol", condicion: "Regular" },
    { id: 3, nombre: "Valentina Castro", legajo: "70914", deporte: "Básquet", condicion: "Becado" },
    { id: 4, nombre: "Tomás Nuñez", legajo: "70187", deporte: "Handball", condicion: "Regular" },
];

const profesoresRows = [
    { id: 1, nombre: "Gonzalo Varela", area: "Fútbol", carga_horaria: "12 hs", estado: "Activo" },
    { id: 2, nombre: "Mariana Ceballos", area: "Básquet", carga_horaria: "10 hs", estado: "Activo" },
    { id: 3, nombre: "Laura Funes", area: "Vóley", carga_horaria: "8 hs", estado: "Activo" },
    { id: 4, nombre: "Sergio Giménez", area: "Handball", carga_horaria: "6 hs", estado: "Licencia" },
];

const torneosRows = [
    { id: 1, torneo: "Interfacultades Apertura", deporte: "Fútbol", fecha: "12/04/2026", sede: "UTN FRC" },
    { id: 2, torneo: "Copa Regional", deporte: "Básquet", fecha: "19/04/2026", sede: "UNC" },
    { id: 3, torneo: "Liga Universitaria", deporte: "Vóley", fecha: "26/04/2026", sede: "UTN FRC" },
    { id: 4, torneo: "Torneo Relámpago", deporte: "Handball", fecha: "03/05/2026", sede: "IES" },
];

const deportesColumns = [
    { field: "deporte", headerName: "Deporte", flex: 1, minWidth: 140 },
    { field: "espacio", headerName: "Espacio", flex: 1, minWidth: 180 },
    { field: "docente", headerName: "Docente responsable", flex: 1, minWidth: 180 },
    { field: "cupo", headerName: "Cupo", width: 100 },
    {
        field: "estado",
        headerName: "Estado",
        width: 120,
        renderCell: (params) => (
            <Chip
                size="small"
                label={params.value}
                color={params.value === "Activo" ? "success" : "warning"}
            />
        ),
    },
];

const deportistasColumns = [
    { field: "nombre", headerName: "Nombre", flex: 1, minWidth: 180 },
    { field: "legajo", headerName: "Legajo", width: 120 },
    { field: "deporte", headerName: "Deporte", width: 140 },
    { field: "condicion", headerName: "Condición", width: 140 },
];

const profesoresColumns = [
    { field: "nombre", headerName: "Profesor", flex: 1, minWidth: 180 },
    { field: "area", headerName: "Área", width: 140 },
    { field: "carga_horaria", headerName: "Carga horaria", width: 140 },
    { field: "estado", headerName: "Estado", width: 120 },
];

const torneosColumns = [
    { field: "torneo", headerName: "Torneo", flex: 1, minWidth: 220 },
    { field: "deporte", headerName: "Deporte", width: 140 },
    { field: "fecha", headerName: "Fecha", width: 130 },
    { field: "sede", headerName: "Sede", width: 140 },
];

const sectionConfig = {
    profesores: {
        title: "Gestión Profesores",
        icon: SchoolIcon,
        rows: profesoresRows,
        columns: profesoresColumns,
    },
    torneos: {
        title: "Gestión Torneos",
        icon: EmojiEventsIcon,
        rows: torneosRows,
        columns: torneosColumns,
    },
    deportistas: {
        title: "Gestión Deportistas",
        icon: GroupsIcon,
        rows: deportistasRows,
        columns: deportistasColumns,
    },
};

export default function EmployedSports() {
    const [activeSection, setActiveSection] = useState("profesores");
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

    const rowsGestionFiltradas = useMemo(() => {
        const term = busquedaGestion.trim().toLowerCase();
        if (!term) return currentSection.rows;

        return currentSection.rows.filter((row) =>
            Object.values(row).some((value) =>
                String(value ?? "").toLowerCase().includes(term),
            ),
        );
    }, [currentSection.rows, busquedaGestion]);

    const rowsDeportesFiltradas = useMemo(() => {
        const term = busquedaDeportes.trim().toLowerCase();
        if (!term) return deportesRows;

        return deportesRows.filter((row) =>
            Object.values(row).some((value) =>
                String(value ?? "").toLowerCase().includes(term),
            ),
        );
    }, [busquedaDeportes]);

    return (
        <Box
            sx={{
                mt: "-90px",
                pt: { xs: "114px", md: "130px" },
                pb: 4,
                minHeight: "calc(100vh - 90px)",
                bgcolor: "#f4f8fc",
            }}
        >
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666", mb: 1 }}>
                    Gestión de Deportes
                </Typography>
                <Typography sx={{ color: "#5a6f8f", mb: 3 }}>
                    Módulo para la gestión de torneos, profesores y deportistas.
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
                                    variant={activeSection === "profesores" ? "contained" : "outlined"}
                                    startIcon={<SchoolIcon />}
                                    onClick={() => handleSectionChange("profesores")}
                                >
                                    Gestión Profesores
                                </SAEButton>
                                <SAEButton
                                    variant={activeSection === "torneos" ? "contained" : "outlined"}
                                    startIcon={<EmojiEventsIcon />}
                                    onClick={() => handleSectionChange("torneos")}
                                >
                                    Gestión Torneos
                                </SAEButton>
                                <SAEButton
                                    variant={activeSection === "deportistas" ? "contained" : "outlined"}
                                    startIcon={<PeopleIcon />}
                                    onClick={() => handleSectionChange("deportistas")}
                                >
                                    Gestión Deportistas
                                </SAEButton>
                            </Stack>

                            <SAETextField
                                placeholder="Buscar en esta gestión..."
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
                                rows={rowsGestionFiltradas}
                                columns={currentSection.columns}
                                autoHeight
                                disableRowSelectionOnClick
                                pageSizeOptions={[5, 10, 25]}
                                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                                sx={{ borderRadius: 2 }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)" }}>
                    <CardContent>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={1.5}
                            sx={{
                                mb: 1.5,
                                width: "100%",
                                justifyContent: "space-between",
                                alignItems: { xs: "stretch", md: "center" },
                            }}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#153b6f" }}>
                                    <SportsSoccerIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                                    Deportes activos
                                </Typography>
                            </Box>

                            <SAETextField
                                placeholder="Buscar en deportes activos..."
                                size="small"
                                value={busquedaDeportes}
                                onChange={(e) => setBusquedaDeportes(e.target.value)}
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

                        <Box sx={{ width: "100%" }}>
                            <DataGrid
                                rows={rowsDeportesFiltradas}
                                columns={deportesColumns}
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
    );
}