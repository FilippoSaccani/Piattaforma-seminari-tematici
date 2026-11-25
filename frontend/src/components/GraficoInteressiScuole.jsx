
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip } from "chart.js";
import { toFont } from "chart.js/helpers";
import {
    WordCloudController,
    WordElement
} from "chartjs-chart-wordcloud";

// Sotto questa dimensione (in pixel) il grafico non ha spazio per disporre le parole
const DIMENSIONE_MINIMA = 50;

// Spazio lasciato tra le parole e il bordo del grafico
const MARGINE = 8;

class NuvolaDiParole extends WordCloudController {
    static id = "nuvolaDiParole";
    static defaults = WordCloudController.defaults;
    static overrides = WordCloudController.overrides;

    updateElements(elementi, inizio, quanti, modalita) {
        if (modalita === "reset") {
            super.updateElements(elementi, inizio, quanti, modalita);
            return;
        }

        const { xScale, yScale } = this._cachedMeta;
        const larghezza = xScale.right - xScale.left;
        const altezza = yScale.bottom - yScale.top;

        if (!(larghezza >= DIMENSIONE_MINIMA && altezza >= DIMENSIONE_MINIMA)) {
            for (let indice = inizio; indice < inizio + quanti; indice++) {
                this.updateElement(elementi[indice], indice, { scale: 0 }, modalita);
            }
            return;
        }

        // Raccoglie le posizioni calcolate dalla libreria per correggerle prima di applicarle
        const aggiornamenti = [];
        const aggiornaElemento = this.updateElement;
        this.updateElement = (...argomenti) => aggiornamenti.push(argomenti);

        try {
            super.updateElements(elementi, inizio, quanti, modalita);
        } finally {
            this.updateElement = aggiornaElemento;
        }

        // Riquadro occupato dalle parole così come vengono disegnate
        const { ctx } = this.chart;
        const riquadro = { sinistra: Infinity, destra: -Infinity, alto: Infinity, basso: -Infinity };
        const parole = aggiornamenti.filter(([, , proprieta]) => proprieta.scale > 0);

        parole.forEach(([, , proprieta]) => {
            ctx.save();
            ctx.font = toFont({ ...proprieta.options, size: proprieta.options.size * proprieta.scale }).string;
            const misura = ctx.measureText(proprieta.text);
            ctx.restore();

            riquadro.sinistra = Math.min(riquadro.sinistra, proprieta.x - misura.width / 2);
            riquadro.destra = Math.max(riquadro.destra, proprieta.x + misura.width / 2);
            riquadro.alto = Math.min(riquadro.alto, proprieta.y - misura.actualBoundingBoxAscent);
            riquadro.basso = Math.max(riquadro.basso, proprieta.y + misura.actualBoundingBoxDescent);
        });

        if (parole.length > 0) {
            // Ingrandisce o rimpicciolisce la nuvola per farla stare nel riquadro, poi la centra
            const fattore = Math.min(
                (larghezza - 2 * MARGINE) / (riquadro.destra - riquadro.sinistra),
                (altezza - 2 * MARGINE) / (riquadro.basso - riquadro.alto)
            );
            const centroX = (riquadro.sinistra + riquadro.destra) / 2;
            const centroY = (riquadro.alto + riquadro.basso) / 2;

            parole.forEach(([, , proprieta]) => {
                proprieta.x = xScale.left + larghezza / 2 + (proprieta.x - centroX) * fattore;
                proprieta.y = yScale.top + altezza / 2 + (proprieta.y - centroY) * fattore;
                proprieta.scale *= fattore;
                proprieta.width *= fattore;
                proprieta.height *= fattore;
            });
        }

        aggiornamenti.forEach(argomenti => this.updateElement(...argomenti));
    }
}

ChartJS.register(
    NuvolaDiParole,
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
        <div className="background-white border rounded padding-1 shadow flex-column gap-1 shadow-hover">
            <div className="flex-column gap-05">
                <h2 className="color-granato">Interessi delle scuole</h2>
                <p className="color-grey">
                    Le parole più cercate dalle scuole attraverso la barra di ricerca dei seminari.
                </p>
            </div>

            <div className="istogramma flex-align-center">
                <Chart
                    type="nuvolaDiParole"
                    data={dati}
                    options={opzioni}
                />
            </div>
        </div>
    );
}

export default GraficoInteressiScuole;
