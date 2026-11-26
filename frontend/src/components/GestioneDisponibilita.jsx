
import Pulsante from "./Pulsante";
import { fasciaOccupata } from "../utils/disponibilita";
import { calcolaOraFine } from "../utils/date";

function GestioneDisponibilita({
    disponibilita,
    durata,
    dataMinima,
    setSeminario,
    errori
}) {

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
    }

    function aggiornaData(indiceData, data) {
        setSeminario(precedente => ({
            ...precedente,
            disponibilita: precedente.disponibilita.map((elemento, indice) =>
                indice === indiceData
                    ? { ...elemento, data }
                    : elemento
            )
        }));
    }

    function aggiornaOraInizio(indiceData, indiceFascia, valore) {
        setSeminario(precedente => ({
            ...precedente,
            disponibilita: precedente.disponibilita.map((giorno, indice) =>
                indice === indiceData
                    ? {
                        ...giorno,
                        fasceOrarie: giorno.fasceOrarie.map((fascia, indice) =>
                            indice === indiceFascia
                                ? { ...fascia, oraInizio: valore }
                                : fascia
                        )
                    }
                    : giorno
            )
        }));
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
        <div className={`flex-column ${durata > 0 ? "gap-1" : ""}`}>
            <p>Disponibilità <span className="color-red">*</span></p>

            {disponibilita.map((elemento, indiceData) => (
                <div
                    key={elemento.id ?? elemento.idTemporaneo}
                    className="flex-column gap-1 border rounded padding-1"
                >

                    <div className="flex-between flex-align-center">
                        <h3>Data {indiceData + 1}</h3>

                        {!elemento.fasceOrarie.some(fasciaOccupata) && (
                            <Pulsante
                                testo="Rimuovi data"
                                onClick={() => rimuoviData(indiceData)}
                            />
                        )}
                    </div>

                    <div className="flex-column gap-05">
                        <label htmlFor={`data_${indiceData}`}>
                            Data del seminario
                        </label>

                        <input
                            id={`data_${indiceData}`}
                            name={`data_${indiceData}`}
                            type="date"
                            min={dataMinima}
                            value={elemento.data}
                            onChange={event =>
                                aggiornaData(indiceData, event.target.value)
                            }
                            className="border rounded padding-05-1"
                            disabled={elemento.fasceOrarie.some(fasciaOccupata)}
                            required
                        />

                        {elemento.fasceOrarie.some(fasciaOccupata) && (
                            <span className="info-label">
                                La data non si può modificare né rimuovere perché ha fasce orarie già prenotate.
                            </span>
                        )}

                        {errori[`data_${indiceData}`] && (
                            <span className="color-red">
                                {errori[`data_${indiceData}`]}
                            </span>
                        )}
                    </div>

                    <div className="flex-column gap-1">

                        <p>Fasce orarie</p>

                        {elemento.fasceOrarie.map((fascia, indiceFascia) => (
                            <div
                                key={fascia.id ?? fascia.idTemporaneo}
                                className="width-100 flex-between flex-align-end gap-1"
                            >
                                <div className="grid-2 width-80">
                                    <div className="flex-column gap-05">
                                        <label
                                            htmlFor={`ora_inizio_${indiceData}_${indiceFascia}`}
                                            className="info-label"
                                        >
                                            Ora di inizio
                                        </label>

                                        <input
                                            id={`ora_inizio_${indiceData}_${indiceFascia}`}
                                            name={`fascia_${indiceData}_${indiceFascia}`}
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
                                            disabled={fasciaOccupata(fascia)}
                                            required
                                        />

                                        {fasciaOccupata(fascia) && (
                                            <span className="info-label">
                                                Prenotata da {fascia.prenotazione.scuola}
                                            </span>
                                        )}

                                        {errori[`fascia_${indiceData}_${indiceFascia}`] && (
                                            <span className="color-red">
                                                {errori[`fascia_${indiceData}_${indiceFascia}`]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-column gap-05">
                                        <label
                                            htmlFor={`ora_fine_${indiceData}_${indiceFascia}`}
                                            className="info-label"
                                        >
                                            Ora di fine
                                        </label>

                                        <input
                                            id={`ora_fine_${indiceData}_${indiceFascia}`}
                                            type="text"
                                            value={calcolaOraFine(fascia.oraInizio, durata)}
                                            placeholder="Calcolata automaticamente"
                                            className="border rounded padding-05-1 background-light color-grey"
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </div>

                                {elemento.fasceOrarie.length > 1 && !fasciaOccupata(fascia) && (
                                    <Pulsante
                                        testo={
                                            <span className="none">
                                                Rimuovi fascia
                                            </span>
                                        }
                                        icona="fa-solid fa-trash visible"
                                        onClick={() =>
                                            rimuoviFascia(indiceData, indiceFascia)
                                        }
                                    />
                                )}
                            </div>
                        ))}

                        {errori[`fasce_${indiceData}`] && (
                            <span className="color-red">
                                {errori[`fasce_${indiceData}`]}
                            </span>
                        )}

                        <Pulsante
                            testo="Aggiungi fascia oraria"
                            icona="fa-solid fa-plus"
                            onClick={() => aggiungiFascia(indiceData)}
                        />
                    </div>

                </div>
            ))}

            {durata && Number(durata) > 0 ? (
                <Pulsante
                    testo="Aggiungi data"
                    icona="fa-solid fa-plus"
                    onClick={aggiungiData}
                />
            ) : (
                <span className="color-red padding-05-1">
                    Inserisci la durata del seminario per poter aggiungere le date e le fasce orarie.
                </span>
            )}

        </div>
    );
}

export default GestioneDisponibilita;
