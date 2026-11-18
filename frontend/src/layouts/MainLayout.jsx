import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout({ utente }) {
    return (
        <>
            <Navbar utente={utente} />
            <Outlet context={{ utente }} />
        </>
    );
}

export default MainLayout;