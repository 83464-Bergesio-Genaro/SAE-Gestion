import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Box, IconButton, Chip } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from '@mui/icons-material/EditNote';

import {CrearCurso, CrearEspecialidad, CrearPersonal, ModificarCurso as ModificarCurso, ModificaEspecialidad, ModificarPersonal, ObtenerCursosMedicos, ObtenerEspecialidades ,ObtenerEstadosTurno, ObtenerPersonalMedico, EliminarCursoMedico, ObtenerHorariosCompleto, ObtenerHorariosXCUIL, CrearHorario, ModificarHorario, EliminarHorario, ObtenerTurnos, RegistrarFalta, ObtenerFaltasXCUIL, CrearTurnos, ModificarTurno, ObtenerTurnosActivos, ObtenerTurnosFinalizados, ObtenerTurnosCancelados, ObtenerTurnosEstudiante} from "../../../api/SaludService";
import { mapCursoMedico, mapHorarioSalud, mapPersonalMedico, mapEstado, mapTurnos} from '../../../api/formatters/SaludFormatters';
import { Try } from '@mui/icons-material';
import { ObtenerUsuariosXLegajo } from '../../../api/EmpleadoService';


const HealthUserContext = createContext();

    const EMPTY_TURNO =
    {
      id: 0,
      cuil_medico: "",
      especialista: "",
      legajo: "",
      paciente: "",
      fecha_solicitud: "",
      fecha_atencion: "",
      hora_atencion: "",
      asunto: "",
      id_estado_turno: 0,
      estado: ""
    }
 // FUNCIONES PARA LA GRILLA (SE PODRIA PONER TODO EN UN SOLO ARCHIVO)
/*const formatHeader = (key) =>
    key
        .replaceAll("_", " ")
        .replace(/\b\w/g, l => l.toUpperCase());

const buildColumns = (data, 
        editAction=null,
        deleteAction = null,
        registAction = null,
        ) => {
    if (!data || data.length === 0) return [];

    const columns = Object.keys(data).map((key) => {
        const isId = key.toLowerCase().startsWith("id");
        const isShort = ["estado",
             "cupo",
              "duracion",
               "horario_inicio",
                "horario_fin"].includes(key.toLowerCase());
        
        if (key.toLowerCase() === "activo") {
            return {
                field: "activo",
                headerName: "Estado",
                align: "center",
                headerAlign: "center",
                width: 100,
                renderCell: (params) => (
                    <Chip
                        size="small"
                        label={params.value ? "Activo" : "Inactivo"}
                        color={params.value ? "success" : "default"}
                    />
                )
            };
        } else {
            return {
                field: key,
                headerName: formatHeader(key),
                flex: isId ? 0.3 : 1,
                minWidth: isId || isShort? 50 : 120,
                maxWidth: isId ? 70 : isShort ? 100 : NaN,
                align: isId || isShort ? "center" : "left",
                headerAlign: isId || isShort ? "center" : "left",
            };
        }
    });
    //Puseah la columna de acciones si alguna de estas acciones existe.
        if(editAction||deleteAction||registAction)
        {
            columns.push({
                field: "actions",
                headerName: "Acciones",
                sortable: false,
                filterable: false,
                width: 100,
                renderCell: (params) => (
                    <Box>
                    {editAction && (
                        <IconButton
                            size="small"
                            color="primary"
                            title="Ver / Editar"
                            onClick={() => editAction(params.row)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    )}
                    {deleteAction && 
                        (<IconButton
                            size="small"
                            color="primary"
                            title="Eliminar"
                            onClick={() => deleteAction(params.row)}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>    
                        )}
                    {registAction && 
                        (<IconButton
                            size="small"
                            color="primary"
                            title="Registrar Falta"
                            onClick={() => registAction(params.row)}
                        >
                            <EditNoteIcon fontSize="small" />
                        </IconButton>    
                        )}
                    </Box>  
                )
            });
        }
    return columns;
};

const generateRows = (data) => {

    return [...data]
    .sort((a, b) => a.id - b.id)
    .map((item, index) => ({
        id: item.id || index,
        ...item
    }));
 
};*/

// CONTEXTO
const HealthContext = createContext();

