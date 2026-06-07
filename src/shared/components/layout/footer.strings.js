import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import SchoolIcon from "@mui/icons-material/School";

export const FOOTER_STRINGS = {
  brand: "SAE Gestión — UTN Facultad Regional Córdoba",
  copyright: "© 2026 Cátedra de Proyecto Final · v1.0",
};

export const FOOTER_LINKS = [
  {
    key: "instagram",
    icon: InstagramIcon,
    label: "@sae.utn.frc",
    href: "https://www.instagram.com/sae.utn.frc",
    external: true,
  },
  {
    key: "mail",
    icon: EmailIcon,
    label: "sae@frc.utn.edu.ar",
    href: "mailto:sae@frc.utn.edu.ar",
    external: false,
  },
  {
    key: "inscripcion",
    icon: SchoolIcon,
    label: "Inscripción UTN FRC",
    href: "https://www.frc.utn.edu.ar",
    external: true,
  },
];
