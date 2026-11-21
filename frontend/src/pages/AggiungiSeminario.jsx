
import { useEffect, useState } from "react";

import api from "../services/api";

import Titolo from "../components/Titolo";
import FormSeminario from "../components/FormSeminario";

function AggiungiSeminario() {

    const [categorie, setCategorie] = useState([]);
    const [dipartimenti, setDipartimenti] = useState([]);

    const [seminario, setSeminario] = useState({
        docente: "",
        email: "",
        dipartimento: "",
        categoria: "",
        titolo: "",
        descrizione_breve: "",
        descrizione_dettagliata: "",
        requisiti: "",
        durata: "",
        modalita: ["In presenza"],
        anni: [],
        limite_prenotazioni: "",
        video: null,
        disponibilita: []
    });

    useEffect(() => {
        api.get("/categorie").then(risposta => setCategorie(risposta.data));
        api.get("/dipartimenti").then(risposta => setDipartimenti(risposta.data));

        // Il docente relatore è l'utente collegato
        api.get("/utente").then(risposta =>
            setSeminario(precedente => ({
                ...precedente,
                docente: risposta.data.nome,
                email: risposta.data.email
            }))
        );
    }, []);

    function aggiungiSeminario(event) {
        event.preventDefault();

        console.log(seminario);

        // TODO: invio dei dati al backend tramite fetch

        window.location.href = "/miei-seminari?stato=Pubblicati";
    }

    return (
        <div className="page-content flex-column gap-2">

            <Titolo
                titolo="Aggiungi seminario"
                sottotitolo="Inserisci le informazioni necessarie per pubblicare un nuovo seminario."
            />

            <FormSeminario
                seminario={seminario}
                setSeminario={setSeminario}
                categorie={categorie}
                dipartimenti={dipartimenti}
                onSubmit={aggiungiSeminario}
                testoPulsante="Aggiungi seminario"
            />

        </div>
    );
}

export default AggiungiSeminario;
