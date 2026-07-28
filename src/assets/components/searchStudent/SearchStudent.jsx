import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SAEButton from "../buttons/SAEButton";
import SAETextField from "../inputs/SAETextField";
import { CAREERS } from "../../../utils/common/constants";

const getStudentName = (student = {}) =>
  student.nombre_usuario ??
  student.nombre_becario ??
  student.nombre ??
  student.Nombre ??
  "";

export default function SearchStudent({
  legajo = "",
  disabled = false,
  onLegajoChange,
  onSelectStudent,
  onClearStudent,
  onSearchStudent,
  onError,
}) {
  const isMobile = useMediaQuery("(max-width:932px)");
  const [careerSearch, setCareerSearch] = useState("");
  const [studentSearchLoading, setStudentSearchLoading] = useState(false);
  const [studentSelected, setStudentSelected] = useState(null);

  useEffect(() => {
    if (!legajo) {
      setStudentSelected(null);
    }
  }, [legajo]);

  const handleStudentSearch = async () => {
    const studentId = String(legajo ?? "")
      .trim()
      .split("@")[0];

    if (!studentId) {
      onError?.("Ingresá un legajo para buscar");
      return;
    }

    if (!careerSearch) {
      onError?.("Seleccioná una carrera para buscar");
      return;
    }

    try {
      setStudentSearchLoading(true);
      setStudentSelected(null);

      const student = await onSearchStudent?.(
        `${studentId}@${careerSearch}.frc.utn.edu.ar`,
      );
      if (!student?.legajo) {
        onError?.("Alumno no encontrado","error");
        return;
      }
      setStudentSelected(student);
      onSelectStudent?.(student);
    } catch {
      setStudentSelected(null);
      onError?.("Alumno no encontrado","error");
    } finally {
      setStudentSearchLoading(false);
    }
  };

const clearStudentSearch = () => {
  console.log("Avisando al padre...");
  
  // 1. Primero ejecutamos la función del padre
  if (typeof onClearStudent === 'function') {
    onClearStudent(); 
  }
  
  // 2. Después limpiamos el estado local del hijo
  setStudentSelected(null);
  setCareerSearch("");
};

  if (studentSelected) {
    return (
      <Box
        sx={{
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          Alumno seleccionado
        </Typography>
        <Typography variant="body1">
          {getStudentName(studentSelected)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {studentSelected.legajo}
        </Typography>
        <SAEButton
          variant="outlined"
          size="small"
           onClick={clearStudentSearch}
          sx={{ mt: 2 }}
        >
          Volver a buscar
        </SAEButton>
      </Box>
    );
  }
  
  return(
    <Grid container
      spacing={1}
      alignItems={{ sm: "center" }}
    >
       <Grid size={{ xs: 8, md: 3 }} my={2}>
          <SAETextField
            label="Legajo"
            value={legajo ?? ""}
            onChange={(event) => onLegajoChange?.(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleStudentSearch();
            }}
            disabled={disabled || studentSearchLoading}
            fullWidth
          />
      </Grid>
      <Grid size={{ xs: 4, md: 1 }} my={2} display={"flex"} justifyContent={"center"}>
        <Typography
          variant="subtitle2"
          alignSelf={"center"}
          sx={{

            color: "text.secondary",
            fontWeight: 700,
            lineHeight: { sm: "56px" },
          }}
        > @
        </Typography>
      </Grid>
      <Grid size={{ xs: 8, md: 4 }} my={2}>
        <Autocomplete
          options={CAREERS}
          value={CAREERS.find((career) => career.value === careerSearch) ?? null}
          onChange={(_event, career) => setCareerSearch(career?.value ?? "")}
          getOptionLabel={(career) => career.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          disabled={disabled || studentSearchLoading}
          fullWidth
          renderInput={(params) => <SAETextField {...params} label="Carrera" />}
        />
      </Grid>
      <Grid size={{ xs: 4, md: 3 }} my={2} display={"flex"} justifyContent={"center"} >
        <Typography 
        alignSelf={"center"}
            variant="subtitle1"
            color="text.secondary" 
            fontWeight={500}
            whiteSpace="nowrap"
            textAlign={"center"}
         >
          .frc.utn.edu.ar
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 1 }} my={2}>
        {studentSearchLoading && (<CircularProgress size={36} sx={{ ml: 1 }} />)}
        {!studentSearchLoading && !isMobile &&(
          <IconButton
              onClick={handleStudentSearch}
              aria-label="Buscar alumno"
              disabled={disabled}
              variant="outlined"
              size="large"
            >
              <SearchIcon />
            </IconButton>
        )}
        {!studentSearchLoading && isMobile &&(
          <SAEButton
            variant="outlined"
            onClick={handleStudentSearch}
            fullWidth
            disabled={disabled}
          >
           Buscar
          </SAEButton>
        )}
      </Grid>
    </Grid>
  );

}
