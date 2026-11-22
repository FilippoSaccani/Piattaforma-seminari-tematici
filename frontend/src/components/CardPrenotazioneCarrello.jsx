
import { useState } from "react";

import FormPrenotazione, { MAX_STUDENTI } from "./FormPrenotazione";

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

function CardPrenotazioneCarrello({
    seminario,
    selezionato,
    onSeleziona,
    onRimuovi,
    onModifica,
    mostraSelezione = true
}) {
    const [inModifica, setInModifica] = useState(false);
    const [datiModificati, setDatiModificati] = useState(seminario);
    const [mostraErrori, setMostraErrori] = useState(false);

    // Mantiene soltanto le fasce ancora disponibili
    const disponibilitaDisponibili = seminario.disponibilita
        .map(giorno => ({
            ...giorno,
            fasceOrarie: giorno.fasceOrarie.filter(
                fascia =>
                    fascia.prenotazione === null ||
                    (
                        giorno.data === seminario.data &&
                        fascia.oraInizio === seminario.oraInizio
                    )
            )
        }))
        .filter(giorno => giorno.fasceOrarie.length > 0);

    function aggiornaCampo(campo, valore) {
        setDatiModificati(precedenti => ({
            ...precedenti,
            [campo]: valore
        }));
    }

    function verificaValidita() {
        const errori = {};

        if (!datiModificati.data) {
            errori.data = "Seleziona una data.";
        }

        if (datiModificati.data && !datiModificati.oraInizio) {
            errori.fascia = "Seleziona una fascia oraria.";
        }

        if (
            datiModificati.numeroStudenti === "" ||
            !Number.isInteger(Number(datiModificati.numeroStudenti)) ||
            Number(datiModificati.numeroStudenti) < 1 ||
            Number(datiModificati.numeroStudenti) > MAX_STUDENTI
        ) {
            errori.numeroStudenti = `Inserisci un numero intero di studenti tra 1 e ${MAX_STUDENTI}.`;
        }

        return errori;
    }

    const errori = verificaValidita();

    function apriModifica() {
        setDatiModificati(seminario);
        setMostraErrori(false);
        setInModifica(true);
    }

    function salvaModifiche() {
        setMostraErrori(true);

        if (Object.keys(errori).length > 0) {
            return;
        }

        onModifica(datiModificati);
        setInModifica(false);
    }

    function annullaModifiche() {
        setDatiModificati(seminario);
        setMostraErrori(false);
        setInModifica(false);
    }

    return (
        <div className="background-white border rounded padding-1 shadow flex-column gap-1">

            <div className="flex-between flex-align-center">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">{seminario.titolo}</h2>
                    <p className="color-grey">{seminario.dipartimento}</p>
                </div>

                {mostraSelezione ? (
                    <input
                        type="checkbox"
                        className="background-white rounded-circle pointer seleziona-tutti"
                        checked={selezionato}
                        onChange={onSeleziona}
                    />
                ) : (
                    <span className="background-cream color-granato width-fit height-fit padding-03-1 rounded-20 flex gap-05 flex-align-center">
                        <i className="fa-solid fa-list-check"></i>
                        Da confermare
                    </span>
                )}
            </div>

            {inModifica ? (
                <FormPrenotazione
                    disponibilita={disponibilitaDisponibili}
                    durata={seminario.durata}
                    dataSelezionata={datiModificati.data}
                    fasciaSelezionata={datiModificati.oraInizio}
                    numeroStudenti={datiModificati.numeroStudenti}
                    modalita={seminario.modalitaDisponibili}
                    modalitaSelezionata={datiModificati.modalita}
                    errori={mostraErrori ? errori : {}}
                    onChangeData={data => {
                        setDatiModificati(precedenti => ({
                            ...precedenti,
                            data,
                            oraInizio: ""
                        }));
                    }}
                    onChangeFascia={oraInizio =>
                        aggiornaCampo("oraInizio", oraInizio)
                    }
                    onChangeStudenti={numeroStudenti =>
                        aggiornaCampo(
                            "numeroStudenti",
                            numeroStudenti === "" ? "" : Number(numeroStudenti)
                        )
                    }
                    onChangeModalita={valore =>
                        aggiornaCampo("modalita", valore)
                    }
                />
            ) : (
                <div className="grid-2">
                    <div>
                        <p className="info-label">Data</p>
                        <p className="info-value">
                            {formattaData(seminario.data)}
                        </p>
                    </div>

                    <div>
                        <p className="info-label">Fascia oraria</p>
                        <p className="info-value">
                            {seminario.oraInizio} - {calcolaOraFine(
                                seminario.oraInizio,
                                seminario.durata
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="info-label">Numero di studenti</p>
                        <p className="info-value">
                            {seminario.numeroStudenti}
                        </p>
                    </div>

                    <div>
                        <p className="info-label">Modalità</p>
                        <p className="info-value">{seminario.modalita}</p>
                    </div>
                </div>
            )}

            <div className="flex-end width-100 flex-align-center border-top">
                <div className="width-fit flex gap-1">
                    {inModifica ? (
                        <>
                            <button
                                type="button"
                                className="pointer background-red color-cream padding-05 rounded hover"
                                onClick={salvaModifiche}
                            >
                                Salva
                            </button>

                            <button
                                type="button"
                                className="pointer background-red color-cream padding-05 rounded hover"
                                onClick={annullaModifiche}
                            >
                                Annulla
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="pointer background-red color-cream padding-05 rounded hover"
                                onClick={apriModifica}
                            >
                                Modifica
                            </button>

                            <button
                                type="button"
                                className="pointer background-red color-cream padding-05 rounded hover"
                                onClick={onRimuovi}
                            >
                                Rimuovi
                            </button>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}

export default CardPrenotazioneCarrello;
