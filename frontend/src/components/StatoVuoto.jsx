import Pulsante from "./Pulsante";

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
                <Pulsante testo={testoPulsante} onClick={onClick} />
            )}
        </div>
    );
}

export default StatoVuoto;