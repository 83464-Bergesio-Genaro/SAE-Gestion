import { useState, useEffect, useCallback, useMemo } from "react";
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
import { useNotification } from "../../../shared/context/sharedContext";

import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import DocumentCard from "../../../shared/components/documents/DocumentCard";

import { SCHOLARSHIP_STRINGS } from "../../../utils/gena/student.string"; 
import { PERSONAL_FIELDS } from "../../../utils/gena/common.config";
import {
  SCHOLARSHIP_TYPE,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  DEFAULT_ACCEPTED_EXTENSIONS} from "../../../utils/gena/constants";
import { construirNombre } from "../../../utils/util";
import { firstNonEmptyText,getDocumentDisplayName,getErrorMessage,hasDocumentFile } from "../../../utils/gena/util";
import { useScholarships } from "../../context/studentContext";

const C = SCHOLARSHIP_STRINGS;

const getDocumentKey = (documento) =>
  documento.id ?? documento.id_tipo_documento ?? documento.nombre;

const isEconomicOptionalDocument = (documento) => documento.required === false;

// Une la configuracion local con tipos/archivos de la API y conserva el estado
// previo para no perder archivos elegidos ni opcionales ya visibles.
const buildDocumentsFromConfig = (
  documentsConfig,
  tiposDocumento = [],
  previousDocuments = [],
  documentos = [],
) => {
  return documentsConfig.map((documentConfig) => {
    const previousDocument = previousDocuments.find(
      (document) => getDocumentKey(document) === getDocumentKey(documentConfig),
    );
    const documentType = tiposDocumento.find(
      (tipoDocumento) =>
        normalizeText(tipoDocumento.nombre) ===
        normalizeText(documentConfig.nombre),
    );
    const uploadedDocument = documentos.find(
      (documento) =>
        documento.subido &&
        Number(documento.id_tipo_documento) ===
          Number(documentType?.id ?? documentType?.id_tipo_documento),
    );

    return {
      ...documentConfig,
      archivo: previousDocument?.archivo ?? documentConfig.archivo ?? null,
      archivoNombre: firstNonEmptyText(
        previousDocument?.archivoNombre,
        documentConfig.archivoNombre,
        documentConfig.nombre_documento,
        uploadedDocument?.nombre_documento,
      ),
      subido: Boolean(
        previousDocument?.archivo ||
        documentConfig.subido ||
        documentConfig.archivoNombre ||
        uploadedDocument,
      ),
      id_archivo:
        uploadedDocument?.id ??
        previousDocument?.id_archivo ??
        documentConfig.id_archivo ??
        null,
      id_tipo_documento:
        documentType?.id ??
        documentType?.id_tipo_documento ??
        documentConfig.id_tipo_documento,
      visible: Boolean(
        documentConfig.required ||
        previousDocument?.visible ||
        previousDocument?.archivoNombre ||
        documentConfig.archivoNombre ||
        uploadedDocument,
      ),
      extension:
        documentType?.extension ??
        uploadedDocument?.extension ??
        documentConfig.extension ??
        DEFAULT_ACCEPTED_EXTENSIONS,
    };
  });
};

export default function ScholarshipsForm({
  open,
  onClose,
  user,
  becarioActual,
  setBecarioActual,
  cargarMisBecas,
  cargarTiposDocumento,
  subirDocumentoEstudiante,
  documentos = [],
  documentosEconomica,
  handlePreview,
  handleDeleteDocument,
  perfilCompleto,
  camposPerfilFaltantes = [],
}) {
  const {showNotification} = useNotification();
  const {
    handleClose,
    saving,
    datosPerfil,
    formBeca,
    documentosRequeridos,
    setDocumentosRequeridos,
    documentosEconomicaVisibles,
    handleDialogSave,

    handleDocumentoEconomicoDelete,
    uploadingDocumentoId,
    
  } = useScholarships(); //Esto en teoria lo llamamos desde dentro del provider de becas


  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
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
        <IconButton onClick={handleClose} size="small" disabled={saving}>
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
        {saving && (
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
          disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
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
            disabled={saving}
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
              <Grid size={{ xs: 12 }}key={getDocumentKey(item)}>
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
                    handleDocumentoDelete(documento, setDocumentosRequeridos)
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
                disabled={saving}
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
                disabled={!documentoEconomicoOpcionalId || saving}
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
              <Grid size={{ xs: 12}} key={getDocumentKey(item)}>
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
        <SAEButton onClick={handleClose} disabled={saving}>
          {C.cancelButton}
        </SAEButton>
        <SAEButton
          variant="contained"
          onClick={handleDialogSave}
          disabled={saving}
        >
          {saving ? C.savingButton : C.saveButton}
        </SAEButton>
      </DialogActions>
    </Dialog>
  );
}
