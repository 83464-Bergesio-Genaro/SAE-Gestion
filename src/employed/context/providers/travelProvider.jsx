import {useState, useEffect,useCallback,useMemo,useRef} from "react";
import { Box,IconButton,Chip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from '@mui/icons-material/Folder';
import Diversity3Icon from '@mui/icons-material/Diversity3';

import { TravelContext } from "../employedContext";

import { ObtenerUsuariosXLegajo } from "../../../api/EmpleadoService";
import { ObtenerEmpresas,ObtenerViajesActivos,ObtenerInscriptosViaje, EliminarInscriptosViaje, CrearInscriptoViaje, 
    ModificarInscripto, CrearEmpresa, ModificarEmpresa, CrearViaje, ModificarViaje, ObtenerDocumentacionViaje, 
    DescargarDocumentacionXId, EliminarDocumentoViaje, 
    CrearDocumentoViaje,
    listarDocumentacionXLegajo} from "../../../api/TravelService";
import { mapViajes } from "../../../api/formatters/ViajeFormatter";
import { useNavigate } from "react-router-dom";
import { obtenerTiposDocumento } from "../../../api/HerramientasService";

const EMPTY_BUSSINESS = {
    id: "-1",
    nombre: "",
    contacto: "",
    email: "",
    cuit:"",
    cbu:"",
    activo:true
}
const EMPTY_VIAJES ={
    id: "-1",
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
    seguro: false,
    origen: "",
    destino: "",
    cantidad_personas: 0,
    nombre_empresa:"",
    costo_aproximado: 0,
}
const EMPTY_VIAJES_FORM ={
    id: "-1",
    nombre: "",
    fecha_inicio: "",
    fecha_fin: "",
    seguro: false,
    origen: "",
    destino: "",
    cantidad_personas: 0,
    id_empresa_viaje:-1,
    nombre_empresa:"",
    costo_aproximado: 0,
    motivo:""
}
const EMPTY_DOCUMENTACION_VIAJE = {
    id: "-1",
    nombre: "",
    datos:"",
    ruta:"",
}

const EMPTY_DOCUMENTACION_ESTUDIANTE = {
    id: "-1",
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
const checkAndCleanDialogData = (data) => {

    if (!data) return { isValid: false, cleanedData: {} };

    const cleanedData = Object.fromEntries(
        Object.entries(data).filter((entry) => entry[1] !== "" && entry[1] !== null)
    );
    const isValid = Object.keys(cleanedData).length > 0;

    return { isValid, cleanedData };
};

export function TravelProvider({ children }){
    const navigate = useNavigate();

    const [travelData, setTravelData] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    const [inscriptsTravel,setInscriptsTravel] = useState(null);
    const [loadingInscripts,setLoadingInscripts] = useState(false);
    const fetchInscriptosXTravel = useCallback(async (idViaje) => {
        
        if (!idViaje) return; 
        setLoadingInscripts(true);
        try {
            const data = await ObtenerInscriptosViaje(idViaje);
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
            const { isValid, cleanedData } = checkAndCleanDialogData(dialogData);

            // Si el booleano es falso, cortamos la ejecución aquí
            if (!isValid) {
                setDialogError("Ocurrió un error al guardar la empresa");
                return; 
            }


            const { id, ...rest } = cleanedData;
            let id_nuevo = id ===""? 0:id;
            
            const body = {
                    ...rest,
                    id: id_nuevo
                };
                
            if (dialogMode === "create")
            {
                await CrearEmpresa(body);
            }
            else{
                await ModificarEmpresa(id_nuevo,body);
            }
            fetchBussiness();
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
             let data = await ObtenerViajesActivos(); 
             data = data.map(mapViajes);
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
        setDialogData(EMPTY_VIAJES_FORM);
        setDialogType("travels");
        setDialogMode("create");
        setDialogError("");
        setDialogOpen(true);
    };

    const openEditTravels = useCallback((row) => {
        const viajeEncontrado = travels.find(viaje => viaje.id === Number(row.id));
        if(!viajeEncontrado) return;

        setDialogData(viajeEncontrado);
        setDialogType("travels");
        setDialogMode("edit");
        setDialogError("");
        setDialogOpen(true);
    }, [travels]);

    const fetchDocsXTravel = useCallback(async (row) => {
            setLoadingViajeDocs(true);
            try {
                const data = await ObtenerDocumentacionViaje(row.id);
                setDocsViajeList(data);
            } catch {
                setDocsViajeList([]);
            } finally {
                setLoadingViajeDocs(false);
            }
        }, []);
        useEffect(() => {
            fetchDocsXTravel();
        }, [fetchDocsXTravel]);

    const [docsViaje, setDocsViaje] = useState("");
    const [docsViajeList, setDocsViajeList] = useState([]);
    const [loadingViajeDocs, setLoadingViajeDocs] = useState(false);
    const [downloadingDocId, setDownloadingDocId] = useState(null);

    const openSeeDocTravels = useCallback(async(row) => {
        setDialogOpen(true);
        setLoadingViajeDocs(true);
        setDocsViaje(row);
        setDialogError("");
        setDialogType("documents");
        try {
            await fetchDocsXTravel(row);

        } catch (err) {
            setDialogError(err.message || "Error al cargar documentación");
        } finally {
            setLoadingViajeDocs(false);
        }
        
    }, [fetchDocsXTravel]);
    
    const handleTravelSave  = async () => {
        setDialogSaving(true);
        setDialogError("");
        try {
            const { isValid, cleanedData } = checkAndCleanDialogData(dialogData);

            // Si el booleano es falso, cortamos la ejecución aquí
            if (!isValid) {
                setDialogError("Ocurrió un error al guardar el viaje");
                return; 
            }

            const { id,seguro, ...rest } = cleanedData;
            let id_nuevo = id ===""? 0:id;
            
            const body = {
                    ...rest,
                    id: id_nuevo,
                    seguro_confirmado:seguro,
                    fecha_inicio: cleanedData.fecha_inicio
                    ? `${cleanedData.fecha_inicio}T00:00:00`:new Date(),
                    fecha_fin: cleanedData.fecha_fin
                    ? `${cleanedData.fecha_fin}T00:00:00`:new Date()
                };

            if (dialogMode === "create")
            {
                await CrearViaje(body);
            }
            else{
                await ModificarViaje(id_nuevo,body);
            }
            fetchTravels();
            setDialogOpen(false);
            setDialogData(EMPTY_VIAJES_FORM);
            setSnackbarMsg(dialogMode === "create"? "Viaje creado!":"Viaje Modificado!");
            setSnackbarOpen(true);
        }
        catch (err) {
            setDialogError(err.message || "Ocurrió un error al guardar");
        } finally {
            setDialogSaving(false);
        }
    };

    const openInscripTravels = useCallback((row) => {
        localStorage.setItem("selectedTravel", JSON.stringify(row));
        navigate("/Gestion-Viajes/Inscriptos");
        
    }, [navigate]);
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

    const handleAddIncriptos  = async () => {
        
        if(travelData && usuarioSelected){
            setLoadingInscripts(true);
            try {
                
                const body = {
                    id: 0,
                    id_viaje: travelData.id,
                    legajo_estudiante: usuarioSelected.legajo,
                    nombre_estudiante: "",
                    documentacion_presentada: false
                };
                await CrearInscriptoViaje(body);
                setUsuarioSelected(null);
                await fetchInscriptosXTravel(travelData.id);
                setSnackbarMsg("Se inscribio esta persona al viaje");
                setSnackbarOpen(true);
                setLoadingInscripts(false);
        }
            catch (err) {
                setSnackbarMsg(err.message || "Ocurrió un error al guardar");
            } finally {
                setDialogSaving(false);
            }
        };
    }

    const [inscriptToDelete,setInscriptToDelete] = useState(null);

    const handleClickRemove  = useCallback((estudiante) =>{
        setInscriptToDelete(estudiante);
        setDialogType("inscript");
        setDialogMode("delete");
        setDialogError("");
        setDialogOpen(true);        
    }, []);
 
    const handleDeleteInscript  = async () => {
        if(travelData&&inscriptToDelete){
            setDialogSaving(true);
            setDialogError("");
            try {
                let res = await EliminarInscriptosViaje(inscriptToDelete.id);
                if(res.ok){
                    await fetchInscriptosXTravel(travelData.id);
                    setDialogOpen(false);
                    setUsuarioSelected(null);
                    setSnackbarMsg("Se elimino el estudiante");
                    setSnackbarOpen(true);
                }
                else{
                    setDialogError("Ocurrio un error al intentar eliminar este inscripto");
                }
            }
            catch (err) {
                setDialogError(err.message || "Ocurrió un error al guardar");
            } finally {
                setDialogSaving(false);
            }
        }
        else{
            setDialogError("Ocurrio un error no contemplado");
        }
    };  
    const handleUpdateInscriptos = async (estudiante) => {
        if(travelData && estudiante?.id){
            setDialogSaving(true);
            setDialogError("");
            try {
                await ModificarInscripto(estudiante.id,estudiante);
                
                setUsuarioSelected(null);
                setSnackbarOpen(true);
                setSnackbarMsg("Actualizado!");
            }
            catch (err) {
                setDialogError(err.message || "Ocurrió un error actualizar");
            } finally {
                setDialogSaving(false);
            }
        }
        else{
            setDialogError("Ocurrio un error no contemplado");
        }
    };
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState("");
    const [previewSrc, setPreviewSrc] = useState(null);
    const [previewIsPdf, setPreviewIsPdf] = useState(false);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [previewError, setPreviewError] = useState("");
    const [previewDocRef, setPreviewDocRef] = useState(null);

    const handlePreviewDoc = useCallback(async (doc) => {
        setPreviewTitle(doc.nombre_documento);
        setPreviewSrc(null);
        setPreviewError("");
        setPreviewIsPdf(false);
        setPreviewDocRef(doc);
        setLoadingPreview(true);
        setPreviewOpen(true);
        try {
        const data = await DescargarDocumentacionXId(doc.id);
        const fetched = Array.isArray(data) ? data[0] : data;
        const ext = (fetched.extension || doc.extension || "").toLowerCase();
        // Si datos_documento ya es un dataURL (comienza con data:), usarlo como está
        // Si no, es base64, convertirlo a dataURL
        let src = fetched.datos_documento;
        if (!src.startsWith("data:")) {
            const mimeMap = {
            pdf: "application/pdf",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            webp: "image/webp",
            };
            const mime = mimeMap[ext] || "application/octet-stream";
            src = `data:${mime};base64,${src}`;
        }
        setPreviewSrc(src);
        setPreviewIsPdf(ext === "pdf");
        } catch (err) {
            setDialogError("Ocurrio un error al tratar de descargar el documento");
        setPreviewError(err.message || "Error al cargar el documento");
        } finally {
        setLoadingPreview(false);
        }
    }, []);

    const handleDownloadDoc = useCallback(
        async (id, nombreDocumento, extension) => {
        setDownloadingDocId(id);
        try {
            const data = await DescargarDocumentacionXId(id);
            const doc = Array.isArray(data) ? data[0] : data;
            let base64 = doc.datos_documento;

            // Si es un dataURL (comienza con data:), extraer la parte base64
            if (base64.startsWith("data:")) {
            base64 = base64.split(",")[1];
            }

            const byteChars = atob(base64);
            const byteArray = new Uint8Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) {
            byteArray[i] = byteChars.charCodeAt(i);
            }
            const blob = new Blob([byteArray]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${doc.nombre_documento || nombreDocumento}.${doc.extension || extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error al descargar documento:", err);
            setDialogError("Ocurrio un error al tratar de descargar el documento");
        } finally {
            setDownloadingDocId(null);
        }
        },
        [],
    );
    const [openPopup, setOpenPopup] = useState(false);
    const [documentoAEliminar, setDocumentoAEliminar] = useState(null);
    
    const requestDeleteDocument = (documento) => {
        setDocumentoAEliminar(documento);
        setOpenPopup(true);
    };

    const handleDelete = async () => {
        try {
            if(!documentoAEliminar)return;
            await EliminarDocumentoViaje(documentoAEliminar.id);
            setOpenPopup(false);
            setLoadingViajeDocs(true);
            await fetchDocsXTravel(docsViaje);

            setSnackbarMsg("Documento Eliminado");
        } catch  {

            setSnackbarMsg("Error al eliminar el documento");
            
        } finally {
            setSnackbarOpen(true);
            setLoadingViajeDocs(false);
        }
    };
    const [selectedTypeDoc,setTypeDoc] = useState(null);
    const [travelNewFile, setTravelNewFile] = useState(null);
    const fileInputRef = useRef(null);
    const [documentTypes,setDocumentTypes]= useState(null);

    const fetchTiposDocumento = useCallback(async () => {
        try {
            const data = await obtenerTiposDocumento();
            setDocumentTypes(data);
        } catch {
            console.log("No se pudieron recuperar los tipos de Documento");
            setDocumentTypes(null);
        }
    }, [])

    useEffect(() => { fetchTiposDocumento(); }, [fetchTiposDocumento]);

    const handleArchivoChange = async (idType) => {
        const documentType = documentTypes.find(type => type.id === Number(idType.id));
        if(!documentType) return;

        if (!docsViaje||!travelNewFile || !documentType) return;

        const extension = `.${travelNewFile.name.split(".").pop().toLowerCase()}`;
        const allowedExtensions = (documentType.extension ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase());

        if (!allowedExtensions.includes(extension)) {
            setSnackbarMsg(`Solo se permiten archivos: ${documentType.extension}`, "warning");
            setSnackbarOpen(true);
            return;
        }
        const fileName =`${documentType.nombre.replace(/\s/g, "_")}${extension}`

        const renamedFile = new File([travelNewFile], fileName, {
            type: travelNewFile.type,
            lastModified: travelNewFile.lastModified,
        });

        try {
            setLoadingViajeDocs(true);
        
        const savedFile = await CrearDocumentoViaje(
            docsViaje.id,
            documentType.id,
            renamedFile,
        );

            await fetchDocsXTravel(docsViaje);
        
            setSnackbarMsg("Archivo ",savedFile.nombre_documento," subido con éxito");
            setTravelNewFile(null);
            setTypeDoc(null);

        } catch (error) {
            console.error("Error al subir el archivo:", error);
            setSnackbarMsg("Error al subir el archivo", "error");
        } finally {
            setSnackbarOpen(true);
            setLoadingViajeDocs(false);
        }
    };
    const [seletedInscripts, setSeletedInscripts] =useState(null);
    const [docsInscript, setDocsInscript] = useState("");
    const [loadingInscriptDocs, setLoadingInscriptDocs] = useState(false);

    const fetchDocsXInscript = useCallback(async (row) => {
            setLoadingInscriptDocs(true);
            try {
                const data = await listarDocumentacionXLegajo(row.legajo_estudiante);
                setDocsInscript(data);
            } catch {
                setDocsInscript([]);
            } finally {
                setLoadingInscriptDocs(false);
            }
        }, []);
        useEffect(() => {
            fetchDocsXTravel();
        }, [fetchDocsXTravel]);

    const openSeeDocInscript = useCallback(async(row) => {
        setDialogOpen(true);
        console.log(row);
        setSeletedInscripts(row);
        setDialogError("");
        setDialogType("documents");
        try {
            await fetchDocsXInscript(row);

        } catch (err) {
            
            setDialogError(err.message || "Error al cargar documentación");
        }
    }, [fetchDocsXInscript]);

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
        fetchTravels,openCreateTravels,handleTravelSave,

        usuarioSelected,setUsuarioSelected,loadingUsuario,fetchUsuariosXlegajo,
        inscriptsTravel,setInscriptsTravel,loadingInscripts,fetchInscriptosXTravel,

        handleAddIncriptos,handleDeleteInscript,handleUpdateInscriptos,handleClickRemove,

        docsInscript,loadingInscriptDocs,openSeeDocInscript,seletedInscripts, setSeletedInscripts,

        dialogOpen, setDialogOpen,
        dialogType, setDialogType,
        dialogMode, setDialogMode,
        dialogData, setDialogData,
        dialogSaving, setDialogSaving,
        dialogError, setDialogError,

        travelData, setTravelData,documentTypes,selectedTypeDoc,setTypeDoc,

        docsViaje,docsViajeList,loadingViajeDocs,downloadingDocId,setDownloadingDocId,
        openPopup,setOpenPopup,documentoAEliminar,requestDeleteDocument,handleDelete,
        
        travelNewFile, setTravelNewFile,fileInputRef,handleArchivoChange,

        handlePreviewDoc,handleDownloadDoc,
        previewOpen,setPreviewOpen,
        previewTitle, setPreviewTitle,
        previewSrc, setPreviewSrc,
        previewIsPdf, setPreviewIsPdf,
        loadingPreview, setLoadingPreview,
        previewError, setPreviewError,
        previewDocRef, setPreviewDocRef
        }}
    >
        {children}
    </TravelContext.Provider>
    );
}