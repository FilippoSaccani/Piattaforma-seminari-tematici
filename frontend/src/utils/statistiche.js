import { annoAccademico, convertiDataOra } from "./date";

// Conta le prenotazioni dei seminari del docente.
// Se viene indicato un anno accademico, considera solo le date di quell'anno.
export function contaPrenotazioni(seminari, adesso, anno = null) {
    const nellAnno = data => anno === null || annoAccademico(data) === anno;

    let completati = 0;
    let prenotati = 0;
    let disdette = 0;
    let studentiCoinvolti = 0;

    seminari.forEach(seminario => {
        seminario.disponibilita.forEach(giorno => {
            if (!nellAnno(giorno.data)) {
                return;
            }

            giorno.fasceOrarie.forEach(fascia => {
                if (!fascia.prenotazione) {
                    return;
                }

                if (fascia.prenotazione.disdetta) {
                    disdette++;
                    return;
                }

                const fine = convertiDataOra(giorno.data, fascia.oraInizio, seminario.durata);

                if (fine <= adesso) {
                    completati++;
                    studentiCoinvolti += fascia.prenotazione.numeroStudenti;
                } else {
                    prenotati++;
                }
            });
        });
    });

    return { completati, prenotati, disdette, studentiCoinvolti };
}

// Calcola la media dei voti delle recensioni, oppure null se non ce ne sono
export function calcolaMediaRecensioni(recensioni) {
    if (recensioni.length === 0) {
        return null;
    }

    return recensioni.reduce((somma, recensione) => somma + recensione.voto, 0) / recensioni.length;
}

// Restituisce i valori distinti di un campo dei seminari, in ordine alfabetico
export function valoriDistinti(seminari, campo) {
    return [...new Set(seminari.map(seminario => seminario[campo]))].sort();
}
