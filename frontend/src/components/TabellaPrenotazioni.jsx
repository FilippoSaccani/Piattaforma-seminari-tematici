
import { useState } from "react";

import Pulsante from "./Pulsante";

function TabellaPrenotazioni({ prenotazioni, formattaData }) {

    const [mostraTutte, setMostraTutte] = useState(false);

    const prenotazioniVisibili = mostraTutte
        ? prenotazioni
        : prenotazioni.slice(0, 3);

    if (prenotazioni.length === 0) {
        return null;
    }

    return (
        <div className="flex-column gap-1">

            {/* Intestazione */}
            <div className="grid-4 flex-align-center">
                <p className="info-value">Scuola</p>
                <p className="info-value">Data</p>
                <p className="info-value">Orario</p>
                <p className="info-value">Stato</p>
            </div>

            {/* Prenotazioni */}
            <div className="flex-column gap-1">
                {prenotazioniVisibili.map((prenotazione, index) => (
                    <div
                        key={prenotazione.id ?? `${prenotazione.data}_${prenotazione.orario}_${index}`}
                        className="grid-4 border-top flex-align-center"
                    >
                        <span className="info-label">
                            {prenotazione.scuola}
                        </span>

                        <span className="info-label">
                            {formattaData(prenotazione.data)}
                        </span>

                        <span className="info-label">
                            {prenotazione.orario}
                        </span>

                        <span className="info-label">
                            {prenotazione.stato}
                        </span>
                    </div>
                ))}
            </div>

            {/* Mostra tutte */}
            {prenotazioni.length > 3 && (
                <Pulsante
                    testo={mostraTutte ? "Mostra meno" : "Mostra tutte"}
                    onClick={() => setMostraTutte(!mostraTutte)}
                />
            )}

        </div>
    );
}

export default TabellaPrenotazioni;
