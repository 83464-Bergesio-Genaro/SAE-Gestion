import { Box, Container,Grid, Link, Stack, Typography } from "@mui/material";
import { FOOTER_LINKS, FOOTER_STRINGS } from "./footer.strings";
import { footerStyles as sx } from "./footer.styles";

export default function Footer() {
  return (
    <Box component="footer" sx={sx.root}>
      <Container maxWidth="xl">
        <Grid container spacing={1} direction="row" justifyContent="space-between" alignItems="center">
          <Grid size={{ xs: 12,md:4 }} mt={1} textAlign={{xs:"center",md:"left"}}>
            <Typography variant="body2" sx={sx.brand}>
              {FOOTER_STRINGS.brand}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12,md:4 }} mt={1}>
            <Stack direction="column" alignItems="center" spacing={0.5}>
            {FOOTER_LINKS.map(({ key, icon: Icon, label, href, external }) => (
              <Stack
                key={key}
                direction="row"
                spacing={0.5}
                alignItems="center"
                justifyContent="center"
              >
                <Icon sx={sx.icon} />
                <Typography variant="caption" sx={sx.linkText}>
                  <Link
                    href={href}
                    underline="hover"
                    sx={sx.linkAnchor}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {label}
                  </Link>
                </Typography>
              </Stack>
            ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12,md:4 } }mt={1} textAlign={{xs:"center",md:"right"}}>
            <Typography variant="caption" sx={sx.copyright}  >
              {FOOTER_STRINGS.copyright}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

