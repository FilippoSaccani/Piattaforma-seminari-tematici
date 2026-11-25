
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
} from "chart.js";

import Filtro from "./Filtro";
import { annoAccademico, annoAccademicoCorrente } from "../utils/date";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
);

function GraficoMediaRecensioniSeminari({ seminari, recensioni, dipartimenti, categorie }) {
    // Di default si vede l'anno accademico in corso
    const [annoCorrente] = useState(annoAccademicoCorrente);
    const [annoSelezionato, setAnnoSelezionato] = useState(annoCorrente);
    const [dipartimentoSelezionato, setDipartimentoSelezionato] = useState("");
    const [categoriaSelezionata, setCategoriaSelezionata] = useState("");

    // Calcolo della media per seminario e anno accademico
    const medie = {};

    recensioni.forEach(recensione => {
        const seminario = seminari.find(s => s.id === recensione.idSeminario);

        if (seminario) {
            const anno = annoAccademico(recensione.data);
            const chiave = `${seminario.id}-${anno}`;

            if (!medie[chiave]) {
                medie[chiave] = {
                    idSeminario: seminario.id,
                    seminario: seminario.titolo,
                    anno,
                    dipartimento: seminario.dipartimento,
                    categoria: seminario.categoria,
                    somma: 0,
                    numero: 0
                };
            }

            medie[chiave].somma += recensione.voto;
            medie[chiave].numero++;
        }
    });

    const dati = Object.values(medie).map(elemento => ({
        ...elemento,
        media: elemento.somma / elemento.numero
    }));

    // Applicazione dei filtri
    // Anni accademici con recensioni, più quello in corso, dal più recente
    const anni = [...new Set([annoCorrente, ...dati.map(r => r.anno)])].sort().reverse();

    const recensioniFiltrate = dati.filter(r =>
        r.anno === annoSelezionato &&
        (dipartimentoSelezionato === "" || r.dipartimento === dipartimentoSelezionato) &&
        (categoriaSelezionata === "" || r.categoria === categoriaSelezionata)
    );

    const datiGrafico = {
        labels: recensioniFiltrate.map(r => r.seminario),
        datasets: [{
            label: "Media recensioni",
            data: recensioniFiltrate.map(r => r.media),
            backgroundColor: "#93021F",
            borderSkipped: false,
            barPercentage: 0.5,
            categoryPercentage: 0.7
        }]
    };

    const opzioni = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: contesto => `Media: ${contesto.raw.toFixed(1)}/5`
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    callback: function(valore) {
                        const etichetta = this.getLabelForValue(valore);
                        return etichetta.length > 16
                            ? etichetta.split(" ")
                            : etichetta;
                    }
                }
            },
            y: {
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <>   
            <div className="flex-align-center gap-1">
                <Filtro
                    opzioni={anni}
                    opzioneSelezionata={annoSelezionato}
                    onChange={setAnnoSelezionato}
                />

                <Filtro
                    opzioni={dipartimenti}
                    opzioneSelezionata={dipartimentoSelezionato}
                    onChange={setDipartimentoSelezionato}
                    testoPredefinito="Tutti i dipartimenti"
                />

                <Filtro
                    opzioni={categorie}
                    opzioneSelezionata={categoriaSelezionata}
                    onChange={setCategoriaSelezionata}
                    testoPredefinito="Tutte le categorie"
                />
            </div>

            {recensioniFiltrate.length > 0 ? (
                <div className="istogramma">
                    <Bar data={datiGrafico} options={opzioni} />
                </div>
            ) : (
                <p className="color-grey">
                    Non sono presenti recensioni per i filtri selezionati.
                </p>
            )}
        </>
    );
}

export default GraficoMediaRecensioniSeminari;
