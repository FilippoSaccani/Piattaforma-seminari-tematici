
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
} from "chart.js";

import Filtro from "./Filtro";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
);

function GraficoRecensioniAnnue() {

    const [recensioni, setRecensioni] = useState([]);
    const [seminari, setSeminari] = useState([]);
    const [dipartimenti, setDipartimenti] = useState([]);
    const [categorie, setCategorie] = useState([]);

    const [dipartimentoSelezionato, setDipartimentoSelezionato] = useState("");
    const [categoriaSelezionata, setCategoriaSelezionata] = useState("");

    useEffect(() => {
        Promise.all([
            fetch("/api/recensioni").then(r => r.json()),
            fetch("/api/miei-seminari").then(r => r.json()),
            fetch("/api/dipartimenti").then(r => r.json()),
            fetch("/api/categorie").then(r => r.json())
        ])
            .then(([recensioni, seminari, dipartimenti, categorie]) => {
                setRecensioni(recensioni);
                setSeminari(seminari);
                setDipartimenti(dipartimenti);
                setCategorie(categorie);
            })
            .catch(errore => {
                console.error("Errore nel recupero delle statistiche:", errore);
            });
    }, []);

    const recensioniFiltrate = recensioni.filter(recensione => {
        const seminario = seminari.find(
            s => s.id === recensione.idSeminario
        );

        if (!seminario) return false;

        return (
            (!dipartimentoSelezionato ||
                seminario.dipartimento === dipartimentoSelezionato) &&
            (!categoriaSelezionata ||
                seminario.categoria === categoriaSelezionata)
        );
    });

    const anni = [...new Set(
        recensioniFiltrate.map(r => r.anno)
    )].sort();

    const medieAnnue = anni.map(anno => {
        const recensioniAnno = recensioniFiltrate.filter(
            r => r.anno === anno
        );

        const media = recensioniAnno.reduce(
            (somma, r) => somma + r.voto,
            0
        ) / recensioniAnno.length;

        return Number(media.toFixed(1));
    });

    const dati = {
        labels: anni,
        datasets: [
            {
                label: "Media recensioni",
                data: medieAnnue,
                backgroundColor: "#93021F",
                borderSkipped: false,
                barPercentage: 0.5,
                categoryPercentage: 0.6
            }
        ]
    };

    const opzioni = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#63666A",
                    font: {
                        family: getComputedStyle(document.body).fontFamily,
                        size: 13
                    }
                }
            },
            y: {
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1,
                    color: "#63666A",
                    font: {
                        family: getComputedStyle(document.body).fontFamily,
                        size: 13
                    }
                },
                grid: {
                    color: "#F4EBE4"
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: contesto =>
                        `Media: ${contesto.raw.toFixed(1)}/5`
                }
            }
        }
    };

    return (
        <div className="background-white border rounded padding-1 shadow flex-column gap-1">
            <h3>Media recensioni annue</h3>

            <div className="flex-align-center gap-1">
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
            
            <div className="istogramma">
                {anni.length > 0 ? (
                    <Bar data={dati} options={opzioni} />
                ) : (
                    <p className="text-center color-grigio">
                        Non sono presenti recensioni per i filtri selezionati.
                    </p>
                )}
            </div>
        </div>
    );
}

export default GraficoRecensioniAnnue;
