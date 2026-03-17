import "./News.css";
import { useEffect, useState } from "react";
import { ObtenerNoticiasPublicas,getDownloadUrl} from "../../../api/PrensaService";
/*
 [
  {
    id: publicacion.id,
    titulo: publicacion.titulo_publicacion,
    descripcion: publicacion.descripcion,
    fecha_inicio: formatearFecha(publicacion.fecha_inicio),
    fecha_vigencia: formatearFecha(publicacion.fecha_vigencia),
    prioridad:publicacion.prioridad,
    no_dar_baja: publicacion.no_dar_baja,
    visualizaciones: publicacion.visualizaciones,
    portada: getFirstImage(publicacion.documentos_asociados),
    documentos:getDownloadableFiles(publicacion.documentos_asociados)
  }, 
];*/

export function NewsCardLeft({ news }) {

  return (
    <div className="news-card-left">
      {news.portada && 
      <img className="news-image"
          src={getDownloadUrl(news.portada.id)}
          alt={news.portada.name}
          loading="lazy">
      </img>
      }
      {!news.portada &&(
      <img className="news-image"
          style={{backgroundImage: "url(../../../../public/images/carrousel/EntradaUTN.jpg)"}}>
      </img>
      )}
      
      <div className="news-content">
        <h3>{news.titulo}</h3>
        <p>{news.fecha_inicio}</p>
        <p>{news.descripcion}</p>
        
          {news.documentos?.length > 0 && 
          news.documentos.map((doc, i) => (
          <a key={i}  className="news-document" target="_blank" onClick={() => getDownloadUrl(doc.id)}>
            <p>{doc.name}</p>
          </a>
          ))
        }
        
      </div>
    </div>
  );
}

export function NewsCardRight({ news }) {

  return (
    <div className="news-card-right">    
      <div className="news-content">
        <h3>{news.titulo}</h3>
        <p>{news.fecha_inicio}</p>
        <p>{news.descripcion}</p>
        
          {news.documentos?.length > 0 && 
          news.documentos.map((doc, i) => (
          <a key={i}  className="news-document" target="_blank" onClick={() => getDownloadUrl(doc.id)}>
            <p>{doc.name}</p>
          </a>
          ))
        }
        
      </div>
      {news.portada && 
      <img className="news-image"
          src={getDownloadUrl(news.portada.id)}
          alt={news.portada.name}
          loading="lazy">
      </img>
      }
      {!news.portada &&(
      <img className="news-image"
          style={{backgroundImage: "url(../../../../public/images/carrousel/EntradaUTN.jpg)"}}>
      </img>
      )}
    </div>
  );
}

export default function NewsSection() {
  const [newsList, setEventosJPA] = useState([]);
  useEffect(() => {
    const ObtenerEventosPublicosApi = async () => {
      try {
        const respuesta = await ObtenerNoticiasPublicas();
        if(respuesta?.success && respuesta?.data){
          setEventosJPA(respuesta?.data);
        }

      } catch (error) {
        console.error("Error al traer Eventos:", error);
      }
    };
    ObtenerEventosPublicosApi();
  }, []);
  return (
    <section className="news-section">
      <h2>Novedades</h2>
      <div className="news-list">
        {newsList.map((news,index) =>
        index % 2 === 0 ? (
          <NewsCardLeft
            key={news.id}
            news={news}
          />):(
            <NewsCardRight
            key={news.id}
            news={news}
          />
          )
        )}
      </div>
    </section>
  );

}