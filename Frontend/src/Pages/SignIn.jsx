import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaEye } from "react-icons/fa";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);

            alert("Login successful");
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        }
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-[85vh]">
                <div className="w-[550px] p-[45px] bg-white rounded-[20px] shadow-lg">

                    <h3 className="text-center text-3xl font-bold mb-[15px]">
                        Welcome back
                    </h3>

                    <p className="text-center text-[#666] mb-[35px]">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-[#2563EB] font-semibold underline"
                        >
                            Sign up
                        </Link>
                    </p>

                    <button className="w-full h-[58px] mb-[18px] border border-[#d8e1f2] rounded-[12px] bg-white flex justify-center items-center gap-[15px] text-[20px] transition duration-300 hover:bg-[#f5f7fb] hover:border-[#2563EB] cursor-pointer">
                        <FcGoogle size={28} />
                        Continue with Google
                    </button>

                    <button className="w-full h-[58px] mb-[18px] border border-[#d8e1f2] rounded-[12px] bg-white flex justify-center items-center gap-[15px] text-[20px] transition duration-300 hover:bg-[#f5f7fb] hover:border-[#2563EB] cursor-pointer">
                        <FaLinkedin color="#0A66C2" size={24} />
                        Continue with LinkedIn
                    </button>

                    <div className="flex items-center my-[30px]">
                        <div className="flex-1 h-[1px] bg-[#ddd]"></div>

                        <span className="mx-[15px] text-[#999]">
                            or continue with
                        </span>

                        <div className="flex-1 h-[1px] bg-[#ddd]"></div>
                    </div>

                    <form onSubmit={handleLogin}>

                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[56px] px-4 mb-3 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]"
                            required
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[56px] px-4 mb-3 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]"
                                required
                            />

                            <FaEye
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-[20px] top-1/2 -translate-y-1/2 text-[#999] cursor-pointer"
                            />
                        </div>

                        <div className="text-end underline mb-4">
                            <Link to="#">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[58px] border-none rounded-[12px] bg-[#2563EB] text-white text-[22px] font-semibold transition-colors cursor-pointer duration-300 hover:bg-[#1d4ed8]"
                        >
                            Log In
                        </button>

                    </form>

                </div>
            </div>
        </>
    );
}