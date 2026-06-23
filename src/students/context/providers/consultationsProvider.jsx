import {
  ContarVisualizacionLinkFrecuente,
  BuscarLinkFrecuentes,
} from "../../../api/EmpleadoService";
import { ConsultationContext } from "../studentContext";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "../../../shared/context/sharedContext";
import { sendConsultationEmail } from "../../../api/EmailService";

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value.trim());

const generateRows = (data) => {
  return [...data]
    .sort((a, b) => a.id - b.id) 
    .map((item, index) => ({
      id: item.id || index,
      ...item,
    }));
};

export const ConsultationAlumnoProvider = ({ children }) => {
  const { user } = useAuth();
  const [loadingLinksFrecuentes, setLoadingLinksFrecuentes] = useState(false);
  const [linksFrecuentes, setLinksFrecuentes] = useState([]);
  const [linksFrecuentesRows, setLinksFrecuentesRows] = useState([]);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    user_name: user?.nombre ?? "",
    user_email: user?.email ?? "",
    subject: "",
    message: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback((message, severity = "warning") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const invalidFields = useMemo(() => {
    const fields = [];
    if (!form.user_name.trim()) fields.push("user_name");
    if (!isValidEmail(form.user_email)) fields.push("user_email");
    if (!form.subject.trim()) fields.push("subject");
    if (!form.message.trim()) fields.push("message");
    return fields;
  }, [form]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const fetchLinksFrecuentes = useCallback(async () => {
    setLoadingLinksFrecuentes(true);
    try {
      let data = await BuscarLinkFrecuentes();
      const links = Array.isArray(data) ? data : [];
      setLinksFrecuentes(
        links
          .filter((link) => link.activo !== false)
          .sort((a, b) => Number(a.id) - Number(b.id)),
      );
      setLinksFrecuentesRows(generateRows(links));
    } catch {
      setLinksFrecuentes([]);
      setLinksFrecuentesRows([]);
    } finally {
      setLoadingLinksFrecuentes(false);
    }
  }, []);

  const handleLinkFrecuenteClick = async (event, link) => {
    if (!link.hipervinculo) {
      event.preventDefault();
      showSnackbar("Este link no tiene hipervinculo configurado");
      return;
    }

    try {
      await ContarVisualizacionLinkFrecuente(link.id);
    } catch (error) {
      console.error("Error al contar visualizacion del link:", error);
    }
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (invalidFields.length > 0) {
        showSnackbar("Completá todos los campos con un correo válido.");
        return;
      }

      try {
        setSending(true);
        await sendConsultationEmail({
          user_name: form.user_name,
          user_email: form.user_email,
          subject: `[Consulta SAE] ${form.subject.trim()}`,
          message: form.message.trim(),
          legajo: user?.legajo,
        });
        showSnackbar("Consulta enviada con éxito.", "success");
        setForm((prev) => ({ ...prev, subject: "", message: "" }));
      } catch (error) {
        console.error("Error al enviar consulta:", error);
        showSnackbar(
          "No se pudo enviar la consulta. Intentá nuevamente.",
          "error",
        );
      } finally {
        setSending(false);
      }
    },
    [form, invalidFields.length, showSnackbar, user?.legajo],
  );

  useEffect(() => {
    fetchLinksFrecuentes();
  }, [fetchLinksFrecuentes]);

  return (
    <ConsultationContext.Provider
      value={{
        fetchLinksFrecuentes,
        loadingLinksFrecuentes,
        linksFrecuentes,
        linksFrecuentesRows,
        form,
        sending,
        handleChange,
        handleSubmit,
        handleLinkFrecuenteClick,
        snackbar,
        closeSnackbar,
        showSnackbar,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};
