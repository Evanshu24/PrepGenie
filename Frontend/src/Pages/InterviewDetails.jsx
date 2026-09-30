import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function InterviewDetails() {
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const resumeInputRef = useRef(null);

  const LoginToken = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await fetch("/api/resume/roles");

        const data = await response.json();
        setRoles(data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    getRoles();
  }, []);

  useEffect(() => {
    fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${LoginToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        } else {
          // console.log(data.message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const viewResume = async () => {
    try {
      const response = await fetch("/api/viewResume", {
        headers: {
          Authorization: `Bearer ${LoginToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to fetch resume");
      }

      const data = await response.json();
      window.open(data.resume, "_blank");
    } catch (error) {
      console.log(error);
    }
  };

  const uploadResume = async (e) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", e.target.files[0]);
      const res = await fetch("/api/uploadResume", {
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
          resumeName: data.resumeName.split(".")[0],
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const updateResume = async (e) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", e.target.files[0]);
      const response = await fetch("/api/updateResume", {
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
          resumeName: data.resumeName.split(".")[0],
        }));
      }
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setUploading(false);
    }
  };

  const getResumeAnalysis = async () => {
    try {
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LoginToken}`,
        },
        body: JSON.stringify({
          role: selectedRole,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze resume");
      }

      return data;
    } catch (error) {
      console.log("Error getting analysis of resume:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    try {
      setError("");
      setIsSubmitting(true);
      const analysis = await getResumeAnalysis();

      const role = selectedRole || analysis.role;

      const keywords =
        analysis.keywords &&
        (analysis.keywords.length > 0
          ? analysis.keywords
          : analysis.allKeywords);

      const res = await fetch(
        "/api/interview/startInterview",
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
      setIsSubmitting(false);
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
                className="bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-3 w-full outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <option value="" hidden>
                  Select a role
                </option>

                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
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
                className="bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-3 w-full outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer disabled:cursor-not-allowed"
                disabled={isSubmitting}
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
                className="bg-white text-slate-800 border border-slate-300 rounded-lg px-4 py-3 w-full outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 cursor-pointer disabled:cursor-not-allowed"
                disabled={isSubmitting}
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
                      {user?.resumeName}
                    </button>

                    <p className="text-sm text-slate-500 mt-1">
                      Uploaded resume
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => resumeInputRef.current.click()}
                  disabled={isSubmitting || uploading}
                  className="text-blue-600 font-medium hover:text-blue-800 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update"
                  )}
                </button>

                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={updateResume}
                />
              </div>
            )}
            {!user?.resume && (
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                <div className="text-3xl mb-3">📄</div>
                <p className="font-medium text-slate-700">No resume uploaded</p>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  Upload your resume to continue
                </p>
                <button
                  onClick={() => resumeInputRef.current.click()}
                  className="px-5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 font-medium hover:border-blue-500 hover:text-blue-600 transition cursor-pointer disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Upload Resume"
                  )}
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

          <div className="border-t border-slate-200 my-8" />
          <div className="flex justify-end">
            <button
              className={`w-full sm:w-auto min-w-[220px] px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${isSubmitting || uploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              onClick={handleSubmit}
              disabled={isSubmitting || uploading}
            >
              Start Interview →
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center mt-4 mb-0">
              {error}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
