import { useMemo,useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ObtenerNoticiasPublicas,getDownloadUrl} from "../../../api/PrensaService";
import "./News.css";

export default function NewsGrid() {
    const [newsList, setEventosJPA] = useState([]);
      useEffect(() => {
        const ObtenerEventosPublicosApi = async () => {
          try {
            const respuesta = await ObtenerNoticiasPublicas();
            if(respuesta?.success && respuesta?.data){
              setEventosJPA(respuesta?.data);
            }
    
          } catch (error) {
            console.error("Error al traer Eventos:", error);
          }
        };
        ObtenerEventosPublicosApi();
      }, []);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  const hoveredCol = hoveredIndex !== null ? hoveredIndex % 4 : null;
  const hoveredRow =
    hoveredIndex !== null ? Math.floor(hoveredIndex / 4) : null;

  const gridTemplateColumns = useMemo(() => {
    if (hoveredCol === null) return "1fr 1fr 1fr 1fr";
    return [0, 1, 2, 3]
      .map((col) => (col === hoveredCol ? "2fr" : "0.6fr"))
      .join(" ");
  }, [hoveredCol]);

  const gridTemplateRows = useMemo(() => {
    if (hoveredRow === null) return "repeat(2, 260px)";
    return [0, 1]
      .map((row) => (row === hoveredRow ? "320px" : "200px"))
      .join(" ");
  }, [hoveredRow]);

  return (
    <section className="news-section">
      <h2>Novedades</h2>
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        onMouseLeave={() => setHoveredIndex(null)}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            md: gridTemplateColumns,
          },
          gridTemplateRows: {
            xs: "repeat(4, 180px)",
            md: gridTemplateRows,
          },
          gap: 1.5,
          transition:
            "grid-template-columns 350ms ease, grid-template-rows 350ms ease",
        }}
      >
        {newsList.map((news, index) => {
          const isActive = hoveredIndex === index;
          const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

          return (
            <Box
              key={news.titulo_publicacion}
              onClick={() => window.open(news.ruta_publicacion,"_blank")}//Generalmente instagram, se podria hacer que rediriga dentro de la aplicacion
              onMouseEnter={() => setHoveredIndex(index)}
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 0,
                cursor: "pointer",
                minHeight: 0,
              }}
            >
              <Box
                component="img"
                src={news.portada}
                alt={news.titulo_publicacion}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                  filter: isDimmed ? "brightness(0.72)" : "brightness(1)",
                  transition: "transform 350ms ease, filter 350ms ease",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,.15))",
                  opacity: isActive ? 1 : 0.75,
                  transition: "opacity 350ms ease",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  left: 16,
                  right: 16,
                  bottom: 16,
                  color: "#fff",
                  zIndex: 2,
                  transform: isActive ? "translateY(0)" : "translateY(8px)",
                  opacity: isActive ? 1 : 0.9,
                  transition: "all 350ms ease",
                }}
              >
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: isActive ? 16 : 16,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    transform: {
                      xs: "translateY(0)", // mobile siempre visible
                      md: isActive ? "translateY(0)" : "translateY(8px)",
                    },
                    opacity: {
                      xs: 1, // mobile siempre visible
                      md: isActive ? 1 : 0,
                    },
                    transition: "all 350ms ease",
                  }}
                >
                  {news.fecha_inicio}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: isActive ? 24 : 18,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    transform: {
                      xs: "translateY(0)", // mobile siempre visible
                      md: isActive ? "translateY(0)" : "translateY(8px)",
                    },
                    opacity: {
                      xs: 1,
                      md:  isActive ? 0 : 1,
                    }
                  }}
                > {news.titulo}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: isActive ? 18 : 14,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    transform: {
                      xs: "translateY(0)", // mobile siempre visible
                      md: isActive ? "translateY(0)" : "translateY(8px)",
                    },
                    opacity: {
                      xs: 1, // mobile siempre visible
                      md: isActive ? 1 : 0,
                    },
                  }}
                >
                  {news.descripcion}
                </Typography>                
              </Box>
            </Box>
          );
        })}
      </Box>
    </Container>
    </section>
  );
}
