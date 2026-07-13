import { useCallback, useState, useMemo } from "react";
import {
  Autocomplete,
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  InputAdornment,
  CircularProgress,
  FormControlLabel,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Stack,
  Chip,
  Divider,
  Grid,
  Snackbar,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAETimeField from "../../../assets/components/inputs/SAETimeField";
import SAEPage from "../../../assets/components/page/SAEPage";
import HeaderPageEmployed from "../../../assets/components/headerPage/headerPageEmployed"; 
import SAEDataGrid from "../../../assets/components/datagrid/SAEDataGrid";

import { HealthUsersProvider } from "../../context/providers/healthProvider";
import { useNotification } from "../../../shared/context/sharedContext";
import { useHealth } from "../../context/employedContext";
import { formatDate } from "../../../utils/date.utils";
const PALETTE = [
  "#a0a0a0", //Pendiente
  "#1538B8", //Asignado
  "#d85656", //Cancelado
  "#a8cfff", //En curso
  "#6FA958", //Finalizado
  "#FF8E2C", //Reprogramado
];

const CAREERS = [
  { value: "sistemas", label: "Sistemas" },
  { value: "electrica", label: "Eléctrica" },
  { value: "electronica", label: "Electrónica" },
  { value: "mecanica", label: "Mecánica" },
  { value: "metalurgica", label: "Metalúrgica" },
  { value: "quimica", label: "Química" },
  { value: "industrial", label: "Industrial" },
  { value: "civil", label: "Civil" },
  { value: "frc", label: "FRC" },
];

export function TurnGrid() {
  const {
    //Visualizacion de Turnos No Activos
    loadingNoActivos,
    noActivosRows,
    noActivosColumns,

    pendienteTurnos,
    asignadoTurnos,
    enCursoTurnos,
    reprogramadoTurnos,
    loadingTurnos,
    openCreateTurnos,
    openEditTurnos,
    handleTurnosSave,
    setUsuarioSelected,
    usuarioSelected,
    loadingUsuario,
    fetchUsuariosXlegajo,
    openShowNoActivos,
    // Personal y estados
    personal,
    estadosTurno,
    //Fundamentales para el funcionamiento de los Dialog
    snackbarOpen,
    setSnackbarOpen,
    snackbarMsg,
  } = useHealth();

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

  const [careerSearch, setCareerSearch] = useState("");
  const [inactiveTurnsType, setInactiveTurnsType] = useState(null);

  const inactiveTurnsConfig = useMemo(
    () => ({
      inactiveTurns: {
        key: "inactiveTurns",
        title:
          inactiveTurnsType === "cancelados"
            ? "Turnos Cancelados"
            : "Turnos Finalizados",
        icon: CalendarMonthIcon,
        rows: noActivosRows,
        columns: noActivosColumns,
        loading: loadingNoActivos,
      },
    }),
    [inactiveTurnsType, loadingNoActivos, noActivosColumns, noActivosRows],
  );

  const handleShowInactiveTurns = (type) => {
    if (inactiveTurnsType === type) {
      setInactiveTurnsType(null);
      return;
    }

    setInactiveTurnsType(type);
    openShowNoActivos(type);
  };

  const dialogStatus = Number(dialogData?.id_estado_turno ?? 0);
  const dialogStatusColor = PALETTE[dialogStatus] ?? PALETTE[0];
  const dialogStatusTextColor = [3, 4, 5].includes(dialogStatus)
    ? "#14325c"
    : "white";

  const handlePatientSearch = () => {
    const studentId = String(dialogData.legajo ?? "")
      .trim()
      .split("@")[0];

    if (!studentId) {
      setDialogError("Ingresá un legajo para buscar");
      return;
    }
    if (!careerSearch) {
      setDialogError("Seleccioná una carrera para buscar");
      return;
    }

    setDialogError("");
    fetchUsuariosXlegajo(`${studentId}@${careerSearch}.frc.utn.edu.ar`);
  };

  return (
    <>
      <SAEPage>
        <HeaderPageEmployed
          header="Modulo de Salud"
          title="Turnero"
          backTo="/Gestion-Salud"
        />

        {loadingTurnos && (
          <Stack alignItems="center" gap={1}>
            <SAESpinner size="L" />
          </Stack>
        )}
        {!loadingTurnos && (
          <>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
                overflow: "hidden",
                mt: 1,
                mb: 2,
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
                    {/* <DashboardIcon sx={{ fontSize: 32 }} /> */}
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        Creacion de Turnos
                      </Typography>
                    </Box>
                  </Stack>
                  <SAEButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openCreateTurnos}
                    sx={{
                      whiteSpace: "nowrap",
                      bgcolor: "rgba(255,255,255,0.18)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.4)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                    }}
                  >
                    Crear Turno
                  </SAEButton>
                </Stack>
              </Box>
            </Card>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }} m={0}>
                <TurnList
                  listadoTurnos={pendienteTurnos}
                  estadoActual={0}
                  editAction={openEditTurnos}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} m={0}>
                <TurnList
                  listadoTurnos={reprogramadoTurnos}
                  estadoActual={5}
                  editAction={openEditTurnos}
                />
              </Grid>
            </Grid>

            <TurnList
              listadoTurnos={asignadoTurnos}
              estadoActual={1}
              editAction={openEditTurnos}
            />
            <TurnList
              listadoTurnos={enCursoTurnos}
              estadoActual={3}
              editAction={openEditTurnos}
            />
            <Grid container spacing={1}>
              <Grid size={{ xs: 6 }} m={0}>
                <TurnList
                  listadoTurnos={[]}
                  estadoActual={4}
                  onShowInactive={handleShowInactiveTurns}
                  inactiveTurnsType={inactiveTurnsType}
                />
              </Grid>
              <Grid size={{ xs: 6 }} m={0}>
                <TurnList
                  listadoTurnos={[]}
                  estadoActual={2}
                  onShowInactive={handleShowInactiveTurns}
                  inactiveTurnsType={inactiveTurnsType}
                />
              </Grid>
            </Grid>

            {inactiveTurnsType && (
              <Box sx={{ mt: 3 }}>
                <SAEDataGrid
                  sectionConfig={inactiveTurnsConfig}
                  currentSection="inactiveTurns"
                />
              </Box>
            )}
          </>
        )}

        {dialogOpen && dialogType === "turnos" && (
          <Dialog
            open={dialogOpen}
            onClose={closeDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: dialogStatusColor,
                color: dialogStatusTextColor,
                transition: "background-color 0.2s ease",
              }}
            >
              <Typography
                variant="h6"
                component="span"
                sx={{ fontWeight: "bold" }}
              >
                {dialogMode === "create" ? "Nuevo Turno" : "Editar Turno"}
              </Typography>
              <IconButton onClick={closeDialog} size="small" color="inherit">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2.5} sx={{ pt: 1.5 }}>
                {dialogError && (
                  <Alert severity="error" onClose={() => setDialogError("")}>
                    {dialogError}
                  </Alert>
                )}
                <>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip label="Solicitante" size="small" />
                      </Divider>
                    </Grid>
                    {dialogMode === "create" && (
                      <Grid size={{ xs: 12 }} m={0}>
                        {/* CASO A: No hay usuario seleccionado -> Mostramos el buscador */}
                        {!usuarioSelected ? (
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                            alignItems={{ sm: "flex-start" }}
                            sx={{ mb: 1 }}
                          >
                            <SAETextField
                              label="Legajo"
                              value={dialogData.legajo}
                              onChange={(e) =>
                                handleDataChange("legajo", e.target.value)
                              }
                              fullWidth
                              disabled={loadingUsuario}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handlePatientSearch();
                              }}
                            />
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontWeight: 700,
                                lineHeight: { sm: "56px" },
                              }}
                            >
                              @
                            </Typography>
                            <Autocomplete
                              options={CAREERS}
                              value={
                                CAREERS.find(
                                  (career) => career.value === careerSearch,
                                ) ?? null
                              }
                              onChange={(_event, career) =>
                                setCareerSearch(career?.value ?? "")
                              }
                              getOptionLabel={(career) => career.label}
                              isOptionEqualToValue={(option, value) =>
                                option.value === value.value
                              }
                              disabled={loadingUsuario}
                              fullWidth
                              renderInput={(params) => (
                                <SAETextField {...params} label="Carrera" />
                              )}
                            />
                            <Stack
                              direction="row"
                              alignItems="center"
                              sx={{ minHeight: 56 }}
                            >
                              <Typography
                                color="text.secondary"
                                fontWeight={700}
                                whiteSpace="nowrap"
                              >
                                .frc.utn.edu.ar
                              </Typography>
                              {loadingUsuario ? (
                                <CircularProgress size={24} sx={{ ml: 1 }} />
                              ) : (
                                <IconButton
                                  onClick={handlePatientSearch}
                                  aria-label="Buscar paciente"
                                >
                                  <SearchIcon />
                                </IconButton>
                              )}
                            </Stack>
                          </Stack>
                        ) : (
                          /* CASO B: Usuario encontrado -> Mostramos resultado y opción de limpiar */
                          <Box
                            sx={{
                              p: 2,
                              border: "1px solid #ccc",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              Usuario Seleccionado:
                            </Typography>
                            {/* Reemplazá esto con los campos reales de tu objeto "usuarioSelected" */}
                            <Typography variant="body1">
                              {usuarioSelected.nombre_usuario}
                            </Typography>

                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={() => setUsuarioSelected(null)} // Resetea para permitir volver a buscar
                              sx={{ mt: 2 }}
                            >
                              Volver a buscar
                            </Button>
                          </Box>
                        )}
                      </Grid>
                    )}
                    {dialogMode === "edit" && (
                      <>
                        <Grid size={{ xs: 12, md: 3 }} m={0}>
                          <SAETextField
                            label="ID Turno"
                            type="number"
                            fullWidth
                            value={dialogData.id}
                            onChange={(e) =>
                              handleDataChange("id", e.target.value)
                            }
                            disabled={true}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 9 }} m={0}>
                          <SAETextField
                            label="Paciente"
                            value={dialogData.paciente}
                            onChange={(e) =>
                              handleDataChange("paciente", e.target.value)
                            }
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }} m={0}>
                          <SAETextField
                            label="Legajo Estudiante"
                            value={dialogData.legajo}
                            onChange={(e) =>
                              handleDataChange("legajo", e.target.value)
                            }
                            fullWidth
                            disabled={true}
                          />
                        </Grid>
                      </>
                    )}
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip label="Especialista" size="small" />
                      </Divider>
                    </Grid>
                    <Grid size={{ xs: 12 }} m={0}>
                      <Autocomplete
                        disablePortal
                        options={personal}
                        getOptionLabel={(option) =>
                          option.apellido + ", " + option.nombre
                        }
                        onChange={(event, newValue) => {
                          // 'newValue' es el objeto completo del perfil seleccionado (o null)
                          if (newValue) {
                            handleDataChange("cuil_medico", newValue.cuil);
                          } else {
                            // Maneja el caso de que se borre la selección
                            handleDataChange("cuil_medico", null);
                          }
                        }}
                        // Asegura que la comparación se haga por id
                        isOptionEqualToValue={(option, value) =>
                          option.cuil === value.cuil_medico
                        }
                        value={
                          personal?.find(
                            (especialidad) =>
                              especialidad.cuil === dialogData?.cuil_medico,
                          ) ?? null
                        } // Pasa el objeto completo
                        renderInput={(params) => (
                          <SAETextField
                            {...params}
                            label="Especialistas"
                            inputProps={{
                              ...params.inputProps,
                              readOnly: true, // Esto evita la escritura
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip label="Fecha y horario" size="small" />
                      </Divider>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETextField
                        label="Fecha de Atencion"
                        type="date"
                        value={dialogData.fecha_atencion}
                        onChange={(e) =>
                          handleDataChange("fecha_atencion", e.target.value)
                        }
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETimeField
                        label="Hora de atención"
                        value={
                          dialogData?.hora_atencion?.split?.("hs")?.[0] || ""
                        }
                        onChange={(value) =>
                          handleDataChange("hora_atencion", value)
                        }
                        minTime="00:00"
                        maxTime="23:59"
                        size="big"
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip label="Asunto" size="small" />
                      </Divider>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <SAETextField
                        label="Asunto"
                        value={dialogData.asunto}
                        onChange={(e) =>
                          handleDataChange("asunto", e.target.value)
                        }
                        multiline
                        fullWidth
                        rows={4} // Número inicial de filas
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Divider textAlign="center">
                        <Chip label="Estado" size="small" />
                      </Divider>
                    </Grid>
                    <Grid size={{ xs: 12 }} m={0}>
                      <Autocomplete
                        disablePortal
                        options={estadosTurno}
                        getOptionLabel={(option) => option.estado_turno}
                        onChange={(event, newValue) => {
                          // 'newValue' es el objeto completo del perfil seleccionado (o null)
                          if (newValue) {
                            handleDataChange(
                              "id_estado_turno",
                              newValue.id_estado_turno,
                            );
                          } else {
                            // Maneja el caso de que se borre la selección
                            handleDataChange("id_estado_turno", null);
                          }
                        }}
                        // Asegura que la comparación se haga por id
                        isOptionEqualToValue={(option, value) =>
                          option.id_estado_turno === value.id_estado_turno
                        }
                        value={
                          estadosTurno?.find(
                            (estado) =>
                              estado.id_estado_turno ===
                              dialogData?.id_estado_turno,
                          ) ?? null
                        }
                        renderInput={(params) => (
                          <SAETextField
                            {...params}
                            label="Estados"
                            inputProps={{
                              ...params.inputProps,
                              readOnly: true, // Esto evita la escritura
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <SAEButton
                variant="outlined"
                onClick={closeDialog}
                disabled={dialogSaving}
                startIcon={<CloseIcon />}
              >
                Cancelar
              </SAEButton>
              <SAEButton
                variant="contained"
                onClick={handleTurnosSave}
                disabled={dialogSaving}
                startIcon={
                  dialogSaving ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : dialogMode === "create" ? (
                    <AddIcon />
                  ) : (
                    <SaveOutlinedIcon />
                  )
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
      </SAEPage>
    </>
  );
}

function TurnList({
  listadoTurnos,
  estadoActual,
  editAction,
  onShowInactive,
  inactiveTurnsType,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const { handleTurnosChangeState, loadingTurnos } = useHealth();

  const handleDrop = useCallback(
    async (e, nuevoEstado) => {
      e.preventDefault();
      const idRecuperado = e.dataTransfer.getData("text/plain");

      if (!idRecuperado) return;

      await handleTurnosChangeState(idRecuperado, nuevoEstado);
    },
    [handleTurnosChangeState],
  );
  const inactiveType = estadoActual === 2 ? "cancelados" : "finalizados";
  const isInactiveListOpen = inactiveTurnsType === inactiveType;

  return (
    <>
      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          setIsDragOver(false);
          handleDrop(e, estadoActual);
        }}
        sx={{
          borderRadius: 4,
          boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
          overflow: "hidden",
          mt: 3,
          border: isDragOver ? "2px dashed #1976d2" : "2px solid lightGray",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            background: PALETTE[estadoActual],
            color: "white",
            minHeight: 50,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            transition: "all .2s ease",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <AccessTimeIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5">
                  {(() => {
                    switch (estadoActual) {
                      case 0:
                        return "Pendiente";
                      case 1:
                        return "Asignado";
                      case 2:
                        return "Cancelados";
                      case 3:
                        return "En Curso";
                      case 4:
                        return "Terminado";
                      case 5:
                        return "Reprogramar";
                      default:
                        return "Pendiente";
                    }
                  })()}
                </Typography>
              </Box>
            </Stack>
            {
              /*Estados cancelados y finalizados */
              (estadoActual === 2 || estadoActual === 4) && (
                <SAEButton
                  variant="contained"
                  startIcon={
                    isInactiveListOpen ? <CloseIcon /> : <VisibilityIcon />
                  }
                  onClick={() => onShowInactive?.(inactiveType)}
                  sx={{
                    whiteSpace: "nowrap",
                    bgcolor: isInactiveListOpen
                      ? "rgba(0,0,0,0.22)"
                      : "rgba(255,255,255,0.92)",
                    color: isInactiveListOpen ? "white" : PALETTE[estadoActual],
                    mt: 2,
                    border: "1px solid rgba(255,255,255,0.65)",
                    "&:hover": {
                      bgcolor: isInactiveListOpen
                        ? "rgba(0,0,0,0.32)"
                        : "white",
                    },
                  }}
                >
                  {isInactiveListOpen ? "Ocultar Turnos" : "Ver Turnos"}
                </SAEButton>
              )
            }
            {estadoActual !== 2 && estadoActual !== 4 && (
              <Chip
                size="large"
                label={`${listadoTurnos?.length ?? 0} ${
                  listadoTurnos?.length === 1 ? "turno" : "turnos"
                }`}
                sx={{
                  bgcolor: "rgba(255,255,255,0.92)",
                  color: PALETTE[estadoActual],
                  fontWeight: 800,
                  minWidth: 112,
                  height: 38,
                  fontSize: "1rem",
                  "& .MuiChip-label": {
                    px: 2,
                  },
                }}
              />
            )}
          </Stack>
        </Box>
        {/*Lo organizo de esta forma para reciclar el componente. */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto", // Permite el scroll horizontal
            //Solo los estados a pendiente y a reprogramar tienen esta altura minima
            minHeight: estadoActual === 0 || estadoActual === 5 ? 250 : "none",
            paddingX: 1,
            whiteSpace: "nowrap",
            // Opcional: Ocultar o estilizar la barra de scroll
            "&::-webkit-scrollbar": { height: "6px" },
            "&::-webkit-scrollbar-thumb": { borderRadius: "4px" },
          }}
        >
          {loadingTurnos && listadoTurnos && (
            <Grid
              width={"100%"}
              container
              alignItems="center"
              justifyContent="center"
            >
              <SAESpinner></SAESpinner>
            </Grid>
          )}
          {!loadingTurnos &&
            listadoTurnos &&
            estadoActual !== 2 &&
            estadoActual !== 4 &&
            //ESTAS SON LAS TARJETAS QUE VES ADENTRO DEL COMPONENTE
            listadoTurnos.map((turno) => (
              <Card
                draggable
                onDragStart={(e) => {
                  // Guardamos el id como texto dentro del evento de arrastre
                  e.dataTransfer.setData("text/plain", turno.id.toString());
                }}
                onDragEnd={(e) => e.dataTransfer.setData("text/plain", null)}
                key={turno.id}
                variant="outlined"
                sx={{
                  minWidth: 260, // Ancho fijo mínimo para mantener consistencia
                  maxWidth: 400,
                  my: 2,
                  cursor: "grab",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <CardActionArea onClick={() => editAction(turno)}>
                  <CardContent sx={{ "&:last-child": { paddingBottom: 2 } }}>
                    {/* Cabecera: Nombre y Estado */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1.5}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        noWrap
                        sx={{ maxWidth: "140px" }}
                      >
                        {formatDate(turno.fecha_solicitud,"short") || "Fecha Solicitud"}
                      </Typography>
                      <Chip
                        label={turno.estado || "Sin Definir"}
                        size="small"
                        sx={{
                          bgcolor: PALETTE[estadoActual],
                          color: "white",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      />
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    {/* Datos Mínimos: Fecha y Hora */}
                    <Stack spacing={1} mt={1.5}>
                      <Typography variant="body2" sx={{ maxWidth: "140px" }}>
                        <strong>{"Solicitante: "}</strong>
                        {turno.paciente || "Error recuperando el nombre"}
                      </Typography>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: "140px" }}
                      >
                        <strong>{"Asunto: "}</strong>
                        {turno.asunto || "Turno sin Asunto"}
                      </Typography>
                      <Typography variant="body2" sx={{ maxWidth: "140px" }}>
                        <strong>{"Atiende: "}</strong>
                        {turno.especialista || "Sin medico asignado"}
                      </Typography>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {turno.fecha_atencion || "Sin Fecha Asignada"}
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" gap={1}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {turno.hora_atencion || "Sin Horario Asignado"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
        </Box>
      </Card>
    </>
  );
}

// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function TurnBoardHealth() {
  return (
    <HealthUsersProvider>
      <TurnGrid />
    </HealthUsersProvider>
  );
}
