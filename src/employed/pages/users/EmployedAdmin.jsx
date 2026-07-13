import React, { useMemo } from "react";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

import {
  Autocomplete,
  Box,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  TextField,
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
import ScheduleIcon from "@mui/icons-material/Schedule";

import CloseIcon from "@mui/icons-material/Close";

import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEPage from "../../../shared/components/page/SAEPage";

import GestionarHorariosDialog from "./horariosDialog";

import { EmployedCalendar } from "./employedCalendar";
import { useEmploy } from "../../context/employedContext";
import { AdminUsersProvider } from "../../context/providers/employProvider";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import SAEDataGrid from "../../../shared/components/dataGrid/SAEDataGrid";
import { useNotification } from "../../../shared/context/sharedContext";
// 1. ESTE SUBCOMPONENTE SÍ PUEDE USAR EL HOOK (Porque está abajo del Provider)
function EmployedAdminContent() {
  const {
    empleadosRows,
    empleadosColumns,
    loadingEmpleados,
    openCreateEmpleados,
    usuariosRows,
    usuariosColumns,
    loadingUsuarios,
    openCreateUsuarios,
    dialogType,
    horariosDialogOpen,
    setHorariosDialogOpen,
  } = useEmploy();

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

  return (
    <SAEPage>
      <HeaderPageEmployed
        header="Módulo de Empleados"
        title="Gestión de Empleados y sus Horarios"
        description="Permite cargar empleados, modificar sus permisos y sus horarios"
      />

      <SAEDataGrid sectionConfig={sectionConfig} />
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
      <EmployedCalendar />

      {/*Esto abre un dialog para cargar, modificar o eliminar los datos del tipo seleccionado. Yo lo separo asi porque es mas comodo visualmente */}
      {dialogType === "empleados" && <EmpleadosDialog />}
      {dialogType === "usuarios" && <UsuariosDialog />}
      <GestionarHorariosDialog open={horariosDialogOpen} />
    </SAEPage>
  );
}

function EmpleadosDialog() {
  const { perfiles, handleEmpleadosSave } = useEmploy();
  const {
    dialogOpen,
    dialogData,
    dialogMode,
    dialogError,
    dialogSaving,
    setDialogError,
    handleDataChange,
    closeDialog,
  } = useNotification();

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {dialogMode === "create" ? "Nuevo Empleado" : "Editar Empleado"}
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

          {dialogMode === "edit" && (
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, md: 3 }} m={0}>
                <SAETextField
                  label="ID"
                  type="number"
                  fullWidth
                  value={dialogData.id}
                  onChange={(e) => handleDataChange("id", e.target.value)}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 9 }} m={0}>
                <SAETextField
                  label="Nombre Completo"
                  value={dialogData.nombre_empleado}
                  disabled
                  onChange={(e) =>
                    handleDataChange("nombre_empleado", e.target.value)
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
                    ATENCION
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Al crear un nuevo empleado debe escribirse sin errores su
                    legajo, ya que esta sera la unica forma que pueda acceder a
                    la aplicacion. Debe contener @utn.frc.edu.ar al final.
                    <br />
                    <br />
                    Desde esta pestaña solo se podran crear perfiles de
                    empleados, comedor, salud y administrador.
                  </Typography>
                </CardContent>
              </Card>

              <SAETextField
                label="Nombres"
                value={dialogData.nombres}
                onChange={(e) => handleDataChange("nombres", e.target.value)}
                fullWidth
              />
              <SAETextField
                label="Apellidos"
                value={dialogData.apellidos}
                onChange={(e) => handleDataChange("apellidos", e.target.value)}
                fullWidth
              />
              <SAETextField
                label="Nombre de Usuario"
                value={dialogData.nombre_usuario}
                onChange={(e) =>
                  handleDataChange("nombre_usuario", e.target.value)
                }
                fullWidth
              />
            </>
          )}

          <SAETextField
            label="Legajo"
            value={dialogData.legajo}
            disabled={dialogMode !== "create"}
            onChange={(e) => handleDataChange("legajo", e.target.value)}
            fullWidth
          />

          <Autocomplete
            disablePortal
            options={perfiles}
            getOptionLabel={(option) => option.nombre}
            onChange={(_event, newValue) => {
              handleDataChange("id_perfil", newValue ? newValue.id : null);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={
              perfiles.find((perfil) => perfil.id === dialogData.id_perfil) ||
              null
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Perfil"
                inputProps={{
                  ...params.inputProps,
                  readOnly: true,
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
                    handleDataChange("activo", e.target.checked)
                  }
                  color="primary"
                />
              }
              label={dialogData.activo ? "Usuario Activo" : "Usuario NO Activo"}
            />
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
          onClick={handleEmpleadosSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {dialogMode === "create" ? "Crear" : "Guardar"}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}

function UsuariosDialog() {
  const { carreras, handleUsuariosSave } = useEmploy();
  const {
    dialogOpen,
    dialogData,
    dialogMode,
    dialogError,
    dialogSaving,
    setDialogError,
    handleDataChange,
    closeDialog,
  } = useNotification();

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {dialogMode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
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

          {dialogMode === "edit" && (
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, md: 3 }} m={0}>
                <SAETextField
                  label="ID"
                  type="number"
                  fullWidth
                  value={dialogData.id}
                  onChange={(e) => handleDataChange("id", e.target.value)}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 9 }} m={0}>
                <SAETextField
                  label="Nombre Completo"
                  value={dialogData.nombre_usuario}
                  disabled
                  onChange={(e) =>
                    handleDataChange("nombre_usuario", e.target.value)
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
                    ATENCION
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Al crear el usuario desde esta pestaña se crea como
                    estudiante, con id_perfil = 1. El legajo debe estar completo
                    e incluir @utn.frc.edu.ar al final.
                  </Typography>
                </CardContent>
              </Card>

              <SAETextField
                label="Nombres"
                value={dialogData.nombres}
                onChange={(e) => handleDataChange("nombres", e.target.value)}
                fullWidth
              />
              <SAETextField
                label="Apellidos"
                value={dialogData.apellidos}
                onChange={(e) => handleDataChange("apellidos", e.target.value)}
                fullWidth
              />
              <Autocomplete
                disablePortal
                options={carreras}
                getOptionLabel={(option) => option.nombre}
                onChange={(_event, newValue) => {
                  handleDataChange(
                    "id_carrera",
                    newValue ? newValue.id : null,
                  );
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={
                  carreras.find(
                    (carrera) => carrera.id === dialogData.id_carrera,
                  ) || null
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Carrera"
                    inputProps={{
                      ...params.inputProps,
                      readOnly: true,
                    }}
                  />
                )}
              />
            </>
          )}

          <SAETextField
            label="Legajo"
            value={dialogData.legajo}
            disabled={dialogMode !== "create"}
            onChange={(e) => handleDataChange("legajo", e.target.value)}
            fullWidth
          />

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
              label={dialogData.activo ? "Desactivar Usuario" : "Activar Usuario"}
            />
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
          onClick={handleUsuariosSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {dialogMode === "create" ? "Crear" : "Guardar"}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}

export default function EmployedAdmin() {
  return (
    <AdminUsersProvider>
      <EmployedAdminContent />
    </AdminUsersProvider>
  );
}
