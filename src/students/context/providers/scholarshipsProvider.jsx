import { useState, useEffect, useCallback } from "react";
import { ScholarshipsContext } from "../studentContext";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";

import DocumentCard from "../../../shared/components/documents/DocumentCard";

import {
  ObtenerBecariosXLegajo,
  ObtenerBecariosEconomicaXLegajo,
  ObtenerBecariosServiciosXLegajo,
  ObtenerBecariosInvestigacionXLegajo,
  listarDocumentacionXLegajo,
  descargarDocumentacionXId,
  eliminarDocumentoEstudiante,
  crearDocumentoEstudiante,
} from "../../../api/BecasService";

import { obtenerTiposDocumento } from "../../../api/HerramientasService";
import { ObtenerPerfilXLegajo } from "../../../api/EstudianteService";
import { mapEstudiante } from "../../../api/formatters/EstudianteFormatters";
import { useAuth } from "../../../shared/context/sharedContext";

import { TIPO_BECA, REQUERID_DOCUMENTS,ECONOMIC_DOCUMENTS,ECONOMIC_OPTIONAL_DOCUMENTS, } from "../../pages/scholarships/scholarship.configs"; 
import {
  INITIAL_PREVIEW,
  asignarArchivosADocumentos,
  asignarTiposADocumentos,
  getEstadoBecaDesdeBecario,
  getErrorMessage,
  isValidObjectResponse,
  isPdfDocument,
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
  construirNombre,
  obtenerLegajoDesdeEmail,
} from "../../pages/scholarships/scholarship.utils";
import { SCHOLARSHIP_STRINGS } from "../../pages/scholarships/scholarship.string";
import {
  AddCircleOutline,
  AttachMoney,
  Diversity3,
  School,
} from "@mui/icons-material";

