import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
export default function Dashboard() {
    const roles = {
        Engineering: [
            "Software Engineer",
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "DevOps Engineer",
            "Data Scientist",
            "Machine Learning Engineer",
            "AI Engineer",
            "Cybersecurity Engineer",
            "Cloud Engineer",
            "QA Engineer",
            "Embedded Systems Engineer",
            "Network Engineer",
            "Database Administrator"
        ],

        Management: [
            "Product Manager",
            "Project Manager",
            "Program Manager",
            "Business Analyst",
            "Management Trainee",
            "Operations Manager",
            "Strategy Analyst"
        ],

        HumanResources: [
            "HR Executive",
            "HR Generalist",
            "HR Business Partner",
            "Talent Acquisition Specialist",
            "Technical Recruiter",
            "Recruiter",
            "People Operations Associate",
            "Compensation & Benefits Analyst",
            "Learning & Development Specialist"
        ],

        Finance: [
            "Financial Analyst",
            "Investment Banking Analyst",
            "Equity Research Analyst",
            "Risk Analyst",
            "Credit Analyst",
            "Treasury Analyst",
            "Tax Consultant",
            "Accountant",
            "Auditor"
        ],

        SalesMarketing: [
            "Sales Executive",
            "Business Development Executive",
            "Business Development Manager",
            "Marketing Executive",
            "Digital Marketing Specialist",
            "SEO Specialist",
            "Content Marketing Specialist",
            "Social Media Manager",
            "Brand Manager"
        ],

        Consulting: [
            "Management Consultant",
            "Technology Consultant",
            "Business Consultant",
            "Strategy Consultant",
            "SAP Consultant",
            "ERP Consultant"
        ],

        Design: [
            "UI/UX Designer",
            "Graphic Designer",
            "Product Designer",
            "Motion Designer"
        ],

        Data: [
            "Data Analyst",
            "Business Intelligence Analyst",
            "Analytics Consultant",
            "Research Analyst"
        ],

        Operations: [
            "Operations Executive",
            "Supply Chain Analyst",
            "Logistics Coordinator",
            "Procurement Specialist",
            "Inventory Analyst"
        ],

        CustomerSupport: [
            "Customer Success Manager",
            "Customer Support Executive",
            "Technical Support Engineer",
            "Implementation Consultant"
        ],

        Legal: [
            "Legal Associate",
            "Compliance Officer",
            "Corporate Lawyer",
            "Legal Analyst"
        ],

        Healthcare: [
            "Medical Officer",
            "Pharmacist",
            "Clinical Research Associate",
            "Healthcare Administrator"
        ],

        Education: [
            "Teacher",
            "Professor",
            "Teaching Assistant",
            "Instructional Designer"
        ],

        Government: [
            "Civil Services",
            "Bank PO",
            "SSC CGL",
            "Railway Officer",
            "Defence Officer"
        ]
    };
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const resumeInputRef = useRef(null);
    const LoginToken = localStorage.getItem("token");
    const navigate = useNavigate();
    // console.log(LoginToken);
    useEffect(() => {
        fetch("http://localhost:5000/api/me", {
            headers: {
                Authorization: `Bearer ${LoginToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUser(data.user);
                } else {
                    console.log(data.message);
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/interview/dashboard", {
            headers: {
                Authorization: `Bearer ${LoginToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setDashboardData(data.data);
                } else {
                    console.log(data.message);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const viewResume = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/viewResume", {
                headers: {
                    Authorization: `Bearer ${LoginToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Unable to fetch resume");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            window.open(url, "_blank");
        } catch (error) {
            console.log(error);
        }
    };

    const uploadResume = async (e) => {
        try {
            const formData = new FormData();
            formData.append("resume", e.target.files[0]);
            const res = await fetch("http://localhost:5000/api/uploadResume", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${LoginToken}`
                },
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setUser(prev => ({
                    ...prev,
                    resume: data.resume
                }));

                console.log("Uploaded successfully!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const updateResume = async (e) => {
        try {
            const formData = new FormData();
            formData.append("resume", e.target.files[0]);
            console.log(e.target.files[0]);
            const response = await fetch('http://localhost:5000/api/updateResume', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${LoginToken}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUser(prev => ({
                    ...prev,
                    resume: data.resume
                }));

                console.log("Updated successfully!");
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading user content
            </div>
        );
    }
    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Unable to load user data,Try refreshing the page once
            </div>
        );
    }
    console.log(LoginToken);
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] via-white to-[#dbeafe]">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <section className="mb-8">
                        <p className="text-3xl sm:text-4xl font-bold text-gray-900">Welcome back, {user.name} 👋</p>
                        <p className="text-gray-600 mt-2 text-lg">Ready to ace your next interview?</p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        <div
                            onClick={() => navigate("/details")}
                            className="group bg-[#2563EB] text-white rounded-2xl p-7 shadow-md cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">Start Interview</p>
                                    <p className="text-blue-100 mt-1">Practice with an AI interviewer</p>
                                </div>
                                <div className="text-4xl group-hover:scale-110 transition-transform">🎯</div>
                            </div>
                            <div className="mt-6 inline-flex items-center gap-2 bg-white text-[#2563EB] px-5 py-2 rounded-lg font-semibold">Start now →</div>
                        </div>

                        <div className="bg-white rounded-2xl p-7 shadow-md border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">Resume</p>
                                    <p className="text-gray-500 text-sm mt-1">Keep your resume ready for interviews</p>
                                </div>
                                <div className="text-3xl">📄</div>
                            </div>
                            {user.resume ? (
                                <div className="flex items-center justify-between gap-4 bg-gray-100 rounded-xl px-4 py-3">
                                    <button onClick={viewResume} className="text-[#2563EB] font-medium truncate hover:underline cursor-pointer">
                                        {user.resume.split("-")[1]}
                                    </button>
                                    <button
                                        onClick={() => resumeInputRef.current.click()}
                                        className="text-sm font-semibold text-gray-600 hover:text-[#2563EB] cursor-pointer"
                                    >
                                        Update
                                    </button>
                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={updateResume}
                                    />
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-xl px-4 py-4 flex items-center justify-between">
                                    <p className="text-gray-500 text-sm">No resume uploaded yet</p>
                                    <button
                                        onClick={() => resumeInputRef.current.click()}
                                        className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer"
                                    >
                                        Upload
                                    </button>
                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={uploadResume}
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">Your Progress</p>
                                <p className="text-gray-500 text-sm mt-1">Track your interview performance</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                                <p className="text-sm text-gray-500">Total Interviews</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.totalInterviews ?? 0}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                                <p className="text-sm text-gray-500">Completed</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData?.completedInterviews ?? 0}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                                <p className="text-sm text-gray-500">Average Score</p>
                                <p className="text-3xl font-bold text-[#2563EB] mt-2">{dashboardData?.averageScore ?? 0}<span className="text-base text-gray-400">/100</span></p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
                                <p className="text-sm text-gray-500">Best Score</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{dashboardData?.bestScore ?? 0}<span className="text-base text-gray-400">/100</span></p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-2xl font-bold text-gray-900">Recent Interviews</p>
                                <p className="text-gray-500 text-sm mt-1">Review your latest attempts</p>
                            </div>
                            <button
                                onClick={() => navigate("/all-Interviews")}
                                className="hidden sm:block text-[#2563EB] font-semibold hover:underline cursor-pointer"
                            >
                                View all →
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <select
                                    className="bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    <option value="" hidden>Select a role</option>
                                    {Object.entries(roles).map((prop) => (
                                        <optgroup key={prop[0]} label={prop[0]}>
                                            {prop[1].map((role) => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>

                                <select
                                    className="bg-gray-50 text-gray-800 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                >
                                    <option value="" hidden>Select difficulty</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>

                                <button
                                    onClick={() => {
                                        setSelectedDifficulty("");
                                        setSelectedRole("");
                                    }}
                                    className="border border-gray-200 rounded-lg px-4 py-3 font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#2563EB] cursor-pointer"
                                >
                                    Clear filters
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="hidden md:grid grid-cols-5 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-500">
                                <div className="px-5 py-4">Role</div>
                                <div className="px-5 py-4">Difficulty</div>
                                <div className="px-5 py-4">Duration</div>
                                <div className="px-5 py-4">Score</div>
                                <div className="px-5 py-4">Date</div>
                            </div>

                            {dashboardData?.interviewList
                                .filter((interview) =>
                                    (!selectedRole || interview.role === selectedRole) &&
                                    (!selectedDifficulty || interview.difficulty === selectedDifficulty)
                                )
                                .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
                                .map((interview) => (
                                    <div key={interview._id} onClick={() => navigate(`/interview-review/${interview._id}`)} className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-0 px-5 py-4 md:px-0 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors">
                                        <div className="md:px-5 md:py-2">
                                            <p className="text-xs text-gray-400 md:hidden">Role</p>
                                            <p className="font-semibold text-gray-900">{interview.role}</p>
                                        </div>
                                        <div className="md:px-5 md:py-2">
                                            <p className="text-xs text-gray-400 md:hidden">Difficulty</p>
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${interview.difficulty === "Easy"
                                                    ? "bg-green-100 text-green-700"
                                                    : interview.difficulty === "Medium"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}>
                                                {interview.difficulty}
                                            </span>
                                        </div>
                                        <div className="md:px-5 md:py-2">
                                            <p className="text-xs text-gray-400 md:hidden">Duration</p>
                                            <p className="text-gray-600">{interview.duration} mins</p>
                                        </div>
                                        <div className="md:px-5 md:py-2">
                                            <p className="text-xs text-gray-400 md:hidden">Score</p>
                                            <p className="font-bold text-[#2563EB]">{interview.score == null ? "—" : `${interview.score}/100`}</p>
                                        </div>
                                        <div className="md:px-5 md:py-2">
                                            <p className="text-xs text-gray-400 md:hidden">Date</p>
                                            <p className="text-gray-600">
                                                {new Date(interview.createdAt).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                            {dashboardData?.interviewList.filter((interview) =>
                                (!selectedRole || interview.role === selectedRole) &&
                                (!selectedDifficulty || interview.difficulty === selectedDifficulty)
                            ).length === 0 && (
                                    <div className="py-10 text-center text-gray-500">
                                        No interviews found
                                    </div>
                                )}
                        </div>

                        <button onClick={() => navigate("/all-Interviews")} className="sm:hidden w-full mt-4 bg-white border border-gray-200 rounded-lg py-3 font-semibold text-[#2563EB] cursor-pointer">View All Interviews →</button>
                    </section>
                </main>
            </div>
        </>
    );

}