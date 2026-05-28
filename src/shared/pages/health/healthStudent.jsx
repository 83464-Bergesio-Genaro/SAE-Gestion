import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  InputLabel ,
  Select ,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../../../shared/auth/AuthContext";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAESpinner from "../../components/spinner/SAESpinner";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HealingIcon from '@mui/icons-material/Healing';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MedicationIcon from '@mui/icons-material/Medication';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ScienceIcon from '@mui/icons-material/Science';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

import { DataGrid } from "@mui/x-data-grid";
import { HealthUsersProvider, useHealthUser } from './HealthContext'; 

const PALETTE = [
    "#8A8A8A",//Pendiente
    "#576DDC",//Asignado
    "#E77575",//Cancelado
    "#B8CDFF",//En curso
    "#99F6B9",//Finalizado
    "#F1C6A3",//Reprogramado
];

const COURSE_PALLETE = [
    "#C8C1DF",//Pendiente
    "#BFEBA2",//Asignado
    "#AB95EE",//Cancelado
    "#AC829F",//En curso
    "#F6F399",//Finalizado
    "#B3A4A4",//Reprogramado
];

const MEDICINE_ICONS = [
  LocalHospitalIcon,    // Cruz de hospital / medicina general
  MedicalServicesIcon,   // Maletín médico
  HealingIcon,           // Curita / traumatología / kinesiología
  VaccinesIcon,          // Jeringa / vacunas / pediatría
  MonitorHeartIcon,      // Electrocardiograma / cardiología
  MedicationIcon,        // Cápsula / farmacia / clínica médica
  PsychologyIcon,        // Cerebro / psicología / psiquiatría
  ScienceIcon,           // Tubo de ensayo / laboratorio / análisis
  ContentPasteSearchIcon,// Historial clínico / estudios / recetas
  BloodtypeIcon          // Gota de sangre / hematología / extracciones
];

const agruparPorEspecialidad = (horariosMapeados) => {
  const agrupado = horariosMapeados.reduce((acumulador, horario) => {
    const idEsp = horario.id_especialidad;

    // Si es la primera vez que vemos esta especialidad, creamos la estructura base
    if (!acumulador[idEsp]) {
      acumulador[idEsp] = {
        id_especialidad: idEsp,
        nombre_especialidad: horario.nombre_especialidad,
        descripcion_especialidad: horario.descripcion_especialidad,
        especialista: horario.especialista,
        // Creamos un array para guardar todos los días y horas de esta especialidad
        diasYHorarios: []
      };
    }

    // Guardamos el día y las horas en la lista de esta especialidad
    acumulador[idEsp].diasYHorarios.push({
      dia: horario.dia,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin
    });

    return acumulador;
  }, {});

  return Object.values(agrupado);
}

