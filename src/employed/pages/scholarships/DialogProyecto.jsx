import { useState } from "react";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import { useScholarships } from "../../context/employedContext";
import { useNotification } from "../../../shared/context/sharedContext";
import { getDialogTitle } from "../../../utils/util";
import { BECAS_STRINGS } from "../../../utils/strings/employed.strings";
import { isEmpty } from "../../../utils/text.utils";

const BS = BECAS_STRINGS.projectDialog;

export default function DialogProyecto() {
  const {
    dialogOpen,
    dialogData,
    dialogType,
    dialogMode,
    dialogSaving,
    handleDataChange,
    closeDialog,
  } = useNotification();
  const { handleSaveProyecto } = useScholarships();
  const [fieldErrors, setFieldErrors] = useState({});

  const open = dialogOpen && dialogType === "proyectos";

  const resetValidation = () => {
    setFieldErrors({});
  };

  const validateField = (field, value) => {
    switch (field) {
      case "nombre_proyecto_investigacion":
        return isEmpty(value) ? BS.validationName : "";
      case "centro_investigacion":
        return isEmpty(value) ? BS.validationResearchCenter : "";
      default:
        return "";
    }
  };

  const handleFieldChange = (field, value) => {
    const previousValue = dialogData[field];
    const emptyEquivalent = isEmpty(previousValue) && isEmpty(value);

    if (previousValue === value || emptyEquivalent) return;

    handleDataChange(field, value);
    setFieldErrors((previous) => ({
      ...previous,
      [field]: validateField(field, value),
    }));
  };

  const validate = () => {
    const fields = ["nombre_proyecto_investigacion", "centro_investigacion"];
    const errors = fields.reduce((result, field) => {
      const message = validateField(field, dialogData[field]);
      return message ? { ...result, [field]: message } : result;
    }, {});

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    resetValidation();
    handleSaveProyecto();
  };

  const handleClose = () => {
    resetValidation();
    closeDialog();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" fontWeight="bold">
          {getDialogTitle(BS.entityTitle, dialogMode)}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            {dialogMode === "edit" && (
              <Grid size={{ xs: 12, md: 6 }} m={0}>
                <SAETextField
                  label={BS.fieldId}
                  value={dialogData.id ?? ""}
                  disabled
                  fullWidth
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: 6 }} m={0}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(dialogData.activo)}
                    onChange={(event) =>
                      handleDataChange("activo", event.target.checked)
                    }
                    color="primary"
                  />
                }
                label={BS.fieldActive}
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={BS.fieldName}
                value={dialogData.nombre_proyecto_investigacion ?? ""}
                onChange={(event) =>
                  handleFieldChange(
                    "nombre_proyecto_investigacion",
                    event.target.value,
                  )
                }
                error={Boolean(fieldErrors.nombre_proyecto_investigacion)}
                helperText={fieldErrors.nombre_proyecto_investigacion ?? ""}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }} m={0}>
              <SAETextField
                label={BS.fieldResearchCenter}
                value={dialogData.centro_investigacion ?? ""}
                onChange={(event) => {
                  handleFieldChange(
                    "centro_investigacion",
                    event.target.value,
                  );
                }}
                error={Boolean(fieldErrors.centro_investigacion)}
                helperText={fieldErrors.centro_investigacion ?? ""}
                fullWidth
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <SAEButton
          variant="outlined"
          onClick={handleClose}
          disabled={dialogSaving}
        >
          {BS.cancel}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleSave}
          disabled={dialogSaving}
          startIcon={
            dialogSaving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          {dialogSaving ? BS.saving : BS.save}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
