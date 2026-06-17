import {
  Autocomplete,
  Box,
  Grid,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
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
} from "@mui/material"; 
import { useState,useMemo } from "react";
import {PurchaseProvider }from "../../context/providers/purchaseProvider";
import { usePurchase } from "../../context/employedContext";
import { DataGrid } from "@mui/x-data-grid";
import SAETextField from "../../../shared/components/inputs/SAETextField"; 
import SAEButton from "../../../shared/components/buttons/SAEButton"; 
import HeaderPageEmployed from "../../../shared/components/HeaderPageEmployed";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function EmployedPurchases() {
  return (
      <PurchaseProvider>
          <EmployedPurchasesContent />
      </PurchaseProvider>
  );
}
const secciones = [
  { key: "compras", label: "Compras" }
];
function EmployedPurchasesContent(){
  const {   snackbarOpen,setSnackbarOpen,
            snackbarMsg,setSnackbarMsg,

            purchasesRows,purchasesColumns,loadingPurchase,
            fetchPurchases,openCreatePurchases,handlePurchasesSave,

            dialogOpen, setDialogOpen,
            dialogType, setDialogType,
            dialogMode, setDialogMode,
            dialogData, setDialogData,
            dialogSaving, setDialogSaving,
            dialogError, setDialogError} = usePurchase();
        
          const sectionConfig = useMemo(
              () => ({
                  compras: {
                      title: "Compras",
                      dialog: openCreatePurchases,
                      addButton: "Registrar Compra",
                      icon: ShoppingCartIcon,
                      rows:purchasesRows,
                      columns:  purchasesColumns,
                      loading:  loadingPurchase
                  }
              }),
              []
          );
      const [activeSection, setActiveSection] = useState("compras");
      const [busquedaGestion, setBusquedaGestion] = useState("");
      const handleSectionChange = (section) => {
          setActiveSection(section);
          setBusquedaGestion("");
      };
  
    const currentSection = useMemo(
      () => sectionConfig[activeSection],
      [activeSection, sectionConfig],
    );
    const rowsGestionFiltradas = useMemo(() => {
      const term = busquedaGestion.trim().toLowerCase();
      if (!term) return currentSection.rows;
  
      return currentSection.rows.filter((row) =>
        Object.values(row).some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(term),
        ),
      );
    }, [currentSection.rows, busquedaGestion]);
  const handleDialogChange = (field, value) => {
    setDialogData((prev) => ({ ...prev, [field]: value }));
  };
  console.log(loadingPurchase);
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
        <HeaderPageEmployed
          header=" Módulo de Compras"
          title="Administracion de las Compras"
          description="En este módulo se registran todas las compras que hace la secretaria."
        />
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
              background: "linear-gradient(135deg, #1a3a5c 0%, #2d6da3 100%)",
              color: "white",
              px: 3,
              pt: 0,
              pb: 0,
            }}
          >
            <Stack
              direction="row"
              overflow={{ xs: "scroll", md: "hidden" }}
              spacing={0}
            >
              {secciones.map((item) => (
                <Box
                  key={item.key}
                  onClick={() => handleSectionChange(item.key)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2.5,
                    py: 1.5,
                    cursor: "pointer",
                    fontWeight: activeSection === item.key ? 700 : 500,
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color:
                      activeSection === item.key
                        ? "white"
                        : "rgba(255,255,255,0.6)",
                    borderBottom:
                      activeSection === item.key
                        ? "3px solid white"
                        : "3px solid transparent",
                    transition: "all 0.15s",
                    "&:hover": {
                      color: "white",
                      borderBottomColor: "rgba(255,255,255,0.4)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "inherit",
                      fontSize: "inherit",
                      letterSpacing: "inherit",
                      textTransform: "inherit",
                      color: "inherit",
                      lineHeight: 1,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ py: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <currentSection.icon sx={{ fontSize: 30 }} />
                <Typography variant="h6" fontWeight={700}>
                  {currentSection.title}
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ sm: "center" }}
              >
                <SAETextField
                  placeholder="Busqueda..."
                  size="small"
                  value={busquedaGestion}
                  onChange={(e) => setBusquedaGestion(e.target.value)}
                  sx={{
                    width: { xs: "100%", sm: 240, md: 220 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.12)",
                      color: "white",
                      "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.6)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& input::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                      opacity: 1,
                    },
                    "& .MuiInputAdornment-root svg": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  }}
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
                <SAEButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={currentSection.dialog}
                  sx={{
                    whiteSpace: "nowrap",
                    bgcolor: "rgba(255,255,255,0.18)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.4)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                  }}
                >
                  {currentSection.addButton}
                </SAEButton>
              </Stack>
            </Stack>
          </Box>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ width: "100%" }}>
              <DataGrid
                rows={rowsGestionFiltradas}
                columns={currentSection.columns}
                loading={currentSection.loading}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5 } },
                }}
                localeText={{ noRowsLabel: "Sin Registros" }}
                sx={{ borderRadius: 0, border: "none" }}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}