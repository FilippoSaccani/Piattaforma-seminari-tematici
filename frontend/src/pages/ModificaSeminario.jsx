import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useCategorieDipartimenti } from "../hooks/useCategorieDipartimenti";

import Titolo from "../components/Titolo";
import FormSeminario from "../components/FormSeminario";

function ModificaSeminario() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { categorie, dipartimenti } = useCategorieDipartimenti();
    const [seminario, setSeminario] = useState(null);

    useEffect(() => {
        api.get(`/seminari/${id}`).then(risposta => {
            // Si possono modificare solo i seminari pubblicati e non ancora prenotati
            if (risposta.data.stato !== "Pubblicato") {
                navigate("/miei-seminari", { replace: true });
                return;
            }

            setSeminario(risposta.data);
        });
    }, [id, navigate]);

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
