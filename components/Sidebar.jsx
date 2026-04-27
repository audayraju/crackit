"use client";
import React from 'react';

export default function Sidebar({ activeRoute = "AI Interview Copilot", setActiveRoute }) {
  return (
    <div className="w-64 flex-shrink-0 h-screen bg-[#f8f9fa] border-r border-[#e9ecef] flex flex-col p-4 overflow-y-auto" style={{ paddingTop: '50px' }}>
      {/* Brand */}
      <div className="flex items-center gap-2 px-2 py-2 mb-4">
        <div className="bg-purple-600 rounded-md shadow-sm w-7 h-7 flex items-center justify-center text-white font-bold text-lg leading-none">V</div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">Crack AI</span>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 shadow-sm rounded-xl mb-8 cursor-pointer hover:shadow-md transition">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Uday&backgroundColor=e2e8f0" alt="avatar" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800">Uday Raju</span>
          <span className="text-[11px] text-slate-500 font-medium">Manage Account (Free Plan)</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-6 flex-1">
        
        {/* INTERVIEW */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Interview</span>
          <NavItem 
            label="AI Interview Copilot" 
            icon="🚀" 
            active={activeRoute === "AI Interview Copilot"} 
            onClick={() => setActiveRoute && setActiveRoute("AI Interview Copilot")} 
          />
          <NavItem 
            label="AI Mock" 
            icon="🤖" 
            active={activeRoute === "AI Mock"} 
            onClick={() => setActiveRoute && setActiveRoute("AI Mock")} 
          />
          <NavItem 
            label="Interview Profiles" 
            icon="📋" 
            active={activeRoute === "Interview Profiles"} 
            onClick={() => setActiveRoute && setActiveRoute("Interview Profiles")} 
          />
        </div>

        {/* PREPARE */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Prepare</span>
          <NavItem label="Knowledge Base" icon="📚" />
          <NavItem label="Interview Reports" icon="📈" />
          <NavItem label="Playground" icon="✨" />
        </div>

        {/* RESOURCES */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Resources</span>
          <NavItem label="Desktop App" badge="New" icon="💻" />
          <NavItem label="AI Tools" icon="🛠️" />
          <NavItem label="Help Center" badge="Updated" icon="❓" />
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, active, badge, icon, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
        active 
          ? 'bg-purple-100 text-purple-700 font-semibold shadow-sm ring-1 ring-purple-200' 
          : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 font-medium'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg opacity-90">{icon}</span>
        <span className="text-[13px]">{label}</span>
      </div>
      {badge && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
          active ? 'bg-purple-200 text-purple-800' : 'bg-slate-200 text-slate-600'
        }`}>{badge}</span>
      )}
    </div>
  );
}
