
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import api from "../services/api";

import seminari_non_disponibili from "../assets/seminari_non_disponibili.png";

import StatoVuoto from "../components/StatoVuoto";
import Titolo from "../components/Titolo";
import BarraRicerca from "../components/BarraRicerca";
import Filtro from "../components/Filtro";
import TextareaProposta from "../components/TextareaProposta";
import GrigliaSeminari from "../components/GrigliaSeminari";

function Home() {
    const { utente } = useOutletContext();

    const [categorie, setCategorie] = useState([]);
    const [dipartimenti, setDipartimenti] = useState([]);
    const [seminari, setSeminari] = useState([]);

    useEffect(() => {
        api.get("/categorie").then(risposta => setCategorie(risposta.data));
        api.get("/dipartimenti").then(risposta => setDipartimenti(risposta.data));
        api.get("/seminari").then(risposta => setSeminari(risposta.data));
    }, []);

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
                                opzioni={categorie}
                                opzioneSelezionata={categoriaSelezionata}
                                onChange={setCategoriaSelezionata}
                                testoPredefinito="Tutte le categorie"
                                mostraAltro={utente === "Scuola"}
                            />

                            <Filtro
                                opzioni={dipartimenti}
                                opzioneSelezionata={dipartimentoSelezionato}
                                onChange={setDipartimentoSelezionato}
                                testoPredefinito="Tutti i dipartimenti"
                            />

                            {utente === "Admin" && (
                                <Filtro
                                    opzioni={["Disponibili", "Prenotati", "Conclusi"]}
                                    opzioneSelezionata={statoSelezionato}
                                    onChange={setStatoSelezionato}
                                    testoPredefinito="Tutti i seminari"
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
