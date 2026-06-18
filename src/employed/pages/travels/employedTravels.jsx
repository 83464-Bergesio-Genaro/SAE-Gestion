import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";

import { useState,useMemo } from "react";
import { TravelProvider } from "../../context/providers/travelProvider";
import { useTravel } from "../../context/employedContext";
import { DataGrid } from "@mui/x-data-grid";
import SAETextField from "../../../shared/components/inputs/SAETextField"; 
import SAEButton from "../../../shared/components/buttons/SAEButton"; 
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import HeaderPageEmployed from "../../../shared/components/HeaderPageEmployed";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import FolderIcon from '@mui/icons-material/Folder';
import { Diversity1 } from "@mui/icons-material";

export default function EmployedTravels() {
  return (
      <TravelProvider>
          <EmployedTravelsContent />
      </TravelProvider>
  );
}

const secciones = [
  { key: "empresas", label: "Empresas" },
  { key: "viajes", label: "Viajes" }
];

function EmployedTravelsContent(){
  const {   snackbarOpen,setSnackbarOpen,
            snackbarMsg,

            bussiness,bussinessRows, 
            loadingBussiness,bussinessColumns,
            openCreateBussiness,handleBussinessSave,

            travelsRows,
            loadingTravels,travelsColumns,
            openCreateTravels,

            usuarioSelected,setUsuarioSelected,loadingUsuario,fetchUsuariosXlegajo,
            inscriptsTravel,loadingInscripts,

            handleAddIncriptos,

            dialogOpen, setDialogOpen,
            dialogType, 
            dialogMode,
            dialogData, setDialogData,
            dialogSaving,
            dialogError, setDialogError} = useTravel();
      
        const sectionConfig = useMemo(
        () => ({
            empresas: {
                title: "Empresas",
                dialog: openCreateBussiness,
                addButton: "Nueva Empresa",
                icon: BusinessIcon,
                rows: bussinessRows,
                columns: bussinessColumns,
                loading: loadingBussiness
            },
            viajes: {
                title: "Viajes",
                dialog: openCreateTravels,
                addButton: "Nuevo Viaje",
                icon: LocalAirportIcon,
                rows: travelsRows,
                columns: travelsColumns,
                loading: loadingTravels
            }
        }),
        [
            bussinessRows, bussinessColumns, loadingBussiness,
            travelsRows, travelsColumns, loadingTravels,
            openCreateBussiness, openCreateTravels
        ]
    );
    const sanitizeAddressPart = (value = "") =>
      value.replace(/\s*-\s*/g, " ").replace(/\s{2,}/g, " ");

    const handleAddressChange = (index, value,dataName) => {
      
      const parts = parseAddress(dialogData[dataName]);
      parts[index] =sanitizeAddressPart(value);
      const hasAddressData = parts.some((part) => part.trim() !== "");
      handleDialogChange(dataName, hasAddressData ? parts.join(" - ") : "");
    };
    const parseAddress = (value = "") => {
      const parts = String(value).split(/\s+-\s+/);
      if (parts.length < 3) return [...parts, "", "", ""].slice(0, 3);

      return [parts[0], parts[1], parts[2]];
    };
    const addressPartsOrigin = parseAddress(dialogData.origen);
    const addressPartsDestiny = parseAddress(dialogData.destino);

    const [activeSection, setActiveSection] = useState("empresas");
    const [busquedaGestion, setBusquedaGestion] = useState("");
    const handleSectionChange = (section) => {
        setActiveSection(section);
        setBusquedaGestion("");
    };

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
  const handleDialogChange = (field, value) => {
    setDialogData((prev) => ({ ...prev, [field]: value }));
  };

  return(
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
          header=" Módulo de Viajes"
          title="Gestión de los viajes de la Empresa"
          description="En este módulo podrás gestionar los viajes de la empresa, incluyendo la creación, edición de las empresa como la gestión de los inscriptos y la documentación relacionada."
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
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={rowsGestionFiltradas}
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
        {dialogOpen && dialogType === "bussiness" && (
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
              {dialogMode === "create"
                ? "Nueva Empresa"
                : "Editar Empresa"}
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
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 3 }} m={0}>
                  <SAETextField
                    label="ID"
                    type="number"
                    fullWidth
                    value={dialogData.id}
                    onChange={(e) => handleDialogChange("id", e.target.value)}
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 9 }} m={0}>
                  <SAETextField
                    label="Nombre Empresa"
                    value={dialogData.nombre}
                    onChange={(e) => handleDialogChange("nombre", e.target.value)}
                    fullWidth
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }} m={0}>
                  <SAETextField
                    label="Telefono"
                    value={dialogData.telefono}
                    onChange={(e) => handleDialogChange("telefono", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }} m={0}>
                  <SAETextField
                    label="Email"
                    value={dialogData.email}
                    onChange={(e) => handleDialogChange("email", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }} m={0}>
                  <SAETextField
                    label="Cuit"
                    value={dialogData.cuit}
                    onChange={(e) => handleDialogChange("cuit", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12 }} m={0}>
                  <SAETextField
                    label="CBU"
                    value={dialogData.cbu}
                    onChange={(e) => handleDialogChange("cbu", e.target.value)}
                    fullWidth
                  />
                </Grid>
                {dialogMode === "edit" && (
                  <FormControlLabel
                      control={
                        <Switch
                          checked={dialogData.activo}
                          onChange={(e) =>
                            handleDialogChange("activo", e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label={
                        dialogData.activo
                          ? "Empresa Activa"
                          : "Empresa NO activa"
                      }
                    />)}
              </Grid>
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
              onClick={handleBussinessSave}
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
      {/*Dialog Travels */}
      {dialogOpen && dialogType === "travels" && (
        <Dialog
          open={dialogOpen}
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
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {dialogMode === "create"
                ? "Nuevo Viaje"
                : "Editar Viaje"}
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
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, md: 2 }} m={0}>
                  <SAETextField
                    label="ID"
                    type="number"
                    fullWidth
                    value={dialogData.id}
                    onChange={(e) => handleDialogChange("id", e.target.value)}
                    disabled={true}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }} m={0}>
                  <SAETextField
                    label="Nombre del Viaje"
                    value={dialogData.nombre}
                    onChange={(e) => handleDialogChange("nombre", e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }} m={0}>
                  <SAETextField
                    label="Cantidad"
                    type="number"
                    fullWidth
                    value={dialogData.cantidad_personas}
                    onChange={(e) => handleDialogChange("cantidad_personas", e.target.value)}
                    
                  />
                </Grid>
                <Grid size={{ xs: 12,md:6}} my={1}>
                  <SAETextField
                    label="Fecha de Inicio"
                    type="date"
                    value={dialogData.fecha_inicio}
                    onChange={(e) =>
                      handleDialogChange("fecha_inicio", e.target.value)
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 12,md:6 }} my={1}>
                  <SAETextField
                    label="Fecha Vuelta"
                    type="date"
                    value={dialogData.fecha_fin}
                    onChange={(e) =>
                      handleDialogChange("fecha_fin", e.target.value)
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider variant="middle" sx={{ my: 2 }}>
                    <Chip
                      label="Origen"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Divider>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <SAETextField
                    label="Provincia"
                    fullWidth
                    value={addressPartsOrigin[0]}
                    onChange={(e) => handleAddressChange(0, e.target.value,"origen")}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{ htmlInput: { maxLength: 50 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <SAETextField
                    label="Ciudad / Localidad"
                    fullWidth
                    value={addressPartsOrigin[1]}
                    onChange={(e) => handleAddressChange(1, e.target.value,"origen")}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{ htmlInput: { maxLength: 60 } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <SAETextField
                    label="Complejo / Ubicacion"
                    fullWidth
                    value={addressPartsOrigin[2]}
                    onChange={(e) => handleAddressChange(2, e.target.value,"origen")}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{ htmlInput: { maxLength: 80 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider variant="middle" sx={{ my: 2 }}>
                    <Chip
                      label="Destino"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Divider>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <SAETextField
                    label="Provincia"
                    fullWidth
                    value={addressPartsDestiny[0]}
                    onChange={(e) => handleAddressChange(0, e.target.value,"destino")}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{ htmlInput: { maxLength: 50 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <SAETextField
                    label="Ciudad / Localidad"
                    fullWidth
                    value={addressPartsDestiny[1]}
                    onChange={(e) => handleAddressChange(1, e.target.value,"destino")}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{ htmlInput: { maxLength: 60 } }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <SAETextField
                    label="Complejo / Ubicacion"
                    fullWidth
                    value={addressPartsDestiny[2]}
                    onChange={(e) => handleAddressChange(2, e.target.value,"destino")}
                    InputLabelProps={{ shrink: true }}
                    slotProps={{ htmlInput: { maxLength: 80 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Divider variant="middle" sx={{ my: 2 }}>
                    <Chip
                      label="Datos del Viaje"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </Divider>
                </Grid>                
                
                <Grid size={{ xs: 12,md:5 }} m={0}>
                  <Autocomplete
                    disablePortal
                    options={bussiness}
                    getOptionLabel={(option) => option.nombre}
                    onChange={(event, newValue) => {
                      // 'newValue' es el objeto completo del perfil seleccionado (o null)
                      if (newValue) {
                        handleDialogChange(
                          "id_empresa",
                          newValue.id,
                        );
                      } else {
                        // Maneja el caso de que se borre la selección
                        handleDialogChange("id_empresa", null);
                      }
                    }}
                    // Asegura que la comparación se haga por id
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    value={bussiness.find(
                      (buss) =>
                        buss.id === dialogData.id_empresa,
                    )} // Pasa el objeto completo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Empresa"
                        inputProps={{
                          ...params.inputProps,
                          readOnly: true, // Esto evita la escritura
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} m={0}>
                  <SAETextField
                    label="Presupuesto"
                    type="number"
                    fullWidth
                    value={dialogData.costo_total}
                    onChange={(e) => handleDialogChange("costo_total", e.target.value)}
                    
                  />
                </Grid>                
                <Grid sx={{display:"flex"}}  size={{ xs: 12,md:3 }} m={0}>
                  <FormControlLabel
                      control={
                        <Switch
                          checked={dialogData.seguro}
                          onChange={(e) =>
                            handleDialogChange("seguro", e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label={
                        dialogData.seguro
                          ? "Tiene Seguro"
                          : "Sin Seguro"
                      }
                    />
                </Grid>                
                <Grid size={{ xs: 12 }} m={0}>
                  <SAETextField
                    label="Motivo"
                    value={dialogData.motivo}
                    onChange={(e) => handleDialogChange("motivo", e.target.value)}
                    fullWidth
                    rows={2}
                    multiline
                  />
                </Grid>                
              </Grid>
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
              onClick={handleBussinessSave}
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
      {/* Seccion de Inscriptos*/}
      {dialogOpen && dialogType === "inscriptions" && (
        <Dialog
          open={dialogOpen}
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
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {dialogMode === "create"
                ? "Agregar Inscriptos"
                : "Editar Inscriptos"}
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
              <Grid container spacing={1}>
                <Grid size={{xs:12}} m={0}>
                {/* CASO A: No hay usuario seleccionado -> Mostramos el buscador */}
                { (!usuarioSelected) ? (
                    <SAETextField
                        label="Legajo"
                        value={dialogData.legajo}
                        onChange={(e) => handleDialogChange("legajo", e.target.value)}
                        fullWidth
                        disabled={loadingUsuario} // Deshabilita el input mientras busca
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                fetchUsuariosXlegajo(dialogData.legajo);
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {loadingUsuario ? (
                                        <CircularProgress size={24} color="inherit"/> // Spinner dentro del input
                                    ) : (
                                        <IconButton 
                                            onClick={() => fetchUsuariosXlegajo(dialogData.legajo)}
                                            edge="end"
                                        >
                                        <SearchIcon />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                  ) : (
                    /* CASO B: Usuario encontrado -> Mostramos resultado y opción de limpiar */
                    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Usuario Seleccionado:
                        </Typography>
                        {/* Reemplazá esto con los campos reales de tu objeto "usuarioSelected" */}
                        <Typography variant="body1">
                            {usuarioSelected.nombre_usuario}
                        </Typography>
                        <Stack direction={"row"} mt={2} spacing={2}>
                          <Button 
                            variant="contained" 
                            size="small" 
                            onClick={handleAddIncriptos} // Resetea para permitir volver a buscar
                            sx={{ mt: 2 }}
                          >
                            Agregar Estudiante
                          </Button>                        
                          <Button 
                              variant="outlined" 
                              color="secondary" 
                              size="small" 
                              onClick={() => setUsuarioSelected(null)} // Resetea para permitir volver a buscar
                              sx={{ mt: 2 }}
                          >
                              Volver a buscar
                          </Button>
                        </Stack>
                        
                    </Box>
                )}
                  {loadingInscripts && (
                  <Stack alignItems="center" width={"100%"} gap={1}>
                    <SAESpinner size="S" />
                  </Stack>
                  )}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" p={1} my={2} >
                        Planilla de Inscriptos
                    </Typography>
                  {!loadingInscripts && inscriptsTravel && inscriptsTravel.length === 0 && (
                    <Stack alignItems="center" width={"100%"} gap={1}>
                      <Typography variant="body2" noWrap>Sin Inscriptos</Typography>
                    </Stack>
                  )}
                  {!loadingInscripts && inscriptsTravel && inscriptsTravel.length > 0 &&(
                  <List dense disablePadding>
                    {inscriptsTravel.map((d) => (
                      <InscriptosCard datosEstudiante={d}/>
                    ))}
                    </List>
                  )}        
                  </Box>                
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <SAEButton
              variant="outlined"
              onClick={() => setDialogOpen(false)}
            >
              Cerrar
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
function InscriptosCard({datosEstudiante}){

  const [estudiante,SetDatosEstudiante] = useState(datosEstudiante);
  const handleInscriptosChange = (field, value) => {
    SetDatosEstudiante((prev) => ({ ...prev, [field]: value }));
  };

  const {handleRemoveInscriptos} = useTravel();
  return(
    <ListItem
      key={estudiante.id}
      disablePadding
    >
      <ListItemButton
        sx={{ py: 0.5 }}
      >
        <ListItemIcon sx={{ minWidth: 28 }}>
          <Diversity1 fontSize="small" sx={{ color: "#bdbdbd", pointerEvents: "none" }} />
        </ListItemIcon>
        
        <ListItemText sx={{ minWidth: 28 }}
          primary={<Typography variant="body2" noWrap>{estudiante.nombre_estudiante || estudiante.legajo_estudiante}</Typography>}
          secondary={
            estudiante.nombre_estudiante
              ? <Typography variant="caption" color="text.secondary">{estudiante.legajo_estudiante}</Typography>
              : undefined
          }
        />
          <FormControlLabel
            sx={{ width: 200 }}
            control={
              <Switch
                checked={estudiante.documentacion_presentada}
                onChange={(e) =>
                  handleInscriptosChange("documentacion_presentada", e.target.checked)
                }
                color="primary"
              />
            }
            label={
              estudiante.documentacion_presentada
                ? "Documentacion Completa"
                : "Falta Documentacion"
            }
          />
          <IconButton sx={{ minWidth: 24,width:50 }}
          //onClick={()=>handleRemoveInscriptos(d.id)}
          edge="end"
          >
            <FolderIcon />
          </IconButton> 
          <IconButton  
            onClick={()=>handleRemoveInscriptos(estudiante.id)}
            edge="end"
            >
            <CloseIcon />
          </IconButton>
      </ListItemButton>
    </ListItem>
  );
}