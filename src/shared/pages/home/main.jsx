import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import SAEButton from "../../components/buttons/SAEButton";
import NovedadesEstudiantiles from "../../components/StudentNews/studentNews";
import { motion } from "framer-motion";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
const baseUrl = import.meta.env.BASE_URL;
import SAEPage from "../../components/page/SAEPage";

export default function Main() {
  return (
    <>
      <SAEHero />
      <Container maxWidth="xl">
        <NovedadesEstudiantiles />
      </Container>
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
        background: "var(--gradient)",
        overflow: "hidden",
        position: "relative",
        isolation: "isolate",
        "@keyframes rotateHeroBackground": {
          "0%": {
            transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) rotate(180deg) scale(1.06)",
          },
          "100%": {
            transform: "translate(-50%, -50%) rotate(360deg) scale(1)",
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          zIndex: 0,
          top: "50%",
          left: "50%",
          width: "180vmax",
          height: "180vmax",
          borderRadius: "50%",
          background: `
            radial-gradient(
              circle at 25% 30%,
              rgba(255, 255, 255, 0.16),
              transparent 28%
            ),
            radial-gradient(
              circle at 75% 65%,
              rgba(90, 190, 255, 0.2),
              transparent 32%
            ),
            var(--gradient)
          `,
          animation: "rotateHeroBackground 28s linear infinite",
          willChange: "transform",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(
              circle at center,
              transparent 40%,
              rgba(4, 20, 45, 0.22) 100%
            ),
            repeating-linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.018) 0,
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px,
              transparent 5px
            )
          `,
        },
        "@media (prefers-reduced-motion: reduce)": {
          "&::before": {
            animation: "none",
            willChange: "auto",
          },
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          py={{ xs: 0, md: 4 }}
          justifyContent="center"
          alignItems="center"
          sx={{
            minHeight: "calc(100vh - 200px)",
          }}
        >
          {/* ---------------- MOBILE ---------------- */}

          <Box
            display={{ xs: "block", md: "none" }}
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
              opacity: 0.9,
              px: 2,
            }}
          >
            Deportes, becas, salud, viajes, congresos, actividades recreativas y
            acompañamiento estudiantil para que disfrutes al máximo tu
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
              width: "100%",
            }}
          >
            <SAEButton
              onClick={() => navigate("/JPA")}
              variant="contained"
              size="large"
              startIcon={<SchoolOutlinedIcon />}
              sx={{
                width: 340,
                py: 1.6,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",

                background: "var(--secondary)",
              }}
            >
              Conocé nuestra Universidad
            </SAEButton>

            <SAEButton
              onClick={() => navigate("/login")}
              variant="contained"
              size="large"
              startIcon={
                <Box
                  component="img"
                  src={`${baseUrl}logoUTN.svg`}
                  alt=""
                  aria-hidden="true"
                  sx={{
                    width: 22,
                    height: 24,
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                />
              }
              sx={{
                width: 340,
                py: 1.6,
                borderRadius: 2,
                textTransform: "none",
                color: "white",
                background: "#6FA958",
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
