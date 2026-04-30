"use client";
import { useState, useEffect, useRef } from "react";

export default function CodingInterview() {
  const [phase, setPhase] = useState("setup"); // setup, problem, solution
  const [settings, setSettings] = useState({
    difficulty: "medium",
    topic: "arrays",
    company: "",
    language: "javascript",
  });
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hints, setHints] = useState([]);
  const [showHint, setShowHint] = useState(0);
  const [aiHelp, setAiHelp] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const topics = [
    { id: "arrays", label: "Arrays & Hashing", icon: "📊" },
    { id: "strings", label: "Strings", icon: "📝" },
    { id: "linked_lists", label: "Linked Lists", icon: "🔗" },
    { id: "trees", label: "Trees & Graphs", icon: "🌳" },
    { id: "dp", label: "Dynamic Programming", icon: "💡" },
    { id: "recursion", label: "Recursion", icon: "🔄" },
    { id: "sorting", label: "Sorting & Searching", icon: "🔍" },
    { id: "stacks", label: "Stacks & Queues", icon: "📚" },
  ];

  const languages = [
    { id: "javascript", label: "JavaScript" },
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "cpp", label: "C++" },
    { id: "typescript", label: "TypeScript" },
  ];

  const difficulties = [
    { id: "easy", label: "Easy", color: "green", time: 15 },
    { id: "medium", label: "Medium", color: "yellow", time: 30 },
    { id: "hard", label: "Hard", color: "red", time: 45 },
  ];

  useEffect(() => {
    // Setup speech recognition for voice explanations
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const generateProblem = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate a ${settings.difficulty} coding interview problem about ${settings.topic}${settings.company ? ` commonly asked at ${settings.company}` : ""}.

Return in this exact JSON format:
{
  "title": "Problem Title",
  "description": "Full problem description with examples",
  "examples": [
    {"input": "example input", "output": "expected output", "explanation": "optional explanation"}
  ],
  "constraints": ["constraint 1", "constraint 2"],
  "hints": ["hint 1", "hint 2", "hint 3"],
  "starterCode": {
    "javascript": "function solution(input) {\\n  // Your code here\\n}",
    "python": "def solution(input):\\n    # Your code here\\n    pass"
  },
  "testCases": [
    {"input": "test input 1", "expected": "output 1"},
    {"input": "test input 2", "expected": "output 2"}
  ],
  "timeComplexity": "Expected: O(n)",
  "spaceComplexity": "Expected: O(1)"
}`
        }),
      });
      
      const data = await response.json();
      const parsed = JSON.parse(data.response.replace(/```json|```/g, "").trim());
      setProblem(parsed);
      setHints(parsed.hints || []);
      setCode(parsed.starterCode?.[settings.language] || getDefaultCode(settings.language));
    } catch (err) {
      // Fallback problem
      setProblem({
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
        examples: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9" }
        ],
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
        hints: [
          "Think about what you need to find for each element",
          "Can you use a hash map to store seen values?",
          "Consider the complement of each number"
        ],
        testCases: [
          { input: "[2,7,11,15], 9", expected: "[0,1]" },
          { input: "[3,2,4], 6", expected: "[1,2]" }
        ],
        timeComplexity: "Expected: O(n)",
        spaceComplexity: "Expected: O(n)"
      });
      setHints(["Think about what you need to find for each element", "Can you use a hash map?", "Consider the complement"]);
      setCode(getDefaultCode(settings.language));
    }
    
    setPhase("problem");
    startTimer();
    setIsLoading(false);
  };

  const getDefaultCode = (lang) => {
    const templates = {
      javascript: `function twoSum(nums, target) {
  // Your code here
  
}`,
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        
    }
};`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  // Your code here
  
}`,
    };
    return templates[lang] || templates.javascript;
  };

  const getAIHelp = async (type) => {
    setIsLoading(true);
    
    const prompts = {
      explain: `Explain the approach to solve this problem step by step:\n\n${problem.title}\n${problem.description}`,
      optimize: `Review this code and suggest optimizations:\n\n${code}\n\nProblem: ${problem.title}`,
      debug: `Help debug this code for the problem "${problem.title}":\n\n${code}\n\nExpected behavior: ${problem.description}`,
      hint: `Give me a helpful hint for solving "${problem.title}" without giving away the solution.`,
    };

    try {
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompts[type] }),
      });
      
      const data = await response.json();
      setAiHelp(data.response);
    } catch (err) {
      setAiHelp("Unable to get AI help at the moment. Try again.");
    }
    
    setIsLoading(false);
  };

  const runCode = async () => {
    setIsLoading(true);
    
    // Simulate code execution (in real app, use a sandbox like Judge0)
    try {
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyze this ${settings.language} code for the problem "${problem.title}":

\`\`\`${settings.language}
${code}
\`\`\`

Test cases: ${JSON.stringify(problem.testCases)}

Return JSON with:
{
  "passed": 2,
  "total": 3,
  "results": [
    {"input": "...", "expected": "...", "actual": "...", "passed": true},
    {"input": "...", "expected": "...", "actual": "...", "passed": false}
  ],
  "feedback": "Brief feedback on the solution"
}`
        }),
      });
      
      const data = await response.json();
      const parsed = JSON.parse(data.response.replace(/```json|```/g, "").trim());
      setTestResults(parsed);
    } catch (err) {
      setTestResults({
        passed: 0,
        total: 2,
        results: [],
        feedback: "Error running tests. Check your code syntax."
      });
    }
    
    setIsLoading(false);
  };

  // Setup phase
  if (phase === "setup") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">💻 Coding Interview</h1>
            <p className="text-gray-400">Practice LeetCode-style problems with AI assistance</p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 space-y-6">
            {/* Topic */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Topic</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSettings(s => ({ ...s, topic: topic.id }))}
                    className={`p-4 rounded-xl border transition text-center ${
                      settings.topic === topic.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-2xl mb-1">{topic.icon}</div>
                    <div className="text-sm">{topic.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSettings(s => ({ ...s, difficulty: d.id }))}
                    className={`p-4 rounded-xl border transition ${
                      settings.difficulty === d.id
                        ? `border-${d.color}-500 bg-${d.color}-500/20`
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="font-medium">{d.label}</div>
                    <div className="text-xs text-gray-500">{d.time} min</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Language</label>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setSettings(s => ({ ...s, language: lang.id }))}
                    className={`px-4 py-2 rounded-lg transition ${
                      settings.language === lang.id
                        ? "bg-blue-500 text-white"
                        : "bg-slate-700 hover:bg-slate-600"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Company */}
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

            <button
              onClick={generateProblem}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-semibold text-lg disabled:opacity-50 hover:opacity-90 transition"
            >
              {isLoading ? "Generating Problem..." : "🚀 Start Coding"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Problem phase
  if (phase === "problem" && problem) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                clearInterval(timerRef.current);
                setPhase("setup");
                setTimer(0);
                setProblem(null);
                setCode("");
                setTestResults(null);
                setAiHelp("");
              }}
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </button>
            <span className={`px-3 py-1 rounded-full text-sm ${
              settings.difficulty === "easy" ? "bg-green-500/20 text-green-400" :
              settings.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" :
              "bg-red-500/20 text-red-400"
            }`}>
              {settings.difficulty}
            </span>
            <span className="text-gray-400">{topics.find(t => t.id === settings.topic)?.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-lg">⏱️ {formatTime(timer)}</span>
            <button
              onClick={runCode}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
            >
              ▶ Run Code
            </button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-60px)]">
          {/* Left Panel - Problem */}
          <div className="w-1/2 border-r border-slate-700 overflow-y-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-gray-300">{problem.description}</p>
              
              {/* Examples */}
              {problem.examples && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Examples:</h3>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="bg-slate-800 rounded-lg p-4 mb-3 font-mono text-sm">
                      <div><span className="text-gray-500">Input:</span> {ex.input}</div>
                      <div><span className="text-gray-500">Output:</span> {ex.output}</div>
                      {ex.explanation && (
                        <div className="text-gray-400 mt-1">Explanation: {ex.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Constraints */}
              {problem.constraints && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Constraints:</h3>
                  <ul className="list-disc list-inside text-gray-400">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Complexity */}
              {problem.timeComplexity && (
                <div className="mt-6 flex gap-4 text-sm">
                  <span className="text-gray-400">⏱️ {problem.timeComplexity}</span>
                  <span className="text-gray-400">💾 {problem.spaceComplexity}</span>
                </div>
              )}
            </div>

            {/* Hints */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">💡 Hints</h3>
              <div className="space-y-2">
                {hints.map((hint, i) => (
                  <button
                    key={i}
                    onClick={() => setShowHint(i + 1)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      showHint > i
                        ? "bg-blue-500/20 border border-blue-500"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    {showHint > i ? hint : `Hint ${i + 1} (click to reveal)`}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Help */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">🤖 AI Assistant</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => getAIHelp("explain")}
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition"
                >
                  Explain Approach
                </button>
                <button
                  onClick={() => getAIHelp("hint")}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition"
                >
                  Need a Hint
                </button>
                <button
                  onClick={() => getAIHelp("debug")}
                  disabled={isLoading}
                  className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition"
                >
                  Debug Code
                </button>
                <button
                  onClick={() => getAIHelp("optimize")}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                >
                  Optimize
                </button>
              </div>
              
              {aiHelp && (
                <div className="bg-slate-800 rounded-lg p-4 text-sm">
                  <p className="whitespace-pre-wrap">{aiHelp}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-1/2 flex flex-col">
            {/* Language selector */}
            <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
              {languages.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSettings(s => ({ ...s, language: lang.id }));
                    setCode(problem.starterCode?.[lang.id] || getDefaultCode(lang.id));
                  }}
                  className={`px-3 py-1 rounded text-sm transition ${
                    settings.language === lang.id
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Code area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-slate-900 p-4 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
              placeholder="Write your code here..."
            />

            {/* Test Results */}
            {testResults && (
              <div className="bg-slate-800 border-t border-slate-700 p-4 max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">Test Results</span>
                  <span className={testResults.passed === testResults.total ? "text-green-400" : "text-yellow-400"}>
                    {testResults.passed}/{testResults.total} Passed
                  </span>
                </div>
                
                {testResults.results?.map((result, i) => (
                  <div key={i} className={`p-2 rounded-lg mb-2 text-sm ${
                    result.passed ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                    <div className="flex items-center gap-2">
                      <span>{result.passed ? "✅" : "❌"}</span>
                      <span className="text-gray-400">Input: {result.input}</span>
                    </div>
                    {!result.passed && (
                      <div className="ml-6 mt-1">
                        <div>Expected: {result.expected}</div>
                        <div>Got: {result.actual}</div>
                      </div>
                    )}
                  </div>
                ))}
                
                {testResults.feedback && (
                  <p className="text-gray-400 text-sm mt-2">{testResults.feedback}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
