import { TextField } from "@mui/material";

export default function SAETextField({ sx, ...props }) {
  return (
    <TextField
      variant="outlined"
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          bgcolor: "white",
        },
        ...sx,
      }}
    />
  );
}
