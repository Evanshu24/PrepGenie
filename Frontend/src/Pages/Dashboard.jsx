import { Link } from "react-router-dom";
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
                Unable to load user data
            </div>
        );
    }
    console.log(dashboardData);
    return (
        <>
            <div className="bg-gradient-to-l from-[#a2b5de] to-[#EFF6FF] min-h-screen">
                <main className="max-w-7xl mx-auto px-6 flex flex-col">
                    <div className="max-w-7xl pt-10 text-center">
                        <p className="my-2 text-3xl font-semibold">Welcome back, {user.name}</p>
                        <p className="mb-2 text-3xl font-semibold">Ready to ace your next interview?</p>
                    </div>

                    <div className="flex py-10 gap-10">
                        <aside className="flex flex-1 flex-col px-10 py-4 min-h-[20vh] bg-[#2563EB] text-white rounded-[20px] shadow-lg cursor-pointer items-center justify-center hover:bg-blue-500">
                            <p className="text-center">🎯Start Interview</p>
                            <p className="text-center">Practice with AI</p>
                        </aside>
                        <aside className="flex flex-1 flex-col px-10 py-4 min-h-[20vh] bg-green-600 hover:bg-black text-white font-semibold rounded-[20px] shadow-lg items-center justify-center">
                            <p className="text-center">Resume</p>
                            {user.resume &&
                                <div className="text-center flex flex-col justify-center">
                                    <button
                                        onClick={viewResume}
                                        className="underline cursor-pointer"
                                    >
                                        {user.resume.split("-")[1]}
                                    </button>
                                    <button
                                        onClick={() => resumeInputRef.current.click()}
                                        className="underline cursor-pointer"
                                    >
                                        Update
                                    </button>
                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            updateResume(e);
                                        }}
                                    />
                                </div>
                            }
                            {!user.resume &&
                                <div className="text-center flex flex-col">
                                    <p className="text-center">No resume uploaded yet</p>
                                    <button className="underline cursor-pointer" onClick={() => resumeInputRef.current.click()}>Upload here</button>
                                    <input
                                        ref={resumeInputRef}
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            uploadResume(e);
                                        }}
                                    />
                                </div>
                            }
                        </aside>
                    </div>

                    <div className="flex flex-col py-10 items-center justify-center">
                        <p className="text-2xl font-semibold mb-8">Your Progress</p>

                        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
                            <div className="flex-1 bg-white rounded-2xl shadow-md p-6 text-center border border-gray-200">
                                <p className="text-gray-600 font-medium">Total Interviews</p>
                                <p className="text-4xl font-bold text-[#2563EB] mt-3">{dashboardData?.totalInterviews}</p>
                            </div>

                            <div className="flex-1 bg-white rounded-2xl shadow-md p-6 text-center border border-gray-200">
                                <p className="text-gray-600 font-medium">Average Score</p>
                                <p className="text-4xl font-bold text-[#2563EB] mt-3">{dashboardData?.averageScore}/100</p>
                            </div>

                            <div className="flex-1 bg-white rounded-2xl shadow-md p-6 text-center border border-gray-200">
                                <p className="text-gray-600 font-medium">Best Score</p>
                                <p className="text-4xl font-bold text-[#2563EB] mt-3">{dashboardData?.bestScore}/100</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col py-10 items-center justify-center">
                        <p className="text-2xl font-semibold mb-8">Recent Interviews</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-5xl">
                            <aside className="relative">
                                <select className="bg-white text-gray-800 text-center border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 w-full" value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}>
                                    <option key="default" value="" className="text-center" hidden>Select a role</option>
                                    {Object.entries(roles).map((prop) => (
                                        <optgroup key={prop[0]} label={prop[0]}>
                                            {
                                                prop[1].map((role) => (
                                                    <option key={role} value={role}>{role}
                                                    </option>
                                                ))
                                            }
                                        </optgroup>
                                    ))}
                                </select>
                            </aside>
                            <aside className="relative">
                                <select className="bg-white text-gray-800 text-center border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 w-full mb-5" value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}>
                                    <option key="default" value="" className="text-center" hidden>Select difficulty</option>
                                    <option key="easy" value="Easy" className="text-center" >Easy</option>
                                    <option key="medium" value="Medium" className="text-center" >Medium</option>
                                    <option key="hard" value="Hard" className="text-center" >Hard</option>
                                </select>
                            </aside>
                        </div>
                        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">

                            <div className="grid grid-cols-5 bg-gray-100 font-semibold text-gray-700">
                                <div className="px-6 py-4">Role</div>
                                <div className="px-6 py-4">Difficulty</div>
                                <div className="px-6 py-4">Duration</div>
                                <div className="px-6 py-4">Score</div>
                                <div className="px-6 py-4">Date</div>
                            </div>
                            {
                                dashboardData?.interviewList.filter((interview) => (!selectedRole || interview.role === selectedRole) && (!selectedDifficulty || interview.difficulty === selectedDifficulty)).map((interview) => (

                                    <div className="grid grid-cols-5 border-t border-gray-200 cursor-pointer" key={interview._id}>
                                        <div className="px-6 py-4">{interview.role}</div>
                                        <div className="px-6 py-4">{interview.difficulty}</div>
                                        <div className="px-6 py-4">{interview.duration} mins</div>
                                        <div className="px-6 py-4 font-semibold text-[#2563EB]">{interview.score}/100</div>
                                        <div className="px-6 py-4">{new Date(interview.createdAt).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                dashboardData?.interviewList.filter((interview) => (!selectedRole || interview.role === selectedRole) && (!selectedDifficulty || interview.difficulty === selectedDifficulty)).length === 0 &&
                                <div className="flex w-full max-w-5xl items-center justify-center my-4">
                                    No data to display
                                </div>
                            }
                        </div>

                        <button className="mt-6 font-semibold hover:underline cursor-pointer">
                            View All Interviews →
                        </button>
                    </div>

                </main>

            </div>
        </>
    );
}