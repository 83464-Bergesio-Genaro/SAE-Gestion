import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Delete, FileUpload } from "@mui/icons-material";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import {
  getDocumentDisplayName,
  getDocumentPreviewId,
} from "./scholarship.utils";
import { SCHOLARSHIP_STRINGS } from "./scholarship.string";

const C = SCHOLARSHIP_STRINGS;

// Card reutilizable para documentos de becas. No sabe como se guarda ni como se
// borra: solo recibe callbacks para delegar esas acciones al contenedor.
export default function ScholarshipDocumentCard({
  documento,
  onFileChange,
  onDelete,
  onPreview,
  uploadDisabled = false,
  deleteDisabled = false,
  showRequirement = false,
  showActions = true,
  notUploadedLabel = C.docStateNotUploaded,
  uploadedLabel = C.docStataUplodaded,
}) {
  const previewId = getDocumentPreviewId(documento);
  const displayName = getDocumentDisplayName(documento);
  const description =
    documento.descripcion || C.docAllowedFormats(documento.extension);

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        width: "100%",
        maxWidth: 357,
        minWidth: 0,
        flexDirection: "column",
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
        border: "1px solid rgba(17, 53, 101, 0.08)",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
        display: "flex",
        "&:hover": {
          backgroundColor: "#f1f5fb",
          borderColor: "rgba(17, 53, 101, 0.2)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,
          width: "100%",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack sx={{ flexGrow: 1, gap: 1.25 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.25 }}
          >
            <Chip
              variant={!documento.subido ? "filled" : "outlined"}
              label={!documento.subido ? notUploadedLabel : uploadedLabel}
              color={!documento.subido ? "grey" : "success"}
            />
            {showRequirement && (
              <Chip
                variant={!documento.required ? "outlined" : "filled"}
                label={documento.required ? C.docRequired : C.docOptional}
                color={documento.required ? "error" : "warning"}
              />
            )}
          </Stack>
          <Typography variant="h6">
            <strong>{documento.nombre}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>

          {/* Si existe id de archivo permite previsualizar; si no, muestra estado vacio. */}
          {previewId ? (
            <SAEButton
              onClick={() => onPreview?.(previewId, displayName)}
              sx={{
                minWidth: 0,
                justifyContent: "flex-start",
                mt: 0.5,
                width: "100%",
              }}
            >
              {displayName.length > 35
                ? `${displayName.slice(0, 35)}...`
                : displayName}
            </SAEButton>
          ) : (
            <Box
              sx={{
                mt: 0.5,
                px: 1.75,
                py: 0.9,
                minHeight: 36,
                width: "100%",
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <Typography variant="body2" noWrap>
                {displayName || C.docWithoutFile}
              </Typography>
            </Box>
          )}

          {showActions && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                alignItems: "center",
                flexWrap: "wrap",
                mt: "auto",
                pt: 1.5,
              }}
            >
              <IconButton
                component="label"
                size="small"
                color="primary"
                disabled={uploadDisabled}
              >
                <FileUpload />
                <input
                  type="file"
                  hidden
                  accept={documento.extension}
                  onChange={(event) => onFileChange?.(event, documento)}
                />
              </IconButton>

              <IconButton
                size="small"
                color="error"
                disabled={deleteDisabled}
                onClick={() => onDelete?.(documento)}
              >
                <Delete />
              </IconButton>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
