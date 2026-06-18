import { useMemo, useState } from "react";
import { Box, Container, Typography,Dialog,DialogContent,DialogTitle,IconButton,DialogActions } from "@mui/material";
import { Grid, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import  SAEButton from "../buttons/SAEButton";

export default function InteractiveGrid({items}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSelection, setDialogSelection] = useState(null);
  
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const hoveredCol = hoveredIndex !== null ? hoveredIndex % 4 : null;
  const hoveredRow =
    hoveredIndex !== null ? Math.floor(hoveredIndex / 4) : null;

  const gridTemplateColumns = useMemo(() => {
    if (hoveredCol === null) return "1fr 1fr 1fr 1fr";
    return [0, 1, 2, 3]
      .map((col) => (col === hoveredCol ? "2fr" : "0.6fr"))
      .join(" ");
  }, [hoveredCol]);

  const gridTemplateRows = useMemo(() => {
    if (hoveredRow === null) return "repeat(2, 260px)";
    return [0, 1]
      .map((row) => (row === hoveredRow ? "320px" : "200px"))
      .join(" ");
  }, [hoveredRow]);

  return (
    <Container maxWidth="x4" sx={{ padding:"0px"}}>
      <Box
        onMouseLeave={() => setHoveredIndex(null)}
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: gridTemplateColumns,
          },
          gridTemplateRows: {
            xs: "repeat(4, 180px)",
            md: gridTemplateRows,
          },
          gap: 1.5,
          transition:
            "grid-template-columns 350ms ease, grid-template-rows 350ms ease",
        }}
      >
        {items.map((item, index) => {

          const isActive = hoveredIndex === index;
          const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

          return (
            <Box
              key={item.section}
              onClick={() => {
                setDialogSelection(item);
                setDialogOpen(true);
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 0,
                cursor: "pointer",
                minHeight: 0,
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                  filter: isDimmed ? "brightness(0.72)" : "brightness(1)",
                  transition: "transform 600ms ease, filter 600ms ease",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,.15))",
                  opacity: isActive ? 1 : 0.75,
                  transition: "opacity 600ms ease",
                }}
              />
              <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(0,0,0,.15)",
                    transition: "all .3s ease",
                }}
                
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: 24 , 
                      fontWeight:500,
                      lineHeight: 1.1,
                      transform: {
                        xs: "translateY(0)",
                        md: isActive ? "translateY(0)" : "translateY(8px)",
                      },
                      opacity: {
                        xs: 0,
                        md: isActive ? 1 : 0,
                      },
                      borderRadius: 1,
                      transition: "all 600ms ease",
                    }}
                  >
                    Aprieta para ver mas
                  </Typography>
                </Box>
              <Box
                sx={{
                  position: "absolute",
                  left: 16,
                  right: 16,
                  bottom: 16,
                  color: "#fff",
                  zIndex: 2,
                  transform: isActive ? "translateY(0)" : "translateY(8px)",
                  opacity: isActive ? 1 : 0.9,
                  transition: "all 600ms ease",
                }}
              >

                <Typography
                  sx={{
                    my: 2.5,
                    fontSize: { xs: 14, md: isActive ? 24 : 18 },
                    fontWeight: 700,
                    lineHeight: 1.1,
                    transform: {
                      xs: "translateY(0)", // mobile siempre visible
                      md: isActive ? "translateY(0)" : "translateY(8px)",
                    },
                    opacity: {
                      xs: 1, // mobile siempre visible
                    },
                    transition: "all 400ms ease",
                  }}
                >
                  {item.title}
                </Typography>

                
              </Box>
            </Box>
          );
        })}
        {dialogOpen && dialogSelection && (
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              {dialogSelection?.title}
            </Typography>
            <IconButton onClick={() => setDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <>
                <Grid container spacing={1}>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}
                  dangerouslySetInnerHTML={{ __html: dialogSelection.text }} >

                  </Typography>
                </Grid>
              </>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <SAEButton
              variant="outlined"
              onClick={() => setDialogOpen(false)}
            >
              Cerrar
            </SAEButton>

          </DialogActions>
        </Dialog>
        )}
      </Box>
    </Container>
  );
}
