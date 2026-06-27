import React from "react";
import { Box, Grid, Typography } from "@mui/material";

export default function HeaderPage({
  title,
  description,
  backgroundImage,
  icon,
}) {
  const baseUrl = import.meta.env.BASE_URL;

  const renderIcon = () => {
    if (!icon) return null;
    // If user passed a JSX element: <SomeIcon />
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        sx: { fontSize: 70, ...(icon.props?.sx || {}) },
      });
    }

    // If user passed the component itself: SomeIcon
    const IconComp = icon;
    return <IconComp sx={{ fontSize: 70 }} />;
  };

  return (
    <Box
      sx={{
        borderRadius: 5,
        p: { xs: 3, md: 3 },
        color: "white",
        backgroundImage: `linear-gradient(135deg, var(--primary) 0%, var(--lightBlue) 100%), url('${baseUrl}images/carrousel/EntradaUTN.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box>
        <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
          {title}
        </Typography>
        <Typography sx={{ mt: 1, maxWidth: 700 }}>{description}</Typography>
      </Box>
      {renderIcon()}
    </Box>
  );
}
