import { useMemo, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const items = [
  {
    title: "Ing. Sistemas de Información",
    img: "../../../../public/images/degreesJPA/ingenieriaSistemas.jpeg",
    route: "/JPA/sistemas",
  },
  {
    title: "Ing. Electrica",
    img: "../../../../public/images/degreesJPA/ingenieriaElectrica.jpg",
    route: "/JPA/electrica",
  },
  {
    title: "Ing. Quimica",
    img: "../../../../public/images/degreesJPA/ingenieriaQuimica.jpg",
    route: "/JPA/quimica",
  },

  {
    title: "Ing. Metalurgica",
    img: "../../../../public/images/degreesJPA/ingenieriaMetalurgica.jpg",
    route: "/JPA/metalurgica",
  },

  {
    title: "Ing. Electronica",
    img: "../../../../public/images/degreesJPA/ingenieriaElectronica.jpg",
    route: "/JPA/electronica",
  },
  {
    title: "Ing. Civil",
    img: "../../../../public/images/degreesJPA/ingenieriaCivil.jpg",
    route: "/JPA/civil",
  },
  {
    title: "Ing. Industrial",
    img: "../../../../public/images/degreesJPA/ingenieriaIndustrial.jpg",
    route: "/JPA/industrial",
  },
  {
    title: "Ing. Mecanica",
    img:  "../../../../public/images/degreesJPA/ingenieriaMecanica.jpg",
    route: "/JPA/mecanica",
  },
];

export default function InteractiveGrid() {
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        onMouseLeave={() => setHoveredIndex(null)}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
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
        {items.map((item, index) => {
          const isActive = hoveredIndex === index;
          const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

          return (
            <Box
              key={item.title}
              onClick={() => navigate(item.route)}
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
                src={item.img}
                alt={item.title}
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
                    fontSize: isActive ? 24 : 18,
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
                  {item.title}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
}
