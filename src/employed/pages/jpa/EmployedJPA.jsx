import { useMemo, useState  } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Grid,
    Container,
    Stack,
    Typography,
    Card,
    CardContent,
    Chip,
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
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AddIcon from "@mui/icons-material/Add";
import CastleIcon from '@mui/icons-material/Castle';
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import StorefrontIcon from '@mui/icons-material/Storefront';
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";

import { useAuth } from "../../../shared/context/sharedContext"; 
import { DataGrid } from "@mui/x-data-grid";
import { JPAProvider } from "../../context/providers/jpaProvider";
import { useJPA } from "../../context/employedContext";
function CopyURLButton() {
  const ubicacionesComunes = [
    {
      name: "Auditorio",
      url: "https://www.google.com/maps/place/Auditorio+-+Aula+Magna+UTN/@-31.4423209,-64.1959201,17z/data=!3m1!4b1!4m6!3m5!1s0x9432a370c72ed37b:0x3d4a8a878329ff54!8m2!3d-31.4423209!4d-64.1933452!16s%2Fg%2F11j47q3881!5m1!1e4?entry=ttu&g_ep=EgoyMDI2MDMyMi4wIKXMDSoASAFQAw%3D%3D"
    },
    {
      name: "Aula Magna",
      url: "https://maps.app.goo.gl/DtMW4vCpgXkKTs2o7"
    }
  ];
  const handleCopy = async (url, name) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Ups! Ocurrió que: ', err);
    }
  };

  const [copiedId, setCopied] = useState(null);
    return (
     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
       {ubicacionesComunes.map((lugar) => (
         <SAEButton
           key={lugar.name}
           onClick={() => handleCopy(lugar.url, lugar.name)}
           sx={{ 
             padding: '4px 8px',     // Reduce el padding
             fontSize: '0.8rem',     // Letra más pequeña
             fontWeight: 'bold'      // Negrita
         }}
         >
           {copiedId === lugar.name ? 'Copiado!' : `${lugar.name}: Copiar link`}
         </SAEButton>
       ))}
     </div>
   );
 }
  const secciones=[
    {   key: "eventosPublicos", 
        label: "Eventos Publicos"
    },

    {   key: "eventosInternos", 
        label: "Eventos SAE"
    },
    {   key: "stands", 
        label: "Puestos"
    },
    {   key: "interesados", 
        label: "Interesados"
    }
    ]; 
