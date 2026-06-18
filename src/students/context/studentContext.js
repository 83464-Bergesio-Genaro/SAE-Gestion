import { createContext, useContext } from "react";

export const HealthContext = createContext(null);
export const ProfileContext = createContext(null);
export const ScholarshipsContext = createContext(null);
export const SportsContext = createContext(null);
export const ConsultationContext = createContext(null);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error("useHealth debe usarse dentro de un HealthProvider");
  }
  return context;
};

export const useMyProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useMyProfile debe usarse dentro de un ProfileProvider");
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
  // 2. Consume SportsContext (con "s")
  const context = useContext(ConsultationContext);

  if (!context) {
    throw new Error(
      "useConsultationContext debe usarse dentro de un ConsultationProvider",
    );
  }
  return context;
};
