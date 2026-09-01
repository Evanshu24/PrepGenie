import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
    const navigate=useNavigate();
    const handleLogout=()=>{
        console.log("Logging out");
        localStorage.removeItem("token");
        navigate("/signin");
    }
    return (
        <>
        <nav className="w-full bg-[#EFF6FF] px-8 py-4">
            <div className="flex items-center w-full">

                <div className="flex items-center gap-6 lg:gap-12">
                    <Link to="/" className="flex items-center gap-2">
                        <img
                            src="/Logo.png"
                            alt="PrepGenie"
                            className="w-10 h-10"
                        />
                        <span className="text-3xl font-semibold">
                            <span className="text-black">Prep</span>
                            <span className="text-blue-600">Genie</span>
                        </span>
                    </Link>
                </div>
                <button
                    className="ml-auto border-2 border-black px-5 py-2 rounded-lg hover:bg-black hover:text-white transition cursor-pointer"
                    onClick={handleLogout}
                >
                Log out
                </button>
            </div>
        </nav>
        </>
    );
}