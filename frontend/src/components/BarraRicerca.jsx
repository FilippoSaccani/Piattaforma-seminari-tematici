function BarraRicerca({placeholder, value, onChange}) {
    return(
        <div className="width-100 flex-center padding-05-1 background-white border gap-1 rounded">
            <i className="fa-solid fa-magnifying-glass color-grey"></i>
            <input 
                type="text" 
                placeholder={placeholder} 
                className="width-100" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default BarraRicerca;