export const HealthUsersProvider = ({ children }) => {
    const DAYS = [
        { label: "Lunes",     value: 1 },
        { label: "Martes",    value: 2 },
        { label: "Miércoles", value: 3 },
        { label: "Jueves",    value: 4 },
        { label: "Viernes",   value: 5 }
    ];
    // Estados globales de Diálogo compartidos por ambas secciones
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({});
    const [dialogType, setDialogType] = useState(""); 
    const [dialogMode, setDialogMode] = useState(""); 
    const [dialogError, setDialogError] = useState(null);
    const [dialogSaving, setDialogSaving] = useState(false);
    // Estados de Notificación
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    //ESTADOS
    const [estadosTurno, setEstados] = useState([]);
    const fetchEstadosTurno= useCallback(async () => {
        try {
            const data = await ObtenerEstadosTurno();  
  
            setEstados(data.map(mapEstado));
        } catch {
            setEstados([]);
        } 
    }, []);

    useEffect(() => {
        fetchEstadosTurno();
    }, [fetchEstadosTurno]);

    // TURNOS MEDICOS
    const [estudianteTurnos, setStudentTurns] = useState([]);
    const [loadingTurnos, setLoadingTurnos]  = useState(false);
    const [usuarioSelected,setUsuarioSelected]  = useState(null);

    const openCreateTurnos = useCallback((legajo) => {
        setUsuarioSelected(legajo)
        setDialogMode("create");
        setDialogType("turnos");
        setDialogData(EMPTY_TURNO); 
        setDialogError("");
        setTimeout(() => setDialogOpen(true), 0);
    }, []);
    const openEditTurnos = useCallback((row) => {
        setDialogMode("edit");
        setDialogType("turnos");
        setDialogData(row); 
        setDialogError("");
        setDialogOpen(true);
    }, []);


    const fetchTurnosEstudiante = useCallback(async (legajo) => {
        setLoadingTurnos(true);
        try {
            let data = await ObtenerTurnosEstudiante(legajo);  
            data = data.map(mapTurnos);
            setStudentTurns(data);

        } catch {
            setStudentTurns([]);
        }
        finally{
            setLoadingTurnos(false);
        }
    }, []);

    useEffect(() => {
        fetchTurnosEstudiante();
    }, [fetchTurnosEstudiante]);


    /*Envolvemos handleValidation en useCallback para que no cambie en cada render
    const handleValidation = useCallback(() => {
        if (dialogData.id_estado_turno >= 0 && dialogMode) {
            if (dialogMode === "edit" && (!dialogData?.id || dialogData.id < 0)) return false;
            if (dialogData?.legajo?.trim() === "" || dialogData?.asunto?.trim() === "") return false;

            // Validaciones para estados específicos (Asignado, En Curso, Finalizado, Reprogramado)
            if ([1, 2, 3, 5].includes(dialogData.id_estado_turno)) {
                if (!dialogData?.cuil_medico?.trim() || !dialogData?.fecha_atencion?.trim() || !dialogData?.hora_atencion?.trim()) {
                    return false; 
                }
            }
            return true;
        }
        return false;
    }, [dialogData, dialogMode]);*/

    const handleTurnosSave = useCallback(async () => {
        setDialogSaving(true);
        setDialogError("");

        try {
            if (dialogMode === "create" && !usuarioSelected) {
                setDialogError("Sin paciente asignado");
                setDialogSaving(false);
                return;
            }
            if (dialogData.id_estado_turno === 1) {
                setDialogError("Faltan valores");
                setDialogSaving(false);
                return;
            }

            const id_nuevo = dialogData.id === "" ? 0 : Number(dialogData.id);
            const hoy = new Date();
            const ISO = hoy.toLocaleDateString('sv-SE');

            // Construcción del objeto que se enviará al servidor
            const body = {
                id: id_nuevo,
                cuil_medico: dialogData.cuil_medico?.trim() === "" ? null:dialogData.cuil_medico,
                especialista: "Se define con el cuil",
                legajo: dialogMode === "create" ? usuarioSelected : dialogData.legajo,
                paciente: dialogMode === "create" ? "" : dialogData.paciente,
                fecha_solicitud: dialogMode === "create" ? `${ISO}T00:00:00` : (dialogData.fecha_solicitud ? `${dialogData.fecha_solicitud}T00:00:00` : new Date()),
                fecha_atencion: dialogData.fecha_atencion ? `${dialogData.fecha_atencion}T00:00:00` : null,
                hora_atencion: dialogData.hora_atencion.trim() === "" ? null : dialogData.hora_atencion.trim(),
                asunto: dialogData.asunto,
                estadosTurno: {
                    id: dialogData.id_estado_turno,
                    estado_turno: "indiferente"
                }
            };
            
            if (dialogMode === "create") {
                // 1. Guardamos en la base de datos primero (para obtener el ID real que autogenera el backend)
                await CrearTurnos(body);

            } else if (dialogMode === "edit") {
               await ModificarTurno(id_nuevo, body);
            }

            // Éxito: Limpieza de formulario y feedback visual
            setDialogOpen(false);
            setDialogData(EMPTY_TURNO);
            setSnackbarMsg(dialogMode === "create" ? "Turno Creado!" : "Turno Actualizado!");
            setSnackbarOpen(true);

        } catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    }, [dialogData,dialogMode,usuarioSelected]);

    // SECCION ESPECIALIDADES

    const [especialidadesActivas,setEspecialidadesActivas] = useState([]);

    const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
   
    const fetchEspecialidades = useCallback(async () => {
        setLoadingEspecialidades(true);
        try {
            let data = await ObtenerEspecialidades();
            setEspecialidadesActivas(data.filter(esp => esp.activo));
        } catch {
            setEspecialidadesActivas([]);
        } finally {
            setLoadingEspecialidades(false);
        }
    }, []);
    
    useEffect(() => { fetchEspecialidades(); }, [fetchEspecialidades]);
     
    // --------- SECCION PERSONAL MEDICO -----------
    const [personal,setPersonal] = useState([]);
    const [loadingPersonal, setLoadingPersonal] = useState(false);

    const fetchPersonal = useCallback(async () => {
        setLoadingPersonal(true);
        try {
            let data = await ObtenerPersonalMedico();
            data = data.filter(esp => esp.activo).map(mapPersonalMedico);
            setPersonal(data);
        } catch {
            setPersonal([]);
        } finally {
            setLoadingPersonal(false);
        }
    }, []);
    
    useEffect(() => { fetchPersonal(); }, [fetchPersonal]);

    // --------- SECCION CURSOS MEDICOS -----------
    const [cursos,setCursos] = useState([]);
    const [loadingCursos, setLoadingCursos] = useState(false);

    const fetchCursos = useCallback(async () => {
        setLoadingCursos(true);
        try {
            let data = await ObtenerCursosMedicos();
            setCursos(data.filter(esp => esp.activo).map(mapCursoMedico));
        } catch {
            setCursos([]);
        } finally {
            setLoadingCursos(false);
        }
    }, []);
    
    useEffect(() => { fetchCursos(); }, [fetchCursos]);

     //---- HORARIOS ---- //
        const [allHorarios, setAllHorarios] = useState([]);
        const [loadingHorarios, setLoadingHorarios]= useState(true);

        const [selectedHorarios, setSelectedHorarios] = useState([]);
    
        const fetchHorarios = useCallback(async () => {
            setLoadingHorarios(true);
            try {
                
                let data = await ObtenerHorariosCompleto();  
                data = data.map(mapHorarioSalud);
                setAllHorarios(data)       
            } catch {
                setDialogError("Error recuperando los horarios");
                setAllHorarios([]);
            } finally {
                setLoadingHorarios(false);
            }
        }, []);
        useEffect(() => { fetchHorarios(); }, [fetchHorarios]);
    

    // ---------
    return (
        <HealthUserContext.Provider value={{
            DAYS,
            // ABM de Turnos
            estadosTurno,
            estudianteTurnos,loadingTurnos,

            openCreateTurnos,openEditTurnos,handleTurnosSave,
            setUsuarioSelected,usuarioSelected, //Usuarios para nuevo turno
            // ABM de Especialidades
            especialidadesActivas,loadingEspecialidades,
            //ABM de Personal
            personal,loadingPersonal,
            //ABM de Cursos
            cursos,loadingCursos,

            allHorarios,loadingHorarios,selectedHorarios,setSelectedHorarios, //General
           
            //Valores de error, mostrar mensajes, etc.
            snackbarOpen, setSnackbarOpen,snackbarMsg,setDialogError,
            dialogOpen, setDialogOpen, dialogData, setDialogData, dialogType, dialogMode, dialogError, dialogSaving
            
        }}>
            {children}
        </HealthUserContext.Provider>
    );
};

export const useHealthUser = () => {
    const context = useContext(HealthUserContext);
    if (!context) throw new Error("useHealthUser debe usarse dentro de HealthProvider");
    return context;
};