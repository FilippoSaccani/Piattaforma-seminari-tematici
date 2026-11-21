
import { useState } from "react";

import Titolo from "../components/Titolo";
import FormSeminario from "../components/FormSeminario";

function AggiungiSeminario() {

    const categorie = [
        "Scienze e Ingegneria",
        "Medicina e Vita",
        "Società e Cultura"
    ];

    const dipartimenti = [
        "DIEF",
        "Scienze e Metodi dell'Ingegneria",
        "Scienze fisiche, informatiche e matematiche",
        "Scienze chimiche e geologiche"
    ];

    const [seminario, setSeminario] = useState({
        docente: "Marco Rossi",
        email: "marco.rossi@unimore.it",
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
