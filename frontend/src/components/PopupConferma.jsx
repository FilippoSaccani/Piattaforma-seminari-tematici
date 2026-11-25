import { useEffect, useRef } from "react";
import Pulsante from "./Pulsante";

function PopupConferma({
    titolo,
    messaggio,
    testoConferma = "Conferma",
    testoAnnulla = "Annulla",
    onConferma,
    onAnnulla
}) {
    const popupRef = useRef(null);
    const pulsanteAnnullaRef = useRef(null);

    useEffect(() => {
        const elementoPrecedente = document.activeElement;

        // Sposta il focus all'interno del popup
        pulsanteAnnullaRef.current.focus();

        // Quando il popup si chiude, ripristina il focus
        return () => {
            if (document.body.contains(elementoPrecedente)) {
                elementoPrecedente.focus();
            }
        };
    }, []);

    function gestisciTastiera(event) {
        // Chiusura con ESC
        if (event.key === "Escape") {
            event.preventDefault();
            onAnnulla();
            return;
        }

        // Gestione del focus con TAB
        if (event.key === "Tab") {
            const pulsanti = popupRef.current.querySelectorAll(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            const primoElemento = pulsanti[0];
            const ultimoElemento = pulsanti[pulsanti.length - 1];

            if (event.shiftKey && document.activeElement === primoElemento) {
                event.preventDefault();
                ultimoElemento.focus();
            } else if (!event.shiftKey && document.activeElement === ultimoElemento) {
                event.preventDefault();
                primoElemento.focus();
            }
        }
    }

    return (
        <div className="popup-overlay">
            <div
                ref={popupRef}
                className="popup-conferma background-white rounded padding-1 shadow flex-column gap-1"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titolo-popup"
                tabIndex="-1"
                onKeyDown={gestisciTastiera}
            >
                <div className="flex-column gap-05">
                    <h2 id="titolo-popup" className="color-granato">
                        {titolo}
                    </h2>

                    <p className="color-grey">
                        {messaggio}
                    </p>
                </div>

                <div className="grid-2">
                    <button
                        ref={pulsanteAnnullaRef}
                        type="button"
                        className="background-white color-granato border rounded padding-05-1 pointer hover"
                        onClick={onAnnulla}
                    >
                        {testoAnnulla}
                    </button>

                    <Pulsante testo={testoConferma} onClick={onConferma} />
                </div>
            </div>
        </div>
    );
}

export default PopupConferma;
