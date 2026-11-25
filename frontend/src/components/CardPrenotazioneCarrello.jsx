import { useState } from "react";
import { formattaData, calcolaOraFine } from "../utils/date";
import {
    filtraDisponibilitaDisponibili,
    rispettaPreavviso,
    trovaSovrapposizione,
    giorniPreavviso
} from "../utils/disponibilita";

import FormPrenotazione, { MAX_STUDENTI } from "./FormPrenotazione";
import Pulsante from "./Pulsante";

function CardPrenotazioneCarrello({
    seminario,
    selezionato,
    onSeleziona,
    onRimuovi,
    onModifica,
    mostraSelezione = true,
    altrePrenotazioni = []
}) {
    const [inModifica, setInModifica] = useState(false);
    const [datiModificati, setDatiModificati] = useState(seminario);
    const [mostraErrori, setMostraErrori] = useState(false);

    const disponibilitaDisponibili = filtraDisponibilitaDisponibili(
        seminario.disponibilita,
        seminario.data,
        seminario.oraInizio
    );

    // Prenotazione della scuola nello stesso orario, se c'è
    const sovrapposizione = trovaSovrapposizione(seminario, altrePrenotazioni);

    const rispettaIlPreavviso = rispettaPreavviso(seminario.data, seminario.oraInizio);
    const confermabile = rispettaIlPreavviso && !sovrapposizione;

    function aggiornaCampo(campo, valore) {
        setDatiModificati(precedenti => ({
            ...precedenti,
            [campo]: valore
        }));
    }

    function verificaValidita() {
        const errori = {};

        const giornoSelezionato = disponibilitaDisponibili.find(
            giorno => giorno.data === datiModificati.data
        );

        // La data e la fascia devono essere tra quelle ancora prenotabili
        if (!datiModificati.data) {
            errori.data = "Seleziona una data.";
        } else if (!giornoSelezionato) {
            errori.data = "Seleziona una delle date disponibili.";
        } else if (!datiModificati.oraInizio) {
            errori.fascia = "Seleziona una fascia oraria.";
        } else if (
            !giornoSelezionato.fasceOrarie.some(
                fascia => fascia.oraInizio === datiModificati.oraInizio
            )
        ) {
            errori.fascia = "Seleziona una delle fasce orarie disponibili.";
        } else {
            const sovrapposizioneModificata = trovaSovrapposizione(
                { ...datiModificati, durata: seminario.durata },
                altrePrenotazioni
            );

            if (sovrapposizioneModificata) {
                errori.fascia = `In questo orario hai già "${sovrapposizioneModificata.titolo}". Scegli un'altra fascia.`;
            }
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
        <div className="background-white border rounded padding-1 shadow flex-column gap-1 shadow-hover">

            <div className="flex-between flex-align-center">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">{seminario.titolo}</h2>
                    <p className="color-grey">{seminario.dipartimento}</p>
                </div>

                {mostraSelezione ? (
                    <input
                        type="checkbox"
                        className="background-white rounded-circle pointer seleziona-tutti"
                        checked={selezionato && confermabile}
                        onChange={onSeleziona}
                        disabled={!confermabile}
                        aria-label={`Seleziona ${seminario.titolo}`}
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

            {sovrapposizione && !inModifica && (
                <p className="color-red">
                    Non puoi confermare questa prenotazione perché nello stesso orario hai già
                    "{sovrapposizione.titolo}". Modificala scegliendo un'altra fascia oppure rimuovila.
                </p>
            )}

            {!rispettaIlPreavviso && !inModifica && (
                <p className="color-red">
                    Non è più possibile confermare questa prenotazione: va confermata almeno {giorniPreavviso()} giorni
                    prima del seminario. Modificala scegliendo un'altra data oppure rimuovila.
                </p>
            )}

            <div className="flex-end width-100 flex-align-center border-top">
                <div className="width-fit flex gap-1">
                    {inModifica ? (
                        <>
                            <Pulsante testo="Salva" onClick={salvaModifiche} />
                            <Pulsante testo="Annulla" onClick={annullaModifiche} />
                        </>
                    ) : (
                        <>
                            <Pulsante testo="Modifica" onClick={apriModifica} />
                            <Pulsante testo="Rimuovi" onClick={onRimuovi} />
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}

export default CardPrenotazioneCarrello;