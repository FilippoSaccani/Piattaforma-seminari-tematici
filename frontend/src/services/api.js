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

// Invia il ruolo scelto al backend con ogni richiesta
api.interceptors.request.use(config => {
    if (ruoloScelto) {
        config.headers["X-Ruolo"] = ruoloScelto;
    }

    return config;
});

export default api;
