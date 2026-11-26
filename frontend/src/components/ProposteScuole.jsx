
import { formattaData } from "../utils/date";

function ProposteScuole({ proposte }) {
    return (
        <div className="background-white border rounded padding-1 flex-column gap-1 shadow shadow-hover">
            <div className="flex-column gap-05">
                <div className="flex-align-center gap-05">
                    <h2 className="color-granato">Proposte ricevute</h2>
                    <span className="info-label">({proposte.length})</span>
                </div>

                <p className="color-grey">
                    Consulta gli argomenti e le tematiche che le scuole vorrebbero approfondire attraverso nuovi seminari.
                </p>
            </div>

            {proposte.length === 0 ? (
                <p className="color-grey">
                    Non sono ancora presenti proposte da parte delle scuole.
                </p>
            ) : (
                <div className="altezza-lista-fissa flex-column gap-1">
                    {proposte.map((proposta, index) => (
                        <div
                            key={proposta.id}
                            className={`${index > 0 ? "border-top " : ""}flex-column gap-05`}
                        >
                            <div className="flex-between flex-align-center gap-1 column-phone">
                                <p className="info-value">{proposta.scuola}</p>
                                <span className="info-label">
                                    {formattaData(proposta.data)}
                                </span>
                            </div>

                            <p className="color-grey">{proposta.testo}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProposteScuole;
