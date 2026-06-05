import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  ObtenerPerfilXLegajo,
  ModificarPerfilEstudiante,
} from "../../../api/EstudianteService";
import { mapEstudiante } from "../../../api/formatters/EstudianteFormatters";
const ProfileContext = createContext();

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value);

const isValidPhone = (value) => value.replace(/\D/g, "").length === 12;

const isValidAddress = (value) => {
  const parts = value.split(/\s+-\s+/);
  return parts.length === 4
    && parts.every((part) => part.trim() !== "")
    && /^\d+$/.test(parts[3]);
};

const REQUIRED_FIELDS = [
  ["legajo", "Legajo"],
  ["nombres", "Nombres"],
  ["apellidos", "Apellidos"],
  ["dni", "DNI"],
  ["cuil", "CUIL"],
  ["fecha_nacimiento", "Fecha de nacimiento"],
  ["email", "Correo electrónico"],
  ["telefono", "Teléfono"],
  ["direccion", "Dirección"],
];

export const ProfileContextProvider = ({ children }) => {
  const [formError, setFormError] = useState(null);
  // Estados de Notificación
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  //ESTADOS
  const [datosPerfil, setDatosPerfil] = useState([]);
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [saveAttempted, setSaveAttempted] = useState(false);

  const fetchDatosPerfil = useCallback(async (legajo) => {
    if (!legajo) return;
    setLoadingPerfil(true);

    try {
      let data = await ObtenerPerfilXLegajo(legajo);
      console.log("Datos obtenidos del perfil:", data);
      setDatosPerfil(mapEstudiante(data));
      setSaveAttempted(false);
    } catch {
      setDatosPerfil([]);
    } finally {
      setLoadingPerfil(false);
    }
  }, []);

  useEffect(() => {
    fetchDatosPerfil();
  }, [fetchDatosPerfil]);

  const cleanField = (field) => {
    if (field === null || field === undefined) return null;

    const cleaned = String(field).trim();
    return cleaned === "" ? null : cleaned;
  };
  const cleanNumericField = (field) => {
    const cleaned = cleanField(field);
    return cleaned ? cleaned.replace(/\D/g, "") : null;
  };
  const handleProfileSave = async () => {
    setSaveAttempted(true);
    setFormError("");

    const camposFaltantes = REQUIRED_FIELDS.filter(
      ([field]) => !cleanField(datosPerfil[field]),
    ).map(([, label]) => label);

    if (camposFaltantes.length > 0) {
      setFormError(`Completá todos los campos. Faltan: ${camposFaltantes.join(", ")}.`);
      return;
    }

    const email = cleanField(datosPerfil.email);
    const telefono = cleanField(datosPerfil.telefono);
    const direccion = cleanField(datosPerfil.direccion);
    const dni = cleanNumericField(datosPerfil.dni);
    const cuil = cleanNumericField(datosPerfil.cuil);

    if (dni.length !== 8) {
      setFormError("El DNI debe tener exactamente 8 dígitos.");
      return;
    }

    if (cuil.length !== 11) {
      setFormError("El CUIL debe tener exactamente 11 dígitos.");
      return;
    }

    if (email && !isValidEmail(email)) {
      setFormError("Ingresá un correo electrónico válido.");
      return;
    }

    if (telefono && !isValidPhone(telefono)) {
      setFormError("Completá el teléfono con el formato +54 351 123-4567.");
      return;
    }

    if (direccion && !isValidAddress(direccion)) {
      setFormError("Completá provincia, ciudad/localidad, calle y altura.");
      return;
    }

    setLoadingPerfil(true);
    try {
      const body = {
        legajo: cleanField(datosPerfil.legajo),
        nombres: cleanField(datosPerfil.nombres),
        apellidos: cleanField(datosPerfil.apellidos),
        email,
        telefono,
        fecha_nacimiento: cleanField(datosPerfil.fecha_nacimiento),
        cuil,
        dni,
        direccion,
      };
      await ModificarPerfilEstudiante(datosPerfil.legajo, body);

      setSnackbarMsg("Sus datos fueron modificados correctamente!");
      setSnackbarOpen(true);
    } catch (err) {
      setFormError(err.message || "Ocurrió un error al guardar");
    } finally {
      setLoadingPerfil(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        fetchDatosPerfil,
        datosPerfil,
        loadingPerfil,
        setDatosPerfil,
        handleProfileSave,
        //Valores de error, mostrar mensajes, etc.
        snackbarOpen,
        setSnackbarOpen,
        snackbarMsg,
        setFormError,
        formError,
        saveAttempted,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useHealthUser debe usarse dentro de HealthProvider");
  return context;
};
