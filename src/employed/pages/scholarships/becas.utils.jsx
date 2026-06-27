import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";

import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch,
  MenuItem,
  Divider,
  Tab,
  Chip,
  Autocomplete,
  Tabs,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import {
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import DocumentCard from "../../../shared/components/documents/DocumentCard";
import {
  ECONOMIC_DOCUMENTS,
  ECONOMIC_OPTIONAL_DOCUMENTS,
  REQUERID_DOCUMENTS,
} from "../../../students/pages/scholarships/scholarship.configs";
import {
  INITIAL_PREVIEW,
  asignarArchivosADocumentos,
  asignarTiposADocumentos,
  hasDocumentFile,
  isPdfDocument,
} from "../../../students/pages/scholarships/scholarship.utils";
import {
  descargarDocumentacionXId,
  listarDocumentacionXLegajo,
} from "../../../api/BecasService";
import { obtenerTiposDocumento } from "../../../api/HerramientasService";

const carreras = [
  { value: "sistemas", label: "Sistemas" },
  { value: "electrica", label: "Electrica" },
  { value: "electronica", label: "Electronica" },
  { value: "mecanica", label: "Mecanica" },
  { value: "metalurgica", label: "Metalurgica" },
  { value: "quimica", label: "Quimica" },
  { value: "industrial", label: "Industrial" },
  { value: "civil", label: "Civil" },
  { value: "frc", label: "FRC" },
];

const tiposBeca = [
  { value: "economica", label: "Beca economica" },
  { value: "servicio", label: "Servicio interno" },
  { value: "investigacion", label: "Investigacion" },
];

const cloneDocuments = (documents) =>
  documents.map((document) => ({ ...document }));

const cloneValue = (value) =>
  value == null ? value : JSON.parse(JSON.stringify(value));

async function buildStudentDocumentsByLegajo(legajo) {
  const [tiposDocumento, documentosSubidos] = await Promise.all([
    obtenerTiposDocumento(),
    listarDocumentacionXLegajo(legajo),
  ]);

  const comunesConTipo = asignarTiposADocumentos(
    cloneDocuments(REQUERID_DOCUMENTS),
    tiposDocumento,
  );
  const economicosConTipo = asignarTiposADocumentos(
    cloneDocuments(ECONOMIC_DOCUMENTS.concat(ECONOMIC_OPTIONAL_DOCUMENTS)),
    tiposDocumento,
  );

  const comunes = asignarArchivosADocumentos(
    comunesConTipo,
    documentosSubidos ?? [],
  );
  const economica = asignarArchivosADocumentos(
    economicosConTipo,
    documentosSubidos ?? [],
  ).filter((documento) => documento.required || hasDocumentFile(documento));

  return { comunes, economica };
}

const getDocumentsForScholarship = (tipoBeca, documentosBecario) => [
  ...documentosBecario.comunes,
  ...(tipoBeca === "economica" ? documentosBecario.economica : []),
];

export default function GenericFormFields({
  columns,
  dialogData,
  handleDialogChange,
  dialogMode,
  fieldErrors = {},
}) {
  const isViewMode = dialogMode === "view";

  // Permite que una columna use campos anidados como "servicio.id" sin que el
  // formulario tenga que conocer la forma exacta de cada entidad.
  const getValueByPath = (obj, path) =>
    path.split(".").reduce((acc, key) => acc?.[key], obj);

  // Renderiza inputs a partir de la metadata de columnas. Asi DataGrid y dialog
  // comparten una unica definicion de campos.
  const fields = columns
    .filter((col) => col.form !== false)
    .map((col) => {
      const disabled = isViewMode || col.form?.disabledOnEdit;
      if (col.form?.visible === false) return null;

      const value = getValueByPath(dialogData, col.field) ?? "";
      const getInputValue = (eventValue) => {
        if (col.form?.type !== "number") return eventValue;
        if (eventValue === "") return eventValue;

        const numberValue = Number(eventValue);
        if (Number.isNaN(numberValue)) return value;

        const min = col.form?.min;
        const max = col.form?.max;

        if (min !== undefined && numberValue < min) return String(min);
        if (max !== undefined && numberValue > max) return String(max);

        return eventValue;
      };

      const commonSx = {
        width: "100%",
      };

      if (col.form?.type === "switch") {
        return (
          <FormControlLabel
            key={col.field}
            control={
              <Switch
                checked={Boolean(value)}
                onChange={(e) =>
                  handleDialogChange(col.field, e.target.checked)
                }
                color="primary"
                disabled={disabled}
              />
            }
            label={col.headerName}
            sx={commonSx}
          />
        );
      }
      if (col.form?.type === "select") {
        // Soporta dos formatos:
        // 1) options: [{ value, label }]
        // 2) options: rows reales de la API + form.value/form.label para indicar los campos.
        const optionValueField = col.form?.value ?? "value";
        const optionLabelField = col.form?.label ?? "label";
        const options = col.form.options ?? [];
        const selectedOption =
          options.find(
            (option) =>
              String(option?.[optionValueField] ?? "") === String(value ?? ""),
          ) ?? null;

        return (
          <Autocomplete
            key={col.field}
            options={options}
            value={selectedOption}
            getOptionLabel={(option) =>
              String(option?.[optionLabelField] ?? "")
            }
            isOptionEqualToValue={(option, selectedValue) =>
              String(option?.[optionValueField] ?? "") ===
              String(selectedValue?.[optionValueField] ?? "")
            }
            onChange={(_, option) =>
              handleDialogChange(
                col.field,
                option ? option[optionValueField] : "",
              )
            }
            disabled={disabled}
            fullWidth
            renderInput={(params) => (
              <SAETextField
                {...params}
                label={col.headerName}
                error={Boolean(fieldErrors[col.field])}
                helperText={fieldErrors[col.field] ?? ""}
              />
            )}
          />
        );
      }

      return (
        <SAETextField
          key={col.field}
          label={col.headerName}
          type={col.form?.type ?? "text"}
          value={value}
          onChange={(e) =>
            handleDialogChange(col.field, getInputValue(e.target.value))
          }
          disabled={disabled}
          fullWidth
          error={Boolean(fieldErrors[col.field])}
          helperText={fieldErrors[col.field] ?? ""}
          slotProps={
            ["date", "time", "datetime-local"].includes(col.form?.type)
              ? {
                  inputLabel: { shrink: true },
                  input: {
                    min: col.form?.min,
                    max: col.form?.max,
                    step: col.form?.step,
                  },
                }
              : col.form?.type === "number"
                ? {
                    input: {
                      min: col.form?.min,
                      max: col.form?.max,
                    },
                  }
                : undefined
          }
        />
      );
    });

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
        },
        gap: 2,
      }}
    >
      {columns
        .filter((col) => col.form !== false)
        .map((col) => (
          <Box
            key={col.field}
            sx={{
              gridColumn: col.form?.fullRow ? "1 / -1" : "auto",
            }}
          >
            {fields.find((field) => field?.key === col.field)}
          </Box>
        ))}
    </Box>
  );
}

