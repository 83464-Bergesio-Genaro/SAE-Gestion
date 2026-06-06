import { useMemo, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../../shared/auth/AuthContext";
import { DataGrid } from "@mui/x-data-grid";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import HeaderPageEmployed from "../../../shared/components/headerPageEmployed";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import {
  ObtenerEventosPublicos,
  ObtenerEventosSAE,
  modificarEvento,
  crearEvento,
  eliminarEvento,
  ObtenerStands,
  crearStand,
  modificarStand,
  eliminarStand,
  ObtenerInteresados,
  crearInteresado,
  modificarInteresado,
  eliminarInteresado,
} from "../../../api/JPAService";

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

  const [copiedId, setCopied] = useState(null);

  const handleCopy = async (url, name) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Ups! Ocurrió que: ", err);
    }
  };

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
const formatTime = (time) => {
  return time
    ? time.endsWith("hs")
      ? time.replace("hs", ":00")
      : `${time}:00`
    : time;
};
const formatHeader = (key) =>
  key.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

const generateColumns = (data, editAction, deleteAction) => {
  if (!data || data.length === 0) return [];

  const columns = Object.keys(data).map((key) => {
    const isId = key.toLowerCase().includes("id");
    const isShort = [
      "estado",
      "cupo",
      "duracion",
      "horario_inicio",
      "horario_fin",
    ].includes(key.toLowerCase());
    return {
      field: key,
      headerName: formatHeader(key),

      flex: isId ? 0.3 : 1,
      minWidth: isId ? 50 : 150,
      maxWidth: isId ? 70 : isShort ? 100 : NaN,
      align: isId || isShort ? "center" : "left",
      headerAlign: isId || isShort ? "center" : "left",
    };
  });

  // 👉 columna de acciones
  columns.push({
    field: "actions",
    headerName: "Acciones",
    sortable: false,
    filterable: false,
    width: 100,
    renderCell: (params) => (
      <Box>
        <IconButton
          size="small"
          color="primary"
          title="Ver / Editar"
          onClick={() => editAction(params.row)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="primary"
          title="Eliminar"
          onClick={() => deleteAction(params.row)}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  });

  return columns;
};
const generateRows = (data) => {
  return [...data]
    .sort((a, b) => a.id - b.id)
    .map((item, index) => ({
      id: item.id || index,
      ...item,
    }));
};

const EMPTY_EVENTO_PUBLICO = {
  id: "",
  encargado: "",
  nombre_evento: "",
  lugar: "",
  fecha_evento: "",
  horario_inicio: "",
  horario_fin: "",
  duracion: "",
};
const EMPTY_STANDS = {
  id: "",
  nombre_stand: "",
  expositor: "",
  ubicacion: "",
  horario_inicio: "",
  horario_fin: "",
};
const EMPTY_INTERESADOS = {
  id: "",
  nombre_interesado: "",
  contacto: "",
  email: "",
};
export default function EmployedJPA() {
  const secciones = [
    { key: "eventosPublicos", label: "Eventos Publicos" },

    { key: "eventosInternos", label: "Eventos SAE" },
    { key: "stands", label: "Puestos" },
    { key: "interesados", label: "Interesados" },
  ];
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("eventosPublicos");
  const [busquedaGestion, setBusquedaGestion] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  {
    /*Seccion Eventos Publicos */
  }
  const [eventosPublicosRows, setEventosPublicosRows] = useState([]);
  const [loadingEventosPublicos, setLoadingEventosPublicos] = useState(true);
  const fetchEventosPublicos = useCallback(async () => {
    setLoadingEventosPublicos(true);
    try {
      const data = await ObtenerEventosPublicos();
      setEventosPublicosRows(generateRows(data));
    } catch {
      setEventosPublicosRows([]);
    } finally {
      setLoadingEventosPublicos(false);
    }
  }, []);
  const openCreateEventoPublico = () => {
    setDialogData(EMPTY_EVENTO_PUBLICO);
    setDialogType("eventoPublico");
    setDialogMode("create");
    setDialogError("");
    setDialogOpen(true);
  };
  const openEditEventoPublico = useCallback((row) => {
    setDialogData(row);
    setDialogType("eventoPublico");
    setDialogMode("edit");
    setDialogError("");
    setDialogOpen(true);
  }, []);
  const openDeleteEvento = useCallback((row) => {
    setDialogData(row);
    setDialogType("eventoPublico");
    setDialogMode("delete");
    setDialogError("");
    setDialogOpen(true);
  }, []);

  useEffect(() => {
    fetchEventosPublicos();
  }, [fetchEventosPublicos]);

  const handleEventoPublicoSave = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      const { id, duracion, lugar, ...rest } = dialogData;
      dialogData.duracion = duracion; //Me molestaba el error de no uso
      let id_nuevo =
        id === ""
          ? 0
          : id; /* Si esta vacio debemos mandar un valor para que no se rompa el objeto */
      const body = {
        ...rest,
        fecha_evento: dialogData.fecha_evento
          ? `${dialogData.fecha_evento}T00:00:00`
          : new Date(),
        id: id_nuevo,
        ubicacion: lugar,
        horario_inicio: formatTime(dialogData.horario_inicio),
        horario_fin: formatTime(dialogData.horario_fin),
        informacion_interna: false,
      };
      if (dialogMode === "create") {
        await crearEvento(body);
      } else if (dialogMode === "edit") {
        await modificarEvento(dialogData.id, body);
      } else {
        await eliminarEvento(dialogData.id);
      }
      setDialogOpen(false);
      setDialogData(EMPTY_EVENTO_PUBLICO);
      fetchEventosPublicos();
      setSnackbarMsg(
        dialogMode === "create"
          ? "Evento creado!"
          : dialogMode === "edit"
            ? "Evento modificado correctamente"
            : "Se elimino el evento correctamente",
      );
      setSnackbarOpen(true);
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  };
  {
    /*Fin Seccion Eventos Publicos */
  }

  {
    /*Seccion Eventos SAE  */
  }
  const [eventosSAERows, setEventosSAERows] = useState([]);
  const [loadingEventosSAE, setLoadingEventosSAE] = useState(true);
  const fetchEventosSAE = useCallback(async () => {
    setLoadingEventosPublicos(true);
    try {
      const data = await ObtenerEventosSAE();
      setEventosSAERows(generateRows(data));
    } catch {
      setEventosSAERows([]);
    } finally {
      setLoadingEventosSAE(false);
    }
  }, []);
  useEffect(() => {
    fetchEventosSAE();
  }, [fetchEventosSAE]);

  const openCreateEventoSAE = () => {
    setDialogData(EMPTY_EVENTO_PUBLICO);
    setDialogType("eventosInternos");
    setDialogMode("create");
    setDialogError("");
    setDialogOpen(true);
  };
  const openEditEventoSAE = useCallback((row) => {
    setDialogData(row);
    setDialogType("eventosInternos");
    setDialogMode("edit");
    setDialogError("");
    setDialogOpen(true);
  }, []);
  const openDeleteEventoSAE = useCallback((row) => {
    setDialogData(row);
    setDialogType("eventosInternos");
    setDialogMode("delete");
    setDialogError("");
    setDialogOpen(true);
  }, []);

  const handleEventoSAESave = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      const { id, duracion, lugar, ...rest } = dialogData;
      dialogData.duracion = duracion; //Me molestaba el error de no uso
      let id_nuevo =
        id === ""
          ? 0
          : id; /* Si esta vacio debemos mandar un valor para que no se rompa el objeto */
      const body = {
        ...rest,
        fecha_evento: dialogData.fecha_evento
          ? `${dialogData.fecha_evento}T00:00:00`
          : new Date(),
        id: id_nuevo,
        ubicacion: lugar,
        horario_inicio: formatTime(dialogData.horario_inicio),
        horario_fin: formatTime(dialogData.horario_fin),
        informacion_interna: true,
      };
      if (dialogMode === "create") {
        await crearEvento(body);
      } else if (dialogMode === "edit") {
        await modificarEvento(dialogData.id, body);
      } else {
        await eliminarEvento(dialogData.id);
      }
      setDialogOpen(false);
      setDialogData(EMPTY_EVENTO_PUBLICO);
      fetchEventosSAE();
      setSnackbarMsg(
        dialogMode === "create"
          ? "Evento creado!"
          : dialogMode === "edit"
            ? "Evento modificado correctamente"
            : "Se elimino el evento correctamente",
      );
      setSnackbarOpen(true);
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  };

  {
    /*Fin Seccion Eventos SAE */
  }

  {
    /*Seccion Stands  */
  }
  const [standsRows, setStandsRows] = useState([]);
  const [loadingStands, setLoadingStands] = useState(false);
  const fetchStands = useCallback(async () => {
    setLoadingStands(true);
    try {
      const data = await ObtenerStands();
      setStandsRows(generateRows(data));
      //setStandsColumns(generateColumns(data,openEditStands,openDeleteStands));
    } catch {
      setStandsRows([]);
      //setStandsColumns([]);
    } finally {
      setLoadingStands(false);
    }
  }, []);
  useEffect(() => {
    fetchStands();
  }, [fetchStands]);

  const openCreateStands = () => {
    setDialogData(EMPTY_STANDS);
    setDialogType("stands");
    setDialogMode("create");
    setDialogError("");
    setDialogOpen(true);
  };
  const openEditStands = useCallback((row) => {
    setDialogData(row);
    setDialogType("stands");
    setDialogMode("edit");
    setDialogError("");
    setDialogOpen(true);
  }, []);
  const openDeleteStands = useCallback((row) => {
    setDialogData(row);
    setDialogType("stands");
    setDialogMode("delete");
    setDialogError("");
    setDialogOpen(true);
  }, []);

  const handleStandSave = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      const { id, ...rest } = dialogData;
      let id_nuevo =
        id === ""
          ? 0
          : id; /* Si esta vacio debemos mandar un valor para que no se rompa el objeto */
      const body = {
        ...rest,
        id: id_nuevo,
        horario_inicio: formatTime(dialogData.horario_inicio),
        horario_fin: formatTime(dialogData.horario_fin),
      };
      if (dialogMode === "create") {
        await crearStand(body);
      } else if (dialogMode === "edit") {
        await modificarStand(dialogData.id, body);
      } else {
        await eliminarStand(dialogData.id);
      }
      setDialogOpen(false);
      setDialogData(EMPTY_STANDS);
      fetchStands();
      setSnackbarMsg(
        dialogMode === "create"
          ? "Puesto creado!"
          : dialogMode === "edit"
            ? "Puesto modificado correctamente"
            : "Se elimino el puesto correctamente",
      );
      setSnackbarOpen(true);
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  };
  {
    /*Fin Seccion Puestos */
  }

  {
    /*Seccion Interesados  */
  }
  const [interesadosRows, setInteresadosRows] = useState([]);
  const [loadingInteresados, setLoadingInteresados] = useState(false);
  const fetchInteresados = useCallback(async () => {
    setLoadingInteresados(true);
    try {
      const data = await ObtenerInteresados();
      setInteresadosRows(generateRows(data));
    } catch {
      setInteresadosRows([]);
    } finally {
      setLoadingInteresados(false);
    }
  }, []);
  useEffect(() => {
    fetchInteresados();
  }, [fetchInteresados]);

  const openCreateInteresados = () => {
    setDialogType("interesados");
    setDialogMode("create");
    setDialogData({ ...EMPTY_INTERESADOS }); // 👈 copia limpia
    setDialogError("");

    // 👇 asegurar que abre después
    setTimeout(() => {
      setDialogOpen(true);
    }, 0);
  };
  const openEditInteresados = useCallback((row) => {
    setDialogData(row);
    setDialogType("interesados");
    setDialogMode("edit");
    setDialogError("");
    setDialogOpen(true);
  }, []);
  const openDeleteInteresados = useCallback((row) => {
    setDialogData(row);
    setDialogType("interesados");
    setDialogMode("delete");
    setDialogError("");
    setDialogOpen(true);
  }, []);

  const handleInteresadoSave = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      const { id, ...rest } = dialogData;
      let id_nuevo =
        id === ""
          ? 0
          : id; /* Si esta vacio debemos mandar un valor para que no se rompa el objeto */
      const body = {
        ...rest,
        id: id_nuevo,
      };
      if (dialogMode === "create") {
        await crearInteresado(body);
      } else if (dialogMode === "edit") {
        await modificarInteresado(dialogData.id, body);
      } else {
        let res = await eliminarInteresado(dialogData.id);
        console.log("res:", res);
      }
      setDialogOpen(false);
      setDialogData(EMPTY_INTERESADOS);
      fetchInteresados();
      setSnackbarMsg(
        dialogMode === "create"
          ? "Interesado creado!"
          : dialogMode === "edit"
            ? "Interesado modificado correctamente"
            : "Se elimino el interesado correctamente",
      );
      setSnackbarOpen(true);
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  };
  {
    /*Fin Seccion Interesados */
  }

  {
    /*Necesario para cargar los datos en el dialog (ALTA) */
  }
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] =
    useState(
      "",
    ); /* Puede ser "eventoPublico", "eventosInternos", "stands" o "interesados" */
  const [dialogMode, setDialogMode] = useState("create");
  const [dialogData, setDialogData] = useState(EMPTY_EVENTO_PUBLICO);
  const [dialogSaving, setDialogSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");

  {
    /* Van por separado porque se va a realizar una operacion costosa por ende se empaquetan dentro del useMemo*/
  }
  const sectionConfig = useMemo(
    () => ({
      eventosPublicos: {
        title: "Eventos Generales",
        dialog: openCreateEventoPublico,
        addButton: "Nuevo Evento Publico",
        icon: SchoolIcon,
        rows: eventosPublicosRows,
        columns: generateColumns(
          EMPTY_EVENTO_PUBLICO,
          openEditEventoPublico,
          openDeleteEvento,
        ),
        loading: loadingEventosPublicos,
      },
      eventosInternos: {
        title: "Eventos Internos",
        dialog: openCreateEventoSAE,
        addButton: "Nuevo Evento SAE",
        icon: CastleIcon,
        rows: eventosSAERows,
        columns: generateColumns(
          EMPTY_EVENTO_PUBLICO,
          openEditEventoSAE,
          openDeleteEventoSAE,
        ),
        loading: loadingEventosSAE,
      },
      stands: {
        title: "Puestos",
        dialog: openCreateStands,
        addButton: "Nuevo Puesto",
        icon: StorefrontIcon,
        rows: standsRows,
        columns: generateColumns(
          EMPTY_STANDS,
          openEditStands,
          openDeleteStands,
        ),
        loading: loadingStands,
      },
      interesados: {
        title: "Interesados",
        dialog: openCreateInteresados,
        addButton: "Nuevo Interesado",
        icon: GroupsIcon,
        rows: interesadosRows,
        columns: generateColumns(
          EMPTY_INTERESADOS,
          openEditInteresados,
          openDeleteInteresados,
        ),
        loading: loadingInteresados,
      },
    }),
    [
      eventosPublicosRows,
      loadingEventosPublicos,
      openEditEventoPublico,
      openDeleteEvento,
      eventosSAERows,
      loadingEventosSAE,
      openEditEventoSAE,
      openDeleteEventoSAE,
      standsRows,
      loadingStands,
      openEditStands,
      openDeleteStands,
      interesadosRows,
      loadingInteresados,
      openEditInteresados,
      openDeleteInteresados,
    ],
  );

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
          header=" Módulo de JPA"
          title="Gestión de la Jornada de Puertas Abiertas"
          description="Administrá los recursos que hacen a la JPA."
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
                localeText={{ noRowsLabel: "No hay torneos activos" }}
                sx={{ borderRadius: 0, border: "none" }}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
      {/*Esto abre un dialog para cargar, modificar o eliminar los datos del tipo seleccionado. Yo lo separo asi porque es mas comodo visualmente */}
      {dialogOpen && dialogType === "eventoPublico" && (
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
              {dialogMode === "create" ? "Nuevo Evento" : "Editar Evento"}
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
                        onChange={(e) =>
                          handleDialogChange("id", e.target.value)
                        }
                        disabled={true}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }} m={0}>
                      <SAETextField
                        label="Encargado"
                        value={dialogData.encargado}
                        onChange={(e) =>
                          handleDialogChange("encargado", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <SAETextField
                    label="Nombre del Evento"
                    value={dialogData.nombre_evento}
                    onChange={(e) =>
                      handleDialogChange("nombre_evento", e.target.value)
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="URL Maps"
                    value={dialogData.lugar}
                    onChange={(e) =>
                      handleDialogChange("lugar", e.target.value)
                    }
                    fullWidth
                  />
                  {/* Es la grilla de url que se usan comunmente en nuestra facultad */}
                  <CopyURLButton />

                  <SAETextField
                    label="Fecha del Evento"
                    type="date"
                    value={dialogData.fecha_evento}
                    onChange={(e) =>
                      handleDialogChange("fecha_evento", e.target.value)
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETextField
                        label="Hora inicio"
                        type="time"
                        size="small"
                        value={
                          dialogData?.horario_inicio?.split?.("hs")?.[0] || ""
                        }
                        onChange={(e) =>
                          handleDialogChange("horario_inicio", e.target.value)
                        }
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETextField
                        label="Hora Fin"
                        type="time"
                        size="small"
                        value={
                          dialogData?.horario_fin?.split?.("hs")?.[0] || ""
                        }
                        onChange={(e) =>
                          handleDialogChange("horario_fin", e.target.value)
                        }
                        slotProps={{ inputLabel: { shrink: true } }}
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
              onClick={() => setDialogOpen(false)}
              disabled={dialogSaving}
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
      {/*Yo hago por separado para que quede mas ordenado se puede cambiar a futuro 
                SECCION EVENTO SAE
            */}
      {dialogOpen && dialogType === "eventosInternos" && (
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
              {dialogMode === "create" ? "Nuevo Evento" : "Editar Evento"}
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
                        onChange={(e) =>
                          handleDialogChange("id", e.target.value)
                        }
                        disabled={true}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }} m={0}>
                      <SAETextField
                        label="Encargado"
                        value={dialogData.encargado}
                        onChange={(e) =>
                          handleDialogChange("encargado", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <SAETextField
                    label="Nombre del Evento"
                    value={dialogData.nombre_evento}
                    onChange={(e) =>
                      handleDialogChange("nombre_evento", e.target.value)
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="URL Maps"
                    value={dialogData.lugar}
                    onChange={(e) =>
                      handleDialogChange("lugar", e.target.value)
                    }
                    fullWidth
                  />
                  {/* Es la grilla de url que se usan comunmente en nuestra facultad */}
                  <CopyURLButton />

                  <SAETextField
                    label="Fecha del Evento"
                    type="date"
                    value={dialogData.fecha_evento}
                    onChange={(e) =>
                      handleDialogChange("fecha_evento", e.target.value)
                    }
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETextField
                        label="Hora inicio"
                        type="time"
                        size="small"
                        value={
                          dialogData?.horario_inicio?.split?.("hs")?.[0] || ""
                        }
                        onChange={(e) =>
                          handleDialogChange("horario_inicio", e.target.value)
                        }
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETextField
                        label="Hora Fin"
                        type="time"
                        size="small"
                        value={
                          dialogData?.horario_fin?.split?.("hs")?.[0] || ""
                        }
                        onChange={(e) =>
                          handleDialogChange("horario_fin", e.target.value)
                        }
                        slotProps={{ inputLabel: { shrink: true } }}
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
              onClick={() => setDialogOpen(false)}
              disabled={dialogSaving}
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
      {/*       SECCION STANDS        */}
      {dialogOpen && dialogType === "stands" && (
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
              {dialogMode === "create" ? "Nuevo Puesto" : "Editar Puesto"}
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
                    Esta seguro que quiere eliminar el Puesto:
                  </Typography>
                  <Typography variant="h7" component="span">
                    ID:{dialogData.id} <br />
                    Nombre: "{dialogData.nombre_stand}"
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
                    <Grid size={{ xs: 12, md: 9 }} m={0}>
                      <SAETextField
                        label="Expositor"
                        value={dialogData.expositor}
                        onChange={(e) =>
                          handleDialogChange("expositor", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <SAETextField
                    label="Nombre del Stand"
                    value={dialogData.nombre_stand}
                    onChange={(e) =>
                      handleDialogChange("nombre_stand", e.target.value)
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="Lugar en la Facultad"
                    value={dialogData.ubicacion}
                    onChange={(e) =>
                      handleDialogChange("ubicacion", e.target.value)
                    }
                    fullWidth
                  />
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETextField
                        label="Hora inicio"
                        type="time"
                        size="small"
                        value={
                          dialogData?.horario_inicio?.split?.("hs")?.[0] || ""
                        }
                        onChange={(e) =>
                          handleDialogChange("horario_inicio", e.target.value)
                        }
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <SAETextField
                        label="Hora Fin"
                        type="time"
                        size="small"
                        value={
                          dialogData?.horario_fin?.split?.("hs")?.[0] || ""
                        }
                        onChange={(e) =>
                          handleDialogChange("horario_fin", e.target.value)
                        }
                        slotProps={{ inputLabel: { shrink: true } }}
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
              onClick={() => setDialogOpen(false)}
              disabled={dialogSaving}
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
      {/*      SECCION INTERESADOS    */}
      {dialogOpen && dialogType === "interesados" && (
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
                ? "Nuevo Interesado"
                : "Editar Interesado"}
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
                        onChange={(e) =>
                          handleDialogChange("id", e.target.value)
                        }
                        disabled={true}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }} m={0}>
                      <SAETextField
                        label="Nombre del Interesado"
                        value={dialogData.nombre_interesado}
                        onChange={(e) =>
                          handleDialogChange(
                            "nombre_interesado",
                            e.target.value,
                          )
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <SAETextField
                    label="Contacto Telefonico"
                    value={dialogData.contacto}
                    onChange={(e) =>
                      handleDialogChange("contacto", e.target.value)
                    }
                    fullWidth
                  />
                  <SAETextField
                    label="Contacto Electronico"
                    value={dialogData.email}
                    onChange={(e) =>
                      handleDialogChange("email", e.target.value)
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
              onClick={() => setDialogOpen(false)}
              disabled={dialogSaving}
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
