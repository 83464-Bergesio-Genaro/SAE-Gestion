import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { InputAdornment } from "@mui/material";
import MuiPagination from "@mui/material/Pagination";
import { Search } from "@mui/icons-material";
import {
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { useState, useMemo } from "react";
import SAETextField from "../../../shared/components/inputs/SAETextField";

function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}
function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}
const autosizeOptions = {
  includeHeaders: true,
  includeOutliers: true,
  expand: true,
};

export default function JsonArrayDataGrid({ data }) {
  const [busqueda, setBusqueda] = useState("");
  const campos = useMemo(() => {
    return data.length > 0
      ? Object.keys(data[0]).filter(
          (key) =>
            key.toLowerCase() !== "id" &&
            key.toLowerCase() !== "id_deporte" &&
            key.toLowerCase() !== "cuil_responsable",
        )
      : [];
  }, [data]);

  const rowsFiltradas = useMemo(() => {
    let filtradas = data;
    const termino = busqueda.toLowerCase().trim();
    if (termino && termino.length > 2) {
      filtradas = filtradas.filter((r) =>
        campos.some((campo) => {
          const valor = r[campo];
          if (valor === null || valor === undefined) return false;
          return String(valor).toLowerCase().includes(termino);
        }),
      );
    }

    return filtradas;
  }, [data, busqueda, campos]);


  // data: array de objetos JSON

  const columns = campos.map((campo) => ({
    field: campo,
    headerName: campo
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    flex: 1,
    sortable: true,
    filterable: false,
    hideable: false,
    disableColumnMenu: true,
  }));

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
        mb: 3,
      }}
    >
      <CardContent>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{
            mb: 2,
            width: "100%",
            justifyContent: "flex-end",
            alignItems: { xs: "stretch", md: "right" },
          }}
        >
          <SAETextField
            placeholder="Buscar..."
            size="small"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 250 },
              "& .MuiOutlinedInput-root": { height: "30px" },
              "& .MuiInputBase-input": { py: 0 },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
        <Box
          sx={{
            width: "100%",
            overflowX: "auto", // Permite scroll horizontal si hay muchas columnas
            minHeight: 200, // Altura mínima para que se vea bien en web
          }}
        >
          <DataGrid
            rows={rowsFiltradas}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            autosizeOnMount={true}
            autosizeOptions={autosizeOptions}
            disableColumnFilter
            slots={{ pagination: CustomPagination }}
            ignoreDiacritics
            disableRowSelectionOnClick
            sx={{
              minWidth: 850, // Para que no se vea apretado en desktop
              "& .MuiDataGrid-columnHeaderTitle": {
                whiteSpace: "normal",
                lineHeight: "1.2",
              },
              borderRadius: 2,
            }}
            getRowId={(row) => row.id}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
