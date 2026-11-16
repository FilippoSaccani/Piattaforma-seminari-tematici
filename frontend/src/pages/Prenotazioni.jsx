import { useState } from "react";

import BarraRicerca from "../components/BarraRicerca";
import Filtro from "../components/Filtro";
import Titolo from "../components/Titolo";

function Prenotazioni() {
    const prenotazioni = [
        {
            id: 1,
            titolo: "Intelligenza artificiale e robotica",
            dipartimento: "Dipartimento di Ingegneria Enzo Ferrari",
            data: "20/11/2026",
            fasciaOraria: "10:00 - 12:00",
            numeroStudenti: 25,
            modalita: "In presenza",
            stato: "Da svolgere"
        },
        {
            id: 2,
            titolo: "Cybersecurity e protezione dei dati",
            dipartimento: "Dipartimento di Scienze e Metodi dell'Ingegneria",
            data: "25/11/2026",
            fasciaOraria: "14:00 - 16:00",
            numeroStudenti: 20,
            modalita: "In presenza",
            stato: "Da svolgere"
        },
        {
            id: 3,
            titolo: "Sviluppo di applicazioni web",
            dipartimento: "Dipartimento di Ingegneria Enzo Ferrari",
            data: "28/11/2026",
            fasciaOraria: "09:00 - 11:00",
            numeroStudenti: 30,
            modalita: "A distanza",
            stato: "Da svolgere"
        },
        {
            id: 4,
            titolo: "La transizione energetica",
            dipartimento: "Dipartimento di Scienze Fisiche, Informatiche e Matematiche",
            data: "10/11/2026",
            fasciaOraria: "09:00 - 11:00",
            numeroStudenti: 22,
            modalita: "In presenza",
            stato: "Concluso"
        },
        {
            id: 5,
            titolo: "Comunicazione e social media",
            dipartimento: "Dipartimento di Comunicazione ed Economia",
            data: "05/11/2026",
            fasciaOraria: "14:00 - 16:00",
            numeroStudenti: 18,
            modalita: "A distanza",
            stato: "Concluso"
        }
    ];

    const [statoSelezionato, setStatoSelezionato] = useState("");

    return (
        <div className="content width-100 flex-column gap-2 sfondo">
            <Titolo
                titolo="Prenotazioni"
                sottotitolo="Consulta i tuoi seminari prenotati, gestisci eventuali disdette, condividi la tua esperienza con una recensione e tieni traccia dello storico delle attività svolte."
            />

            <div className="flex gap-1 width-100">
                <BarraRicerca placeholder="Cerca seminari prenotati..." />

                <Filtro
                    categorie={["Da svolgere", "Conclusi"]}
                    categoriaSelezionata={statoSelezionato}
                    onChange={setStatoSelezionato}
                    opzione="Tutte le prenotazioni"
                />
            </div>
        </div>
    );
}

export default Prenotazioni;