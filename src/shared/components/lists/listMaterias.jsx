import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";

import SchoolIcon from "@mui/icons-material/School";

function MateriasXAnoList({ ano, listaMaterias }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <List
      disablePadding
      sx={{
        mb: 1.25,
        overflow: "hidden",
        border: "1px solid",
        borderColor: isOpen
          ? "rgba(21, 61, 113, 0.22)"
          : "rgba(21, 61, 113, 0.1)",
        borderRadius: 2.5,
        transition: "border-color 180ms ease, box-shadow 180ms ease",
        boxShadow: isOpen ? "0 8px 22px rgba(21, 61, 113, 0.07)" : "none",
      }}
    >
      <ListItemButton
        onClick={handleIsOpen}
        aria-expanded={isOpen}
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 1.5,
          bgcolor: isOpen ? "rgba(21, 61, 113, 0.055)" : "background.paper",
          "&:hover": { bgcolor: "rgba(21, 61, 113, 0.07)" },
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            mr: 1.5,
            display: "grid",
            placeItems: "center",
            color: "var(--primary)",
            bgcolor: "rgba(21, 61, 113, 0.09)",
            borderRadius: 1.75,
          }}
        >
          <SchoolIcon sx={{ fontSize: 20 }} />
        </Box>
        <ListItemText
          primary={ano}
          secondary={`${listaMaterias.length} materias`}
          primaryTypographyProps={{ fontWeight: 650, fontSize: "1.05rem" }}
          secondaryTypographyProps={{ fontSize: "0.8rem" }}
        />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ px: { xs: 1.5, sm: 2 }, py: 1 }}>
          {listaMaterias.map((row) => (
            <ListItem key={row} disableGutters sx={{ py: 0.75 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    bgcolor: "var(--primary)",
                    borderRadius: "50%",
                    opacity: 0.65,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={row}
                primaryTypographyProps={{ color: "text.secondary", lineHeight: 1.5 }}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </List>
  );
}
export default MateriasXAnoList;