function BecarioForm({
  columns,
  dialogData,
  handleDialogChange,
  dialogMode,
  fieldErrors = {},
  becarioBuscado,
  loadingBusquedaLegajo,
  carreraBusquedaLegajo,
  onCarreraChange,
  onBuscarBecario,
  onClearBecario,
}) {
  const legajoColumn = columns.find((col) => col.form?.type === "user-search");
  const legajo = dialogData?.legajo ?? "";
  const nombreUsuario =
    becarioBuscado?.nombre_usuario ??
    becarioBuscado?.nombre_becario ??
    becarioBuscado?.nombre ??
    "Becario encontrado";
  const columnsSinBuscador = columns.filter(
    (col) => col.form?.type !== "user-search",
  );

  return (
    <Stack spacing={2}>
      {legajoColumn && dialogMode === "create" ? (
        <Box sx={{ width: "100%" }}>
          {!becarioBuscado ? (
            <Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ sm: "flex-start" }}
              >
                <SAETextField
                  label={legajoColumn.headerName}
                  value={legajo}
                  onChange={(e) =>
                    handleDialogChange(legajoColumn.field, e.target.value)
                  }
                  fullWidth
                  disabled={loadingBusquedaLegajo}
                  error={Boolean(fieldErrors[legajoColumn.field])}
                  helperText={fieldErrors[legajoColumn.field] ?? ""}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onBuscarBecario?.(legajo, carreraBusquedaLegajo);
                    }
                  }}
                  sx={{ flex: 1 }}
                />

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    lineHeight: { sm: "40px" },
                    px: { sm: 0.5 },
                  }}
                >
                  @
                </Typography>

                <Autocomplete
                  options={carreras}
                  value={
                    carreras.find(
                      (option) => option.value === carreraBusquedaLegajo,
                    ) ?? null
                  }
                  getOptionLabel={(option) => option.label ?? ""}
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.value === selectedValue.value
                  }
                  onChange={(_, option) =>
                    onCarreraChange?.(option?.value ?? "")
                  }
                  disabled={loadingBusquedaLegajo}
                  fullWidth
                  sx={{ flex: 1 }}
                  renderInput={(params) => (
                    <SAETextField {...params} label="Carrera" />
                  )}
                />

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ minHeight: { sm: 40 } }}
                >
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    .frc.utn.edu.ar
                  </Typography>

                  {loadingBusquedaLegajo ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <IconButton
                      onClick={() =>
                        onBuscarBecario?.(legajo, carreraBusquedaLegajo)
                      }
                      edge="end"
                    >
                      <SearchIcon />
                    </IconButton>
                  )}
                </Stack>
              </Stack>

              {fieldErrors[`${legajoColumn.field}_carrera`] && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", mt: 0.75 }}
                >
                  {fieldErrors[`${legajoColumn.field}_carrera`]}
                </Typography>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Resultado de busqueda
              </Typography>

              <Typography>{nombreUsuario}</Typography>

              <Typography variant="body2" color="text.secondary">
                Legajo: {becarioBuscado.legajo}
              </Typography>

              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
                onClick={onClearBecario}
              >
                Volver a buscar
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <GenericFormFields
          columns={[legajoColumn].filter(Boolean)}
          dialogData={dialogData}
          dialogMode={dialogMode}
          handleDialogChange={handleDialogChange}
          fieldErrors={fieldErrors}
        />
      )}

      <GenericFormFields
        columns={columnsSinBuscador}
        dialogData={dialogData}
        dialogMode={dialogMode}
        handleDialogChange={handleDialogChange}
        fieldErrors={fieldErrors}
      />
    </Stack>
  );
}

