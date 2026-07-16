import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
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
      onError?.("");

      const student = await onSearchStudent?.(
        `${studentId}@${careerSearch}.frc.utn.edu.ar`,
      );

      if (!student?.legajo) {
        onError?.("Alumno no encontrado");
        return;
      }

      setStudentSelected(student);
      onSelectStudent?.(student);
    } catch {
      setStudentSelected(null);
      onError?.("Alumno no encontrado");
    } finally {
      setStudentSearchLoading(false);
    }
  };

  const clearStudentSearch = () => {
    setStudentSelected(null);
    setCareerSearch("");
    onClearStudent?.();
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
          disabled={disabled}
        >
          Volver a buscar
        </SAEButton>
      </Box>
    );
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      alignItems={{ sm: "flex-start" }}
    >
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
      <Typography
        sx={{
          color: "text.secondary",
          fontWeight: 700,
          lineHeight: { sm: "56px" },
        }}
      >
        @
      </Typography>
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
      <Stack direction="row" alignItems="center" sx={{ minHeight: 56 }}>
        <Typography color="text.secondary" fontWeight={500} whiteSpace="nowrap">
          .frc.utn.edu.ar
        </Typography>
        {studentSearchLoading ? (
          <CircularProgress size={24} sx={{ ml: 1 }} />
        ) : (
          <IconButton
            onClick={handleStudentSearch}
            aria-label="Buscar alumno"
            disabled={disabled}
            variant="outlined"
          >
            <SearchIcon />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}
