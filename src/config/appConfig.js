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
  appVersion: import.meta.env.VITE_APP_VERSION,

  /* MUY IMPORTANTE, SI DESEAMOS AGREGAR UNA VARIABLE EN appConfig.js y consumirlo desde los css*/
  themes: {
    light: {
      background: "#D9E5F4",
      chipBackground:"rgba(255,255,255,0.18)",
      gradient: "linear-gradient(135deg, #1538B8 0%, #40C5F2 100%)",
      purpleGradient: "linear-gradient(135deg, #1538B8 0%, #6140CB 100%)",
      textBlack: "#191919",
      textWhite: "#FAFAFA",
      textSecondary: "#575757",
      primary: "#1538B8",
      secondary: "#0B2986",
      tertiary: "#D9E5F4",
      neutralCard: "#E5E5E5",

      green: "#8BC154",
      magenta: "#D830A0",
      orange: "#FF8E2C",
      greenDark: "#2d6a18",
      lightGreen: "#d8ebd1",
      lightBlue: "#40C5F2",
    },
    /*POR AHORA NO LOS UTILIZAMOS*/
    dark: {
      background: "#D9E5F4",
      gradient: "linear-gradient(135deg, #1538B8 0%, #40C5F2 100%)",
      purpleGradient: "linear-gradient(135deg, #1538B8 0%, #6140CB 100%)",
      commonText: "#191919",
      constrastText: "#FAFAFA",
      textSecondary: "#575757",
      primary: "#1538B8",
      secondary: "#0B2986",
      tertiary: "#D9E5F4",
      neutralCard: "#E5E5E5",

      green: "#8BC154",
      magenta: "#D830A0",
      orange: "#FF8E2C",
      greenDark: "#2d6a18",
      lightGreen: "#d8ebd1",
      lightBlue: "rgba(64, 197, 242, 0.75)",
      chipBackground:"rgba(255,255,255,0.18)"
    },
  },
};
