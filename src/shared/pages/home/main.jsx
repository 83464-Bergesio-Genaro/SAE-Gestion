import { Box,Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SAEButton from "../../components/buttons/SAEButton";
import NewsGrid from "../../components/newsCards/NewsGrid";
import "./main.css";


export default function Main(){
  return(
  <div>
    <Box className="home-container" marginY={{xs:8,sm:10,md:12}} >
      <Grid container xs={12} md={6} sx={{justifyContent: "center",minHeight: "50vh",paddingTop:{xs:"2vh",sm:"4vh",md:"10vh"}  }} >
        <Grid container size={12} spacing={4} xs={12} md={12} >
          
          <Typography variant="h2" 
          width={"100%"} 
          sx={{ textAlign:{ xs: "center", sm: "left",md:"left" },
          fontWeight: "bold",
          color: "#000000",
          fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" }}}>
            Secretaría de <br />
            Asuntos <br />
            Estudiantiles
          </Typography>
          <Typography variant="h5" width={"100%"} sx={{
            textAlign:{ xs: "center", sm: "left",md:"left" },color: "#000000",
            fontSize: { xs: "1.25rem", md: "1.15rem",lg:"1.2rem" }}}>
            Universidad Tecnologica Nacional - Facultad Regional Córdoba
          </Typography>
          <Grid container 
            width={"100%"} 
            justifyContent={{ xs: "center", sm: "flex-start", md: "flex-start" }} 
            spacing={4}
            size={{ xs: 12, sm: 12,md:12,lg:8 }}
            xs={12}
            sm={12} 
            md={8} 
            sx={{ m: 0, p:{xs:4,sm:0} }}>
              <Grid 
                container
                size={{ xs: 12, sm: 6 }}>
                <SAEButton
                sx={{width:"100%",textTransform: "none",textAlign: "center"}}
                  component={Link}
                  to="/JPA"
                  variant="contained"
                >
                  Conoce nuestra Universidad
                </SAEButton>
              </Grid>
              
              <Grid 
                container
                size={{ xs: 12, sm: 6 }}>
                <SAEButton
                  sx={{width:"100%",textTransform: "none",textAlign: "center"}}
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="success"
                >
                  Soy parte de la UTN
                </SAEButton>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
    </Box>
    <NewsGrid />
  </div>
  );
}
/*

export default function Main() {
  return (
    <Box>
      <Box className="main-container">
        <Box className="main-title-container">
          <Typography component="h1" sx={{ m: 0 }}>
            Secretaría de <br />
            Asuntos <br />
            Estudiantiles
          </Typography>
 
          <Typography component="h3" sx={{ m: 0 }}>
            Universidad Tecnologica Nacional - Facultad Regional Córdoba
          </Typography>

          <Box className="main-button-container">
            <SAEButton
              className="main-jpa-button"
              component={Link}
              to="/JPA"
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Conoce nuestra Universidad
            </SAEButton>

            <SAEButton
              className="main-login-button"
              component={Link}
              to="/login"
              variant="contained"
              sx={{ bgcolor: "#4f9916", textTransform: "none", "&:hover": { bgcolor: "#3d7a11" } }}
            >
              Soy parte de la UTN
            </SAEButton>
          </Box>
        </Box>

        <Box className="main-image-container" />
      </Box>

      <NewsGrid />
    </Box>
  );
}
*/