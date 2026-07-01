import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Avatar,
  Stack,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import SaveIcon from "@mui/icons-material/Save";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import SAEPage from "../../../shared/components/page/SAEPage";
import { useMyProfile } from "../../context/studentContext";
import { ProfileContextProvider } from "../../../shared/context/providers/profileProvider";

const SHOW_PROFILE_DOCUMENTS = false;

const formatDocumentSize = (size) => {
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function MyProfileContent() {
  const {
    profileInitials,
    datosPerfil,
    loadingPerfil,
    documentosPerfil,
    loadingDocumentos,
    handleChange,
    handleMaskedChange,
    handleAddressChange,
    handleProfileSave,
    formatDni,
    formatCuil,
    formatPhone,
    today,
    addressParts,
    requiredError,
    emailHasError,
    phoneHasError,
    dniHasError,
    cuilHasError,
    missingRequiredFields,
    //Valores de error, mostrar mensajes, etc.
    snackbarOpen,
    setSnackbarOpen,
    snackbarMsg,
    setFormError,
    formError,
  } = useMyProfile();

  return (
<SAEPage>
        <Card
          sx={{
            borderRadius: { xs: 3, md: 4 },
            border: "1px solid rgba(42, 84, 139, 0.1)",
            boxShadow: {
              xs: "0 8px 24px rgba(21, 61, 113, 0.08)",
              md: "0 18px 45px rgba(21, 61, 113, 0.1)",
            },
            overflow: "hidden",
            background:
              "linear-gradient(180deg, #f5f9ff 0%, #ffffff 220px)",
          }}
        >
          <CardContent sx={{ p: { xs: 1.5, sm: 3, md: 4 } }}>
            {loadingPerfil ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                <SAESpinner size="S" />
              </Stack>
            ) : (
              <>
                {/* CABECERA */}
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={{ xs: 1.5, md: 3 }}
                  alignItems="center"
                  sx={{
                    p: { xs: 2.5, sm: 3 },
                    mb: { xs: 2.5, md: 4 },
                    borderRadius: 3,
                    color: "white",
                    textAlign: { xs: "center", md: "left" },
                    background:
                      "linear-gradient(135deg, var(--primary) 0%, var(--lightBlue) 100%)",
                    boxShadow: "0 12px 28px rgba(42, 84, 139, 0.22)",
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 80, sm: 96 },
                      height: { xs: 80, sm: 96 },
                      fontSize: { xs: "1.7rem", sm: "2rem" },
                      bgcolor: "#173B68",
                      color: "#FFFFFF",
                      border: "3px solid rgba(255,255,255,0.92)",
                      boxShadow: "0 8px 22px rgba(9, 35, 68, 0.38)",
                    }}
                  >
                    {profileInitials}
                  </Avatar>

                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      Mi Perfil
                    </Typography>

                    <Typography sx={{ color: "rgba(255,255,255,0.82)" }}>
                      Información personal y de contacto
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: { xs: 2.5, md: 4 } }} />

                {/* DATOS PERSONALES */}
                <Stack direction="row" alignItems="center" spacing={1.25} mb={2}>
                  <BadgeOutlinedIcon sx={{ color: "var(--primary)" }} />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="var(--primary)"
                  >
                    Información Personal
                  </Typography>
                </Stack>

                <Grid
                  container
                  spacing={{ xs: 1.5, sm: 2 }}
                  mb={{ xs: 3, md: 4 }}
                >
                  <Grid size={{ xs: 12, md: 4 }}>
                    <SAETextField
                      label="Legajo"
                      fullWidth
                      disabled
                      value={datosPerfil.legajo}
                      InputLabelProps={{ shrink: true }}
                      required
                      error={requiredError(datosPerfil.legajo)}
                      helperText={
                        requiredError(datosPerfil.legajo)
                          ? "El legajo es obligatorio"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <SAETextField
                      label="Nombres"
                      fullWidth
                      value={datosPerfil.nombres}
                      onChange={(e) => handleChange("nombres", e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      slotProps={{ htmlInput: { maxLength: 60 } }}
                      required
                      error={requiredError(datosPerfil.nombres)}
                      helperText={
                        requiredError(datosPerfil.nombres)
                          ? "El nombre es obligatorio"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <SAETextField
                      label="Apellidos"
                      fullWidth
                      value={datosPerfil.apellidos}
                      onChange={(e) =>
                        handleChange("apellidos", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      slotProps={{ htmlInput: { maxLength: 60 } }}
                      required
                      error={requiredError(datosPerfil.apellidos)}
                      helperText={
                        requiredError(datosPerfil.apellidos)
                          ? "El apellido es obligatorio"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <SAETextField
                      label="DNI"
                      fullWidth
                      value={formatDni(datosPerfil.dni)}
                      onChange={handleMaskedChange("dni", formatDni)}
                      InputLabelProps={{ shrink: true }}
                      placeholder="12.345.678"
                      slotProps={{
                        htmlInput: { inputMode: "numeric", maxLength: 10 },
                      }}
                      required
                      error={dniHasError}
                      helperText={
                        dniHasError ? "El DNI debe tener 8 dígitos" : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <SAETextField
                      label="CUIL"
                      fullWidth
                      value={formatCuil(datosPerfil.cuil)}
                      onChange={handleMaskedChange("cuil", formatCuil)}
                      InputLabelProps={{ shrink: true }}
                      placeholder="20-12345678-3"
                      slotProps={{
                        htmlInput: { inputMode: "numeric", maxLength: 13 },
                      }}
                      required
                      error={cuilHasError}
                      helperText={
                        cuilHasError ? "El CUIL debe tener 11 dígitos" : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <SAETextField
                      label="Fecha de Nacimiento"
                      type="date"
                      value={datosPerfil.fecha_nacimiento}
                      onChange={(e) =>
                        handleChange("fecha_nacimiento", e.target.value)
                      }
                      fullWidth
                      slotProps={{
                        inputLabel: { shrink: true },
                        htmlInput: { max: today },
                      }}
                      required
                      error={requiredError(datosPerfil.fecha_nacimiento)}
                      helperText={
                        requiredError(datosPerfil.fecha_nacimiento)
                          ? "La fecha de nacimiento es obligatoria"
                          : ""
                      }
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ mb: { xs: 2.5, md: 4 } }} />

                {/* DATOS DE CONTACTO */}

                <Stack direction="row" alignItems="center" spacing={1.25} mb={2}>
                  <ContactPhoneOutlinedIcon sx={{ color: "var(--primary)" }} />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="var(--primary)"
                  >
                    Información de contacto
                  </Typography>
                </Stack>
                <Grid
                  container
                  spacing={{ xs: 1.5, sm: 2 }}
                  mb={{ xs: 3, md: 4 }}
                >
                  <Grid size={{ xs: 12, md: 6 }}>
                    <SAETextField
                      label="Correo Electrónico"
                      type="email"
                      fullWidth
                      value={datosPerfil.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      slotProps={{ htmlInput: { maxLength: 100 } }}
                      error={emailHasError}
                      required
                      helperText={
                        emailHasError
                          ? "Ingresá un correo válido. Ejemplo: nombre@dominio.com"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <SAETextField
                      label="Teléfono"
                      fullWidth
                      value={datosPerfil.telefono}
                      onChange={handleMaskedChange("telefono", formatPhone)}
                      InputLabelProps={{ shrink: true }}
                      placeholder="+54 351 123-4567"
                      slotProps={{
                        htmlInput: { inputMode: "tel", maxLength: 16 },
                      }}
                      error={phoneHasError}
                      required
                      helperText={
                        phoneHasError
                          ? "Completá el teléfono con el formato +54 351 123-4567"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <SAETextField
                      label="Provincia"
                      fullWidth
                      value={addressParts[0]}
                      onChange={(e) => handleAddressChange(0, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      slotProps={{ htmlInput: { maxLength: 50 } }}
                      required
                      error={requiredError(addressParts[0])}
                      helperText={
                        requiredError(addressParts[0])
                          ? "La provincia es obligatoria"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <SAETextField
                      label="Ciudad / Localidad"
                      fullWidth
                      value={addressParts[1]}
                      onChange={(e) => handleAddressChange(1, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      slotProps={{ htmlInput: { maxLength: 60 } }}
                      required
                      error={requiredError(addressParts[1])}
                      helperText={
                        requiredError(addressParts[1])
                          ? "La ciudad/localidad es obligatoria"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <SAETextField
                      label="Nombre de la calle"
                      fullWidth
                      value={addressParts[2]}
                      onChange={(e) => handleAddressChange(2, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      slotProps={{ htmlInput: { maxLength: 80 } }}
                      required
                      error={requiredError(addressParts[2])}
                      helperText={
                        requiredError(addressParts[2])
                          ? "La calle es obligatoria"
                          : ""
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <SAETextField
                      label="Altura"
                      fullWidth
                      value={addressParts[3]}
                      onChange={(e) => handleAddressChange(3, e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      slotProps={{
                        htmlInput: { inputMode: "numeric", maxLength: 6 },
                      }}
                      required
                      error={requiredError(addressParts[3])}
                      helperText={
                        requiredError(addressParts[3])
                          ? "La altura es obligatoria"
                          : ""
                      }
                    />
                  </Grid>

                  {missingRequiredFields.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                      <Card
                        sx={{
                          bgcolor: "rgba(235, 235, 41, 0.7)",
                          border: "1px solid rgba(235, 41, 41, 0.1)",
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant="h6"
                            color="textPrimary"
                            fontWeight={600}
                            py={1}
                          >
                            ¡ATENCIÓN!
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ lineHeight: 2 }}
                          >
                            {missingRequiredFields.length === 1
                              ? "Falta completar el campo: "
                              : "Faltan completar los campos: "}
                            {missingRequiredFields.join(", ")}.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>

                <Divider sx={{ mb: { xs: 2.5, md: 4 } }} />

                {SHOW_PROFILE_DOCUMENTS && (
                  <>
                {/* DOCUMENTOS */}
                <Stack direction="row" alignItems="center" spacing={1.25} mb={2}>
                  <FolderOpenOutlinedIcon sx={{ color: "var(--primary)" }} />
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="var(--primary)"
                    >
                      Mis documentos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Archivos presentados en los distintos servicios
                    </Typography>
                  </Box>
                </Stack>

                {loadingDocumentos ? (
                  <Stack alignItems="center" sx={{ py: 4 }}>
                    <SAESpinner size="S" />
                  </Stack>
                ) : documentosPerfil.length > 0 ? (
                  <Grid
                    container
                    spacing={{ xs: 1.5, sm: 2 }}
                    mb={{ xs: 3, md: 4 }}
                  >
                    {documentosPerfil.map((documento, index) => {
                      const extension = String(
                        documento.extension || "",
                      ).replace(".", "");
                      const size = formatDocumentSize(documento.tamanio);

                      return (
                        <Grid
                          key={documento.id ?? `${documento.nombre_documento}-${index}`}
                          size={{ xs: 12, sm: 6, lg: 4 }}
                        >
                          <Card
                            variant="outlined"
                            sx={{
                              height: "100%",
                              borderRadius: 3,
                              borderColor: "rgba(42, 84, 139, 0.14)",
                              boxShadow: "0 8px 20px rgba(21, 61, 113, 0.06)",
                            }}
                          >
                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                              <Stack direction="row" spacing={1.5}>
                                <Box
                                  sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 2,
                                    bgcolor: "rgba(91, 150, 204, 0.12)",
                                    color: "var(--primary)",
                                    display: "grid",
                                    placeItems: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <InsertDriveFileOutlinedIcon />
                                </Box>
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                  <Typography fontWeight={700} noWrap>
                                    {documento.nombre_documento ||
                                      `Documento ${index + 1}`}
                                  </Typography>
                                  <Stack
                                    direction="row"
                                    spacing={0.75}
                                    mt={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                  >
                                    {extension && (
                                      <Chip
                                        label={extension.toUpperCase()}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                    )}
                                    {size && (
                                      <Chip
                                        label={size}
                                        size="small"
                                        variant="outlined"
                                      />
                                    )}
                                  </Stack>
                                </Box>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <Box
                    sx={{
                      mb: { xs: 3, md: 4 },
                      p: { xs: 2.5, sm: 3 },
                      borderRadius: 3,
                      textAlign: "center",
                      color: "text.secondary",
                      bgcolor: "rgba(91, 150, 204, 0.06)",
                      border: "1px dashed rgba(42, 84, 139, 0.25)",
                    }}
                  >
                    <FolderOpenOutlinedIcon sx={{ fontSize: 36, mb: 0.5 }} />
                    <Typography fontWeight={600}>
                      Todavía no hay documentos subidos
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ mb: { xs: 2.5, md: 4 } }} />
                  </>
                )}

                {/* ACCIONES */}
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={2}
                  sx={{
                    position: { xs: "sticky", sm: "static" },
                    bottom: { xs: 8, sm: "auto" },
                    zIndex: 2,
                  }}
                >
                  <SAEButton
                    variant="contained"
                    onClick={handleProfileSave}
                    disabled={loadingPerfil}
                    startIcon={<SaveIcon />}
                    sx={{
                      width: { xs: "100%", sm: "auto" },
                      minHeight: 46,
                      px: 3,
                      boxShadow: "0 8px 20px rgba(71, 126, 175, 0.28)",
                    }}
                  >
                    Guardar Cambios
                  </SAEButton>
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
        {/* MENSAJES */}
        <Snackbar
          open={Boolean(formError)}
          autoHideDuration={5000}
          onClose={() => setFormError("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setFormError("")}
            severity="warning"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {formError}
          </Alert>
        </Snackbar>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
     </SAEPage>
  );
}

// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function MyProfile() {
  return (
    <ProfileContextProvider loadDocuments={SHOW_PROFILE_DOCUMENTS}>
      <MyProfileContent />
    </ProfileContextProvider>
  );
}