export function EmployedStudentContent(){
  
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        allHorarios,loadingHorarios,DAYS,

        cursos,loadingCursos,

        fetchTurnosEstudiante,estudianteTurnos,loadingTurnos,
        turnsRows,turnsColumns,
        openCreateTurnos,openShowTurnos,openDeleteTurnos,handleTurnosSave,
        snackbarOpen, setSnackbarOpen,snackbarMsg,setDialogError,
        dialogOpen, setDialogOpen, dialogData, setDialogData, dialogType, dialogMode, dialogError, dialogSaving,

    } = useHealthUser();

    useEffect(() => {
        fetchTurnosEstudiante(user.email);
    }, [fetchTurnosEstudiante,user]);

    const handleDialogChange = (field, value) => {
        setDialogData((prev) => ({ ...prev, [field]: value }));
    };   
    
    /*const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });*/
    const horariosAgrupados = agruparPorEspecialidad(allHorarios);
    
    return (
    <Box
      sx={{
        mt: "-90px",
        pt: "90px",
        pb: 4,
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
            mb: 4,
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            backgroundImage:
              "linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%), url('/images/carrousel/EntradaUTN.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "white",
          }}
        >
          <Box sx={{ maxWidth: 700 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 0.5 }}
            >
              <IconButton
                size="small"
                onClick={() => navigate("/Inicio")}
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": {
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 1.8, opacity: 0.85, fontWeight: 700 }}
              >
                Módulo Salud
              </Typography>
            </Stack>
            <Typography
              variant="h3"
              sx={{
                mt: 1,
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: "2rem", md: "2.6rem" },
              }}
            >
              Horarios y Turnos medicos
            </Typography>
            <Typography
              sx={{
                mt: 2,
                maxWidth: 520,
                fontSize: { xs: 15, md: 17 },
                opacity: 0.92,
              }}
            >
              Informate de los horarios de nuestros especialistas y consulta por un turno desde la aplicacion.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 3 }}
            >
              <Chip
                label={`Perfil ${user?.id_perfil ?? "-"}`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  fontWeight: 700,
                }}
              />
              <Chip
                label={user?.legajo ? `Legajo ${user.legajo}` : "Sesión activa"}
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  fontWeight: 700,
                }}
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
        <Box  mt={2} mb={-2} >
          <Typography variant="h3" fontWeight="bold" 
          sx={{pt:{xs:0,md:2},fontSize:{xs:"2em",md:"3em"},textAlign:{xs:"center",md:"left"} }}>
            Servicios para Alumnos:
          </Typography>
          <Divider sx={{width:{xs:0,md:"100%"}, mt:-1, borderBottom: "3px solid black" }} />        
        </Box>        
        {/*Tarjeta de Medicos */}
        <Card sx={{
          background:{xs:"none",md:"linear-gradient(140deg, #2A548B  6.71% ,#A8C2DB 91.97%)"},
          borderRadius: 4,
          boxShadow: {xs:"none",md:"0 18px 45px rgba(21, 61, 113, 0.08)"},
          overflow: "hidden", 
          mt: {xs:1, md:3},
          border: {xs:"none",md:"2px solid lightGray"},        // Hide the scrollbar
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        // Optional: Adds native-feeling swipe snapping
        scrollSnapType: 'x mandatory',
        '& > *': {
          scrollSnapAlign: 'center',
          flexShrink: 0,
        },}}>


            <Stack direction={{xs:"column",md:"row"}} alignItems="center" spacing={1.5} p={5}>
            {loadingHorarios && (
              <Stack alignItems="center" width={"100%"} gap={1}>
                <SAESpinner size="S" />
              </Stack>
            )}
            {!loadingHorarios && (
              <>
                {horariosAgrupados.map((especialidad, index) => {
                  const IconoDinamico = MEDICINE_ICONS[index % MEDICINE_ICONS.length];
                  return(
                  <Card 
                      key={especialidad.id_especialidad} // Usamos el ID de la especialidad como key
                      variant="outlined"
                      sx={{ 
                        minWidth: 200, 
                        maxWidth: 300,
                        my: 2,
                        borderRadius: 2,
                        p:1.1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        transition:"background-color 0.3s ease, width 0.3s ease"
                      }}
                    >
                      
                        <CardContent >
                          {/* Cabecera: Nombre Especialidad */}
                          <Stack direction="row" justifyContent="flex" alignItems="start" spacing={2}>
                            <IconoDinamico sx={{ fontSize: 34 }}/>
                            <Typography variant="h6" fontWeight="bold" noWrap >
                              {especialidad.nombre_especialidad}
                            </Typography>
                          </Stack>

                          <Divider sx={{ my: 1 }} />

                          <Stack spacing={1.5} mt={2}>
                            <Typography variant="body1" >
                              {especialidad.descripcion_especialidad || "Sin descripción"}
                            </Typography>

                            <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

                            {/* LISTADO DE DÍAS Y HORARIOS AGRUPADOS */}
                            <Typography variant="body2" fontWeight="bold" color="text.secondary">
                              Horarios de Atención:
                            </Typography>

                            {especialidad.diasYHorarios.map((item, index) => {
                              // Buscamos el nombre del día para cada horario de la lista
                              const diaEncontrado = DAYS.find(d => d.value === item.dia);
                              const nombreDia = diaEncontrado ? diaEncontrado.label : "Día no asignado";

                              return (
                                <Stack key={index} direction="row" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
                                  <AccessTimeIcon fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    <strong>{nombreDia}:</strong> {item.hora_inicio} a {item.hora_fin}
                                  </Typography>
                                </Stack>
                              );
                            })}
                            <Typography variant="body2" sx={{ pt: 2 }}>
                              <strong>{"Profesional: "}</strong>{especialidad.especialista}
                            </Typography>
                            <SAEButton
                                variant="contained"
                                onClick={()=>openCreateTurnos(user.email,especialidad.id_especialidad,especialidad.diasYHorarios)}
                                sx={{
                                    whiteSpace: "nowrap",
                                    color: "white",
                                    border: "1px solid rgba(255,255,255,0.4)"
                                }}
                            >
                                Pedir Turno
                            </SAEButton>
                          </Stack>
                        </CardContent>
                      
                    </Card>)
                })}
              </>
            )}
            
            </Stack>
        </Card>
        <Box  mt={2} mb={-2} >
          <Typography variant="h3" fontWeight="bold" 
          sx={{pt:{xs:0,md:2},fontSize:{xs:"2em",md:"3em"},textAlign:{xs:"center",md:"left"} }}>
            Turnos Activos
          </Typography>
          <Divider sx={{width:{xs:0,md:"100%"}, mt:-1, borderBottom: "3px solid black" }} />        
        </Box>
               
        <Card sx={{
          background:{xs:"none",md:"linear-gradient(140deg,#A8C2DB 6.71%, #2A548B 91.97% )"},
          borderRadius: 4,
          boxShadow: {xs:"none",md:"0 18px 45px rgba(21, 61, 113, 0.08)"},
          overflow: "hidden", 
          mt: {xs:1, md:3},
          border: {xs:"none",md:"2px solid lightGray"} }}>
          {loadingTurnos && (
            <Grid width={"100%"} container alignItems="center" justifyContent="center">
                <SAESpinner></SAESpinner>
            </Grid>

          )}
          {!loadingTurnos && estudianteTurnos.length === 0 && (
              <Typography variant="h3" fontWeight="bold" 
              sx={{pt:{xs:2,md:4},fontSize:{xs:"1.5em",md:"2.5em"},textAlign:{xs:"center"} }}>
                No hay turnos activos
              </Typography>
          ) }
          <Stack direction={{xs:"column",md:"row"}} alignItems="center" width={"100%"} spacing={1.5} p={2}>
            {!loadingTurnos && estudianteTurnos.length > 0 &&  (
            //ESTAS SON LAS TARJETAS QUE VES ADENTRO DEL COMPONENTE
            estudianteTurnos.map((turno) => (
              <Card
                key={turno.id} 
                variant="outlined"
                sx={{ 
                    minWidth: 400, 
                    maxWidth: 400,
                    color:"black",
                    my: 2,
                    borderRadius: 2,
                    p:1.1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition:"background-color 0.3s ease, width 0.3s ease"
                  }}

              >
                <CardContent sx={{ '&:last-child': { paddingBottom: 2 } }}>
                  {/* Cabecera: Nombre y Estado */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                      <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: '140px' }}>
                        {turno.fecha_solicitud || "Fecha Solicitud"}
                      </Typography>
                      <Chip 
                        label={turno.estado || "Sin Definir"} 
                        size="small" 
                        sx={{ bgcolor: PALETTE[turno.id_estado_turno],color:'white',fontSize: '0.75rem', fontWeight: 600  }} 
                      />

                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    {/* Datos Mínimos: Fecha y Hora */}
                  <Stack spacing={1} mt={1.5}>
                    <Typography variant="body2"  >
                      <strong>{"Solicitante: "}</strong><br/>{turno.paciente || "Error recuperando el nombre"}
                    </Typography>
                    <Typography variant="body2" noWrap >
                      <strong>{"Asunto: "}</strong><br/>{turno.asunto || "Turno sin Asunto"}
                    </Typography>
                    <Typography variant="body2" >
                    <strong>{"Atiende: "}</strong><br/>{turno.especialista || "Sin medico asignado"}
                    </Typography>                  
                    <Stack direction="row" alignItems="center" gap={1}>
                      <CalendarMonthIcon fontSize="medium"/>
                      <Typography variant="body2" >
                        {turno.fecha_atencion || "Sin Fecha Asignada"}
                      </Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" gap={1}>
                      <AccessTimeIcon fontSize="medium"  />
                      <Typography variant="body2" >
                        {turno.hora_atencion || "Sin Horario Asignado"}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack spacing={2} mt={1.5} p={2}>
                    <SAEButton
                        variant="contained"
                        onClick={()=>openShowTurnos(turno)}
                        sx={{
                            whiteSpace: "nowrap",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.4)"
                        }}
                    >
                        Ver datos turno
                    </SAEButton>               
                    <SAEButton
                        variant="contained"
                        color="error"
                        onClick={()=>openDeleteTurnos(turno)}
                        sx={{
                            whiteSpace: "nowrap",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.4)"
                        }}
                    >
                        Eliminar Turno
                    </SAEButton>     
                  </Stack>              
                </CardContent>
                  
            </Card>
            ))
          )}
          </Stack>
        </Card>

        <Box  mt={2} mb={-2} >
          <Typography variant="h3" fontWeight="bold" 
          sx={{pt:{xs:0,md:2},fontSize:{xs:"1em",md:"2em"},textAlign:{xs:"center",md:"left"} }}>
            Cursos ofrecidos por la secretaria:
          </Typography>
          <Divider sx={{width:{xs:0,md:"100%"}, mt:-1, borderBottom: "3px solid black" }} />        
        </Box>

        <Card sx={{
          background:{xs:"none",md:"linear-gradient(140deg,#A8C2DB 6.71%, #2A548B 91.97% )"},
          borderRadius: 4,
          boxShadow: {xs:"none",md:"0 18px 45px rgba(21, 61, 113, 0.08)"},
          overflow: "hidden", 
          mt: {xs:1, md:3},
          border: {xs:"none",md:"2px solid lightGray"} }}>
            {loadingCursos && (
              <Stack alignItems="center" width={"100%"} gap={1}>
                <SAESpinner size="S" />
              </Stack>
              ) }
            {!loadingCursos && cursos.length === 0 && (
                  <Typography variant="h3" fontWeight="bold" 
                  sx={{pt:{xs:2,md:4},fontSize:{xs:"0.5em",md:"1.5em"},textAlign:{xs:"center"} }}>
                    No hay cursos actualmente activos
                  </Typography>
              ) }
            {!loadingCursos && cursos.length > 0 && (
              <Stack direction={{xs:"column",md:"row"}} alignItems="center" width={"100%"} spacing={1.5} p={2}>
                  {!loadingTurnos && cursos.length > 0 &&  (
                  //ESTAS SON LAS TARJETAS QUE VES ADENTRO DEL COMPONENTE
                  cursos.map((curso,i) => (
                    <Card
                      key={curso.id} 
                      variant="outlined"
                      sx={{ 
                         bgcolor:COURSE_PALLETE[i],
                          minWidth: 400, 
                          maxWidth: 400,
                          color:"black",
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>

                      <CardContent sx={{ '&:last-child': { paddingBottom: 2 } }}>
                        {/* Cabecera: Nombre y Estado */}
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="subtitle1" fontWeight="bold" noWrap >
                              {curso.fecha_inicio || "01-01-2026"} al {curso.fecha_fin || "01-01-2026"}
                            </Typography>

                          </Stack>

                          <Divider sx={{ my: 1 }} />

                          {/* Datos Mínimos: Fecha y Hora */}
                        <Stack spacing={1}>
                          <Typography variant="body2"  >
                            <strong>{"Curso: "}</strong><br/>{curso.nombre_curso || "Error recuperando el nombre"}
                          </Typography>
                          <Typography variant="body2" noWrap >
                            <strong>{"Docente: "}</strong><br/>{curso.nombre_docente || "Turno sin Asunto"}
                          </Typography>
                          <Typography variant="body2" >
                          <strong>{"Cupo: "}</strong><br/>{curso.cupo_maximo || "Sin medico asignado"}
                          </Typography>                  
                        </Stack>        
                      </CardContent>
                        
                  </Card>
                  ))
                )}
                </Stack>
              ) }
        </Card>

        <Box  mt={2} mb={-2} >
          <Typography variant="h3" fontWeight="bold" 
          sx={{pt:{xs:0,md:2},fontSize:{xs:"2em",md:"3em"},textAlign:{xs:"center",md:"left"} }}>
            Historico de Turnos:
          </Typography>
          <Divider sx={{width:{xs:0,md:"100%"}, mt:-1, borderBottom: "3px solid black" }} />        
        </Box>         
        <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)", my: 3, overflow: "hidden" }}>
          <CardContent sx={{ p: 0 }}>
              <Box sx={{ width: "100%"}}>
                  <DataGrid
                      rows={turnsRows}
                      columns={turnsColumns}
                      loading={loadingTurnos}
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
         {dialogOpen && dialogType === "turnos" && (
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="x1" fullWidth>
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
                        { dialogMode === "cancelados" ? "Turnos Cancelados" : "Turnos Finalizados"}
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
                      <Grid container spacing={1} >
                        {dialogMode === "create" && (
                         <Grid container size={{xs:12}} m={0} spacing={2}>
                          <Grid size={{xs:12}} m={0}>
                              <Card sx={{ bgcolor: "rgba(235, 235, 41, 0.7)", border: "1px solid rgba(235, 41, 41, 0.1)" }}>
                                  <CardContent sx={{ p: 2 }}>
                                      <Typography variant="subtitle2" color="textPrimary" fontWeight={600} gutterBottom>
                                          ¡ATENCION! 
                                      </Typography>
                                      <Typography variant="body2" color="textSecondary">
                                          Una vez generado el turno no podra ser modificado. En caso de equivocacion debera eliminarlo y despues volverlo a crear
                                      </Typography>
                                  </CardContent>
                              </Card>
                            </Grid>
                            <Grid size={{xs:12}} m={0}>
                              <InputLabel>Sus datos</InputLabel>
                            </Grid>
                            
                            <Grid size={{xs:12}} m={0}>
                                <SAETextField
                                    label="Tu legajo:"
                                    fullWidth
                                    value={dialogData.legajo}
                                    onChange={(e) => handleDialogChange("legajo", e.target.value)}
                                    disabled={true}
                                />     
                            </Grid>
                            <Grid size={{xs:12}} m={0}>
                              <SAETextField
                                  label="Fecha de Solicitud"
                                  type="date"
                                  value={dialogData.fecha_solicitud}
                                  onChange={(e) => handleDialogChange("fecha_solicitud", e.target.value)}
                                  fullWidth
                                  disabled={true}
                                  slotProps={{ inputLabel: { shrink: true } }}
                              />
                            </Grid>
                            <Grid size={{xs:12}} m={0}>
                              <InputLabel >Disponibilidad</InputLabel>
                            </Grid>
                            <Grid size={{xs:12,md:6}} m={0}>
                                
                                <Select
                                    value={dialogData.dia_selecionado}
                                    label="Dia"
                                    fullWidth   
                                    onChange={(e) => handleDialogChange("dia_selecionado", e.target.value)}
                                >
                                    {DAYS.map((d) => (
                                        <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
                                    ))}
                                </Select> 
                            </Grid>
                            <Grid size={{xs:12,md:6}} m={0}>
                                <SAETextField
                                    label="Hora Aproximada"
                                    type="time"
                                    fullWidth
                                    value={dialogData.horario_disponible}
                                    onChange={(e) => handleDialogChange("horario_disponible", e.target.value)}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                                  <Chip
                                      label={"Revisar los horarios de inicio y fin del especialista"}
                                      sx={{
                                        bgcolor: "rgba(255,255,255,0.18)",
                                        color: "white",
                                        fontWeight: 700,
                                      }}
                                    />
                            </Grid>
                            <Grid size={{xs:12}} m={0}>
                              <InputLabel>Asunto</InputLabel>
                            </Grid>
                            
                            <Grid size={{xs:12}} mt={-1}>
                                <SAETextField
                                    label="Explique su dolencia"
                                    value={dialogData.asunto}
                                    onChange={(e) => handleDialogChange("asunto", e.target.value)}
                                    multiline
                                    fullWidth
                                    rows={4} // Número inicial de filas
                                />
                            </Grid>
                        </Grid>
                        )}
                        {dialogMode === "delete" && (
                          <>
                            <Grid size={{xs:12}} m={0}>
                               <Card sx={{ bgcolor: "rgba(193, 73, 55, 0.7)", border: "1px solid rgba(235, 41, 41, 0.1)" }}>
                                  <CardContent sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" color="textPrimary" fontWeight={600} gutterBottom>
                                        ¡ATENCION! 
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Esta por cancelar el turno, toda la informacion que se haya utilizado en este turno se perdera como tambien la disponibilidad.
                                    </Typography>
                                  </CardContent>
                              </Card>  
                            </Grid>
                                                      
                          </>
                        )}
                        {dialogMode === "show" && (
                          <>
                            <Grid size={{xs:12,md:3}} m={0}>
                                <SAETextField
                                    label="ID Turno"
                                    type="number"
                                    fullWidth
                                    value={dialogData.id}
                                    onChange={(e) => handleDialogChange("id", e.target.value)}
                                    disabled={true}
                                />     
                            </Grid>
                            <Grid size={{xs:12,md:9}} m={0}>
                                <SAETextField
                                    label="Legajo Estudiante"
                                    value={dialogData.legajo}
                                    onChange={(e) => handleDialogChange("legajo", e.target.value)}
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                            <Grid size={{xs:12}} m={0}>
                                <SAETextField
                                    label="Paciente"
                                    value={dialogData.paciente}
                                    onChange={(e) => handleDialogChange("paciente", e.target.value)}
                                    fullWidth
                                    disabled={true}
                                />
                            </Grid>
                            <Grid size={{xs:12,md:6}}>
                              <SAETextField
                                  label="Fecha de Atencion"
                                  type="date"
                                  value={dialogData.fecha_atencion}
                                  onChange={(e) => handleDialogChange("fecha_atencion", e.target.value)}
                                  fullWidth
                                  disabled={true}
                              />
                            </Grid>
                            <Grid size={{xs:12,md:6}}>
                              <SAETextField
                                  label="Horario de Atencion"
                                  type="time"
                                  value={dialogData?.hora_atencion?.split?.("hs")?.[0] || ""}
                                  onChange={(e) => handleDialogChange("hora_atencion", e.target.value)}
                                  slotProps={{ inputLabel: { shrink: true } }}
                                  fullWidth
                                  disabled={true}
                              />
                            </Grid>
                            <Grid size={{xs:12}}>
                                <SAETextField
                                    label="Asunto"
                                    value={dialogData.asunto}
                                    onChange={(e) => handleDialogChange("asunto", e.target.value)}
                                    multiline
                                    fullWidth
                                    rows={4} // Número inicial de filas
                                    disabled={true}  
                                />
                                                              
                            </Grid>                            
                          </>
                        )}                        
                      </Grid>
                    </>               
                </Stack>
                </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <SAEButton variant="outlined" onClick={() => setDialogOpen(false)} disabled={dialogSaving}>
                            {dialogMode === "show" ? "Cerrar" :"Cancelar"}
                        </SAEButton>
                        {dialogMode !== "show" && (
                          <SAEButton
                          
                              variant="contained"
                              onClick={handleTurnosSave}
                              disabled={dialogSaving}
                              startIcon={dialogSaving ? <CircularProgress size={16} color="inherit" /> : null}
                          >
                              {dialogMode === "create" ? "Crear" :(dialogMode === "delete")? "Eliminar": "Cerrar"}
                          </SAEButton>
                        )}

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

      </Container>
    </Box>
  );
}
// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function StudentHealth() {
    return (
        <HealthUsersProvider>
            <EmployedStudentContent />
        </HealthUsersProvider>
    );
}