"use client";
import React from 'react';

export default function CreateProfileModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[10010] flex items-center justify-center bg-slate-800/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Create an interview profile</h2>
            <p className="text-slate-500 text-sm mt-1">
              Tell us a bit about yourself and the interview so we can help you better. <span className="underline cursor-pointer hover:text-purple-600">Or create an interview profile with AI.</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[65vh] custom-scrollbar">
          
          <div className="flex items-end gap-2 mb-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Resume *</label>
              <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition cursor-pointer font-medium">
                <option>AVULA_UDAY_RAJU_Updated (1)...</option>
              </select>
            </div>
            <button className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 text-sm">
              ↑ Upload
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-slate-200"></div>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest">INTERVIEW CONTEXT</span>
            <div className="h-[1px] flex-1 bg-slate-200"></div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
              <input 
                type="text" 
                placeholder="Enter the company name" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company Description *</label>
              <textarea 
                placeholder="Enter company information, including mission, cultural values, industry, and any other relevant details." 
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Position *</label>
              <input 
                type="text" 
                placeholder="Enter the job title" 
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Description *</label>
              <textarea 
                placeholder="Enter job information, including qualifications, responsibilities, preferred skills, and any other relevant information." 
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition resize-none"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5">
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}
