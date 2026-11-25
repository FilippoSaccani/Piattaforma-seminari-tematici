
import { useEffect, useState } from "react";

import api from "../services/api";
import { valoriDistinti } from "../utils/statistiche";

import Titolo from "../components/Titolo";
import Riepilogo from "../components/Riepilogo";
import GraficoStatoPrenotazioni from "../components/GraficoStatoPrenotazioni";
import GraficoMediaRecensioniSeminari from "../components/GraficoMediaRecensioniSeminari";
import GraficoInteressiScuole from "../components/GraficoInteressiScuole";
import ProposteScuole from "../components/ProposteScuole";
import TabellaSeminariPiuRichiesti from "../components/TabellaSeminariPiuRichiesti";

function StatisticheAdmin() {
    const [proposte, setProposte] = useState([]);
    const [statistiche, setStatistiche] = useState(null);
    const [seminari, setSeminari] = useState([]);
    const [recensioni, setRecensioni] = useState([]);

    useEffect(() => {
        api.get("/proposte")
            .then(risposta => setProposte(risposta.data))
            .catch(errore => console.error("Errore nel recupero delle proposte:", errore));

        api.get("/statistiche-admin")
            .then(risposta => setStatistiche(risposta.data))
            .catch(errore => console.error("Errore nel recupero delle statistiche:", errore));

        Promise.all([
            api.get("/seminari"),
            api.get("/recensioni")
        ])
            .then(([rispostaSeminari, rispostaRecensioni]) => {
                setSeminari(rispostaSeminari.data);
                setRecensioni(rispostaRecensioni.data);
            })
            .catch(errore =>
                console.error("Errore nel recupero delle recensioni:", errore)
            );
    }, []);

    if (!statistiche) return null;

    return (
        <div className="page-content flex-column gap-2">
            <Titolo
                titolo="Statistiche"
                sottotitolo="Monitora l'attività della piattaforma, analizza il coinvolgimento delle scuole e consulta i dati relativi ai seminari."
            />

            <Riepilogo
                riepiloghi={[
                    {
                        numero: statistiche.riepilogo.seminariPubblicati,
                        testo: "Seminari pubblicati"
                    },
                    {
                        numero: statistiche.riepilogo.seminariConclusi,
                        testo: "Seminari conclusi"
                    },
                    {
                        numero: statistiche.riepilogo.docentiAttivi,
                        testo: "Docenti attivi"
                    },
                    {
                        numero: statistiche.riepilogo.studentiCoinvolti,
                        testo: "Studenti coinvolti"
                    }
                ]}
                classe="grid-4"
            />

            <div className="background-white border rounded padding-1 shadow flex-column gap-1">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">Stato delle prenotazioni</h2>
                    <p className="color-grey">
                        Distribuzione delle prenotazioni tra completate, prenotate e disdette nell'anno accademico {statistiche.annoCorrente}.
                    </p>
                </div>

                <GraficoStatoPrenotazioni
                    anno={statistiche.annoCorrente}
                    completati={statistiche.prenotazioniAnnoCorrente.completati}
                    prenotati={statistiche.prenotazioniAnnoCorrente.prenotati}
                    disdette={statistiche.prenotazioniAnnoCorrente.disdette}
                />
            </div>

            <div className="background-white border rounded padding-1 shadow flex-column gap-1">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">Gradimento dei seminari</h2>
                    <p className="color-grey">
                        Consulta la media delle recensioni ricevute dai seminari e confronta i risultati tra docenti.
                    </p>
                </div>

                <GraficoMediaRecensioniSeminari
                    seminari={seminari}
                    recensioni={recensioni}
                    dipartimenti={valoriDistinti(seminari, "dipartimento")}
                    categorie={valoriDistinti(seminari, "categoria")}
                />
            </div>

            <div className="background-white border rounded padding-1 shadow flex-column gap-1">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">Seminari più richiesti</h2>
                    <p className="color-grey">
                        I cinque seminari che hanno ricevuto il maggior numero di prenotazioni.
                    </p>
                </div>

                <TabellaSeminariPiuRichiesti
                    seminari={statistiche.seminariPiuRichiesti}
                    dipartimenti={valoriDistinti(seminari, "dipartimento")}
                    categorie={valoriDistinti(seminari, "categoria")}
                />
            </div>

            <GraficoInteressiScuole />

            <ProposteScuole proposte={proposte} />
        </div>
    );
}

export default StatisticheAdmin;
