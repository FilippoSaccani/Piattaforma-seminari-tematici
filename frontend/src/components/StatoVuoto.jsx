function StatoVuoto({
    titolo,
    descrizione,
    immagine,
    testoPulsante = "",
    onClick = () => {}
}) {
    return (
        <div className="flex-column flex-align-center gap-2 background-white rounded padding-1 shadow">
            <div className="flex-column gap-05 flex-align-center">
                <h2 className="color-granato">
                    {titolo}
                </h2>

                <p className="color-grey">
                    {descrizione}
                </p>
            </div>

            <img src={immagine} alt="" />

            {testoPulsante && (
                <button
                    type="button"
                    className="background-red color-cream padding-05-1 rounded pointer hover"
                    onClick={onClick}
                >
                    {testoPulsante}
                </button>
            )}
        </div>
    );
}

export default StatoVuoto;