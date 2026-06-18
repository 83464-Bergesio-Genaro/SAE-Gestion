import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  Divider,
  Avatar,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import TitleBox from "../../../shared/components/titleBox";
import SaveIcon from "@mui/icons-material/Save";

import { useMyProfile } from "../../context/studentContext";
import { ProfileContextProvider } from "../../../shared/context/providers/profileProvider";

export function MyProfileContent() {
  const {
    user,
    profileInitials,
    datosPerfil,
    loadingPerfil,
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
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "114px", md: "100px" },
        pb: 4,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {loadingPerfil ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                <SAESpinner size="S" />
              </Stack>
            ) : (
              <>
                {/* CABECERA */}
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={3}
                  alignItems="center"
                  mb={4}
                >
                  <Avatar
                    sx={{
                      width: 96,
                      height: 96,
                      fontSize: "2rem",
                      bgcolor: "primary.main",
                    }}
                  >
                    {profileInitials}
                  </Avatar>

                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      Mi Perfil
                    </Typography>

                    <Typography color="text.secondary">
                      Información personal y de contacto
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 4 }} />

                {/* DATOS PERSONALES */}
                <TitleBox title="Información Personal" fontweight={400} />

                <Grid container spacing={2} mb={4}>
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

                <Divider sx={{ mb: 4 }} />

                {/* DATOS DE CONTACTO */}

                <TitleBox title="Información Contacto" fontweight={400} />
                <Grid container spacing={2} mb={4}>
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

                <Divider sx={{ mb: 4 }} />

                {/* ACCIONES */}
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <SAEButton
                  variant="contained"
                  onClick={handleProfileSave}
                  disabled={loadingPerfil}
                  startIcon={<SaveIcon />}
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
      </Container>
    </Box>
  );
}

// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function MyProfile() {
  return (
    <ProfileContextProvider>
      <MyProfileContent />
    </ProfileContextProvider>
  );
}
