import { createContext, useContext } from "react";

export const HealthContext = createContext(null);
export const JPAContext = createContext(null);
export const EmployContext = createContext(null);
export const ScholarshipContext = createContext(null);
export const PressContext = createContext(null);
export const ConsultationContext = createContext(null);

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error("useHealth debe usarse dentro de un HealthProvider");
  }
  return context;
};
export const useJPA = () => {
  const context = useContext(JPAContext);
  if (!context) {
    throw new Error("useJPA debe usarse dentro de un JPAProvider");
  }
  return context;
};

export const useEmploy = () => {
  const context = useContext(EmployContext);
  if (!context) {
    throw new Error("useEmploy debe usarse dentro de un EmployProvider");
  }
  return context;
};

export const useScholarships = () => {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error(
      "useScholarships debe usarse dentro de un ScholarshipProvider",
    );
  }
  return context;
};

export const usePress = () => {
  const context = useContext(PressContext);
  if (!context) {
    throw new Error("usePress debe usarse dentro de un PressProvider");
  }
  return context;
};

export const useConsultations = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error(
      "useConsultations debe usarse dentro de un ConsultationProvider",
    );
  }
  return context;
};
