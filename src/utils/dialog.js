import { useState } from 'react';

export const useDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [dialogType, setDialogType] = useState("");
  const [dialogMode, setDialogMode] = useState("");
  const [dialogError, setDialogError] = useState(null);
  const [dialogSaving, setDialogSaving] = useState(false);

  // Función helper para actualizar campos específicos de dialogData
  const handleDataChange = (field, value) => {
    setDialogData((prev) => ({ ...prev, [field]: value }));
  };

  // Funciones de utilidad para acciones comunes
  const openDialog = (type, mode, initialData = {}) => {
       if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
    }
    setDialogType(type);
    setDialogMode(mode);
    setDialogData(initialData);
    setDialogError(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogData({});
    setDialogError(null);
  };

  return {//Todos los componentes funcionan con esto
    dialogOpen, dialogData, dialogType, dialogMode, dialogError, dialogSaving,
    setDialogOpen, setDialogData, setDialogType, setDialogMode, setDialogError, setDialogSaving,
    handleDataChange,
    openDialog,
    closeDialog
  };
};   
