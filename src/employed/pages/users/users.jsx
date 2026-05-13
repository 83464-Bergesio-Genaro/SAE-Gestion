import { useMemo,useEffect, useState, useCallback  } from "react";
import { useNavigate } from "react-router-dom";
import {
    Autocomplete,
    Box,
    Grid,
    Container,
    Stack,
    Typography,
    Card,
    CardContent,
    Chip,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    FormControlLabel,
    Switch,
    CircularProgress,
    Alert,
    Snackbar,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AddIcon from "@mui/icons-material/Add";
import CastleIcon from '@mui/icons-material/Castle';
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from "@mui/icons-material/Search";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../../shared/auth/AuthContext";
import { DataGrid } from "@mui/x-data-grid";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import {CrearRegistroUsuario,CrearEmpleado,ModificarUsuario, ObtenerEmpleados,ObtenerUsuarios } from "../../../api/EmpleadoService";
import {obtenerPerfiles,obtenerCarreras} from "../../../api/HerramientasService";
import EmployCalendar from "../jpa/EmployedCalendar";

const secciones=[
    {   key: "empleados", 
        label: "Empleados"
    },
    {   key: "usuarios", 
        label: "Estudiantes Registrados"
    }
];
const formatTime = (time) => {
    return time ? (time.endsWith("hs") ? time.replace("hs", ":00") : `${time}:00`) : time;
};
const formatHeader = (key) =>
  key
    .replaceAll("_", " ")
    .replace(/\b\w/g, l => l.toUpperCase());
    
const generateColumns = (data,editAction) => {

  if (!data || data.length === 0) return [];

  const columns = Object.keys(data).map((key) => {
    
    const isId = key.toLowerCase().includes("id");
    const isShort = ["estado", "cupo","duracion","horario_inicio","horario_fin"].includes(key.toLowerCase());
    if(key.toLowerCase() === "activo"){
        return {
            field: "activo",
            headerName: "Estado",
            align: "center" ,
            headerAlign: "center" ,
            width: 100,
            renderCell: (params) => (
                <Chip
                    size="small"
                    label={params.value ? "Activo" : "Inactivo"}
                    color={params.value ? "success" : "default"}
                />
            )
        }
    }
    else{
        return {
        field: key,
        headerName: formatHeader(key),

        flex: isId ? 0.3 : 1,
        minWidth: isId? 50 : 150,
        maxWidth: isId? 70: isShort ? 100 : NaN,
        align: isId || isShort ? "center" : "left",
        headerAlign: isId || isShort ? "center" : "left",
        };
    }


  });

  // 👉 columna de acciones
  columns.push({
    field: "actions",
    headerName: "Acciones",
    sortable: false,
    filterable: false,
    width: 100,
    renderCell: (params) => (
        <Box>
            <IconButton
                size="small"
                color="primary"
                title="Ver / Editar"
                onClick={() => editAction(params.row)}
            >
                <EditIcon fontSize="small" />
            </IconButton>               
        </Box>  
    )
  });

  return  columns;
};
const generateRows = (data) => {

    return [...data]
    .sort((a, b) => a.id - b.id)
    .map((item, index) => ({
        id: item.id || index,
        ...item
    }));

};

const EMPTY_EMPLEADO =    
{
    id: "",
    legajo: "",
    nombre_empleado: "",
    id_perfil: 5,
    nombre_perfil: "",
    activo: true
}
const EMPTY_USUARIO = 
{
    id: "",
    legajo: "",
    nombre_usuario:"",
    id_perfil: "",
    activo: false 
}
export function GestionarHorariosDialog(){
    return(<></>)
}
export default function AdminUsers() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [horariosDialogOpen, setHorariosDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    {/*Seccion Empleados Activos  */}
    const [empleadosRows, setEmpleadosRows] = useState([]);
    const [loadingEmpleados, setLoadingEmpleados] = useState(false);

    const fetchEmpleados = useCallback(async () => {
        setLoadingEmpleados(true);
        try {
            const data = await ObtenerEmpleados();
            setEmpleadosRows(generateRows(data));
        } catch {
            setEmpleadosRows([]);
        } finally {
            setLoadingEmpleados(false);
        }
    }, []);
    {/*Esto produce dos cosas, uno que se pueda realizar efectivamente de manera asincronica y segundo que lo exporte para su uso cuando inicializa la pagina */}
    useEffect(() => {
        fetchEmpleados();
    }, [fetchEmpleados]);

    const openCreateEmpleados = () => {
        setDialogType("empleados");
        setDialogMode("create");
        setDialogData({
            id: "",
            legajo: "",
            nombre_empleado: "",
            nombres: "",
            apellidos: "",
            activo: true,
            id_perfil: "",
            nombre_perfil: ""}); 
        setDialogError("");

        // 👇 asegurar que abre después
        setTimeout(() => {
            setDialogOpen(true);
        }, 0);

    };
    const openEditEmpleados = useCallback((row) => {
        setDialogData( {
            id: row.id,
            legajo: row.legajo,
            nombre_empleado: row.nombre_empleado,
            nombres: row.nombres,
            apellidos: row.apellidos,
            activo: row.activo,
            id_perfil: row.id_perfil,
            nombre_perfil: row.nombre_perfil});
        setDialogType("empleados");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);
    const handleEmpleadosSave = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
        const { id, ...rest } = dialogData;
        let id_nuevo = id===""? 0:id; /* Si esta vacio debemos mandar un valor para que no se rompa el objeto */
        const body = {
                    "id": id_nuevo,
                    "legajo": dialogData.legajo,
                    "nombre_usuario": dialogData.nombre_usuario,
                    "id_perfil": dialogData.id_perfil,
                    "activo": dialogData.activo
                };

            if (dialogMode === "create") {
                await CrearEmpleado(body,dialogData.nombres,dialogData.apellidos);
            } else if(dialogMode === "edit") {
                await ModificarUsuario(dialogData.id, body);
            }
            setDialogOpen(false);
            setDialogData(EMPTY_EMPLEADO);
            fetchEmpleados();
            setSnackbarMsg(dialogMode === "create"? "Empleado creado!":(dialogMode === "edit")?"Empleado modificado correctamente":"Se elimino el usuario correctamente");
            setSnackbarOpen(true);
        }
        catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };   
    {/*Seccion Usuarios */}
    const [usuariosRows, setUsuariosRows] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);

    const fetchUsuarios = useCallback(async () => {
        setLoadingUsuarios(true);
        try {
            const data = await ObtenerUsuarios();
            let UserData=data.filter(item => item.id_perfil === 1 ); /* Solo estudiantes */
            setUsuariosRows(generateRows(UserData));
        } catch {
            setUsuariosRows([]);
        } finally {
            setLoadingUsuarios(false);
        }
    }, []);
    {/*Esto produce dos cosas, uno que se pueda realizar efectivamente de manera asincronica y segundo que lo exporte para su uso cuando inicializa la pagina */}
    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const openCreateUsuarios = () => {
        setDialogType("usuarios");
        setDialogMode("create");
        setDialogData({
            id: "",
            legajo: "",
            nombre_usuario: "",
            nombres: "",
            apellidos: "",
            id_perfil: 1, /* Por defecto se crean como estudiantes */
            activo: true,
            id_carrera: "",
            nombre_carrera: ""}); 
        setDialogError("");

        // 👇 asegurar que abre después
        setTimeout(() => {
            setDialogOpen(true);
        }, 0);

    };
    const openEditUsuarios = useCallback((row) => {
        setDialogData( {
            id: row.id,
            legajo: row.legajo,
            nombre_usuario: row.nombre_usuario,
            nombres: row.nombres,
            apellidos: row.apellidos,
            id_perfil: row.id_perfil,
            activo: row.activo,
            id_carrera: row.id_carrera,
            nombre_carrera: row.nombre_carrera});
        setDialogType("usuarios");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);
    const handleUsuariosSave = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
        const { id,lugar, ...rest } = dialogData;
        let id_nuevo = id===""? 0:id; /* Si esta vacio debemos mandar un valor para que no se rompa el objeto */
        const body = {
                    "id": id_nuevo,
                    "legajo": dialogData.legajo,
                    "nombre_usuario": dialogData.nombre_usuario,
                    "id_perfil": dialogData.id_perfil,
                    "activo": dialogData.activo
                };
                console.log(body);
            if (dialogMode === "create") {
                await CrearRegistroUsuario(body,dialogData.nombres,dialogData.apellidos,dialogData.id_carrera);
            } else if(dialogMode === "edit") {
                await ModificarUsuario(body,dialogData.id);
            }else{
               // await eliminarEvento(dialogData.id);
            }
            console.log(body);
            setDialogOpen(false);
            setDialogData(EMPTY_USUARIO);
            fetchUsuarios();
            setSnackbarMsg(dialogMode === "create"? "Usuario Registrado!":(dialogMode === "edit")?"El usuario fue modificado correctamente":"Se elimino el evento correctamente");
            setSnackbarOpen(true);
        }
        catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };   
    {/*Necesario para cargar los datos en el dialog (ALTA) */}
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("empleados"); 
    const [dialogMode, setDialogMode] = useState("create");
    const [dialogData, setDialogData] = useState(EMPTY_EMPLEADO);
    const [dialogSaving, setDialogSaving] = useState(false);
    const [dialogError, setDialogError] = useState("");

    const [perfiles, setPerfiles] = useState([]);
    const fetchPerfiles= useCallback(async () => {
        try {
            const data = await obtenerPerfiles();  
            setPerfiles(data);
            
        } catch {
            setPerfiles([]);
        } finally {
        }
    }, []);

    useEffect(() => {
        fetchPerfiles();
    }, [fetchPerfiles]);

    const [carreras, setCarreras] = useState([]);
    const fetchCarreras= useCallback(async () => {
        try {
            const data = await obtenerCarreras();  
            setCarreras(data);
            
        } catch {
            setCarreras([]);
        } finally {
        }
    }, []);

    useEffect(() => {
        fetchCarreras();
    }, [fetchCarreras]);

    {/* Van por separado porque se va a realizar una operacion costosa por ende se empaquetan dentro del useMemo*/ }
    const sectionConfig = useMemo(
         () => ({
            empleados:{
                title:"Empleados",
                dialog:openCreateEmpleados,
                addButton:"Nuevo Empleado",
                icon: Diversity3Icon,
                rows: empleadosRows,
                columns: generateColumns(EMPTY_EMPLEADO,openEditEmpleados),
                loading: loadingEmpleados
            },
            usuarios:{
                title:"Usuarios",
                dialog:openCreateUsuarios,
                addButton:"Nuevo Usuario",
                icon: PersonAddAltIcon,
                rows: usuariosRows,
                columns: generateColumns(EMPTY_USUARIO,openEditUsuarios),
                loading: loadingUsuarios
            }
        }),
        [empleadosRows,loadingEmpleados,openEditEmpleados,
            usuariosRows,loadingUsuarios,openEditUsuarios
        ]
    );

    const [activeSection, setActiveSection] = useState("empleados");
    const [busquedaGestion, setBusquedaGestion] = useState("");
    const handleSectionChange = (section) => {
        setActiveSection(section);
        setBusquedaGestion("");
    };

    const currentSection = useMemo(
        () => sectionConfig[activeSection],
        [activeSection, sectionConfig],
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
    const handleDialogChange = (field, value) => {
        setDialogData((prev) => ({ ...prev, [field]: value }));
    };
    return (
        <Box
        sx={{
            mt: "-90px",
            pt: { xs: "90px", md: "100px" },
            pb: 4,
            minHeight: "calc(100vh - 90px)",
            bgcolor: "#f4f8fc"}}
            >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        overflow: "hidden",
                        borderRadius: 6,
                        px: { xs: 3, md: 6 },
                        py: { xs: 4, md: 5 },
                        mb: 4,
                        minHeight: 220,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 3,
                        backgroundImage:
                            "linear-gradient(125deg, rgba(45, 95, 169, 0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%), url('/images/carrousel/EntradaUTN.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "white",
                    }}>
                    <Box sx={{ maxWidth: 700 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                            <IconButton
                                size="small"
                                onClick={() => navigate("/Inicio")}
                                sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.12)" } }}
                            >
                                <ArrowBackIcon fontSize="small" />
                            </IconButton>
                            <Typography
                                variant="overline"
                                sx={{ letterSpacing: 1.8, opacity: 0.85, fontWeight: 700 }}
                            >
                                Módulo Empleados
                            </Typography>
                        </Stack>
                        <Typography
                            variant="h3"
                            sx={{ mt: 1, fontWeight: 800, lineHeight: 1.1, fontSize: { xs: "2rem", md: "2.6rem" } }}
                        >
                            Gestión de Empleados y sus Horarios
                        </Typography>
                        <Typography sx={{ mt: 2, maxWidth: 520, fontSize: { xs: 15, md: 17 }, opacity: 0.92 }}>
                            Permite cargar empleados, modificar sus permisos y sus horarios
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
                                width: 180,
                                height: 180,
                                borderRadius: "28px",
                                backgroundImage: "url('/images/principal/logoUTNrotado.png')",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "contain",
                                transform: "rotate(8deg)",
                                filter: "drop-shadow(0 18px 35px rgba(0,0,0,0.22))",
                            }}
                        />
                    </Box>
                    <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)", mb: 3, overflow: "hidden" }}>
                        <Box
                        sx={{
                            background: "linear-gradient(135deg, #1a3a5c 0%, #2d6da3 100%)",
                            color: "white",
                            px: 3,
                            pt: 0,
                            pb: 0,
                        }}>

                            <Stack direction="row" overflow={{xs:"scroll",md:"hidden"}} spacing={0}>
                                {secciones.map((item) => ( 
                                    <Box
                                        key={item.key}
                                        onClick={() => handleSectionChange(item.key)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            px: 2.5,
                                            py: 1.5,
                                            cursor: "pointer",
                                            fontWeight: activeSection === item.key ? 700 : 500,
                                            fontSize: "0.85rem",
                                            letterSpacing: "0.05em",
                                            textTransform: "uppercase",
                                            color: activeSection === item.key ? "white" : "rgba(255,255,255,0.6)",
                                            borderBottom: activeSection === item.key ? "3px solid white" : "3px solid transparent",
                                            transition: "all 0.15s",
                                            "&:hover": {
                                                color: "white",
                                                borderBottomColor: "rgba(255,255,255,0.4)",
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: "inherit",
                                                fontSize: "inherit",
                                                letterSpacing: "inherit",
                                                textTransform: "inherit",
                                                color: "inherit",
                                                lineHeight: 1,
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" spacing={2} sx={{ py: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <currentSection.icon sx={{ fontSize: 30 }} />
                                <Typography variant="h6" fontWeight={700}>
                                    {currentSection.title}
                                </Typography>
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }}>
                                <SAETextField
                                    placeholder="Busqueda..."
                                    size="small"
                                    value={busquedaGestion}
                                    onChange={(e) => setBusquedaGestion(e.target.value)}
                                    sx={{
                                        width: { xs: "100%", sm: 240, md: 220 },
                                        "& .MuiOutlinedInput-root": {
                                            bgcolor: "rgba(255,255,255,0.12)",
                                            color: "white",
                                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.6)" },
                                            "&.Mui-focused fieldset": { borderColor: "white" },
                                        },
                                        "& input::placeholder": { color: "rgba(255,255,255,0.7)", opacity: 1 },
                                        "& .MuiInputAdornment-root svg": { color: "rgba(255,255,255,0.7)" },
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
                                <SAEButton
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={currentSection.dialog}
                                        sx={{
                                            whiteSpace: "nowrap",
                                            bgcolor: "rgba(255,255,255,0.18)",
                                            color: "white",
                                            border: "1px solid rgba(255,255,255,0.4)",
                                            "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                                        }}
                                    >
                                {currentSection.addButton}
                                </SAEButton>
                                
                            </Stack>
                        </Stack>
                    </Box>
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ width: "100%"}}>
                            <DataGrid
                                rows={rowsGestionFiltradas}
                                columns={currentSection.columns}
                                loading={currentSection.loading}
                                autoHeight
                                disableRowSelectionOnClick
                                pageSizeOptions={[5, 10, 25]}
                                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                                localeText={{ noRowsLabel: "Sin Registros" }}
                                sx={{ borderRadius: 0, border: "none" }}
                            />
                        </Box>
                    </CardContent>
                </Card>
                <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)", overflow: "hidden", mt: 3 }}>
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #1a3a5c 0%, #2d6da3 100%)",
                            color: "white",
                            px: 3,
                            py: 2.5,
                        }}
                    >
                        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} justifyContent="space-between" spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <ScheduleIcon sx={{ fontSize: 32 }} />
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        Horarios Empleados
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                        Nuestros Horarios
                                    </Typography>
                                </Box>
                            </Stack>
                            <SAEButton
                                variant="contained"
                                startIcon={<ScheduleIcon />}
                                onClick={() => setHorariosDialogOpen(true)}
                                sx={{
                                    whiteSpace: "nowrap",
                                    bgcolor: "rgba(255,255,255,0.18)",
                                    color: "white",
                                    border: "1px solid rgba(255,255,255,0.4)",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                                }}
                            >
                                Gestionar Horarios
                            </SAEButton>
                        </Stack>
                    </Box>
                </Card>
                <EmployCalendar />
            </Container>
            <GestionarHorariosDialog
                open={horariosDialogOpen}
                onClose={() => setHorariosDialogOpen(false)}
            />
            {/*Esto abre un dialog para cargar, modificar o eliminar los datos del tipo seleccionado. Yo lo separo asi porque es mas comodo visualmente */}
            {dialogOpen && dialogType === "empleados" && (
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                        { dialogMode === "create" ? "Nuevo Empleado" : "Editar Empleado"}
                    </Typography>
                    <IconButton onClick={() => setDialogOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {dialogError && (
                            <Alert severity="error" onClose={() => setDialogError("")}>
                                {dialogError}
                            </Alert>
                        )}
                        <>
                        {dialogMode === "edit" && (
                            <Grid container spacing={1} >
                                <Grid size={{xs:12,md:3}} m={0}>
                                    <SAETextField
                                        label="ID"
                                        type="number"
                                        fullWidth
                                        value={dialogData.id}
                                        onChange={(e) => handleDialogChange("id", e.target.value)}
                                        disabled={true}
                                    />     
                                </Grid>
                                <Grid size={{xs:12,md:9}} m={0}>
                                    {console.log(dialogData)}
                                    <SAETextField
                                        label="Nombre Completo"
                                        value={dialogData.nombre_empleado}
                                        disabled={true}
                                        onChange={(e) => handleDialogChange("nombre_empleado", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>)}
                        {dialogMode === "create" && (
                            <>
                            <Card sx={{ bgcolor: "rgba(235, 235, 41, 0.7)", border: "1px solid rgba(235, 41, 41, 0.1)" }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" color="textPrimary" fontWeight={600} gutterBottom>
                                        ¡ATENCION! 
                                        </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Al crear un nuevo empleado debe escribirse sin errores su legajo ya que esta sera la unica forma que pueda acceder a la aplicacion, debe contener el valor @utn.frc.edu.ar al final.
                                        El nombre completo solo podra ser modificado por el usuario desde la aplicacion despues de creado.
                                        <br/><br/>
                                        Ademas desde esta pestaña solo se podran crear perfiles de empleados, comedor, salud y administrador.
                                    </Typography>
                                </CardContent>
                            </Card>
                                <SAETextField
                                label="Nombres"
                                value={dialogData.nombres}
                                onChange={(e) => handleDialogChange("nombres", e.target.value)}
                                fullWidth
                                />
                            <SAETextField
                                label="Apellidos"
                                value={dialogData.apellidos}
                                onChange={(e) => handleDialogChange("apellidos", e.target.value)}
                                fullWidth
                                />
                            <SAETextField
                                label="Nombre de Usuario"
                                value={dialogData.nombre_usuario}
                                onChange={(e) => handleDialogChange("nombre_usuario", e.target.value)}
                                fullWidth
                                />
                            </>
                        )}
                        <SAETextField
                            label="Legajo"
                            value={dialogData.legajo}
                            disabled={dialogMode=== "create"? false:true}
                            onChange={(e) => handleDialogChange("legajo", e.target.value)}
                            fullWidth
                        />
                        <Autocomplete
                            disablePortal
                            options={perfiles}
                            getOptionLabel={(option) => option.nombre}
                               onChange={(event, newValue) => {
                                // 'newValue' es el objeto completo del perfil seleccionado (o null)
                                if (newValue) {
                                    handleDialogChange("id_perfil", newValue.id);
                                } else {
                                    // Maneja el caso de que se borre la selección
                                    handleDialogChange("id_perfil", null);
                                }
                            }}
                            // Asegura que la comparación se haga por id
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            value={perfiles.find(perfil => perfil.id === dialogData.id_perfil)} // Pasa el objeto completo
                            renderInput={(params) => 
                            <TextField
                                {...params}
                                label="Perfil"
                                inputProps={{
                                    ...params.inputProps,
                                    readOnly: true, // Esto evita la escritura
                                }}
                            />}
                        />
                        {dialogMode === "edit" && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={dialogData.activo}
                                    onChange={(e) => handleDialogChange("activo", e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={dialogData.activo ? "Desactivar Usuario" : "Activar Usuario"}
                        />)}
                        
                    </>             
                        
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <SAEButton variant="outlined" onClick={() => setDialogOpen(false)} disabled={dialogSaving}>
                        Cancelar
                    </SAEButton>
                    <SAEButton
                        variant="contained"
                        onClick={handleEmpleadosSave}
                        disabled={dialogSaving}
                        startIcon={dialogSaving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {dialogMode === "create" ? "Crear" :(dialogMode === "delete")? "Eliminar": "Guardar"}
                    </SAEButton>
                </DialogActions>                
            </Dialog>            
            )}
            {/*Esto abre un dialog para cargar, modificar o eliminar los datos del tipo seleccionado. Yo lo separo asi porque es mas comodo visualmente */}
            {dialogOpen && dialogType === "usuarios" && (
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                        { dialogMode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
                    </Typography>
                    <IconButton onClick={() => setDialogOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {dialogError && (
                            <Alert severity="error" onClose={() => setDialogError("")}>
                                {dialogError}
                            </Alert>
                        )}
                        <>
                        {dialogMode === "edit" && (
                            <Grid container spacing={1} >
                                <Grid size={{xs:12,md:3}} m={0}>
                                    <SAETextField
                                        label="ID"
                                        type="number"
                                        fullWidth
                                        value={dialogData.id}
                                        onChange={(e) => handleDialogChange("id", e.target.value)}
                                        disabled={true}
                                    />     
                                </Grid>
                                <Grid size={{xs:12,md:9}} m={0}>
                                    {console.log(dialogData)}
                                    <SAETextField
                                        label="Nombre Completo"
                                        value={dialogData.nombre_usuario}
                                        disabled={true}
                                        onChange={(e) => handleDialogChange("nombre_usuario", e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>)}
                        {dialogMode === "create" && (
                            <>
                            <Card sx={{ bgcolor: "rgba(235, 235, 41, 0.7)", border: "1px solid rgba(235, 41, 41, 0.1)" }}>
                                <CardContent sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" color="textPrimary" fontWeight={600} gutterBottom>
                                        ¡ATENCION! 
                                        </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Al crear el usuario desde esta pestaña estamos creandolo como estudiante (id_perfil = 1) por lo que tendra restringido la vista de SAE
                                        <br/><br/>
                                        El nombre de Usuario sera su primer nombre a menos que lo cambie desde la pantalla de perfil, el legajo debe estar en su version completa incluyendo el @utn.frc.edu.ar al final, y el nombre completo se formara con los campos de nombres y apellidos.
                                        <br/><br/>
                                        El nombre completo solo podra ser modificado por el usuario desde la aplicacion despues de creado.
                                    </Typography>
                                </CardContent>
                            </Card>
                                <SAETextField
                                label="Nombres"
                                value={dialogData.nombres}
                                onChange={(e) => handleDialogChange("nombres", e.target.value)}
                                fullWidth
                                />
                            <SAETextField
                                label="Apellidos"
                                value={dialogData.apellidos}
                                onChange={(e) => handleDialogChange("apellidos", e.target.value)}
                                fullWidth
                                />
                                <Autocomplete
                                disablePortal
                                options={carreras}
                                getOptionLabel={(option) => option.nombre}
                                onChange={(event, newValue) => {
                                    // 'newValue' es el objeto completo de la carrera seleccionada (o null)
                                    if (newValue) {
                                        handleDialogChange("id_carrera", newValue.id);
                                    } else {
                                        // Maneja el caso de que se borre la selección
                                        handleDialogChange("id_carrera", null);
                                    }
                                }}
                                // Asegura que la comparación se haga por id
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={carreras.find(carrera => carrera.id === dialogData.id_carrera)} // Pasa el objeto completo
                                renderInput={(params) => 
                                <TextField
                                    {...params}
                                    label="Carrera"
                                    inputProps={{
                                        ...params.inputProps,
                                        readOnly: true, // Esto evita la escritura
                                    }}
                                />
                            }
                            />
                        </>    
                        )}
                        <SAETextField
                            label="Legajo"
                            value={dialogData.legajo}
                            disabled={dialogMode=== "create"? false:true}
                            onChange={(e) => handleDialogChange("legajo", e.target.value)}
                            fullWidth
                        />
                        
                        {dialogMode === "edit" && (
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={dialogData.activo}
                                    onChange={(e) => handleDialogChange("activo", e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={dialogData.activo ? "Desactivar Usuario" : "Activar Usuario"}
                        />)}
                        
                    </>             
                        
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <SAEButton variant="outlined" onClick={() => setDialogOpen(false)} disabled={dialogSaving}>
                        Cancelar
                    </SAEButton>
                    <SAEButton
                        variant="contained"
                        onClick={handleUsuariosSave}
                        disabled={dialogSaving}
                        startIcon={dialogSaving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {dialogMode === "create" ? "Crear" :(dialogMode === "delete")? "Eliminar": "Guardar"}
                    </SAEButton>
                </DialogActions>                
            </Dialog>
        )}
        
            {/* MENSAJE DE EXITO */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Box>
    )
}