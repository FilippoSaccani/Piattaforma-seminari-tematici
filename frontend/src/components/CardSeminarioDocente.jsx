
function CardSeminarioDocente({ seminario, onModifica, onElimina, onVisualizza }) {
    return (
        <div className="background-white border rounded padding-1 shadow flex-column gap-1">

            <div className="flex-between flex-align-center">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">{seminario.titolo}</h2>
                    <p className="color-grey">{seminario.dipartimento}</p>
                </div>

                <span className="background-cream color-granato width-fit padding-03-1 rounded-20">
                    {seminario.categoria}
                </span>
            </div>

            <div>
                <p className="info-label">Descrizione</p>
                <p className="info-value">{seminario.descrizione}</p>
            </div>

            <div className="grid-2">
                <div>
                    <p className="info-label">Disponibilità</p>
                    <p className="info-value">{seminario.numeroDisponibilita}</p>
                </div>

                <div>
                    <p className="info-label">Prenotazioni</p>
                    <p className="info-value">{seminario.numeroPrenotazioni}</p>
                </div>
            </div>

            <div className="flex-end width-100 flex-align-center border-top">
                <div className="width-fit flex gap-1">

                    <button
                        type="button"
                        className="pointer background-white color-granato border padding-05 rounded hover"
                        onClick={() => onVisualizza(seminario)}
                    >
                        Dettagli
                    </button>

                    <button
                        type="button"
                        className="pointer background-red color-cream padding-05 rounded hover"
                        onClick={() => onModifica(seminario)}
                    >
                        Modifica
                    </button>

                    <button
                        type="button"
                        className="pointer background-red color-cream padding-05 rounded hover"
                        onClick={() => onElimina(seminario)}
                    >
                        Elimina
                    </button>

                </div>
            </div>

        </div>
    );
}

export default CardSeminarioDocente;
