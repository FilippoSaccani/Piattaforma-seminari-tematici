import { useState } from "react";
import { Link } from "react-router-dom";

// Converte una data e un orario nel formato Date
function convertiDataOra(data, oraInizio, durata) {
    const [anno, mese, giorno] = data.split("-").map(Number);
    const [ore, minuti] = oraInizio.split(":").map(Number);

    return new Date(
        anno,
        mese - 1,
        giorno,
        ore,
        minuti + Number(durata)
    );
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

// Converte una data da YYYY-MM-DD a DD/MM/YYYY
function formattaData(data) {
    const [anno, mese, giorno] = data.split("-");

    return `${giorno}/${mese}/${anno}`;
}

function CardSeminarioDocente({ seminario, onModifica, onElimina }) {
    const [mostraTutte, setMostraTutte] = useState(false);

    const oggi = new Date();

    // Recupera tutte le prenotazioni, distinguendo quelle concluse
    const prenotazioni = seminario.disponibilita
        .flatMap(disponibilita =>
            disponibilita.fasceOrarie
                .filter(fascia => fascia.prenotazione !== null)
                .map(fascia => {
                    const fine = convertiDataOra(
                        disponibilita.data,
                        fascia.oraInizio,
                        seminario.durata
                    );

                    const oraFine = calcolaOraFine(
                        fascia.oraInizio,
                        seminario.durata
                    );

                    return {
                        scuola: fascia.prenotazione.scuola,
                        data: disponibilita.data,
                        oraInizio: fascia.oraInizio,
                        orario: `${fascia.oraInizio} - ${oraFine}`,
                        conclusa: fine <= oggi
                    };
                })
        )
        .sort((a, b) => {
            const dataA = convertiDataOra(
                a.data,
                a.oraInizio,
                0
            );

            const dataB = convertiDataOra(
                b.data,
                b.oraInizio,
                0
            );

            return dataA - dataB;
        });

    // Conta le fasce future ancora disponibili
    const fasceDisponibili = seminario.disponibilita
        .flatMap(disponibilita =>
            disponibilita.fasceOrarie.filter(fascia => {
                const fine = convertiDataOra(
                    disponibilita.data,
                    fascia.oraInizio,
                    seminario.durata
                );

                return fascia.prenotazione === null && fine > oggi;
            })
        );

    const prenotazioniVisibili = mostraTutte
        ? prenotazioni
        : prenotazioni.slice(0, 3);

    const numeroPrenotazioniConcluse = prenotazioni.filter(
        prenotazione => prenotazione.conclusa
    ).length;

    return (
        <div className="background-white border rounded padding-1 shadow flex-column gap-1">

            {/* Intestazione */}
            <div className="flex-between flex-align-center">
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
                        <p className="bold color-red">
                            Prenotazioni ({prenotazioni.length})
                        </p>

                        {numeroPrenotazioniConcluse > 0 && (
                            <div className="flex-align-center gap-025">
                                {seminario.numeroRecensioni > 0 ? (
                                    <>
                                        <i className="fa-solid fa-star stella"></i>
                                        <span className="bold">
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

                    {/* Tabella prenotazioni */}
                    <div className="flex-column gap-1">
                        <div className="grid-4 flex-align-center">
                            <p className="info-value">Scuola</p>
                            <p className="info-value">Data</p>
                            <p className="info-value">Orario</p>
                            <p className="info-value">Stato</p>
                        </div>

                        <div className="flex-column gap-1">
                            {prenotazioniVisibili.map((prenotazione, indice) => (
                                <div
                                    key={`${prenotazione.data}_${prenotazione.oraInizio}`}
                                    className="grid-4 border-top flex-align-center"
                                >
                                    <span className="info-label">
                                        {prenotazione.scuola}
                                    </span>

                                    <span className="info-label">
                                        {formattaData(prenotazione.data)}
                                    </span>

                                    <span className="info-label">
                                        {prenotazione.orario}
                                    </span>

                                    <span className="info-label">
                                        {prenotazione.conclusa
                                            ? "Conclusa"
                                            : "In programma"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mostra tutte */}
                    {prenotazioni.length > 3 && (
                        <button
                            type="button"
                            className="background-red color-cream hover rounded padding-05 pointer"
                            onClick={() => setMostraTutte(!mostraTutte)}
                        >
                            {mostraTutte ? "Mostra meno" : "Mostra tutte"}
                        </button>
                    )}
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

                    {seminario.stato === "Pubblicato" && (
                        <>
                            <button
                                type="button"
                                className="background-red color-cream hover rounded padding-05 pointer"
                                onClick={() => onModifica(seminario)}
                            >
                                Modifica
                            </button>

                            <button
                                type="button"
                                className="pointer background-red color-cream padding-05 rounded hover"
                                onClick={() => onElimina(seminario)}
                            >
                                Elimina
                            </button>
                        </>
                    )}

                </div>
            </div>

        </div>
    );
}

export default CardSeminarioDocente;
