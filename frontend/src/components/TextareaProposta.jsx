import { useState } from "react";

import Pulsante from "./Pulsante";

function TextareaProposta() {
    const [proposta, setProposta] = useState("");
    const [inviata, setInviata] = useState(false);

    function inviaProposta() {
        if (proposta.trim() === "") return;

        // TODO: inviare la proposta al backend tramite fetch

        console.log("Proposta:", proposta);

        setProposta("");
        setInviata(true);
    }

    return (
        <div className="width-100 flex flex-column gap-1 padding-1 border rounded background-white shadow">

            <div className="flex-column gap-05">
                <h3 className="color-granato">Non trovi quello che cerchi?</h3>
                <p className="color-grey">
                    Suggerisci una nuova categoria o un seminario che
                    vorresti trovare sulla piattaforma.
                </p>
            </div>

            <textarea
                value={proposta}
                onChange={(e) => {
                    setProposta(e.target.value);
                    setInviata(false);
                }}
                placeholder="Scrivi qui la tua richiesta..."
                rows="5"
                className="width-100 padding-1 border rounded"
            />

            <Pulsante testo="Invia proposta" onClick={inviaProposta} disabled={!proposta.trim()} />

            {inviata && (
                <p className="successo">Proposta inviata correttamente!</p>
            )}
        </div>
    );
}

export default TextareaProposta;