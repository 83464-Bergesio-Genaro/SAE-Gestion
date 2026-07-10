import React, { useState, useCallback, useEffect,useMemo } from 'react';
import { Box, IconButton, Chip } from '@mui/material';
import { HealthContext } from '../studentContext';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from '@mui/icons-material/EditNote';

import {CrearCurso, CrearEspecialidad, CrearPersonal, ModificarCurso as ModificarCurso, ModificaEspecialidad, ModificarPersonal, ObtenerCursosMedicos, ObtenerEspecialidades ,ObtenerEstadosTurno, ObtenerPersonalMedico, EliminarCursoMedico, ObtenerHorariosCompleto, ObtenerHorariosXCUIL, CrearHorario, ModificarHorario, EliminarHorario, ObtenerTurnos, RegistrarFalta, ObtenerFaltasXCUIL, CrearTurnos, ModificarTurno, ObtenerTurnosActivos, ObtenerTurnosFinalizados, ObtenerTurnosCancelados, ObtenerTurnosEstudiante, ObtenerEspecialidadesActivas} from "../../../api/SaludService";
import { mapCursoMedico, mapHorarioSalud, mapPersonalMedico, mapEstado, mapTurnos, mapTurnosPaciente} from '../../../api/formatters/SaludFormatters';

import { ObtenerUsuariosXLegajo } from '../../../api/EmpleadoService';
import { formatHeader, generateColumns, generateRows } from "../../../utils/util";
import { useNotification } from '../../../shared/context/sharedContext';
import { calendarDays, EMPTY_TURNO_PACIENTE} from '../../../utils/constants';

export const HealthUsersProvider = ({ children }) => {
    const { 
        showNotification, 
        dialogOpen, 
        dialogData, 
        dialogType, 
        dialogMode, 
        dialogError, 
        dialogSaving,
        setDialogOpen, 
        setDialogData, 
        setDialogType, 
        setDialogMode, 
        setDialogError, 
        setDialogSaving,
        handleDataChange,
        openDialog,
        closeDialog } = useNotification();
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

        setDialogSaving(true);
        try {
             //Solo realiza una operacion si existen estos valores
            if(legajo && id_especialidad != null && diasYHorarios && diasYHorarios.length > 0){
                setUsuarioSelected(legajo);
                const hoy = new Date();
                const ISO = hoy.toLocaleDateString('sv-SE');
                openDialog("turnos","create",
                {id: 0,
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
                showNotification("Turno creado exitosamente!","success");
            }    
        }
        catch (error) {
            showNotification("Ocurrio un inconveniente a la hora de crear tu turno: "+error,"error");
        }
        finally{
            setDialogSaving(false);
        }

    }, [openDialog,setUsuarioSelected]);

    const openShowTurnos = useCallback((row) => {
        if (row?.fecha_atencion) {
             row.fecha_atencion = row.fecha_atencion.substring(0, 10);
        }
        openDialog("turnos","show",row);
    }, [openDialog]);

    const openDeleteTurnos = useCallback((row) => {
        openDialog("turnos","delete",row);
    }, [openDialog]);

    const fetchTurnosEstudiante = useCallback(async (legajo) => {
        if(!legajo) return;
        setLoadingTurnos(true);
        try {
            
        let data = (await ObtenerTurnosEstudiante(legajo)) || [];

        const finishTurns = data.filter(item => [2, 4].includes(item.estadosTurno.id));
        const activeTurnos = data.filter(item => [0, 1, 3, 5].includes(item.estadosTurno.id));

        setEstudianteTurnos(activeTurnos.map(mapTurnos));
        setTurnsRows(generateRows(finishTurns.map(mapTurnosPaciente)));

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

    const turnsColumns = useMemo(() => {
        return generateColumns(EMPTY_TURNO_PACIENTE, null);
    }, [ null]);

    const [especialidadesActivas,setEspecialidadesActivas] = useState([]);

    const handleTurnosSave = useCallback(async () => {

        setDialogSaving(true);
        
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

            const especialidad = especialidadesActivas?.find(esp => esp.id === dialogData?.id_especialidad)?.nombre?? "Especialidad no Valida";
            const dia_selec = calendarDays?.find(di => di.value === Number(dialogData?.dia_selecionado))?.label??"lunes";

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
            closeDialog();
            useNotification(dialogMode === "create" ? "Turno Creado!" : "Turno Actualizado!","success");

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
    
    return (
        <HealthContext.Provider value={{
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
        }}>
            {children}
        </HealthContext.Provider>
    );
};
