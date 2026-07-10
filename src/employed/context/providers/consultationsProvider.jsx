import React, { useState, useCallback, useEffect, useMemo } from "react";
import { ConsultationContext } from "../employedContext";
import {
  CrearLinkFrecuentes,
  EliminarLinkFrecuentes,
  BuscarLinkFrecuentes,
} from "../../../api/EmpleadoService";
import { Box, IconButton, Chip, Tooltip, Typography } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  LINK_FRECUENTE_ICONS,
  getLinkFrecuenteIconByIndex,
} from "../../../shared/pages/consultations/linkFrecuentesIcons";
import { useNotification } from "../../../shared/context/sharedContext";

import {
  formatHeader,
  generateRows,
} from "../../../utils/util.jsx";
import { isValidHyperlink } from "../../../utils/juan/util.js";

const EMPTY_LINKFRECUENTE = {
  id: 0,
  titulo: "",
  id_index_ico: "",
  hipervinculo: "",
  contador_clicks: 0,
};

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
                color: "var(--primary)",
              }}
            >
              <Icon fontSize="small" />
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
              color: "var(--primary)",
            }}
          >
            <Tooltip title="Copiar hipervinculo">
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  copyAction?.(params.value);
                }}
                sx={{ color: "var(--primary)" }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography
              variant="subtitle3"
              component={params.value ? "a" : "span"}
              href={params.value || undefined}
              target={params.value ? "_blank" : undefined}
              rel={params.value ? "noopener noreferrer" : undefined}
              title={params.value ? "Abrir hipervinculo" : undefined}
              onClick={(event) => event.stopPropagation()}
              sx={{
                bgcolor: "transparent",
                color: "var(--primary)",
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
              sx={{ color: "var(--primary)" }}
              title="Eliminar"
              onClick={() => deleteAction(params.row)}
            >
              <DeleteIcon fontSize="small" />
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

export const ConsultationProvider = ({ children }) => {
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

  // Estados globales de Diálogo

  const [deleteId, setDeleteId] = useState(null);

  //Secciones linksFrecuentes
  const [linksFrecuentesRows, setLinksFrecuentesRows] = useState([]);
  const [loadingLinksFrecuentes, setLoadingLinksFrecuentes] = useState(false);

  const fetchLinksFrecuentes = useCallback(async () => {
    setLoadingLinksFrecuentes(true);
    try {
      let data = await BuscarLinkFrecuentes();
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
  }, [setDialogData, setDialogError, setDialogMode, setDialogOpen, setDialogType]);

  const openDeleteLinksFrecuentes = useCallback((row) => {
    setDialogData(row);
    setDialogType("linkFrecuentes");
    setDialogMode("delete");
    setDialogError("");
    setDialogOpen(true);
  }, [setDialogData, setDialogError, setDialogMode, setDialogOpen, setDialogType]);

  const handleCopyLinkFrecuente = useCallback(async (hipervinculo) => {
    if (!hipervinculo) {
      showNotification("No hay hipervinculo para copiar", "warning", 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(hipervinculo);
      showNotification("Hipervinculo copiado", "success", 2000);
    } catch {
      showNotification("No se pudo copiar el hipervinculo", "error", 2000);
    } finally {
      // setSnackbarOpen(true);
    }
  }, [showNotification]);

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
      if (!isValidHyperlink(dialogData.hipervinculo)) {
        throw new Error("Ingresa un hipervinculo valido con http:// o https://");
      }

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
      showNotification(
        dialogMode === "create"
          ? "Link Frecuente creado!"
          : "Link Frecuente modificado correctamente","success"
      );
    } catch (err) {
      setDialogError(err.message || "Ocurrió un error al guardar");
      showNotification("Ocurrió un error al guardar", "error", 2000);
    } finally {
      setDialogSaving(false);
    }
  };

  const handleLinksFrecuenteDelete = async () => {
    setDialogSaving(true);
    setDialogError("");
    try {
      await EliminarLinkFrecuentes(deleteId ?? dialogData.id);
      setDeleteId(null);
      fetchLinksFrecuentes();
      setDialogOpen(false);
      setDialogData(EMPTY_LINKFRECUENTE);
      showNotification("Link Frecuente eliminado correctamente", "warning");
    } catch (err) {
      setDialogError(err.message);
    } finally {
      setDialogSaving(false);
    }
  };

  return (
    <ConsultationContext.Provider
      value={{
        // ABM Link Frecuentes
        linksFrecuentesRows,
        linksFrecuentesColumns,
        loadingLinksFrecuentes,
        openCreatelinksFrecuentes,
        handleLinksFrecuentesSave,
        handleLinksFrecuenteDelete,
        linksFrecuentesIcons: LINK_FRECUENTE_ICONS,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};
