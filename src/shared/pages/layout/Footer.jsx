import { Box, Container, Typography, Stack, Link,Grid} from "@mui/material";
import { FOOTER_STRINGS,FOOTER_LINKS } from "../../../utils/strings/shared.strings"; 

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "var(--primary)", padding: 2, color: "var(--textWhite)" }}>
      <Container maxWidth="xl">
        <Grid container spacing={1} direction="row" justifyContent="space-between" alignItems="center">
          
          <Grid size={{ xs: 12, md: 4 }} mt={1} textAlign={{ xs: "center", md: "left" }}>
            <Typography variant="body2" sx={sx.brand}>
              {FOOTER_STRINGS.brand}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} mt={1}>
            <Stack direction="column" alignItems="center" spacing={0.5}>
              {FOOTER_LINKS.map((link) => {
              const IconComponent = link.icon; // Asignación limpia a componente con mayúscula
              
              return (
                <Stack
                  key={link.key}
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  justifyContent="center"
                >
                  {/* Usás la constante local limpia libre de warnings */}
                  <IconComponent sx={sx.icon} />
                  
                  <Typography variant="caption" sx={sx.linkText}>
                    <Link
                      href={link.href}
                      underline="hover"
                      sx={sx.linkAnchor}
                      {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      {link.label}
                    </Link>
                  </Typography>
                </Stack>
              );
            })}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} mt={1} textAlign={{ xs: "center", md: "right" }}>
            <Typography variant="caption" sx={sx.copyright}>
              {FOOTER_STRINGS.copyright} {/* - v{appConfig.appVersion} */}
            </Typography>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}

// ✅ Definición del objeto de estilos para que MUI no tire error 'sx is not defined'
const sx = {
  brand: { fontWeight: "bold" },
  icon: { fontSize: "1.2rem", color: "var(--textWhite)" }, // Controla el tamaño y color del ícono aquí
  linkText: { display: "flex", alignItems: "center" },
  linkAnchor: { color: "var(--textWhite)", textDecoration: "none" },
  copyright: { opacity: 0.8 }
};