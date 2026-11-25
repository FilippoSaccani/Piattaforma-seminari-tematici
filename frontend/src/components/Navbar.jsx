import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.png";

const linkUtenti = {
    Scuola: [
        { nome: "Home", icona: "fa-house", href: "/" },
        { nome: "Prenotazioni", icona: "fa-calendar-check", href: "/prenotazioni" }
    ],

    Docente: [
        { nome: "Home", icona: "fa-house", href: "/" },
        { nome: "I miei seminari", icona: "fa-file-lines", href: "/miei-seminari" },
        { nome: "Statistiche", icona: "fa-chart-line", href: "/statistiche" }
    ],

    Admin: [
        { nome: "Home", icona: "fa-house", href: "/" },
        { nome: "Statistiche", icona: "fa-chart-line", href: "/statistiche-generali" }
    ]
};

function Navbar({ utente }) {
    const links = linkUtenti[utente] || [];

    return (
        <div className="navbar width-100 flex-center flex-between background-white shadow shadow-hover">

            <Link to="/">
                <img src={logo} alt="Logo unimore" />
            </Link>

            <div className="width-fit flex gap-1">
                {links.map(link => (
                    <NavLink
                        key={link.nome}
                        to={link.href}
                        end={link.href === "/"}
                        className={({ isActive }) =>
                            `color-cream padding-05-1 flex-center rounded gap-05 hover ${
                                isActive ? "background-granato" : "background-red"
                            }`
                        }
                    >
                        <i className={`fa-solid ${link.icona}`}></i>
                        <span className="bold size-1-3">{link.nome}</span>
                    </NavLink>
                ))}
            </div>

        </div>
    );
}

export default Navbar;