
import { useState } from "react";

import GestioneDisponibilita from "../components/GestioneDisponibilita";
import GestioneVideo from "../components/GestioneVideo";
import Pulsante from "../components/Pulsante";
import { fasciaOccupata, giorniPreavviso } from "../utils/disponibilita";
import { convertiDataOra } from "../utils/date";

// Prima data utile per nuove disponibilità: le scuole devono poter prenotare con il preavviso minimo
function calcolaDataMinima() {
    const primaData = new Date();
    primaData.setDate(primaData.getDate() + giorniPreavviso());

    const anno = primaData.getFullYear();
    const mese = String(primaData.getMonth() + 1).padStart(2, "0");
    const giorno = String(primaData.getDate()).padStart(2, "0");

    return `${anno}-${mese}-${giorno}`;
}

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

    // Copia iniziale per distinguere le disponibilità già salvate da quelle nuove
    const [disponibilitaIniziale] = useState(seminario.disponibilita);
    const [durataIniziale] = useState(seminario.durata);

    // Fasce prenotate (e non disdette) da una scuola al momento dell'apertura del form
    const fascePrenotate = disponibilitaIniziale.flatMap(giorno =>
        giorno.fasceOrarie
            .filter(fasciaOccupata)
            .map(fascia => ({ id: fascia.id, data: giorno.data, oraInizio: fascia.oraInizio }))
    );

    const haPrenotazioni = fascePrenotate.length > 0;

    // Modalità scelte dalle scuole nelle prenotazioni ancora da svolgere: non si possono togliere
    const [adesso] = useState(() => new Date());

    const modalitaPrenotate = new Set(
        disponibilitaIniziale.flatMap(giorno =>
            giorno.fasceOrarie
                .filter(fascia =>
                    fasciaOccupata(fascia) &&
                    convertiDataOra(giorno.data, fascia.oraInizio, Number(durataIniziale)) > adesso
                )
                .map(fascia => fascia.prenotazione.modalita)
        )
    );

    // Una modalità è bloccata se è già selezionata e usata da una prenotazione da svolgere
    function modalitaBloccata(modalita) {
        return modalitaPrenotate.has(modalita) && seminario.modalita.includes(modalita);
    }

    const dataMinima = calcolaDataMinima();

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

        const durataValida =
            Number.isInteger(durata) &&
            durata >= 30 &&
            durata % 5 === 0;

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
        } else if ([...modalitaPrenotate].some(modalita => !seminario.modalita.includes(modalita))) {
            errori.modalita = "Non puoi togliere una modalità scelta in prenotazioni ancora da svolgere.";
        }

        // Valori numerici
        if (!durataValida) {
            errori.durata = "Inserisci una durata valida (almeno 30 minuti e multipla di 5).";
        } else if (haPrenotazioni && durata !== Number(durataIniziale)) {
            errori.durata = "La durata non si può modificare perché il seminario ha già delle prenotazioni.";
        }

        if (!Number.isInteger(limite) || limite <= 0) {
            errori.limite_prenotazioni = "Inserisci un limite di prenotazioni valido.";
        }

        // Disponibilità
        if (seminario.disponibilita.length === 0) {
            errori.disponibilita = "Inserisci almeno una data di disponibilità.";
        } else {
            seminario.disponibilita.forEach((elemento, indiceData) => {
                const riferimentoData = `data_${indiceData}`;

                // Cerca la disponibilità originale solo se ha un ID
                const originale = elemento.id != null
                    ? disponibilitaIniziale.find(
                        iniziale => iniziale.id === elemento.id
                    )
                    : undefined;

                const dataInvariata = originale?.data === elemento.data;
                // Data già passata o troppo vicina per essere prenotata dalle scuole
                const dataNonPrenotabile = elemento.data < dataMinima;

                // Controllo della data
                if (!elemento.data) {
                    errori[riferimentoData] = "Inserisci una data.";
                } else {
                    const [anno, mese, giorno] = elemento.data.split("-").map(Number);
                    const data = new Date(Date.UTC(anno, mese - 1, giorno));

                    if (
                        data.getUTCFullYear() !== anno ||
                        data.getUTCMonth() !== mese - 1 ||
                        data.getUTCDate() !== giorno
                    ) {
                        errori[riferimentoData] = "La data inserita non è valida.";
                    } else if (data.getUTCDay() === 0) {
                        errori[riferimentoData] = "Non puoi selezionare una domenica.";
                    } else if (dataNonPrenotabile && !dataInvariata) {
                        errori[riferimentoData] =
                            `La data deve essere almeno ${giorniPreavviso()} giorni dopo oggi, così le scuole fanno in tempo a prenotare.`;
                    }
                }

                // Controllo delle date duplicate
                const dataDuplicata = elemento.data && seminario.disponibilita.some(
                    (altraDisponibilita, indice) =>
                        indice !== indiceData &&
                        altraDisponibilita.data === elemento.data
                );

                if (dataDuplicata && !errori[riferimentoData]) {
                    errori[riferimentoData] = "Questa data è già stata inserita.";
                }

                // Controllo delle fasce orarie
                if (!elemento.fasceOrarie || elemento.fasceOrarie.length === 0) {
                    errori[`fasce_${indiceData}`] = "Aggiungi almeno una fascia oraria.";
                    return;
                }

                elemento.fasceOrarie.forEach((fascia, indiceFascia) => {
                    const riferimento = `fascia_${indiceData}_${indiceFascia}`;

                    if (
                        !fascia.oraInizio ||
                        !/^([01]\d|2[0-3]):[0-5]\d$/.test(fascia.oraInizio)
                    ) {
                        errori[riferimento] = "Inserisci un orario valido.";
                        return;
                    }

                    const [ore, minuti] = fascia.oraInizio.split(":").map(Number);
                    const minutiInizio = ore * 60 + minuti;
                    const minutiFine = minutiInizio + durata;

                    if (minutiInizio < 8 * 60) {
                        errori[riferimento] = "L'orario deve iniziare dalle 08:00.";
                    } else if (
                        durataValida &&
                        minutiFine > 18 * 60
                    ) {
                        errori[riferimento] = "Il seminario deve terminare entro le 18:00.";
                    }

                    // Nelle date non più prenotabili non si possono aggiungere o modificare fasce
                    if (dataNonPrenotabile && dataInvariata) {
                        const fasciaOriginale = fascia.id != null
                            ? originale.fasceOrarie.find(
                                iniziale => iniziale.id === fascia.id
                            )
                            : undefined;

                        if (
                            !fasciaOriginale ||
                            fasciaOriginale.oraInizio !== fascia.oraInizio
                        ) {
                            errori[riferimento] =
                                `Puoi aggiungere o modificare orari solo nelle date ad almeno ${giorniPreavviso()} giorni da oggi.`;
                        }
                    }
                });

                // Controllo delle sovrapposizioni
                if (durataValida) {
                    for (let i = 0; i < elemento.fasceOrarie.length; i++) {
                        const oraInizio1 = elemento.fasceOrarie[i].oraInizio;

                        if (
                            !oraInizio1 ||
                            !/^([01]\d|2[0-3]):[0-5]\d$/.test(oraInizio1)
                        ) {
                            continue;
                        }

                        const [ore1, minuti1] = oraInizio1.split(":").map(Number);
                        const inizio1 = ore1 * 60 + minuti1;
                        const fine1 = inizio1 + durata;

                        for (let j = i + 1; j < elemento.fasceOrarie.length; j++) {
                            const oraInizio2 = elemento.fasceOrarie[j].oraInizio;

                            if (
                                !oraInizio2 ||
                                !/^([01]\d|2[0-3]):[0-5]\d$/.test(oraInizio2)
                            ) {
                                continue;
                            }

                            const [ore2, minuti2] = oraInizio2.split(":").map(Number);
                            const inizio2 = ore2 * 60 + minuti2;
                            const fine2 = inizio2 + durata;

                            if (inizio1 < fine2 && fine1 > inizio2) {
                                // Segnala l'errore sulle fasce che il docente può modificare
                                [i, j].forEach(indice => {
                                    if (!fasciaOccupata(elemento.fasceOrarie[indice])) {
                                        errori[`fascia_${indiceData}_${indice}`] =
                                            "Questa fascia oraria si sovrappone a un'altra.";
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }

        // Le fasce già prenotate devono restare invariate
        const fascePrenotateIntatte = fascePrenotate.every(prenotata =>
            seminario.disponibilita.some(giorno =>
                giorno.data === prenotata.data &&
                giorno.fasceOrarie.some(fascia =>
                    fascia.id === prenotata.id &&
                    fascia.oraInizio === prenotata.oraInizio
                )
            )
        );

        if (!fascePrenotateIntatte) {
            errori.disponibilita = "Le fasce orarie già prenotate non si possono modificare né rimuovere.";
        }

        return errori;
    }

    const errori = verificaValidita();

    function gestisciSubmit(event) {
        event.preventDefault();

        setMostraErrori(true);

        if (Object.keys(errori).length > 0) {
            const primoErrore = Object.keys(errori)[0];

            // Il submit può provenire dal form oppure dal pulsante
            const form = event.currentTarget.form || event.currentTarget;

            const primoCampoNonValido = form.elements.namedItem(primoErrore);

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
            className="flex-column gap-2 background-white padding-1 border rounded shadow shadow-hover"
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
                            className={`border rounded padding-05-1 width-100 ${mostraErrori && errori.dipartimento ? "border-red" : ""}`}
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

                        <div className="grid-2 grid-phone">
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
                                    disabled={modalitaBloccata("In presenza")}
                                    className="checkbox-custom"
                                />
                                In presenza
                            </label>

                            <label className="flex-align-center gap-05">
                                <input
                                    type="checkbox"
                                    checked={seminario.modalita.includes("A distanza")}
                                    onChange={() => aggiornaModalita("A distanza")}
                                    disabled={modalitaBloccata("A distanza")}
                                    className="checkbox-custom"
                                />
                                A distanza
                            </label>
                        </div>

                        {modalitaPrenotate.size > 0 && (
                            <span className="info-label">
                                Le modalità scelte dalle scuole nelle prenotazioni ancora da svolgere non si possono togliere.
                            </span>
                        )}

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
                            disabled={haPrenotazioni}
                            required
                        />

                        {haPrenotazioni && (
                            <span className="info-label">
                                La durata non si può modificare perché il seminario ha già delle prenotazioni.
                            </span>
                        )}

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
                            className={`border rounded padding-05-1 ${mostraErrori && errori.limite_prenotazioni ? "border-red" : ""}`}
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
                    dataMinima={dataMinima}
                    setSeminario={setSeminario}
                    errori={mostraErrori ? errori : {}}
                />

                {mostraErrori && errori.disponibilita && (
                    <span className="color-red">
                        {errori.disponibilita}
                    </span>
                )}
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

            <div className="width-100 grid-2 grid-phone">
                <button
                    type="button"
                    className="border color-granato background-white rounded padding-05-1 hover pointer"
                    onClick={onClickAnnulla}
                >
                    Annulla
                </button>

                <Pulsante
                    testo={testoPulsante}
                    onClick={gestisciSubmit}
                />
            </div>
        </form>
    );
}

export default FormSeminario;
