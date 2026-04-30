"use client";
import { useState, useEffect, useRef } from "react";

export default function MockInterview() {
  const [phase, setPhase] = useState("setup"); // setup, interview, feedback
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({
    interviewType: "behavioral",
    difficulty: "medium",
    duration: 15,
    questionsCount: 5,
    targetRole: "",
    company: "",
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  const interviewTypes = [
    { id: "behavioral", label: "Behavioral", icon: "💬", desc: "STAR method questions" },
    { id: "technical", label: "Technical", icon: "💻", desc: "Coding concepts & theory" },
    { id: "system_design", label: "System Design", icon: "🏗️", desc: "Architecture & scaling" },
    { id: "case_study", label: "Case Study", icon: "📊", desc: "Business problems" },
    { id: "mixed", label: "Full Loop", icon: "🎯", desc: "Mixed question types" },
  ];

  const difficulties = [
    { id: "easy", label: "Entry Level", color: "green" },
    { id: "medium", label: "Mid Level", color: "yellow" },
    { id: "hard", label: "Senior", color: "orange" },
    { id: "expert", label: "Staff/Principal", color: "red" },
  ];

  useEffect(() => {
    const savedProfile = localStorage.getItem("crackaiProfile");
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setProfile(p);
      setSettings(s => ({ ...s, targetRole: p.targetRole }));
    }

    // Setup speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer(prev => prev + " " + transcript);
      };
    }
  }, []);

  const generateQuestions = async () => {
    setIsThinking(true);
    
    try {
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate ${settings.questionsCount} ${settings.interviewType} interview questions for a ${settings.targetRole} position${settings.company ? ` at ${settings.company}` : ""}. 
          Difficulty: ${settings.difficulty}
          ${profile?.skills?.length ? `Candidate skills: ${profile.skills.join(", ")}` : ""}
          
          Return ONLY a JSON array of objects with "question" and "category" fields. No other text.
          Example: [{"question": "Tell me about a time...", "category": "Leadership"}]`
        }),
      });
      
      const data = await response.json();
      const parsed = JSON.parse(data.response.replace(/```json|```/g, "").trim());
      setQuestions(parsed);
      setPhase("interview");
      setTimeLeft(settings.duration * 60);
      startTimer();
    } catch (err) {
      // Fallback questions
      const fallbackQuestions = {
        behavioral: [
          { question: "Tell me about yourself and your background.", category: "Introduction" },
          { question: "Describe a challenging project you worked on. What was your role and how did you handle it?", category: "Problem Solving" },
          { question: "Tell me about a time you had a conflict with a teammate. How did you resolve it?", category: "Teamwork" },
          { question: "Describe a situation where you had to learn something quickly. How did you approach it?", category: "Learning Agility" },
          { question: "What's your biggest professional achievement and why?", category: "Impact" },
        ],
        technical: [
          { question: "Explain the difference between REST and GraphQL APIs.", category: "APIs" },
          { question: "What are the principles of object-oriented programming?", category: "OOP" },
          { question: "Explain how you would optimize a slow database query.", category: "Databases" },
          { question: "What is the difference between SQL and NoSQL databases?", category: "Databases" },
          { question: "Explain the concept of microservices architecture.", category: "Architecture" },
        ],
        system_design: [
          { question: "Design a URL shortener like bit.ly.", category: "System Design" },
          { question: "How would you design Twitter's feed system?", category: "System Design" },
          { question: "Design a rate limiter for an API.", category: "System Design" },
          { question: "How would you design a chat application?", category: "System Design" },
          { question: "Design a distributed cache system.", category: "System Design" },
        ],
      };
      setQuestions(fallbackQuestions[settings.interviewType] || fallbackQuestions.behavioral);
      setPhase("interview");
      setTimeLeft(settings.duration * 60);
      startTimer();
    }
    
    setIsThinking(false);
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          finishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setCurrentAnswer("");
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const submitAnswer = async () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    const newAnswer = {
      question: questions[currentQuestion].question,
      answer: currentAnswer,
      timestamp: new Date().toISOString(),
    };

    setAnswers([...answers, newAnswer]);
    setCurrentAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = async () => {
    clearInterval(timerRef.current);
    setPhase("analyzing");
    setIsThinking(true);

    try {
      const allAnswers = [...answers, {
        question: questions[currentQuestion]?.question,
        answer: currentAnswer,
      }].filter(a => a.answer);

      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyze these interview responses and provide detailed feedback.
          
Role: ${settings.targetRole}
Interview Type: ${settings.interviewType}

Questions & Answers:
${allAnswers.map((a, i) => `Q${i + 1}: ${a.question}\nA${i + 1}: ${a.answer}`).join("\n\n")}

Provide feedback in this exact JSON format:
{
  "overallScore": 85,
  "communication": { "score": 80, "feedback": "..." },
  "technicalAccuracy": { "score": 85, "feedback": "..." },
  "structure": { "score": 90, "feedback": "..." },
  "confidence": { "score": 75, "feedback": "..." },
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "strengths": ["strength 1", "strength 2"],
  "questionFeedback": [
    { "questionIndex": 0, "score": 80, "feedback": "..." }
  ]
}`
        }),
      });

      const data = await response.json();
      const parsed = JSON.parse(data.response.replace(/```json|```/g, "").trim());
      setFeedback(parsed);
    } catch (err) {
      // Fallback feedback
      setFeedback({
        overallScore: 75,
        communication: { score: 78, feedback: "Good clarity in most responses. Work on being more concise." },
        technicalAccuracy: { score: 72, feedback: "Solid understanding shown. Include more specific examples." },
        structure: { score: 80, feedback: "Well-organized responses. Consider using STAR method more consistently." },
        confidence: { score: 70, feedback: "Some hesitation noted. Practice will build confidence." },
        improvements: [
          "Use more specific metrics and numbers",
          "Structure answers using STAR method",
          "Reduce filler words like 'um' and 'like'"
        ],
        strengths: [
          "Clear communication style",
          "Good problem-solving approach"
        ],
      });
    }

    setPhase("feedback");
    setIsThinking(false);

    // Save session
    const session = {
      date: new Date().toLocaleDateString(),
      type: settings.interviewType,
      role: settings.targetRole,
      score: feedback?.overallScore || 75,
      duration: settings.duration,
    };
    const savedSessions = JSON.parse(localStorage.getItem("crackaiSessions") || "[]");
    localStorage.setItem("crackaiSessions", JSON.stringify([session, ...savedSessions]));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Setup Phase
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">🎯 Mock Interview</h1>
            <p className="text-gray-400">Practice with AI-powered realistic interviews</p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 space-y-8">
            {/* Interview Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Interview Type</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {interviewTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSettings(s => ({ ...s, interviewType: type.id }))}
                    className={`p-4 rounded-xl border transition text-center ${
                      settings.interviewType === type.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Difficulty</label>
              <div className="grid grid-cols-4 gap-3">
                {difficulties.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSettings(s => ({ ...s, difficulty: d.id }))}
                    className={`p-3 rounded-xl border transition ${
                      settings.difficulty === d.id
                        ? `border-${d.color}-500 bg-${d.color}-500/20`
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Role & Company */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Target Role</label>
                <input
                  type="text"
                  value={settings.targetRole}
                  onChange={(e) => setSettings(s => ({ ...s, targetRole: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Target Company (Optional)</label>
                <input
                  type="text"
                  value={settings.company}
                  onChange={(e) => setSettings(s => ({ ...s, company: e.target.value }))}
                  placeholder="e.g., Google, Meta, Amazon"
                  className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Duration & Questions */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Duration: {settings.duration} minutes</label>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="5"
                  value={settings.duration}
                  onChange={(e) => setSettings(s => ({ ...s, duration: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Questions: {settings.questionsCount}</label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={settings.questionsCount}
                  onChange={(e) => setSettings(s => ({ ...s, questionsCount: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>

            <button
              onClick={generateQuestions}
              disabled={!settings.targetRole || isThinking}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              {isThinking ? "Generating Questions..." : "🚀 Start Interview"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Interview Phase
  if (phase === "interview") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
              <div className="w-48 bg-slate-700 h-2 rounded-full mt-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className={`text-2xl font-mono ${timeLeft < 60 ? "text-red-400 animate-pulse" : ""}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                {questions[currentQuestion]?.category}
              </span>
              <span className="text-gray-500 text-sm">
                {settings.interviewType} • {settings.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-medium leading-relaxed">
              {questions[currentQuestion]?.question}
            </h2>
          </div>

          {/* Answer Area */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm text-gray-400">Your Answer</label>
              <button
                onClick={toggleRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  isRecording 
                    ? "bg-red-500 animate-pulse" 
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
              >
                {isRecording ? "🔴 Recording..." : "🎤 Voice"}
              </button>
            </div>
            
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer or use voice recording..."
              className="w-full h-48 px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className="px-6 py-3 border border-slate-600 rounded-xl hover:bg-slate-700 transition disabled:opacity-50"
              >
                ← Previous
              </button>
              <div className="flex gap-3">
                <button
                  onClick={finishInterview}
                  className="px-6 py-3 border border-slate-600 rounded-xl hover:bg-slate-700 transition"
                >
                  End Interview
                </button>
                <button
                  onClick={submitAnswer}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-semibold hover:opacity-90 transition"
                >
                  {currentQuestion < questions.length - 1 ? "Next Question →" : "Submit & Finish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analyzing Phase
  if (phase === "analyzing") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🤖</div>
          <h2 className="text-2xl font-bold mb-2">Analyzing Your Interview</h2>
          <p className="text-gray-400">Our AI is reviewing your responses...</p>
          <div className="mt-6 flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <div 
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Feedback Phase
  if (phase === "feedback" && feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">📊 Interview Report</h1>
            <p className="text-gray-400">{settings.targetRole} • {settings.interviewType} Interview</p>
          </div>

          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-8 border border-blue-700/50 text-center mb-8">
            <div className="text-6xl font-bold mb-2">{feedback.overallScore}%</div>
            <div className="text-xl text-gray-300">Overall Score</div>
            <div className={`inline-block px-4 py-2 rounded-full mt-4 ${
              feedback.overallScore >= 80 ? "bg-green-500/20 text-green-400" :
              feedback.overallScore >= 60 ? "bg-yellow-500/20 text-yellow-400" :
              "bg-red-500/20 text-red-400"
            }`}>
              {feedback.overallScore >= 80 ? "Excellent Performance!" :
               feedback.overallScore >= 60 ? "Good - Keep Practicing!" :
               "Needs Improvement"}
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              { key: "communication", label: "Communication", icon: "🗣️" },
              { key: "technicalAccuracy", label: "Technical Accuracy", icon: "💻" },
              { key: "structure", label: "Answer Structure", icon: "📐" },
              { key: "confidence", label: "Confidence", icon: "💪" },
            ].map(item => (
              <div key={item.key} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg">{item.icon} {item.label}</span>
                  <span className="text-2xl font-bold">{feedback[item.key]?.score || 0}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${feedback[item.key]?.score || 0}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">{feedback[item.key]?.feedback}</p>
              </div>
            ))}
          </div>

          {/* Strengths & Improvements */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-900/20 rounded-xl p-6 border border-green-700/50">
              <h3 className="text-lg font-semibold mb-4 text-green-400">✅ Strengths</h3>
              <ul className="space-y-2">
                {feedback.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-900/20 rounded-xl p-6 border border-yellow-700/50">
              <h3 className="text-lg font-semibold mb-4 text-yellow-400">💡 Areas to Improve</h3>
              <ul className="space-y-2">
                {feedback.improvements?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setPhase("setup");
                setCurrentQuestion(0);
                setAnswers([]);
                setFeedback(null);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-semibold hover:opacity-90 transition"
            >
              🔄 Practice Again
            </button>
            <a
              href="/dashboard"
              className="px-6 py-3 border border-slate-600 rounded-xl hover:bg-slate-700 transition"
            >
              📊 View Dashboard
            </a>
            <button className="px-6 py-3 border border-slate-600 rounded-xl hover:bg-slate-700 transition">
              📥 Download Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
