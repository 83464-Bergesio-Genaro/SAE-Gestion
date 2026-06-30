import { Grid, Container, Box, Paper, Typography } from "@mui/material";
import HeaderPageEmployed from "../../../shared/components/HeaderPageEmployed";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import SAEPage from "../../../shared/components/page/SAEPage";
import TitleBox from "../../../shared/components/titleBox";

export default function AdminReport() {
  return (
    <SAEPage>
      <HeaderPageEmployed
        header=" Módulo de Reportes"
        title="Reportes y Estadisticas"
        description="Brinda soporte a la toma de decisiones en base a las decisiones."
      />
      <TitleBox title="Estadisticas de Becas" />
      <SchoolarshipChart />
    </SAEPage>
  );
}
const mockData = [
  { id: 0, value: 35, label: "Economica" },
  { id: 1, value: 40, label: "Investigacion" },
  { id: 2, value: 15, label: "Servicio" },
];
const lineDataX = ["2021", "2022", "2023", "2024", "2025", "2026"];
const pieData = [
  { id: 0, value: 50, label: "M. Belgrano" },
  { id: 1, value: 15, label: "Progresar" },
  { id: 2, value: 60, label: "Rectorado" },
];
function SchoolarshipChart() {
  return (
    <Grid
      container
      spacing={3}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "25px",
          }}
        >
          <Typography variant="h6" color="var(--primary)" gutterBottom>
            Becarios SAE
          </Typography>
          <PieChart
            series={[
              {
                data: mockData,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 4,
                highlightScope: {
                  fade: "global",
                  highlight: "item",
                },
                highlighted: {
                  additionalRadius: 12,
                },
              },
            ]}
            height={300}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: -10,
                labelStyle: { fontSize: 13 },
              },
            }}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "25px",
          }}
        >
          <Typography variant="h6" color="var(--primary)"  gutterBottom>
            Becarios SAE vs Nacionales
          </Typography>
          <LineChart
            xAxis={[{ data: lineDataX, scaleType: "point" }]}
            series={[
              {
                data: [50, 32, 25, 38, 65, 53],
                label: "Nacional",
                color: "#0288d1",
              },
              {
                data: [25, 27, 35, 21, 18, 26],
                label: "SAE",
                color: "#2e7d32",
              },
            ]}
            width={400}
            height={300}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "center" },
                padding: 0,
                labelStyle: { fontSize: 12 },
              },
            }}
          />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "25px",
          }}
        > 
          <Typography variant="h6" color="var(--primary)"  gutterBottom>
            Becarios Nacional
          </Typography>
          <PieChart
            series={[
              {
                data: pieData,
                innerRadius: 30,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 4,
                highlightScope: {
                  fade: "global",
                  highlight: "item",
                },
                highlighted: {
                  additionalRadius: 12,
                },
              },
            ]}
            width={320}
            height={300}
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "middle", horizontal: "right" },
                padding: -10, // Mismo truco para recortar la distancia lateral de la leyenda
                labelStyle: { fontSize: 13 },
              },
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
