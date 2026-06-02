import { useState, useEffect, useCallback } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  Close,
  FileUpload,
  Delete,
  AddCircleOutline,
} from "@mui/icons-material";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import { SCHOLARSHIP_STRINGS } from "./scholarship.string";
import {
  ObtenerProyectosInvestigacion,
  ObtenerServiciosInternos,
  CrearBecarioEconomica,
  CrearBecarioSAE,
  CrearBecarioInvestigacion,
  CrearBecarioServicio,
} from "../../../api/BecasService";
import {
  TIPO_BECA,
  PERSONAL_FIELDS,
  ECONOMIC_DOCUMENTS,
  ECONOMIC_OPTIONAL_DOCUMENTS,
} from "./scholarship.configs";
import {
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
  construirNombre,
  obtenerApellidoDesdeNombre,
  obtenerCarreraDesdeEmail,
} from "./scholarship.utils";

const C = SCHOLARSHIP_STRINGS;

const DEFAULT_ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";

const normalizeText = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const firstNonEmptyText = (...values) =>
  values.find((value) => String(value ?? "").trim()) ?? "";

const getDocumentKey = (documento) =>
  documento.id ?? documento.id_tipo_documento ?? documento.nombre;

const isSelectedFile = (archivo) =>
  typeof File !== "undefined" && archivo instanceof File;

const getDocumentPreviewId = (documento) =>
  documento.id_archivo ?? documento.id_documento ?? documento.id ?? null;

const getDocumentDisplayName = (documento) =>
  firstNonEmptyText(
    documento.archivoNombre,
    documento.nombre_completo_documento,
    documento.nombre_documento,
  );

const isEconomicOptionalDocument = (documento) =>
  ECONOMIC_OPTIONAL_DOCUMENTS.some(
    (optionalDocument) =>
      getDocumentKey(optionalDocument) === getDocumentKey(documento),
  );

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
      archivo: previousDocument?.archivo ?? null,
      archivoNombre: firstNonEmptyText(
        previousDocument?.archivoNombre,
        uploadedDocument?.nombre_completo_documento,
        uploadedDocument?.nombre_documento,
      ),
      subido: Boolean(previousDocument?.archivo || uploadedDocument),
      id_archivo: uploadedDocument?.id ?? previousDocument?.id_archivo ?? null,
      id_tipo_documento: documentType?.id ?? documentType?.id_tipo_documento,
      extension:
        documentType?.extension ??
        uploadedDocument?.extension ??
        documentConfig.extension ??
        DEFAULT_ACCEPTED_EXTENSIONS,
    };
  });
};

