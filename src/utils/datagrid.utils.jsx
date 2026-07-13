import { Box, IconButton, Chip } from "@mui/material";

export const formatHeader = (key = "") =>
  String(key)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const generateRows = (data = [], mapRow = (item) => item) =>
  [...data]
    .sort((a, b) => Number(a?.id ?? 0) - Number(b?.id ?? 0))
    .map((item, index) => ({
      id: item?.id ?? index,
      ...mapRow(item, index),
    }));

export const generateRows2 = (data) => {
  return [...data]
    .sort((a, b) => a.id - b.id)
    .map((item, index) => {
      // 1. Creamos un nuevo objeto limpiando los nulos
      const cleanedItem = {};

      for (const key in item) {
        const value = item[key];
        // Controla null, undefined o strings vacíos (quitando espacios)
        if (
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "")
        ) {
          cleanedItem[key] = "-";
        } else {
          cleanedItem[key] = value;
        }
      }

      // 2. Retornamos el objeto con su ID correspondiente
      return {
        ...cleanedItem,
        id: item.id || index,
      };
    });
};
const SHORT_COLUMNS = [
  "contador",
  "estado",
  "cupo",
  "duracion",
  "horario_inicio",
  "horario_fin",
];

export const generateColumns = (
  data,
  actionsConfig = [],
  columnConfig = {},
) => {
  const sample = Array.isArray(data) ? data[0] : data;

  if (!sample) return [];

  const columns = Object.keys(sample).map((key) => {
    // Nota: Se asume que data es un array, por eso data[0] para las keys
    const isId = key.toLowerCase().includes("id");
    const isShort = SHORT_COLUMNS.includes(key.toLowerCase());

    const customColumnConfig = columnConfig[key] || {};

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
        ...customColumnConfig,
      };
    } else if (key.toLowerCase() === "seguro") {
      return {
        field: "seguro",
        headerName: "Seguro",
        align: "center",
        headerAlign: "center",
        width: 100,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value ? "Tiene" : "Falta"}
            color={params.value ? "success" : "default"}
          />
        ),
        ...customColumnConfig,
      };
    } else {
      return {
        field: key,
        headerName: formatHeader(key),
        flex: isId ? 0.4 : 1,
        minWidth: isId || isShort ? 50 : 120,
        maxWidth: isId ? 70 : isShort ? 100 : NaN,
        align: isId || isShort ? "center" : "left",
        headerAlign: isId || isShort ? "center" : "left",
        ...customColumnConfig,
      };
    }
  });

  if (actionsConfig !== null && actionsConfig.length > 0) {
    columns.push({
      field: "actions",
      headerName: "Acciones",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      minWidth: 60 * actionsConfig.length,
      maxWidth: 65 * actionsConfig.length,
      renderCell: (params) => (
        <Box sx={{ display: "block", textAlign: "center" }}>
          {actionsConfig.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <IconButton
                key={index}
                size="small"
                color={action.color || "primary"}
                title={action.title}
                onClick={() => action.onClick(params.row)}
              >
                <IconComponent fontSize="small" />
              </IconButton>
            );
          })}
        </Box>
      ),
    });
  }

  return columns;
};

const PRIORIDAD_CONFIG = {
  0: { label: "Normal", color: "default" },
  1: { label: "Media", color: "warning" },
  2: { label: "Alta", color: "error" },
};

export function prioridadChip(prioridad) {
  const config = PRIORIDAD_CONFIG[Number(prioridad)] ?? PRIORIDAD_CONFIG[0];

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant={config.color === "default" ? "outlined" : "filled"}
    />
  );
}

export function booleanChip(value) {
  const isTrue = Boolean(value);

  return (
    <Chip
      label={isTrue ? "Verdadero" : "Falso"}
      color={isTrue ? "success" : "default"}
      size="small"
      variant={isTrue ? "filled" : "outlined"}
    />
  );
}
