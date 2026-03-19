import { appConfig } from "../config/appConfig";
import { mapPublicacionPublica } from "../api/formatters/PrensaFormatter";

export async function ObtenerNoticiasPublicas(){
    try {
        const response = await fetch(`${appConfig.apiUrl}/api/Prensa/ListarPublicacionesActivas`);
        
        switch (response.status) {

            case 200:
                {
                    const data = await response.json();
                    let  listaPublicaciones =data.map(mapPublicacionPublica);
                    //Se ordena el listado obtenido de acuerdo a su prioridad
                    listaPublicaciones=[...listaPublicaciones].sort((a, b) => b.prioridad - a.prioridad);
                    return {success:true,data:listaPublicaciones,message:""};
                }
            case 204:
                return {
                    success: false,
                    data:[],
                    message: "No hay publicaciones a listar"
                };
            case 400:
                return {
                    success: false,
                    data:null,
                    message: "Se envio parametros a una vista"
                };
            case 401:

                return {
                    success: false,
                    data:null,
                    message: "Paso a usar JWT el endpoint"
                };

            case 409:
                return {
                    success: false,
                    data:null,
                    message: "Conflicto en la base de datos"
                };

            case 500:
                return {
                    success: false,
                    data:null,
                    message: "Error interno del servidor"
                };

        default:

            return {
                success: false,
                data:null,                
                message: "Respuesta desconocida"
            };
        }        
    } catch (error) {
        console.log("Error: "+error)
        return {
          success: false,
          data:null,
          message: "Error no contemplado"
        };        
    }
}
export function getDownloadUrl(id){
console.log(`${appConfig.apiUrl}/api/Prensa/DescargarDocumentoXId/${id}`);
  return `${appConfig.apiUrl}/api/Prensa/DescargarDocumentoXId/${id}`;

}