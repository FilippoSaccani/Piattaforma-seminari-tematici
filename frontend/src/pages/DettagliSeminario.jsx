import { useOutletContext } from "react-router-dom";

import Titolo from "../components/Titolo";
import Prenotazione from "../components/Prenotazione";

function DettagliSeminario() {
    const { utente } = useOutletContext();

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
        modalita: ["In presenza"],
        target: ["Terza", "Quarta", "Quinta"],
        trailer: "/video/intelligenza-artificiale.mp4",

        recensioni: [
            {
                id: 1,
                scuola: "Liceo Scientifico Aldo Moro",
                voto: 5,
                testo: "Seminario molto interessante e ben organizzato. Gli studenti hanno apprezzato particolarmente gli esempi pratici.",
                anno: 2026
            },
            {
                id: 2,
                scuola: "Istituto Tecnico Blaise Pascal",
                voto: 4,
                testo: "Un'esperienza formativa interessante, che ha permesso di approfondire argomenti affrontati durante le lezioni.",
                anno: 2025
            },
            {
                id: 3,
                scuola: "Liceo delle Scienze Applicate",
                voto: 5,
                testo: "Relatore molto preparato e contenuti spiegati in modo chiaro e coinvolgente.",
                anno: 2025
            }
        ]
    };

    const classi = seminario.target.length > 1
    ? `${seminario.target.slice(0, -1).join(", ")} e ${seminario.target.at(-1)}`
    : seminario.target[0];

    const numeroRecensioni = seminario.recensioni.length;

    const mediaRecensioni = numeroRecensioni > 0
        ? seminario.recensioni.reduce((somma, recensione) => somma + recensione.voto, 0) / numeroRecensioni
        : 0;

    return (
        <div className="page-content flex-column gap-2">

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

            {seminario.disponibilita.length > 0 ? (
                <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                    <div className="flex-between flex-align-center">
                        <h2 className="color-granato">Disponibilità</h2>

                        <span className="width-fit padding-03-1 rounded-20 background-red color-cream flex-align-center gap-05">
                            <i className="fa-solid fa-location-dot"></i>
                            {seminario.modalita.join(" e ")}
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
            ) : (
                <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                    <h2 className="color-granato">Disponibilità</h2>
                    <p className="color-grey">
                        Tutte le date e le fasce orarie previste per questo seminario sono state prenotate.
                        Al momento non è possibile effettuare nuove prenotazioni.
                    </p>
                </div>
            )}

            {seminario.trailer && (
                <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                    <h2 className="color-granato">Trailer del seminario</h2>

                    <div className="video">
                        <video src={seminario.trailer} controls />
                    </div>
                </div>
            )}

            {seminario.disponibilita.length > 0 && utente === "Scuola" && (
                <Prenotazione
                    disponibilita={seminario.disponibilita}
                    modalita={seminario.modalita}
                />
            )}

            <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                <div className="flex-between flex-align-center">
                    <h2 className="color-granato">Recensioni</h2>

                    {numeroRecensioni > 0 && (
                        <div className="flex-align-center gap-05">
                            <i className="fa-solid fa-star stella"></i>
                            <span className="info-value">{mediaRecensioni.toFixed(1)}</span>
                            <span className="info-label">({numeroRecensioni})</span>
                        </div>
                    )}
                </div>

                {numeroRecensioni === 0 ? (
                    <p className="color-grey">
                        Non sono ancora presenti recensioni per questo seminario.
                    </p>
                ) : (
                    <div className="recensioni-lista flex-column gap-1">
                        {seminario.recensioni.map((recensione, index) => (
                            <div
                                key={recensione.id}
                                className={`${index > 0 ? "border-top " : ""}flex-column gap-05`}
                            >
                                <div className="flex-between flex-align-center gap-1">
                                    <p className="info-value">{recensione.scuola}</p>
                                    <span className="info-label">{recensione.anno}</span>
                                </div>

                                <div className="flex gap-05">
                                    {[1, 2, 3, 4, 5].map(stella => (
                                        <i
                                            key={stella}
                                            className={`fa-star ${stella <= recensione.voto ? "fa-solid" : "fa-regular"}`}
                                            style={{ color: stella <= recensione.voto ? "#E5A000" : "#BDBDBD" }}
                                        ></i>
                                    ))}
                                </div>

                                <p className="color-grey">{recensione.testo}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default DettagliSeminario;
