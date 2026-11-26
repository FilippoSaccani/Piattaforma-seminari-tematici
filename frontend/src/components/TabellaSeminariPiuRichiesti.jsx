
import { useState } from "react";

import Filtro from "./Filtro";
import Pulsante from "./Pulsante";

function TabellaSeminariPiuRichiesti({ seminari, dipartimenti, categorie }) {
    const [mostraTutte, setMostraTutte] = useState(false);
    const [ordinamento, setOrdinamento] = useState("Dal più richiesto");
    const [dipartimentoSelezionato, setDipartimentoSelezionato] = useState("");
    const [categoriaSelezionata, setCategoriaSelezionata] = useState("");

    // Applica i filtri e ordina i seminari
    const seminariFiltrati = seminari
        .filter(seminario =>
            (!dipartimentoSelezionato ||
                seminario.dipartimento === dipartimentoSelezionato) &&
            (!categoriaSelezionata ||
                seminario.categoria === categoriaSelezionata)
        )
        .sort((a, b) =>
            ordinamento === "Dal più richiesto"
                ? b.prenotazioni - a.prenotazioni
                : a.prenotazioni - b.prenotazioni
        );

    const seminariVisibili = mostraTutte
        ? seminariFiltrati
        : seminariFiltrati.slice(0, 5);

    return (
        <div className="flex-column gap-1">
            <div className="flex-align-center gap-1 column">
                <div className="flex-align-center gap-1 column-phone">
                    <Filtro
                        opzioni={["Dal più richiesto", "Dal meno richiesto"]}
                        opzioneSelezionata={ordinamento}
                        onChange={setOrdinamento}
                    />

                    <Filtro
                        opzioni={dipartimenti}
                        opzioneSelezionata={dipartimentoSelezionato}
                        onChange={setDipartimentoSelezionato}
                        testoPredefinito="Tutti i dipartimenti"
                    />
                </div>

                <Filtro
                    opzioni={categorie}
                    opzioneSelezionata={categoriaSelezionata}
                    onChange={setCategoriaSelezionata}
                    testoPredefinito="Tutte le categorie"
                />
            </div> 

            <div className="flex-column gap-1">
                {seminariFiltrati.length === 0 ? (
                    <p className="color-grey">
                        Nessun seminario trovato con i filtri selezionati.
                    </p>
                ) : (
                    <>
                        <div className="grid-3 flex-align-center">
                            <p className="info-value">Seminario</p>
                            <p className="info-value flex-center">Prenotazioni</p>
                            <p className="info-value flex-end">Media stelle</p>
                        </div>

                        <div className="flex-column gap-1">
                            {seminariVisibili.map(seminario => (
                                <div
                                    key={seminario.id}
                                    className="grid-3 border-top flex-align-center"
                                >
                                    <span className="info-label">{seminario.titolo}</span>

                                    <span className="info-label flex-center">
                                        {seminario.prenotazioni}
                                    </span>

                                    <span className="info-label flex-end">
                                        {seminario.mediaRecensioni !== null ? (
                                            <>
                                                <i className="fa-solid fa-star stella"></i>
                                                {" "}{seminario.mediaRecensioni.toFixed(1)} / 5
                                            </>
                                        ) : (
                                            "Nessuna recensione"
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {seminariFiltrati.length > 5 && (
                <Pulsante
                    testo={mostraTutte ? "Mostra meno" : "Mostra tutti"}
                    onClick={() => setMostraTutte(!mostraTutte)}
                />
            )}
        </div>
    );
}

export default TabellaSeminariPiuRichiesti;
