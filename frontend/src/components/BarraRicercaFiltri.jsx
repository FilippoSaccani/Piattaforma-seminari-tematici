import BarraRicerca from "./BarraRicerca";
import Filtro from "./Filtro";

function BarraRicercaFiltri({ placeholder, testoRicerca, onRicercaChange, categorie, categoriaSelezionata, onCategoriaChange, dipartimento, dipartimentoSelezionato, onDipartimentoChange, mostraAltro = false }) {
    return (
        <div className="flex flex-center gap-1 width-100">
            <BarraRicerca
                placeholder={placeholder}
                value={testoRicerca}
                onChange={onRicercaChange}
            />

            <Filtro
                categorie={categorie}
                categoriaSelezionata={categoriaSelezionata}
                onChange={onCategoriaChange}
                opzione="Tutte le categorie"
                mostraAltro={mostraAltro}
            />

            <Filtro
                categorie={dipartimento}
                categoriaSelezionata={dipartimentoSelezionato}
                opzione="Tutti i dipartimenti"
                onChange={onDipartimentoChange}
            />
        </div>
    );
}

export default BarraRicercaFiltri;