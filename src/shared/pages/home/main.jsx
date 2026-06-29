import { Box,Container,Grid, Typography,Stack,Divider} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SAEButton from "../../components/buttons/SAEButton";
import NovedadesEstudiantiles from "../../components/StudentNews/studentNews";
import { motion } from "framer-motion";
const baseUrl = import.meta.env.BASE_URL;

export default function Main(){
  return(
    <>
      <SAEHero/>
      <NovedadesEstudiantiles/>
    </>
  );
}

function SAEHero() {
  const MotionImg = motion.img;
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "114px", md: "100px" },
        pb: 4,
        minHeight: "calc(100vh - 90px)",
        background:
          "linear-gradient(135deg, #1538B8 0%, #40C5F2 100%)",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          py={{xs:0,md:4}}
          justifyContent="center"
          alignItems="center"
          sx={{
            minHeight: "calc(100vh - 200px)",
          }}
        >
          {/* ---------------- MOBILE ---------------- */}

          <Box
          display={{xs:"block",md:"none"}}
            sx={{
              mb: 3,
            }}
          >
            <MotionImg
                src={`${baseUrl}images/principal/mobileSAE.svg`}
                alt="Secretaría"
                initial={{
                  opacity: 0,
                  x: -80,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 1,
                }}
                style={{
                  width: "100%",
                  maxWidth: "520px",
                }}
              />
          </Box>

          {/* ---------------- DESKTOP ---------------- */}

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 4 }}
            justifyContent="center"
            alignItems="center"
            
            sx={{
              width: "75%",
            }}
          >
            {/* Texto SAE Desktop */}

            <Box
            
              sx={{
                display: "block",
                flex: 1,
                textAlign: "right",
                
              }}
            >
              <MotionImg
                src={`${baseUrl}saeLogo.svg`}
                alt="Secretaría"
                initial={{
                  opacity: 0,
                  x: -80,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 1,
                }}
                style={{
                  width: "100%",
                  maxWidth: "520px",
                  
                }}
              />
            </Box>
            {/* Divider Desktop */}

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", md: "block" },
                bgcolor: "rgba(255,255,255,.85)",
                width: "4px",
                borderRadius: 3,
              }}
            />
            {/* Logo SAE */}

            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: {
                  xs: "center",
                  md: "flex-start",
                },
              }}
            >
              <MotionImg
                src={`${baseUrl}images/principal/desktopSAE.svg`}              
                
                alt="SAE"
                initial={{
                  opacity: 0,
                  x: 80,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 1,
                }}
                style={{
                  width: "100%",
                  maxWidth: "600px",
                }}
              />
            </Box>
          </Stack>

          {/* ---------------- DESCRIPCIÓN ---------------- */}

          <Typography
            variant="title"
            sx={{
              mt: 5,
              mb: 4,
              maxWidth: 700,
              textAlign: "center",
              color: "white",
              fontWeight: 500,
              opacity: 0.90,
              px: 2,
            }}
          >
            Deportes, becas, salud, viajes, congresos,
            actividades recreativas y acompañamiento
            estudiantil para que disfrutes al máximo tu
            experiencia universitaria.
          </Typography>

          {/* ---------------- BOTONES ---------------- */}

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{
                width: "100%"
              }}
          >
            <SAEButton
              onClick={()=>navigate("/JPA")}
              variant="contained"
              size="large"
              sx={{
                width:340,
                py: 1.6,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",

                 background:"var(--secondary)",
              }}
            >
              Conocé nuestra Universidad
            </SAEButton>

            <SAEButton
              onClick={()=>navigate("/login")}
              variant="contained"
              size="large"
              sx={{
                width:340,
                py: 1.6,
                borderRadius: 2,
                textTransform: "none",
                color: "white",
                background:"#6FA958",
                fontWeight: 700,
                fontSize: "1rem",


                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,.08)",
                },
              }}
            >
              Soy parte de la UTN
            </SAEButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}