import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import DettagliSeminario from "./pages/DettagliSeminario";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout utente="Scuola" />}>
                    <Route path="/" element={<Home utente="Scuola" />} />
                    <Route path="/dettagli-seminario/:id" element={<DettagliSeminario utente="Scuola" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;