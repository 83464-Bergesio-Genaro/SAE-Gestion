import { appConfig } from "../config/appConfig";

export default async function ObtenerTokenJWT(legajo, dominio, password) {

try {
console.log(`${appConfig.apiUrl}/api/Usuarios/ObtenerTokenJWT/${legajo}/${dominio}/${password}`);
const response = await fetch(
    `${appConfig.apiUrl}/api/Usuarios/ObtenerTokenJWT/${legajo}/${dominio}/${password}`
  );
  console.log(response);
 switch (response.status) {

    case 201:
    {
        const data = await response.json();
        return { success: true, data };
    }
    case 204:

      return {
        success: false,
        message: "Usuario no encontrado"
      };

    case 401:

      return {
        success: false,
        message: "Credenciales incorrectas"
      };

    case 409:

      return {
        success: false,
        message: "Conflicto en la sesión"
      };

    case 500:

      return {
        success: false,
        message: "Error interno del servidor"
      };

    default:

      return {
        success: false,
        message: "Respuesta desconocida"
      };
  }
} catch (error) {
    console.log("Error: "+error)
}


}