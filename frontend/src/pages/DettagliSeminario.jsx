
import Titolo from "../components/Titolo";

function DettagliSeminario({ utente }) {

    const seminario = {
        id: 1,
        dipartimento: "Dipartimento di Ingegneria Enzo Ferrari",
        titolo: "Intelligenza artificiale: applicazioni e prospettive future",
        descrizione: "Un seminario dedicato alla scoperta dell'intelligenza artificiale, delle sue principali applicazioni e delle prospettive di sviluppo.\n\nNon sono richieste conoscenze pregresse di programmazione.",
        relatore: "Prof. Marco Rossi",
        email: "marco.rossi@unimore.it",
        disponibilita: [
            { data: "15/12/2026", fasceOrarie: ["09:00 - 11:00", "14:00 - 16:00"] },
            { data: "17/12/2026", fasceOrarie: ["10:00 - 12:00"] },
            { data: "18/12/2026", fasceOrarie: ["09:00 - 12:00"] }
        ],
        modalita: "In presenza",
        target: ["Terza", "Quarta", "Quinta"],
        trailer: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
    };

    const classi = seminario.target.length === 1
        ? seminario.target[0]
        : seminario.target.slice(0, -1).join(", ") + " e " +
          seminario.target[seminario.target.length - 1];

    return (
        <div className="content width-100 flex-column gap-2 sfondo">

            <div className="flex-column gap-1">
                <span className="width-fit padding-01-04 rounded-20 background-red color-cream">
                    {seminario.dipartimento}
                </span>

                <Titolo
                    titolo={seminario.titolo}
                    sottotitolo={`Rivolto alle classi ${classi} delle scuole superiori.`}
                />
            </div>

            <div className="grid-2">
                <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                    <h2 className="color-granato">Descrizione</h2>
                    <p className="color-grey">{seminario.descrizione}</p>
                </div>
  
                <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                    <h2 className="color-granato">Relatore</h2>

                    <div className="flex-align-center gap-1">
                        <div className="avatar flex-center rounded-circle background-cream color-granato">
                            <i className="fa-solid fa-user"></i>
                        </div>

                        <div className="flex-column gap-05">
                            <p className="info-value">{seminario.relatore}</p>
                            <span className="info-label">{seminario.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                <div className="flex-between flex-align-center">
                    <h2 className="color-granato">Disponibilità</h2>

                    <span className="width-fit padding-05 rounded-20 background-red color-cream flex-align-center gap-05">
                        <i className="fa-solid fa-location-dot"></i>
                        <p>{seminario.modalita}</p>
                    </span>
                </div>

                <div className="flex-column gap-1">
                    {seminario.disponibilita.map((giorno, index) => (
                        <div
                            key={index}
                            className={`${index > 0 ? "border-top " : ""}flex-between flex-align-center gap-1`}
                        >
                            <p className="info-value color-grey">{giorno.data}</p>

                            <div className="flex-align-center gap-1 flex-wrap">
                                {giorno.fasceOrarie.map((fascia, i) => (
                                    <span key={i} className="color-grey">
                                        {i > 0 && " | "}
                                        {fascia}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {seminario.trailer && 
                <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                    <h2 className="color-granato">Trailer del seminario</h2>

                    <div className="video">
                        <iframe
                            src={seminario.trailer.replace("watch?v=", "embed/")}
                            title="Trailer del seminario"
                            allowFullScreen
                        />
                    </div>
                </div>
            }

        </div>
    );
}

export default DettagliSeminario;
