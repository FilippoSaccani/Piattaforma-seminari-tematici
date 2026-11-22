import { useState } from "react";

function GestioneDisponibilita({ disponibilita, durata, dataMinima, setSeminario }) {
    const [errori, setErrori] = useState({});

    function aggiungiData() {
        setSeminario(precedente => ({
            ...precedente,
            disponibilita: [
                ...precedente.disponibilita,
                {
                    id: null,
                    idTemporaneo: crypto.randomUUID(),
                    data: "",
                    fasceOrarie: [
                        {
                            id: null,
                            idTemporaneo: crypto.randomUUID(),
                            oraInizio: ""
                        }
                    ]
                }
            ]
        }));
    }

    function rimuoviData(indiceData) {
        setSeminario(precedente => ({
            ...precedente,
            disponibilita: precedente.disponibilita.filter(
                (_, indice) => indice !== indiceData
            )
        }));

        setErrori(precedente => {
            const nuoviErrori = {};

            Object.entries(precedente).forEach(([chiave, messaggio]) => {
                if (chiave.startsWith("data_")) {
                    const indice = Number(chiave.split("_")[1]);

                    if (indice < indiceData) {
                        nuoviErrori[chiave] = messaggio;
                    } else if (indice > indiceData) {
                        nuoviErrori[`data_${indice - 1}`] = messaggio;
                    }
                } else if (chiave.startsWith("fascia_")) {
                    const [, indice] = chiave.split("_");
                    const indiceFascia = Number(indice);

                    if (indiceFascia < indiceData) {
                        nuoviErrori[chiave] = messaggio;
                    } else if (indiceFascia > indiceData) {
                        nuoviErrori[chiave.replace(
                            `fascia_${indiceFascia}_`,
                            `fascia_${indiceFascia - 1}_`
                        )] = messaggio;
                    }
                } else {
                    nuoviErrori[chiave] = messaggio;
                }
            });

            return nuoviErrori;
        });
    }

    function aggiungiFascia(indiceData) {
        setSeminario(precedente => ({
            ...precedente,
            disponibilita: precedente.disponibilita.map((elemento, indice) =>
                indice === indiceData
                    ? {
                        ...elemento,
                        fasceOrarie: [
                            ...elemento.fasceOrarie,
                            {
                                id: null,
                                idTemporaneo: crypto.randomUUID(),
                                oraInizio: ""
                            }
                        ]
                    }
                    : elemento
            )
        }));
    }

    function rimuoviFascia(indiceData, indiceFascia) {
        setSeminario(precedente => ({
            ...precedente,
            disponibilita: precedente.disponibilita.map((elemento, indice) =>
                indice === indiceData
                    ? {
                        ...elemento,
                        fasceOrarie: elemento.fasceOrarie.filter(
                            (_, posizione) => posizione !== indiceFascia
                        )
                    }
                    : elemento
            )
        }));

        setErrori(precedente => {
            const nuoviErrori = {};

            Object.entries(precedente).forEach(([chiave, messaggio]) => {
                const corrispondenza = chiave.match(/^fascia_(\d+)_(\d+)$/);

                if (corrispondenza) {
                    const data = Number(corrispondenza[1]);
                    const fascia = Number(corrispondenza[2]);

                    if (data === indiceData) {
                        if (fascia < indiceFascia) {
                            nuoviErrori[chiave] = messaggio;
                        } else if (fascia > indiceFascia) {
                            nuoviErrori[`fascia_${data}_${fascia - 1}`] = messaggio;
                        }
                    } else {
                        nuoviErrori[chiave] = messaggio;
                    }
                } else {
                    nuoviErrori[chiave] = messaggio;
                }
            });

            return nuoviErrori;
        });
    }

    function impostaErroreFascia(indiceData, indiceFascia, messaggio) {
        setErrori(precedente => {
            const nuoviErrori = { ...precedente };

            // Elimina gli eventuali errori precedenti delle fasce della stessa data
            Object.keys(nuoviErrori).forEach(chiave => {
                if (chiave.startsWith(`fascia_${indiceData}_`)) {
                    delete nuoviErrori[chiave];
                }
            });

            if (messaggio) {
                nuoviErrori[`fascia_${indiceData}_${indiceFascia}`] = messaggio;
            }

            return nuoviErrori;
        });
    }

    function aggiornaData(indiceData, data) {
        const riferimento = `data_${indiceData}`;

        if (data) {
            const [anno, mese, giorno] = data.split("-").map(Number);
            const dataSelezionata = new Date(anno, mese - 1, giorno);

            // Non permette di selezionare le domeniche
            if (dataSelezionata.getDay() === 0) {
                setErrori(precedente => ({
                    ...precedente,
                    [riferimento]: "Non puoi selezionare una domenica."
                }));
                return;
            }

            // Non permette di inserire date già presenti
            const dataEsistente = disponibilita.some((elemento, indice) =>
                indice !== indiceData && elemento.data === data
            );

            if (dataEsistente) {
                setErrori(precedente => ({
                    ...precedente,
                    [riferimento]: "Questa data è già stata inserita."
                }));
                return;
            }
        }

        setErrori(precedente => {
            const nuoviErrori = { ...precedente };
            delete nuoviErrori[riferimento];
            return nuoviErrori;
        });

        setSeminario(precedente => ({
            ...precedente,
            disponibilita: precedente.disponibilita.map((elemento, indice) =>
                indice === indiceData
                    ? { ...elemento, data: data }
                    : elemento
            )
        }));
    }

    function aggiornaOraInizio(indiceData, indiceFascia, oraInizio) {
        if (oraInizio) {
            const [ore, minuti] = oraInizio.split(":").map(Number);
            const minutiInizio = ore * 60 + minuti;
            const minutiFine = minutiInizio + Number(durata);

            const ultimoOrario = 18 * 60 - Number(durata);

            // Verifica dei limiti orari
            if (minutiInizio < 8 * 60) {
                impostaErroreFascia(
                    indiceData,
                    indiceFascia,
                    "L'orario deve iniziare dalle 08:00."
                );
                return;
            }

            if (minutiInizio > ultimoOrario) {
                impostaErroreFascia(
                    indiceData,
                    indiceFascia,
                    "Il seminario deve terminare entro le 18:00."
                );
                return;
            }

            // Verifica sovrapposizione con le altre fasce
            const fasce = disponibilita[indiceData].fasceOrarie;

            const sovrapposta = fasce.some((fascia, indice) => {
                if (indice === indiceFascia || !fascia.oraInizio) {
                    return false;
                }

                const [oreEsistenti, minutiEsistenti] =
                    fascia.oraInizio.split(":").map(Number);

                const inizioEsistente = oreEsistenti * 60 + minutiEsistenti;
                const fineEsistente = inizioEsistente + Number(durata);

                return minutiInizio < fineEsistente &&
                    minutiFine > inizioEsistente;
            });

            if (sovrapposta) {
                impostaErroreFascia(
                    indiceData,
                    indiceFascia,
                    "Questa fascia oraria si sovrappone a un'altra."
                );
                return;
            }
        }

        impostaErroreFascia(indiceData, indiceFascia, null);

        setSeminario(precedente => ({
            ...precedente,
            disponibilita: precedente.disponibilita.map((elemento, indice) =>
                indice === indiceData
                    ? {
                        ...elemento,
                        fasceOrarie: elemento.fasceOrarie.map((fascia, indice) =>
                            indice === indiceFascia
                                ? { ...fascia, oraInizio: oraInizio }
                                : fascia
                        )
                    }
                    : elemento
            )
        }));
    }

    function calcolaOraFine(oraInizio) {
        if (!oraInizio || !durata || Number(durata) <= 0) {
            return "";
        }

        const [ore, minuti] = oraInizio.split(":");

        const minutiTotali =
            Number(ore) * 60 +
            Number(minuti) +
            Number(durata);

        if (minutiTotali >= 1440) {
            return "";
        }

        const oreFine = Math.floor(minutiTotali / 60);
        const minutiFine = minutiTotali % 60;

        const oreFormattate = oreFine < 10 ? "0" + oreFine : oreFine;
        const minutiFormattati = minutiFine < 10 ? "0" + minutiFine : minutiFine;

        return oreFormattate + ":" + minutiFormattati;
    }

    function calcolaUltimoOrarioInizio() {
        if (!durata || Number(durata) <= 0) {
            return "18:00";
        }

        const minutiTotali = 18 * 60 - Number(durata);

        const ore = Math.floor(minutiTotali / 60);
        const minuti = minutiTotali % 60;

        const oreFormattate = ore < 10 ? "0" + ore : ore;
        const minutiFormattati = minuti < 10 ? "0" + minuti : minuti;

        return oreFormattate + ":" + minutiFormattati;
    }

    return (
        <div className={`flex-column ${durata > 0 ? 'gap-1' : ''}`}>
            <p>Disponibilità <span className="color-red">*</span></p>

            {disponibilita.map((elemento, indiceData) => (
                <div
                    key={elemento.id ?? elemento.idTemporaneo}
                    className="flex-column gap-1 border rounded padding-1"
                >

                    <div className="flex-between flex-align-center">
                        <h3>Data {indiceData + 1}</h3>

                        <button
                            type="button"
                            onClick={() => rimuoviData(indiceData)}
                            className="background-red color-cream padding-05 rounded hover pointer flex-center"
                        >
                            Rimuovi data
                        </button>
                    </div>

                    <div className="flex-column gap-05">
                        <label>Data del seminario</label>

                        <input
                            type="date"
                            min={dataMinima}
                            value={elemento.data}
                            onChange={event =>
                                aggiornaData(indiceData, event.target.value)
                            }
                            className="border rounded padding-05-1"
                            required
                        />

                        {errori[`data_${indiceData}`] && (
                            <span className="color-red">
                                {errori[`data_${indiceData}`]}
                            </span>
                        )}
                    </div>

                    <div className="flex-column gap-1">

                        <p>Fasce orarie</p>

                        {elemento.fasceOrarie.map((fascia, indiceFascia) => (
                            <div key={fascia.id ?? fascia.idTemporaneo} className="width-100 flex-between flex-align-end gap-1">
                                <div className="grid-2 width-80">
                                    <div className="flex-column gap-05">
                                        <label className="info-label">
                                            Ora di inizio
                                        </label>

                                        <input
                                            type="time"
                                            min="08:00"
                                            max={calcolaUltimoOrarioInizio()}
                                            value={fascia.oraInizio}
                                            onChange={event =>
                                                aggiornaOraInizio(
                                                    indiceData,
                                                    indiceFascia,
                                                    event.target.value
                                                )
                                            }
                                            className="border rounded padding-05-1"
                                            required
                                        />

                                        {errori[`fascia_${indiceData}_${indiceFascia}`] && (
                                            <span className="color-red">
                                                {errori[`fascia_${indiceData}_${indiceFascia}`]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-column gap-05">
                                        <label className="info-label">
                                            Ora di fine
                                        </label>

                                        <input
                                            type="text"
                                            value={calcolaOraFine(fascia.oraInizio)}
                                            placeholder="Calcolata automaticamente"
                                            className="border rounded padding-05-1 background-light color-grey"
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </div>

                                {elemento.fasceOrarie.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            rimuoviFascia(indiceData, indiceFascia)
                                        }
                                        className="background-red color-cream padding-05 rounded hover pointer width-fit"
                                    >
                                        Rimuovi fascia
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => aggiungiFascia(indiceData)}
                            className="background-red color-cream padding-05 rounded hover pointer flex-center gap-05"
                        >
                            <i className="fa-solid fa-plus"></i>
                            Aggiungi fascia oraria
                        </button>

                    </div>

                </div>
            ))}


            {durata && Number(durata) > 0 ? (
                <button
                    type="button"
                    onClick={aggiungiData}
                    className="background-red color-cream padding-05 rounded hover pointer flex-center gap-05"
                >
                    <i className="fa-solid fa-plus"></i>
                    Aggiungi data
                </button>
            ) : (
                <p className="color-red padding-05-1">
                    Inserisci la durata del seminario per poter aggiungere le date e le fasce orarie.
                </p>
            )}

        </div>
    );
}

export default GestioneDisponibilita;
