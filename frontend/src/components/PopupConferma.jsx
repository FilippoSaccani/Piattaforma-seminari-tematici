function PopupConferma({ titolo, messaggio, testoConferma = "Conferma", onConferma, onAnnulla }) {
    return (
        <div className="popup-overlay">
            <div className="popup-conferma background-white rounded padding-1 shadow flex-column gap-1"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titolo-popup">

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
                        type="button"
                        className="background-white color-granato border rounded padding-05-1 pointer hover"
                        onClick={onAnnulla}
                    >
                        Annulla
                    </button>

                    <button
                        type="button"
                        className="background-red color-cream rounded padding-05-1 pointer hover"
                        onClick={onConferma}
                    >
                        {testoConferma}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default PopupConferma;
