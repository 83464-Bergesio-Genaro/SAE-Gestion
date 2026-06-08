import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  Container,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../../shared/context/sharedContext"; 
import SAEButton from "../../../shared/components/buttons/SAEButton";
import SAETextField from "../../../shared/components/inputs/SAETextField";
import DocumentPreviewDialog from "../../../shared/components/documents/DocumentPreviewDialog";
import utnLogo from "../../../assets/utn.png";
import {
  listarPublicacionesActivas,
  listarDocumentosPorPublicacion,
  descargarDocumentoPorId,
} from "../../../api/PrensaService";
import { PRENSA_STRINGS, SORT_DATE_OPTIONS, SORT_NAME_OPTIONS } from "./prensa.strings";
import { prensaStyles as sx } from "./prensa.styles";
import {
  getDocumentId,
  getDocumentName,
  getDocumentExtension,
  isPreviewableDocument,
  getImageSource,
  prioridadLabel,
  getAccentColor,
  filterAndSort,
  formatDateShort,
  formatDateLong,
  downloadDocument,
} from "./prensa.utils";


export default function Prensa() {
  const baseUrl = import.meta.env.BASE_URL;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("");
  const [ordenNombre, setOrdenNombre] = useState("");
  const [selectedPub, setSelectedPub] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewDocName, setPreviewDocName] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const fetchPublicaciones = useCallback(() => {
    setLoading(true);
    listarPublicacionesActivas()
      .then((data) => setPublicaciones(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error al cargar publicaciones:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPublicaciones();
  }, [fetchPublicaciones]);

  const publicacionesFiltradas = useMemo(
    () => filterAndSort(publicaciones, busqueda, ordenFecha, ordenNombre),
    [publicaciones, busqueda, ordenFecha, ordenNombre]
  );

  const handleCardClick = async (pub) => {
    setSelectedPub(pub);
    setLoadingDocs(true);
    setDocumentos([]);
    try {
      const data = await listarDocumentosPorPublicacion(pub.id);
      setDocumentos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener documentos:", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleClose = () => {
    setSelectedPub(null);
    setDocumentos([]);
  };

  const handleOpenPreview = async (doc) => {
    const documentId = getDocumentId(doc);
    setPreviewDocName(getDocumentName(doc, PRENSA_STRINGS.previewFallbackTitle));
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError("");
    setPreviewDoc(null);

    if (!documentId) {
      setPreviewError(PRENSA_STRINGS.previewErrorNoId);
      setPreviewLoading(false);
      return;
    }

    try {
      const data = await descargarDocumentoPorId(documentId);

      if (!isPreviewableDocument(data) && !isPreviewableDocument(doc)) {
        setPreviewError(PRENSA_STRINGS.previewErrorNotSupported);
        return;
      }

      setPreviewDoc(data);
    } catch (error) {
      console.error("Error al descargar documento:", error);
      setPreviewError(PRENSA_STRINGS.previewErrorLoad);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewDoc(null);
    setPreviewDocName("");
    setPreviewError("");
    setPreviewLoading(false);
  };

  const handleDownloadPreview = () => {
    if (!previewDoc) return;
    downloadDocument(previewDoc, previewDocName || PRENSA_STRINGS.previewFallbackName);
  };

  return (
    <Box sx={sx.page}>
      {loading && (
        <Box sx={sx.loadingOverlay}>
          <Box sx={sx.loadingBox}>
            <CircularProgress size={200} thickness={2.8} />
            <Box
              component="img"
              src={utnLogo}
              alt={PRENSA_STRINGS.loadingAlt}
              sx={sx.loadingImg}
            />
          </Box>
        </Box>
      )}

      <Container maxWidth="xl">
        <Box sx={sx.heroBanner(baseUrl)}>
          <Box sx={sx.heroTextBox}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => navigate(PRENSA_STRINGS.backRoute)}
                sx={sx.heroBackButton}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography variant="overline" sx={sx.heroOverline}>
                {PRENSA_STRINGS.moduleOverline}
              </Typography>
            </Stack>
            <Typography variant="h3" sx={sx.heroTitle}>
              {PRENSA_STRINGS.heroTitle}
            </Typography>
            <Typography sx={sx.heroSubtitle}>
              {PRENSA_STRINGS.heroSubtitle}
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
              {user?.nombre && (
                <Chip label={user.nombre} sx={sx.heroChip} />
              )}
              {user?.legajo && (
                <Chip label={PRENSA_STRINGS.chipLegajo(user.legajo)} sx={sx.heroChip} />
              )}
              {user?.id_perfil && (
                <Chip label={PRENSA_STRINGS.chipPerfil(user.id_perfil)} sx={sx.heroChip} />
              )}
            </Stack>
          </Box>
          <Box sx={sx.heroLogo(baseUrl)} />
        </Box>

        {/* Buscador sticky */}
        <Box sx={sx.searchBar}>
          <SAETextField
            fullWidth
            placeholder={PRENSA_STRINGS.searchPlaceholder}
            size="small"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={sx.searchTextField}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl size="small" sx={sx.filterDateControl}>
            <InputLabel>{PRENSA_STRINGS.filterDateLabel}</InputLabel>
            <Select
              value={ordenFecha}
              label={PRENSA_STRINGS.filterDateLabel}
              onChange={(e) => setOrdenFecha(e.target.value)}
            >
              {SORT_DATE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={sx.filterNameControl}>
            <InputLabel>{PRENSA_STRINGS.filterNameLabel}</InputLabel>
            <Select
              value={ordenNombre}
              label={PRENSA_STRINGS.filterNameLabel}
              onChange={(e) => setOrdenNombre(e.target.value)}
            >
              {SORT_NAME_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {user?.id_perfil === 5 && (
            <SAEButton
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => navigate(PRENSA_STRINGS.adminRoute)}
              sx={sx.adminButton}
            >
              {PRENSA_STRINGS.adminButtonLabel}
            </SAEButton>
          )}

          {(busqueda || ordenFecha || ordenNombre) && (
            <IconButton
              onClick={() => { setBusqueda(""); setOrdenFecha(""); setOrdenNombre(""); }}
              title={PRENSA_STRINGS.clearFiltersTitle}
              sx={sx.clearFiltersButton}
            >
              <FilterListOffIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={sx.publicationsBox}>
          {!loading && publicacionesFiltradas.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={sx.noResults}>
              {PRENSA_STRINGS.noResults}
            </Typography>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Masonry
                columns={{ xs: 1, sm: 2, md: 3 }}
                spacing={{ xs: 2, sm: 3, md: 3 }}
                sx={{ width: "100%", maxWidth: 1200 }}
              >
                {publicacionesFiltradas.map((pub, index) => {
                  const prio = prioridadLabel(pub.prioridad);
                  const accentColor = getAccentColor(pub.prioridad);
                  return (
                    <Card key={pub.id ?? index} sx={sx.card(accentColor)}>
                      <CardActionArea
                        onClick={() => handleCardClick(pub)}
                        sx={sx.cardActionArea}
                      >
                        <CardContent sx={sx.cardContent}>
                          <Box sx={sx.cardChipsBox}>
                            <Chip
                              label={prio.label}
                              color={prio.color}
                              size="small"
                              icon={pub.prioridad > 0 ? <PriorityHighIcon /> : undefined}
                            />
                            {pub.no_dar_baja && (
                              <Chip label={PRENSA_STRINGS.chipFija} size="small" variant="outlined" />
                            )}
                          </Box>

                          <Typography variant="h6" sx={sx.cardTitle}>
                            {pub.titulo_publicacion}
                          </Typography>

                          {pub.descripcion && (
                            <Typography variant="body2" sx={sx.cardDescription}>
                              {pub.descripcion}
                            </Typography>
                          )}

                          <Box sx={sx.cardFooter}>
                            {pub.fecha_inicio && (
                              <Typography variant="caption" sx={sx.cardDate}>
                                {formatDateShort(pub.fecha_inicio)}
                              </Typography>
                            )}
                            <Box sx={sx.cardViewsBox}>
                              <VisibilityIcon sx={sx.cardViewsIcon} />
                              <Typography variant="caption" sx={sx.cardViewsText}>
                                {pub.visualizaciones ?? 0}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  );
                })}
              </Masonry>
            </Box>
          )}
        </Box>

        <Dialog open={!!selectedPub} onClose={handleClose} maxWidth="sm" fullWidth>
          {selectedPub && (
            <>
              <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {selectedPub.titulo_publicacion}
                </Typography>
                <IconButton onClick={handleClose} size="small">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={sx.dialogChipsBox}>
                  <Chip
                    label={prioridadLabel(selectedPub.prioridad).label}
                    color={prioridadLabel(selectedPub.prioridad).color}
                    size="small"
                  />
                  {selectedPub.no_dar_baja && (
                    <Chip label={PRENSA_STRINGS.chipFija} size="small" variant="outlined" />
                  )}
                  <Box sx={sx.dialogViewsBox}>
                    <VisibilityIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      {selectedPub.visualizaciones ?? 0}
                    </Typography>
                  </Box>
                </Box>

                {selectedPub.descripcion && (
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedPub.descripcion}
                  </Typography>
                )}

                <Box sx={sx.dialogDatesBox}>
                  {selectedPub.fecha_inicio && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>{PRENSA_STRINGS.dialogPublicado}</strong>{" "}
                      {formatDateLong(selectedPub.fecha_inicio)}
                    </Typography>
                  )}
                  {selectedPub.fecha_vigencia && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>{PRENSA_STRINGS.dialogVigencia}</strong>{" "}
                      {formatDateLong(selectedPub.fecha_vigencia)}
                    </Typography>
                  )}
                </Box>

                <Box sx={sx.dialogDocsTitleBox}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {PRENSA_STRINGS.dialogDocsTitle}
                  </Typography>
                </Box>
                {loadingDocs && <CircularProgress size={18} color="success" />}
                {!loadingDocs && documentos.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {PRENSA_STRINGS.dialogNoDocs}
                  </Typography>
                ) : (
                  <List dense>
                    {documentos.map((doc, i) => (
                      <ListItem key={getDocumentId(doc) ?? i}>
                        <ListItemIcon sx={{ minWidth: 72 }}>
                          <Box sx={sx.dialogDocIconBox}>
                            <InsertDriveFileIcon />
                            <IconButton
                              size="small"
                              onClick={() => handleOpenPreview(doc)}
                              aria-label={PRENSA_STRINGS.dialogDocTooltip}
                              title={PRENSA_STRINGS.dialogDocTooltip}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={doc.nombre_documento || doc.titulo || `Documento ${i + 1}`}
                          secondary={doc.tipo_documento || null}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>

        <DocumentPreviewDialog
          open={previewOpen}
          onClose={handleClosePreview}
          title={getDocumentName(previewDoc, previewDocName || PRENSA_STRINGS.previewFallbackTitle)}
          imageSrc={previewDoc ? getImageSource(previewDoc) : ""}
          isPdf={getDocumentExtension(previewDoc) === "pdf"}
          loading={previewLoading}
          error={previewError}
          onDownload={handleDownloadPreview}
        />
      </Container>
    </Box>
  );
}