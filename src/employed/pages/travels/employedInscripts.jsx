import {
    Avatar,
  Autocomplete,
  Box,
  Button,
  Grid,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip
} from "@mui/material";

import { useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { TravelProvider } from "../../context/providers/travelProvider";
import { useTravel } from "../../context/employedContext";
import { DataGrid } from "@mui/x-data-grid";
import SAETextField from "../../../shared/components/inputs/SAETextField"; 
import SAEButton from "../../../shared/components/buttons/SAEButton"; 
import SAESpinner from "../../../shared/components/spinner/SAESpinner";
import HeaderPageEmployed from "../../../shared/components/HeaderPageEmployed";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import LocalAirportIcon from '@mui/icons-material/LocalAirport';
import FolderIcon from '@mui/icons-material/Folder';
import DownloadIcon from "@mui/icons-material/Download";
import { Diversity1 } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";

const baseUrl = import.meta.env.BASE_URL;
export default function EmployedTravelInscripts(){
  return (
      <TravelProvider>
          <EmployedIncriptsContent />
      </TravelProvider>
  );
}


function EmployedIncriptsContent(){
    const navigate = useNavigate();

    const {
    snackbarOpen,setSnackbarOpen,snackbarMsg,

    usuarioSelected,setUsuarioSelected,loadingUsuario,fetchUsuariosXlegajo,
    inscriptsTravel,loadingInscripts,

    handleAddIncriptos,handleDeleteInscript,

    dialogOpen, setDialogOpen,
    dialogType, 
    dialogMode, 
    dialogData, setDialogData,
    dialogSaving, 
    dialogError, setDialogError,
    travelData, setTravelData,fetchInscriptosXTravel } = useTravel();

    useEffect(() => {
        const saved = localStorage.getItem("selectedTravel");
        
        if (saved) {
        const parsedData = JSON.parse(saved);
            setTravelData(parsedData);
            fetchInscriptosXTravel(parsedData.id);
        }
        
    }, [setTravelData,fetchInscriptosXTravel]);

    const handleSearchChange = (field, value) => {
        setDialogData((prev) => ({ ...prev, [field]: value }));
    };

    return(
        <Box
        sx={{
            mt: "-90px",
            pt: { xs: "90px", md: "100px" },
            pb: 4,
            minHeight: "calc(100vh - 90px)",
            bgcolor: "#f4f8fc",
        }}
        >
            <Container maxWidth="xl">
                {travelData && (
                    <>
                    <Box
                        sx={{
                            overflow: "hidden",
                            borderRadius: 6,
                            px: { xs: 3, md: 6 },
                            py: { xs: 4, md: 5 },
                            minHeight: 260,
                            backgroundImage: `linear-gradient(125deg, rgba(18,54,102,0.97) 0%, rgba(53,108,178,0.93) 58%, rgba(108,171,221,0.88) 100%), url('${baseUrl}images/varias/campus.jpg')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            color: "white",
                        }}
                        >
                        {/* Top row: back arrow + overline + edit pencil */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" spacing={1}>
                            <IconButton
                                size="small"
                                onClick={() => navigate("/Gestion-Viajes")}
                                sx={{
                                color: "white",
                                bgcolor: "rgba(255,255,255,0.15)",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                                }}
                            >
                                <ArrowBackIcon fontSize="small" />
                            </IconButton>
                            <Typography
                                variant="overline"
                                sx={{ letterSpacing: 1.8, opacity: 0.85, fontWeight: 700 }}
                            >
                                Gestion de Inscriptos
                            </Typography>
                            </Stack>
                        </Stack>

                            <Box sx={{ mt: 1.5 }}>
                                <Typography
                                variant="h3"
                                sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: { xs: "2rem", md: "3rem" } }}
                                >
                                {travelData.nombre}
                                </Typography>
                                <Typography sx={{ mt: 1.5, fontSize: { xs: 15, md: 17 }, opacity: 0.92 }}>
                                Del <strong> {travelData.fecha_inicio} </strong> hasta <strong> {travelData.fecha_fin}</strong>
                                </Typography>
                                <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2.5 }}>
                                    <Chip
                                        label={travelData.seguro? "Tiene Seguro":"Falta Seguro"}
                                        size="small"
                                        sx={{
                                        bgcolor: travelData.seguro ? "rgba(76,175,80,0.28)" : "rgba(211,47,47,0.55)",
                                        color: "white",
                                        fontWeight: 700,
                                        border: "1px solid rgba(255,255,255,0.4)",
                                        }}
                                    />
                                     <Chip
                                        label={ (inscriptsTravel? inscriptsTravel?.length : "0")+"/"+travelData.cantidad_personas}
                                        size="small"
                                        sx={{
                                        bgcolor: (inscriptsTravel?.length>Number(travelData.cantidad_personas))? "rgba(207, 80, 61, 0.55)" :"rgba(75, 107, 188, 0.55)",
                                        color: "white",
                                        fontWeight: 700,
                                        border: "1px solid rgba(255,255,255,0.4)",
                                        }}
                                    />
                                </Stack>
                            </Box>
                        </Box>

                    <Grid container spacing={1}>
                        <Grid size={{xs:12}} mt={2}>
                        <Card
                            sx={{
                            borderRadius: 4,
                            boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
                            mb: 3,
                            overflow: "hidden",
                            }}
                        >
                            <Box
                            sx={{
                                background: "linear-gradient(135deg, #FFFFFF 96%, #EBEBEB 5%)",
                                color: "black",
                                py:2,
                                px:4,
                            }}
                            >
                            <Typography sx={{ my: 1.5,fontWeight:"bold" ,fontSize: { xs: 16, md: 18 }, opacity: 0.98 }}>
                                Buscar Estudiantes para agregar
                            </Typography>
                            { (!usuarioSelected) ? (
                                <SAETextField
                                    label="Legajo"
                                    value={dialogData?.legajo}
                                    onChange={(e) => handleSearchChange("legajo", e.target.value)}
                                    fullWidth
                                    disabled={loadingUsuario} // Deshabilita el input mientras busca
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            fetchUsuariosXlegajo(dialogData?.legajo);
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {loadingUsuario ? (
                                                    <CircularProgress size={24} color="inherit"/> // Spinner dentro del input
                                                ) : (
                                                    <IconButton 
                                                        onClick={() => fetchUsuariosXlegajo(dialogData?.legajo)}
                                                        edge="end"
                                                    >
                                                    <SearchIcon />
                                                    </IconButton>
                                                )}
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            ) : (
                                /* CASO B: Usuario encontrado -> Mostramos resultado y opción de limpiar */
                                <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Usuario Seleccionado:
                                    </Typography>
                                    {/* Reemplazá esto con los campos reales de tu objeto "usuarioSelected" */}
                                    <Typography variant="body1">
                                        {usuarioSelected.nombre_usuario}
                                    </Typography>
                                    <Stack direction={"row"} mt={2} spacing={2}>
                                    <Button 
                                        variant="contained" 
                                        size="small"
                                        onClick={() => {
                                            handleAddIncriptos(); 
                                            handleSearchChange("legajo", ""); 
                                        }}
                                       
                                        sx={{ mt: 2 }}
                                    >
                                        Agregar Estudiante
                                    </Button>                        
                                    <Button 
                                        variant="outlined" 
                                        color="secondary" 
                                        size="small" 
                                        onClick={() => {
                                            setUsuarioSelected(null); 
                                            handleSearchChange("legajo", "");
                                        }}
                                        sx={{ mt: 2 }}
                                    >
                                        Volver a buscar
                                    </Button>
                                    </Stack>
                                    
                                </Box>
                            )}
                            </Box>
                        </Card>
                        <Typography variant="h5" fontWeight="bold" px={4} my={2} >
                            Planilla de Inscriptos
                        </Typography>                        
                        <Card
                            sx={{
                            borderRadius: 4,
                            background: "linear-gradient(135deg, #FFFFFF 96%, #EBEBEB 5%)",
                            boxShadow: "0 18px 45px rgba(188, 188, 188, 0.08)",
                            mb: 3,
                            overflow: "hidden",
                            p:4,
                            }}
                        >
                            {loadingInscripts && (
                            <Stack alignItems="center" width={"100%"} gap={1}>
                                <SAESpinner size="S" />
                            </Stack>
                            )}
                            <Box>

                            {!loadingInscripts && inscriptsTravel && inscriptsTravel.length === 0 && (
                                <Stack alignItems="center" width={"100%"} gap={1}>
                                    <Typography variant="body2" noWrap>Sin Inscriptos</Typography>
                                </Stack>
                            )}
                            {!loadingInscripts &&  inscriptsTravel.length > 0 &&(
                                <Stack direction={"column"} spacing={1}>

                                
                                {inscriptsTravel.map((d,i) => (
                                    <InscriptosCard datosEstudiante={d} key={i}/>
                                ))}
                                </Stack>
                            )}        
                            </Box> 
                        </Card>
                                   
                        </Grid>
                    </Grid>
                    {dialogOpen && dialogType === "inscript" && (
                    <Dialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
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
                            <Typography
                            variant="h6"
                            component="span"
                            sx={{ fontWeight: "bold" }}
                            >
                            {dialogMode === "documentacion"
                                ? "Documentacion del Inscripto"
                                : "Eliminar Inscripcion"}
                            </Typography>
                            <IconButton onClick={() => setDialogOpen(false)} size="small">
                            <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Stack spacing={2} sx={{ pt: 1 }}>
                            {dialogError && (
                                <Alert severity="error" onClose={() => setDialogError("")}>
                                {dialogError}
                                </Alert>
                            )}
                            {dialogMode === "delete" && (
                                <>
                                    <Typography
                                    variant="subtitle2"
                                    color="textPrimary"
                                    fontWeight={600}
                                    gutterBottom
                                   
                                    >
                                    ¡ATENCION!
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Esta apunto de eliminar este inscripto de la lista del viaje, sin embargo si esta persona subio algun tipo de documentacion relacionada
                                        se mantendra a menos que se elimine de manera particular.
                                    </Typography>
                                     <Typography mt={2} variant="body2" color="textSecondary" textAlign={"center"} fontWeight={"bold"}>
                                     ¿Quiere continuar?    
                                    </Typography>                             
                                </>

                            )}

                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <SAEButton
                            variant="outlined"
                            onClick={() => setDialogOpen(false)}
                            disabled={dialogSaving}
                            >
                            Cancelar
                            </SAEButton>
                                {dialogMode === "delete" && (
                                    <SAEButton
                                    variant="contained"
                                    color="error"
                                    onClick={handleDeleteInscript}
                                    disabled={dialogSaving}
                                    startIcon={
                                        dialogSaving ? (
                                        <CircularProgress size={16} color="inherit" />
                                        ) : null
                                    }
                                    >
                                    Eliminar
                                </SAEButton>
                            )}
                            
                        </DialogActions>
                        </Dialog>
                    )}

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
                    </>
                )}
                {dialogOpen && dialogType === "documents" && (
                    <DocumentsDialog/>
                )}
            </Container>
        </Box>
    );
}
function DocumentsDialog(){
  const {   
            dialogOpen, setDialogOpen,
            dialogError,
            downloadingDocId,
            handlePreviewDoc,handleDownloadDoc,
            previewOpen,setPreviewOpen,
            previewTitle,
            previewSrc, 
            previewIsPdf, 
            loadingPreview,
            previewError,
            previewDocRef,
            openPopup,setOpenPopup,documentoAEliminar,requestDeleteDocument,handleDelete,
            docsInscript,loadingInscriptDocs,setSeletedInscripts
      } = useTravel();


  return(
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
        open={dialogOpen}
        onClose={() => setDialogOpen(false),setSeletedInscripts(null)}
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
            Documentación — {/*seletedInscripts.nombre_estudiante*/}
          </Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {dialogError && (
            <Alert severity="error">{dialogError}</Alert>
          )}
          {loadingInscriptDocs && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <SAESpinner size="S"/>
            </Box>
          )}

          {!loadingInscriptDocs  && docsInscript.length === 0 && (
            <Typography
              color="text.secondary"
              sx={{ py: 2, textAlign: "center" }}
            >
              No hay documentación disponible de este viaje.
            </Typography>
          )}
          {!loadingInscriptDocs && docsInscript.length > 0 && (
            <Stack spacing={1} sx={{ pt: 1 }}>
              {docsInscript.map((doc,index) => (
                <Box
                  key={index}
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
                     {doc.nombre_documento.replace(/_/g, " ")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {doc.extension?.toUpperCase()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Ver Documentos">
                      <IconButton
                        size="small"
                        onClick={() => handlePreviewDoc(doc)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Descargar">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDownloadDoc(
                            doc.id,
                            doc.nombre_documento,
                            doc.extension,
                          )
                        }
                        disabled={downloadingDocId === doc.id}
                      >
                        {downloadingDocId === doc.id ? (
                          <CircularProgress size={18} />
                        ) : (
                          <DownloadIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => requestDeleteDocument(doc)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
          
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <SAEButton
            variant="outlined"
            onClick={() => setDialogOpen(false)}
          >
            Cerrar
          </SAEButton>
        </DialogActions>
        </Dialog>
        <Dialog open={openPopup} onClose={()=>setOpenPopup(false)}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600,p:4}}>
              EliminarDocumento
            </Typography>

          <DialogContent>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              "Esta seguro que quiere eliminar el documento: " {documentoAEliminar?.nombre_documento}
            </Typography>
          </DialogContent>

          <DialogActions>
            <SAEButton
              onClick={() => setOpenPopup(false)}
              autoFocus
              color="outlined"
            >
              Cancelar
            </SAEButton>
            <SAEButton
              onClick={() => handleDelete(documentoAEliminar)}
              autoFocus
              color="error"
            >
              Eliminar
            </SAEButton>
          </DialogActions>
        </Dialog>      
    </>
  )
}
function InscriptosCard({datosEstudiante}){

  const [loadingCard, setLoadingCard] = useState(false); 
  const [estudiante,SetDatosEstudiante] = useState(datosEstudiante);

  const { handleUpdateInscriptos,handleClickRemove,openSeeDocInscript} = useTravel();
  const handleInscriptosChange =  async(field, value) => {
    SetDatosEstudiante((prev) => ({ ...prev, [field]: value }));
    setLoadingCard(true);
    await handleUpdateInscriptos(estudiante);
    setLoadingCard(false);
  };

  return (
    <Card
        sx={{
            position: "relative",
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            boxShadow: "none",
            transition: ".2s",
            "&:hover": {
            borderColor: "#1976d2",
            boxShadow: "0 4px 12px rgba(25,118,210,.15)"
            }
        }}
        >
        <CardContent>
              {loadingCard && (
                <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(255, 255, 255, 0.7)', // Fondo blanco semitransparente
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2, //
                    borderRadius: 3, 
                    backdropFilter: 'blur(2px)',
                }}
                >
                    <SAESpinner size="S" />
                </Box>
            )}
            <Stack
                direction={{xs:"column",md:"row"}}
                justifyContent="space-between"
                alignItems="center"
                spacing={3}
            >
                <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                >
                <Avatar
                    sx={{
                    bgcolor: "#E3F2FD",
                    color: "#1976d2"
                    }}
                >
                    <Diversity1 />
                </Avatar>

                <Box>
                    <Typography fontWeight={600}>
                    {estudiante.nombre_estudiante}
                    </Typography>

                    <Typography
                    variant="caption"
                    color="text.secondary"
                    >
                    Legajo {estudiante.legajo_estudiante}
                    </Typography>
                </Box>
                </Stack>
                <Stack
                direction={{xs:"row",md:"row"}}
                spacing={{xs:0,md:4}}
                alignItems="center"
                >
                <Switch
                    checked={estudiante.documentacion_presentada}
                    onChange={(e) =>
                        handleInscriptosChange("documentacion_presentada", e.target.checked)
                    }
                    color="primary"
                />
                <Chip
               
                color={estudiante.documentacion_presentada ? "success" : "error"}
                sx={{
                    width: { xs: 80, md: 200 },
                    fontWeight: "bold",
                    '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%', // Asegura que el contenedor use todo el espacio
                    textAlign: 'center' // Centra el texto dentro del chip
                    }
                }}
                label={
                    <>
                    <Box 
                        component="span" 
                        sx={{ display: { xs: 'block', md: 'none' } }}>
                        {estudiante.documentacion_presentada ? "Correcto" : "A Revisar"}
                    </Box>
                    <Box 
                        component="span" 
                        sx={{ display: { xs: 'none', md: 'block' } }}>
                        {estudiante.documentacion_presentada ? "Documentación Revisada" : "Documentación no Revisada"}
                    </Box>
                    </>
                }
                />
                <Tooltip title="Ver documentación">
                    <IconButton
                    onClick={()=>openSeeDocInscript(estudiante)}
                     >
                        <FolderIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Eliminar inscripción">
                    <IconButton
                        onClick={()=>handleClickRemove(estudiante)}
                        color="error"
                    >
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
                </Stack>

            </Stack>
        </CardContent>
    </Card>
  );
}