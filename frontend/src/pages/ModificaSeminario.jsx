import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../services/api";

import Titolo from "../components/Titolo";
import FormSeminario from "../components/FormSeminario";

function ModificaSeminario() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categorie, setCategorie] = useState([]);
    const [dipartimenti, setDipartimenti] = useState([]);
    const [seminario, setSeminario] = useState(null);

    useEffect(() => {
        api.get(`/seminari/${id}`)
            .then(risposta => setSeminario(risposta.data));

        api.get("/categorie")
            .then(risposta => setCategorie(risposta.data));

        api.get("/dipartimenti")
            .then(risposta => setDipartimenti(risposta.data));
    }, [id]);

    function salvaModifiche(event) {
        event.preventDefault();

        navigate("/miei-seminari?stato=Pubblicati");
    }

    if (!seminario) return null;

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
                onClickAnnulla={() => navigate("/miei-seminari")}
            />

        </div>
    );
}

export default ModificaSeminario;
