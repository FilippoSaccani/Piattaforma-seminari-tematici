
import { useEffect, useState } from "react";

import api from "../services/api";

import Titolo from "../components/Titolo";
import Riepilogo from "../components/Riepilogo";
import GraficoStatoPrenotazioni from "../components/GraficoStatoPrenotazioni";
import GraficoMediaRecensioniSeminari from "../components/GraficoMediaRecensioniSeminari";
import GraficoInteressiScuole from "../components/GraficoInteressiScuole";
import ProposteScuole from "../components/ProposteScuole";

function StatisticheAdmin() {
    const [proposte, setProposte] = useState([]);

    useEffect(() => {
        api.get("/proposte")
            .then(risposta => setProposte(risposta.data))
            .catch(errore => console.error("Errore nel recupero delle proposte:", errore));
    }, []);

    return (
        <div className="page-content flex-column gap-2">
            <Titolo
                titolo="Statistiche"
                sottotitolo="Monitora l'attività della piattaforma, analizza il coinvolgimento delle scuole e consulta i dati relativi ai seminari."
            />

            {/* Riepilogo generale */}
            <Riepilogo
                riepiloghi={[]}
                classe="grid-4"
            />

            {/* Stato delle prenotazioni */}
            <div className="background-white border rounded padding-1 shadow flex-column gap-1">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">Stato delle prenotazioni</h2>
                    <p className="color-grey">
                        Distribuzione delle prenotazioni tra completate, prenotate e disdette.
                    </p>
                </div>

                {/* Grafico da collegare */}
            </div>

            {/* Recensioni */}
            <div className="background-white border rounded padding-1 shadow flex-column gap-1">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">Gradimento dei seminari</h2>
                    <p className="color-grey">
                        Consulta la media delle recensioni ricevute dai seminari e confronta i risultati tra docenti.
                    </p>
                </div>

                {/* Grafico da collegare */}
            </div>

            {/* Seminari più richiesti */}
            <div className="background-white border rounded padding-1 shadow flex-column gap-1">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">Seminari più richiesti</h2>
                    <p className="color-grey">
                        I cinque seminari che hanno ricevuto il maggior numero di prenotazioni.
                    </p>
                </div>

                {/* Classifica da realizzare */}
            </div>

            {/* Interessi delle scuole */}
            <GraficoInteressiScuole />

            {/* Proposte delle scuole */}
            <ProposteScuole proposte={proposte} />
        </div>
    );
}

export default StatisticheAdmin;
