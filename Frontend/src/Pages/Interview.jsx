import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Interview() {
    const [interview, setInterview] = useState({ threadId: "", interviewId: "", questionId: "", question: null });
    const [startButton, setStartButton] = useState(true);
    const [stream, setStream] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const recorderRef = useRef(null);
    const audioRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const chunksRef = useRef([]);
    const audioChunksRef = useRef([]);
    const recordedRef = useRef(null);
    const isRetakingRef = useRef(false);
    const recordedUrlRef = useRef(null);
    const hasCheckedInterview = useRef(false);
    const LoginToken = localStorage.getItem("token");
    const navigate = useNavigate();
    
    const startCamera = async () => {
        try {
            setStream(await navigator.mediaDevices.getUserMedia({ video: true, audio: true }));
        } catch (error) {
            console.log("Failed to access camera/microphone: ", error);
        }
    }

    useEffect(() => {
        if (hasCheckedInterview.current) return;
        hasCheckedInterview.current = true;
        const threadId = localStorage.getItem("threadId");
        const interviewId = localStorage.getItem("interviewId");
        const questionId = localStorage.getItem("questionId");
        const question = localStorage.getItem("question");
        
        if(!threadId || !interviewId || !questionId || !question) {
            alert("Invalid interview session. Please start a new interview.");
            navigate("/");
            return;
        }
        setInterview({ threadId, interviewId, questionId, question: question ? JSON.parse(question) : null });
        startCamera();
    }, []);


    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
        if (!stream) {
            return;
        }

        recorderRef.current = new MediaRecorder(stream, { mimeType: "video/webm" });
        // console.log(`mimetype is this->${recorderRef.current.mimeType}`);
        // console.log(MediaRecorder.isTypeSupported("video/webm"));

        recorderRef.current.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                setRecordedChunks(prev => [...prev, e.data]);
                chunksRef.current.push(e.data);
            }
        }
        recorderRef.current.onstop = (e) => {
            if (!isRetakingRef.current) {
                const blob = new Blob(chunksRef.current, { type: recorderRef.current.mimeType });
                setRecordedBlob(blob);
            }
        }

        const audioTracks = stream.getAudioTracks();

        if (audioTracks.length > 0) {
            const audioStream = new MediaStream(audioTracks);

            let audioMimeType = "";

            if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
                audioMimeType = "audio/webm;codecs=opus";
            } else if (MediaRecorder.isTypeSupported("audio/webm")) {
                audioMimeType = "audio/webm";
            }

            const audioRecorder = audioMimeType ? new MediaRecorder(audioStream, { mimeType: audioMimeType }) : new MediaRecorder(audioStream);

            audioRecorderRef.current = audioRecorder;

            audioRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            audioRecorder.onstop = () => {
                if (!isRetakingRef.current) {
                    const blob = new Blob(audioChunksRef.current, {
                        type: audioRecorder.mimeType
                    });

                    setAudioBlob(blob);

                    console.log("Audio Blob created:", blob, "Size:", blob.size, "Type:", blob.type);
                }
            };
        }
        return () => {
            if (recorderRef.current?.state === "recording") {
                recorderRef.current.stop();
            }

            if (audioRecorderRef.current?.state === "recording") {
                audioRecorderRef.current.stop();
            }
        };
    }, [stream]);

    useEffect(() => {
        if (!recordedBlob || !recordedRef.current) {
            return;
        }

        const url = URL.createObjectURL(recordedBlob);

        recordedUrlRef.current = url;
        recordedRef.current.src = url;

        return () => {
            URL.revokeObjectURL(url);
            recordedUrlRef.current = null;
        };
    }, [recordedBlob]);

    useEffect(() => {
        if (startButton) {
            return;
        }

        const interval = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [startButton]);

    const handleRecordingBtn = () => {
        isRetakingRef.current = false;
        if (recordedBlob) {
            return;
        }
        if (startButton) {
            chunksRef.current = [];
            audioChunksRef.current = [];
            setRecordedChunks([]);
            setRecordedBlob(null);
            setAudioBlob(null);
            recorderRef.current?.start();
            audioRecorderRef.current?.start();
            setRecordingTime(0);
        }
        else {
            recorderRef.current?.stop();
            audioRecorderRef.current?.stop();
        }
        setStartButton(!startButton);
    };

    const handleSubmit = async () => {
        try {
            if (!audioBlob) {
                setError("Please record your answer first");
                return;
            }
            setError("");
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("audio", audioBlob);
            formData.append("threadId", interview.threadId);
            formData.append("questionId", interview.questionId);
            formData.append("interviewId", interview.interviewId);
            console.log("sending data now in api");
            const res = await fetch("http://localhost:5000/api/interview/respondInterview",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${LoginToken}`
                    },
                    body: formData
                }
            );
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Please retry again");
                return;
            }

            if (data.isInterviewEnded) {
                alert("Interview successfully completed");
                localStorage.removeItem("threadId");
                localStorage.removeItem("question");
                localStorage.removeItem("interviewId");
                localStorage.removeItem("questionId");
                stream?.getTracks().forEach(track => track.stop());
                setStream(null);
                navigate("/");
                return;
            }
            setInterview(prev => ({ ...prev, questionId: data.questionId, question: { question: data.question } }));
            localStorage.setItem("question",JSON.stringify({ question: data.question }));
            localStorage.setItem("questionId", data.questionId);
            handleRetake();
        } catch (error) {
            console.log("Error while submitting: ", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleRetake = async () => {
        console.log("daba dia mc");
        isRetakingRef.current = true;

        // Stop the current recording if it is still running
        if (recorderRef.current?.state === "recording") {
            recorderRef.current.stop();
        }


        // Stop current audio recording
        if (audioRecorderRef.current?.state === "recording") {
            audioRecorderRef.current.stop();
        }

        stream?.getTracks().forEach(track => track.stop()); // Stop all tracks of camera and microphone

        // Clear previous recording
        setRecordedBlob(null);
        setAudioBlob(null);
        chunksRef.current = [];
        audioChunksRef.current = [];
        setRecordedChunks([]);

        setStartButton(true); // Reset recording state

        recorderRef.current = null;
        audioRecorderRef.current = null;
        setStream(null);

        setRecordingTime(0); // restart the recording time

        // Start a fresh camera session
        startCamera();
    };

    const handleLeaveInterview = async () =>{
        try{
            if (!window.confirm("Are you sure you want to leave this interview?")) {
                return;
            }
            setIsLeaving(true);
            const response = await fetch("http://localhost:5000/api/interview/abandonInterview",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${LoginToken}`
                    },
                    body: JSON.stringify(
                        {interviewId: interview.interviewId}
                    )
                }
            )
            const data = await response.json();
            if(!response.ok){
                setError(data.message || "Unable to leave interview")
                return ;
            }
            localStorage.removeItem("threadId");
            localStorage.removeItem("question");
            localStorage.removeItem("interviewId");
            localStorage.removeItem("questionId");
            stream?.getTracks().forEach(track => track.stop());
            setStream(null);
            navigate("/");
        }catch(error){
            console.log("Error leaving interview page",error);
        }finally{
            setIsLeaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between">
                <div className="text-xl font-bold">PrepGenie</div>
                <div className="text-xl">
                    <button className={`px-4 py-2 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10 transition ${isSubmitting || isLeaving? "cursor-not-allowed opacity-50" : "cursor-pointer"}`} onClick={handleLeaveInterview} disabled={isSubmitting || isLeaving}>{isLeaving? "Leaving..." : "Leave Interview"}</button>
                </div>
            </header>
            <main className="flex flex-col md:flex-row max-w-[1600px] mx-auto px-6 py-10 gap-10">
                <div className="flex flex-1 w-full items-center justify-center px-10 py-10">
                    <section className="text-center mb-10">

                        <h1 className="text-2xl font-semibold mb-6">AI Interviewer</h1>
                        <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl shadow-lg">🤖</div>

                        <div className="mt-5 flex justify-center items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>

                            <span className="text-slate-400 ml-2 text-sm">AI is speaking</span>
                        </div>
                        <div className="mt-7 bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-xl">

                            <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Current Question</p>

                            <h2 className="text-xl md:text-2xl font-medium leading-relaxed">{interview.question?.question || "Loading question..."}</h2>

                        </div>

                    </section>

                </div>

                <div className="flex flex-col flex-1 w-full items-center justify-center px-10 py-10">
                    <div className="aspect-video w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative">

                        {!stream && <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 10l4.5-3v10L15 14m-9 4h9a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <p className="text-slate-500">Camera preview will appear here</p>
                        </div>
                        }
                        {!recordedBlob && <div>
                            <video ref={videoRef} muted autoPlay playsInline className="w-full h-full object-cover">Your browser does not support the video tag.</video>
                        </div>
                        }
                        {recordedBlob && (
                            <div className="w-full h-full flex items-center justify-center">
                                <video
                                    ref={recordedRef}
                                    controls
                                    controlsList="nodownload"
                                    className="w-full h-full object-contain"
                                >
                                    Recorded content is here
                                </video>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-6">

                        <div className="flex justify-center items-center gap-2 text-sm">
                            <span className={`w-3 h-3 rounded-full bg-red-500 ${!startButton ? "animate-pulse" : ""}`}></span>
                            <span className="text-slate-300 text-xl">Recording {String(Math.floor(recordingTime / 60)).padStart(2, "0")}:
                                {String(recordingTime % 60).padStart(2, "0")}</span>
                        </div>

                    </div>

                    <div className="flex flex-col items-center gap-4 mt-6">

                        <button className={`px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-semibold transition ${isSubmitting || isLeaving? "cursor-not-allowed opacity-50": "cursor-pointer"}`} onClick={handleRecordingBtn} disabled={isSubmitting || isLeaving}>{startButton ? "Start Recording" : "End Recording"}</button>

                        <div className="flex gap-4">
                            <button className={`px-6 py-3 rounded-xl border border-slate-700 transition ${isSubmitting || isLeaving? "cursor-not-allowed opacity-50": "hover:bg-slate-800 cursor-pointer"}`} onClick={handleRetake} disabled={isSubmitting || isLeaving}>Retake</button>
                            <button className={`px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition ${isSubmitting || isLeaving ? "cursor-not-allowed opacity-50": "cursor-pointer" }`} onClick={handleSubmit} disabled={isSubmitting || isLeaving}>{isSubmitting ? "Submitting..." : "Submit Answer"}</button>
                        </div>
                    </div>

                    {error &&
                        <div className="py-4 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    }

                </div>

            </main>

        </div>
    );
}