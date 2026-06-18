import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  InputAdornment,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";

import React, { useState, useMemo } from "react";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import LinkIcon from "@mui/icons-material/Link";

import StorageIcon from "@mui/icons-material/Storage";
import PublicIcon from "@mui/icons-material/Public";
import CodeIcon from "@mui/icons-material/Code";
import TitleBox from "../../../shared/components/titleBox";
import { useConsultations } from "../../context/employedContext";
import { ConsultationProvider } from "../../context/providers/consultationsProvider";

import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import {
  CONSULTATION_FAQS,
  QUICK_CONSULTATION_FAQS,
  SAE_EMAIL,
} from "../../../shared/pages/consultations/consultations.config";

const options = [
  {
    icon: StorageIcon,
    title: "API y tabla de preguntas",
    description:
      "Opción recomendada. Permite alta, edición, baja, orden y publicación desde este panel para todos los estudiantes.",
  },
  {
    icon: PublicIcon,
    title: "CMS externo",
    description:
      "Útil si SAE necesita editar contenido sin desplegar la aplicación. Requiere integrar un proveedor de contenido.",
  },
  {
    icon: CodeIcon,
    title: "Configuración versionada",
    description:
      "La opción actual: las preguntas viven en un archivo compartido y se publican junto con cada despliegue.",
  },
];

