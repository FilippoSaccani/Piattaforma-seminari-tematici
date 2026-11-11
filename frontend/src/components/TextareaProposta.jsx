import { useState } from "react";

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
        <div className="textarea-proposta width-100 flex flex-column gap-1">

            <div className="flex flex-column gap-05">
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

            <button onClick={inviaProposta} className="padding-05-1 background-red color-cream border rounded">
                Invia proposta
            </button>

            {inviata && (
                <p>Proposta inviata correttamente!</p>
            )}
        </div>
    );
}

export default TextareaProposta;