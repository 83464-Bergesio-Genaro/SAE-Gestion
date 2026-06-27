import {
  Autocomplete,
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useState, useMemo, useEffect } from "react";
import { PurchaseProvider } from "../../context/providers/purchaseProvider";
import { AdminUsersProvider } from "../../context/providers/employProvider";
import { useEmploy, usePurchase } from "../../context/employedContext";
import { DataGrid } from "@mui/x-data-grid";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import HeaderPageEmployed from "../../../shared/components/HeaderPageEmployed";
import DocumentCard from "../../../shared/components/documents/DocumentCard";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function EmployedPurchases() {
  return (
    <AdminUsersProvider>
      <PurchaseProvider>
        <EmployedPurchasesContent />
      </PurchaseProvider>
    </AdminUsersProvider>
  );
}
const secciones = [{ key: "compras", label: "Compras" }];

const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCurrentMonthDateRange = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const fechaHasta = lastDayOfMonth > today ? today : lastDayOfMonth;

  return {
    fechaDesde: formatDateInput(firstDayOfMonth),
    fechaHasta: formatDateInput(fechaHasta),
    today: formatDateInput(today),
  };
};

function EmployedPurchasesContent() {
  const { empleados, loadingEmpleados } = useEmploy();
  const {
    snackbarOpen,
    setSnackbarOpen,
    snackbarMsg,

    purchasesRows,
    purchasesColumns,
    loadingPurchase,
    fetchPurchases,
    openCreatePurchases,
    handlePurchaseDialogSave,
    handleDialogChange,
    handleInformeTecnicoChange,
    handleEmpleadoChange,
    setFocusedCurrencyField,
    getCurrencyValue,
    handleCurrencyInputChange,
    handleCurrencyBlur,
    isPurchaseDataComplete,
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
    dialogMode,
    dialogData,
    dialogSaving,
    dialogError,
    setDialogError,
  } = usePurchase();

  const sectionConfig = useMemo(
    () => ({
      compras: {
        title: "Compras",
        dialog: openCreatePurchases,
        addButton: "Registrar Compra",
        icon: ShoppingCartIcon,
        rows: purchasesRows,
        columns: purchasesColumns,
        loading: loadingPurchase,
      },
    }),
    [purchasesRows, purchasesColumns, loadingPurchase, openCreatePurchases],
  );
  const [activeSection, setActiveSection] = useState("compras");
  const [busquedaGestion, setBusquedaGestion] = useState("");
  const [dateRange, setDateRange] = useState(getCurrentMonthDateRange);
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setBusquedaGestion("");
  };

  const handleFechaDesdeChange = (event) => {
    const fechaDesde = event.target.value;

    setDateRange((prev) => ({
      ...prev,
      fechaDesde,
      fechaHasta: prev.fechaHasta < fechaDesde ? fechaDesde : prev.fechaHasta,
    }));
  };

  const handleFechaHastaChange = (event) => {
    const fechaHasta = event.target.value;

    setDateRange((prev) => ({
      ...prev,
      fechaHasta: fechaHasta > prev.today ? prev.today : fechaHasta,
    }));
  };

  useEffect(() => {
    fetchPurchases(dateRange.fechaDesde, dateRange.fechaHasta);
  }, [dateRange.fechaDesde, dateRange.fechaHasta, fetchPurchases]);

  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );
  const rowsGestionFiltradas = useMemo(() => {
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


  const handleSavePurchase = () => {
    handlePurchaseDialogSave(dateRange.fechaDesde, dateRange.fechaHasta);
  };

  const selectedEmpleado = useMemo(
    () =>
      empleados.find(
        (empleado) =>
          String(empleado.id) === String(dialogData.id_usuario),
      ) || null,
    [dialogData.id_usuario, empleados],
  );

  const isDocsDialog = dialogType === "docs";
  const showPurchaseForm = dialogType === "purchases";
  const showDocumentsForm = dialogMode === "create" || isDocsDialog;

  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "90px", md: "100px" },
        pb: 4,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
        <HeaderPageEmployed
          header=" Módulo de Compras"
          title="Administracion de las Compras"
          description="En este módulo se registran todas las compras que hace la secretaria."
        />
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
              pt: 0,
              pb: 0,
            }}
          >
            <Stack
              direction="row"
              overflow={{ xs: "scroll", md: "hidden" }}
              spacing={0}
            >
              {secciones.map((item) => (
                <Box
                  key={item.key}
                  onClick={() => handleSectionChange(item.key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2.5,
                    py: 1.5,
                    cursor: "pointer",
                    fontWeight: activeSection === item.key ? 700 : 500,
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color:
                      activeSection === item.key
                        ? "white"
                        : "rgba(255,255,255,0.6)",
                    borderBottom:
                      activeSection === item.key
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
                    {item.label}
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
                <currentSection.icon sx={{ fontSize: 30 }} />
                <Typography variant="h6" fontWeight={700}>
                  {currentSection.title}
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ sm: "center" }}
              >
                <SAETextField
                 size="small"
                  label="Fecha Desde"
                  type="date"
                  value={dateRange.fechaDesde}
                  onChange={handleFechaDesdeChange}
                   sx={{
                    width: { xs: "100%", sm: 240, md: 220 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.12)",
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.6)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& input::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                      opacity: 1,
                    },
                    "& .MuiInputAdornment-root svg": {
                      color: "rgba(255,255,255,0.7)",
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255,255,255,0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white",
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon />
                        </InputAdornment>
                      ),
                    },
                    htmlInput: {
                      max: dateRange.fechaHasta,
                    },
                  }}
                ></SAETextField>
                <SAETextField
                 size="small"
                  label="Fecha Hasta"
                  type="date"
                  value={dateRange.fechaHasta}
                  onChange={handleFechaHastaChange}
                   sx={{
                    width: { xs: "100%", sm: 240, md: 220 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.12)",
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.6)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& input::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                      opacity: 1,
                    },
                    "& .MuiInputAdornment-root svg": {
                      color: "rgba(255,255,255,0.7)",
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255,255,255,0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white",
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon />
                        </InputAdornment>
                      ),
                    },
                    htmlInput: {
                      min: dateRange.fechaDesde,
                      max: dateRange.today,
                    },
                  }}
                ></SAETextField>
                <SAETextField
                  placeholder="Busqueda..."
                  size="small"
                  value={busquedaGestion}
                  onChange={(e) => setBusquedaGestion(e.target.value)}
                  sx={{
                    width: { xs: "100%", sm: 240, md: 220 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.12)",
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.6)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& input::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                      opacity: 1,
                    },
                    "& .MuiInputAdornment-root svg": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  }}
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
                <SAEButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={currentSection.dialog}
                  sx={{
                    whiteSpace: "nowrap",
                    bgcolor: "rgba(255,255,255,0.18)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.4)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                  }}
                >
                  {currentSection.addButton}
                </SAEButton>
              </Stack>
            </Stack>
          </Box>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <DataGrid
                rows={rowsGestionFiltradas}
                columns={currentSection.columns}
                loading={currentSection.loading}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                  pinnedColumns: { left: ["actions"] },
                }}
                localeText={{ noRowsLabel: "Sin Registros" }}
                sx={{
                  minWidth: 1250,
                  borderRadius: 0,
                  border: "none",
                  "& .MuiDataGrid-cell[data-field='actions'], & .MuiDataGrid-columnHeader[data-field='actions']": {
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                  },
                  "& .MuiDataGrid-columnHeader[data-field='actions']": {
                    zIndex: 3,
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Dialog
          open={dialogOpen && ["purchases", "docs"].includes(dialogType)}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {isDocsDialog ? "Documentos de la compra" : "Registrar Compra"}
            <IconButton onClick={() => setDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {dialogError && (
              <Alert
                severity="error"
                onClose={() => setDialogError("")}
                sx={{ mb: 2 }}
              >
                {dialogError}
              </Alert>
            )}

            <Stack spacing={3}>
              {showPurchaseForm && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Datos de la compra
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Autocomplete
                    options={empleados}
                    loading={loadingEmpleados}
                    value={selectedEmpleado}
                    onChange={handleEmpleadoChange}
                    getOptionLabel={(option) => option?.nombre_empleado || ""}
                    isOptionEqualToValue={(option, value) =>
                      String(option.id) === String(value.id)
                    }
                    renderInput={(params) => (
                      <SAETextField
                        {...params}
                        label="Empleado que hizo la compra"
                        fullWidth
                      />
                    )}
                    sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}
                  />
                  <SAETextField
                    label="Nombre de la compra"
                    value={dialogData.nombre_compra ?? ""}
                    onChange={(e) =>
                      handleDialogChange("nombre_compra", e.target.value)
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="Precio sugerido"
                    value={getCurrencyValue(
                      "precio_sugerido",
                      dialogData.precio_sugerido,
                    )}
                    onFocus={() => setFocusedCurrencyField("precio_sugerido")}
                    onBlur={() =>
                      handleCurrencyBlur(
                        "precio_sugerido",
                        dialogData.precio_sugerido,
                        handleDialogChange,
                      )
                    }
                    onChange={(e) =>
                      handleCurrencyInputChange(
                        "precio_sugerido",
                        e.target.value,
                        handleDialogChange,
                      )
                    }
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      },
                      htmlInput: {
                        inputMode: "decimal",
                        placeholder: "99.999,99",
                      },
                    }}
                  />
                  <SAETextField
                    label="Motivo"
                    value={dialogData.motivo ?? ""}
                    onChange={(e) =>
                      handleDialogChange("motivo", e.target.value)
                    }
                    fullWidth
                    multiline
                    minRows={3}
                    sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}
                  />
                  <SAETextField
                    label="Fecha compra"
                    type="date"
                    value={dialogData.fecha_compra ?? ""}
                    onChange={(e) =>
                      handleDialogChange("fecha_compra", e.target.value)
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Box>
              </Box>
              )}

              {showPurchaseForm && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Informe tecnico
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <SAETextField
                    label="Nro expediente"
                    value={dialogData.informe?.nro_expediente ?? ""}
                    onChange={(e) =>
                      handleInformeTecnicoChange(
                        "nro_expediente",
                        e.target.value,
                      )
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="Precio real"
                    value={getCurrencyValue(
                      "precio_real",
                      dialogData.informe?.precio_real,
                    )}
                    onFocus={() => setFocusedCurrencyField("precio_real")}
                    onBlur={() =>
                      handleCurrencyBlur(
                        "precio_real",
                        dialogData.informe?.precio_real,
                        handleInformeTecnicoChange,
                      )
                    }
                    onChange={(e) =>
                      handleCurrencyInputChange(
                        "precio_real",
                        e.target.value,
                        handleInformeTecnicoChange,
                      )
                    }
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      },
                      htmlInput: {
                        inputMode: "decimal",
                        placeholder: "99.999,99",
                      },
                    }}
                  />
                  <SAETextField
                    label="Nombre solicitante"
                    value={dialogData.informe?.nombre_solicitante ?? ""}
                    onChange={(e) =>
                      handleInformeTecnicoChange(
                        "nombre_solicitante",
                        e.target.value,
                      )
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="Nombre ganador"
                    value={dialogData.informe?.nombre_ganador ?? ""}
                    onChange={(e) =>
                      handleInformeTecnicoChange(
                        "nombre_ganador",
                        e.target.value,
                      )
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="Fecha licitacion"
                    type="date"
                    value={dialogData.informe?.fecha_licitacion ?? ""}
                    onChange={(e) =>
                      handleInformeTecnicoChange(
                        "fecha_licitacion",
                        e.target.value,
                      )
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <SAETextField
                    label="Fecha informe"
                    type="date"
                    value={dialogData.informe?.fecha_informe ?? ""}
                    onChange={(e) =>
                      handleInformeTecnicoChange(
                        "fecha_informe",
                        e.target.value,
                      )
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Box>
              </Box>
              )}

              {showDocumentsForm && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Documentacion
                </Typography>
                {!isDocsDialog && !isPurchaseDataComplete && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Completá primero los datos de la compra para adjuntar
                    documentación. El informe técnico puede quedar vacío.
                  </Alert>
                )}
                <Grid container spacing={2}>
                  {purchaseDocuments.map((documentType) => (
                    <Grid
                      key={documentType.id_tipo_documento}
                      size={{ xs: 12, md: 6 }}
                      item
                    >
                      <DocumentCard
                        documento={documentType}
                        onFileChange={(event, item) =>
                          item.key === "facturas"
                            ? handleFacturaChange(event, item)
                            : handleInformePdfChange(event, item)
                        }
                        onDelete={(item) =>
                          handleDeletePurchaseDocument(item)
                        }
                        onPreview={handlePreview}
                        uploadDisabled={!isPurchaseDataComplete}
                        deleteDisabled={!documentType.subido}
                        showRequirement
                        showActions={!isDocsDialog}
                        notUploadedLabel="No adjunto"
                        uploadedLabel="Adjunto"
                      />
                    </Grid>
                  ))}
                </Grid>
                {(dialogData.facturas_documentos || []).length > 0 && (
                  <Stack spacing={0.75} mt={2}>
                    <Typography variant="caption" color="text.secondary">
                      Facturas adjuntas
                    </Typography>
                    {dialogData.facturas_documentos.map((file, index) => (
                      <Stack
                        key={`${getFileName(file)}-${index}`}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            cursor: getDocumentId(file) ? "pointer" : "default",
                            textDecoration: getDocumentId(file)
                              ? "underline"
                              : "none",
                          }}
                          onClick={() =>
                            getDocumentId(file) &&
                            handlePreview(getDocumentId(file), getFileName(file))
                          }
                        >
                          {getFileName(file)}
                        </Typography>
                        {!isDocsDialog && (
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFactura(index)}
                            aria-label="Quitar factura"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Box>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <SAEButton
              variant="outlined"
              onClick={() => setDialogOpen(false)}
              disabled={dialogSaving}
            >
              Cancelar
            </SAEButton>
            {!isDocsDialog && (
              <SAEButton
                variant="contained"
                onClick={handleSavePurchase}
                disabled={dialogSaving}
                startIcon={
                  dialogSaving ? <CircularProgress size={18} /> : undefined
                }
              >
                Guardar
              </SAEButton>
            )}
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setSnackbarOpen(false)}
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>

        <DocumentPreviewDialog
          open={preview.open}
          onClose={closePreview}
          title={preview.title}
          imageSrc={preview.imageSrc}
          isPdf={preview.isPdf}
          loading={preview.loading}
          error={preview.error}
        />
      </Container>
    </Box>
  );
}
