export function validateCuil(raw) {
  const digits = raw.replace(/[-\s]/g, "");
  if (!/^\d{11}$/.test(digits)) return false;
  const series = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = series.reduce((acc, w, i) => acc + w * Number(digits[i]), 0);
  const rem = 11 - (sum % 11);
  const check = rem === 11 ? 0 : rem;
  if (rem === 10) return false;
  return check === Number(digits[10]);
}

export function validateNombreApellido(value, label) {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  if (!value.trim()) return `${label} es obligatorio`;
  if (value.trim().length < 2) return "Debe tener al menos 2 caracteres";
  if (!nameRegex.test(value.trim())) return "Solo se permiten letras y espacios";
  return null;
}

export function validateFechaNacimiento(value) {
  if (!value) return "La fecha de nacimiento es obligatoria";
  const birth = new Date(value);
  const today = new Date();
  const age =
    today.getFullYear() -
    birth.getFullYear() -
    (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
  if (birth >= today) return "La fecha debe ser anterior a hoy";
  if (age < 18) return "El docente debe ser mayor de 18 años";
  if (age > 100) return "La fecha ingresada no es válida";
  return null;
}

export function validateDocente(data, mode) {
  const errors = {};

  if (mode === "create") {
    if (!data.cuil.trim()) {
      errors.cuil = "El CUIL es obligatorio";
    } else if (!validateCuil(data.cuil.trim())) {
      errors.cuil = "El CUIL ingresado no es válido";
    }
  }

  const nombresError = validateNombreApellido(data.nombres, "El nombre");
  if (nombresError) errors.nombres = nombresError;

  const apellidosError = validateNombreApellido(data.apellidos, "El apellido");
  if (apellidosError) errors.apellidos = apellidosError;

  const fechaError = validateFechaNacimiento(data.fecha_nacimiento);
  if (fechaError) errors.fecha_nacimiento = fechaError;

  return errors;
}

export function validateEspacio(data) {
  const errors = {};

  if (!data.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio";
  } else if (data.nombre.trim().length < 2) {
    errors.nombre = "Debe tener al menos 2 caracteres";
  }

  if (!data.domicilio.trim()) {
    errors.domicilio = "El domicilio es obligatorio";
  } else if (data.domicilio.trim().length < 5) {
    errors.domicilio = "Ingresá un domicilio válido";
  }

  if (data.url_maps.trim()) {
    try {
      const url = new URL(data.url_maps.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        errors.url_maps = "La URL debe comenzar con http:// o https://";
      }
    } catch {
      errors.url_maps = "La URL ingresada no es válida";
    }
  }

  return errors;
}

export function validateDeportista(data, mode) {
  const errors = {};

  if (mode === "create") {
    if (!data.legajo.toString().trim()) {
      errors.legajo = "El legajo es obligatorio";
    } else if (!/^[a-zA-Z0-9]+$/.test(data.legajo.toString().trim())) {
      errors.legajo = "El legajo solo puede contener letras y números";
    }
  }

  if (data.vencimiento_ficha) {
    const fecha = new Date(data.vencimiento_ficha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (fecha < today) {
      errors.vencimiento_ficha = "La ficha ya está vencida";
    }
  } else {
    errors.vencimiento_ficha = "El vencimiento de ficha es obligatorio";
  }

  return errors;
}

export function validateDeporte(data) {
  const errors = {};

  if (!data.nombre.trim()) {
    errors.nombre = "El nombre del deporte es obligatorio";
  } else if (data.nombre.trim().length < 2) {
    errors.nombre = "Debe tener al menos 2 caracteres";
  }

  return errors;
}
