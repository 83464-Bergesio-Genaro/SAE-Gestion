import { useNavigate } from "react-router-dom";
import { studentMenu, employedMenu, adminMenu } from "../../menus/MenuConfig";
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
function DashboardCard({ item, onClick }) {
  const Icon = item.icon;

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
        border: "1px solid rgba(17, 53, 101, 0.08)",
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
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
                color: "var(--primary)",
              }}
            >
              <Icon sx={{ fontSize: 30 }} />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "var(--text)" }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{ mt: 1, color: "var(--secondary)", minHeight: 48 }}
              >
                {item.descripcion}
              </Typography>
            </Box>

            <Box sx={{ mt: "auto" }}>
              <Chip
                label={"Disponible"}
                size="small"
                sx={{
                  bgcolor: "var(--lightGreen)",
                  color: "var(--greenDark)",
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

export default function DashboardMenu({ idPerfil }) {
  const navigate = useNavigate();
  let menu = [];
  if (idPerfil === 1) {
    menu = studentMenu;
  }
  if (idPerfil === 2) {
    menu = employedMenu;
  }
  if (idPerfil === 5) {
    menu = adminMenu;
  }
  return (
    <Grid container spacing={2.5} sx={{ mt: 1 }}>
      {menu
        .filter((item) => item.label !== "Inicio") //Filtra y quita el elemento "Inicio"
        .map((item, i) => (
          <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
            <DashboardCard item={item} onClick={() => navigate(item.path)} />
          </Grid>
        ))}
    </Grid>
  );
}
