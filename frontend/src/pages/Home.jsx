
import { useState } from "react";

import Titolo from "../components/Titolo";
import BarraRicerca from "../components/BarraRicerca";
import Filtro from "../components/Filtro";
import TextareaProposta from "../components/TextareaProposta";
import GrigliaSeminari from "../components/GrigliaSeminari";

function Home({ utente }) {
    // TODO: recuperare le categorie dal backend tramite fetch
    const [categorie, setCategorie] = useState([
        "Scienze e Ingegneria",
        "Medicina e Vita",
        "Società e Cultura"
    ]);

    // TODO: recuperare i dipartimenti dal backend tramite fetch
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

    return (
        <div className="content width-100 flex-column gap-2 sfondo">
            <Titolo
                titolo="Seminari tematici"
                sottotitolo="I seminari tematici sono volti ad approfondire contenuti disciplinari curricolari o ad introdurre tematiche caratterizzanti il «mondo universitario» attraverso argomenti d’attualità, impatto scientifico e sociale."
                paragrafo={utente === "Scuola" && "Non trovi l'argomento che cerchi? Puoi suggerire nuove categorie e seminari selezionando la categoria «Altro»!"}
            />

            <div className="flex flex-column gap-05 width-100">
                <BarraRicerca
                    placeholder="Cerca seminari, categorie o dipartimenti..."
                    value={testoRicerca}
                    onChange={setTestoRicerca}
                />

                <div className="flex flex-align-center gap-1 width-100">
                    <Filtro
                        categorie={categorie}
                        categoriaSelezionata={categoriaSelezionata}
                        onChange={setCategoriaSelezionata}
                        opzione="Tutte le categorie"
                        mostraAltro={utente === "Scuola"}
                    />

                    <Filtro
                        categorie={dipartimento}
                        categoriaSelezionata={dipartimentoSelezionato}
                        onChange={setDipartimentoSelezionato}
                        opzione="Tutti i dipartimenti"
                    />

                    {utente === "Admin" && (
                        <Filtro
                            categorie={["Disponibili", "Prenotati", "Conclusi"]}
                            categoriaSelezionata={statoSelezionato}
                            onChange={setStatoSelezionato}
                            opzione="Tutti i seminari"
                        />
                    )}
                </div>
            </div>

            {categoriaSelezionata === "Altro" ? (
                <TextareaProposta />
            ) : (
                <GrigliaSeminari
                    testoRicerca={testoRicerca}
                    categoriaSelezionata={categoriaSelezionata}
                    dipartimentoSelezionato={dipartimentoSelezionato}
                />
            )}
        </div>
    );
}

export default Home;
