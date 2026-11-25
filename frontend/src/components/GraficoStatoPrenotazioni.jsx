
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
);

function GraficoStatoPrenotazioni({ anno, completati, prenotati, disdette }) {

    const totale = completati + prenotati + disdette;

    const percentuali = totale > 0 ? [
        completati / totale * 100,
        prenotati / totale * 100,
        disdette / totale * 100
    ] : [0, 0, 0];

    const dati = {
        labels: ["Prenotazioni"],
        datasets: [
            {
                label: "Completati",
                data: [percentuali[0]],
                backgroundColor: "#93021F",
                borderSkipped: false
            },
            {
                label: "Prenotati",
                data: [percentuali[1]],
                backgroundColor: "#D14124",
                borderSkipped: false
            },
            {
                label: "Disdette",
                data: [percentuali[2]],
                backgroundColor: "#63666A",
                borderSkipped: false
            }
        ]
    };

    const opzioni = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
                display: false,
                min: 0,
                max: 100
            },
            y: {
                stacked: true,
                display: false
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: contesto =>
                        `${contesto.dataset.label}: ${contesto.raw.toFixed(1)}%`
                }
            }
        }
    };

    return (
        <div className="background-white border rounded padding-1 shadow flex-column gap-1">
            <div className="flex-column gap-05">
                <h3>Stato delle prenotazioni</h3>
                <p className="info-label">Anno accademico {anno}</p>
            </div>

            <div className="grafico-stato-prenotazioni">
                <Bar data={dati} options={opzioni} />
            </div>

            <div className="grid-3">
                <div className="flex-column flex-align-center gap-05">
                    <h2 className="color-granato">
                        {percentuali[0].toFixed(1)}%
                    </h2>
                    <p className="info-label">Completati</p>
                </div>

                <div className="flex-column flex-align-center gap-05">
                    <h2 className="color-red">
                        {percentuali[1].toFixed(1)}%
                    </h2>
                    <p className="info-label">Prenotati</p>
                </div>

                <div className="flex-column flex-align-center gap-05">
                    <h2 className="color-grey">
                        {percentuali[2].toFixed(1)}%
                    </h2>
                    <p className="info-label">Disdette</p>
                </div>
            </div>
        </div>
    );
}

export default GraficoStatoPrenotazioni;
