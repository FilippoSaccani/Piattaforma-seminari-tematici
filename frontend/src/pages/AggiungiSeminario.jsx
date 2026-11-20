import { useState } from "react";

import Titolo from "../components/Titolo";
import GestioneDisponibilita from "../components/GestioneDisponibilita";
import GestioneVideo from "../components/GestioneVideo";

function AggiungiSeminario() {

    // TODO: recuperare le categorie dal backend tramite fetch
    const [categorie, setCategorie] = useState([
        "Scienze e Ingegneria",
        "Medicina e Vita",
        "Società e Cultura"
    ]);

    // TODO: recuperare i dipartimenti dal backend tramite fetch
    const [dipartimenti, setDipartimenti] = useState([
        "DIEF",
        "Scienze e Metodi dell'Ingegneria",
        "Scienze fisiche, informatiche e matematiche",
        "Scienze chimiche e geologiche"
    ]);

    const [seminario, setSeminario] = useState({
        docente: "Marco Rossi",
        email: "marco.rossi@unimore.it",
        dipartimento: "",
        categoria: "",
        titolo: "",
        descrizione_breve: "",
        descrizione_dettagliata: "",
        requisiti: "",
        durata: "",
        modalita: ["In presenza"],
        anni: [],
        limite_prenotazioni: "",
        video: null,
        disponibilita: []
    });

    const formValido = verificaValidita();

    function aggiornaCampo(event) {
        const { name, value } = event.target;

        setSeminario(precedente => ({
            ...precedente,
            [name]: value
        }));
    }

    function aggiornaModalita(modalita) {
        setSeminario(precedente => ({
            ...precedente,
            modalita: precedente.modalita.includes(modalita)
                ? precedente.modalita.filter(elemento => elemento !== modalita)
                : [...precedente.modalita, modalita]
        }));
    }

    function aggiornaAnno(anno) {
        setSeminario(precedente => ({
            ...precedente,
            anni: precedente.anni.includes(anno)
                ? precedente.anni.filter(elemento => elemento !== anno)
                : [...precedente.anni, anno]
        }));
    }

    function verificaValidita() {
        const durata = Number(seminario.durata);
        const limite = Number(seminario.limite_prenotazioni);

        // Verifica i campi obbligatori
        if (
            !seminario.dipartimento.trim() ||
            !seminario.categoria.trim() ||
            !seminario.titolo.trim() ||
            !seminario.descrizione_breve.trim() ||
            !seminario.descrizione_dettagliata.trim()
        ) {
            return false;
        }

        // Verifica classi, modalità e valori numerici
        if (
            seminario.anni.length === 0 ||
            seminario.modalita.length === 0 ||
            !Number.isInteger(durata) ||
            durata <= 0 ||
            !Number.isInteger(limite) ||
            limite <= 0
        ) {
            return false;
        }

        // Verifica le disponibilità
        if (seminario.disponibilita.length === 0) {
            return false;
        }

        return seminario.disponibilita.every(elemento => {

            // Verifica la data
            if (!elemento.data) {
                return false;
            }

            const [anno, mese, giorno] = elemento.data.split("-").map(Number);
            const data = new Date(Date.UTC(anno, mese - 1, giorno));

            if (
                data.getUTCFullYear() !== anno ||
                data.getUTCMonth() !== mese - 1 ||
                data.getUTCDate() !== giorno
            ) {
                return false;
            }

            // Verifica che ci sia almeno una fascia oraria
            if (
                !elemento.fasceOrarie ||
                elemento.fasceOrarie.length === 0
            ) {
                return false;
            }

            // Verifica tutte le fasce orarie
            return elemento.fasceOrarie.every(fascia => {
                if (
                    !fascia.oraInizio ||
                    !/^([01]\d|2[0-3]):[0-5]\d$/.test(fascia.oraInizio)
                ) {
                    return false;
                }

                const [ore, minuti] = fascia.oraInizio.split(":").map(Number);

                const minutiInizio = ore * 60 + minuti;
                const minutiFine = minutiInizio + durata;

                // La fascia deve iniziare dalle 08:00
                if (minutiInizio < 8 * 60) {
                    return false;
                }

                // La fascia deve terminare entro le 19:00
                if (minutiFine > 19 * 60) {
                    return false;
                }

                return true;
            });
        });
    }

    function aggiungiSeminario(event) {
        event.preventDefault();

        if (!formValido) {
            return;
        }

        console.log(seminario);

        // TODO: invio dei dati al backend tramite fetch

        // Navigazione alla pagina I miei seminari
        window.location.href = "/miei-seminari?stato=Pubblicati";
    }

    return (
        <div className="page-content flex-column gap-2">
            <Titolo
                titolo="Aggiungi seminario"
                sottotitolo="Inserisci le informazioni necessarie per pubblicare un nuovo seminario."
            />

            <form onSubmit={aggiungiSeminario} className="flex-column gap-2 background-white padding-1 border rounded shadow">

                <div className="flex-column gap-1">
                    <div className="grid-2">
                        <div className="flex-column gap-05">
                            <label htmlFor="docente">Docente relatore</label>
                            <input
                                type="text"
                                id="docente"
                                name="docente"
                                value={seminario.docente}
                                className="border rounded padding-05-1 color-grey"
                                readOnly
                                disabled
                            />
                        </div>

                        <div className="flex-column gap-05">
                            <label htmlFor="email">Email istituzionale</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={seminario.email}
                                className="border rounded padding-05-1 color-grey"
                                readOnly
                                disabled
                            />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="flex-column gap-05">
                            <label htmlFor="dipartimento">Dipartimento <span className="color-red">*</span></label>
                            <select
                                id="dipartimento"
                                name="dipartimento"
                                value={seminario.dipartimento}
                                onChange={aggiornaCampo}
                                className="border rounded padding-05-1"
                                required
                            >
                                <option value="">Seleziona un dipartimento</option>

                                {dipartimenti.map(dipartimento => (
                                    <option key={dipartimento} value={dipartimento}>
                                        {dipartimento}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-column gap-05">
                            <label htmlFor="categoria">Categoria <span className="color-red">*</span></label>
                            <select
                                id="categoria"
                                name="categoria"
                                value={seminario.categoria}
                                onChange={aggiornaCampo}
                                className="border rounded padding-05-1"
                                required
                            >
                                <option value="">Seleziona una categoria</option>

                                {categorie.map(categoria => (
                                    <option key={categoria} value={categoria}>
                                        {categoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex-column gap-05">
                        <label htmlFor="titolo">Titolo <span className="color-red">*</span></label>
                        <input
                            type="text"
                            id="titolo"
                            name="titolo"
                            value={seminario.titolo}
                            onChange={aggiornaCampo}
                            placeholder="Es. Intelligenza artificiale: applicazioni e prospettive"
                            className="border rounded padding-05-1"
                            required
                        />
                    </div>

                    <div className="flex-column gap-05">
                        <label htmlFor="descrizione_breve">Descrizione breve <span className="color-red">*</span></label>
                        <textarea
                            id="descrizione_breve"
                            name="descrizione_breve"
                            value={seminario.descrizione_breve}
                            onChange={aggiornaCampo}
                            placeholder="Presenta in poche righe il tema del seminario e gli argomenti principali che verranno affrontati."
                            className="border rounded padding-05-1"
                            required
                        />
                    </div>

                    <div className="flex-column gap-05">
                        <label htmlFor="descrizione_dettagliata">Descrizione dettagliata <span className="color-red">*</span></label>
                        <textarea
                            id="descrizione_dettagliata"
                            name="descrizione_dettagliata"
                            value={seminario.descrizione_dettagliata}
                            onChange={aggiornaCampo}
                            placeholder="Approfondisci i contenuti, le attività previste e gli eventuali esempi pratici proposti durante il seminario."
                            className="border rounded padding-05-1"
                            required
                        />
                    </div>

                    <div className="flex-column gap-05">
                        <label htmlFor="requisiti">Requisiti</label>
                        <textarea
                            id="requisiti"
                            name="requisiti"
                            value={seminario.requisiti}
                            onChange={aggiornaCampo}
                            placeholder="Es. Conoscenze di base di matematica e informatica. Lascia vuoto se non sono richieste competenze preliminari."
                            className="border rounded padding-05-1"
                        />
                    </div>

                    <div className="grid-2">
                        <div className="flex-column gap-05">
                            <label>Classi destinatarie <span className="color-red">*</span></label>

                            <div className="grid-2">
                                <div className="flex-column gap-05">
                                    {[1, 2, 3].map(anno => (
                                        <label key={anno} className="flex-align-center gap-05">
                                            <input
                                                type="checkbox"
                                                checked={seminario.anni.includes(anno)}
                                                onChange={() => aggiornaAnno(anno)}
                                                className="checkbox-custom"
                                            />
                                            {anno}° anno
                                        </label>
                                    ))}
                                </div>

                                <div className="flex-column gap-05">
                                    {[4, 5].map(anno => (
                                        <label key={anno} className="flex-align-center gap-05">
                                            <input
                                                type="checkbox"
                                                checked={seminario.anni.includes(anno)}
                                                onChange={() => aggiornaAnno(anno)}
                                                className="checkbox-custom"
                                            />
                                            {anno}° anno
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-column gap-05">
                            <label>Modalità <span className="color-red">*</span></label>

                            <div className="flex-column gap-05">
                                <label className="flex-align-center gap-05">
                                    <input
                                        type="checkbox"
                                        checked={seminario.modalita.includes("In presenza")}
                                        onChange={() => aggiornaModalita("In presenza")}
                                        className="checkbox-custom"
                                    />
                                    In presenza
                                </label>

                                <label className="flex-align-center gap-05">
                                    <input
                                        type="checkbox"
                                        checked={seminario.modalita.includes("A distanza")}
                                        onChange={() => aggiornaModalita("A distanza")}
                                        className="checkbox-custom"
                                    />
                                    A distanza
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="flex-column gap-05">
                            <label htmlFor="durata">Durata (minuti) <span className="color-red">*</span></label>
                            <input
                                type="number"
                                id="durata"
                                name="durata"
                                min="30"
                                step="5"
                                value={seminario.durata}
                                onChange={aggiornaCampo}
                                placeholder="Es. 60"
                                className="border rounded padding-05-1"
                                required
                            />
                        </div>

                        <div className="flex-column gap-05">
                            <label htmlFor="limite_prenotazioni">Limite prenotazioni annuali <span className="color-red">*</span></label>
                            <input
                                type="number"
                                id="limite_prenotazioni"
                                name="limite_prenotazioni"
                                min="1"
                                step="1"
                                value={seminario.limite_prenotazioni}
                                onChange={aggiornaCampo}
                                placeholder="Es. 10"
                                className="border rounded padding-05-1"
                                required
                            />
                        </div>
                    </div>
                </div>
                
                <GestioneDisponibilita
                    disponibilita={seminario.disponibilita}
                    durata={seminario.durata}
                    setSeminario={setSeminario}
                />
                
                <GestioneVideo
                    video={seminario.video}
                    setVideo={video =>
                        setSeminario(precedente => ({
                            ...precedente,
                            video: video
                        }))
                    }
                />

                <button
                    type="submit"
                    disabled={!formValido}
                    className="background-red color-cream padding-05-1 rounded hover pointer"
                >
                    Aggiungi seminario
                </button>
            </form>
        </div>
    );
}

export default AggiungiSeminario;
