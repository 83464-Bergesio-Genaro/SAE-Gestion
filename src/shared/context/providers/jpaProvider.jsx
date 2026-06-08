import {useState, useEffect } from "react";
import { JPAContext } from "../sharedContext"; 
import { ObtenerEventosPublicos } from "../../../api/JPAService";

export function JPAProvider({ children }) {
  const [eventosJPA, setEventosJPA] = useState([]);
  useEffect(() => {
    const ObtenerEventosPublicosApi = async () => {
      try {
        const data = await ObtenerEventosPublicos();
        setEventosJPA(data);
      } catch (error) {
        console.error("Error al traer Eventos:", error);
      }
    };
    ObtenerEventosPublicosApi();
  }, []);

  return (
    <JPAContext.Provider
      value={{
        eventosJPA
      }}
    >
      {children}
    </JPAContext.Provider>
  );
}