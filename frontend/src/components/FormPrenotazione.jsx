import { formattaData, calcolaOraFine } from "../utils/date";

export const MAX_STUDENTI = 1000;

function FormPrenotazione({
    disponibilita,
    durata,
    dataSelezionata,
    fasciaSelezionata,
    numeroStudenti,
    modalita,
    modalitaSelezionata,
    errori = {},
    onChangeData,
    onChangeFascia,
    onChangeStudenti,
    onChangeModalita
}) {
    const giornoSelezionato = disponibilita.find(
        giorno => giorno.data === dataSelezionata
    );

    return (
        <>
            <div className="flex-column gap-05">
                <p>Seleziona una data</p>

                <div className="grid-10">
                    {disponibilita.map(giorno => (
                        <button
                            key={giorno.data}
                            type="button"
                            className={`padding-05-1 border rounded pointer ${dataSelezionata === giorno.data ? "background-cream color-granato border-granato" : "background-white"}`}
                            onClick={() => onChangeData(giorno.data)}
                        >
                            {formattaData(giorno.data)}
                        </button>
                    ))}
                </div>

                {errori.data && (
                    <span className="color-red">{errori.data}</span>
                )}
            </div>

            {giornoSelezionato && (
                <div className="flex-column gap-05">
                    <p>Seleziona una fascia oraria</p>

                    <div className="grid-10">
                        {giornoSelezionato.fasceOrarie.map(fascia => (
                            <button
                                key={fascia.oraInizio}
                                type="button"
                                className={`padding-05-1 border rounded pointer ${fasciaSelezionata === fascia.oraInizio ? "background-cream color-granato border-granato" : "background-white"}`}
                                onClick={() => onChangeFascia(fascia.oraInizio)}
                            >
                                {fascia.oraInizio} - {calcolaOraFine(fascia.oraInizio, durata)}
                            </button>
                        ))}
                    </div>

                    {errori.fascia && (
                        <span className="color-red">{errori.fascia}</span>
                    )}
                </div>
            )}

            <div className="grid-2 gap-1">
                <div className="flex-column gap-05">
                    <label htmlFor="numeroStudenti">
                        Numero di studenti per turno
                    </label>

                    <input
                        id="numeroStudenti"
                        type="number"
                        min="1"
                        max={MAX_STUDENTI}
                        step="1"
                        value={numeroStudenti}
                        onChange={e => {
                            const valore = e.target.value;

                            onChangeStudenti(valore === "" ? "" : Number(valore));
                        }}
                        className={`border rounded padding-05-1 ${errori.numeroStudenti ? "border-red" : ""}`}
                        required
                    />

                    {errori.numeroStudenti && (
                        <span className="color-red">{errori.numeroStudenti}</span>
                    )}
                </div>

                {modalita.length > 1 && (
                    <div className="flex-column gap-05">
                        <label htmlFor="modalita">Modalità</label>

                        <select
                            id="modalita"
                            value={modalitaSelezionata}
                            onChange={e => onChangeModalita(e.target.value)}
                            className="border rounded padding-05-1"
                        >
                            {modalita.map(opzione => (
                                <option key={opzione} value={opzione}>
                                    {opzione}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </>
    );
}

export default FormPrenotazione;
