
function FormPrenotazione({
    disponibilita,
    dataSelezionata,
    fasciaSelezionata,
    numeroStudenti,
    modalita,
    modalitaSelezionata,
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

                <div className="flex gap-05">
                    {disponibilita.map(giorno => (
                        <button
                            key={giorno.data}
                            type="button"
                            className={`padding-05-1 border rounded pointer ${dataSelezionata === giorno.data ? "background-cream color-granato border-granato" : "background-white"}`}
                            onClick={() => onChangeData(giorno.data)}
                        >
                            {giorno.data}
                        </button>
                    ))}
                </div>
            </div>

            {giornoSelezionato && (
                <div className="flex-column gap-05">
                    <p>Seleziona una fascia oraria</p>

                    <div className="flex gap-05">
                        {giornoSelezionato.fasceOrarie.map(fascia => (
                            <button
                                key={fascia}
                                type="button"
                                className={`padding-05-1 border rounded pointer ${fasciaSelezionata === fascia ? "background-cream color-granato border-granato" : "background-white"}`}
                                onClick={() => onChangeFascia(fascia)}
                            >
                                {fascia}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex-between flex-align-center gap-2">
                <div className="flex-column gap-05 width-50">
                    <label htmlFor="numeroStudenti">
                        Numero di studenti per turno
                    </label>

                    <input
                        id="numeroStudenti"
                        type="number"
                        min="1"
                        step="1"
                        value={numeroStudenti}
                        onChange={e => onChangeStudenti(e.target.value)}
                        className="border rounded padding-05-1"
                        required
                    />
                </div>

                {modalita.length > 1 && (
                    <div className="flex-column gap-05 width-50">
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
