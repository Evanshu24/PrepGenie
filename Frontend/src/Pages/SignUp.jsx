import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState,useEffect} from "react";
import { GoogleLogin } from "@react-oauth/google";

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const navigate = useNavigate();
    
    useEffect(() => {
        if (!showOtp || resendTimer <= 0) return;

        const timer = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [showOtp, resendTimer]);
    
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

            setShowOtp(true);
            setResendTimer(30);

        } catch (error) {
            console.error("Signup error:", error);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();

        setError("");

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            setIsVerifying(true);

            const response = await fetch("http://localhost:5000/api/verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    otp
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Invalid OTP.");
                return;
            }

            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (error) {
            console.error("Verification error:", error);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };


    const handleResendOTP = async () => {
        if (resendTimer > 0 || isResending) return;

        setError("");

        try {
            setIsResending(true);

            const response = await fetch("http://localhost:5000/api/resendOTP", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Unable to resend OTP.");
                return;
            }

            setOtp("");
            setResendTimer(30);
        } catch (error) {
            console.error("Resend OTP error:", error);
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

   
    return (
        <>
            <div className="min-h-[90vh] flex justify-center items-center pt-20">
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

                    <div className="w-full h-[58px] flex justify-center items-center">
                        {isOnline ? (
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const res = await fetch("http://localhost:5000/api/auth/google", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify({
                                                credential: credentialResponse.credential,
                                                mode: "signup"
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
                            />
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="w-full h-[48px] border border-[#d8e1f2] rounded-xl bg-gray-100 text-gray-500 font-semibold cursor-not-allowed"
                            >
                                Continue with Google
                            </button>
                        )}
                    </div>

                    <div className="flex items-center my-[30px]">
                        <div className="flex-1 h-[1px] bg-[#ddd]"></div>
                        <span className="mx-[15px] text-[#999]">or continue with</span>
                        <div className="flex-1 h-[1px] bg-[#ddd]"></div>
                    </div>
                    {!showOtp ? (
                        <form onSubmit={handleSignUp}>

                            <input type="email" value={email} placeholder="Your email address" className="w-full h-[56px] px-4 mb-3 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]" disabled={loading} onChange={(e) => setEmail(e.target.value)} />

                            <input type="text" value={name} placeholder="Your name" className="w-full h-[56px] px-4 mb-3 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]" disabled={loading} onChange={(e) => setName(e.target.value)} />

                            <div className="relative mb-6">
                                <input type={showPassword ? "text" : "password"} value={password} placeholder="Enter your password" className="w-full h-[56px] px-4 pr-12 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]" disabled={loading} onChange={(e) => setPassword(e.target.value)} />

                                <button type="button" className="absolute right-[20px] top-1/2 -translate-y-1/2 text-[#999] hover:text-[#2563EB] cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm mb-4 text-center">
                                    {error}
                                </p>
                            )}

                            <button type="submit" disabled={loading || !isOnline} className="w-full h-[58px] border-none rounded-[12px] bg-[#2563EB] text-white text-[22px] font-semibold transition-colors duration-300 hover:bg-[#1d4ed8] disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer" >
                                {loading ? "Creating account..." : "Sign up"}
                            </button>

                        </form>
                    ) : (
                        <form onSubmit={handleVerifyEmail}>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="6"
                                value={otp}
                                placeholder="Enter 6-digit OTP"
                                className="w-full h-[56px] px-4 mb-4 border border-[#d8e1f2] rounded-xl text-lg text-center tracking-[8px] focus:outline-none focus:border-[#2563EB]"
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                autoComplete="one-time-code"
                                disabled={isVerifying || isResending}
                            />

                            {error && (
                                <p className="text-red-500 text-sm mb-4 text-center">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isVerifying}
                                className="w-full h-[58px] border-none rounded-[12px] bg-[#2563EB] text-white text-[22px] font-semibold transition-colors duration-300 hover:bg-[#1d4ed8] disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isVerifying ? "Verifying..." : "Verify Email"}
                            </button>
                            <button type="button" onClick={handleResendOTP} disabled={resendTimer > 0 || isResending || isVerifying} className="w-full mt-3 text-[#2563EB] font-semibold disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer">
                                {isResending ? "Sending..." : resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                            </button>
                        </form>)
                    }

                </div>
            </div>
        </>
    );
}