import { createTheme } from '@mui/material/styles';
import {appConfig} from './appConfig'; // Ajuste la ruta según su proyecto

// 1. Obtenemos la configuración del tema actual (ej. 'light')
const currentThemeConfig = appConfig.themes["light"];
export const fontFamily = {
  general: '"Barlow", sans-serif',
  destacados: '"Noto Sans", sans-serif',
  tabulada: '"Jetbrains Mono", monospace',
  citas: '"Crimson Pro", serif',
};
const baseTheme = createTheme();
export const theme = createTheme({
  typography: {
    // 1. FUENTE POR DEFECTO (Textos Generales)
    fontFamily: fontFamily.general, 

    // 2. TEXTOS DESTACADOS (Headings y Subtítulos) -> Noto Sans
    h1: {
      fontFamily: fontFamily.destacados,
      fontWeight: 700,
      fontSize: '3rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '3.5rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '4rem',
      },
      lineHeight: 1.167,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontFamily: fontFamily.destacados,
      fontWeight: 600,
      fontSize: '2.5rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '3rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '3.2rem',
      },
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontFamily: fontFamily.destacados,
      fontWeight: 600,
      fontSize: '2rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '2.4rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '2.8rem',
      },
      lineHeight: 1.167,
    },
    h4: {
      fontFamily: fontFamily.destacados,
      fontWeight: 600,
      fontSize: '1.6rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '2rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '2.2rem',
      },
      lineHeight: 1.235,
    },
    h5: {
      fontFamily: fontFamily.destacados,
      fontWeight: 600,
      fontSize: '1.4rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.8rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '2rem',
      },
      lineHeight: 1.334,
    },
    h6: {
      fontFamily: fontFamily.destacados,
      fontWeight: 600,
      fontSize: '1.25rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.4rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '1.6rem',
      },
      lineHeight: 1.6,
    },
    subtitle1: {
      fontFamily: fontFamily.general,
      fontWeight: 500,
      fontSize: '1.125rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.2rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '1.4rem',
      },
      lineHeight: 1.75,
    },
    subtitle2: {
      fontFamily: fontFamily.destacados,
      fontWeight: 500,
      fontSize: '1.1rem', 
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.125rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '1.3rem',
      },
      lineHeight: 1.57,
    },

    // 3. CUERPO Y BOTONES (Textos Generales) -> Barlow
    body1: {
      fontFamily: fontFamily.general,
      fontWeight: 400,
      fontSize: '1rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '1.1rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '1.2rem',
      },
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontFamily: fontFamily.general,
      fontWeight: 400,
      fontSize: '0.875rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '0.9rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '0.9rem',
      },
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    button: {
      fontFamily: fontFamily.general,
      fontWeight: 600, // Semi-bold para mejor legibilidad en acciones
      fontSize: '0.875rem', // ~14px
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
    },

    caption: {
      fontFamily: fontFamily.tabulada,
      fontWeight: 400,
      fontSize: '0.75rem', // ~12px
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    // Sobrescribimos 'overline' también para datos técnicos si es necesario, 
    // o déjelo en general si es más decorativo. Aquí lo pondremos en Mono para consistencia tabular.
    overline: {
      fontFamily: fontFamily.tabulada,
      fontWeight: 600,
      fontSize: '0.75rem',
      [baseTheme.breakpoints.up('md')]: {
        fontSize: '0.9rem', 
      },
      [baseTheme.breakpoints.up('lg')]: {
        fontSize: '1rem',
      },     
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },

    // 5. CITAS Y BLOQUES DE TEXTO LARGO -> Crimson Pro
    
    quote: { 
      fontFamily: fontFamily.citas,
      fontWeight: 400,
      fontSize: '1.125rem', // Ligeramente más grande para elegancia
      lineHeight: 1.6,
      fontStyle: 'italic',
    }
  },
     components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          quote: 'blockquote', // Esto permite usar variant="quote" en JSX
        },
      },
    },
  },
});

export const applyCssVariables = () => {
  Object.keys(currentThemeConfig).forEach((key) => {
    document.documentElement.style.setProperty(`--${key}`, currentThemeConfig[key]);
  });
};