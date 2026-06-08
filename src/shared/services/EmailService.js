import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_3pfadf8";
const EMAILJS_PUBLIC_KEY = "HPmcidnqVsJvSzXbn";
const EMAILJS_TEMPLATES = ["template_generico", "template_q5q7k6a"];

const sendToConfiguredTemplates = (send) =>
  Promise.all(
    EMAILJS_TEMPLATES.map((templateId) =>
      send(templateId, {
        publicKey: EMAILJS_PUBLIC_KEY,
      }),
    ),
  );

export function sendJPAEmailForm(formElement) {
  return sendToConfiguredTemplates((templateId, options) =>
    emailjs.sendForm(EMAILJS_SERVICE_ID, templateId, formElement, options),
  );
}

export function sendConsultationEmail({
  user_name,
  user_email,
  subject,
  message,
  legajo,
}) {
  return sendToConfiguredTemplates((templateId, options) =>
    emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      {
        form_type: "Consulta SAE",
        user_name: user_name,
        user_email: user_email,
        subject: subject,
        message: message,
        desc: "-",
        legajo: legajo || "-",
        phone: "-",
        amount: "-",
        date: new Date().toLocaleDateString("es-AR"),
        carrera: "-",
      },
      options,
    ),
  );
}
