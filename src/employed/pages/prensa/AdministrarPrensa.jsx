import {
  Box,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  InputAdornment,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import NuevaPublicacionDialog from "./NuevaPublicacionDialog";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { PRENSA_STRINGS } from "./prensa.strings";

import { usePress } from "../../context/employedContext";
import { PressProvider } from "../../context/providers/pressProvider";
const C = PRENSA_STRINGS;

export default function AdministrarPrensa() {
    return (
        <PressProvider>
            <AdministrarPrensaContent />
        </PressProvider>
    );
}

function AdministrarPrensaContent() {
  const navigate = useNavigate();
  const {filtroEstado,setFiltroEstado,
    busqueda,setBusqueda,
    nueva,rowsFiltradas,columns,loading,
    deleteTarget,setDeleteTarget,
    handleDeleteConfirm,
    snackbar,setSnackbar
  }=usePress();

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={() => navigate("/Gestion-Prensa")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {C.adminTitle}
          </Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)", mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            sx={{
              mb: 2.5,
              width: "100%",
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
            }}
          >
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", flex: 1, minWidth: 0 }}>
              <SAEButton
                variant={filtroEstado === "todos" ? "contained" : "outlined"}
                onClick={() => setFiltroEstado("todos")}
                size="small"
              >
                {C.filterAll}
              </SAEButton>
              <SAEButton
                variant={filtroEstado === "activas" ? "contained" : "outlined"}
                onClick={() => setFiltroEstado("activas")}
                size="small"
                color="success"
              >
                {C.filterActive}
              </SAEButton>
              <SAEButton
                variant={filtroEstado === "vencidas" ? "contained" : "outlined"}
                onClick={() => setFiltroEstado("vencidas")}
                size="small"
                color="error"
              >
                {C.filterExpired}
              </SAEButton>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <SAETextField
                placeholder={C.searchPlaceholder}
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
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <SAEButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={nueva.actions.open}
                size="small"
              >
                {C.newButtonLabel}
              </SAEButton>
            </Stack>
          </Stack>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={rowsFiltradas}
              columns={columns}
              loading={loading}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              autoHeight
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </CardContent>
      </Card>

      <NuevaPublicacionDialog state={nueva.state} actions={nueva.actions} />

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>{C.deleteTitle}</Typography>
          <IconButton onClick={() => setDeleteTarget(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {C.deleteConfirm(deleteTarget?.titulo_publicacion)}
            <strong>{C.deleteConfirmBold(deleteTarget?.titulo_publicacion)}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <SAEButton variant="contained" color="error" onClick={handleDeleteConfirm}>
            {C.deleteButton}
          </SAEButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
