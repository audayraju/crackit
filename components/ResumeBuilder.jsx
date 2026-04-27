"use client";
import { useState, useRef } from "react";

export default function ResumeBuilder() {
  const [step, setStep] = useState("input"); // input, generating, preview
  const [resumeData, setResumeData] = useState({
    // Personal Info
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    
    // Experience
    experiences: [{ company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] }],
    
    // Education
    education: [{ school: "", degree: "", field: "", graduationDate: "", gpa: "" }],
    
    // Skills
    skills: { technical: [], soft: [] },
    
    // Projects
    projects: [{ name: "", description: "", technologies: "", link: "" }],
    
    // Certifications
    certifications: [],
    
    // Target
    targetRole: "",
    targetCompany: "",
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const fileInputRef = useRef(null);

  const sections = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "summary", label: "Summary", icon: "📝" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "projects", label: "Projects", icon: "🚀" },
  ];

  const handleExperienceChange = (index, field, value) => {
    const updated = [...resumeData.experiences];
    updated[index][field] = value;
    setResumeData({ ...resumeData, experiences: updated });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experiences: [...resumeData.experiences, { company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] }]
    });
  };

  const addBullet = (expIndex) => {
    const updated = [...resumeData.experiences];
    updated[expIndex].bullets.push("");
    setResumeData({ ...resumeData, experiences: updated });
  };

  const handleBulletChange = (expIndex, bulletIndex, value) => {
    const updated = [...resumeData.experiences];
    updated[expIndex].bullets[bulletIndex] = value;
    setResumeData({ ...resumeData, experiences: updated });
  };

  const improveBulletWithAI = async (expIndex, bulletIndex) => {
    const bullet = resumeData.experiences[expIndex].bullets[bulletIndex];
    if (!bullet) return;

    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:5000/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Improve this resume bullet point to be more impactful. Use action verbs, add metrics/numbers where possible, and make it achievement-focused.
          
Original: "${bullet}"
Role: ${resumeData.experiences[expIndex].title || resumeData.targetRole}

Return ONLY the improved bullet point, nothing else. Start with a strong action verb.`
        }),
      });
      const data = await response.json();
      handleBulletChange(expIndex, bulletIndex, data.response.trim());
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:5000/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Write a professional resume summary (2-3 sentences) for:
Name: ${resumeData.name}
Target Role: ${resumeData.targetRole || "Software Engineer"}
Experience: ${resumeData.experiences.map(e => e.title + " at " + e.company).join(", ")}
Skills: ${[...resumeData.skills.technical, ...resumeData.skills.soft].join(", ")}

Make it impactful, achievement-focused, and tailored for the target role. Return ONLY the summary text.`
        }),
      });
      const data = await response.json();
      setResumeData({ ...resumeData, summary: data.response.trim() });
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  const generateFullResume = async () => {
    setStep("generating");
    setIsGenerating(true);

    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedResume(resumeData);
    setStep("preview");
    setIsGenerating(false);
  };

  const commonSkills = {
    technical: ["JavaScript", "Python", "React", "Node.js", "TypeScript", "SQL", "AWS", "Docker", "Git", "REST APIs", "GraphQL", "HTML/CSS", "Java", "C++", "MongoDB", "PostgreSQL", "Redis", "Kubernetes", "CI/CD", "Terraform"],
    soft: ["Leadership", "Communication", "Problem Solving", "Team Collaboration", "Project Management", "Agile/Scrum", "Critical Thinking", "Time Management", "Mentoring", "Presentation Skills"],
  };

  const toggleSkill = (type, skill) => {
    const current = resumeData.skills[type];
    const updated = current.includes(skill)
      ? current.filter(s => s !== skill)
      : [...current, skill];
    setResumeData({
      ...resumeData,
      skills: { ...resumeData.skills, [type]: updated }
    });
  };

  // Input Form
  if (step === "input") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">📄 AI Resume Builder</h1>
              <p className="text-gray-400">Create an ATS-optimized resume with AI assistance</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition"
              >
                📤 Import Resume
              </button>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" />
              <button
                onClick={generateFullResume}
                disabled={!resumeData.name || isGenerating}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold disabled:opacity-50 hover:opacity-90 transition"
              >
                Generate Resume ✨
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Section Navigation */}
            <div className="md:col-span-1">
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 sticky top-6">
                <h3 className="font-semibold mb-4">Sections</h3>
                <nav className="space-y-2">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        activeSection === section.id
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500"
                          : "hover:bg-slate-700"
                      }`}
                    >
                      {section.icon} {section.label}
                    </button>
                  ))}
                </nav>

                {/* Target Role */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <label className="block text-sm text-gray-400 mb-2">Target Role</label>
                  <input
                    type="text"
                    value={resumeData.targetRole}
                    onChange={(e) => setResumeData({ ...resumeData, targetRole: e.target.value })}
                    placeholder="e.g., Senior SWE"
                    className="w-full px-3 py-2 bg-slate-700 rounded-lg border border-slate-600 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="md:col-span-3">
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                {/* Personal Info */}
                {activeSection === "personal" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">👤 Personal Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={resumeData.name}
                          onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Email *</label>
                        <input
                          type="email"
                          value={resumeData.email}
                          onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={resumeData.phone}
                          onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Location</label>
                        <input
                          type="text"
                          value={resumeData.location}
                          onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                          placeholder="San Francisco, CA"
                          className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">LinkedIn</label>
                        <input
                          type="url"
                          value={resumeData.linkedin}
                          onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                          placeholder="linkedin.com/in/johndoe"
                          className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">GitHub</label>
                        <input
                          type="url"
                          value={resumeData.github}
                          onChange={(e) => setResumeData({ ...resumeData, github: e.target.value })}
                          placeholder="github.com/johndoe"
                          className="w-full px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {activeSection === "summary" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">📝 Professional Summary</h2>
                      <button
                        onClick={generateSummary}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition text-sm"
                      >
                        {isGenerating ? "Generating..." : "✨ Generate with AI"}
                      </button>
                    </div>
                    <textarea
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                      placeholder="Write a compelling 2-3 sentence summary of your professional background..."
                      className="w-full h-32 px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-blue-500 focus:outline-none resize-none"
                    />
                    <p className="text-sm text-gray-500">Tip: Include your years of experience, key skills, and career goals.</p>
                  </div>
                )}

                {/* Experience */}
                {activeSection === "experience" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">💼 Work Experience</h2>
                      <button
                        onClick={addExperience}
                        className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition text-sm"
                      >
                        + Add Experience
                      </button>
                    </div>

                    {resumeData.experiences.map((exp, expIdx) => (
                      <div key={expIdx} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(expIdx, "company", e.target.value)}
                            placeholder="Company Name"
                            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleExperienceChange(expIdx, "title", e.target.value)}
                            placeholder="Job Title"
                            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(expIdx, "startDate", e.target.value)}
                            placeholder="Start Date (e.g., Jan 2022)"
                            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(expIdx, "endDate", e.target.value)}
                            placeholder="End Date (or Present)"
                            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-gray-400">Key Achievements / Responsibilities</label>
                          {exp.bullets.map((bullet, bulletIdx) => (
                            <div key={bulletIdx} className="flex gap-2">
                              <span className="text-gray-500 mt-2">•</span>
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => handleBulletChange(expIdx, bulletIdx, e.target.value)}
                                placeholder="Describe an achievement with metrics..."
                                className="flex-1 px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                              />
                              <button
                                onClick={() => improveBulletWithAI(expIdx, bulletIdx)}
                                disabled={!bullet || isGenerating}
                                className="px-3 py-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition"
                                title="Improve with AI"
                              >
                                ✨
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addBullet(expIdx)}
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            + Add bullet point
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {activeSection === "education" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">🎓 Education</h2>
                    
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[idx].school = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            placeholder="University / School Name"
                            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[idx].degree = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            placeholder="Degree (e.g., B.S., M.S.)"
                            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={edu.field}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[idx].field = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            placeholder="Field of Study"
                            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={edu.graduationDate}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[idx].graduationDate = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            placeholder="Graduation Date"
                            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => setResumeData({
                        ...resumeData,
                        education: [...resumeData.education, { school: "", degree: "", field: "", graduationDate: "", gpa: "" }]
                      })}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      + Add Education
                    </button>
                  </div>
                )}

                {/* Skills */}
                {activeSection === "skills" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">⚡ Skills</h2>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Technical Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {commonSkills.technical.map(skill => (
                          <button
                            key={skill}
                            onClick={() => toggleSkill("technical", skill)}
                            className={`px-3 py-2 rounded-lg text-sm transition ${
                              resumeData.skills.technical.includes(skill)
                                ? "bg-blue-500 text-white"
                                : "bg-slate-700 hover:bg-slate-600"
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-3">Soft Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {commonSkills.soft.map(skill => (
                          <button
                            key={skill}
                            onClick={() => toggleSkill("soft", skill)}
                            className={`px-3 py-2 rounded-lg text-sm transition ${
                              resumeData.skills.soft.includes(skill)
                                ? "bg-green-500 text-white"
                                : "bg-slate-700 hover:bg-slate-600"
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Projects */}
                {activeSection === "projects" && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold mb-4">🚀 Projects</h2>
                    
                    {resumeData.projects.map((project, idx) => (
                      <div key={idx} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={project.name}
                            onChange={(e) => {
                              const updated = [...resumeData.projects];
                              updated[idx].name = e.target.value;
                              setResumeData({ ...resumeData, projects: updated });
                            }}
                            placeholder="Project Name"
                            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={project.link}
                            onChange={(e) => {
                              const updated = [...resumeData.projects];
                              updated[idx].link = e.target.value;
                              setResumeData({ ...resumeData, projects: updated });
                            }}
                            placeholder="Project Link (GitHub, Demo)"
                            className="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <textarea
                          value={project.description}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[idx].description = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          placeholder="Brief description of the project..."
                          className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none resize-none h-20"
                        />
                        <input
                          type="text"
                          value={project.technologies}
                          onChange={(e) => {
                            const updated = [...resumeData.projects];
                            updated[idx].technologies = e.target.value;
                            setResumeData({ ...resumeData, projects: updated });
                          }}
                          placeholder="Technologies used (e.g., React, Node.js, MongoDB)"
                          className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                    
                    <button
                      onClick={() => setResumeData({
                        ...resumeData,
                        projects: [...resumeData.projects, { name: "", description: "", technologies: "", link: "" }]
                      })}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      + Add Project
                    </button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
                  <button
                    onClick={() => {
                      const idx = sections.findIndex(s => s.id === activeSection);
                      if (idx > 0) setActiveSection(sections[idx - 1].id);
                    }}
                    disabled={activeSection === sections[0].id}
                    className="px-6 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => {
                      const idx = sections.findIndex(s => s.id === activeSection);
                      if (idx < sections.length - 1) {
                        setActiveSection(sections[idx + 1].id);
                      } else {
                        generateFullResume();
                      }
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    {activeSection === sections[sections.length - 1].id ? "Generate Resume ✨" : "Next →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generating Phase
  if (step === "generating") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📄</div>
          <h2 className="text-2xl font-bold mb-2">Building Your Resume</h2>
          <p className="text-gray-400">AI is optimizing your content...</p>
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

  // Preview Phase
  if (step === "preview" && generatedResume) {
    return (
      <div className="min-h-screen bg-slate-100">
        {/* Toolbar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <button
            onClick={() => setStep("input")}
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            ← Edit Resume
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition">
              📥 Download PDF
            </button>
            <button className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition">
              📤 Share
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:opacity-90 transition">
              ✅ Save
            </button>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="max-w-3xl mx-auto py-8 px-4">
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <header className="text-center border-b pb-6 mb-6">
                <h1 className="text-3xl font-bold text-slate-800">{generatedResume.name}</h1>
                <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-slate-600">
                  {generatedResume.email && <span>📧 {generatedResume.email}</span>}
                  {generatedResume.phone && <span>📱 {generatedResume.phone}</span>}
                  {generatedResume.location && <span>📍 {generatedResume.location}</span>}
                </div>
                <div className="flex justify-center gap-4 mt-2 text-sm text-blue-600">
                  {generatedResume.linkedin && <a href="#">LinkedIn</a>}
                  {generatedResume.github && <a href="#">GitHub</a>}
                </div>
              </header>

              {/* Summary */}
              {generatedResume.summary && (
                <section className="mb-6">
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">PROFESSIONAL SUMMARY</h2>
                  <p className="text-slate-700">{generatedResume.summary}</p>
                </section>
              )}

              {/* Experience */}
              {generatedResume.experiences.some(e => e.company) && (
                <section className="mb-6">
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">EXPERIENCE</h2>
                  {generatedResume.experiences.filter(e => e.company).map((exp, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-800">{exp.title}</h3>
                          <p className="text-slate-600">{exp.company}</p>
                        </div>
                        <p className="text-slate-500 text-sm">{exp.startDate} - {exp.endDate || "Present"}</p>
                      </div>
                      <ul className="list-disc list-inside mt-2 text-sm text-slate-700">
                        {exp.bullets.filter(b => b).map((bullet, j) => (
                          <li key={j}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {/* Education */}
              {generatedResume.education.some(e => e.school) && (
                <section className="mb-6">
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">EDUCATION</h2>
                  {generatedResume.education.filter(e => e.school).map((edu, i) => (
                    <div key={i} className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-800">{edu.degree} in {edu.field}</h3>
                        <p className="text-slate-600">{edu.school}</p>
                      </div>
                      <p className="text-slate-500 text-sm">{edu.graduationDate}</p>
                    </div>
                  ))}
                </section>
              )}

              {/* Skills */}
              {(generatedResume.skills.technical.length > 0 || generatedResume.skills.soft.length > 0) && (
                <section className="mb-6">
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">SKILLS</h2>
                  {generatedResume.skills.technical.length > 0 && (
                    <p className="text-sm text-slate-700 mb-1">
                      <strong>Technical:</strong> {generatedResume.skills.technical.join(", ")}
                    </p>
                  )}
                  {generatedResume.skills.soft.length > 0 && (
                    <p className="text-sm text-slate-700">
                      <strong>Soft Skills:</strong> {generatedResume.skills.soft.join(", ")}
                    </p>
                  )}
                </section>
              )}

              {/* Projects */}
              {generatedResume.projects.some(p => p.name) && (
                <section>
                  <h2 className="text-lg font-bold text-slate-800 border-b border-slate-300 pb-1 mb-3">PROJECTS</h2>
                  {generatedResume.projects.filter(p => p.name).map((project, i) => (
                    <div key={i} className="mb-3">
                      <h3 className="font-semibold text-slate-800">{project.name}</h3>
                      <p className="text-sm text-slate-700">{project.description}</p>
                      {project.technologies && (
                        <p className="text-xs text-slate-500 mt-1">Technologies: {project.technologies}</p>
                      )}
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
