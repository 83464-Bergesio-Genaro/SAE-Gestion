import "./Popup.css";

export function PopupError({ message, onClose }){

  if(!message) return null;

  return(

    <div className="popup-overlay">

      <div className="popup-content">

        <h3 className="popup-message">{message}</h3>

        <button className="popup-button" onClick={onClose}>
          Cerrar
        </button>

      </div>

    </div>

  );
}
export function PopUpWaiting(){
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* A simple text loading indicator, or an actual spinner component */}
        <h3 className="popup-message">Cargando, espere unos segundos...</h3> 
        {/* You can add a CSS spinner or an icon here */}
        <div className="loader"></div>
      </div>
    </div>
  );
}