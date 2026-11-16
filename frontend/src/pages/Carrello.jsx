import { useState } from "react";
import carrello_vuoto from "../assets/carrello_vuoto.png";

import CardPrenotazione from "../components/CardPrenotazione";

function Carrello() {
    const [seminari, setSeminari] = useState([
        {
            id: 1,
            titolo: "Intelligenza artificiale e robotica",
            dipartimento: "Dipartimento di Ingegneria Enzo Ferrari",
            data: "20/11/2026",
            fasciaOraria: "10:00 - 12:00",
            numeroStudenti: 25,
            modalita: "In presenza",
            modalitaDisponibili: ["In presenza", "A distanza"],
            disponibilita: [
                { data: "15/12/2026", fasceOrarie: ["09:00 - 11:00", "14:00 - 16:00"] },
                { data: "17/12/2026", fasceOrarie: ["10:00 - 12:00"] },
                { data: "18/12/2026", fasceOrarie: ["09:00 - 12:00"] }
            ]
        },
        {
            id: 2,
            titolo: "Cybersecurity e protezione dei dati",
            dipartimento: "Dipartimento di Scienze e Metodi dell'Ingegneria",
            data: "25/11/2026",
            fasciaOraria: "14:00 - 16:00",
            numeroStudenti: 20,
            modalita: "In presenza",
            modalitaDisponibili: ["In presenza", "A distanza"],
            disponibilita: [
                { data: "20/12/2026", fasceOrarie: ["09:00 - 11:00", "14:00 - 16:00"] },
                { data: "17/12/2026", fasceOrarie: ["10:00 - 12:00"] },
                { data: "18/12/2026", fasceOrarie: ["09:00 - 12:00"] }
            ]
        },
        {
            id: 3,
            titolo: "Sviluppo di applicazioni web",
            dipartimento: "Dipartimento di Ingegneria Enzo Ferrari",
            data: "28/11/2026",
            fasciaOraria: "09:00 - 11:00",
            numeroStudenti: 30,
            modalita: "A distanza",
            modalitaDisponibili: ["A distanza"],
            disponibilita: [
                { data: "15/12/2026", fasceOrarie: ["09:00 - 11:00", "14:00 - 16:00"] },
                { data: "17/12/2026", fasceOrarie: ["10:00 - 12:00"] },
                { data: "18/12/2026", fasceOrarie: ["09:00 - 12:00"] }
            ]
        }
    ]);

    const [seminariSelezionati, setSeminariSelezionati] = useState([]);

    const tuttiSelezionati = seminariSelezionati.length === seminari.length;

    function selezionaTutti() {
        setSeminariSelezionati(
            tuttiSelezionati ? [] : seminari.map(seminario => seminario.id)
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
        setSeminari(seminari =>
            seminari.filter(seminario => seminario.id !== id)
        );

        setSeminariSelezionati(selezionati =>
            selezionati.filter(selezionato => selezionato !== id)
        );

        // TODO: effettuare una fetch per rimuovere il seminario dal carrello nel database
    }

    function modificaSeminario(modificato) {
        setSeminari(precedenti =>
            precedenti.map(seminario =>
                seminario.id === modificato.id ? modificato : seminario
            )
        );

        // TODO: effettuare una fetch PUT per aggiornare la prenotazione nel database
    }

    function confermaPrenotazioni() {
        const prenotazioniConfermate = seminari.filter(
            seminario => seminariSelezionati.includes(seminario.id)
        );

        if (prenotazioniConfermate.length === 0) return;

        // TODO: effettuare una fetch POST per confermare le prenotazioni

        setSeminari(precedenti =>
            precedenti.filter(
                seminario => !seminariSelezionati.includes(seminario.id)
            )
        );

        setSeminariSelezionati([]);

        window.location.href = "/prenotazioni";
    }

    return (
        <div className="content width-100 flex-column gap-2 sfondo">
            
            {seminari.length === 0 ? (
                <>
                    <h1>Il mio carrello</h1>

                    <div className="background-white border rounded padding-2 shadow flex-center">
                        <div className="width-50 flex-column flex-align-center gap-1 ">
                            <h2 className="color-granato">Il carrello è vuoto</h2>

                            <p className="color-grey text-center">
                                Non hai ancora aggiunto nessun seminario al carrello.
                                Consulta i seminari disponibili e prenota quelli di tuo interesse.
                            </p>

                            <img
                                src={carrello_vuoto}
                                alt="Carrello vuoto"
                                className="immagine-carrello-vuoto"
                            />

                            <button
                                type="button"
                                className="background-red color-cream width-fit padding-05-1 rounded pointer hover"
                                onClick={() => window.location.href = "/"}
                            >
                                Scopri i seminari
                            </button>
                        </div>
                    </div>
                </>
                
                
            ) : (
                <>
                    <div className="flex-column gap-1">
                        <div className="flex-between flex-align-center">
                            <h1>Il mio carrello</h1>
                            
                            <span className="background-red color-cream width-fit height-fit padding-01-04 rounded-20">
                                {seminari.length} seminari aggiunti
                            </span>
                        </div>

                        <label className="flex-align-center gap-05 bold width-fit">
                            <input
                                type="checkbox"
                                className="background-white rounded-circle pointer"
                                checked={tuttiSelezionati}
                                onChange={selezionaTutti}
                            />
                            Seleziona tutti
                        </label>
                    </div>

                    <div className="flex-column gap-1">
                        {seminari.map(seminario => (
                            <CardPrenotazione
                                key={seminario.id}
                                seminario={seminario}
                                selezionato={seminariSelezionati.includes(seminario.id)}
                                onSeleziona={() => selezionaSeminario(seminario.id)}
                                onRimuovi={() => rimuoviSeminario(seminario.id)}
                                onModifica={modificaSeminario}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="background-red color-cream width-100 padding-05-1 rounded pointer shadow hover"
                        onClick={confermaPrenotazioni}
                        disabled={seminariSelezionati.length === 0}
                    >
                        Conferma prenotazioni
                    </button>
                </>
            )}
        </div>
    );
}

export default Carrello;
