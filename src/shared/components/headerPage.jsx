import React from "react";
import { Box, Typography } from "@mui/material";

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
        sx: { fontSize: { xs: 44, sm: 70 }, ...(icon.props?.sx || {}) },
      });
    }

    // If user passed the component itself: SomeIcon
    const IconComp = icon;
    return <IconComp sx={{ fontSize: { xs: 44, sm: 70 } }} />;
  };

  return (
    <Box
      sx={{
        borderRadius: 5,
        p: { xs: 2.25, sm: 3 },
        color: "white",
        backgroundImage: `linear-gradient(135deg, var(--primary) 0%, var(--lightBlue) 100%), url('${baseUrl}${backgroundImage || "images/carrousel/EntradaUTN.jpg"}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        gap: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            mt: { xs: 0, sm: 1 },
            fontSize: { xs: "1.65rem", sm: "3rem" },
            lineHeight: 1.12,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            mt: 1,
            maxWidth: 700,
            fontSize: { xs: "0.88rem", sm: "1rem" },
          }}
        >
          {description}
        </Typography>
      </Box>
      <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
        {renderIcon()}
      </Box>
    </Box>
  );
}
