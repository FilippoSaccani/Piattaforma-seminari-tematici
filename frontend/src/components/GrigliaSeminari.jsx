
import CardSeminario from "./CardSeminario";

function GrigliaSeminari({
    seminari,
    testoRicerca,
    categoriaSelezionata,
    dipartimentoSelezionato,
    statoSelezionato = ""
}) {
    // Applicazione dei filtri
    const seminariFiltrati = seminari.filter((seminario) => {
        const testo = testoRicerca.toLowerCase().trim();

        const corrispondeRicerca =
            seminario.titolo.toLowerCase().includes(testo) ||
            seminario.descrizione.toLowerCase().includes(testo) ||
            seminario.categoria.toLowerCase().includes(testo) ||
            seminario.dipartimento.toLowerCase().includes(testo);

        const corrispondeCategoria =
            categoriaSelezionata === "" ||
            seminario.categoria === categoriaSelezionata;

        const corrispondeDipartimento =
            dipartimentoSelezionato === "" ||
            seminario.dipartimento === dipartimentoSelezionato;

        const corrispondeStato =
            statoSelezionato === "" ||
            seminario.stato === statoSelezionato;

        return (
            corrispondeRicerca &&
            corrispondeCategoria &&
            corrispondeDipartimento &&
            corrispondeStato
        );
    });

    if (seminariFiltrati.length === 0) {
        return (
            <p className="color-grey">
                Nessun seminario trovato.
            </p>
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
