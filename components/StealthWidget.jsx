"use client";
import { useState, useRef, useEffect } from "react";

export default function StealthWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const widgetRef = useRef(null);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInput((prev) => prev + finalTranscript);
          }
        };

        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Hook up Electron desktop APIs
  useEffect(() => {
    let cleanupAutoMode = () => {};
    let cleanupInstant = () => {};

    if (typeof window !== "undefined" && window.crackDesktopAPI) {
      // Toggle auto mode (voice)
      cleanupAutoMode = window.crackDesktopAPI.onToggleAutoMode(() => {
        toggleListening();
      });

      // Trigger instant response (screen capture)
      cleanupInstant = window.crackDesktopAPI.onTriggerInstantResponse(() => {
        takeScreenshot();
      });
    }

    return () => {
      cleanupAutoMode();
      cleanupInstant();
    };
  }, [isListening]); 
  
  const takeScreenshot = async () => {
    if (typeof window !== "undefined" && window.crackDesktopAPI) {
      try {
        // Now returns a 1080p 'thumbnail' which is our actual screen snapshot
        const sources = await window.crackDesktopAPI.getCaptureSources({ types: ['screen'] });
        if (sources && sources.length > 0) {
          const imageBase64 = sources[0].thumbnail;

          // Render the actual screenshot in the Chat
          setMessages((prev) => [...prev, { 
            role: "user", 
            text: "Analyzing screen...", 
            image: imageBase64 
          }]);

          setLoading(true);

          // Simulated Backend upload processing wait time
          setTimeout(() => {
             setMessages((prev) => [...prev, { 
               role: "ai", 
               text: "I analyzed the screenshot! The code structure looks correct, but watch out for O(N^2) complexity on row 42." 
             }]);
             setLoading(false);
          }, 1500);
        }
      } catch (err) {
        console.error("Capture Failed:", err);
      }
    } else {
      alert("Screen capture is only available in the Desktop App.");
    }
  };

  // Dragging functionality
  const handleMouseDown = (e) => {
    if (e.target.closest('.no-drag')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y)),
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `The candidate was asked or said: "${userMessage}". Provide a brief, helpful hint or talking point. Keep it concise (2-3 sentences max).`,
          role: "Software Developer" 
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Connection error" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Minimized state - just a small floating button
  if (isMinimized) {
    return (
      <div
        ref={widgetRef}
        style={{ left: position.x, top: position.y }}
        className="fixed z-[9999] cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="no-drag w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
          title="Expand CrackAI"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </button>
      </div>
    );
  }

  // Collapsed state - compact bar
  if (!isExpanded) {
    return (
      <div
        ref={widgetRef}
        style={{ left: position.x, top: position.y }}
        className="fixed z-[9999] cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-2 flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(true)}
            className="no-drag bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            AI Assist
          </button>
          
          <button
            onClick={toggleListening}
            className={`no-drag p-2 rounded-xl transition ${
              isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-white hover:bg-white/20"
            }`}
            title="Voice input"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="no-drag p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
            title="Minimize"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Expanded state - full chat
  return (
    <div
      ref={widgetRef}
      style={{ left: position.x, top: position.y }}
      className="fixed z-[9999] cursor-move select-none"
      onMouseDown={handleMouseDown}
    >
      <div className="w-80 bg-black/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            CrackAI Stealth
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(false)}
              className="no-drag p-1 rounded hover:bg-white/20 transition text-white"
              title="Collapse"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="no-drag p-1 rounded hover:bg-white/20 transition text-white"
              title="Minimize"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-48 overflow-y-auto p-3 space-y-2 scrollbar-thin">
          {messages.length === 0 && (
            <p className="text-white/50 text-xs text-center py-4">
              Type the interview question or your thoughts to get AI hints
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-xs p-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600/30 text-blue-100 ml-4"
                  : "bg-white/10 text-white mr-4"
              }`}
            >
              {msg.text}
              {msg.image && (
                <img src={msg.image} alt="Capture" className="mt-2 w-full rounded border border-white/20" />
              )}
            </div>
          ))}
          {loading && (
            <div className="bg-white/10 text-white/50 text-xs p-2 rounded-lg mr-4 animate-pulse">
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Question or answer..."}
              className="no-drag flex-1 bg-white/10 text-white text-xs px-3 py-2 rounded-lg placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={toggleListening}
              className={`no-drag p-2 rounded-lg transition ${
                isListening ? "bg-red-500 animate-pulse" : "bg-white/10 hover:bg-white/20"
              } text-white`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="no-drag bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs disabled:opacity-50 transition"
            >
              Ask
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-3 pb-3 flex gap-2">
          <button
            onClick={takeScreenshot}
            className="no-drag bg-purple-600/30 hover:bg-purple-600/50 text-purple-100 text-xs px-3 py-1.5 rounded-lg transition"
            title="Desktop capture"
          >
            📸 Capture
          </button>
          <button
            onClick={() => {
              setInput("How should I answer this question?");
              sendMessage();
            }}
            className="no-drag flex-1 bg-white/5 hover:bg-white/10 text-white/70 text-xs py-1.5 rounded-lg transition"
          >
            💡 Help me answer
          </button>
          <button
            onClick={() => setMessages([])}
            className="no-drag bg-white/5 hover:bg-white/10 text-white/70 text-xs px-3 py-1.5 rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
