import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";

export default function DocumentPreviewDialog({
  open,
  onClose,
  title,
  imageSrc,
  isPdf,
  loading,
  error,
  onDownload,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
          <IconButton
            size="small"
            onClick={onDownload}
            disabled={!imageSrc || loading || !!error}
            aria-label="Descargar documento"
            title="Descargar"
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && <Typography color="error">{error}</Typography>}

        {!loading && !error && imageSrc && !isPdf && (
          <Box
            component="img"
            src={imageSrc}
            alt={title}
            sx={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 1, bgcolor: "grey.100" }}
          />
        )}

        {!loading && !error && imageSrc && isPdf && (
          <Box
            component="iframe"
            src={imageSrc}
            title={title}
            sx={{ width: "100%", height: "70vh", border: 0, borderRadius: 1, bgcolor: "grey.100" }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
