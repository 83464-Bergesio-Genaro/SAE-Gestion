import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Grid,
  IconButton,
  Autocomplete,
  Typography,
  Stack,
} from "@mui/material";
import { Close, AddCircleOutline } from "@mui/icons-material";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import DocumentCard from "../../../shared/components/documents/DocumentCard";
import { SCHOLARSHIP_STRINGS } from "./scholarship.string";
import {
  ObtenerProyectosInvestigacion,
  ObtenerServiciosInternos,
  CrearBecarioEconomica,
  CrearBecarioSAE,
  CrearBecarioInvestigacion,
  CrearBecarioServicio,
} from "../../../api/BecasService";
import { TIPO_BECA, PERSONAL_FIELDS } from "./scholarship.configs";
import {
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
  construirNombre,
  firstNonEmptyText,
  getErrorMessage,
  getDocumentDisplayName,
  hasDocumentFile,
  isSelectedFile,
  normalizeText,
  obtenerLegajoDesdeEmail,
} from "./scholarship.utils";

const C = SCHOLARSHIP_STRINGS;

const DEFAULT_ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";

const getDocumentKey = (documento) =>
  documento.id ?? documento.id_tipo_documento ?? documento.nombre;

const isEconomicOptionalDocument = (documento) => documento.required === false;

// Une la configuracion local con tipos/archivos de la API y conserva el estado
// previo para no perder archivos elegidos ni opcionales ya visibles.
const buildDocumentsFromConfig = (
  documentsConfig,
  tiposDocumento = [],
  previousDocuments = [],
  documentos = [],
) => {
  return documentsConfig.map((documentConfig) => {
    const previousDocument = previousDocuments.find(
      (document) => getDocumentKey(document) === getDocumentKey(documentConfig),
    );
    const documentType = tiposDocumento.find(
      (tipoDocumento) =>
        normalizeText(tipoDocumento.nombre) ===
        normalizeText(documentConfig.nombre),
    );
    const uploadedDocument = documentos.find(
      (documento) =>
        documento.subido &&
        Number(documento.id_tipo_documento) ===
          Number(documentType?.id ?? documentType?.id_tipo_documento),
    );

    return {
      ...documentConfig,
      archivo: previousDocument?.archivo ?? documentConfig.archivo ?? null,
      archivoNombre: firstNonEmptyText(
        previousDocument?.archivoNombre,
        documentConfig.archivoNombre,
        documentConfig.nombre_completo_documento,
        documentConfig.nombre_documento,
        uploadedDocument?.nombre_completo_documento,
        uploadedDocument?.nombre_documento,
      ),
      subido: Boolean(
        previousDocument?.archivo ||
        documentConfig.subido ||
        documentConfig.archivoNombre ||
        uploadedDocument,
      ),
      id_archivo:
        uploadedDocument?.id ??
        previousDocument?.id_archivo ??
        documentConfig.id_archivo ??
        null,
      id_tipo_documento:
        documentType?.id ??
        documentType?.id_tipo_documento ??
        documentConfig.id_tipo_documento,
      visible: Boolean(
        documentConfig.required ||
        previousDocument?.visible ||
        previousDocument?.archivoNombre ||
        documentConfig.archivoNombre ||
        uploadedDocument,
      ),
      extension:
        documentType?.extension ??
        uploadedDocument?.extension ??
        documentConfig.extension ??
        DEFAULT_ACCEPTED_EXTENSIONS,
    };
  });
};

