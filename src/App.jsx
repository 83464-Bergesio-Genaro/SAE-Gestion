import { useEffect } from "react";
import { appConfig } from "./config/appConfig";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./shared/auth/AuthContext";
import ProtectedRoute from "./shared/auth/ProtectedRoute";
import MainLayout from "./shared/components/layout/MainLayout";

import Login from "./shared/pages/login/login";
import SharedMain from "./shared/pages/home/main";
import SharedJPA from "./shared/pages/jpa/jpa";
import EmployedMain from "./employed/pages/main/";
import StudentMain from "./students/pages/main";

import EmployedSports from "./employed/pages/sports/EmployedSports";
import StudentSports from "./students/pages/sports/StudentSports";

import Scholarships from "./students/pages/scholarships/Scholarships";
import EmployedScholarships from "./employed/pages/scholarships/Scholarships";
import SharedJPASistemas from "./shared/pages/degrees/systems";
import SharedJPAQuimica from "./shared/pages/degrees/chemical";
import SharedJPACivil from "./shared/pages/degrees/civil";
import SharedJPAElectric from "./shared/pages/degrees/electric";
import SharedJPAElectrical from "./shared/pages/degrees/electrical";
import SharedJPAIndustrial from "./shared/pages/degrees/industrial";
import SharedJPAMecanic from "./shared/pages/degrees/mecanic";
import SharedJPAMetalurgic from "./shared/pages/degrees/metalurgic";
import SharedJPAParticipar from "./shared/pages/jpa/participar";
import AdministrarPrensa from "./employed/pages/prensa/AdministrarPrensa";
import Prensa from "./shared/pages/prensa/Prensa";
import ComponentLab from "./shared/pages/lab/ComponentLab";

export default function App() {
  useEffect(() => {
    const themeColors = appConfig.themes["light"];
    Object.keys(themeColors).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, themeColors[key]);
    });
  }, []);
  return (
    <AuthProvider>
      <HashRouter>
        <MainLayout>
          <Routes>
            {/* Public */}
            <Route path="/" element={<SharedMain />} />
            <Route path="/login" element={<Login />} />
            <Route path="/JPA" element={<SharedJPA />} />
            <Route path="/JPA/sistemas" element={<SharedJPASistemas />} />
            <Route path="/JPA/quimica" element={<SharedJPAQuimica />} />
            <Route path="/JPA/civil" element={<SharedJPACivil />} />
            <Route path="/JPA/electrica" element={<SharedJPAElectric />} />
            <Route path="/JPA/electronica" element={<SharedJPAElectrical />} />
            <Route path="/JPA/industrial" element={<SharedJPAIndustrial />} />
            <Route path="/JPA/mecanica" element={<SharedJPAMecanic />} />
            <Route path="/JPA/metalurgica" element={<SharedJPAMetalurgic />} />
            <Route path="/JPA/participar" element={<SharedJPAParticipar />} />
            <Route path="/Prensa" element={<Prensa />} />
            <Route path="/lab/componentes" element={<ComponentLab />} />

            {/* EMPLOYED */}
            <Route
              path="/Inicio"
              element={
                <ProtectedRoute role={[2, 5]}>
                  <EmployedMain />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Gestion-Deportes"
              element={
                <ProtectedRoute role={[2, 5]}>
                  <EmployedSports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Gestion-Becas"
              element={
                <ProtectedRoute role={[2, 5]}>
                  <EmployedScholarships />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Gestion-Prensa"
              element={
                <ProtectedRoute role={5}>
                  <AdministrarPrensa />
                </ProtectedRoute>
              }
            />

            {/* STUDENTS */}
            <Route
              path="/Principal"
              element={
                <ProtectedRoute role={1}>
                  <StudentMain />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Mis-Deportes"
              element={
                <ProtectedRoute role={1}>
                  <StudentSports />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Mis-Becas"
              element={
                <ProtectedRoute role={1}>
                  <Scholarships />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MainLayout>
      </HashRouter>
    </AuthProvider>
  );
}
