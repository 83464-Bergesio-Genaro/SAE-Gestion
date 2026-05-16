import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Box, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {ObtenerEspecialidades ,ObtenerEstadosTurno} from "../../../api/SaludService";


const HealthUserContext = createContext();

    const EMPTY_ESPECIALIDAD = 
    {
        id: 0,
        nombre: "string",
        descripcion: "string",
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


const HealthContext = createContext();

export const AdminUsersProvider = ({ children }) => {
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
            setEstados(data);
            
        } catch {
            setEstados([]);
        } 
    }, []);

    useEffect(() => {
        fetchEstadosTurno();
    }, [fetchEstadosTurno]);


    const handleEditHorario = async () => {
        //El try catch evita un error?

        try {
        } catch (err) {
           
        } finally {
            
        }
    };
   
    return (
        <HealthUserContext.Provider value={{
            //Valores crudos de los endpoints
            estadosTurno,
            
            //Horarios
            horariosDialogOpen, setHorariosDialogOpen,handleEditHorario,
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