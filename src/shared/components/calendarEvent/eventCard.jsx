import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export function EventoCard({ evento }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        backgroundColor: "#37518A",
        color: "white",
        boxShadow: "0 8px 18px rgba(0,0,0,0.28)",
      }}
    >
      <CardContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box textAlign="center" mb={1}>
          <Typography sx={{ fontSize: 22, fontWeight: 700 }}>
            {evento.fecha_evento}
          </Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
            {evento.horario_inicio}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.10)", mb: 2 }} />

        <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
          {evento.nombre_evento}
        </Typography>

        <Typography sx={{}}>
          <Box component="span" sx={{ fontWeight: 700 }}></Box>{" "}
          {evento.encargado}
        </Typography>

        <Typography sx={{ mb: 2 }}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            Duración:
          </Box>{" "}
          {evento.duracion}
        </Typography>

        <Divider
          sx={{ borderColor: "rgba(255,255,255,0.10)", mt: "auto", mb: 2 }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOnIcon sx={{ fontSize: 22 }} />
          <Typography sx={{ fontSize: 15 }}>{evento.lugar}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
