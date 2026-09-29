import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar({showSignIn=false}) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/signin");
    }

const token = localStorage.getItem("token");

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-18 flex items-center justify-between">

                    <Link
                        to="/"
                        className="flex items-center gap-3"
                    >
                        <span className="text-xl font-bold tracking-tight">Clank
                            <span className="text-blue-600">Viewer</span>
                        </span>
                    </Link>

                    {(!token && !showSignIn) && <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a
                            href="#features"
                            className="hover:text-blue-600 transition"
                        >
                            Features
                        </a>

                        <a href="#how-it-works" className="hover:text-blue-600 transition">How it works</a>

                        <a href="#roles" className="hover:text-blue-600 transition">Roles</a>
                    </div>}

                    <div className="flex items-center gap-3">
                        {!token && (
                            <>
                                <Link
                                    to="/signin"
                                    className="hidden sm:block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
                                >
                                    Sign in
                                </Link>

                                <Link
                                    to="/signup"
                                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                                >
                                    Get started
                                </Link>
                            </>
                        )}

                        {token && (
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 cursor-pointer"
                            >
                                Log out
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}