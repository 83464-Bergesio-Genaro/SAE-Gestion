import { createContext, useContext } from 'react';

export const AuthContext = createContext(null);
export const NotificationContext = createContext(null);
export const PressContext = createContext(null);
export const JPAContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  }
  return context;
};

export const usePress = () => {
  const context = useContext(PressContext);
  if (!context) {
    throw new Error('usePress debe usarse dentro de un PressProvider');
  }
  return context;
};

export const useJPA = () => {
  const context = useContext(JPAContext);
  if (!context) {
    throw new Error('useJPA debe usarse dentro de un JPAProvider');
  }
  return context;
};