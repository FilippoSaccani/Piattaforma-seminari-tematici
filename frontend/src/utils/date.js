// Converte una data da YYYY-MM-DD a DD/MM/YYYY
export function formattaData(data) {
    const [anno, mese, giorno] = data.split("-");

    return `${giorno}/${mese}/${anno}`;
}

// Calcola l'orario di fine
export function calcolaOraFine(oraInizio, durata) {
    const [ore, minuti] = oraInizio.split(":").map(Number);

    const minutiTotali = ore * 60 + minuti + Number(durata);

    const oreFine = Math.floor(minutiTotali / 60);
    const minutiFine = minutiTotali % 60;

    return (
        String(oreFine).padStart(2, "0") +
        ":" +
        String(minutiFine).padStart(2, "0")
    );
}

// Converte una data e un orario nel formato Date
export function convertiDataOra(data, oraInizio, durata) {
    const [anno, mese, giorno] = data.split("-").map(Number);
    const [ore, minuti] = oraInizio.split(":").map(Number);

    return new Date(
        anno,
        mese - 1,
        giorno,
        ore,
        minuti + Number(durata)
    );
}
