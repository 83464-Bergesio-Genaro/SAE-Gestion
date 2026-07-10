import { useMemo, useState } from "react";
import {
  Grid,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import CastleIcon from "@mui/icons-material/Castle";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import SAEButton from "../../../shared/components/buttons/SAEButton";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAETimeField from "../../../shared/components/inputs/SAETimeField";
import { useNotification } from "../../../shared/context/sharedContext";

import { getDialogTitle } from "../../../utils/juan/util";

import { DataGrid } from "@mui/x-data-grid";
import { JPAProvider } from "../../context/providers/jpaProvider";
import { useJPA } from "../../context/employedContext";
import SAEPage from "../../../shared/components/page/SAEPage";
import SAEDataGrid from "../../../shared/components/datagrid/SAEDataGrid";
import SAEDeleteDialog from "../../../shared/components/popUp/SAEDeleteDialog";
import { isValidEmail } from "../../../utils/util.jsx";

function CopyURLButton() {
  const ubicacionesComunes = [
    {
      name: "Auditorio",
      url: "https://www.google.com/maps/place/Auditorio+-+Aula+Magna+UTN/@-31.4423209,-64.1959201,17z/data=!3m1!4b1!4m6!3m5!1s0x9432a370c72ed37b:0x3d4a8a878329ff54!8m2!3d-31.4423209!4d-64.1933452!16s%2Fg%2F11j47q3881!5m1!1e4?entry=ttu&g_ep=EgoyMDI2MDMyMi4wIKXMDSoASAFQAw%3D%3D",
    },
    {
      name: "Aula Magna",
      url: "https://maps.app.goo.gl/DtMW4vCpgXkKTs2o7",
    },
  ];
  const handleCopy = async (url, name) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Ups! Ocurrió que: ", err);
    }
  };

  const [copiedId, setCopied] = useState(null);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "10px",
      }}
    >
      {ubicacionesComunes.map((lugar) => (
        <SAEButton
          key={lugar.name}
          onClick={() => handleCopy(lugar.url, lugar.name)}
          sx={{
            padding: "4px 8px", // Reduce el padding
            fontSize: "0.8rem", // Letra más pequeña
            fontWeight: "bold", // Negrita
          }}
        >
          {copiedId === lugar.name ? "Copiado!" : `${lugar.name}: Copiar link`}
        </SAEButton>
      ))}
    </div>
  );
}
function EmployedJPAContent() {
  const {
    eventosPublicosRows,
    eventosPublicosColumns,
    loadingEventosPublicos,
    openCreateEventoPublico,

    eventosSAERows,
    eventosSAEColumns,
    loadingEventosSAE,
    openCreateEventoSAE,

    standsRows,
    standsColumns,
    loadingStands,
    openCreateStands,

    interesadosRows,
    interesadosColumns,
    loadingInteresados,
    openCreateInteresados,
  } = useJPA();

  const sectionConfig = useMemo(
    () => ({
      eventosPublicos: {
        key: "eventosPublicos",
        title: "Eventos Generales",
        dialog: openCreateEventoPublico,
        addButton: "Nuevo Evento Publico",
        icon: SchoolIcon,
        rows: eventosPublicosRows,
        columns: eventosPublicosColumns,
        loading: loadingEventosPublicos,
      },
      eventosInternos: {
        key: "eventosInternos",
        title: "Eventos Internos",
        dialog: openCreateEventoSAE,
        addButton: "Nuevo Evento SAE",
        icon: CastleIcon,
        rows: eventosSAERows,
        columns: eventosSAEColumns,
        loading: loadingEventosSAE,
      },
      stands: {
        key: "stands",
        title: "Puestos",
        dialog: openCreateStands,
        addButton: "Nuevo Puesto",
        icon: StorefrontIcon,
        rows: standsRows,
        columns: standsColumns,
        loading: loadingStands,
      },
      interesados: {
        key: "interesados",
        title: "Interesados",
        dialog: openCreateInteresados,
        addButton: "Nuevo Interesado",
        icon: GroupsIcon,
        rows: interesadosRows,
        columns: interesadosColumns,
        loading: loadingInteresados,
      },
    }),
    [
      eventosPublicosRows,
      loadingEventosPublicos,
      eventosPublicosColumns,
      openCreateEventoPublico,
      eventosSAERows,
      loadingEventosSAE,
      eventosSAEColumns,
      openCreateEventoSAE,
      standsRows,
      loadingStands,
      standsColumns,
      openCreateStands,
      interesadosRows,
      loadingInteresados,
      interesadosColumns,
      openCreateInteresados,
    ],
  );

  const [activeSection] = "eventosPublicos";

  const currentSection = useMemo(
    () => sectionConfig[activeSection],
    [activeSection, sectionConfig],
  );

  return (
    <SAEPage>
      <HeaderPageEmployed
        header=" Módulo de JPA"
        title="Gestión de la Jornada de Puertas Abiertas"
        description="Administrá los recursos que hacen a la JPA."
      />

      <SAEDataGrid
        sectionConfig={sectionConfig}
        currentSection={currentSection}
      />
      <DialogJpa />
    </SAEPage>
  );
}

