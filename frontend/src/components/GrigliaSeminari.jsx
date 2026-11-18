function GrigliaSeminari({ seminari, testoRicerca, categoriaSelezionata, dipartimentoSelezionato, statoSelezionato = "" }) {
    // Applicazione dei filtri
    const seminariFiltrati = seminari.filter((seminario) => {
        const testo = testoRicerca.toLowerCase().trim();

        const corrispondeRicerca =
            seminario.titolo.toLowerCase().includes(testo) ||
            seminario.descrizione.toLowerCase().includes(testo) ||
            seminario.categoria.toLowerCase().includes(testo) ||
            seminario.dipartimento.toLowerCase().includes(testo);

        const corrispondeCategoria =
            categoriaSelezionata === "" || seminario.categoria === categoriaSelezionata;

        const corrispondeDipartimento =
            dipartimentoSelezionato === "" || seminario.dipartimento === dipartimentoSelezionato;

        const corrispondeStato =
            statoSelezionato === "" || seminario.stato === statoSelezionato;

        return corrispondeRicerca && corrispondeCategoria && corrispondeDipartimento && corrispondeStato;
    });

    function CardSeminario({id, titolo, descrizione, categoria, dipartimento, mediaRecensioni, numeroRecensioni }) {
        return (
            <div
                className="shadow background-white border rounded padding-1 flex flex-column gap-1 pointer"
                onClick={() => window.location.href = `/dettagli-seminario/${id}`}
            >
                <div className="flex-between flex-align-center">
                    <span className="background-red color-cream width-fit padding-01-04 rounded-20">
                        {categoria}
                    </span>

                    {numeroRecensioni > 0 && (
                        <div className="flex flex-align-center gap-025">
                            <i className="fa-regular fa-star stella"></i>
                            <span>{mediaRecensioni.toFixed(1)}</span>
                            <span className="info-label">({numeroRecensioni})</span>
                        </div>
                    )}
                </div>

                <h3>{titolo}</h3>

                <p className="color-grey">{descrizione}</p>

                <div className="border-top">
                    <span className="info-label">Dipartimento</span>
                    <p className="info-value">{dipartimento}</p>
                </div>
            </div>
        );
    }

    if (seminariFiltrati.length === 0) {
        return (
            <p className="color-grey">Nessun seminario trovato.</p>
        );
    }

    return (
        <div className="grid-3 width-100">
            {seminariFiltrati.map((seminario) => (
                <CardSeminario
                    key={seminario.id}
                    {...seminario}
                />
            ))}
        </div>
    );
}

export default GrigliaSeminari;