function EmployedContent() {
  const {
    //ABM LinkFrecuentes
    // ABM Link Frecuentes
    linksFrecuentesRows,
    linksFrecuentesColumns,
    loadingLinksFrecuentes,
    openCreatelinksFrecuentes,
    handleLinksFrecuentesSave,
    handleLinksFrecuenteDelete,
    linksFrecuentesIcons,

    //Valores
    setDialogError,
    snackbarOpen,
    setSnackbarOpen,
    snackbarMsg,
    dialogOpen,
    setDialogOpen,
    dialogData,
    setDialogData,
    dialogType,
    dialogMode,
    dialogError,
    dialogSaving,
  } = useConsultations();

  const sectionConfig = useMemo(
    () => ({
      linkFrecuentes: {
        title: "Link Frecuentes",
        dialog: openCreatelinksFrecuentes,
        addButton: "Nuevo Link",
        icon: LinkIcon,
        rows: linksFrecuentesRows,
        columns: linksFrecuentesColumns,
        loading: loadingLinksFrecuentes,
      },
    }),
    [
      openCreatelinksFrecuentes,
      linksFrecuentesRows,
      linksFrecuentesColumns,
      loadingLinksFrecuentes,
    ],
  );

  const [activeSection] = useState("linkFrecuentes");

  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );

  const selectedDialogIcon = useMemo(() => {
    const iconIndex = Number(dialogData.id_index_ico) || 0;
    return (
      linksFrecuentesIcons.find((iconOption) => iconOption.id === iconIndex) ??
      linksFrecuentesIcons[0]
    );
  }, [dialogData.id_index_ico, linksFrecuentesIcons]);

  const SelectedDialogIcon = selectedDialogIcon.icon;

  const handleDialogChange = (field, value) => {
    setDialogData((prev) => ({ ...prev, [field]: value }));
  };

  const [busquedaLinkFrecuentes, setBusquedaLinkFrecuentes] = useState("");

  const rowsLinkFrecuentesFiltradas = useMemo(() => {
    const term = busquedaLinkFrecuentes.trim().toLowerCase();
    if (!term) return currentSection.rows;

    return currentSection.rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [currentSection.rows, busquedaLinkFrecuentes]);

  const dialogTitle =
    dialogMode === "create"
      ? "Nuevo Link Frecuente"
      : dialogMode === "delete"
        ? "Eliminar Link Frecuente"
        : "Editar Link Frecuente";

  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "90px", md: "100px" },
        pb: 8,
        bgcolor: "#f4f8fc",
        minHeight: "calc(100vh - 90px)",
      }}
    >
      <Container maxWidth="xl">
        <HeaderPageEmployed
          header=" Módulo de Consultas"
          title="Gestión de Consultas"
          description="Revisá el contenido visible para estudiantes y planificá su administración."
        />
        <TitleBox title="Links Frecuentes" />
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
                  placeholder="Busqueda..."
                  size="small"
                  value={busquedaLinkFrecuentes}
                  onChange={(e) => setBusquedaLinkFrecuentes(e.target.value)}
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
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={rowsLinkFrecuentesFiltradas}
                columns={currentSection.columns}
                loading={currentSection.loading}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                localeText={{ noRowsLabel: "Sin Registros" }}
                sx={{ borderRadius: 0, border: "none" }}
              />
            </Box>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mt: 2 }}>
          Actualmente las preguntas son contenido versionado. Sin una API o CMS,
          los cambios desde una interfaz no podrían publicarse para todos los
          estudiantes.
        </Alert>
        <Typography variant="h5" fontWeight={800} sx={{ mt: 4 }}>
          Preguntas publicadas
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {CONSULTATION_FAQS.map((faq) => (
            <Grid key={faq.id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                <CardContent>
                  <Chip label={faq.category} size="small" />
                  <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                    {faq.question}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {faq.answer}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                    Enlace: {faq.link}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" fontWeight={800} sx={{ mt: 5 }}>
          Respuestas rápidas publicadas
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {QUICK_CONSULTATION_FAQS.map((faq) => (
            <Grid key={faq.id} size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: "100%", borderRadius: 4 }}>
                <CardContent>
                  <Chip label={faq.category} size="small" variant="outlined" />
                  <Typography fontWeight={700} sx={{ mt: 2 }}>
                    {faq.question}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {faq.answer}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/*<Typography variant="h5" fontWeight={800} sx={{ mt: 5 }}>
          Opciones para habilitar administración
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <Grid key={option.title} size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: "100%", borderRadius: 4 }}>
                  <CardContent>
                    <Icon color="primary" sx={{ fontSize: 38 }} />
                    <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                      {option.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                      {option.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>*/}
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          Las consultas preparadas por estudiantes se dirigen actualmente a:{" "}
         <strong> {SAE_EMAIL}</strong>
        </Typography>

        {dialogOpen && dialogType === "linkFrecuentes" && (
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
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: "bold" }}
              >
                {dialogTitle}
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
                {dialogMode === "delete" ? (
                  <>
                    <Alert severity="warning">
                      Esta accion eliminara el link frecuente y no se puede
                      deshacer.
                    </Alert>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "grey.50",
                        p: 2,
                      }}
                    >
                      <Typography fontWeight={700}>
                        {dialogData.titulo || "Sin titulo"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, overflowWrap: "anywhere" }}
                      >
                        {dialogData.hipervinculo || "Sin hipervinculo"}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12, md: 6 }} m={0}>
                        <SAETextField
                          label="ID"
                          type="number"
                          fullWidth
                          value={dialogData.id}
                          onChange={(e) =>
                            handleDialogChange("id", e.target.value)
                          }
                          disabled={true}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }} m={0}>
                        <FormControl fullWidth>
                          <InputLabel id="link-frecuente-icon-label">
                            Icono
                          </InputLabel>
                          <Select
                            labelId="link-frecuente-icon-label"
                            label="Icono"
                            value={Number(dialogData.id_index_ico) || 0}
                            onChange={(e) =>
                              handleDialogChange("id_index_ico", e.target.value)
                            }
                            renderValue={() => {
                              const Icon = selectedDialogIcon.icon;
                              return (
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Icon fontSize="small" color="primary" />
                                  <Typography component="span">
                                    {selectedDialogIcon.label}
                                  </Typography>
                                </Stack>
                              );
                            }}
                          >
                            {linksFrecuentesIcons.map((iconOption) => {
                              const Icon = iconOption.icon;

                              return (
                                <MenuItem
                                  key={iconOption.id}
                                  value={iconOption.id}
                                >
                                  <ListItemIcon>
                                    <Icon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={iconOption.label} />
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label="Titulo"
                          value={dialogData.titulo}
                          onChange={(e) =>
                            handleDialogChange("titulo", e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label="Hipervinculo"
                          value={dialogData.hipervinculo}
                          onChange={(e) =>
                            handleDialogChange("hipervinculo", e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <Box
                          component={dialogData.hipervinculo ? "a" : "div"}
                          href={dialogData.hipervinculo || undefined}
                          target={
                            dialogData.hipervinculo ? "_blank" : undefined
                          }
                          rel={
                            dialogData.hipervinculo
                              ? "noopener noreferrer"
                              : undefined
                          }
                          sx={{
                            alignItems: "center",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            color: "inherit",
                            display: "flex",
                            gap: 1.5,
                            p: 2,
                            textDecoration: "none",
                            transition: "border-color 0.15s, box-shadow 0.15s",
                            "&:hover": dialogData.hipervinculo
                              ? {
                                  borderColor: "primary.main",
                                  boxShadow:
                                    "0 8px 22px rgba(21, 61, 113, 0.12)",
                                }
                              : undefined,
                          }}
                        >
                          <Box
                            sx={{
                              alignItems: "center",
                              bgcolor: "primary.main",
                              borderRadius: 2,
                              color: "white",
                              display: "flex",
                              flexShrink: 0,
                              height: 42,
                              justifyContent: "center",
                              width: 42,
                            }}
                          >
                            <SelectedDialogIcon fontSize="small" />
                          </Box>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={700} noWrap>
                              {dialogData.titulo || "Titulo del link"}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {dialogData.hipervinculo ||
                                "https://ejemplo.com/link-frecuente"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </>
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
              <SAEButton
                variant="contained"
                color={dialogMode === "delete" ? "error" : "primary"}
                onClick={
                  dialogMode === "delete"
                    ? handleLinksFrecuenteDelete
                    : handleLinksFrecuentesSave
                }
                disabled={dialogSaving}
                startIcon={
                  dialogSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
              >
                {dialogMode === "create"
                  ? "Crear"
                  : dialogMode === "delete"
                    ? "Eliminar"
                    : "Guardar"}
              </SAEButton>
            </DialogActions>
          </Dialog>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
export default function EmployedConsultations() {
  return (
    <ConsultationProvider>
      <EmployedContent />
    </ConsultationProvider>
  );
}
