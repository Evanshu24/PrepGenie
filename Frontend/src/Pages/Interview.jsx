import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Interview() {
  const [interview, setInterview] = useState({
    threadId: "",
    interviewId: "",
    questionId: "",
    question: null,
  });
  const [startButton, setStartButton] = useState(true);
  const [stream, setStream] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [aiTransition, setAiTransition] = useState(false);
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
      setStream(
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true }),
      );
    } catch (error) {
      console.log("Failed to access camera/microphone: ", error);
    }
  };

  useEffect(() => {
    if (hasCheckedInterview.current) return;
    hasCheckedInterview.current = true;
    const threadId = localStorage.getItem("threadId");
    const interviewId = localStorage.getItem("interviewId");
    const questionId = localStorage.getItem("questionId");
    const question = localStorage.getItem("question");

    if (!threadId || !interviewId || !questionId || !question) {
      alert("Invalid interview session. Please start a new interview.");
      navigate("/");
      return;
    }
    setInterview({
      threadId,
      interviewId,
      questionId,
      question: question ? JSON.parse(question) : null,
    });
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

    recorderRef.current.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    recorderRef.current.onstop = (e) => {
      if (!isRetakingRef.current) {
        const blob = new Blob(chunksRef.current, {
          type: recorderRef.current.mimeType,
        });
        setRecordedBlob(blob);
      }
    };

    const audioTracks = stream.getAudioTracks();

    if (audioTracks.length > 0) {
      const audioStream = new MediaStream(audioTracks);

      let audioMimeType = "";

      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        audioMimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        audioMimeType = "audio/webm";
      }

      const audioRecorder = audioMimeType
        ? new MediaRecorder(audioStream, { mimeType: audioMimeType })
        : new MediaRecorder(audioStream);

      audioRecorderRef.current = audioRecorder;

      audioRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      audioRecorder.onstop = () => {
        if (!isRetakingRef.current) {
          const blob = new Blob(audioChunksRef.current, {
            type: audioRecorder.mimeType,
          });

          setAudioBlob(blob);

          // console.log("Audio Blob created:", blob, "Size:", blob.size, "Type:", blob.type);
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
      setRecordingTime((prev) => prev + 1);
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
      setRecordedBlob(null);
      setAudioBlob(null);
      recorderRef.current?.start();
      audioRecorderRef.current?.start();
      setRecordingTime(0);
    } else {
      recorderRef.current?.stop();
      audioRecorderRef.current?.stop();
    }
    setStartButton(!startButton);
  };

  useEffect(() => {
    if (!interview.interviewId || !interview.threadId) {
      return;
    }

    const sendHeartbeat = async () => {
      try {
        const response = await fetch("/api/interview/heartbeat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LoginToken}`,
          },
          body: JSON.stringify({
            interviewId: interview.interviewId,
            threadId: interview.threadId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          // console.log("Heartbeat failed:", data.message);
        }
      } catch (error) {
        // console.log("Heartbeat error:", error);
      }
    };

    sendHeartbeat();

    const interval = setInterval(sendHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [interview.interviewId, interview.threadId]);

  useEffect(() => {
    if (!interview?.question) return;

    window.speechSynthesis.cancel();
    setAiTransition(true);
    const utterance = new SpeechSynthesisUtterance(interview.question.question);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setAiTransition(true);
    };

    utterance.onend = () => {
      setAiTransition(false);
    };

    utterance.onerror = () => {
      setAiTransition(false);
    };
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
      setAiTransition(false);
    };
  }, [interview?.question]);

  const handleSubmit = async () => {
    try {
      if (!audioBlob) {
        setError("Please record your answer first");
        return;
      }
      setError("");
      setIsSubmitting(true);
      setAiTransition(true);
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("threadId", interview.threadId);
      formData.append("questionId", interview.questionId);
      formData.append("interviewId", interview.interviewId);
      const res = await fetch("/api/interview/respondInterview", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LoginToken}`,
        },
        body: formData,
      });
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
        stream?.getTracks().forEach((track) => track.stop());
        setStream(null);

        navigate("/");
        return;
      }
      setInterview((prev) => ({
        ...prev,
        questionId: data.questionId,
        question: { question: data.question },
      }));
      localStorage.setItem(
        "question",
        JSON.stringify({ question: data.question }),
      );
      localStorage.setItem("questionId", data.questionId);
      handleRetake();
    } catch (error) {
      console.log("Error while submitting: ", error);
    } finally {
      setIsSubmitting(false);
      setAiTransition(false);
    }
  };

  const handleRetake = async () => {
    isRetakingRef.current = true;

    // Stop the current recording if it is still running
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }

    // Stop current audio recording
    if (audioRecorderRef.current?.state === "recording") {
      audioRecorderRef.current.stop();
    }

    stream?.getTracks().forEach((track) => track.stop()); // Stop all tracks of camera and microphone

    // Clear previous recording
    setRecordedBlob(null);
    setAudioBlob(null);
    chunksRef.current = [];
    audioChunksRef.current = [];

    setStartButton(true); // Reset recording state

    recorderRef.current = null;
    audioRecorderRef.current = null;
    setStream(null);

    setRecordingTime(0); // restart the recording time

    // Start a fresh camera session
    startCamera();
  };

  const handleLeaveInterview = async () => {
    try {
      if (!window.confirm("Are you sure you want to leave this interview?")) {
        return;
      }
      setIsLeaving(true);
      const response = await fetch("/api/interview/abandonInterview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LoginToken}`,
        },
        body: JSON.stringify({ interviewId: interview.interviewId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Unable to leave interview");
        return;
      }
      localStorage.removeItem("threadId");
      localStorage.removeItem("question");
      localStorage.removeItem("interviewId");
      localStorage.removeItem("questionId");
      stream?.getTracks().forEach((track) => track.stop());
      setStream(null);
      navigate("/");
    } catch (error) {
      console.log("Error leaving interview page", error);
    } finally {
      setIsLeaving(false);
    }
  };

  const busy = isSubmitting || isLeaving;
  const recording = !startButton;
  const off = "opacity-40 cursor-not-allowed";
  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B75] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E9EFF1]";

  return (
    <div className="h-screen flex flex-col bg-[#E9EFF1] text-[#10242B]">
      {/* Header */}
      <header className="h-14 shrink-0 px-5 md:px-8 flex items-center justify-between">
        <span className="font-bold tracking-tight">PrepPilot</span>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#10242B] border border-[#C9D6DA] bg-white/60 hover:bg-white hover:border-[#E4573D] hover:text-[#E4573D] transition ${focus} ${
            busy ? off : "cursor-pointer"
          }`}
          onClick={handleLeaveInterview}
          disabled={busy}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12H3m0 0l3.5-3.5M3 12l3.5 3.5M10 5h8a2 2 0 012 2v10a2 2 0 01-2 2h-8"
            />
          </svg>
          {isLeaving ? "Leaving..." : "Leave interview"}
        </button>
      </header>

      <main className="flex-1 min-h-0 flex flex-col items-center gap-5 px-5 md:px-8 pb-5 md:pb-6">
        {/* Question */}
        <section className="w-full max-w-4xl shrink-0">
          <div className="flex items-center gap-2 text-sm text-[#0F6B75] mb-2">
            <span className="flex items-center gap-1" aria-hidden="true">
              {[0, 0.15, 0.3].map((d) => (
                <span
                  key={d}
                  style={{ animationDelay: `${d}s` }}
                  className={`w-1.5 h-1.5 rounded-full bg-[#0F6B75] motion-reduce:animate-none ${
                    aiTransition
                      ? "animate-bounce"
                      : recording
                        ? "animate-pulse"
                        : ""
                  }`}
                />
              ))}
            </span>
            Your interviewer asks
          </div>
          <h1 className="text-xl md:text-3xl font-semibold leading-snug tracking-tight">
            {interview.question?.question || "Loading question..."}
          </h1>
        </section>

        {/* Camera */}
        <div className="flex-1 min-h-0 w-full flex justify-center">
          <div
            className={`relative h-full aspect-video max-w-full rounded-3xl overflow-hidden bg-[#0F1E24] shadow-xl shadow-[#10242B]/20 ${
              recording ? "ring-4 ring-[#E4573D]" : "ring-1 ring-[#10242B]/10"
            }`}
          >
            {!stream && !recordedBlob && (
              <div className="absolute inset-0 grid place-items-center text-center px-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-white/10 grid place-items-center mb-3">
                    <svg
                      className="w-7 h-7 text-white/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M15 10l4.5-3v10L15 14m-9 4h9a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-white/60 text-sm">
                    Allow camera access to see yourself here
                  </p>
                </div>
              </div>
            )}

            {!recordedBlob && (
              <video
                ref={videoRef}
                muted
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            )}

            {recordedBlob && (
              <video
                ref={recordedRef}
                controls
                controlsList="nodownload"
                className="absolute inset-0 w-full h-full object-contain bg-black"
              >
                Recorded content is here
              </video>
            )}

            <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/50 backdrop-blur px-3 py-1.5 text-sm text-white">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  recording
                    ? "bg-[#E4573D] animate-pulse motion-reduce:animate-none"
                    : "bg-white/40"
                }`}
              />
              <span className="tabular-nums">
                {String(Math.floor(recordingTime / 60)).padStart(2, "0")}:
                {String(recordingTime % 60).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="shrink-0 rounded-xl bg-[#E4573D]/10 border border-[#E4573D]/30 text-[#B63A23] text-sm px-4 py-2.5"
          >
            {error}
          </div>
        )}

        {/* Controls: retake · record · submit */}
        <div className="shrink-0 w-full max-w-4xl grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex justify-start">
            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium bg-white border border-[#C9D6DA] hover:border-[#0F6B75] transition ${focus} ${
                busy ? off : "cursor-pointer"
              }`}
              onClick={handleRetake}
              disabled={busy}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h5M20 20v-5h-5M5.5 15A7 7 0 0018.4 17M18.5 9A7 7 0 005.6 7"
                />
              </svg>
              Retake
            </button>
          </div>

          <button
            className={`flex flex-col items-center gap-1.5 ${focus} rounded-full ${busy ? off : "cursor-pointer"}`}
            onClick={handleRecordingBtn}
            disabled={busy}
            aria-label={recording ? "Stop recording" : "Start recording"}
          >
            <span className="w-16 h-16 rounded-full bg-white border-4 border-[#E4573D] grid place-items-center">
              <span
                className={`bg-[#E4573D] transition-all duration-200 ${
                  recording ? "w-6 h-6 rounded-md" : "w-11 h-11 rounded-full"
                }`}
              />
            </span>
            <span className="text-xs font-medium text-[#10242B]/70">
              {recording ? "Stop" : "Record"}
            </span>
          </button>

          <div className="flex justify-end">
            <button
              className={`px-6 py-3 rounded-full font-semibold text-white bg-[#0F6B75] hover:bg-[#0B565F] transition ${focus} ${
                busy ? off : "cursor-pointer"
              }`}
              onClick={handleSubmit}
              disabled={busy}
            >
              {isSubmitting ? "Submitting..." : "Submit answer"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
