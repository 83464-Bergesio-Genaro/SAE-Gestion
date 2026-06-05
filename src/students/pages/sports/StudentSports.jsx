import {
  CardContent,
  Typography,
  Card,
  Container,
  Box,
  Grid,
  Dialog,
  InputAdornment,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";

import DeportesMasonry from "../../components/deportesMasonery";
import JsonArrayDataGrid from "../../../shared/components/jsonArrayDataGrid/jsonArrayDataGrid";

import SearchIcon from "@mui/icons-material/Search";

import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import DocumentCard from "../../../shared/components/documents/DocumentCard";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";

import { SPORTS_STRINGS } from "./sports.strings";

import SportsCalendar from "../../../employed/pages/sports/SportsCalendar";
import { SportsProvider } from "./SportsContext";
import { useSportsContext } from "./useSportsContext";

import HeaderPage from "../../components/headerPage";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";

const C = SPORTS_STRINGS;

function StudentSportsContent() {
  const {
    busquedaTorneos,
    closeDeleteDialog,
    closePreview,
    closeSnackbar,
    documentoAEliminar,
    documentos,
    handleArchivoChange,
    handleDelete,
    handleInscribirClick,
    handlePreview,
    horariosDeportista,
    loadingDocuments,
    loadingSports,
    loadingTournaments,
    openPopup,
    preview,
    requestDeleteDocument,
    rowsTorneosFiltradas,
    setBusquedaTorneos,
    snackbar,
    subscribedSportIds,
    torneoDeportista,
    torneosColumns,
  } = useSportsContext();

  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "114px", md: "130px" },
        pb: 8,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
        <HeaderPage
          title={C.bigTitle}
          description={C.bigSubtitle}
          backgroundImage="images/carrousel/EntradaUTN.jpg"
          icon={<SportsHandballIcon />}
        />

        <Box sx={{ mt: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            {C.documentationTitle}
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            {C.documentationSubtitle}
          </Typography>
        </Box>
        {loadingDocuments ? (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <SAESpinner size="S" />
          </Stack>
        ) : (
          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            {documentos.map((item) => (
              <Grid
                key={item.id_tipo_documento ?? item.nombre}
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <DocumentCard
                  documento={item}
                  onPreview={handlePreview}
                  onFileChange={handleArchivoChange}
                  onDelete={requestDeleteDocument}
                  uploadDisabled={item.subido}
                  deleteDisabled={!item.subido}
                  notUploadedLabel={C.docStateNotUploaded}
                  uploadedLabel={C.docStataUplodaded}
                  showRequirement
                />
              </Grid>
            ))}
          </Grid>
        )}
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            {C.sportsTitle}
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            {C.sportsSubTitle}
          </Typography>
        </Box>
        {loadingSports ? (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <SAESpinner size="S" />
          </Stack>
        ) : horariosDeportista.length > 0 ? (
          <Card
            sx={{
              overflow: "hidden",
              borderRadius: 6,
              boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
            }}
          >
            <DeportesMasonry
              deportes={horariosDeportista}
              onInscribirClick={handleInscribirClick}
            />
          </Card>
        ) : null}
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            {C.tournamnetsTitle}
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            {C.tournamnetsSubTitle}
          </Typography>
        </Box>
        {loadingTournaments ? (
          <Stack alignItems="center" sx={{ py: 5 }}>
            <SAESpinner size="S" />
          </Stack>
        ) : torneoDeportista.length > 0 ? (
          <Card
            sx={{
              borderRadius: 6,
              boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 2.5,
                background: "linear-gradient(135deg, #1a3a5c 0%, #2d6da3 100%)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                justifyContent="flex-end"
                alignItems={{ sm: "center" }}
              >
                <SAETextField
                  placeholder="Buscar torneo..."
                  size="small"
                  value={busquedaTorneos}
                  onChange={(e) => setBusquedaTorneos(e.target.value)}
                  sx={{
                    width: { xs: "100%", sm: 260, md: 340 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "white",
                      color: "black",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.6)" },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgb(59, 101, 218)",
                      },
                    },
                    "& input::placeholder": {
                      color: "rgba(54, 54, 54, 0.7)",
                      opacity: 1,
                    },
                    "& .MuiInputAdornment-root svg": {
                      color: "rgba(0, 0, 0, 0.7)",
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
              </Stack>
            </Box>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ width: "100%" }}>
                <DataGrid
                  rows={rowsTorneosFiltradas}
                  columns={torneosColumns}
                  autoHeight
                  disableRowSelectionOnClick
                  pageSizeOptions={[5, 10, 25]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  localeText={{ noRowsLabel: "No hay torneos activos" }}
                  sx={{
                    minWidth: 850,
                    "& .MuiDataGrid-columnHeaderTitle": {
                      whiteSpace: "normal",
                      lineHeight: "1.2",
                      fontWeight: "bold",
                    },
                    borderRadius: 4,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ) : null}
        {!loadingSports && horariosDeportista.length > 0 && (
          <>
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "#123666" }}
              >
                {C.horariosTitle}
              </Typography>
              <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
                {C.horariosSubTitle}
              </Typography>
            </Box>
            <SportsCalendar subscribedSportIds={subscribedSportIds} />
          </>
        )}

        {/*Dialog para Borrar Documento*/}
        <Dialog open={openPopup} onClose={closeDeleteDialog}>
          <DialogTitle>{C.deleteDocTitle}</DialogTitle>

          <DialogContent>
            <DialogContentText>
              {C.deleteDocMessage(documentoAEliminar?.archivoNombre)}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <SAEButton
              onClick={() => handleDelete(documentoAEliminar)}
              autoFocus
            >
              {C.deleteDocButton}
            </SAEButton>
          </DialogActions>
        </Dialog>

        <DocumentPreviewDialog
          open={preview.open}
          onClose={closePreview}
          title={preview.title}
          imageSrc={preview.imageSrc}
          isPdf={preview.isPdf}
          loading={preview.loading}
          error={preview.error}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={closeSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default function StudentSports() {
  return (
    <SportsProvider>
      <StudentSportsContent />
    </SportsProvider>
  );
}
