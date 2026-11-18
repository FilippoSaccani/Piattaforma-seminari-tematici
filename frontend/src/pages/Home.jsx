
import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import seminari_non_disponibili from "../assets/seminari_non_disponibili.png";

import StatoVuoto from "../components/StatoVuoto";
import Titolo from "../components/Titolo";
import BarraRicerca from "../components/BarraRicerca";
import Filtro from "../components/Filtro";
import TextareaProposta from "../components/TextareaProposta";
import GrigliaSeminari from "../components/GrigliaSeminari";

function Home() {
    const { utente } = useOutletContext();

    // TODO: recuperare le categorie dal backend tramite fetch
    const [categorie, setCategorie] = useState([
        "Scienze e Ingegneria",
        "Medicina e Vita",
        "Società e Cultura"
    ]);

    // TODO: recuperare i dipartimenti dal backend tramite fetch
    const [dipartimenti, setDipartimenti] = useState([
        "DIEF",
        "Scienze e Metodi dell'Ingegneria",
        "Scienze fisiche, informatiche e matematiche",
        "Scienze chimiche e geologiche"
    ]);

    // TODO: recuperare i seminari dal backend tramite fetch
    const [seminari, setSeminari] = useState([
        {
            id: 1,
            titolo: "Intelligenza artificiale",
            descrizione: "Introduzione alle nuove tecnologie e alle applicazioni dell'intelligenza artificiale.",
            categoria: "Scienze e Ingegneria",
            dipartimento: "DIEF",
            mediaRecensioni: 4.5,
            numeroRecensioni: 10
        },
        {
            id: 2,
            titolo: "Robotica",
            descrizione: "Alla scoperta dei robot e dei sistemi automatizzati.",
            categoria: "Scienze e Ingegneria",
            dipartimento: "Scienze e Metodi dell'Ingegneria",
            mediaRecensioni: 4.2,
            numeroRecensioni: 8
        },
        {
            id: 3,
            titolo: "Sostenibilità",
            descrizione: "Le sfide ambientali e le possibili soluzioni.",
            categoria: "Società e Cultura",
            dipartimento: "Scienze chimiche e geologiche",
            mediaRecensioni: 0,
            numeroRecensioni: 0
        }
    ]);

    const [testoRicerca, setTestoRicerca] = useState("");
    const [categoriaSelezionata, setCategoriaSelezionata] = useState("");
    const [dipartimentoSelezionato, setDipartimentoSelezionato] = useState("");
    const [statoSelezionato, setStatoSelezionato] = useState("");

    return (
        <div className="page-content flex-column gap-2">
            <Titolo
                titolo="Seminari tematici"
                sottotitolo="I seminari tematici sono volti ad approfondire contenuti disciplinari curricolari o ad introdurre tematiche caratterizzanti il «mondo universitario» attraverso argomenti d’attualità, impatto scientifico e sociale."
                paragrafo={seminari.length > 0 && utente === "Scuola" ? "Non trovi l'argomento che cerchi? Puoi suggerire nuove categorie e seminari selezionando la categoria «Altro»!" : ""}
            />

            {seminari.length === 0 ? (
                <StatoVuoto
                    titolo="Nessun seminario disponibile"
                    descrizione="Al momento non ci sono seminari da consultare. Torna a trovarci!"
                    immagine={seminari_non_disponibili}
                />
            ) : (
                <>
                    <div className="flex-column gap-05">
                        <BarraRicerca
                            placeholder="Cerca seminari, categorie o dipartimenti..."
                            value={testoRicerca}
                            onChange={setTestoRicerca}
                        />

                        <div className="flex-align-center gap-1">
                            <Filtro
                                categorie={categorie}
                                categoriaSelezionata={categoriaSelezionata}
                                onChange={setCategoriaSelezionata}
                                opzione="Tutte le categorie"
                                mostraAltro={utente === "Scuola"}
                            />

                            <Filtro
                                categorie={dipartimenti}
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
                            seminari={seminari}
                            testoRicerca={testoRicerca}
                            categoriaSelezionata={categoriaSelezionata}
                            dipartimentoSelezionato={dipartimentoSelezionato}
                            statoSelezionato={statoSelezionato}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default Home;
