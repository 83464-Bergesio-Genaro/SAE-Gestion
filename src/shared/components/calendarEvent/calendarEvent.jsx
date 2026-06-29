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
        py:{ xs: 2, sm: 8 },
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
        "& .slick-slide > div": {
          padding: "0 10px",
          boxSizing: "border-box",
          height: "auto", 
          "& > div": {
            width: "100%",
          }
        },
        ".slick-prev:before,.slick-next:before":{
        color: "black"
      }

      }}
    >
      <Slider {...settingsSchedule}>
      { eventos.map((evento) => {

          return(
          <EventoCard evento={evento}>
          </EventoCard>)
        })}
      </Slider> 
    </Box>
  );
}

function EventoCard({ evento }) {
  return (
    <Card sx={{
      my:2,
      position: "relative",
      borderRadius: 5,
      overflow: "hidden",
      border: '2px solid transparent',
      backgroundClip: 'padding-box',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0,
        zIndex: -1,
        margin: '-2px', // Ancho del borde
        borderRadius: 'inherit',
        background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)', // Borde colorido
      },
      boxShadow: 4,
      color: '#000000',
      }}>
      <CardContent
        sx={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
          backdropFilter: 'blur(10px)', // Efecto de desenfoque si hay algo detrás
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)', // Sombra suave azulada
          border: '1px solid rgba(255, 255, 255, 0.18)', // Borde sutil
          borderRadius: 2,
          color: '#000000',
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
      <Stack direction="row" justifyContent="flex-start" alignItems="center" pb={1} spacing={2}>
        <Box
          sx={{
            maxWidth: 40,
            minheight:40,
            borderRadius: "50%",
            bgcolor: "#E7F1FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CalendarIcon sx={{ fontSize: 20, color: "#2A548B" }} />
        </Box>
          <Typography sx={{ fontSize:18, fontWeight: 700,width:"100%" }}>
            {formatearFecha(evento.fecha_evento)}
          </Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
            {evento.horario_inicio}
          </Typography>          
      </Stack>        
      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.5)", mb: 2 }} />
      <Stack sx={{ flexGrow: 1, justifyContent: "space-between" }}>
        <Box sx={{ maxHeight: "75px", overflow: "hidden"}}> 
          <Typography sx={{mt:0.5, fontSize: 26, fontWeight: 700,textAlign:"center" }}>
            {evento.nombre_evento}
          </Typography>

      
        </Box>
        <Box sx={{ height: "45px", overflow: "hidden", pt:2 }}> 
          <Typography sx={{textAlign:"left" }}>
            <strong>Expositor: </strong>{evento.encargado}
          </Typography>  
        </Box>
      </Stack>

      <Box sx={{ height: "40px", pr: 0.5 }} my={2}>
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
        <Box sx={{ height: "20px"}} my={1}>
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
                  
        </Box>
      </CardContent>
    </Card>
  );
}
