
import logo from "../assets/logo.png";

const linkUtenti = {
    Scuola: [
        { nome: "Home", icona: "fa-house", pagina: "Home", href: "/" },
        { nome: "Prenotazioni", icona: "fa-calendar-check", pagina: "Prenotazioni", href: "/prenotazioni" },
        { nome: "Carrello", icona: "fa-cart-shopping", pagina: "Carrello", href: "/carrello" }
    ],

    Docente: [
        { nome: "Home", icona: "fa-house", pagina: "Home", href: "/" },
        { nome: "Prenotazioni e statistiche", icona: "fa-user-clock", pagina: "Prenotazioni", href: "/prenotazioni" },
        { nome: "Aggiungi seminario", icona: "fa-plus", pagina: "Aggiungi", href: "/aggiungi" }
    ],

    Admin: [
        { nome: "Home", icona: "fa-house", pagina: "Home", href: "/" },
        { nome: "Statistiche", icona: "fa-chart-line", pagina: "Statistiche", href: "/statistiche" }
    ]
};

function Navbar({ utente, pagina }) {

    const links = linkUtenti[utente] || [];

    return (
        <div className="navbar width-100 flex-center flex-between background-white shadow">
            <img src={logo} alt="Logo unimore" />

            <div className="width-fit flex gap-1">
                {links.map((link) => {

                    return (
                        <a
                            key={link.nome}
                            href={link.href}
                            className={`color-cream padding-05-1 flex-center rounded gap-05 ${
                                pagina === link.pagina
                                    ? "background-granato"
                                    : "background-red"
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
