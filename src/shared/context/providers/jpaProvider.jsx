import {useState, useEffect ,useCallback} from "react";
import { JPAContext } from "../sharedContext"; 
import { ObtenerEventosPublicos } from "../../../api/JPAService";

export function JPAProvider({ children }) {
  const [eventosJPA, setEventosJPA] = useState([]);
  const [loadingEventos, setLodingEventos] = useState(false);

  const fetchEventosSAE = useCallback(async () => {
      setLodingEventos(true);
      try {
          const data = await ObtenerEventosPublicos();
          
          setEventosJPA(data);
      } catch(error) {
          setEventosJPA([]);
          console.error("Error al traer Eventos:", error);
      }
      finally{
          setLodingEventos(false);
      }
  }, [])
  useEffect(() => { fetchEventosSAE(); }, [fetchEventosSAE]);

  return (
    <JPAContext.Provider
      value={{
        eventosJPA,loadingEventos
      }}
    >
      {children}
    </JPAContext.Provider>
  );
}