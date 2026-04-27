"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({
    // AI Settings
    aiModel: "auto",
    responseTone: "professional",
    responseLength: "medium",
    voiceEnabled: true,
    ttsEnabled: true,
    ttsSpeed: 1,
    ttsVoice: "default",
    
    // Interview Settings
    feedbackDetail: "detailed",
    showHints: true,
    timerEnabled: true,
    autoAdvance: false,
    
    // Appearance
    theme: "dark",
    fontSize: "medium",
    
    // Privacy
    saveHistory: true,
    analytics: true,
    
    // Notifications
    emailReminders: true,
    practiceReminders: true,
    weeklyReport: true,
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");

  useEffect(() => {
    const savedProfile = localStorage.getItem("crackaiProfile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedSettings = localStorage.getItem("crackaiSettings");
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const saveSettings = () => {
    localStorage.setItem("crackaiSettings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "ai", label: "AI & Voice", icon: "🤖" },
    { id: "interview", label: "Interview", icon: "🎯" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  const aiModels = [
    { id: "auto", label: "Auto (Best Available)", desc: "Automatically selects the best model" },
    { id: "gpt4", label: "GPT-4", desc: "Most capable, slower responses" },
    { id: "gemini", label: "Gemini Pro", desc: "Fast, multimodal capabilities" },
    { id: "claude", label: "Claude", desc: "Thoughtful, nuanced responses" },
  ];

  const tones = [
    { id: "professional", label: "Professional", desc: "Formal and business-appropriate" },
    { id: "casual", label: "Casual", desc: "Friendly and conversational" },
    { id: "confident", label: "Confident", desc: "Assertive and decisive" },
    { id: "technical", label: "Technical", desc: "Detailed and precise" },
  ];

  const lengths = [
    { id: "concise", label: "Concise", desc: "Quick bullet points" },
    { id: "medium", label: "Balanced", desc: "Standard responses" },
    { id: "detailed", label: "Detailed", desc: "Comprehensive explanations" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
          <button
            onClick={saveSettings}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Tabs */}
          <div className="md:col-span-1">
            <nav className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 sticky top-24">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition mb-1 ${
                    activeTab === tab.id
                      ? "bg-blue-500/20 text-blue-400"
                      : "hover:bg-slate-700"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              {/* AI & Voice Settings */}
              {activeTab === "ai" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">🤖 AI Model</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {aiModels.map(model => (
                        <button
                          key={model.id}
                          onClick={() => setSettings(s => ({ ...s, aiModel: model.id }))}
                          className={`p-4 rounded-xl border transition text-left ${
                            settings.aiModel === model.id
                              ? "border-blue-500 bg-blue-500/20"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          <div className="font-medium">{model.label}</div>
                          <div className="text-sm text-gray-500">{model.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">💬 Response Tone</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {tones.map(tone => (
                        <button
                          key={tone.id}
                          onClick={() => setSettings(s => ({ ...s, responseTone: tone.id }))}
                          className={`p-4 rounded-xl border transition text-left ${
                            settings.responseTone === tone.id
                              ? "border-blue-500 bg-blue-500/20"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          <div className="font-medium">{tone.label}</div>
                          <div className="text-sm text-gray-500">{tone.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">📏 Response Length</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {lengths.map(len => (
                        <button
                          key={len.id}
                          onClick={() => setSettings(s => ({ ...s, responseLength: len.id }))}
                          className={`p-4 rounded-xl border transition text-left ${
                            settings.responseLength === len.id
                              ? "border-blue-500 bg-blue-500/20"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          <div className="font-medium">{len.label}</div>
                          <div className="text-sm text-gray-500">{len.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">🎤 Voice Settings</h2>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                        <div>
                          <div className="font-medium">Voice Input</div>
                          <div className="text-sm text-gray-500">Use microphone for answers</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.voiceEnabled}
                          onChange={(e) => setSettings(s => ({ ...s, voiceEnabled: e.target.checked }))}
                          className="w-5 h-5 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                        <div>
                          <div className="font-medium">Text-to-Speech</div>
                          <div className="text-sm text-gray-500">Read AI responses aloud</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.ttsEnabled}
                          onChange={(e) => setSettings(s => ({ ...s, ttsEnabled: e.target.checked }))}
                          className="w-5 h-5 rounded"
                        />
                      </label>

                      {settings.ttsEnabled && (
                        <div className="p-4 bg-slate-700/50 rounded-xl">
                          <label className="block text-sm text-gray-400 mb-2">
                            Speech Speed: {settings.ttsSpeed}x
                          </label>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={settings.ttsSpeed}
                            onChange={(e) => setSettings(s => ({ ...s, ttsSpeed: parseFloat(e.target.value) }))}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Interview Settings */}
              {activeTab === "interview" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">🎯 Interview Preferences</h2>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Feedback Detail Level</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["brief", "standard", "detailed"].map(level => (
                        <button
                          key={level}
                          onClick={() => setSettings(s => ({ ...s, feedbackDetail: level }))}
                          className={`p-4 rounded-xl border transition capitalize ${
                            settings.feedbackDetail === level
                              ? "border-blue-500 bg-blue-500/20"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                      <div>
                        <div className="font-medium">Show Hints</div>
                        <div className="text-sm text-gray-500">Display hints during practice</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showHints}
                        onChange={(e) => setSettings(s => ({ ...s, showHints: e.target.checked }))}
                        className="w-5 h-5 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                      <div>
                        <div className="font-medium">Timer</div>
                        <div className="text-sm text-gray-500">Show countdown during interviews</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.timerEnabled}
                        onChange={(e) => setSettings(s => ({ ...s, timerEnabled: e.target.checked }))}
                        className="w-5 h-5 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                      <div>
                        <div className="font-medium">Auto-Advance</div>
                        <div className="text-sm text-gray-500">Move to next question automatically</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoAdvance}
                        onChange={(e) => setSettings(s => ({ ...s, autoAdvance: e.target.checked }))}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">🎨 Appearance</h2>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "dark", label: "Dark", icon: "🌙" },
                        { id: "light", label: "Light", icon: "☀️" },
                        { id: "system", label: "System", icon: "💻" },
                      ].map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setSettings(s => ({ ...s, theme: theme.id }))}
                          className={`p-4 rounded-xl border transition ${
                            settings.theme === theme.id
                              ? "border-blue-500 bg-blue-500/20"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          <div className="text-2xl mb-2">{theme.icon}</div>
                          <div>{theme.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Font Size</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["small", "medium", "large"].map(size => (
                        <button
                          key={size}
                          onClick={() => setSettings(s => ({ ...s, fontSize: size }))}
                          className={`p-4 rounded-xl border transition capitalize ${
                            settings.fontSize === size
                              ? "border-blue-500 bg-blue-500/20"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">🔒 Privacy & Data</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                      <div>
                        <div className="font-medium">Save Interview History</div>
                        <div className="text-sm text-gray-500">Store your practice sessions locally</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.saveHistory}
                        onChange={(e) => setSettings(s => ({ ...s, saveHistory: e.target.checked }))}
                        className="w-5 h-5 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                      <div>
                        <div className="font-medium">Analytics</div>
                        <div className="text-sm text-gray-500">Help improve the app with usage data</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.analytics}
                        onChange={(e) => setSettings(s => ({ ...s, analytics: e.target.checked }))}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="font-medium mb-3">Data Management</h3>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition">
                        📥 Export Data
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm("This will delete all your data. Continue?")) {
                            localStorage.clear();
                            window.location.reload();
                          }
                        }}
                        className="px-4 py-2 border border-red-600 text-red-400 rounded-lg hover:bg-red-600/20 transition"
                      >
                        🗑️ Delete All Data
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">🔔 Notifications</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                      <div>
                        <div className="font-medium">Email Reminders</div>
                        <div className="text-sm text-gray-500">Get interview prep reminders</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailReminders}
                        onChange={(e) => setSettings(s => ({ ...s, emailReminders: e.target.checked }))}
                        className="w-5 h-5 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                      <div>
                        <div className="font-medium">Practice Reminders</div>
                        <div className="text-sm text-gray-500">Daily notifications to practice</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.practiceReminders}
                        onChange={(e) => setSettings(s => ({ ...s, practiceReminders: e.target.checked }))}
                        className="w-5 h-5 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                      <div>
                        <div className="font-medium">Weekly Report</div>
                        <div className="text-sm text-gray-500">Get weekly progress summary</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.weeklyReport}
                        onChange={(e) => setSettings(s => ({ ...s, weeklyReport: e.target.checked }))}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Profile */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">👤 Profile</h2>
                  
                  {profile ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-2xl font-bold">
                          {profile.name?.[0] || "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{profile.name}</div>
                          <div className="text-gray-400">{profile.email}</div>
                          <div className="text-sm text-blue-400">{profile.targetRole}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-4 bg-slate-700/50 rounded-xl">
                          <div className="text-gray-400">Industry</div>
                          <div className="font-medium capitalize">{profile.industry}</div>
                        </div>
                        <div className="p-4 bg-slate-700/50 rounded-xl">
                          <div className="text-gray-400">Experience</div>
                          <div className="font-medium capitalize">{profile.experience}</div>
                        </div>
                      </div>

                      {profile.skills?.length > 0 && (
                        <div className="p-4 bg-slate-700/50 rounded-xl">
                          <div className="text-gray-400 mb-2">Skills</div>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <Link
                        href="/onboarding"
                        className="block text-center px-4 py-3 border border-slate-600 rounded-xl hover:bg-slate-700 transition"
                      >
                        ✏️ Edit Profile
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">👤</div>
                      <p className="text-gray-400 mb-4">No profile set up yet</p>
                      <Link
                        href="/onboarding"
                        className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl font-semibold"
                      >
                        Create Profile
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
