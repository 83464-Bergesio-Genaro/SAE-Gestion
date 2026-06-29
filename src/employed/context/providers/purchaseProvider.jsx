import { useState, useCallback, useEffect, useMemo } from "react";
import { Box, IconButton, Chip } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";

import {
  CrearCompra,
  CrearDocumentoCompra,
  CrearInforme,
  DescargarDocumentacionXId,
  EliminarCompra,
  EliminarDocumentoCompra,
  ListarDocumentacionXCompra,
  ModificarInforme,
  ObtenerComprasXFecha,
  ObtenerInformeXCompra,
} from "../../../api/CompraService";
import { obtenerTiposDocumento } from "../../../api/HerramientasService";
import { PurchaseContext } from "../employedContext";
import {
  buildDocumentName,
  closePreview as closePreviewState,
  createInitialPreview,
  formatCurrency,
  formatCurrencyInput,
  formatDateForDisplay,
  formatDateForInput,
  formatHeader,
  generateRows as generateBaseRows,
  getDocumentId,
  getDocumentName,
  getFileExtension,
  getFileName,
  isFile,
  isPdfDocument,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  normalizeCurrencyValue,
  renameFile,
  sanitizeCurrencyInput,
  sanitizeFileNamePart,
} from "../../../shared/util";

const EMPTY_PURCHASES = {
  id: null,
  nombre_compra: "",
  precio_sugerido: "",
  motivo: "",
  fecha_compra: "",
  id_usuario: null,
  nombre_usuario: "",
  facturas_documentos: [],
  informe: {
    nro_expediente: null,
    id_compra: null,
    precio_real: "",
    fecha_licitacion: null,
    fecha_informe: null,
    nombre_solicitante: "",
    nombre_ganador: "",
    documento_pdf: null,
  },
};

const PURCHASE_DOCUMENT_TYPES = [
  {
    key: "facturas",
    id_tipo_documento: null,
    nombre: "Facturas",
    descripcion: "Comprobantes de la compra.",
    formatoNombre: "{nombreCompra}_factura_{nro}",
    extension: ".pdf,.jpg,.jpeg,.png",
    multiple: true,
    required: true,
  },
  {
    key: "informe",
    id_tipo_documento: null,
    nombre: "Informe tecnico",
    descripcion: "Informe tecnico de la compra en PDF.",
    formatoNombre: "{nombreCompra}_InformeTecnico",
    extension: ".pdf",
    multiple: false,
    required: false,
  },
];

const clonePurchase = (purchase = EMPTY_PURCHASES) => ({
  ...purchase,
  facturas_documentos: [...(purchase.facturas_documentos || [])],
  informe: {
    ...EMPTY_PURCHASES.informe,
    ...(purchase.informe_tecnico || {}),
    ...(purchase.informe || {}),
  },
});
const isRequiredPurchaseDataComplete = (purchase) => {
  const precioSugerido = normalizeCurrencyValue(purchase.precio_sugerido);

  return (
    purchase.id_usuario !== null &&
    purchase.id_usuario !== undefined &&
    purchase.id_usuario !== "" &&
    Boolean(String(purchase.nombre_compra ?? "").trim()) &&
    precioSugerido !== "" &&
    precioSugerido !== null &&
    precioSugerido !== undefined &&
    !Number.isNaN(Number(precioSugerido)) &&
    Boolean(String(purchase.motivo ?? "").trim()) &&
    Boolean(String(purchase.fecha_compra ?? "").trim())
  );
};

const hasInvoiceDocument = (purchase = {}) =>
  (purchase.facturas_documentos || []).length > 0;

