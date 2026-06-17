import {useState, useEffect,useCallback,useMemo} from "react";
import { Box,IconButton,Chip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from '@mui/icons-material/Folder';

import {PurchaseContext} from "../employedContext";

function ObtenerPurchases() {
    return  [{ id: 0,
            id_usuario_empleado:0,
            nombre_empleado: "Genaro Rafael Bergesio",
            nombre_compra: "Sillas para la oficina",
            precio_sugerido:500000,
            motivo:"Estaba en mal estado las sillas de la oficina",
            informe_tecnico:{
                id_informe: 1,
                id_compra: 0,
                precio_real:600000,
                fecha_licitacion:'2026-01-01',
                fecha_informe:'2026-02-01',
                nombre_solicitante:"Marcos",
                nombre_ganador: "Ciccone Calcograficas"
            }}
    ];
}

const EMPTY_PURCHASES = {
    id: null,
    id_usuario_empleado:null,
    nombre_empleado: "",
    nombre_compra: "",
    precio_sugerido:"",
    motivo:"",
    informe_tecnico:{
        id_informe: null,
        id_compra: null,
        precio_real:0,
        fecha_licitacion:null,
        fecha_informe:null,
        nombre_solicitante:"",
        nombre_ganador: ""
    }
}
const formatTime = (time) => {
     return time ? (time.endsWith("hs") ? time.replace("hs", ":00") : `${time}:00`) : time;
 };
 
const formatHeader = (key) =>
key
    .replaceAll("_", " ")
    .replace(/\b\w/g, l => l.toUpperCase());

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
                label={params.value ? "Presen" : "Falta"}
                color={params.value ? "success" : "default"}
            />
        )
        };       
    }
    else {
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

  // 👉 Columna de acciones dinámica
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

export function PurchaseProvider({ children }){
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const [purchasesRows, setPurchaseRows] = useState([]);
    const [loadingPurchase, setLoadingPurchase] = useState(true);

    const fetchPurchases = useCallback(async () => {
        setLoadingPurchase(true);
        try {
            const data = await ObtenerPurchases();    
            setPurchaseRows(generateRows(data));
        } catch {
            setPurchaseRows([]);
        } finally {
            setLoadingPurchase(false);
        }
    }, []);
    useEffect(() => {
        fetchPurchases();
    }, [fetchPurchases]);

    const openCreatePurchases = () => {
        setDialogData(EMPTY_PURCHASES);
        setDialogType("purchases");
        setDialogMode("create");
        setDialogError("");
        setDialogOpen(true);
    };

    const openEditPurchases = useCallback((row) => {
        setDialogData(row);
        setDialogType("purchases");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);

    const handleOpenEditPurchases = useCallback((row) => {
    openEditPurchases(row);
    }, [openEditPurchases]);

    const openEditDocs = useCallback((row) => {
        setDialogData(row);
        setDialogType("docs");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, []);

    const handleOpenEditDocs = useCallback((row) => {
    openEditDocs(row);
    }, [openEditDocs]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(""); 
    const [dialogMode, setDialogMode] = useState("create");
    const [dialogData, setDialogData] = useState(EMPTY_PURCHASES);
    const [dialogSaving, setDialogSaving] = useState(false);
    const [dialogError, setDialogError] = useState("");

    const handlePurchasesSave  = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
        
            setDialogOpen(false);
            setDialogData(EMPTY_PURCHASES);
            fetchInteresados();
            setSnackbarMsg(dialogMode === "create"? "Compra creada!":"Compra Modificada!");
            setSnackbarOpen(true);
        }
        catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };

    const purchasesActions = useMemo(() => [{
        icon: EditIcon,
        color: "primary",
        title: "Editar Compra",
        onClick: handleOpenEditPurchases
        },
    {icon: FolderIcon,
        color: "primary",
        title: "Documentacion",
        onClick: handleOpenEditDocs}], [handleOpenEditPurchases,handleOpenEditDocs]);

    const purchasesColumns = useMemo(() => {
        return generateColumns(EMPTY_PURCHASES, purchasesActions);
        }, [EMPTY_PURCHASES, purchasesActions]); 

    return (
        <PurchaseContext.Provider
            value={{
            snackbarOpen,setSnackbarOpen,
            snackbarMsg,setSnackbarMsg,

            purchasesRows,purchasesColumns,loadingPurchase,
            fetchPurchases,openCreatePurchases,handlePurchasesSave,
    
            dialogOpen, setDialogOpen,
            dialogType, setDialogType,
            dialogMode, setDialogMode,
            dialogData, setDialogData,
            dialogSaving, setDialogSaving,
            dialogError, setDialogError,
                
            }}
        >
            {children}
        </PurchaseContext.Provider>
    );
}