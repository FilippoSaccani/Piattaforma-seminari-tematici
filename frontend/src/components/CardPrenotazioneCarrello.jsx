
import { useState } from "react";

import FormPrenotazione from "./FormPrenotazione";

function CardPrenotazioneCarrello({ seminario, selezionato, onSeleziona, onRimuovi, onModifica, mostraSelezione = true }) {
    const [inModifica, setInModifica] = useState(false);
    const [datiModificati, setDatiModificati] = useState(seminario);

    function aggiornaCampo(campo, valore) {
        setDatiModificati(precedenti => ({
            ...precedenti,
            [campo]: valore
        }));
    }

    function salvaModifiche() {
        onModifica(datiModificati);
        setInModifica(false);
    }

    function annullaModifiche() {
        setDatiModificati(seminario);
        setInModifica(false);
    }

    return (
        <div className="background-white border rounded padding-1 shadow flex-column gap-1">

            <div className="flex-between flex-align-center">
                <div className="flex-column gap-05">
                    <h2 className="color-granato">{seminario.titolo}</h2>
                    <p className="color-grey">{seminario.dipartimento}</p>
                </div>

                {mostraSelezione ? (
                    <input
                        type="checkbox"
                        className="background-white rounded-circle pointer seleziona-tutti"
                        checked={selezionato}
                        onChange={onSeleziona}
                    />
                ) :
                (
                    <span className="background-cream color-granato width-fit height-fit padding-03-1 rounded-20 flex gap-05 flex-align-center">
                        <i className="fa-solid fa-list-check"></i>
                        Da confermare
                    </span>
                )}
            </div>
            
            {inModifica ? (
                <FormPrenotazione
                    disponibilita={seminario.disponibilita}
                    dataSelezionata={datiModificati.data}
                    fasciaSelezionata={datiModificati.fasciaOraria}
                    numeroStudenti={datiModificati.numeroStudenti}
                    modalita={seminario.modalitaDisponibili}
                    modalitaSelezionata={datiModificati.modalita}
                    onChangeData={data => {
                        const giorno = seminario.disponibilita.find(
                            giorno => giorno.data === data
                        );

                        setDatiModificati(precedenti => ({
                            ...precedenti,
                            data,
                            fasciaOraria: giorno?.fasceOrarie[0] || ""
                        }));
                    }}
                    onChangeFascia={fasciaOraria => aggiornaCampo("fasciaOraria", fasciaOraria)}
                    onChangeStudenti={numeroStudenti => aggiornaCampo("numeroStudenti", Number(numeroStudenti))}
                    onChangeModalita={valore => aggiornaCampo("modalita", valore)}
                />
            ) : (
                <div className="grid-2">
                    <div>
                        <p className="info-label">Data</p>
                        <p className="info-value">{seminario.data}</p>
                    </div>
                    <div>
                        <p className="info-label">Fascia oraria</p>
                        <p className="info-value">{seminario.fasciaOraria}</p>
                    </div>
                    <div>
                        <p className="info-label">Numero di studenti</p>
                        <p className="info-value">{seminario.numeroStudenti}</p>
                    </div>
                    <div>
                        <p className="info-label">Modalità</p>
                        <p className="info-value">{seminario.modalita}</p>
                    </div>
                </div>
            )}

            <div className="flex-end width-100 flex-align-center border-top">
                <div className="width-fit flex gap-1">
                    {inModifica ? (
                        <>
                            <button
                                type="button"
                                className="pointer background-red color-cream padding-05 rounded hover"
                                onClick={salvaModifiche}
                                
                            >
                                Salva
                            </button>

                            <button
                                type="button"
                                className="pointer background-red color-cream padding-05 rounded hover"
                                onClick={annullaModifiche}
                            >
                                Annulla
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="pointer background-red color-cream padding-05 rounded hover"
                                onClick={() => setInModifica(true)}
                            >
                                Modifica
                            </button>

                            <button
                                type="button"
                                className="pointer background-red color-cream padding-05 rounded hover"
                                onClick={onRimuovi}
                            >
                                Rimuovi
                            </button>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}

export default CardPrenotazioneCarrello;
