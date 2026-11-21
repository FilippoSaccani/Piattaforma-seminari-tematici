import { useState } from "react";
import carrello_vuoto from "../assets/carrello_vuoto.png";

import BarraRicerca from "../components/BarraRicerca";
import Filtro from "../components/Filtro";
import Titolo from "../components/Titolo";
import CardPrenotazioneScuola from "../components/CardPrenotazioneScuola";
import CardPrenotazioneCarrello from "../components/CardPrenotazioneCarrello";
import StatoVuoto from "../components/StatoVuoto";
import PopupConferma from "../components/PopupConferma";

function Prenotazioni() {
    const [prenotazioni, setPrenotazioni] = useState([
        {
            id: 1,
            titolo: "Intelligenza artificiale e robotica",
            dipartimento: "Dipartimento di Ingegneria Enzo Ferrari",
            data: "2026-11-20",
            oraInizio: "10:00",
            durata: 120,
            numeroStudenti: 25,
            modalita: "In presenza",
            modalitaDisponibili: ["In presenza", "A distanza"],
            disponibilita: [
                {
                    data: "2026-12-15",
                    fasceOrarie: [
                        { oraInizio: "09:00", prenotazione: null },
                        { oraInizio: "14:00", prenotazione: null }
                    ]
                },
                {
                    data: "2026-12-17",
                    fasceOrarie: [
                        { oraInizio: "10:00", prenotazione: null }
                    ]
                },
                {
                    data: "2026-12-18",
                    fasceOrarie: [
                        { oraInizio: "09:00", prenotazione: null }
                    ]
                }
            ],
            stato: "Da confermare",
            recensione: null
        },
        {
            id: 2,
            titolo: "Cybersecurity e protezione dei dati",
            dipartimento: "Dipartimento di Scienze e Metodi dell'Ingegneria",
            data: "2026-11-25",
            oraInizio: "14:00",
            durata: 120,
            numeroStudenti: 20,
            modalita: "In presenza",
            modalitaDisponibili: ["In presenza", "A distanza"],
            disponibilita: [
                {
                    data: "2026-12-20",
                    fasceOrarie: [
                        { oraInizio: "09:00", prenotazione: null },
                        { oraInizio: "14:00", prenotazione: null }
                    ]
                },
                {
                    data: "2026-12-17",
                    fasceOrarie: [
                        { oraInizio: "10:00", prenotazione: null }
                    ]
                },
                {
                    data: "2026-12-18",
                    fasceOrarie: [
                        { oraInizio: "09:00", prenotazione: null }
                    ]
                }
            ],
            stato: "Da confermare",
            recensione: null
        },
        {
            id: 3,
            titolo: "Sviluppo di applicazioni web",
            dipartimento: "Dipartimento di Ingegneria Enzo Ferrari",
            data: "2026-11-28",
            oraInizio: "09:00",
            durata: 120,
            numeroStudenti: 30,
            modalita: "A distanza",
            modalitaDisponibili: ["A distanza"],
            disponibilita: [
                {
                    data: "2026-12-15",
                    fasceOrarie: [
                        { oraInizio: "09:00", prenotazione: null },
                        { oraInizio: "14:00", prenotazione: null }
                    ]
                },
                {
                    data: "2026-12-17",
                    fasceOrarie: [
                        { oraInizio: "10:00", prenotazione: null }
                    ]
                },
                {
                    data: "2026-12-18",
                    fasceOrarie: [
                        { oraInizio: "09:00", prenotazione: null }
                    ]
                }
            ],
            stato: "Da confermare",
            recensione: null
        },
        {
            id: 4,
            titolo: "La transizione energetica",
            dipartimento: "Dipartimento di Scienze Fisiche, Informatiche e Matematiche",
            data: "2026-11-10",
            oraInizio: "09:00",
            durata: 120,
            numeroStudenti: 22,
            modalita: "In presenza",
            stato: "Da svolgere",
            recensione: null
        },
        {
            id: 5,
            titolo: "Comunicazione e social media",
            dipartimento: "Dipartimento di Comunicazione ed Economia",
            data: "2026-11-05",
            oraInizio: "14:00",
            durata: 120,
            numeroStudenti: 18,
            modalita: "A distanza",
            stato: "Da svolgere",
            recensione: null
        },
        {
            id: 6,
            titolo: "Seminario di sostenibilità",
            dipartimento: "Dipartimento di Scienze e Metodi dell'Ingegneria",
            data: "2026-10-05",
            oraInizio: "10:00",
            durata: 120,
            numeroStudenti: 20,
            modalita: "In presenza",
            stato: "Concluso",
            recensione: null
        }
    ]);


    const [testoRicerca, setTestoRicerca] = useState("");
    const [statoSelezionato, setStatoSelezionato] = useState("");
    const [seminariSelezionati, setSeminariSelezionati] = useState([]);
    const [prenotazioneDaDisdire, setPrenotazioneDaDisdire] = useState(null);

    const nessunaPrenotazione = prenotazioni.length === 0;

    const seminariDaConfermare = prenotazioni.filter(
        prenotazione => prenotazione.stato === "Da confermare"
    );

    const tuttiSelezionati =
        seminariDaConfermare.length > 0 &&
        seminariSelezionati.length === seminariDaConfermare.length;

    const prenotazioniFiltrate = prenotazioni.filter(prenotazione => {
        const corrispondeStato =
            statoSelezionato === "" ||
            (statoSelezionato === "Conclusi" && prenotazione.stato === "Concluso") ||
            prenotazione.stato === statoSelezionato;

        const corrispondeRicerca =
            prenotazione.titolo.toLowerCase().includes(testoRicerca.toLowerCase());

        return corrispondeStato && corrispondeRicerca;
    });

    function selezionaTutti() {
        setSeminariSelezionati(
            tuttiSelezionati
                ? []
                : seminariDaConfermare.map(seminario => seminario.id)
        );
    }

    function selezionaSeminario(id) {
        setSeminariSelezionati(precedenti =>
            precedenti.includes(id)
                ? precedenti.filter(selezionato => selezionato !== id)
                : [...precedenti, id]
        );
    }

    function rimuoviSeminario(id) {
        setPrenotazioni(precedenti =>
            precedenti.filter(prenotazione => prenotazione.id !== id)
        );

        setSeminariSelezionati(precedenti =>
            precedenti.filter(selezionato => selezionato !== id)
        );

        // TODO: fetch DELETE per rimuovere il seminario
    }

    function modificaSeminario(modificato) {
        setPrenotazioni(precedenti =>
            precedenti.map(prenotazione =>
                prenotazione.id === modificato.id
                    ? modificato
                    : prenotazione
            )
        );

        // TODO: fetch PUT per aggiornare la prenotazione
    }

    function confermaPrenotazioni() {
        if (seminariSelezionati.length === 0) return;

        setPrenotazioni(precedenti =>
            precedenti.map(prenotazione =>
                seminariSelezionati.includes(prenotazione.id)
                    ? { ...prenotazione, stato: "Da svolgere" }
                    : prenotazione
            )
        );

        setSeminariSelezionati([]);
        setStatoSelezionato("Da svolgere");

        // TODO: fetch POST per confermare le prenotazioni
    }

    function disdiciPrenotazione(prenotazione) {
        setPrenotazioneDaDisdire(prenotazione);
    }

    function confermaDisdetta() {
        setPrenotazioni(precedenti =>
            precedenti.filter(p => p.id !== prenotazioneDaDisdire.id)
        );

        setPrenotazioneDaDisdire(null);
    }

    function salvaRecensione(prenotazione, recensione) {
        setPrenotazioni(precedenti =>
            precedenti.map(p =>
                p.id === prenotazione.id
                    ? { ...p, recensione: recensione }
                    : p
            )
        );

        // TODO: fetch PUT per salvare la recensione
    }

    return (
        <div className="page-content width-100 flex-column gap-2">

            <Titolo
                titolo="Prenotazioni"
                sottotitolo="Consulta i tuoi seminari prenotati, gestisci eventuali disdette, condividi la tua esperienza con una recensione e tieni traccia dello storico delle attività svolte."
            />

            {nessunaPrenotazione ? (
                <StatoVuoto
                    titolo="Non hai prenotazioni"
                    descrizione="Consulta i seminari disponibili per prenotarne di nuovi"
                    immagine={carrello_vuoto}
                    testoPulsante="Scopri i seminari"
                    onClick={() => window.location.href = "/"}
                />
            ) : (
                <>
                    <div className="flex gap-1 width-100">
                        <BarraRicerca
                            placeholder="Cerca seminari prenotati..."
                            value={testoRicerca}
                            onChange={setTestoRicerca}
                        />

                        <Filtro
                            categorie={["Da confermare", "Da svolgere", "Conclusi"]}
                            categoriaSelezionata={statoSelezionato}
                            onChange={setStatoSelezionato}
                            opzione="Tutte le prenotazioni"
                        />
                    </div>

                    {seminariDaConfermare.length > 0 && statoSelezionato === "Da confermare" && (
                        <>
                            <label className="flex-align-center gap-05 bold width-fit">
                                <input
                                    type="checkbox"
                                    className="background-white rounded-circle pointer seleziona-tutti"
                                    checked={tuttiSelezionati}
                                    onChange={selezionaTutti}
                                />
                                Seleziona tutti
                            </label>
                        </>
                    )}

                    <div className="width-100 flex-column gap-1">
                        {prenotazioniFiltrate.length > 0 ? (
                            prenotazioniFiltrate.map(prenotazione => (
                                prenotazione.stato === "Da confermare" ? (
                                    <CardPrenotazioneCarrello
                                        key={prenotazione.id}
                                        seminario={prenotazione}
                                        selezionato={seminariSelezionati.includes(prenotazione.id)}
                                        onSeleziona={() => selezionaSeminario(prenotazione.id)}
                                        onRimuovi={() => rimuoviSeminario(prenotazione.id)}
                                        onModifica={modificaSeminario}
                                        mostraSelezione={statoSelezionato === "Da confermare"}
                                    />
                                ) : (
                                    <CardPrenotazioneScuola
                                        key={prenotazione.id}
                                        prenotazione={prenotazione}
                                        onDisdici={disdiciPrenotazione}
                                        onRecensisci={salvaRecensione}
                                    />
                                )
                            ))
                        ) : (
                            <p className="color-grey">
                                Nessuna prenotazione trovata.
                            </p>
                        )}
                    </div>

                    {seminariDaConfermare.length > 0 && statoSelezionato === "Da confermare" && (
                        <button
                            type="button"
                            className="background-red color-cream width-100 padding-05-1 rounded pointer shadow hover"
                            onClick={confermaPrenotazioni}
                            disabled={seminariSelezionati.length === 0}
                        >
                            Conferma prenotazioni
                        </button>
                    )}

                    {prenotazioneDaDisdire && (
                        <PopupConferma
                            titolo="Conferma disdetta"
                            messaggio={`Vuoi davvero disdire la prenotazione di "${prenotazioneDaDisdire.titolo}"?`}
                            testoConferma="Disdici"
                            onConferma={confermaDisdetta}
                            onAnnulla={() => setPrenotazioneDaDisdire(null)}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default Prenotazioni;