const isInformeComplete = (informe = {}) => {
  const precioReal = normalizeCurrencyValue(informe.precio_real);

  return (
    Boolean(String(informe.nro_expediente ?? "").trim()) &&
    precioReal !== "" &&
    precioReal !== null &&
    precioReal !== undefined &&
    !Number.isNaN(Number(precioReal)) &&
    Boolean(String(informe.fecha_licitacion ?? "").trim()) &&
    Boolean(String(informe.fecha_informe ?? "").trim()) &&
    Boolean(String(informe.nombre_solicitante ?? "").trim()) &&
    Boolean(String(informe.nombre_ganador ?? "").trim())
  );
};

const getPurchaseId = (purchase = {}) => {
  const safePurchase = purchase ?? {};

  return (
    safePurchase.id_compra ?? safePurchase.idCompra ?? safePurchase.id ?? null
  );
};

const getDocumentTypeId = (document = {}) => {
  const safeDocument = document ?? {};

  return (
    safeDocument.id_tipo_documento ??
    safeDocument.idTipoDocumento ??
    safeDocument.tipo_documento_id ??
    null
  );
};

const isInformeDocument = (
  document = {},
  documentTypes = PURCHASE_DOCUMENT_TYPES,
) => {
  const typeId = Number(getDocumentTypeId(document));
  const informeType = documentTypes.find(
    (documentType) => documentType.key === "informe",
  );
  const name = getDocumentName(document).toLowerCase();

  return (
    (informeType?.id_tipo_documento &&
      typeId === Number(informeType.id_tipo_documento)) ||
    name.includes("informetecnico") ||
    name.includes("informe")
  );
};

const normalizeDocument = (document = {}) => ({
  ...document,
  id: getDocumentId(document),
  name: getDocumentName(document),
});

const normalizeInforme = (informe = {}, idCompra = null) => {
  const safeInforme = informe ?? {};

  return {
    nro_expediente:
      safeInforme.nro_expediente ??
      safeInforme.nroExpediente ??
      safeInforme.expediente ??
      null,
    id_compra: safeInforme.id_compra ?? safeInforme.idCompra ?? idCompra,
    precio_real: safeInforme.precio_real ?? safeInforme.precioReal ?? "",
    fecha_licitacion: formatDateForInput(
      safeInforme.fecha_licitacion ?? safeInforme.fechaLicitacion ?? null,
    ),
    fecha_informe: formatDateForInput(
      safeInforme.fecha_informe ?? safeInforme.fechaInforme ?? null,
    ),
    nombre_solicitante:
      safeInforme.nombre_solicitante ?? safeInforme.nombreSolicitante ?? "",
    nombre_ganador:
      safeInforme.nombre_ganador ?? safeInforme.nombreGanador ?? "",
    documento_pdf:
      safeInforme.documento_pdf ?? safeInforme.documentoPdf ?? null,
  };
};

const normalizePurchase = (
  purchase = {},
  informe = null,
  documentos = [],
  documentTypes = PURCHASE_DOCUMENT_TYPES,
) => {
  const idCompra = getPurchaseId(purchase);
  const normalizedDocuments = (Array.isArray(documentos) ? documentos : [])
    .filter(Boolean)
    .map(normalizeDocument);
  const facturaDocs = normalizedDocuments.filter(
    (document) => !isInformeDocument(document, documentTypes),
  );
  const informeDoc =
    normalizedDocuments.find((document) =>
      isInformeDocument(document, documentTypes),
    ) ?? null;

  return {
    ...purchase,
    id: idCompra,
    id_compra: idCompra,
    id_usuario:
      purchase.id_usuario ??
      purchase.idUsuario ??
      purchase.id_usuario_empleado ??
      purchase.idUsuarioEmpleado ??
      purchase.id_empleado ??
      purchase.idEmpleado ??
      null,
    nombre_usuario:
      purchase.nombre_usuario ??
      purchase.nombreUsuario ??
      purchase.nombre_empleado ??
      purchase.nombreEmpleado ??
      purchase.nombre_usuario_empleado ??
      purchase.nombreUsuarioEmpleado ??
      "",
    nombre_compra: purchase.nombre_compra ?? purchase.nombreCompra ?? "",
    precio_sugerido: purchase.precio_sugerido ?? purchase.precioSugerido ?? "",
    motivo: purchase.motivo ?? "",
    fecha_compra: formatDateForInput(
      purchase.fecha_compra ?? purchase.fechaCompra ?? "",
    ),
    facturas_documentos: facturaDocs,
    informe: {
      ...normalizeInforme(
        informe ??
          purchase.informe ??
          purchase.informe_tecnico ??
          purchase.informeTecnico ??
          {},
        idCompra,
      ),
      documento_pdf: informeDoc,
    },
  };
};

