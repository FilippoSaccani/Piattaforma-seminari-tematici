import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../services/api";
import { useCategorieDipartimenti } from "../hooks/useCategorieDipartimenti";

import Titolo from "../components/Titolo";
import FormSeminario from "../components/FormSeminario";

function AggiungiSeminario() {
    const navigate = useNavigate();

    const { categorie, dipartimenti } = useCategorieDipartimenti();

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

        // TODO: invio dei dati al backend tramite fetch

        navigate("/miei-seminari?stato=Pubblicati");
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
                onClickAnnulla={() => navigate("/miei-seminari")}
            />

        </div>
    );
}

export default AggiungiSeminario;
