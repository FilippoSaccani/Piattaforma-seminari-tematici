function GestioneDisponibilita({ disponibilita, durata, setSeminario }) {
    function aggiungiData() {
        setSeminario(precedente => ({
            ...precedente,
            disponibilita: [
                ...precedente.disponibilita,
                {
                    data: "",
                    fasceOrarie: [
                        { oraInizio: "" }
                    ]
                }
            ]
        }));
    }

    function rimuoviData(indiceData) {
        setSeminario(precedente => ({
            ...precedente,
            disponibilita: precedente.disponibilita.filter(
                (elemento, indice) => indice !== indiceData
            )
        }));
    }

    function aggiornaData(indiceData, data) {
        setSeminario(precedente => ({
            ...precedente,
            disponibilita: precedente.disponibilita.map((elemento, indice) =>
                indice === indiceData
                    ? { ...elemento, data: data }
                    : elemento
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
                            { oraInizio: "" }
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
                            (fascia, indice) => indice !== indiceFascia
                        )
                    }
                    : elemento
            )
        }));
    }

    function calcolaDataMinima() {
        const domani = new Date();
        domani.setDate(domani.getDate() + 1);

        const anno = domani.getFullYear();
        const mese = String(domani.getMonth() + 1).padStart(2, "0");
        const giorno = String(domani.getDate()).padStart(2, "0");

        return `${anno}-${mese}-${giorno}`;
    }

    function aggiornaData(indiceData, data) {
        if (data) {
            const [anno, mese, giorno] = data.split("-").map(Number);
            const dataSelezionata = new Date(anno, mese - 1, giorno);

            // Non permette di selezionare le domeniche
            if (dataSelezionata.getDay() === 0) {
                return;
            }

            // Non permette di inserire date già presenti
            const dataEsistente = disponibilita.some((elemento, indice) =>
                indice !== indiceData && elemento.data === data
            );

            if (dataEsistente) {
                return;
            }
        }

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
            if (minutiInizio < 8 * 60 || minutiInizio > ultimoOrario) {
                return;
            }

            // Verifica sovrapposizione con le altre fasce
            const fasce = disponibilita[indiceData].fasceOrarie;

            const sovrapposta = fasce.some((fascia, indice) => {
                if (indice === indiceFascia || !fascia.oraInizio) {
                    return false;
                }

                const [oreEsistenti, minutiEsistenti] = fascia.oraInizio.split(":").map(Number);

                const inizioEsistente = oreEsistenti * 60 + minutiEsistenti;
                const fineEsistente = inizioEsistente + Number(durata);

                return minutiInizio < fineEsistente &&
                    minutiFine > inizioEsistente;
            });

            if (sovrapposta) {
                return;
            }
        }

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

        const minutiTotali = 19 * 60 - Number(durata);

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
                    key={indiceData}
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
                            min={calcolaDataMinima()}
                            value={elemento.data}
                            onChange={event =>
                                aggiornaData(indiceData, event.target.value)
                            }
                            className="border rounded padding-05-1"
                            required
                        />
                    </div>

                    <div className="flex-column gap-1">

                        <p>Fasce orarie</p>

                        {elemento.fasceOrarie.map((fascia, indiceFascia) => (
                            <div key={indiceFascia} className="width-100 flex-between flex-align-end gap-1">
                                <div key={indiceFascia} className="grid-2 width-80">
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
