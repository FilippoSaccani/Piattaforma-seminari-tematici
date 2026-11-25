// Converte una data da YYYY-MM-DD a DD/MM/YYYY
export function formattaData(data) {
    const [anno, mese, giorno] = data.split("-");

    return `${giorno}/${mese}/${anno}`;
}

// Mese (da 1 a 12) in cui inizia l'anno accademico
const MESE_INIZIO_ANNO_ACCADEMICO = 9;

// Restituisce l'anno accademico di una data YYYY-MM-DD, per esempio "2025/2026"
export function annoAccademico(data) {
    const [anno, mese] = data.split("-").map(Number);
    const annoInizio = mese >= MESE_INIZIO_ANNO_ACCADEMICO ? anno : anno - 1;

    return `${annoInizio}/${annoInizio + 1}`;
}

// Restituisce l'anno accademico in corso
export function annoAccademicoCorrente() {
    const oggi = new Date();

    return annoAccademico(`${oggi.getFullYear()}-${oggi.getMonth() + 1}-${oggi.getDate()}`);
}

// Calcola l'orario di fine.
// Restituisce una stringa vuota se l'orario o la durata non sono ancora stati inseriti
// (per esempio mentre il docente compila il form) o se la fine andrebbe oltre la mezzanotte.
export function calcolaOraFine(oraInizio, durata) {
    if (!/^\d{2}:\d{2}$/.test(oraInizio ?? "") || !(Number(durata) > 0)) {
        return "";
    }

    const [ore, minuti] = oraInizio.split(":").map(Number);

    const minutiTotali = ore * 60 + minuti + Number(durata);

    if (minutiTotali >= 24 * 60) {
        return "";
    }

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
