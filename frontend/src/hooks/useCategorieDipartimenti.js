import { useEffect, useState } from "react";

import api from "../services/api";

// Carica le categorie e i dipartimenti usati nei filtri e nei form dei seminari
export function useCategorieDipartimenti() {
    const [categorie, setCategorie] = useState([]);
    const [dipartimenti, setDipartimenti] = useState([]);

    useEffect(() => {
        api.get("/categorie").then(risposta => setCategorie(risposta.data));
        api.get("/dipartimenti").then(risposta => setDipartimenti(risposta.data));
    }, []);

    return { categorie, dipartimenti };
}
