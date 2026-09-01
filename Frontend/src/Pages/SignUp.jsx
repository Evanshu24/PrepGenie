import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        setError("");

        if (!name.trim() || !email.trim() || !password) {
            setError("All fields are required.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to create account.");
                return;
            }

            localStorage.setItem("token", data.token);

            navigate("/");

        } catch (error) {
            console.error("Signup error:", error);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-[90vh] flex justify-center items-center">
                <div className="w-[520px] bg-white p-[45px] rounded-[20px] shadow-[0_10px_40px_rgba(9,10,12,0.15)]">

                    <h3 className="text-center text-3xl font-bold mb-[15px]">
                        Create a free account
                    </h3>

                    <p className="text-center text-[#666] mb-[35px]">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-[#2563EB] font-semibold underline">
                            Login
                        </Link>
                    </p>

                    <button type="button" className="w-full h-[58px] mb-[18px] border border-[#d8e1f2] rounded-[12px] bg-white flex justify-center items-center gap-[15px] text-[20px] transition duration-300 hover:bg-[#f5f7fb] hover:border-[#2563EB] cursor-pointer">
                        <FcGoogle size={28} />
                        Continue with Google
                    </button>

                    <button type="button" className="w-full h-[58px] mb-[18px] border border-[#d8e1f2] rounded-[12px] bg-white flex justify-center items-center gap-[15px] text-[20px] transition duration-300 hover:bg-[#f5f7fb] hover:border-[#2563EB] cursor-pointer">
                        <FaLinkedin color="#0A66C2" size={24} />
                        Continue with LinkedIn
                    </button>

                    <div className="flex items-center my-[30px]">
                        <div className="flex-1 h-[1px] bg-[#ddd]"></div>
                        <span className="mx-[15px] text-[#999]">or continue with</span>
                        <div className="flex-1 h-[1px] bg-[#ddd]"></div>
                    </div>

                    <form onSubmit={handleSignUp}>

                        <input type="email" value={email} placeholder="Your email address" className="w-full h-[56px] px-4 mb-3 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]" onChange={(e) => setEmail(e.target.value)} />

                        <input type="text" value={name} placeholder="Your name" className="w-full h-[56px] px-4 mb-3 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]" onChange={(e) => setName(e.target.value)} />

                        <div className="relative mb-4">
                            <input type={showPassword ? "text" : "password"} value={password} placeholder="Enter your password" className="w-full h-[56px] px-4 pr-12 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]" onChange={(e) => setPassword(e.target.value)} />

                            <button type="button" className="absolute right-[20px] top-1/2 -translate-y-1/2 text-[#999] hover:text-[#2563EB] cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mb-4 text-center">
                                {error}
                            </p>
                        )}

                        <button type="submit" disabled={loading} className="w-full h-[58px] border-none rounded-[12px] bg-[#2563EB] text-white text-[22px] font-semibold transition-colors duration-300 hover:bg-[#1d4ed8] disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer">
                            {loading ? "Creating account..." : "Sign up"}
                        </button>

                    </form>

                </div>
            </div>
        </>
    );
}