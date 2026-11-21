
import { useState } from "react";
import FormRecensione from "./FormRecensione";

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
                            <button
                                type="button"
                                className="background-red color-cream padding-05 rounded pointer hover"
                                onClick={() => setMostraRecensione(false)}
                            >
                                Torna ai dati
                            </button>
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
                        <div className="width-fit flex gap-1">

                            {svolta ? (
                                prenotazione.recensione ? (
                                    <button
                                        type="button"
                                        className="pointer background-red color-cream padding-05 rounded hover"
                                        onClick={() => setMostraRecensione(true)}
                                    >
                                        Visualizza recensione
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="pointer background-red color-cream padding-05 rounded hover"
                                        onClick={() => setMostraFormRecensione(true)}
                                    >
                                        Lascia recensione
                                    </button>
                                )
                            ) : (
                                <button
                                    type="button"
                                    className="pointer background-red color-cream padding-05 rounded hover"
                                    onClick={() => onDisdici(prenotazione)}
                                >
                                    Disdici prenotazione
                                </button>
                            )}

                        </div>
                    </div>
                </>
            )}

        </div>
    );
}

export default CardPrenotazioneScuola;