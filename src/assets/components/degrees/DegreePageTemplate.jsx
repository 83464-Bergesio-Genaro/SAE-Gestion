import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListEngineer from "../lists/listEngineer";
import MateriasXAnoList from "../lists/listMaterias";
import {
  DegreeBulletList,
  DegreeHero,
  DegreePage,
  DegreeSection,
  DegreeVideo,
} from "./DegreePageSections";

export default function DegreePageTemplate({
  title,
  image,
  description,
  degreeInfo,
  curriculum,
  scopes,
  profile,
  video,
}) {
  return (
    <DegreePage>
      <DegreeHero image={image} title={title} />

      <DegreeSection title="Sobre la carrera" icon={InfoOutlinedIcon}>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: { xs: "1rem", sm: "1.075rem" },
            lineHeight: 1.8,
          }}
        >
          {description}
        </Typography>
        <ListEngineer {...degreeInfo} />
      </DegreeSection>

      <DegreeSection title="Plan de estudios" icon={MenuBookOutlinedIcon}>
        <List disablePadding>
          {curriculum.map(({ year, subjects }) => (
            <MateriasXAnoList
              key={year}
              ano={year}
              listaMaterias={subjects}
            />
          ))}
        </List>
      </DegreeSection>

      <DegreeSection
        title="Incumbencias y alcance profesional"
        icon={EngineeringOutlinedIcon}
      >
        <DegreeBulletList items={scopes} numbered />
      </DegreeSection>

      <DegreeSection
        title="Perfil del graduado"
        icon={PersonOutlineRoundedIcon}
      >
        <DegreeBulletList items={profile} collapsible />
      </DegreeSection>

      {video?.src && (
        <DegreeSection
          title={video.sectionTitle ?? "Conocé el Departamento"}
          icon={PlayCircleOutlineRoundedIcon}
        >
          <DegreeVideo title={video.title} src={video.src} />
        </DegreeSection>
      )}
    </DegreePage>
  );
}
