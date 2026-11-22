
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

    function haAccesso(utente, ruoli) {
        return ruoli.includes(utente);
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout utente={utente} />}>
                    <Route path="/" element={<Home />} />

                    <Route path="/dettagli-seminario/:id" element={<DettagliSeminario />} />

                    <Route
                        path="/prenotazioni"
                        element={
                            haAccesso(utente, ["Scuola"])
                                ? <Prenotazioni />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/miei-seminari"
                        element={
                            haAccesso(utente, ["Docente"])
                                ? <IMieiSeminari />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/aggiungi-seminario"
                        element={
                            haAccesso(utente, ["Docente"])
                                ? <AggiungiSeminario />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/modifica-seminario/:id"
                        element={
                            haAccesso(utente, ["Docente"])
                                ? <ModificaSeminario />
                                : <Navigate to="/" replace />
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;