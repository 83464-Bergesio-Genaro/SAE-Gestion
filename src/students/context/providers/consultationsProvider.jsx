import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  ContarVisualizacionLinkFrecuente,
  BuscarLinkFrecuentes,
} from "../../../api/EmpleadoService";
import { isValidEmail } from "../../../utils/util.jsx";
import { sendConsultationEmail } from "../../../api/EmailService";
import { ConsultationContext } from "../studentContext";
import {useAuth,useNotification} from "../../../shared/context/sharedContext";
import { CONSULTATIONS_STRINGS } from "../../../utils/gena/student.string.js";

const C = CONSULTATIONS_STRINGS;
export const ConsultationAlumnoProvider = ({ children }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification(); //Permite mostrar notificaciones
  const [loadingLinksFrecuentes, setLoadingLinksFrecuentes] = useState(false);
  const [linksFrecuentes, setLinksFrecuentes] = useState([]);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    user_name: user?.nombre ?? "",
    user_email: user?.email ?? "",
    subject: "",
    message: "",
  });

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
    } catch {
      setLinksFrecuentes([]);
    } finally {
      setLoadingLinksFrecuentes(false);
    }
  }, []);

  const handleLinkFrecuenteClick = async (event, link) => {
    if (!link.hipervinculo) {
      event.preventDefault();
      useNotification(
        C.errorURL,
        "error",
        6000,
      );
      return;
    }

    try {
      await ContarVisualizacionLinkFrecuente(link.id);
    } catch (error) {
      useNotification(
        C.errorCount + error,
        "error",
        6000,
      );
    }
  };

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (invalidFields.length > 0) {
        useNotification(
          C.errorValidateSubmit,
          "warning",
        );
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
        useNotification(C.msgSubmit, "success");
        setForm((prev) => ({ ...prev, subject: "", message: "" }));
      } catch (error) {
        console.error("Error al enviar consulta:", error);
        useNotification(
          C.errorSubmit,
          "error",
        );
      } finally {
        setSending(false);
      }
    },
    [form, invalidFields.length, useNotification, user?.legajo],
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
        form,
        sending,
        handleChange,
        handleSubmit,
        handleLinkFrecuenteClick,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};
