import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SavingsIcon from "@mui/icons-material/Savings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FlightIcon from "@mui/icons-material/Flight";
import SchoolIcon from "@mui/icons-material/School";
import FactoryIcon from "@mui/icons-material/Factory";
import "./jpa.css";
import {
  Typography,
  Card,
  CardContent
} from "@mui/material";
import { HashLink as Link } from 'react-router-hash-link';
import "./jpa.css";

export default function JPAIntro(){
    return(
       <div className="home-grid">

          {/* VIDEO */}
          <div className="menu-container">
            <div className="video-container">
              <iframe
                  src="https://www.youtube.com/embed/atGzunuzHIk?si=xgR3Ds0TcnPD66wg"
                  title="YouTube video player"
                  allow="autoplay"
                  allowFullScreen
              />
            </div>
          </div>


          {/* LATERAL */} 
          <div className="side-menu">
            <MenuCard item={{title: "Deportes",icon: SportsSoccerIcon,section: "info-deportes"}} />
            <MenuCard item={{title: "Bienestar",icon: FavoriteIcon,section: "info-bienestar"}} />
            <MenuCard item={{title: "Becas",icon: SavingsIcon,section: "info-becas"}} />
          </div>

          {/* BOTTOM */}
          <div className="bottom-menu">
            <MenuCard item={{title: "Biblioteca",icon: MenuBookIcon,section: "info-biblioteca"}} />
            <MenuCard item={{title: "Congresos",icon: FlightIcon,section: "info-congresos"}} />
            <MenuCard item={{title: "Tramites",icon: SchoolIcon,section: "info-tramites"}} />
            <MenuCard item={{title: "Visitas Tec.",icon: FactoryIcon,section: "info-visitas"}} />
          </div>
          

        </div>
    )
}

function MenuCard({item}) {

  return (
    <Card className="menu-card" sx={{ borderRadius: 3, backgroundColor: "#1f5e9c",height:"140px",boxShadow:"0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)" }}>
      <Link to={`/JPA#${item.section}`} sx={{ color: "white ", fontSize:"18px", textDecoration: "none !important" }}>
        <CardContent>
          <item.icon sx={{ fontSize: 60, mb: { xs: 0, md: 1 } }} />
          <Typography variant="h6">
            {item.title}
          </Typography>
        </CardContent>
      </Link>
    </Card>
  );
}