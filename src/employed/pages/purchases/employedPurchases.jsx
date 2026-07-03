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
import { useNotification } from "../../../shared/context/sharedContext";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SAEPage from "../../../shared/components/page/SAEPage";
import SAEDataGrid from "../../../shared/components/datagrid/SAEDataGrid";
import SAEDeleteDialog from "../../../shared/components/popUp/SAEDeleteDialog";

export default function EmployedPurchases() {
  return (
    <AdminUsersProvider>
      <PurchaseProvider>
        <EmployedPurchasesContent />
      </PurchaseProvider>
    </AdminUsersProvider>
  );
}

function EmployedPurchasesContent() {
  const {
    purchasesRows,
    purchasesColumns,
    loadingPurchase,
    fetchPurchases,
    openCreatePurchases,
    preview,
    getDefaultPurchaseDateRange,
    closePreview,
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
  const [activeSection] = useState("compras");
  const [dateRange, setDateRange] = useState(getDefaultPurchaseDateRange);

  const handleFechaDesdeChange = (event) => {
    const fechaDesde = event.target.value;

    setDateRange((previous) => ({
      ...previous,
      fechaDesde,
      fechaHasta:
        previous.fechaHasta < fechaDesde ? fechaDesde : previous.fechaHasta,
    }));
  };

  const handleFechaHastaChange = (event) => {
    const fechaHasta = event.target.value;

    setDateRange((previous) => ({
      ...previous,
      fechaHasta: fechaHasta > previous.today ? previous.today : fechaHasta,
    }));
  };

  useEffect(() => {
    fetchPurchases(dateRange.fechaDesde, dateRange.fechaHasta);
  }, [dateRange.fechaDesde, dateRange.fechaHasta, fetchPurchases]);

  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );
  return (
    <SAEPage>
      <HeaderPageEmployed
        header="Módulo de Compras"
        title="Gestion de las Compras"
        description="En este módulo se registran todas las compras que hace la secretaria."
      />
      

      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={currentSection}
        beforeSearch={
          <>
            <SAETextField
              size="small"
              label="Fecha Desde"
              type="date"
              value={dateRange.fechaDesde}
              onChange={handleFechaDesdeChange}
              sx={{
                width: { xs: "100%", sm: 180 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.6)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.7)",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "white" },
                "& .MuiInputAdornment-root svg": {
                  color: "rgba(255,255,255,0.7)",
                },
              }}
              slotProps={{
                htmlInput: { max: dateRange.fechaHasta },
              }}
            />
            <SAETextField
              size="small"
              label="Fecha Hasta"
              type="date"
              value={dateRange.fechaHasta}
              onChange={handleFechaHastaChange}
              sx={{
                width: { xs: "100%", sm: 180 },
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.6)",
                  },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255,255,255,0.7)",
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "white" },
                "& .MuiInputAdornment-root svg": {
                  color: "rgba(255,255,255,0.7)",
                },
              }}
              slotProps={{
                input: {},
                htmlInput: {
                  min: dateRange.fechaDesde,
                  max: dateRange.today,
                },
              }}
            />
          </>
        }
      />
      <DocumentPreviewDialog
        open={preview.open}
        onClose={closePreview}
        title={preview.title}
        imageSrc={preview.imageSrc}
        isPdf={preview.isPdf}
        loading={preview.loading}
        error={preview.error}
      />
      <DialogPurchase dateRange={dateRange} />
    </SAEPage>
  );
}

