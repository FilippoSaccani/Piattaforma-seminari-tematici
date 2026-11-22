function Titolo ({titolo, sottotitolo, paragrafo = ""}) {
    return(
        <div className="width-100 flex-column gap-05">
            <h1>{titolo}</h1>
            <p className="color-grey size-1-3">{sottotitolo}</p>
            { paragrafo != "" && <p className="color-grey size-1-3">{paragrafo}</p> }
        </div>
    )
}

export default Titolo;