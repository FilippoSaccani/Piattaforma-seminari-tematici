import { convertiDataOra } from "./date";

// Impostazioni lette dal server all'avvio dell'app (vedi App.jsx)
const impostazioni = {
    giorniPreavviso: null,
    giorniTermineDisdetta: null
};

export function salvaImpostazioni(dati) {
    impostazioni.giorniPreavviso = dati.giorniPreavvisoPrenotazione;
    impostazioni.giorniTermineDisdetta = dati.giorniTermineDisdetta;
}

// Giorni di anticipo minimo con cui una scuola può prenotare una fascia
export function giorniPreavviso() {
    return impostazioni.giorniPreavviso;
}

// Giorni di anticipo minimo con cui una scuola può disdire una prenotazione
export function giorniTermineDisdetta() {
    return impostazioni.giorniTermineDisdetta;
}

// Indica se una fascia è ad almeno un certo numero di giorni da oggi (contati dalla mezzanotte)
function mancanoAlmenoGiorni(data, oraInizio, giorni) {
    const primaDataValida = new Date();
    primaDataValida.setHours(0, 0, 0, 0);
    primaDataValida.setDate(primaDataValida.getDate() + giorni);

    return convertiDataOra(data, oraInizio, 0) >= primaDataValida;
}

// Indica se una fascia rispetta il preavviso minimo per essere prenotata o confermata
export function rispettaPreavviso(data, oraInizio) {
    return mancanoAlmenoGiorni(data, oraInizio, giorniPreavviso());
}

// Indica se una prenotazione si può ancora disdire
export function disdettaPossibile(data, oraInizio) {
    return mancanoAlmenoGiorni(data, oraInizio, giorniTermineDisdetta());
}

// Cerca, tra le prenotazioni attive della scuola, una che si sovrappone a quella indicata.
// Le prenotazioni concluse e quella stessa (stesso id) non vengono considerate.
export function trovaSovrapposizione(prenotazione, altrePrenotazioni) {
    if (!prenotazione.data || !prenotazione.oraInizio) {
        return null;
    }

    const inizio = convertiDataOra(prenotazione.data, prenotazione.oraInizio, 0);
    const fine = convertiDataOra(prenotazione.data, prenotazione.oraInizio, prenotazione.durata);

    return altrePrenotazioni.find(altra => {
        if (altra.id === prenotazione.id || altra.stato === "Concluso") {
            return false;
        }

        const inizioAltra = convertiDataOra(altra.data, altra.oraInizio, 0);
        const fineAltra = convertiDataOra(altra.data, altra.oraInizio, altra.durata);

        return inizio < fineAltra && fine > inizioAltra;
    }) ?? null;
}

// Indica se una fascia è occupata da una prenotazione attiva: una prenotazione disdetta la libera
export function fasciaOccupata(fascia) {
    return Boolean(fascia.prenotazione) && !fascia.prenotazione.disdetta;
}

export function filtraDisponibilitaDisponibili(
    disponibilita,
    dataSelezionata,
    oraInizioSelezionata
) {
    // Date e fasce in ordine cronologico, anche se il docente le ha inserite in un altro ordine
    return [...disponibilita]
        .sort((a, b) => a.data.localeCompare(b.data))
        .map(giorno => ({
            ...giorno,
            fasceOrarie: giorno.fasceOrarie.filter(fascia => {
                // Scarta le fasce che non rispettano il preavviso minimo
                if (!rispettaPreavviso(giorno.data, fascia.oraInizio)) {
                    return false;
                }

                return (
                    !fasciaOccupata(fascia) ||
                    (
                        giorno.data === dataSelezionata &&
                        fascia.oraInizio === oraInizioSelezionata
                    )
                );
            }).sort((a, b) => a.oraInizio.localeCompare(b.oraInizio))
        }))
        .filter(giorno => giorno.fasceOrarie.length > 0);
}
