//FUNCIONES
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HealthUsersProvider } from "../../context/providers/healthProvider";
import { useHealth } from "../../context/employedContext";
import { useAuth } from "../../../shared/context/sharedContext";
//ICONS
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SchoolIcon from "@mui/icons-material/School";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
//COMPONENTES
import { DataGrid } from "@mui/x-data-grid";
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
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import { EmployedCalendar } from "./HealthCalendar";
import GestionarHorariosDialog from "./HorariosDialog";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";



function EmployedAdminContent(){
    const navigate = useNavigate();
    const secciones = [
      { key: "especialidades", label: "Especialidades" },
      { key: "personal", label: "Personal Medico" }, //En esta seccion se le registra la falta medica
      { key: "cursos", label: "Cursos Medicos" },
    ];
    const {
            //ABM Faltas
             SetCuilFaltas,faltasRows,faltasColumns,loadingFaltas,
            //ABM Especialidades
            especialidades,especialidadesActivas,especialidadesRows,especialidadesColumns,loadingEspecialidades,openCreateEspecialidades,handleEspecialidadesSave,
            //ABM de Personal
            personalRows,personalColumns,loadingPersonal,openCreatePersonal,handlePersonalSave,
            //ABM de Cursos
            cursosRows,cursosColumns,loadingCursos,openCreateCurso,handleCursoSave,
            //Valores de error, mostrar mensajes, etc.
            snackbarOpen, setSnackbarOpen,snackbarMsg,setDialogError,
            dialogOpen, setDialogOpen, dialogData, setDialogData, dialogType, dialogMode, dialogError, dialogSaving,
            setHorariosDialogOpen,horariosDialogOpen
    } = useHealth();
   
    const sectionConfig = useMemo(
            () => ({
                especialidades: {
                    title: "Especialidades",
                    dialog: openCreateEspecialidades,
                    addButton: "Nueva Especialidad",
                    icon: MedicalServicesIcon,
                    rows: especialidadesRows,
                    columns: especialidadesColumns,
                    loading: loadingEspecialidades
                },
                personal: {
                    title: "Personal Medico",
                    dialog: openCreatePersonal,
                    addButton: "Alta de Personal",
                    icon: PersonAddAltIcon,
                    rows: personalRows,
                    columns: personalColumns,
                    loading: loadingPersonal
                },
                cursos:{
                    title: "Cursos Medicos",
                    dialog: openCreateCurso,
                    addButton: "Nuevo Curso",
                    icon: SchoolIcon,
                    rows: cursosRows,
                    columns: cursosColumns,
                    loading: loadingCursos                    
                }
            }),
            [
                especialidadesRows,especialidadesColumns,loadingEspecialidades,openCreateEspecialidades,
                personalRows,personalColumns,loadingPersonal,openCreatePersonal,
                cursosRows,cursosColumns,loadingCursos,openCreateCurso
            ]
        );
    const [activeSection, setActiveSection] = useState("especialidades");
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
          header=" Módulo de Salud"
          title="Gestión de las capacidades medicas de nuestra area"
          description="Permite cargar especialidades, personal, cursos, horarios para el personal y gestionar los turnos de los estudiantes"
        />

        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
            overflow: "hidden",
            mt: 3,
            mb: 4,
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #1a3a5c 0%, #6140CB 100%)",
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
                <DashboardIcon sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    Gestion de Turnos
                  </Typography>
                </Box>
              </Stack>
              <SAEButton
                variant="contained"
                startIcon={<DashboardIcon />}
                onClick={() => navigate("/Gestion-Salud/Turnos")}
                sx={{
                  whiteSpace: "nowrap",
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.4)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                }}
              >
                Ingresar al Turnero
              </SAEButton>
            </Stack>
          </Box>
        </Card>

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
        {/*CALENDARIO */}
        <EmployedCalendar />
      </Container>
      {/*DIALOG DE ESPECIALIDADES*/}
      {dialogOpen && dialogType === "especialidades" && (
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
                      label="Nombre Completo"
                      value={dialogData.nombre}
                      onChange={(e) =>
                        handleDialogChange("nombre", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} m={0}>
                    <SAETextField
                      label="Descripción"
                      value={dialogData.descripcion}
                      onChange={(e) =>
                        handleDialogChange("descripcion", e.target.value)
                      }
                      multiline
                      fullWidth
                      rows={2} // Número inicial de filas
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
                          ? "Especialidad Activa"
                          : "Especialidad NO activa"
                      }
                    />
                  )}
                </Grid>
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
              onClick={handleEspecialidadesSave}
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

      {/*DIALOG DE PERSONAL*/}
      {dialogOpen && dialogType === "personal" && (
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
                ? "Nuevo Empleado" //Primera condicion
                : dialogMode === "edit"
                  ? "Editar Empleado" //Segunda condicion
                  : "Registrar Falta"}
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
                {dialogMode === "faltas" ? (
                  <>
                    <Grid container spacing={1}>
                      <Typography
                        variant="subtitle2"
                        color="textPrimary"
                        fontWeight={600}
                        gutterBottom
                      >
                        Faltas Previas
                      </Typography>
                      <Grid size={{ xs: 12 }} my={1}>
                        <Box sx={{ width: "100%" }}>
                          <DataGrid
                            rows={faltasRows}
                            columns={faltasColumns}
                            loading={loadingFaltas}
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
                      </Grid>
                      <Typography
                        variant="subtitle2"
                        color="textPrimary"
                        fontWeight={600}
                        gutterBottom
                      >
                        Registrar Nueva Falta
                      </Typography>
                      <Grid size={{ xs: 12 }} my={1}>
                        <SAETextField
                          label="Observacion de la Falta"
                          value={dialogData.observacion}
                          onChange={(e) =>
                            handleDialogChange("observacion", e.target.value)
                          }
                          multiline
                          fullWidth
                          rows={4} // Número inicial de filas
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} my={1}>
                        <SAETextField
                          label="Fecha de la Falta"
                          type="date"
                          value={dialogData.fecha_alta}
                          onChange={(e) =>
                            handleDialogChange("fecha_alta", e.target.value)
                          }
                          fullWidth
                          slotProps={{ inputLabel: { shrink: true } }}
                        />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    {dialogMode === "create" && (
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
                            Al crear el personal medico se le solicitara el
                            CUIL, el mismo NO podra ser modificado despues, es
                            decir, que despues de la carga de esta persona solo
                            el equipo de sistemas podra eliminar dicho registro.
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label="CUIL"
                          type="number"
                          fullWidth
                          value={dialogData.cuil}
                          onChange={(e) =>
                            handleDialogChange("cuil", e.target.value)
                          }
                          disabled={dialogMode === "edit"}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label="Nombre"
                          value={dialogData.nombre}
                          onChange={(e) =>
                            handleDialogChange("nombre", e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label="Apellido"
                          value={dialogData.apellido}
                          onChange={(e) =>
                            handleDialogChange("apellido", e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>

                      <Grid size={{ xs: 12 }} m={0}>
                        <Autocomplete
                          disablePortal
                          options={especialidadesActivas}
                          getOptionLabel={(option) => option.nombre}
                          onChange={(event, newValue) => {
                            // 'newValue' es el objeto completo del perfil seleccionado (o null)
                            if (newValue) {
                              handleDialogChange(
                                "id_especialidad",
                                newValue.id,
                              );
                            } else {
                              // Maneja el caso de que se borre la selección
                              handleDialogChange("id_especialidad", null);
                            }
                          }}
                          // Asegura que la comparación se haga por id
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          value={especialidades.find(
                            (especialidad) =>
                              especialidad.id === dialogData.id_especialidad,
                          )} // Pasa el objeto completo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Especialidad"
                              inputProps={{
                                ...params.inputProps,
                                readOnly: true, // Esto evita la escritura
                              }}
                            />
                          )}
                        />
                      </Grid>
                      {dialogMode === "edit" && (
                        <>
                          <Card
                            sx={{
                              bgcolor: "rgba(226, 71, 71, 0.7)",
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
                                IMPORTANTE!
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Si la especialidad no se encuentra activa
                                aparecera como dato pero no sera seleccionable.
                              </Typography>
                            </CardContent>
                          </Card>
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
                                ? "Personal Activo"
                                : "Personal NO activo"
                            }
                          />
                        </>
                      )}
                    </Grid>
                  </>
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
              onClick={handlePersonalSave}
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
      {/* DIALOG DE CURSOS */}
      {dialogOpen && dialogType === "cursos" && (
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
              {dialogMode === "create" ? "Nuevo Curso" : "Editar Curso"}
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
                  <Typography variant="h6" component="span">
                    Esta seguro que quiere el Curso?:
                  </Typography>
                  <Typography variant="h7" component="span">
                    ID:{dialogData.id} <br />
                    Nombre: "{dialogData.nombre_curso}"
                  </Typography>
                </>
              ) : (
                <>
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
                    <Grid size={{ xs: 12, md: 3 }} m={0}>
                      <SAETextField
                        label="Cupo Maximo"
                        type="number"
                        fullWidth
                        value={dialogData.cupo_maximo}
                        onChange={(e) =>
                          handleDialogChange("cupo_maximo", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} m={0}>
                      <SAETextField
                        label="Nombre Curso"
                        value={dialogData.nombre_curso}
                        onChange={(e) =>
                          handleDialogChange("nombre_curso", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }} m={0}>
                      <SAETextField
                        label="Nombre del Docente"
                        value={dialogData.nombre_docente}
                        onChange={(e) =>
                          handleDialogChange("nombre_docente", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} m={0}>
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
                    <Grid size={{ xs: 12, sm: 6 }} m={0}>
                      <SAETextField
                        label="Fecha de Finalizacion"
                        type="date"
                        value={dialogData.fecha_fin}
                        onChange={(e) =>
                          handleDialogChange("fecha_fin", e.target.value)
                        }
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
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
                          dialogData.activo ? "Curso Activo" : "Curso NO activo"
                        }
                      />
                    )}
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
              onClick={handleCursoSave}
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
export default function EmployedHealth() {
  return (
    <HealthUsersProvider>
      <EmployedAdminContent />
    </HealthUsersProvider>
  );
}
