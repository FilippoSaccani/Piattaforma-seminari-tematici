
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import seminari_non_disponibili from "../assets/seminari_non_disponibili.png";

import api from "../services/api";

import StatoVuoto from "../components/StatoVuoto";
import BarraRicerca from "../components/BarraRicerca";
import Filtro from "../components/Filtro";
import Titolo from "../components/Titolo";
import Riepilogo from "../components/Riepilogo";
import CardSeminarioDocente from "../components/CardSeminarioDocente";
import PopupConferma from "../components/PopupConferma";
import Pulsante from "../components/Pulsante";

function IMieiSeminari() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [seminari, setSeminari] = useState([]);
    const [statiSeminari, setStatiSeminari] = useState([]);
    const [testoRicerca, setTestoRicerca] = useState("");

    const [statoSelezionato, setStatoSelezionato] = useState(
        searchParams.get("stato") || ""
    );

    const [seminarioDaEliminare, setSeminarioDaEliminare] = useState(null);

    useEffect(() => {
        api.get("/miei-seminari").then(risposta => {
            setSeminari(risposta.data);
        });
    }, []);

    useEffect(() => {
        api.get("/stati-seminari").then(risposta => {
            setStatiSeminari(risposta.data);
        });
    }, []);

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
        seminario => seminario.stato === "Concluso"
    ).length;

    const riepiloghi = [
        { numero: seminari.length, testo: "Seminari pubblicati" },
        { numero: numeroPrenotazioni, testo: "Prenotazioni" },
        { numero: numeroConclusi, testo: "Conclusi" }
    ];

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

    function modificaSeminario(seminario) {
        navigate(`/modifica-seminario/${seminario.id}`);
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

            <Pulsante
                testo="Aggiungi seminario"
                icona="fa-solid fa-plus"
                onClick={() => navigate("/aggiungi-seminario")}
            />

            {seminari.length === 0 ? (
                <StatoVuoto
                    titolo="Nessun seminario disponibile"
                    descrizione="Non hai ancora caricato nessun seminario. Quando ne aggiungerai uno, potrai gestirlo da questa sezione."
                    immagine={seminari_non_disponibili}
                />
            ) : (
                <>
                    <Riepilogo riepiloghi={riepiloghi} classe="grid-3" />

                    <div className="flex gap-1 width-100">
                        <BarraRicerca
                            placeholder="Cerca i tuoi seminari..."
                            value={testoRicerca}
                            onChange={setTestoRicerca}
                        />

                        <Filtro
                            opzioni={statiSeminari.map(stato => {
                                if (stato === "Pubblicato") return "Pubblicati";
                                if (stato === "Prenotato") return "Prenotati";
                                return "Conclusi";
                            })}
                            opzioneSelezionata={statoSelezionato}
                            onChange={setStatoSelezionato}
                            testoPredefinito="Tutti i seminari"
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
    );
}

export default IMieiSeminari;