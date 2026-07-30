import { useState } from 'react';
import SignInPage from '../Pages/SignInPage';
import { Link } from "react-router-dom";

export default function Navbar() {
    const NavStyle = {
        color: "#2563EB",
        margin: "4px 30px",
        fontWeight: "600",
        fontSize: "1.5rem",
        alignItems: "center"
    }
    const btnStyle = {
        margin: "auto 30px",
        border: "2px solid black",
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light" style={{background: "#EFF6FF"}}>
                <Link className="navbar-brand " to="/" style={NavStyle}>
                    <img
                        src="/Logo.png"
                        alt="PrepGenie Logo"
                        width="40"
                        height="40"
                        className="me-2"
                    />
                    <span style={{ color: "black" }}>Prep</span>Genie
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/extra" style={{fontSize : "1.4rem", marginLeft: "30px"}}>
                                Extra
                            </Link>
                        </li>
                    </ul>
                    <Link
                        to="/signin"
                        className="btn"
                        style={btnStyle}
                    >
                        Sign In
                    </Link>
                </div>
            </nav>
        </>
    );
}
