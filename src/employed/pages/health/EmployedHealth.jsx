//FUNCIONES
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HealthUsersProvider } from "../../context/providers/healthProvider";
import { useHealth } from "../../context/employedContext";
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
import SAEDataGrid from "../../../shared/components/datagrid/SAEDataGrid";
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
} from "@mui/material";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import { EmployedCalendar } from "./HealthCalendar";
import GestionarHorariosDialog from "./HorariosDialog";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import { useNotification } from "../../../shared/context/sharedContext";

import SAEPage from "../../../shared/components/page/SAEPage";

function EmployedAdminContent() {
  const navigate = useNavigate();

  const {
    //ABM Faltas
    SetCuilFaltas,
    //ABM Especialidades
    especialidadesRows,
    especialidadesColumns,
    loadingEspecialidades,
    openCreateEspecialidades,
    //ABM de Personal
    personalRows,
    personalColumns,
    loadingPersonal,
    openCreatePersonal,
    //ABM de Cursos
    cursosRows,
    cursosColumns,
    loadingCursos,
    openCreateCurso,
    //Valores de error, mostrar mensajes, etc.
    setHorariosDialogOpen,
    horariosDialogOpen,
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
        loading: loadingEspecialidades,
      },
      personal: {
        title: "Personal Medico",
        dialog: openCreatePersonal,
        addButton: "Alta de Personal",
        icon: PersonAddAltIcon,
        rows: personalRows,
        columns: personalColumns,
        loading: loadingPersonal,
      },
      cursos: {
        title: "Cursos Medicos",
        dialog: openCreateCurso,
        addButton: "Nuevo Curso",
        icon: SchoolIcon,
        rows: cursosRows,
        columns: cursosColumns,
        loading: loadingCursos,
      },
    }),
    [
      especialidadesRows,
      especialidadesColumns,
      loadingEspecialidades,
      openCreateEspecialidades,
      personalRows,
      personalColumns,
      loadingPersonal,
      openCreatePersonal,
      cursosRows,
      cursosColumns,
      loadingCursos,
      openCreateCurso,
    ],
  );
  const activeSection = "especialidades";

  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );

  return (
    <SAEPage>
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
            background: "var(--purpleGradient)",
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

      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={currentSection}
      />

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
            background: "var(--gradient)",
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

      <GestionarHorariosDialog open={horariosDialogOpen} />
      <DialogHealth />
    </SAEPage>
  );
}

function DialogHealth() {
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

  const {
    especialidades,
    especialidadesActivas,
    handleEspecialidadesSave,
    faltasRows,
    faltasColumns,
    loadingFaltas,
    handlePersonalSave,
    handleCursoSave,
  } = useHealth();

  return (
    <>
      {dialogOpen && dialogType === "especialidades" && (
        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
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
              {dialogMode === "create" ? "Nuevo Especialidad" : "Editar Especialidad"}
            </Typography>
            <IconButton onClick={closeDialog} size="small">
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
                      onChange={(e) => handleDataChange("id", e.target.value)}
                      disabled={true}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 9 }} m={0}>
                    <SAETextField
                      label="Nombre Completo"
                      value={dialogData.nombre}
                      onChange={(e) =>
                        handleDataChange("nombre", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} m={0}>
                    <SAETextField
                      label="Descripción"
                      value={dialogData.descripcion}
                      onChange={(e) =>
                        handleDataChange("descripcion", e.target.value)
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
                            handleDataChange("activo", e.target.checked)
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
              onClick={closeDialog}
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
        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
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
            <IconButton onClick={closeDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              {dialogError && (
                <Alert severity="error" onClose={closeDialog}>
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
                            handleDataChange("observacion", e.target.value)
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
                            handleDataChange("fecha_alta", e.target.value)
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
                            handleDataChange("cuil", e.target.value)
                          }
                          disabled={dialogMode === "edit"}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label="Nombre"
                          value={dialogData.nombre}
                          onChange={(e) =>
                            handleDataChange("nombre", e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }} m={0}>
                        <SAETextField
                          label="Apellido"
                          value={dialogData.apellido}
                          onChange={(e) =>
                            handleDataChange("apellido", e.target.value)
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
                              handleDataChange("id_especialidad", newValue.id);
                            } else {
                              // Maneja el caso de que se borre la selección
                              handleDataChange("id_especialidad", null);
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
                                  handleDataChange("activo", e.target.checked)
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
              onClick={closeDialog}
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
        <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
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
            <IconButton onClick={closeDialog} size="small">
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
                        onChange={(e) => handleDataChange("id", e.target.value)}
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
                          handleDataChange("cupo_maximo", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} m={0}>
                      <SAETextField
                        label="Nombre Curso"
                        value={dialogData.nombre_curso}
                        onChange={(e) =>
                          handleDataChange("nombre_curso", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }} m={0}>
                      <SAETextField
                        label="Nombre del Docente"
                        value={dialogData.nombre_docente}
                        onChange={(e) =>
                          handleDataChange("nombre_docente", e.target.value)
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
                          handleDataChange("fecha_inicio", e.target.value)
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
                          handleDataChange("fecha_fin", e.target.value)
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
                              handleDataChange("activo", e.target.checked)
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
              onClick={closeDialog}
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
    </>
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
