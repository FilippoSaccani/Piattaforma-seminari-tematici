import { convertiDataOra } from "./date";

// Giorni di anticipo minimo con cui una scuola può prenotare una fascia
export const GIORNI_PREAVVISO = 14;

// Indica se una fascia rispetta il preavviso minimo per essere prenotata o confermata
export function rispettaPreavviso(data, oraInizio) {
    // Prima data prenotabile: oggi più i giorni di preavviso, dalla mezzanotte
    const primaDataPrenotabile = new Date();
    primaDataPrenotabile.setHours(0, 0, 0, 0);
    primaDataPrenotabile.setDate(primaDataPrenotabile.getDate() + GIORNI_PREAVVISO);

    return convertiDataOra(data, oraInizio, 0) >= primaDataPrenotabile;
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
    return disponibilita
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
            })
        }))
        .filter(giorno => giorno.fasceOrarie.length > 0);
}
