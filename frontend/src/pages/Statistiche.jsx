import { useEffect, useState } from "react";

import api from "../services/api";
import { annoAccademicoCorrente, formattaData } from "../utils/date";
import { calcolaMediaRecensioni, contaPrenotazioni, valoriDistinti } from "../utils/statistiche";

import Titolo from "../components/Titolo";
import Riepilogo from "../components/Riepilogo";
import GraficoStatoPrenotazioni from "../components/GraficoStatoPrenotazioni";
import GraficoRecensioniAnnue from "../components/GraficoRecensioniAnnue";
import GraficoMediaRecensioniSeminari from "../components/GraficoMediaRecensioniSeminari";
import GraficoInteressiScuole from "../components/GraficoInteressiScuole";

function Statistiche() {
    const [proposte, setProposte] = useState([]);
    const [seminari, setSeminari] = useState([]);
    const [recensioni, setRecensioni] = useState([]);
    const [statistiche, setStatistiche] = useState(null);

    useEffect(() => {
        api.get("/proposte")
            .then(risposta => setProposte(risposta.data))
            .catch(errore => console.error("Errore nel recupero delle proposte:", errore));

        // Le statistiche riguardano solo i seminari del docente collegato
        Promise.all([api.get("/miei-seminari"), api.get("/recensioni")])
            .then(([rispostaSeminari, rispostaRecensioni]) => {
                const mieiSeminari = rispostaSeminari.data;
                const recensioniMieiSeminari = rispostaRecensioni.data.filter(recensione =>
                    mieiSeminari.some(seminario => seminario.id === recensione.idSeminario)
                );

                setSeminari(mieiSeminari);
                setRecensioni(recensioniMieiSeminari);
                const adesso = new Date();
                const annoCorrente = annoAccademicoCorrente();

                setStatistiche({
                    totali: contaPrenotazioni(mieiSeminari, adesso),
                    annoCorrente,
                    prenotazioniAnnoCorrente: contaPrenotazioni(mieiSeminari, adesso, annoCorrente),
                    mediaRecensioni: calcolaMediaRecensioni(recensioniMieiSeminari)
                });
            })
            .catch(errore => console.error("Errore nel recupero delle statistiche:", errore));
    }, []);

    if (!statistiche) {
        return null;
    }

    const { totali, prenotazioniAnnoCorrente } = statistiche;

    const riepiloghi = [
        { numero: totali.completati, testo: "Seminari completati" },
        {
            numero: totali.completati + totali.prenotati + totali.disdette,
            testo: "Prenotazioni ricevute"
        },
        { numero: totali.studentiCoinvolti, testo: "Studenti coinvolti" },
        {
            numero: statistiche.mediaRecensioni === null
                ? "-"
                : `${statistiche.mediaRecensioni.toFixed(1).replace(".", ",")}/5`,
            testo: "Media recensioni",
            icona: "fa-solid fa-star"
        }
    ];

    // Le opzioni dei filtri sono solo quelle presenti nei seminari del docente
    const dipartimenti = valoriDistinti(seminari, "dipartimento");
    const categorie = valoriDistinti(seminari, "categoria");

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
                    anno={statistiche.annoCorrente}
                    completati={prenotazioniAnnoCorrente.completati}
                    prenotati={prenotazioniAnnoCorrente.prenotati}
                    disdette={prenotazioniAnnoCorrente.disdette}
                />

                <GraficoRecensioniAnnue
                    seminari={seminari}
                    recensioni={recensioni}
                    dipartimenti={dipartimenti}
                    categorie={categorie}
                />

                <GraficoMediaRecensioniSeminari
                    seminari={seminari}
                    recensioni={recensioni}
                    dipartimenti={dipartimenti}
                    categorie={categorie}
                />
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
                                    <span className="info-label">{formattaData(proposta.data)}</span>
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
