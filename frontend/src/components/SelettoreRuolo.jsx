import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RUOLI = [
    { ruolo: "Scuola", icona: "fa-school" },
    { ruolo: "Docente", icona: "fa-chalkboard-user" },
    { ruolo: "Admin", icona: "fa-user-shield" }
];

// Bottone del prototipo per cambiare il tipo di utente e vedere la sua interfaccia
function SelettoreRuolo({ utente, onCambiaRuolo }) {
    const [aperto, setAperto] = useState(false);
    const navigate = useNavigate();

    function scegliRuolo(ruolo) {
        setAperto(false);

        if (ruolo !== utente) {
            onCambiaRuolo(ruolo);

            // La pagina attuale potrebbe non essere disponibile per il nuovo ruolo
            navigate("/");
        }
    }

    return (
        <div className="selettore-ruolo flex-column gap-05">
            {aperto && (
                <div className="background-white border rounded shadow padding-05 flex-column gap-025">
                    {RUOLI.map(({ ruolo, icona }) => (
                        <button
                            key={ruolo}
                            type="button"
                            className={`flex-align-center gap-05 padding-05-1 rounded pointer hover ${
                                ruolo === utente ? "background-granato color-cream" : ""
                            }`}
                            onClick={() => scegliRuolo(ruolo)}
                            aria-pressed={ruolo === utente}
                        >
                            <i className={`fa-solid ${icona}`}></i>
                            {ruolo}
                        </button>
                    ))}
                </div>
            )}

            <button
                type="button"
                className="flex-center gap-05 background-granato color-cream padding-05-1 rounded pointer hover shadow"
                onClick={() => setAperto(!aperto)}
                aria-expanded={aperto}
            >
                <i className="fa-solid fa-user-gear"></i>
                Vista: {utente}
            </button>
        </div>
    );
}

export default SelettoreRuolo;
