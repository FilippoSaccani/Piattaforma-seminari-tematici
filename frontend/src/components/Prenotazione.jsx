import { useState } from "react";
import FormPrenotazione from "./FormPrenotazione";

function Prenotazione({ disponibilita, modalita }) {

    const [dataSelezionata, setDataSelezionata] = useState("");
    const [fasciaSelezionata, setFasciaSelezionata] = useState("");
    const [numeroStudenti, setNumeroStudenti] = useState(1);
    const [modalitaSelezionata, setModalitaSelezionata] = useState(modalita[0]);

    function aggiungiAlCarrello() {
        const prenotazione = {
            data: dataSelezionata,
            fasciaOraria: fasciaSelezionata,
            numeroStudenti: Number(numeroStudenti),
            modalita: modalitaSelezionata
        };

        console.log(prenotazione);

        window.location.href = "/";
    }

    return (
        <div className="background-white border rounded padding-1 flex-column gap-1 shadow">

            <h2 className="color-granato">Prenota il seminario</h2>

            <FormPrenotazione
                disponibilita={disponibilita}
                dataSelezionata={dataSelezionata}
                fasciaSelezionata={fasciaSelezionata}
                numeroStudenti={numeroStudenti}
                modalita={modalita}
                modalitaSelezionata={modalitaSelezionata}
                onChangeData={data => {
                    setDataSelezionata(data);
                    setFasciaSelezionata("");
                }}
                onChangeFascia={setFasciaSelezionata}
                onChangeStudenti={setNumeroStudenti}
                onChangeModalita={setModalitaSelezionata}
            />

            <button
                type="button"
                className="background-red color-cream padding-05 rounded pointer hover"
                disabled={!dataSelezionata || !fasciaSelezionata || numeroStudenti < 1}
                onClick={aggiungiAlCarrello}
            >
                Aggiungi al carrello
            </button>

        </div>
    );
}

export default Prenotazione;
