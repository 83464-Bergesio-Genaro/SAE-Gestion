import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Grid,
  IconButton,
  Autocomplete,
  Typography,
  Stack,
} from "@mui/material";
import { Close, AddCircleOutline } from "@mui/icons-material";
import { useMyProfile, useNotification } from "../../../shared/context/sharedContext";

import SAEButton from "../../../assets/components/buttons/SAEButton";
import SAETextField from "../../../assets/components/inputs/SAETextField";
import SAESpinner from "../../../assets/components/spinner/SAESpinner";
import DocumentCard from "../../../assets/components/documents/DocumentCard";

import { SCHOLARSHIP_STRINGS } from "../../../utils/strings/student.strings";
import { PERSONAL_FIELDS } from "../../../utils/common/common.config";
import { SCHOLARSHIP_TYPE,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  DEFAULT_ACCEPTED_EXTENSIONS } from "../../../utils/common/constants";

import { getDocumentKey, hasDocumentFile } from "../../../utils/documents.utils";
import { useScholarships } from "../../context/studentContext";
import { ProfileContextProvider } from "../../../shared/context/providers/profileProvider";

const C = SCHOLARSHIP_STRINGS;

const isEconomicOptionalDocument = (documento) => documento.required === false;

export default function ScholarshipsForm(){
  return (
    <ProfileContextProvider>
      <ScholarshipsContent />
    </ProfileContextProvider>
  );
}

