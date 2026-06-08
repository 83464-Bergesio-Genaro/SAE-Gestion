import { Box, IconButton, useTheme,Stack, useMediaQuery ,Card, CardContent, Divider,Link, Typography} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useMemo, useState } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { CalendarIcon } from "@mui/x-date-pickers";

const settingsSchedule = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow:3,     // Cuántas tarjetas se ven en computadora
  slidesToScroll: 1,
  swipe: true,           
  swipeToSlide: true,    
  touchMove: true,       
  draggable: true,  
  responsive: [
    {
      breakpoint: 1024, // En pantallas medianas (tablets)
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,  
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
};
const formatearFecha = (fechaString) => {
  if (!fechaString) return "";
  
  // Convertimos el texto "2026-05-07" a un objeto de fecha real
  // Usamos el reemplazo de guiones por barras para evitar problemas de zona horaria
  const fecha = new Date(fechaString.replace(/-/g, '/')); 

  // Le pedimos a JavaScript que solo nos devuelva el día y el mes en español
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',   // Fuerza a que el día tenga 2 dígitos (ej: "07")
    month: 'long'     // Muestra el nombre completo del mes (ej: "Mayo")
  });
};

export function CalendarEvent({eventos}){

  return(
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        "& .slick-slider": {
          width: "100%",
          touchAction: "pan-y",
        },
        "& .slick-list": {
          margin: "0 -10px",
        },
        "& .slick-slide": {
          padding: "0 10px",
          boxSizing: "border-box",
          height: "auto", 
          "& > div": {
            width: "100%",
          }
        },
      }}
    >
      <Slider {...settingsSchedule}>
      { eventos.map((evento) => {

          return(<EventoCard evento={evento}>

          </EventoCard>
         /* <Card 
              key={evento.id}
              variant="outlined"
              sx={{
                minWidth: 300,
                maxWidth: 300,
                minHeight: 400,
                maxHeight: 400,
                borderRadius: 4,
                my:3,
                background: "linear-gradient(180deg,#FFFFFF 0%,#F8FBFF 100%)",
                border: "1px solid #DCE7F5",
                boxShadow: "0 10px 25px rgba(18,54,102,0.12)",
                transition: "all .3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 18px 40px rgba(18,54,102,0.20)",
                },
                // NUEVO: Hacemos que la tarjeta sea un contenedor Flex vertical
                display: "flex",
                flexDirection: "column"
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
                  {formatearFecha(evento.fecha_evento)}
                </Typography>
                <Typography sx={{ fontSize: 34, fontWeight: 700 }}>
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
          </Card>*/)
        })}
      </Slider> 
    </Box>
  );
}


function CalendarEvent2({ eventos }) { 
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  let itemsPerPage = 3;

  if (isMobile) itemsPerPage = 1;
  else if (isTablet) itemsPerPage = 3;
  else itemsPerPage = 3;
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
            margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            justifyItems: "center",
            gap: 4
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
function EventoCard({ evento }) {
  return (
    <Card sx={{
      position: "relative",
      borderRadius: 6,
      overflow: "hidden",
            width: 350,
        height: 350,
      "&::before": {
        content: '""',
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        top: -150,
        right: -150,
      }
    }}>
      <CardContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
      <Stack direction="row" justifyContent="flex-start" alignItems="center" pb={1} spacing={2}>
        <Box
          sx={{
            minWidth: 40,
            height:40,
            borderRadius: "50%",
            bgcolor: "#E7F1FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CalendarIcon sx={{ fontSize: 26, color: "#2A548B" }} />
        </Box>
          <Typography sx={{ fontSize: 22, fontWeight: 700,width:"100%" }}>
            {formatearFecha(evento.fecha_evento)}
          </Typography>
          <Typography sx={{ fontSize: 26, fontWeight: 700 }}>
            {evento.horario_inicio}
          </Typography>          
      </Stack>        
      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.5)", mb: 2 }} />
      <Stack sx={{ flexGrow: 1, justifyContent: "space-between" }}>
        <Box sx={{ height: "80px", overflow: "hidden"}}> 
          <Typography sx={{mt:2, fontSize: 26, fontWeight: 700,textAlign:"center" }}>
            {evento.nombre_evento}
          </Typography>

      
        </Box>
        <Box sx={{ height: "50px", overflow: "hidden", pt:3 }}> 
          <Typography sx={{textAlign:"left" }}>
            <strong>Expositor: </strong>{evento.encargado}
          </Typography>  
        </Box>
      </Stack>

      <Box sx={{ height: "50px", pr: 0.5 }} my={2}>
        <Typography sx={{ mb: 2 }}>
          <Box component="span" sx={{ fontWeight: 700 }}>
            Duración:
          </Box>{" "}
          {evento.duracion}
        </Typography>        
      </Box>
        <Divider
          sx={{ borderColor: "rgba(0, 0, 0, 0.6)", mt: "auto", mb: 2 }}
        />
        <Link 
          target="_blank" 
          href={evento.lugar} 
          underline="none"
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1, 
            color: "primary.main",
            transition: "all 0.2s ease",
            "&:hover": {
              color: "primary.dark",
              transform: "scale(1.02)",
            },
            "&:active": {
              color: "secondary.main", 
              transform: "scale(0.98)", 
            }
          }}
        >
          <LocationOnIcon sx={{ fontSize: 22 }} />
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
            Ver Ubicacion en Maps
          </Typography>
        </Link>
      </CardContent>
    </Card>
  );
}
