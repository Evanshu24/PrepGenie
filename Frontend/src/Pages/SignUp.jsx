import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaLinkedin, FaEye } from "react-icons/fa";
export default function SignUpPage() {
    return (
        <>
            <div className="min-h-[90vh] flex justify-center items-center">
                <div className="w-[520px] bg-white p-[45px] rounded-[20px] shadow-[0_10px_40px_rgba(9,10,12,0.15)]">

                    <h3 className="text-center text-3xl font-bold mb-[15px]">Create a free account</h3>

                    <p className="text-center text-[#666] mb-[35px]">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-[#2563EB] font-semibold CSS	Tailwind
text-decoration: underline">Login</Link>
                    </p>

                    <button className="w-full h-[58px] mb-[18px] border border-[#d8e1f2] rounded-[12px] bg-white flex justify-center items-center gap-[15px] text-[20px] transition duration-300 hover:bg-[#f5f7fb] hover:border-[#2563EB]  cursor-pointer">
                        <FcGoogle size={28} />
                        Continue with Google
                    </button>

                    <button className="w-full h-[58px] mb-[18px] border border-[#d8e1f2] rounded-[12px] bg-white flex justify-center items-center gap-[15px] text-[20px] transition duration-300 hover:bg-[#f5f7fb] hover:border-[#2563EB]  cursor-pointer">
                        <FaLinkedin color="#0A66C2" size={24} />
                        Continue with LinkedIn
                    </button>

                    <div className="flex items-center my-[30px]">
                        <div className="flex-1 h-[1px] bg-[#ddd]"></div>
                        <span className="mx-[15px] text-[#999]">or continue with</span>
                        <div className="flex-1 h-[1px] bg-[#ddd]"></div>
                    </div>

                    <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full h-[56px] px-4 mb-3 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]"
                    />
                    <input
                        type="text"
                        placeholder="Your name"
                        className="w-full h-[56px] px-4 mb-3 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]"
                    />
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full h-[56px] px-4 mb-7 border border-[#d8e1f2] rounded-xl text-lg focus:outline-none focus:border-[#2563EB]"
                        />

                        <FaEye className="absolute right-[20px] top-1/2 -translate-y-1/2 text-[#999] cursor-pointer" />
                    </div>

                    <button className="w-full h-[58px] border-none rounded-[12px] bg-[#2563EB] text-white text-[22px] font-semibold transition-colors duration-300 hover:bg-[#1d4ed8]">
                        Sign up
                    </button>
                </div>
            </div>
        </>
    )
}