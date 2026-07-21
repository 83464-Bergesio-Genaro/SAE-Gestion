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

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAEPage from "../../../assets/components/page/SAEPage";
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed.jsx";

import GestionarHorariosDialog from "./horariosDialog.jsx";
import { EmployedCalendar } from "./employedCalendar.jsx";

import { useEmploy } from "../../context/employedContext";
import { AdminUsersProvider } from "../../context/providers/employProvider";
import { useNotification } from "../../../shared/context/sharedContext";
import { USER_STRINGS } from "../../../utils/strings/employed.strings";

const C = USER_STRINGS;
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
        header={C.headerTitle}
        title={C.headerMainSubtitle}
        description={C.headerMainDescription}
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
                  {C.scheduleTitle}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {C.scheduleSubtitle}
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
              {C.scheduleButton}
            </SAEButton>
          </Stack>
        </Box>
      </Card>
      <EmployedCalendar />

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
          {dialogMode === "create" ? C.employCreate : C.employUpdate}
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
                  label={C.employID}
                  type="number"
                  fullWidth
                  value={dialogData.id}
                  onChange={(e) => handleDataChange("id", e.target.value)}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 9 }} m={0}>
                <SAETextField
                  label={C.employCompleteName}
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
                    {C.employWarningTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {C.employWarningBody1}
                    <br />
                    <br />
                    {C.employWarningEnd}
                  </Typography>
                </CardContent>
              </Card>

              <SAETextField
                label={C.employNames}
                value={dialogData.nombres}
                onChange={(e) => handleDataChange("nombres", e.target.value)}
                fullWidth
              />
              <SAETextField
                label={C.employLastName}
                value={dialogData.apellidos}
                onChange={(e) => handleDataChange("apellidos", e.target.value)}
                fullWidth
              />
              <SAETextField
                label={C.employUserName}
                value={dialogData.nombre_usuario}
                onChange={(e) =>
                  handleDataChange("nombre_usuario", e.target.value)
                }
                fullWidth
              />
            </>
          )}

          <SAETextField
            label={C.studentID}
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
                label={C.employProfile}
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
              label={dialogData.activo ? C.employActive: C.employNoActive}
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
          {C.cancel}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleEmpleadosSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {dialogMode === "create" ? C.create : C.save}
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
          {dialogMode === "create" ? C.userCreate: C.userUpdate}
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
                  label={C.employID}
                  type="number"
                  fullWidth
                  value={dialogData.id}
                  onChange={(e) => handleDataChange("id", e.target.value)}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 9 }} m={0}>
                <SAETextField
                  label={C.employCompleteName}
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
                    {C.employWarningTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {C.userWarningBody2}
                  </Typography>
                </CardContent>
              </Card>

              <SAETextField
                label={C.employNames}
                value={dialogData.nombres}
                onChange={(e) => handleDataChange("nombres", e.target.value)}
                fullWidth
              />
              <SAETextField
                label={C.employLastName}
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
                    label={C.userDegree}
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
            label={C.studentID}
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
              label={dialogData.activo ? C.employActive: C.employNoActive}
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
          {C.cancel}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleUsuariosSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {dialogMode === "create" ? C.create : C.save}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminEmployed() {
  return (
    <AdminUsersProvider>
      <EmployedAdminContent />
    </AdminUsersProvider>
  );
}
