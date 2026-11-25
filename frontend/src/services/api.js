import axios from "axios";

// In sviluppo Vite inoltra le chiamate a /api al backend Flask
const api = axios.create({
    baseURL: "/api"
});

// Ruolo scelto con il selettore del prototipo, ricordato anche dopo aver ricaricato la pagina
const CHIAVE_RUOLO = "ruolo";

function leggiRuoloSalvato() {
    try {
        return localStorage.getItem(CHIAVE_RUOLO);
    } catch {
        return null;
    }
}

let ruoloScelto = leggiRuoloSalvato();

export function impostaRuolo(ruolo) {
    ruoloScelto = ruolo;

    try {
        localStorage.setItem(CHIAVE_RUOLO, ruolo);
    } catch {
        // Se il browser non permette di salvarlo, il ruolo vale fino alla prossima ricarica
    }
}

// Nel sito statico (npm run build:statico) non c'è il backend: le risposte delle API
// sono file JSON già pronti, per esempio /api/seminari.json o /api/seminari/3.json
const SITO_STATICO = import.meta.env.MODE === "statico";

// Ruolo usato se non ne è stato scelto nessuno, come nel backend
const RUOLO_PREDEFINITO = "Docente";

api.interceptors.request.use(config => {
    if (SITO_STATICO) {
        let percorso = config.url.replace(/^\//, "");

        // L'utente collegato dipende dal ruolo scelto con il selettore
        if (percorso === "utente") {
            percorso = `utente-${(ruoloScelto ?? RUOLO_PREDEFINITO).toLowerCase()}`;
        }

        config.url = `/${percorso}.json`;
    } else if (ruoloScelto) {
        // Invia il ruolo scelto al backend con ogni richiesta
        config.headers["X-Ruolo"] = ruoloScelto;
    }

    return config;
});

export default api;
