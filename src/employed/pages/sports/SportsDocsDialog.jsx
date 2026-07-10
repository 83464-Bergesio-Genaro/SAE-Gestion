import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import { useSports } from "../../context/employedContext";

export default function SportsDocsDialog() {
  const {
    docsDialogOpen,
    setDocsDialogOpen,
    docsLegajo,
    docsList,
    loadingDocs,
    docsError,
    downloadingDocId,
    previewOpen,
    setPreviewOpen,
    previewTitle,
    previewSrc,
    previewIsPdf,
    loadingPreview,
    previewError,
    previewDocRef,
    handlePreviewDoc,
    handleDownloadDoc,
  } = useSports();

  return (
    <>
      <DocumentPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={previewTitle}
        imageSrc={previewSrc}
        isPdf={previewIsPdf}
        loading={loadingPreview}
        error={previewError}
        onDownload={() =>
          previewDocRef &&
          handleDownloadDoc(
            previewDocRef.id,
            previewDocRef.nombre_documento,
            previewDocRef.extension,
          )
        }
      />

      <Dialog
        open={docsDialogOpen}
        onClose={() => setDocsDialogOpen(false)}
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
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            Documentacion - legajo {docsLegajo}
          </Typography>
          <IconButton onClick={() => setDocsDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loadingDocs && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {!loadingDocs && docsError && (
            <Alert severity="error">{docsError}</Alert>
          )}
          {!loadingDocs && !docsError && docsList.length === 0 && (
            <Typography
              color="text.secondary"
              sx={{ py: 2, textAlign: "center" }}
            >
              No hay documentacion disponible para este alumno.
            </Typography>
          )}
          {!loadingDocs && !docsError && docsList.length > 0 && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              {docsList.map((doc) => (
                <Box
                  key={doc.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {doc.nombre_documento}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.extension?.toUpperCase()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      title="Visualizar"
                      onClick={() => handlePreviewDoc(doc)}
                      sx={{ color: "var(--primary)" }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Descargar"
                      onClick={() =>
                        handleDownloadDoc(
                          doc.id,
                          doc.nombre_documento,
                          doc.extension,
                        )
                      }
                      disabled={downloadingDocId === doc.id}
                      sx={{ color: "var(--primary)" }}
                    >
                      {downloadingDocId === doc.id ? (
                        <CircularProgress size={18} />
                      ) : (
                        <DownloadIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton
            variant="outlined"
            onClick={() => setDocsDialogOpen(false)}
          >
            Cerrar
          </SAEButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
