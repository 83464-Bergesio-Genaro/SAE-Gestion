import React, {  useState, useCallback, useEffect, useMemo } from 'react';
import { Box, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import {CrearRegistroUsuario,CrearEmpleado,ModificarUsuario,
        ObtenerEmpleados,ObtenerUsuariosXLegajo,ObtenerHorarios,
        BuscarHorariosXEmpleado,CrearHorarioEmpleado,
        ModificarHorario,EliminarHorario } from "../../../api/EmpleadoService";
import {obtenerPerfiles,obtenerCarreras} from "../../../api/HerramientasService";
import {mapEmpleadoSAE,mapHorarioSAE} from "../../../api/formatters/EmpleadoFormatter";

import { EmployContext } from '../employedContext';
import { generateColumns, generateRows } from "../../../utils/datagrid.utils.jsx";
import { useNotification } from "../../../shared/context/sharedContext";
import { calendarDays } from '../../../utils/common/constants.js';
import { EMPTY_FORM,EMPTY_EMPLEADO,EMPTY_USUARIO } from '../../../utils/common/common.config.js';

export const AdminUsersProvider = ({ children }) => {
    // Estados globales de Diálogo compartidos por ambas secciones
    const {
        showNotification,
        dialogData,
        dialogType,
        dialogMode,
        dialogError,
        setDialogError,
        setDialogSaving,
        openDialog,
        closeDialog,
    } = useNotification();

    const validateField = (field, value, data = dialogData) => {
        switch (field) {
        case "nombre":
            return isEmpty(value) ? BS.validationName : "";
        case "nro_telefono":
            if (isEmpty(value)) return BS.validationPhoneRequired;
            return isValidPhone(value) ? "" : BS.validationPhoneFormat;
        case "nro_telefono_interno":
            return !isEmpty(value) && !isValidMinLengthPhone(value, 2)
            ? BS.validationInternalPhone
            : "";
        case "email_institucional":
            if (isEmpty(value)) return BS.validationEmailRequired;
            return isValidEmail(value) ? "" : BS.validationEmailFormat;
        case "horario_atencion":
            return isEmpty(value) ? BS.validationOpeningTime : "";
        case "horario_atencion_final":
            if (isEmpty(value)) return BS.validationClosingTime;
            return isTimeAfter(value, data.horario_atencion)
            ? ""
            : BS.validationClosingTimeAfterOpening;
        default:
            return "";
        }
    };


    const [horariosDialogOpen, setHorariosDialogOpen] = useState(false);

    const [perfiles, setPerfiles] = useState([]);
    const fetchPerfiles= useCallback(async () => {
        try {
            const data = await obtenerPerfiles();  
            setPerfiles(data);
            
        } catch {
            setPerfiles([]);
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
        } 
    }, []);

    useEffect(() => {
        fetchCarreras();
    }, [fetchCarreras]);

    // Estados de Notificación

    // --- SECCIÓN EMPLEADOS ---
    const [empleados,setEmpleados] = useState([]);
    const [empleadosRows, setEmpleadosRows] = useState([]);
    const [loadingEmpleados, setLoadingEmpleados] = useState(false);

    const fetchEmpleados = useCallback(async () => {
        setLoadingEmpleados(true);
        try {
            let data = await ObtenerEmpleados();
            data = data.map(mapEmpleadoSAE);
            setEmpleados(data);
            setEmpleadosRows(generateRows(data));
        } catch {
            setEmpleadosRows([]);
        } finally {
            setLoadingEmpleados(false);
        }
    }, []);

    useEffect(() => { fetchEmpleados(); }, [fetchEmpleados]);

    const openCreateEmpleados = useCallback(() => {
        openDialog("empleados", "create", { id: "", legajo: "", nombre_empleado: "", nombres: "", apellidos: "", activo: true, id_perfil: "", nombre_perfil: "" });
    }, [openDialog]);

    const openEditEmpleados = useCallback((row) => {
        openDialog("empleados", "edit", { id: row.id, legajo: row.legajo, nombre_empleado: row.nombre_empleado, nombres: row.nombres, apellidos: row.apellidos, activo: row.activo, id_perfil: row.id_perfil, nombre_perfil: row.nombre_perfil });
    }, [openDialog]);

    const handleEmpleadosSave = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
            const { id } = dialogData;
            let id_nuevo = id === "" ? 0 : id;
            const body = { id: id_nuevo, 
                legajo: dialogData.legajo,
                 nombre_usuario: dialogData.nombre_usuario || dialogData.nombre_empleado, 
                 id_perfil: dialogData.id_perfil,
                activo: dialogMode === "create"? true: dialogData.activo };//Cuando lo doy de alta siempre es activo

            if (dialogMode === "create") {
                await CrearEmpleado(body, dialogData.nombres, dialogData.apellidos);
            } else if (dialogMode === "edit") {
                await ModificarUsuario(id_nuevo, body);
            }
            closeDialog();
            fetchEmpleados();
            showNotification(dialogMode === "create" ? "Empleado creado!" : "Empleado modificado correctamente", "success");
        } catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };

    // --- SECCIÓN USUARIOS (ESTUDIANTES) ---
    const [estudianteBuscado, setEstudiante] = useState();
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);

    const fetchUsuariosXLegajo = useCallback(async (legajo) => {
        if(!legajo){
            setEstudiante(null);
            return;
        }
        let data = null;
        setLoadingUsuarios(true);
        try {
            data = await ObtenerUsuariosXLegajo(legajo);
            
            //let userData = data.filter(item => item.id_perfil === 1); // Solo estudiantes
            //setEstudiante(data);     
        } catch {
            setEstudiante(null);
        } finally {
            setLoadingUsuarios(false); 
        }
        return data;
    }, []);

    useEffect(() => { fetchUsuariosXLegajo(); }, [fetchUsuariosXLegajo]);

    const openCreateUsuarios = useCallback(() => {
        openDialog("usuarios", "create", { id: "", legajo: "", nombre_usuario: "", nombres: "", apellidos: "", id_perfil: 1, activo: true, id_carrera: "", nombre_carrera: "" });
    }, [openDialog]);

    const handleUsuariosSave = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
            const { id } = dialogData;
            let id_nuevo = id === "" ? 0 : id;
            const body = { id: id_nuevo, 
                legajo: dialogData.legajo,
                 nombre_usuario: dialogData.nombre_usuario || dialogData.nombre_empleado, 
                 id_perfil: dialogData.id_perfil,
                  activo: dialogData.activo };
            
            if (dialogMode === "create") {
                // await CrearUsuario(body);
            } else if (dialogMode === "edit") {
                await ModificarUsuario(dialogData.id, body);
            }
            closeDialog();
            showNotification(dialogMode === "create" ? "Usuario creado!" : "Usuario modificado correctamente", "success");
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

    const [form, setForm] = useState(EMPTY_FORM);
    const handleChangeForm = (field, value) => setForm((p) => ({ ...p, [field]: value }));

    const [savingHorario, setSavingHorario] = useState(false);
    const [errorHorario, setErrorHorario] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchHorarios = useCallback(async () => {
        setLoadingHorarios(true);
        try {
            
            let data = await ObtenerHorarios();  
            data = data.map(mapHorarioSAE);
            setAllHorarios(data)       
        } catch {
            setDialogError("Error recuperando los horarios");
            setAllHorarios([]);
        } finally {
            setLoadingHorarios(false);
        }
    }, [setDialogError]);
    useEffect(() => { fetchHorarios(); }, [fetchHorarios]);

    const fetchHorariosXEmpleado = useCallback(async () => {
        setSelectedHorariosLoading(true);
        setDialogError(null);
        //Todo esto es para que no guarde informacion en las tarjetas
        setForm(EMPTY_FORM);
        setDeleteId(null);
        setEditingId(null);
        try {
            if(selectedEmploy){
                let data = await BuscarHorariosXEmpleado(selectedEmploy.id);
                data = data.map(mapHorarioSAE); 
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
    }, [selectedEmploy,setSelectedHorarios,setDialogError]);

    useEffect(() => { fetchHorariosXEmpleado(); }, [fetchHorariosXEmpleado]);

    const handleEmployChange = useCallback((_e, value) => {
        setSelectedEmploy(value);
        setSelectedHorarios([]);
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
            id_empleado: selectedEmploy.id,
            nombre_empleado_atencion: selectedEmploy.nombre_empleado};
            await CrearHorarioEmpleado(body);
            fetchHorarios();
            setShowNuevoForm(false);
            fetchHorariosXEmpleado(selectedEmploy.id);
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
            id_empleado: selectedEmploy.id,
            nombre_empleado_atencion: selectedEmploy.nombre_empleado};

            await ModificarHorario(form.id, body);
            setEditingId(null);
            fetchHorarios();
            fetchHorariosXEmpleado(selectedEmploy.id);
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
            fetchHorariosXEmpleado(selectedEmploy.id);
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
    // --- COLUMNAS MEMORIZADAS --- //
    /* Se crean los handle con el hook de useCallBack y despues los agregamos a una serie de acciones*/
    const handleOpenEditEmploy = useCallback((row) => {
        openEditEmpleados(row);
    }, [openEditEmpleados]);

    const employActions = useMemo(() => [{
        icon: EditIcon,
        color: "primary",
        title: "Editar Empleado",
        onClick: handleOpenEditEmploy, 
    }], [handleOpenEditEmploy]);

    const empleadosColumns = useMemo(() => {
    return generateColumns(EMPTY_EMPLEADO, employActions);
    }, [ employActions]); 

    
    return (
        <EmployContext.Provider value={{

            //Valores crudos de los endpoings
            empleados,carreras,perfiles,allHorarios,
            //Valores para las tablas y funciones de guardado Empleados y Usuarios
            empleadosRows, empleadosColumns, loadingEmpleados, openCreateEmpleados,
            estudianteBuscado, setEstudiante, loadingUsuarios, openCreateUsuarios,
            handleUsuariosSave,handleEmpleadosSave,fetchUsuariosXLegajo,
            //Valores para la seccion de horarios
            loadingHorarios, horariosDialogOpen, setHorariosDialogOpen,selectedHorariosLoading,selectedHorarios,selectedEmploy,setSelectedEmploy,

            handleEmployChange,handleHorarioSaved,handleHorarioCreated,handleClose,showNuevoForm,setShowNuevoForm,form,setForm,handleChangeForm,DAYS: calendarDays,
            savingHorario,errorHorario,setErrorHorario,handleCreateHorario,handleEditHorario,handleDeleteHorario,handleCancelHorario,
            editingId, setEditingId,confirmDelete,deleteId,setDeleteId,setConfirmDelete,
            //Valores de error, mostrar mensajes, etc.
            dialogType, dialogError
            
        }}>
            {children}
        </EmployContext.Provider>
    );
};
