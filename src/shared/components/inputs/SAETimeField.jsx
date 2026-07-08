import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

dayjs.extend(customParseFormat);

function parseTime(time) {
  if (!time) return null;
  const timeText = String(time).slice(0, 5);
  const normalizedTime = timeText === "24:00" ? "23:59" : timeText;
  return dayjs(normalizedTime, "HH:mm", true);
}

export default function SAETimeField({
  label,
  value,
  onChange,
  minTime = "12:00", // Valor por defecto si no se pasa
  maxTime = "22:00", // Valor por defecto si no se pasa
  width = 130, // Ancho por defecto
  size = "small",
  fullWidth = false,
  disabled = false,
}) {
  const textFieldSize = size === "big" ? "medium" : size;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        ampm={false}
        // Usamos el formato estricto 'HH:mm' para evitar errores de parseo
        value={parseTime(value)}
        onChange={(nuevoValor) => {
          const horaFormateada =
            nuevoValor && nuevoValor.isValid()
              ? nuevoValor.format("HH:mm")
              : "";
          onChange?.(horaFormateada);
        }}
        timeSteps={{ minutes: 15 }}
        minTime={parseTime(minTime)}
        maxTime={parseTime(maxTime)}
        disabled={disabled}
        localeText={{
          cancelButtonLabel: "Volver",
          okButtonLabel: "Confirmar",
        }}
        slotProps={{
          textField: {
            size: textFieldSize,
            fullWidth,
            sx: fullWidth ? undefined : { width },
          },
          // Forzar la barra de botones en entornos de escritorio si es necesario
          actionBar: {
            actions: ["cancel", "accept"],
          },
        }}
      />
    </LocalizationProvider>
  );
}
