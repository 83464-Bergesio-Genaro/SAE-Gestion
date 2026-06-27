import { Box, Typography } from "@mui/material";

export default function TitleBox({ title, description, fontweight = 800 }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 3,
        mt: 4,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: fontweight === 800 ? 50 : 30,
          borderRadius: 2,
          bgcolor: "var(--primary)",
        }}
      />
      <Box>
        <Typography variant="h4" fontWeight={fontweight} color="var(--primary)">
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
}
