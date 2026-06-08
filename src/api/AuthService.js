import { appConfig } from "../config/appConfig";

export default async function ObtenerTokenJWT(legajo, dominio, password) {
  try {

    const response = await fetch(
      `${appConfig.apiUrl}/api/Usuarios/ObtenerTokenJWT/${legajo}/${dominio}/${password}`,
      { headers: { "ngrok-skip-browser-warning": "true" } },
    );

    switch (response.status) {
      case 201: {
        const data = await response.json();
        return { success: true, data };
      }
      case 204:
        return {
          success: false,
          message: "Usuario no encontrado",
        };

      case 401:
        return {
          success: false,
          message: "Credenciales incorrectas",
        };

      case 409:
        return {
          success: false,
          message: "Conflicto en la sesión",
        };

      case 500:
        return {
          success: false,
          message: "Error interno del servidor",
        };

      default:
        return {
          success: false,
          message: "Respuesta desconocida",
        };
    }
  } catch (error) {
    console.log("Error: " + error);
    return {
      success: false,
      message: "Error no contemplado",
    };
  }
}

export async function ModificarUsuario(id, payload, token) {
  try {
    const response = await fetch(
      `${appConfig.apiUrl}/api/Usuarios/ModificarUsuario/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      }
    );
    switch (response.status) {
      case 200:
      case 201: {
        const data = await response.json();
        return { success: true, data };
      }
      case 400:
        return { success: false, message: "Datos inválidos" };
      case 401:
        return { success: false, message: "No autorizado" };
      case 404:
        return { success: false, message: "Usuario no encontrado" };
      case 500:
        return { success: false, message: "Error interno del servidor" };
      default:
        return { success: false, message: "Respuesta desconocida" };
    }
  } catch (error) {
    return { success: false, message: "Error de conexión ",error };
  }
}
