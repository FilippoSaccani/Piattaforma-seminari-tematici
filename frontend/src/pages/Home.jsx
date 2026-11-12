
import { useState } from "react";

import Titolo from "../components/Titolo";
import BarraRicercaFiltri from "../components/BarraRicercaFiltri";
import TextareaProposta from "../components/TextareaProposta";
import CardSeminari from "../components/CardSeminari";

function Home({ utente}) {
    // TODO: recuperare le categorie dal backend tramite fetch
    const [categorie, setCategorie] = useState([
        "Scienze e Ingegneria",
        "Medicina e Vita",
        "Società e Cultura"
    ]);

    //TODO: recuperare i dipartimenti dal backend tramite fetch
    const [dipartimento, setDipartimento] = useState([
        "DIEF",
        "Scienze e Metodi dell'Ingegneria",
        "Scienze fisiche, informatiche e matematiche",
        "Scienze chimiche e geologiche"
    ]);

    const [testoRicerca, setTestoRicerca] = useState("");   
    const [categoriaSelezionata, setCategoriaSelezionata] = useState("");
    const [dipartimentoSelezionato, setDipartimentoSelezionato] = useState("");
    const [statoSelezionato, setStatoSelezionato] = useState("");

    function filtraCategoria(categoria) {
        setCategoriaSelezionata(categoria);
    }
    
    function filtraDipartimento(dipartimento) {
        setDipartimentoSelezionato(dipartimento);
    }

    function filtraStato(stato) {
        setStatoSelezionato(stato);
    }

    return (
        <div className="content width-100 flex-column flex-center gap-2 sfondo">
            <Titolo
                titolo="Seminari tematici"
                sottotitolo="I seminari tematici sono volti ad approfondire contenuti disciplinari curricolari o ad introdurre tematiche caratterizzanti il «mondo universitario» attraverso argomenti d’attualità, impatto scientifico e sociale."
                paragrafo={utente == "Scuola" && "Non trovi l'argomento che cerchi? Puoi suggerire nuove categorie e seminari selezionando la categoria «Altro»!"}
            />

            <BarraRicercaFiltri
                placeholder="Cerca seminari, categorie o dipartimenti..."
                categorie={categorie}
                testoRicerca={testoRicerca}
                onRicercaChange={setTestoRicerca}
                categoriaSelezionata={categoriaSelezionata}
                onCategoriaChange={filtraCategoria}
                dipartimento={dipartimento}
                dipartimentoSelezionato={dipartimentoSelezionato}
                onDipartimentoChange={filtraDipartimento}
                statoSelezionato={statoSelezionato}
                onStatoChange={filtraStato}
                utente={utente}
                mostraAltro={true}
            />

            {categoriaSelezionata === "Altro" ? (
                <TextareaProposta />
            ) : (
                <CardSeminari
                    testoRicerca={testoRicerca}
                    categoriaSelezionata={categoriaSelezionata}
                    dipartimentoSelezionato={dipartimentoSelezionato}
                />
            )}
        </div>
    );
}

export default Home;
