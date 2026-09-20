import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function InterviewReview(){
    const { interviewId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5000/api/interview/questions?interviewId=${interviewId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch questions");
                }

                setQuestions(data.allQuestions);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [interviewId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading interview...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="max-w-4xl mx-auto">

                <button
                    onClick={() => navigate("/all-interviews")}
                    className="mb-6 text-slate-600 hover:text-blue-600 transition hover:underline cursor-pointer"
                >
                    ← Back to Interviews
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Interview Review
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Review your questions, answers and AI evaluations.
                    </p>
                </div>

                {questions.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                        <p className="text-gray-500">
                            No questions found for this interview.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {questions.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white border border-gray-200 rounded-2xl p-6"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">Question {item.questionNumber}</h2>
                                    <span className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleString()}</span>
                                </div>

                                <div className="mb-5">
                                    <p className="text-sm font-medium text-gray-500 mb-2">Question</p>
                                    <p className="text-gray-900">{item.question}</p>
                                </div>

                                <div className="mb-5">
                                    <p className="text-sm font-medium text-gray-500 mb-2">Your Answer</p>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-wrap">{item.userAnswer || "No answer recorded."}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">AI Evaluation</p>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-wrap">{item.aiEvaluation || "Evaluation not available."}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
