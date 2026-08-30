import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Home from '../Pages/Home.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return (
            <>
                <Navbar />
                <Home />
                <Footer />
            </>
        )
    }

    try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            return (
                <>
                    <Navbar />
                    <Home />
                    <Footer />
                </>
            )
        }

        return children;
    } catch (error) {
        localStorage.removeItem("token");
        return (
            <>
                <Navbar />
                <Home />
                <Footer />
            </>
        )
    }
}