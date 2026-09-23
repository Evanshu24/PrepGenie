import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function InterviewDetails() {

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
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [loading,setLoading]= useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error,setError] = useState("");
    const resumeInputRef = useRef(null);

    const LoginToken = localStorage.getItem("token");
    const navigate = useNavigate();

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
    const viewResume = async () => {
        try {

            const response = await fetch(
                "http://localhost:5000/api/viewResume",
                {
                    headers: {
                        Authorization: `Bearer ${LoginToken}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Unable to fetch resume");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            window.open(url, "_blank");

        } catch (error) {
            console.log(error);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const viewResume = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/viewResume", {
        headers: {
          Authorization: `Bearer ${LoginToken}`,
        },
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
      const file = e.target.files[0];

      if (!file) return;

      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("http://localhost:5000/api/uploadResume", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LoginToken}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();

        setUser((prev) => ({
          ...prev,
          resume: data.resume,
        }));

        console.log("Uploaded successfully!");
      }
    } catch (error) {
      console.log("Error uploading resume: ", error);
    }
  };

  const updateResume = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("http://localhost:5000/api/updateResume", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${LoginToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        setUser((prev) => ({
          ...prev,
          resume: data.resume,
        }));

        console.log("Updated successfully!");
      }
    } catch (error) {
      console.error("Error updating resume: ", error);
    }
  };

  const getResumeAnalysis = async () => {
    const response = await fetch("http://localhost:5000/api/resume/analyze", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LoginToken}`,
      },
    });

        } catch (error) {
            console.error("Error updating resume: ", error);
        }
    };

    const handleSubmit=async(e)=>{
        try{
            setError("");
            setIsSubmitting(true);
            const res=await fetch("http://localhost:5000/api/interview/startInterview",
                {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${LoginToken}`
                    },
                    body: JSON.stringify({
                        role: selectedRole,
                        difficulty: selectedDifficulty,
                        duration: selectedDuration,
                        keywords: ["Python","APIs","Cron"] //this is right now temporary, later I will use C++ parser to extract these from resume
                    })
                });
            
            const data = await res.json();
            if(!res.ok){
                setError(data.message || "Unable to start interview");
                return ;
            }
            localStorage.setItem("threadId",data.threadId);
            localStorage.setItem("interviewId",data.interviewId);
            localStorage.setItem("questionId",data.questionId);
            localStorage.setItem("question",JSON.stringify(data.question));
            navigate('/interview');

        }catch(error){
            console.log("Error submit button: ",error);
        }finally{
            setIsSubmitting(false);
        }
    };

    if (!response.ok) {
      throw new Error(data.message || "Unable to analyze resume");
    }

    return data;
  };

  const handleSubmit = async (e) => {
    try {
      setError("");
      setStartingInterview(true);

      if (!selectedRole) {
        setError("Please select a role");
        setStartingInterview(false);
        return;
      }

      if (!selectedDifficulty) {
        setError("Please select a difficulty");
        setStartingInterview(false);
        return;
      }

      if (!selectedDuration) {
        setError("Please select a duration");
        setStartingInterview(false);
        return;
      }

      if (!user?.parsedResume) {
        setError("Please upload a resume first");
        setStartingInterview(false);
        return;
      }

      const analysis = await getResumeAnalysis();

      const role = selectedRole || analysis.role;

      const keywords =
        analysis.keywords && analysis.keywords.length > 0
          ? analysis.keywords
          : analysis.allKeywords;

      if (!role) {
        setError("Unable to determine a suitable role from your resume");
        setStartingInterview(false);
        return;
      }

      if (!keywords || keywords.length === 0) {
        setError("Unable to determine interview keywords");
        setStartingInterview(false);
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/interview/startInterview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LoginToken}`,
          },
          body: JSON.stringify({
            role,
            difficulty: selectedDifficulty,
            duration: selectedDuration,
            keywords,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to start interview");
        setStartingInterview(false);
        return;
      }

      localStorage.setItem("threadId", data.threadId);

      localStorage.setItem("interviewId", data.interviewId);

      localStorage.setItem("questionId", data.questionId);

      localStorage.setItem("question", JSON.stringify(data.question));

      navigate("/interview");
    } catch (error) {
      console.log("Error submit button: ", error);

      setError(error.message || "Something went wrong");
    } finally {
      setStartingInterview(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition cursor-pointer"
          >
            <span className="text-xl">←</span>
            <span>Back to Dashboard</span>
          </button>
        </div>

        <section className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Start Your Interview
          </h1>

          <p className="text-lg text-slate-500">
            Configure your interview before you begin
          </p>
        </section>

        <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Interview Details
            </h2>

            <p className="text-slate-500">
              Select the role, difficulty and duration for your interview.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Role
              </label>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-3 w-full outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="" hidden>
                  Select a role
                </option>

                {Object.entries(roles).map(([category, roleList]) => (
                  <optgroup key={category} label={category}>
                    {roleList.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Difficulty
              </label>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-3 w-full outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="" hidden>
                  Select difficulty
                </option>

                <option value="Easy">Easy</option>

                <option value="Medium">Medium</option>

                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration
              </label>

              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-3 w-full outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
              >
                <option value="" hidden>
                  Select duration
                </option>

                <option value="15">15 minutes</option>

                <option value="30">30 minutes</option>

                <option value="45">45 minutes</option>

                <option value="60">60 minutes</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-200 my-8" />

          <div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-slate-900">Resume</h3>

              <p className="text-sm text-slate-500 mt-1">
                Your resume will be used during the interview.
              </p>
            </div>

            {user?.resume && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-red-50 text-red-500 text-xl">
                    📄
                  </div>

                  <div>
                    <button
                      onClick={viewResume}
                      className="font-medium text-slate-800 hover:text-blue-600 transition cursor-pointer"
                    >
                      {user?.resume.split("-")[1]}
                    </button>

                    <p className="text-sm text-slate-500 mt-1">
                      Uploaded resume
                    </p>
                  </div>
                </div>

                <section className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">Start Your Interview</h1>
                    <p className="text-lg text-slate-500">Configure your interview before you begin</p>
                </section>

                <section className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-10">

                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-slate-900 mb-2">Interview Details</h2>
                        <p className="text-slate-500">Select the role, difficulty and duration for your interview.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Target Role</label>
                            <select
                                value={selectedRole}
                                disabled={isSubmitting}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-3 w-full outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                            >
                                <option value="" hidden>Select a role</option>
                                {Object.entries(roles).map(([category, roleList]) => (
                                    <optgroup key={category} label={category}>
                                        {roleList.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                            <select
                                value={selectedDifficulty}
                                disabled={isSubmitting}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-3 w-full outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                            >
                                <option value="" hidden>Select difficulty</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                            <select
                                value={selectedDuration}
                                disabled={isSubmitting}
                                onChange={(e) => setSelectedDuration(e.target.value)}
                                className="bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-3 w-full outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                            >
                                <option value="" hidden>Select duration</option>
                                <option value="15">15 minutes</option>
                                <option value="30">30 minutes</option>
                                <option value="45">45 minutes</option>
                                <option value="60">60 minutes</option>
                            </select>
                        </div>

                    </div>
                    
                    <div className="border-t border-slate-200 my-8" />

                    <div>

                        <div className="mb-3">
                            <h3 className="text-lg font-semibold text-slate-900">Resume</h3>
                            <p className="text-sm text-slate-500 mt-1">Your resume will be used during the interview.</p>
                        </div>
                        {user?.resume && (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-red-50 text-red-500 text-xl">
                                        📄
                                    </div>
                                    <div>
                                        <button onClick={viewResume} disabled={isSubmitting} className="font-medium text-slate-800 hover:text-blue-600 transition cursor-pointer">
                                            {user?.resume.split("-")[1]}
                                        </button>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Uploaded resume
                                        </p>
                                    </div>
                                </div>

                                <button onClick={() => resumeInputRef.current.click()} disabled={isSubmitting} className="text-blue-600 font-medium hover:text-blue-800 transition cursor-pointer">
                                    Update
                                </button>

                                <input ref={resumeInputRef} type="file" accept=".pdf" className="hidden" onChange={updateResume} />
                            </div>
                        )}

                        {!user?.resume && (
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                                <div className="text-3xl mb-3">📄</div>
                                <p className="font-medium text-slate-700">No resume uploaded</p>
                                <p className="text-sm text-slate-500 mt-1 mb-4">Upload your resume to continue</p>
                                <button onClick={() => resumeInputRef.current.click()} className="px-5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium hover:border-blue-500 hover:text-blue-600 transition cursor-pointer">
                                    Upload Resume
                                </button>
                                <input ref={resumeInputRef} type="file" accept=".pdf" className="hidden" onChange={uploadResume} />
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-200 my-8" />
                        <div className="flex justify-end">
                                <button className={`w-full sm:w-auto min-w-[220px] px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${isSubmitting? "cursor-not-allowed opacity-50" : "cursor-pointer"}`} onClick={handleSubmit} disabled={isSubmitting}>Start Interview →</button>
                        </div>
                    {error && <div className="text-red-500 text-sm text-center mt-4 mb-0">{error}</div>}
                </section>
            </main>
        </div>
    );
}
