const normalizeBasePath = (value = "") => {
  const trimmed = String(value).trim();

  if (!trimmed || trimmed === "/") {
    return "";
  }

  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
};

export const appConfig = {

  appName: import.meta.env.VITE_APP_NAME,

  apiUrl: normalizeBasePath(
    import.meta.env.VITE_API_BASE_PATH ??
    import.meta.env.VITE_API_URL ??
    import.meta.env.BASE_URL,
  ),

  sessionTimeout: Number(import.meta.env.VITE_SESSION_TIMEOUT),
  appVersion:import.meta.env.VITE_APP_VERSION,
  
/* MUY IMPORTANTE, SI DESEAMOS AGREGAR UNA VARIABLE EN appConfig.js y consumirlo desde los css*/
themes: {
    light: {
      background: "#D9E5F4",
      gradient: "linear-gradient(135deg, #1538B8 0%, #40C5F2 100%)",
      text: "#1a1a1a",
      primary: "#1538B8",
      secondary: "#0B2986",
      tertiary: "#D9E5F4",

      neutralCard: "#E5E5E5",
      blackText: "#191919",
      whiteText: "#FAFAFA",

      green:"#8BC154",
      magenta:"#D830A0",
      orange:"#FF8E2C",
    },
        /*POR AHORA NO LOS UTILIZAMOS*/
    dark: {
      background: "#D9E5F4",
      gradient: "linear-gradient(135deg, #1538B8 0%, #40C5F2 100%)",
      primary: "#1538B8",
      secondary: "#0B2986",
      tertiary: "#D9E5F4",

      neutralCard: "#E5E5E5",
      blackText: "#191919",
      whiteText: "#FAFAFA",

      green:"#8BC154",
      magenta:"#D830A0",
      orange:"#FF8E2C",
    }
  },
  fontFamily:{
    fontGeneral: "Barlow",
    fontText: "Noto-Sans",
    fontSubtitle: "JetBrain-Mono",
    fontCitation: "Crimson-Pro"
  },
  typography:{
    h1: {
      fontWeight:700,
      fontSize:{
        xs: "3rem",
        md: "5rem",
        lg: "6rem"
      }
    },
    h2: {
      fontWeight:700,
      fontSize:{
        xs:'1.625rem',
        md:'2.5rem',
        lg: "3rem"
      }
    },
    h3: {
      fontWeight:600,
      fontSize:{
        xs:'1.375rem',
        md:'2rem',
        lg: "2.5rem"
      }
    },
    h4: {
      fontWeight:600,
      fontSize:{
        xs:'1.25rem',
        md:'1.5rem',
        lg: "2rem"
      }
    },
    h5: {
      fontWeight:500,
      fontSize:{
        xs:'1.125rem',
        md:'1.25rem',
        lg: "1.3rem"
      }
    },
    h6: {
      fontWeight:600,
      fontSize:{
        xs:'1rem',
        md:'1.1rem',
        lg: "1.2rem"
      }
    }
  }
};