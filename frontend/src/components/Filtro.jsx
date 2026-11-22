
function Filtro({ opzioni, opzioneSelezionata, onChange, testoPredefinito, mostraAltro = false }) {
    return (
        <select
            value={opzioneSelezionata}
            onChange={e => onChange(e.target.value)}
            className="padding-05-1 border width-fit background-white rounded"
        >
            <option value="">{testoPredefinito}</option>

            {opzioni.map(valore => (
                <option key={valore} value={valore}>
                    {valore}
                </option>
            ))}

            {mostraAltro && (
                <option value="Altro">Altro</option>
            )}
        </select>
    );
}

export default Filtro;
