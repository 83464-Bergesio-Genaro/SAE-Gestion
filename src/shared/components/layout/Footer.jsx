import { Box, Container, Divider, Stack, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "#154383", py: 2.5 }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="body2" sx={{ color: "#7a92b0", fontWeight: 600 }}>
            SAE Gestión — UTN Facultad Regional Córdoba
          </Typography>
          <Typography variant="caption" sx={{ color: "#a0b4cc" }}>
            © 2026 Cátedra de Proyecto Final · v1.0
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
