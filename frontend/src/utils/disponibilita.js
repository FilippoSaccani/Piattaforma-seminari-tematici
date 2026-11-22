export function filtraDisponibilitaDisponibili(
    disponibilita,
    dataSelezionata,
    oraInizioSelezionata
) {
    return disponibilita
        .map(giorno => ({
            ...giorno,
            fasceOrarie: giorno.fasceOrarie.filter(
                fascia =>
                    fascia.prenotazione === null ||
                    (
                        giorno.data === dataSelezionata &&
                        fascia.oraInizio === oraInizioSelezionata
                    )
            )
        }))
        .filter(giorno => giorno.fasceOrarie.length > 0);
}
