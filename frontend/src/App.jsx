
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import api from "./services/api";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import DettagliSeminario from "./pages/DettagliSeminario";
import Prenotazioni from "./pages/Prenotazioni";
import IMieiSeminari from "./pages/IMieiSeminari";
import AggiungiSeminario from "./pages/AggiungiSeminario";
import ModificaSeminario from "./pages/ModificaSeminario";

function App() {
    const [utente, setUtente] = useState(null);

    useEffect(() => {
        api.get("/utente").then(risposta => setUtente(risposta.data.ruolo));
    }, []);

    // Attende il ruolo dell'utente prima di mostrare le pagine
    if (!utente) {
        return null;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout utente={utente} />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dettagli-seminario/:id" element={<DettagliSeminario />} />
                    <Route path="/prenotazioni" element={<Prenotazioni />} />
                    <Route path="/miei-seminari" element={<IMieiSeminari />} />
                    <Route path="/aggiungi-seminario" element={<AggiungiSeminario />} />
                    <Route path="/modifica-seminario/:id" element={<ModificaSeminario />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;