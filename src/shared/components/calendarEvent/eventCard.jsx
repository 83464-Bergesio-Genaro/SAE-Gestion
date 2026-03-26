import { Box, Card, CardContent, Divider,Link, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export function EventoCard({ evento }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        backgroundColor: "white",
        color: "black",
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
          <Typography sx={{ fontSize: 40, fontWeight: 700 }}>
            {evento.horario_inicio}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.5)", mb: 2 }} />
         <Box mb={1}>
            <Typography sx={{ fontSize: 24, fontWeight: 700,textAlign:"center" }}>
              {evento.nombre_evento}
            </Typography>

            <Typography sx={{textAlign:"center" }}>
              {evento.encargado}
            </Typography>
         </Box>

        <Typography sx={{ mb: 2 ,marginTop:4}}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            Duración:
          </Box>{" "}
          {evento.duracion}
        </Typography>
        <Divider
          sx={{ borderColor: "rgba(0, 0, 0, 0.6)", mt: "auto", mb: 2 }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOnIcon sx={{ fontSize: 22 }} />
          <Link target="_blank" href={evento.lugar} sx={{textDecoration:"none"}}>
          <Typography sx={{ fontSize: 16,color:"black" }}>Ver Ubicacion en Maps</Typography>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
