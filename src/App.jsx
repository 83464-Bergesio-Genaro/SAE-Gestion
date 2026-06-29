import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './shared/context/providers/authProvider';
import { ThemeProvider } from '@mui/material/styles';
import { theme, applyCssVariables } from './config/theme';

import MainLayout from "./shared/components/layout/MainLayout";

import SharedMain from "./shared/pages/home/main";
import Login from "./shared/pages/login/login"; 
import SharedJPA from "./shared/pages/jpa/jpaShared"; 
import SharedJPASistemas from "./shared/pages/jpa/degrees/systems";
import SharedJPAQuimica from "./shared/pages/jpa/degrees/chemical";
import SharedJPACivil from "./shared/pages/jpa/degrees/civil";
import SharedJPAElectric from "./shared/pages/jpa/degrees/electrical";
import SharedJPAElectrical from "./shared/pages/jpa/degrees/electrical";
import SharedJPAIndustrial from "./shared/pages/jpa/degrees/industrial";
import SharedJPAMecanic from "./shared/pages/jpa/degrees/mecanic";
import SharedJPAMetalurgic from "./shared/pages/jpa/degrees/metalurgic";
import SharedJPAParticipar from "./shared/pages/jpa/participar";
import ComponentLab from "./shared/pages/lab/ComponentLab";

import EmployedMain from "./employed/pages/main";
import EmployedSports from "./employed/pages/sports/EmployedSports";
import EmployedScholarships from "./employed/pages/scholarships/Scholarships";
import TorneoDetalle from "./employed/pages/sports/TorneoDetalle";
import { SportsProvider } from "./employed/context/providers/sportsProvider";
import EmployedJPA from "./employed/pages/jpa/EmployedJPA";
import EmployedHealth from "./employed/pages/health/EmployedHealth";
import TurnBoardHealth from "./employed/pages/health/HealthTurns";
import AdministrarPrensa from "./employed/pages/prensa/AdministrarPrensa";
import EmployedConsultations from "./employed/pages/consultations/EmployedConsultations";
import UsuariosAdmin from "./employed/pages/users/EmployedAdmin";
import EmployedTravels from './employed/pages/travels/employedTravels';
import EmployedPurchases from './employed/pages/purchases/employedPurchases';
import AdminReport from './employed/pages/reports/adminReports';

import StudentMain from "./students/pages/main";
import StudentSports from "./students/pages/sports/StudentSports";
import Scholarships from "./students/pages/scholarships/Scholarships";
import StudentHealth from "./students/pages/health/healthStudent";
import StudentTravels from './students/pages/trips/studentTravels';
import MyProfile from './students/pages/profile/Profile';
import StudentConsultations from "./students/pages/consultations/StudentConsultations";
import ProtectedRoute from "./shared/auth/ProtectedRoute"; 

import { appConfig } from "./config/appConfig";
import "./index.css";
import EmployedTravelInscripts from './employed/pages/travels/employedInscripts';
export default function App() {
  
  // 1. Calculamos el basename dinámico para que Docker use cualquier subruta
  const routerBaseName = import.meta.env.BASE_URL === '/' 
    ? '/' 
    : import.meta.env.BASE_URL.replace(/\/$/, '');
  
  useEffect(() => {
    applyCssVariables();
  }, []);

  // 2. Efecto para inicializar los colores del tema
  useEffect(() => {
    const themeColors = appConfig.themes["light"];
    Object.keys(themeColors).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, themeColors[key]);
    });
  }, []);

  // 3. Declaración de la estructura del árbol de rutas por objetos
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />, // El Layout envuelve de forma persistente a todas las rutas hijas
      children: [
        /* === PUBLIC ROUTES === */
        {
          index: true, // Esto reemplaza al path: "/" (Ruta raíz por defecto)
          element: <SharedMain />
        },
        {
          path: "login", // NOTA: Quitamos la barra "/" inicial en los hijos para evitar conflictos relativos
          element: <Login />
        },
        {
          path: "JPA",
          element: <SharedJPA />
        },
        {
          path: "JPA/sistemas",
          element: <SharedJPASistemas />
        },
        {
          path: "JPA/quimica",
          element: <SharedJPAQuimica />
        },
        {
          path: "JPA/civil",
          element: <SharedJPACivil />
        },
        {
          path: "JPA/electrica",
          element: <SharedJPAElectric />
        },
        {
          path: "JPA/electronica",
          element: <SharedJPAElectrical />
        },
        {
          path: "JPA/industrial",
          element: <SharedJPAIndustrial />
        },
        {
          path: "JPA/mecanica",
          element: <SharedJPAMecanic />
        },
        {
          path: "JPA/metalurgica",
          element: <SharedJPAMetalurgic />
        },
        {
          path: "JPA/participar",
          element: <SharedJPAParticipar />
        },
        {
          path: "lab/componentes",
          element: <ComponentLab />
        },

        /* === EMPLOYED ROUTES === */
        {
          path: "Inicio",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <EmployedMain />
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-Deportes",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <EmployedSports />
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-Becas",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <EmployedScholarships />
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-Torneos/:id",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <SportsProvider autoLoad={false}>
                <TorneoDetalle />
              </SportsProvider>
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-JPA",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <EmployedJPA />
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-Salud",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <EmployedHealth />
            </ProtectedRoute>
          )
        },
                {
          path: "Gestion-Compras",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <EmployedPurchases />
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-Viajes",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <EmployedTravels />
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-Viajes/Inscriptos",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <EmployedTravelInscripts />
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-Salud/Turnos",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <TurnBoardHealth />
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-Prensa",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <AdministrarPrensa />
            </ProtectedRoute>
          )
        },        
        {
          path: "Gestion-Prensa/Administrar",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <AdministrarPrensa />
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-Usuarios",
          element: (
            <ProtectedRoute role={5}>
              <UsuariosAdmin />
            </ProtectedRoute>
          )
        },
        {
          path: "Gestion-Consultas",
          element: (
            <ProtectedRoute role={[2, 5]}>
              <EmployedConsultations />
            </ProtectedRoute>
          )
        },
        {
          path: "Reportes-Estadisticas",
          element: (
            <ProtectedRoute role={5}>
              <AdminReport />
            </ProtectedRoute>
          )
        },

        /* === STUDENT ROUTES === */
        {
          path: "Principal",
          element: (
            <ProtectedRoute role={1}>
              <StudentMain />
            </ProtectedRoute>
          )
        },
        {
          path: "Mis-Deportes",
          element: (
            <ProtectedRoute role={1}>
              <StudentSports />
            </ProtectedRoute>
          )
        },
        {
          path: "Mis-Becas",
          element: (
            <ProtectedRoute role={1}>
              <Scholarships />
            </ProtectedRoute>
          )
        },
        {
          path: "Mi-Salud",
          element: (
            <ProtectedRoute role={1}>
              <StudentHealth />
            </ProtectedRoute>
          )
        },
        {
          path: "Mi-Perfil",
          element: (
            <ProtectedRoute role={[1,2,5]}>
              <MyProfile />
            </ProtectedRoute>
          )
        },
        {
          path: "Mis-Viajes",
          element: (
            <ProtectedRoute role={1}>
              <StudentTravels />
            </ProtectedRoute>
          )
        },
        {
          path: "Consultas",
          element: (
            <ProtectedRoute role={1}>
              <StudentConsultations />
            </ProtectedRoute>
          )
        }
      ]
    }
  ], {
    basename: routerBaseName // Aquí se inyecta la subruta de forma global
  });

  // 4. El retorno es limpio y delegamos el control al RouterProvider moderno
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
            <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
    
  );
}
