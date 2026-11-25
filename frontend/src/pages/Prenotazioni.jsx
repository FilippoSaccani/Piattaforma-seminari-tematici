import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { disdettaPossibile, rispettaPreavviso, trovaSovrapposizione } from "../utils/disponibilita";
import carrello_vuoto from "../assets/carrello_vuoto.png";

import BarraRicerca from "../components/BarraRicerca";
import Filtro from "../components/Filtro";
import Titolo from "../components/Titolo";
import CardPrenotazioneScuola from "../components/CardPrenotazioneScuola";
import CardPrenotazioneCarrello from "../components/CardPrenotazioneCarrello";
import StatoVuoto from "../components/StatoVuoto";
import PopupConferma from "../components/PopupConferma";
import Pulsante from "../components/Pulsante";

function Prenotazioni() {
    const navigate = useNavigate();

    const [prenotazioni, setPrenotazioni] = useState([]);

    useEffect(() => {
        api.get("/prenotazioni").then(risposta => setPrenotazioni(risposta.data));
    }, []);


    const [testoRicerca, setTestoRicerca] = useState("");
    const [statoSelezionato, setStatoSelezionato] = useState("");
    const [seminariSelezionati, setSeminariSelezionati] = useState([]);
    const [prenotazioneDaDisdire, setPrenotazioneDaDisdire] = useState(null);

    const nessunaPrenotazione = prenotazioni.length === 0;

    const seminariDaConfermare = prenotazioni.filter(
        prenotazione => prenotazione.stato === "Da confermare"
    );

    // Si possono confermare solo le prenotazioni che rispettano ancora il preavviso
    // e che non si sovrappongono ad altre prenotazioni della scuola
    const seminariConfermabili = seminariDaConfermare.filter(
        prenotazione =>
            rispettaPreavviso(prenotazione.data, prenotazione.oraInizio) &&
            !trovaSovrapposizione(prenotazione, prenotazioni)
    );

    const tuttiSelezionati =
        seminariConfermabili.length > 0 &&
        seminariSelezionati.length === seminariConfermabili.length;

    // Prenotazioni già confermate, filtrate per stato e ricerca
    const prenotazioniConfermate = prenotazioni.filter(
        prenotazione => prenotazione.stato !== "Da confermare"
    );

    const prenotazioniFiltrate = prenotazioniConfermate.filter(prenotazione => {
        const corrispondeStato =
            statoSelezionato === "" ||
            (statoSelezionato === "Conclusi" && prenotazione.stato === "Concluso") ||
            prenotazione.stato === statoSelezionato;

        const corrispondeRicerca =
            prenotazione.titolo.toLowerCase().includes(testoRicerca.trim().toLowerCase());

        return corrispondeStato && corrispondeRicerca;
    });

    function selezionaTutti() {
        setSeminariSelezionati(
            tuttiSelezionati
                ? []
                : seminariConfermabili.map(seminario => seminario.id)
        );
    }

    function selezionaSeminario(id) {
        setSeminariSelezionati(precedenti =>
            precedenti.includes(id)
                ? precedenti.filter(selezionato => selezionato !== id)
                : [...precedenti, id]
        );
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
        // Ricontrolla il preavviso al momento della conferma
        const daConfermare = seminariConfermabili
            .map(prenotazione => prenotazione.id)
            .filter(id => seminariSelezionati.includes(id));

        if (daConfermare.length === 0) return;

        setPrenotazioni(precedenti =>
            precedenti.map(prenotazione =>
                daConfermare.includes(prenotazione.id)
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
        // Le prenotazioni confermate si possono disdire solo entro il termine
        if (
            prenotazioneDaDisdire.stato === "Da svolgere" &&
            !disdettaPossibile(prenotazioneDaDisdire.data, prenotazioneDaDisdire.oraInizio)
        ) {
            setPrenotazioneDaDisdire(null);
            return;
        }

        setPrenotazioni(precedenti =>
            precedenti.filter(p => p.id !== prenotazioneDaDisdire.id)
        );

        setSeminariSelezionati(precedenti =>
            precedenti.filter(id => id !== prenotazioneDaDisdire.id)
        );

        setPrenotazioneDaDisdire(null);

        // TODO: fetch DELETE per disdire la prenotazione
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
                    onClick={() => navigate("/")}
                />
            ) : (
                <>
                    {/* Carrello: prenotazioni da confermare, sempre visibili */}
                    {seminariDaConfermare.length > 0 && (
                        <div className="flex-column gap-1">
                            <div className="flex-between flex-align-center gap-1">
                                <div className="flex-column gap-05">
                                    <h2 className="color-granato">
                                        Carrello ({seminariDaConfermare.length})
                                    </h2>
                                    <p className="info-label">
                                        Seleziona le prenotazioni e confermale: finché non sono confermate restano nel carrello.
                                    </p>
                                </div>

                                <label className="flex-align-center gap-05 bold width-fit">
                                    <input
                                        type="checkbox"
                                        className="background-white rounded-circle pointer seleziona-tutti"
                                        checked={tuttiSelezionati}
                                        onChange={selezionaTutti}
                                        disabled={seminariConfermabili.length === 0}
                                    />
                                    Seleziona tutti
                                </label>
                            </div>

                            {seminariDaConfermare.map(prenotazione => (
                                <CardPrenotazioneCarrello
                                    key={prenotazione.id}
                                    seminario={prenotazione}
                                    selezionato={seminariSelezionati.includes(prenotazione.id)}
                                    onSeleziona={() => selezionaSeminario(prenotazione.id)}
                                    onRimuovi={() => disdiciPrenotazione(prenotazione)}
                                    onModifica={modificaSeminario}
                                    altrePrenotazioni={prenotazioni}
                                />
                            ))}

                            <Pulsante
                                testo="Conferma prenotazioni"
                                onClick={confermaPrenotazioni}
                                disabled={seminariSelezionati.length === 0}
                            />
                        </div>
                    )}

                    {/* Prenotazioni confermate */}
                    <div className="flex-column gap-1">
                        <h2 className="color-granato">Prenotazioni confermate</h2>

                        {prenotazioniConfermate.length === 0 ? (
                            <p className="color-grey">
                                Non hai ancora prenotazioni confermate.
                            </p>
                        ) : (
                            <>
                                <div className="flex gap-1 width-100">
                                    <BarraRicerca
                                        placeholder="Cerca seminari prenotati..."
                                        value={testoRicerca}
                                        onChange={setTestoRicerca}
                                    />

                                    <Filtro
                                        opzioni={["Da svolgere", "Conclusi"]}
                                        opzioneSelezionata={statoSelezionato}
                                        onChange={setStatoSelezionato}
                                        testoPredefinito="Tutte le prenotazioni"
                                    />
                                </div>

                                {prenotazioniFiltrate.length > 0 ? (
                                    prenotazioniFiltrate.map(prenotazione => (
                                        <CardPrenotazioneScuola
                                            key={prenotazione.id}
                                            prenotazione={prenotazione}
                                            onDisdici={disdiciPrenotazione}
                                            onRecensisci={salvaRecensione}
                                        />
                                    ))
                                ) : (
                                    <p className="color-grey">
                                        Nessuna prenotazione trovata.
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {prenotazioneDaDisdire && (
                        <PopupConferma
                            {...(prenotazioneDaDisdire.stato === "Da confermare"
                                ? {
                                    titolo: "Rimuovi dal carrello",
                                    messaggio: `Vuoi davvero rimuovere "${prenotazioneDaDisdire.titolo}" dal carrello?`,
                                    testoConferma: "Rimuovi"
                                }
                                : {
                                    titolo: "Conferma disdetta",
                                    messaggio: `Vuoi davvero disdire la prenotazione di "${prenotazioneDaDisdire.titolo}"?`,
                                    testoConferma: "Disdici"
                                })}
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