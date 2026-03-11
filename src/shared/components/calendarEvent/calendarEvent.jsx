import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useMemo, useState } from "react";

import { EventoCard } from "./eventCard";

export function CalendarEvent({ eventos }) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  let itemsPerPage = 4;

  if (isMobile) itemsPerPage = 2;
  else if (isTablet) itemsPerPage = 3;
  else itemsPerPage = 4;
  const totalPages = Math.ceil(eventos.length / itemsPerPage);
  const [page, setPage] = useState(0);

  const visibleItems = useMemo(() => {
    const start = page * itemsPerPage;
    return eventos.slice(start, start + itemsPerPage);
  }, [page, itemsPerPage, eventos]);

  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            margin: 4,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 2,
          }}
        >
          {visibleItems.map((evento, index) => (
            <EventoCard key={`${evento.titulo}-${index}`} evento={evento} />
          ))}
        </Box>

        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            left: { xs: -8, md: -20 },
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
            backgroundColor: "rgba(255,255,255,0.04)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.08)",
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: { xs: -8, md: -20 },
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
            backgroundColor: "rgba(255,255,255,0.04)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.08)",
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        {Array.from({ length: totalPages }).map((_, index) => {
          const isActive = page === index;

          return (
            <Box
              key={index}
              onClick={() => setPage(index)}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "black",
                fontSize: 14,
                backgroundColor: isActive ? "#3b82f6" : "transparent",
                border: isActive ? "none" : "1px solid rgba(255,255,255,0.18)",
                transition: "all 0.25s ease",
              }}
            >
              {index + 1}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