const buildCompraBody = (purchase = {}) => ({
  id_usuario: purchase.id_usuario,
  nombre_usuario: purchase.nombre_usuario,
  nombre_compra: purchase.nombre_compra,
  precio_sugerido: normalizeCurrencyValue(purchase.precio_sugerido),
  motivo: purchase.motivo,
  fecha_compra: purchase.fecha_compra,
});

const hasInformeData = (informe = {}) =>
  [
    informe.nro_expediente,
    informe.precio_real,
    informe.fecha_licitacion,
    informe.fecha_informe,
    informe.nombre_solicitante,
    informe.nombre_ganador,
  ].some(
    (value) =>
      value !== null && value !== undefined && String(value).trim() !== "",
  );

const buildInformeBody = (purchase = {}, idCompra = null) => {
  const informe = purchase.informe || {};

  return {
    nro_expediente: informe.nro_expediente ?? informe.nroExpediente ?? null,
    id_compra: idCompra ?? purchase.id_compra ?? purchase.id,
    precio_real: normalizeCurrencyValue(informe.precio_real),
    fecha_licitacion: informe.fecha_licitacion || null,
    fecha_informe: informe.fecha_informe || null,
    nombre_solicitante: informe.nombre_solicitante || "",
    nombre_ganador: informe.nombre_ganador || "",
  };
};

const generateColumns = (data, actionsConfig = []) => {
  const sample = Array.isArray(data) ? data[0] : data;

  if (!sample) return [];

  const dataColumns = Object.keys(sample)
    .filter(
      (key) =>
        !["informe", "facturas_documentos"].includes(key) &&
        !key.toLowerCase().includes("id"),
    )
    .map((key) => {
      // Nota: Se asume que data es un array, por eso data[0] para las keys
      const isDate = key.toLowerCase().includes("fecha");
      const isCurrency = ["precio_sugerido", "precio_real"].includes(
        key.toLowerCase(),
      );
      const isShort = [
        "estado",
        "cupo",
        "duracion",
        "horario_inicio",
        "horario_fin",
      ].includes(key.toLowerCase());

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
          ),
        };
      } else if (key.toLowerCase() === "seguro") {
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
          ),
        };
      } else {
        return {
          field: key,
          headerName: formatHeader(key),
          flex: 1,
          minWidth: isCurrency ? 130 : isShort ? 50 : 120,
          maxWidth: isShort ? 100 : NaN,
          align: isCurrency ? "right" : isShort ? "center" : "left",
          headerAlign: isCurrency ? "right" : isShort ? "center" : "left",
          valueFormatter: isCurrency
            ? (value) => formatCurrency(value)
            : isDate
              ? (value) => formatDateForDisplay(value)
              : undefined,
        };
      }
    });

  dataColumns.push(
    {
      field: "precio_real",
      headerName: "Precio Real",
      flex: 1,
      minWidth: 130,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: "fecha_licitacion",
      headerName: "Fecha Licitacion",
      flex: 1,
      minWidth: 120,
      valueFormatter: (value) => formatDateForDisplay(value),
    },
    {
      field: "fecha_informe",
      headerName: "Fecha Informe",
      flex: 1,
      minWidth: 120,
      valueFormatter: (value) => formatDateForDisplay(value),
    },
    {
      field: "nombre_solicitante",
      headerName: "Nombre Solicitante",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "nombre_ganador",
      headerName: "Nombre Ganador",
      flex: 1,
      minWidth: 160,
    },
  );

  // 👉 Columna de acciones dinámica
  if (actionsConfig !== null && actionsConfig.length > 0) {
    return [
      {
        field: "actions",
        headerName: "Acciones",
        headerAlign: "center",
        align: "center",
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        width: 40 * actionsConfig.length,
        renderCell: (params) => (
          <Box sx={{ display: "block", textAlign: "center" }}>
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
      },
      ...dataColumns,
    ];
  }

  return dataColumns;
};

