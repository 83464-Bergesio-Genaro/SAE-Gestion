import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import PublicIcon from "@mui/icons-material/Public";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SchoolIcon from "@mui/icons-material/School";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import Link from "@mui/material/Link";
const text = {
  fontSize: "22px",
};

export default function ListEngineer(props) {
  const colorIcono = "#37518A";

  const { degree, duration, link, intermedio, video, world } = props;
  return (
    <List sx={{ width: "100%" }}>
      {degree && (
        <ListItem>
          <ListItemIcon>
            <SchoolIcon
              style={{ fill: colorIcono }}
              sx={{ width: 36, height: 36 }}
            />
          </ListItemIcon>
          <ListItemText
            primary={degree}
            slotProps={{
              primary: {
                style: text,
              },
            }}
          />
        </ListItem>
      )}
      {duration && (
        <ListItem>
          <ListItemIcon>
            <TimerOutlinedIcon
              style={{ fill: colorIcono }}
              sx={{ width: 36, height: 36 }}
            />
          </ListItemIcon>

          <ListItemText
            primary={duration}
            slotProps={{
              primary: {
                style: text,
              },
            }}
          />
        </ListItem>
      )}
      {video && (
        <ListItem>
          <ListItemIcon>
            <YouTubeIcon
              style={{ fill: colorIcono }}
              sx={{ width: 36, height: 36 }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Link href={video} color="inherit">
                Conocé más
              </Link>
            }
            slotProps={{
              primary: {
                style: text,
              },
            }}
          />
        </ListItem>
      )}
      {link && (
        <ListItem>
          <ListItemIcon>
            <LanguageOutlinedIcon
              style={{ fill: colorIcono }}
              sx={{ width: 36, height: 36 }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Link href={link} color="inherit">
                Visite la Pagina web del Departamento
              </Link>
            }
            slotProps={{
              primary: {
                style: text,
              },
            }}
          />
        </ListItem>
      )}
      {intermedio && (
        <ListItem>
          <ListItemIcon>
            <WorkOutlineOutlinedIcon
              style={{ fill: colorIcono }}
              sx={{ width: 36, height: 36 }}
            />
          </ListItemIcon>
          <ListItemText
            primary={intermedio}
            slotProps={{
              primary: {
                style: text,
              },
            }}
          />
        </ListItem>
      )}
      {world && (
        <ListItem>
          <ListItemIcon>
            <PublicIcon
              style={{ fill: colorIcono }}
              sx={{ width: 36, height: 36 }}
            />
          </ListItemIcon>
          <ListItemText
            primary={world}
            slotProps={{
              primary: {
                style: text,
              },
            }}
          />
        </ListItem>
      )}
    </List>
  );
}
