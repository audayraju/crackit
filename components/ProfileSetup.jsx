"use client";
import { useState, useRef } from "react";

export default function ProfileSetup({ onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    targetRole: "",
    experience: "",
    industry: "tech",
    resume: null,
    resumeText: "",
    skills: [],
    preferredTone: "professional",
    responseLength: "medium",
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const industries = [
    { id: "tech", label: "Technology", icon: "💻" },
    { id: "consulting", label: "Consulting", icon: "📊" },
    { id: "finance", label: "Finance", icon: "💰" },
    { id: "marketing", label: "Marketing", icon: "📢" },
    { id: "sales", label: "Sales", icon: "🤝" },
    { id: "healthcare", label: "Healthcare", icon: "🏥" },
    { id: "operations", label: "Operations", icon: "⚙️" },
  ];

  const roles = {
    tech: ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Data Scientist", "ML Engineer", "Product Manager", "Engineering Manager", "QA Engineer"],
    consulting: ["Management Consultant", "Strategy Consultant", "Business Analyst", "Associate Consultant"],
    finance: ["Investment Banker", "Financial Analyst", "Quantitative Analyst", "Risk Analyst", "Portfolio Manager"],
    marketing: ["Marketing Manager", "Digital Marketing Specialist", "Brand Manager", "Content Strategist", "SEO Specialist"],
    sales: ["Account Executive", "Sales Manager", "Business Development Rep", "Sales Engineer"],
    healthcare: ["Healthcare Analyst", "Clinical Research Coordinator", "Health IT Specialist"],
    operations: ["Operations Manager", "Supply Chain Analyst", "Project Manager", "Business Operations Analyst"],
  };

  const experienceLevels = [
    { id: "entry", label: "Entry Level (0-2 years)", icon: "🌱" },
    { id: "mid", label: "Mid Level (3-5 years)", icon: "📈" },
    { id: "senior", label: "Senior (6-10 years)", icon: "⭐" },
    { id: "lead", label: "Lead/Staff (10+ years)", icon: "🎯" },
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    // For now, just store the file name and simulate text extraction
    // In production, you'd use a PDF parser or send to backend
    setProfile(prev => ({ 
      ...prev, 
      resume: file.name,
      resumeText: `Resume uploaded: ${file.name}` 
    }));
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUploading(false);
  };

  const handleSkillToggle = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const commonSkills = {
    tech: ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "SQL", "System Design", "Data Structures", "Algorithms"],
    consulting: ["Problem Solving", "Case Studies", "Market Sizing", "Frameworks", "Excel", "PowerPoint", "Client Management"],
    finance: ["Financial Modeling", "Excel", "Valuation", "DCF", "M&A", "Bloomberg", "Risk Analysis"],
    marketing: ["SEO", "Google Analytics", "Social Media", "Content Strategy", "PPC", "Branding", "Market Research"],
    sales: ["CRM", "Negotiation", "Cold Calling", "Pipeline Management", "Closing", "Objection Handling"],
    healthcare: ["HIPAA", "Clinical Trials", "EMR Systems", "Healthcare Analytics", "Regulatory Compliance"],
    operations: ["Process Improvement", "Lean/Six Sigma", "Supply Chain", "Project Management", "KPIs"],
  };

  const handleComplete = () => {
    localStorage.setItem("crackaiProfile", JSON.stringify(profile));
    if (onComplete) onComplete(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="text-2xl font-bold">Crack<span className="text-blue-400">AI</span></span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Let's personalize your experience</h1>
          <p className="text-gray-400">Step {step} of 4</p>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-700 h-2 rounded-full mt-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info & Resume */}
        {step === 1 && (
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-xl font-semibold mb-6">📄 Upload Your Resume</h2>
            <p className="text-gray-400 mb-6">We'll personalize AI responses based on your background</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Resume Upload */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-700/50 transition"
              >
                <input 
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploading ? (
                  <div className="animate-pulse">
                    <div className="text-4xl mb-2">⏳</div>
                    <p>Processing resume...</p>
                  </div>
                ) : profile.resume ? (
                  <div>
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-green-400 font-medium">{profile.resume}</p>
                    <p className="text-sm text-gray-500 mt-1">Click to replace</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-2">📤</div>
                    <p className="font-medium">Drop your resume here or click to upload</p>
                    <p className="text-sm text-gray-500 mt-1">PDF, DOC, or TXT</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!profile.name}
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Industry & Role */}
        {step === 2 && (
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-xl font-semibold mb-6">🎯 Target Role</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-3">Select Industry</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {industries.map(ind => (
                    <button
                      key={ind.id}
                      onClick={() => setProfile(p => ({ ...p, industry: ind.id, targetRole: "" }))}
                      className={`p-4 rounded-xl border transition ${
                        profile.industry === ind.id
                          ? "border-blue-500 bg-blue-500/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-2xl mb-1">{ind.icon}</div>
                      <div className="text-sm">{ind.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">Target Role</label>
                <select
                  value={profile.targetRole}
                  onChange={(e) => setProfile(p => ({ ...p, targetRole: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select a role...</option>
                  {roles[profile.industry]?.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-slate-600 rounded-xl hover:bg-slate-700 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!profile.targetRole}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Experience & Skills */}
        {step === 3 && (
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-xl font-semibold mb-6">💼 Experience Level</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {experienceLevels.map(exp => (
                  <button
                    key={exp.id}
                    onClick={() => setProfile(p => ({ ...p, experience: exp.id }))}
                    className={`p-4 rounded-xl border transition text-left ${
                      profile.experience === exp.id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-2xl mb-1">{exp.icon}</div>
                    <div className="text-sm">{exp.label}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">Key Skills (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {commonSkills[profile.industry]?.map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-2 rounded-lg text-sm transition ${
                        profile.skills.includes(skill)
                          ? "bg-blue-500 text-white"
                          : "bg-slate-700 hover:bg-slate-600"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-slate-600 rounded-xl hover:bg-slate-700 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!profile.experience}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: AI Preferences */}
        {step === 4 && (
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-xl font-semibold mb-6">⚙️ AI Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-3">Response Tone</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "professional", label: "Professional", icon: "👔" },
                    { id: "casual", label: "Casual", icon: "😊" },
                    { id: "confident", label: "Confident", icon: "💪" },
                  ].map(tone => (
                    <button
                      key={tone.id}
                      onClick={() => setProfile(p => ({ ...p, preferredTone: tone.id }))}
                      className={`p-4 rounded-xl border transition ${
                        profile.preferredTone === tone.id
                          ? "border-blue-500 bg-blue-500/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="text-2xl mb-1">{tone.icon}</div>
                      <div className="text-sm">{tone.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">Response Length</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "concise", label: "Concise", desc: "Quick bullet points" },
                    { id: "medium", label: "Balanced", desc: "Standard responses" },
                    { id: "detailed", label: "Detailed", desc: "Thorough explanations" },
                  ].map(len => (
                    <button
                      key={len.id}
                      onClick={() => setProfile(p => ({ ...p, responseLength: len.id }))}
                      className={`p-4 rounded-xl border transition text-left ${
                        profile.responseLength === len.id
                          ? "border-blue-500 bg-blue-500/20"
                          : "border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-medium">{len.label}</div>
                      <div className="text-xs text-gray-500">{len.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <h3 className="font-medium mb-2">📋 Profile Summary</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p><span className="text-white">{profile.name}</span> • {profile.email}</p>
                  <p>Target: <span className="text-blue-400">{profile.targetRole}</span></p>
                  <p>Experience: {experienceLevels.find(e => e.id === profile.experience)?.label}</p>
                  <p>Skills: {profile.skills.join(", ") || "None selected"}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 border border-slate-600 rounded-xl hover:bg-slate-700 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-semibold hover:opacity-90 transition"
              >
                🚀 Start Practicing
              </button>
            </div>
          </div>
        )}

        {/* Skip option */}
        <button
          onClick={handleComplete}
          className="w-full mt-4 text-gray-500 hover:text-gray-300 text-sm"
        >
          Skip for now →
        </button>
      </div>
    </div>
  );
}
