export const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDialogTitle = (entity, dialogMode) => {
  if (dialogMode === "create") return `Nuevo ${entity}`;
  if (dialogMode === "delete") return `Eliminar ${entity}`;
  return `Editar ${entity}`;
};
