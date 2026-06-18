import {useState, useEffect,useCallback,useMemo} from "react";
import { Box,IconButton,Chip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from '@mui/icons-material/Folder';
import Diversity3Icon from '@mui/icons-material/Diversity3';

import { TravelContext } from "../employedContext";

import { ObtenerUsuariosXLegajo } from "../../../api/EmpleadoService";

function ObtenerEmpresas() {
    return  [{ id: 1, nombre: "Empresa A", telefono: "123456789", email: "empresaA@example.com",cuit:"241412",cbu:"56116",activo:true },
            { id: 2, nombre: "Empresa B", telefono: "987654321", email: "empresaB@example.com",cuit:"412412",cbu:"412412",activo:true },
            { id: 3, nombre: "Empresa C", telefono: "555555555", email: "empresaC@example.com",cuit:"41251",cbu:"41251",activo:false }
    ];
}
function ObtenerViajes() {
    return [{
        id: 1,
        nombre: "Viaje a Bariloche",
        fecha_inicio: "2024-07-01",
        fecha_fin: "2024-07-10",
        seguro: true,
        origen: "Cordoba - Olmos",
        destino: "Bariloche",
        motivo:"Viaje de Quimica",
        cantidad_personas: 40,
        id_empresa: 1,
        nombre_empresa:"Empresa A",
        costo_total: 50000
    }
    ,{
        id: 2,
        nombre: "Viaje a Mendoza",
        fecha_inicio: "2024-08-01",
        fecha_fin: "2024-08-10",
        seguro: true,
        origen: "Cordoba - Olmos",
        destino: "Mendoza",
        motivo:"Viaje de Geografia",
        cantidad_personas: 30,
        id_empresa: 2,
        nombre_empresa:"Empresas B",
        costo_total: 40000
    }]
}
function ObtenerInscriptos(idViaje){
    if(idViaje){
        return [{
            id:0,
            id_viaje:1,
            nombre_viaje:"Viaje a Bariloche",
            legajo_estudiante:"83464@sistemas.frc.utn.edu.ar",
            nombre_estudiante:"Bergesio, Genaro Rafael",
            documentacion_aprobada: true
        },
        {
            id:1,
            id_viaje:1,
            nombre_viaje:"Viaje a Bariloche",
            legajo_estudiante:"82146@civil.frc.utn.edu.ar",
            nombre_estudiante:"Cravero, Sabrina de Lourdes",
            documentacion_aprobada: false
        }]
    }
    else{
        return[{
            id:3,
            id_viaje:2,
            nombre_viaje:"Viaje a Mendoza",
            legajo_estudiante:"82440@sistemas.frc.utn.edu.ar",
            nombre_estudiante:"Villarruel, Juan Cruz",
            documentacion_aprobada: false
        },
        {
            id:4,
            id_viaje:2,
            nombre_viaje:"Viaje a Mendoza",
            legajo_estudiante:"81146@industrial.frc.utn.edu.ar",
            nombre_estudiante:"Haro, Jazmín",
            documentacion_aprobada: false
        }]
    }
}
const EMPTY_BUSSINESS = {
    id: null,
    nombre: "",
    telefono: "",
    email: "",
    cuit:"",
    cbu:"",
    activo:false
}
const EMPTY_VIAJES ={
    id: null,
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
    seguro: false,
    origen: "",
    destino: "",
    cantidad_personas: 0,
    nombre_empresa:"",
    costo_total: 0,
}
const EMPTY_DOCUMENTACION_VIAJE = {
    id: null,
    nombre: "",
    datos:"",
    ruta:"",
}
const EMPTY_INSCRIPTOS_VIAJE = {
    id: null,
    id_viaje: null,
    legajo_estudiante:null,
    nombre: ""
}
const EMPTY_DOCUMENTACION_ESTUDIANTE = {
    id: null,
    nombre: "",
    datos:"",
    ruta:"",
}

const formatHeader = (key) =>
key
    .replaceAll("_", " ")
    .replace(/\b\w/g, l => l.toUpperCase());

// Definición de tipos sugerida (si usas TypeScript)
// type ActionConfig = {
//   icon: React.ElementType;
//   color: 'primary' | 'secondary' | 'error' | 'inherit' | 'default';
//   title: string;
//   onClick: (row: any) => void;
// };

const generateColumns = (data, actionsConfig = []) => {
 const sample =
    Array.isArray(data)
      ? data[0]
      : data;

  if (!sample) return [];

  const columns = Object.keys(sample).map((key) => {
    // Nota: Se asume que data es un array, por eso data[0] para las keys
    const isId = key.toLowerCase().includes("id");
    const isShort = ["estado", "cupo", "duracion", "horario_inicio", "horario_fin"].includes(key.toLowerCase());
    
    if (key.toLowerCase() === "activo" ) {
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
    } 
    else if (key.toLowerCase() === "seguro"){
     return {
        field: "seguro",
        headerName: "Seguro",
        align: "center",
        headerAlign: "center",
        width: 100,
        renderCell: (params) => (
            <Chip
                size="small"
                label={params.value ? "Tiene" : "Falta"}
                color={params.value ? "success" : "default"}
            />
        )
        };       
    }
    else {
        return {
            field: key,
            headerName: formatHeader(key),
            flex: isId ? 0.4 : 1,
            minWidth: isId || isShort? 50 : 120,
            maxWidth: isId ? 70 : isShort ? 100 : NaN,
            align: isId || isShort ? "center" : "left",
            headerAlign: isId || isShort ? "center" : "left",
        };
    }
  });

  if (actionsConfig !== null && actionsConfig.length > 0) {
    columns.push({
      field: "actions",
      headerName: "Acciones",
      headerAlign:"center",
      sortable: false,
      filterable: false,
      minWidth:60 * actionsConfig.length,
      maxWidth: 65 * actionsConfig.length,
      renderCell: (params) => (
        <Box sx={{display:"block",textAlign:"center"}}>
          {actionsConfig.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <IconButton
                key={index}
                size="small"
                color={action.color || "primary"}
                title={action.title}
                onClick={() => action.onClick(params.row)}
              >
                <IconComponent fontSize="small" />
              </IconButton>
            );
          })}
        </Box>
      ),
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
export function TravelProvider({ children }){
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const [inscriptsTravel,setInscriptsTravel] = useState(null);
    const [loadingInscripts,setLoadingInscripts] = useState(false);
    const fetchInscriptosXTravel = useCallback(async (idViaje) => {
        if (!idViaje) return; 
        setLoadingInscripts(true);
        try {
            const data = ObtenerInscriptos(idViaje);
            setInscriptsTravel(data);
        } catch {
            setInscriptsTravel([]);
            setDialogError("Inscriptos no encontrados")
        }
        finally{
            setLoadingInscripts(false)
        }
    }, [])
    
    useEffect(() => { fetchInscriptosXTravel(); }, [fetchInscriptosXTravel]);

    const [bussiness, setBussiness] = useState([]);
    const [bussinessRows, setBussinessRows] = useState([]);
    const [loadingBussiness, setLoadingBussiness] = useState(true);
    const fetchBussiness = useCallback(async () => {
        setLoadingBussiness(true);
        try {
            const data = await ObtenerEmpresas(); 
            setBussiness(data);
            setBussinessRows(generateRows(data));
        } catch {
            setBussiness([]);
            setBussinessRows([]);
        } finally {
            setLoadingBussiness(false);
        }
    }, []);
    useEffect(() => {
        fetchBussiness();
    }, [fetchBussiness]);

    const openCreateBussiness = () => {
        setDialogData(EMPTY_BUSSINESS);
        setDialogType("bussiness");
        setDialogMode("create");
        setDialogError("");
        setDialogOpen(true);
    };

    const openEditBussiness = useCallback((row) => {
        setDialogData(row);
        setDialogType("bussiness");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);

    const handleOpenEditBussiness = useCallback((row) => {
    openEditBussiness(row);
    }, [openEditBussiness]);

    const handleBussinessSave  = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
            //Evento del Body
            setDialogOpen(false);
            setDialogData(EMPTY_BUSSINESS);
            setSnackbarMsg(dialogMode === "create"? "Empresa creada!":"Empresa Modificada!");
            setSnackbarOpen(true);
        }
        catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };
    const [travels, setTravels] = useState([]); 
    const [travelsRows, setTravelsRows] = useState([]);
    const [loadingTravels, setLoadingTravels] = useState(true);
    const fetchTravels = useCallback(async () => {
        setLoadingTravels(true);
        try {
             const data = await ObtenerViajes(); 
             setTravels(data);
            const datosLimpios = data.map(viaje => {
            const { motivo, id_empresa, ...resto } = viaje;
                if(motivo!==id_empresa)//Lo puse porque no me gusta que salga el error de variable no usada
                    return resto;
            });
            setTravelsRows(generateRows(datosLimpios));
        } catch {
            setTravels([]);
            setTravelsRows([]);
        } finally {
            setLoadingTravels(false);
        }
    }, []);
    useEffect(() => {
        fetchTravels();
    }, [fetchTravels]);

    const openCreateTravels = () => {
        setDialogData(EMPTY_VIAJES);
        setDialogType("travels");
        setDialogMode("create");
        setDialogError("");
        setDialogOpen(true);
    };

    const openEditTravels = useCallback((row) => {
        const viajeEncontrado = travels.find(viaje => viaje.id === Number(row.id));
        if(!viajeEncontrado) return;
        console.log("Entra");
        setDialogData(viajeEncontrado);
        setDialogType("travels");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, [travels]);

    const openSeeDocTravels = useCallback((row) => {
        setDialogData(row);
        setDialogType("documents");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);

    const openInscripTravels = useCallback((row) => {
        setDialogData(row);
        fetchInscriptosXTravel(Number(row.id));
        setDialogType("inscriptions");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, [fetchInscriptosXTravel]);
    const handleOpenEditTravels = useCallback((row) => {
    openEditTravels(row);
    }, [openEditTravels]);

    const handleOpenSeeDocTravels = useCallback((row) => {
    openSeeDocTravels(row);
    }, [openSeeDocTravels]);

    const handleOpenInscripTravels = useCallback((row) => {
    openInscripTravels(row);
    }, [openInscripTravels]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(""); 
    const [dialogMode, setDialogMode] = useState("create");
    const [dialogData, setDialogData] = useState(EMPTY_VIAJES);
    const [dialogSaving, setDialogSaving] = useState(false);
    const [dialogError, setDialogError] = useState("");

    const bussinessActions = useMemo(() => [{
    icon: EditIcon,
    color: "primary",
    title: "Editar Empresa",
    onClick: handleOpenEditBussiness, 
    }], [handleOpenEditBussiness]);

    const travelsActions = useMemo(() => [
    {
        icon: EditIcon,
        color: "primary",
        title: "Editar Viaje",
        onClick: handleOpenEditTravels,
    },
    {
        icon: FolderIcon,
        color: "primary",
        title: "Documentacion",
        onClick: handleOpenSeeDocTravels,
    },
    {
        icon: Diversity3Icon,
        color: "primary",
        title: "Inscriptos",
        onClick: handleOpenInscripTravels,
    }
    ], [handleOpenEditTravels, handleOpenSeeDocTravels, handleOpenInscripTravels]);
    
    const bussinessColumns = useMemo(() => {
    return generateColumns(EMPTY_BUSSINESS, bussinessActions);
    }, [ bussinessActions]); 

    const travelsColumns = useMemo(() => {
    return generateColumns(EMPTY_VIAJES, travelsActions);
    }, [ travelsActions]);

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

    const handleAddIncriptos = useCallback(() => {
        if (!usuarioSelected) return;
        
        const inscript = {
            id: Date.now(), // ID Único
            id_viaje: dialogData.id,
            legajo_estudiante: usuarioSelected.legajo,
            nombre_estudiante: usuarioSelected.nombre_usuario,
            documentacion_aprobada: false
        };

        setInscriptsTravel((listaActual) => [...listaActual, inscript]);
        setUsuarioSelected(null);
    }, [dialogData, usuarioSelected]);

    const handleRemoveInscriptos = useCallback((idEliminar) => {
        setInscriptsTravel((prev) => prev.filter((inscript) => inscript.id !== idEliminar));
    }, [setInscriptsTravel]);

    const handleUpdateInscriptos = useCallback((inscript) => {
        console.log("Actualiza: ",inscript);
        //Lo haria que siempre sincronice con la base
    }, []);

    return (
    <TravelContext.Provider
        value={{
        snackbarOpen,setSnackbarOpen,
        snackbarMsg,setSnackbarMsg,

        bussiness,bussinessRows, setBussinessRows,
        loadingBussiness, setLoadingBussiness,bussinessColumns,
        fetchBussiness,openCreateBussiness,handleBussinessSave,

        travels,travelsRows, setTravelsRows,
        loadingTravels, setLoadingTravels,travelsColumns,
        fetchTravels,openCreateTravels,

        usuarioSelected,setUsuarioSelected,loadingUsuario,fetchUsuariosXlegajo,
        inscriptsTravel,setInscriptsTravel,loadingInscripts,fetchInscriptosXTravel,

        handleAddIncriptos,handleRemoveInscriptos,handleUpdateInscriptos,

        dialogOpen, setDialogOpen,
        dialogType, setDialogType,
        dialogMode, setDialogMode,
        dialogData, setDialogData,
        dialogSaving, setDialogSaving,
        dialogError, setDialogError,
            
        }}
    >
        {children}
    </TravelContext.Provider>
    );
}