import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import seminari_non_disponibili from "../assets/seminari_non_disponibili.png";

import api from "../services/api";

import StatoVuoto from "../components/StatoVuoto";
import BarraRicerca from "../components/BarraRicerca";
import Filtro from "../components/Filtro";
import Titolo from "../components/Titolo";
import RiepilogoSeminari from "../components/RiepilogoSeminari";
import CardSeminarioDocente from "../components/CardSeminarioDocente";
import PopupConferma from "../components/PopupConferma";

function IMieiSeminari() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [seminari, setSeminari] = useState([]);

    const [testoRicerca, setTestoRicerca] = useState("");

    const [statoSelezionato, setStatoSelezionato] = useState(
        searchParams.get("stato") || ""
    );

    const [seminarioDaEliminare, setSeminarioDaEliminare] = useState(null);

    useEffect(() => {
        api.get("/miei-seminari").then(risposta => {
            console.log(risposta.data);
            setSeminari(risposta.data)});
    }, []);

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

            <button
                type="button"
                className="background-red color-cream padding-05-1 rounded pointer shadow hover flex-center gap-05"
                onClick={() => navigate("/aggiungi-seminario")}
            >
                <i className="fa-solid fa-plus"></i>
                Aggiungi seminario
            </button>

            {seminari.length === 0 ? (
                <StatoVuoto
                    titolo="Nessun seminario disponibile"
                    descrizione="Non hai ancora caricato nessun seminario. Quando ne aggiungerai uno, potrai gestirlo da questa sezione."
                    immagine={seminari_non_disponibili}
                />
            ) : (
                <>
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
    );
}

export default IMieiSeminari;
