import { useState } from 'react';
import { isEmpty } from './text.utils';

export const useDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({});
  const [dialogType, setDialogType] = useState("");
  const [dialogMode, setDialogMode] = useState("");
  const [dialogError, setDialogError] = useState(null);
  const [dialogSaving, setDialogSaving] = useState(false);

  const handleDataChange = (field, value, options = {}) => {
    const previousValue = dialogData[field];
    
    // 1. Evita renderizados innecesarios si el valor no cambió
    const emptyEquivalent = isEmpty(previousValue) && isEmpty(value);
    if (previousValue === value || emptyEquivalent) return;

    // 2. Actualiza los datos locales del diálogo
    setDialogData((prev) => ({ ...prev, [field]: value }));

    // Extraction de los controladores opcionales desde las opciones
    const { setTouched, setErrors, validateFn } = options;

    // 3. Ejecuta la lógica externa solo si se pasaron los controladores
    if (setTouched && setErrors && validateFn) {
      setTouched((previous) => ({ ...previous, [field]: true }));

      setErrors((previous) => {
        const nextData = { ...dialogData, [field]: value };
        return {
          ...previous,
          [field]: validateFn(field, value, nextData)
        };
      });
    }
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
