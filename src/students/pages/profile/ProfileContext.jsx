import React, { createContext, useContext, useState, useCallback, useEffect,useMemo } from 'react';
import { Box, IconButton, Chip } from '@mui/material';

import { ObtenerPerfilXLegajo,ModificarPerfilEstudiante } from '../../../api/EstudianteService';
import {mapEstudiante} from '../../../api/formatters/EstudianteFormatters';
const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
        const [formError, setFormError] = useState(null);
        // Estados de Notificación
        const [snackbarOpen, setSnackbarOpen] = useState(false);
        const [snackbarMsg, setSnackbarMsg] = useState("");

        //ESTADOS
        const [datosPerfil, setDatosPerfil] = useState([]);
        const [loadingPerfil, setLoadingPerfil] = useState(false);

        const fetchDatosPerfil = useCallback(async (legajo) => {
            if(!legajo)return;
            setLoadingPerfil(true);
            
            try {
                
                let data = await ObtenerPerfilXLegajo(legajo);
                
                setDatosPerfil(mapEstudiante(data));
            } catch {
                setDatosPerfil([]);
            } 
            finally{
                setLoadingPerfil(false);
            }
        }, []);
    
        useEffect(() => {
            fetchDatosPerfil();
        }, [fetchDatosPerfil]);

        const cleanField = (field) => {
            if(field){
                if(field.trim() === "")return null;
                else return field.trim();
            }
            else return null;
        
        };
        const handleProfileSave = async () => {
            setLoadingPerfil(true);
            setFormError("");
            try {
                const body = {
                    "legajo": cleanField(datosPerfil.legajo),
                    "nombres": cleanField(datosPerfil.nombres),
                    "apellidos": cleanField(datosPerfil.apellidos),
                    "email":cleanField(datosPerfil.email),
                    "telefono": cleanField(datosPerfil.telefono),
                    "fecha_nacimiento":cleanField(datosPerfil.fecha_nacimiento),
                    "cuil": cleanField(datosPerfil.cuil),
                    "dni":cleanField( datosPerfil.dni),
                    "direccion":cleanField( datosPerfil.direccion)
                    }
                await ModificarPerfilEstudiante(datosPerfil.legajo,body);
                    

                setSnackbarMsg("Sus datos fueron modificados correctamente!");
                setSnackbarOpen(true);
            } catch (err) {
                setFormError(err.message || "Ocurrió un error al guardar");
            } finally {
                setLoadingPerfil(false);
            }
            };

        return (
        <ProfileContext.Provider value={{
            fetchDatosPerfil,datosPerfil,loadingPerfil,setDatosPerfil,handleProfileSave,
            //Valores de error, mostrar mensajes, etc.
            snackbarOpen, setSnackbarOpen,snackbarMsg, setFormError,
             formError
            
        }}>
            {children}
        </ProfileContext.Provider>
    );
}

export const useProfileContext = () => {
    const context = useContext(ProfileContext);
    if (!context) throw new Error("useHealthUser debe usarse dentro de HealthProvider");
    return context;
};