export default function ScholarshipsForm({
  open,
  onClose,
  user,
  becarioActual,
  setBecarioActual,
  cargarMisBecas,
  cargarTiposDocumento,
  subirDocumentoEstudiante,
  documentos = [],
  documentosEconomica: documentosEconomicaBase = [],
  handlePreview,
  handleDeleteDocument,
  showSnackbar,
  perfilCompleto,
  camposPerfilFaltantes = [],
}) {
  const datosPerfil = user?.datosPerfil ?? {};
  const userLegajo = datosPerfil.legajo;
  const userNombreCompleto = datosPerfil.nombres;
  const userApellido = datosPerfil.apellidos;
  const userDniCompleto = datosPerfil.dni;
  const userFechaNacimiento = datosPerfil.fecha_nacimiento;
  const userTelefonoCompleto = datosPerfil.telefono;
  const userMailCompleto = datosPerfil.email;
  const userDomicilioCompleto = datosPerfil.direccion;
  const userEmail = user?.email;
  const userNombre = user?.nombre;
  const userDni = user?.dni;
  const userTelefono = user?.telefono;
  const userDomicilio = user?.domicilio;
  const becarioId = becarioActual?.id;
  const becarioLegajo = becarioActual?.legajo;
  const becarioNombre = becarioActual?.nombre_becario;
  const becarioAlquila = becarioActual?.alquila;
  const becarioFechaSolicitud = becarioActual?.fecha_solicitud;
  const becarioAceptadoInicio = becarioActual?.aceptado_inicio;
  const becarioPuedePagarle = becarioActual?.puede_pagarle;
  const becarioActivo = becarioActual?.activo;
  const becarioAnioBeca = becarioActual?.anio_beca;
  const becarioPrevioId = becarioActual?.id_becario_previo;

  // Base del formulario: perfil completo, becario existente y usuario logueado,
  // en ese orden de prioridad.
  const initialFormBeca = useMemo(
    () => ({
      id: becarioId ?? 0,
      legajo: userLegajo ?? becarioLegajo ?? userEmail ?? "",
      nombre_becario: becarioNombre ?? userNombreCompleto ?? userNombre ?? "",
      nombre: userNombreCompleto ?? userNombre ?? "",
      apellido: userApellido ?? "",
      dni: userDniCompleto ?? userDni ?? "",
      fechaNacimiento: userFechaNacimiento ?? "",
      telefono: userTelefonoCompleto ?? userTelefono ?? "",
      email: userMailCompleto ?? userEmail ?? "",
      domicilio: userDomicilioCompleto ?? userDomicilio ?? "",
      alquila: becarioAlquila ?? true,
      fecha_solicitud: becarioFechaSolicitud ?? "",
      aceptado_inicio: becarioAceptadoInicio ?? false,
      puede_pagarle: becarioPuedePagarle ?? false,
      activo: becarioActivo ?? true,
      anio_beca: becarioAnioBeca ?? new Date().getFullYear(),
      id_becario_previo: becarioPrevioId ?? null,
      tipoBeca: "",
      beca: null,
      descripcionSituacion: "",
    }),
    [
      userLegajo,
      becarioLegajo,
      userEmail,
      becarioNombre,
      userNombreCompleto,
      userNombre,
      becarioId,
      userApellido,
      userDniCompleto,
      userDni,
      userFechaNacimiento,
      userTelefonoCompleto,
      userTelefono,
      userMailCompleto,
      userDomicilioCompleto,
      userDomicilio,
      becarioAlquila,
      becarioFechaSolicitud,
      becarioAceptadoInicio,
      becarioPuedePagarle,
      becarioActivo,
      becarioAnioBeca,
      becarioPrevioId,
    ],
  );
  const [formBeca, setFormBeca] = useState(initialFormBeca);
  const [saving, setSaving] = useState(false);
  const [proyectosRows, setProyectosRows] = useState([]);
  const [serviciosRows, setServiciosRows] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [documentosRequeridos, setDocumentosRequeridos] = useState([]);
  const [documentosEconomica, setDocumentosEconomica] = useState([]);
  const [uploadingDocumentoId, setUploadingDocumentoId] = useState(null);
  const [documentoEconomicoOpcionalId, setDocumentoEconomicoOpcionalId] =
    useState("");

  // Combos dependientes del tipo de beca. Se cargan al abrir el dialog para no
  // pedir datos mientras el formulario esta cerrado.
  const cargarProyectosInvestigacion = useCallback(async () => {
    try {
      const data = await ObtenerProyectosInvestigacion();
      setProyectosRows(Array.isArray(data) ? data : []);
    } catch {
      setProyectosRows([]);
    }
  }, []);

  const cargarServiciosInternos = useCallback(async () => {
    try {
      const data = await ObtenerServiciosInternos();
      setServiciosRows(Array.isArray(data) ? data : []);
    } catch {
      setServiciosRows([]);
    }
  }, []);

  const cargarTiposDocumentoFormulario = useCallback(async () => {
    try {
      const data = await cargarTiposDocumento();
      setTiposDocumento(Array.isArray(data) ? data : []);
    } catch {
      setTiposDocumento([]);
    }
  }, [cargarTiposDocumento]);

  useEffect(() => {
    if (!open) return;
    setFormBeca(initialFormBeca);

    cargarProyectosInvestigacion();
    cargarServiciosInternos();
    cargarTiposDocumentoFormulario();
  }, [
    open,
    initialFormBeca,
    cargarProyectosInvestigacion,
    cargarServiciosInternos,
    cargarTiposDocumentoFormulario,
  ]);

  // Los requeridos vienen resueltos por Scholarships. El form los copia para
  // poder reflejar cargas y borrados sin mutar props.
  useEffect(() => {
    if (!open) return;
    setDocumentosRequeridos(documentos);
  }, [documentos, open]);

  // Los documentos economicos dependen del tipo seleccionado. Se reconstruyen
  // mezclando configuracion, tipos de documento y archivos ya subidos.
  useEffect(() => {
    setDocumentosEconomica((prev) =>
      formBeca.tipoBeca === TIPO_BECA.ECONOMICA
        ? buildDocumentsFromConfig(
            documentosEconomicaBase,
            tiposDocumento,
            prev,
            documentos,
          )
        : [],
    );
  }, [formBeca.tipoBeca, tiposDocumento, documentos, documentosEconomicaBase]);

  const documentosEconomicaVisibles = documentosEconomica.filter(
    (documento) =>
      documento.required ||
      documento.visible ||
      Boolean(getDocumentDisplayName(documento)),
  );

  const documentosEconomicosOpcionalesDisponibles = documentosEconomica.filter(
    (documento) =>
      isEconomicOptionalDocument(documento) &&
      !documento.visible &&
      !getDocumentDisplayName(documento),
  );

  // Agregar un opcional solo lo vuelve visible: el documento ya existe en la
  // lista base, asi evitamos duplicados.
  const handleAgregarDocumentoEconomico = () => {
    if (!documentoEconomicoOpcionalId) return;

    setDocumentosEconomica((prev) =>
      prev.map((documento) =>
        getDocumentKey(documento) === documentoEconomicoOpcionalId
          ? { ...documento, visible: true }
          : documento,
      ),
    );
    setDocumentoEconomicoOpcionalId("");
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormBeca((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "tipoBeca" ? { beca: null } : {}),
    }));
  };

  // Carga inmediata del archivo: valida formato y tamano, renombra segun
  // formatoNombre, sube por el metodo del padre y actualiza la card local.
  const handleDocumentoChange = async (
    e,
    documentoId,
    documentos,
    setDocumentos,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const selectedDocument = documentos.find(
      (doc) => getDocumentKey(doc) === documentoId,
    );
    if (!selectedDocument) return;

    const extensionArchivo = `.${file.name.split(".").pop().toLowerCase()}`;
    const extensionesPermitidas = (
      selectedDocument.extension ?? DEFAULT_ACCEPTED_EXTENSIONS
    )
      .split(",")
      .map((ext) => ext.trim().toLowerCase());

    if (!extensionesPermitidas.includes(extensionArchivo)) {
      showSnackbar(
        C.uploadAllowedExtensions(selectedDocument.extension),
        "warning",
      );
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      showSnackbar(C.uploadMaxSize(MAX_SIZE_MB), "warning");
      e.target.value = "";
      return;
    }

    const nombreArchivo = selectedDocument.formatoNombre
      ? construirNombre(
          selectedDocument.formatoNombre,
          {
            legajo: obtenerLegajoDesdeEmail(
              formBeca.legajo ?? user?.legajo ?? user?.email,
            ),
          },
          extensionArchivo,
        )
      : file.name;

    const archivoRenombrado = new File([file], nombreArchivo, {
      type: file.type,
      lastModified: file.lastModified,
    });

    if (!selectedDocument.id_tipo_documento) {
      showSnackbar(C.documentTypeNotFound(selectedDocument.nombre), "error");
      e.target.value = "";
      return;
    }

    try {
      setUploadingDocumentoId(documentoId);

      const documentoGuardado = await subirDocumentoEstudiante(
        selectedDocument.id_tipo_documento,
        archivoRenombrado,
      );

      setDocumentos((prev) =>
        prev.map((doc) =>
          getDocumentKey(doc) === documentoId
            ? {
                ...doc,
                archivo: documentoGuardado.archivo,
                archivoNombre:
                  documentoGuardado.nombre_completo_documento ??
                  documentoGuardado.nombre_documento ??
                  nombreArchivo,
                subido: true,
                visible: true,
                id_archivo: documentoGuardado.id,
                extension: documentoGuardado.extension ?? doc.extension,
              }
            : doc,
        ),
      );

      showSnackbar(C.uploadSuccess, "success");
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      showSnackbar(getErrorMessage(error, C.uploadError), "error");
    } finally {
      setUploadingDocumentoId(null);
      e.target.value = "";
    }
  };

  // Limpieza solo local para archivos que todavia no tienen id en base.
  const clearDocumentoLocal = (documentoId, setDocumentos) => {
    setDocumentos((prev) =>
      prev.map((doc) =>
        getDocumentKey(doc) === documentoId
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
  };

  // Si el documento ya esta guardado delega al padre para confirmar y borrar en
  // base; si no, limpia el estado local.
  const handleDocumentoDelete = (item, setDocumentos) => {
    if (item.id_archivo) {
      handleDeleteDocument?.(item);
      return;
    }

    clearDocumentoLocal(getDocumentKey(item), setDocumentos);
  };

  const handleDocumentoEconomicoDelete = (item) => {
    if (item.id_archivo) {
      handleDeleteDocument?.(item);
      return;
    }

    if (isEconomicOptionalDocument(item)) {
      setDocumentosEconomica((prev) =>
        prev.map((doc) =>
          getDocumentKey(doc) === getDocumentKey(item)
            ? {
                ...doc,
                archivo: null,
                archivoNombre: "",
                subido: false,
                id_archivo: null,
                visible: false,
              }
            : doc,
        ),
      );
      return;
    }

    clearDocumentoLocal(getDocumentKey(item), setDocumentosEconomica);
  };

  // Reglas previas al guardado: tipo de beca, opcion asociada, documentos
  // obligatorios y descripcion economica cuando corresponde.
  const validarFormulario = () => {
    if (!formBeca.tipoBeca) {
      showSnackbar(C.validationSelectScholarshipType, "warning");
      return false;
    }

    if (
      (formBeca.tipoBeca === TIPO_BECA.INVESTIGACION ||
        formBeca.tipoBeca === TIPO_BECA.SERVICIO) &&
      !formBeca.beca?.id
    ) {
      showSnackbar(C.validationSelectScholarshipOption, "warning");
      return false;
    }

    const documentosFaltantes = [
      ...documentosRequeridos,
      ...documentosEconomicaVisibles,
    ].filter((doc) => (doc.required ?? true) && !doc.archivo && !doc.subido);

    if (documentosFaltantes.length > 0) {
      showSnackbar(
        C.validationAttachDocuments(
          documentosFaltantes.map((doc) => doc.nombre).join(", "),
        ),
        "warning",
      );
      return false;
    }

    if (
      formBeca.tipoBeca === TIPO_BECA.ECONOMICA &&
      !formBeca.descripcionSituacion.trim()
    ) {
      showSnackbar(C.validationDescribeEconomicSituation, "warning");
      return false;
    }

    return true;
  };

  // Respaldo para archivos seleccionados localmente que no pasaron por la carga
  // inmediata antes de guardar la solicitud.
  const subirDocumentosRequeridos = async () => {
    const documentosConArchivo = [
      ...documentosRequeridos,
      ...documentosEconomicaVisibles,
    ].filter((doc) => isSelectedFile(doc.archivo));

    await Promise.all(
      documentosConArchivo.map((doc) => {
        if (!doc.id_tipo_documento) {
          throw new Error(C.documentTypeNotFound(doc.nombre));
        }

        return subirDocumentoEstudiante(doc.id_tipo_documento, doc.archivo);
      }),
    );
  };

  // La beca especifica necesita un becario SAE. Si existe se reutiliza; si no,
  // se crea antes de avanzar.
  const crearBecarioSiNoExiste = async () => {
    if (becarioActual?.id) return becarioActual;

    const payloadBecario = {
      id: 0,
      legajo: user.email,
      nombre_becario: user.nombre,
      alquila: formBeca.alquila,
      fecha_solicitud: new Date().toISOString(),
      aceptado_inicio: false,
      puede_pagarle: false,
      activo: true,
      anio_beca: new Date().getFullYear(),
      id_becario_previo: null,
    };

    const nuevoBecario = await CrearBecarioSAE(payloadBecario);
    setBecarioActual(nuevoBecario);
    return nuevoBecario;
  };

  // Cada tipo de beca usa un endpoint distinto, pero devuelve un mensaje comun
  // para mostrar al final del guardado.
  const crearBecaSegunTipo = async (becarioId) => {
    switch (formBeca.tipoBeca) {
      case TIPO_BECA.ECONOMICA:
        await CrearBecarioEconomica(becarioId);
        return C.createEconomicScholarshipSuccess;
      case TIPO_BECA.INVESTIGACION:
        await CrearBecarioInvestigacion(becarioId, formBeca.beca.id);
        return C.createInvestigationScholarshipSuccess;
      case TIPO_BECA.SERVICIO:
        await CrearBecarioServicio(becarioId, formBeca.beca.id);
        return C.createServiceScholarshipSuccess;
      default:
        throw new Error(C.invalidScholarshipType);
    }
  };

  // Flujo completo del boton Guardar: valida, crea/reutiliza becario, crea la
  // beca, sube pendientes, refresca Scholarships y cierra el dialog.
  const handleDialogSave = async () => {
    if (!perfilCompleto) {
      showSnackbar(
        `Completá tu perfil antes de solicitar una beca. Faltan: ${camposPerfilFaltantes.join(", ")}.`,
        "warning",
      );
      return;
    }

    if (!validarFormulario()) return;

    try {
      setSaving(true);
      const becario = await crearBecarioSiNoExiste();
      const mensaje = await crearBecaSegunTipo(becario.id);
      await subirDocumentosRequeridos();
      await cargarMisBecas();
      onClose();
      showSnackbar(mensaje, "success");
    } catch (err) {
      console.error("Error al crear la beca", err);
      showSnackbar(C.createScholarshipError, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {C.cardSolicitarTitle}
        </Typography>
        <IconButton onClick={handleClose} size="small" disabled={saving}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "16px !important",
        }}
      >
        {saving && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              bgcolor: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(2px)",
            }}
          >
            <CircularProgress size={36} />
            <Typography variant="body2" color="text.secondary">
              {C.savingRequest}
            </Typography>
          </Box>
        )}

        <Divider variant="middle" sx={{ mt: 0.5 }}>
          <Chip
            label={C.DatosPersonales}
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Divider>

        <Grid container spacing={2}>
          {PERSONAL_FIELDS.map((field) => (
            <Grid
              key={field.name}
              size={{ xs: 12, sm: 6, md: field.md ?? 6 }}
            >
              <SAETextField
                fullWidth
                label={field.label}
                name={field.name}
                disabled
                type={field.type}
                InputLabelProps={field.InputLabelProps}
                value={datosPerfil[field.name] ?? ""}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "rgba(0, 0, 0, 0.75)",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Divider variant="middle" sx={{ mt: 0.5 }}>
          <Chip label={C.TiposBecas} size="small" sx={{ fontWeight: 700 }} />
        </Divider>

        <Autocomplete
          fullWidth
          disabled={saving}
          options={C.listaTiposBecas}
          value={
            C.listaTiposBecas.find(
              (beca) => beca.nombre === formBeca.tipoBeca,
            ) ?? null
          }
          getOptionLabel={(option) => option.nombre ?? ""}
          isOptionEqualToValue={(option, value) =>
            option.nombre === value.nombre
          }
          onChange={(_, value) =>
            setFormBeca((prev) => ({
              ...prev,
              tipoBeca: value?.nombre ?? "",
              beca: null,
            }))
          }
          renderInput={(params) => (
            <SAETextField {...params} label={C.tipoBecaLabel} />
          )}
        />

        {formBeca.tipoBeca === TIPO_BECA.INVESTIGACION && (
          <Autocomplete
            fullWidth
            disabled={saving}
            options={proyectosRows}
            value={formBeca.beca ?? null}
            getOptionLabel={(option) =>
              option.nombre_proyecto_investigacion ?? ""
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) =>
              setFormBeca((prev) => ({ ...prev, beca: value }))
            }
            renderInput={(params) => (
              <SAETextField {...params} label={C.proyectoInvestigacionLabel} />
            )}
          />
        )}

        {formBeca.tipoBeca === TIPO_BECA.SERVICIO && (
          <Autocomplete
            fullWidth
            disabled={saving}
            options={serviciosRows}
            value={formBeca.beca ?? null}
            getOptionLabel={(option) => option.nombre ?? ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) =>
              setFormBeca((prev) => ({ ...prev, beca: value }))
            }
            renderInput={(params) => (
              <SAETextField {...params} label={C.areaLabel} />
            )}
          />
        )}

        {formBeca.tipoBeca === TIPO_BECA.ECONOMICA && (
          <SAETextField
            fullWidth
            multiline
            minRows={4}
            label={C.descripcionSituacionLabel}
            name="descripcionSituacion"
            value={formBeca.descripcionSituacion}
            onChange={handleChange}
            disabled={saving}
          />
        )}

        {documentosRequeridos.length > 0 && (
          <Divider variant="middle" sx={{ mt: 0.5 }}>
            <Chip
              label={C.requiredDocumentsTitle}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Divider>
        )}

        {documentosRequeridos.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {documentosRequeridos.map((item) => (
              <Grid item xs={12} sm={12} key={getDocumentKey(item)}>
                <DocumentCard
                  documento={item}
                  notUploadedLabel={C.docStateNotUploaded}
                  uploadedLabel={C.docStataUplodaded}
                  onPreview={handlePreview}
                  onFileChange={(event, documento) =>
                    handleDocumentoChange(
                      event,
                      getDocumentKey(documento),
                      documentosRequeridos,
                      setDocumentosRequeridos,
                    )
                  }
                  onDelete={(documento) =>
                    handleDocumentoDelete(documento, setDocumentosRequeridos)
                  }
                  uploadDisabled={
                    item.subido || uploadingDocumentoId === getDocumentKey(item)
                  }
                  deleteDisabled={!item.subido}
                  showRequirement
                />
              </Grid>
            ))}
          </Grid>
        )}

        {documentosEconomicaVisibles.length > 0 && (
          <Divider variant="middle" sx={{ mt: 0.5 }}>
            <Chip
              label={C.economicDocumentsTitle}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Divider>
        )}

        {formBeca.tipoBeca === TIPO_BECA.ECONOMICA &&
          documentosEconomicosOpcionalesDisponibles.length > 0 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Autocomplete
                fullWidth
                disabled={saving}
                options={documentosEconomicosOpcionalesDisponibles}
                value={
                  documentosEconomicosOpcionalesDisponibles.find(
                    (documento) =>
                      getDocumentKey(documento) ===
                      documentoEconomicoOpcionalId,
                  ) ?? null
                }
                getOptionLabel={(option) => option.nombre ?? ""}
                isOptionEqualToValue={(option, value) =>
                  getDocumentKey(option) === getDocumentKey(value)
                }
                onChange={(_, value) =>
                  setDocumentoEconomicoOpcionalId(
                    value ? getDocumentKey(value) : "",
                  )
                }
                renderInput={(params) => (
                  <SAETextField
                    {...params}
                    label={C.addOptionalEconomicDocumentLabel}
                  />
                )}
              />
              <SAEButton
                variant="contained"
                onClick={handleAgregarDocumentoEconomico}
                disabled={!documentoEconomicoOpcionalId || saving}
                startIcon={<AddCircleOutline />}
                sx={{ minWidth: { sm: 150 } }}
              >
                {C.addButton}
              </SAEButton>
            </Stack>
          )}

        {documentosEconomicaVisibles.length > 0 && (
          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            {documentosEconomicaVisibles.map((item) => (
              <Grid item xs={12} sm={12} key={getDocumentKey(item)}>
                <DocumentCard
                  documento={item}
                  notUploadedLabel={C.docStateNotUploaded}
                  uploadedLabel={C.docStataUplodaded}
                  onPreview={handlePreview}
                  onFileChange={(event, documento) =>
                    handleDocumentoChange(
                      event,
                      getDocumentKey(documento),
                      documentosEconomica,
                      setDocumentosEconomica,
                    )
                  }
                  onDelete={handleDocumentoEconomicoDelete}
                  uploadDisabled={
                    item.subido || uploadingDocumentoId === getDocumentKey(item)
                  }
                  deleteDisabled={
                    !isEconomicOptionalDocument(item) && !hasDocumentFile(item)
                  }
                  showRequirement
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <SAEButton onClick={handleClose} disabled={saving}>
          {C.cancelButton}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleDialogSave}
          disabled={saving}
        >
          {saving ? C.savingButton : C.saveButton}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