const generateRows = (data) => {
  return generateBaseRows(data, (item) => ({
    id_compra: item.id_compra ?? item.id,
    id_usuario: item.id_usuario,
    nombre_usuario: item.nombre_usuario ?? "",
    nombre_compra: item.nombre_compra ?? "",
    precio_sugerido: item.precio_sugerido ?? "",
    motivo: item.motivo ?? "",
    fecha_compra: item.fecha_compra ?? "",
    facturas_documentos: item.facturas_documentos ?? [],
    informe: item.informe ?? {},
    precio_real: item.informe?.precio_real ?? "",
    fecha_licitacion: item.informe?.fecha_licitacion ?? "",
    fecha_informe: item.informe?.fecha_informe ?? "",
    nombre_solicitante: item.informe?.nombre_solicitante || "",
    nombre_ganador: item.informe?.nombre_ganador || "",
  }));
};

export function PurchaseProvider({ children }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const [purchasesRows, setPurchaseRows] = useState([]);
  const [loadingPurchase, setLoadingPurchase] = useState(true);
  const [purchaseDocumentTypes, setPurchaseDocumentTypes] = useState(() =>
    PURCHASE_DOCUMENT_TYPES.map((documentType) => ({ ...documentType })),
  );

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        const documentTypes = await obtenerTiposDocumento();
        setPurchaseDocumentTypes(
          PURCHASE_DOCUMENT_TYPES.map((documento) => {
            const match = documentTypes?.find(
              (type) =>
                type.nombre.trim().toLowerCase() ===
                documento.nombre.trim().toLowerCase(),
            );

            return match
              ? {
                  ...documento,
                  id_tipo_documento: match.id,
                  extension: match.extension ?? documento.extension,
                }
              : { ...documento };
          }),
        );
      } catch (error) {
        setDialogError(
          error.message || "No se pudieron cargar los tipos de documento.",
        );
      }
    };

    fetchDocumentTypes();
  }, []);

  const fetchPurchases = useCallback(
    async (fechaDesde, fechaHasta) => {
      setLoadingPurchase(true);
      try {
        const data = await ObtenerComprasXFecha(fechaDesde, fechaHasta);
        console.log(data);
        const purchases = Array.isArray(data) ? data : [];
        const hydratedPurchases = await Promise.all(
          purchases.map(async (purchase) => {
            const idCompra = getPurchaseId(purchase);
            if (!idCompra)
              return normalizePurchase(
                purchase,
                null,
                [],
                purchaseDocumentTypes,
              );

            const [informe, documentos] = await Promise.all([
              ObtenerInformeXCompra(idCompra).catch(() => null),
              ListarDocumentacionXCompra(idCompra).catch(() => []),
            ]);

            return normalizePurchase(
              purchase,
              informe,
              documentos,
              purchaseDocumentTypes,
            );
          }),
        );

        setPurchaseRows(generateRows(hydratedPurchases));
      } catch (error) {
        setDialogError(error.message || "No se pudieron cargar las compras");
        setPurchaseRows([]);
      } finally {
        setLoadingPurchase(false);
      }
    },
    [purchaseDocumentTypes],
  );

  const openCreatePurchases = () => {
    setDialogData(clonePurchase());
    setDialogType("purchases");
    setDialogMode("create");
    setDialogError("");
    setDialogOpen(true);
  };

  const openEditDocs = useCallback((row) => {
    setDialogData(clonePurchase(row));
    setDialogType("docs");
    setDialogMode("docs");
    setDialogError("");
    setDialogOpen(true);
  }, []);

  const handleOpenEditDocs = useCallback(
    (row) => {
      openEditDocs(row);
    },
    [openEditDocs],
  );

  const handleDeletePurchase = useCallback(async (row) => {
    const idCompra = getPurchaseId(row);
    if (!idCompra) {
      setDialogError("No se pudo identificar la compra a eliminar.");
      return;
    }

    try {
      setLoadingPurchase(true);
      await EliminarCompra(idCompra);
      setPurchaseRows((prev) =>
        prev.filter((purchase) => getPurchaseId(purchase) !== idCompra),
      );
      setSnackbarMsg("Compra eliminada!");
      setSnackbarOpen(true);
    } catch (error) {
      setDialogError(error.message || "No se pudo eliminar la compra");
    } finally {
      setLoadingPurchase(false);
    }
  }, []);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dialogMode, setDialogMode] = useState("create");
  const [dialogData, setDialogData] = useState(clonePurchase());
  const [dialogSaving, setDialogSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [focusedCurrencyField, setFocusedCurrencyField] = useState("");
  const [preview, setPreview] = useState(createInitialPreview);

  const closePreview = useCallback(() => {
    closePreviewState(setPreview);
  }, []);

  const handlePreview = useCallback(async (documentOrId, nombre) => {
    if (isFile(documentOrId)) {
      setPreview({
        open: true,
        loading: true,
        title: nombre || getFileName(documentOrId) || "Vista previa",
        imageSrc: null,
        isPdf: documentOrId.type === "application/pdf",
        error: null,
      });

      const reader = new FileReader();
      reader.onload = () =>
        setPreview((previous) => ({
          ...previous,
          loading: false,
          imageSrc: reader.result,
        }));
      reader.onerror = () =>
        setPreview((previous) => ({
          ...previous,
          loading: false,
          error: "No se pudo leer el documento seleccionado.",
        }));
      reader.readAsDataURL(documentOrId);
      return;
    }

    const id =
      typeof documentOrId === "object"
        ? getDocumentId(documentOrId)
        : documentOrId;

    if (!id) {
      setPreview({
        open: true,
        loading: false,
        title: nombre || "Vista previa",
        imageSrc: null,
        isPdf: false,
        error: "Guardá el documento antes de previsualizarlo.",
      });
      return;
    }

    setPreview({
      open: true,
      loading: true,
      title: nombre || "Vista previa",
      imageSrc: null,
      isPdf: false,
      error: null,
    });

    try {
      const data = await DescargarDocumentacionXId(id);
      console.log(data);
      setPreview({
        open: true,
        loading: false,
        title: nombre || getDocumentName(data) || "Vista previa",
        imageSrc: data.datos_documento,
        isPdf: isPdfDocument(data),
        error: null,
      });
    } catch (error) {
      setPreview((previous) => ({
        ...previous,
        loading: false,
        error: error.message || "No se pudo cargar el documento",
      }));
    }
  }, []);

  const handleDialogChange = useCallback((field, value) => {
    setDialogData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleInformeTecnicoChange = useCallback((field, value) => {
    setDialogData((prev) => ({
      ...prev,
      informe: {
        ...(prev.informe || {}),
        [field]: value,
      },
    }));
  }, []);

  const handleEmpleadoChange = useCallback(
    (_event, empleado) => {
      handleDialogChange("id_usuario", empleado?.id ?? null);
      handleDialogChange("nombre_usuario", empleado?.nombre_empleado ?? "");
    },
    [handleDialogChange],
  );

  const getCurrencyValue = useCallback(
    (field, value) => {
      if (focusedCurrencyField === field) {
        if (value === null || value === undefined) return "";
        if (typeof value === "number") return String(value).replace(".", ",");

        return value;
      }

      return formatCurrencyInput(value);
    },
    [focusedCurrencyField],
  );

  const handleCurrencyInputChange = useCallback((field, value, onChange) => {
    onChange(field, sanitizeCurrencyInput(value));
  }, []);

  const handleCurrencyBlur = useCallback((field, value, onChange) => {
    onChange(field, normalizeCurrencyValue(value));
    setFocusedCurrencyField("");
  }, []);

  const isPurchaseDataComplete = useMemo(
    () => isRequiredPurchaseDataComplete(dialogData),
    [dialogData],
  );

  const validateDocumentFile = useCallback((file, documentType) => {
    const extension = getFileExtension(file);
    const allowedExtensions = documentType.extension
      .split(",")
      .map((value) => value.trim().toLowerCase());

    if (!allowedExtensions.includes(extension)) {
      return `Solo se permiten archivos: ${documentType.extension}`;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `El archivo no puede superar los ${MAX_FILE_SIZE_MB} MB.`;
    }

    return "";
  }, []);

  const handleFacturaChange = useCallback(
    (event, documentType) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      if (!isRequiredPurchaseDataComplete(dialogData)) {
        setDialogError(
          "Completá los datos de la compra antes de adjuntar documentación.",
        );
        event.target.value = "";
        return;
      }

      const compraName = sanitizeFileNamePart(dialogData.nombre_compra);
      const existingCount = dialogData.facturas_documentos?.length || 0;
      const renamedFiles = [];

      for (const [index, file] of files.entries()) {
        const validationError = validateDocumentFile(file, documentType);
        if (validationError) {
          setDialogError(validationError);
          event.target.value = "";
          return;
        }

        const extension = getFileExtension(file);
        const fileName = buildDocumentName(
          documentType.formatoNombre,
          {
            nombreCompra: compraName,
            nro: existingCount + index + 1,
          },
          extension,
        );
        renamedFiles.push(renameFile(file, fileName));
      }

      setDialogData((prev) => ({
        ...prev,
        facturas_documentos: [
          ...(prev.facturas_documentos || []),
          ...renamedFiles,
        ],
      }));
      setDialogError("");
      event.target.value = "";
    },
    [dialogData, validateDocumentFile],
  );

  const handleInformePdfChange = useCallback(
    (event, documentType) => {
      const file = event.target.files?.[0] || null;
      if (!file) return;

      if (!isRequiredPurchaseDataComplete(dialogData)) {
        setDialogError(
          "Completá los datos de la compra antes de adjuntar documentación.",
        );
        event.target.value = "";
        return;
      }

      const validationError = validateDocumentFile(file, documentType);
      if (validationError) {
        setDialogError(validationError);
        event.target.value = "";
        return;
      }

      const compraName = sanitizeFileNamePart(dialogData.nombre_compra);
      const extension = getFileExtension(file);
      const fileName = buildDocumentName(
        documentType.formatoNombre,
        { nombreCompra: compraName },
        extension,
      );

      handleInformeTecnicoChange("documento_pdf", renameFile(file, fileName));
      setDialogError("");
      event.target.value = "";
    },
    [dialogData, handleInformeTecnicoChange, validateDocumentFile],
  );

  const handleRemoveFactura = useCallback(
    async (indexToRemove) => {
      const factura = dialogData.facturas_documentos?.[indexToRemove];
      const idDocumento = getDocumentId(factura);

      try {
        if (idDocumento) await EliminarDocumentoCompra(idDocumento);
        setDialogData((prev) => ({
          ...prev,
          facturas_documentos: (prev.facturas_documentos || []).filter(
            (_file, index) => index !== indexToRemove,
          ),
        }));
        setDialogError("");
      } catch (error) {
        setDialogError(error.message || "No se pudo eliminar la factura");
      }
    },
    [dialogData.facturas_documentos],
  );

  const handleDeletePurchaseDocument = useCallback(
    async (documentType) => {
      try {
        if (documentType.key === "facturas") {
          const facturas = dialogData.facturas_documentos || [];
          await Promise.all(
            facturas
              .map(getDocumentId)
              .filter(Boolean)
              .map((idDocumento) => EliminarDocumentoCompra(idDocumento)),
          );
          setDialogData((prev) => ({
            ...prev,
            facturas_documentos: [],
          }));
          setDialogError("");
          return;
        }

        const idDocumento = getDocumentId(dialogData.informe?.documento_pdf);
        if (idDocumento) await EliminarDocumentoCompra(idDocumento);
        handleInformeTecnicoChange("documento_pdf", null);
        setDialogError("");
      } catch (error) {
        setDialogError(error.message || "No se pudo eliminar el documento");
      }
    },
    [
      dialogData.facturas_documentos,
      dialogData.informe?.documento_pdf,
      handleInformeTecnicoChange,
    ],
  );

  const purchaseDocuments = useMemo(
    () =>
      purchaseDocumentTypes.map((documentType) => {
        if (documentType.key === "facturas") {
          const facturas = dialogData.facturas_documentos || [];

          return {
            ...documentType,
            subido: facturas.length > 0,
            documentos: facturas,
            id_archivo:
              facturas.length === 1 ? getDocumentId(facturas[0]) : null,
            archivoNombre:
              facturas.length === 1
                ? getFileName(facturas[0])
                : facturas.length > 1
                  ? `${facturas.length} facturas adjuntas`
                  : "",
          };
        }

        const informe = dialogData.informe?.documento_pdf;

        return {
          ...documentType,
          subido: Boolean(informe),
          documentos: informe ? [informe] : [],
          id_archivo: getDocumentId(informe),
          archivoNombre: getFileName(informe),
        };
      }),
    [
      dialogData.facturas_documentos,
      dialogData.informe?.documento_pdf,
      purchaseDocumentTypes,
    ],
  );

  const handlePurchasesSave = useCallback(
    async (purchaseData = dialogData, fechaDesde, fechaHasta) => {
      setDialogSaving(true);
      setDialogError("");
      try {
        const purchaseToSave = clonePurchase(purchaseData);

        let idCompra = getPurchaseId(purchaseToSave);

        if (dialogMode === "create") {
          const createdPurchase = await CrearCompra(
            buildCompraBody(purchaseToSave),
          );
          idCompra = getPurchaseId(createdPurchase) ?? idCompra;
        }

        if (!idCompra) {
          throw new Error("No se pudo obtener el id de la compra.");
        }

        const facturaDocumentType = purchaseDocumentTypes.find(
          (documentType) => documentType.key === "facturas",
        );
        const informeDocumentType = purchaseDocumentTypes.find(
          (documentType) => documentType.key === "informe",
        );

        const informe = purchaseToSave.informe || {};
        if (isInformeComplete(informe)) {
          const informeBody = buildInformeBody(purchaseToSave, idCompra);
          const nroExpediente =
            informe.nro_expediente ?? informe.nroExpediente ?? null;

          if (dialogMode === "docs" && nroExpediente) {
            await ModificarInforme(nroExpediente, informeBody);
          } else {
            await CrearInforme(informeBody);
          }
        }

        await Promise.all(
          (purchaseToSave.facturas_documentos || [])
            .filter(isFile)
            .map((file) => {
              if (!facturaDocumentType?.id_tipo_documento) {
                throw new Error(
                  "No se encontró el tipo de documento Facturas.",
                );
              }

              return CrearDocumentoCompra(
                idCompra,
                facturaDocumentType.id_tipo_documento,
                file,
              );
            }),
        );

        if (isFile(purchaseToSave.informe?.documento_pdf)) {
          if (!informeDocumentType?.id_tipo_documento) {
            throw new Error(
              "No se encontró el tipo de documento Informe tecnico.",
            );
          }

          await CrearDocumentoCompra(
            idCompra,
            informeDocumentType.id_tipo_documento,
            purchaseToSave.informe.documento_pdf,
          );
        }

        setDialogOpen(false);
        setDialogData(clonePurchase());
        fetchPurchases(fechaDesde, fechaHasta);
        setSnackbarMsg(
          dialogMode === "create"
            ? "Compra creada!"
            : dialogMode === "docs"
              ? "Documentos actualizados!"
              : "Cambios guardados!",
        );
        setSnackbarOpen(true);
      } catch (err) {
        setDialogError(err.message || "Ocurrió un error al guardar");
      } finally {
        setDialogSaving(false);
      }
    },
    [dialogData, dialogMode, fetchPurchases, purchaseDocumentTypes],
  );

  const handlePurchaseDialogSave = useCallback(
    (fechaDesde, fechaHasta) => {
      if (
        dialogType === "purchases" &&
        !isRequiredPurchaseDataComplete(dialogData)
      ) {
        setDialogError(
          "Completá empleado, nombre de la compra, precio sugerido, motivo y fecha de compra.",
        );
        return;
      }

      if (dialogMode === "create" && !hasInvoiceDocument(dialogData)) {
        setDialogError("Adjuntá al menos una factura para crear la compra.");
        return;
      }

      if (
        dialogMode === "require-complete-informe" &&
        hasInformeData(dialogData.informe) &&
        !isInformeComplete(dialogData.informe)
      ) {
        setDialogError(
          "Completá todos los campos del informe: nro expediente, precio real, fecha licitación, fecha informe, solicitante y ganador.",
        );
        return;
      }

      handlePurchasesSave(
        {
          ...dialogData,
          precio_sugerido: normalizeCurrencyValue(dialogData.precio_sugerido),
          informe: {
            ...(dialogData.informe || {}),
            precio_real: normalizeCurrencyValue(
              dialogData.informe?.precio_real,
            ),
          },
        },
        fechaDesde,
        fechaHasta,
      );
    },
    [dialogData, dialogMode, dialogType, handlePurchasesSave],
  );

  const purchasesActions = useMemo(
    () => [
      {
        icon: FolderIcon,
        color: "primary",
        title: "Ver documentos",
        onClick: handleOpenEditDocs,
      },
      {
        icon: DeleteIcon,
        color: "error",
        title: "Eliminar Compra",
        onClick: handleDeletePurchase,
      },
    ],
    [handleOpenEditDocs, handleDeletePurchase],
  );

  const purchasesColumns = useMemo(() => {
    return generateColumns(EMPTY_PURCHASES, purchasesActions);
  }, [purchasesActions]);

  return (
    <PurchaseContext.Provider
      value={{
        snackbarOpen,
        setSnackbarOpen,
        snackbarMsg,
        setSnackbarMsg,

        purchasesRows,
        purchasesColumns,
        loadingPurchase,
        fetchPurchases,
        openCreatePurchases,
        handlePurchasesSave,
        handlePurchaseDialogSave,
        handleDialogChange,
        handleInformeTecnicoChange,
        handleEmpleadoChange,
        focusedCurrencyField,
        setFocusedCurrencyField,
        getCurrencyValue,
        handleCurrencyInputChange,
        handleCurrencyBlur,
        isPurchaseDataComplete,
        isInformeReady: isInformeComplete(dialogData.informe),
        purchaseDocuments,
        handleFacturaChange,
        handleInformePdfChange,
        handleRemoveFactura,
        handleDeletePurchaseDocument,
        getFileName,
        preview,
        closePreview,
        handlePreview,
        getDocumentId,

        dialogOpen,
        setDialogOpen,
        dialogType,
        setDialogType,
        dialogMode,
        setDialogMode,
        dialogData,
        setDialogData,
        dialogSaving,
        setDialogSaving,
        dialogError,
        setDialogError,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}
