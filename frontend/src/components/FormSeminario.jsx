import { useState } from "react";

import GestioneDisponibilita from "../components/GestioneDisponibilita";
import GestioneVideo from "../components/GestioneVideo";

function FormSeminario({
    seminario,
    setSeminario,
    categorie,
    dipartimenti,
    onSubmit,
    testoPulsante,
    onClickAnnulla
}) {
    const [mostraErrori, setMostraErrori] = useState(false);

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
        const errori = {};

        const durata = Number(seminario.durata);
        const limite = Number(seminario.limite_prenotazioni);

        // Campi obbligatori
        if (!seminario.dipartimento?.trim()) {
            errori.dipartimento = "Seleziona un dipartimento.";
        }

        if (!seminario.categoria?.trim()) {
            errori.categoria = "Seleziona una categoria.";
        }

        if (!seminario.titolo?.trim()) {
            errori.titolo = "Inserisci il titolo del seminario.";
        }

        if (!seminario.descrizione_breve?.trim()) {
            errori.descrizione_breve = "Inserisci la descrizione breve.";
        }

        if (!seminario.descrizione_dettagliata?.trim()) {
            errori.descrizione_dettagliata = "Inserisci la descrizione dettagliata.";
        }

        // Classi e modalità
        if (seminario.anni.length === 0) {
            errori.anni = "Seleziona almeno una classe destinataria.";
        }

        if (seminario.modalita.length === 0) {
            errori.modalita = "Seleziona almeno una modalità.";
        }

        // Valori numerici
        if (!Number.isInteger(durata) || durata < 30) {
            errori.durata = "Inserisci una durata valida (almeno 30 minuti).";
        }

        if (!Number.isInteger(limite) || limite <= 0) {
            errori.limite_prenotazioni = "Inserisci un limite di prenotazioni valido.";
        }

        // Disponibilità
        if (seminario.disponibilita.length === 0) {
            errori.disponibilita = "Inserisci almeno una data di disponibilità.";
        } else {
            seminario.disponibilita.forEach((elemento, indiceData) => {
                if (!elemento.data) {
                    errori[`data_${indiceData}`] = "Inserisci una data.";
                } else {
                    const [anno, mese, giorno] = elemento.data.split("-").map(Number);
                    const data = new Date(Date.UTC(anno, mese - 1, giorno));

                    if (
                        data.getUTCFullYear() !== anno ||
                        data.getUTCMonth() !== mese - 1 ||
                        data.getUTCDate() !== giorno
                    ) {
                        errori[`data_${indiceData}`] = "La data inserita non è valida.";
                    }
                }

                if (!elemento.fasceOrarie || elemento.fasceOrarie.length === 0) {
                    errori[`fasce_${indiceData}`] = "Aggiungi almeno una fascia oraria.";
                    return;
                }

                
                elemento.fasceOrarie.forEach((fascia, indiceFascia) => {
                    const riferimento = `fascia_${indiceData}_${indiceFascia}`;

                    if (!fascia.oraInizio || !/^([01]\d|2[0-3]):[0-5]\d$/.test(fascia.oraInizio)) {
                        errori[riferimento] = "Inserisci un orario valido.";
                        return;
                    }

                    const [ore, minuti] = fascia.oraInizio.split(":").map(Number);
                    const minutiInizio = ore * 60 + minuti;
                    const minutiFine = minutiInizio + durata;

                    if (minutiInizio < 8 * 60) {
                        errori[riferimento] = "L'orario deve iniziare dalle 08:00.";
                    } else if (minutiFine > 18 * 60) {
                        errori[riferimento] = "Il seminario deve terminare entro le 18:00.";
                    }
                });

                // Controllo sovrapposizione tra le fasce della stessa data
                if (durata > 0) {
                    for (let i = 0; i < elemento.fasceOrarie.length; i++) {
                        const oraInizio1 = elemento.fasceOrarie[i].oraInizio;

                        if (!oraInizio1 || !/^([01]\d|2[0-3]):[0-5]\d$/.test(oraInizio1)) {
                            continue;
                        }

                        const [ore1, minuti1] = oraInizio1.split(":").map(Number);
                        const inizio1 = ore1 * 60 + minuti1;
                        const fine1 = inizio1 + durata;

                        for (let j = i + 1; j < elemento.fasceOrarie.length; j++) {
                            const oraInizio2 = elemento.fasceOrarie[j].oraInizio;

                            if (!oraInizio2 || !/^([01]\d|2[0-3]):[0-5]\d$/.test(oraInizio2)) {
                                continue;
                            }

                            const [ore2, minuti2] = oraInizio2.split(":").map(Number);
                            const inizio2 = ore2 * 60 + minuti2;
                            const fine2 = inizio2 + durata;

                            if (inizio1 < fine2 && fine1 > inizio2) {
                                errori[`fascia_${indiceData}_${i}`] =
                                    "Questa fascia oraria si sovrappone a un'altra.";
                            }
                        }
                    }
                }

            });
        }

        return errori;
    }

    const errori = verificaValidita();

    function gestisciSubmit(event) {
    event.preventDefault();

    setMostraErrori(true);

    if (Object.keys(errori).length > 0) {
        const primoErrore = Object.keys(errori)[0];

        const primoCampoNonValido = event.currentTarget.elements.namedItem(primoErrore);

        if (primoCampoNonValido) {
            primoCampoNonValido.focus();
            primoCampoNonValido.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        return;
    }

    onSubmit(event);
}

    return (
        <form
            onSubmit={gestisciSubmit}
            noValidate
            className="flex-column gap-2 background-white padding-1 border rounded shadow"
        >

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
                        <label htmlFor="dipartimento">
                            Dipartimento <span className="color-red">*</span>
                        </label>

                        <select
                            id="dipartimento"
                            name="dipartimento"
                            value={seminario.dipartimento}
                            onChange={aggiornaCampo}
                            className={`border rounded padding-05-1 ${mostraErrori && errori.dipartimento ? "border-red" : ""}`}
                            required
                        >
                            <option value="">Seleziona un dipartimento</option>

                            {dipartimenti.map(dipartimento => (
                                <option key={dipartimento} value={dipartimento}>
                                    {dipartimento}
                                </option>
                            ))}
                        </select>

                        {mostraErrori && errori.dipartimento && (
                            <span className="color-red">{errori.dipartimento}</span>
                        )}
                    </div>

                    <div className="flex-column gap-05">
                        <label htmlFor="categoria">
                            Categoria <span className="color-red">*</span>
                        </label>

                        <select
                            id="categoria"
                            name="categoria"
                            value={seminario.categoria}
                            onChange={aggiornaCampo}
                            className={`border rounded padding-05-1 ${mostraErrori && errori.categoria ? "border-red" : ""}`}
                            required
                        >
                            <option value="">Seleziona una categoria</option>

                            {categorie.map(categoria => (
                                <option key={categoria} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </select>

                        {mostraErrori && errori.categoria && (
                            <span className="color-red">{errori.categoria}</span>
                        )}
                    </div>

                </div>

                <div className="flex-column gap-05">
                    <label htmlFor="titolo">
                        Titolo <span className="color-red">*</span>
                    </label>

                    <input
                        type="text"
                        id="titolo"
                        name="titolo"
                        value={seminario.titolo}
                        onChange={aggiornaCampo}
                        placeholder="Es. Intelligenza artificiale: applicazioni e prospettive"
                        className={`border rounded padding-05-1 ${mostraErrori && errori.titolo ? "border-red" : ""}`}
                        required
                    />

                    {mostraErrori && errori.titolo && (
                        <span className="color-red">{errori.titolo}</span>
                    )}
                </div>

                <div className="flex-column gap-05">
                    <label htmlFor="descrizione_breve">
                        Descrizione breve <span className="color-red">*</span>
                    </label>

                    <textarea
                        id="descrizione_breve"
                        name="descrizione_breve"
                        value={seminario.descrizione_breve}
                        onChange={aggiornaCampo}
                        placeholder="Presenta in poche righe il tema del seminario e gli argomenti principali che verranno affrontati."
                        className={`border rounded padding-05-1 ${mostraErrori && errori.descrizione_breve ? "border-red" : ""}`}
                        required
                    />

                    {mostraErrori && errori.descrizione_breve && (
                        <span className="color-red">{errori.descrizione_breve}</span>
                    )}
                </div>

                <div className="flex-column gap-05">
                    <label htmlFor="descrizione_dettagliata">
                        Descrizione dettagliata <span className="color-red">*</span>
                    </label>

                    <textarea
                        id="descrizione_dettagliata"
                        name="descrizione_dettagliata"
                        value={seminario.descrizione_dettagliata}
                        onChange={aggiornaCampo}
                        placeholder="Approfondisci i contenuti, le attività previste e gli eventuali esempi pratici proposti durante il seminario."
                        className={`border rounded padding-05-1 ${mostraErrori && errori.descrizione_dettagliata ? "border-red" : ""}`}
                        required
                    />

                    {mostraErrori && errori.descrizione_dettagliata && (
                        <span className="color-red">{errori.descrizione_dettagliata}</span>
                    )}
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
                        <label>
                            Classi destinatarie <span className="color-red">*</span>
                        </label>

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

                        {mostraErrori && errori.anni && (
                            <span className="color-red">{errori.anni}</span>
                        )}
                    </div>

                    <div className="flex-column gap-05">
                        <label>
                            Modalità <span className="color-red">*</span>
                        </label>

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

                        {mostraErrori && errori.modalita && (
                            <span className="color-red">{errori.modalita}</span>
                        )}
                    </div>

                </div>

                <div className="grid-2">

                    <div className="flex-column gap-05">
                        <label htmlFor="durata">
                            Durata (minuti) <span className="color-red">*</span>
                        </label>

                        <input
                            type="number"
                            id="durata"
                            name="durata"
                            min="30"
                            step="5"
                            value={seminario.durata}
                            onChange={aggiornaCampo}
                            placeholder="Es. 60"
                            className={`border rounded padding-05-1 ${mostraErrori && errori.durata ? "border-red" : ""}`}
                            required
                        />

                        {mostraErrori && errori.durata && (
                            <span className="color-red">{errori.durata}</span>
                        )}
                    </div>

                    <div className="flex-column gap-05">
                        <label htmlFor="limite_prenotazioni">
                            Limite prenotazioni annuali <span className="color-red">*</span>
                        </label>

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

                        {mostraErrori && errori.limite_prenotazioni && (
                            <span className="color-red">{errori.limite_prenotazioni}</span>
                        )}
                    </div>

                </div>

            </div>
            
            <div className="flex-column gap-05">
                <GestioneDisponibilita
                    disponibilita={seminario.disponibilita}
                    durata={seminario.durata}
                    setSeminario={setSeminario}
                />

                {mostraErrori && Object.entries(errori)
                    .filter(([chiave]) =>
                        chiave === "disponibilita" ||
                        chiave.startsWith("data_") ||
                        chiave.startsWith("fasce_") ||
                        chiave.startsWith("fascia_")
                    )
                    .map(([chiave, messaggio]) => (
                        <span key={chiave} className="color-red">
                            {messaggio}
                        </span>
                    ))
                }
            </div>

            <GestioneVideo
                video={seminario.video}
                setVideo={video =>
                    setSeminario(precedente => ({
                        ...precedente,
                        video: video
                    }))
                }
            />

            <div className="width-100 grid-2">
                
                <button
                    type="button"
                    className="border color-granato background-white rounded padding-05-1 hover pointer"
                    onClick={onClickAnnulla}
                >
                    Annulla
                </button>

                <button
                    type="submit"
                    className="background-red color-cream padding-05-1 rounded hover pointer"
                >
                    {testoPulsante}
                </button>                
            </div>
            

        </form>
    );
}

export default FormSeminario;
