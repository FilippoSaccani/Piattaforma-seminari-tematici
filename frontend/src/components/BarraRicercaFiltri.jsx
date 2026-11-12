import BarraRicerca from "./BarraRicerca";
import Filtro from "./Filtro";

function BarraRicercaFiltri({ placeholder, testoRicerca, onRicercaChange, categorie, categoriaSelezionata, onCategoriaChange, dipartimento, dipartimentoSelezionato, onDipartimentoChange, statoSelezionato, onStatoChange, utente, mostraAltro = false }) {
    return (
        <div className="flex flex-column gap-05 width-100">
            <BarraRicerca
                placeholder={placeholder}
                value={testoRicerca}
                onChange={onRicercaChange}
            />

            <div className="flex flex-align-center gap-1 width-100">
                <Filtro
                    categorie={categorie}
                    categoriaSelezionata={categoriaSelezionata}
                    onChange={onCategoriaChange}
                    opzione="Tutte le categorie"
                    mostraAltro={utente == "Scuola" && mostraAltro}
                />

                <Filtro
                    categorie={dipartimento}
                    categoriaSelezionata={dipartimentoSelezionato}
                    opzione="Tutti i dipartimenti"
                    onChange={onDipartimentoChange}
                />

                {utente == "Admin" && (
                    <Filtro
                        categorie={["Disponibili", "Prenotati", "Conclusi"]}
                        categoriaSelezionata={statoSelezionato}
                        opzione="Tutti i seminari"
                        onChange={onStatoChange}
                    />
                )}
            </div>
        </div>
    );
}

export default BarraRicercaFiltri;