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
   const headers = { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" };
   if (token) headers["Authorization"] = `Bearer ${token}`;
   const options = { method, headers };
   if (body) options.body = JSON.stringify(body);
   return options;
 }
 
 export async function RequestAPI(endpoint,action, body=null) {
   const res = await fetch(
     appConfig.apiUrl+ endpoint,
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
   return res.json();
 }
 export async function ObtenerEspecialidadesActivas(){
    return RequestAPI('/api/Salud/ObtenerEspecialidadesActivas/',"GET");
 }