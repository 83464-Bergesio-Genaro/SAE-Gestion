import { useState,useEffect,useCallback } from "react";
import { TravelContext } from "../studentContext";
import { DescargarDocumentacionXId, ObtenerViajesXLegajo } from "../../../api/TravelService";
import { mapViajes } from "../../../api/formatters/ViajeFormatter";
import { useAuth } from "../../../shared/context/sharedContext";
import { crearDocumentoEstudiante } from "../../../api/DeporteService";

function isPdfDocument(data = {}) {
  if (data.datos_documento?.startsWith("data:application/pdf")) return true;
  return (data.extension || "").toLowerCase() === "pdf";
}
const INITIAL_PREVIEW = {
  open: false,
  loading: false,
  title: "",
  imageSrc: null,
  isPdf: false,
  error: null,
};
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function construirNombre(formato, data, extension) {
  let nombre = formato;

  Object.keys(data).forEach((key) => {
    nombre = nombre.replace(`{${key}}`, data[key]);
  });

  return `${nombre}${extension}`;
}


export const TravelProvider = ({ children }) => {
    const { user } = useAuth();
    const TRAVEL_REQUIRED_DOCUMENTS = [
    {
        id_tipo_documento: null,
        nombre: "Certificado de Alumno Regular",
        descripcion:
        "Certificado vigente que acredita tu condición de estudiante regular.",
        subido: false,
        archivo: null,
        archivoNombre: "",
        formatoNombre: "{legajo}_AlumnoRegular",
        id_archivo: null,
        extension: null,
        required: true,
    },
    {
        id_tipo_documento: null,
        nombre: "Fotocopia Documento",
        descripcion:
        "Copia legible del frente y dorso de tu DNI en un único archivo.",
        subido: false,
        archivo: null,
        archivoNombre: "",
        formatoNombre: "{legajo}_DNI",
        id_archivo: null,
        extension: null,
        required: true,
    },
    {
        id_tipo_documento: null,
        nombre: "Declaracion Jurada",
        descripcion:
        "Certificadofirmado en el cual establece un heredero a tu fortuna.",
        subido: false,
        archivo: null,
        archivoNombre: "",
        formatoNombre: "{idViaje}_{legajo}_DDJJ",
        id_archivo: null,
        extension: null,
        required: true,
    },
    ];

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = useCallback((message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    }, []);
    const closeSnackbar = () =>
        setSnackbar((previous) => ({ ...previous, open: false }));

    const closePreview = () =>
        setPreview((previous) => ({ ...previous, open: false }));

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
            error: "No se pudo cargar el documento",
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
       showSnackbar(`Solo se permiten archivos: ${item.extension}`, "warning");
       event.target.value = "";
       return;
     }
 
     if (file.size > MAX_SIZE_BYTES) {
       showSnackbar(
         `El archivo no puede superar los ${MAX_SIZE_MB} MB.`,
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
       showSnackbar("Archivo subido con éxito");
     } catch (error) {
       console.error("Error al subir el archivo:", error);
       showSnackbar("Error al subir el archivo", "error");
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

            snackbar, setSnackbar,closeSnackbar,closePreview,closeDeleteDialog,
            handleArchivoChange,documentos,loadingDocuments,requestDeleteDocument
        }}
    >
        {children}
    </TravelContext.Provider>
    );
}