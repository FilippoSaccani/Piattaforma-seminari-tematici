import { Link } from "react-router-dom";

function CardSeminario({
    id,
    titolo,
    descrizione,
    categoria,
    dipartimento,
    mediaRecensioni,
    numeroRecensioni
}) {
    return (
        <Link
            to={`/dettagli-seminario/${id}`}
            className="shadow background-white border rounded padding-1 flex flex-column gap-1 pointer"
        >
            <div className="flex-between flex-align-center">
                <span className="background-red color-cream width-fit padding-01-04 rounded-20">
                    {categoria}
                </span>

                {numeroRecensioni > 0 && (
                    <div className="flex flex-align-center gap-025">
                        <i className="fa-regular fa-star stella"></i>
                        <span>{mediaRecensioni.toFixed(1)}</span>
                        <span className="info-label">({numeroRecensioni})</span>
                    </div>
                )}
            </div>

            <h3>{titolo}</h3>

            <p className="color-grey">{descrizione}</p>

            <div className="border-top">
                <span className="info-label">Dipartimento</span>
                <p className="info-value">{dipartimento}</p>
            </div>
        </Link>
    );
}

export default CardSeminario;