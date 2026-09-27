import {useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaEye } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error,setError] = useState("");
    const [isSigning, setIsSigning] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const navigate = useNavigate();

    useEffect(() => {
            const handleOnline = () => setIsOnline(true);
            const handleOffline = () => setIsOnline(false);
    
            window.addEventListener("online", handleOnline);
            window.addEventListener("offline", handleOffline);
    
            return () => {
                window.removeEventListener("online", handleOnline);
                window.removeEventListener("offline", handleOffline);
            };
    }, []);
    
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setIsSigning(true);
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
                console.log(data.message);
                setError(data.message || "Login failed");
                setIsSigning(false);
                return;
            }
            setError("");
            localStorage.setItem("token", data.token);
            alert("Login successful");
            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again later.");
        }finally{
            setIsSigning(false);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-[85vh] pt-20">
                <div className="w-[550px] p-[45px] bg-white rounded-[20px] shadow-[0_10px_40px_rgba(9,10,12,0.15)]">

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

                    <div className="w-full h-[58px] mb-[18px] flex justify-center items-center">
                        {isOnline ? (<GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    const res = await fetch("http://localhost:5000/api/auth/google", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            credential: credentialResponse.credential,
                                            mode: "login"
                                        })
                                    });

                                    const data = await res.json();

                                    if (!res.ok) {
                                        setError(data.message || "Google login failed.");
                                        return;
                                    }

                                    localStorage.setItem("token", data.token);
                                    navigate("/");
                                } catch (error) {
                                    console.error(error);
                                    setError("Something went wrong. Please try again.");
                                }
                            }}
                            onError={() => {
                                setError("Google authentication failed.");
                            }}
                            text="continue_with"
                            shape="rectangular"
                            size="large"
                            logo_alignment="center"
                            width="400"
                        />) : (<button
                                type="button"
                                disabled
                                className="w-full h-[48px] border border-[#d8e1f2] rounded-xl bg-gray-100 text-gray-500 font-semibold cursor-not-allowed"
                            >
                                Continue with Google
                            </button>)
                        }
                    </div>

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

                        {error && 
                            <div className="flex items-center justify-center">
                                <p className="text-center text-sm text-red-500 mb-4">{error}</p>
                            </div>
                        }

                        <button
                            type="submit"
                            className="w-full h-[58px] border-none rounded-[12px] bg-[#2563EB] text-white text-[22px] font-semibold transition-colors cursor-pointer duration-300 hover:bg-[#1d4ed8] disabled:bg-blue-300 disabled:cursor-not-allowed"
                            disabled={isSigning || !isOnline}
                        >
                            {isSigning ? "Signing in...." : "Log In"}
                        </button>
                        
                    </form>

                </div>
            </div>
        </>
    );
}