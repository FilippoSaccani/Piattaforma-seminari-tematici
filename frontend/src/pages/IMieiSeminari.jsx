
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import seminari_non_disponibili from "../assets/seminari_non_disponibili.png";

import StatoVuoto from "../components/StatoVuoto";
import BarraRicerca from "../components/BarraRicerca";
import Filtro from "../components/Filtro";
import Titolo from "../components/Titolo";
import RiepilogoSeminari from "../components/RiepilogoSeminari";
import CardSeminarioDocente from "../components/CardSeminarioDocente";
import PopupConferma from "../components/PopupConferma";
import ModificaSeminario from "./ModificaSeminario";

function IMieiSeminari() {
    const [searchParams] = useSearchParams();

    const [seminari, setSeminari] = useState([
        {
            id: 1,
            docente: "Marco Rossi",
            email: "marco.rossi@unimore.it",
            dipartimento: "DIEF",
            categoria: "Scienze e Ingegneria",
            titolo: "Intelligenza artificiale",
            descrizione_breve: "Introduzione alle nuove tecnologie e alle applicazioni dell'intelligenza artificiale.",
            descrizione_dettagliata: "Un approfondimento sulle tecnologie di intelligenza artificiale, sui principali algoritmi e sulle loro applicazioni nella vita quotidiana e nel mondo del lavoro.",
            requisiti: "",
            durata: 120,
            modalita: ["In presenza"],
            anni: [3, 4, 5],
            limite_prenotazioni: 10,
            video: null,
            mediaRecensioni: 4.5,
            numeroRecensioni: 10,
            disponibilita: [
                {
                    data: "2026-12-15",
                    fasceOrarie: [
                        {
                            oraInizio: "09:00",
                            prenotazione: {
                                id: 1,
                                scuola: "Liceo Scientifico Aldo Moro",
                                numeroStudenti: 25
                            }
                        },
                        {
                            oraInizio: "14:00",
                            prenotazione: null
                        }
                    ]
                },
                {
                    data: "2026-12-17",
                    fasceOrarie: [
                        {
                            oraInizio: "10:00",
                            prenotazione: {
                                id: 2,
                                scuola: "Istituto Blaise Pascal",
                                numeroStudenti: 20
                            }
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            docente: "Marco Rossi",
            email: "marco.rossi@unimore.it",
            dipartimento: "Scienze e Metodi dell'Ingegneria",
            categoria: "Scienze e Ingegneria",
            titolo: "Robotica",
            descrizione_breve: "Alla scoperta dei robot e dei sistemi automatizzati.",
            descrizione_dettagliata: "Un viaggio nel mondo della robotica, dai componenti fondamentali dei robot ai sistemi automatizzati e alle loro applicazioni industriali.",
            requisiti: "",
            durata: 120,
            modalita: ["In presenza"],
            anni: [3, 4, 5],
            limite_prenotazioni: 10,
            video: null,
            mediaRecensioni: 4.2,
            numeroRecensioni: 8,
            disponibilita: [
                {
                    data: "2026-10-10",
                    fasceOrarie: [
                        {
                            oraInizio: "09:00",
                            prenotazione: {
                                id: 3,
                                scuola: "Istituto Tecnico Fermi",
                                numeroStudenti: 22
                            }
                        }
                    ]
                },
                {
                    data: "2026-12-20",
                    fasceOrarie: [
                        {
                            oraInizio: "14:00",
                            prenotazione: null
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            docente: "Marco Rossi",
            email: "marco.rossi@unimore.it",
            dipartimento: "Scienze chimiche e geologiche",
            categoria: "Società e Cultura",
            titolo: "Sostenibilità",
            descrizione_breve: "Le sfide ambientali e le possibili soluzioni.",
            descrizione_dettagliata: "Un'analisi delle principali sfide ambientali contemporanee e delle soluzioni tecnologiche e sociali per promuovere uno sviluppo sostenibile.",
            requisiti: "",
            durata: 120,
            modalita: ["In presenza"],
            anni: [3, 4, 5],
            limite_prenotazioni: 10,
            video: null,
            mediaRecensioni: 0,
            numeroRecensioni: 0,
            disponibilita: [
                {
                    data: "2026-12-18",
                    fasceOrarie: [
                        {
                            oraInizio: "09:00",
                            prenotazione: null
                        },
                        {
                            oraInizio: "14:00",
                            prenotazione: null
                        }
                    ]
                }
            ]
        },
        {
            id: 4,
            docente: "Marco Rossi",
            email: "marco.rossi@unimore.it",
            dipartimento: "DIEF",
            categoria: "Scienze e Ingegneria",
            titolo: "Sicurezza informatica",
            descrizione_breve: "I principali rischi informatici e le tecniche per proteggere dati e sistemi.",
            descrizione_dettagliata: "Un'introduzione alle minacce informatiche, alle vulnerabilità dei sistemi e alle principali tecniche utilizzate per proteggere informazioni e infrastrutture digitali.",
            requisiti: "",
            durata: 120,
            modalita: ["In presenza"],
            anni: [3, 4, 5],
            limite_prenotazioni: 10,
            video: null,
            mediaRecensioni: 4.8,
            numeroRecensioni: 5,
            disponibilita: [
                {
                    data: "2026-11-10",
                    fasceOrarie: [
                        {
                            oraInizio: "09:00",
                            prenotazione: {
                                id: 4,
                                scuola: "Istituto Tecnico Einaudi",
                                numeroStudenti: 24
                            }
                        },
                        {
                            oraInizio: "14:00",
                            prenotazione: {
                                id: 5,
                                scuola: "Liceo Scientifico Aldo Moro",
                                numeroStudenti: 20
                            }
                        }
                    ]
                }
            ]
        }
    ]);

    const [testoRicerca, setTestoRicerca] = useState("");

    const [statoSelezionato, setStatoSelezionato] = useState(
        searchParams.get("stato") || ""
    );

    const [seminarioDaModificare, setSeminarioDaModificare] = useState(null);
    const [seminarioDaEliminare, setSeminarioDaEliminare] = useState(null);

    function convertiDataOra(data, oraInizio, durata) {
        const [anno, mese, giorno] = data.split("-").map(Number);
        const [ore, minuti] = oraInizio.split(":").map(Number);

        return new Date(
            anno,
            mese - 1,
            giorno,
            ore,
            minuti + Number(durata)
        );
    }

    function calcolaStatoSeminario(seminario) {
        const oggi = new Date();

        const fasce = seminario.disponibilita.flatMap(disponibilita =>
            disponibilita.fasceOrarie.map(fascia => {
                const fine = convertiDataOra(
                    disponibilita.data,
                    fascia.oraInizio,
                    seminario.durata
                );

                return {
                    prenotata: fascia.prenotazione !== null,
                    futura: fine > oggi
                };
            })
        );

        const haPrenotazioniFuture = fasce.some(
            fascia => fascia.prenotata && fascia.futura
        );

        const haDisponibilitaFuture = fasce.some(
            fascia => !fascia.prenotata && fascia.futura
        );

        if (haPrenotazioniFuture) return "Prenotato";
        if (haDisponibilitaFuture) return "Pubblicato";

        return "Concluso";
    }

    const numeroPrenotazioni = seminari.reduce(
        (totale, seminario) =>
            totale + seminario.disponibilita.reduce(
                (totaleDate, disponibilita) =>
                    totaleDate + disponibilita.fasceOrarie.filter(
                        fascia => fascia.prenotazione !== null
                    ).length,
                0
            ),
        0
    );

    const numeroConclusi = seminari.filter(
        seminario => calcolaStatoSeminario(seminario) === "Concluso"
    ).length;

    const seminariFiltrati = seminari.filter(seminario => {
        const stato = calcolaStatoSeminario(seminario);

        const corrispondeStato =
            statoSelezionato === "" ||
            (statoSelezionato === "Pubblicati" && stato === "Pubblicato") ||
            (statoSelezionato === "Prenotati" && stato === "Prenotato") ||
            (statoSelezionato === "Conclusi" && stato === "Concluso");

        const corrispondeRicerca =
            seminario.titolo.toLowerCase().includes(testoRicerca.toLowerCase());

        return corrispondeStato && corrispondeRicerca;
    });

    function modificaSeminario(seminario) {
        setSeminarioDaModificare(seminario);
    }

    function salvaModifiche(seminarioModificato) {
        setSeminari(precedenti =>
            precedenti.map(seminario =>
                seminario.id === seminarioModificato.id
                    ? seminarioModificato
                    : seminario
            )
        );

        setSeminarioDaModificare(null);

        // TODO: fetch PUT per aggiornare il seminario
    }

    function eliminaSeminario(seminario) {
        setSeminarioDaEliminare(seminario);
    }

    function confermaEliminazione() {
        setSeminari(precedenti =>
            precedenti.filter(seminario =>
                seminario.id !== seminarioDaEliminare.id
            )
        );

        setSeminarioDaEliminare(null);

        // TODO: fetch DELETE per eliminare il seminario
    }

    return (
        <>
            {seminarioDaModificare ? (
                <ModificaSeminario
                    seminario={seminarioDaModificare}
                    onSalva={salvaModifiche}
                    onAnnulla={() => setSeminarioDaModificare(null)}
                />
            ) : (
                <div className="page-content flex-column gap-2">
                    <Titolo
                        titolo="I miei seminari"
                        sottotitolo="Gestisci i tuoi seminari, consulta le prenotazioni ricevute e tieni traccia delle attività svolte."
                    />

                    {seminari.length === 0 ? (
                        <StatoVuoto
                            titolo="Nessun seminario disponibile"
                            descrizione="Non hai ancora caricato nessun seminario. Quando ne aggiungerai uno, potrai gestirlo da questa sezione."
                            immagine={seminari_non_disponibili}
                        />
                    ) : (
                        <>
                            <button
                                type="button"
                                className="background-red color-cream padding-05-1 rounded pointer shadow hover flex-center gap-05"
                                onClick={() => window.location.href = "/aggiungi-seminario"}
                            >
                                <i className="fa-solid fa-plus"></i>
                                Aggiungi seminario
                            </button>

                            <RiepilogoSeminari
                                numeroSeminari={seminari.length}
                                numeroPrenotazioni={numeroPrenotazioni}
                                numeroConclusi={numeroConclusi}
                            />

                            <div className="flex gap-1 width-100">
                                <BarraRicerca
                                    placeholder="Cerca i tuoi seminari..."
                                    value={testoRicerca}
                                    onChange={setTestoRicerca}
                                />

                                <Filtro
                                    categorie={["Pubblicati", "Prenotati", "Conclusi"]}
                                    categoriaSelezionata={statoSelezionato}
                                    onChange={setStatoSelezionato}
                                    opzione="Tutti i seminari"
                                />
                            </div>

                            {seminariFiltrati.length > 0 ? (
                                seminariFiltrati.map(seminario => {
                                    const stato = calcolaStatoSeminario(seminario);

                                    return (
                                        <CardSeminarioDocente
                                            key={seminario.id}
                                            seminario={{ ...seminario, stato }}
                                            onModifica={modificaSeminario}
                                            onElimina={eliminaSeminario}
                                        />
                                    );
                                })
                            ) : (
                                <p className="color-grey">
                                    Nessun seminario trovato.
                                </p>
                            )}
                        </>
                    )}

                    {seminarioDaEliminare && (
                        <PopupConferma
                            titolo="Conferma eliminazione"
                            messaggio={`Vuoi davvero eliminare il seminario "${seminarioDaEliminare.titolo}"?`}
                            testoConferma="Elimina"
                            onConferma={confermaEliminazione}
                            onAnnulla={() => setSeminarioDaEliminare(null)}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default IMieiSeminari;
