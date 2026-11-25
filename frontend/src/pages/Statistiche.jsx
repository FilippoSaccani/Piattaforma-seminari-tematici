import { useEffect, useState } from "react";
import axios from "axios";

import Titolo from "../components/Titolo";
import Riepilogo from "../components/Riepilogo";
import GraficoStatoPrenotazioni from "../components/GraficoStatoPrenotazioni";
import GraficoRecensioniAnnue from "../components/GraficoRecensioniAnnue";
import GraficoMediaRecensioniSeminari from "../components/GraficoMediaRecensioniSeminari";
import GraficoInteressiScuole from "../components/GraficoInteressiScuole";

function Statistiche() {
    const [proposte, setProposte] = useState([]);

    useEffect(() => {
        axios.get("/api/proposte")
            .then(response => {
                setProposte(response.data);
            })
            .catch(error => {
                console.error("Errore nel recupero delle proposte:", error);
            });
    }, []);

    const riepiloghi = [
        { numero: 24, testo: "Seminari completati" },
        { numero: 38, testo: "Prenotazioni ricevute" },
        { numero: 720, testo: "Studenti coinvolti" },
        { numero: "4,7/5", testo: "Media recensioni", icona: "fa-solid fa-star" }
    ];

    return (
        <div className="page-content flex-column gap-2">
            <Titolo
                titolo="Statistiche"
                sottotitolo="Monitora l'attività dei tuoi seminari, consulta il gradimento delle scuole e scopri gli argomenti di maggiore interesse."
            />

            <Riepilogo
                riepiloghi={riepiloghi}
                classe="grid-4"
            />

            <div className="background-white border rounded padding-1 shadow flex-column gap-1">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">Attività e gradimento</h2>
                    <p className="color-grey">Consulta le statistiche di attività e il gradimento delle scuole.</p>
                </div>

                <GraficoStatoPrenotazioni
                    completati={26}
                    prenotati={10}
                    disdette={4}
                />

                <GraficoRecensioniAnnue />
                
                <GraficoMediaRecensioniSeminari />
            </div>

            <GraficoInteressiScuole />

            <div className="background-white border rounded padding-1 flex-column gap-1 shadow">
                <div className="flex-column gap-05">
                    <div className="flex-align-center gap-05">
                        <h2 className="color-granato">Proposte ricevute</h2>
                        <span className="info-label">({proposte.length})</span>
                    </div>

                    <p className="color-grey">
                        Consulta gli argomenti e le tematiche che le scuole vorrebbero approfondire attraverso nuovi seminari.
                    </p>
                </div>

                {proposte.length === 0 ? (
                    <p className="color-grey">
                        Non sono ancora presenti proposte da parte delle scuole.
                    </p>
                ) : (
                    <div className="proposte-lista flex-column gap-1">
                        {proposte.map((proposta, index) => (
                            <div
                                key={proposta.id}
                                className={`${index > 0 ? "border-top " : ""}flex-column gap-05`}
                            >
                                <div className="flex-between flex-align-center gap-1">
                                    <p className="info-value">{proposta.scuola}</p>
                                    <span className="info-label">{proposta.data}</span>
                                </div>

                                <p className="color-grey">{proposta.testo}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Statistiche;
