import { useState, useEffect, useCallback, useMemo } from "react";
import { JPAContext } from "../employedContext";
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
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  formatHeader,
  generateRows,
  formatTime,
} from "../../../utils/util.jsx";
import { useNotification } from "../../../shared/context/sharedContext";

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
          sx={{ color: "var(--primary)" }}
          title="Ver / Editar"
          onClick={() => editAction(params.row)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: "var(--primary)" }}
          title="Eliminar"
          onClick={() => deleteAction(params.row)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    ),
  });

  return columns;
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
export function JPAProvider({ children }) {
  const {
    showNotification,
    dialogData,
    dialogMode,
    setDialogOpen,
    setDialogData,
    setDialogType,
    setDialogMode,
    setDialogError,
    setDialogSaving,
  } = useNotification();

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
      if (dialogMode === "delete") {
        await eliminarEvento(dialogData.id);
        setDialogOpen(false);
        setDialogData(EMPTY_EVENTO_PUBLICO);
        await fetchEventosPublicos();
        showNotification("Se elimino el evento correctamente");
        return;
      }

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
      } else {
        await modificarEvento(dialogData.id, body);
      }
      setDialogOpen(false);
      setDialogData(EMPTY_EVENTO_PUBLICO);
      await fetchEventosPublicos();
      showNotification(
        dialogMode === "create"
          ? "Evento creado!"
          : dialogMode === "edit"
            ? "Evento modificado correctamente"
            : "Se elimino el evento correctamente",
      );
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
  const [eventosSAE, setEventosSAE] = useState(null);
  const [eventosSAERows, setEventosSAERows] = useState([]);
  const [loadingEventosSAE, setLoadingEventosSAE] = useState(true);
  const fetchEventosSAE = useCallback(async () => {
    setLoadingEventosSAE(true);
    try {
      const data = await ObtenerEventosSAE();
      setEventosSAE(data);
      setEventosSAERows(generateRows(data));
    } catch {
      setEventosSAERows([]);
      setEventosSAE([]);
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
      if (dialogMode === "delete") {
        await eliminarEvento(dialogData.id);
        setDialogOpen(false);
        setDialogData(EMPTY_EVENTO_PUBLICO);
        await fetchEventosSAE();
        showNotification("Se elimino el evento correctamente");
        return;
      }

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
      } else {
        await modificarEvento(dialogData.id, body);
      }
      setDialogOpen(false);
      setDialogData(EMPTY_EVENTO_PUBLICO);
      await fetchEventosSAE();
      showNotification(
        dialogMode === "create"
          ? "Evento creado!"
          : dialogMode === "edit"
            ? "Evento modificado correctamente"
            : "Se elimino el evento correctamente",
      );
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
      showNotification(
        dialogMode === "create"
          ? "Puesto creado!"
          : dialogMode === "edit"
            ? "Puesto modificado correctamente"
            : "Se elimino el puesto correctamente",
      );
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
      showNotification(
        dialogMode === "create"
          ? "Interesado creado!"
          : dialogMode === "edit"
            ? "Interesado modificado correctamente"
            : "Se elimino el interesado correctamente",
      );
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

  const eventosPublicosColumns = useMemo(
    () =>
      generateColumns(
        EMPTY_EVENTO_PUBLICO,
        openEditEventoPublico,
        openDeleteEvento,
      ),
    [openEditEventoPublico, openDeleteEvento],
  );
  const eventosSAEColumns = useMemo(
    () =>
      generateColumns(
        EMPTY_EVENTO_PUBLICO,
        openEditEventoSAE,
        openDeleteEventoSAE,
      ),
    [openEditEventoSAE, openDeleteEventoSAE],
  );
  const standsColumns = useMemo(
    () => generateColumns(EMPTY_STANDS, openEditStands, openDeleteStands),
    [openEditStands, openDeleteStands],
  );
  const interesadosColumns = useMemo(
    () =>
      generateColumns(
        EMPTY_INTERESADOS,
        openEditInteresados,
        openDeleteInteresados,
      ),
    [openEditInteresados, openDeleteInteresados],
  );

  return (
    <JPAContext.Provider
      value={{
        eventosPublicosRows,
        eventosPublicosColumns,
        loadingEventosPublicos,
        fetchEventosPublicos,
        openCreateEventoPublico,
        openEditEventoPublico,
        openDeleteEvento,
        handleEventoPublicoSave,

        eventosSAE,
        eventosSAERows,
        eventosSAEColumns,
        loadingEventosSAE,
        fetchEventosSAE,
        openCreateEventoSAE,
        openEditEventoSAE,
        openDeleteEventoSAE,
        handleEventoSAESave,

        standsRows,
        standsColumns,
        loadingStands,
        openCreateStands,
        openEditStands,
        openDeleteStands,
        handleStandSave,

        interesadosRows,
        interesadosColumns,
        loadingInteresados,
        openCreateInteresados,
        openEditInteresados,
        openDeleteInteresados,
        handleInteresadoSave,
      }}
    >
      {children}
    </JPAContext.Provider>
  );
}
