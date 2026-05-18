import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Box, IconButton, Chip } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from '@mui/icons-material/EditNote';

import {CrearCurso, CrearEspecialidad, CrearPersonal, ModificarCurso as ModificarCurso, ModificaEspecialidad, ModificarPersonal, ObtenerCursosMedicos, ObtenerEspecialidades ,ObtenerEstadosTurno, ObtenerPersonalMedico, EliminarCursoMedico, ObtenerHorariosCompleto, ObtenerHorariosXCUIL, CrearHorario, ModificarHorario, EliminarHorario, ObtenerTurnos, RegistrarFalta, ObtenerFaltasXCUIL, CrearTurnos} from "../../../api/SaludService";
import { mapCursoMedico, mapHorarioSalud, mapPersonalMedico, mapEstado} from '../../../api/formatters/SaludFormatters';
import { Try } from '@mui/icons-material';
import { ObtenerUsuariosXLegajo } from '../../../api/EmpleadoService';


const HealthUserContext = createContext();

    // FORMULARIOS VACIOS
    const EMPTY_ESPECIALIDAD = 
    {
        id: 0,
        nombre: "",
        descripcion: "",
        activo: true
    };
    const EMPTY_PERSONAL = 
    {
        cuil: "",
        nombre: "",
        apellido: "",
        id_especialidad: null,
        especialidad:"",
        activo: true,  
    };
    const EMPTY_FALTA = 
    {
        id: 0,
        observacion: "",
        fecha_alta: true
    };    
    const EMPTY_CURSO = 
    {
      id: 0,
      nombre_curso: "",
      nombre_docente: "",
      fecha_inicio: "",
      fecha_fin: "",
      cupo_maximo: 0,
      activo: true
    };
    const EMPTY_HORARIO =
    {
        id: null,
        hora_inicio: "",
        hora_fin: "",
        dia: null,
        cuil_especialista: "",
        especialista:"",
        activo: null,
        id_especialidad:null,
        nombre_especialidad:""
    }
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
    .map((item, index) => ({
        id: item.id || index,
        ...item
    }));
 
};

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
    const [horariosDialogOpen, setHorariosDialogOpen] = useState(false);
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
    const [allTurnos, setAllTurnos] = useState([]);
    const [pendienteTurnos, setPendienteTurnos] = useState([]);//ID:0
    const [asignadoTurnos, setAsignadosTurnos] = useState([]);//ID:1
    const [enCursoTurnos, setEnCursoTurnos] = useState([]);//ID:2
    const [finalizadoTurnos, setFinalizadoTurnos] = useState([]);//ID:3
    const [canceladoTurnos, setCanceladoTurnos] = useState([]);//ID:4
    const [reprogramadoTurnos, setReprogramadoTurnos] = useState([]);//ID:5
    const [laodingTurnos, setLoadingTurnos]  = useState(false);

    const openCreateTurnos = useCallback(() => {
        setUsuarioSelected(null);
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

    const fetchTurnosMedicos= useCallback(async () => {
        setLoadingTurnos(true);
        try {
            const data = await ObtenerTurnos();  
            setAllTurnos(data);

            // 1. Crear arrays temporales vacíos
            const pendientes = [];
            const asignados = [];
            const enCurso = [];
            const finalizados = [];
            const cancelados = [];
            const reprogramados = [];

            data.forEach(turno => {
                // Reemplaza 'turno.idEstado' por la propiedad real de tu objeto (ej. turno.estadoId)
                switch (turno.id_estado_turno) {
                    case 0: pendientes.push(turno); break;
                    case 1: asignados.push(turno); break;
                    case 2: enCurso.push(turno); break;
                    case 3: finalizados.push(turno); break;
                    case 4: cancelados.push(turno); break;
                    case 5: reprogramados.push(turno); break;
                    default: break; // Por si llega un ID desconocido
                }
            });

            setPendienteTurnos(pendientes);
            setAsignadosTurnos(asignados);
            setEnCursoTurnos(enCurso);
            setFinalizadoTurnos(finalizados);
            setCanceladoTurnos(cancelados);
            setReprogramadoTurnos(reprogramados);
        } catch {
            setPendienteTurnos([]);
            setAsignadosTurnos([]);
            setEnCursoTurnos([]);
            setFinalizadoTurnos([]);
            setCanceladoTurnos([]);
            setReprogramadoTurnos([]);
        }
        finally{
            setLoadingTurnos(false);
        }
    }, []);

    useEffect(() => {
        fetchTurnosMedicos();
    }, [fetchTurnosMedicos]);

    const handleTurnosSave = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
            if(dialogMode === "create" && !usuarioSelected){
                setDialogError("Sin paciente asignado");
                return;
            }
            const { id } = dialogData;
            let id_nuevo = id === "" ? 0 : id;
            const hoy = new Date();
            const ISO = hoy.toLocaleDateString('sv-SE'); // 'sv-SE' devuelve siempre "AAAA-MM-DD"

            const body = {
                    id: id_nuevo,
                    cuil_medico: dialogData.cuil,
                    especialista: "Se define con el cuil",
                    legajo:dialogMode === "create" ? usuarioSelected.legajo : dialogData.legajo, //Si es creacion debemos buscar antes a la persona
                    paciente: dialogMode === "create" ? usuarioSelected.nombre_usuario : dialogData.paciente,

                    fecha_solicitud:dialogMode === "create" ? `${ISO}T00:00:00`
                    :( dialogData.fecha_solicitud
                    ? `${dialogData.fecha_solicitud}T00:00:00`:new Date()),

                    fecha_atencion: dialogData.fecha_atencion
                    ? `${dialogData.fecha_atencion}T00:00:00`:new Date(),

                    hora_atencion: dialogData.hora_atencion,
                    asunto: dialogData.asunto,
                    id_estado_turno:dialogData.id_estado,
                    estado: "indiferente"
                };

            await CrearTurnos(body);
            setDialogOpen(false);
            setDialogData(EMPTY_TURNO);
            fetchTurnosMedicos();
            setSnackbarMsg(dialogMode === "create" ? "Turno Creado!":"Turno Actualizado!");
            setSnackbarOpen(true);
        } catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };

    const [usuarioSelected,setUsuarioSelected] = useState(null);
    const [loadingUsuario,setLoadingUsuario] = useState(false);

    const fetchUsuariosXlegajo = useCallback(async (legajo) => {
        if (!legajo) return; // Evita buscar si está vacío
        setLoadingUsuario(true);
        setUsuarioSelected(null);
        try {
            const data = await ObtenerUsuariosXLegajo(legajo);
            if(data && data.legajo){
                setUsuarioSelected(data);
            }
            else{
                setUsuarioSelected(null);
                setDialogError("Usuario No encontrado");
            }
        } catch {
            setUsuarioSelected(null);
            setDialogError("Usuario No encontrado")
        }
        finally{
            setLoadingUsuario(false);
        }
    }, [])
    
    useEffect(() => { fetchUsuariosXlegajo(); }, [fetchUsuariosXlegajo]);

    // SECCION ESPECIALIDADES
    const [especialidades,setEspecialidades] = useState([]);
    const [especialidadesActivas,setEspecialidadesActivas] = useState([]);
    const [especialidadesRows, setEspecialidadesRows] = useState([]);
    const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
   
    const fetchEspecialidades = useCallback(async () => {
        setLoadingEspecialidades(true);
        try {
            let data = await ObtenerEspecialidades();
            setEspecialidades(data);
            setEspecialidadesActivas(data.filter(esp => esp.activo));
            setEspecialidadesRows(generateRows(data));
        } catch {
            setEspecialidadesRows([]);
        } finally {
            setLoadingEspecialidades(false);
        }
    }, []);
    
    useEffect(() => { fetchEspecialidades(); }, [fetchEspecialidades]);

    const openCreateEspecialidades = useCallback(() => {
        setDialogType("especialidades");
        setDialogMode("create");
        setDialogData(EMPTY_ESPECIALIDAD); 
        setDialogError("");
        setTimeout(() => setDialogOpen(true), 0);
    }, []);
    const openEditEspecialidades = useCallback((row) => {
        setDialogData(row);
        setDialogType("especialidades");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);
     const especialidadesColumns = useMemo(() => buildColumns(EMPTY_ESPECIALIDAD, openEditEspecialidades), [openEditEspecialidades]);
     
     const handleEspecialidadesSave = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
            const { id } = dialogData;
            let id_nuevo = id === "" ? 0 : id;
            const body = { id: id_nuevo, 
                nombre: dialogData.nombre,
                 descripcion: dialogData.descripcion, 
                  activo:dialogMode === "create"? true: dialogData.activo };

            if (dialogMode === "create") {
                await CrearEspecialidad(body);
            } else if (dialogMode === "edit") {
                await ModificaEspecialidad(id_nuevo, body);
            }
            setDialogOpen(false);
            setDialogData(EMPTY_ESPECIALIDAD);
            fetchEspecialidades();
            setSnackbarMsg(dialogMode === "create" ? "Especialidad creado!" : "Especialidad modificada correctamente");
            setSnackbarOpen(true);
        } catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };
   
    // --------- SECCION PERSONAL MEDICO -----------
    const [personal,setPersonal] = useState([]);
    const [personalRows, setPersonalRows] = useState([]);
    const [loadingPersonal, setLoadingPersonal] = useState(false);

    const fetchPersonal = useCallback(async () => {
        setLoadingPersonal(true);
        try {
            let data = await ObtenerPersonalMedico();
            data = data.map(mapPersonalMedico);
            setPersonal(data);
            setPersonalRows(generateRows(data));
        } catch {
            setPersonalRows([]);
        } finally {
            setLoadingPersonal(false);
        }
    }, []);
    
    useEffect(() => { fetchPersonal(); }, [fetchPersonal]);

    const [cuilFaltas, SetCuilFaltas]  = useState(null);
    const [faltasRows,setFaltasRows] = useState([]);
    const [loadingFaltas,setLoadingFaltas] = useState([]);

    const fetchFaltas = useCallback(async () => {
        setLoadingFaltas(true);
        try {
            if(cuilFaltas){
                let data = await ObtenerFaltasXCUIL(cuilFaltas);
                setFaltasRows(generateRows(data));
            }
            else{
                setFaltasRows([]);
            }
        } catch {
            setFaltasRows([]);
        } finally {
            setLoadingFaltas(false);
        }
    }, [cuilFaltas]);
    
    useEffect(() => { fetchFaltas(); }, [fetchFaltas]);

    const openCreatePersonal = useCallback(() => {
        setDialogType("personal");
        setDialogMode("create");
        setDialogData({...EMPTY_PERSONAL}); 
        setDialogError("");
        setTimeout(() => setDialogOpen(true), 0);
    }, []);
    const openEditPersonal = useCallback((row) => {
        setDialogData(row);
        setDialogType("personal");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);
    const openEditRegist = useCallback((row) => {
        setDialogData({cuil:row.cuil,fecha_alta:null,observacion:""});
        SetCuilFaltas(row.cuil);
        fetchFaltas();
        setDialogType("personal");
        setDialogMode("faltas");
        setDialogError("");
        setDialogOpen(true);
    }, [fetchFaltas]);

    const faltasColumns = useMemo(() => buildColumns(EMPTY_FALTA, null,null,null), []);//Es una grilla sin acciones
    const personalColumns = useMemo(() => buildColumns(EMPTY_PERSONAL, openEditPersonal,null,openEditRegist), [openEditPersonal,openEditRegist]);
    
    const handlePersonalSave = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
            //Utilizo este handler para todo, separo en los body para personal y las faltas
            if(dialogMode == "faltas" && cuilFaltas){
                const body={id:0, ...dialogData}//Hago un body exactamente igual al anterior
                await RegistrarFalta(body);
                setDialogData(EMPTY_FALTA);
                fetchFaltas();
                setSnackbarMsg("Falta Registrada al Personal");
                setSnackbarOpen(true);                
            }
            else{
                const body = { cuil: dialogData.cuil,
                    nombre: dialogData.nombre,
                    apellido: dialogData.apellido, 
                    presta_servicio: dialogMode === "create"? true: dialogData.activo , 
                    especialidad:{
                        id: dialogData.id_especialidad,
                        nombre: dialogData.especialidad,
                        descripcion: "string",
                        activo: true
                    }
                };

                if (dialogMode === "create") {
                    await CrearPersonal(body);
                } else if (dialogMode === "edit") {
                    await ModificarPersonal(dialogData.cuil, body);
                }
                setDialogOpen(false);
                setDialogData(EMPTY_PERSONAL);
                fetchPersonal();
                setSnackbarMsg(dialogMode === "create" ? "Personal creado!" : "Personal modificado correctamente");
                setSnackbarOpen(true);
            }


        } catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };
    // --------- SECCION CURSOS MEDICOS -----------
    const [cursos,setCursos] = useState([]);
    const [cursosRows, setCursosRows] = useState([]);
    const [loadingCursos, setLoadingCursos] = useState(false);

    const fetchCursos = useCallback(async () => {
        setLoadingCursos(true);
        try {
            let data = await ObtenerCursosMedicos();
            setCursos(data);
            setCursosRows(generateRows(data.map(mapCursoMedico)));
        } catch {
            setCursosRows([]);
        } finally {
            setLoadingCursos(false);
        }
    }, []);
    
    useEffect(() => { fetchCursos(); }, [fetchCursos]);

    const openCreateCurso = useCallback(() => {
        setDialogType("cursos");
        setDialogMode("create");
        setDialogData(EMPTY_CURSO); 
        setDialogError("");
        setTimeout(() => setDialogOpen(true), 0);
    }, []);
    const openEditCurso = useCallback((row) => {
        setDialogData(row);
        setDialogType("cursos");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);
    const openDeleteCurso = useCallback((row) => {
        setDialogData(row);
        setDialogType("cursos");
        setDialogMode("delete");
        setDialogError("");
        setDialogOpen(true);
    }, []);    
    const cursosColumns = useMemo(() => buildColumns(EMPTY_CURSO, openEditCurso,openDeleteCurso), [openEditCurso,openDeleteCurso]);

    const handleCursoSave = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {

            const { id } = dialogData;
            let id_nuevo = id === "" ? 0 : id;
            const body = { id:id_nuevo,
                nombre_curso: dialogData.nombre_curso,
                nombre_docente: dialogData.nombre_docente, 
                fecha_inicio:dialogData.fecha_inicio
                    ? `${dialogData.fecha_inicio}T00:00:00`:new Date(),
                fecha_fin:dialogData.fecha_fin
                    ? `${dialogData.fecha_fin}T00:00:00`:new Date(),
                cupo_maximo:Number(dialogData.cupo_maximo),
                activo: dialogMode === "create"? true: dialogData.activo , 
            };

            if (dialogMode === "create") {
                await CrearCurso(body);
            } else if (dialogMode === "edit") {
                await ModificarCurso(dialogData.id, body);
            }
            else{
                await EliminarCursoMedico(dialogData.id);
            }
            setDialogOpen(false);
            setDialogData(EMPTY_CURSO);
            fetchCursos();
            setSnackbarMsg(dialogMode === "create" ? "Curso creado!" : "Curso modificado correctamente");
            setSnackbarOpen(true);
        } catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };
     //---- HORARIOS ---- //
        const [allHorarios, setAllHorarios] = useState([]);
        const [loadingHorarios, setLoadingHorarios]= useState(true);

        const [selectedEmploy, setSelectedEmploy] = useState(null);
        const [selectedHorarios, setSelectedHorarios] = useState([]);
        const [selectedHorariosLoading, setSelectedHorariosLoading] = useState(false);
        const [showNuevoForm, setShowNuevoForm] = useState(false);
    
        const [form, setForm] = useState(EMPTY_HORARIO);
        const handleChangeForm = (field, value) => setForm((p) => ({ ...p, [field]: value }));
    
        const [savingHorario, setSavingHorario] = useState(false);
        const [errorHorario, setErrorHorario] = useState(null);
    
        const [editingId, setEditingId] = useState(null);
        const [confirmDelete, setConfirmDelete] = useState(false);
        const [deleteId, setDeleteId] = useState(null);
    
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
    
        const fetchHorariosXEmpleado = useCallback(async () => {
            setSelectedHorariosLoading(true);
            setDialogError(null);
            //Todo esto es para que no guarde informacion en las tarjetas
            setForm(EMPTY_HORARIO);
            setDeleteId(null);
            setEditingId(null);
            try {
                if(selectedEmploy){
                    let data = await ObtenerHorariosXCUIL(selectedEmploy.cuil);
                    data = data.map(mapHorarioSalud); 
                    setSelectedHorarios(data);
                }
                else{
                    setSelectedHorarios([]);
                }
            } catch {
                setDialogError("Error recuperando los horarios");
                setSelectedHorarios([]);
            } finally {
                setSelectedHorariosLoading(false);
            }
        }, [selectedEmploy,setSelectedHorarios]);
    
        useEffect(() => { fetchHorariosXEmpleado(); }, [fetchHorariosXEmpleado]);
    
        const handleEmployChange = useCallback((_e, value) => {
            setSelectedEmploy(value);

            setShowNuevoForm(false);
            if (value) fetchHorariosXEmpleado(value.id);
        }, [fetchHorariosXEmpleado]);
    
        const handleHorarioSaved = useCallback(() => {
            if (selectedEmploy) fetchHorariosXEmpleado(selectedEmploy.id);
        }, [selectedEmploy, fetchHorariosXEmpleado]);
    
        const handleHorarioCreated = useCallback(() => {
            setShowNuevoForm(false);
            if (selectedEmploy) fetchHorariosXEmpleado(selectedEmploy.id);
        }, [selectedEmploy, fetchHorariosXEmpleado]);
    
        const handleClose = () => {
            setSelectedEmploy(null);
            setSelectedHorarios([]);
            setShowNuevoForm(false);
            setHorariosDialogOpen(false);
        };
    
        const handleCreateHorario = async () => {
            setSavingHorario(true);
            setErrorHorario("");
            try {
                
                const body = { id: 0, 
                hora_inicio: form.hora_inicio,
                hora_fin: form.hora_fin,
                dia: form.dia,
                cuil_especialista: selectedEmploy.cuil,
                especialista: selectedEmploy.nombre,
                activo:true,
                especialidad:
                    {
                        id: 0,
                        nombre: "",
                        descripcion: "",
                        activo: true    
                    }            
                };
            
                await CrearHorario(body);

                fetchHorarios();
                fetchHorariosXEmpleado(selectedEmploy.cuil);
                setShowNuevoForm(false);
                setHorariosDialogOpen(false);
            } catch (err) {
                setErrorHorario(err.message || "Error al crear");
            } finally {
                setSavingHorario(false);
            }
        };
        const handleEditHorario = async () => {
            //Son todas cosas que queremos mostrar antes de ejecutar una query asincrona
            setSavingHorario(true);
            setErrorHorario("");
            
            try {
                const body = { id: form.id, 
                hora_inicio: form.hora_inicio,
                hora_fin: form.hora_fin,
                dia: form.dia,
                cuil_especialista: selectedEmploy.cuil,
                especialista: selectedEmploy.nombre,
                activo:true,
                especialidad:
                    {
                        id: 0,
                        nombre: "",
                        descripcion: "",
                        activo: true    
                    }            
                };

                await ModificarHorario(form.id, body);
                setEditingId(null);
                fetchHorarios();
                fetchHorariosXEmpleado(selectedEmploy.cuil);
                setForm(null);
            } catch (err) {
                setErrorHorario(err.message || "Error al guardar");
            } finally {
                setSavingHorario(false);
            }
        };
        const handleDeleteHorario = async () => {
    
            try {
                await EliminarHorario(deleteId);
                setForm(null);
                setDeleteId(null);
                fetchHorarios();
                fetchHorariosXEmpleado(selectedEmploy.cuil);
                setConfirmDelete(false);
    
            } catch (err) {
    
                setConfirmDelete(false);
                setErrorHorario(err.message || "Error al crear");
            }
        };
        const handleCancelHorario = () => {
            setForm(null);
            setEditingId(null);
            setErrorHorario("");
        };

    // ---------
    return (
        <HealthUserContext.Provider value={{
            DAYS,
            //Faltas
            cuilFaltas, SetCuilFaltas,faltasRows,faltasColumns,loadingFaltas,
            // ABM de Turnos
            estadosTurno,
            allTurnos,pendienteTurnos,asignadoTurnos,enCursoTurnos,finalizadoTurnos,canceladoTurnos,reprogramadoTurnos,laodingTurnos,//Listados de turnos
            openCreateTurnos,openEditTurnos,handleTurnosSave,//Operaciones
            setUsuarioSelected,usuarioSelected,loadingUsuario,fetchUsuariosXlegajo, //Usuarios para nuevo turno
            // ABM de Especialidades
            especialidades,especialidadesActivas,especialidadesRows,especialidadesColumns,loadingEspecialidades,openCreateEspecialidades,openEditEspecialidades,handleEspecialidadesSave,
            //ABM de Personal
            personal,personalRows,personalColumns,loadingPersonal,openCreatePersonal,openEditPersonal,handlePersonalSave,
            //ABM de Cursos
            cursos,cursosRows,cursosColumns,loadingCursos,openCreateCurso,openEditCurso,handleCursoSave,
            //Horarios
            horariosDialogOpen, setHorariosDialogOpen,setShowNuevoForm,
            setEditingId ,setDeleteId,
            allHorarios,loadingHorarios,selectedEmploy,selectedHorarios,selectedHorariosLoading, setSelectedEmploy, //General
            showNuevoForm,form, setForm,handleChangeForm, //Formularios
            savingHorario,errorHorario,editingId,confirmDelete,deleteId, //Datos de formulario
            handleEmployChange,handleHorarioSaved,handleHorarioCreated,handleClose,handleCreateHorario,handleEditHorario,handleDeleteHorario,handleCancelHorario,//Acciones en el dialog
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