import React, { createContext, useContext, useState, useCallback, useEffect,useMemo } from 'react';
import { Box, IconButton, Chip } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from '@mui/icons-material/EditNote';

import {CrearCurso, CrearEspecialidad, CrearPersonal, ModificarCurso as ModificarCurso, ModificaEspecialidad, ModificarPersonal, ObtenerCursosMedicos, ObtenerEspecialidades ,ObtenerEstadosTurno, ObtenerPersonalMedico, EliminarCursoMedico, ObtenerHorariosCompleto, ObtenerHorariosXCUIL, CrearHorario, ModificarHorario, EliminarHorario, ObtenerTurnos, RegistrarFalta, ObtenerFaltasXCUIL, CrearTurnos, ModificarTurno, ObtenerTurnosActivos, ObtenerTurnosFinalizados, ObtenerTurnosCancelados, ObtenerTurnosEstudiante, ObtenerEspecialidadesActivas} from "../../../api/SaludService";
import { mapCursoMedico, mapHorarioSalud, mapPersonalMedico, mapEstado, mapTurnos} from '../../../api/formatters/SaludFormatters';

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
const formatHeader = (key) =>
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
    .map((item, index) => {
        // 1. Creamos un nuevo objeto limpiando los nulos
        const cleanedItem = {};
        
        for (const key in item) {
            const value = item[key];
            // Controla null, undefined o strings vacíos (quitando espacios)
            if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                cleanedItem[key] = "-";
            } else {
                cleanedItem[key] = value;
            }
        }

        // 2. Retornamos el objeto con su ID correspondiente
        return {
            ...cleanedItem,
            id: item.id || index
        };
    });
};

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
    const [estudianteTurnos, setEstudianteTurnos] = useState([]);
    const [turnsRows, setTurnsRows] = useState([]);
    const [loadingTurnos, setLoadingTurnos]  = useState(false);
    const [usuarioSelected,setUsuarioSelected]  = useState(null);

    const openCreateTurnos = useCallback((legajo = null,id_especialidad = null,diasYHorarios = null) => {

        //Solo realiza una operacion si existen estos valores
        if(legajo && id_especialidad && diasYHorarios && diasYHorarios.length > 0){
            setUsuarioSelected(legajo);
            const hoy = new Date();
            const ISO = hoy.toLocaleDateString('sv-SE');
            setDialogMode("create");
            setDialogType("turnos");
            setDialogData(  {id: 0,
                            cuil_medico: null,
                            especialista: "",
                            legajo: legajo,
                            paciente: "",
                            fecha_solicitud: ISO,
                            fecha_atencion: null,
                            hora_atencion: null,
                            asunto: "",
                            id_estado_turno: 0,
                            estado: "PENDIENTE",
                            id_especialidad:id_especialidad,
                            horarios_disponibles:diasYHorarios[0],
                            dia_selecionado: diasYHorarios[0].dia,
                            horario_disponible:diasYHorarios[0].hora_inicio}); 
            
            setDialogError("");
            setTimeout(() => setDialogOpen(true), 0);
        }

    }, []);

    const openShowTurnos = useCallback((row) => {
        setDialogMode("show");
        setDialogType("turnos");
        setDialogData(row); 
        setDialogError("");
        setDialogOpen(true);
    }, []);

    const openDeleteTurnos = useCallback((row) => {
        setDialogMode("delete");
        setDialogType("turnos");
        setDialogData(row); 
        setDialogError("");
        setDialogOpen(true);
    }, []);

    const fetchTurnosEstudiante = useCallback(async (legajo) => {
        if(!legajo) return;
        setLoadingTurnos(true);
        try {
            let data = await ObtenerTurnosEstudiante(legajo);  
            data = data.map(mapTurnos);
            let activeTurnos=data.filter(item => [0,1,3,5].includes(item.id_estado_turno));
            setEstudianteTurnos(activeTurnos)

            //Genera una tabla de aquellos eturnos que esten cancelados o finalizados
            setTurnsRows(generateRows(data.filter(item => [2, 4].includes(item.id_estado_turno))));

        } catch {
            setEstudianteTurnos([]);
            setTurnsRows([]);
        }
        finally{
            setLoadingTurnos(false);
        }
    }, []);

    useEffect(() => {
        fetchTurnosEstudiante();
    }, [fetchTurnosEstudiante]);

    const turnsColumns = useMemo(() => buildColumns(EMPTY_TURNO, null,null), []);
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
    const [especialidadesActivas,setEspecialidadesActivas] = useState([]);

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
            const dias = [
                { label: "Lunes",     value: 1 },
                { label: "Martes",    value: 2 },
                { label: "Miércoles", value: 3 },
                { label: "Jueves",    value: 4 },
                { label: "Viernes",   value: 5 }
            ];
            const especialidad = especialidadesActivas?.find(esp => esp.id === dialogData?.id_especialidad)?? "No se selecciono especialidad";
            const dia_selec = dias?.find(esp => esp.value === dialogData?.dia_selecionado);

            const id_nuevo = dialogData.id === "" ? 0 : Number(dialogData.id);
            const hoy = new Date();
            const ISO = hoy.toLocaleDateString('sv-SE');

            const asunto = especialidad  +": "+ dialogData.asunto + " tiene disponible a las "+ dialogData.horario_disponible + " del " + dia_selec;
            const cuil_medico = dialogData.cuil_medico === null||dialogData.cuil_medico.trim()===""? null: dialogData.cuil_medico.trim();
            
            const horario_atencion = dialogData.hora_atencion===null ||dialogData.hora_atencion.trim()===""? null: dialogData.hora_atencion.trim();
            // Construcción del objeto que se enviará al servidor
            const body = {
                id: id_nuevo,
                cuil_medico: cuil_medico,
                especialista: "Se define con el cuil",
                legajo: dialogMode === "create" ? usuarioSelected : dialogData.legajo,
                paciente: dialogMode === "create" ? "" : dialogData.paciente,
                fecha_solicitud: dialogMode === "create" ? `${ISO}T00:00:00` : (dialogData.fecha_solicitud ? `${dialogData.fecha_solicitud}T00:00:00` : new Date()),
                fecha_atencion: dialogData.fecha_atencion ? `${dialogData.fecha_atencion}T00:00:00` : null,
                hora_atencion: horario_atencion,
                asunto: asunto,
                estadosTurno: {
                    id: dialogMode === "delete"? 2:dialogData.id_estado_turno,
                    estado_turno: "indiferente"
                }
            };
            
            if (dialogMode === "create") {
                // 1. Guardamos en la base de datos primero (para obtener el ID real que autogenera el backend)
                await CrearTurnos(body);

            } else if (dialogMode === "delete") {
               await ModificarTurno(id_nuevo, body);
            }
            fetchTurnosEstudiante(usuarioSelected);
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
    }, [fetchTurnosEstudiante,especialidadesActivas,dialogData,dialogMode,usuarioSelected]);

    // SECCION ESPECIALIDADES

    const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
   
    const fetchEspecialidades = useCallback(async () => {
        setLoadingEspecialidades(true);
        try {
            let data = await ObtenerEspecialidadesActivas();
            setEspecialidadesActivas(data);
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
            estudianteTurnos,loadingTurnos,fetchTurnosEstudiante,turnsRows,turnsColumns,

            openCreateTurnos,openShowTurnos,openDeleteTurnos,handleTurnosSave,
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