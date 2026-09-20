import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function allInterviews() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const LoginToken = localStorage.getItem("token");
    const [interviews, setInterviews] = useState([]);
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

    useEffect(() => {
        fetch("http://localhost:5000/api/interview/dashboard", {
            headers: {
                Authorization: `Bearer ${LoginToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setInterviews(data.data.interviewList)
                } else {
                    console.log(data.message);
                }
            })
            .catch(err => console.log(err));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading interviews...</p>
            </div>
        );
    }
    return (
        <>
            <div className="min-h-screen bg-gray-50 px-6 py-10">
                <div className="max-w-6xl mx-auto">
                    <button
                    onClick={() => navigate("/")}
                    className="mb-6 text-slate-600 hover:text-blue-600 transition hover:underline cursor-pointer"
                >
                    ← Back to Home Page
                </button>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            All Interviews
                        </h1>
                        <p className="text-gray-500 mt-2">
                            View your previous interview attempts and results.
                        </p>
                    </div>

                    {interviews.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                            <h2 className="text-xl font-semibold text-gray-800">No interviews yet</h2>
                            <p className="text-gray-500 mt-2">Start your first interview to see it here.</p>
                        </div>) : 
                        (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {interviews.map((interview) => (
                                <div key={interview._id} onClick={() =>navigate(`/interview-review/${interview._id}`)}
                                    className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition"
                                >
                                    <div className="flex justify-between items-start mb-5">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">{interview.role}</h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {interview.difficulty} ·{" "}
                                                {interview.duration} min
                                            </p>
                                        </div>

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${interview.status === "completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : interview.status === "abandoned"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {interview.status}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Score
                                            </p>

                                            <p className={`text-2xl font-bold ${interview.status === "completed" ? "text-blue-600": "text-red-500 "}`}>
                                                {interview.status === "completed"
                                                    ? `${interview.score}/100`
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">
                                                Date
                                            </p>

                                            <p className="text-sm font-medium text-gray-700">
                                                {new Date(
                                                    interview.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
};