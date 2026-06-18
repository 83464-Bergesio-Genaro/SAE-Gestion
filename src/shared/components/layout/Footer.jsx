import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { FOOTER_LINKS, FOOTER_STRINGS } from "./footer.strings";
import { footerStyles as sx } from "./footer.styles";

export default function Footer() {
  return (
    <Box component="footer" sx={sx.root}>
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={{ xs: 1.5, md: 0 }}
          textAlign={{ xs: "center", md: "left" }}
        >

          <Typography variant="body2" sx={sx.brand}>
            {FOOTER_STRINGS.brand}
          </Typography>

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

          <Typography variant="caption" sx={sx.copyright}>
            {FOOTER_STRINGS.copyright}
          </Typography>

        </Stack>
      </Container>
    </Box>
  );
}

