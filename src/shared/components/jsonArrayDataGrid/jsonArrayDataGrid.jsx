import { DataGrid } from "@mui/x-data-grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import MuiPagination from "@mui/material/Pagination";
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}
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

export default function JsonArrayDataGrid({ title, data }) {
  // data: array de objetos JSON
  const campos =
    data.length > 0
      ? Object.keys(data[0]).filter(
          (key) =>
            key.toLowerCase() !== "id" &&
            key.toLowerCase() !== "id_deporte" &&
            key.toLowerCase() !== "cuil_responsable",
        )
      : [];
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
    <Card>
      <CardContent>
        <Typography variant="h2" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Divider sx={{ pb: 2 }} variant="middle" />
        <Box
          sx={{
            width: "100%",
            overflowX: "auto", // Permite scroll horizontal si hay muchas columnas
            minHeight: 300, // Altura mínima para que se vea bien en web
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            autosizeOnMount={true}
            autosizeOptions={autosizeOptions}
            disableColumnFilter
            slots={{ toolbar: CustomToolbar, pagination: CustomPagination }}
            ignoreDiacritics
            disableRowSelectionOnClick
            sx={{
              minWidth: 850, // Para que no se vea apretado en desktop
              "& .MuiDataGrid-columnHeaderTitle": {
                whiteSpace: "normal",
                lineHeight: "1.2",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