function DialogJpa() {
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
    handleEventoPublicoSave,
    handleEventoSAESave,
    handleStandSave,
    handleInteresadoSave,
  } = useJPA();

  // Configuración del diálogo de eliminación según el tipo de entidad seleccionado.
  // Cada clave debe coincidir con el valor guardado en `dialogType`.
  const deleteDialogConfig = {
    eventoPublico: {
      // Nombre de la entidad que se muestra en el título y en el mensaje.
      entityLabel: "Evento",
      // Nombre del registro seleccionado que se mostrará como referencia.
      itemName: dialogData?.nombre_evento,
      // Método que confirma y ejecuta la eliminación del registro.
      onConfirm: handleEventoPublicoSave,
    },
    eventosInternos: {
      entityLabel: "Evento",
      itemName: dialogData?.nombre_evento,
      onConfirm: handleEventoSAESave,
    },
    stands: {
      entityLabel: "Puesto",
      itemName: dialogData?.nombre_stand,
      onConfirm: handleStandSave,
    },
    interesados: {
      entityLabel: "Interesado",
      itemName: dialogData?.nombre_interesado,
      onConfirm: handleInteresadoSave,
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
      {dialogOpen && dialogType === "eventoPublico" && (
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
              {getDialogTitle("Evento Publico", dialogMode)}
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
                  <Typography variant="subtitle2" component="span">
                    Esta seguro que quiere eliminar el evento:
                  </Typography>
                  <Typography variant="h7" component="span">
                    ID:{dialogData.id} <br />
                    Nombre: "{dialogData.nombre_evento}"
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
                    <Grid size={{ xs: 12, md: 9 }} m={0}>
                      <SAETextField
                        label="Encargado"
                        value={dialogData.encargado}
                        onChange={(e) =>
                          handleDataChange("encargado", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <SAETextField
                    label="Nombre del Evento"
                    value={dialogData.nombre_evento}
                    onChange={(e) =>
                      handleDataChange("nombre_evento", e.target.value)
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="URL Maps"
                    value={dialogData.lugar}
                    onChange={(e) => handleDataChange("lugar", e.target.value)}
                    fullWidth
                  />
                  {/* Es la grilla de url que se usan comunmente en nuestra facultad */}
                  <CopyURLButton />

                  <SAETextField
                    label="Fecha del Evento"
                    type="date"
                    value={dialogData.fecha_evento}
                    onChange={(e) =>
                      handleDataChange("fecha_evento", e.target.value)
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETimeField
                        label="Hora inicio"
                        value={
                          dialogData?.horario_inicio?.split?.("hs")?.[0] || ""
                        }
                        onChange={(value) =>
                          handleDataChange("horario_inicio", value)
                        }
                        minTime="08:00"
                        maxTime="24:00"
                        size="big"
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETimeField
                        label="Hora fin"
                        value={
                          dialogData?.horario_fin?.split?.("hs")?.[0] || ""
                        }
                        onChange={(value) =>
                          handleDataChange("horario_fin", value)
                        }
                        minTime="08:00"
                        maxTime="24:00"
                        size="big"
                        fullWidth
                      />
                    </Grid>
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
              startIcon={<CloseIcon />}
            >
              Cancelar
            </SAEButton>
            <SAEButton
              variant="contained"
              onClick={handleEventoPublicoSave}
              disabled={dialogSaving}
              startIcon={
                dialogSaving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : dialogMode === "create" ? (
                  <AddIcon />
                ) : (
                  <EditIcon />
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
      {/*       SECCION EVENTO SAE     */}
      {dialogOpen && dialogType === "eventosInternos" && (
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
              {getDialogTitle("Evento SAE", dialogMode)}
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
                  <Typography variant="subtitle2" component="span">
                    Esta seguro que quiere eliminar el evento:
                  </Typography>
                  <Typography variant="h7" component="span">
                    ID:{dialogData.id} <br />
                    Nombre: "{dialogData.nombre_evento}"
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
                    <Grid size={{ xs: 12, md: 9 }} m={0}>
                      <SAETextField
                        label="Encargado"
                        value={dialogData.encargado}
                        onChange={(e) =>
                          handleDataChange("encargado", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <SAETextField
                    label="Nombre del Evento"
                    value={dialogData.nombre_evento}
                    onChange={(e) =>
                      handleDataChange("nombre_evento", e.target.value)
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="URL Maps"
                    value={dialogData.lugar}
                    onChange={(e) => handleDataChange("lugar", e.target.value)}
                    fullWidth
                  />
                  {/* Es la grilla de url que se usan comunmente en nuestra facultad */}
                  <CopyURLButton />

                  <SAETextField
                    label="Fecha del Evento"
                    type="date"
                    value={dialogData.fecha_evento}
                    onChange={(e) =>
                      handleDataChange("fecha_evento", e.target.value)
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETimeField
                        label="Hora inicio"
                        value={
                          dialogData?.horario_inicio?.split?.("hs")?.[0] || ""
                        }
                        onChange={(value) =>
                          handleDataChange("horario_inicio", value)
                        }
                        minTime="08:00"
                        maxTime="24:00"
                        size="big"
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETimeField
                        label="Hora fin"
                        value={
                          dialogData?.horario_fin?.split?.("hs")?.[0] || ""
                        }
                        onChange={(value) =>
                          handleDataChange("horario_fin", value)
                        }
                        minTime="08:00"
                        maxTime="24:00"
                        size="big"
                        fullWidth
                      />
                    </Grid>
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
              startIcon={<CloseIcon />}
            >
              Cancelar
            </SAEButton>
            <SAEButton
              variant="contained"
              onClick={handleEventoSAESave}
              disabled={dialogSaving}
              startIcon={
                dialogSaving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : dialogMode === "create" ? (
                  <AddIcon />
                ) : (
                  <EditIcon />
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
      {/*       SECCION STANDS        */}
      {dialogOpen && dialogType === "stands" && (
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
              {getDialogTitle("Puesto", dialogMode)}
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
                  <Typography variant="subtitle2" component="span">
                    Esta seguro que quiere eliminar el Puesto:
                  </Typography>
                  <Typography variant="h7" component="span">
                    ID:{dialogData.id} <br />
                    Nombre: "{dialogData.nombre_stand}"
                    {console.log("dialogData", dialogData)}
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
                    <Grid size={{ xs: 12, md: 9 }} m={0}>
                      <SAETextField
                        label="Expositor"
                        value={dialogData.expositor}
                        onChange={(e) =>
                          handleDataChange("expositor", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <SAETextField
                    label="Nombre del Stand"
                    value={dialogData.nombre_stand}
                    onChange={(e) =>
                      handleDataChange("nombre_stand", e.target.value)
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="Lugar en la Facultad"
                    value={dialogData.ubicacion}
                    onChange={(e) =>
                      handleDataChange("ubicacion", e.target.value)
                    }
                    fullWidth
                  />
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETimeField
                        label="Hora inicio"
                        value={
                          dialogData?.horario_inicio?.split?.("hs")?.[0] || ""
                        }
                        onChange={(value) =>
                          handleDataChange("horario_inicio", value)
                        }
                        minTime="08:00"
                        maxTime="24:00"
                        size="big"
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETimeField
                        label="Hora fin"
                        value={
                          dialogData?.horario_fin?.split?.("hs")?.[0] || ""
                        }
                        onChange={(value) =>
                          handleDataChange("horario_fin", value)
                        }
                        minTime="08:00"
                        maxTime="24:00"
                        size="big"
                        fullWidth
                      />
                    </Grid>
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
              startIcon={<CloseIcon />}
            >
              Cancelar
            </SAEButton>
            <SAEButton
              variant="contained"
              onClick={handleStandSave}
              disabled={dialogSaving}
              startIcon={
                dialogSaving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : dialogMode === "create" ? (
                  <AddIcon />
                ) : (
                  <EditIcon />
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
      {/*      SECCION INTERESADOS    */}
      {dialogOpen && dialogType === "interesados" && (
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
              {getDialogTitle("Interesado", dialogMode)}
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
                  <Typography variant="subtitle2" component="span">
                    Esta seguro que quiere eliminar el Interesado:
                  </Typography>
                  <Typography variant="h7" component="span">
                    ID:{dialogData.id} <br />
                    Nombre: "{dialogData.nombre_interesado}"
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
                    <Grid size={{ xs: 12, md: 9 }} m={0}>
                      <SAETextField
                        label="Nombre del Interesado"
                        value={dialogData.nombre_interesado}
                        onChange={(e) =>
                          handleDataChange("nombre_interesado", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <SAETextField
                    label="Contacto Telefonico"
                    value={dialogData.contacto}
                    onChange={(e) =>
                      handleDataChange("contacto", e.target.value)
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="Contacto Electronico"
                    value={dialogData.email}
                    onChange={(e) => handleDataChange("email", e.target.value)}
                    error={Boolean(
                      dialogData.email && !isValidEmail(dialogData.email),
                    )}
                    helperText={
                      dialogData.email && !isValidEmail(dialogData.email)
                        ? "Ingrese un correo electrónico válido"
                        : ""
                    }
                    fullWidth
                  />
                </>
              )}
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
              onClick={handleInteresadoSave}
              disabled={dialogSaving}
              startIcon={
                dialogSaving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : dialogMode === "create" ? (
                  <AddIcon />
                ) : (
                  <EditIcon />
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
    </>
  );
}

export default function EmployedJPA() {
  return (
    <JPAProvider>
      <EmployedJPAContent />
    </JPAProvider>
  );
}
