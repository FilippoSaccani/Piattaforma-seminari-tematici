
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip } from "chart.js";
import {
    WordCloudController,
    WordElement
} from "chartjs-chart-wordcloud";

ChartJS.register(
    WordCloudController,
    WordElement,
    Tooltip
);

function GraficoInteressiScuole() {

    const interessi = [
        { parola: "Intelligenza artificiale", frequenza: 30 },
        { parola: "Sostenibilità", frequenza: 25 },
        { parola: "Robotica", frequenza: 22 },
        { parola: "Cybersecurity", frequenza: 19 },
        { parola: "Programmazione", frequenza: 17 },
        { parola: "Ambiente", frequenza: 15 },
        { parola: "Biotecnologie", frequenza: 13 },
        { parola: "Energia", frequenza: 12 },
        { parola: "Innovazione", frequenza: 11 },
        { parola: "Matematica", frequenza: 9 },
        { parola: "Medicina", frequenza: 8 },
        { parola: "Fisica", frequenza: 7 }
    ];

    const colori = ["#93021F", "#D14124", "#63666A"];

    const frequenzaMinima = Math.min(...interessi.map(i => i.frequenza));

    const dati = {
        labels: interessi.map(i => i.parola),
        datasets: [
            {
                label: "Interessi delle scuole",
                data: interessi.map(i => 14 + i.frequenza - frequenzaMinima),
                color: colori,
                padding: 5,
                fit: true,
                rotate: 0,
                minRotation: 0,
                maxRotation: 0,
                rotationSteps: 1
            }
        ]
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
                    label: contesto =>
                        `${contesto.label}: ${interessi[contesto.dataIndex].frequenza} richieste`
                }
            }
        }
    };

    return (
        <div className="background-white border rounded padding-1 shadow flex-column gap-1">
            <div className="flex-column gap-05">
                <h2 className="color-granato">Interessi delle scuole</h2>
                <p className="color-grey">
                    Le parole più cercate dalle scuole attraverso la barra di ricerca dei seminari.
                </p>
            </div>

            <div className="istogramma flex-align-center">
                <Chart
                    type="wordCloud"
                    data={dati}
                    options={opzioni}
                />
            </div>
        </div>
    );
}

export default GraficoInteressiScuole;
