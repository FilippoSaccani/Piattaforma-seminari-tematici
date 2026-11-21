
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import BarraRicerca from "../components/BarraRicerca";
import Filtro from "../components/Filtro";
import Titolo from "../components/Titolo";
import RiepilogoSeminari from "../components/RiepilogoSeminari";
import CardSeminarioDocente from "../components/CardSeminarioDocente";
import PopupConferma from "../components/PopupConferma";

function IMieiSeminari() {
    const [searchParams] = useSearchParams();

    const [seminari, setSeminari] = useState([
        {
            id: 1,
            titolo: "Intelligenza artificiale",
            descrizione: "Introduzione alle nuove tecnologie e alle applicazioni dell'intelligenza artificiale.",
            categoria: "Scienze e Ingegneria",
            dipartimento: "DIEF",
            mediaRecensioni: 4.5,
            numeroRecensioni: 10,
            disponibilita: [
                {
                    data: "15/12/2026",
                    fasceOrarie: [
                        {
                            orario: "09:00 - 11:00",
                            prenotazione: {
                                id: 1,
                                scuola: "Liceo Scientifico Aldo Moro",
                                numeroStudenti: 25
                            }
                        },
                        {
                            orario: "14:00 - 16:00",
                            prenotazione: null
                        }
                    ]
                },
                {
                    data: "17/12/2026",
                    fasceOrarie: [
                        {
                            orario: "10:00 - 12:00",
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
            titolo: "Robotica",
            descrizione: "Alla scoperta dei robot e dei sistemi automatizzati.",
            categoria: "Scienze e Ingegneria",
            dipartimento: "Scienze e Metodi dell'Ingegneria",
            mediaRecensioni: 4.2,
            numeroRecensioni: 8,
            disponibilita: [
                {
                    data: "10/10/2026",
                    fasceOrarie: [
                        {
                            orario: "09:00 - 11:00",
                            prenotazione: {
                                id: 3,
                                scuola: "Istituto Tecnico Fermi",
                                numeroStudenti: 22
                            }
                        }
                    ]
                },
                {
                    data: "20/12/2026",
                    fasceOrarie: [
                        {
                            orario: "14:00 - 16:00",
                            prenotazione: null
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            titolo: "Sostenibilità",
            descrizione: "Le sfide ambientali e le possibili soluzioni.",
            categoria: "Società e Cultura",
            dipartimento: "Scienze chimiche e geologiche",
            mediaRecensioni: 0,
            numeroRecensioni: 0,
            disponibilita: [
                {
                    data: "18/12/2026",
                    fasceOrarie: [
                        {
                            orario: "09:00 - 11:00",
                            prenotazione: null
                        },
                        {
                            orario: "14:00 - 16:00",
                            prenotazione: null
                        }
                    ]
                }
            ]
        },
        {
            id: 4,
            titolo: "Sicurezza informatica",
            descrizione: "I principali rischi informatici e le tecniche per proteggere dati e sistemi.",
            categoria: "Scienze e Ingegneria",
            dipartimento: "DIEF",
            mediaRecensioni: 4.8,
            numeroRecensioni: 5,
            disponibilita: [
                {
                    data: "10/11/2026",
                    fasceOrarie: [
                        {
                            orario: "09:00 - 11:00",
                            prenotazione: {
                                id: 4,
                                scuola: "Istituto Tecnico Einaudi",
                                numeroStudenti: 24
                            }
                        },
                        {
                            orario: "14:00 - 16:00",
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

    const [seminarioDaEliminare, setSeminarioDaEliminare] = useState(null);

    function convertiDataOra(data, orario) {
        const [giorno, mese, anno] = data.split("/").map(Number);
        const [ora, minuti] = orario.split(":").map(Number);

        return new Date(anno, mese - 1, giorno, ora, minuti);
    }

    function calcolaStatoSeminario(seminario) {
        const oggi = new Date();

        const fasce = seminario.disponibilita.flatMap(disponibilita =>
            disponibilita.fasceOrarie.map(fascia => {
                const fine = convertiDataOra(
                    disponibilita.data,
                    fascia.orario.split(" - ")[1]
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

    function modificaSeminario(modificato) {
        setSeminari(precedenti =>
            precedenti.map(seminario =>
                seminario.id === modificato.id
                    ? modificato
                    : seminario
            )
        );

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
        <div className="page-content flex-column gap-2">
            <Titolo
                titolo="I miei seminari"
                sottotitolo="Gestisci i tuoi seminari, consulta le prenotazioni ricevute e tieni traccia delle attività svolte."
            />

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
    );
}

export default IMieiSeminari;
