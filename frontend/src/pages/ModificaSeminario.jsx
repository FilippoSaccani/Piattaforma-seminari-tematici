import { useEffect, useState } from "react";

import api from "../services/api";

import Titolo from "../components/Titolo";
import FormSeminario from "../components/FormSeminario";

function ModificaSeminario({ seminario: seminarioIniziale, onSalva, onAnnulla }) {

    const [categorie, setCategorie] = useState([]);
    const [dipartimenti, setDipartimenti] = useState([]);

    useEffect(() => {
        api.get("/categorie").then(risposta => setCategorie(risposta.data));
        api.get("/dipartimenti").then(risposta => setDipartimenti(risposta.data));
    }, []);

    const [seminario, setSeminario] = useState({
        ...seminarioIniziale
    });

    function salvaModifiche(event) {
        event.preventDefault();
        onSalva(seminario);
    }

    return (
        <div className="page-content flex-column gap-2">

            <Titolo
                titolo="Modifica seminario"
                sottotitolo="Aggiorna le informazioni del tuo seminario."
            />

            <FormSeminario
                seminario={seminario}
                setSeminario={setSeminario}
                categorie={categorie}
                dipartimenti={dipartimenti}
                onSubmit={salvaModifiche}
                testoPulsante="Salva modifiche"
            />

            <button
                type="button"
                className="border rounded padding-05-1 hover pointer"
                onClick={onAnnulla}
            >
                Annulla
            </button>

        </div>
    );
}

export default ModificaSeminario;