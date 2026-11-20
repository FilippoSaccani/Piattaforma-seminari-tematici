
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const linkUtenti = {
    Scuola: [
        { nome: "Home", icona: "fa-house", href: "/" },
        { nome: "Prenotazioni", icona: "fa-calendar-check", href: "/prenotazioni" }
    ],

    Docente: [
        { nome: "Home", icona: "fa-house", href: "/" },
        { nome: "I miei seminari", icona: "fa-solid fa-file-lines", href: "/miei-seminari" },
        { nome: "Statistiche", icona: "fa-solid fa-chart-line", href: "/statistiche" }
    ],

    Admin: [
        { nome: "Home", icona: "fa-house", href: "/" },
        { nome: "Statistiche", icona: "fa-chart-line", href: "/statistiche-generali" }
    ]
};

function Navbar({ utente }) {
    const links = linkUtenti[utente] || [];
    const posizione = useLocation();

    return (
        <div className="navbar width-100 flex-center flex-between background-white shadow">
            <img src={logo} alt="Logo unimore" />

            <div className="width-fit flex gap-1">
                {links.map((link) => {
                    const selezionato = posizione.pathname === link.href;

                    return (
                        <a
                            key={link.nome}
                            href={link.href}
                            className={`color-cream padding-05-1 flex-center rounded gap-05 hover ${
                                selezionato ? "background-granato" : "background-red"
                            }`}
                        >
                            <i className={`fa-solid ${link.icona}`}></i>
                            <h2>{link.nome}</h2>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

export default Navbar;
