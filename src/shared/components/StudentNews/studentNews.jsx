import {
  Box,
  Card,
  Typography,
  IconButton,
  Stack,
  CardMedia,
  CardContent,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useMemo, useState } from "react";

function ItemNovedad({ titulo, descripcion, invertida, imagen }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
        border: "1px solid rgba(17, 53, 101, 0.08)",
        opacity: 1,
        marginBottom: 3,
        display: "flex",
        flexDirection: { xs: "column", md: invertida ? "row-reverse" : "row" },
      }}
    >
      {
        <CardMedia
          sx={{
            width: { xs: "100%", md: 300 },
            height: { xs: 200, md: "auto" },
            objectFit: "cover",
          }}
          component="img"
          image={imagen}
        />
      }

      <Box sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#14325c" }}>
            {titulo}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ mt: 1, color: "#5a6f8f", minHeight: 48 }}
          >
            {descripcion}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}

export default function NovedadesEstudiantiles({ novedades }) {
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 3;

  const totalPaginas = Math.ceil(novedades.length / itemsPorPagina);

  const novedadesPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    return novedades.slice(inicio, fin);
  }, [paginaActual, novedades]);

  const irPaginaAnterior = () => {
    setPaginaActual((prev) => Math.max(prev - 1, 1));
  };

  const irPaginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
  };

  return (
    <Box sx={{ mt : 1 }}>
      <Stack>
        {novedadesPaginadas.map((item) => (
          <ItemNovedad
            key={item.id}
            titulo={item.titulo}
            descripcion={item.descripcion}
            invertida={item.invertida}
            imagen={item.imagen}
          />
        ))}
      </Stack>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Typography sx={{ fontSize: "0.95rem", color: "#333" }}>
          {paginaActual} de {totalPaginas}
        </Typography>

        <IconButton onClick={irPaginaAnterior} disabled={paginaActual === 1}>
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={irPaginaSiguiente}
          disabled={paginaActual === totalPaginas}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
