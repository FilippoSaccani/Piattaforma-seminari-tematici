function Titolo ({titolo, sottotitolo, paragrafo}) {
    return(
        <div className="width-100 flex-column gap-05">
            <h1>{titolo}</h1>
            <h4>{sottotitolo}</h4>
            { paragrafo != "" && <h4>{paragrafo}</h4> }
        </div>
    )
}

export default Titolo;