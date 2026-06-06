import React, { useMemo, useState } from "react";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { AdminUsersProvider, useAdminUsers } from "./AdminUsersContext";
import {
  Autocomplete,
  Box,
  Grid,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
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
import ScheduleIcon from "@mui/icons-material/Schedule";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AddIcon from "@mui/icons-material/Add";
import CastleIcon from "@mui/icons-material/Castle";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SearchIcon from "@mui/icons-material/Search";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useAuth } from "../../../shared/auth/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { EmployedCalendar } from "./EmployedCalendar";
import GestionarHorariosDialog from "./HorariosDialog";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
const secciones = [
  { key: "empleados", label: "Empleados" },
  { key: "usuarios", label: "Estudiantes Registrados" },
];
// 1. ESTE SUBCOMPONENTE SÍ PUEDE USAR EL HOOK (Porque está abajo del Provider)
function EmployedAdminContent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    empleadosRows,
    empleadosColumns,
    loadingEmpleados,
    openCreateEmpleados,
    usuariosRows,
    usuariosColumns,
    loadingUsuarios,
    openCreateUsuarios,
    dialogOpen,
    setDialogOpen,
    dialogData,
    setDialogData,
    dialogType,
    dialogMode,
    dialogError,
    dialogSaving,
    horariosDialogOpen,
    setHorariosDialogOpen,
    snackbarOpen,
    setSnackbarOpen,
    snackbarMsg,
    setDialogError,
    handleUsuariosSave,
    handleEmpleadosSave,
    carreras,
    perfiles,
  } = useAdminUsers();

  const sectionConfig = useMemo(
    () => ({
      empleados: {
        title: "Empleados",
        dialog: openCreateEmpleados,
        addButton: "Nuevo Empleado",
        icon: Diversity3Icon,
        rows: empleadosRows,
        columns: empleadosColumns,
        loading: loadingEmpleados,
      },
      usuarios: {
        title: "Estudiantes Registrados",
        dialog: openCreateUsuarios,
        addButton: "Nuevo Usuario",
        icon: PersonAddAltIcon,
        rows: usuariosRows,
        columns: usuariosColumns,
        loading: loadingUsuarios,
      },
    }),
    [
      empleadosRows,
      empleadosColumns,
      loadingEmpleados,
      openCreateEmpleados,
      usuariosRows,
      usuariosColumns,
      loadingUsuarios,
      openCreateUsuarios,
    ],
  );

  const [activeSection, setActiveSection] = useState("empleados");
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
          header="Módulo de Empleados"
          title="Gestión de Empleados y sus Horarios"
          description="Permite cargar empleados, modificar sus permisos y sus horarios"
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
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
            overflow: "hidden",
            mt: 3,
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #1a3a5c 0%, #2d6da3 100%)",
              color: "white",
              px: 3,
              py: 2.5,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <ScheduleIcon sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Horarios Empleados
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>
                    Nuestros Horarios
                  </Typography>
                </Box>
              </Stack>
              <SAEButton
                variant="contained"
                startIcon={<ScheduleIcon />}
                onClick={() => setHorariosDialogOpen(true)}
                sx={{
                  whiteSpace: "nowrap",
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.4)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                }}
              >
                Gestionar Horarios
              </SAEButton>
            </Stack>
          </Box>
        </Card>
        <EmployedCalendar />
      </Container>

      {/*Esto abre un dialog para cargar, modificar o eliminar los datos del tipo seleccionado. Yo lo separo asi porque es mas comodo visualmente */}
      {dialogOpen && dialogType === "empleados" && (
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
              {dialogMode === "create" ? "Nuevo Empleado" : "Editar Empleado"}
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
              <>
                {dialogMode === "edit" && (
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 3 }} m={0}>
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
                    <Grid size={{ xs: 12, md: 9 }} m={0}>
                      <SAETextField
                        label="Nombre Completo"
                        value={dialogData.nombre_empleado}
                        disabled={true}
                        onChange={(e) =>
                          handleDialogChange("nombre_empleado", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                )}
                {dialogMode === "create" && (
                  <>
                    <Card
                      sx={{
                        bgcolor: "rgba(235, 235, 41, 0.7)",
                        border: "1px solid rgba(235, 41, 41, 0.1)",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          fontWeight={600}
                          gutterBottom
                        >
                          ¡ATENCION!
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Al crear un nuevo empleado debe escribirse sin errores
                          su legajo ya que esta sera la unica forma que pueda
                          acceder a la aplicacion, debe contener el valor
                          @utn.frc.edu.ar al final. El nombre completo solo
                          podra ser modificado por el usuario desde la
                          aplicacion despues de creado.
                          <br />
                          <br />
                          Ademas desde esta pestaña solo se podran crear
                          perfiles de empleados, comedor, salud y administrador.
                        </Typography>
                      </CardContent>
                    </Card>
                    <SAETextField
                      label="Nombres"
                      value={dialogData.nombres}
                      onChange={(e) =>
                        handleDialogChange("nombres", e.target.value)
                      }
                      fullWidth
                    />
                    <SAETextField
                      label="Apellidos"
                      value={dialogData.apellidos}
                      onChange={(e) =>
                        handleDialogChange("apellidos", e.target.value)
                      }
                      fullWidth
                    />
                    <SAETextField
                      label="Nombre de Usuario"
                      value={dialogData.nombre_usuario}
                      onChange={(e) =>
                        handleDialogChange("nombre_usuario", e.target.value)
                      }
                      fullWidth
                    />
                  </>
                )}
                <SAETextField
                  label="Legajo"
                  value={dialogData.legajo}
                  disabled={dialogMode === "create" ? false : true}
                  onChange={(e) => handleDialogChange("legajo", e.target.value)}
                  fullWidth
                />
                <Autocomplete
                  disablePortal
                  options={perfiles}
                  getOptionLabel={(option) => option.nombre}
                  onChange={(event, newValue) => {
                    // 'newValue' es el objeto completo del perfil seleccionado (o null)
                    if (newValue) {
                      handleDialogChange("id_perfil", newValue.id);
                    } else {
                      // Maneja el caso de que se borre la selección
                      handleDialogChange("id_perfil", null);
                    }
                  }}
                  // Asegura que la comparación se haga por id
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  value={perfiles.find(
                    (perfil) => perfil.id === dialogData.id_perfil,
                  )} // Pasa el objeto completo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Perfil"
                      inputProps={{
                        ...params.inputProps,
                        readOnly: true, // Esto evita la escritura
                      }}
                    />
                  )}
                />
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
                      dialogData.activo ? "Usuario Activo" : "Usuario NO Activo"
                    }
                  />
                )}
              </>
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
              onClick={handleEmpleadosSave}
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
      {/*Esto abre un dialog para cargar, modificar o eliminar los datos del tipo seleccionado. Yo lo separo asi porque es mas comodo visualmente */}
      {dialogOpen && dialogType === "usuarios" && (
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
              {dialogMode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
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
              <>
                {dialogMode === "edit" && (
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 3 }} m={0}>
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
                    <Grid size={{ xs: 12, md: 9 }} m={0}>
                      {console.log(dialogData)}
                      <SAETextField
                        label="Nombre Completo"
                        value={dialogData.nombre_usuario}
                        disabled={true}
                        onChange={(e) =>
                          handleDialogChange("nombre_usuario", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                )}
                {dialogMode === "create" && (
                  <>
                    <Card
                      sx={{
                        bgcolor: "rgba(235, 235, 41, 0.7)",
                        border: "1px solid rgba(235, 41, 41, 0.1)",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle2"
                          color="textPrimary"
                          fontWeight={600}
                          gutterBottom
                        >
                          ¡ATENCION!
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Al crear el usuario desde esta pestaña estamos
                          creandolo como estudiante (id_perfil = 1) por lo que
                          tendra restringido la vista de SAE
                          <br />
                          <br />
                          El nombre de Usuario sera su primer nombre a menos que
                          lo cambie desde la pantalla de perfil, el legajo debe
                          estar en su version completa incluyendo el
                          @utn.frc.edu.ar al final, y el nombre completo se
                          formara con los campos de nombres y apellidos.
                          <br />
                          <br />
                          El nombre completo solo podra ser modificado por el
                          usuario desde la aplicacion despues de creado.
                        </Typography>
                      </CardContent>
                    </Card>
                    <SAETextField
                      label="Nombres"
                      value={dialogData.nombres}
                      onChange={(e) =>
                        handleDialogChange("nombres", e.target.value)
                      }
                      fullWidth
                    />
                    <SAETextField
                      label="Apellidos"
                      value={dialogData.apellidos}
                      onChange={(e) =>
                        handleDialogChange("apellidos", e.target.value)
                      }
                      fullWidth
                    />
                    <Autocomplete
                      disablePortal
                      options={carreras}
                      getOptionLabel={(option) => option.nombre}
                      onChange={(event, newValue) => {
                        // 'newValue' es el objeto completo de la carrera seleccionada (o null)
                        if (newValue) {
                          handleDialogChange("id_carrera", newValue.id);
                        } else {
                          // Maneja el caso de que se borre la selección
                          handleDialogChange("id_carrera", null);
                        }
                      }}
                      // Asegura que la comparación se haga por id
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      value={carreras.find(
                        (carrera) => carrera.id === dialogData.id_carrera,
                      )} // Pasa el objeto completo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Carrera"
                          inputProps={{
                            ...params.inputProps,
                            readOnly: true, // Esto evita la escritura
                          }}
                        />
                      )}
                    />
                  </>
                )}
                <SAETextField
                  label="Legajo"
                  value={dialogData.legajo}
                  disabled={dialogMode === "create" ? false : true}
                  onChange={(e) => handleDialogChange("legajo", e.target.value)}
                  fullWidth
                />

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
                        ? "Desactivar Usuario"
                        : "Activar Usuario"
                    }
                  />
                )}
              </>
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
              onClick={handleUsuariosSave}
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
      <GestionarHorariosDialog open={horariosDialogOpen} />

      {/* MENSAJE DE EXITO */}
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
    </Box>
  );
}

// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function EmployedAdmin() {
  return (
    <AdminUsersProvider>
      <EmployedAdminContent />
    </AdminUsersProvider>
  );
}
