import { useContext } from "react";
import { SportsContext } from "./sports.context";

export function useSportsContext() {
  const context = useContext(SportsContext);

  if (!context) {
    throw new Error("useSportsContext debe usarse dentro de SportsProvider");
  }

  return context;
}
