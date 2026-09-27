import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaArrowRight,
    FaCheck,
    FaCloudUploadAlt,
    FaFileAlt,
    FaMicrophone,
    FaRobot,
    FaStar,
    FaPlay,
    FaBolt,
    FaChartLine,
    FaComments,
    FaShieldAlt,
    FaChevronDown,
} from "react-icons/fa";

export default function Home() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    const token = localStorage.getItem("token");

    const roles = [
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Data Analyst",
        "Data Scientist",
        "Product Manager",
        "Business Analyst",
        "Financial Analyst",
        "UI/UX Designer",
        "Marketing Executive",
        "Management Consultant",
    ];

    const handleStartInterview = () => {
        if (!token) {
            navigate("/signin");
            return;
        }

        navigate("/interviewDetails");
    };

    const handleUploadClick = () => {
        if (!token) {
            navigate("/signin");
            return;
        }

        fileInputRef.current?.click();
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.type !== "application/pdf") {
            setUploadMessage("Please upload a PDF resume.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setUploadMessage("Resume must be smaller than 5 MB.");
            return;
        }

        try {
            setUploading(true);
            setUploadMessage("");

            const formData = new FormData();
            formData.append("resume", file);

            const response = await fetch(
                "http://localhost:5000/api/uploadResume",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setUploadMessage(
                    data.message || "Unable to upload resume."
                );
                return;
            }

            setUploadMessage("Resume uploaded successfully.");

            setTimeout(() => {
                navigate("/interviewDetails");
            }, 700);
        } catch (error) {
            console.log("Resume upload error:", error);
            setUploadMessage(
                "Something went wrong. Please try again."
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-hidden">

            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">

                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-100/60 rounded-full blur-3xl" />
                    <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-indigo-100/50 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8">

                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* HERO TEXT */}
                        <motion.div
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-7">
                                <FaBolt className="text-xs" />
                                AI-powered interview preparation
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                                Your resume.
                                <br />
                                Your role.
                                <br />
                                <span className="text-blue-600">
                                    Your interview.
                                </span>
                            </h1>

                            <p className="mt-7 text-lg md:text-xl text-slate-600 leading-8 max-w-xl">
                                Practice realistic interviews built around your
                                resume and target role. Get asked the right
                                questions, face AI follow-ups, and understand
                                exactly where you can improve.
                            </p>

                            <div className="mt-9 flex flex-col sm:flex-row gap-4">

                                <button
                                    onClick={handleStartInterview}
                                    className="group flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-xl shadow-blue-600/20"
                                >
                                    Start mock interview
                                    <FaArrowRight className="group-hover:translate-x-1 transition" />
                                </button>

                            </div>

                            {uploadMessage && (
                                <p
                                    className={`mt-4 text-sm font-medium ${
                                        uploadMessage.includes("successfully")
                                            ? "text-green-600"
                                            : "text-red-500"
                                    }`}
                                >
                                    {uploadMessage}
                                </p>
                            )}

                            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-500">

                                <div className="flex items-center gap-2">
                                    <FaCheck className="text-green-500" />
                                    Resume-based questions
                                </div>

                                <div className="flex items-center gap-2">
                                    <FaCheck className="text-green-500" />
                                    AI follow-ups
                                </div>

                                <div className="flex items-center gap-2">
                                    <FaCheck className="text-green-500" />
                                    Detailed feedback
                                </div>

                            </div>
                        </motion.div>

                        {/* HERO PRODUCT PREVIEW */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="relative"
                        >

                            <div className="absolute -inset-5 bg-blue-200/40 blur-3xl rounded-full" />

                            <div className="relative bg-slate-950 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">

                                {/* WINDOW BAR */}
                                <div className="h-14 px-5 flex items-center justify-between border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-red-400" />
                                        <span className="w-3 h-3 rounded-full bg-yellow-400" />
                                        <span className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>

                                    <div className="text-xs text-slate-500">
                                        PrepGenie AI Interview
                                    </div>

                                    <div className="w-12" />
                                </div>

                                <div className="p-6">

                                    <div className="flex items-center justify-between mb-7">

                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wider">
                                                Current interview
                                            </p>

                                            <h3 className="text-white font-semibold mt-1">
                                                Software Engineer
                                            </h3>
                                        </div>

                                        <div className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                                            Live
                                        </div>

                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                                        <div className="flex items-center gap-3 mb-5">

                                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                                                <FaRobot className="text-white" />
                                            </div>

                                            <div>
                                                <p className="text-white text-sm font-medium">
                                                    AI Interviewer
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Based on your resume
                                                </p>
                                            </div>

                                        </div>

                                        <p className="text-slate-200 text-lg leading-7">
                                            "Tell me about a technical project
                                            where you had to solve a difficult
                                            problem."
                                        </p>

                                        <div className="mt-6 flex items-center gap-2">

                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse [animation-delay:150ms]" />
                                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse [animation-delay:300ms]" />

                                            <span className="text-xs text-slate-500 ml-2">
                                                AI is listening
                                            </span>

                                        </div>

                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-4">

                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                            <p className="text-xs text-slate-500">
                                                Interview progress
                                            </p>

                                            <div className="mt-3 flex items-end gap-2">
                                                <span className="text-white text-2xl font-bold">
                                                    4
                                                </span>

                                                <span className="text-slate-500 text-sm mb-1">
                                                    / 8 questions
                                                </span>
                                            </div>

                                            <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="w-1/2 h-full bg-blue-500 rounded-full" />
                                            </div>
                                        </div>

                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                            <p className="text-xs text-slate-500">
                                                Recording
                                            </p>

                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />

                                                <span className="text-white font-semibold">
                                                    02:41
                                                </span>
                                            </div>

                                            <div className="mt-3 flex gap-1 items-center h-5">
                                                {[3, 7, 12, 5, 15, 8, 18, 6, 11, 4, 14, 8, 17, 5].map(
                                                    (height, index) => (
                                                        <motion.span
                                                            key={index}
                                                            animate={{
                                                                height: [
                                                                    `${height}px`,
                                                                    `${Math.max(3, height - 5)}px`,
                                                                    `${height}px`,
                                                                ],
                                                            }}
                                                            transition={{
                                                                duration: 0.8,
                                                                repeat: Infinity,
                                                                delay: index * 0.05,
                                                            }}
                                                            className="w-1 bg-blue-500 rounded-full"
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* FLOATING SCORE */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                }}
                                className="absolute -left-7 bottom-10 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 hidden sm:block"
                            >
                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                        <FaChartLine className="text-green-600" />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Interview score
                                        </p>

                                        <p className="text-xl font-bold text-slate-900">
                                            86<span className="text-sm text-slate-400">/100</span>
                                        </p>
                                    </div>

                                </div>
                            </motion.div>

                        </motion.div>

                    </div>
                </div>
            </section>

            {/* TRUST STRIP */}
            <section className="border-y border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

                        <div>
                            <p className="text-2xl font-bold text-slate-900">
                                Resume-based
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                Questions tailored to you
                            </p>
                        </div>

                        <div>
                            <p className="text-2xl font-bold text-slate-900">
                                AI-powered
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                Dynamic follow-up questions
                            </p>
                        </div>

                        <div>
                            <p className="text-2xl font-bold text-slate-900">
                                Real-time
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                Voice-based interview experience
                            </p>
                        </div>

                        <div>
                            <p className="text-2xl font-bold text-slate-900">
                                100-point
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                Performance evaluation
                            </p>
                        </div>

                    </div>

                </div>
            </section>

            {/* HOW IT WORKS */}
            <section
                id="how-it-works"
                className="py-24 bg-white"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">

                    <div className="text-center max-w-2xl mx-auto">

                        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                            How it works
                        </p>

                        <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                            From resume to interview
                            <br />
                            in minutes.
                        </h2>

                        <p className="mt-5 text-lg text-slate-500">
                            PrepGenie turns your experience into a personalized
                            interview practice session.
                        </p>

                    </div>

                    <div className="mt-16 grid md:grid-cols-4 gap-6">

                        {[
                            {
                                number: "01",
                                icon: <FaFileAlt />,
                                title: "Upload your resume",
                                text: "Give PrepGenie your resume so your interview can reflect your actual experience.",
                            },
                            {
                                number: "02",
                                icon: <FaStar />,
                                title: "Choose your role",
                                text: "Select the role and difficulty level you want to prepare for.",
                            },
                            {
                                number: "03",
                                icon: <FaMicrophone />,
                                title: "Face the interview",
                                text: "Answer questions naturally while AI adapts with relevant follow-ups.",
                            },
                            {
                                number: "04",
                                icon: <FaChartLine />,
                                title: "Get your feedback",
                                text: "Review your performance and understand where you can improve.",
                            },
                        ].map((item) => (
                            <motion.div
                                key={item.number}
                                whileHover={{ y: -6 }}
                                className="relative p-7 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition"
                            >

                                <div className="flex items-center justify-between">

                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg">
                                        {item.icon}
                                    </div>

                                    <span className="text-4xl font-bold text-slate-200">
                                        {item.number}
                                    </span>

                                </div>

                                <h3 className="mt-7 text-xl font-bold">
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-slate-500 leading-7 text-sm">
                                    {item.text}
                                </p>

                            </motion.div>
                        ))}

                    </div>

                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="py-24 bg-slate-950 text-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">

                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                                Why PrepGenie
                            </p>

                            <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
                                Not another list of
                                <br />
                                generic interview questions.
                            </h2>

                            <p className="mt-6 text-slate-400 text-lg leading-8 max-w-xl">
                                PrepGenie is designed to make interview practice
                                feel closer to the real thing — personalized,
                                conversational, and focused on your experience.
                            </p>

                            <button
                                onClick={handleStartInterview}
                                className="mt-8 flex items-center gap-3 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
                            >
                                Try PrepGenie
                                <FaArrowRight />
                            </button>

                        </div>

                        <div className="grid sm:grid-cols-2 gap-5">

                            {[
                                {
                                    icon: <FaRobot />,
                                    title: "Resume-aware AI",
                                    text: "Questions can be tailored around your projects, skills and experience.",
                                },
                                {
                                    icon: <FaComments />,
                                    title: "AI follow-ups",
                                    text: "Go beyond scripted questions with contextual follow-up questions.",
                                },
                                {
                                    icon: <FaChartLine />,
                                    title: "Detailed evaluation",
                                    text: "Understand how your answers performed instead of just getting a score.",
                                },
                                {
                                    icon: <FaShieldAlt />,
                                    title: "Private practice",
                                    text: "Your interview practice stays focused on helping you improve.",
                                },
                            ].map((feature) => (
                                <motion.div
                                    key={feature.title}
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-2xl bg-slate-900 border border-slate-800"
                                >

                                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                        {feature.icon}
                                    </div>

                                    <h3 className="mt-5 text-lg font-semibold">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400 leading-6">
                                        {feature.text}
                                    </p>

                                </motion.div>
                            ))}

                        </div>

                    </div>

                </div>
            </section>

            {/* ROLES */}
            <section
                id="roles"
                className="py-24 bg-slate-50"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">

                    <div className="text-center">

                        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                            Prepare for your role
                        </p>

                        <h2 className="mt-3 text-4xl md:text-5xl font-bold">
                            Whatever you're targeting.
                        </h2>

                        <p className="mt-5 text-slate-500 text-lg">
                            Choose a role and let PrepGenie help you practice
                            for the conversations that matter.
                        </p>

                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-3">

                        {roles.map((role) => (
                            <button
                                key={role}
                                className={`px-5 py-3 rounded-full border bg-white text-sm font-medium transition ${
                                    selectedRole === role
                                        ? "border-blue-500 text-blue-600 shadow-sm"
                                        : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                                }`}
                            >
                                {role}
                            </button>
                        ))}

                    </div>

                </div>
            </section>
        </div>
    );
}