const getInitialFormBeca = (user, becarioActual = null) => ({
  id: becarioActual?.id ?? 0,
  legajo:
    user?.DatosCompletos?.legajo ?? becarioActual?.legajo ?? user?.email ?? "",
  nombre_becario:
    becarioActual?.nombre_becario ??
    user?.DatosCompletos?.nombre ??
    user?.nombre ??
    "",
  nombre: user?.DatosCompletos?.nombre ?? user?.nombre ?? "",
  apellido: user?.DatosCompletos?.apellido ?? "",
  dni: user?.DatosCompletos?.dni ?? user?.dni ?? "",
  fechaNacimiento:
    user?.DatosCompletos?.FechaNacimiento ??
    user?.DatosCompletos?.fechaNacimiento ??
    "",
  telefono: user?.DatosCompletos?.Telefono ?? user?.telefono ?? "",
  email: user?.DatosCompletos?.mail ?? user?.email ?? "",
  domicilio: user?.DatosCompletos?.Domicilio ?? user?.domicilio ?? "",
  alquila: becarioActual?.alquila ?? true,
  fecha_solicitud: becarioActual?.fecha_solicitud ?? "",
  aceptado_inicio: becarioActual?.aceptado_inicio ?? false,
  puede_pagarle: becarioActual?.puede_pagarle ?? false,
  activo: becarioActual?.activo ?? true,
  anio_beca: becarioActual?.anio_beca ?? new Date().getFullYear(),
  id_becario_previo: becarioActual?.id_becario_previo ?? null,
  tipoBeca: "",
  beca: null,
  descripcionSituacion: "",
});

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
  documentosEconomica: documentosEconomicaBase = ECONOMIC_DOCUMENTS,
  handlePreview,
  showSnackbar,
}) {
  const [formBeca, setFormBeca] = useState(() =>
    getInitialFormBeca(user, becarioActual),
  );
  const [saving, setSaving] = useState(false);
  const [proyectosRows, setProyectosRows] = useState([]);
  const [serviciosRows, setServiciosRows] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [documentosRequeridos, setDocumentosRequeridos] = useState([]);
  const [documentosEconomica, setDocumentosEconomica] = useState([]);
  const [documentoEconomicoOpcionalId, setDocumentoEconomicoOpcionalId] =
    useState("");

  const cargarProyectosInvestigacion = useCallback(async () => {
    try {
      const data = await ObtenerProyectosInvestigacion();
      setProyectosRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setProyectosRows([]);
      console.error("Error al cargar proyectos de investigación:", err);
    }
  }, []);

  const cargarServiciosInternos = useCallback(async () => {
    try {
      const data = await ObtenerServiciosInternos();
      setServiciosRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setServiciosRows([]);
      console.error("Error al cargar servicios internos:", err);
    }
  }, []);

  const cargarTiposDocumentoFormulario = useCallback(async () => {
    try {
      const data = await cargarTiposDocumento();
      setTiposDocumento(Array.isArray(data) ? data : []);
    } catch (err) {
      setTiposDocumento([]);
      console.error("Error al cargar tipos de documento:", err);
    }
  }, [cargarTiposDocumento]);

  useEffect(() => {
    if (!open) return;
    setFormBeca(getInitialFormBeca(user, becarioActual));
    setDocumentosRequeridos(documentos);

    cargarProyectosInvestigacion();
    cargarServiciosInternos();
    cargarTiposDocumentoFormulario();
  }, [
    open,
    user,
    becarioActual,
    documentos,
    cargarProyectosInvestigacion,
    cargarServiciosInternos,
    cargarTiposDocumentoFormulario,
  ]);

  useEffect(() => {
    if (!open) return;
    setDocumentosRequeridos(documentos);
  }, [documentos, open]);

  useEffect(() => {
    setDocumentosEconomica((prev) =>
      formBeca.tipoBeca === TIPO_BECA.ECONOMICA
        ? [
            ...buildDocumentsFromConfig(
              documentosEconomicaBase,
              tiposDocumento,
              prev,
              documentos,
            ),
            ...buildDocumentsFromConfig(
              prev.filter(
                (doc) =>
                  !documentosEconomicaBase.some(
                    (baseDocument) =>
                      getDocumentKey(baseDocument) === getDocumentKey(doc),
                  ),
              ),
              tiposDocumento,
              prev,
              documentos,
            ),
          ]
        : [],
    );
  }, [formBeca.tipoBeca, tiposDocumento, documentos, documentosEconomicaBase]);

  const documentosEconomicosOpcionalesDisponibles =
    ECONOMIC_OPTIONAL_DOCUMENTS.filter(
      (documento) =>
        !documentosEconomica.some(
          (doc) => getDocumentKey(doc) === getDocumentKey(documento),
        ),
    );

  const handleAgregarDocumentoEconomico = () => {
    if (!documentoEconomicoOpcionalId) return;

    const documentoConfig = ECONOMIC_OPTIONAL_DOCUMENTS.find(
      (documento) => getDocumentKey(documento) === documentoEconomicoOpcionalId,
    );

    if (!documentoConfig) return;

    const [documentoNuevo] = buildDocumentsFromConfig(
      [documentoConfig],
      tiposDocumento,
      [],
      documentos,
    );

    setDocumentosEconomica((prev) => [...prev, documentoNuevo]);
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

  const handleDocumentoChange = (e, documentoId, documentos, setDocumentos) => {
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
        `Solo se permiten archivos: ${selectedDocument.extension}`,
        "warning",
      );
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      showSnackbar(
        `El archivo no puede superar los ${MAX_SIZE_MB} MB.`,
        "warning",
      );
      e.target.value = "";
      return;
    }

    const nombreArchivo = selectedDocument.formatoNombre
      ? construirNombre(
          selectedDocument.formatoNombre,
          {
            legajo: formBeca.legajo ?? user?.legajo ?? user?.email,
            apellido:
              formBeca.apellido ||
              obtenerApellidoDesdeNombre(
                formBeca.nombre_becario || formBeca.nombre || user?.nombre,
              ),
            carrera: obtenerCarreraDesdeEmail(formBeca.email || user?.email),
          },
          extensionArchivo,
        )
      : file.name;

    const archivoRenombrado = new File([file], nombreArchivo, {
      type: file.type,
      lastModified: file.lastModified,
    });

    setDocumentos((prev) =>
      prev.map((doc) =>
        getDocumentKey(doc) === documentoId
          ? {
              ...doc,
              archivo: archivoRenombrado,
              archivoNombre: nombreArchivo,
              subido: true,
            }
          : doc,
      ),
    );
    e.target.value = "";
  };

  const handleDocumentoDelete = (documentoId, setDocumentos) => {
    setDocumentos((prev) =>
      prev.map((doc) =>
        getDocumentKey(doc) === documentoId
          ? {
              ...doc,
              archivo: null,
              archivoNombre: "",
              subido: false,
            }
          : doc,
      ),
    );
  };

  const handleDocumentoEconomicoDelete = (item) => {
    if (isEconomicOptionalDocument(item)) {
      setDocumentosEconomica((prev) =>
        prev.filter((doc) => getDocumentKey(doc) !== getDocumentKey(item)),
      );
      return;
    }

    handleDocumentoDelete(getDocumentKey(item), setDocumentosEconomica);
  };

  const validarFormulario = () => {
    if (!formBeca.tipoBeca) {
      showSnackbar("Seleccioná un tipo de beca", "warning");
      return false;
    }

    if (
      (formBeca.tipoBeca === TIPO_BECA.INVESTIGACION ||
        formBeca.tipoBeca === TIPO_BECA.SERVICIO) &&
      !formBeca.beca?.id
    ) {
      showSnackbar("Seleccioná una opción para la beca", "warning");
      return false;
    }

    const documentosFaltantes = [
      ...documentosRequeridos,
      ...documentosEconomica,
    ].filter((doc) => (doc.required ?? true) && !doc.archivo && !doc.subido);

    if (documentosFaltantes.length > 0) {
      showSnackbar(
        `Adjuntá: ${documentosFaltantes.map((doc) => doc.nombre).join(", ")}`,
        "warning",
      );
      return false;
    }

    if (
      formBeca.tipoBeca === TIPO_BECA.ECONOMICA &&
      !formBeca.descripcionSituacion.trim()
    ) {
      showSnackbar("Describí tu situación económica", "warning");
      return false;
    }

    return true;
  };

  const subirDocumentosRequeridos = async () => {
    const documentosConArchivo = [
      ...documentosRequeridos,
      ...documentosEconomica,
    ].filter((doc) => isSelectedFile(doc.archivo));

    await Promise.all(
      documentosConArchivo.map((doc) => {
        if (!doc.id_tipo_documento) {
          throw new Error(`No se encontró el tipo de documento: ${doc.nombre}`);
        }

        return subirDocumentoEstudiante(doc.id_tipo_documento, doc.archivo);
      }),
    );
  };

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

  const crearBecaSegunTipo = async (becarioId) => {
    switch (formBeca.tipoBeca) {
      case TIPO_BECA.ECONOMICA:
        await CrearBecarioEconomica(becarioId);
        return "Se creó la beca económica correctamente";
      case TIPO_BECA.INVESTIGACION:
        await CrearBecarioInvestigacion(becarioId, formBeca.beca.id);
        return "Se creó la beca de investigación correctamente";
      case TIPO_BECA.SERVICIO:
        await CrearBecarioServicio(becarioId, formBeca.beca.id);
        return "Se creó la beca de servicio correctamente";
      default:
        throw new Error("Tipo de beca inválido");
    }
  };

  const handleDialogSave = async () => {
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
      showSnackbar("Hubo un error al crear la beca", "error");
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
          Solicitar Beca
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
              Guardando solicitud...
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
            <Grid item key={field.name} xs={12} sm={field.fullWidth ? 12 : 6}>
              <SAETextField
                fullWidth
                label={field.label}
                name={field.name}
                disabled
                type={field.type}
                InputLabelProps={field.InputLabelProps}
                value={formBeca[field.name] ?? ""}
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>

        <Divider variant="middle" sx={{ mt: 0.5 }}>
          <Chip label={C.TiposBecas} size="small" sx={{ fontWeight: 700 }} />
        </Divider>

        <FormControl fullWidth disabled={saving}>
          <InputLabel>Tipo Beca</InputLabel>
          <Select
            value={formBeca.tipoBeca}
            onChange={handleChange}
            name="tipoBeca"
            input={<OutlinedInput label="Tipo Beca" />}
          >
            {C.listaTiposBecas.map((beca) => (
              <MenuItem key={beca.nombre} value={beca.nombre}>
                {beca.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {formBeca.tipoBeca === TIPO_BECA.INVESTIGACION && (
          <FormControl fullWidth disabled={saving}>
            <InputLabel>Proyecto Investigación</InputLabel>
            <Select
              value={formBeca.beca ?? ""}
              onChange={handleChange}
              name="beca"
              input={<OutlinedInput label="Proyecto Investigación" />}
            >
              {proyectosRows.map((proyecto) => (
                <MenuItem key={proyecto.id} value={proyecto}>
                  {proyecto.nombre_proyecto_investigacion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {formBeca.tipoBeca === TIPO_BECA.SERVICIO && (
          <FormControl fullWidth disabled={saving}>
            <InputLabel>Área</InputLabel>
            <Select
              value={formBeca.beca ?? ""}
              onChange={handleChange}
              name="beca"
              input={<OutlinedInput label="Área" />}
            >
              {serviciosRows.map((servicio) => (
                <MenuItem key={servicio.id} value={servicio}>
                  {servicio.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {formBeca.tipoBeca === TIPO_BECA.ECONOMICA && (
          <SAETextField
            fullWidth
            multiline
            minRows={4}
            label="Describe tu situación económica"
            name="descripcionSituacion"
            value={formBeca.descripcionSituacion}
            onChange={handleChange}
            disabled={saving}
          />
        )}

        {documentosRequeridos.length > 0 && (
          <Divider variant="middle" sx={{ mt: 0.5 }}>
            <Chip
              label="Documentos Requeridos"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Divider>
        )}

        {documentosRequeridos.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {documentosRequeridos.map((item) => (
              <Grid item xs={12} sm={12} key={getDocumentKey(item)}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    maxWidth: 357,
                    minWidth: 357,
                    flexDirection: "column",
                    boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
                    border: "1px solid rgba(17, 53, 101, 0.08)",
                    transition:
                      "background-color 0.25s ease, border-color 0.25s ease",

                    "&:hover": {
                      backgroundColor: "#f1f5fb", // un tono más oscuro que el fondo actual
                      borderColor: "rgba(17, 53, 101, 0.2)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack sx={{ height: "100%" }}>
                      <Typography variant="h6">
                        <strong>{item.nombre}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Formatos permitidos: {item.extension}
                      </Typography>
                      <Box sx={{ flexGrow: 1, mt: 1 }} />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Chip
                          label={
                            !item.subido
                              ? C.docStateNotUploaded
                              : C.docStataUplodaded
                          }
                          color={!item.subido ? "grey" : "success"}
                        />
                      </Stack>
                      {getDocumentPreviewId(item) ? (
                        <SAEButton
                          onClick={() =>
                            handlePreview?.(
                              getDocumentPreviewId(item),
                              getDocumentDisplayName(item),
                            )
                          }
                          sx={{ flex: 1, minWidth: 0 }}
                        >
                          {getDocumentDisplayName(item).length > 35
                            ? `${getDocumentDisplayName(item).slice(0, 35)}...`
                            : getDocumentDisplayName(item)}
                        </SAEButton>
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ flex: 1, minWidth: 0 }}
                          noWrap
                        >
                          {getDocumentDisplayName(item) || "Sin archivo"}
                        </Typography>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "wrap",
                          mt: 1,
                        }}
                      >
                        <IconButton
                          component="label"
                          size="small"
                          color="primary"
                          disabled={item.subido}
                        >
                          <FileUpload />
                          <input
                            type="file"
                            hidden
                            accept={item.extension}
                            onChange={(e) =>
                              handleDocumentoChange(
                                e,
                                getDocumentKey(item),
                                documentosRequeridos,
                                setDocumentosRequeridos,
                              )
                            }
                          />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          disabled={!item.subido}
                          onClick={() =>
                            handleDocumentoDelete(
                              getDocumentKey(item),
                              setDocumentosRequeridos,
                            )
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {documentosEconomica.length > 0 && (
          <Divider variant="middle" sx={{ mt: 0.5 }}>
            <Chip
              label="Documentos de Beca Economica"
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Divider>
        )}

        {formBeca.tipoBeca === TIPO_BECA.ECONOMICA &&
          documentosEconomicosOpcionalesDisponibles.length > 0 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <FormControl fullWidth disabled={saving}>
                <InputLabel>Agregar documento si corresponde</InputLabel>
                <Select
                  value={documentoEconomicoOpcionalId}
                  onChange={(e) =>
                    setDocumentoEconomicoOpcionalId(e.target.value)
                  }
                  input={
                    <OutlinedInput label="Agregar documento si corresponde" />
                  }
                >
                  {documentosEconomicosOpcionalesDisponibles.map(
                    (documento) => (
                      <MenuItem
                        key={getDocumentKey(documento)}
                        value={getDocumentKey(documento)}
                      >
                        {documento.nombre}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
              <SAEButton
                variant="contained"
                onClick={handleAgregarDocumentoEconomico}
                disabled={!documentoEconomicoOpcionalId || saving}
                startIcon={<AddCircleOutline />}
                sx={{ minWidth: { sm: 150 } }}
              >
                Agregar
              </SAEButton>
            </Stack>
          )}

        {documentosEconomica.length > 0 && (
          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            {documentosEconomica.map((item) => (
              <Grid item xs={12} sm={12} key={getDocumentKey(item)}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    maxWidth: 357,
                    minWidth: 357,
                    flexDirection: "column",
                    boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
                    border: "1px solid rgba(17, 53, 101, 0.08)",
                    transition:
                      "background-color 0.25s ease, border-color 0.25s ease",

                    "&:hover": {
                      backgroundColor: "#f1f5fb",
                      borderColor: "rgba(17, 53, 101, 0.2)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack sx={{ height: "100%" }}>
                      <Typography variant="h6">
                        <strong>{item.nombre}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Formatos permitidos: {item.extension}
                      </Typography>
                      <Box sx={{ flexGrow: 1, mt: 1 }} />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Chip
                          label={
                            !item.subido
                              ? C.docStateNotUploaded
                              : C.docStataUplodaded
                          }
                          color={!item.subido ? "grey" : "success"}
                        />

                        <Chip
                          label={
                            item.required == true ? "Requerido!" : "Opcional"
                          }
                          color={item.required == true ? "error" : "warning"}
                        />
                      </Stack>
                      {getDocumentPreviewId(item) ? (
                        <SAEButton
                          onClick={() =>
                            handlePreview?.(
                              getDocumentPreviewId(item),
                              getDocumentDisplayName(item),
                            )
                          }
                          sx={{ flex: 1, minWidth: 0 }}
                        >
                          {getDocumentDisplayName(item).length > 35
                            ? `${getDocumentDisplayName(item).slice(0, 35)}...`
                            : getDocumentDisplayName(item)}
                        </SAEButton>
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ flex: 1, minWidth: 0, mt: 1 }}
                          noWrap
                        >
                          {getDocumentDisplayName(item) || "Sin archivo"}
                        </Typography>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "wrap",
                          mt: 1,
                        }}
                      >
                        <IconButton
                          component="label"
                          size="small"
                          color="primary"
                          disabled={item.subido}
                        >
                          <FileUpload />
                          <input
                            type="file"
                            hidden
                            accept={item.extension}
                            onChange={(e) =>
                              handleDocumentoChange(
                                e,
                                getDocumentKey(item),
                                documentosEconomica,
                                setDocumentosEconomica,
                              )
                            }
                          />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          disabled={
                            !isEconomicOptionalDocument(item) &&
                            !isSelectedFile(item.archivo)
                          }
                          onClick={() => handleDocumentoEconomicoDelete(item)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <SAEButton onClick={handleClose} disabled={saving}>
          Cancelar
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleDialogSave}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar"}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
