import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItemText from "@mui/material/ListItemText";
import React, { useState } from "react";

import SchoolIcon from "@mui/icons-material/School";

function MateriasXAnoList(props) {
  const { ano, listaMaterias } = props;
  const text = {
    fontSize: "22px",
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <List disablePadding>
      <ListItemButton onClick={handleIsOpen} divider>
        <ListItemText primary={ano} primaryTypographyProps={{ style: text }} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {listaMaterias.map((row) => {
            return (
              <ListItem disablePadding>
                <ListItemIcon sx={{ ml: 2 }}>
                  <SchoolIcon sx={{ width: 18, height: 18 }} />
                </ListItemIcon>
                <ListItemText primary={row} />
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
}
export default MateriasXAnoList;
