import { useState } from "react";

import Pulsante from "./Pulsante";

function FormRecensione({ onInvia, onAnnulla }) {

    const [voto, setVoto] = useState(0);
    const [testo, setTesto] = useState("");

    function inviaRecensione() {
        if (voto === 0 || testo.trim() === "") return;

        onInvia({
            voto: voto,
            testo: testo.trim()
        });
    }

    return (
        <div className="flex-column gap-1">

            <div className="flex-column gap-05">
                <p>Come valuti questo seminario?</p>

                <div className="flex gap-1 flex-align-center">
                    {[1, 2, 3, 4, 5].map(stella => (
                        <button
                            key={stella}
                            type="button"
                            className={`pointer background-white ${voto >= stella ? "color-red" : "color-grey"}`}
                            onClick={() => setVoto(stella)}
                            aria-label={`${stella} stelle`}
                        >
                            <i className={`${voto >= stella ? "fa-solid" : "fa-regular"} fa-star`}></i>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-column gap-05">
                <label htmlFor="testo">La tua recensione</label>

                <textarea
                    id="testo"
                    className="width-100 border rounded padding-05"
                    rows="4"
                    placeholder="Raccontaci la tua esperienza..."
                    value={testo}
                    onChange={e => setTesto(e.target.value)}
                />
            </div>

            <div className="flex-end gap-1">
                <button
                    type="button"
                    className="background-white color-granato border rounded padding-05-1 pointer hover"
                    onClick={onAnnulla}
                >
                    Annulla
                </button>
                
                <Pulsante testo="Invia" onClick={inviaRecensione} disabled={voto === 0 || testo.trim() === ""} />
            </div>

        </div>
    );
}

export default FormRecensione;