export function ScholarshipsContent() {
  const {
    dialogOpen,
    dialogSaving,
    closeDialog
  } = useNotification();
  const {datosPerfil} = useMyProfile();
  const {
    handleChange,
    handlePreview,
    documentosEconomica,
    handleDocumentoChange,
    formBeca,
    setFormBeca,
    setDocumentoAEliminar,
    proyectosRows,serviciosRows,
    documentosRequeridos,
    setDocumentosRequeridos,
    documentosEconomicaVisibles,
    documentosEconomicosOpcionalesDisponibles,
    handleDocumentoEconomicoDelete,
    documentoEconomicoOpcionalId, setDocumentoEconomicoOpcionalId,
    handleAgregarDocumentoEconomico,
    uploadingDocumentoId,
    setDocumentosEconomica,
    handleDialogSave
    
  } = useScholarships(); //Esto en teoria lo llamamos desde dentro del provider de becas

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          {C.cardSolicitarTitle}
        </Typography>
        <IconButton onClick={closeDialog} size="small" disabled={dialogSaving}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "16px !important",
        }}
      >
        {dialogSaving && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              bgcolor: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(2px)",
            }}
          >
            <SAESpinner size="S" />
            <Typography variant="body2" color="text.secondary">
              {C.savingRequest}
            </Typography>
          </Box>
        )}

        <Divider variant="middle" sx={{ mt: 0.5 }}>
          <Chip
            label={C.DatosPersonales}
            size="small"
            sx={{ fontWeight: 700 }}
          />
        </Divider>

        <Grid container spacing={2}>
          {PERSONAL_FIELDS.map((field) => (
            <Grid key={field.name} size={{ xs: 12, sm: 6, md: field.md ?? 6 }}>
              <SAETextField
                fullWidth
                label={field.label}
                name={field.name}
                disabled
                type={field.type}
                InputLabelProps={field.InputLabelProps}
                value={datosPerfil[field.name] ?? ""}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "rgba(0, 0, 0, 0.75)",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Divider variant="middle" sx={{ mt: 0.5 }}>
          <Chip label={C.TiposBecas} size="small" sx={{ fontWeight: 700 }} />
        </Divider>

        <Autocomplete
          fullWidth
          disabled={dialogSaving}
          options={C.listaTiposBecas}
          value={
            C.listaTiposBecas.find(
              (beca) => beca.nombre === formBeca?.tipoBeca,
            ) ?? null
          }
          getOptionLabel={(option) => option.nombre ?? ""}
          isOptionEqualToValue={(option, value) =>
            option.nombre === value.nombre
          }
          onChange={(_, value) =>
            setFormBeca((prev) => ({
              ...prev,
              tipoBeca: value?.nombre ?? "",
              beca: null,
            }))
          }
          renderInput={(params) => (
            <SAETextField {...params} label={C.tipoBecaLabel} />
          )}
        />

        {formBeca?.tipoBeca === SCHOLARSHIP_TYPE.INVESTIGACION && (
          <Autocomplete
            fullWidth
            disabled={dialogSaving}
            options={proyectosRows}
            value={formBeca?.beca ?? null}
            getOptionLabel={(option) =>
              option.nombre_proyecto_investigacion ?? ""
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) =>
              setFormBeca((prev) => ({ ...prev, beca: value }))
            }
            renderInput={(params) => (
              <SAETextField {...params} label={C.proyectoInvestigacionLabel} />
            )}
          />
        )}

        {formBeca?.tipoBeca === SCHOLARSHIP_TYPE.SERVICIO && (
          <Autocomplete
            fullWidth
            disabled={dialogSaving}
            options={serviciosRows}
            value={formBeca?.beca ?? null}
            getOptionLabel={(option) => option.nombre ?? ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) =>
              setFormBeca((prev) => ({ ...prev, beca: value }))
            }
            renderInput={(params) => (
              <SAETextField {...params} label={C.areaLabel} />
            )}
          />
        )}

        {formBeca?.tipoBeca === SCHOLARSHIP_TYPE.ECONOMICA && (
          <SAETextField
            fullWidth
            multiline
            minRows={4}
            label={C.descripcionSituacionLabel}
            name="descripcionSituacion"
            value={formBeca?.descripcionSituacion}
            onChange={handleChange}
            disabled={dialogSaving}
          />
        )}

        {documentosRequeridos?.length > 0 && (
          <Divider variant="middle" sx={{ mt: 0.5 }}>
            <Chip
              label={C.requiredDocumentsTitle}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Divider>
        )}

        {documentosRequeridos?.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {documentosRequeridos?.map((item) => (
              <Grid size={{ xs: 12,md:4 }}key={getDocumentKey(item)}>
                <DocumentCard
                  documento={item}
                  notUploadedLabel={C.docStateNotUploaded}
                  uploadedLabel={C.docStataUplodaded}
                  onPreview={handlePreview}
                  onFileChange={(event, documento) =>
                    handleDocumentoChange(
                      event,
                      getDocumentKey(documento),
                      documentosRequeridos,
                      setDocumentosRequeridos,
                    )
                  }
                  onDelete={(documento) =>
                    setDocumentoAEliminar(documento)
                  }
                  uploadDisabled={
                    item.subido || uploadingDocumentoId === getDocumentKey(item)
                  }
                  deleteDisabled={!item.subido}
                  showRequirement
                />
              </Grid>
            ))}
          </Grid>
        )}

        {documentosEconomicaVisibles?.length > 0 && (
          <Divider variant="middle" sx={{ mt: 0.5 }}>
            <Chip
              label={C.economicDocumentsTitle}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Divider>
        )}

        {formBeca?.tipoBeca === SCHOLARSHIP_TYPE.ECONOMICA &&
          documentosEconomicosOpcionalesDisponibles.length > 0 && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Autocomplete
                fullWidth
                disabled={dialogSaving}
                options={documentosEconomicosOpcionalesDisponibles}
                value={
                  documentosEconomicosOpcionalesDisponibles.find(
                    (documento) =>
                      getDocumentKey(documento) ===
                      documentoEconomicoOpcionalId,
                  ) ?? null
                }
                getOptionLabel={(option) => option.nombre ?? ""}
                isOptionEqualToValue={(option, value) =>
                  getDocumentKey(option) === getDocumentKey(value)
                }
                onChange={(_, value) =>
                  setDocumentoEconomicoOpcionalId(
                    value ? getDocumentKey(value) : "",
                  )
                }
                renderInput={(params) => (
                  <SAETextField
                    {...params}
                    label={C.addOptionalEconomicDocumentLabel}
                  />
                )}
              />
              <SAEButton
                variant="contained"
                onClick={handleAgregarDocumentoEconomico}
                disabled={!documentoEconomicoOpcionalId || dialogSaving}
                startIcon={<AddCircleOutline />}
                sx={{ minWidth: { sm: 150 } }}
              >
                {C.addButton}
              </SAEButton>
            </Stack>
          )}

        {documentosEconomicaVisibles?.length > 0 && (
          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            {documentosEconomicaVisibles?.map((item) => (
              <Grid size={{ xs: 12,md:4}} key={getDocumentKey(item)}>
                <DocumentCard
                  documento={item}
                  notUploadedLabel={C.docStateNotUploaded}
                  uploadedLabel={C.docStataUplodaded}
                  onPreview={handlePreview}
                  onFileChange={(event, documento) =>
                    handleDocumentoChange(
                      event,
                      getDocumentKey(documento),
                      documentosEconomica,
                      setDocumentosEconomica,
                    )
                  }
                  onDelete={handleDocumentoEconomicoDelete}
                  uploadDisabled={
                    item.subido || uploadingDocumentoId === getDocumentKey(item)
                  }
                  deleteDisabled={
                    !isEconomicOptionalDocument(item) && !hasDocumentFile(item)
                  }
                  showRequirement
                />
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <SAEButton onClick={closeDialog} disabled={dialogSaving}>
          {C.cancelButton}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleDialogSave}
          disabled={dialogSaving}
        >
          {dialogSaving ? C.savingButton : C.saveButton}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
