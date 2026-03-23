import { Button } from "@mui/material";

export default function SAEButton({ sx, variant, color, ...props }) {
  const isDefaultPrimary = !color || color === "primary";
  const variantStyles =
    variant === "outlined" && isDefaultPrimary
      ? {
          bgcolor: "white",
          color: "#5B96CC",
          borderColor: "#5B96CC",
          "&:hover": {
            bgcolor: "#f7f9fc",
            borderColor: "#477EAF",
            color: "#477EAF",
          },
        }
      : variant === "outlined"
        ? {
            bgcolor: "white",
            "&:hover": {
              bgcolor: "#f7f9fc",
            },
          }
      : variant === "contained" && isDefaultPrimary
        ? {
            bgcolor: "#5B96CC",
            color: "white",
            "&:hover": {
              bgcolor: "#477EAF",
            },
          }
        : {};

  return <Button variant={variant} color={color} {...props} sx={{ ...variantStyles, ...sx }} />;
}
