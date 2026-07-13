import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton, Link } from "@mui/material";
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

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

import { generateRows,generateColumns } from "../../../utils/datagrid.utils.jsx";
import { formatTime, toApiDateTime } from "../../../utils/date.utils.js";

import { useNotification } from "../../../shared/context/sharedContext";
import { JPAContext } from "../employedContext";
import { EMPTY_EVENTO_PUBLICO, EMPTY_INTERESADOS, EMPTY_STANDS } from "../../../utils/common/common.config.js";
 
export function JPAProvider({ children }) {
  const {
    showNotification,
    openDialog,
    closeDialog,
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
    openDialog("eventoPublico","create",EMPTY_EVENTO_PUBLICO);
  };
  const openEditEventoPublico = useCallback((row) => {
    openDialog("eventoPublico","edit",row);
  }, [openDialog]);
  const openDeleteEvento = useCallback((row) => {
    openDialog("eventoPublico","delete",row);
  }, [openDialog]);

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
        showNotification("Se elimino el evento correctamente","success");
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
        fecha_evento: toApiDateTime(dialogData.fecha_evento),
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
      closeDialog();
      await fetchEventosPublicos();
      showNotification(
        dialogMode === "create"
          ? "Evento creado!"
          : dialogMode === "edit"
            ? "Evento modificado correctamente"
            : "Se elimino el evento correctamente","success"
      );
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
      showNotification("Ocurrió un error al guardar", "error", 2000);
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
        showNotification("Se elimino el evento correctamente","success");
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
            : "Se elimino el evento correctamente","success"
      );
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
      showNotification("Ocurrió un error al guardar", "error", 2000);
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
        "success"
      );
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
      showNotification("Ocurrió un error al guardar", "error", 2000);
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
        "success"
      );
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
      showNotification("Ocurrió un error al guardar", "error", 2000);
    } finally {
      setDialogSaving(false);
    }
  };
  {
    /*Fin Seccion Interesados */
  }

  {
    /*COLUMNAS */
  }

  //Eventos//
  const handleEditEventoPublico = useCallback((row) => {
      openEditEventoPublico(row);
  }, [openEditEventoPublico]);

  const handleDeleteEvento = useCallback((row) => {
      openDeleteEvento(row);
  }, [openDeleteEvento]);

  const eventsActions = useMemo(() => [{
      icon: EditIcon,
      color: "primary",
      title: "Editar Evento",
      onClick: handleEditEventoPublico, 
  },{
      icon: DeleteIcon,
      color: "primary",
      title: "Eliminar Evento",
      onClick: handleDeleteEvento, 
  }
  ], [handleEditEventoPublico,handleDeleteEvento]);

  const eventosPublicosColumns = useMemo(() => {
    return generateColumns(EMPTY_EVENTO_PUBLICO,eventsActions);
  }, [eventsActions]);

  //EVENTOS SAE
    const handleEditEventoSAE = useCallback((row) => {
      openEditEventoSAE(row);
  }, [openEditEventoSAE]);

  const handleDeleteEventoSAE = useCallback((row) => {
      openDeleteEventoSAE(row);
  }, [openDeleteEventoSAE]);

  const eventsSAEActions = useMemo(() => [{
      icon: EditIcon,
      color: "primary",
      title: "Editar Evento",
      onClick: handleEditEventoSAE, 
  },{
      icon: DeleteIcon,
      color: "primary",
      title: "Eliminar Evento",
      onClick: handleDeleteEventoSAE, 
  }
  ], [handleEditEventoSAE,handleDeleteEventoSAE]);

  const eventosSAEColumns = useMemo(() => {
    return generateColumns(EMPTY_EVENTO_PUBLICO,eventsSAEActions);
  }, [eventsSAEActions]);

  // STANDS
  const handleEditStands = useCallback((row) => {
      openEditStands(row);
  }, [openEditStands]);

  const handleDeleteStands = useCallback((row) => {
      openDeleteStands(row);
  }, [openDeleteStands]);

  const standActions = useMemo(() => [{
      icon: EditIcon,
      color: "primary",
      title: "Editar Stands",
      onClick: handleEditStands, 
  },{
      icon: DeleteIcon,
      color: "primary",
      title: "Eliminar Stands",
      onClick: handleDeleteStands, 
  }
  ], [handleEditStands,handleDeleteStands]);

  const standsColumns = useMemo(() => {
    return generateColumns(EMPTY_STANDS,standActions);
  }, [standActions]); 

  //INTERESADOS
  const handleEditInteresados = useCallback((row) => {
      openEditInteresados(row);
  }, [openEditInteresados]);

  const handleDeleteInteresados = useCallback((row) => {
      openDeleteInteresados(row);
  }, [openDeleteInteresados]);

  const interesadosActions = useMemo(() => [{
      icon: EditIcon,
      color: "primary",
      title: "Editar Stands",
      onClick: handleEditInteresados, 
  },{
      icon: DeleteIcon,
      color: "primary",
      title: "Eliminar Stands",
      onClick: handleDeleteInteresados, 
  }
  ], [handleEditInteresados,handleDeleteInteresados]);

  const interesadosColumns = useMemo(() => {
    return generateColumns(EMPTY_INTERESADOS,interesadosActions);
  }, [interesadosActions]); 


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
