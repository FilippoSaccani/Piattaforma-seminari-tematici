
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import DettagliSeminario from "./pages/DettagliSeminario";
import Prenotazioni from "./pages/Prenotazioni";

function App() {
    const utente = "Scuola";

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout utente={utente} />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dettagli-seminario/:id" element={<DettagliSeminario />} />
                    <Route path="/prenotazioni" element={<Prenotazioni />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;