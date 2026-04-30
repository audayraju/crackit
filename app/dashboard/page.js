"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Dashboard from "../../components/Dashboard";
import CopilotLaunchpad from "../../components/CopilotLaunchpad";
import CreateProfileModal from "../../components/CreateProfileModal";
import MockInterview from "../../components/MockInterview";
import ResumeBuilder from "../../components/ResumeBuilder";
import CodingInterview from "../../components/CodingInterview";

export default function DashboardPage() {
  const [activeRoute, setActiveRoute] = useState("AI Interview Copilot");
  const [showLaunchpad, setShowLaunchpad] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const router = useRouter();

  const handleLaunchCopilot = () => {
    setShowLaunchpad(true);
  };

  const handleCreateNewProfile = () => {
    setShowCreateProfile(true);
  };

  const handleProfileCreated = () => {
    setShowCreateProfile(false);
    // When profile is created, the launchpad will naturally fetch the newest profiles
  };

  const handleLaunchStealth = () => {
    // Navigate to stealth mode app
    router.push("/stealth");
  };

  const renderContent = () => {
    if (activeRoute === "AI Mock") {
      return (
        <div className="flex-1 overflow-y-auto">
          <MockInterview />
        </div>
      );
    }

    if (activeRoute === "Resume Builder") {
      return (
        <div className="flex-1 overflow-y-auto">
          <ResumeBuilder />
        </div>
      );
    }

    if (activeRoute === "Coding Copilot") {
      return (
        <div className="flex-1 overflow-y-auto">
          <CodingInterview />
        </div>
      );
    }
    
    if (activeRoute === "AI Interview Copilot" || activeRoute === "Interview Profiles") {
      if (showLaunchpad) {
        return (
          <CopilotLaunchpad 
            onBack={() => setShowLaunchpad(false)} 
            onCreateNewProfile={handleCreateNewProfile}
            onLaunch={handleLaunchStealth}
          />
        );
      }
      return <Dashboard onLaunch={handleLaunchCopilot} />;
    }

    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <p className="text-slate-400">Coming soon...</p>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar activeRoute={activeRoute} setActiveRoute={setActiveRoute} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {renderContent()}
      </div>

      {showCreateProfile && (
        <CreateProfileModal 
          onClose={() => setShowCreateProfile(false)}
          onProfileCreated={handleProfileCreated}
        />
      )}
    </div>
  );
}
