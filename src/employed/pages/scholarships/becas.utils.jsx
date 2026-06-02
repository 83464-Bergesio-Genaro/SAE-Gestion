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

export default function GenericFormFields({
  columns,
  dialogData,
  handleDialogChange,
  dialogMode,
  fieldErrors = {},
}) {
  const isViewMode = dialogMode === "view";

  const getValueByPath = (obj, path) =>
    path.split(".").reduce((acc, key) => acc?.[key], obj);

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
      if (col.form?.type === "user-search" && dialogMode === "create") {
        const usuarioSeleccionado = col.form.usuarioSelected;
        const nombreUsuario =
          usuarioSeleccionado?.nombre_usuario ??
          usuarioSeleccionado?.nombre_becario ??
          usuarioSeleccionado?.nombre ??
          "Becario encontrado";

        return (
          <Box key={col.field} sx={{ width: "100%" }}>
            {!usuarioSeleccionado ? (
              <Box>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ sm: "flex-start" }}
                >
                  <SAETextField
                    label={col.headerName}
                    value={value}
                    onChange={(e) =>
                      handleDialogChange(col.field, e.target.value)
                    }
                    fullWidth
                    disabled={col.form.loadingUsuario}
                    error={Boolean(fieldErrors[col.field])}
                    helperText={fieldErrors[col.field] ?? ""}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        col.form.onSearch?.(value, col.form.carrera);
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

                  <SAETextField
                    select
                    label="Carrera"
                    value={col.form.carrera}
                    onChange={(e) => col.form.onCarreraChange?.(e.target.value)}
                    disabled={col.form.loadingUsuario}
                    fullWidth
                    sx={{ flex: 1 }}
                  >
                    {carreras.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </SAETextField>

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

                    {col.form.loadingUsuario ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <IconButton
                        onClick={() =>
                          col.form.onSearch?.(value, col.form.carrera)
                        }
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
                {fieldErrors[`${col.field}_carrera`] && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 0.75 }}
                  >
                    {fieldErrors[`${col.field}_carrera`]}
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
                  Legajo: {usuarioSeleccionado.legajo}
                </Typography>

                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={col.form.onClear}
                >
                  Volver a buscar
                </Button>
              </Box>
            )}
          </Box>
        );
      }
      if (col.form?.type === "select") {
        // Soporta dos formatos:
        // 1) options: [{ value, label }]
        // 2) options: rows reales de la API + form.value/form.label para indicar los campos.
        const optionValueField = col.form?.value ?? "value";
        const optionLabelField = col.form?.label ?? "label";
        console.log("Value de arriba", col.form);
        console.log("Dialog Data", dialogData);
        console.log("optionValueField de arriba", optionValueField);
        console.log("optionLabelField de arriba", optionLabelField);
        return (
          <SAETextField
            key={col.field}
            select
            label={col.headerName}
            value={value}
            onChange={(e) => handleDialogChange(col.field, e.target.value)}
            disabled={disabled}
            fullWidth
            error={Boolean(fieldErrors[col.field])}
            helperText={fieldErrors[col.field] ?? ""}
          >
            {(col.form.options ?? []).map((option) => {
              const optionValue = option?.[optionValueField];
              const optionLabel = option?.[optionLabelField];
              console.log("value", optionValue);
              console.log("label", optionLabel);
              return (
                <MenuItem key={optionValue} value={optionValue}>
                  {optionLabel}
                </MenuItem>
              );
            })}
          </SAETextField>
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

export function SectionGridCard({
  cardKey,
  card,
  onSave,
  onBecario,
  onBuscarBecario,
  becasGridConfig,
}) {
  const [activeSection, setActiveSection] = useState(
    Object.keys(card.sections)[0],
  );

  // Becas que se muestran debajo del formulario del becario.
  // Se cargan al abrir el editor o visualizador de un becario.
  const [becasActivas, setBecasActivas] = useState([]);
  const [tabBeca, setTabBeca] = useState(0);
  const [loadingBecas, setLoadingBecas] = useState(false);

  const [busquedaGestion, setBusquedaGestion] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [dialogMode, setDialogMode] = useState("create");
  const [dialogError, setDialogError] = useState("");
  const [dialogSaving, setDialogSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [becarioBuscado, setBecarioBuscado] = useState(null);
  const [loadingBusquedaLegajo, setLoadingBusquedaLegajo] = useState(false);
  const [carreraBusquedaLegajo, setCarreraBusquedaLegajo] =
    useState("sistemas");

  const currentSection = card.sections[activeSection];

  const [tipoBecaSeleccionada, setTipoBecaSeleccionada] = useState("");
  const becaActual = becasActivas[tabBeca];
  const gridConfig = becaActual ? becasGridConfig[becaActual.tipo] : null;

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

  const getDialogDataFromRow = (row) =>
    currentSection.columns
      .filter((col) => col.form !== false)
      .reduce((acc, col) => {
        acc[col.field] = row?.[col.field] ?? col.defaultValue ?? "";
        return acc;
      }, {});

  const clearBecarioBuscado = () => {
    setBecarioBuscado(null);
    setLoadingBusquedaLegajo(false);
    setDialogData((prev) => ({
      ...prev,
      legajo: String(prev.legajo ?? "").split("@")[0],
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
        (await onBuscarBecario?.(legajoArmado)) ??
        currentSection.rows.find(
          (row) => String(row?.legajo ?? "").trim() === legajoArmado,
        );

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
  };

  const handleDialogChange = (field, value) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
    setDialogData((prev) => {
      const keys = field.split(".");

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

  const openCreate = () => {
    setDialogData({ ...currentSection.emptyEntity });
    setDialogMode("create");
    setDialogError("");
    setDialogOpen(true);
    setFieldErrors({});
    setTabBeca(0);
    setLoadingBecas(false);
    clearBecarioBuscado();

    setBecasActivas([]);
    setTipoBecaSeleccionada("");
  };

  async function openEdit(row, tabTitle) {
    const parsedData = getDialogDataFromRow(row);

    setDialogData(parsedData);
    setDialogMode("edit");
    setDialogError("");
    setDialogOpen(true);
    setFieldErrors({});
    setBecasActivas([]);
    clearBecarioBuscado();
    setTabBeca(0);
    if (tabTitle === "Becarios" && row?.legajo) {
      setLoadingBecas(true);

      try {
        const becas = await onBecario(row.legajo);
        console.log("DATOS DE LAS BECAS", becas);
        setBecasActivas(becas);
      } finally {
        setLoadingBecas(false);
      }
    }
  }

  async function openView(row, tabTitle) {
    const parsedData = getDialogDataFromRow(row);

    setDialogData(parsedData);
    setDialogMode("view");
    setDialogError("");
    setDialogOpen(true);

    setFieldErrors({});
    setBecasActivas([]);
    clearBecarioBuscado();
    setTabBeca(0);
    if (tabTitle === "Becarios" && row?.legajo) {
      setLoadingBecas(true);

      try {
        const becas = await onBecario(row.legajo);
        console.log(becas);

        setBecasActivas(becas);
      } finally {
        setLoadingBecas(false);
      }
    }
  }
  const validateDialogData = () => {
    const errors = {};

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

  const gridColumns = useMemo(
    () => [
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
    ],
    [currentSection.columns],
  );

  const dialogColumns = currentSection.columns.map((col) => {
    if (col.form?.type !== "user-search") return col;

    return {
      ...col,
      form: {
        ...col.form,
        loadingUsuario: loadingBusquedaLegajo,
        usuarioSelected: becarioBuscado,
        carrera: carreraBusquedaLegajo,
        onCarreraChange: setCarreraBusquedaLegajo,
        onSearch: buscarBecarioPorLegajo,
        onClear: clearBecarioBuscado,
      },
    };
  });

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
            background: "linear-gradient(135deg, #1a3a5c 0%, #2d6da3 100%)",
            color: "white",
            px: 3,
          }}
        >
          <Stack direction="row" spacing={0}>
            {Object.entries(card.sections).map(([key, section]) => (
              <Box
                key={key}
                onClick={() => handleSectionChange(key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2.5,
                  py: 1.5,
                  cursor: "pointer",
                  fontWeight: activeSection === key ? 700 : 500,
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color:
                    activeSection === key ? "white" : "rgba(255,255,255,0.6)",
                  borderBottom:
                    activeSection === key
                      ? "3px solid white"
                      : "3px solid transparent",
                }}
              >
                <Typography sx={{ fontWeight: "inherit", fontSize: "inherit" }}>
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
        maxWidth="sm"
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

            <GenericFormFields
              columns={dialogColumns}
              dialogData={dialogData}
              dialogMode={dialogMode}
              handleDialogChange={handleDialogChange}
              fieldErrors={fieldErrors}
            />
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

                <SAETextField
                  select
                  label="Tipo de beca"
                  value={tipoBecaSeleccionada}
                  onChange={(e) => {
                    const tipo = e.target.value;

                    setTipoBecaSeleccionada(tipo);

                    setDialogData((prev) => ({
                      ...prev,
                      beca: {
                        tipo,
                      },
                    }));
                  }}
                  fullWidth
                >
                  <MenuItem value="economica">Beca económica</MenuItem>
                  <MenuItem value="servicio">Servicio interno</MenuItem>
                  <MenuItem value="investigacion">Investigación</MenuItem>
                </SAETextField>

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
                      centered
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
                            setBecasActivas((prev) => {
                              const updated = [...prev];

                              updated[tabBeca] = {
                                ...updated[tabBeca],
                                datos: {
                                  ...updated[tabBeca].datos,
                                  [field]: value,
                                },
                              };

                              return updated;
                            });
                          }}
                        />
                      )}
                    </Box>
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
    </>
  );
}
