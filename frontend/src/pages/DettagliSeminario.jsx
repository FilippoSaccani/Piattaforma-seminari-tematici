
import { useOutletContext } from "react-router-dom";

import Titolo from "../components/Titolo";
import Prenotazione from "../components/Prenotazione";

// Converte una data da YYYY-MM-DD a DD/MM/YYYY
function formattaData(data) {
    const [anno, mese, giorno] = data.split("-");

    return `${giorno}/${mese}/${anno}`;
}

// Calcola l'orario di fine
function calcolaOraFine(oraInizio, durata) {
    const [ore, minuti] = oraInizio.split(":").map(Number);

    const minutiTotali = ore * 60 + minuti + Number(durata);

    const oreFine = Math.floor(minutiTotali / 60);
    const minutiFine = minutiTotali % 60;

    return (
        String(oreFine).padStart(2, "0") +
        ":" +
        String(minutiFine).padStart(2, "0")
    );
}

function DettagliSeminario() {
    const { utente } = useOutletContext();

    const seminario = {
        id: 1,
        docente: "Prof. Marco Rossi",
        email: "marco.rossi@unimore.it",
        dipartimento: "Dipartimento di Ingegneria Enzo Ferrari",
        categoria: "Scienze e Ingegneria",
        titolo: "Intelligenza artificiale: applicazioni e prospettive future",
        descrizione_breve: "Un seminario dedicato alla scoperta dell'intelligenza artificiale e delle sue principali applicazioni.",
        descrizione_dettagliata: "Un seminario dedicato alla scoperta dell'intelligenza artificiale, delle sue principali applicazioni e delle prospettive di sviluppo.\n\nNon sono richieste conoscenze pregresse di programmazione.",
        requisiti: "",
        durata: 120,
        modalita: ["In presenza"],
        anni: [3, 4, 5],
        limite_prenotazioni: 10,
        video: "/video/intelligenza-artificiale.mp4",

        disponibilita: [
            {
                data: "2026-12-15",
                fasceOrarie: [
                    {
                        oraInizio: "09:00",
                        prenotazione: null
                    },
                    {
                        oraInizio: "14:00",
                        prenotazione: {
                            id: 1,
                            scuola: "Liceo Scientifico Aldo Moro",
                            numeroStudenti: 25
                        }
                    }
                ]
            },
            {
                data: "2026-12-17",
                fasceOrarie: [
                    {
                        oraInizio: "10:00",
                        prenotazione: null
                    }
                ]
            },
            {
                data: "2026-12-18",
                fasceOrarie: [
                    {
                        oraInizio: "09:00",
                        prenotazione: null
                    }
                ]
            }
        ],

        mediaRecensioni: 4.7,
        numeroRecensioni: 3,

        // Dati di esempio delle recensioni
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

    const classi = seminario.anni.length > 1
        ? `${seminario.anni.slice(0, -1).join(", ")} e ${seminario.anni.at(-1)}`
        : seminario.anni[0];

    // Mantiene soltanto le fasce non ancora prenotate
    const disponibilitaDisponibili = seminario.disponibilita
        .map(giorno => ({
            ...giorno,
            fasceOrarie: giorno.fasceOrarie.filter(
                fascia => fascia.prenotazione === null
            )
        }))
        .filter(giorno => giorno.fasceOrarie.length > 0);

    const numeroRecensioni = seminario.numeroRecensioni;

    const mediaRecensioni = seminario.mediaRecensioni;

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
                    <p className="color-grey">{seminario.descrizione_dettagliata}</p>
                </div>

                <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                    <h2 className="color-granato">Relatore</h2>

                    <div className="flex-align-center gap-1">
                        <div className="avatar flex-center rounded-circle background-cream color-granato">
                            <i className="fa-solid fa-user"></i>
                        </div>

                        <div className="flex-column gap-05">
                            <p className="info-value">{seminario.docente}</p>
                            <span className="info-label">{seminario.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            {disponibilitaDisponibili.length > 0 ? (
                <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                    <div className="flex-between flex-align-center">
                        <h2 className="color-granato">Disponibilità</h2>

                        <span className="width-fit padding-03-1 rounded-20 background-red color-cream flex-align-center gap-05">
                            <i className="fa-solid fa-location-dot"></i>
                            {seminario.modalita.join(" e ")}
                        </span>
                    </div>

                    <div className="flex-column gap-1">
                        {disponibilitaDisponibili.map((giorno, index) => (
                            <div
                                key={index}
                                className={`${index > 0 ? "border-top " : ""}flex-between flex-align-center gap-1`}
                            >
                                <p className="info-value color-grey">
                                    {formattaData(giorno.data)}
                                </p>

                                <div className="flex-align-center gap-1 flex-wrap">
                                    {giorno.fasceOrarie.map((fascia, i) => (
                                        <span key={i} className="color-grey">
                                            {i > 0 && " | "}
                                            {fascia.oraInizio} - {calcolaOraFine(
                                                fascia.oraInizio,
                                                seminario.durata
                                            )}
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

            {seminario.video && (
                <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                    <h2 className="color-granato">Trailer del seminario</h2>

                    <div className="video">
                        <video src={seminario.video} controls />
                    </div>
                </div>
            )}

            {disponibilitaDisponibili.length > 0 && utente === "Scuola" && (
                <Prenotazione
                    disponibilita={disponibilitaDisponibili}
                    modalita={seminario.modalita}
                    durata={seminario.durata}
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