function DialogPurchase({ dateRange }) {
  const {
    dialogOpen,
    dialogData,
    dialogType,
    dialogMode,
    dialogError,
    dialogSaving,
    setDialogError,
    handleDataChange,
    closeDialog,
  } = useNotification();
  const isDocsDialog = dialogType === "docs";
  const showPurchaseForm = dialogType === "purchases";
  const showDocumentsForm = dialogMode === "create" || isDocsDialog;
  const { empleados, loadingEmpleados } = useEmploy();

  const {
    isPurchaseDataComplete,
    handleCurrencyInputChange,
    getCurrencyValue,
    setFocusedCurrencyField,
    handleCurrencyBlur,
    handleInformeTecnicoChange,
    handleEmpleadoChange,
    handleFacturaChange,
    handleInformePdfChange,
    handleDeletePurchaseDocument,
    handleRemoveFactura,
    getFileName,
    handlePreview,
    purchaseDocuments,
    handleSavePurchase,
    handleConfirmWithoutInforme,
    warningOpen,
    setWarningOpen,
    handleDeletePurchase,
  } = usePurchase();

  const selectedEmpleado = useMemo(
    () =>
      empleados.find(
        (empleado) => String(empleado.id) === String(dialogData.id_usuario),
      ) || null,
    [dialogData.id_usuario, empleados],
  );

  const deleteDialogConfig = {
    purchaseDelete: {
      entityLabel: "Compra",
      itemName: dialogData?.nombre_compra,
      onConfirm: handleDeletePurchase,
    },
  };

  if (dialogOpen && dialogMode === "delete") {
    const config = deleteDialogConfig[dialogType];

    return config ? (
      <SAEDeleteDialog
        open={dialogOpen}
        entityLabel={config.entityLabel}
        itemName={config.itemName}
        itemId={dialogData?.id}
        onConfirm={config.onConfirm}
        onClose={closeDialog}
        loading={dialogSaving}
        error={dialogError}
        onClearError={() => setDialogError("")}
      />
    ) : null;
  }

  return (
    <>
      <Dialog
        open={dialogOpen && ["purchases", "docs"].includes(dialogType)}
        onClose={closeDialog}
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
          <IconButton onClick={closeDialog} size="small">
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
                        required
                        fullWidth
                      />
                    )}
                    sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}
                  />
                  <SAETextField
                    label="Nombre de la compra"
                    required
                    value={dialogData.nombre_compra ?? ""}
                    onChange={(e) =>
                      handleDataChange("nombre_compra", e.target.value)
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="Precio sugerido"
                    required
                    value={getCurrencyValue(
                      "precio_sugerido",
                      dialogData.precio_sugerido,
                    )}
                    onFocus={() => setFocusedCurrencyField("precio_sugerido")}
                    onBlur={() =>
                      handleCurrencyBlur(
                        "precio_sugerido",
                        dialogData.precio_sugerido,
                        handleDataChange,
                      )
                    }
                    onChange={(e) =>
                      handleCurrencyInputChange(
                        "precio_sugerido",
                        e.target.value,
                        handleDataChange,
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
                    required
                    value={dialogData.motivo ?? ""}
                    onChange={(e) => handleDataChange("motivo", e.target.value)}
                    fullWidth
                    multiline
                    minRows={3}
                    sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}
                  />
                  <SAETextField
                    label="Fecha compra"
                    required
                    type="date"
                    value={dialogData.fecha_compra ?? ""}
                    onChange={(e) =>
                      handleDataChange("fecha_compra", e.target.value)
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}
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
                        onDelete={(item) => handleDeletePurchaseDocument(item)}
                        onPreview={handlePreview}
                        documents={documentType.documentos}
                        getDocumentName={getFileName}
                        onDeleteDocument={(index) =>
                          documentType.key === "facturas"
                            ? handleRemoveFactura(index)
                            : handleDeletePurchaseDocument(documentType)
                        }
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
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton
            variant="outlined"
            onClick={closeDialog}
            disabled={dialogSaving}
          >
            Cancelar
          </SAEButton>
          {!isDocsDialog && (
            <SAEButton
              variant="contained"
              onClick={() =>
                handleSavePurchase(dateRange.fechaDesde, dateRange.fechaHasta)
              }
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

      <Dialog open={warningOpen} onClose={() => setWarningOpen(false)}>
        <DialogTitle>Informe técnico incompleto</DialogTitle>
        <DialogContent>
          <Alert severity="warning">
            Estás por crear una compra sin informe técnico. ¿Querés continuar?
          </Alert>
        </DialogContent>
        <DialogActions>
          <SAEButton variant="outlined" onClick={() => setWarningOpen(false)}>
            Volver
          </SAEButton>
          <SAEButton
            variant="contained"
            onClick={() =>
              handleConfirmWithoutInforme(
                dateRange.fechaDesde,
                dateRange.fechaHasta,
              )
            }
          >
            Crear sin informe
          </SAEButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
