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
  Tabs,
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

export default function GenericFormFields({
  columns,
  dialogData,
  handleDialogChange,
  dialogMode,
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
        return (
          <SAETextField
            key={col.field}
            select
            label={col.headerName}
            value={value}
            onChange={(e) => handleDialogChange(col.field, e.target.value)}
            disabled={disabled}
            fullWidth
          >
            {col.form.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </SAETextField>
        );
      }

      return (
        <SAETextField
          key={col.field}
          label={col.headerName}
          type={col.form?.type ?? "text"}
          value={value}
          onChange={(e) => handleDialogChange(col.field, e.target.value)}
          disabled={disabled}
          fullWidth
          slotProps={
            ["date", "time", "datetime-local"].includes(col.form?.type)
              ? {
                  inputLabel: { shrink: true },
                  input: {
                    step: col.form?.step,
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
  becasGridConfig,
}) {
  const [activeSection, setActiveSection] = useState(
    Object.keys(card.sections)[0],
  );

  const [becasActivas, setBecasActivas] = useState([]);
  const [tabBeca, setTabBeca] = useState(0);
  const [loadingBecas, setLoadingBecas] = useState(false);

  const [busquedaGestion, setBusquedaGestion] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [dialogMode, setDialogMode] = useState("create");
  const [dialogError, setDialogError] = useState("");
  const [dialogSaving, setDialogSaving] = useState(false);

  const currentSection = card.sections[activeSection];

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

  const handleSectionChange = (sectionKey) => {
    setActiveSection(sectionKey);
    setBusquedaGestion("");
  };

  const handleDialogChange = (field, value) => {
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
  };

  async function openEdit(row, tabTitle) {
    const parsedData = currentSection.columns
      .filter((col) => col.form !== false)
      .reduce((acc, col) => {
        acc[col.field] = row[col.field] ?? col.defaultValue ?? "";
        return acc;
      }, {});

    setDialogData(parsedData);
    setDialogMode("edit");
    setDialogError("");
    setDialogOpen(true);

    setBecasActivas([]);
    setTabBeca(0);
    if (tabTitle === "Becarios" && row?.legajo) {
      setLoadingBecas(true);

      try {
        const becas = await onBecario(row.legajo);
        setBecasActivas(becas);
      } finally {
        setLoadingBecas(false);
      }
    }
  }

  async function openView(row, tabTitle) {
    const parsedData = currentSection.columns
      .filter((col) => col.form !== false)
      .reduce((acc, col) => {
        acc[col.field] = row[col.field] ?? col.defaultValue ?? "";
        return acc;
      }, {});

    setDialogData(parsedData);
    setDialogMode("view");
    setDialogError("");
    setDialogOpen(true);

    setBecasActivas([]);
    setTabBeca(0);
    if (tabTitle === "Becarios" && row?.legajo) {
      setLoadingBecas(true);

      try {
        const becas = await onBecario(row.legajo);
        setBecasActivas(becas);
      } finally {
        setLoadingBecas(false);
      }
    }
  }

  const handleDialogSave = async () => {
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
              columns={currentSection.columns}
              dialogData={dialogData}
              dialogMode={dialogMode}
              handleDialogChange={handleDialogChange}
            />
          </Stack>
          {currentSection.tabTitle === "Becarios" && (
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
                      <Stack spacing={2} sx={{ pt: 1 }}>
                        {dialogError && (
                          <Alert
                            severity="error"
                            onClose={() => setDialogError("")}
                          >
                            {dialogError}
                          </Alert>
                        )}

                        <GenericFormFields
                          columns={
                            becasGridConfig[becasActivas[tabBeca].tipo]
                              ?.columns ?? []
                          }
                          dialogData={becasActivas[tabBeca].datos}
                          dialogMode={dialogMode}
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
                      </Stack>
                    )}
                  </Box>
                </>
              )}
            </>
          )}{" "}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton
            variant="outlined"
            onClick={() => setDialogOpen(false)}
            disabled={dialogSaving}
          >
            Cancelar
          </SAEButton>

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
        </DialogActions>
      </Dialog>
    </>
  );
}
