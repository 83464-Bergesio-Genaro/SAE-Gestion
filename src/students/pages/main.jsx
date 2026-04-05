import {
  Container,
  Grid,
  Typography,
  Box,
  Stack,
  Card,
  CardActionArea,
  CardContent,
  Chip,
} from "@mui/material";
import { useAuth } from "../../shared/auth/AuthContext";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import HelpIcon from "@mui/icons-material/Help";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import { useNavigate } from "react-router-dom";
import NovedadesEstudiantiles from "../../shared/components/StudentNews/studentNews";
import { useMemo } from "react";

const gestionOptions = [
  {
    name: "Deportes",
    icon: SportsHandballIcon,
    route: "/Mis-Deportes",
    descripcion: "Gestiona tus inscripciones a los deportes y consulta torneos",
    roles: [1],
  },
  {
    name: "Becas",
    icon: Diversity3Icon,
    route: "/Mis-Becas",
    descripcion: "",
    disabled: true,

    roles: [1],
  },
  {
    name: "Viajes",
    icon: DirectionsBusIcon,
    route: "/Mis-Viajes",
    disabled: true,
    descripcion: "",
    roles: [1],
  },
  {
    name: "Cursos",
    icon: LocalLibraryIcon,
    route: "/Mis-Cursos",
    disabled: true,
    descripcion: "",
    roles: [1],
  },
  {
    name: "Consultas",
    icon: HelpIcon,
    route: "/Consultas",
    descripcion: "",
    disabled: true,

    roles: [1],
  },
];

