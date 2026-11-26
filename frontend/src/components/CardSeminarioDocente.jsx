import { useState } from "react";
import { Link } from "react-router-dom";
import { formattaData, convertiDataOra } from "../utils/date";
import { elencoPrenotazioni, fasciaOccupata, rispettaPreavviso } from "../utils/disponibilita";

import Pulsante from "./Pulsante";
import TabellaPrenotazioni from "./TabellaPrenotazioni";

function CardSeminarioDocente({ seminario, onModifica, onElimina }) {
    // Momento in cui la scheda viene mostrata, usato per distinguere le prenotazioni concluse
    const [oggi] = useState(() => new Date());

    // Tutte le prenotazioni in ordine cronologico, con il loro stato
    const prenotazioni = elencoPrenotazioni(seminario, oggi);

    // Conta le fasce future ancora disponibili
    const fasceDisponibili = seminario.disponibilita
    .flatMap(disponibilita =>
        disponibilita.fasceOrarie.filter(fascia => {
            const fine = convertiDataOra(
                disponibilita.data,
                fascia.oraInizio,
                seminario.durata
            );

            return (
                !fasciaOccupata(fascia) &&
                fine > oggi &&
                rispettaPreavviso(disponibilita.data, fascia.oraInizio)
            );
        })
    );

    const numeroPrenotazioniConcluse = prenotazioni.filter(
        prenotazione => prenotazione.conclusa && !prenotazione.disdetta
    ).length;

    const haStorico =
        numeroPrenotazioniConcluse > 0 ||
        seminario.numeroRecensioni > 0;

    return (
        <div className="background-white border rounded padding-1 shadow flex-column gap-1 shadow-hover">

            {/* Intestazione */}
            <div className="flex-between flex-align-center column-phone reverse">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">{seminario.titolo}</h2>

                    <p className="color-grey">
                        {seminario.dipartimento} - {seminario.categoria}
                    </p>
                </div>

                <span className="background-cream color-granato width-fit padding-03-1 rounded-20">
                    {seminario.stato}
                </span>
            </div>

            {/* Descrizione */}
            <div>
                <p className="info-label">Descrizione</p>
                <p className="info-value">{seminario.descrizione_breve}</p>
            </div>

            {/* Disponibilità residue */}
            {(seminario.stato === "Pubblicato" || seminario.stato === "Prenotato") && (
                <p className="info-label">
                    Fasce orarie disponibili:{" "}
                    <span className="info-value color-black">
                        {fasceDisponibili.length}
                    </span>
                </p>
            )}

            {/* Prenotazioni */}
            {prenotazioni.length > 0 && (
                <div className="border-top flex-column gap-1">

                    {/* Titolo e recensioni */}
                    <div className="flex-between flex-align-center">
                        <p className="bold size-1-3 color-red">
                            Prenotazioni ({prenotazioni.length})
                        </p>

                        {numeroPrenotazioniConcluse > 0 && (
                            <div className="flex-align-center gap-025">
                                {seminario.numeroRecensioni > 0 ? (
                                    <>
                                        <i className="fa-solid fa-star stella"></i>
                                        <span className="bold size-1-3">
                                            {seminario.mediaRecensioni.toFixed(1)}
                                        </span>
                                        <span className="info-label">
                                            ({seminario.numeroRecensioni})
                                        </span>
                                    </>
                                ) : (
                                    <span className="info-label">
                                        Nessuna recensione
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <TabellaPrenotazioni
                        prenotazioni={prenotazioni}
                        formattaData={formattaData}
                    />
                </div>
            )}

            {/* Pulsanti */}
            <div className="flex-end width-100 flex-align-center border-top">
                <div className="width-fit flex gap-1">
                    <Link
                        to={`/dettagli-seminario/${seminario.id}`}
                        className="background-red color-cream hover rounded padding-05 pointer"
                    >
                        Dettagli
                    </Link>

                    {/* La modifica è sempre possibile: il form blocca le fasce già prenotate */}
                    <Pulsante testo="Modifica" onClick={() => onModifica(seminario)} />

                    {/* Si eliminano solo i seminari senza prenotazioni da svolgere */}
                    {seminario.stato === "Pubblicato" && !haStorico && (
                        <Pulsante
                            testo="Elimina"
                            onClick={() => onElimina(seminario)}
                        />
                    )}

                </div>
            </div>

        </div>
    );
}

export default CardSeminarioDocente;
