import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import SelettoreRuolo from "../components/SelettoreRuolo";

function MainLayout({ utente, onCambiaRuolo }) {
    return (
        <>
            <Navbar utente={utente} />
            {/* La chiave fa ripartire la pagina da zero quando cambia il ruolo (filtri compresi) */}
            <Outlet key={utente} context={{ utente }} />
            <SelettoreRuolo utente={utente} onCambiaRuolo={onCambiaRuolo} />
        </>
    );
}

export default MainLayout;