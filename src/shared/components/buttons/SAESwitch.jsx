import { Switch } from "@mui/material";

export default function SAESwitch({ sx, ...props }) {
  return (
    <Switch
      {...props}
      sx={{
        "& .MuiSwitch-switchBase.Mui-checked": {
          color: "#5B96CC",
          "&:hover": {
            bgcolor: "rgba(91, 150, 204, 0.1)",
          },
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          bgcolor: "#5B96CC",
        },
        ...sx,
      }}
    />
  );
}
