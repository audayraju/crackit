"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

export default function CopilotLaunchpad({ onBack, onCreateNewProfile, onLaunch }) {
  const [step, setStep] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from('interview_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setProfiles(data);
      }
      setLoading(false);
    }
    fetchProfiles();
  }, []);

  const domains = [
    { id: 'general', name: 'General Interview', desc: 'Behavioral, Conceptual...', icon: '🧠' },
    { id: 'coding', name: 'Coding Interview', desc: 'Real-Time Interview Copilot...', icon: '💻' },
    { id: 'assessment', name: 'Online Assessment', desc: 'Crack Online Tests...', icon: '📝' },
    { id: 'phone', name: 'Phone Interview', desc: 'Copilot for Calls...', icon: '📞' },
    { id: 'meeting', name: 'Professional Meeting', desc: 'AI Copilot and Notes...', icon: '🤝' },
    { id: 'swe', name: 'Software Engineering', desc: 'Algorithms, Design...', icon: '⚙️' },
  ];

  return (
    <div className="flex-1 p-8 bg-slate-50 min-h-screen text-slate-800 flex" style={{ paddingTop: '60px' }}>
      
      {/* Container */}
      <div className="flex-1 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex overflow-hidden max-w-6xl mx-auto h-[600px]">
        
        {/* Left Sidebar Stepper */}
        <div className="w-80 bg-slate-50 border-r border-slate-200 p-8 flex flex-col justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <button onClick={onBack} className="text-slate-400 hover:text-slate-700 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm">
                 ← 
              </button>
              <h2 className="text-xl font-bold">Copilot Launchpad</h2>
            </div>
            
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Steps</span>
              <span>{step} of 3</span>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-200 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <div className="flex flex-col gap-4 relative">
               <StepItem 
                 number={1} 
                 title="Select Interview Profile" 
                 desc={selectedProfile ? `${selectedProfile.company_name} - ${selectedProfile.position_title}` : "Who are you interviewing with?"} 
                 active={step === 1}
                 completed={step > 1}
                 onClick={() => setStep(1)}
               />
               <StepItem 
                 number={2} 
                 title="Select Interview Domain" 
                 desc={selectedDomain ? domains.find(d=>d.id===selectedDomain)?.name : "What type of interview is it?"} 
                 active={step === 2}
                 completed={step > 2}
                 onClick={() => step > 1 && setStep(2)}
               />
               <StepItem 
                 number={3} 
                 title="Confirm Launch Settings" 
                 desc="Review your setup" 
                 active={step === 3}
                 completed={step > 3}
                 onClick={() => step > 2 && setStep(3)}
               />
            </div>
          </div>

          <button 
            disabled={step < 3}
            onClick={onLaunch}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition ${step === 3 ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md transform hover:-translate-y-1' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            🚀 Launch
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-8 overflow-y-auto relative">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="text-center mb-8 flex justify-center items-center">
                 <span className="bg-slate-100 text-slate-600 text-sm font-semibold px-4 py-1.5 rounded-full border border-slate-200">
                   Choose from pre-configured interview profiles
                 </span>
               </div>
               
               {loading ? (
                 <div className="flex justify-center items-center h-56 w-full text-slate-400">Loading your profiles...</div>
               ) : (
                 <div className="flex gap-4 justify-center mb-8 flex-wrap">
                   {profiles.map(p => (
                     <div 
                       key={p.id}
                       onClick={() => { setSelectedProfile(p); setStep(2); }}
                       className={`w-40 h-56 rounded-3xl border-2 p-4 flex flex-col items-center justify-between cursor-pointer transition-all hover:-translate-y-2 group ${
                         selectedProfile?.id === p.id 
                           ? 'border-purple-600 bg-purple-50 shadow-md ring-4 ring-purple-100' 
                           : 'border-slate-200 bg-white hover:border-purple-300 shadow-sm'
                       }`}
                     >
                       <div className="text-center mt-2">
                         <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={p.company_name}>{p.company_name}</h3>
                         <div className="text-4xl my-4 group-hover:scale-110 transition">🏢</div>
                         <p className="text-xs text-slate-500 font-medium line-clamp-2" title={p.position_title}>{p.position_title}</p>
                       </div>
                       <div className="w-full text-center text-[10px] uppercase font-bold text-green-600 bg-green-100 rounded-full py-1">
                         ✓ Saved
                       </div>
                     </div>
                   ))}
                 </div>
               )}

               <div className="text-center mb-6">
                 <span className="text-slate-400 text-sm font-medium">Or use your own for personalized experience</span>
               </div>

               <div className="flex justify-center">
                 <div 
                   onClick={onCreateNewProfile}
                   className="w-40 h-56 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-100 hover:border-purple-400 group"
                 >
                   <div className="text-center">
                     <h3 className="font-bold text-lg text-slate-800">New Profile</h3>
                     <div className="w-16 h-16 rounded-full border-2 border-slate-300 flex items-center justify-center text-4xl text-slate-400 mx-auto my-4 group-hover:bg-purple-100 group-hover:text-purple-600 group-hover:border-purple-300 transition">+</div>
                     <p className="text-xs text-slate-500 font-medium leading-tight px-2">Create your own profile</p>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mt-4">
                 {domains.map(d => (
                   <div 
                     key={d.id}
                     onClick={() => { setSelectedDomain(d.id); setStep(3); }}
                     className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${
                       selectedDomain === d.id 
                         ? 'border-purple-600 bg-purple-50 shadow-md' 
                         : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow-sm'
                     }`}
                   >
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                       selectedDomain === d.id ? 'bg-purple-200' : 'bg-slate-100'
                     }`}>
                       {d.icon}
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-800 text-base">{d.name}</h4>
                       <p className="text-xs text-slate-500 leading-tight mt-1">{d.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center justify-center h-full">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm ring-4 ring-green-50">
                 ✓
               </div>
               <h3 className="text-2xl font-bold text-slate-800 mb-2">Ready to Launch</h3>
               <p className="text-slate-500 text-center max-w-sm mb-8">
                 You have selected <span className="font-bold text-slate-700">{selectedProfile?.company_name}</span> for a <span className="font-bold text-slate-700">{domains.find(d=>d.id===selectedDomain)?.name}</span>. Click Launch to start the copilot.
               </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

function StepItem({ number, title, desc, active, completed, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-start gap-3 p-3 rounded-xl border-2 transition ${
        active ? 'border-purple-200 bg-white shadow-sm' : 
        completed ? 'border-transparent cursor-pointer hover:bg-slate-200/50' : 'border-transparent opacity-50 cursor-not-allowed'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold border-2 ${
        completed ? 'bg-purple-600 border-purple-600 text-white' : 
        active ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-slate-300 text-slate-400 bg-transparent'
      }`}>
        {completed ? '✓' : number}
      </div>
      <div>
        <h4 className={`font-bold text-sm ${active || completed ? 'text-slate-800' : 'text-slate-500'}`}>{title}</h4>
        <p className="text-xs text-slate-500 truncate w-40">{desc}</p>
      </div>
    </div>
  );
}