export function SectionGridCard({
  cardKey,
  card,
  onSave,
  onBecario,
  onBuscarBecario,
  becasGridConfig,
}) {
  // Card generica que renderiza tabs, grilla y dialog para una familia de
  // secciones: configs/proyectos/servicios o becarios.
  const [activeSection, setActiveSection] = useState(
    Object.keys(card.sections)[0],
  );

  // Becas que se muestran debajo del formulario del becario.
  // Se cargan al abrir el editor o visualizador de un becario.
  const [becasActivas, setBecasActivas] = useState([]);
  const [tabBeca, setTabBeca] = useState(0);
  const [loadingBecas, setLoadingBecas] = useState(false);
  const [documentosBecario, setDocumentosBecario] = useState({
    comunes: [],
    economica: [],
  });
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [preview, setPreview] = useState(INITIAL_PREVIEW);

  const [busquedaGestion, setBusquedaGestion] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [originalDialogData, setOriginalDialogData] = useState({});
  const [dialogMode, setDialogMode] = useState("create");
  const [dialogError, setDialogError] = useState("");
  const [dialogSaving, setDialogSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [becarioBuscado, setBecarioBuscado] = useState(null);
  const [loadingBusquedaLegajo, setLoadingBusquedaLegajo] = useState(false);
  const [carreraBusquedaLegajo, setCarreraBusquedaLegajo] =
    useState("sistemas");
  const [tipoBecaSeleccionada, setTipoBecaSeleccionada] = useState("");
  const [originalBecasActivas, setOriginalBecasActivas] = useState([]);

  const currentSection = card.sections[activeSection];
  const isBecariosSection = currentSection.tabTitle === "Becarios";
  const becaActiva = becasActivas[tabBeca];
  const documentosBecaActiva = becaActiva
    ? getDocumentsForScholarship(becaActiva.tipo, documentosBecario)
    : [];

  const dialogButtonText = {
    create: "Crear",
    edit: "Guardar",
    view: "Aceptar",
  };

  const actionButtonText = {
    create: currentSection?.actionButton?.textNew,
    edit: currentSection?.actionButton?.textEdit,
    view: currentSection?.actionButton?.textView,
  };

  const getDialogDataFromRow = (row = {}) =>
    currentSection.columns
      .filter((col) => col.form !== false)
      .reduce(
        (acc, col) => {
          if (acc[col.field] === undefined) {
            acc[col.field] = col.defaultValue ?? "";
          }
          return acc;
        },
        cloneValue(row ?? {}),
      );

  const resetDocumentosBecario = () => {
    setDocumentosBecario({ comunes: [], economica: [] });
    setLoadingDocumentos(false);
  };

  const cargarDocumentosBecario = async (legajo) => {
    if (!legajo) {
      resetDocumentosBecario();
      return;
    }

    try {
      setLoadingDocumentos(true);
      const documentos = await buildStudentDocumentsByLegajo(legajo);
      setDocumentosBecario(documentos);
    } catch (error) {
      console.error("Error al cargar documentos del becario:", error);
      resetDocumentosBecario();
    } finally {
      setLoadingDocumentos(false);
    }
  };

  const closePreview = () => {
    setPreview((prev) => ({ ...prev, open: false }));
  };

  const resetBecarioSearch = () => {
    setBecarioBuscado(null);
    setLoadingBusquedaLegajo(false);
  };

  const handlePreviewDocumento = async (id, nombre) => {
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
        error: "No se pudo cargar el documento",
      }));
    }
  };

  // Limpia el usuario encontrado y vuelve a dejar el legajo editable para una
  // nueva busqueda dentro del dialog de creacion.
  const clearBecarioBuscado = ({ recortarLegajo = true } = {}) => {
    resetBecarioSearch();
    setDialogData((prev) => ({
      ...prev,
      legajo: recortarLegajo
        ? String(prev.legajo ?? "").split("@")[0]
        : prev.legajo,
    }));
  };

  const buscarBecarioPorLegajo = async (value, carrera) => {
    const legajo = String(value ?? "")
      .trim()
      .split("@")[0];
    const carreraSeleccionada = String(carrera ?? "").trim();
    const legajoArmado = `${legajo}@${carreraSeleccionada}.frc.utn.edu.ar`;

    if (!legajo) {
      setFieldErrors((prev) => ({
        ...prev,
        legajo: "Ingresá un legajo para buscar",
      }));
      return;
    }

    if (!carreraSeleccionada) {
      setFieldErrors((prev) => ({
        ...prev,
        legajo_carrera: "Selecciona una carrera para buscar",
      }));
      return;
    }

    try {
      setLoadingBusquedaLegajo(true);
      setFieldErrors((prev) => ({
        ...prev,
        legajo: "",
        legajo_carrera: "",
      }));

      const becario =
        (await onBuscarBecario?.(legajo)) ??
        currentSection.rows.find((row) => {
          const rowLegajo = String(row?.legajo ?? "").trim();

          return rowLegajo === legajo || rowLegajo === legajoArmado;
        });

      if (!becario) {
        setBecarioBuscado(null);
        setFieldErrors((prev) => ({
          ...prev,
          legajo: "No se encontro un becario con ese legajo y carrera",
        }));
        return;
      }

      setBecarioBuscado(becario);
      setDialogData((prev) => ({
        ...prev,
        ...getDialogDataFromRow(becario),
        legajo: becario.legajo ?? legajoArmado,
        nombre_becario:
          becario.nombre_usuario ??
          becario.nombre_becario ??
          becario.nombre ??
          prev.nombre_becario,
      }));
    } catch (error) {
      setBecarioBuscado(null);
      setFieldErrors((prev) => ({
        ...prev,
        legajo: error?.message ?? "No se pudo buscar el becario",
      }));
    } finally {
      setLoadingBusquedaLegajo(false);
    }
  };

  const handleSectionChange = (sectionKey) => {
    setActiveSection(sectionKey);
    setBusquedaGestion("");
    clearBecarioBuscado();
    resetDocumentosBecario();
  };

  const handleDialogChange = (field, value) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
    setDialogData((prev) => {
      const keys = field.split(".");

      // Soporta updates de campos simples y anidados sin duplicar handlers por
      // tipo de beca.
      if (keys.length === 1) {
        return {
          ...prev,
          [field]: value,
        };
      }

      const updated = { ...prev };
      let current = updated;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current[key] = {
            ...(current[key] ?? {}),
          };
          current = current[key];
        }
      });

      return updated;
    });
  };

  const setValueByPath = (target, field, value) => {
    const keys = field.split(".");

    if (keys.length === 1) {
      return {
        ...target,
        [field]: value,
      };
    }

    const updated = { ...target };
    let current = updated;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        current[key] = {
          ...(current[key] ?? {}),
        };
        current = current[key];
      }
    });

    return updated;
  };

  const openCreate = () => {
    const emptyEntity = { ...currentSection.emptyEntity };

    setDialogData(emptyEntity);
    setOriginalDialogData(cloneValue(emptyEntity));
    setDialogMode("create");
    setDialogError("");
    setDialogOpen(true);
    setFieldErrors({});
    setTabBeca(0);
    setLoadingBecas(false);
    resetBecarioSearch();
    resetDocumentosBecario();

    setBecasActivas([]);
    setOriginalBecasActivas([]);
    setTipoBecaSeleccionada("");
  };

  async function openEdit(row, tabTitle) {
    const parsedData = getDialogDataFromRow(row);
    setDialogData(parsedData);
    setOriginalDialogData(cloneValue(parsedData));
    setDialogMode("edit");
    setDialogError("");
    setDialogOpen(true);
    setFieldErrors({});
    setBecasActivas([]);
    setOriginalBecasActivas([]);
    resetBecarioSearch();
    resetDocumentosBecario();
    setTabBeca(0);
    if (tabTitle === "Becarios" && row?.legajo) {
      // Al editar/ver becarios se trae ademas el detalle de sus becas activas
      // para mostrarlo debajo del formulario principal.
      setLoadingBecas(true);

      try {
        const [becas] = await Promise.all([
          onBecario(row.legajo),
          cargarDocumentosBecario(row.legajo),
        ]);
        setBecasActivas(becas);
        setOriginalBecasActivas(cloneValue(becas) ?? []);
      } finally {
        setLoadingBecas(false);
      }
    }
  }

  async function openView(row, tabTitle) {
    const parsedData = getDialogDataFromRow(row);

    setDialogData(parsedData);
    setOriginalDialogData(cloneValue(parsedData));
    setDialogMode("view");
    setDialogError("");
    setDialogOpen(true);

    setFieldErrors({});
    setBecasActivas([]);
    setOriginalBecasActivas([]);
    resetBecarioSearch();
    resetDocumentosBecario();
    setTabBeca(0);
    if (tabTitle === "Becarios" && row?.legajo) {
      setLoadingBecas(true);

      try {
        const [becas] = await Promise.all([
          onBecario(row.legajo),
          cargarDocumentosBecario(row.legajo),
        ]);

        setBecasActivas(becas);
        setOriginalBecasActivas(cloneValue(becas) ?? []);
      } finally {
        setLoadingBecas(false);
      }
    }
  }
  const validateDialogData = () => {
    const errors = {};

    if (isBecariosSection && dialogMode === "create" && !becarioBuscado) {
      errors.legajo = "Busca y selecciona un becario antes de guardar";
    }

    if (
      isBecariosSection &&
      dialogMode === "create" &&
      !dialogData.beca?.tipo
    ) {
      errors.tipo_beca = "Selecciona un tipo de beca";
    }

    if (
      isBecariosSection &&
      dialogMode === "create" &&
      dialogData.beca?.tipo === "investigacion" &&
      !dialogData.beca["proyecto_investigacion.id"]
    ) {
      errors["proyecto_investigacion.id"] = "Selecciona un proyecto";
    }

    if (
      isBecariosSection &&
      dialogMode === "create" &&
      dialogData.beca?.tipo === "servicio" &&
      !dialogData.beca["servicio.id"]
    ) {
      errors["servicio.id"] = "Selecciona un servicio";
    }

    currentSection.columns.forEach((col) => {
      if (col.form === false || col.form?.visible === false) return;

      const value = col.field
        .split(".")
        .reduce((acc, key) => acc?.[key], dialogData);

      if (
        col.form?.required &&
        (value === null || value === undefined || value === "")
      ) {
        errors[col.field] =
          col.form.requiredMessage ?? `${col.headerName} es obligatorio`;
      }
    });

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleDialogSave = async () => {
    if (!validateDialogData()) return;

    try {
      setDialogSaving(true);
      setDialogError("");
      await onSave?.({
        cardKey,
        sectionKey: activeSection,
        mode: dialogMode,
        data: dialogData,
        originalData: originalDialogData,
        becas: becasActivas,
        originalBecas: originalBecasActivas,
      });

      setDialogOpen(false);
    } catch (error) {
      setDialogError(error?.message ?? "Ocurrió un error al guardar.");
    } finally {
      setDialogSaving(false);
    }
  };

  const rowsFiltradas = useMemo(() => {
    const term = busquedaGestion.trim().toLowerCase();

    if (!term) return currentSection.rows;

    return currentSection.rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [currentSection.rows, busquedaGestion]);

  const gridColumns = [
    ...currentSection.columns,
    {
      field: "acciones",
      headerName: "Acciones",
      width: 120,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton
            size="small"
            onClick={() => openView(params.row, currentSection.tabTitle)}
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => openEdit(params.row, currentSection.tabTitle)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  const DialogIcon = currentSection.icon;

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
          mb: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "var(--gradient)",
            color: "white",
            px: 3,
          }}
        >
          <Stack
            direction="row"
            overflow={{ xs: "auto", md: "hidden" }}
            spacing={0}
          >
            {Object.entries(card.sections).map(([key, section]) => (
              <Box
                key={key}
                onClick={() => handleSectionChange(key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  px: 2.5,
                  py: 1.5,
                  cursor: "pointer",
                  fontWeight: activeSection === key ? 700 : 500,
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color:
                    activeSection === key
                      ? "white"
                      : "rgba(255,255,255,0.6)",
                  borderBottom:
                    activeSection === key
                      ? "3px solid white"
                      : "3px solid transparent",
                  transition: "all 0.15s",
                  "&:hover": {
                    color: "white",
                    borderBottomColor: "rgba(255,255,255,0.4)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "inherit",
                    fontSize: "inherit",
                    letterSpacing: "inherit",
                    textTransform: "inherit",
                    color: "inherit",
                    lineHeight: 1,
                  }}
                >
                  {section.tabTitle}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ py: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <DialogIcon sx={{ fontSize: 30 }} />
              <Typography variant="h6" fontWeight={700}>
                {currentSection.title}
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <SAETextField
                placeholder="Buscar en esta gestión..."
                size="small"
                value={busquedaGestion}
                onChange={(e) => setBusquedaGestion(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {currentSection?.actionButton && (
                <SAEButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreate}
                  sx={{
                    whiteSpace: "nowrap",
                    bgcolor: "rgba(255,255,255,0.18)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.4)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                  }}
                >
                  {currentSection.actionButton.textNew}
                </SAEButton>
              )}
            </Stack>
          </Stack>
        </Box>

        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={rowsFiltradas}
            columns={gridColumns}
            loading={currentSection.loading}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            sx={{ borderRadius: 0, border: "none" }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth={isBecariosSection ? "md" : "sm"}
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            {actionButtonText[dialogMode]}
          </Typography>

          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {dialogError && (
              <Alert severity="error" onClose={() => setDialogError("")}>
                {dialogError}
              </Alert>
            )}

            {isBecariosSection ? (
              <BecarioForm
                columns={currentSection.columns}
                dialogData={dialogData}
                dialogMode={dialogMode}
                handleDialogChange={handleDialogChange}
                fieldErrors={fieldErrors}
                becarioBuscado={becarioBuscado}
                loadingBusquedaLegajo={loadingBusquedaLegajo}
                carreraBusquedaLegajo={carreraBusquedaLegajo}
                onCarreraChange={setCarreraBusquedaLegajo}
                onBuscarBecario={buscarBecarioPorLegajo}
                onClearBecario={clearBecarioBuscado}
              />
            ) : (
              <GenericFormFields
                columns={currentSection.columns}
                dialogData={dialogData}
                dialogMode={dialogMode}
                handleDialogChange={handleDialogChange}
                fieldErrors={fieldErrors}
              />
            )}
          </Stack>
          {currentSection.tabTitle === "Becarios" &&
            dialogMode === "create" && (
              <>
                <Divider variant="middle" sx={{ my: 3 }}>
                  <Chip
                    label="Nueva beca"
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Divider>

                <Autocomplete
                  options={tiposBeca}
                  value={
                    tiposBeca.find(
                      (option) => option.value === tipoBecaSeleccionada,
                    ) ?? null
                  }
                  getOptionLabel={(option) => option.label ?? ""}
                  isOptionEqualToValue={(option, selectedValue) =>
                    option.value === selectedValue.value
                  }
                  onChange={(_, option) => {
                    const tipo = option?.value ?? "";

                    setFieldErrors((prev) => ({
                      ...prev,
                      tipo_beca: "",
                    }));
                    setTipoBecaSeleccionada(tipo);

                    setDialogData((prev) => ({
                      ...prev,
                      beca: tipo
                        ? {
                            tipo,
                          }
                        : null,
                    }));
                  }}
                  fullWidth
                  renderInput={(params) => (
                    <SAETextField
                      {...params}
                      label="Tipo de beca"
                      error={Boolean(fieldErrors.tipo_beca)}
                      helperText={fieldErrors.tipo_beca ?? ""}
                    />
                  )}
                />

                {tipoBecaSeleccionada && (
                  <Box sx={{ mt: 2 }}>
                    <GenericFormFields
                      columns={
                        becasGridConfig[tipoBecaSeleccionada]?.columns ?? []
                      }
                      dialogData={dialogData.beca ?? {}}
                      dialogMode={dialogMode}
                      fieldErrors={fieldErrors}
                      handleDialogChange={(field, value) => {
                        setFieldErrors((prev) => ({
                          ...prev,
                          [field]: "",
                        }));
                        setDialogData((prev) => ({
                          ...prev,
                          beca: {
                            ...(prev.beca ?? {}),
                            tipo: tipoBecaSeleccionada,
                            [field]: value,
                          },
                        }));
                      }}
                    />
                  </Box>
                )}
              </>
            )}

          {currentSection.tabTitle === "Becarios" &&
            dialogMode !== "create" && (
              <>
                <Divider variant="middle" sx={{ my: 3 }}>
                  <Chip
                    label="Becas Activas"
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Divider>

                {loadingBecas ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      py: 4,
                    }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : becasActivas.length === 0 ? (
                  <Alert severity="info">
                    El becario no tiene becas activas.
                  </Alert>
                ) : (
                  <>
                    <Tabs
                      value={tabBeca}
                      onChange={(_, newValue) => setTabBeca(newValue)}
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                    >
                      {becasActivas.map((beca) => (
                        <Tab key={beca.tipo} label={beca.nombre} />
                      ))}
                    </Tabs>

                    <Box sx={{ mt: 2 }}>
                      {becasActivas[tabBeca] && (
                        <GenericFormFields
                          columns={
                            becasGridConfig[becasActivas[tabBeca].tipo]
                              ?.columns ?? []
                          }
                          dialogData={becasActivas[tabBeca].datos}
                          dialogMode={dialogMode}
                          fieldErrors={fieldErrors}
                          handleDialogChange={(field, value) => {
                            setFieldErrors((prev) => ({
                              ...prev,
                              [field]: "",
                            }));
                            setBecasActivas((prev) => {
                              const updated = [...prev];

                              updated[tabBeca] = {
                                ...updated[tabBeca],
                                datos: setValueByPath(
                                  updated[tabBeca].datos,
                                  field,
                                  value,
                                ),
                              };

                              return updated;
                            });
                          }}
                        />
                      )}
                    </Box>

                    <Divider variant="middle" sx={{ my: 3 }}>
                      <Chip
                        label="Documentos del alumno"
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </Divider>

                    {loadingDocumentos ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          py: 4,
                        }}
                      >
                        <CircularProgress size={24} />
                      </Box>
                    ) : documentosBecaActiva.length === 0 ? (
                      <Alert severity="info">
                        No se encontraron documentos para esta beca.
                      </Alert>
                    ) : (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 1fr",
                          },
                          gap: 2,
                        }}
                      >
                        {documentosBecaActiva.map((documento) => (
                          <DocumentCard
                            key={
                              documento.id_tipo_documento ??
                              documento.id ??
                              documento.nombre
                            }
                            documento={documento}
                            onPreview={handlePreviewDocumento}
                            showRequirement
                            showActions={false}
                          />
                        ))}
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton
            variant="outlined"
            onClick={() => setDialogOpen(false)}
            disabled={dialogSaving}
          >
            Cancelar
          </SAEButton>

          {dialogMode !== "view" && (
            <SAEButton
              variant="contained"
              onClick={handleDialogSave}
              disabled={dialogSaving}
              startIcon={
                dialogSaving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {dialogButtonText[dialogMode]}
            </SAEButton>
          )}
        </DialogActions>
      </Dialog>

      <DocumentPreviewDialog
        open={preview.open}
        onClose={closePreview}
        title={preview.title}
        imageSrc={preview.imageSrc}
        isPdf={preview.isPdf}
        loading={preview.loading}
        error={preview.error}
      />
    </>
  );
}
