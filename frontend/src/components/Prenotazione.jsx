import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../services/api";
import { trovaSovrapposizione } from "../utils/disponibilita";

import FormPrenotazione, { MAX_STUDENTI } from "./FormPrenotazione";
import PopupConferma from "./PopupConferma";

function Prenotazione({ disponibilita, modalita, durata }) {
    const navigate = useNavigate();

    const [dataSelezionata, setDataSelezionata] = useState("");
    const [fasciaSelezionata, setFasciaSelezionata] = useState("");
    const [numeroStudenti, setNumeroStudenti] = useState(1);
    const [modalitaSelezionata, setModalitaSelezionata] = useState(modalita[0]);

    const [mostraErrori, setMostraErrori] = useState(false);
    const [aggiunto, setAggiunto] = useState(false);

    // Prenotazioni della scuola, per evitare due seminari nello stesso orario
    const [prenotazioniScuola, setPrenotazioniScuola] = useState([]);

    useEffect(() => {
        api.get("/prenotazioni").then(risposta => setPrenotazioniScuola(risposta.data));
    }, []);

    function verificaValidita() {
        const errori = {};

        if (!dataSelezionata) {
            errori.data = "Seleziona una data.";
        }

        if (dataSelezionata && !fasciaSelezionata) {
            errori.fascia = "Seleziona una fascia oraria.";
        }

        const sovrapposizione = trovaSovrapposizione(
            { data: dataSelezionata, oraInizio: fasciaSelezionata, durata },
            prenotazioniScuola
        );

        if (sovrapposizione) {
            errori.fascia = `In questo orario hai già "${sovrapposizione.titolo}". Scegli un'altra fascia.`;
        }

        if (
            numeroStudenti === "" ||
            !Number.isInteger(Number(numeroStudenti)) ||
            Number(numeroStudenti) < 1 ||
            Number(numeroStudenti) > MAX_STUDENTI
        ) {
            errori.numeroStudenti = `Inserisci un numero intero di studenti tra 1 e ${MAX_STUDENTI}.`;
        }

        return errori;
    }

    const errori = verificaValidita();

    function aggiungiAlCarrello() {
        setMostraErrori(true);

        if (Object.keys(errori).length > 0) {
            return;
        }

        // TODO: inviare la prenotazione al backend con i campi
        // data, oraInizio, numeroStudenti e modalita

        setAggiunto(true);
    }

    return (
        <div className="background-white border rounded padding-1 flex-column gap-1 shadow shadow-hover">

            <h2 className="color-granato">Prenota il seminario</h2>

            <FormPrenotazione
                disponibilita={disponibilita}
                dataSelezionata={dataSelezionata}
                fasciaSelezionata={fasciaSelezionata}
                numeroStudenti={numeroStudenti}
                durata={durata}
                modalita={modalita}
                modalitaSelezionata={modalitaSelezionata}
                errori={mostraErrori ? errori : {}}
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
                onClick={aggiungiAlCarrello}
            >
                Aggiungi al carrello
            </button>

            {aggiunto && (
                <PopupConferma
                    titolo="Aggiunto al carrello"
                    messaggio="Il seminario è nel carrello. Per completare la prenotazione confermalo dalla pagina Prenotazioni."
                    testoConferma="Vai al carrello"
                    testoAnnulla="Continua a cercare"
                    onConferma={() => navigate("/prenotazioni")}
                    onAnnulla={() => navigate("/")}
                />
            )}

        </div>
    );
}

export default Prenotazione;
