
import { Box,Container } from "@mui/material";

export default function SAEPage({children}){
    return(
    <Box
        sx={{
            mt: "-90px",
            pt: { xs: "90px", md: "100px" },
            pb: 4,
            minHeight: "calc(100vh - 90px)",
            bgcolor: "var(--background)",
        }}
        >
        <Container maxWidth="xl">
            {children}
        </Container>
    </Box>);
}