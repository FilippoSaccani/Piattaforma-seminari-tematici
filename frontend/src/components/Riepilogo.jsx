
function Riepilogo({ riepiloghi, classe }) {
    return (
        <div className={classe}>
            {riepiloghi.map(riepilogo => (
                <div
                    key={riepilogo.testo}
                    className="background-white border rounded padding-1 shadow flex-column gap-05 flex-center"
                >
                    <div className="flex-align-center gap-025">
                        <h2 className="color-granato">{riepilogo.numero}</h2>
                        { riepilogo.icona && <i className={`${riepilogo.icona} stella `} /> }
                    </div>

                    <p className="info-label">{riepilogo.testo}</p>
                </div>
            ))}
        </div>
    );
}

export default Riepilogo;
