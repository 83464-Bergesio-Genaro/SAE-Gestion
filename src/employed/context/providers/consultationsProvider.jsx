import React, { useState, useCallback, useEffect, useMemo } from "react";
import { ConsultationContext } from "../employedContext";
import {
  CrearLinkFrecuentes,
  EliminarLinkFrecuentes,
  BuscarLinkFrecuentes,
  ContarVisualizacionLinkFrecuente,
} from "../../../api/EmpleadoService";
import { Box, IconButton, Chip, Tooltip, Typography } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  LINK_FRECUENTE_ICONS,
  getLinkFrecuenteIconByIndex,
} from "../../../shared/pages/consultations/linkFrecuentesIcons";

const EMPTY_LINKFRECUENTE = {
  id: 0,
  titulo: "",
  id_index_ico: "",
  hipervinculo: "",
  contador_clicks: 0,
};

const formatHeader = (key) =>
  key.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

const buildColumns = (
  data,
  editAction = null,
  deleteAction = null,
  registAction = null,
  copyAction = null,
) => {
  if (!data || data.length === 0) return [];

  const columns = Object.keys(data).map((key) => {
    const isId = key.toLowerCase().startsWith("id");
    const isShort = [
      "estado",
      "cupo",
      "duracion",
      "horario_inicio",
      "horario_fin",
    ].includes(key.toLowerCase());

    if (key.toLowerCase() === "id_index_ico") {
      return {
        field: key,
        headerName: "Icono",
        align: "center",
        headerAlign: "center",
        width: 90,
        renderCell: (params) => {
          const iconOption = getLinkFrecuenteIconByIndex(params.value);
          const Icon = iconOption.icon;

          return (
            <Box
              title={iconOption.label}
              sx={{
                alignItems: "center",
                display: "flex",
                height: "100%",
                justifyContent: "center",
              }}
            >
              <Icon color="primary" fontSize="small" />
            </Box>
          );
        },
      };
    }

    if (key.toLowerCase() === "hipervinculo") {
      return {
        field: key,
        headerName: "Hipervinculo",
        flex: 1.4,
        minWidth: 260,
        renderCell: (params) => (
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              gap: 0.5,
              height: "100%",
              minWidth: 0,
              width: "100%",
            }}
          >
            <Tooltip title="Copiar hipervinculo">
              <IconButton
                size="small"
                color="primary"
                onClick={(event) => {
                  event.stopPropagation();
                  copyAction?.(params.value);
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography
              component={params.value ? "a" : "span"}
              href={params.value || undefined}
              target={params.value ? "_blank" : undefined}
              rel={params.value ? "noopener noreferrer" : undefined}
              title={params.value ? "Abrir hipervinculo" : undefined}
              onClick={(event) => event.stopPropagation()}
              sx={{
                bgcolor: "transparent",
                color: "primary.main",
                cursor: params.value ? "pointer" : "default",
                flex: 1,
                font: "inherit",
                minWidth: 0,
                overflow: "hidden",
                p: 0,
                textAlign: "left",
                textDecoration: "underline",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {params.value || "Sin hipervinculo"}
            </Typography>
          </Box>
        ),
      };
    }

    if (key.toLowerCase() === "activo") {
      return {
        field: "activo",
        headerName: "Estado",
        align: "center",
        headerAlign: "center",
        width: 100,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value ? "Activo" : "Inactivo"}
            color={params.value ? "success" : "default"}
          />
        ),
      };
    } else {
      return {
        field: key,
        headerName: formatHeader(key),
        flex: isId ? 0.3 : 1,
        minWidth: isId || isShort ? 50 : 120,
        maxWidth: isId ? 70 : isShort ? 100 : NaN,
        align: isId || isShort ? "center" : "left",
        headerAlign: isId || isShort ? "center" : "left",
      };
    }
  });
  //Puseah la columna de acciones si alguna de estas acciones existe.
  if (editAction || deleteAction || registAction) {
    columns.push({
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <Box>
          {editAction && (
            <IconButton
              size="small"
              color="primary"
              title="Ver / Editar"
              onClick={() => editAction(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {deleteAction && (
            <IconButton
              size="small"
              color="primary"
              title="Eliminar"
              onClick={() => deleteAction(params.row)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
          {registAction && (
            <IconButton
              size="small"
              color="primary"
              title="Registrar Falta"
              onClick={() => registAction(params.row)}
            >
              <EditNoteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    });
  }
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

export const ConsultationProvider = ({ children }) => {
  // Estados globales de Diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [dialogType, setDialogType] = useState("");
  const [dialogMode, setDialogMode] = useState("");
  const [dialogError, setDialogError] = useState(null);
  const [dialogSaving, setDialogSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Estados de Notificación
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  //Secciones linksFrecuentes
  const [linksFrecuentes, setLinksFrecuentes] = useState([]);
  const [linkFrecuentesActivos, setLinksFrecuentesActivos] = useState([]);
  const [linksFrecuentesRows, setLinksFrecuentesRows] = useState([]);
  const [loadingLinksFrecuentes, setLoadingLinksFrecuentes] = useState(false);

  const fetchLinksFrecuentes = useCallback(async () => {
    setLoadingLinksFrecuentes(true);
    try {
      let data = await BuscarLinkFrecuentes();
      setLinksFrecuentes(data);
      setLinksFrecuentesActivos(data.filter((esp) => esp.activo));
      setLinksFrecuentesRows(generateRows(data));
    } catch {
      setLinksFrecuentesRows([]);
    } finally {
      setLoadingLinksFrecuentes(false);
    }
  }, []);

  useEffect(() => {
    fetchLinksFrecuentes();
  }, [fetchLinksFrecuentes]);

  const openCreatelinksFrecuentes = useCallback(() => {
    setDialogType("linkFrecuentes");
    setDialogMode("create");
    setDialogData(EMPTY_LINKFRECUENTE);
    setDialogError("");
    setTimeout(() => setDialogOpen(true), 0);
  }, []);
  const openEditLinksFrecuentes = useCallback((row) => {
    setDialogData(row);
    setDialogType("linkFrecuentes");
    setDialogMode("edit");
    setDialogError("");
    setDialogOpen(true);
  }, []);

  const openDeleteLinksFrecuentes = useCallback((row) => {
    setDialogData(row);
    setDialogType("linkFrecuentes");
    setDialogMode("delete");
    setDialogError("");
    setDialogOpen(true);
  }, []);

  const handleCopyLinkFrecuente = useCallback(async (hipervinculo) => {
    if (!hipervinculo) {
      setSnackbarMsg("No hay hipervinculo para copiar");
      setSnackbarOpen(true);
      return;
    }

    try {
      await navigator.clipboard.writeText(hipervinculo);
      setSnackbarMsg("Hipervinculo copiado");
    } catch {
      setSnackbarMsg("No se pudo copiar el hipervinculo");
    } finally {
      setSnackbarOpen(true);
    }
  }, []);

  const linksFrecuentesColumns = useMemo(
    () =>
      buildColumns(
        EMPTY_LINKFRECUENTE,
        null,
        openDeleteLinksFrecuentes,
        null,
        handleCopyLinkFrecuente,
      ),
    [handleCopyLinkFrecuente, openDeleteLinksFrecuentes],
  );

  const handleLinksFrecuentesSave = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      const { id } = dialogData;
      let id_nuevo = id === "" ? 0 : id;
      const body = {
        id: id_nuevo,
        titulo: dialogData.titulo,
        id_index_ico: Number(dialogData.id_index_ico) || 0,
        hipervinculo: dialogData.hipervinculo,
        contador_clicks: Number(dialogData.contador_clicks) || 0,
        activo: dialogMode === "create" ? true : dialogData.activo,
      };

      if (dialogMode === "create") {
        await CrearLinkFrecuentes(body);
      } else if (dialogMode === "edit") {
        throw new Error(
          "La modificacion de links frecuentes no esta disponible.",
        );
      }
      setDialogOpen(false);
      setDialogData(EMPTY_LINKFRECUENTE);
      fetchLinksFrecuentes();
      setSnackbarMsg(
        dialogMode === "create"
          ? "Link Frecuente creado!"
          : "Link Frecuente modificada correctamente",
      );
      setSnackbarOpen(true);
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
    } finally {
      setDialogSaving(false);
    }
  };

  const handleLinksFrecuenteDelete = async () => {
    try {
      await EliminarLinkFrecuentes(deleteId ?? dialogData.id);
      setDeleteId(null);
      fetchLinksFrecuentes();
      setConfirmDelete(false);
      setDialogOpen(false);
      setDialogData(EMPTY_LINKFRECUENTE);
    } catch (err) {
      setConfirmDelete(false);
      setDialogError(err.message);
    }
  };

  return (
    <ConsultationContext.Provider
      value={{
        // ABM Link Frecuentes
        linksFrecuentes,
        linkFrecuentesActivos,
        linksFrecuentesRows,
        linksFrecuentesColumns,
        loadingLinksFrecuentes,
        openCreatelinksFrecuentes,
        openEditLinksFrecuentes,
        handleLinksFrecuentesSave,
        handleLinksFrecuenteDelete,
        linksFrecuentesIcons: LINK_FRECUENTE_ICONS,

        confirmDelete,
        //Valores
        snackbarOpen,
        setSnackbarOpen,
        snackbarMsg,
        setDialogError,
        dialogOpen,
        setDialogOpen,
        dialogData,
        setDialogData,
        dialogType,
        dialogMode,
        dialogError,
        dialogSaving,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};
