function RiepilogoSeminari({ numeroSeminari, numeroPrenotazioni, numeroConclusi }) {
    return (
        <div className="grid-3">
            <div className="background-white border rounded padding-1 shadow flex-column gap-05 flex-center">
                <h2 className="color-granato">{numeroSeminari}</h2>
                <p className="info-label">Seminari pubblicati</p>
            </div>

            <div className="background-white border rounded padding-1 shadow flex-column gap-05 flex-center">
                <h2 className="color-granato">{numeroPrenotazioni}</h2>
                <p className="info-label">Prenotazioni</p>
            </div>

            <div className="background-white border rounded padding-1 shadow flex-column gap-05 flex-center">
                <h2 className="color-granato">{numeroConclusi}</h2>
                <p className="info-label">Conclusi</p>
            </div>
        </div>
    );
}

export default RiepilogoSeminari;
