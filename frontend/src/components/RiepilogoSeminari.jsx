function RiepilogoSeminari({ numeroSeminari, numeroPrenotazioni, numeroConclusi }) {
    const riepiloghi = [
        { numero: numeroSeminari, testo: "Seminari pubblicati" },
        { numero: numeroPrenotazioni, testo: "Prenotazioni" },
        { numero: numeroConclusi, testo: "Conclusi" }
    ];

    return (
        <div className="grid-3">
            {riepiloghi.map(riepilogo => (
                <div
                    key={riepilogo.testo}
                    className="background-white border rounded padding-1 shadow flex-column gap-05 flex-center"
                >
                    <h2 className="color-granato">{riepilogo.numero}</h2>
                    <p className="info-label">{riepilogo.testo}</p>
                </div>
            ))}
        </div>
    );
}

export default RiepilogoSeminari;