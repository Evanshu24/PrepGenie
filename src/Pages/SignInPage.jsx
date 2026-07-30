import { Link } from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import {FaFacebook,FaLinkedin,FaEye} from "react-icons/fa";
import '../css_files/SignInPage.css'
export default function SignInPage() {
    return (
        <>
                <div className="login-page">
                    <div className="login-card">

                        <h3>Welcome back</h3>

                        <p className="subtitle">
                            Don't have an account?{" "}
                            <Link to="/signup">Sign up</Link>
                        </p>

                        <button className="social-btn">
                            <FcGoogle size={28} />
                            Continue with Google
                        </button>

                        <button className="social-btn">
                            <FaLinkedin color="#0A66C2" size={24} />
                            Continue with LinkedIn
                        </button>

                        <div className="divider">
                            <span>or continue with</span>
                        </div>

                        <input
                            type="email"
                            placeholder="Your email address"
                            className="form-control mb-3"
                        />

                        <div className="password-box">
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="form-control"
                            />

                            <FaEye className="eye" />
                        </div>

                        <div className="text-end mb-4">
                            <Link to="#">Forgot password?</Link>
                        </div>

                        <button className="login-btn">
                            Log In
                        </button>
                    </div>
                </div>
        </>
    )
}