export function ScholarshipsProvider({ children }) {

    const C = SCHOLARSHIP_STRINGS;
    // Devuelve el icono visual para cada tipo de beca sin mezclar JSX dentro de la
    // respuesta normalizada de la API.
    const getBecaIcon = (tipoBeca) => {
    switch (tipoBeca) {
        case TIPO_BECA.ECONOMICA:
        return <AttachMoney fontSize="large" />;
        case TIPO_BECA.SERVICIO:
        return <Diversity3 fontSize="large" />;
        case TIPO_BECA.INVESTIGACION:
        return <School fontSize="large" />;
        default:
        return null;
    }
    };
    const REQUIRED_PROFILE_FIELDS = [
      ["legajo", "Legajo", (value) => String(value).trim() !== ""],
      ["nombres", "Nombres", (value) => String(value).trim() !== ""],
      ["apellidos", "Apellidos", (value) => String(value).trim() !== ""],
      ["dni", "DNI", (value) => String(value).replace(/\D/g, "").length === 8],
      ["cuil", "CUIL", (value) => String(value).replace(/\D/g, "").length === 11],
      [
        "fecha_nacimiento",
        "Fecha de nacimiento",
        (value) => String(value).trim() !== "",
      ],
      [
        "email",
        "Correo electrónico",
        (value) => /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(String(value).trim()),
      ],
      [
        "telefono",
        "Teléfono",
        (value) => String(value).replace(/\D/g, "").length === 12,
      ],
      [
        "direccion",
        "Dirección",
        (value) => {
          const parts = String(value).split(/\s+-\s+/);
          return parts.length === 4 && parts.every((part) => part.trim() !== "");
        },
      ],
    ];
    const getMissingProfileFields = (profile) =>
        REQUIRED_PROFILE_FIELDS.filter(([field, , isValid]) => {
            const value = profile?.[field];
            return value === null || value === undefined || !isValid(value);
        }).map(([, label]) => label);

    function closePreview() {
        setPreview((prev) => ({ ...prev, open: false }));
    }
    const { user } = useAuth();
    const [perfilEstudiante, setPerfilEstudiante] = useState(null);
    const camposPerfilFaltantes = getMissingProfileFields(perfilEstudiante);
    const perfilIncompleto = camposPerfilFaltantes.length > 0;
    // Mensaje flotante para informar éxito, advertencias o errores.
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

  // Becario base del sistema SAE. Es distinto de la beca específica.
  // Primero se necesita este registro para después crear económica/servicio/investigación.
  const [becarioActual, setBecarioActual] = useState(null);
  const [loadingScholarships, setLoadingScholarships] = useState(true);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  // Lista normalizada de becas para pintar las cards.
  const [misBecas, setMisBecas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [documentos, setDocumentos] = useState(REQUERID_DOCUMENTS); // lista general de documentos cargados
  const [documentosEconomica, setDocumentosEconomica] = useState(
    ECONOMIC_DOCUMENTS.concat(ECONOMIC_OPTIONAL_DOCUMENTS),
  ); // documentos específicos para beca económica

  const [preview, setPreview] = useState(INITIAL_PREVIEW);

  const [cbu, setCbu] = useState("");
  const [cbuGuardado, setCbuGuardado] = useState(false);

  const [openPopup, setOpenPopup] = useState(false);
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);

  // Helper para no repetir setSnackbar en cada try/catch.
  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);


  const cargarPerfilEstudiante = useCallback(async () => {
    const legajo = user?.legajo ?? user?.email;
    if (!legajo) {
      setPerfilEstudiante(null);
      return;
    }

    try {
      const perfil = await ObtenerPerfilXLegajo(legajo);
      setPerfilEstudiante(mapEstudiante(perfil));
    } catch (error) {
      console.error("Error al obtener el perfil del estudiante", error);
      setPerfilEstudiante(null);
    }
  }, [user?.email, user?.legajo]);

  // Carga los proyectos disponibles para la beca de investigación.

  // Normaliza las respuestas de la API porque vienen como objeto único o como {} cuando no existe beca.
  // Trae tipos de documento para completar id_tipo_documento y extension en las
  // configuraciones locales.
  const cargarTiposDocumento = useCallback(async () => {
    try {
      const data = await obtenerTiposDocumento();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error al obtener tipos de documento", error);
      return [];
    }
  }, []);

  // Metodo compartido con ScholarshipsForm. Guarda en base y sincroniza las dos
  // listas locales porque un tipo de documento puede verse en mas de una seccion.
  const subirDocumentoEstudiante = useCallback(
    async (idTipoDocumento, archivo) => {
      const documentoGuardado = await crearDocumentoEstudiante(
        idTipoDocumento,
        archivo,
      );

      setDocumentos((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(idTipoDocumento)
            ? {
                ...doc,
                archivo: documentoGuardado.archivo,
                archivoNombre:
                  documentoGuardado.nombre_completo_documento ??
                  documentoGuardado.nombre_documento,
                subido: true,
                id_archivo: documentoGuardado.id,
                extension: documentoGuardado.extension ?? doc.extension,
              }
            : doc,
        ),
      );

      setDocumentosEconomica((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(idTipoDocumento)
            ? {
                ...doc,
                archivo: documentoGuardado.archivo,
                archivoNombre:
                  documentoGuardado.nombre_completo_documento ??
                  documentoGuardado.nombre_documento,
                subido: true,
                id_archivo: documentoGuardado.id,
                extension: documentoGuardado.extension ?? doc.extension,
              }
            : doc,
        ),
      );

      return documentoGuardado;
    },
    [],
  );

  // Cada endpoint devuelve una forma distinta. Aca se arma una lista unica para
  // renderizar las cards de "Mis Becas".
  const normalizarBecas = useCallback((economica, servicio, investigacion) => {
    return [
      isValidObjectResponse(economica) && {
        ...economica,
        tipoBeca: TIPO_BECA.ECONOMICA,
        iconBeca: getBecaIcon(TIPO_BECA.ECONOMICA),
        fechaSolicitud: economica.becario?.fecha_solicitud,
        estado: getEstadoBecaDesdeBecario(economica.becario),
      },
      isValidObjectResponse(servicio) && {
        ...servicio,
        tipoBeca: TIPO_BECA.SERVICIO,
        iconBeca: getBecaIcon(TIPO_BECA.SERVICIO),
        fechaSolicitud: servicio.becario?.fecha_solicitud,
        estado: getEstadoBecaDesdeBecario(servicio.becario),
        servicio:
          servicio.servicio?.nombre ?? servicio.servicio ?? C.emptyValue,
      },
      isValidObjectResponse(investigacion) && {
        ...investigacion,
        tipoBeca: TIPO_BECA.INVESTIGACION,
        iconBeca: getBecaIcon(TIPO_BECA.INVESTIGACION),
        fechaSolicitud: investigacion.becario?.fecha_solicitud,
        estado: getEstadoBecaDesdeBecario(investigacion.becario),
        proyecto_investigacion:
          investigacion.proyecto_investigacion?.nombre_proyecto_investigacion ??
          investigacion.proyecto_investigacion?.centro_investigacion ??
          C.emptyValue,
      },
    ].filter(Boolean);
  }, [C]);

  // Carga el becario base y las becas asociadas al usuario logueado.
  const cargarMisBecas = useCallback(
    async ({ showLoading = true } = {}) => {
      if (!user?.email) return;

      try {
        if (showLoading) setLoadingScholarships(true);
        const becario = await ObtenerBecariosXLegajo(user.email);

        if (!isValidObjectResponse(becario)) {
          setBecarioActual(null);
          setMisBecas([]);
          return;
        }
 
        setBecarioActual(becario);

        const [economica, servicio, investigacion] = await Promise.all([
          ObtenerBecariosEconomicaXLegajo(user.email),
          ObtenerBecariosServiciosXLegajo(user.email),
          ObtenerBecariosInvestigacionXLegajo(user.email),
        ]);

        setMisBecas(normalizarBecas(economica, servicio, investigacion));
      } catch (error) {
        console.error("Error al cargar becario y becas", error);
        setBecarioActual(null);
        setMisBecas([]);
        showSnackbar(C.loadScholarshipsError, "error");
      } finally {
        if (showLoading) setLoadingScholarships(false);
      }
    },
    [normalizarBecas, showSnackbar, user?.email,C],
  );

  // Carga directa desde "Mis Documentos". El formulario usa el mismo servicio,
  // pero maneja su propio estado local mientras el dialog esta abierto.
  const handleArchivoChange = async (e, item) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extensionArchivo = `.${file.name.split(".").pop().toLowerCase()}`;

    const extensionesPermitidas = item.extension
      .split(",")
      .map((ext) => ext.trim().toLowerCase());

    if (!extensionesPermitidas.includes(extensionArchivo)) {
      alert(C.uploadAllowedExtensions(item.extension));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      alert(C.uploadMaxSize(MAX_SIZE_MB));
      e.target.value = "";
      return;
    }

    const nuevoNombre = construirNombre(
      item.formatoNombre,
      {
        legajo: obtenerLegajoDesdeEmail(user.legajo ?? user.email),
      },
      extensionArchivo,
    );

    const archivoRenombrado = new File([file], nuevoNombre, {
      type: file.type,
      lastModified: file.lastModified,
    });

    let archivoGuardado;

    try {
      setLoadingDocuments(true);
      archivoGuardado = await crearDocumentoEstudiante(
        item.id_tipo_documento,
        archivoRenombrado,
      );
      setSnackbar({
        open: true,
        message: C.uploadSuccess,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: getErrorMessage(error, C.uploadError),
        severity: "error",
      });
      console.error("Error al subir el archivo:", error);
    } finally {
      setLoadingDocuments(false);
    }

    if (!archivoGuardado) {
      e.target.value = "";
      return;
    }

    setDocumentos((prev) =>
      prev.map((doc) =>
        Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
          ? {
              ...doc,
              archivo: archivoGuardado,
              archivoNombre: archivoGuardado.nombre_documento,
              subido: true,
              id_archivo: archivoGuardado.id,
            }
          : doc,
      ),
    );

    setDocumentosEconomica((prev) =>
      prev.map((doc) =>
        Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
          ? {
              ...doc,
              archivo: archivoGuardado,
              archivoNombre: archivoGuardado.nombre_documento,
              subido: true,
              id_archivo: archivoGuardado.id,
            }
          : doc,
      ),
    );
    e.target.value = "";
  };

  const handleCbuChange = (e) => {
    setCbu(e.target.value.replace(/\D/g, "").slice(0, 22));
  };

  const handleGuardarCbu = () => {
    if (cbu.length !== 22) {
      showSnackbar(C.cbuInvalid, "warning");
      return;
    }

    setCbuGuardado(true);
    showSnackbar(C.cbuSavedSuccess, "success");
  };

  const hasEconomica = misBecas.some((b) => b.tipoBeca === TIPO_BECA.ECONOMICA);

  // Abre el Dialog para solicitar una beca nueva.
  // Si ya existe Becario SAE, precarga sus datos; si no, usa datos del usuario logueado.
  const handleAgregarBeca = () => {
    if (perfilIncompleto) {
      showSnackbar(C.incompleteProfileMessage, "warning");
      return;
    }

    setOpenDialog(true);
  };

  // Borra despues de confirmar en el dialog. Si la API responde bien, limpia el
  // documento en ambas listas para mantener la pantalla sincronizada.
  async function handleDelete(item) {
    try {
      setOpenPopup(false);

      setLoadingDocuments(true);

      await eliminarDocumentoEstudiante(item.id_archivo);

      setSnackbar({
        open: true,
        message: C.docEliminado,
        severity: "success",
      });

      setDocumentos((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
            ? {
                ...doc,
                archivo: null,
                archivoNombre: "",
                subido: false,
                id_archivo: null,
              }
            : doc,
        ),
      );

      setDocumentosEconomica((prev) =>
        prev.map((doc) =>
          Number(doc.id_tipo_documento) === Number(item.id_tipo_documento)
            ? {
                ...doc,
                archivo: null,
                archivoNombre: "",
                subido: false,
                id_archivo: null,
              }
            : doc,
        ),
      );
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      setSnackbar({
        open: true,
        message: C.docEliminadoError,
        severity: "error",
      });
    } finally {
      setLoadingDocuments(false);
    }
  }

  // Descarga el archivo por id y delega la visualizacion al dialog compartido.
  async function handlePreview(id, nombre) {
    setPreview({
      open: true,
      loading: true,
      title: nombre,
      imageSrc: null,
      isPdf: false,
      error: null,
    });
    try {
      const data = await descargarDocumentacionXId(id);
      setPreview({
        open: true,
        loading: false,
        title: nombre,
        imageSrc: data.datos_documento,
        isPdf: isPdfDocument(data),
        error: null,
      });
    } catch {
      setPreview((prev) => ({
        ...prev,
        loading: false,
        error: C.previewLoadError,
      }));
    }
  }

  // Solo abre la confirmacion; la eliminacion real ocurre en handleDelete.
  async function DeleteDocument(document) {
    setOpenPopup(true);
    setDocumentoAEliminar(document);
  }

  // Primer paso de documentos: cruzar configuracion local con tipos reales.
  const ObtenerTipoDocumentos = useCallback(async () => {
    try {
      const data = await cargarTiposDocumento();
      if (!data || data.length === 0) return;

      let docsConId = [];

      setDocumentos((prev) => {
        docsConId = asignarTiposADocumentos(prev, data);

        return docsConId;
      });

      setDocumentosEconomica((prev) => asignarTiposADocumentos(prev, data));

      return docsConId;
    } catch (error) {
      console.error("Error al obtener tipos de documento", error);
      return [];
    }
  }, [cargarTiposDocumento]);

  // Segundo paso de documentos: marcar como subidos los archivos que ya existen
  // para el legajo del estudiante.
  const ObtenerDocumentosEstudiante = useCallback(
    async (documentosBase) => {
      try {
        const data = await listarDocumentacionXLegajo(user?.email);
        if (!data || data.length === 0) return;

        setDocumentos((prev) =>
          asignarArchivosADocumentos(
            documentosBase.length > 0 ? documentosBase : prev,
            data,
          ),
        );

        setDocumentosEconomica((prev) =>
          asignarArchivosADocumentos(prev, data),
        );
      } catch (error) {
        console.error("Error al obtener documentos del estudiante", error);
      }
    },
    [user?.email],
  );

  // Carga inicial: becario/becas, tipos de documento y archivos del estudiante.
  // El orden importa porque los archivos se asignan usando id_tipo_documento.
  useEffect(() => {
    if (!user?.email) return;

    const inicializarPantalla = async () => {
      setLoadingScholarships(true);
      setLoadingDocuments(true);

      const loadScholarships = Promise.all([
        cargarMisBecas({ showLoading: false }),
        cargarPerfilEstudiante(),
      ]).finally(() => setLoadingScholarships(false));

      const loadDocuments = (async () => {
        try {
          const documentosConTipo = await ObtenerTipoDocumentos();
          await ObtenerDocumentosEstudiante(documentosConTipo);
        } catch (error) {
          console.error("Error al cargar documentos de becas", error);
        } finally {
          setLoadingDocuments(false);
        }
      })();

      await Promise.all([loadScholarships, loadDocuments]);
    };

    inicializarPantalla();
  }, [
    user?.email,
    cargarMisBecas,
    cargarPerfilEstudiante,
    ObtenerTipoDocumentos,
    ObtenerDocumentosEstudiante,
  ]);
  return (
    <ScholarshipsContext.Provider
      value={{
    closePreview,perfilEstudiante,camposPerfilFaltantes,perfilIncompleto,
    snackbar,setSnackbar,becarioActual,loadingScholarships,loadingDocuments,misBecas
    
    ,openDialog,documentos,documentosEconomica,preview,cbu,cbuGuardado,openPopup,documentoAEliminar,
    cargarPerfilEstudiante,cargarTiposDocumento,subirDocumentoEstudiante,normalizarBecas,
    getBecaIcon,cargarMisBecas,handleArchivoChange,setDocumentos,setDocumentosEconomica,handleCbuChange,handleGuardarCbu,
    hasEconomica,handleAgregarBeca,handleDelete,handlePreview,DeleteDocument,ObtenerTipoDocumentos,ObtenerDocumentosEstudiante,
    setOpenDialog,setBecarioActual,showSnackbar,setOpenPopup }}
    >
      {children}
    </ScholarshipsContext.Provider>
  );
}