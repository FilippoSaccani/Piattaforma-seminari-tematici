function CardSeminari({ testoRicerca, categoriaSelezionata, dipartimentoSelezionato }) {
    //TODO: recuperare i seminari dal backend tramite fetch
    const seminari = [
        {
            id: 1,
            titolo: "Intelligenza artificiale",
            descrizione: "Introduzione alle nuove tecnologie e alle applicazioni dell'intelligenza artificiale.",
            categoria: "Scienze e Ingegneria",
            dipartimento: "DIEF"
        },
        {
            id: 2,
            titolo: "Robotica",
            descrizione: "Alla scoperta dei robot e dei sistemi automatizzati.",
            categoria: "Scienze e Ingegneria",
            dipartimento: "Scienze e Metodi dell'Ingegneria"
        },
        {
            id: 3,
            titolo: "Sostenibilità",
            descrizione: "Le sfide ambientali e le possibili soluzioni.",
            categoria: "Società e Cultura",
            dipartimento: "Scienze chimiche e geologiche"
        }
    ];

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

        return corrispondeRicerca && corrispondeCategoria && corrispondeDipartimento;
    });

    if (seminariFiltrati.length === 0) {
        return <p className="color-grey">Nessun seminario trovato.</p>;
    }

    function CardSeminario({ id, titolo, descrizione, categoria, dipartimento }) {
        return (
            <div className="shadow background-white border rounded padding-1 flex flex-column gap-1 pointer" onClick={() => window.location.href = `/dettagli-seminario/${id}`}>

                <span className="background-red color-cream width-fit padding-01-04 rounded-20">
                    {categoria}
                </span>

                <h3>{titolo}</h3>

                <p className="color-grey">{descrizione}</p>

                <div className="border-top">
                    <span className="info-label">Dipartimento</span>
                    <p className="info-value">{dipartimento}</p>
                </div>

            </div>
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

export default CardSeminari;