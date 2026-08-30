import { motion } from "framer-motion";
import { object } from "framer-motion/client";
import { FaUpload } from "react-icons/fa";

export default function Home() {
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
    return (
        <>
            <div className="bg-gradient-to-l from-[#a2b5de] to-[#EFF6FF] min-h-screen">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 flex flex-col lg:flex-row items-center gap-16">

                    <aside className="flex-[4] max-w-[700px]">
                        <h1 className="text-5xl lg:text-6xl font-bold font-serif leading-tight">
                            Your Resume. <br />Your Dream Role.
                            <br />
                            Your AI Interview Coach.
                        </h1>

                        <p className="mt-6 text-xl text-gray-700 leading-8">
                            Introducing PrepGenie — the AI platform that creates personalized
                            mock interviews from your resume, helping you prepare smarter and
                            land your dream job.
                        </p>
                        <div className="mt-8 flex flex-col md:flex-row gap-4">
                            <button className="flex flex-1 justify-center bg-green-600 hover:bg-black cursor-pointer text-white font-semibold px-8 py-3 rounded-lg transition">
                                <FaUpload className="mr-2 hidden md:block" size={20}/>
                                Upload your resume
                            </button>
                            <select className="flex-2 bg-white text-gray-800 text-center border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500">
                                <option key="default" value="" className="text-center" hidden>Select a role</option>
                                {Object.entries(roles).map((prop)=>(
                                    <optgroup key={prop[0]} label={prop[0]}>
                                        {
                                            prop[1].map((role)=>(
                                                <option key={role} value={role}>{role}
                                                </option>
                                            ))
                                        }
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-center">
                            <button className="flex-1 w-36 text-white rounded py-3 bg-blue-500 rounded-lg transition hover:bg-blue-600 cursor-pointer mt-5 md:mt-10">Start Interview</button>
                        </div>
                    </aside>

                    <main className="relative flex-2 h-[500px] overflow-hidden">

                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute left-32 top-20 rotate-[-6deg]"
                        >
                            <img
                                src="/Logo.png"
                                alt=""
                                className="w-[420px] rounded-3xl shadow-[0_35px_80px_rgba(0,0,0,0.18)]"
                            />
                        </motion.div>

                        {/* Profile */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute left-[340px] top-2"
                        >
                            <img
                                src="/Logo.png"
                                alt=""
                                className="w-36 h-36 rounded-full border-8 border-white object-cover shadow-2xl"
                            />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="absolute right-24 bottom-20"
                        >
                            <img
                                src="/Logo.png"
                                alt=""
                                className="w-[320px] rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.15)]"
                            />
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute left-12 bottom-14 rotate-[-5deg]"
                        >
                            <img
                                src="/Logo.png"
                                alt=""
                                className="w-[220px] rounded-3xl shadow-xl"
                            />
                        </motion.div>

                    </main>

                </div>
            </div>
        </>
    )
}