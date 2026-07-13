import { createContext, useContext } from "react";

export const HealthContext = createContext(null);
export const ScholarshipsContext = createContext(null);
export const SportsContext = createContext(null);
export const ConsultationContext = createContext(null);
export const TravelContext = createContext(null);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error("useHealth debe usarse dentro de un HealthProvider");
  }
  return context;
};

export const useScholarships = () => {
  const context = useContext(ScholarshipsContext);
  if (!context) {
    throw new Error(
      "useScholarships debe usarse dentro de un ScholarshipsProvider",
    );
  }
  return context;
};

export const useSportsContext = () => {
  // 2. Consume SportsContext (con "s")
  const context = useContext(SportsContext);

  if (!context) {
    throw new Error("useSportsContext debe usarse dentro de un SportsProvider");
  }
  return context;
};

export const useConsultationContext = () => {

  const context = useContext(ConsultationContext);

  if (!context) {
    throw new Error(
      "useConsultationContext debe usarse dentro de un ConsultationProvider",
    );
  }
  return context;
};
export const useTravel = () => {

  const context = useContext(TravelContext);

  if (!context) {
    throw new Error(
      "useTravel debe usarse dentro de un TravelProvider",
    );
  }
  return context;
};
