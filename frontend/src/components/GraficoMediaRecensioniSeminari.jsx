
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

function GraficoMediaRecensioniSeminari() {
    const [recensioni, setRecensioni] = useState([]);
    const [seminari, setSeminari] = useState([]);
    const [dipartimenti, setDipartimenti] = useState([]);
    const [categorie, setCategorie] = useState([]);

    const [annoSelezionato, setAnnoSelezionato] = useState("");
    const [dipartimentoSelezionato, setDipartimentoSelezionato] = useState("");
    const [categoriaSelezionata, setCategoriaSelezionata] = useState("");

    const [caricamento, setCaricamento] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/recensioni"),
            fetch("/api/miei-seminari"),
            fetch("/api/dipartimenti"),
            fetch("/api/categorie")
        ])
            .then(risposte => {
                if (risposte.some(r => !r.ok)) {
                    throw new Error("Errore nel recupero dei dati");
                }

                return Promise.all(risposte.map(r => r.json()));
            })
            .then(([recensioniApi, seminariApi, dipartimentiApi, categorieApi]) => {
                setRecensioni(recensioniApi);
                setSeminari(seminariApi);
                setDipartimenti(dipartimentiApi);
                setCategorie(categorieApi);
            })
            .catch(errore => console.error(errore))
            .finally(() => setCaricamento(false));
    }, []);

    // Calcolo della media per seminario e anno
    const medie = {};

    recensioni.forEach(recensione => {
        const seminario = seminari.find(
            s => Number(s.id) === Number(recensione.idSeminario)
        );

        if (seminario) {
            const chiave = `${seminario.id}-${recensione.anno}`;

            if (!medie[chiave]) {
                medie[chiave] = {
                    idSeminario: seminario.id,
                    seminario: seminario.titolo,
                    anno: recensione.anno,
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
    const anni = [...new Set(dati.map(r => r.anno))];

    const recensioniFiltrate = dati.filter(r =>
        (annoSelezionato === "" || r.anno === annoSelezionato) &&
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

    if (caricamento) {
        return <p>Caricamento delle statistiche...</p>;
    }

    return (
        <div className="background-white border rounded padding-1 shadow flex-column gap-1">
            <h3>Media recensioni per seminario</h3>
                
            <div className="flex-align-center gap-1">
                <Filtro
                    opzioni={anni}
                    opzioneSelezionata={annoSelezionato}
                    onChange={setAnnoSelezionato}
                    testoPredefinito="Tutti gli anni"
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
                <p className="color-grigio text-center">
                    Non sono presenti recensioni per i filtri selezionati.
                </p>
            )}
        </div>
    );
}

export default GraficoMediaRecensioniSeminari;
