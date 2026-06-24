 import { appConfig } from "../config/appConfig";
 import { Await } from "react-router-dom";
 export const URLApiCotroller = `${appConfig.apiUrl}/api/JPA`;

 function getToken() {
   const stored = localStorage.getItem("session");
   if (!stored) return null;
   const parsed = JSON.parse(stored);
   if (Date.now() > parsed.expiration) {
     localStorage.removeItem("session");
     return null;
   }
   return parsed.token;
 }
 
function getHeaders(method, body) {
  const token = getToken();
  
  const headers = { 
    "ngrok-skip-browser-warning": "true" 
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };

  if (body) {
    if (body instanceof FormData) {
      options.body = body; 
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  return options;
}

 export async function RequestAPI(endpoint,action, body=null,id=null) {

   const res = await fetch(
     appConfig.apiUrl+endpoint,
     getHeaders(action, body),
   ); 

   if(res.ok && action === "DELETE") return res; // Para DELETE no esperamos un body, por lo que no intentamos parsear la respuesta
   if(res.status === 204 && action === "GET") return []; // Para GET, si el status es 204 (No Content) devolvemos un array vacío para evitar errores al mapear la respuesta
   if (!res.ok) {
     let detail = `Error ${res.status}`;
     try {
       const json = await res.json();
       if (json.title) detail = `${json.title} (${res.status})`;
       else if (json.message) detail = json.message;
     } catch {
       /* ignore */
     }
     throw new Error(detail);
   }
  const contentType = (res.headers.get("Content-Type") || "").toLowerCase();

    if (contentType.includes("application/json")) {
      return res.json();
    }

    if (
      contentType.startsWith("image/") ||
      contentType.includes("application/pdf")
    ) {
      const blob = await res.blob();
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const disposition = res.headers.get("Content-Disposition") || "";
      const fileNameMatch = disposition.match(
        /filename\*?=(?:UTF-8''|"?)([^";]+)/i,
      );
      const fileName = fileNameMatch?.[1]
        ? decodeURIComponent(fileNameMatch[1].replace(/"/g, ""))
        : "documento";
      const extension = contentType.includes("application/pdf")
        ? "pdf"
        : contentType.split("/")[1] || "jpg";

      return {
        id,
        nombre_documento: fileName,
        datos_documento: dataUrl,
        extension,
      };
    }

    throw new Error("Formato de respuesta no soportado");
 }

export async function ObtenerViajesXLegajo(legajo){
  return RequestAPI('/api/Viaje/ObtenerViajesXLegajo/'+encodeURIComponent(legajo),"GET");
}

export async function ObtenerViajesActivos(){
  return RequestAPI('/api/Viaje/ObtenerViajesActivo/',"GET");
}
export async function ModificarViaje(id, body) {
  return RequestAPI(
    "/api/Viaje/ModificarViaje/" + encodeURIComponent(id),
    "PUT",
    body,
  );
}
export async function CrearViaje(body){
  return RequestAPI(
  "/api/Viaje/CrearViaje",
  "POST",
  body,
  );
}

 export async function ObtenerDocumentacionViaje(id){
    return RequestAPI('/api/Viaje/ListarDocumentacionXViaje/'+ encodeURIComponent(id),"GET");
 }
 export async function listarDocumentacionXLegajo(legajo) {
   return RequestAPI(
     "/api/Estudiante/ListarDocumentacionXLegajo/" + encodeURIComponent(legajo),
     "GET",
   );
 }
 export async function DescargarDocumentacionXId(id){
   return RequestAPI('/api/Viaje/DescargarDocumentacionXId/'+ encodeURIComponent(id),"GET",null,id)
 }
export async function CrearDocumentoViaje(idViaje,idTipoDocumento,archivo) {
  const formData = new FormData();
  formData.append("archivo", archivo);

  return RequestAPI('/api/Viaje/CrearDocumentoViaje/'+encodeURIComponent(idViaje)+"/"+encodeURIComponent(idTipoDocumento),"POST",formData);
} 
export async function EliminarDocumentoViaje(id_archivo) {
  return RequestAPI(
    "/api/Viaje/EliminarDocumentoViaje/" +
      encodeURIComponent(id_archivo),
    "DELETE",
  );
}


export async function ObtenerEmpresas(){
    return RequestAPI('/api/Viaje/ObtenerEmpresasViaje/',"GET");
 }
export async function ModificarEmpresa(id, body) {
  return RequestAPI(
    "/api/Viaje/ModificarEmpresa/" + encodeURIComponent(id),
    "PUT",
    body,
  );
}
export async function CrearEmpresa(body){
  return RequestAPI(
  "/api/Viaje/CrearEmpresa",
  "POST",
  body,
  );
}

export async function ObtenerInscriptosViaje(idViaje){
  return RequestAPI('/api/Viaje/ObtenerInscriptosViaje/'+encodeURIComponent(idViaje),"GET");
}
export async function EliminarInscriptosViaje(idInscripto){
  return RequestAPI('/api/Viaje/EliminarInscriptos/'+encodeURIComponent(idInscripto),"DELETE");
}
export async function CrearInscriptoViaje(body){
  return RequestAPI(
  "/api/Viaje/CrearInscriptoViaje",
  "POST",
  body,
  );
}
export async function ModificarInscripto(id, body) {
  return RequestAPI(
    "/api/Viaje/ModificarInscripto/" + encodeURIComponent(id),
    "PUT",
    body,
  );
}