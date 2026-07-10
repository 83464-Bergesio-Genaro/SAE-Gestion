import { useState,useEffect,useCallback } from "react";
import { TravelContext } from "../studentContext";
import { DescargarDocumentacionXId, ObtenerViajesXLegajo } from "../../../api/TravelService";
import { mapViajes } from "../../../api/formatters/ViajeFormatter";
import { useAuth, useNotification } from "../../../shared/context/sharedContext";
import { crearDocumentoEstudiante } from "../../../api/DeporteService";
import {
  closePreview as closePreviewState,
  construirNombre,
  INITIAL_PREVIEW,
  isPdfDocument,
} from "../../../utils/util.jsx";

import { MAX_FILE_SIZE_BYTES,MAX_FILE_SIZE_MB } from "../../../utils/gena/constants.js";
import { TRIPS_STRINGS } from "../../../utils/gena/student.string.js";
import { TRAVEL_REQUIRED_DOCUMENTS } from "../../../utils/gena/common.config.js";
const C = TRIPS_STRINGS;

export const TravelProvider = ({ children }) => {
    const { user } = useAuth();
    const {showNotification} = useNotification();

    const closePreview = () =>
        closePreviewState(setPreview);

    const closeDeleteDialog = () => setOpenPopup(false);

    const [travelsLegajo,setTravelsLegajo] = useState([]);
    const [loadingTravel,setLoadingTravel] = useState(false);

    const fetchTravelsLegajo = useCallback(async (legajo) => {
        if(!legajo)return;
        setLoadingTravel(true);
        try {
            const data = await ObtenerViajesXLegajo(legajo);    
            setTravelsLegajo(data.map(mapViajes));
        } catch {
            setTravelsLegajo([]);
        } 
        finally{
            setLoadingTravel(false);
        }
    }, []);

    useEffect(() => {
        fetchTravelsLegajo();
    }, [fetchTravelsLegajo]);
    const [preview, setPreview] = useState(INITIAL_PREVIEW);
    const [openPopup, setOpenPopup] = useState(false);
    const [documentoAEliminar, setDocumentoAEliminar] = useState(null);

    const handlePreview = async (id, nombre) => {
        setPreview({
        open: true,
        loading: true,
        title: nombre,
        imageSrc: null,
        isPdf: false,
        error: null,
        });

        try {
        const data = await DescargarDocumentacionXId(id);
        setPreview({
            open: true,
            loading: false,
            title: nombre,
            imageSrc: data.datos_documento,
            isPdf: isPdfDocument(data),
            error: null,
        });
        } catch {
        setPreview((previous) => ({
            ...previous,
            loading: false,
            error: C.errorLoadingDocuments,
        }));
        }
    };

  const [documentos, setDocumentos] = useState(() =>
    TRAVEL_REQUIRED_DOCUMENTS.map((documento) => ({ ...documento })),
  );
  const [loadingDocuments, setLoadingDocuments] = useState(true);

 const handleArchivoChange = async (event, item) => {
     const file = event.target.files?.[0];
     if (!file) return;
 
     const extension = `.${file.name.split(".").pop().toLowerCase()}`;
     const allowedExtensions = (item.extension ?? "")
       .split(",")
       .map((value) => value.trim().toLowerCase());
 
     if (!allowedExtensions.includes(extension)) {
       showNotification(`${C.errorExtensionMsg} ${item.extension}`, "warning");
       event.target.value = "";
       return;
     }
 
     if (file.size > MAX_FILE_SIZE_BYTES) {
       showNotification(
         `${C.errorMaxMBMsg}${MAX_FILE_SIZE_MB} MB.`,
         "warning",
       );
       event.target.value = "";
       return;
     }
 
     const fileName = construirNombre(
       item.formatoNombre,
       { legajo: user.legajo },
       extension,
     );
     const renamedFile = new File([file], fileName, {
       type: file.type,
       lastModified: file.lastModified,
     });
 
     try {
       setLoadingDocuments(true);
       const savedFile = await crearDocumentoEstudiante(
         item.id_tipo_documento,
         renamedFile,
       );
       setDocumentos((previous) =>
         previous.map((documento) =>
           Number(documento.id_tipo_documento) === Number(item.id_tipo_documento)
             ? {
                 ...documento,
                 archivo: savedFile,
                 archivoNombre: savedFile.nombre_documento,
                 subido: true,
                 id_archivo: savedFile.id,
               }
             : documento,
         ),
       );
       showNotification(C.savedFile);
     } catch (error) {
       console.error("Error al subir el archivo:", error);
       showNotification(C.errorFile, "error");
     } finally {
       setLoadingDocuments(false);
       event.target.value = "";
     }
   };
    const requestDeleteDocument = (documento) => {
        setDocumentoAEliminar(documento);
        setOpenPopup(true);
    };


    return (
    <TravelContext.Provider
        value={{
            travelsLegajo,loadingTravel,fetchTravelsLegajo,
            TRAVEL_REQUIRED_DOCUMENTS,
            handlePreview,preview,setPreview,openPopup,setOpenPopup,
            documentoAEliminar,setDocumentoAEliminar,
            closePreview,closeDeleteDialog,
            handleArchivoChange,documentos,loadingDocuments,requestDeleteDocument
        }}
    >
        {children}
    </TravelContext.Provider>
    );
}
