"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import CopilotLaunchpad from "../components/CopilotLaunchpad";
import CreateProfileModal from "../components/CreateProfileModal";
import ResumeBuilder from "../components/ResumeBuilder";

export default function Home() {
  const [activeRoute, setActiveRoute] = useState("AI Interview Copilot");
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar activeRoute={activeRoute} setActiveRoute={setActiveRoute} />
      
      {activeRoute === "AI Interview Copilot" && (
        <Dashboard onLaunch={() => setActiveRoute("Launchpad")} />
      )}
      
      {activeRoute === "Launchpad" && (
        <CopilotLaunchpad 
          onBack={() => setActiveRoute("AI Interview Copilot")} 
          onCreateNewProfile={() => setShowCreateModal(true)} 
        />
      )}

      {activeRoute === "Interview Profiles" && (
        <ResumeBuilder />
      )}

      {/* For Mock/Other routes, you'd integrate them similarly */}
      {activeRoute !== "AI Interview Copilot" && activeRoute !== "Launchpad" && activeRoute !== "Interview Profiles" && (
        <div className="flex-1 flex flex-col justify-center items-center text-slate-400" style={{ paddingTop: '60px' }}>
           <span className="text-4xl mb-4">🚧</span>
           <p>This module ({activeRoute}) is under construction or hidden behind stealth widgets.</p>
        </div>
      )}

      {showCreateModal && (
        <CreateProfileModal 
          onClose={() => setShowCreateModal(false)} 
          onProfileCreated={() => window.location.reload()}
        />
      )}
    </div>
  );
}