function EmployedJPAContent() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const {
        snackbarOpen,snackbarMsg,
        
        eventosPublicosRows,loadingEventosPublicos,
        openCreateEventoPublico ,handleEventoPublicoSave,
        
        eventosSAERows,eventoColumns,loadingEventosSAE,
        openCreateEventoSAE,handleEventoSAESave,

        standsRows,standsColumns,loadingStands,   
        openCreateStands,handleStandSave,

        interesadosRows,interesadosColumns,loadingInteresados,
        openCreateInteresados,handleInteresadoSave,

        dialogOpen,dialogType,dialogMode,dialogData,dialogSaving,dialogError,
        setDialogData,setDialogOpen,setDialogError,setSnackbarOpen } = useJPA();

        const sectionConfig = useMemo(
            () => ({
                eventosPublicos:{
                    title:"Eventos Generales",
                    dialog:openCreateEventoPublico,
                    addButton:"Nuevo Evento Publico",
                    icon: SchoolIcon,
                    rows: eventosPublicosRows,
                    columns:eventoColumns,
                    loading: loadingEventosPublicos
                },
                eventosInternos:{
                    title:"Eventos Internos",
                    dialog:openCreateEventoSAE,
                    addButton:"Nuevo Evento SAE",
                    icon: CastleIcon,
                    rows: eventosSAERows,
                    columns: eventoColumns,
                    loading: loadingEventosSAE
                },
                stands:{
                    title:"Puestos",
                    dialog:openCreateStands,
                    addButton:"Nuevo Puesto",
                    icon: StorefrontIcon,
                    rows: standsRows,
                    columns: standsColumns,
                    loading: loadingStands
                },
                interesados:{
                    title:"Interesados",
                    dialog:openCreateInteresados,
                    addButton:"Nuevo Interesado",
                    icon: GroupsIcon,
                    rows: interesadosRows,
                    columns: interesadosColumns,
                    loading: loadingInteresados
                }
            }),
            [
                eventosPublicosRows, loadingEventosPublicos,eventoColumns,openCreateEventoPublico,
                eventosSAERows,loadingEventosSAE,openCreateEventoSAE,
                standsRows,loadingStands,standsColumns,openCreateStands,
                interesadosRows,loadingInteresados,interesadosColumns,openCreateInteresados
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
                        }}
                    >
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
                                Módulo JPA
                            </Typography>
                        </Stack>
                        <Typography
                            variant="h3"
                            sx={{ mt: 1, fontWeight: 800, lineHeight: 1.1, fontSize: { xs: "2rem", md: "2.6rem" } }}
                        >
                            Gestión de la Jornada de Puertas Abiertas
                        </Typography>
                        <Typography sx={{ mt: 2, maxWidth: 520, fontSize: { xs: 15, md: 17 }, opacity: 0.92 }}>
                            Se puede administrar y gestionar todos los recursos que hacen a la JPA.
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
                                localeText={{ noRowsLabel: "No hay torneos activos" }}
                                sx={{ borderRadius: 0, border: "none" }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Container>
            {/*Esto abre un dialog para cargar, modificar o eliminar los datos del tipo seleccionado. Yo lo separo asi porque es mas comodo visualmente */}
           {dialogOpen && dialogType === "eventoPublico" && (
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                        { dialogMode === "create" ? "Nuevo Evento" : "Editar Evento"}
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
                            {dialogMode === "delete" ? (
                            <>
                            <Typography variant="h6" component="span">
                                Esta seguro que quiere eliminar el evento:
                            </Typography>   
                            <Typography variant="h7" component="span">
                                ID:{dialogData.id}  <br/>
                                Nombre: "{dialogData.nombre_evento}"      
                            </Typography>         
                  
                            </>
                        ) :(
                            <>
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
                                <SAETextField
                                    label="Encargado"
                                    value={dialogData.encargado}
                                    onChange={(e) => handleDialogChange("encargado", e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <SAETextField
                            label="Nombre del Evento"
                            value={dialogData.nombre_evento}
                            onChange={(e) => handleDialogChange("nombre_evento", e.target.value)}
                            fullWidth
                        />
                        <SAETextField
                            label="URL Maps"
                            value={dialogData.lugar}
                            onChange={(e) => handleDialogChange("lugar", e.target.value)}
                            fullWidth
                        />
                        {/* Es la grilla de url que se usan comunmente en nuestra facultad */}
                        <CopyURLButton/>

                        <SAETextField
                            label="Fecha del Evento"
                            type="date"
                            value={dialogData.fecha_evento}
                            onChange={(e) => handleDialogChange("fecha_evento", e.target.value)}
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <Grid container spacing={1} >
                            <Grid size={{xs:12,md:6}}>
                                <SAETextField
                                    label="Hora inicio"
                                    type="time"
                                    size="small"
                                    value={dialogData?.horario_inicio?.split?.("hs")?.[0] || ""}
                                    onChange={(e) => handleDialogChange("horario_inicio", e.target.value)}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{xs:12,md:6}}>
                            <SAETextField
                                    label="Hora Fin"
                                    type="time"
                                    size="small"
                                    value={dialogData?.horario_fin?.split?.("hs")?.[0] || ""}
                                    onChange={(e) => handleDialogChange("horario_fin", e.target.value)}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </>             
                    )}    
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <SAEButton variant="outlined" onClick={() => setDialogOpen(false)} disabled={dialogSaving}>
                        Cancelar
                    </SAEButton>
                    <SAEButton
                        variant="contained"
                        onClick={handleEventoPublicoSave}
                        disabled={dialogSaving}
                        startIcon={dialogSaving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {dialogMode === "create" ? "Crear" :(dialogMode === "delete")? "Eliminar": "Guardar"}
                    </SAEButton>
                </DialogActions>                
            </Dialog>
            )}
            {/*Yo hago por separado para que quede mas ordenado se puede cambiar a futuro 
                SECCION EVENTO SAE
            */}
            {dialogOpen && dialogType === "eventosInternos" && (
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                            { dialogMode === "create" ? "Nuevo Evento" : "Editar Evento"}
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
                            {dialogMode === "delete" ? (
                            <>
                            <Typography variant="h6" component="span">
                                Esta seguro que quiere eliminar el evento:
                            </Typography>   
                            <Typography variant="h7" component="span">
                                ID:{dialogData.id}  <br/>
                                Nombre: "{dialogData.nombre_evento}"      
                            </Typography>         
                  
                            </>
                        ):(
                            <>
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
                                <SAETextField
                                    label="Encargado"
                                    value={dialogData.encargado}
                                    onChange={(e) => handleDialogChange("encargado", e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <SAETextField
                            label="Nombre del Evento"
                            value={dialogData.nombre_evento}
                            onChange={(e) => handleDialogChange("nombre_evento", e.target.value)}
                            fullWidth
                        />
                        <SAETextField
                            label="URL Maps"
                            value={dialogData.lugar}
                            onChange={(e) => handleDialogChange("lugar", e.target.value)}
                            fullWidth
                        />
                        {/* Es la grilla de url que se usan comunmente en nuestra facultad */}
                        <CopyURLButton/>

                        <SAETextField
                            label="Fecha del Evento"
                            type="date"
                            value={dialogData.fecha_evento}
                            onChange={(e) => handleDialogChange("fecha_evento", e.target.value)}
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <Grid container spacing={1} >
                            <Grid size={{xs:12,md:6}}>
                                <SAETextField
                                    label="Hora inicio"
                                    type="time"
                                    size="small"
                                    value={dialogData?.horario_inicio?.split?.("hs")?.[0] || ""}
                                    onChange={(e) => handleDialogChange("horario_inicio", e.target.value)}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{xs:12,md:6}}>
                            <SAETextField
                                    label="Hora Fin"
                                    type="time"
                                    size="small"
                                    value={dialogData?.horario_fin?.split?.("hs")?.[0] || ""}
                                    onChange={(e) => handleDialogChange("horario_fin", e.target.value)}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </>             
                    )}    
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <SAEButton variant="outlined" onClick={() => setDialogOpen(false)} disabled={dialogSaving}>
                        Cancelar
                    </SAEButton>
                    <SAEButton
                        variant="contained"
                        onClick={handleEventoSAESave}
                        disabled={dialogSaving}
                        startIcon={dialogSaving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {dialogMode === "create" ? "Crear" :(dialogMode === "delete")? "Eliminar": "Guardar"}
                    </SAEButton>
                </DialogActions>                
            </Dialog>
            )}
            {/*       SECCION STANDS        */}
            {dialogOpen && dialogType === "stands" && (
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                            { dialogMode === "create" ? "Nuevo Puesto" : "Editar Puesto"}
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
                            {dialogMode === "delete" ? (
                            <>
                            <Typography variant="h6" component="span">
                                Esta seguro que quiere eliminar el Puesto:
                            </Typography>   
                            <Typography variant="h7" component="span">
                                ID:{dialogData.id}  <br/>
                                Nombre: "{dialogData.nombre_stand}"      
                            </Typography>         
                  
                            </>
                        ):(
                            <>
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
                                <SAETextField
                                    label="Expositor"
                                    value={dialogData.expositor}
                                    onChange={(e) => handleDialogChange("expositor", e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <SAETextField
                            label="Nombre del Stand"
                            value={dialogData.nombre_stand}
                            onChange={(e) => handleDialogChange("nombre_stand", e.target.value)}
                            fullWidth
                        />
                        <SAETextField
                            label="Lugar en la Facultad"
                            value={dialogData.ubicacion}
                            onChange={(e) => handleDialogChange("ubicacion", e.target.value)}
                            fullWidth
                        />
                        <Grid container spacing={1} >
                            <Grid size={{xs:12,md:6}}>
                                <SAETextField
                                    label="Hora inicio"
                                    type="time"
                                    size="small"
                                    value={dialogData?.horario_inicio?.split?.("hs")?.[0] || ""}
                                    onChange={(e) => handleDialogChange("horario_inicio", e.target.value)}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{xs:12,md:6}}>
                            <SAETextField
                                    label="Hora Fin"
                                    type="time"
                                    size="small"
                                    value={dialogData?.horario_fin?.split?.("hs")?.[0] || ""}
                                    onChange={(e) => handleDialogChange("horario_fin", e.target.value)}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </>             
                    )}    
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <SAEButton variant="outlined" onClick={() => setDialogOpen(false)} disabled={dialogSaving}>
                        Cancelar
                    </SAEButton>
                    <SAEButton
                        variant="contained"
                        onClick={handleStandSave}
                        disabled={dialogSaving}
                        startIcon={dialogSaving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {dialogMode === "create" ? "Crear" :(dialogMode === "delete")? "Eliminar": "Guardar"}
                    </SAEButton>
                </DialogActions>                
            </Dialog>
            )}
            {/*      SECCION INTERESADOS    */}            
            {dialogOpen && dialogType === "interesados" && (
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                        { dialogMode === "create" ? "Nuevo Interesado" : "Editar Interesado"}
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
                            {dialogMode === "delete" ? (
                            <>
                            <Typography variant="h6" component="span">
                                Esta seguro que quiere eliminar el Interesado:
                            </Typography>   
                            <Typography variant="h7" component="span">
                                ID:{dialogData.id}  <br/>
                                Nombre: "{dialogData.nombre_interesado}"
                            </Typography>         
                  
                            </>
                        ):(
                            <>
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
                                <SAETextField
                                    label="Nombre del Interesado"
                                    value={dialogData.nombre_interesado}
                                    onChange={(e) => handleDialogChange("nombre_interesado", e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <SAETextField
                            label="Contacto Telefonico"
                            value={dialogData.contacto}
                            onChange={(e) => handleDialogChange("contacto", e.target.value)}
                            fullWidth
                        />
                        <SAETextField
                            label="Contacto Electronico"
                            value={dialogData.email}
                            onChange={(e) => handleDialogChange("email", e.target.value)}
                            fullWidth
                        />
                    </>             
                    )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <SAEButton variant="outlined" onClick={() => setDialogOpen(false)} disabled={dialogSaving}>
                        Cancelar
                    </SAEButton>
                    <SAEButton
                        variant="contained"
                        onClick={handleInteresadoSave}
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
    );
}

export default function EmployedJPA() {
    return (
        <JPAProvider>
            <EmployedJPAContent />
        </JPAProvider>
    );
}