function Pulsante({ testo, icona = "", onClick, disabled = false }) {
    return (
        <button
            type="button"
            className="flex-center gap-05 background-red color-cream padding-05-1 rounded pointer hover"
            onClick={onClick}
            disabled={disabled}
        >
            {icona && <i className={icona}></i>}
            {testo}
        </button>
    );
}

export default Pulsante;