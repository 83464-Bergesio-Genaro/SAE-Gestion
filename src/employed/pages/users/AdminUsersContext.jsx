import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Box, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {CrearRegistroUsuario,CrearEmpleado,ModificarUsuario,
        ObtenerEmpleados,ObtenerUsuarios,ObtenerHorarios,
        BuscarHorariosXEmpleado,CrearHorarioEmpleado,
        ModificarHorario,EliminarHorario } from "../../../api/EmpleadoService";
import {obtenerPerfiles,obtenerCarreras} from "../../../api/HerramientasService";
import {mapEmpleadoSAE,mapHorarioSAE} from "../../../api/formatters/EmpleadoFormatter";

const AdminUsersContext = createContext();

    const EMPTY_FORM = {
        dia: 1,
        hora_inicio: "",
        hora_fin: "",
        activo: true
    };
    const formatHeader = (key) =>
    key
        .replaceAll("_", " ")
        .replace(/\b\w/g, l => l.toUpperCase());

    const buildColumns = (data, editAction) => {
    if (!data || data.length === 0) return [];

    const columns = Object.keys(data).map((key) => {
        const isId = key.toLowerCase().includes("id");
        const isShort = ["estado", "cupo", "duracion", "horario_inicio", "horario_fin"].includes(key.toLowerCase());
        
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
                minWidth: isId ? 50 : 150,
                maxWidth: isId ? 70 : isShort ? 100 : NaN,
                align: isId || isShort ? "center" : "left",
                headerAlign: isId || isShort ? "center" : "left",
            };
        }
    });

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

const UsuariosContext = createContext();

export const AdminUsersProvider = ({ children }) => {
    // Estados globales de Diálogo compartidos por ambas secciones
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogData, setDialogData] = useState({});
    const [dialogType, setDialogType] = useState(""); // "empleados" o "usuarios"
    const [dialogMode, setDialogMode] = useState(""); // "create" o "edit"
    const [dialogError, setDialogError] = useState(null);
    const [dialogSaving, setDialogSaving] = useState(false);
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
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

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
        setDialogType("empleados");
        setDialogMode("create");
        setDialogData({ id: "", legajo: "", nombre_empleado: "", nombres: "", apellidos: "", activo: true, id_perfil: "", nombre_perfil: "" }); 
        setDialogError("");
        setTimeout(() => setDialogOpen(true), 0);
    }, []);

    const openEditEmpleados = useCallback((row) => {
        setDialogData({ id: row.id, legajo: row.legajo, nombre_empleado: row.nombre_empleado, nombres: row.nombres, apellidos: row.apellidos, activo: row.activo, id_perfil: row.id_perfil, nombre_perfil: row.nombre_perfil });
        setDialogType("empleados");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);

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
                  activo: dialogData.activo };

            if (dialogMode === "create") {
                await CrearEmpleado(body, dialogData.nombres, dialogData.apellidos);
            } else if (dialogMode === "edit") {
                await ModificarUsuario(id_nuevo, body);
            }
            setDialogOpen(false);
            setDialogData(EMPTY_EMPLEADO);
            fetchEmpleados();
            setSnackbarMsg(dialogMode === "create" ? "Empleado creado!" : "Empleado modificado correctamente");
            setSnackbarOpen(true);
        } catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };

    // --- SECCIÓN USUARIOS (ESTUDIANTES) ---
    const [usuariosRows, setUsuariosRows] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(false);

    const fetchUsuarios = useCallback(async () => {
        setLoadingUsuarios(true);
        try {
            const data = await ObtenerUsuarios();
            let userData = data.filter(item => item.id_perfil === 1); // Solo estudiantes
            setUsuariosRows(generateRows(userData));
        } catch {
            setUsuariosRows([]);
        } finally {
            setLoadingUsuarios(false);
        }
    }, []);

    useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

    const openCreateUsuarios = useCallback(() => {
        setDialogType("usuarios");
        setDialogMode("create");
        setDialogData({ id: "", legajo: "", nombre_usuario: "", nombres: "", apellidos: "", id_perfil: 1, activo: true, id_carrera: "", nombre_carrera: "" }); 
        setDialogError("");
        setTimeout(() => setDialogOpen(true), 0);
    }, []);

    const openEditUsuarios = useCallback((row) => {
        setDialogData({ id: row.id, legajo: row.legajo, nombre_usuario: row.nombre_usuario, nombres: row.nombres, apellidos: row.apellidos, id_perfil: row.id_perfil, activo: row.activo, id_carrera: row.id_carrera, nombre_carrera: row.nombre_carrera });
        setDialogType("usuarios");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);

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
            setDialogOpen(false);
            setDialogData(EMPTY_USUARIO);
            fetchUsuarios();
            setSnackbarMsg(dialogMode === "create" ? "Usuario creado!" : "Usuario modificado correctamente");
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
    }, []);
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
    }, [selectedEmploy,setSelectedHorarios]);

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
    const DAYS = [
        { label: "Lunes",     value: 1 },
        { label: "Martes",    value: 2 },
        { label: "Miércoles", value: 3 },
        { label: "Jueves",    value: 4 },
        { label: "Viernes",   value: 5 }
    ];
    // --- COLUMNAS MEMORIZADAS ---
    const empleadosColumns = useMemo(() => buildColumns(EMPTY_EMPLEADO, openEditEmpleados), [openEditEmpleados]);
    const usuariosColumns = useMemo(() => buildColumns(EMPTY_USUARIO, openEditUsuarios), [openEditUsuarios]);

    // Enrutador unificado para la acción "Guardar" según el tipo de diálogo activo
    const handleGlobalSave = async () => {
        if (dialogType === "empleados") {
            await handleEmpleadosSave();
        } else if (dialogType === "usuarios") {
            await handleUsuariosSave();
        }
    };

    return (
        <AdminUsersContext.Provider value={{

            //Valores crudos de los endpoings
            empleados,carreras,perfiles,allHorarios,
            //Valores para las tablas y funciones de guardado Empleados y Usuarios
            empleadosRows, empleadosColumns, loadingEmpleados, openCreateEmpleados,
            usuariosRows, usuariosColumns, loadingUsuarios, openCreateUsuarios,
            handleUsuariosSave,handleEmpleadosSave,handleGlobalSave,
            //Valores para la seccion de horarios
            loadingHorarios, horariosDialogOpen, setHorariosDialogOpen,selectedHorariosLoading,selectedHorarios,selectedEmploy,setSelectedEmploy,

            handleEmployChange,handleHorarioSaved,handleHorarioCreated,handleClose,showNuevoForm,setShowNuevoForm,form,setForm,handleChangeForm,DAYS,
            savingHorario,errorHorario,setErrorHorario,handleCreateHorario,handleEditHorario,handleDeleteHorario,handleCancelHorario,
            editingId, setEditingId,confirmDelete,deleteId,setDeleteId,setConfirmDelete,
            //Valores de error, mostrar mensajes, etc.
            snackbarOpen, setSnackbarOpen,snackbarMsg,setDialogError,
            dialogOpen, setDialogOpen, dialogData, setDialogData, dialogType, dialogMode, dialogError, dialogSaving
            
        }}>
            {children}
        </AdminUsersContext.Provider>
    );
};

export const useAdminUsers = () => {
    const context = useContext(AdminUsersContext);
    if (!context) throw new Error("useAdminUsers debe usarse dentro de AdminUsersProvider");
    return context;
};