function DashboardCard({ item, onClick }) {
  const Icon = item.icon;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
        border: "1px solid rgba(17, 53, 101, 0.08)",
        opacity: item.disabled ? 0.75 : 1,
      }}
    >
      <CardActionArea
        onClick={item.disabled ? undefined : onClick}
        disabled={item.disabled}
        sx={{ height: "100%" }}
      >
        <CardContent sx={{ p: 3, minHeight: 170 }}>
          <Stack spacing={2} sx={{ height: "100%" }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(76, 127, 188, 0.12)",
                color: "#244c87",
              }}
            >
              <Icon sx={{ fontSize: 30 }} />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#14325c" }}
              >
                {item.name}
              </Typography>
              <Typography sx={{ mt: 1, color: "#5a6f8f", minHeight: 48 }}>
                {item.disabled
                  ? "Disponible próximamente en futuras versiones de SAE.                            "
                  : item.descripcion}
              </Typography>
            </Box>

            <Box sx={{ mt: "auto" }}>
              <Chip
                label={item.disabled ? "Próximamente" : "Disponible"}
                size="small"
                sx={{
                  bgcolor: item.disabled ? "#e5edf8" : "#d8ebd1",
                  color: item.disabled ? "#48617e" : "#2d6a18",
                  fontWeight: 700,
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function StudentMain() {
  const { user } = useAuth();

  const visibleGestion = useMemo(
    () => gestionOptions.filter((item) => item.roles.includes(user?.id_perfil)),
    [user?.id_perfil],
  );

  const novedades = [
    {
      id: 1,
      titulo: "Novedad nro 1. FORMATO TIPO TRAMITE",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero libero, eleifend a odio tincidunt, malesuada gravida urna. Maecenas rhoncus felis sed ultricies vestibulum. Aenean porta justo in nibh venenatis, non ullamcorper massa laoreet. Aliquam id pulvinar odio, vel placerat mauris. Quisque tristique, ipsum vitae tristique malesuada, lacus elit ullamcorper nibh, ac tristique arcu nibh ut turpis. Sed felis erat, ... VER MAS",
      invertida: false,
      imagen: "https://picsum.photos/800/600?8",
    },
    {
      id: 2,
      titulo: "Novedad nro 2. FORMATO AVISO",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero libero, eleifend a odio tincidunt, malesuada gravida urna. Maecenas rhoncus felis sed ultricies vestibulum. Aenean porta justo in nibh venenatis, non ullamcorper massa laoreet. Aliquam id pulvinar odio, vel placerat mauris. Quisque tristique, ipsum vitae tristique malesuada, lacus elit ullamcorper nibh, ac tristique arcu nibh ut turpis.",
      invertida: true,
      imagen: "https://picsum.photos/800/600?6",
    },
    {
      id: 3,
      titulo: "Novedad nro 3.",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero libero, eleifend a odio tincidunt, malesuada gravida urna. Maecenas rhoncus felis sed ultricies vestibulum. Aenean porta justo in nibh venenatis, non ullamcorper massa laoreet. Aliquam id pulvinar odio, vel placerat mauris. Quisque tristique, ipsum vitae tristique malesuada, lacus elit ullamcorper nibh, ac tristique arcu nibh ut turpis.",
      invertida: false,
      imagen: "https://picsum.photos/800/600?4",
    },
    {
      id: 4,
      titulo: "Novedad nro 4.",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero libero, eleifend a odio tincidunt, malesuada gravida urna. Maecenas rhoncus felis sed ultricies vestibulum. Aenean porta justo in nibh venenatis, non ullamcorper massa laoreet. Aliquam id pulvinar odio, vel placerat mauris. Quisque tristique, ipsum vitae tristique malesuada, lacus elit ullamcorper nibh, ac tristique arcu nibh ut turpis.",
      invertida: true,
      imagen: "https://picsum.photos/800/600?1",
    },
    {
      id: 5,
      titulo: "Novedad nro 5.",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque libero libero, eleifend a odio tincidunt, malesuada gravida urna. Maecenas rhoncus felis sed ultricies vestibulum. Aenean porta justo in nibh venenatis, non ullamcorper massa laoreet. Aliquam id pulvinar odio, vel placerat mauris. Quisque tristique, ipsum vitae tristique malesuada, lacus elit ullamcorper nibh, ac tristique arcu nibh ut turpis.",
      invertida: false,
      imagen: "https://picsum.photos/800/600?3",
    },
  ];

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        mt: "-90px",
        pt: { xs: "114px", md: "130px" },
        pb: 8,
        minHeight: "calc(100vh - 90px)",
        bgcolor: "#f4f8fc",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            overflow: "hidden",
            borderRadius: 6,
            px: { xs: 3, md: 6 },
            py: { xs: 4, md: 5 },
            minHeight: 260,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            background:
              "linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%)",
            color: "white",
            backgroundImage:
              "linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%), url('/images/carrousel/EntradaUTN.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box sx={{ maxWidth: 700 }}>
            <Typography
              variant="overline"
              sx={{ letterSpacing: 1.8, opacity: 0.85, fontWeight: 700 }}
            >
              Panel SAE Alumnos
            </Typography>
            <Typography
              variant="h3"
              sx={{
                mt: 1,
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: "2rem", md: "3rem" },
              }}
            >
              {`Bienvenido${user?.nombre ? `, ${user.nombre}` : ""}`}
            </Typography>
            <Typography
              sx={{
                mt: 2,
                maxWidth: 560,
                fontSize: { xs: 16, md: 18 },
                opacity: 0.92,
              }}
            >
              Tu vida estudiantil, organizada en una sola pantalla.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 3 }}
            >
              <Chip
                label={user?.legajo ? `Legajo ${user.legajo}` : "Sesión activa"}
                sx={{
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "white",
                  fontWeight: 700,
                }}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: 220,
              height: 220,
              borderRadius: "32px",
              backgroundImage: "url('/images/principal/logoUTNrotado.png')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              transform: "rotate(8deg)",
              filter: "drop-shadow(0 18px 35px rgba(0,0,0,0.22))",
            }}
          />
        </Box>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            Gestión Alumnos
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            Módulos operativos principales para el trabajo diario del equipo.
          </Typography>
        </Box>
        <Grid container spacing={2.5} sx={{ mt: 1 }}>
          {visibleGestion.map((item) => (
            <Grid key={item.name} item xs={12} sm={6} lg={4}>
              <DashboardCard item={item} onClick={() => navigate(item.route)} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#123666" }}>
            Novedades Estudiantiles
          </Typography>
          <Typography sx={{ mt: 1, color: "#5a6f8f" }}>
            {" "}
            Información actualizada sobre actividades, comunicados y novedades
            académicas.
          </Typography>
        </Box>

        <NovedadesEstudiantiles novedades={novedades}></NovedadesEstudiantiles>
      </Container>
    </Box>
  );
}
