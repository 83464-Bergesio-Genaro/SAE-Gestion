import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useMemo, useState } from "react";

function ItemNovedad({ titulo, descripcion, invertida, imagen }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <Grid container spacing={2}>
      {!invertida && (
        <Grid size={{ xs: 4, md: 3 }}>
          <Box
            component="img"
            src={imagen}
            alt={titulo}
            sx={{
              width: "100%", // 🔥 CLAVE
              height: "auto",
              objectFit: "cover",
              borderRadius: 1,
              display: "block",
            }}
            mb="2"
          />
        </Grid>
      )}

      <Grid size={{ xs: 8, md: 9 }}>
        <Box
          sx={{
            textAlign: invertida ? { xs: "left", md: "right" } : "left",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#5b8fcb",
              fontWeight: 700,
            }}
          >
            {titulo}
          </Typography>

          <Typography variant="subtitle2">
            {isMobile ? descripcion.slice(0, 120) + "..." : descripcion}
          </Typography>
        </Box>
      </Grid>

      {invertida && (
        <Grid size={{ xs: 4, md: 3 }}>
          <Box
            component="img"
            src={imagen}
            alt={titulo}
            sx={{
              width: "100%", // 🔥 CLAVE
              height: "auto",
              objectFit: "cover",
              borderRadius: 1,
              display: "block",
            }}
          />
        </Grid>
      )}
    </Grid>
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
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        px: { xs: 2, md: 5 },
        pl: 3,
        pt: 3,
        pb: 3,
        pr: 3,
        m: 1,
        mb: 4,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, pt: 2 }}>
        <b>Novedades Estudiantiles</b>
      </Typography>

      <Container>
        {novedadesPaginadas.map((item) => (
          <ItemNovedad
            key={item.id}
            titulo={item.titulo}
            descripcion={item.descripcion}
            invertida={item.invertida}
            imagen={item.imagen}
          />
        ))}
      </Container>

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
