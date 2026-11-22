import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import { formattaData, calcolaOraFine } from "../utils/date";
import { filtraDisponibilitaDisponibili } from "../utils/disponibilita";
import api from "../services/api";

import Titolo from "../components/Titolo";
import Prenotazione from "../components/Prenotazione";

function DettagliSeminario() {
    const { utente } = useOutletContext();

    const { id } = useParams();
    const [seminario, setSeminario] = useState(null);

    useEffect(() => {
        api.get(`/seminari/${id}`).then(risposta => setSeminario(risposta.data));
    }, [id]);

    if (!seminario) {
        return null;
    }

    const classi = seminario.anni.length > 1
        ? `${seminario.anni.slice(0, -1).join(", ")} e ${seminario.anni.at(-1)}`
        : seminario.anni[0];

    const disponibilitaDisponibili = filtraDisponibilitaDisponibili(
        seminario.disponibilita
    );

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
                                key={giorno.data}
                                className={`${index > 0 ? "border-top " : ""}flex-between flex-align-center gap-1`}
                            >
                                <p className="info-value color-grey">
                                    {formattaData(giorno.data)}
                                </p>

                                <div className="flex-align-center gap-1 flex-wrap">
                                    {giorno.fasceOrarie.map((fascia, i) => (
                                        <span key={fascia.oraInizio} className="color-grey">
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
                                            className={`fa-star ${stella <= recensione.voto ? "fa-solid stella" : "fa-regular color-grey"}`}
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
