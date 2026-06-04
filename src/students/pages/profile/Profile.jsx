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
    Button,
    Snackbar,
    Alert
} from "@mui/material";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAESpinner from "../../../shared/components/spinner/SAESpinner";

import { useEffect } from "react";
import { useAuth } from "../../../shared/auth/AuthContext";
import { useProfileContext,ProfileContextProvider } from "./ProfileContext";

/*const [perfil, setPerfil] = useState({
  legajo: "",
  nombres: "",
  apellidos: "",
  email: "",
  telefono: "",
  fecha_nacimiento: "",
  cuil: "",
  dni: "",
  direccion: ""
});*/
function getInitials(nombre = "") {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}


export function MyProfileContent(){
    const { user } = useAuth();
    const {
            fetchDatosPerfil,datosPerfil,loadingPerfil,setDatosPerfil,handleProfileSave,
            //Valores de error, mostrar mensajes, etc.
            snackbarOpen, setSnackbarOpen,snackbarMsg,setFormError,
             formError

    } = useProfileContext();

    useEffect(() => {
        fetchDatosPerfil(user.legajo);
    }, [fetchDatosPerfil,user]);

    const handleChange = (field, value) => {
        setDatosPerfil((prev) => ({ ...prev, [field]: value }));
    };   
    
    return(
    <Box
        sx={{
        mt: "-90px",
        pt: "90px",
        pb: 4,
        minHeight: "100%",
        bgcolor: "#f4f8fc",
        }}
    >
        <Container maxWidth="xl">
        {formError && (
            <Alert severity="error" onClose={() => setFormError("")}>
                {formError}
            </Alert>
        )}            
        {loadingPerfil &&  (
            <Box
                sx={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    zIndex: 1300,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    pointerEvents: "all",
                    backdropFilter: "blur(2px)",
                }}
                textAlign="center"
                >
            <Box
                sx={{
                position: "relative",
                width: 200,
                height: 200,
                display: "grid",
                placeItems: "center",
                }}
            >
                <SAESpinner size="S" />
            </Box>
          </Box>
        )}
        {!loadingPerfil && (
            <Card
                sx={{
                    borderRadius: 4,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                    overflow: "hidden"
                }}
            >
                <CardContent sx={{ p: 4 }}>

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
                                bgcolor: "primary.main"
                            }}
                        >
                            {getInitials(user.nombre)}
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
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        mb={2}
                        color="primary"
                    >
                        Información Personal
                    </Typography>

                    <Grid container spacing={2} mb={4}>
                        <Grid size={{ xs: 12 ,md:4}}>
                            <SAETextField
                                label="Legajo"
                                fullWidth
                                disabled
                                value={datosPerfil.legajo}  
                                InputLabelProps={{ shrink: true }}                        
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <SAETextField
                                label="Nombres"
                                fullWidth
                                value={datosPerfil.nombres}
                                onChange={(e) => handleChange("nombres", e.target.value)} 
                                InputLabelProps={{ shrink: true }}                                         
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <SAETextField
                                label="Apellidos"
                                fullWidth
                                value={datosPerfil.apellidos}
                                onChange={(e) => handleChange("apellidos", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <SAETextField
                                label="DNI"
                                fullWidth
                                value={datosPerfil.dni}
                                onChange={(e) => handleChange("dni", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <SAETextField
                                label="CUIL"
                                fullWidth
                                value={datosPerfil.cuil}
                                onChange={(e) => handleChange("cuil", e.target.value)}                                   
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                              <SAETextField
                                  label="Fecha de Nacimiento"
                                  type="date"
                                  value={datosPerfil.fecha_nacimiento}
                                  onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
                                  fullWidth
                                  slotProps={{ inputLabel: { shrink: true } }}
                              />
                        </Grid>

                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    {/* DATOS DE CONTACTO */}
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        mb={2}
                        color="primary"
                    >
                        Información de Contacto
                    </Typography>

                    <Grid container spacing={2} mb={4}>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <SAETextField
                                label="Correo Electrónico"
                                type="email"
                                fullWidth
                                value={datosPerfil.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <SAETextField
                                label="Teléfono"
                                fullWidth
                                value={datosPerfil.telefono}
                                onChange={(e) => handleChange("telefono", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <SAETextField
                                label="Dirección"
                                fullWidth
                                multiline
                                value={datosPerfil.direccion}
                                onChange={(e) => handleChange("direccion", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                         <Grid size={{ xs: 12 }}>
                        <Card sx={{ bgcolor: "rgba(235, 235, 41, 0.7)", border: "1px solid rgba(235, 41, 41, 0.1)" }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography variant="h6" color="textPrimary" fontWeight={600} py={1}>
                                    ¡ATENCION! 
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 2 }}>
                                    Para escribir la informacion te solicitamos que lo completes de la siguiente manera:<br/>
                                   <strong>[PROVINCIA] - [ CUIDAD/LOCALIDAD ] - [ NOMBRE DE LA CALLE ] - [ ALTURA ] <br/></strong>
                                    Ejemplo:<br/>
                                   <strong>Cordoba - Springfield - Avenida Siempre Viva - 742</strong>
                                </Typography>
                            </CardContent>
                        </Card>
                         </Grid>

                    </Grid>

                    <Divider sx={{ mb: 4 }} />

                    {/* ACCIONES */}
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                    >
                          <SAEButton
                              variant="contained"
                              onClick={handleProfileSave}
                              disabled={loadingPerfil}                      
                          >
                              Guardar Cambios
                          </SAEButton>
                    </Stack>

                </CardContent>
            </Card>
             )}
            {/* MENSAJE DE EXITO */}
                <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: "100%" }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Container>
    </Box>
    )
}

// Este componente solo inicializa el Proveedor y llama al contenido interno
export default function MyProfile() {
    return (
        <ProfileContextProvider>
            <MyProfileContent />
        </ProfileContextProvider>
    );
}