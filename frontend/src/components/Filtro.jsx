function Filtro({ categorie, categoriaSelezionata, onChange, opzione, mostraAltro = false }) {
    return (
        <select
            value={categoriaSelezionata}
            onChange={(e) => onChange(e.target.value)}
            className="padding-05-1 border width-fit background-white rounded"
        >
           <option value="">{opzione}</option>

            {categorie.map((cat) => (
                <option key={cat} value={cat}>
                    {cat}
                </option>
            ))}

            {mostraAltro && (
                <option value="Altro">Altro</option>
            )}
        </select>
    );
}

export default Filtro;