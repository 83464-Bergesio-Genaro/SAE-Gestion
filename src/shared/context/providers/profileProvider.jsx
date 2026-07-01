import React, {
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  ObtenerPerfilXLegajo,
  ModificarPerfilEstudiante,
} from "../../../api/EstudianteService";
import { mapEstudiante } from "../../../api/formatters/EstudianteFormatters";
import { ProfileContext } from "../../../students/context/studentContext";
import { useAuth } from "../sharedContext";
import {
  cleanField,
  cleanNumericField,
  formatCuil,
  formatDni,
  formatPhone,
  getInitials,
  isEmpty,
  isValidAddress,
  isValidEmail,
  isValidPhone,
  onlyDigits,
  parseAddress,
  sanitizeAddressPart,
} from "../../../utils/util.jsx";

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
  const { user } = useAuth();
  const [formError, setFormError] = useState(null);
  // Estados de Notificación
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  //ESTADOS
  const [datosPerfil, setDatosPerfil] = useState({});
  const [loadingPerfil, setLoadingPerfil] = useState(false);
  const [saveAttempted, setSaveAttempted] = useState(false);

  const fetchDatosPerfil = useCallback(async (legajo) => {
    if (!legajo) return;
    setLoadingPerfil(true);

    try {
      let data = await ObtenerPerfilXLegajo(legajo);
      setDatosPerfil(mapEstudiante(data));
      setSaveAttempted(false);
    } catch {
      setDatosPerfil({});
    } finally {
      setLoadingPerfil(false);
    }
  }, []);

  useEffect(() => {
    fetchDatosPerfil(user?.legajo);
  }, [fetchDatosPerfil, user?.legajo]);

  const handleChange = useCallback((field, value) => {
    setDatosPerfil((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleMaskedChange = useCallback(
    (field, formatter) => (event) => {
      handleChange(field, formatter(event.target.value));
    },
    [handleChange],
  );

  const handleAddressChange = useCallback(
    (index, value) => {
      const parts = parseAddress(datosPerfil.direccion);
      parts[index] =
        index === 3 ? onlyDigits(value, 6) : sanitizeAddressPart(value);

      const hasAddressData = parts.some((part) => part.trim() !== "");
      handleChange("direccion", hasAddressData ? parts.join(" - ") : "");
    },
    [datosPerfil.direccion, handleChange],
  );

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

  const today = new Date().toLocaleDateString("en-CA");
  const addressParts = parseAddress(datosPerfil.direccion);
  const requiredError = (value) => saveAttempted && isEmpty(value);
  const emailHasError =
    requiredError(datosPerfil.email) ||
    (Boolean(datosPerfil.email) && !isValidEmail(datosPerfil.email));
  const phoneHasError =
    requiredError(datosPerfil.telefono) ||
    (Boolean(datosPerfil.telefono) && !isValidPhone(datosPerfil.telefono));
  const dniHasError =
    requiredError(datosPerfil.dni) ||
    (Boolean(datosPerfil.dni) &&
      onlyDigits(String(datosPerfil.dni), 9).length !== 8);
  const cuilHasError =
    requiredError(datosPerfil.cuil) ||
    (Boolean(datosPerfil.cuil) &&
      onlyDigits(String(datosPerfil.cuil), 12).length !== 11);
  const missingRequiredFields = [
    ["Legajo", datosPerfil.legajo],
    ["Nombres", datosPerfil.nombres],
    ["Apellidos", datosPerfil.apellidos],
    ["DNI", datosPerfil.dni],
    ["CUIL", datosPerfil.cuil],
    ["Fecha de nacimiento", datosPerfil.fecha_nacimiento],
    ["Correo electronico", datosPerfil.email],
    ["Telefono", datosPerfil.telefono],
    ["Provincia", addressParts[0]],
    ["Ciudad / Localidad", addressParts[1]],
    ["Nombre de la calle", addressParts[2]],
    ["Altura", addressParts[3]],
  ]
    .filter(([, value]) => isEmpty(value))
    .map(([label]) => label);

  return (
    <ProfileContext.Provider
      value={{
        fetchDatosPerfil,
        user,
        profileInitials: getInitials(user?.nombre),
        datosPerfil,
        loadingPerfil,
        setDatosPerfil,
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
        saveAttempted,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
