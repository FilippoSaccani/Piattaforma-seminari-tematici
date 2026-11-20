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
            stato: "Prenotato",
            disponibilita: [
                {
                    data: "15/12/2026",
                    fasceOrarie: [
                        {
                            orario: "09:00 - 11:00",
                            prenotazione: {
                                id: 1,
                                scuola: "Liceo Scientifico Aldo Moro",
                                numeroStudenti: 25,
                                stato: "Da svolgere"
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
                                numeroStudenti: 20,
                                stato: "Da svolgere"
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
            stato: "Concluso",
            disponibilita: [
                {
                    data: "10/10/2026",
                    fasceOrarie: [
                        {
                            orario: "09:00 - 11:00",
                            prenotazione: {
                                id: 3,
                                scuola: "Istituto Tecnico Fermi",
                                numeroStudenti: 22,
                                stato: "Concluso"
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
            stato: "Pubblicato",
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
        }
    ]);

    const [testoRicerca, setTestoRicerca] = useState("");
    const [statoSelezionato, setStatoSelezionato] = useState(
        searchParams.get("stato") || ""
    );
    const [seminarioDaEliminare, setSeminarioDaEliminare] = useState(null);

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

    const numeroConclusi = seminari.filter(seminario => {
        const prenotazioni = seminario.disponibilita.flatMap(
            disponibilita => disponibilita.fasceOrarie
                .filter(fascia => fascia.prenotazione !== null)
                .map(fascia => fascia.prenotazione)
        );

        return prenotazioni.length > 0 &&
            prenotazioni.every(prenotazione => prenotazione.stato === "Concluso");
    }).length;

    const seminariFiltrati = seminari.filter(seminario => {
        const corrispondeStato =
            statoSelezionato === "" ||
            (statoSelezionato === "Pubblicati" && seminario.stato === "Pubblicato") ||
            (statoSelezionato === "Prenotati" && seminario.stato === "Prenotato") ||
            (statoSelezionato === "Conclusi" && seminario.stato === "Concluso");

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
                seminariFiltrati.map(seminario => (
                    <CardSeminarioDocente
                        key={seminario.id}
                        seminario={seminario}
                        onModifica={modificaSeminario}
                        onElimina={eliminaSeminario}
                    />
                ))
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
