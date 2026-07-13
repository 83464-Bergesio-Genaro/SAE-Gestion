import React from "react";
import { Box,Grid,Typography } from "@mui/material";
import { SAETypography } from "../typography/SAETypography"; 

export default function HeaderPageStudent({
  title,
  description,
  backgroundImage,
  icon,
}) {
  const baseUrl = import.meta.env.BASE_URL;
  const IconComponent = icon;
  return (
    <Box sx={{borderRadius: 5, position:"relative"}}>
      <Box
        sx={{
          borderRadius: 5,
          p: { xs: 3, md: 3 },
          color: "var(--textWhite)",
          backgroundImage: `url(${baseUrl}${backgroundImage})`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row" ,
          '&::before': {
            content: '""',
            position: 'absolute',
            borderRadius: 5,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--lightBlue) 100%)',
            opacity: 0.8, // Podés regular la opacidad del degradado sobre la foto
            zIndex: 1,
          },
          '& > *': { position: 'relative', zIndex: 2 }
            }}
      >
        <Grid display={"flex"} flexDirection={"column"} gap={2}>
          <SAETypography variant="h3" >
            {title}
          </SAETypography>
          <SAETypography variant="subtitle2">{description}</SAETypography>
        </Grid>
        <IconComponent sx={{fontSize:"84px"}} />
      </Box>
    </Box>
  );
}
