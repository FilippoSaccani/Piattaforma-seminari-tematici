import { useState } from "react";
import { formattaData, calcolaOraFine } from "../utils/date";

import FormRecensione from "./FormRecensione";
import Pulsante from "./Pulsante";

function CardPrenotazioneScuola({ prenotazione, onDisdici, onRecensisci }) {
    const svolta = prenotazione.stato === "Concluso";

    const [mostraFormRecensione, setMostraFormRecensione] = useState(false);
    const [mostraRecensione, setMostraRecensione] = useState(false);

    return (
        <div className="background-white border rounded padding-1 shadow flex-column gap-1">

            {mostraFormRecensione ? (
                <>
                    <h2 className="color-granato">{prenotazione.titolo}</h2>

                    <FormRecensione
                        onInvia={(recensione) => {
                            onRecensisci(prenotazione, recensione);
                            setMostraFormRecensione(false);
                        }}
                        onAnnulla={() => setMostraFormRecensione(false)}
                    />
                </>
            ) : mostraRecensione ? (
                <>
                    <h2 className="color-granato">{prenotazione.titolo}</h2>

                    <div className="flex-column gap-1">
                        <div className="flex-column gap-2">
                            <div className="flex-column gap-05">
                                <p className="info-label">Valutazione</p>

                                <div className="flex gap-05">
                                    {[1, 2, 3, 4, 5].map(stella => (
                                        <i
                                            key={stella}
                                            className={`fa-star ${stella <= prenotazione.recensione.voto ? "fa-solid color-red" : "fa-regular color-grey"}`}
                                        ></i>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="info-label">La tua recensione</p>
                                <p className="info-value">
                                    {prenotazione.recensione.testo}
                                </p>
                            </div>
                        </div>

                        <div className="flex-end border-top">
                            <Pulsante testo="Torna ai dati" onClick={() => setMostraRecensione(false)} />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex-between flex-align-center">
                        <div className="flex-column gap-05">
                            <h2 className="color-granato">{prenotazione.titolo}</h2>
                            <p className="color-grey">{prenotazione.dipartimento}</p>
                        </div>

                        <span className="background-cream color-granato width-fit padding-03-1 rounded-20 flex gap-05 flex-align-center">
                            {svolta ? (
                                <>
                                    <i className="fa-regular fa-circle-check"></i>
                                    Concluso
                                </>
                            ) : (
                                <>
                                    <i className="fa-regular fa-hourglass"></i>
                                    Da svolgere
                                </>
                            )}
                        </span>
                    </div>

                    <div className="grid-2">
                        <div>
                            <p className="info-label">Data</p>
                            <p className="info-value">
                                {formattaData(prenotazione.data)}
                            </p>
                        </div>

                        <div>
                            <p className="info-label">Fascia oraria</p>
                            <p className="info-value">
                                {prenotazione.oraInizio} - {calcolaOraFine(
                                    prenotazione.oraInizio,
                                    prenotazione.durata
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="info-label">Numero di studenti</p>
                            <p className="info-value">
                                {prenotazione.numeroStudenti}
                            </p>
                        </div>

                        <div>
                            <p className="info-label">Modalità</p>
                            <p className="info-value">{prenotazione.modalita}</p>
                        </div>
                    </div>

                    <div className="flex-end width-100 flex-align-center border-top">
                        {svolta ? (
                            prenotazione.recensione ? (
                                <Pulsante testo="Visualizza recensione" onClick={() => setMostraRecensione(true)} />
                            ) : (
                                <Pulsante testo="Lascia recensione" onClick={() => setMostraFormRecensione(true)} />
                            )
                        ) : (
                            <Pulsante testo="Disdici prenotazione" onClick={() => onDisdici(prenotazione)} />
                        )}
                    </div>
                </>
            )}

        </div>
    );
}

export default CardPrenotazioneScuola;