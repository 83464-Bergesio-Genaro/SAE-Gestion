import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import "./jpa.css";

export function InfoSectionPhone({information}){
    return(
        <div className="info-jpa-container">     
            <Grid Grid container spacing={5} justify="center"item xs={12} sm={6} md={4}>
            {information.map((item,index)=>(
                 <Card key={index} sx={{ minHeight: 300,borderRadius:5 }}>
                    <CardMedia
                        component="img"
                        height="250"
                        image={item.image}
                        alt={item.alt}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" textAlign="center"  component="div" fontWeight={"bold"}>
                            {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={{ __html: item.text }}>
                            
                        </Typography>
                    </CardContent>
                </Card>))}
            </Grid>
        </div>);
}

export function InfoSectionWithId({information}){
    return(        
        <div className="info-jpa-container">
            
            {information.map((item,index)=>(
                index % 2 === 0 ? 
                    (<section id={item.section} className="info-jpa-secciones">
                    <div className="info-jpa-content">
                        <h2>{item.title}</h2>
                        <div className="info-jpa-hidden">
                            <div className="info-jpa-hidden-text">
                            <p dangerouslySetInnerHTML={{ __html: item.text }}></p>
                            </div>
                            <div className="info-jpa-image" alt={item.alt} style={{ backgroundImage: `url(${item.image})` }}></div>
                        </div>
                    </div>
                </section>) : 
                (
                    <section id={item.section} className="info-jpa-secciones">
                        <div className="info-jpa-content">
                            <h2>{item.title}</h2>
                            <div className="info-jpa-hidden-left">
                                <div className="info-jpa-image" alt={item.alt} style={{ backgroundImage: `url(${item.image})` }}></div>
                                <div className="info-jpa-hidden-text">
                                    <Typography variant="body" gutterBottom>
                                        <p dangerouslySetInnerHTML={{ __html: item.text }}></p>
                                    </Typography>                                
                                </div>
                            </div>
                        </div>
                    </section>
                )
                
            ))}
        </div>
    );
}
